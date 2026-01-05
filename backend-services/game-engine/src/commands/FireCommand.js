/**
 * Fire Command
 *
 * Command Pattern: Encapsulates weapon firing as a command.
 * Allows for undo/redo, logging, and queuing of fire actions.
 */

class FireCommand {
  constructor(matchId, playerId, angle, power, weaponId) {
    this.matchId = matchId;
    this.playerId = playerId;
    this.angle = angle;
    this.power = power;
    this.weaponId = weaponId;
    this.executedAt = null;
  }

  /**
   * Execute the fire command
   * @param {GameEngine} gameEngine - Game engine instance
   * @returns {Promise<FireResult>}
   */
  async execute(gameEngine) {
    try {
      this.executedAt = Date.now();
      return await gameEngine.handlePlayerFire(
        this.matchId,
        this.playerId,
        this.angle,
        this.power,
        this.weaponId
      );
    } catch (error) {
      throw new Error(`Fire command execution failed: ${error.message}`);
    }
  }

  /**
   * Validate command data
   * @returns {boolean}
   */
  validate() {
    if (!this.matchId || typeof this.matchId !== 'string') {
      throw new Error('Invalid matchId');
    }
    if (!this.playerId || typeof this.playerId !== 'string') {
      throw new Error('Invalid playerId');
    }
    if (typeof this.angle !== 'number' || this.angle < 0 || this.angle > 180) {
      throw new Error('Angle must be between 0 and 180 degrees');
    }
    if (typeof this.power !== 'number' || this.power < 0 || this.power > 100) {
      throw new Error('Power must be between 0 and 100');
    }
    if (!this.weaponId || typeof this.weaponId !== 'string') {
      throw new Error('Invalid weaponId');
    }
    return true;
  }

  /**
   * Get command details
   * @returns {Object}
   */
  getDetails() {
    return {
      matchId: this.matchId,
      playerId: this.playerId,
      angle: this.angle,
      power: this.power,
      weaponId: this.weaponId,
      executedAt: this.executedAt
    };
  }
}

module.exports = FireCommand;
