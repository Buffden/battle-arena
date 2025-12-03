// QueueManager Service
// Manages matchmaking queue operations using Redis Sorted Sets and Hashes

const { getRedisClient } = require('../config/redis.config');
const logger = require('../utils/logger');

// Redis key constants
const QUEUE_KEY = 'matchmaking:queue';
const QUEUE_METADATA_PREFIX = 'matchmaking:queue:metadata:';

// MVP constants
const DEFAULT_AVERAGE_MATCH_TIME = 30; // seconds

// Timestamp tiebreaker constant
// Use a very large number to ensure timestamp doesn't affect score ordering
// Earlier timestamp = smaller fraction = comes first when scores are equal
const TIMESTAMP_TIEBREAKER_DIVISOR = 1000000000000; // 1 trillion

// QueueManager class
// Handles all queue-related Redis operations
class QueueManager {
  // Create QueueManager instance
  constructor() {
    this.redisClient = null;
  }

  // Get Redis client instance
  getRedisClient() {
    const client = getRedisClient();
    if (!client) {
      throw new Error('Redis client not initialized');
    }
    return client;
  }

  // Add player to matchmaking queue
  async addToQueue(playerId, heroId, globalScore, socketId) {
    const redisClient = this.getRedisClient();
    const timestamp = Date.now();

    try {
      // Check if player is already in queue
      const existingPosition = await redisClient.zRank(QUEUE_KEY, playerId);
      if (existingPosition !== null) {
        logger.warn('Player already in queue', { playerId, position: existingPosition });
        // Return existing status
        return await this.getQueueStatus(playerId);
      }

      // Add player to Redis Sorted Set
      // Score = globalScore + timestamp tiebreaker for FIFO ordering when scores are equal
      // Earlier timestamp = smaller fraction = lower score = comes first (FIFO)
      // Redis orders ascending (lowest to highest), so lower score = first position
      // The timestamp component is so small it doesn't affect score-based ordering
      const compositeScore = globalScore + timestamp / TIMESTAMP_TIEBREAKER_DIVISOR;

      await redisClient.zAdd(QUEUE_KEY, {
        score: compositeScore,
        value: playerId
      });

      // Store queue entry metadata in Redis Hash
      const metadataKey = QUEUE_METADATA_PREFIX + playerId;
      await redisClient.hSet(metadataKey, {
        playerId: playerId,
        heroId: heroId,
        globalScore: globalScore.toString(),
        socketId: socketId,
        timestamp: timestamp.toString()
      });

      // Calculate position and wait time
      const position = await redisClient.zRank(QUEUE_KEY, playerId);
      const queueSize = await redisClient.zCard(QUEUE_KEY);
      const estimatedWaitTime = this.calculateEstimatedWaitTime(position);

      logger.info('Player added to queue', {
        playerId,
        heroId,
        globalScore,
        position,
        queueSize
      });

      return {
        position: position !== null ? position : -1,
        estimatedWaitTime,
        queueSize
      };
    } catch (error) {
      logger.error('Error adding player to queue', { playerId, error });
      throw error;
    }
  }

  // Remove player from matchmaking queue
  async removeFromQueue(playerId) {
    const redisClient = this.getRedisClient();

    try {
      // Remove from Sorted Set
      const removed = await redisClient.zRem(QUEUE_KEY, playerId);

      // Remove metadata Hash
      const metadataKey = QUEUE_METADATA_PREFIX + playerId;
      await redisClient.del(metadataKey);

      if (removed > 0) {
        logger.info('Player removed from queue', { playerId });
        return true;
      } else {
        logger.warn('Player not found in queue', { playerId });
        return false;
      }
    } catch (error) {
      logger.error('Error removing player from queue', { playerId, error });
      throw error;
    }
  }

  // Get queue status for a player
  async getQueueStatus(playerId) {
    const redisClient = this.getRedisClient();

    try {
      // Get position in queue
      const position = await redisClient.zRank(QUEUE_KEY, playerId);

      // If not in queue, return status indicating not in queue
      if (position === null) {
        return {
          position: -1,
          estimatedWaitTime: 0,
          queueSize: await redisClient.zCard(QUEUE_KEY)
        };
      }

      // Get queue size
      const queueSize = await redisClient.zCard(QUEUE_KEY);

      // Calculate estimated wait time
      const estimatedWaitTime = this.calculateEstimatedWaitTime(position);

      return {
        position,
        estimatedWaitTime,
        queueSize
      };
    } catch (error) {
      logger.error('Error getting queue status', { playerId, error });
      throw error;
    }
  }

  // Get queue entry metadata
  async getQueueEntry(playerId) {
    const redisClient = this.getRedisClient();
    const metadataKey = QUEUE_METADATA_PREFIX + playerId;

    try {
      const metadata = await redisClient.hGetAll(metadataKey);
      if (!metadata || Object.keys(metadata).length === 0) {
        return null;
      }

      return {
        playerId: metadata.playerId,
        heroId: metadata.heroId,
        globalScore: parseInt(metadata.globalScore, 10),
        socketId: metadata.socketId,
        timestamp: parseInt(metadata.timestamp, 10)
      };
    } catch (error) {
      logger.error('Error getting queue entry', { playerId, error });
      throw error;
    }
  }

  // Update socket ID in queue entry metadata (for reconnection)
  // @param {string} playerId - Player ID
  // @param {string} newSocketId - New socket ID
  // @returns {Promise<boolean>} True if updated successfully
  async updateSocketId(playerId, newSocketId) {
    const redisClient = this.getRedisClient();
    const metadataKey = QUEUE_METADATA_PREFIX + playerId;

    try {
      // Check if player is in queue
      const exists = await redisClient.zRank(QUEUE_KEY, playerId);
      if (exists === null) {
        logger.warn('Cannot update socket ID - player not in queue', { playerId });
        return false;
      }

      // Update socket ID in metadata
      await redisClient.hSet(metadataKey, 'socketId', newSocketId);

      logger.info('Socket ID updated in queue entry', { playerId, newSocketId });
      return true;
    } catch (error) {
      logger.error('Error updating socket ID', { playerId, newSocketId, error });
      throw error;
    }
  }

  // Calculate estimated wait time based on queue position
  calculateEstimatedWaitTime(position) {
    if (position === null || position < 0) {
      return 0;
    }

    // MVP formula: position * average match time
    // Each position ahead means waiting for one more match to complete
    return position * DEFAULT_AVERAGE_MATCH_TIME;
  }

  // Get total queue size
  async getQueueSize() {
    const redisClient = this.getRedisClient();
    try {
      return await redisClient.zCard(QUEUE_KEY);
    } catch (error) {
      logger.error('Error getting queue size', { error });
      throw error;
    }
  }
}

module.exports = QueueManager;
