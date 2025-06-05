const { io } = require('socket.io-client');
const jwt = require('jsonwebtoken');

// Configuration
const SERVER_URL = 'http://localhost:3002';
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYXJkb2NrIiwiaWF0IjoxNzQ4OTQyNjk2LCJleHAiOjE3NDkwMjkwOTZ9.X9XtcQxjSkqYArksF129H11XagpVJI22no0d4SN_MUo';

// Create test players
const players = [
  { id: 'player1', username: 'test_player_1', xp: 1000 },
  { id: 'player2', username: 'test_player_2', xp: 1050 },
  { id: 'player3', username: 'test_player_3', xp: 950 },
  { id: 'player4', username: 'test_player_4', xp: 1100 }
];

// Generate a real JWT token
function generateTestToken(player) {
  return jwt.sign(
    {
      sub: player.id,
      username: player.username,
      xp: player.xp
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Create and connect a player
function createPlayer(player) {
  const socket = io(SERVER_URL, {
    auth: {
      token: generateTestToken(player)
    }
  });

  socket.on('connect', () => {
    console.log(`✅ Player ${player.username} connected`);
  });

  socket.on('queueJoined', () => {
    console.log(`✅ Player ${player.username} joined queue`);
  });

  socket.on('queueLeft', () => {
    console.log(`✅ Player ${player.username} left queue`);
  });

  socket.on('matchFound', (matchData) => {
    console.log(`🎮 Match found for ${player.username}:`, matchData);
  });

  socket.on('queueError', (error) => {
    console.error(`❌ Error for ${player.username}:`, error);
  });

  socket.on('disconnect', () => {
    console.log(`👋 Player ${player.username} disconnected`);
  });

  socket.on('connect_error', (err) => {
    console.error(`❌ Connection error for ${player.username}:`, err.message);
  });

  return socket;
}

// Main test function
async function runTest() {
  console.log('🚀 Starting matchmaking test...\n');

  // Create players
  const sockets = players.map(player => ({
    socket: createPlayer(player),
    player
  }));

  // Wait for all connections
  await Promise.all(sockets.map(({ socket }) => 
    new Promise(resolve => socket.on('connect', resolve))
  ));

  console.log('\n👥 All players connected, starting queue test...\n');

  // Join queue with delay between each player
  for (const { socket, player } of sockets) {
    console.log(`Joining queue: ${player.username}`);
    socket.emit('joinQueue');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Wait for matchmaking
  console.log('\n⏳ Waiting for matchmaking...\n');
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Leave queue
  console.log('\n👋 Players leaving queue...\n');
  for (const { socket, player } of sockets) {
    console.log(`Leaving queue: ${player.username}`);
    socket.emit('leaveQueue');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Clean up
  console.log('\n🧹 Cleaning up...\n');
  sockets.forEach(({ socket }) => socket.disconnect());

  // Exit after cleanup
  setTimeout(() => {
    console.log('\n✨ Test completed!');
    process.exit(0);
  }, 2000);
}

// Run the test
runTest().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

console.log('Test JWT for player1:', generateTestToken(players[0])); 