/**
 * Turn Manager
 *
 * Manages turn timers for active games.
 * Handles countdown, turn switching, and state updates.
 */

const gameStateManager = require('./GameStateManager');
const { emitGameStateUpdate } = require('./GameStateUpdateEmitter');
const gameConfig = require('../config/game.config');

class TurnManager {
  constructor(io) {
    this.io = io;
    this.timers = new Map(); // matchId -> intervalId
  }

  /**
   * Start turn timer for a match
   * @param {string} matchId - Match identifier
   */
  startTurn(matchId) {
    // Clear existing timer if any
    this.stopTurn(matchId);

    // Get current game state
    const state = gameStateManager.getGameState(matchId);
    if (!state || state.gameStatus !== gameConfig.game.activeStatus) {
      return;
    }

    // Start countdown
    const intervalId = setInterval(() => {
      const currentState = gameStateManager.getGameState(matchId);
      if (!currentState || currentState.gameStatus !== gameConfig.game.activeStatus) {
        this.stopTurn(matchId);
        return;
      }

      // Decrement timer
      const newTime = Math.max(0, currentState.turnTimeRemaining - 1);
      gameStateManager.updateGameState(matchId, {
        turnTimeRemaining: newTime
      });

      // Emit update to all players
      const updatedState = gameStateManager.getGameState(matchId);
      emitGameStateUpdate(this.io, matchId, updatedState);

      // Time's up - switch turn
      if (newTime === 0) {
        this.switchTurn(matchId);
      }
    }, 1000); // Update every second

    this.timers.set(matchId, intervalId);
  }

  /**
   * Stop turn timer for a match
   * @param {string} matchId - Match identifier
   */
  stopTurn(matchId) {
    const intervalId = this.timers.get(matchId);
    if (intervalId) {
      clearInterval(intervalId);
      this.timers.delete(matchId);
    }
  }

  /**
   * Switch to next player's turn
   * @param {string} matchId - Match identifier
   */
  switchTurn(matchId) {
    const state = gameStateManager.getGameState(matchId);
    if (!state) {
      return;
    }

    // Determine next player
    const nextPlayer =
      state.currentTurn === state.player1.userId ? state.player2.userId : state.player1.userId;

    // Update game state
    gameStateManager.updateGameState(matchId, {
      currentTurn: nextPlayer,
      turnNumber: state.turnNumber + 1,
      turnTimeRemaining: gameConfig.turn.defaultTimeSeconds
    });

    // Emit update
    const updatedState = gameStateManager.getGameState(matchId);
    emitGameStateUpdate(this.io, matchId, updatedState);

    // Start timer for next turn
    this.startTurn(matchId);
  }

  /**
   * Reset turn timer (when player takes action)
   * @param {string} matchId - Match identifier
   */
  resetTurnTimer(matchId) {
    this.stopTurn(matchId);
    const state = gameStateManager.getGameState(matchId);
    if (state) {
      gameStateManager.updateGameState(matchId, {
        turnTimeRemaining: gameConfig.turn.defaultTimeSeconds
      });
      const updatedState = gameStateManager.getGameState(matchId);
      emitGameStateUpdate(this.io, matchId, updatedState);
    }
  }

  /**
   * Cleanup timer for a match (when game ends)
   * @param {string} matchId - Match identifier
   */
  cleanup(matchId) {
    this.stopTurn(matchId);
  }
}

module.exports = TurnManager;
