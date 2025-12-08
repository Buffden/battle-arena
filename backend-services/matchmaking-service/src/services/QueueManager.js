const { getRedisClient } = require('../config/redis.config');

const QUEUE_KEY = 'matchmaking:queue';
const SOCKET_KEY_PREFIX = 'matchmaking:socket:';
const USER_KEY_PREFIX = 'matchmaking:user:';

/**
 * QueueManager handles queue operations using Redis
 */
class QueueManager {
  /**
   * Add player to queue
   * @param {string} socketId - Socket.io socket ID
   * @param {string} userId - User ID (optional, defaults to socketId for MVP)
   * @param {object} metadata - Additional metadata (heroIds, etc.)
   * @returns {Promise<{position: number, estimatedWaitTime: number}>}
   */
  async addToQueue(socketId, userId = null, metadata = {}) {
    const redis = getRedisClient();
    const playerId = userId || socketId;

    // Use timestamp as score to maintain FIFO order
    const timestamp = Date.now();

    // Add to sorted set (score = timestamp for FIFO ordering)
    await redis.zadd(QUEUE_KEY, timestamp, playerId);

    // Store socket ID mapping
    await redis.set(`${SOCKET_KEY_PREFIX}${socketId}`, playerId, 'EX', 3600); // 1 hour TTL

    // Store user ID mapping (for reconnection)
    if (userId) {
      await redis.set(`${USER_KEY_PREFIX}${userId}`, socketId, 'EX', 3600); // 1 hour TTL
    }

    // Store player metadata
    const metadataKey = `matchmaking:player:${playerId}`;
    await redis.hset(metadataKey, {
      socketId,
      userId: playerId,
      joinedAt: timestamp.toString(),
      ...metadata
    });
    await redis.expire(metadataKey, 3600); // 1 hour TTL

    // Get position in queue (1-indexed)
    const position = await this.getQueuePosition(playerId);

    // Calculate estimated wait time (simple: 30 seconds per position)
    const estimatedWaitTime = position * 30;

    return {
      position,
      estimatedWaitTime
    };
  }

  /**
   * Get userId from socket ID
   * @param {string} socketId - Socket.io socket ID
   * @returns {Promise<string | null>} User ID or null if not found
   */
  async getUserIdFromSocket(socketId) {
    const redis = getRedisClient();

    // Get player ID from socket mapping
    const playerId = await redis.get(`${SOCKET_KEY_PREFIX}${socketId}`);

    if (!playerId) {
      return null;
    }

    // Check if there's a user mapping (means playerId is userId)
    const userMapping = await redis.get(`${USER_KEY_PREFIX}${playerId}`);
    if (userMapping) {
      // playerId is the userId (when userId was provided in addToQueue)
      return playerId;
    }

    // Check metadata to see if userId was stored separately
    const metadataKey = `matchmaking:player:${playerId}`;
    const metadata = await redis.hgetall(metadataKey);
    if (metadata && metadata.userId) {
      // If userId in metadata is different from playerId, return it
      // Otherwise, playerId itself is the userId
      const userId = metadata.userId;
      return userId === playerId ? playerId : userId;
    }

    // Fallback: assume playerId might be userId (for backward compatibility)
    return playerId;
  }

  /**
   * Remove player from queue
   * @param {string} socketId - Socket.io socket ID
   * @returns {Promise<void>}
   */
  async removeFromQueue(socketId) {
    const redis = getRedisClient();

    // Get player ID from socket mapping
    const playerId = await redis.get(`${SOCKET_KEY_PREFIX}${socketId}`);

    if (playerId) {
      // Remove from sorted set
      await redis.zrem(QUEUE_KEY, playerId);

      // Remove socket mapping
      await redis.del(`${SOCKET_KEY_PREFIX}${socketId}`);

      // Remove user mapping if exists
      const userId = await redis.get(`${USER_KEY_PREFIX}${playerId}`);
      if (userId) {
        await redis.del(`${USER_KEY_PREFIX}${playerId}`);
      }

      // Remove player metadata
      await redis.del(`matchmaking:player:${playerId}`);
    }
  }

  /**
   * Remove player from queue by userId
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async removeFromQueueByUserId(userId) {
    const redis = getRedisClient();

    // Remove from sorted set (userId is used as playerId when provided)
    await redis.zrem(QUEUE_KEY, userId);

    // Get socket ID from user mapping
    const socketId = await redis.get(`${USER_KEY_PREFIX}${userId}`);
    if (socketId) {
      // Remove socket mapping
      await redis.del(`${SOCKET_KEY_PREFIX}${socketId}`);
      // Remove user mapping
      await redis.del(`${USER_KEY_PREFIX}${userId}`);
    }

    // Remove player metadata
    await redis.del(`matchmaking:player:${userId}`);
  }

  /**
   * Get player's position in queue
   * @param {string} playerId - Player ID
   * @returns {Promise<number>} Position (1-indexed, -1 if not in queue)
   */
  async getQueuePosition(playerId) {
    const redis = getRedisClient();

    // Get rank in sorted set (0-indexed)
    const rank = await redis.zrank(QUEUE_KEY, playerId);

    if (rank === null) {
      return -1; // Not in queue
    }

    // Return 1-indexed position
    return rank + 1;
  }

