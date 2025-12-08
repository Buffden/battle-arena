const Redis = require('ioredis');

let redisClient = null;

/**
 * Initialize Redis client connection
 * @returns {Promise<Redis>} Redis client instance
 */
async function initializeRedis() {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number.parseInt(process.env.REDIS_DB || '0', 10),
    retryStrategy: times => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false
  });

  // Event handlers
  redisClient.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('Redis client connecting...');
  });

  redisClient.on('ready', () => {
    // eslint-disable-next-line no-console
    console.log('Redis client ready');
  });

  redisClient.on('error', err => {
    // eslint-disable-next-line no-console
    console.error('Redis client error:', err);
  });

  redisClient.on('close', () => {
    // eslint-disable-next-line no-console
    console.warn('Redis client connection closed');
  });

  redisClient.on('reconnecting', () => {
    // eslint-disable-next-line no-console
    console.log('Redis client reconnecting...');
  });

  // Health check
  try {
    await redisClient.ping();
    // eslint-disable-next-line no-console
    console.log('Redis connection verified');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Redis health check failed:', error);
    throw error;
  }

  return redisClient;
}

/**
 * Get Redis client instance
 * @returns {Redis} Redis client instance
 */
function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initializeRedis() first.');
  }
  return redisClient;
}

/**
 * Close Redis connection
 * @returns {Promise<void>}
 */
async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    // eslint-disable-next-line no-console
    console.log('Redis connection closed');
  }
}

module.exports = {
  initializeRedis,
  getRedisClient,
  closeRedis
};
