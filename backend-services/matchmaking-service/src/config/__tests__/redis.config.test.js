// Mock ioredis before any imports
const mockRedisInstance = {
  on: jest.fn(),
  ping: jest.fn(),
  quit: jest.fn()
};

jest.mock('ioredis', () => {
  return jest.fn(() => mockRedisInstance);
});

describe('Redis Config', () => {
  let redisConfig;
  let Redis;
  let originalEnv;
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(async () => {
    originalEnv = { ...process.env };
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.REDIS_PASSWORD;
    delete process.env.REDIS_DB;

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Reset module and close any existing connection first
    jest.resetModules();
    Redis = require('ioredis');
    redisConfig = require('../redis.config');

    try {
      await redisConfig.closeRedis();
    } catch (e) {
      // Ignore if not initialized - this is expected behavior
      if (e && e.message && !e.message.includes('not initialized')) {
        throw e; // Re-throw unexpected errors
      }
    }

    // Clear mocks after module reset
    mockRedisInstance.on.mockClear();
    mockRedisInstance.ping.mockClear();
    mockRedisInstance.quit.mockClear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('initializeRedis', () => {
    it('should create Redis client with default configuration', async () => {
      mockRedisInstance.ping.mockResolvedValue('PONG');

      const client = await redisConfig.initializeRedis();

      expect(Redis).toHaveBeenCalled();
      expect(mockRedisInstance.ping).toHaveBeenCalled();
      expect(client).toBe(mockRedisInstance);

      // Verify configuration
      const callArgs = Redis.mock.calls[Redis.mock.calls.length - 1][0];
      expect(callArgs.host).toBe('redis');
      expect(callArgs.port).toBe(6379);
      expect(callArgs.password).toBeUndefined();
      expect(callArgs.db).toBe(0);
      expect(callArgs.retryStrategy).toBeDefined();
      expect(callArgs.maxRetriesPerRequest).toBe(3);
    });

    it('should create Redis client with environment variables', async () => {
      // Close existing connection first
      try {
        await redisConfig.closeRedis();
      } catch (e) {
        // Ignore if not initialized - this is expected behavior
        if (e && e.message && !e.message.includes('not initialized')) {
          throw e; // Re-throw unexpected errors
        }
      }

      process.env.REDIS_HOST = 'custom-host';
      process.env.REDIS_PORT = '6380';
      // Test password - not a real credential, only used in test environment
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      process.env.REDIS_PASSWORD = 'test-password-123';
      process.env.REDIS_DB = '1';

      jest.resetModules();
      Redis = require('ioredis');
      redisConfig = require('../redis.config');
      mockRedisInstance.ping.mockResolvedValue('PONG');

      await redisConfig.initializeRedis();

      expect(Redis).toHaveBeenCalled();
      const callArgs = Redis.mock.calls[0][0];
      expect(callArgs.host).toBe('custom-host');
      expect(callArgs.port).toBe(6380);
      expect(callArgs.password).toBe('test-password-123');
      expect(callArgs.db).toBe(1);
    });

    it('should return existing client if already initialized', async () => {
      mockRedisInstance.ping.mockResolvedValue('PONG');

      const client1 = await redisConfig.initializeRedis();
      jest.clearAllMocks();
      const client2 = await redisConfig.initializeRedis();

      expect(Redis).not.toHaveBeenCalled();
      expect(client1).toBe(client2);
    });

    it('should set up event handlers', async () => {
      mockRedisInstance.ping.mockResolvedValue('PONG');

      await redisConfig.initializeRedis();

      expect(mockRedisInstance.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockRedisInstance.on).toHaveBeenCalledWith('ready', expect.any(Function));
      expect(mockRedisInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockRedisInstance.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockRedisInstance.on).toHaveBeenCalledWith('reconnecting', expect.any(Function));
    });

    it('should handle ping failure', async () => {
      mockRedisInstance.ping.mockRejectedValue(new Error('Connection failed'));

      await expect(redisConfig.initializeRedis()).rejects.toThrow('Connection failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Redis health check failed:', expect.any(Error));
    });

    it('should implement retry strategy', async () => {
      mockRedisInstance.ping.mockResolvedValue('PONG');

      await redisConfig.initializeRedis();

      expect(Redis).toHaveBeenCalled();
      const callArgs = Redis.mock.calls[Redis.mock.calls.length - 1][0];
      const retryStrategy = callArgs.retryStrategy;
      expect(typeof retryStrategy).toBe('function');

      expect(retryStrategy(1)).toBe(50);
      expect(retryStrategy(10)).toBe(500);
      expect(retryStrategy(50)).toBe(2000);
      expect(retryStrategy(100)).toBe(2000);
    });
  });

  describe('getRedisClient', () => {
    it('should return Redis client when initialized', async () => {
      mockRedisInstance.ping.mockResolvedValue('PONG');

      await redisConfig.initializeRedis();
      const client = redisConfig.getRedisClient();

      expect(client).toBe(mockRedisInstance);
    });

    it('should throw error when client not initialized', () => {
      jest.resetModules();
      redisConfig = require('../redis.config');

      expect(() => redisConfig.getRedisClient()).toThrow(
        'Redis client not initialized. Call initializeRedis() first.'
      );
    });
  });

  describe('closeRedis', () => {
    it('should close Redis connection', async () => {
      mockRedisInstance.ping.mockResolvedValue('PONG');
      mockRedisInstance.quit.mockResolvedValue('OK');

      await redisConfig.initializeRedis();
      await redisConfig.closeRedis();

      expect(mockRedisInstance.quit).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Redis connection closed');
    });

    it('should do nothing when client not initialized', async () => {
      jest.resetModules();
      redisConfig = require('../redis.config');

      await redisConfig.closeRedis();

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
