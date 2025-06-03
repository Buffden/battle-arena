require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const Matter = require('matter-js');
const JwtUtil = require('./utils/jwtUtil');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Initialize Matter.js physics engine
const engine = Matter.Engine.create();
const world = engine.world;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Game state
const gameRooms = new Map();

// Socket.io connection handling
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  try {
    const payload = JwtUtil.verify(token);
    socket.userId = payload.sub;
    return next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);

  socket.on('joinGame', (data) => {
    const { roomId, playerId } = data;
    logger.info(`Player ${playerId} joining game room ${roomId}`);
    
    socket.join(roomId);
    
    if (!gameRooms.has(roomId)) {
      gameRooms.set(roomId, {
        players: new Set(),
        gameState: {
          // Initialize game state
          tanks: {},
          projectiles: [],
          terrain: []
        }
      });
    }
    
    const room = gameRooms.get(roomId);
    room.players.add(playerId);
    
    // Notify other players
    socket.to(roomId).emit('playerJoined', { playerId });
  });

  socket.on('playerAction', (data) => {
    const { roomId, playerId, action } = data;
    logger.info(`Player ${playerId} action in room ${roomId}: ${action.type}`);
    
    // Handle game actions and update physics
    // TODO: Implement game action handling
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
    // Clean up game state
    gameRooms.forEach((room, roomId) => {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        if (room.players.size === 0) {
          gameRooms.delete(roomId);
        }
      }
    });
  });
});

// Game loop
setInterval(() => {
  Matter.Engine.update(engine, 1000 / 60);
  
  // Broadcast game state to all rooms
  gameRooms.forEach((room, roomId) => {
    io.to(roomId).emit('gameState', room.gameState);
  });
}, 1000 / 60);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3003;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
  logger.info(`Game engine service running on ${HOST}:${PORT}`);
}); 