const { getRedisClient } = require('../config/redis.config');
const matchmakingConfig = require('../config/matchmaking.config');

const MATCH_ACCEPTANCE_PREFIX = matchmakingConfig.matchAcceptance.redisKeyPrefix;
// TTL = timeout + buffer (convert timeout from ms to seconds, then add buffer)
const MATCH_ACCEPTANCE_TTL = Math.ceil(
  matchmakingConfig.matchAcceptance.timeoutMs / 1000 +
    matchmakingConfig.matchAcceptance.ttlBufferSeconds
);
const TIMEOUT_COUNT_PREFIX = matchmakingConfig.timeoutCount.redisKeyPrefix;
const TIMEOUT_COUNT_TTL = matchmakingConfig.timeoutCount.ttlSeconds;

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
      expiresAt: Date.now() + matchmakingConfig.matchAcceptance.timeoutMs
    };

    await redis.setex(key, MATCH_ACCEPTANCE_TTL, JSON.stringify(acceptanceData));
    // Log without exposing match ID for security
    // eslint-disable-next-line no-console
    console.log('Created match acceptance session');
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
   * Find match acceptance session for a user (if they're in one)
   * @param {string} userId - User ID
   * @returns {Promise<Object | null>} Match acceptance data or null if not found
   */
  async getMatchAcceptanceByUserId(userId) {
    const redis = getRedisClient();
    const keys = await redis.keys(`${MATCH_ACCEPTANCE_PREFIX}*`);

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const acceptanceData = JSON.parse(data);
        // Check if user is player1 or player2
        if (acceptanceData.player1Id === userId || acceptanceData.player2Id === userId) {
          // Check if not expired
          if (Date.now() <= acceptanceData.expiresAt) {
            return acceptanceData;
          }
        }
      }
    }

    return null;
  }

  /**
   * Delete all match acceptance sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array<string>>} Array of deleted match IDs
   */
  async deleteMatchAcceptancesByUserId(userId) {
    const redis = getRedisClient();
    const keys = await redis.keys(`${MATCH_ACCEPTANCE_PREFIX}*`);
    const deletedMatchIds = [];

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const acceptanceData = JSON.parse(data);
        // Check if user is player1 or player2
        if (acceptanceData.player1Id === userId || acceptanceData.player2Id === userId) {
          const matchId = key.replace(MATCH_ACCEPTANCE_PREFIX, '');
          await redis.del(key);
          deletedMatchIds.push(matchId);
        }
      }
    }

    return deletedMatchIds;
  }

  /**
   * Check if player has already accepted (idempotent check)
   * @param {Object} data - Acceptance data
   * @param {string} userId - User ID
   * @returns {Object|null} Result object if already accepted, null otherwise
   */
  _checkAlreadyAccepted(data, userId) {
    const isPlayer1 = data.player1Id === userId && data.player1Accepted;
    const isPlayer2 = data.player2Id === userId && data.player2Accepted;

    if (isPlayer1 || isPlayer2) {
      const bothAccepted = data.player1Accepted && data.player2Accepted;
      return {
        success: true,
        bothAccepted,
        data
      };
    }
    return null;
  }

  /**
   * Merge acceptance states from latest and original data
   * @param {Object} latestData - Latest data from Redis
   * @param {Object} originalData - Original data
   * @returns {Object} Merged data
   */
  _mergeAcceptanceStates(latestData, originalData) {
    return {
      ...latestData,
      // Preserve any true values from either source (never lose an acceptance)
      player1Accepted: Boolean(latestData.player1Accepted || originalData.player1Accepted),
      player2Accepted: Boolean(latestData.player2Accepted || originalData.player2Accepted)
    };
  }

  /**
   * Create updated acceptance data with current player's acceptance
   * @param {Object} sourceData - Source data
   * @param {string} userId - User ID of accepting player
   * @returns {Object} Updated data
   */
  _createUpdatedAcceptanceData(sourceData, userId) {
    return {
      ...sourceData,
      // Set current player's acceptance to true
      player1Accepted: sourceData.player1Id === userId ? true : sourceData.player1Accepted,
      player2Accepted: sourceData.player2Id === userId ? true : sourceData.player2Accepted
    };
  }

  /**
   * Attempt to accept match (single retry attempt)
   * @param {Object} redis - Redis client
   * @param {string} key - Redis key
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, bothAccepted: boolean, data: Object | null, expired?: boolean, shouldRetry?: boolean}>}
   */
  async _attemptAcceptMatch(redis, key, userId) {
    await redis.watch(key);

    const dataStr = await redis.get(key);
    if (!dataStr) {
      await redis.unwatch();
      return { success: false, bothAccepted: false, data: null };
    }

    const data = JSON.parse(dataStr);

    // Check if expired
    if (Date.now() > data.expiresAt) {
      await redis.del(key);
      await redis.unwatch();
      return { success: false, bothAccepted: false, data: null, expired: true };
    }

    // Check if already accepted (idempotent)
    const alreadyAccepted = this._checkAlreadyAccepted(data, userId);
    if (alreadyAccepted) {
      await redis.unwatch();
      return alreadyAccepted;
    }

    // Re-read latest data and merge acceptance states
    const latestDataStr = await redis.get(key);
    let sourceData = data;
    if (latestDataStr) {
      const latestData = JSON.parse(latestDataStr);
      sourceData = this._mergeAcceptanceStates(latestData, data);
    }

    // Create updated data
    const updatedData = this._createUpdatedAcceptanceData(sourceData, userId);
    const bothAccepted = updatedData.player1Accepted && updatedData.player2Accepted;

    // Execute atomic update
    const pipeline = redis.pipeline();
    pipeline.setex(key, MATCH_ACCEPTANCE_TTL, JSON.stringify(updatedData));
    const results = await pipeline.exec();

    // Check if transaction was aborted (race condition)
    if (results === null) {
      await redis.unwatch();
      return { success: false, bothAccepted: false, data: null, shouldRetry: true };
    }

    // Check for pipeline errors
    if (results && results[0] && results[0][0]) {
      await redis.unwatch();
      return { success: false, bothAccepted: false, data: null };
    }

    return {
      success: true,
      bothAccepted,
      data: updatedData
    };
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

    // Retry logic to handle race conditions
    const maxRetries = matchmakingConfig.matchAcceptance.maxRetries;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const result = await this._attemptAcceptMatch(redis, key, userId);

        // If should retry (race condition detected), continue loop
        if (result.shouldRetry) {
          retries++;
          await new Promise(resolve =>
            setTimeout(resolve, matchmakingConfig.matchAcceptance.retryDelayMs)
          );
          continue;
        }

        // Return result (success, expired, or error)
        return result;
      } catch (error) {
        try {
          await redis.unwatch();
        } catch (unwatchError) {
          // Ignore unwatch errors
        }
        // eslint-disable-next-line no-console
        console.error('Error in acceptMatch:', error.message || 'Unknown error');
        return { success: false, bothAccepted: false, data: null };
      }
    }

    // Max retries exceeded
    // eslint-disable-next-line no-console
    console.error('Max retries exceeded for acceptMatch. Returning failure.');
    return { success: false, bothAccepted: false, data: null };
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
   * Increment timeout count for a user (when they let match acceptance expire)
   * @param {string} userId - User ID
   * @returns {Promise<number>} New timeout count
   */
  async incrementTimeoutCount(userId) {
    const redis = getRedisClient();
    const key = `${TIMEOUT_COUNT_PREFIX}${userId}`;
    // Get current count first for logging
    const currentCount = await redis.get(key);
    const previousCount = currentCount ? Number.parseInt(currentCount, 10) : 0;
    // Increment (creates key with value 1 if it doesn't exist)
    const count = await redis.incr(key);
    await redis.expire(key, TIMEOUT_COUNT_TTL);
    // Log without exposing user ID for security
    // eslint-disable-next-line no-console
    console.log(`Incremented timeout count: ${previousCount} -> ${count}`);
    return count;
  }

  /**
   * Get timeout count for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Timeout count (0 if not found)
   */
  async getTimeoutCount(userId) {
    const redis = getRedisClient();
    const key = `${TIMEOUT_COUNT_PREFIX}${userId}`;
    const count = await redis.get(key);
    return count ? Number.parseInt(count, 10) : 0;
  }

  /**
   * Reset timeout count for a user (when they successfully accept/reject)
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async resetTimeoutCount(userId) {
    const redis = getRedisClient();
    const key = `${TIMEOUT_COUNT_PREFIX}${userId}`;
    await redis.del(key);
    // Log without exposing user ID for security
    // eslint-disable-next-line no-console
    console.log('Reset timeout count');
  }

  /**
   * Check for expired match acceptances and clean them up
   * @returns {Promise<Array<Object>>} Array of expired match acceptance data (before deletion)
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
          // Store acceptance data before deleting
          expiredMatches.push({
            matchId,
            ...acceptanceData
          });
          await redis.del(key);
        }
      }
    }

    return expiredMatches;
  }
}

module.exports = new MatchAcceptanceManager();
