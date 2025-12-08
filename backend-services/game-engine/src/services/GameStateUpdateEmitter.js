/**
 * Game State Update Emitter
 *
 * Helper functions for emitting game state update events to clients.
 */

/**
 * Emit game-state-update event to all players in a match room
 * @param {Object} io - Socket.io server instance
 * @param {string} matchId - Match identifier
 * @param {Object} gameState - Current game state
 */
function emitGameStateUpdate(io, matchId, gameState) {
  if (!io || !matchId || !gameState) {
    return;
  }

  io.to(`match:${matchId}`).emit('game-state-update', {
    matchId,
    gameRoomId: matchId,
    gameState
  });
}

module.exports = {
  emitGameStateUpdate
};
