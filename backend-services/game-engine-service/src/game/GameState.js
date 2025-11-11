const logger = require('../utils/logger');

class GameState {
  constructor(players) {
    this.players = players;
    this.round = 1;
    this.maxRounds = 10;
    this.currentTurn = null;
    this.turnHistory = [];
    this.playerStates = this.initializePlayerStates(players);
    this.gamePhase = 'initialization'; // initialization, playing, ended
    this.winner = null;
    this.createdAt = Date.now();
  }

  /**
   * Initialize player states with default values
   * @param {Array} players - Array of player objects
   * @returns {Array} Array of player states
   */
  initializePlayerStates(players) {
    return players.map((player, index) => ({
      id: player.id,
      username: player.username,
      health: 100,
      position: {
        x: index === 0 ? 100 : 700, // Left or right side
        y: 300
      },
      angle: index === 0 ? 0 : 180, // Facing right or left
      power: 50, // Default power
      ready: false,
      lastAction: null,
      lastActionTime: null
    }));
  }

  /**
   * Assign turn order based on XP or randomly
   * @param {boolean} useXpBased - Whether to use XP for turn order
   */
  assignTurnOrder(useXpBased = false) {
    if (useXpBased) {
      // Sort players by XP (higher XP goes first)
      const sortedPlayers = [...this.players].sort((a, b) => (b.xp || 0) - (a.xp || 0));
      this.currentTurn = sortedPlayers[0].id;
    } else {
      // Random turn order
      const randomIndex = Math.floor(Math.random() * this.players.length);
      this.currentTurn = this.players[randomIndex].id;
    }

    logger.info(`Turn order assigned. First turn: ${this.currentTurn}`);
    return this.currentTurn;
  }

  /**
   * Get the current player's state
   * @returns {Object} Current player's state
   */
  getCurrentPlayerState() {
    return this.playerStates.find(p => p.id === this.currentTurn);
  }

  /**
   * Get the opponent's state
   * @param {string} playerId - Current player's ID
   * @returns {Object} Opponent's state
   */
  getOpponentState(playerId) {
    return this.playerStates.find(p => p.id !== playerId);
  }

  /**
   * Switch turn to next player
   * @returns {string} New current player's ID
   */
  switchTurn() {
    const currentIndex = this.players.findIndex(p => p.id === this.currentTurn);
    const nextIndex = (currentIndex + 1) % this.players.length;
    this.currentTurn = this.players[nextIndex].id;

    // Record turn in history
    this.turnHistory.push({
      playerId: this.currentTurn,
      timestamp: Date.now(),
      round: this.round
    });

    logger.info(`Turn switched to player ${this.currentTurn} in round ${this.round}`);
    return this.currentTurn;
  }

  /**
   * Update player state
   * @param {string} playerId - Player ID
   * @param {Object} updates - State updates
   */
  updatePlayerState(playerId, updates) {
    const playerState = this.playerStates.find(p => p.id === playerId);
    if (playerState) {
      Object.assign(playerState, updates);
      playerState.lastAction = updates.action;
      playerState.lastActionTime = Date.now();
      logger.info(`Updated state for player ${playerId}: ${JSON.stringify(updates)}`);
    }
  }

  /**
   * Check if game should end
   * @returns {boolean} True if game should end
   */
  checkGameEnd() {
    // Check for zero health
    const playerWithZeroHealth = this.playerStates.find(p => p.health <= 0);
    if (playerWithZeroHealth) {
      this.endGame(playerWithZeroHealth.id);
      return true;
    }

    // Check for max rounds
    if (this.round > this.maxRounds) {
      // Find winner based on health
      const sortedPlayers = [...this.playerStates].sort((a, b) => b.health - a.health);
      this.endGame(sortedPlayers[0].id);
      return true;
    }

    return false;
  }

  /**
   * End the game
   * @param {string} winnerId - Winner's player ID
   */
  endGame(winnerId) {
    this.gamePhase = 'ended';
    this.winner = winnerId;
    logger.info(`Game ended. Winner: ${winnerId}`);
  }

  /**
   * Start a new round
   */
  startNewRound() {
    this.round++;
    logger.info(`Starting round ${this.round}`);
  }

  /**
   * Get game state for a specific player
   * @param {string} playerId - Player ID
   * @returns {Object} Game state visible to the player
   */
  getPlayerView(playerId) {
    return {
      round: this.round,
      maxRounds: this.maxRounds,
      currentTurn: this.currentTurn,
      gamePhase: this.gamePhase,
      playerState: this.playerStates.find(p => p.id === playerId),
      opponentState: this.getOpponentState(playerId),
      winner: this.winner
    };
  }

  /**
   * Get full game state (for debugging/admin)
   * @returns {Object} Complete game state
   */
  getFullState() {
    return {
      round: this.round,
      maxRounds: this.maxRounds,
      currentTurn: this.currentTurn,
      gamePhase: this.gamePhase,
      playerStates: this.playerStates,
      turnHistory: this.turnHistory,
      winner: this.winner,
      createdAt: this.createdAt
    };
  }
}

module.exports = GameState; 