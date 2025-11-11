const logger = require('../utils/logger');

class GameReplay {
  constructor(gameState, players) {
    logger.info('Initializing game replay');
    this.gameState = gameState;
    this.players = players;
    this.replayData = {
      gameId: gameState.roomId,
      players: players.map(p => ({
        id: p.id,
        username: p.username
      })),
      startTime: gameState.createdAt,
      endTime: Date.now(),
      duration: Date.now() - gameState.createdAt,
      turns: [],
      terrain: gameState.terrain,
      initialPositions: gameState.playerStates.map(p => ({
        playerId: p.id,
        position: p.position
      }))
    };

    this.processTurnHistory();
  }

  /**
   * Process turn history into replay data
   */
  processTurnHistory() {
    logger.info('Processing turn history for replay');
    this.gameState.turnHistory.forEach((turn, index) => {
      const turnData = {
        turnNumber: index + 1,
        playerId: turn.playerId,
        timestamp: turn.timestamp,
        action: turn.action,
        state: {
          playerStates: this.getPlayerStatesAtTurn(index),
          wind: turn.wind,
          round: turn.round
        }
      };

      // Add action-specific data
      if (turn.action === 'shoot') {
        turnData.shotData = {
          angle: turn.angle,
          power: turn.power,
          trajectory: turn.trajectory,
          impact: turn.impact,
          damage: turn.damage
        };
      } else if (turn.action === 'move') {
        turnData.moveData = {
          from: turn.fromPosition,
          to: turn.toPosition
        };
      }

      this.replayData.turns.push(turnData);
      logger.debug(`Processed turn ${index + 1} for player ${turn.playerId}`);
    });

    logger.info(`Processed ${this.replayData.turns.length} turns for replay`);
  }

  /**
   * Get player states at a specific turn
   * @param {number} turnIndex - Turn index
   * @returns {Array} Player states
   */
  getPlayerStatesAtTurn(turnIndex) {
    const states = this.gameState.playerStates.map(p => ({
      id: p.id,
      health: p.health,
      position: p.position,
      angle: p.angle,
      power: p.power
    }));

    // Apply changes up to the specified turn
    for (let i = 0; i <= turnIndex; i++) {
      const turn = this.replayData.turns[i];
      if (turn.action === 'shoot') {
        const targetState = states.find(s => s.id !== turn.playerId);
        if (targetState) {
          targetState.health = Math.max(0, targetState.health - (turn.shotData?.damage || 0));
        }
      } else if (turn.action === 'move') {
        const playerState = states.find(s => s.id === turn.playerId);
        if (playerState) {
          playerState.position = turn.moveData.to;
        }
      }
    }

    return states;
  }

  /**
   * Get replay data for a specific turn
   * @param {number} turnNumber - Turn number
   * @returns {Object} Turn data
   */
  getTurnData(turnNumber) {
    logger.debug(`Getting data for turn ${turnNumber}`);
    const turn = this.replayData.turns[turnNumber - 1];
    if (!turn) {
      logger.warn(`Turn ${turnNumber} not found in replay data`);
      return null;
    }
    return turn;
  }

  /**
   * Get replay data for a specific time
   * @param {number} timestamp - Timestamp
   * @returns {Object} Turn data
   */
  getTurnDataAtTime(timestamp) {
    logger.debug(`Getting turn data at timestamp ${timestamp}`);
    const turn = this.replayData.turns.find(t => t.timestamp >= timestamp);
    if (!turn) {
      logger.warn(`No turn found at timestamp ${timestamp}`);
      return null;
    }
    return turn;
  }

  /**
   * Get replay metadata
   * @returns {Object} Replay metadata
   */
  getMetadata() {
    const metadata = {
      gameId: this.replayData.gameId,
      players: this.replayData.players,
      startTime: this.replayData.startTime,
      endTime: this.replayData.endTime,
      duration: this.replayData.duration,
      totalTurns: this.replayData.turns.length,
      winner: this.gameState.winner,
      terrain: this.replayData.terrain,
      initialPositions: this.replayData.initialPositions
    };

    logger.debug('Generated replay metadata:', metadata);
    return metadata;
  }

  /**
   * Get replay data for a specific player
   * @param {string} playerId - Player ID
   * @returns {Object} Player-specific replay data
   */
  getPlayerReplayData(playerId) {
    logger.debug(`Getting replay data for player ${playerId}`);
    const playerTurns = this.replayData.turns.filter(t => t.playerId === playerId);
    const player = this.players.find(p => p.id === playerId);

    return {
      playerId,
      username: player?.username,
      turns: playerTurns,
      stats: {
        totalShots: playerTurns.filter(t => t.action === 'shoot').length,
        totalDamage: playerTurns
          .filter(t => t.action === 'shoot')
          .reduce((sum, t) => sum + (t.shotData?.damage || 0), 0),
        totalMoves: playerTurns.filter(t => t.action === 'move').length
      }
    };
  }

  /**
   * Get replay data for a specific time range
   * @param {number} startTime - Start timestamp
   * @param {number} endTime - End timestamp
   * @returns {Object} Replay data for time range
   */
  getTimeRangeData(startTime, endTime) {
    logger.debug(`Getting replay data for time range ${startTime} to ${endTime}`);
    const turns = this.replayData.turns.filter(
      t => t.timestamp >= startTime && t.timestamp <= endTime
    );

    return {
      turns,
      startTime,
      endTime,
      duration: endTime - startTime
    };
  }

  /**
   * Get replay data for a specific round
   * @param {number} round - Round number
   * @returns {Object} Replay data for round
   */
  getRoundData(round) {
    logger.debug(`Getting replay data for round ${round}`);
    const turns = this.replayData.turns.filter(t => t.state.round === round);

    return {
      round,
      turns,
      startTime: turns[0]?.timestamp,
      endTime: turns[turns.length - 1]?.timestamp,
      duration: turns[turns.length - 1]?.timestamp - turns[0]?.timestamp
    };
  }

  /**
   * Get full replay data
   * @returns {Object} Complete replay data
   */
  getFullReplayData() {
    logger.debug('Getting full replay data');
    return {
      ...this.getMetadata(),
      turns: this.replayData.turns
    };
  }
}

module.exports = GameReplay; 