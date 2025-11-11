const logger = require('../utils/logger');

class ActionHandler {
  constructor(physicsEngine) {
    this.physicsEngine = physicsEngine;
    this.actionTypes = {
      MOVE: 'move',
      SHOOT: 'shoot',
      ADJUST_POWER: 'adjust_power',
      ADJUST_ANGLE: 'adjust_angle'
    };
  }

  /**
   * Handle a player action
   * @param {Object} gameState - Current game state
   * @param {string} playerId - Player ID
   * @param {Object} action - Action to handle
   * @returns {Object} Updated game state
   */
  handleAction(gameState, playerId, action) {
    if (gameState.currentTurn !== playerId) {
      throw new Error('Not your turn');
    }

    const playerState = gameState.playerStates.find(p => p.id === playerId);
    if (!playerState) {
      throw new Error('Player not found');
    }

    switch (action.type) {
      case this.actionTypes.MOVE:
        return this.handleMove(gameState, playerId, action);
      case this.actionTypes.SHOOT:
        return this.handleShoot(gameState, playerId, action);
      case this.actionTypes.ADJUST_POWER:
        return this.handleAdjustPower(gameState, playerId, action);
      case this.actionTypes.ADJUST_ANGLE:
        return this.handleAdjustAngle(gameState, playerId, action);
      default:
        throw new Error('Invalid action type');
    }
  }

  /**
   * Handle movement action
   * @param {Object} gameState - Current game state
   * @param {string} playerId - Player ID
   * @param {Object} action - Movement action
   * @returns {Object} Updated game state
   */
  handleMove(gameState, playerId, action) {
    const playerState = gameState.playerStates.find(p => p.id === playerId);
    const newPosition = action.position;

    if (!this.physicsEngine.isValidMovement(playerState.position, newPosition)) {
      throw new Error('Invalid movement');
    }

    playerState.position = newPosition;
    logger.info(`Player ${playerId} moved to ${JSON.stringify(newPosition)}`);
    return gameState;
  }

  /**
   * Handle shooting action
   * @param {Object} gameState - Current game state
   * @param {string} playerId - Player ID
   * @param {Object} action - Shooting action
   * @returns {Object} Updated game state
   */
  handleShoot(gameState, playerId, action) {
    const playerState = gameState.playerStates.find(p => p.id === playerId);
    const { angle, power } = action;

    // Validate angle and power
    if (angle < 0 || angle > 180 || power < 0 || power > 100) {
      throw new Error('Invalid angle or power');
    }

    // Calculate trajectory
    const trajectory = this.physicsEngine.calculateTrajectory(
      playerState.position,
      angle,
      power
    );

    // Find impact point
    const impact = this.findImpactPoint(trajectory);
    if (!impact) {
      throw new Error('Invalid shot');
    }

    // Calculate damage to opponent
    const opponent = gameState.playerStates.find(p => p.id !== playerId);
    const damage = this.physicsEngine.calculateDamage(
      impact,
      opponent.position,
      power
    );

    // Apply damage
    opponent.health = Math.max(0, opponent.health - damage);
    logger.info(`Player ${playerId} shot hit for ${damage} damage`);

    // Check if game should end
    if (opponent.health <= 0) {
      gameState.endGame(playerId);
    }

    return gameState;
  }

  /**
   * Handle power adjustment action
   * @param {Object} gameState - Current game state
   * @param {string} playerId - Player ID
   * @param {Object} action - Power adjustment action
   * @returns {Object} Updated game state
   */
  handleAdjustPower(gameState, playerId, action) {
    const playerState = gameState.playerStates.find(p => p.id === playerId);
    const { power } = action;

    if (power < 0 || power > 100) {
      throw new Error('Invalid power value');
    }

    playerState.power = power;
    logger.info(`Player ${playerId} adjusted power to ${power}`);
    return gameState;
  }

  /**
   * Handle angle adjustment action
   * @param {Object} gameState - Current game state
   * @param {string} playerId - Player ID
   * @param {Object} action - Angle adjustment action
   * @returns {Object} Updated game state
   */
  handleAdjustAngle(gameState, playerId, action) {
    const playerState = gameState.playerStates.find(p => p.id === playerId);
    const { angle } = action;

    if (angle < 0 || angle > 180) {
      throw new Error('Invalid angle value');
    }

    playerState.angle = angle;
    logger.info(`Player ${playerId} adjusted angle to ${angle}`);
    return gameState;
  }

  /**
   * Find the impact point of a trajectory
   * @param {Array} trajectory - Array of trajectory points
   * @returns {Object|null} Impact point or null if no impact
   */
  findImpactPoint(trajectory) {
    for (let i = 0; i < trajectory.length - 1; i++) {
      const current = trajectory[i];
      const next = trajectory[i + 1];

      if (this.physicsEngine.isPointInTerrain(next)) {
        return next;
      }
    }
    return null;
  }

  /**
   * Get available actions for a player
   * @param {Object} gameState - Current game state
   * @param {string} playerId - Player ID
   * @returns {Array} Available actions
   */
  getAvailableActions(gameState, playerId) {
    const playerState = gameState.playerStates.find(p => p.id === playerId);
    if (!playerState) return [];

    return [
      {
        type: this.actionTypes.MOVE,
        description: 'Move to a new position'
      },
      {
        type: this.actionTypes.SHOOT,
        description: 'Shoot at opponent'
      },
      {
        type: this.actionTypes.ADJUST_POWER,
        description: 'Adjust shot power'
      },
      {
        type: this.actionTypes.ADJUST_ANGLE,
        description: 'Adjust shot angle'
      }
    ];
  }
}

module.exports = ActionHandler; 