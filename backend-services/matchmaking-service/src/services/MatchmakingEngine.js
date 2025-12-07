const crypto = require('node:crypto');
const matchmakingConfig = require('../config/matchmaking.config');
const queueManager = require('./QueueManager');
const gameEngineClient = require('./GameEngineClient');

/**
 * MatchmakingEngine handles match finding and creation logic
 */
class MatchmakingEngine {
  constructor() {
    // Note: Using constructor assignment instead of class field declaration
    // Class fields (ES2022) require Node.js 14+ with experimental flag or Node.js 16+
    // ESLint configuration may not support class fields, so using constructor assignment
    // This is a static configuration value that doesn't change after initialization
    this.defaultHeroId = matchmakingConfig.matchmaking.defaultHeroId;
    // MatchAcceptanceManager will be injected via setMatchAcceptanceManager
    this.matchAcceptanceManager = null;
  }

  /**
   * Set the MatchAcceptanceManager instance (to avoid circular dependency)
   * @param {Object} matchAcceptanceManager - MatchAcceptanceManager instance
   */
  setMatchAcceptanceManager(matchAcceptanceManager) {
    this.matchAcceptanceManager = matchAcceptanceManager;
  }

  /**
   * Get first two available players from queue (FIFO order)
   * Filters out players who are already in a match acceptance session
   * @returns {Promise<Array<{playerId: string, socketId: string, userId?: string}>>}
   */
  async getFirstTwoAvailablePlayers() {
    const players = await queueManager.getAllPlayersWithSockets();

    if (players.length < 2) {
      return null;
    }

    // If no matchAcceptanceManager is set, fall back to original behavior
    if (!this.matchAcceptanceManager) {
      return players.slice(0, 2);
    }

    // Filter out players who are already in a match acceptance session
    const availablePlayers = [];
    for (const player of players) {
      const existingMatch = await this.matchAcceptanceManager.getMatchAcceptanceByUserId(
        player.playerId
      );
      if (existingMatch) {
        // Log without exposing player IDs or match IDs for security
        // eslint-disable-next-line no-console
        console.log('Skipping player - already in match acceptance session');
      } else {
        availablePlayers.push(player);
        // Stop once we have 2 available players
        if (availablePlayers.length >= 2) {
          break;
        }
      }
    }

    if (availablePlayers.length < 2) {
      return null;
    }

    return availablePlayers;
  }

  /**
   * Get first two players from queue (FIFO order)
   * @deprecated Use getFirstTwoAvailablePlayers() instead
   * @returns {Promise<Array<{playerId: string, socketId: string, userId?: string}>>}
   */
  async getFirstTwoPlayers() {
    return this.getFirstTwoAvailablePlayers();
  }

  /**
   * Create match object with two players
   * @param {Array<{playerId: string, socketId: string}>} players - Array of two players
   * @returns {Object} Match object
   */
  createMatchObject(players) {
    // Use crypto.randomBytes for secure random number generation
    const randomBytes = crypto.randomBytes(6).toString('hex');
    const matchId = `match-${Date.now()}-${randomBytes}`;

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

      // eslint-disable-next-line no-console
      // console.log(`[findMatch] Queue length: ${queueLength}`);

      if (queueLength < 2) {
        // Only log if queue length is > 0 to reduce noise
        if (queueLength > 0) {
          // eslint-disable-next-line no-console
          // console.log(`Queue has ${queueLength} player(s), need 2+ for matching`);
        }
        return null;
      }

      // Get first two available players (skip those already in match acceptance sessions)
      const players = await this.getFirstTwoAvailablePlayers();

      if (!players || players.length < 2) {
        // Log more details about why matching failed
        const allPlayers = await queueManager.getAllPlayersWithSockets();
        if (allPlayers.length >= 2) {
          // eslint-disable-next-line no-console
          console.log(
            `⚠️ Could not get two available players from queue. Total players: ${allPlayers.length}, but some may be in match acceptance sessions.`
          );
        }
        return null;
      }

      // Log match creation without exposing player IDs for security
      // eslint-disable-next-line no-console
      console.log('Found two players for matching');

      // Create match object
      const match = this.createMatchObject(players);

      // Log match creation without exposing match ID for security
      // eslint-disable-next-line no-console
      console.log('Match created successfully');

      // Step 2: Send match to Game Engine Service
      const gameRoomResult = await gameEngineClient.createGameRoom(match);

      if (gameRoomResult.success) {
        // Log game room creation without exposing IDs for security
        // eslint-disable-next-line no-console
        console.log('Game room created successfully');
        // Add gameRoomId to match object
        match.gameRoomId = gameRoomResult.gameRoomId;
        return match;
      } else {
        // Log error without exposing internal details for security
        // eslint-disable-next-line no-console
        console.error('Failed to create game room');
        // Note: Still returning match even if game room creation fails
        // This allows matchmaking to proceed even if Game Engine is temporarily unavailable
        // Future enhancement: Implement retry logic or notify players of the error
        return match;
      }
    } catch (error) {
      // Log error without exposing full error details for security
      // eslint-disable-next-line no-console
      console.error('Error in findMatch:', error.message || 'Unknown error');
      return null;
    }
  }
}

module.exports = new MatchmakingEngine();
