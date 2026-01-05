/**
 * Weapon Synergy System
 *
 * Main orchestrator for weapon synergy detection and application.
 * Uses Strategy Pattern to allow different synergy implementations.
 */

class WeaponSynergySystem {
  constructor(synergyStrategy, configurationManager) {
    this.synergyStrategy = synergyStrategy;
    this.configurationManager = configurationManager;
    this.lastWeapons = new Map(); // matchId:playerId -> last weapon used
  }

  /**
   * Check for weapon synergy
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @param {string} weaponId - Current weapon identifier
   * @returns {Promise<Object|null>}
   */
  async checkWeaponSynergy(matchId, playerId, weaponId) {
    try {
      const key = `${matchId}:${playerId}`;
      const previousWeapon = this.lastWeapons.get(key);

      if (!previousWeapon) {
        // No previous weapon, store current and return no synergy
        this.lastWeapons.set(key, weaponId);
        return null;
      }

      // Check for synergy
      const synergyResult = await this.synergyStrategy.checkSynergy(previousWeapon, weaponId);

      // Update last weapon
      this.lastWeapons.set(key, weaponId);

      return synergyResult;
    } catch (error) {
      throw new Error(`Synergy check failed: ${error.message}`);
    }
  }

  /**
   * Apply weapon synergy
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @param {Object} synergyResult - Synergy result from checkWeaponSynergy
   * @returns {Promise<Object>}
   */
  async applyWeaponSynergy(matchId, playerId, synergyResult) {
    try {
      return await this.synergyStrategy.applySynergy(synergyResult);
    } catch (error) {
      throw new Error(`Synergy application failed: ${error.message}`);
    }
  }

  /**
   * Reset synergy tracking for a player
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @returns {void}
   */
  resetWeaponTracking(matchId, playerId) {
    const key = `${matchId}:${playerId}`;
    this.lastWeapons.delete(key);
  }

  /**
   * Clean up match resources
   * @param {string} matchId - Match identifier
   * @returns {void}
   */
  cleanupMatch(matchId) {
    const keysToDelete = [];
    this.lastWeapons.forEach((value, key) => {
      if (key.startsWith(`${matchId}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.lastWeapons.delete(key));
  }
}

module.exports = WeaponSynergySystem;
