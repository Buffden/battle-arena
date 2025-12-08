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

describe('MatchAcceptanceManager', () => {
  let redis;
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    redis = getRedisClient();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
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

  describe('createMatchAcceptance', () => {
    it('should create match acceptance session', async () => {
      redis.setex.mockResolvedValue('OK');

      await MatchAcceptanceManager.createMatchAcceptance(
        'match-123',
        'user1',
        'user2',
        'socket1',
        'socket2'
      );

      expect(redis.setex).toHaveBeenCalled();
      const callArgs = redis.setex.mock.calls[0];
      expect(callArgs[0]).toBe('match:acceptance:match-123');
      expect(callArgs[1]).toBeGreaterThan(0); // TTL
      const data = JSON.parse(callArgs[2]);
      expect(data.matchId).toBe('match-123');
      expect(data.player1Id).toBe('user1');
      expect(data.player2Id).toBe('user2');
      expect(data.player1SocketId).toBe('socket1');
      expect(data.player2SocketId).toBe('socket2');
      expect(data.player1Accepted).toBe(false);
      expect(data.player2Accepted).toBe(false);
    });

    it('should create match acceptance with gameRoomId', async () => {
      redis.setex.mockResolvedValue('OK');

      await MatchAcceptanceManager.createMatchAcceptance(
        'match-123',
        'user1',
        'user2',
        'socket1',
        'socket2',
        'room-456'
      );

      const callArgs = redis.setex.mock.calls[0];
      const data = JSON.parse(callArgs[2]);
      expect(data.gameRoomId).toBe('room-456');
    });

    it('should use matchId as gameRoomId when not provided', async () => {
      redis.setex.mockResolvedValue('OK');

      await MatchAcceptanceManager.createMatchAcceptance(
        'match-123',
        'user1',
        'user2',
        'socket1',
        'socket2'
      );

      const callArgs = redis.setex.mock.calls[0];
      const data = JSON.parse(callArgs[2]);
      expect(data.gameRoomId).toBe('match-123');
    });
  });

  describe('getMatchAcceptance', () => {
    it('should return match acceptance data', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        player1Accepted: false,
        player2Accepted: false
      };
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));

      const result = await MatchAcceptanceManager.getMatchAcceptance('match-123');

      expect(redis.get).toHaveBeenCalledWith('match:acceptance:match-123');
      expect(result).toEqual(acceptanceData);
    });

    it('should return null when match acceptance not found', async () => {
      redis.get.mockResolvedValue(null);

      const result = await MatchAcceptanceManager.getMatchAcceptance('match-123');

      expect(result).toBeNull();
    });
  });

  describe('getMatchAcceptanceByUserId', () => {
    it('should return match acceptance for user as player1', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        expiresAt: Date.now() + 20000
      };
      redis.keys.mockResolvedValue(['match:acceptance:match-123']);
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));

      const result = await MatchAcceptanceManager.getMatchAcceptanceByUserId('user1');

      expect(result).toEqual(acceptanceData);
    });

    it('should return match acceptance for user as player2', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        expiresAt: Date.now() + 20000
      };
      redis.keys.mockResolvedValue(['match:acceptance:match-123']);
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));

      const result = await MatchAcceptanceManager.getMatchAcceptanceByUserId('user2');

      expect(result).toEqual(acceptanceData);
    });

    it('should return null when match is expired', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        expiresAt: Date.now() - 1000 // Expired
      };
      redis.keys.mockResolvedValue(['match:acceptance:match-123']);
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));

      const result = await MatchAcceptanceManager.getMatchAcceptanceByUserId('user1');

      expect(result).toBeNull();
    });

    it('should return null when user not in any match', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        expiresAt: Date.now() + 20000
      };
      redis.keys.mockResolvedValue(['match:acceptance:match-123']);
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));

      const result = await MatchAcceptanceManager.getMatchAcceptanceByUserId('user999');

      expect(result).toBeNull();
    });
  });

  describe('acceptMatch', () => {
    it('should accept match for player1', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        gameRoomId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        player1SocketId: 'socket1',
        player2SocketId: 'socket2',
        player1Accepted: false,
        player2Accepted: false,
        player1Rejected: false,
        player2Rejected: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000
      };
      redis.watch.mockResolvedValue('OK');
      redis.get
        .mockResolvedValueOnce(JSON.stringify(acceptanceData)) // First read after WATCH
        .mockResolvedValueOnce(JSON.stringify(acceptanceData)); // Latest data read before update
      redis.unwatch.mockResolvedValue('OK');
      const mockPipeline = {
        setex: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([[null, 'OK']]) // [error, result] format
      };
      redis.pipeline.mockReturnValue(mockPipeline);

      const result = await MatchAcceptanceManager.acceptMatch('match-123', 'user1');

      expect(result.success).toBe(true);
      expect(result.bothAccepted).toBe(false);
      expect(result.data.player1Accepted).toBe(true);
      expect(result.data.player2Accepted).toBe(false);
    });

    it('should accept match for player2', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        gameRoomId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        player1SocketId: 'socket1',
        player2SocketId: 'socket2',
        player1Accepted: false,
        player2Accepted: false,
        player1Rejected: false,
        player2Rejected: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000
      };
      redis.watch.mockResolvedValue('OK');
      redis.get
        .mockResolvedValueOnce(JSON.stringify(acceptanceData))
        .mockResolvedValueOnce(JSON.stringify(acceptanceData));
      redis.unwatch.mockResolvedValue('OK');
      const mockPipeline = {
        setex: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([[null, 'OK']]) // [error, result] format
      };
      redis.pipeline.mockReturnValue(mockPipeline);

      const result = await MatchAcceptanceManager.acceptMatch('match-123', 'user2');

      expect(result.success).toBe(true);
      expect(result.bothAccepted).toBe(false);
      expect(result.data.player1Accepted).toBe(false);
      expect(result.data.player2Accepted).toBe(true);
    });

    it('should return bothAccepted true when both players accept', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        gameRoomId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        player1SocketId: 'socket1',
        player2SocketId: 'socket2',
        player1Accepted: true,
        player2Accepted: false,
        player1Rejected: false,
        player2Rejected: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000
      };
      redis.watch.mockResolvedValue('OK');
      redis.get
        .mockResolvedValueOnce(JSON.stringify(acceptanceData))
        .mockResolvedValueOnce(JSON.stringify(acceptanceData));
      redis.unwatch.mockResolvedValue('OK');
      const mockPipeline = {
        setex: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([[null, 'OK']]) // [error, result] format
      };
      redis.pipeline.mockReturnValue(mockPipeline);

      const result = await MatchAcceptanceManager.acceptMatch('match-123', 'user2');

      expect(result.success).toBe(true);
      expect(result.bothAccepted).toBe(true);
      expect(result.data.player1Accepted).toBe(true);
      expect(result.data.player2Accepted).toBe(true);
    });

    it('should return false when match not found', async () => {
      redis.watch.mockResolvedValue('OK');
      redis.get.mockResolvedValue(null);
      redis.unwatch.mockResolvedValue('OK');

      const result = await MatchAcceptanceManager.acceptMatch('match-123', 'user1');

      expect(result.success).toBe(false);
      expect(result.bothAccepted).toBe(false);
      expect(result.data).toBeNull();
    });

    it('should return false when match expired', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        expiresAt: Date.now() - 1000 // Expired
      };
      redis.watch.mockResolvedValue('OK');
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));
      redis.del.mockResolvedValue(1);
      redis.unwatch.mockResolvedValue('OK');

      const result = await MatchAcceptanceManager.acceptMatch('match-123', 'user1');

      expect(result.success).toBe(false);
      expect(result.expired).toBe(true);
      expect(redis.del).toHaveBeenCalled();
    });

    it('should handle race condition with retry', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        gameRoomId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        player1SocketId: 'socket1',
        player2SocketId: 'socket2',
        player1Accepted: false,
        player2Accepted: false,
        player1Rejected: false,
        player2Rejected: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000
      };
      redis.watch.mockResolvedValue('OK');
      redis.get
        .mockResolvedValueOnce(JSON.stringify(acceptanceData))
        .mockResolvedValueOnce(JSON.stringify(acceptanceData))
        .mockResolvedValueOnce(JSON.stringify(acceptanceData))
        .mockResolvedValueOnce(JSON.stringify(acceptanceData));
      redis.unwatch.mockResolvedValue('OK');
      const mockPipeline1 = {
        setex: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null) // First attempt fails (race condition)
      };
      const mockPipeline2 = {
        setex: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([[null, 'OK']]) // Second attempt succeeds
      };
      redis.pipeline.mockReturnValueOnce(mockPipeline1).mockReturnValueOnce(mockPipeline2);

      const result = await MatchAcceptanceManager.acceptMatch('match-123', 'user1');

      expect(result.success).toBe(true);
      expect(redis.pipeline).toHaveBeenCalledTimes(2);
    });

    it('should return idempotent result when already accepted', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        player1Accepted: true,
        player2Accepted: false,
        expiresAt: Date.now() + 20000
      };
      redis.watch.mockResolvedValue('OK');
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));
      redis.unwatch.mockResolvedValue('OK');

      const result = await MatchAcceptanceManager.acceptMatch('match-123', 'user1');

      expect(result.success).toBe(true);
      expect(result.bothAccepted).toBe(false);
      expect(redis.pipeline).not.toHaveBeenCalled();
    });
  });

  describe('rejectMatch', () => {
    it('should reject match for player1', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        player1Rejected: false,
        player2Rejected: false,
        expiresAt: Date.now() + 20000
      };
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));
      redis.setex.mockResolvedValue('OK');

      const result = await MatchAcceptanceManager.rejectMatch('match-123', 'user1');

      expect(result.success).toBe(true);
      expect(result.data.player1Rejected).toBe(true);
      expect(result.data.player2Rejected).toBe(false);
      expect(redis.setex).toHaveBeenCalled();
    });

    it('should reject match for player2', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        player1Rejected: false,
        player2Rejected: false,
        expiresAt: Date.now() + 20000
      };
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));
      redis.setex.mockResolvedValue('OK');

      const result = await MatchAcceptanceManager.rejectMatch('match-123', 'user2');

      expect(result.success).toBe(true);
      expect(result.data.player1Rejected).toBe(false);
      expect(result.data.player2Rejected).toBe(true);
    });

    it('should return false when match not found', async () => {
      redis.get.mockResolvedValue(null);

      const result = await MatchAcceptanceManager.rejectMatch('match-123', 'user1');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
    });

    it('should return false when user not in match', async () => {
      const acceptanceData = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        expiresAt: Date.now() + 20000
      };
      redis.get.mockResolvedValue(JSON.stringify(acceptanceData));

      const result = await MatchAcceptanceManager.rejectMatch('match-123', 'user999');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
    });
  });

  describe('deleteMatchAcceptance', () => {
    it('should delete match acceptance', async () => {
      redis.del.mockResolvedValue(1);

      await MatchAcceptanceManager.deleteMatchAcceptance('match-123');

      expect(redis.del).toHaveBeenCalledWith('match:acceptance:match-123');
    });
  });

  describe('cleanupExpiredAcceptances', () => {
    it('should cleanup expired match acceptances', async () => {
      const expiredMatch = {
        matchId: 'match-123',
        player1Id: 'user1',
        player2Id: 'user2',
        expiresAt: Date.now() - 1000 // Expired
      };
      const activeMatch = {
        matchId: 'match-456',
        player1Id: 'user3',
        player2Id: 'user4',
        expiresAt: Date.now() + 20000 // Not expired
      };
      redis.keys.mockResolvedValue(['match:acceptance:match-123', 'match:acceptance:match-456']);
      redis.get
        .mockResolvedValueOnce(JSON.stringify(expiredMatch))
        .mockResolvedValueOnce(JSON.stringify(activeMatch));
      redis.del.mockResolvedValue(1);

      const result = await MatchAcceptanceManager.cleanupExpiredAcceptances();

      expect(result).toHaveLength(1);
      expect(result[0].matchId).toBe('match-123');
      expect(redis.del).toHaveBeenCalledWith('match:acceptance:match-123');
      expect(redis.del).not.toHaveBeenCalledWith('match:acceptance:match-456');
    });

    it('should return empty array when no expired matches', async () => {
      const activeMatch = {
        matchId: 'match-456',
        player1Id: 'user3',
        player2Id: 'user4',
        expiresAt: Date.now() + 20000
      };
      redis.keys.mockResolvedValue(['match:acceptance:match-456']);
      redis.get.mockResolvedValue(JSON.stringify(activeMatch));

      const result = await MatchAcceptanceManager.cleanupExpiredAcceptances();

      expect(result).toEqual([]);
      expect(redis.del).not.toHaveBeenCalled();
    });

    it('should handle empty keys array', async () => {
      redis.keys.mockResolvedValue([]);

      const result = await MatchAcceptanceManager.cleanupExpiredAcceptances();

      expect(result).toEqual([]);
    });
  });
});
