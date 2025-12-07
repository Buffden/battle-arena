const { getRedisClient } = require('../config/redis.config');

const MATCH_ACCEPTANCE_PREFIX = 'match:acceptance:';
const MATCH_ACCEPTANCE_TTL = 25; // 25 seconds TTL (20s timeout + 5s buffer)

/**
 * MatchAcceptanceManager handles match acceptance state tracking
 */
class MatchAcceptanceManager {
  /**
   * Create a new match acceptance session
   * @param {string} matchId - Match ID
   * @param {string} player1Id - Player 1 user ID
   * @param {string} player2Id - Player 2 user ID
   * @param {string} player1SocketId - Player 1 socket ID
   * @param {string} player2SocketId - Player 2 socket ID
   * @param {string} gameRoomId - Game room ID (optional)
   * @returns {Promise<void>}
   */
  async createMatchAcceptance(
    matchId,
    player1Id,
    player2Id,
    player1SocketId,
    player2SocketId,
    gameRoomId = null
  ) {
    const redis = getRedisClient();
    const key = `${MATCH_ACCEPTANCE_PREFIX}${matchId}`;

    const acceptanceData = {
      matchId,
      gameRoomId: gameRoomId || matchId, // Use provided gameRoomId or fallback to matchId
      player1Id,
      player2Id,
      player1SocketId,
      player2SocketId,
      player1Accepted: false,
      player2Accepted: false,
      player1Rejected: false,
      player2Rejected: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + 20000 // 20 seconds from now
    };

    await redis.setex(key, MATCH_ACCEPTANCE_TTL, JSON.stringify(acceptanceData));
    // eslint-disable-next-line no-console
    console.log(`Created match acceptance session for match ${matchId}`);
  }

  /**
   * Get match acceptance data
   * @param {string} matchId - Match ID
   * @returns {Promise<Object | null>} Acceptance data or null if not found/expired
   */
  async getMatchAcceptance(matchId) {
    const redis = getRedisClient();
    const key = `${MATCH_ACCEPTANCE_PREFIX}${matchId}`;

    const data = await redis.get(key);
    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  /**
   * Accept match for a player
   * @param {string} matchId - Match ID
   * @param {string} userId - User ID of the accepting player
   * @returns {Promise<{success: boolean, bothAccepted: boolean, data: Object | null}>}
   */
  async acceptMatch(matchId, userId) {
    const redis = getRedisClient();
    const key = `${MATCH_ACCEPTANCE_PREFIX}${matchId}`;

    const data = await this.getMatchAcceptance(matchId);
    if (!data) {
      return { success: false, bothAccepted: false, data: null };
    }

    // Check if already expired
    if (Date.now() > data.expiresAt) {
      await redis.del(key);
      return { success: false, bothAccepted: false, data: null, expired: true };
    }

    // Update acceptance status
    if (data.player1Id === userId) {
      data.player1Accepted = true;
    } else if (data.player2Id === userId) {
      data.player2Accepted = true;
    } else {
      return { success: false, bothAccepted: false, data: null };
    }

    // Check if both players accepted
    const bothAccepted = data.player1Accepted && data.player2Accepted;

    // Save updated data
    await redis.setex(key, MATCH_ACCEPTANCE_TTL, JSON.stringify(data));

    return {
      success: true,
      bothAccepted,
      data
    };
  }

  /**
   * Reject match for a player
   * @param {string} matchId - Match ID
   * @param {string} userId - User ID of the rejecting player
   * @returns {Promise<{success: boolean, data: Object | null}>}
   */
  async rejectMatch(matchId, userId) {
    const redis = getRedisClient();
    const key = `${MATCH_ACCEPTANCE_PREFIX}${matchId}`;

    const data = await this.getMatchAcceptance(matchId);
    if (!data) {
      return { success: false, data: null };
    }

    // Update rejection status
    if (data.player1Id === userId) {
      data.player1Rejected = true;
    } else if (data.player2Id === userId) {
      data.player2Rejected = true;
    } else {
      return { success: false, data: null };
    }

    // Save updated data
    await redis.setex(key, MATCH_ACCEPTANCE_TTL, JSON.stringify(data));

    return {
      success: true,
      data
    };
  }

  /**
   * Delete match acceptance data
   * @param {string} matchId - Match ID
   * @returns {Promise<void>}
   */
  async deleteMatchAcceptance(matchId) {
    const redis = getRedisClient();
    const key = `${MATCH_ACCEPTANCE_PREFIX}${matchId}`;
    await redis.del(key);
  }

  /**
   * Check for expired match acceptances and clean them up
   * @returns {Promise<Array<string>>} Array of expired match IDs
   */
  async cleanupExpiredAcceptances() {
    const redis = getRedisClient();
    const expiredMatches = [];

    // Get all match acceptance keys
    const keys = await redis.keys(`${MATCH_ACCEPTANCE_PREFIX}*`);

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const acceptanceData = JSON.parse(data);
        if (Date.now() > acceptanceData.expiresAt) {
          const matchId = key.replace(MATCH_ACCEPTANCE_PREFIX, '');
          expiredMatches.push(matchId);
          await redis.del(key);
        }
      }
    }

    return expiredMatches;
  }
}

module.exports = new MatchAcceptanceManager();
