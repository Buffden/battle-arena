const logger = require('../utils/logger');

class PhysicsEngine {
  constructor() {
    this.gravity = 9.8;
    this.wind = 0;
    this.terrain = this.generateTerrain();
  }

  /**
   * Generate terrain with hills and valleys
   * @returns {Array} Array of terrain points
   */
  generateTerrain() {
    const points = [];
    const width = 800;
    const height = 400;
    const segments = 20;
    const segmentWidth = width / segments;

    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      // Generate a smooth terrain using sine waves
      const y = height - 50 + Math.sin(i * 0.5) * 30 + Math.sin(i * 0.2) * 15;
      points.push({ x, y });
    }

    return points;
  }

  /**
   * Calculate projectile trajectory
   * @param {Object} start - Starting position {x, y}
   * @param {number} angle - Launch angle in degrees
   * @param {number} power - Launch power
   * @param {number} timeStep - Time step for simulation
   * @returns {Array} Array of trajectory points
   */
  calculateTrajectory(start, angle, power, timeStep = 0.1) {
    const trajectory = [];
    const radians = (angle * Math.PI) / 180;
    const velocity = {
      x: Math.cos(radians) * power,
      y: Math.sin(radians) * power
    };

    let position = { ...start };
    let time = 0;

    while (position.y < 400 && time < 10) { // Max height of 400 and 10 seconds
      trajectory.push({ ...position });

      // Update position
      position.x += velocity.x * timeStep;
      position.y += velocity.y * timeStep;

      // Apply gravity
      velocity.y -= this.gravity * timeStep;

      // Apply wind
      velocity.x += this.wind * timeStep;

      time += timeStep;
    }

    return trajectory;
  }

  /**
   * Check if a point is inside the terrain
   * @param {Object} point - Point to check {x, y}
   * @returns {boolean} True if point is inside terrain
   */
  isPointInTerrain(point) {
    // Find the two terrain points that surround the x coordinate
    const leftPoint = this.terrain.findLast(p => p.x <= point.x);
    const rightPoint = this.terrain.find(p => p.x > point.x);

    if (!leftPoint || !rightPoint) return false;

    // Linear interpolation to find terrain height at point.x
    const ratio = (point.x - leftPoint.x) / (rightPoint.x - leftPoint.x);
    const terrainHeight = leftPoint.y + (rightPoint.y - leftPoint.y) * ratio;

    return point.y >= terrainHeight;
  }

  /**
   * Calculate damage based on impact velocity and distance
   * @param {Object} impact - Impact point {x, y}
   * @param {Object} target - Target position {x, y}
   * @param {number} velocity - Impact velocity
   * @returns {number} Damage amount
   */
  calculateDamage(impact, target, velocity) {
    const distance = Math.sqrt(
      Math.pow(impact.x - target.x, 2) + Math.pow(impact.y - target.y, 2)
    );
    const baseDamage = Math.min(velocity * 0.5, 100); // Max 100 damage
    const distanceFactor = Math.max(0, 1 - distance / 200); // Damage reduces with distance
    return Math.round(baseDamage * distanceFactor);
  }

  /**
   * Update wind direction and strength
   * @param {number} newWind - New wind value
   */
  updateWind(newWind) {
    this.wind = newWind;
    logger.info(`Wind updated to ${newWind}`);
  }

  /**
   * Get terrain height at a specific x coordinate
   * @param {number} x - X coordinate
   * @returns {number} Terrain height
   */
  getTerrainHeight(x) {
    const leftPoint = this.terrain.findLast(p => p.x <= x);
    const rightPoint = this.terrain.find(p => p.x > x);

    if (!leftPoint || !rightPoint) return 400; // Default height

    const ratio = (x - leftPoint.x) / (rightPoint.x - leftPoint.x);
    return leftPoint.y + (rightPoint.y - leftPoint.y) * ratio;
  }

  /**
   * Check if a movement is valid
   * @param {Object} currentPos - Current position {x, y}
   * @param {Object} newPos - New position {x, y}
   * @returns {boolean} True if movement is valid
   */
  isValidMovement(currentPos, newPos) {
    // Check if new position is within bounds
    if (newPos.x < 0 || newPos.x > 800 || newPos.y < 0 || newPos.y > 400) {
      return false;
    }

    // Check if new position is above terrain
    const terrainHeight = this.getTerrainHeight(newPos.x);
    if (newPos.y < terrainHeight) {
      return false;
    }

    // Check if movement distance is reasonable (prevent teleporting)
    const distance = Math.sqrt(
      Math.pow(newPos.x - currentPos.x, 2) + Math.pow(newPos.y - currentPos.y, 2)
    );
    return distance <= 50; // Max movement distance of 50 units
  }
}

module.exports = PhysicsEngine; 