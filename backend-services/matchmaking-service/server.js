/**
 * Matchmaking Service - Main Entry Point
 * Sets up Express HTTP server, Socket.io WebSocket server, and Redis connection
 */

const express = require('express');
const http = require('http');
const config = require('./src/config/env.config');
const { initializeRedis, closeRedis } = require('./src/config/redis.config');
const { initializeSocket } = require('./src/config/socket.config');
const { httpErrorHandler } = require('./src/middleware/error.middleware');
const { socketAuth } = require('./src/middleware/auth.middleware');
const healthRoutes = require('./src/routes/health.routes');
const MatchmakingController = require('./src/controllers/MatchmakingController');
const QueueManager = require('./src/services/QueueManager');
const logger = require('./src/utils/logger');

// Initialize Express app
const app = express();
app.use(express.json());

// Health check routes
app.use('/', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'matchmaking-service',
    port: config.port,
    status: 'running',
    message: 'Matchmaking service is running'
  });
});

// Error handling middleware (must be last)
app.use(httpErrorHandler);

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.io server
const io = initializeSocket(httpServer);

// Apply Socket.io authentication middleware
io.use(socketAuth);

// Initialize QueueManager
const queueManager = new QueueManager();

// Initialize MatchmakingController with QueueManager
const matchmakingController = new MatchmakingController(io, {}, queueManager);
matchmakingController.initialize();

// Graceful shutdown handler
async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  try {
    // Close Socket.io server
    io.close(() => {
      logger.info('Socket.io server closed');
    });

    // Close Redis connection
    await closeRedis();
    logger.info('Redis connection closed');

    // Close HTTP server
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } catch (error) {
    logger.error('Error during graceful shutdown', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    // Initialize Redis connection
    await initializeRedis();
    logger.info('Redis initialized');

    // Start HTTP server
    httpServer.listen(config.port, () => {
      logger.info(`Matchmaking service running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });

    // Register graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', error => {
      logger.error('Uncaught Exception', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
startServer();
