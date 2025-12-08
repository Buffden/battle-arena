/**
 * Game Service Configuration
 *
 * Centralized configuration for all game-related constants in the frontend.
 * All hardcoded values should be moved here for maintainability.
 */

export interface GameConfig {
  websocket: {
    path: string;
    connectionTimeoutMs: number;
    reconnection: {
      enabled: boolean;
      delayMs: number;
      attempts: number;
      delayMaxMs: number;
    };
  };
  arena: {
    defaultWidth: number;
    defaultHeight: number;
    backgroundColor: number; // Phaser color value
  };
  hero: {
    defaultWidth: number;
    defaultHeight: number;
    defaultHealth: number;
  };
  hud: {
    updateIntervalMs: number;
  };
}

export const gameConfig: GameConfig = {
  websocket: {
    // WebSocket path (must match backend socket.io path)
    path: '/ws/game',
    connectionTimeoutMs: Number.parseInt(
      (globalThis.window !== undefined &&
        (globalThis.window as any).__GAME_CONFIG__?.websocket?.connectionTimeoutMs) ||
        '10000',
      10
    ), // 10 seconds
    reconnection: {
      enabled: true,
      delayMs: Number.parseInt(
        (globalThis.window !== undefined &&
          (globalThis.window as any).__GAME_CONFIG__?.websocket?.reconnection?.delayMs) ||
          '1000',
        10
      ), // 1 second
      attempts: Number.parseInt(
        (globalThis.window !== undefined &&
          (globalThis.window as any).__GAME_CONFIG__?.websocket?.reconnection?.attempts) ||
          '5',
        10
      ), // 5 attempts
      delayMaxMs: Number.parseInt(
        (globalThis.window !== undefined &&
          (globalThis.window as any).__GAME_CONFIG__?.websocket?.reconnection?.delayMaxMs) ||
          '5000',
        10
      ) // 5 seconds max delay
    }
  },
  arena: {
    defaultWidth: 800,
    defaultHeight: 600,
    backgroundColor: 0x87ceeb // Sky blue
  },
  hero: {
    defaultWidth: 32,
    defaultHeight: 32,
    defaultHealth: 100
  },
  hud: {
    updateIntervalMs: 100 // Update HUD every 100ms for smooth animations
  }
};

/**
 * Get config value with fallback
 * Allows runtime configuration override via window.__GAME_CONFIG__
 */
export function getGameConfigValue<T>(key: string, defaultValue: T): T {
  if (globalThis.window !== undefined && (globalThis.window as any).__GAME_CONFIG__) {
    const config = (globalThis.window as any).__GAME_CONFIG__;
    const keys = key.split('.');
    let value = config;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    return value as T;
  }
  return defaultValue;
}
