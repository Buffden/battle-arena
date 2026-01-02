/**
 * Matchmaking Service Configuration
 *
 * Centralized configuration for all matchmaking-related constants in the frontend.
 * All hardcoded values should be moved here for maintainability.
 *
 * Environment variables can be accessed via environment files or Angular's environment system.
 */

export interface MatchmakingConfig {
  websocket: {
    path: string;
    connectionTimeoutMs: number;
    reconnection: {
      enabled: boolean;
      delayMs: number;
      attempts: number;
      delayMaxMs: number;
    };
    timeoutMs: number;
  };
  queue: {
    stateKey: string;
    stateExpiryMs: number;
    retryDelayMs: number;
  };
  matchAcceptance: {
    defaultTimeoutSeconds: number;
    countdownIntervalMs: number;
  };
  messages: {
    queueTimeout: string;
    queueDisconnected: string;
    connectionTimeout: string;
    connectionFailed: string;
  };
}

type MatchmakingConfigOverrides = {
  websocket?: {
    connectionTimeoutMs?: number | string;
  };
};

const runtimeMatchmakingConfig =
  typeof globalThis.window !== 'undefined'
    ? (globalThis.window as Window & { __MATCHMAKING_CONFIG__?: MatchmakingConfigOverrides })
        .__MATCHMAKING_CONFIG__
    : undefined;

/**
 * Matchmaking configuration object
 * Can be overridden via environment variables or Angular environment files
 */
export const matchmakingConfig: MatchmakingConfig = {
  websocket: {
    // WebSocket path (must match backend socket.io path)
    path: '/ws/matchmaking',

    // Connection timeout: How long to wait for initial connection (milliseconds)
    connectionTimeoutMs: Number.parseInt(
      String(runtimeMatchmakingConfig?.websocket?.connectionTimeoutMs ?? 10000),
      10
    ), // 10 seconds

    // Reconnection settings
    reconnection: {
      enabled: true,
      delayMs: 1000, // 1 second
      attempts: Infinity, // Keep trying indefinitely
      delayMaxMs: 5000 // 5 seconds max delay
    },

    // Socket.io timeout (milliseconds)
    timeoutMs: 20000 // 20 seconds
  },

  queue: {
    // LocalStorage key for queue state persistence
    stateKey: 'battle_arena_queue_state',

    // How long queue state is considered valid (milliseconds)
    // After this time, saved state is ignored
    stateExpiryMs: 3600000, // 1 hour

    // Delay before retrying to join queue after error (milliseconds)
    retryDelayMs: 500 // 500ms
  },

  matchAcceptance: {
    // Default match acceptance timeout (seconds)
    // This should match backend MATCH_ACCEPTANCE_TIMEOUT_MS / 1000
    defaultTimeoutSeconds: 20,

    // Countdown interval: How often to update countdown timer (milliseconds)
    countdownIntervalMs: 1000 // 1 second
  },

  messages: {
    queueTimeout: 'Queue session timed out after 1 minute. Please try again.',
    queueDisconnected:
      'You have been disconnected from the queue due to multiple match acceptance timeouts. Please try again later.',
    connectionTimeout: 'Connection timeout - please try again',
    connectionFailed: 'Connection failed'
  }
};

/**
 * Helper function to get config value with environment override
 * This allows runtime configuration via globalThis.window.__MATCHMAKING_CONFIG__
 */
export function getConfigValue<T>(key: string, defaultValue: T): T {
  const runtimeConfig =
    typeof globalThis.window !== 'undefined'
      ? (globalThis.window as Window & { __MATCHMAKING_CONFIG__?: Record<string, unknown> })
          .__MATCHMAKING_CONFIG__
      : undefined;

  if (!runtimeConfig) {
    return defaultValue;
  }

  const keys = key.split('.');
  let value: unknown = runtimeConfig;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return defaultValue;
    }
  }
  return value as T;
}
