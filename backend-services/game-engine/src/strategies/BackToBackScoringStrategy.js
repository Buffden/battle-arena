/**
 * Back-to-Back Scoring Strategy
 *
 * Concrete implementation: Calculates bonus for consecutive hits.
 * Each consecutive hit multiplies score by 1.5x
 */

const ScoringStrategy = require('./ScoringStrategy');

class BackToBackScoringStrategy extends ScoringStrategy {
  constructor(configurationManager) {
    super();
    this.configurationManager = configurationManager;
    this.consecutiveHits = new Map(); // matchId:playerId -> hit count
  }

  /**
   * Calculate accuracy score (not used in this strategy)
   * @returns {Promise<number>}
   */
  async calculateAccuracyScore() {
    return 0; // Not applicable for back-to-back strategy
  }

  /**
   * Calculate back-to-back hit bonus
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @returns {Promise<number>}
   */
  async calculateBackToBackBonus(matchId, playerId) {
    try {
      const key = `${matchId}:${playerId}`;
      const hitCount = this.consecutiveHits.get(key) || 0;

      // Bonus multiplier: 1 + (hitCount * 0.5)
      // 0 hits = 1x (0 bonus)
      // 1 hit = 1.5x (0.5x bonus)
      // 2 hits = 2x (1x bonus)
      // 3 hits = 2.5x (1.5x bonus)
      const multiplier = 1 + hitCount * 0.5;
      const bonus = (multiplier - 1) * 100; // Convert to points

      return Math.round(bonus);
    } catch (error) {
      throw new Error(`Back-to-back bonus calculation failed: ${error.message}`);
    }
  }

  /**
   * Record hit for back-to-back tracking
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @returns {void}
   */
  recordHit(matchId, playerId) {
    const key = `${matchId}:${playerId}`;
    const current = this.consecutiveHits.get(key) || 0;
    this.consecutiveHits.set(key, current + 1);
  }

  /**
   * Reset back-to-back counter (on miss)
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @returns {void}
   */
  resetCounter(matchId, playerId) {
    const key = `${matchId}:${playerId}`;
    this.consecutiveHits.delete(key);
  }

  /**
   * Calculate repositioning save score (not used in this strategy)
   * @returns {Promise<number>}
   */
  async calculateRepositioningSaveScore() {
    return 0; // Not applicable for back-to-back strategy
  }

  /**
   * Clean up match resources
   * @param {string} matchId - Match identifier
   * @returns {void}
   */
  cleanupMatch(matchId) {
    const keysToDelete = [];
    this.consecutiveHits.forEach((value, key) => {
      if (key.startsWith(`${matchId}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.consecutiveHits.delete(key));
  }
}

module.exports = BackToBackScoringStrategy;
