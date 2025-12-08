const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { initializeRedis } = require('./src/config/redis.config');
const matchmakingConfig = require('./src/config/matchmaking.config');
const queueManager = require('./src/services/QueueManager');
const matchmakingEngine = require('./src/services/MatchmakingEngine');
const matchAcceptanceManager = require('./src/services/MatchAcceptanceManager');

const app = express();
const server = http.createServer(app);

const PORT = matchmakingConfig.server.port;

// CORS configuration - restrict to allowed origins for security
// In production, set ALLOWED_ORIGINS environment variable with comma-separated origins
// Note: Frontend is served through nginx on port 80, not directly on service ports
const allowedOriginsArray = matchmakingConfig.server.allowedOrigins;
const allowedOrigins = new Set(allowedOriginsArray);

// Socket.io CORS configuration - use same allowed origins as Express
// Socket.io expects array, so convert Set back to array
const io = new Server(server, {
  cors: {
    origin: allowedOriginsArray,
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: matchmakingConfig.server.socketPath
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.) in development
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
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

      // Check if user has a stale timeout count (shouldn't happen, but safety check)
      if (userId) {
        const existingTimeoutCount = await matchAcceptanceManager.getTimeoutCount(userId);
        if (existingTimeoutCount > 0) {
          // eslint-disable-next-line no-console
          console.log(
            `⚠️ User ${userId} joining queue with existing timeout count: ${existingTimeoutCount} - this should have been reset`
          );
          // Don't reset here - let it persist so they get penalized if they timeout again
          // But log it for debugging
        }

        // Clean up any stale match acceptance sessions for this user
        // This ensures they can be matched immediately after retry
        const staleMatchAcceptances =
          await matchAcceptanceManager.deleteMatchAcceptancesByUserId(userId);
        if (staleMatchAcceptances.length > 0) {
          // eslint-disable-next-line no-console
          console.log(
            `🧹 Cleaned up ${staleMatchAcceptances.length} stale match acceptance session(s) for user ${userId}:`,
            staleMatchAcceptances
          );
        }
      }

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
    console.log('=== ACCEPT MATCH REQUEST ===');
    // eslint-disable-next-line no-console
    console.log('Socket ID:', socket.id);
    // eslint-disable-next-line no-console
    console.log('Request data:', JSON.stringify(data, null, 2));

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

      // Reset timeout count on successful accept
      await matchAcceptanceManager.resetTimeoutCount(userId);

      // Notify both players of updated acceptance status
      sendAcceptanceStatusUpdate(io, acceptanceData, matchId, result.bothAccepted);

      // If both players accepted, handle match confirmation
      if (result.bothAccepted) {
        try {
          await handleMatchConfirmation(io, acceptanceData, matchId);
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

      // Reset timeout count on successful reject
      await matchAcceptanceManager.resetTimeoutCount(userId);

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

      // Accepting player stays in queue (no action needed - they keep their position)
      const acceptingUserId =
        userId === acceptanceData.player1Id ? acceptanceData.player2Id : acceptanceData.player1Id;

      // CRITICAL: Clean up the old match acceptance session (drop the old match ID)
      // Do this BEFORE notifying players to ensure it's deleted immediately
      await matchAcceptanceManager.deleteMatchAcceptance(matchId);
      // eslint-disable-next-line no-console
      console.log(`✓ Deleted old match acceptance session for match ${matchId}`);

      // Verify the accepting player is no longer in a match acceptance session
      const acceptingPlayerStillInMatch =
        await matchAcceptanceManager.getMatchAcceptanceByUserId(acceptingUserId);
      if (acceptingPlayerStillInMatch) {
        // eslint-disable-next-line no-console
        console.warn(
          `⚠️ WARNING: Accepting player ${acceptingUserId} still appears to be in match ${acceptingPlayerStillInMatch.matchId} after deletion - this should not happen`
        );
      } else {
        // eslint-disable-next-line no-console
        console.log(
          `✓ Verified: Accepting player ${acceptingUserId} is no longer in any match acceptance session and is available for matching`
        );
      }

      // Notify all players of updated queue positions
      await notifyAllPlayersQueueStatus();

      // eslint-disable-next-line no-console
      console.log(
        `✓ Match ${matchId} rejected by player ${userId}. Accepting player ${acceptingUserId} stays in queue and will get a new match on next check.`
      );

      // Trigger an immediate match check for the accepting player
      // This ensures they get matched quickly if another player is available
      // Note: This is a fire-and-forget call, don't await it
      setImmediate(async () => {
        try {
          // eslint-disable-next-line no-console
          console.log(
            `🔄 Triggering immediate match check for accepting player ${acceptingUserId}`
          );
          await checkForMatches();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error in immediate match check after rejection:', error);
        }
      });
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
          `Scheduling delayed removal for user ${userId} (grace period: ${matchmakingConfig.queue.reconnectionGracePeriodMs}ms)`
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
        }, matchmakingConfig.queue.reconnectionGracePeriodMs);

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

// Queue timeout configuration loaded from config

/**
 * Send acceptance status update to both players
 * @param {Object} io - Socket.io server instance
 * @param {Object} acceptanceData - Match acceptance data
 * @param {string} matchId - Match ID
 * @param {boolean} bothAccepted - Whether both players accepted
 */
function sendAcceptanceStatusUpdate(io, acceptanceData, matchId, bothAccepted) {
  const socket1 = io.sockets.sockets.get(acceptanceData.player1SocketId);
  const socket2 = io.sockets.sockets.get(acceptanceData.player2SocketId);

  const statusUpdate = {
    matchId,
    player1Id: acceptanceData.player1Id,
    player2Id: acceptanceData.player2Id,
    player1Accepted: acceptanceData.player1Accepted,
    player2Accepted: acceptanceData.player2Accepted,
    player1Rejected: acceptanceData.player1Rejected || false,
    player2Rejected: acceptanceData.player2Rejected || false,
    bothAccepted
  };

  if (socket1) {
    socket1.emit('match-acceptance-update', statusUpdate);
  }
  if (socket2) {
    socket2.emit('match-acceptance-update', statusUpdate);
  }
}

/**
 * Handle match confirmation when both players accept
 * @param {Object} io - Socket.io server instance
 * @param {Object} acceptanceData - Match acceptance data
 * @param {string} matchId - Match ID
 */
async function handleMatchConfirmation(io, acceptanceData, matchId) {
  const socket1 = io.sockets.sockets.get(acceptanceData.player1SocketId);
  const socket2 = io.sockets.sockets.get(acceptanceData.player2SocketId);

  await queueManager.removeFromQueueByUserId(acceptanceData.player1Id);
  await queueManager.removeFromQueueByUserId(acceptanceData.player2Id);
  await matchAcceptanceManager.deleteMatchAcceptance(matchId);

  const matchConfirmedData = {
    matchId,
    gameRoomId: acceptanceData.gameRoomId || matchId,
    player1Id: acceptanceData.player1Id,
    player2Id: acceptanceData.player2Id,
    message: matchmakingConfig.messages.matchConfirmed
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
}

/**
 * Process timeout for a single player
 * @param {Object} io - Socket.io server instance
 * @param {Object} player - Player data with userId and socketId
 * @param {string} matchId - Match ID
 */
async function processPlayerTimeout(io, player, matchId) {
  const timeoutCount = await matchAcceptanceManager.incrementTimeoutCount(player.userId);

  if (timeoutCount >= matchmakingConfig.timeoutCount.disconnectionThreshold) {
    await handlePlayerDisconnection(io, player, timeoutCount);
  } else {
    await handlePlayerMoveToEndOfQueue(io, player, matchId, timeoutCount);
  }
}

/**
 * Handle player disconnection due to multiple timeouts
 * @param {Object} io - Socket.io server instance
 * @param {Object} player - Player data
 * @param {number} timeoutCount - Current timeout count
 */
async function handlePlayerDisconnection(io, player, timeoutCount) {
  await queueManager.removeFromQueueByUserId(player.userId);
  const socket = io.sockets.sockets.get(player.socketId);
  if (socket) {
    socket.emit('queue-disconnected', {
      message: matchmakingConfig.messages.queueDisconnected,
      reason: 'multiple-timeouts',
      timeoutCount
    });
    socket.disconnect(true);
  }
}

/**
 * Handle moving player to end of queue after timeout
 * @param {Object} io - Socket.io server instance
 * @param {Object} player - Player data
 * @param {string} matchId - Match ID
 * @param {number} timeoutCount - Current timeout count
 */
async function handlePlayerMoveToEndOfQueue(io, player, matchId, timeoutCount) {
  await queueManager.removeFromQueueByUserId(player.userId);
  const socket = io.sockets.sockets.get(player.socketId);
  if (socket) {
    const metadata = {};
    await queueManager.addToQueue(player.socketId, player.userId, metadata);
    socket.emit('match-acceptance-expired', {
      matchId,
      message:
        timeoutCount === 1
          ? matchmakingConfig.messages.matchAcceptanceExpiredFirst
          : matchmakingConfig.messages.matchAcceptanceExpiredSecond,
      timeoutCount
    });
  }
}

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
    // eslint-disable-next-line no-console
    // console.log('[checkForMatches] Checking for matches...');
    const match = await matchmakingEngine.findMatch();

    if (match) {
      // Note: Players are already filtered in findMatch() to exclude those in match acceptance sessions
      // So we don't need to check again here - the match is guaranteed to have available players

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
        timeout: matchmakingConfig.matchAcceptance.timeoutMs
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
          '✓ Match acceptance session created - both players notified simultaneously at ' +
            timestamp
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
    const removedPlayers = await queueManager.removeTimedOutPlayers(
      matchmakingConfig.queue.timeoutMs
    );

    if (removedPlayers.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`Removed ${removedPlayers.length} timed-out player(s) from queue`);

      // Notify each removed player
      for (const { socketId } of removedPlayers) {
        if (socketId) {
          const socket = io.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit('queue-timeout', {
              message: matchmakingConfig.messages.queueTimeout,
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

    for (const expiredMatch of expiredMatches) {
      const { matchId, player1Id, player2Id, player1SocketId, player2SocketId } = expiredMatch;

      // Log without exposing match ID for security
      // eslint-disable-next-line no-console
      console.log('Match acceptance expired - checking timeout counts for both players');

      // Process each player separately
      const players = [
        { userId: player1Id, socketId: player1SocketId },
        { userId: player2Id, socketId: player2SocketId }
      ];

      for (const player of players) {
        try {
          await processPlayerTimeout(io, player, matchId);
        } catch (playerError) {
          // eslint-disable-next-line no-console
          console.error(
            'Error processing expired match for player:',
            playerError.message || playerError
          );
        }
      }

      // Notify all players of updated queue positions
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
// Note: Using IIFE since top-level await is not available in CommonJS (Node.js < 14.8 or CommonJS modules)
// This pattern is necessary for async initialization in CommonJS context
(async () => {
  try {
    // Initialize Redis connection
    await initializeRedis();
    // eslint-disable-next-line no-console
    console.log('Redis initialized successfully');

    // Set MatchAcceptanceManager in MatchmakingEngine to enable filtering
    matchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);

    // Start HTTP server
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Matchmaking service running on port ${PORT}`);
      // eslint-disable-next-line no-console
      console.log('WebSocket server listening on /ws/matchmaking');
      // eslint-disable-next-line no-console
      console.log(`Queue timeout: ${matchmakingConfig.queue.timeoutMs / 1000} seconds`);
    });

    // Start periodic queue timeout checking
    setInterval(checkQueueTimeouts, matchmakingConfig.queue.timeoutCheckIntervalMs);
    // eslint-disable-next-line no-console
    console.log(
      `Queue timeout checker started (checking every ${matchmakingConfig.queue.timeoutCheckIntervalMs / 1000} seconds)`
    );

    // Start periodic match checking
    setInterval(checkForMatches, matchmakingConfig.matchmaking.checkIntervalMs);
    // eslint-disable-next-line no-console
    console.log(
      `Match checking started (checking every ${matchmakingConfig.matchmaking.checkIntervalMs / 1000} seconds)`
    );

    // Start periodic match acceptance expiration checking
    setInterval(
      checkExpiredMatchAcceptances,
      matchmakingConfig.matchmaking.acceptanceCheckIntervalMs
    );
    // eslint-disable-next-line no-console
    console.log(
      `Match acceptance expiration checker started (checking every ${matchmakingConfig.matchmaking.acceptanceCheckIntervalMs / 1000} seconds)`
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
