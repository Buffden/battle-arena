/**
 * Default Weapon Synergy Strategy
 *
 * Concrete implementation: Handles weapon combo detection.
 * Example: gasoline + torch = increased damage and special effects
 */

const WeaponSynergyStrategy = require('./WeaponSynergyStrategy');

class DefaultWeaponSynergyStrategy extends WeaponSynergyStrategy {
  constructor(configurationManager) {
    super();
    this.configurationManager = configurationManager;

    // Define synergies
    this.synergies = new Map([
      ['gasoline|torch', { damageMultiplier: 1.5, effect: 'burn' }],
      ['water|ice', { damageMultiplier: 1.3, effect: 'freeze' }],
      ['stone|dynamite', { damageMultiplier: 1.4, effect: 'blast' }]
    ]);
  }

  /**
   * Check for weapon synergy
   * @param {string} previousWeaponId - Previous weapon used
   * @param {string} currentWeaponId - Current weapon being used
   * @returns {Promise<Object|null>}
   */
  async checkSynergy(previousWeaponId, currentWeaponId) {
    try {
      if (!previousWeaponId || !currentWeaponId) {
        return null;
      }

      // Check both orders (A|B and B|A)
      const combination1 = `${previousWeaponId}|${currentWeaponId}`;
      const combination2 = `${currentWeaponId}|${previousWeaponId}`;

      let synergyData = this.synergies.get(combination1);
      if (!synergyData) {
        synergyData = this.synergies.get(combination2);
      }

      if (synergyData) {
        return {
          previousWeapon: previousWeaponId,
          currentWeapon: currentWeaponId,
          synergy: synergyData,
          activated: true
        };
      }

      return null;
    } catch (error) {
      throw new Error(`Synergy check failed: ${error.message}`);
    }
  }

  /**
   * Apply weapon synergy effects
   * @param {Object} synergyResult - Synergy detection result
   * @returns {Promise<Object>}
   */
  async applySynergy(synergyResult) {
    try {
      if (!synergyResult || !synergyResult.activated) {
        return {
          applied: false
        };
      }

      const effect = synergyResult.synergy;

      return {
        applied: true,
        damageMultiplier: effect.damageMultiplier,
        specialEffect: effect.effect,
        previousWeapon: synergyResult.previousWeapon,
        currentWeapon: synergyResult.currentWeapon,
        visualEffect: this.getVisualEffect(effect.effect),
        appliedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Synergy application failed: ${error.message}`);
    }
  }

  /**
   * Get visual effect for synergy
   * @param {string} effectType - Type of effect
   * @returns {string}
   */
  getVisualEffect(effectType) {
    const effects = {
      burn: 'fire_explosion',
      freeze: 'ice_shatter',
      blast: 'rock_explosion'
    };

    return effects[effectType] || 'default_explosion';
  }

  /**
   * Register custom synergy
   * @param {string} weapon1 - First weapon
   * @param {string} weapon2 - Second weapon
   * @param {Object} synergyData - Synergy data {damageMultiplier, effect}
   * @returns {void}
   */
  registerSynergy(weapon1, weapon2, synergyData) {
    this.synergies.set(`${weapon1}|${weapon2}`, synergyData);
  }
}

module.exports = DefaultWeaponSynergyStrategy;
