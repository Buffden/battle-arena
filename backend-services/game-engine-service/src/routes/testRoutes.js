const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const GameRoomManager = require('../game/GameRoomManager');
const jwt = require('jsonwebtoken');

// Mock user data for testing
const MOCK_USERS = {
  player1: {
    id: 'test-player-1',
    username: 'TestPlayer1',
    xp: 100
  },
  player2: {
    id: 'test-player-2',
    username: 'TestPlayer2',
    xp: 150
  }
};

// Generate mock JWT tokens
const generateMockToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

/**
 * Create a test match
 * POST /test-match
 */
router.post('/test-match', async (req, res) => {
  logger.info('Creating test match');
  try {
    const gameRoomManager = new GameRoomManager();
    
    // Create mock tokens
    const player1Token = generateMockToken(MOCK_USERS.player1);
    const player2Token = generateMockToken(MOCK_USERS.player2);

    // Create game room
    const room = await gameRoomManager.createRoom(
      'test-room',
      MOCK_USERS.player1.id,
      player1Token
    );

    // Join second player
    await gameRoomManager.joinRoom(
      room.roomId,
      MOCK_USERS.player2.id,
      player2Token
    );

    // Start game
    await room.startGame();

    logger.info('Test match created successfully', {
      roomId: room.roomId,
      player1: MOCK_USERS.player1.username,
      player2: MOCK_USERS.player2.username
    });

    res.json({
      success: true,
      roomId: room.roomId,
      player1: {
        ...MOCK_USERS.player1,
        token: player1Token
      },
      player2: {
        ...MOCK_USERS.player2,
        token: player2Token
      }
    });
  } catch (error) {
    logger.error('Error creating test match:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Simulate player action in test match
 * POST /test-match/:roomId/action
 */
router.post('/test-match/:roomId/action', async (req, res) => {
  const { roomId } = req.params;
  const { playerId, action, params } = req.body;

  logger.info(`Simulating action in test match ${roomId}`, {
    playerId,
    action,
    params
  });

  try {
    const gameRoomManager = new GameRoomManager();
    const room = gameRoomManager.getRoom(roomId);

    if (!room) {
      logger.warn(`Test match room ${roomId} not found`);
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const result = await room.handlePlayerAction(playerId, action, params);
    
    logger.info(`Action simulated successfully in test match ${roomId}`, {
      playerId,
      action,
      result
    });

    res.json({
      success: true,
      result
    });
  } catch (error) {
    logger.error(`Error simulating action in test match ${roomId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get test match state
 * GET /test-match/:roomId
 */
router.get('/test-match/:roomId', async (req, res) => {
  const { roomId } = req.params;

  logger.info(`Getting test match state for room ${roomId}`);

  try {
    const gameRoomManager = new GameRoomManager();
    const room = gameRoomManager.getRoom(roomId);

    if (!room) {
      logger.warn(`Test match room ${roomId} not found`);
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const gameState = room.getGameState();
    
    logger.info(`Test match state retrieved for room ${roomId}`, {
      status: gameState.status,
      currentTurn: gameState.currentTurn
    });

    res.json({
      success: true,
      gameState
    });
  } catch (error) {
    logger.error(`Error getting test match state for room ${roomId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * End test match
 * POST /test-match/:roomId/end
 */
router.post('/test-match/:roomId/end', async (req, res) => {
  const { roomId } = req.params;

  logger.info(`Ending test match ${roomId}`);

  try {
    const gameRoomManager = new GameRoomManager();
    const room = gameRoomManager.getRoom(roomId);

    if (!room) {
      logger.warn(`Test match room ${roomId} not found`);
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const results = await room.endGame('Test match ended');
    
    logger.info(`Test match ended successfully for room ${roomId}`, {
      winner: results.winner,
      duration: results.duration
    });

    res.json({
      success: true,
      results
    });
  } catch (error) {
    logger.error(`Error ending test match ${roomId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 