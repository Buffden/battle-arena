const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const logger = require('../utils/logger');

/**
 * Middleware to verify JWT token in Socket.IO handshake
 * @param {Server} io - Socket.IO server instance
 * @returns {Function} Socket.IO middleware function
 */
const socketAuthMiddleware = (io) => {
  return async (socket, next) => {
    try {
      // Get token from handshake auth
      const token = socket.handshake.auth.token;
      logger.info('Token received in handshake:', token);
      
      if (!token) {
        logger.error('Authentication token missing from socket handshake');
        return next(new Error('Authentication token missing'));
      }

      // Validate token format
      const tokenParts = token.split('.');
      logger.info('Token parts length:', tokenParts.length);
      if (tokenParts.length !== 3) {
        logger.error('Invalid token format');
        return next(new Error('Invalid token format'));
      }

      // Verify token
      try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info('Decoded JWT:', decoded);
        logger.info(`Decoded JWT details: username=${decoded.username}, xp=${decoded.xp}, sub=${decoded.sub}, iat=${decoded.iat}, exp=${decoded.exp}`);
      // Attach user info to socket
      socket.user = {
        id: decoded.sub,
        username: decoded.username,
        xp: decoded.xp
      };

        logger.info(`Socket authenticated for user: ${socket.user.username} (id: ${socket.user.id})`);
      next();
      } catch (jwtError) {
        logger.error('JWT verification failed:', jwtError.message);
        if (jwtError.name === 'TokenExpiredError') {
          return next(new Error('Token expired'));
        }
        return next(new Error('Invalid authentication token'));
      }
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  };
};

module.exports = {
  socketAuthMiddleware
}; 