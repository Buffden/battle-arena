const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const gameStateManager = require('./src/services/GameStateManager');
const { emitGameStateUpdate } = require('./src/services/GameStateUpdateEmitter');
const gameConfig = require('./src/config/game.config');
const TurnManager = require('./src/services/TurnManager');
const { getPolygons, slideWithinPolygon, pointInPolygon } = require('./src/utils/arena');
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

// Initialize turn manager after io is created
const turnManager = new TurnManager(io);

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

// Player tracking: matchId -> Map<userId, { socketId, userId, heroId }>
const playerTracking = new Map();

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
      const userId = data?.userId;
      const heroId = data?.heroId || 'default-hero';

      // eslint-disable-next-line no-console
      console.log('Join game request:', { matchId, userId, heroId, hasToken: !!token });

      if (!matchId) {
        // eslint-disable-next-line no-console
        console.warn('Join-game called without matchId');
        socket.emit('game-error', {
          error: 'Invalid request',
          message: 'matchId is required'
        });
        return;
      }

      if (!userId) {
        // eslint-disable-next-line no-console
        console.warn('Join-game called without userId');
        socket.emit('game-error', {
          error: 'Invalid request',
          message: 'userId is required'
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

      // Track player
      if (!playerTracking.has(matchId)) {
        playerTracking.set(matchId, new Map());
      }
      const matchPlayers = playerTracking.get(matchId);

      // Store player info
      matchPlayers.set(userId, {
        socketId: socket.id,
        userId,
        heroId
      });

      const connectedPlayers = Array.from(matchPlayers.values());

      // If a game state already exists for this match, treat this as a reconnect
      const existingState = gameStateManager.getGameState(matchId);
      if (existingState) {
        // Update socket room membership is already done above
        // Send the latest state only to the reconnecting socket
        socket.emit('game-joined', {
          matchId,
          message: 'Rejoined match'
        });

        socket.emit('game-state-update', {
          matchId,
          gameRoomId: matchId,
          gameState: existingState
        });

        // eslint-disable-next-line no-console
        console.log(`Player ${userId} rejoined match ${matchId}. Sent current game state.`);
        return;
      }

      // eslint-disable-next-line no-console
      console.log(`Match ${matchId}: ${connectedPlayers.length} player(s) connected`);

      if (connectedPlayers.length === 1) {
        // First player - just confirm join
        socket.emit('game-joined', {
          matchId,
          message: 'Waiting for opponent...'
        });
      } else if (connectedPlayers.length === 2) {
        // Both players joined - initialize game
        // eslint-disable-next-line no-console
        console.log(`Both players joined match ${matchId}, initializing game state...`);

        const players = connectedPlayers.map(p => ({
          userId: p.userId,
          heroId: p.heroId
        }));

        // Initialize game state
        const gameState = gameStateManager.initializeGameState(matchId, players);
        gameState.gameStatus = gameConfig.game.activeStatus;

        // eslint-disable-next-line no-console
        console.log('Game state initialized:', {
          matchId,
          player1: gameState.player1.userId,
          player2: gameState.player2.userId,
          currentTurn: gameState.currentTurn
        });

        // Use setImmediate to ensure both sockets have fully joined the room
        // This prevents race conditions where the event is emitted before the second socket joins
        setImmediate(() => {
          // Verify both sockets are in the room before emitting
          const room = io.sockets.adapter.rooms.get(`match:${matchId}`);
          const socketCount = room ? room.size : 0;
          // eslint-disable-next-line no-console
          console.log(
            `Room 'match:${matchId}' has ${socketCount} socket(s) before emitting game-started`
          );

          // Emit game-started event to all players in the match room
          const eventData = {
            matchId,
            gameRoomId: matchId,
            gameState
          };

          // eslint-disable-next-line no-console
          console.log("Emitting 'game-started' with data:", JSON.stringify(eventData, null, 2));

          io.to(`match:${matchId}`).emit('game-started', eventData);

          // Also try emitting directly to each socket as a fallback
          connectedPlayers.forEach(player => {
            const playerSocket = io.sockets.sockets.get(player.socketId);
            if (playerSocket) {
              // eslint-disable-next-line no-console
              console.log(`Also emitting 'game-started' directly to socket ${player.socketId}`);
              // eslint-disable-next-line no-console
              console.log(
                `Socket ${player.socketId} connected: ${playerSocket.connected}, rooms:`,
                Array.from(playerSocket.rooms)
              );
              playerSocket.emit('game-started', eventData);

              // Also try a test event to verify the socket can receive events
              playerSocket.emit('test-event', { message: 'test' });
            } else {
              // eslint-disable-next-line no-console
              console.warn(`Socket ${player.socketId} not found for direct emission`);
            }
          });

          // eslint-disable-next-line no-console
          console.log(`Emitted 'game-started' event to all players in match:${matchId}`);
        });

        // Start turn timer
        turnManager.startTurn(matchId);
        // eslint-disable-next-line no-console
        console.log(`Started turn timer for match:${matchId}`);
      } else {
        // More than 2 players (shouldn't happen, but handle gracefully)
        // eslint-disable-next-line no-console
        console.warn(`Match ${matchId} has ${connectedPlayers.length} players (expected 2)`);
        socket.emit('game-error', {
          error: 'Match full',
          message: 'This match already has 2 players'
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error handling join-game:', error);
      socket.emit('game-error', {
        error: 'Join failed',
        message: error.message
      });
    }
  });

  // Handle player movement input (server-authoritative)
  socket.on('player-move', data => {
    try {
      const matchId = data?.matchId;
      const userId = data?.userId;
      const input = data?.input || {};

      if (!matchId || !userId) {
        return;
      }

      const state = gameStateManager.getGameState(matchId);
      if (!state) {
        return;
      }

      const playerKey = state.player1?.userId === userId ? 'player1' : state.player2?.userId === userId ? 'player2' : null;
      if (!playerKey) {
        return;
      }

      const player = state[playerKey];
      const dx = Number(input.dx) || 0;
      const dy = Number(input.dy) || 0;
      const deltaMs = Math.max(0, Math.min(Number(input.deltaMs) || 16, 200));

      const magnitude = Math.hypot(dx, dy);
      if (magnitude === 0) {
        return;
      }

      const normX = dx / magnitude;
      const normY = dy / magnitude;
      const speed = gameConfig.hero.moveSpeedPerMs;
      const distance = speed * deltaMs;

      const moveX = normX * distance;
      const moveY = normY * distance;

      const { mainWalkablePolygon, leftWalkablePolygon, rightWalkablePolygon } = getPolygons();
      const playerPolygon = playerKey === 'player1'
        ? (leftWalkablePolygon.length ? leftWalkablePolygon : mainWalkablePolygon)
        : (rightWalkablePolygon.length ? rightWalkablePolygon : mainWalkablePolygon);

      let nextPosition = null;
      if (playerPolygon.length > 0) {
        nextPosition = slideWithinPolygon(player.position, moveX, moveY, playerPolygon);
      }

      if (!nextPosition) {
        // Fallback: simple bounds clamp if polygon not available or slide failed
        const arenaWidth = state.arena?.width || gameConfig.arena.defaultWidth;
        const arenaHeight = state.arena?.height || gameConfig.arena.defaultHeight;
        const cx = Math.max(0, Math.min(arenaWidth, player.position.x + moveX));
        const cy = Math.max(0, Math.min(arenaHeight, player.position.y + moveY));
        if (!playerPolygon.length || pointInPolygon(playerPolygon, cx, cy)) {
          nextPosition = { x: cx, y: cy };
        }
      }

      if (!nextPosition) {
        return;
      }

      const facingRad = Math.atan2(-dy, dx);
      const facingDeg = ((facingRad * 180) / Math.PI + 360) % 360;

      const updatedPlayer = {
        ...player,
        position: nextPosition,
        facingAngle: facingDeg
      };

      const updates = {
        [playerKey]: updatedPlayer
      };

      gameStateManager.updateGameState(matchId, updates);
      const updatedState = gameStateManager.getGameState(matchId);
      emitGameStateUpdate(io, matchId, updatedState);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error handling player-move:', error);
    }
  });

  // Handle zone assignments (persist zone allocations for the match)
  socket.on('zone-assignments', data => {
    try {
      const matchId = data?.matchId;
      const zoneAssignments = data?.zoneAssignments;

      if (!matchId || !zoneAssignments) {
        return;
      }

      const state = gameStateManager.getGameState(matchId);
      if (!state) {
        return;
      }

      // Update game state with zone assignments
      const updates = {
        zoneAssignments: {
          player1Zone: zoneAssignments.player1Zone,
          player2Zone: zoneAssignments.player2Zone
        }
      };

      gameStateManager.updateGameState(matchId, updates);
      const updatedState = gameStateManager.getGameState(matchId);
      emitGameStateUpdate(io, matchId, updatedState);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error handling zone-assignments:', error);
    }
  });

  // Handle real-time player position updates
  socket.on('player-position-update', data => {
    try {
      const matchId = data?.matchId;
      const userId = data?.userId;
      const position = data?.position;

      if (!matchId || !userId || !position) {
        return;
      }

      // Broadcast position update to all other players in the match
      socket.to(`match:${matchId}`).emit('player-position-update', {
        userId,
        position
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error handling player-position-update:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', reason => {
    // eslint-disable-next-line no-console
    console.log(`Client disconnected, reason: ${reason}`);

    // Remove player from tracking
    for (const [matchId, players] of playerTracking.entries()) {
      for (const [userId, playerData] of players.entries()) {
        if (playerData.socketId === socket.id) {
          players.delete(userId);
          // eslint-disable-next-line no-console
          console.log(`Removed player ${userId} from match ${matchId} tracking`);

          // Clean up empty match tracking
          if (players.size === 0) {
            playerTracking.delete(matchId);
            // Clean up game state and turn timer
            gameStateManager.deleteGameState(matchId);
            turnManager.cleanup(matchId);
            // eslint-disable-next-line no-console
            console.log(`Removed empty match tracking for ${matchId}`);
          }
          break;
        }
      }
    }
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
