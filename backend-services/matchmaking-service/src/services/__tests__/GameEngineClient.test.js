const {
  createMockRequest,
  createMockResponse,
  setupHttpMocks,
  setupHttpMocksAfterReset,
  createConsoleSpies,
  restoreConsoleSpies,
  createMatchData,
  createGameRoomResponse,
  triggerHttpResponse,
  createEnvManager
} = require('./utils/test-helpers');

// Mock dependencies
jest.mock('node:http');
jest.mock('node:https');

describe('GameEngineClient', () => {
  let GameEngineClient;
  let envManager;
  let consoleSpies;
  let mockRequest;
  let mockResponse;
  let getResponseCallback;

  beforeEach(() => {
    // Setup environment manager
    envManager = createEnvManager();
    envManager.unset('GAME_ENGINE_URL');
    envManager.unset('NODE_ENV');

    // Clear all mocks
    jest.clearAllMocks();

    // Setup console spies
    consoleSpies = createConsoleSpies();

    // Create mock objects
    mockRequest = createMockRequest();
    mockResponse = createMockResponse(200);

    // Reset module cache first
    jest.resetModules();

    // Re-require http and https after reset (they're mocked)
    const httpMock = require('node:http');
    const httpsMock = require('node:https');

    // Setup HTTP mocks and get callback getter
    getResponseCallback = setupHttpMocks(httpMock, httpsMock, mockRequest);

    // Now import GameEngineClient
    GameEngineClient = require('../GameEngineClient');
  });

  afterEach(() => {
    // Restore original environment
    envManager.reset();

    // Restore console methods
    restoreConsoleSpies(consoleSpies);
  });

  describe('Constructor', () => {
    it('should load baseUrl from config', () => {
      expect(GameEngineClient.baseUrl).toBe('https://nginx');
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
      envManager.set('NODE_ENV', 'production');
      envManager.set('GAME_ENGINE_URL', 'http://nginx');
      jest.resetModules();
      require('../GameEngineClient');

      expect(consoleSpies.consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('SECURITY ERROR: Using insecure HTTP')
      );
    });

    it('should log success message when HTTPS is used', () => {
      envManager.set('GAME_ENGINE_URL', 'https://nginx');
      envManager.set('NODE_ENV', 'development');
      jest.resetModules();
      const httpsClient = require('../GameEngineClient');

      expect(consoleSpies.consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Using secure HTTPS')
      );
      expect(httpsClient.baseUrl).toBe('https://nginx');
    });

    it('should not log warnings in development with HTTP', () => {
      envManager.set('NODE_ENV', 'development');
      envManager.set('GAME_ENGINE_URL', 'http://nginx');
      jest.resetModules();
      // Re-create console spies after module reset to capture logs from new module
      const testConsoleSpies = createConsoleSpies();
      const devClient = require('../GameEngineClient');

      // In development with HTTP, no error should be logged (only in production)
      // The HTTPS success message won't be logged for HTTP URLs
      expect(testConsoleSpies.consoleErrorSpy).not.toHaveBeenCalled();
      // Note: HTTP in development doesn't log anything, so this should pass
      // But if HTTPS default is used, it will log - we just verify no error
      expect(devClient.baseUrl).toBe('http://nginx');
      restoreConsoleSpies(testConsoleSpies);
    });
  });

  describe('_getHttpModule', () => {
    it('should use https module for https:// URLs', async () => {
      envManager.set('GAME_ENGINE_URL', 'https://nginx');
      jest.resetModules();

      const httpsMock = require('node:https');
      const httpMock = require('node:http');
      getResponseCallback = setupHttpMocksAfterReset(httpMock, httpsMock, mockRequest);

      const httpsClient = require('../GameEngineClient');

      const matchData = createMatchData({
        matchId: 'match-https-test'
      });
      const responseData = JSON.stringify(
        createGameRoomResponse({
          gameRoomId: 'room-https-test',
          matchId: 'match-https-test'
        })
      );

      const promise = httpsClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

      await promise;

      expect(httpsMock.request).toHaveBeenCalled();
      expect(httpMock.request).not.toHaveBeenCalled();
    });

    it('should use http module for http:// URLs', async () => {
      envManager.set('GAME_ENGINE_URL', 'http://nginx');
      jest.resetModules();
      const httpClient = require('../GameEngineClient');

      const httpMock = require('node:http');
      const httpsMock = require('node:https');
      getResponseCallback = setupHttpMocksAfterReset(httpMock, httpsMock, mockRequest);

      const matchData = createMatchData({
        matchId: 'match-http-test'
      });
      const responseData = JSON.stringify(
        createGameRoomResponse({
          gameRoomId: 'room-http-test',
          matchId: 'match-http-test'
        })
      );

      const promise = httpClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

      await promise;

      expect(httpMock.request).toHaveBeenCalled();
    });
  });

  describe('createGameRoom', () => {
    it('should create game room successfully with HTTP', async () => {
      envManager.set('GAME_ENGINE_URL', 'http://nginx');
      jest.resetModules();

      const httpMock = require('node:http');
      const httpsMock = require('node:https');
      getResponseCallback = setupHttpMocksAfterReset(httpMock, httpsMock, mockRequest);

      const httpClient = require('../GameEngineClient');

      const matchData = createMatchData();
      const responseData = JSON.stringify(createGameRoomResponse());

      const promise = httpClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.gameRoomId).toBe('room-123');
      expect(result.matchId).toBe('match-123');
      expect(httpMock.request).toHaveBeenCalled();
      expect(mockRequest.write).toHaveBeenCalled();
      expect(mockRequest.end).toHaveBeenCalled();
    });

    it('should create game room successfully with HTTPS', async () => {
      envManager.set('GAME_ENGINE_URL', 'https://nginx');
      jest.resetModules();

      const httpsMock = require('node:https');
      const httpMock = require('node:http');
      getResponseCallback = setupHttpMocksAfterReset(httpMock, httpsMock, mockRequest);

      const httpsClient = require('../GameEngineClient');

      const matchData = createMatchData({ matchId: 'match-456' });
      const responseData = JSON.stringify(
        createGameRoomResponse({
          gameRoomId: 'room-456',
          matchId: 'match-456'
        })
      );

      const promise = httpsClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(httpsMock.request).toHaveBeenCalled();
    });

    it('should use matchId as gameRoomId when gameRoomId is not in response', async () => {
      const matchData = createMatchData({ matchId: 'match-789' });
      const responseData = JSON.stringify({
        success: true,
        matchId: 'match-789'
        // No gameRoomId
      });

      const promise = GameEngineClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.gameRoomId).toBe('match-789');
      expect(result.matchId).toBe('match-789');
    });

    it('should handle HTTP error status codes', async () => {
      const matchData = createMatchData({ matchId: 'match-error' });
      mockResponse.statusCode = 500;

      const responseData = 'Internal Server Error';

      const promise = GameEngineClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

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
      const matchData = createMatchData({ matchId: 'match-invalid-json' });
      const invalidJson = 'not valid json{';

      const promise = GameEngineClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, invalidJson);

      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to parse Game Engine response');
    });

    it('should handle URL construction errors', async () => {
      // Force invalid URL by modifying baseUrl
      const originalBaseUrl = GameEngineClient.baseUrl;
      GameEngineClient.baseUrl = 'invalid-url';

      const matchData = createMatchData({ matchId: 'match-url-error' });

      const promise = GameEngineClient.createGameRoom(matchData);
      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to create game room');

      // Restore original baseUrl
      GameEngineClient.baseUrl = originalBaseUrl;
    });

    it('should send correct request options', async () => {
      envManager.set('GAME_ENGINE_URL', 'http://nginx');
      jest.resetModules();

      const httpMock = require('node:http');
      const httpsMock = require('node:https');
      getResponseCallback = setupHttpMocksAfterReset(httpMock, httpsMock, mockRequest);

      const httpClient = require('../GameEngineClient');

      const matchData = createMatchData({ matchId: 'match-options' });
      const responseData = JSON.stringify(
        createGameRoomResponse({
          gameRoomId: 'room-options',
          matchId: 'match-options'
        })
      );

      const promise = httpClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

      await promise;

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
      const matchData = createMatchData({ matchId: 'match-body' });
      const responseData = JSON.stringify(
        createGameRoomResponse({
          gameRoomId: 'room-body',
          matchId: 'match-body'
        })
      );

      const promise = GameEngineClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

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
      envManager.set('GAME_ENGINE_URL', 'https://nginx');
      jest.resetModules();

      const httpsMock = require('node:https');
      const httpMock = require('node:http');
      getResponseCallback = setupHttpMocksAfterReset(httpMock, httpsMock, mockRequest);

      const httpsClient = require('../GameEngineClient');

      const matchData = createMatchData({ matchId: 'match-https' });
      const responseData = JSON.stringify(
        createGameRoomResponse({
          gameRoomId: 'room-https',
          matchId: 'match-https'
        })
      );

      const promise = httpsClient.createGameRoom(matchData);
      triggerHttpResponse(getResponseCallback, mockResponse, responseData);

      await promise;

      // Check that https.request was called with port 443
      expect(httpsMock.request).toHaveBeenCalled();
      const callOptions = httpsMock.request.mock.calls[0][0];
      expect(callOptions.port).toBe(443);
    });

    it('should handle chunked response data', async () => {
      const matchData = createMatchData({ matchId: 'match-chunked' });

      const promise = GameEngineClient.createGameRoom(matchData);

      // Helper function to trigger chunked response
      const triggerChunkedResponse = () => {
        const callback = getResponseCallback();
        if (callback) {
          callback(mockResponse);
        }
      };

      const triggerChunkedData = () => {
        // Simulate chunked data
        mockResponse._trigger('data', Buffer.from('{"success":true,'));
        mockResponse._trigger('data', Buffer.from('"gameRoomId":"room-chunked",'));
        mockResponse._trigger('data', Buffer.from('"matchId":"match-chunked"}'));
        mockResponse._trigger('end');
      };

      setImmediate(() => {
        triggerChunkedResponse();
        setImmediate(triggerChunkedData);
      });

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.gameRoomId).toBe('room-chunked');
    });
  });
});
