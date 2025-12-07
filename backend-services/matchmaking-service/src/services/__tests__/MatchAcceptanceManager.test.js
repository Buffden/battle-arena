const MatchAcceptanceManager = require('../MatchAcceptanceManager');
const { getRedisClient } = require('../../config/redis.config');

// Mock Redis client
jest.mock('../../config/redis.config', () => {
  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    keys: jest.fn(),
    watch: jest.fn(),
    unwatch: jest.fn(),
    pipeline: jest.fn(() => ({
      setex: jest.fn().mockReturnThis(),
      exec: jest.fn()
    }))
  };
  return {
    getRedisClient: jest.fn(() => mockRedis)
  };
});

describe('MatchAcceptanceManager - Timeout Count Tracking', () => {
  let redis;

  beforeEach(() => {
    jest.clearAllMocks();
    redis = getRedisClient();
  });

  describe('incrementTimeoutCount', () => {
    it('should create new timeout count if user has none', async () => {
      redis.get.mockResolvedValue(null);
      redis.incr.mockResolvedValue(1);

      const count = await MatchAcceptanceManager.incrementTimeoutCount('user123');

      expect(redis.get).toHaveBeenCalledWith('matchmaking:timeout-count:user123');
      expect(redis.incr).toHaveBeenCalledWith('matchmaking:timeout-count:user123');
      expect(redis.expire).toHaveBeenCalledWith('matchmaking:timeout-count:user123', 3600);
      expect(count).toBe(1);
    });

    it('should increment existing timeout count', async () => {
      redis.get.mockResolvedValue('2');
      redis.incr.mockResolvedValue(3);

      const count = await MatchAcceptanceManager.incrementTimeoutCount('user123');

      expect(redis.get).toHaveBeenCalledWith('matchmaking:timeout-count:user123');
      expect(redis.incr).toHaveBeenCalledWith('matchmaking:timeout-count:user123');
      expect(redis.expire).toHaveBeenCalledWith('matchmaking:timeout-count:user123', 3600);
      expect(count).toBe(3);
    });

    it('should handle count starting at 0', async () => {
      redis.get.mockResolvedValue('0');
      redis.incr.mockResolvedValue(1);

      const count = await MatchAcceptanceManager.incrementTimeoutCount('user123');

      expect(count).toBe(1);
    });

    it('should set TTL to 1 hour', async () => {
      redis.get.mockResolvedValue(null);
      redis.incr.mockResolvedValue(1);

      await MatchAcceptanceManager.incrementTimeoutCount('user123');

      expect(redis.expire).toHaveBeenCalledWith('matchmaking:timeout-count:user123', 3600);
    });
  });

  describe('getTimeoutCount', () => {
    it('should return 0 if user has no timeout count', async () => {
      redis.get.mockResolvedValue(null);

      const count = await MatchAcceptanceManager.getTimeoutCount('user123');

      expect(redis.get).toHaveBeenCalledWith('matchmaking:timeout-count:user123');
      expect(count).toBe(0);
    });

    it('should return existing timeout count', async () => {
      redis.get.mockResolvedValue('3');

      const count = await MatchAcceptanceManager.getTimeoutCount('user123');

      expect(redis.get).toHaveBeenCalledWith('matchmaking:timeout-count:user123');
      expect(count).toBe(3);
    });

    it('should parse string count to number', async () => {
      redis.get.mockResolvedValue('5');

      const count = await MatchAcceptanceManager.getTimeoutCount('user123');

      expect(count).toBe(5);
      expect(typeof count).toBe('number');
    });

    it('should handle empty string as 0', async () => {
      redis.get.mockResolvedValue('');

      const count = await MatchAcceptanceManager.getTimeoutCount('user123');

      expect(count).toBe(0);
    });
  });

  describe('resetTimeoutCount', () => {
    it('should delete timeout count for user', async () => {
      redis.del.mockResolvedValue(1);

      await MatchAcceptanceManager.resetTimeoutCount('user123');

      expect(redis.del).toHaveBeenCalledWith('matchmaking:timeout-count:user123');
    });

    it('should handle deletion of non-existent key', async () => {
      redis.del.mockResolvedValue(0);

      await MatchAcceptanceManager.resetTimeoutCount('user123');

      expect(redis.del).toHaveBeenCalledWith('matchmaking:timeout-count:user123');
    });
  });

  describe('deleteMatchAcceptancesByUserId', () => {
    it('should delete match acceptance sessions for a user as player1', async () => {
      const matchAcceptanceData = {
        matchId: 'match-123',
        player1Id: 'user123',
        player2Id: 'user456',
        player1SocketId: 'socket1',
        player2SocketId: 'socket2',
        player1Accepted: false,
        player2Accepted: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000
      };

      redis.keys.mockResolvedValue(['match:acceptance:match-123']);
      redis.get.mockResolvedValue(JSON.stringify(matchAcceptanceData));
      redis.del.mockResolvedValue(1);

      const deletedMatchIds =
        await MatchAcceptanceManager.deleteMatchAcceptancesByUserId('user123');

      expect(redis.keys).toHaveBeenCalledWith('match:acceptance:*');
      expect(redis.get).toHaveBeenCalledWith('match:acceptance:match-123');
      expect(redis.del).toHaveBeenCalledWith('match:acceptance:match-123');
      expect(deletedMatchIds).toEqual(['match-123']);
    });

    it('should delete match acceptance sessions for a user as player2', async () => {
      const matchAcceptanceData = {
        matchId: 'match-456',
        player1Id: 'user789',
        player2Id: 'user123',
        player1SocketId: 'socket3',
        player2SocketId: 'socket4',
        player1Accepted: false,
        player2Accepted: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000
      };

      redis.keys.mockResolvedValue(['match:acceptance:match-456']);
      redis.get.mockResolvedValue(JSON.stringify(matchAcceptanceData));
      redis.del.mockResolvedValue(1);

      const deletedMatchIds =
        await MatchAcceptanceManager.deleteMatchAcceptancesByUserId('user123');

      expect(deletedMatchIds).toEqual(['match-456']);
    });

    it('should delete multiple match acceptance sessions for a user', async () => {
      const match1 = {
        matchId: 'match-1',
        player1Id: 'user123',
        player2Id: 'user456',
        player1SocketId: 'socket1',
        player2SocketId: 'socket2',
        player1Accepted: false,
        player2Accepted: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000
      };

      const match2 = {
        matchId: 'match-2',
        player1Id: 'user789',
        player2Id: 'user123',
        player1SocketId: 'socket3',
        player2SocketId: 'socket4',
        player1Accepted: false,
        player2Accepted: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000
      };

      redis.keys.mockResolvedValue([
        'match:acceptance:match-1',
        'match:acceptance:match-2',
        'match:acceptance:match-3'
      ]);
      redis.get
        .mockResolvedValueOnce(JSON.stringify(match1))
        .mockResolvedValueOnce(JSON.stringify(match2))
        .mockResolvedValueOnce(
          JSON.stringify({
            matchId: 'match-3',
            player1Id: 'user999',
            player2Id: 'user888',
            player1SocketId: 'socket5',
            player2SocketId: 'socket6',
            player1Accepted: false,
            player2Accepted: false,
            createdAt: Date.now(),
            expiresAt: Date.now() + 20000
          })
        );
      redis.del.mockResolvedValue(1);

      const deletedMatchIds =
        await MatchAcceptanceManager.deleteMatchAcceptancesByUserId('user123');

      expect(deletedMatchIds).toEqual(['match-1', 'match-2']);
      expect(redis.del).toHaveBeenCalledTimes(2);
    });

    it('should return empty array if user has no match acceptance sessions', async () => {
      redis.keys.mockResolvedValue(['match:acceptance:match-1']);
      redis.get.mockResolvedValue(
        JSON.stringify({
          matchId: 'match-1',
          player1Id: 'user999',
          player2Id: 'user888',
          player1SocketId: 'socket1',
          player2SocketId: 'socket2',
          player1Accepted: false,
          player2Accepted: false,
          createdAt: Date.now(),
          expiresAt: Date.now() + 20000
        })
      );

      const deletedMatchIds =
        await MatchAcceptanceManager.deleteMatchAcceptancesByUserId('user123');

      expect(deletedMatchIds).toEqual([]);
      expect(redis.del).not.toHaveBeenCalled();
    });

    it('should handle empty keys array', async () => {
      redis.keys.mockResolvedValue([]);

      const deletedMatchIds =
        await MatchAcceptanceManager.deleteMatchAcceptancesByUserId('user123');

      expect(deletedMatchIds).toEqual([]);
      expect(redis.del).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON in Redis', async () => {
      redis.keys.mockResolvedValue(['match:acceptance:match-1']);
      redis.get.mockResolvedValue('invalid-json');

      await expect(
        MatchAcceptanceManager.deleteMatchAcceptancesByUserId('user123')
      ).rejects.toThrow();
    });
  });

  describe('Timeout count flow', () => {
    it('should track consecutive timeouts correctly', async () => {
      // First timeout
      redis.get.mockResolvedValueOnce(null);
      redis.incr.mockResolvedValueOnce(1);
      const count1 = await MatchAcceptanceManager.incrementTimeoutCount('user123');
      expect(count1).toBe(1);

      // Second timeout
      redis.get.mockResolvedValueOnce('1');
      redis.incr.mockResolvedValueOnce(2);
      const count2 = await MatchAcceptanceManager.incrementTimeoutCount('user123');
      expect(count2).toBe(2);

      // Third timeout
      redis.get.mockResolvedValueOnce('2');
      redis.incr.mockResolvedValueOnce(3);
      const count3 = await MatchAcceptanceManager.incrementTimeoutCount('user123');
      expect(count3).toBe(3);
    });

    it('should reset timeout count after successful accept', async () => {
      // User has 2 timeouts
      redis.get.mockResolvedValue('2');
      redis.incr.mockResolvedValue(3);
      await MatchAcceptanceManager.incrementTimeoutCount('user123');

      // User accepts a match - reset count
      redis.del.mockResolvedValue(1);
      await MatchAcceptanceManager.resetTimeoutCount('user123');

      // Next timeout should start at 1 again
      redis.get.mockResolvedValue(null);
      redis.incr.mockResolvedValue(1);
      const newCount = await MatchAcceptanceManager.incrementTimeoutCount('user123');
      expect(newCount).toBe(1);
    });

    it('should reset timeout count after successful reject', async () => {
      // User has 1 timeout
      redis.get.mockResolvedValue('1');
      redis.incr.mockResolvedValue(2);
      await MatchAcceptanceManager.incrementTimeoutCount('user123');

      // User rejects a match - reset count
      redis.del.mockResolvedValue(1);
      await MatchAcceptanceManager.resetTimeoutCount('user123');

      // Verify count is reset
      redis.get.mockResolvedValue(null);
      const count = await MatchAcceptanceManager.getTimeoutCount('user123');
      expect(count).toBe(0);
    });
  });
});
