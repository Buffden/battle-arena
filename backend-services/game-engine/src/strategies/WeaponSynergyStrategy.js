/**
 * Weapon Synergy Strategy Interface
 *
 * Strategy Pattern: Defines interface for weapon synergy detection and application.
 */

class WeaponSynergyStrategy {
  /**
   * Check for weapon synergy
   * @param {string} _previousWeaponId - Previous weapon used
   * @param {string} _currentWeaponId - Current weapon being used
   * @returns {Promise<Object|null>} - Synergy result or null if no synergy
   */
  async checkSynergy(_previousWeaponId, _currentWeaponId) {
    throw new Error('checkSynergy() must be implemented');
  }

  /**
   * Apply weapon synergy effects
   * @param {Object} _synergyResult - Synergy detection result
   * @returns {Promise<Object>} - Synergy effect details
   */
  async applySynergy(_synergyResult) {
    throw new Error('applySynergy() must be implemented');
  }
}

module.exports = WeaponSynergyStrategy;
