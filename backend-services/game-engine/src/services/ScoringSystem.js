/**
 * Scoring System
 *
 * Main orchestrator for score calculations.
 * Uses Strategy Pattern to allow different scoring strategies.
 * Supports Decorator Pattern for score modifiers.
 */

class ScoringSystem {
  constructor(scoringStrategy, configurationManager) {
    this.scoringStrategy = scoringStrategy;
    this.configurationManager = configurationManager;
    this.playerScores = new Map(); // matchId -> Map<playerId, score>
    this.decorators = []; // Score modifiers (decorators)
  }

  /**
   * Initialize scores for a match
   * @param {string} matchId - Match identifier
   * @param {string} player1Id - Player 1 identifier
   * @param {string} player2Id - Player 2 identifier
   * @returns {void}
   */
  initializeScores(matchId, player1Id, player2Id) {
    const matchScores = new Map();
    matchScores.set(player1Id, 0);
    matchScores.set(player2Id, 0);
    this.playerScores.set(matchId, matchScores);
  }

  /**
   * Register score decorator (modifier)
   * @param {Object} decorator - Decorator object
   * @returns {void}
   */
  addDecorator(decorator) {
    this.decorators.push(decorator);
  }

  /**
   * Calculate accuracy score
   * @param {number} accuracy - Hit accuracy (0-100)
   * @returns {Promise<number>}
   */
  async calculateAccuracyScore(accuracy) {
    return await this.scoringStrategy.calculateAccuracyScore(accuracy);
  }

  /**
   * Calculate back-to-back hit bonus
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @returns {Promise<number>}
   */
  async calculateBackToBackBonus(matchId, playerId) {
    return await this.scoringStrategy.calculateBackToBackBonus(matchId, playerId);
  }

  /**
   * Calculate repositioning save score
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @param {Object} enemyShot - Enemy shot data
   * @returns {Promise<number>}
   */
  async calculateRepositioningSaveScore(matchId, playerId, enemyShot) {
    return await this.scoringStrategy.calculateRepositioningSaveScore(matchId, playerId, enemyShot);
  }

  /**
   * Calculate total score for an action
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @param {Object} action - Action details {accuracy, weaponId, etc}
   * @returns {Promise<number>}
   */
  async calculateTotalScore(matchId, playerId, action) {
    try {
      let score = 0;

      // Base accuracy score
      if (action.accuracy !== undefined) {
        score += await this.calculateAccuracyScore(action.accuracy);
      }

      // Back-to-back bonus
      if (action.isHit) {
        score += await this.calculateBackToBackBonus(matchId, playerId);
      }

      // Apply decorators (modifiers)
      for (const decorator of this.decorators) {
        score = await decorator.apply(score, action);
      }

      return Math.round(score);
    } catch (error) {
      throw new Error(`Total score calculation failed: ${error.message}`);
    }
  }

  /**
   * Add score to player
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @param {number} score - Score to add
   * @returns {number} - Total score for player
   */
  addScore(matchId, playerId, score) {
    const matchScores = this.playerScores.get(matchId);
    if (!matchScores) {
      throw new Error(`Match scores not found for ${matchId}`);
    }

    const currentScore = matchScores.get(playerId) || 0;
    const newScore = currentScore + score;
    matchScores.set(playerId, newScore);

    return newScore;
  }

  /**
   * Get player score
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @returns {number}
   */
  getScore(matchId, playerId) {
    const matchScores = this.playerScores.get(matchId);
    if (!matchScores) {
      return 0;
    }
    return matchScores.get(playerId) || 0;
  }

  /**
   * Get all scores for a match
   * @param {string} matchId - Match identifier
   * @returns {Object}
   */
  getMatchScores(matchId) {
    const matchScores = this.playerScores.get(matchId);
    if (!matchScores) {
      return {};
    }

    const result = {};
    matchScores.forEach((score, playerId) => {
      result[playerId] = score;
    });
    return result;
  }

  /**
   * Clean up match resources
   * @param {string} matchId - Match identifier
   * @returns {void}
   */
  cleanupMatch(matchId) {
    this.playerScores.delete(matchId);

    // Clean up decorator data
    this.decorators.forEach(decorator => {
      if (decorator.cleanup) {
        decorator.cleanup(matchId);
      }
    });
  }
}

module.exports = ScoringSystem;
