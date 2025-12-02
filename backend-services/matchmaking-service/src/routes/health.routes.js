/**
 * Health Check Routes
 * Provides health check endpoints for monitoring
 */

const express = require('express');
const router = express.Router();
const { getRedisClient } = require('../config/redis.config');

/**
 * Health check endpoint
 * GET /health
 */
router.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    service: 'matchmaking-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      redis: 'unknown'
    }
  };

  // Check Redis connection
  try {
    const redisClient = getRedisClient();
    if (redisClient && redisClient.isOpen) {
      await redisClient.ping();
      health.checks.redis = 'connected';
    } else {
      health.checks.redis = 'disconnected';
      health.status = 'degraded';
    }
  } catch (error) {
    health.checks.redis = 'error';
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;
