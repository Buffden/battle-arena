/**
 * Environment Configuration
 * Loads and validates environment variables
 */

require('dotenv').config();

const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'changeme'
  },

  // CORS Configuration
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS || '*'
  },

  // MongoDB Configuration (for future use)
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/battlearena'
  }
};

/**
 * Validate required environment variables
 * @throws {Error} If required environment variables are missing
 */
function validateConfig() {
  const required = ['JWT_SECRET'];

  for (const key of required) {
    if (!process.env[key] || process.env[key] === 'changeme') {
      if (config.nodeEnv === 'production') {
        throw new Error(`Missing required environment variable: ${key}`);
      }
      // eslint-disable-next-line no-console
      console.warn(`Warning: ${key} is using default value. This should be changed in production.`);
    }
  }
}

// Validate configuration on load
validateConfig();

module.exports = config;
