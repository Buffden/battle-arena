/**
 * Physics Strategy Interface
 *
 * Strategy Pattern: Defines interface for different physics calculation strategies.
 */

class PhysicsStrategy {
  /**
   * Calculate projectile trajectory
   * @param {string} _weaponId - Weapon identifier
   * @param {number} _angle - Launch angle (0-180 degrees)
   * @param {number} _power - Launch power (0-100)
   * @param {string} _arenaId - Arena identifier
   * @param {Object} _startPosition - Starting position {x, y}
   * @returns {Promise<ProjectileTrajectory>}
   */
  async calculateTrajectory(_weaponId, _angle, _power, _arenaId, _startPosition) {
    throw new Error('calculateTrajectory() must be implemented');
  }

  /**
   * Calculate projectile impact
   * @param {ProjectileTrajectory} _trajectory - Projectile trajectory
   * @param {Object} _targetPosition - Target position {x, y}
   * @returns {Promise<ImpactResult>}
   */
  async calculateImpact(_trajectory, _targetPosition) {
    throw new Error('calculateImpact() must be implemented');
  }
}

module.exports = PhysicsStrategy;
