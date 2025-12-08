/**
 * Test Helper Utilities
 *
 * Common utilities for reducing code duplication across test files.
 * These helpers provide reusable patterns for mocking, setup, and test data creation.
 */

/**
 * Creates a mock HTTP/HTTPS request object
 * @returns {Object} Mock request object
 */
function createMockRequest() {
  return {
    on: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
    destroy: jest.fn()
  };
}

/**
 * Creates a mock HTTP/HTTPS response object with event handlers
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Mock response object with _trigger method
 */
function createMockResponse(statusCode = 200) {
  const responseHandlers = {};
  const mockResponse = {
    on: jest.fn((event, handler) => {
      responseHandlers[event] = handler;
    }),
    statusCode
  };

  // Add trigger method to manually fire events
  mockResponse._trigger = (event, ...args) => {
    if (responseHandlers[event]) {
      responseHandlers[event](...args);
    }
  };

  return mockResponse;
}

/**
 * Sets up HTTP and HTTPS mocks with callback capture
 * @param {Object} httpModule - Mocked http module
 * @param {Object} httpsModule - Mocked https module
 * @param {Object} mockRequest - Mock request object
 * @returns {Function} Callback capture function (will be set when request is made)
 */
function setupHttpMocks(httpModule, httpsModule, mockRequest) {
  let responseCallback = null;

  httpModule.request.mockImplementation((options, callback) => {
    if (callback) {
      responseCallback = callback;
    }
    return mockRequest;
  });

  httpsModule.request.mockImplementation((options, callback) => {
    if (callback) {
      responseCallback = callback;
    }
    return mockRequest;
  });

  return () => responseCallback;
}

/**
 * Creates console spy mocks
 * @returns {Object} Object with consoleLogSpy and consoleErrorSpy
 */
function createConsoleSpies() {
  return {
    consoleLogSpy: jest.spyOn(console, 'log').mockImplementation(() => {}),
    consoleErrorSpy: jest.spyOn(console, 'error').mockImplementation(() => {})
  };
}

/**
 * Restores console spies
 * @param {Object} spies - Object with consoleLogSpy and consoleErrorSpy
 */
function restoreConsoleSpies(spies) {
  if (spies.consoleLogSpy) {
    spies.consoleLogSpy.mockRestore();
  }
  if (spies.consoleErrorSpy) {
    spies.consoleErrorSpy.mockRestore();
  }
}

/**
 * Creates a standard match data object for testing
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} Match data object
 */
function createMatchData(overrides = {}) {
  return {
    matchId: 'match-123',
    players: [
      { userId: 'user1', heroId: 'hero1' },
      { userId: 'user2', heroId: 'hero2' }
    ],
    ...overrides
  };
}

/**
 * Creates a standard game room response for testing
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} Game room response object
 */
function createGameRoomResponse(overrides = {}) {
  return {
    success: true,
    gameRoomId: 'room-123',
    matchId: 'match-123',
    ...overrides
  };
}

/**
 * Triggers a mock HTTP response with data
 * @param {Function} getCallback - Function that returns the response callback
 * @param {Object} mockResponse - Mock response object
 * @param {string} responseData - Response data as string
 */
function triggerHttpResponse(getCallback, mockResponse, responseData) {
  setImmediate(() => {
    const callback = getCallback();
    if (callback) {
      callback(mockResponse);
    }
    setImmediate(() => {
      if (responseData) {
        mockResponse._trigger('data', Buffer.from(responseData));
      }
      mockResponse._trigger('end');
    });
  });
}

/**
 * Creates a mock Redis client with common methods
 * @returns {Object} Mock Redis client
 */
function createMockRedis() {
  return {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    keys: jest.fn(),
    watch: jest.fn(),
    unwatch: jest.fn(),
    zadd: jest.fn(),
    zrank: jest.fn(),
    zrem: jest.fn(),
    zcard: jest.fn(),
    zrange: jest.fn(),
    hset: jest.fn(),
    hgetall: jest.fn(),
    hget: jest.fn(),
    exists: jest.fn(),
    mget: jest.fn(),
    pipeline: jest.fn(() => ({
      setex: jest.fn().mockReturnThis(),
      exec: jest.fn()
    }))
  };
}

/**
 * Creates standard player data for testing
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} Player data object
 */
function createPlayerData(overrides = {}) {
  return {
    playerId: 'player1',
    socketId: 'socket1',
    userId: 'user1',
    ...overrides
  };
}

/**
 * Creates an array of players for testing
 * @param {number} count - Number of players to create
 * @returns {Array} Array of player objects
 */
function createPlayers(count = 2) {
  return Array.from({ length: count }, (_, i) => ({
    playerId: `player${i + 1}`,
    socketId: `socket${i + 1}`,
    userId: `user${i + 1}`
  }));
}

/**
 * Saves and restores environment variables
 * @returns {Object} Object with save and restore methods
 */
function createEnvManager() {
  const originalEnv = { ...process.env };

  return {
    save: () => {
      return { ...process.env };
    },
    restore: saved => {
      process.env = saved || originalEnv;
    },
    set: (key, value) => {
      process.env[key] = value;
    },
    unset: key => {
      delete process.env[key];
    },
    reset: () => {
      process.env = { ...originalEnv };
    }
  };
}

/**
 * Sets up HTTP/HTTPS mocks after module reset
 * This is a convenience wrapper around setupHttpMocks for use after jest.resetModules()
 * @param {Object} httpModule - Mocked http module
 * @param {Object} httpsModule - Mocked https module
 * @param {Object} mockRequest - Mock request object
 * @returns {Function} Function that returns the response callback
 */
function setupHttpMocksAfterReset(httpModule, httpsModule, mockRequest) {
  return setupHttpMocks(httpModule, httpsModule, mockRequest);
}

module.exports = {
  createMockRequest,
  createMockResponse,
  setupHttpMocks,
  setupHttpMocksAfterReset,
  createConsoleSpies,
  restoreConsoleSpies,
  createMatchData,
  createGameRoomResponse,
  triggerHttpResponse,
  createMockRedis,
  createPlayerData,
  createPlayers,
  createEnvManager
};
