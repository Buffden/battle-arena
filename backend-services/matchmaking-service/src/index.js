require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { socketAuthMiddleware } = require('./middleware/auth.middleware');
const matchmakingService = require('./services/matchmaking.service');
const logger = require('./utils/logger');

const app = express();
const httpServer = createServer(app);

// Basic security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Socket.IO setup with auth middleware
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Apply auth middleware to Socket.IO
io.use(socketAuthMiddleware(io));

// Initialize matchmaking service with Socket.IO
matchmakingService.initialize(io);

// Socket.IO connection handler
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.user.username} (${socket.user.id})`);

  // Notify frontend that socket is ready
  socket.emit('ready');

  // Handle possible pending match notifications
  matchmakingService.handlePlayerReconnect(socket);

  // Handle joining matchmaking queue
  socket.on('joinQueue', async () => {
    logger.info(`joinQueue event received for user: ${socket.user.username} (${socket.user.id})`);
    try {
      await matchmakingService.handlePlayerJoin({
        id: socket.user.id,
        username: socket.user.username,
        xp: socket.user.xp || 1000 // Use xp from JWT
      }, socket);
      socket.emit('queueJoined');
    } catch (error) {
      logger.error('Error joining queue:', error);
      socket.emit('queueError', { message: 'Failed to join queue' });
    }
  });

  // Handle leaving matchmaking queue
  socket.on('leaveQueue', async () => {
    try {
      await matchmakingService.handlePlayerLeave(socket.user.id);
      socket.emit('queueLeft');
    } catch (error) {
      logger.error('Error leaving queue:', error);
      socket.emit('queueError', { message: 'Failed to leave queue' });
    }
  });

  // Handle match acceptance
  socket.on('acceptMatch', async (data) => {
    try {
      const { lobbyId } = data;
      // Join the lobby room
      socket.join(`lobby:${lobbyId}`);
      socket.emit('matchAccepted', { lobbyId });
    } catch (error) {
      logger.error('Error accepting match:', error);
      socket.emit('matchError', { message: 'Failed to accept match' });
    }
  });

  // Handle match rejection
  socket.on('rejectMatch', async (data) => {
    try {
      const { lobbyId } = data;
      // Leave the lobby room
      socket.leave(`lobby:${lobbyId}`);
      socket.emit('matchRejected', { lobbyId });
    } catch (error) {
      logger.error('Error rejecting match:', error);
      socket.emit('matchError', { message: 'Failed to reject match' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    try {
      // Always remove player from queue on disconnect
      await matchmakingService.handlePlayerLeave(socket.user.id);
      logger.info(`User disconnected: ${socket.user.username} (${socket.user.id})`);
    } catch (error) {
      logger.error('Error handling disconnect:', error);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start matchmaking service
// matchmakingService.startMatchmaking();

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  logger.info(`Matchmaking service listening on port ${PORT}`);
}); 