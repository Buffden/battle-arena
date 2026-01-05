/**
 * Firing Data Models
 *
 * Data classes for firing mechanism:
 * - Input: FireRequest
 * - Physics: ProjectileTrajectory, ImpactResult, Projectile
 * - Collision: CollisionResult
 * - Output: FireResult
 */

/**
 * Fire Request - Input data for firing
 */
class FireRequest {
  constructor(matchId, playerId, angle, power, weaponId) {
    this.matchId = matchId;
    this.playerId = playerId;
    this.angle = angle; // 0-180 degrees
    this.power = power; // 0-100
    this.weaponId = weaponId;
    this.requestedAt = new Date().toISOString();
  }

  validate() {
    if (!this.matchId) throw new Error('matchId required');
    if (!this.playerId) throw new Error('playerId required');
    if (typeof this.angle !== 'number' || this.angle < 0 || this.angle > 180)
      throw new Error('angle must be 0-180');
    if (typeof this.power !== 'number' || this.power < 0 || this.power > 100)
      throw new Error('power must be 0-100');
    if (!this.weaponId) throw new Error('weaponId required');
    return true;
  }
}

/**
 * Projectile - Active projectile in physics world
 */
class Projectile {
  constructor(id, weaponId, body, startPosition, firedByPlayerId) {
    this.id = id;
    this.weaponId = weaponId;
    this.body = body; // Matter.Body
    this.startPosition = startPosition;
    this.startTime = Date.now();
    this.firedByPlayerId = firedByPlayerId;
    this.firedAt = new Date().toISOString();
  }
}

/**
 * Projectile Trajectory - Calculated flight path
 */
class ProjectileTrajectory {
  constructor(
    startPosition,
    endPosition,
    path,
    flightTime,
    maxHeight,
    velocity,
    angle,
    power,
    weaponId
  ) {
    this.startPosition = startPosition; // {x, y}
    this.endPosition = endPosition; // {x, y}
    this.path = path; // Array of {x, y, time}
    this.flightTime = flightTime;
    this.maxHeight = maxHeight;
    this.velocity = velocity; // {x, y}
    this.angle = angle;
    this.power = power;
    this.weaponId = weaponId;
  }
}

/**
 * Impact Result - Collision impact details
 */
class ImpactResult {
  constructor(
    projectile,
    targetPosition,
    impactPosition,
    impactVelocity,
    distance,
    collisionType,
    trajectoryPath
  ) {
    this.projectile = projectile;
    this.targetPosition = targetPosition; // {x, y}
    this.impactPosition = impactPosition; // {x, y}
    this.impactVelocity = impactVelocity;
    this.distance = distance; // Distance from target
    this.collisionType = collisionType; // 'player' | 'terrain'
    this.trajectoryPath = trajectoryPath;
  }
}

/**
 * Collision Result - Detected collision
 */
class CollisionResult {
  constructor(
    projectileId,
    weaponId,
    targetPlayerId,
    type,
    position,
    targetPosition,
    distance,
    hitAccuracy,
    impactVelocity
  ) {
    this.projectileId = projectileId;
    this.weaponId = weaponId;
    this.targetPlayerId = targetPlayerId;
    this.type = type; // 'player' | 'terrain'
    this.position = position; // {x, y}
    this.targetPosition = targetPosition; // {x, y}
    this.distance = distance;
    this.hitAccuracy = hitAccuracy; // 0-100
    this.impactVelocity = impactVelocity;
    this.collectedAt = new Date().toISOString();
  }
}

/**
 * Health Update - Result of damage application
 */
class HealthUpdate {
  constructor(playerId, previousHealth, damage, newHealth, isDead) {
    this.playerId = playerId;
    this.previousHealth = previousHealth;
    this.damage = damage;
    this.newHealth = newHealth;
    this.isDead = isDead;
    this.appliedAt = new Date().toISOString();
  }
}

/**
 * Synergy Effect - Applied weapon synergy
 */
class SynergyEffect {
  constructor(
    applied,
    damageMultiplier,
    specialEffect,
    previousWeapon,
    currentWeapon,
    visualEffect
  ) {
    this.applied = applied;
    this.damageMultiplier = damageMultiplier || 1.0;
    this.specialEffect = specialEffect || null;
    this.previousWeapon = previousWeapon || null;
    this.currentWeapon = currentWeapon || null;
    this.visualEffect = visualEffect || null;
    this.appliedAt = new Date().toISOString();
  }
}

/**
 * Fire Result - Complete firing outcome
 */
class FireResult {
  constructor(
    success,
    projectile,
    trajectory,
    collision,
    damageApplied,
    scoreGained,
    synergyApplied,
    gameState,
    error = null
  ) {
    this.success = success;
    this.projectile = projectile;
    this.trajectory = trajectory;
    this.collision = collision;
    this.damageApplied = damageApplied;
    this.scoreGained = scoreGained;
    this.synergyApplied = synergyApplied;
    this.gameState = gameState;
    this.error = error;
    this.completedAt = new Date().toISOString();
  }
}

module.exports = {
  FireRequest,
  Projectile,
  ProjectileTrajectory,
  ImpactResult,
  CollisionResult,
  HealthUpdate,
  SynergyEffect,
  FireResult
};
