const { io } = require('socket.io-client');
const logger = require('../utils/logger');

// Configuration
const SERVER_URL = 'http://localhost:3002';
const NUM_PLAYERS = 6; // Number of test players
const PLAYER_XPS = [800, 850, 900, 950, 1000, 1050]; // Different XPs for testing

// Generate test players
const players = Array.from({ length: NUM_PLAYERS }, (_, i) => ({
  id: `player_${i + 1}`,
  username: `test_player_${i + 1}`,
  xp: PLAYER_XPS[i]
}));

// Create socket connections for each player
const sockets = players.map(player => {
  const socket = io(SERVER_URL, {
    auth: {
      token: generateTestToken(player) // We'll create this function
    }
  });

  // Set up event listeners
  socket.on('connect', () => {
    logger.info(`Player ${player.username} connected`);
  });

  socket.on('queueJoined', () => {
    logger.info(`Player ${player.username} joined queue`);
  });

  socket.on('queueLeft', () => {
    logger.info(`Player ${player.username} left queue`);
  });

  socket.on('queueError', (error) => {
    logger.error(`Error for player ${player.username}:`, error);
  });

  socket.on('matchFound', (matchData) => {
    logger.info(`Match found for player ${player.username}:`, matchData);
  });

  socket.on('disconnect', () => {
    logger.info(`Player ${player.username} disconnected`);
  });

  return { socket, player };
});

// Generate a test JWT token
function generateTestToken(player) {
  // This is a simple token for testing. In production, use proper JWT signing
  return Buffer.from(JSON.stringify({
    sub: player.id,
    username: player.username,
    xp: player.xp
  })).toString('base64');
}

// Test scenarios
async function runTests() {
  try {
    // Wait for all connections
    await Promise.all(sockets.map(({ socket }) => 
      new Promise(resolve => socket.on('connect', resolve))
    ));

    logger.info('All players connected, starting tests...');

    // Test 1: Join queue
    logger.info('\nTest 1: Players joining queue');
    for (const { socket, player } of sockets) {
      socket.emit('joinQueue');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between joins
    }

    // Wait for matchmaking
    logger.info('\nWaiting for matchmaking...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Test 2: Leave queue
    logger.info('\nTest 2: Players leaving queue');
    for (const { socket, player } of sockets) {
      socket.emit('leaveQueue');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Clean up
    logger.info('\nCleaning up...');
    sockets.forEach(({ socket }) => socket.disconnect());

  } catch (error) {
    logger.error('Test failed:', error);
  }
}

// Run the tests
runTests(); 