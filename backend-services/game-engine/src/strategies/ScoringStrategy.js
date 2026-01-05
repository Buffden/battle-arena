/**
 * Scoring Strategy Interface
 *
 * Strategy Pattern: Defines interface for different scoring calculation strategies.
 */

class ScoringStrategy {
  /**
   * Calculate accuracy score
   * @param {number} _hitArea - Hit area size
   * @param {number} _maxHitArea - Maximum hit area
   * @returns {Promise<number>}
   */
  async calculateAccuracyScore(_hitArea, _maxHitArea) {
    throw new Error('calculateAccuracyScore() must be implemented');
  }

  /**
   * Calculate back-to-back hit bonus
   * @param {string} _matchId - Match identifier
   * @param {string} _playerId - Player identifier
   * @returns {Promise<number>}
   */
  async calculateBackToBackBonus(_matchId, _playerId) {
    throw new Error('calculateBackToBackBonus() must be implemented');
  }

  /**
   * Calculate repositioning save score
   * @param {string} _matchId - Match identifier
   * @param {string} _playerId - Player identifier
   * @param {Object} _enemyShot - Enemy shot data
   * @returns {Promise<number>}
   */
  async calculateRepositioningSaveScore(_matchId, _playerId, _enemyShot) {
    throw new Error('calculateRepositioningSaveScore() must be implemented');
  }
}

module.exports = ScoringStrategy;
