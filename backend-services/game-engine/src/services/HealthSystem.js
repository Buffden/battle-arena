/**
 * Health System
 *
 * Main orchestrator for player health management.
 * Uses Strategy Pattern to allow different health calculation strategies.
 * Manages player health state and damage application.
 */

class HealthSystem {
  constructor(healthStrategy, configurationManager) {
    this.healthStrategy = healthStrategy;
    this.configurationManager = configurationManager;
    this.playerHealth = new Map(); // matchId -> Map<playerId, health>
  }

  /**
   * Initialize player health for a match
   * @param {string} matchId - Match identifier
   * @param {Object} player1 - Player 1 {id, heroType}
   * @param {Object} player2 - Player 2 {id, heroType}
   * @returns {Promise<Object>}
   */
  async initializeHealth(matchId, player1, player2) {
    try {
      const health1 = await this.getStartingHP(player1.heroType);
      const health2 = await this.getStartingHP(player2.heroType);

      const matchHealth = new Map();
      matchHealth.set(player1.id, health1);
      matchHealth.set(player2.id, health2);

      this.playerHealth.set(matchId, matchHealth);

      return {
        [player1.id]: health1,
        [player2.id]: health2
      };
    } catch (error) {
      throw new Error(`Health initialization failed: ${error.message}`);
    }
  }

  /**
   * Get starting HP for hero type
   * @param {string} heroType - Hero type
   * @returns {Promise<number>}
   */
  async getStartingHP(heroType) {
    const heroConfig = await this.configurationManager.getHeroProperties(heroType);
    return heroConfig.health || 100;
  }

  /**
   * Calculate damage for a weapon hit
   * @param {string} weaponId - Weapon identifier
   * @param {number} accuracy - Hit accuracy (0-100)
   * @returns {Promise<number>}
   */
  async calculateDamage(weaponId, accuracy) {
    return await this.healthStrategy.calculateDamage(weaponId, accuracy);
  }

  /**
   * Apply damage to player
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @param {number} damage - Damage amount
   * @returns {Promise<Object>}
   */
  async applyDamage(matchId, playerId, damage) {
    try {
      const matchHealth = this.playerHealth.get(matchId);
      if (!matchHealth) {
        throw new Error(`Match health not found for ${matchId}`);
      }

      const currentHealth = matchHealth.get(playerId) || 0;
      const healthUpdate = await this.healthStrategy.applyDamage(currentHealth, damage);

      // Update stored health
      matchHealth.set(playerId, healthUpdate.newHealth);

      return {
        playerId,
        ...healthUpdate
      };
    } catch (error) {
      throw new Error(`Failed to apply damage: ${error.message}`);
    }
  }

  /**
   * Check if player is dead
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @returns {Promise<boolean>}
   */
  async isPlayerDead(matchId, playerId) {
    try {
      const matchHealth = this.playerHealth.get(matchId);
      if (!matchHealth) {
        return false;
      }

      const health = matchHealth.get(playerId) || 0;
      return health <= 0;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  /**
   * Get player health
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @returns {number}
   */
  getPlayerHealth(matchId, playerId) {
    const matchHealth = this.playerHealth.get(matchId);
    if (!matchHealth) {
      return 0;
    }
    return matchHealth.get(playerId) || 0;
  }

  /**
   * Get all player health for a match
   * @param {string} matchId - Match identifier
   * @returns {Object}
   */
  getMatchHealth(matchId) {
    const matchHealth = this.playerHealth.get(matchId);
    if (!matchHealth) {
      return {};
    }

    const result = {};
    matchHealth.forEach((health, playerId) => {
      result[playerId] = health;
    });
    return result;
  }

  /**
   * Clean up match resources
   * @param {string} matchId - Match identifier
   * @returns {void}
   */
  cleanupMatch(matchId) {
    this.playerHealth.delete(matchId);
  }
}

module.exports = HealthSystem;
