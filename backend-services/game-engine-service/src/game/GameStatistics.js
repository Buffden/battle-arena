const logger = require('../utils/logger');

class GameStatistics {
  constructor() {
    logger.info('Initializing game statistics');
    this.stats = {
      games: {
        total: 0,
        completed: 0,
        averageDuration: 0,
        totalDuration: 0
      },
      players: new Map(),
      rounds: {
        total: 0,
        average: 0,
        max: 0
      },
      shots: {
        total: 0,
        hits: 0,
        misses: 0,
        averageDamage: 0,
        totalDamage: 0
      },
      terrain: {
        totalGenerated: 0,
        averageHeight: 0,
        maxHeight: 0
      }
    };
  }

  /**
   * Update statistics for a completed game
   * @param {Object} gameData - Game data including results and replay
   */
  updateGameStats(gameData) {
    logger.info('Updating game statistics');
    try {
      // Update game stats
      this.stats.games.total++;
      this.stats.games.completed++;
      this.stats.games.totalDuration += gameData.duration;
      this.stats.games.averageDuration = this.stats.games.totalDuration / this.stats.games.completed;

      // Update round stats
      const roundCount = gameData.replay.turns.length;
      this.stats.rounds.total += roundCount;
      this.stats.rounds.average = this.stats.rounds.total / this.stats.games.completed;
      this.stats.rounds.max = Math.max(this.stats.rounds.max, roundCount);

      // Update shot stats
      const shots = gameData.replay.turns.filter(turn => turn.action === 'shoot');
      this.stats.shots.total += shots.length;
      this.stats.shots.hits += shots.filter(shot => shot.shotData?.damage > 0).length;
      this.stats.shots.misses += shots.filter(shot => shot.shotData?.damage === 0).length;
      this.stats.shots.totalDamage += shots.reduce((sum, shot) => sum + (shot.shotData?.damage || 0), 0);
      this.stats.shots.averageDamage = this.stats.shots.totalDamage / this.stats.shots.total;

      // Update terrain stats
      const terrain = gameData.replay.terrain;
      this.stats.terrain.totalGenerated++;
      this.stats.terrain.averageHeight = 
        (this.stats.terrain.averageHeight * (this.stats.terrain.totalGenerated - 1) + 
         terrain.reduce((sum, height) => sum + height, 0) / terrain.length) / 
        this.stats.terrain.totalGenerated;
      this.stats.terrain.maxHeight = Math.max(this.stats.terrain.maxHeight, ...terrain);

      // Update player stats
      gameData.replay.players.forEach(player => {
        this.updatePlayerStats(player.id, gameData);
      });

      logger.info('Game statistics updated successfully');
    } catch (error) {
      logger.error('Error updating game statistics:', error);
      throw error;
    }
  }

