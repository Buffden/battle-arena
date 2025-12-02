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
   */
  constructor(io, services = {}) {
    this.io = io;
    this.services = services;
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
  handleConnection(socket) {
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
    // Placeholder for future event handlers
    // Will be implemented in TASK-VS-3-1-2
    logger.debug('Event handlers registered', { socketId: socket.id });
  }

  /**
   * Handle Socket.io disconnection
   * @param {import('socket.io').Socket} socket - Socket.io socket instance
   * @param {string} userId - User ID
   */
  handleDisconnection(socket, userId) {
    this.connectedSockets.delete(userId);

    logger.info('Socket disconnected', {
      socketId: socket.id,
      userId
    });

    // TODO: Handle queue removal on disconnect (TASK-VS-3-1-2)
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
