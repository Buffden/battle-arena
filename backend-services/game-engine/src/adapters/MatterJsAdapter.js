/**
 * Matter.js Physics Adapter
 *
 * Adapter Pattern: Wraps Matter.js physics engine and provides clean interface.
 * Encapsulates Matter.js API and makes it easy to swap physics engines if needed.
 */

const Matter = require('matter-js');

class MatterJsAdapter {
  constructor(worldConfig = {}) {
    this.engine = null;
    this.world = null;
    this.bodies = new Map(); // id -> Matter.Body
    this.collisionCallbacks = [];

    this.config = {
      gravity: worldConfig.gravity || 0.001,
      airResistance: worldConfig.airResistance || 0.01,
      restitution: worldConfig.restitution || 0.5,
      ...worldConfig
    };
  }

  /**
   * Initialize Matter.js engine
   * @param {number} arenaGravity - Gravity value for arena
   * @returns {void}
   */
  initialize(arenaGravity) {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.world.gravity.y = arenaGravity || 0.001;
    this.world.gravity.x = 0;
  }

  /**
   * Create physics world for a game room
   * @param {number} arenaGravity - Gravity for this arena
   * @returns {Object}
   */
  createWorld(arenaGravity) {
    this.initialize(arenaGravity);
    return this.world;
  }

  /**
   * Create projectile body
   * @param {Object} position - {x, y}
   * @param {Object} velocity - {x, y}
   * @returns {Object} Matter.Body
   */
  createProjectileBody(position, velocity) {
    const body = Matter.Bodies.circle(position.x, position.y, 5, {
      frictionAir: this.config.airResistance,
      restitution: this.config.restitution,
      collisionFilter: {
        category: 0x0002, // Projectile
        mask: 0x0001 | 0x0004 // Collide with terrain and players
      }
    });
    Matter.Body.setVelocity(body, velocity);
    Matter.World.add(this.world, body);

    return body;
  }

  /**
   * Add body to physics world
   * @param {string} id - Body identifier
   * @param {Object} body - Body object
   * @returns {void}
   */
  addBody(id, body) {
    this.bodies.set(id, body);
  }

  /**
   * Update physics simulation
   * @param {number} deltaTime - Time delta in milliseconds
   * @returns {void}
   */
  update(deltaTime) {
    Matter.Engine.update(this.engine, deltaTime);
  }

  /**
   * Detect collisions
   * @param {Function} callback - Collision callback
   * @returns {void}
   */
  detectCollisions(callback) {
    Matter.Events.on(this.engine, 'collisionStart', event => {
      event.pairs.forEach(pair => {
        callback(pair.bodyA, pair.bodyB);
      });
    });
  }

  /**
   * Remove body from world
   * @param {string} id - Body identifier
   * @returns {void}
   */
  removeBody(id) {
    const body = this.bodies.get(id);
    if (body) {
      Matter.World.remove(this.world, body);
      this.bodies.delete(id);
    }
  }

  /**
   * Get body by id
   * @param {string} id - Body identifier
   * @returns {Object}
   */
  getBody(id) {
    return this.bodies.get(id);
  }

  /**
   * Generate unique id
   * @returns {string}
   */
  generateId() {
    return `body_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = MatterJsAdapter;
