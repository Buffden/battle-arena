const express = require('express');
const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

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
// TODO: VS-3-2-2 - Implement full GameRoomManager with proper game state initialization
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
    // TODO: VS-3-2-2 - Create actual game room with GameRoomManager
    const gameRoomId = matchId; // Temporary: use matchId as gameRoomId

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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Game engine service running on port ${PORT}`);
});
