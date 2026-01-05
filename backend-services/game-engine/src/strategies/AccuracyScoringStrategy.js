/**
 * Accuracy Scoring Strategy
 *
 * Concrete implementation: Calculates accuracy-based score.
 * Higher accuracy = higher score (0-100 scale)
 */

const ScoringStrategy = require('./ScoringStrategy');

class AccuracyScoringStrategy extends ScoringStrategy {
  /**
   * Calculate accuracy score
   * @param {number} accuracy - Accuracy 0-100
   * @returns {Promise<number>}
   */
  async calculateAccuracyScore(accuracy) {
    try {
      // Accuracy 100% = 100 points
      // Accuracy 50% = 50 points
      // Accuracy 0% = 0 points
      return Math.round(accuracy);
    } catch (error) {
      throw new Error(`Accuracy score calculation failed: ${error.message}`);
    }
  }

  /**
   * Calculate back-to-back hit bonus (not used in this strategy)
   * @returns {Promise<number>}
   */
  async calculateBackToBackBonus() {
    return 0; // Not applicable for accuracy strategy
  }

  /**
   * Calculate repositioning save score (not used in this strategy)
   * @returns {Promise<number>}
   */
  async calculateRepositioningSaveScore() {
    return 0; // Not applicable for accuracy strategy
  }
}

module.exports = AccuracyScoringStrategy;
