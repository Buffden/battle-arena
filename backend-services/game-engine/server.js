const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5002;

// CORS configuration - match matchmaking service pattern exactly
// In production, restrict to specific origins via ALLOWED_ORIGINS env var
// Note: Frontend is served through nginx on port 80, not directly on service ports
const allowedOriginsArray = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost']; // Default to localhost for development
const allowedOrigins = new Set(allowedOriginsArray);

// Socket.io CORS configuration - use same allowed origins as Express
// Socket.io expects array, so convert Set back to array
const io = new Server(server, {
  cors: {
    origin: allowedOriginsArray,
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/ws/game'
});

// Express CORS middleware (should be after Socket.io initialization, like in matchmaking service)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.) in development
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());

// Handle connection errors at the server level (before connection is established)
io.engine.on('connection_error', err => {
  // eslint-disable-next-line no-console
  console.error('=== Socket.io connection error ===');
  // eslint-disable-next-line no-console
  console.error('Error code:', err.code);
  // eslint-disable-next-line no-console
  console.error('Error message:', err.message);
  // eslint-disable-next-line no-console
  console.error('Request URL:', err.req?.url);
  // eslint-disable-next-line no-console
  console.error('Request method:', err.req?.method);
  // eslint-disable-next-line no-console
  console.error('Request headers:', err.req?.headers);
  // eslint-disable-next-line no-console
  console.error('Context:', err.context);
});

// Log all incoming requests to help debug
io.engine.on('initial_headers', (headers, req) => {
  // eslint-disable-next-line no-console
  console.log('=== Incoming Socket.io request ===');
  // eslint-disable-next-line no-console
  console.log('URL:', req.url);
  // eslint-disable-next-line no-console
  console.log('Method:', req.method);
  // eslint-disable-next-line no-console
  console.log('Origin:', req.headers.origin);
  // eslint-disable-next-line no-console
  console.log('Upgrade header:', req.headers.upgrade);
  // eslint-disable-next-line no-console
  console.log('Query string:', req.url.split('?')[1] || 'none');
  // eslint-disable-next-line no-console
  console.log('Path:', req.url.split('?')[0]);
});

// Log handshake attempts
io.engine.on('connection_error', err => {
  // eslint-disable-next-line no-console
  console.error('=== Socket.io connection error ===');
  // eslint-disable-next-line no-console
  console.error('Error code:', err.code);
  // eslint-disable-next-line no-console
  console.error('Error message:', err.message);
  // eslint-disable-next-line no-console
  console.error('Request URL:', err.req?.url);
  // eslint-disable-next-line no-console
  console.error('Request method:', err.req?.method);
  // eslint-disable-next-line no-console
  console.error('Request headers:', err.req?.headers);
  // eslint-disable-next-line no-console
  console.error('Context:', err.context);
});

// Socket.io connection handling
io.on('connection', socket => {
  // eslint-disable-next-line no-console
  console.log('=== Client connected successfully ===');
  // eslint-disable-next-line no-console
  console.log(`Socket ID: ${socket.id}`);
  // eslint-disable-next-line no-console
  console.log(`Transport: ${socket.conn.transport.name}`);
  // eslint-disable-next-line no-console
  console.log('Handshake query:', socket.handshake.query);
  // eslint-disable-next-line no-console
  console.log('Handshake auth:', socket.handshake.auth);
  // eslint-disable-next-line no-console
  console.log('Handshake URL:', socket.handshake.url);

  // Handle join-game event (similar to matchmaking's join-queue)
  socket.on('join-game', async data => {
    try {
      const matchId = data?.matchId;
      const token = data?.token;

      // eslint-disable-next-line no-console
      console.log('Join game request:', { matchId, hasToken: !!token });

      if (!matchId) {
        // eslint-disable-next-line no-console
        console.warn('Join-game called without matchId');
        socket.emit('game-error', {
          error: 'Invalid request',
          message: 'matchId is required'
        });
        return;
      }

      // TODO: Validate JWT token
      if (!token) {
        // eslint-disable-next-line no-console
        console.warn('Join-game called without token');
        // For now, allow connection but log warning
      }

      // Join room for this match
      socket.join(`match:${matchId}`);
      // eslint-disable-next-line no-console
      console.log(`Client joined match room: match:${matchId}`);

      // TODO: Initialize game state and emit 'game-started' event
      // For now, just confirm the join
      socket.emit('game-joined', {
        matchId,
        message: 'Successfully joined game room'
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error handling join-game:', error);
      socket.emit('game-error', {
        error: 'Join failed',
        message: error.message
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', reason => {
    // eslint-disable-next-line no-console
    console.log(`Client disconnected, reason: ${reason}`);
  });

  // Handle connection errors
  socket.on('error', error => {
    // eslint-disable-next-line no-console
    console.error('Socket error:', error);
  });

  // TODO: Handle game events (move, fire, etc.) in future tasks
});

// Note: connection_error handler is already defined above (line 47)

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'game-engine', port: PORT });
});

app.get('/', (req, res) => {
  res.json({
    service: 'game-engine',
    port: PORT,
    status: 'running',
    message: 'Game engine service is running'
  });
});

// Step 2: Minimal endpoint for game room creation (for testing)
// Note: Full GameRoomManager implementation will be added in VS-3-2-2
// Current implementation provides basic game room creation for matchmaking integration
app.post('/api/game/create-room', (req, res) => {
  try {
    const { matchId, players } = req.body;

    if (!matchId || !players || !Array.isArray(players) || players.length !== 2) {
      return res.status(400).json({
        success: false,
        error: 'Invalid match data: matchId and 2 players required'
      });
    }

    // eslint-disable-next-line no-console
    console.log(`Game room creation requested for match: ${matchId}`);
    // eslint-disable-next-line no-console
    console.log(`Players: ${players[0].userId} and ${players[1].userId}`);

    // For now, just return success with gameRoomId = matchId
    // Note: Full GameRoomManager implementation will be added in VS-3-2-2
    // Current implementation uses matchId as gameRoomId for matchmaking integration
    const gameRoomId = matchId;

    // eslint-disable-next-line no-console
    console.log(`Game room created (temporary): ${gameRoomId}`);

    res.json({
      success: true,
      gameRoomId,
      matchId
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating game room:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Export app and server for testing
module.exports = { app, server, io };

// Only start server if this is the main module (not being imported for tests)
if (require.main === module) {
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Game engine service running on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log('Socket.io available at /ws/game');
  });
}
