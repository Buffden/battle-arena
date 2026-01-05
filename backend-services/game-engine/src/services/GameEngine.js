/**
 * Game Engine
 *
 * Main orchestrator for all game logic.
 * Coordinates physics, health, scoring, and weapon systems.
 * Uses Facade Pattern to provide unified interface.
 */

const { FireRequest, FireResult } = require('../models/FiringModels');

class GameEngine {
  constructor(
    gameRoomManager,
    turnManager,
    movementManager,
    physicsEngine,
    healthSystem,
    scoringSystem,
    collisionDetector,
    weaponSynergySystem,
    configurationManager
  ) {
    this.gameRoomManager = gameRoomManager;
    this.turnManager = turnManager;
    this.movementManager = movementManager;
    this.physicsEngine = physicsEngine;
    this.healthSystem = healthSystem;
    this.scoringSystem = scoringSystem;
    this.collisionDetector = collisionDetector;
    this.weaponSynergySystem = weaponSynergySystem;
    this.configurationManager = configurationManager;
    this.gameStates = new Map(); // matchId -> GameState
  }

  /**
   * MAIN FIRING ORCHESTRATION METHOD
   * Handles the complete firing flow:
   * 1. Validate turn
   * 2. Calculate trajectory
   * 3. Create projectile
   * 4. Detect collision
   * 5. Apply damage
   * 6. Check weapon synergy
   * 7. Calculate score
   * 8. Update game state
   * 9. Check win condition
   * 10. Switch turn
   *
   * @param {string} matchId - Match identifier
   * @param {string} playerId - Player identifier
   * @param {number} angle - Launch angle
   * @param {number} power - Launch power
   * @param {string} weaponId - Weapon identifier
   * @returns {Promise<FireResult>}
   */
  async handlePlayerFire(matchId, playerId, angle, power, weaponId) {
    const fireStartTime = Date.now();

    try {
      // 1. VALIDATE INPUT
      const fireRequest = new FireRequest(matchId, playerId, angle, power, weaponId);
      fireRequest.validate();

      const gameState = this.getGameState(matchId);
      if (!gameState) {
        throw new Error(`Game state not found for match ${matchId}`);
      }

      // 2. VALIDATE TURN
      const isTurnValid = await this.turnManager.isTurnValid(matchId, playerId);
      if (!isTurnValid) {
        throw new Error(`Not ${playerId}'s turn`);
      }

      // Get current player's position
      const currentPlayer = gameState.players[playerId];
      if (!currentPlayer) {
        throw new Error(`Player ${playerId} not found in game state`);
      }

      // 3. CALCULATE TRAJECTORY
      const trajectory = await this.physicsEngine.calculateTrajectory(
        weaponId,
        angle,
        power,
        gameState.arenaId,
        currentPlayer.position
      );

      // 4. CREATE PROJECTILE
      const projectile = await this.physicsEngine.fireProjectile(
        matchId,
        weaponId,
        angle,
        power,
        currentPlayer.position
      );

      // 5. SIMULATE AND DETECT COLLISION
      const projectiles = [projectile];
      const opponents = Object.entries(gameState.players)
        .filter(([id]) => id !== playerId)
        .map(([, player]) => ({
          id: player.id,
          position: player.position,
          heroRadius: player.heroRadius || 25
        }));

      const collisions = this.collisionDetector.detectCollisions(matchId, projectiles, opponents);

      let damageApplied = null;
      let scoreGained = 0;
      let synergyApplied = null;

      // Process collision if player was hit
      if (collisions.length > 0 && collisions[0].type === 'player') {
        const collision = collisions[0];
        const targetPlayerId = collision.targetPlayerId;

        // 6. APPLY DAMAGE
        const weaponDamage = await this.healthSystem.calculateDamage(
          weaponId,
          collision.hitAccuracy
        );

        damageApplied = await this.healthSystem.applyDamage(matchId, targetPlayerId, weaponDamage);

        // 7. CHECK WEAPON SYNERGY
        const synergyResult = await this.weaponSynergySystem.checkWeaponSynergy(
          matchId,
          playerId,
          weaponId
        );

        if (synergyResult) {
          synergyApplied = await this.weaponSynergySystem.applyWeaponSynergy(
            matchId,
            playerId,
            synergyResult
          );

          // Apply synergy damage multiplier
          if (synergyApplied.applied && synergyApplied.damageMultiplier) {
            const synergDamage = Math.round(damageApplied.damage * synergyApplied.damageMultiplier);
            const additionalDamage = synergDamage - damageApplied.damage;

            damageApplied = await this.healthSystem.applyDamage(
              matchId,
              targetPlayerId,
              additionalDamage
            );
          }
        } else {
          // Record hit for back-to-back tracking (no synergy)
          if (this.scoringSystem.scoringStrategy.recordHit) {
            this.scoringSystem.scoringStrategy.recordHit(matchId, playerId);
          }
        }

        // 8. CALCULATE SCORE
        scoreGained = await this.scoringSystem.calculateTotalScore(matchId, playerId, {
          accuracy: collision.hitAccuracy,
          weaponId,
          isHit: true,
          impactVelocity: collision.impactVelocity
        });

        // Add score to player
        this.scoringSystem.addScore(matchId, playerId, scoreGained);
      } else {
        // Miss - reset back-to-back counter
        if (this.scoringSystem.scoringStrategy.resetCounter) {
          this.scoringSystem.scoringStrategy.resetCounter(matchId, playerId);
        }
      }

      // 9. UPDATE GAME STATE
      gameState.lastAction = {
        type: 'fire',
        playerId,
        weaponId,
        angle,
        power,
        collision: collisions.length > 0 ? collisions[0] : null,
        damage: damageApplied?.damage || 0,
        score: scoreGained,
        timestamp: new Date().toISOString()
      };

      // Update player health in game state
      if (damageApplied && damageApplied.playerId) {
        const targetPlayer = gameState.players[damageApplied.playerId];
        if (targetPlayer) {
          targetPlayer.health = damageApplied.newHealth;
        }
      }

      // 10. CHECK WIN CONDITION
      let matchEnded = false;

      if (damageApplied && damageApplied.isDead) {
        matchEnded = true;
        gameState.winner = playerId;
        gameState.reason = 'opponent_eliminated';
      }

      // 11. SWITCH TURN
      if (!matchEnded) {
        await this.turnManager.endTurn(matchId);
      } else {
        gameState.status = 'ended';
      }

      // Create fire result
      const fireResult = new FireResult(
        true,
        projectile,
        trajectory,
        collisions.length > 0 ? collisions[0] : null,
        damageApplied,
        scoreGained,
        synergyApplied,
        {
          matchId: gameState.matchId,
          status: gameState.status,
          players: Object.keys(gameState.players).reduce((acc, id) => {
            acc[id] = {
              id: gameState.players[id].id,
              health: gameState.players[id].health,
              score: this.scoringSystem.getScore(matchId, id)
            };
            return acc;
          }, {}),
          currentTurn: gameState.currentTurn,
          winner: gameState.winner || null,
          turnTimeRemaining: await this.turnManager.getRemainingTime(matchId)
        },
        null
      );

      // Log firing completion
      const fireDuration = Date.now() - fireStartTime;
      // eslint-disable-next-line no-console
      console.log(`Fire completed in ${fireDuration}ms for match ${matchId}`);

      return fireResult;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Fire handling error: ${error.message}`);

      return new FireResult(
        false,
        null,
        null,
        null,
        null,
        0,
        null,
        this.getGameState(matchId),
        error.message
      );
    }
  }

  /**
   * Create game room and initialize systems
   * @param {string} matchId - Match identifier
   * @param {Object} config - Match configuration
   * @returns {Promise<Object>}
   */
  async createGameRoom(matchId, config) {
    try {
      // Create game state
      const gameState = {
        matchId,
        status: 'active',
        arenaId: config.arenaId,
        players: config.players,
        currentTurn: config.players[0].id,
        turnNumber: 1,
        lastAction: null,
        createdAt: new Date().toISOString(),
        weapons: config.weapons || {}
      };

      this.gameStates.set(matchId, gameState);

      // Initialize physics world
      await this.physicsEngine.createWorld(matchId, config.arenaId);

      // Initialize health
      const healthInit = await this.healthSystem.initializeHealth(
        matchId,
        config.players[0],
        config.players[1]
      );

      // Initialize scores
      this.scoringSystem.initializeScores(matchId, config.players[0].id, config.players[1].id);

      // Update game state with initial health
      Object.keys(healthInit).forEach(playerId => {
        gameState.players.find(p => p.id === playerId).health = healthInit[playerId];
      });

      return gameState;
    } catch (error) {
      throw new Error(`Failed to create game room: ${error.message}`);
    }
  }

  /**
   * End match and cleanup resources
   * @param {string} matchId - Match identifier
   * @returns {Promise<void>}
   */
  async endMatch(matchId) {
    try {
      this.physicsEngine.cleanupMatch(matchId);
      this.healthSystem.cleanupMatch(matchId);
      this.scoringSystem.cleanupMatch(matchId);
      this.weaponSynergySystem.cleanupMatch(matchId);
      this.gameStates.delete(matchId);
    } catch (error) {
      console.error(`Match cleanup error: ${error.message}`);
    }
  }

  /**
   * Get game state
   * @param {string} matchId - Match identifier
   * @returns {Object}
   */
  getGameState(matchId) {
    return this.gameStates.get(matchId);
  }

  /**
   * Update game state
   * @param {string} matchId - Match identifier
   * @param {Object} updates - Updates to apply
   * @returns {void}
   */
  updateGameState(matchId, updates) {
    const gameState = this.getGameState(matchId);
    if (gameState) {
      Object.assign(gameState, updates);
    }
  }
}

module.exports = GameEngine;
