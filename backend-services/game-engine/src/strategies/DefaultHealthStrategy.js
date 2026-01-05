/**
 * Default Health Strategy
 *
 * Concrete implementation of HealthStrategy.
 * Calculates damage based on weapon properties and hit accuracy.
 */

const HealthStrategy = require('./HealthStrategy');

class DefaultHealthStrategy extends HealthStrategy {
  constructor(configurationManager) {
    super();
    this.configurationManager = configurationManager;
  }

  /**
   * Calculate damage for a weapon hit
   * @param {string} weaponId - Weapon identifier
   * @param {number} accuracy - Hit accuracy (0-100)
   * @returns {Promise<number>}
   */
  async calculateDamage(weaponId, accuracy) {
    try {
      const weaponProps = await this.configurationManager.getWeaponProperties(weaponId);

      // Base damage modified by accuracy
      const baseDamage = weaponProps.baseDamage || 10;
      const accuracyMultiplier = accuracy / 100;

      // Damage calculation: base damage * accuracy
      const damage = Math.round(baseDamage * accuracyMultiplier);

      return Math.max(0, damage);
    } catch (error) {
      throw new Error(`Damage calculation failed: ${error.message}`);
    }
  }

  /**
   * Apply damage to player health
   * @param {number} currentHealth - Current health
   * @param {number} damage - Damage amount
   * @returns {Promise<Object>}
   */
  async applyDamage(currentHealth, damage) {
    const newHealth = Math.max(0, currentHealth - damage);
    const isDead = newHealth === 0;

    return {
      previousHealth: currentHealth,
      damage,
      newHealth,
      isDead,
      damageAppliedAt: new Date().toISOString()
    };
  }
}

module.exports = DefaultHealthStrategy;
