/**
 * Socket.io Configuration
 * Manages Socket.io server setup and configuration
 */

const { Server } = require('socket.io');

/**
 * Initialize Socket.io server
 * @param {import('http').Server} httpServer - HTTP server instance
 * @returns {import('socket.io').Server} Socket.io server instance
 */
function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    path: '/ws/matchmaking/socket.io',
    cors: {
      origin: process.env.CORS_ALLOWED_ORIGINS || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  return io;
}

module.exports = {
  initializeSocket
};