  /**
   * Update statistics for a specific player
   * @param {string} playerId - Player ID
   * @param {Object} gameData - Game data
   */
  updatePlayerStats(playerId, gameData) {
    logger.debug(`Updating statistics for player ${playerId}`);
    if (!this.stats.players.has(playerId)) {
      this.stats.players.set(playerId, {
        games: {
          total: 0,
          won: 0,
          lost: 0,
          averageDuration: 0,
          totalDuration: 0
        },
        shots: {
          total: 0,
          hits: 0,
          misses: 0,
          accuracy: 0,
          averageDamage: 0,
          totalDamage: 0
        },
        movement: {
          total: 0,
          averageDistance: 0,
          totalDistance: 0
        },
        performance: {
          winRate: 0,
          averageScore: 0,
          totalScore: 0
        }
      });
    }

    const playerStats = this.stats.players.get(playerId);
    const playerTurns = gameData.replay.turns.filter(turn => turn.playerId === playerId);
    const playerShots = playerTurns.filter(turn => turn.action === 'shoot');
    const playerMoves = playerTurns.filter(turn => turn.action === 'move');

    // Update game stats
    playerStats.games.total++;
    playerStats.games.totalDuration += gameData.duration;
    playerStats.games.averageDuration = playerStats.games.totalDuration / playerStats.games.total;
    if (gameData.results.winner === playerId) {
      playerStats.games.won++;
    } else {
      playerStats.games.lost++;
    }
    playerStats.games.winRate = playerStats.games.won / playerStats.games.total;

    // Update shot stats
    playerStats.shots.total += playerShots.length;
    playerStats.shots.hits += playerShots.filter(shot => shot.shotData?.damage > 0).length;
    playerStats.shots.misses += playerShots.filter(shot => shot.shotData?.damage === 0).length;
    playerStats.shots.accuracy = playerStats.shots.hits / playerStats.shots.total;
    playerStats.shots.totalDamage += playerShots.reduce((sum, shot) => sum + (shot.shotData?.damage || 0), 0);
    playerStats.shots.averageDamage = playerStats.shots.totalDamage / playerStats.shots.total;

    // Update movement stats
    playerStats.movement.total += playerMoves.length;
    const totalDistance = playerMoves.reduce((sum, move) => {
      const dx = move.moveData.to.x - move.moveData.from.x;
      const dy = move.moveData.to.y - move.moveData.from.y;
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);
    playerStats.movement.totalDistance += totalDistance;
    playerStats.movement.averageDistance = playerStats.movement.totalDistance / playerStats.movement.total;

    // Update performance stats
    const playerResult = gameData.results.players.find(p => p.id === playerId);
    if (playerResult) {
      playerStats.performance.totalScore += playerResult.score;
      playerStats.performance.averageScore = playerStats.performance.totalScore / playerStats.games.total;
    }

    logger.debug(`Player ${playerId} statistics updated successfully`);
  }

  /**
   * Get overall game statistics
   * @returns {Object} Game statistics
   */
  getGameStats() {
    logger.debug('Getting overall game statistics');
    return {
      games: { ...this.stats.games },
      rounds: { ...this.stats.rounds },
      shots: { ...this.stats.shots },
      terrain: { ...this.stats.terrain }
    };
  }

  /**
   * Get statistics for a specific player
   * @param {string} playerId - Player ID
   * @returns {Object} Player statistics
   */
  getPlayerStats(playerId) {
    logger.debug(`Getting statistics for player ${playerId}`);
    const playerStats = this.stats.players.get(playerId);
    if (!playerStats) {
      logger.warn(`No statistics found for player ${playerId}`);
      return null;
    }
    return { ...playerStats };
  }

  /**
   * Get statistics for multiple players
   * @param {Array} playerIds - Array of player IDs
   * @returns {Object} Map of player statistics
   */
  getMultiplePlayerStats(playerIds) {
    logger.debug(`Getting statistics for ${playerIds.length} players`);
    const stats = new Map();
    playerIds.forEach(playerId => {
      const playerStats = this.getPlayerStats(playerId);
      if (playerStats) {
        stats.set(playerId, playerStats);
      }
    });
    return stats;
  }

  /**
   * Get top players by a specific metric
   * @param {string} metric - Metric to sort by (e.g., 'winRate', 'accuracy', 'averageDamage')
   * @param {number} limit - Number of players to return
   * @returns {Array} Array of player statistics sorted by metric
   */
  getTopPlayers(metric, limit = 10) {
    logger.debug(`Getting top ${limit} players by ${metric}`);
    const players = Array.from(this.stats.players.entries())
      .map(([id, stats]) => ({
        id,
        ...stats
      }))
      .sort((a, b) => {
        const aValue = this.getMetricValue(a, metric);
        const bValue = this.getMetricValue(b, metric);
        return bValue - aValue;
      })
      .slice(0, limit);

    return players;
  }

  /**
   * Get value for a specific metric
   * @param {Object} stats - Player statistics
   * @param {string} metric - Metric name
   * @returns {number} Metric value
   */
  getMetricValue(stats, metric) {
    switch (metric) {
      case 'winRate':
        return stats.games.winRate;
      case 'accuracy':
        return stats.shots.accuracy;
      case 'averageDamage':
        return stats.shots.averageDamage;
      case 'averageScore':
        return stats.performance.averageScore;
      case 'gamesPlayed':
        return stats.games.total;
      case 'totalDamage':
        return stats.shots.totalDamage;
      default:
        return 0;
    }
  }

  /**
   * Reset all statistics
   */
  resetStats() {
    logger.info('Resetting all game statistics');
    this.stats = {
      games: {
        total: 0,
        completed: 0,
        averageDuration: 0,
        totalDuration: 0
      },
      players: new Map(),
      rounds: {
        total: 0,
        average: 0,
        max: 0
      },
      shots: {
        total: 0,
        hits: 0,
        misses: 0,
        averageDamage: 0,
        totalDamage: 0
      },
      terrain: {
        totalGenerated: 0,
        averageHeight: 0,
        maxHeight: 0
      }
    };
  }
}

module.exports = GameStatistics; 