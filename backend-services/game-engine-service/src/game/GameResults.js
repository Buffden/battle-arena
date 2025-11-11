const logger = require('../utils/logger');

class GameResults {
  constructor(gameState, players) {
    this.gameState = gameState;
    this.players = players;
    this.results = {
      winner: null,
      loser: null,
      stats: {},
      timestamp: Date.now(),
      duration: 0,
      rounds: 0,
      totalShots: 0,
      totalDamage: 0,
      accuracy: {},
      performance: {}
    };
  }

  /**
   * Process game results
   * @returns {Object} Processed game results
   */
  processResults() {
    logger.info('Processing game results...');
    
    // Set basic game information
    this.results.winner = this.gameState.winner;
    this.results.rounds = this.gameState.round;
    this.results.duration = Date.now() - this.gameState.createdAt;
    
    // Find loser
    this.results.loser = this.players.find(p => p.id !== this.results.winner)?.id;
    
    // Process player statistics
    this.players.forEach(player => {
      const playerState = this.gameState.playerStates.find(p => p.id === player.id);
      const isWinner = player.id === this.results.winner;
      
      this.results.stats[player.id] = {
        username: player.username,
        finalHealth: playerState.health,
        isWinner,
        shots: this.calculatePlayerShots(player.id),
        damage: this.calculatePlayerDamage(player.id),
        accuracy: this.calculatePlayerAccuracy(player.id),
        performance: this.calculatePlayerPerformance(player.id)
      };

      logger.info(`Processed stats for player ${player.username}:`, this.results.stats[player.id]);
    });

    // Calculate game-wide statistics
    this.results.totalShots = Object.values(this.results.stats)
      .reduce((sum, stat) => sum + stat.shots, 0);
    this.results.totalDamage = Object.values(this.results.stats)
      .reduce((sum, stat) => sum + stat.damage, 0);

    logger.info('Game results processed successfully');
    return this.results;
  }

  /**
   * Calculate number of shots taken by a player
   * @param {string} playerId - Player ID
   * @returns {number} Number of shots
   */
  calculatePlayerShots(playerId) {
    const shots = this.gameState.turnHistory.filter(
      turn => turn.playerId === playerId && turn.action === 'shoot'
    ).length;
    logger.debug(`Player ${playerId} took ${shots} shots`);
    return shots;
  }

  /**
   * Calculate total damage dealt by a player
   * @param {string} playerId - Player ID
   * @returns {number} Total damage
   */
  calculatePlayerDamage(playerId) {
    const damage = this.gameState.turnHistory
      .filter(turn => turn.playerId === playerId && turn.action === 'shoot')
      .reduce((sum, turn) => sum + (turn.damage || 0), 0);
    logger.debug(`Player ${playerId} dealt ${damage} total damage`);
    return damage;
  }

  /**
   * Calculate player's shooting accuracy
   * @param {string} playerId - Player ID
   * @returns {number} Accuracy percentage
   */
  calculatePlayerAccuracy(playerId) {
    const shots = this.calculatePlayerShots(playerId);
    if (shots === 0) return 0;

    const hits = this.gameState.turnHistory.filter(
      turn => turn.playerId === playerId && turn.action === 'shoot' && turn.damage > 0
    ).length;

    const accuracy = (hits / shots) * 100;
    logger.debug(`Player ${playerId} accuracy: ${accuracy.toFixed(2)}%`);
    return accuracy;
  }

  /**
   * Calculate player's overall performance
   * @param {string} playerId - Player ID
   * @returns {number} Performance score
   */
  calculatePlayerPerformance(playerId) {
    const stats = this.results.stats[playerId];
    if (!stats) return 0;

    // Performance factors
    const accuracyWeight = 0.3;
    const damageWeight = 0.3;
    const survivalWeight = 0.4;

    const accuracyScore = stats.accuracy;
    const damageScore = (stats.damage / this.results.totalDamage) * 100;
    const survivalScore = stats.finalHealth;

    const performance = (
      accuracyScore * accuracyWeight +
      damageScore * damageWeight +
      survivalScore * survivalWeight
    );

    logger.debug(`Player ${playerId} performance score: ${performance.toFixed(2)}`);
    return performance;
  }

  /**
   * Get formatted results for display
   * @returns {Object} Formatted results
   */
  getFormattedResults() {
    const formatted = {
      winner: {
        id: this.results.winner,
        username: this.results.stats[this.results.winner]?.username,
        stats: this.results.stats[this.results.winner]
      },
      loser: {
        id: this.results.loser,
        username: this.results.stats[this.results.loser]?.username,
        stats: this.results.stats[this.results.loser]
      },
      gameStats: {
        duration: this.formatDuration(this.results.duration),
        rounds: this.results.rounds,
        totalShots: this.results.totalShots,
        totalDamage: this.results.totalDamage
      },
      timestamp: new Date(this.results.timestamp).toISOString()
    };

    logger.info('Formatted results:', formatted);
    return formatted;
  }

  /**
   * Format duration in milliseconds to readable string
   * @param {number} duration - Duration in milliseconds
   * @returns {string} Formatted duration
   */
  formatDuration(duration) {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  /**
   * Get results for a specific player
   * @param {string} playerId - Player ID
   * @returns {Object} Player-specific results
   */
  getPlayerResults(playerId) {
    const playerStats = this.results.stats[playerId];
    if (!playerStats) {
      logger.warn(`No results found for player ${playerId}`);
      return null;
    }

    const results = {
      playerId,
      username: playerStats.username,
      isWinner: playerStats.isWinner,
      stats: {
        finalHealth: playerStats.finalHealth,
        shots: playerStats.shots,
        damage: playerStats.damage,
        accuracy: playerStats.accuracy,
        performance: playerStats.performance
      },
      gameStats: {
        duration: this.formatDuration(this.results.duration),
        rounds: this.results.rounds
      }
    };

    logger.info(`Retrieved results for player ${playerId}:`, results);
    return results;
  }
}

module.exports = GameResults; 