  /**
   * Get queue status for a player
   * @param {string} socketId - Socket.io socket ID
   * @returns {Promise<{position: number, estimatedWaitTime: number} | null>}
   */
  async getQueueStatus(socketId) {
    const redis = getRedisClient();

    // Get player ID from socket mapping
    const playerId = await redis.get(`${SOCKET_KEY_PREFIX}${socketId}`);

    if (!playerId) {
      return null; // Not in queue
    }

    const position = await this.getQueuePosition(playerId);

    if (position === -1) {
      return null; // Not in queue
    }

    // Calculate estimated wait time (simple: 30 seconds per position)
    const estimatedWaitTime = position * 30;

    return {
      position,
      estimatedWaitTime
    };
  }

  /**
   * Get queue length
   * @returns {Promise<number>}
   */
  async getQueueLength() {
    const redis = getRedisClient();
    return await redis.zcard(QUEUE_KEY);
  }

  /**
   * Reconnect player to queue (for page refresh/reconnection)
   * @param {string} socketId - New socket ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<{position: number, estimatedWaitTime: number} | null>}
   */
  async reconnectToQueue(socketId, userId = null) {
    const redis = getRedisClient();
    const playerId = userId || socketId;

    // Check if player is already in queue
    const existingPosition = await this.getQueuePosition(playerId);

    if (existingPosition === -1) {
      return null; // Not in queue, need to join first
    }

    // Update socket mapping
    await redis.set(`${SOCKET_KEY_PREFIX}${socketId}`, playerId, 'EX', 3600);

    // Update user mapping if userId provided
    if (userId) {
      await redis.set(`${USER_KEY_PREFIX}${userId}`, socketId, 'EX', 3600);
    }

    // Update metadata with new socket ID
    const metadataKey = `matchmaking:player:${playerId}`;
    await redis.hset(metadataKey, 'socketId', socketId);
    await redis.expire(metadataKey, 3600);

    // Return current queue status
    const estimatedWaitTime = existingPosition * 30;

    return {
      position: existingPosition,
      estimatedWaitTime
    };
  }

  /**
   * Check for and remove timed-out players from queue
   * @param {number} timeoutMs - Timeout in milliseconds (default: 60000 = 1 minute)
   * @returns {Promise<Array<{playerId: string, socketId: string}>>} Array of removed players
   */
  async removeTimedOutPlayers(timeoutMs = 60000) {
    const redis = getRedisClient();
    const now = Date.now();
    const timeoutThreshold = now - timeoutMs;
    const removedPlayers = [];

    try {
      // Get all players in queue with their timestamps (scores)
      const queueEntries = await redis.zrange(QUEUE_KEY, 0, -1, 'WITHSCORES');

      for (let i = 0; i < queueEntries.length; i += 2) {
        const playerId = queueEntries[i];
        const joinedAt = Number.parseInt(queueEntries[i + 1], 10);

        // Check if player has been waiting longer than timeout
        if (joinedAt < timeoutThreshold) {
          // Get socket ID from metadata
          const metadataKey = `matchmaking:player:${playerId}`;
          const metadata = await redis.hgetall(metadataKey);
          const socketId = metadata?.socketId;

          if (socketId) {
            // Remove from queue
            await this.removeFromQueue(socketId);
            removedPlayers.push({ playerId, socketId });
          } else {
            // No socket ID found, remove directly from queue
            await redis.zrem(QUEUE_KEY, playerId);
            await redis.del(metadataKey);
            removedPlayers.push({ playerId, socketId: null });
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error removing timed-out players:', error);
    }

    return removedPlayers;
  }

  /**
   * Get all players in queue with their socket IDs
   * @returns {Promise<Array<{playerId: string, socketId: string, joinedAt: number}>>}
   */
  async getAllPlayersWithSockets() {
    const redis = getRedisClient();
    const players = [];

    try {
      // Get all players in queue with their timestamps
      const queueEntries = await redis.zrange(QUEUE_KEY, 0, -1, 'WITHSCORES');

      for (let i = 0; i < queueEntries.length; i += 2) {
        const playerId = queueEntries[i];
        const joinedAt = Number.parseInt(queueEntries[i + 1], 10);

        // Get socket ID from metadata
        const metadataKey = `matchmaking:player:${playerId}`;
        const metadata = await redis.hgetall(metadataKey);
        const socketId = metadata?.socketId;

        if (socketId) {
          players.push({
            playerId,
            socketId,
            joinedAt
          });
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting players with sockets:', error);
    }

    return players;
  }

  /**
   * Get updated queue status for all players in queue
   * @returns {Promise<Array<{socketId: string, position: number, estimatedWaitTime: number}>>}
   */
  async getAllPlayersQueueStatus() {
    const players = await this.getAllPlayersWithSockets();
    const statuses = [];

    for (const { playerId, socketId } of players) {
      const position = await this.getQueuePosition(playerId);
      if (position !== -1) {
        const estimatedWaitTime = position * 30;
        statuses.push({
          socketId,
          position,
          estimatedWaitTime
        });
      }
    }

    return statuses;
  }
}

module.exports = new QueueManager();
