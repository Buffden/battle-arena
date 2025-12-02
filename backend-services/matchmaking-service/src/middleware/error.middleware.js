/**
 * Error Handling Middleware
 * Centralized error handling for HTTP and WebSocket
 */

const logger = require('../utils/logger');

/**
 * HTTP error handler middleware
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Function} next - Next middleware function
 */
function httpErrorHandler(err, req, res, _next) {
  logger.error('HTTP Error', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

/**
 * Socket.io error handler
 * @param {import('socket.io').Socket} socket - Socket.io socket instance
 * @param {Error} error - Error object
 */
function socketErrorHandler(socket, error) {
  logger.error('Socket Error', {
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    socketId: socket.id,
    userId: socket.userId
  });

  socket.emit('error', {
    message: error.message || 'An error occurred',
    code: error.code || 'UNKNOWN_ERROR'
  });
}

module.exports = {
  httpErrorHandler,
  socketErrorHandler
};
