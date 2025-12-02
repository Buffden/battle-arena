/**
 * Authentication Middleware
 * Validates JWT tokens for WebSocket connections
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env.config');
const logger = require('../utils/logger');

/**
 * Extract JWT token from Socket.io handshake
 * @param {import('socket.io').Socket} socket - Socket.io socket instance
 * @returns {string|null} JWT token or null if not found
 */
function extractToken(socket) {
  // Try to get token from handshake auth
  if (socket.handshake.auth && socket.handshake.auth.token) {
    return socket.handshake.auth.token;
  }

  // Try to get token from handshake query
  if (socket.handshake.query && socket.handshake.query.token) {
    return socket.handshake.query.token;
  }

  // Try to get token from Authorization header
  if (socket.handshake.headers && socket.handshake.headers.authorization) {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
  }

  return null;
}

/**
 * Validate JWT token
 * @param {string} token - JWT token to validate
 * @returns {Promise<{valid: boolean, payload?: object, error?: string}>} Validation result
 */
async function validateToken(token) {
  if (!token) {
    return { valid: false, error: 'No token provided' };
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    return { valid: true, payload };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token expired' };
    }
    if (error.name === 'JsonWebTokenError') {
      return { valid: false, error: 'Invalid token' };
    }
    logger.error('JWT validation error', error);
    return { valid: false, error: 'Token validation failed' };
  }
}

/**
 * Socket.io authentication middleware
 * Validates JWT token on connection
 * @param {import('socket.io').Socket} socket - Socket.io socket instance
 * @param {Function} next - Next middleware function
 */
async function socketAuth(socket, next) {
  try {
    const token = extractToken(socket);
    const validation = await validateToken(token);

    if (!validation.valid) {
      logger.warn('Socket authentication failed', {
        error: validation.error,
        socketId: socket.id
      });
      return next(new Error(validation.error || 'Authentication failed'));
    }

    // Attach user info to socket
    socket.userId = validation.payload.id || validation.payload.userId;
    socket.user = validation.payload;

    logger.debug('Socket authenticated', {
      socketId: socket.id,
      userId: socket.userId
    });

    next();
  } catch (error) {
    logger.error('Socket authentication error', error);
    next(new Error('Authentication error'));
  }
}

module.exports = {
  socketAuth,
  extractToken,
  validateToken
};
