/**
 * Game State Manager
 *
 * Manages game state initialization, updates, and retrieval.
 * Uses singleton pattern for single instance across the application.
 */

const gameConfig = require('../config/game.config');
const {
  getPolygons,
  findSpawnPositionsForSides
} = require('../utils/arena');

class GameStateManager {
  constructor() {
    if (GameStateManager.instance) {
      return GameStateManager.instance;
    }

    this.gameStates = new Map(); // matchId -> GameState
    GameStateManager.instance = this;
  }

  /**
   * Initialize game state for a new match
   * @param {string} matchId - Match identifier
   * @param {Array} players - Array of player objects [{ userId, heroId }, { userId, heroId }]
   * @returns {Object} Initialized game state
   */
  initializeGameState(matchId, players) {
    if (players.length !== 2) {
      throw new Error('Game state requires exactly 2 players');
    }

    const now = Date.now();
    const { arenaData, leftWalkablePolygon, rightWalkablePolygon } = getPolygons();
    const spawn = findSpawnPositionsForSides({
      arenaData,
      leftPolygon: leftWalkablePolygon,
      rightPolygon: rightWalkablePolygon.length ? rightWalkablePolygon : leftWalkablePolygon
    });
    const arenaBounds = arenaData?.worldBounds || {
      x: 0,
      y: 0,
      width: gameConfig.arena.defaultWidth,
      height: gameConfig.arena.defaultHeight
    };

    const gameState = {
      matchId,
      gameRoomId: matchId,
      currentTurn: players[0].userId,
      turnNumber: gameConfig.turn.defaultTurnNumber,
      turnTimeRemaining: gameConfig.turn.defaultTimeSeconds,
      player1: {
        id: `hero-${players[0].userId}`,
        userId: players[0].userId,
        heroId: players[0].heroId || 'default-hero',
        position: {
          x: spawn.player1.x,
          y: spawn.player1.y
        },
        facingAngle: 0,
        health: gameConfig.hero.defaultHealth,
        maxHealth: gameConfig.hero.defaultMaxHealth,
        score: gameConfig.hero.defaultScore,
        movesRemaining: gameConfig.hero.defaultMovesRemaining
      },
      player2: {
        id: `hero-${players[1].userId}`,
        userId: players[1].userId,
        heroId: players[1].heroId || 'default-hero',
        position: {
          x: spawn.player2.x,
          y: spawn.player2.y
        },
        facingAngle: 180,
        health: gameConfig.hero.defaultHealth,
        maxHealth: gameConfig.hero.defaultMaxHealth,
        score: gameConfig.hero.defaultScore,
        movesRemaining: gameConfig.hero.defaultMovesRemaining
      },
      arena: {
        width: arenaBounds.width,
        height: arenaBounds.height,
        terrain: gameConfig.arena.defaultTerrain
      },
      gameStatus: gameConfig.game.defaultStatus,
      zoneAssignments: undefined, // Will be set when players send zone-assignments event
      createdAt: now,
      updatedAt: now
    };

    this.gameStates.set(matchId, gameState);
    return gameState;
  }

  /**
   * Get current game state for a match
   * @param {string} matchId - Match identifier
   * @returns {Object|null} Game state or null if not found
   */
  getGameState(matchId) {
    return this.gameStates.get(matchId) || null;
  }

  /**
   * Update game state for a match
   * @param {string} matchId - Match identifier
   * @param {Object} updates - Partial game state updates
   * @returns {Object|null} Updated game state or null if not found
   */
  updateGameState(matchId, updates) {
    const state = this.gameStates.get(matchId);
    if (!state) {
      return null;
    }

    // Merge updates with existing state
    Object.assign(state, updates, { updatedAt: Date.now() });
    return state;
  }

  /**
   * Delete game state for a match (cleanup)
   * @param {string} matchId - Match identifier
   * @returns {boolean} True if deleted, false if not found
   */
  deleteGameState(matchId) {
    return this.gameStates.delete(matchId);
  }

  /**
   * Check if game state exists for a match
   * @param {string} matchId - Match identifier
   * @returns {boolean} True if exists, false otherwise
   */
  hasGameState(matchId) {
    return this.gameStates.has(matchId);
  }
}

// Export singleton instance
module.exports = new GameStateManager();
