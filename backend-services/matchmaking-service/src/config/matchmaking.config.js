/**
 * Matchmaking Service Configuration
 *
 * Centralized configuration for all matchmaking-related constants.
 * All hardcoded values should be moved here for maintainability.
 *
 * Environment variables can override defaults using the pattern:
 *   process.env.CONFIG_KEY || defaultValue
 */

module.exports = {
  // Server Configuration
  server: {
    port: Number.parseInt(process.env.PORT || '3002', 10),
    socketPath: '/ws/matchmaking',
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost']
  },

  // Queue Management Configuration
  queue: {
    // Queue timeout: How long a player can stay in queue before being removed (milliseconds)
    timeoutMs: Number.parseInt(process.env.QUEUE_TIMEOUT_MS || '60000', 10), // 1 minute

    // How often to check for timed-out players (milliseconds)
    timeoutCheckIntervalMs: Number.parseInt(
      process.env.QUEUE_TIMEOUT_CHECK_INTERVAL_MS || '10000',
      10
    ), // 10 seconds

    // Reconnection grace period: Time to wait before removing player on disconnect (milliseconds)
    reconnectionGracePeriodMs: Number.parseInt(
      process.env.RECONNECTION_GRACE_PERIOD_MS || '10000',
      10
    ) // 10 seconds
  },

  // Match Acceptance Configuration
  matchAcceptance: {
    // Match acceptance timeout: How long players have to accept/reject a match (milliseconds)
    timeoutMs: Number.parseInt(process.env.MATCH_ACCEPTANCE_TIMEOUT_MS || '20000', 10), // 20 seconds

    // TTL buffer: Additional time added to TTL beyond timeout for cleanup (seconds)
    // Total TTL = timeoutMs + (ttlBufferSeconds * 1000)
    ttlBufferSeconds: Number.parseInt(process.env.MATCH_ACCEPTANCE_TTL_BUFFER_SECONDS || '5', 10), // 5 seconds

    // Redis key prefix for match acceptance sessions
    redisKeyPrefix: 'match:acceptance:',

    // Maximum retries for race condition handling in acceptMatch
    maxRetries: Number.parseInt(process.env.MATCH_ACCEPTANCE_MAX_RETRIES || '5', 10),

    // Delay between retries when race condition detected (milliseconds)
    retryDelayMs: Number.parseInt(process.env.MATCH_ACCEPTANCE_RETRY_DELAY_MS || '100', 10) // 100ms
  },

  // Timeout Count Configuration (Penalty System)
  timeoutCount: {
    // Redis key prefix for timeout count tracking
    redisKeyPrefix: 'matchmaking:timeout-count:',

    // TTL for timeout count: How long timeout count persists (seconds)
    // After this time, the count resets (allows players to start fresh)
    ttlSeconds: Number.parseInt(process.env.TIMEOUT_COUNT_TTL_SECONDS || '3600', 10), // 1 hour

    // Disconnection threshold: Number of consecutive timeouts before disconnecting player
    // Players are moved to end of queue for first (threshold - 1) timeouts
    // On the threshold timeout, player is disconnected
    disconnectionThreshold: Number.parseInt(process.env.TIMEOUT_DISCONNECTION_THRESHOLD || '3', 10) // 3 timeouts
  },

  // Matchmaking Engine Configuration
  matchmaking: {
    // How often to check for new matches (milliseconds)
    checkIntervalMs: Number.parseInt(process.env.MATCHING_CHECK_INTERVAL_MS || '3000', 10), // 3 seconds

    // How often to check for expired match acceptances (milliseconds)
    acceptanceCheckIntervalMs: Number.parseInt(
      process.env.ACCEPTANCE_CHECK_INTERVAL_MS || '2000',
      10
    ), // 2 seconds

    // Default hero ID when no hero is selected
    defaultHeroId: process.env.DEFAULT_HERO_ID || 'default-hero'
  },

  // External Service URLs
  services: {
    // Game Engine Service URL (base URL, not full endpoint)
    // Should be set via GAME_ENGINE_URL environment variable
    // For internal service-to-service communication, use nginx API gateway for consistency
    // Format: http://nginx (through nginx) or http://game-engine:5002 (direct, not recommended)
    // Default: http://nginx (through nginx API gateway - recommended)
    // For production, set: GAME_ENGINE_URL=https://nginx (through nginx with HTTPS)
    // Note: The full endpoint path (/api/game/create-room) is appended in GameEngineClient
    // Note: Direct service calls bypass nginx but are faster. Use nginx for consistency and security.
    gameEngineUrl: process.env.GAME_ENGINE_URL || 'http://nginx',

    // Request timeout for Game Engine Service (milliseconds)
    gameEngineTimeoutMs: Number.parseInt(process.env.GAME_ENGINE_TIMEOUT_MS || '5000', 10) // 5 seconds
  },

  // Messages (User-facing)
  messages: {
    queueTimeout: 'Queue session timed out after 1 minute. Please try again.',
    matchAcceptanceExpiredFirst:
      'Match acceptance expired. You have been moved to the end of the queue. Please respond promptly to future matches.',
    matchAcceptanceExpiredSecond:
      'Match acceptance expired again. You have been moved to the end of the queue. One more timeout will result in disconnection.',
    queueDisconnected:
      'You have been disconnected from the queue due to multiple match acceptance timeouts. Please try again later.',
    matchConfirmed: 'Match confirmed! Starting game...'
  }
};
