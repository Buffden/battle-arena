/**
 * Matchmaking Controller
 * Handles WebSocket events for matchmaking operations
 * Facade Pattern - Provides simplified interface to matchmaking operations
 */

const logger = require('../utils/logger');

/**
 * MatchmakingController class
 * Manages WebSocket event handlers for matchmaking
 */
class MatchmakingController {
  /**
   * Initialize MatchmakingController
   * @param {import('socket.io').Server} io - Socket.io server instance
   * @param {Object} services - Service dependencies (to be injected)
   * @param {Object} queueManager - QueueManager instance
   */
  constructor(io, services = {}, queueManager = null) {
    this.io = io;
    this.services = services;
    this.queueManager = queueManager;
    this.connectedSockets = new Map(); // Map<userId, socketId>
  }

  /**
   * Initialize Socket.io event handlers
   */
  initialize() {
    this.io.on('connection', socket => {
      this.handleConnection(socket);
    });

    logger.info('MatchmakingController initialized');
  }

  /**
   * Handle new Socket.io connection
   * @param {import('socket.io').Socket} socket - Socket.io socket instance
   */
  async handleConnection(socket) {
    const userId = socket.userId;

    if (!userId) {
      logger.warn('Socket connected without userId', { socketId: socket.id });
      socket.disconnect();
      return;
    }

    // Store socket connection
    this.connectedSockets.set(userId, socket.id);

    logger.info('Socket connected', {
      socketId: socket.id,
      userId
    });

    // Check if player is already in queue and update socket ID
    await this.handleReconnection(socket, userId);

    // Register event handlers
    this.registerEventHandlers(socket);

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleDisconnection(socket, userId);
    });
  }

  /**
   * Register Socket.io event handlers
   * @param {import('socket.io').Socket} socket - Socket.io socket instance
   */
  registerEventHandlers(socket) {
    // Join queue event handler
    socket.on('join-queue', async _data => {
      await this.handleJoinQueue(socket, _data);
    });

    // Leave queue event handler
    socket.on('leave-queue', async _data => {
      await this.handleLeaveQueue(socket, _data);
    });

    logger.debug('Event handlers registered', { socketId: socket.id });
  }

  /**
   * Handle join-queue event
   * @param {import('socket.io').Socket} socket - Socket.io socket instance
   * @param {Object} _data - Event data (optional, playerId extracted from socket.user)
   */
  async handleJoinQueue(socket, _data) {
    const userId = socket.userId;

    if (!userId) {
      logger.warn('Join queue attempted without userId', { socketId: socket.id });
      socket.emit('error', { message: 'Authentication required' });
      return;
    }

    if (!this.queueManager) {
      logger.error('QueueManager not initialized');
      socket.emit('error', { message: 'Queue service unavailable' });
      return;
    }

    try {
      // Get player global score (default to 0 for MVP, TODO: integrate Profile Service)
      const globalScore = 0; // MVP: default to 0, will integrate Profile Service later

      // Assign default hero ID (single default hero for MVP)
      const heroId = 'default-hero-1';

      // Add player to queue
      const queueStatus = await this.queueManager.addToQueue(
        userId,
        heroId,
        globalScore,
        socket.id
      );

      logger.info('Player joined queue', {
        userId,
        heroId,
        globalScore,
        position: queueStatus.position,
        queueSize: queueStatus.queueSize
      });

      // Emit queue status to player
      socket.emit('queue-status', queueStatus);
    } catch (error) {
      logger.error('Error joining queue', { userId, error });
      socket.emit('error', {
        message: 'Failed to join queue',
        error: error.message
      });
    }
  }

  /**
   * Handle leave-queue event
   * @param {import('socket.io').Socket} socket - Socket.io socket instance
   * @param {Object} _data - Event data (optional, playerId extracted from socket.user)
   */
  async handleLeaveQueue(socket, _data) {
    const userId = socket.userId;

    if (!userId) {
      logger.warn('Leave queue attempted without userId', { socketId: socket.id });
      socket.emit('error', { message: 'Authentication required' });
      return;
    }

    if (!this.queueManager) {
      logger.error('QueueManager not initialized');
      socket.emit('error', { message: 'Queue service unavailable' });
      return;
    }

    try {
      const removed = await this.queueManager.removeFromQueue(userId);

      if (removed) {
        logger.info('Player left queue', { userId });
        socket.emit('queue-left', { success: true });
      } else {
        logger.warn('Player not in queue', { userId });
        socket.emit('queue-left', { success: false, message: 'Not in queue' });
      }
    } catch (error) {
      logger.error('Error leaving queue', { userId, error });
      socket.emit('error', {
        message: 'Failed to leave queue',
        error: error.message
      });
    }
  }

  /**
   * Handle player reconnection - check if already in queue and update socket ID
   * @param {import('socket.io').Socket} socket - Socket.io socket instance
   * @param {string} userId - User ID
   */
  async handleReconnection(socket, userId) {
    if (!this.queueManager) {
      return;
    }

    try {
      // Check if player is already in queue
      const queueEntry = await this.queueManager.getQueueEntry(userId);
      if (queueEntry) {
        // Player is already in queue - update socket ID and send current status
        await this.queueManager.updateSocketId(userId, socket.id);
        const queueStatus = await this.queueManager.getQueueStatus(userId);

        logger.info('Player reconnected and restored queue status', {
          userId,
          newSocketId: socket.id,
          position: queueStatus.position
        });

        // Send current queue status to reconnected player
        // Small delay to ensure frontend has time to set up subscription
        setTimeout(() => {
          socket.emit('queue-status', queueStatus);
        }, 100);
      }
    } catch (error) {
      logger.error('Error handling reconnection', { userId, error });
      // Don't throw - allow connection to proceed even if reconnection check fails
    }
  }

  /**
   * Handle Socket.io disconnection
   * @param {import('socket.io').Socket} socket - Socket.io socket instance
   * @param {string} userId - User ID
   */
  async handleDisconnection(socket, userId) {
    this.connectedSockets.delete(userId);

    logger.info('Socket disconnected', {
      socketId: socket.id,
      userId
    });

    // Don't remove player from queue on disconnect - they might reconnect
    // Player will only be removed on explicit leave-queue event or timeout
    // This allows players to refresh the page without losing their queue position
  }

  /**
   * Get socket ID for a user
   * @param {string} userId - User ID
   * @returns {string|undefined} Socket ID
   */
  getSocketId(userId) {
    return this.connectedSockets.get(userId);
  }

  /**
   * Emit event to a specific user
   * @param {string} userId - User ID
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emitToUser(userId, event, data) {
    const socketId = this.getSocketId(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    } else {
      logger.warn('Attempted to emit to disconnected user', { userId, event });
    }
  }
}

module.exports = MatchmakingController;
