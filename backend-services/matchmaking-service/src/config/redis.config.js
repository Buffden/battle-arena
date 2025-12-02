/**
 * Redis Configuration
 * Manages Redis client connection and configuration
 */

const redis = require('redis');

let redisClient = null;

/**
 * Initialize Redis client connection
 * @returns {Promise<redis.RedisClientType>} Redis client instance
 */
async function initializeRedis() {
  if (redisClient) {
    return redisClient;
  }

  const host = process.env.REDIS_HOST || 'redis';
  const port = process.env.REDIS_PORT || 6379;

  try {
    redisClient = redis.createClient({
      socket: {
        host,
        port: parseInt(port, 10)
      }
    });

    redisClient.on('error', err => {
      // eslint-disable-next-line no-console
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('Redis Client Connected');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Redis client:', error);
    throw error;
  }
}

/**
 * Get Redis client instance
 * @returns {redis.RedisClientType|null} Redis client instance or null if not initialized
 */
function getRedisClient() {
  return redisClient;
}

/**
 * Close Redis client connection
 * @returns {Promise<void>}
 */
async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

module.exports = {
  initializeRedis,
  getRedisClient,
  closeRedis
};
