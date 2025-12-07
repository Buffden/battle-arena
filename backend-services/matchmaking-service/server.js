const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { initializeRedis } = require('./src/config/redis.config');
const queueManager = require('./src/services/QueueManager');
const matchmakingEngine = require('./src/services/MatchmakingEngine');
const matchAcceptanceManager = require('./src/services/MatchAcceptanceManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  path: '/ws/matchmaking'
});

const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'matchmaking-service', port: PORT });
});

app.get('/', (req, res) => {
  res.json({
    service: 'matchmaking-service',
    port: PORT,
    status: 'running',
    message: 'Matchmaking service is running'
  });
});

// Store pending disconnections with timers
const pendingDisconnections = new Map();

// Grace period for reconnection (10 seconds)
const RECONNECTION_GRACE_PERIOD_MS = 10000;

// WebSocket connection handling
io.on('connection', socket => {
  // eslint-disable-next-line no-console
  console.log('Client connected:', socket.id);

  // Handle join queue
  socket.on('join-queue', async data => {
    // eslint-disable-next-line no-console
    console.log('Join queue request:', data);

    try {
      const userId = data?.userId || null;
      const metadata = {
        heroIds: data?.heroIds || []
      };

      const queueStatus = await queueManager.addToQueue(socket.id, userId, metadata);

      // eslint-disable-next-line no-console
      console.log(`Player ${socket.id} joined queue at position ${queueStatus.position}`);

      socket.emit('queue-status', queueStatus);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error joining queue:', error);
      socket.emit('queue-error', {
        message: 'Failed to join queue',
        error: error.message
      });
    }
  });

  // Handle leave queue
  socket.on('leave-queue', async () => {
    // eslint-disable-next-line no-console
    console.log('Leave queue request from:', socket.id);

    try {
      await queueManager.removeFromQueue(socket.id);
      // eslint-disable-next-line no-console
      console.log(`Player ${socket.id} left queue`);
      socket.emit('queue-left', { success: true });

      // Notify all remaining players of their updated positions
      await notifyAllPlayersQueueStatus();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error leaving queue:', error);
      socket.emit('queue-error', {
        message: 'Failed to leave queue',
        error: error.message
      });
    }
  });

  // Handle reconnect
  socket.on('reconnect-queue', async data => {
    // eslint-disable-next-line no-console
    console.log('Reconnect queue request:', data);

    try {
      const userId = data?.userId || null;

      // Cancel any pending disconnection for this user
      if (userId) {
        const pendingKey = userId;
        if (pendingDisconnections.has(pendingKey)) {
          clearTimeout(pendingDisconnections.get(pendingKey).timer);
          pendingDisconnections.delete(pendingKey);
          // eslint-disable-next-line no-console
          console.log(`Cancelled pending disconnection for user ${userId}`);
        }
      }

      const queueStatus = await queueManager.reconnectToQueue(socket.id, userId);

      if (queueStatus) {
        // eslint-disable-next-line no-console
        console.log(`Player ${socket.id} reconnected to queue at position ${queueStatus.position}`);
        socket.emit('queue-status', queueStatus);
      } else {
        // Not in queue, need to join first
        socket.emit('queue-error', {
          message: 'Not in queue. Please join queue first.'
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error reconnecting to queue:', error);
      socket.emit('queue-error', {
        message: 'Failed to reconnect to queue',
        error: error.message
      });
    }
  });

  // Handle match acceptance
  socket.on('accept-match', async data => {
    // eslint-disable-next-line no-console
    console.log('Accept match request:', data);

    try {
      const { matchId } = data;
      const userId = data?.userId || null;

      if (!matchId || !userId) {
        socket.emit('match-acceptance-error', {
          message: 'Missing matchId or userId'
        });
        return;
      }

      const result = await matchAcceptanceManager.acceptMatch(matchId, userId);

      if (!result.success) {
        if (result.expired) {
          socket.emit('match-acceptance-expired', {
            matchId,
            message: 'Match acceptance expired'
          });
        } else {
          socket.emit('match-acceptance-error', {
            message: 'Failed to accept match'
          });
        }
        return;
      }

      // Get updated acceptance data
      const acceptanceData = result.data;

      // Notify both players of updated acceptance status
      const socket1 = io.sockets.sockets.get(acceptanceData.player1SocketId);
      const socket2 = io.sockets.sockets.get(acceptanceData.player2SocketId);

      const statusUpdate = {
        matchId,
        player1Id: acceptanceData.player1Id,
        player2Id: acceptanceData.player2Id,
        player1Accepted: acceptanceData.player1Accepted,
        player2Accepted: acceptanceData.player2Accepted,
        player1Rejected: acceptanceData.player1Rejected,
        player2Rejected: acceptanceData.player2Rejected,
        bothAccepted: result.bothAccepted
      };

      if (socket1) {
        socket1.emit('match-acceptance-update', statusUpdate);
      }
      if (socket2) {
        socket2.emit('match-acceptance-update', statusUpdate);
      }

      // eslint-disable-next-line no-console
      console.log(
        `✓ Player ${userId} accepted match ${matchId}. Both accepted: ${result.bothAccepted}`
      );

      // If both players accepted, remove them from queue and notify them
      if (result.bothAccepted) {
        try {
          await queueManager.removeFromQueueByUserId(acceptanceData.player1Id);
          await queueManager.removeFromQueueByUserId(acceptanceData.player2Id);
          await matchAcceptanceManager.deleteMatchAcceptance(matchId);

          // Notify both players that match is confirmed
          const matchConfirmedData = {
            matchId,
            gameRoomId: acceptanceData.gameRoomId || matchId,
            player1Id: acceptanceData.player1Id,
            player2Id: acceptanceData.player2Id,
            message: 'Match confirmed! Starting game...'
          };

          if (socket1) {
            socket1.emit('match-confirmed', {
              ...matchConfirmedData,
              opponentId: acceptanceData.player2Id,
              yourId: acceptanceData.player1Id
            });
          }
          if (socket2) {
            socket2.emit('match-confirmed', {
              ...matchConfirmedData,
              opponentId: acceptanceData.player1Id,
              yourId: acceptanceData.player2Id
            });
          }

          // eslint-disable-next-line no-console
          console.log(`✓ Match ${matchId} confirmed - both players accepted`);
          // eslint-disable-next-line no-console
          console.log('✓ Removed both players from queue');
        } catch (removeError) {
          // eslint-disable-next-line no-console
          console.error('Error removing players from queue after acceptance:', removeError);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error accepting match:', error);
      socket.emit('match-acceptance-error', {
        message: 'Failed to accept match',
        error: error.message
      });
    }
  });

  // Handle match rejection
  socket.on('reject-match', async data => {
    // eslint-disable-next-line no-console
    console.log('Reject match request:', data);

    try {
      const { matchId } = data;
      const userId = data?.userId || null;

      if (!matchId || !userId) {
        socket.emit('match-acceptance-error', {
          message: 'Missing matchId or userId'
        });
        return;
      }

      const result = await matchAcceptanceManager.rejectMatch(matchId, userId);

      if (!result.success) {
        socket.emit('match-acceptance-error', {
          message: 'Failed to reject match'
        });
        return;
      }

      const acceptanceData = result.data;

      // Get socket IDs for both players
      const socket1 = io.sockets.sockets.get(acceptanceData.player1SocketId);
      const socket2 = io.sockets.sockets.get(acceptanceData.player2SocketId);

      // Notify both players that match was rejected
      const rejectionUpdate = {
        matchId,
        rejectedBy: userId,
        player1Id: acceptanceData.player1Id,
        player2Id: acceptanceData.player2Id,
        player1Rejected: acceptanceData.player1Rejected,
        player2Rejected: acceptanceData.player2Rejected
      };

      if (socket1) {
        socket1.emit('match-rejected', rejectionUpdate);
      }
      if (socket2) {
        socket2.emit('match-rejected', rejectionUpdate);
      }

      // Move rejecting player to end of queue
      try {
        await queueManager.removeFromQueueByUserId(userId);
        // Re-add to queue (will be at the end)
        const socketId =
          userId === acceptanceData.player1Id
            ? acceptanceData.player1SocketId
            : acceptanceData.player2SocketId;

        // Get metadata if available
        const metadata = {}; // Could retrieve from Redis if needed
        await queueManager.addToQueue(socketId, userId, metadata);

        // eslint-disable-next-line no-console
        console.log(`✓ Moved rejecting player ${userId} to end of queue`);
      } catch (queueError) {
        // eslint-disable-next-line no-console
        console.error('Error moving rejecting player to end of queue:', queueError);
      }

      // Accepting player stays in queue (no action needed)
      // Clean up acceptance session
      await matchAcceptanceManager.deleteMatchAcceptance(matchId);

      // Notify all players of updated queue positions
      await notifyAllPlayersQueueStatus();

      // eslint-disable-next-line no-console
      console.log(`✓ Match ${matchId} rejected by player ${userId}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error rejecting match:', error);
      socket.emit('match-acceptance-error', {
        message: 'Failed to reject match',
        error: error.message
      });
    }
  });

  socket.on('disconnect', async reason => {
    // eslint-disable-next-line no-console
    console.log('Client disconnected:', socket.id, 'Reason:', reason);

    try {
      // Don't remove on server-initiated disconnect
      if (reason === 'io server disconnect') {
        return;
      }

      // Get userId from socket metadata to track by user, not just socket
      const userId = await queueManager.getUserIdFromSocket(socket.id);

      // If we have a userId, use grace period for reconnection
      if (userId) {
        // eslint-disable-next-line no-console
        console.log(
          `Scheduling delayed removal for user ${userId} (grace period: ${RECONNECTION_GRACE_PERIOD_MS}ms)`
        );

        const timer = setTimeout(async () => {
          // Check if user reconnected (removed from pendingDisconnections)
          if (pendingDisconnections.has(userId)) {
            await queueManager.removeFromQueueByUserId(userId);
            pendingDisconnections.delete(userId);
            // eslint-disable-next-line no-console
            console.log(`User ${userId} removed from queue after grace period expired`);

            // Notify all remaining players of their updated positions
            await notifyAllPlayersQueueStatus();
          }
        }, RECONNECTION_GRACE_PERIOD_MS);

        pendingDisconnections.set(userId, {
          socketId: socket.id,
          timer,
          disconnectedAt: Date.now()
        });
      } else {
        // No userId, remove immediately (fallback for old connections)
        await queueManager.removeFromQueue(socket.id);
        // eslint-disable-next-line no-console
        console.log(`Player ${socket.id} removed from queue due to disconnect (no userId)`);

        // Notify all remaining players of their updated positions
        await notifyAllPlayersQueueStatus();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error handling disconnect:', error);
    }
  });
});

// Queue timeout configuration (1 minute = 60000ms)
const QUEUE_TIMEOUT_MS = 60000;
const TIMEOUT_CHECK_INTERVAL_MS = 10000; // Check every 10 seconds

/**
 * Notify all remaining players in queue about their updated positions
 */
async function notifyAllPlayersQueueStatus() {
  try {
    const allStatuses = await queueManager.getAllPlayersQueueStatus();

    let notifiedCount = 0;
    for (const { socketId, position, estimatedWaitTime } of allStatuses) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('queue-status', {
          position,
          estimatedWaitTime
        });
        notifiedCount++;
        // eslint-disable-next-line no-console
        console.log(
          `Notified player ${socketId} of updated position: ${position}, wait time: ${estimatedWaitTime}s`
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Socket ${socketId} not found - player may have disconnected`);
      }
    }

    if (allStatuses.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        `Notified ${notifiedCount} of ${allStatuses.length} player(s) of updated queue positions`
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error notifying players of queue status:', error);
  }
}

/**
 * Check for matches and create them if two or more players are in queue
 * Step 3: Match finding with Game Engine communication and player notification
 */
async function checkForMatches() {
  try {
    const match = await matchmakingEngine.findMatch();

    if (match) {
      // eslint-disable-next-line no-console
      console.log('=== MATCH FOUND ===');
      // eslint-disable-next-line no-console
      console.log('Match details:', {
        matchId: match.matchId,
        gameRoomId: match.gameRoomId || 'not created',
        player1: {
          userId: match.players[0].userId,
          socketId: match.players[0].socketId,
          heroId: match.players[0].heroId
        },
        player2: {
          userId: match.players[1].userId,
          socketId: match.players[1].socketId,
          heroId: match.players[1].heroId
        }
      });

      // Step 3: Create match acceptance session
      await matchAcceptanceManager.createMatchAcceptance(
        match.matchId,
        match.players[0].userId,
        match.players[1].userId,
        match.players[0].socketId,
        match.players[1].socketId,
        match.gameRoomId // Pass gameRoomId to acceptance manager
      );

      // Step 4: Notify both players simultaneously via Socket.io (they need to accept)
      const timestamp = Date.now();
      const matchFoundDataBase = {
        matchId: match.matchId,
        gameRoomId: match.gameRoomId || match.matchId,
        timestamp,
        timeout: 20000 // 20 seconds
      };

      // Get both sockets first
      const socket1 = io.sockets.sockets.get(match.players[0].socketId);
      const socket2 = io.sockets.sockets.get(match.players[1].socketId);

      // Prepare match data for each player (with their opponent's info)
      const player1MatchData = {
        ...matchFoundDataBase,
        opponent: {
          userId: match.players[1].userId,
          heroId: match.players[1].heroId
        }
      };

      const player2MatchData = {
        ...matchFoundDataBase,
        opponent: {
          userId: match.players[0].userId,
          heroId: match.players[0].heroId
        }
      };

      // Send to both players simultaneously (socket.emit is non-blocking)
      let notifiedCount = 0;
      if (socket1) {
        socket1.emit('match-found', player1MatchData);
        notifiedCount++;
        // eslint-disable-next-line no-console
        console.log(
          `✓ Notified player 1 (${match.players[0].userId}) via socket ${match.players[0].socketId}`
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `✗ Player 1 socket ${match.players[0].socketId} not found - player may have disconnected`
        );
      }

      if (socket2) {
        socket2.emit('match-found', player2MatchData);
        notifiedCount++;
        // eslint-disable-next-line no-console
        console.log(
          `✓ Notified player 2 (${match.players[1].userId}) via socket ${match.players[1].socketId}`
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `✗ Player 2 socket ${match.players[1].socketId} not found - player may have disconnected`
        );
      }

      // Players remain in queue until both accept
      if (notifiedCount === 2) {
        // eslint-disable-next-line no-console
        console.log(
          `✓ Match acceptance session created - both players notified simultaneously at ${timestamp}`
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `⚠ Only ${notifiedCount} of 2 players notified - cleaning up acceptance session`
        );
        await matchAcceptanceManager.deleteMatchAcceptance(match.matchId);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking for matches:', error);
  }
}

/**
 * Check for timed-out players and remove them from queue
 */
async function checkQueueTimeouts() {
  try {
    const removedPlayers = await queueManager.removeTimedOutPlayers(QUEUE_TIMEOUT_MS);

    if (removedPlayers.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`Removed ${removedPlayers.length} timed-out player(s) from queue`);

      // Notify each removed player
      for (const { socketId } of removedPlayers) {
        if (socketId) {
          const socket = io.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit('queue-timeout', {
              message: 'Queue session timed out after 1 minute. Please try again.',
              reason: 'timeout'
            });
            // eslint-disable-next-line no-console
            console.log(`Notified player ${socketId} of queue timeout`);
          }
        }
      }

      // Notify all remaining players of their updated positions
      await notifyAllPlayersQueueStatus();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking queue timeouts:', error);
  }
}

/**
 * Check for expired match acceptances and handle them as rejections
 */
async function checkExpiredMatchAcceptances() {
  try {
    const expiredMatches = await matchAcceptanceManager.cleanupExpiredAcceptances();

    for (const matchId of expiredMatches) {
      // eslint-disable-next-line no-console
      console.log(`Match acceptance expired for match ${matchId} - treating as rejection`);

      // Get the acceptance data before it was deleted (if still available)
      // We'll need to get player info from the match data
      // For now, just log - the acceptance data is already cleaned up
      // In a real scenario, we might want to store match data separately

      // Notify all players in queue of updated positions
      await notifyAllPlayersQueueStatus();
    }

    if (expiredMatches.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`Cleaned up ${expiredMatches.length} expired match acceptance(s)`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking expired match acceptances:', error);
  }
}

// Initialize Redis and start server
// Note: Using IIFE since top-level await is not available in CommonJS
(async () => {
  try {
    // Initialize Redis connection
    await initializeRedis();
    // eslint-disable-next-line no-console
    console.log('Redis initialized successfully');

    // Start HTTP server
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Matchmaking service running on port ${PORT}`);
      // eslint-disable-next-line no-console
      console.log('WebSocket server listening on /ws/matchmaking');
      // eslint-disable-next-line no-console
      console.log(`Queue timeout: ${QUEUE_TIMEOUT_MS / 1000} seconds`);
    });

    // Start periodic queue timeout checking
    setInterval(checkQueueTimeouts, TIMEOUT_CHECK_INTERVAL_MS);
    // eslint-disable-next-line no-console
    console.log(
      `Queue timeout checker started (checking every ${TIMEOUT_CHECK_INTERVAL_MS / 1000} seconds)`
    );

    // Start periodic match checking
    const MATCHING_CHECK_INTERVAL_MS = 3000; // Check every 3 seconds
    setInterval(checkForMatches, MATCHING_CHECK_INTERVAL_MS);
    // eslint-disable-next-line no-console
    console.log(
      `Match checking started (checking every ${MATCHING_CHECK_INTERVAL_MS / 1000} seconds)`
    );

    // Start periodic match acceptance expiration checking
    const ACCEPTANCE_CHECK_INTERVAL_MS = 2000; // Check every 2 seconds
    setInterval(checkExpiredMatchAcceptances, ACCEPTANCE_CHECK_INTERVAL_MS);
    // eslint-disable-next-line no-console
    console.log(
      `Match acceptance expiration checker started (checking every ${ACCEPTANCE_CHECK_INTERVAL_MS / 1000} seconds)`
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
