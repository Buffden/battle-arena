/**
 * Matter.js Physics Strategy
 *
 * Concrete implementation of PhysicsStrategy using Matter.js.
 * Handles projectile trajectory calculation and impact detection.
 */
const PhysicsStrategy = require('./PhysicsStrategy');
const MatterJsAdapter = require('../adapters/MatterJsAdapter');

class MatterJsPhysicsStrategy extends PhysicsStrategy {
  constructor(configurationManager) {
    super();
    this.configurationManager = configurationManager;
    this.adapter = new MatterJsAdapter();
  }

  /**
   * Calculate projectile trajectory using physics equations
   * @param {string} weaponId - Weapon identifier
   * @param {number} angle - Launch angle (0-180 degrees)
   * @param {number} power - Launch power (0-100)
   * @param {string} arenaId - Arena identifier
   * @param {Object} startPosition - Starting position {x, y}
   * @returns {Promise<ProjectileTrajectory>}
   */
  async calculateTrajectory(weaponId, angle, power, arenaId, startPosition) {
    try {
      // Get arena gravity
      const gravity = await this.configurationManager.getArenaGravity(arenaId);

      // Get weapon properties
      const weaponProps = await this.configurationManager.getWeaponProperties(weaponId);

      // Convert angle to radians
      const radians = (angle * Math.PI) / 180;

      // Calculate initial velocity
      const maxVelocity = (power / 100) * (weaponProps.maxVelocity || 100);
      const vx = Math.cos(radians) * maxVelocity;
      const vy = -Math.sin(radians) * maxVelocity; // Negative because y increases downward

      // Simulate trajectory
      const path = [];
      let x = startPosition.x;
      let y = startPosition.y;
      let currentVx = vx;
      let currentVy = vy;
      let time = 0;
      const timeStep = 0.016; // ~60 FPS
      const maxTime = 10; // Max 10 seconds flight

      let maxHeight = y;
      let endPosition = { x, y };

      // Simulate until projectile lands
      while (time < maxTime && y >= 0) {
        // Record path point
        path.push({ x: Math.round(x), y: Math.round(y), time });

        // Apply gravity
        currentVy += gravity * timeStep;

        // Apply air resistance
        const resistance = 1 - (weaponProps.airResistance || 0.01);
        currentVx *= resistance;
        currentVy *= resistance;

        // Update position
        x += currentVx * timeStep * 100; // Scale factor
        y += currentVy * timeStep * 100;

        // Track max height
        if (y < maxHeight) {
          maxHeight = y;
        }

        time += timeStep;

        // Stop if projectile goes below ground
        if (y > 500) {
          // Arbitrary ground level
          endPosition = { x: Math.round(x), y: 500 };
          break;
        }
      }

      return {
        startPosition: { ...startPosition },
        endPosition,
        path: path.slice(0, 100), // Limit path points for performance
        flightTime: time,
        maxHeight,
        velocity: { x: currentVx, y: currentVy },
        angle,
        power,
        weaponId
      };
    } catch (error) {
      throw new Error(`Trajectory calculation failed: ${error.message}`);
    }
  }

  /**
   * Calculate projectile impact
   * @param {Object} trajectory - Projectile trajectory
   * @param {Object} targetPosition - Target position {x, y}
   * @returns {Promise<ImpactResult>}
   */
  async calculateImpact(trajectory, targetPosition) {
    try {
      // Find closest point on trajectory to target
      let minDistance = Infinity;
      let closestPoint = trajectory.endPosition;
      let impactIndex = trajectory.path.length - 1;

      trajectory.path.forEach((point, index) => {
        const distance = Math.sqrt(
          Math.pow(point.x - targetPosition.x, 2) + Math.pow(point.y - targetPosition.y, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = point;
          impactIndex = index;
        }
      });

      // Calculate impact velocity (magnitude of velocity at impact)
      const impactVelocity = Math.sqrt(
        Math.pow(trajectory.velocity.x, 2) + Math.pow(trajectory.velocity.y, 2)
      );

      return {
        projectile: {
          id: `proj_${Date.now()}`,
          weaponId: trajectory.weaponId
        },
        targetPosition,
        impactPosition: closestPoint,
        impactVelocity,
        distance: minDistance,
        collisionType: minDistance < 50 ? 'player' : 'terrain', // 50 unit hit radius
        trajectoryPath: trajectory.path.slice(0, impactIndex + 1)
      };
    } catch (error) {
      throw new Error(`Impact calculation failed: ${error.message}`);
    }
  }
}

module.exports = MatterJsPhysicsStrategy;
