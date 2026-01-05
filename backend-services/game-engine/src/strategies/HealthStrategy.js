/**
 * Health Strategy Interface
 *
 * Strategy Pattern: Defines interface for different health/damage calculation strategies.
 */

class HealthStrategy {
  /**
   * Calculate damage for a weapon hit
   * @param {string} _weaponId - Weapon identifier
   * @param {number} _accuracy - Hit accuracy (0-100)
   * @returns {Promise<number>} - Damage amount
   */
  async calculateDamage(_weaponId, _accuracy) {
    throw new Error('calculateDamage() must be implemented');
  }

  /**
   * Apply damage to player health
   * @param {number} _currentHealth - Current health
   * @param {number} _damage - Damage amount
   * @returns {Promise<Object>} - Health update result
   */
  async applyDamage(_currentHealth, _damage) {
    throw new Error('applyDamage() must be implemented');
  }
}

module.exports = HealthStrategy;
