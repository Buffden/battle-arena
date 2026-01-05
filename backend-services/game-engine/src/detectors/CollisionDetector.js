/**
 * Collision Detector
 *
 * Detects collisions between projectiles and terrain/players.
 * Calculates hit accuracy based on distance from target center.
 * Triggers damage and scoring calculations.
 */

class CollisionDetector {
  constructor(physicsEngine) {
    this.physicsEngine = physicsEngine;
    this.collisionCallbacks = [];
    this.activeCollisions = new Map(); // matchId -> collisions
  }

  /**
   * Register collision callback
   * @param {Function} callback - Callback function
   * @returns {void}
   */
  onCollision(callback) {
    this.collisionCallbacks.push(callback);
  }

  /**
   * Detect collisions for a match
   * @param {string} matchId - Match identifier
   * @param {Array<Object>} projectiles - List of projectiles
   * @param {Array<Object>} players - List of players with positions
   * @returns {Array<Object>} - Array of collision results
   */
  detectCollisions(matchId, projectiles, players) {
    const collisions = [];

    projectiles.forEach(projectile => {
      // Check collision with terrain (simplified: check if y > 500)
      if (projectile.body.position.y > 500) {
        collisions.push({
          projectileId: projectile.id,
          type: 'terrain',
          position: projectile.body.position,
          timestamp: Date.now()
        });
        return;
      }

      // Check collision with players
      players.forEach(player => {
        const distance = this.calculateDistance(projectile.body.position, player.position);

        // Hit radius: 50 units
        if (distance < 50) {
          const hitAccuracy = this.calculateHitAccuracy(
            projectile.body.position,
            player.position,
            player.heroRadius || 25
          );

          collisions.push({
            projectileId: projectile.id,
            weaponId: projectile.weaponId,
            targetPlayerId: player.id,
            type: 'player',
            position: projectile.body.position,
            targetPosition: player.position,
            distance,
            hitAccuracy,
            impactVelocity: Math.sqrt(
              Math.pow(projectile.body.velocity.x, 2) + Math.pow(projectile.body.velocity.y, 2)
            ),
            timestamp: Date.now()
          });
        }
      });
    });

    // Store collisions
    if (collisions.length > 0) {
      this.activeCollisions.set(matchId, collisions);

      // Trigger callbacks
      collisions.forEach(collision => {
        this.collisionCallbacks.forEach(callback => {
          try {
            callback(collision);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Collision callback error:', error);
          }
        });
      });
    }

    return collisions;
  }

  /**
   * Calculate distance between two points
   * @param {Object} point1 - {x, y}
   * @param {Object} point2 - {x, y}
   * @returns {number}
   */
  calculateDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
  }

  /**
   * Calculate hit accuracy (0-100, where 100 is center hit)
   * @param {Object} impactPosition - Impact position {x, y}
   * @param {Object} targetCenter - Target center {x, y}
   * @param {number} targetRadius - Target radius
   * @returns {number} - Accuracy 0-100
   */
  calculateHitAccuracy(impactPosition, targetCenter, targetRadius) {
    const distance = this.calculateDistance(impactPosition, targetCenter);
    const maxDistance = targetRadius * 2;

    // 100% accuracy at center, 0% at edge
    const accuracy = Math.max(0, 100 - (distance / maxDistance) * 100);
    return Math.round(accuracy);
  }

  /**
   * Get collision details
   * @param {string} matchId - Match identifier
   * @returns {Array<Object>}
   */
  getCollisions(matchId) {
    return this.activeCollisions.get(matchId) || [];
  }

  /**
   * Clear collisions for a match
   * @param {string} matchId - Match identifier
   * @returns {void}
   */
  clearCollisions(matchId) {
    this.activeCollisions.delete(matchId);
  }
}

module.exports = CollisionDetector;
