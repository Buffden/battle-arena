/**
 * Physics Engine
 *
 * Main orchestrator for physics calculations.
 * Uses Strategy Pattern to allow different physics implementations.
 * Uses Adapter Pattern to wrap Matter.js.
 */

class PhysicsEngine {
  constructor(physicsStrategy, configurationManager) {
    this.physicsStrategy = physicsStrategy;
    this.configurationManager = configurationManager;
    this.worlds = new Map(); // matchId -> MatterJsAdapter instance
    this.projectiles = new Map(); // matchId -> Map<projectileId, projectile>
    this.updateLoops = new Map(); // matchId -> intervalId
  }

  /**
   * Create physics world for a match
   * @param {string} matchId - Match identifier
   * @param {string} arenaId - Arena identifier
   * @returns {Promise<Object>}
   */
  async createWorld(matchId, arenaId) {
    try {
      const gravity = await this.configurationManager.getArenaGravity(arenaId);

      const adapter = new (require('../adapters/MatterJsAdapter'))();
      adapter.initialize(gravity);

      this.worlds.set(matchId, adapter);
      this.projectiles.set(matchId, new Map());

      // Start physics update loop
      this.startUpdateLoop(matchId);

      return adapter.world;
    } catch (error) {
      throw new Error(`Failed to create physics world: ${error.message}`);
    }
  }

  /**
   * Calculate projectile trajectory
   * @param {string} weaponId - Weapon identifier
   * @param {number} angle - Launch angle (0-180 degrees)
   * @param {number} power - Launch power (0-100)
   * @param {string} arenaId - Arena identifier
   * @param {Object} startPosition - Starting position {x, y}
   * @returns {Promise<Object>}
   */
  async calculateTrajectory(weaponId, angle, power, arenaId, startPosition) {
    return await this.physicsStrategy.calculateTrajectory(
      weaponId,
      angle,
      power,
      arenaId,
      startPosition
    );
  }

  /**
   * Calculate projectile impact
   * @param {Object} trajectory - Projectile trajectory
   * @param {Object} targetPosition - Target position {x, y}
   * @returns {Promise<Object>}
   */
  async calculateImpact(trajectory, targetPosition) {
    return await this.physicsStrategy.calculateImpact(trajectory, targetPosition);
  }

  /**
   * Get arena gravity
   * @param {string} arenaId - Arena identifier
   * @returns {Promise<number>}
   */
  async getArenaGravity(arenaId) {
    return await this.configurationManager.getArenaGravity(arenaId);
  }

  /**
   * Fire projectile
   * @param {string} matchId - Match identifier
   * @param {string} weaponId - Weapon identifier
   * @param {number} angle - Launch angle
   * @param {number} power - Launch power
   * @param {Object} startPosition - Starting position
   * @returns {Promise<Object>}
   */
  async fireProjectile(matchId, weaponId, angle, power, startPosition) {
    try {
      const adapter = this.worlds.get(matchId);
      if (!adapter) {
        throw new Error(`Physics world not found for match ${matchId}`);
      }

      // Calculate initial velocity
      const radians = (angle * Math.PI) / 180;
      const maxVelocity = (power / 100) * 100;
      const velocity = {
        x: Math.cos(radians) * maxVelocity,
        y: -Math.sin(radians) * maxVelocity
      };

      // Create projectile body in physics engine
      const body = adapter.createProjectileBody(startPosition, velocity);

      // Store projectile
      const projectile = {
        id: body.id,
        weaponId,
        body,
        startPosition: { ...startPosition },
        startTime: Date.now(),
        firedAt: new Date().toISOString()
      };

      const projectiles = this.projectiles.get(matchId);
      projectiles.set(projectile.id, projectile);

      adapter.addBody(projectile.id, body);

      return projectile;
    } catch (error) {
      throw new Error(`Failed to fire projectile: ${error.message}`);
    }
  }

  /**
   * Start physics update loop
   * @param {string} matchId - Match identifier
   * @returns {void}
   */
  startUpdateLoop(matchId) {
    if (this.updateLoops.has(matchId)) {
      return; // Already running
    }

    const intervalId = setInterval(() => {
      const adapter = this.worlds.get(matchId);
      if (!adapter) {
        this.stopUpdateLoop(matchId);
        return;
      }

      try {
        // Update physics engine
        adapter.update(16.67); // ~60 FPS
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Physics update error for match ${matchId}:`, error);
        this.stopUpdateLoop(matchId);
      }
    }, 16.67); // ~60 FPS (1000/60)

    this.updateLoops.set(matchId, intervalId);
  }

  /**
   * Stop physics update loop
   * @param {string} matchId - Match identifier
   * @returns {void}
   */
  stopUpdateLoop(matchId) {
    const intervalId = this.updateLoops.get(matchId);
    if (intervalId) {
      clearInterval(intervalId);
      this.updateLoops.delete(matchId);
    }
  }

  /**
   * Clean up match resources
   * @param {string} matchId - Match identifier
   * @returns {void}
   */
  cleanupMatch(matchId) {
    this.stopUpdateLoop(matchId);
    this.worlds.delete(matchId);
    this.projectiles.delete(matchId);
  }

  /**
   * Get projectiles for a match
   * @param {string} matchId - Match identifier
   * @returns {Array<Object>}
   */
  getProjectiles(matchId) {
    const projectiles = this.projectiles.get(matchId);
    return projectiles ? Array.from(projectiles.values()) : [];
  }
}

module.exports = PhysicsEngine;
