/**
 * Game Configuration
 *
 * Centralized configuration for game engine constants.
 * All hardcoded values should be moved here for maintainability.
 */

module.exports = {
  arena: {
    defaultWidth: 800,
    defaultHeight: 600,
    defaultTerrain: 'default'
  },
  hero: {
    defaultHealth: 100,
    defaultMaxHealth: 100,
    defaultMovesRemaining: 4,
    defaultScore: 0,
    // Movement speed in world units per millisecond; used server-side to apply player inputs
    moveSpeedPerMs: 0.25,
    startingPositions: {
      player1: { x: 100, y: 500 }, // Left side
      player2: { x: 700, y: 500 } // Right side
    }
  },
  turn: {
    defaultTimeSeconds: 15,
    defaultTurnNumber: 1
  },
  game: {
    defaultStatus: 'waiting',
    activeStatus: 'active'
  }
};
