require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const logger = require('./src/utils/logger');
const GameSocketHandler = require('./src/game/GameSocketHandler');
const testRoutes = require('./src/routes/testRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const GameRoomManager = require('./src/game/GameRoomManager');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io'
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Routes
app.use('/api/test', testRoutes);
app.use('/api/rooms', roomRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'ok' });
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  console.log('Socket connection attempt:', socket.id, socket.handshake.auth.token);
  logger.info(`Socket connection attempt from ${socket.id}`);
  const token = socket.handshake.auth.token;
  
  if (!token) {
    logger.warn(`Socket ${socket.id} attempted connection without token`);
    return next(new Error('Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    logger.info(`Socket ${socket.id} authenticated for user ${decoded.username}`);
    next();
  } catch (error) {
    logger.error(`Socket ${socket.id} authentication failed:`, error);
    next(new Error('Invalid token'));
  }
});

// Initialize game socket handler
const gameRoomManager = new GameRoomManager(io);
const gameSocketHandler = new GameSocketHandler(io, gameRoomManager);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5002;
server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Game engine server listening on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Log socket connections and disconnections
io.on('connection', (socket) => {
  console.log('✅ Game engine socket connected:', socket.id);
  socket.on('disconnect', (reason) => {
    logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection:', reason);
  process.exit(1);
});

module.exports = { app, server, gameRoomManager };
