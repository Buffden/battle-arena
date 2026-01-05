/**
 * Game Engine Controller
 *
 * Facade Pattern: Unified WebSocket interface for game engine.
 * Handles Socket.io events and broadcasts results to players.
 */

const FireCommand = require('../commands/FireCommand');

class GameEngineController {
  constructor(io, gameEngine) {
    this.io = io;
    this.gameEngine = gameEngine;
  }

  /**
   * Register game engine event handlers
   * @param {Socket} socket - Socket.io socket instance
   * @returns {void}
   */
  registerEventHandlers(socket) {
    // Firing event
    socket.on('player-fire', data => this.onPlayerFire(socket, data));

    // Game initialization event
    socket.on('game-start', data => this.onGameStart(socket, data));

    // Match end event
    socket.on('end-match', data => this.onEndMatch(socket, data));
  }

  /**
   * Handle player fire event
   * @param {Socket} socket - Socket.io socket
   * @param {Object} data - {matchId, playerId, angle, power, weaponId}
   * @returns {Promise<void>}
   */
  async onPlayerFire(socket, data) {
    try {
      const { matchId, playerId, angle, power, weaponId } = data;

      // Create and execute fire command
      const fireCommand = new FireCommand(matchId, playerId, angle, power, weaponId);

      // Validate command
      fireCommand.validate();

      // Execute firing
      const fireResult = await this.gameEngine.handlePlayerFire(
        matchId,
        playerId,
        angle,
        power,
        weaponId
      );

      if (!fireResult.success) {
        // Emit error to firing player
        socket.emit('fire-failed', {
          matchId,
          error: fireResult.error,
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Broadcast firing event to both players
      this.io.to(matchId).emit('projectile-fired', {
        matchId,
        playerId,
        weaponId,
        angle,
        power,
        projectile: fireResult.projectile,
        trajectory: fireResult.trajectory,
        timestamp: new Date().toISOString()
      });

      // If collision occurred, broadcast hit event
      if (fireResult.collision) {
        this.io.to(matchId).emit('projectile-hit', {
          matchId,
          collision: fireResult.collision,
          impactPosition: fireResult.collision.position,
          hitAccuracy: fireResult.collision.hitAccuracy,
          timestamp: new Date().toISOString()
        });
      }

      // If damage was applied, broadcast damage event
      if (fireResult.damageApplied) {
        this.io.to(matchId).emit('damage-applied', {
          matchId,
          targetPlayerId: fireResult.damageApplied.playerId,
          damage: fireResult.damageApplied.damage,
          newHealth: fireResult.damageApplied.newHealth,
          isDead: fireResult.damageApplied.isDead,
          timestamp: new Date().toISOString()
        });
      }

      // If weapon synergy applied, broadcast synergy event
      if (fireResult.synergyApplied && fireResult.synergyApplied.applied) {
        this.io.to(matchId).emit('weapon-synergy-activated', {
          matchId,
          playerId,
          previousWeapon: fireResult.synergyApplied.previousWeapon,
          currentWeapon: fireResult.synergyApplied.currentWeapon,
          damageMultiplier: fireResult.synergyApplied.damageMultiplier,
          specialEffect: fireResult.synergyApplied.specialEffect,
          visualEffect: fireResult.synergyApplied.visualEffect,
          timestamp: new Date().toISOString()
        });
      }

      // Broadcast score update
      if (fireResult.scoreGained > 0) {
        this.io.to(matchId).emit('score-updated', {
          matchId,
          playerId,
          scoreGained: fireResult.scoreGained,
          totalScore: this.gameEngine.scoringSystem.getScore(matchId, playerId),
          timestamp: new Date().toISOString()
        });
      }

      // Broadcast updated game state
      this.io.to(matchId).emit('game-state-update', {
        matchId,
        gameState: fireResult.gameState,
        lastAction: this.gameEngine.getGameState(matchId)?.lastAction || null,
        timestamp: new Date().toISOString()
      });

      // Check if match ended
      if (fireResult.gameState.status === 'ended') {
        this.io.to(matchId).emit('match-ended', {
          matchId,
          winner: fireResult.gameState.winner,
          reason: this.gameEngine.getGameState(matchId)?.reason || 'unknown',
          finalScores: fireResult.gameState.players,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Player fire error:', error);
      socket.emit('fire-error', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Handle game start event
   * @param {Socket} socket - Socket.io socket
   * @param {Object} data - {matchId, players, arenaId, weapons}
   * @returns {Promise<void>}
   */
  async onGameStart(socket, data) {
    try {
      const { matchId, players, arenaId, weapons } = data;

      // Create game room and initialize systems
      const gameState = await this.gameEngine.createGameRoom(matchId, {
        players,
        arenaId,
        weapons
      });

      // Broadcast game start to both players
      this.io.to(matchId).emit('game-started', {
        matchId,
        gameState,
        currentTurn: gameState.currentTurn,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Game start error:', error);
      this.io.to(data.matchId).emit('game-start-failed', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Handle match end event
   * @param {Socket} socket - Socket.io socket
   * @param {Object} data - {matchId}
   * @returns {Promise<void>}
   */
  async onEndMatch(socket, data) {
    try {
      const { matchId } = data;

      // Clean up resources
      await this.gameEngine.endMatch(matchId);

      // Broadcast match end
      this.io.to(matchId).emit('match-cleanup-complete', {
        matchId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Match end error:', error);
    }
  }
}

module.exports = GameEngineController;
