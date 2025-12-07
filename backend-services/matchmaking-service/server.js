const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { initializeRedis } = require('./src/config/redis.config');
const queueManager = require('./src/services/QueueManager');

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

    for (const { socketId, position, estimatedWaitTime } of allStatuses) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('queue-status', {
          position,
          estimatedWaitTime
        });
      }
    }

    if (allStatuses.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`Notified ${allStatuses.length} player(s) of updated queue positions`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error notifying players of queue status:', error);
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
