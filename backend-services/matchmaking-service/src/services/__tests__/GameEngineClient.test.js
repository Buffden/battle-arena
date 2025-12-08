const http = require('node:http');
const https = require('node:https');

// Mock dependencies
jest.mock('node:http');
jest.mock('node:https');

describe('GameEngineClient', () => {
  let GameEngineClient;
  let originalEnv;
  let consoleErrorSpy;
  let consoleLogSpy;
  let mockRequest;
  let mockResponse;
  let responseCallback;
  let responseHandlers;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    delete process.env.GAME_ENGINE_URL;
    delete process.env.NODE_ENV;

    // Clear all mocks
    jest.clearAllMocks();

    // Mock console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Create mock request object
    mockRequest = {
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn()
    };

    // Create response handlers storage
    responseHandlers = {};

    // Create mock response object with handlers storage
    mockResponse = {
      on: jest.fn((event, handler) => {
        responseHandlers[event] = handler;
      }),
      statusCode: 200
    };

    // Add trigger method to mockResponse
    mockResponse._trigger = (event, ...args) => {
      if (responseHandlers[event]) {
        responseHandlers[event](...args);
      }
    };

    // Reset module cache first
    jest.resetModules();

    // Re-require http and https after reset (they're mocked)
    const httpMock = require('node:http');
    const httpsMock = require('node:https');

    // Setup http.request mock - capture callback
    httpMock.request.mockImplementation((options, callback) => {
      if (callback) {
        responseCallback = callback;
      }
      return mockRequest;
    });

    // Setup https.request mock
    httpsMock.request.mockImplementation((options, callback) => {
      if (callback) {
        responseCallback = callback;
      }
      return mockRequest;
    });

    // Now import GameEngineClient
    GameEngineClient = require('../GameEngineClient');
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;

    // Restore console methods
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('Constructor', () => {
    it('should load baseUrl from config', () => {
      expect(GameEngineClient.baseUrl).toBe('http://nginx');
    });

    it('should load timeout from config', () => {
      expect(GameEngineClient.timeout).toBe(5000);
    });

    it('should use environment variable GAME_ENGINE_URL if set', () => {
      process.env.GAME_ENGINE_URL = 'https://custom-url.com';
      jest.resetModules();
      const customClient = require('../GameEngineClient');
      expect(customClient.baseUrl).toBe('https://custom-url.com');
    });

    it('should log security error when HTTP is used in production', () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      require('../GameEngineClient');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('SECURITY ERROR: Using insecure HTTP')
      );
    });

    it('should log success message when HTTPS is used', () => {
      process.env.GAME_ENGINE_URL = 'https://nginx';
      process.env.NODE_ENV = 'development';
      jest.resetModules();
      const httpsClient = require('../GameEngineClient');

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Using secure HTTPS'));
      expect(httpsClient.baseUrl).toBe('https://nginx');
    });

    it('should not log warnings in development with HTTP', () => {
      process.env.NODE_ENV = 'development';
      jest.resetModules();
      require('../GameEngineClient');

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('_getHttpModule', () => {
    it('should use https module for https:// URLs', async () => {
      process.env.GAME_ENGINE_URL = 'https://nginx';
      jest.resetModules();

      // Re-setup https mock
      const httpsMock = require('node:https');
      httpsMock.request.mockImplementation((options, callback) => {
        if (callback) {
          responseCallback = callback;
        }
        return mockRequest;
      });

      const httpsClient = require('../GameEngineClient');

      const matchData = {
        matchId: 'match-https-test',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const responseData = JSON.stringify({
        success: true,
        gameRoomId: 'room-https-test',
        matchId: 'match-https-test'
      });

      const promise = httpsClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      await promise;

      expect(httpsMock.request).toHaveBeenCalled();
      expect(http.request).not.toHaveBeenCalled();
    });

    it('should use http module for http:// URLs', async () => {
      const httpMock = require('node:http');
      httpMock.request.mockImplementation((options, callback) => {
        if (callback) {
          responseCallback = callback;
        }
        return mockRequest;
      });

      const matchData = {
        matchId: 'match-http-test',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const responseData = JSON.stringify({
        success: true,
        gameRoomId: 'room-http-test',
        matchId: 'match-http-test'
      });

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      await promise;

      expect(httpMock.request).toHaveBeenCalled();
    });
  });

  describe('createGameRoom', () => {
    it('should create game room successfully with HTTP', async () => {
      const matchData = {
        matchId: 'match-123',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const responseData = JSON.stringify({
        success: true,
        gameRoomId: 'room-123',
        matchId: 'match-123'
      });

      const promise = GameEngineClient.createGameRoom(matchData);

      // Trigger response callback first (this sets up the handlers)
      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        // Then trigger data and end events after handlers are set up
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      const result = await promise;

      const httpMock = require('node:http');
      expect(result.success).toBe(true);
      expect(result.gameRoomId).toBe('room-123');
      expect(result.matchId).toBe('match-123');
      expect(httpMock.request).toHaveBeenCalled();
      expect(mockRequest.write).toHaveBeenCalled();
      expect(mockRequest.end).toHaveBeenCalled();
    });

    it('should create game room successfully with HTTPS', async () => {
      process.env.GAME_ENGINE_URL = 'https://nginx';
      jest.resetModules();

      const httpsMock = require('node:https');
      httpsMock.request.mockImplementation((options, callback) => {
        if (callback) {
          responseCallback = callback;
        }
        return mockRequest;
      });

      const httpsClient = require('../GameEngineClient');

      const matchData = {
        matchId: 'match-456',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const responseData = JSON.stringify({
        success: true,
        gameRoomId: 'room-456',
        matchId: 'match-456'
      });

      const promise = httpsClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      const result = await promise;

      expect(result.success).toBe(true);
      expect(httpsMock.request).toHaveBeenCalled();
    });

    it('should use matchId as gameRoomId when gameRoomId is not in response', async () => {
      const matchData = {
        matchId: 'match-789',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const responseData = JSON.stringify({
        success: true,
        matchId: 'match-789'
        // No gameRoomId
      });

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.gameRoomId).toBe('match-789');
      expect(result.matchId).toBe('match-789');
    });

    it('should handle HTTP error status codes', async () => {
      const matchData = {
        matchId: 'match-error',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      mockResponse.statusCode = 500;

      const responseData = 'Internal Server Error';

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Game Engine returned status 500');
    });

    it('should handle network errors', async () => {
      const matchData = {
        matchId: 'match-network-error',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      let errorHandler;
      mockRequest.on.mockImplementation((event, handler) => {
        if (event === 'error') {
          errorHandler = handler;
        }
      });

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (errorHandler) {
          errorHandler(new Error('ECONNREFUSED'));
        }
      });

      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Game Engine request failed');
      expect(result.error).toContain('ECONNREFUSED');
    });

    it('should handle request timeout', async () => {
      const matchData = {
        matchId: 'match-timeout',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      let timeoutHandler;
      mockRequest.on.mockImplementation((event, handler) => {
        if (event === 'timeout') {
          timeoutHandler = handler;
        }
      });

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (timeoutHandler) {
          timeoutHandler();
        }
      });

      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toBe('Game Engine request timeout');
      expect(mockRequest.destroy).toHaveBeenCalled();
    });

    it('should handle invalid JSON response', async () => {
      const matchData = {
        matchId: 'match-invalid-json',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const invalidJson = 'not valid json{';

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(invalidJson));
          mockResponse._trigger('end');
        });
      });

      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to parse Game Engine response');
    });

    it('should handle URL construction errors', async () => {
      // Force invalid URL by modifying baseUrl
      const originalBaseUrl = GameEngineClient.baseUrl;
      GameEngineClient.baseUrl = 'invalid-url';

      const matchData = {
        matchId: 'match-url-error',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const promise = GameEngineClient.createGameRoom(matchData);
      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to create game room');

      // Restore original baseUrl
      GameEngineClient.baseUrl = originalBaseUrl;
    });

    it('should send correct request options', async () => {
      const matchData = {
        matchId: 'match-options',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const responseData = JSON.stringify({
        success: true,
        gameRoomId: 'room-options',
        matchId: 'match-options'
      });

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      await promise;

      const httpMock = require('node:http');
      expect(httpMock.request).toHaveBeenCalledWith(
        expect.objectContaining({
          hostname: 'nginx',
          port: 80,
          path: '/api/game/create-room',
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          timeout: 5000
        }),
        expect.any(Function)
      );
    });

    it('should send correct request body', async () => {
      const matchData = {
        matchId: 'match-body',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const responseData = JSON.stringify({
        success: true,
        gameRoomId: 'room-body',
        matchId: 'match-body'
      });

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      await promise;

      expect(mockRequest.write).toHaveBeenCalled();
      const writeCall = mockRequest.write.mock.calls[0][0];
      const parsedBody = JSON.parse(writeCall.toString());

      expect(parsedBody.matchId).toBe('match-body');
      expect(parsedBody.players).toHaveLength(2);
      expect(parsedBody.players[0]).toEqual({ userId: 'user1', heroId: 'hero1' });
      expect(parsedBody.players[1]).toEqual({ userId: 'user2', heroId: 'hero2' });
    });

    it('should use HTTPS port 443 for HTTPS URLs', async () => {
      process.env.GAME_ENGINE_URL = 'https://nginx';
      jest.resetModules();

      const httpsMock = require('node:https');
      httpsMock.request.mockImplementation((options, callback) => {
        if (callback) {
          responseCallback = callback;
        }
        return mockRequest;
      });

      const httpsClient = require('../GameEngineClient');

      const matchData = {
        matchId: 'match-https',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const responseData = JSON.stringify({
        success: true,
        gameRoomId: 'room-https',
        matchId: 'match-https'
      });

      const promise = httpsClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          mockResponse._trigger('data', Buffer.from(responseData));
          mockResponse._trigger('end');
        });
      });

      await promise;

      // Check that https.request was called with port 443
      expect(httpsMock.request).toHaveBeenCalled();
      const callOptions = httpsMock.request.mock.calls[0][0];
      expect(callOptions.port).toBe(443);
    });

    it('should handle chunked response data', async () => {
      const matchData = {
        matchId: 'match-chunked',
        players: [
          { userId: 'user1', heroId: 'hero1' },
          { userId: 'user2', heroId: 'hero2' }
        ]
      };

      const promise = GameEngineClient.createGameRoom(matchData);

      setImmediate(() => {
        if (responseCallback) {
          responseCallback(mockResponse);
        }
        setImmediate(() => {
          // Simulate chunked data
          mockResponse._trigger('data', Buffer.from('{"success":true,'));
          mockResponse._trigger('data', Buffer.from('"gameRoomId":"room-chunked",'));
          mockResponse._trigger('data', Buffer.from('"matchId":"match-chunked"}'));
          mockResponse._trigger('end');
        });
      });

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.gameRoomId).toBe('room-chunked');
    });
  });
});
