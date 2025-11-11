const express = require('express');
const router = express.Router();
const GameRoomManager = require('../game/GameRoomManager');

// Use the singleton instance from server.js
const { gameRoomManager } = require('../../server');

router.post('/create-room', async (req, res) => {
  try {
    const { roomId, players } = req.body;
    if (!roomId || !players || players.length !== 2) {
      return res.status(400).json({ error: 'Invalid roomId or players' });
    }
    gameRoomManager.createRoom(roomId, players);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router; 