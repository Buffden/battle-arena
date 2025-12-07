const queueManager = require('./QueueManager');
const gameEngineClient = require('./GameEngineClient');

/**
 * MatchmakingEngine handles match finding and creation logic
 */
class MatchmakingEngine {
  constructor() {
    this.defaultHeroId = 'default-hero';
  }

  /**
   * Get first two players from queue (FIFO order)
   * @returns {Promise<Array<{playerId: string, socketId: string, userId?: string}>>}
   */
  async getFirstTwoPlayers() {
    const players = await queueManager.getAllPlayersWithSockets();

    if (players.length < 2) {
      return null;
    }

    // Return first two players (already in FIFO order from Redis sorted set)
    return players.slice(0, 2);
  }

  /**
   * Create match object with two players
   * @param {Array<{playerId: string, socketId: string}>} players - Array of two players
   * @returns {Object} Match object
   */
  createMatchObject(players) {
    const matchId = `match-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    return {
      matchId,
      players: players.map(player => ({
        userId: player.playerId,
        socketId: player.socketId,
        heroId: this.defaultHeroId
      })),
      createdAt: Date.now()
    };
  }

  /**
   * Find and create a match if two or more players are in queue
   * @returns {Promise<Object | null>} Match object or null if no match found
   */
  async findMatch() {
    try {
      // Check queue length
      const queueLength = await queueManager.getQueueLength();

      if (queueLength < 2) {
        // eslint-disable-next-line no-console
        console.log(`Queue has ${queueLength} player(s), need 2+ for matching`);
        return null;
      }

      // Get first two players
      const players = await this.getFirstTwoPlayers();

      if (!players || players.length < 2) {
        // eslint-disable-next-line no-console
        console.log('Could not get two players from queue');
        return null;
      }

      // eslint-disable-next-line no-console
      console.log(
        `Found two players for matching: ${players[0].playerId} and ${players[1].playerId}`
      );

      // Create match object
      const match = this.createMatchObject(players);

      // eslint-disable-next-line no-console
      console.log(`Match created: ${match.matchId}`);

      // Step 2: Send match to Game Engine Service
      const gameRoomResult = await gameEngineClient.createGameRoom(match);

      if (gameRoomResult.success) {
        // eslint-disable-next-line no-console
        console.log(`Game room created: ${gameRoomResult.gameRoomId} for match ${match.matchId}`);
        // Add gameRoomId to match object
        match.gameRoomId = gameRoomResult.gameRoomId;
        return match;
      } else {
        // eslint-disable-next-line no-console
        console.error(`Failed to create game room: ${gameRoomResult.error}`);
        // For now, still return match (Game Engine endpoint might not exist yet)
        // TODO: Step 3 - Handle this error properly (notify players or retry)
        return match;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findMatch:', error);
      return null;
    }
  }
}

module.exports = new MatchmakingEngine();
