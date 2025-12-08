const QueueManager = require('../QueueManager');
const { getRedisClient } = require('../../config/redis.config');

// Mock Redis client - must define inline (Jest doesn't allow out-of-scope vars in jest.mock)
jest.mock('../../config/redis.config', () => {
  const mockRedis = {
    zadd: jest.fn(),
    zrank: jest.fn(),
    zrem: jest.fn(),
    zcard: jest.fn(),
    zrange: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    hset: jest.fn(),
    hgetall: jest.fn(),
    hget: jest.fn(),
    expire: jest.fn(),
    exists: jest.fn(),
    keys: jest.fn(),
    mget: jest.fn()
  };
  return {
    getRedisClient: jest.fn(() => mockRedis)
  };
});

describe('QueueManager', () => {
  let redis;

  beforeEach(() => {
    jest.clearAllMocks();
    redis = getRedisClient();
  });

  describe('addToQueue', () => {
    it('should add player to queue with socketId only', async () => {
      redis.zrank.mockResolvedValue(0); // Position 0 (1-indexed = 1)

      const result = await QueueManager.addToQueue('socket1');

      expect(redis.zadd).toHaveBeenCalledWith('matchmaking:queue', expect.any(Number), 'socket1');
      expect(redis.set).toHaveBeenCalledWith('matchmaking:socket:socket1', 'socket1', 'EX', 3600);
      expect(redis.hset).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalled();
      expect(result.position).toBe(1);
      expect(result.estimatedWaitTime).toBe(30);
    });

    it('should add player to queue with userId and metadata', async () => {
      redis.zrank.mockResolvedValue(1); // Position 1 (1-indexed = 2)

      const metadata = { heroIds: ['hero1', 'hero2'] };
      const result = await QueueManager.addToQueue('socket1', 'user123', metadata);

      expect(redis.zadd).toHaveBeenCalledWith('matchmaking:queue', expect.any(Number), 'user123');
      expect(redis.set).toHaveBeenCalledWith('matchmaking:socket:socket1', 'user123', 'EX', 3600);
      expect(redis.set).toHaveBeenCalledWith('matchmaking:user:user123', 'socket1', 'EX', 3600);
      expect(redis.hset).toHaveBeenCalledWith(
        'matchmaking:player:user123',
        expect.objectContaining({
          socketId: 'socket1',
          userId: 'user123',
          heroIds: expect.anything()
        })
      );
      expect(result.position).toBe(2);
      expect(result.estimatedWaitTime).toBe(60);
    });
  });

  describe('getUserIdFromSocket', () => {
    it('should return null when socket not found', async () => {
      redis.get.mockResolvedValue(null);

      const result = await QueueManager.getUserIdFromSocket('socket1');

      expect(result).toBeNull();
    });

    it('should return userId from socket mapping when user mapping exists', async () => {
      redis.get.mockImplementation(key => {
        if (key === 'matchmaking:socket:socket1') {
          return Promise.resolve('user123');
        }
        if (key === 'matchmaking:user:user123') {
          return Promise.resolve('socket1');
        }
        return Promise.resolve(null);
      });

      const result = await QueueManager.getUserIdFromSocket('socket1');

      expect(result).toBe('user123');
    });

    it('should return userId from metadata when user mapping does not exist', async () => {
      redis.get.mockImplementation(key => {
        if (key === 'matchmaking:socket:socket1') {
          return Promise.resolve('player123');
        }
        if (key === 'matchmaking:user:player123') {
          return Promise.resolve(null);
        }
        return Promise.resolve(null);
      });
      redis.hgetall.mockResolvedValue({
        socketId: 'socket1',
        userId: 'user123'
      });

      const result = await QueueManager.getUserIdFromSocket('socket1');

      expect(result).toBe('user123');
    });

    it('should return playerId as userId when metadata userId matches playerId', async () => {
      redis.get.mockImplementation(key => {
        if (key === 'matchmaking:socket:socket1') {
          return Promise.resolve('player123');
        }
        if (key === 'matchmaking:user:player123') {
          return Promise.resolve(null);
        }
        return Promise.resolve(null);
      });
      redis.hgetall.mockResolvedValue({
        socketId: 'socket1',
        userId: 'player123'
      });

      const result = await QueueManager.getUserIdFromSocket('socket1');

      expect(result).toBe('player123');
    });

    it('should return playerId as fallback when no metadata', async () => {
      redis.get.mockImplementation(key => {
        if (key === 'matchmaking:socket:socket1') {
          return Promise.resolve('player123');
        }
        if (key === 'matchmaking:user:player123') {
          return Promise.resolve(null);
        }
        return Promise.resolve(null);
      });
      redis.hgetall.mockResolvedValue({});

      const result = await QueueManager.getUserIdFromSocket('socket1');

      expect(result).toBe('player123');
    });
  });

  describe('removeFromQueue', () => {
    it('should remove player from queue by socketId', async () => {
      redis.get.mockResolvedValue('user123');
      redis.zrem.mockResolvedValue(1);
      redis.del.mockResolvedValue(1);

      await QueueManager.removeFromQueue('socket1');

      expect(redis.get).toHaveBeenCalledWith('matchmaking:socket:socket1');
      expect(redis.zrem).toHaveBeenCalledWith('matchmaking:queue', 'user123');
      expect(redis.del).toHaveBeenCalledWith('matchmaking:socket:socket1');
      expect(redis.del).toHaveBeenCalledWith('matchmaking:user:user123');
      expect(redis.del).toHaveBeenCalledWith('matchmaking:player:user123');
    });

    it('should handle removal when socket not found', async () => {
      redis.get.mockResolvedValue(null);

      await QueueManager.removeFromQueue('socket1');

      expect(redis.get).toHaveBeenCalledWith('matchmaking:socket:socket1');
      expect(redis.zrem).not.toHaveBeenCalled();
    });
  });

  describe('getQueuePosition', () => {
    it('should return position in queue (1-indexed)', async () => {
      redis.zrank.mockResolvedValue(5);

      const position = await QueueManager.getQueuePosition('user123');

      expect(redis.zrank).toHaveBeenCalledWith('matchmaking:queue', 'user123');
      expect(position).toBe(6); // 0-indexed + 1
    });

    it('should return -1 when player not in queue', async () => {
      redis.zrank.mockResolvedValue(null);

      const position = await QueueManager.getQueuePosition('user123');

      expect(position).toBe(-1);
    });
  });

  describe('getQueueLength', () => {
    it('should return queue length', async () => {
      redis.zcard.mockResolvedValue(10);

      const length = await QueueManager.getQueueLength();

      expect(redis.zcard).toHaveBeenCalledWith('matchmaking:queue');
      expect(length).toBe(10);
    });
  });

  describe('getAllPlayersWithSockets', () => {
    it('should return all players with socket mappings', async () => {
      redis.zrange.mockResolvedValue([
        'user1',
        '1234567890',
        'user2',
        '1234567891',
        'user3',
        '1234567892'
      ]);
      redis.hgetall.mockImplementation(key => {
        const playerMap = {
          'matchmaking:player:user1': { socketId: 'socket1', userId: 'user1' },
          'matchmaking:player:user2': { socketId: 'socket2', userId: 'user2' },
          'matchmaking:player:user3': { socketId: 'socket3', userId: 'user3' }
        };
        return Promise.resolve(playerMap[key] || {});
      });

      const players = await QueueManager.getAllPlayersWithSockets();

      expect(redis.zrange).toHaveBeenCalledWith('matchmaking:queue', 0, -1, 'WITHSCORES');
      expect(players).toHaveLength(3);
      expect(players[0]).toEqual({ playerId: 'user1', socketId: 'socket1', joinedAt: 1234567890 });
      expect(players[1]).toEqual({ playerId: 'user2', socketId: 'socket2', joinedAt: 1234567891 });
      expect(players[2]).toEqual({ playerId: 'user3', socketId: 'socket3', joinedAt: 1234567892 });
    });

    it('should return empty array when queue is empty', async () => {
      redis.zrange.mockResolvedValue([]);

      const players = await QueueManager.getAllPlayersWithSockets();

      expect(players).toEqual([]);
    });

    it('should handle missing socket mappings gracefully', async () => {
      redis.zrange.mockResolvedValue(['user1', '1234567890', 'user2', '1234567891']);
      redis.hgetall.mockImplementation(key => {
        if (key === 'matchmaking:player:user1') {
          return Promise.resolve({ socketId: 'socket1', userId: 'user1' });
        }
        return Promise.resolve({});
      });

      const players = await QueueManager.getAllPlayersWithSockets();

      expect(players).toHaveLength(1);
      expect(players[0]).toEqual({ playerId: 'user1', socketId: 'socket1', joinedAt: 1234567890 });
    });
  });

  describe('getQueueStatus', () => {
    it('should return queue status for player', async () => {
      redis.get.mockResolvedValue('user123');
      redis.zrank.mockResolvedValue(2);

      const result = await QueueManager.getQueueStatus('socket1');

      expect(result).toEqual({
        position: 3,
        estimatedWaitTime: 90
      });
    });

    it('should return null when socket not found', async () => {
      redis.get.mockResolvedValue(null);

      const result = await QueueManager.getQueueStatus('socket1');

      expect(result).toBeNull();
    });

    it('should return null when player not in queue', async () => {
      redis.get.mockResolvedValue('user123');
      redis.zrank.mockResolvedValue(null);

      const result = await QueueManager.getQueueStatus('socket1');

      expect(result).toBeNull();
    });
  });

  describe('reconnectToQueue', () => {
    it('should reconnect player with existing position', async () => {
      redis.zrank.mockResolvedValue(1);
      redis.set.mockResolvedValue('OK');
      redis.hset.mockResolvedValue(1);
      redis.expire.mockResolvedValue(1);

      const result = await QueueManager.reconnectToQueue('socket1', 'user123');

      expect(redis.set).toHaveBeenCalledWith('matchmaking:socket:socket1', 'user123', 'EX', 3600);
      expect(redis.set).toHaveBeenCalledWith('matchmaking:user:user123', 'socket1', 'EX', 3600);
      expect(result).toEqual({
        position: 2,
        estimatedWaitTime: 60
      });
    });

    it('should return null when player not in queue', async () => {
      redis.zrank.mockResolvedValue(null);

      const result = await QueueManager.reconnectToQueue('socket1', 'user123');

      expect(result).toBeNull();
    });
  });

  describe('removeTimedOutPlayers', () => {
    it('should remove timed-out players', async () => {
      const now = Date.now();
      const oldTimestamp = now - 70000; // 70 seconds ago
      const newTimestamp = now - 30000; // 30 seconds ago

      redis.zrange.mockResolvedValue([
        'user1',
        oldTimestamp.toString(),
        'user2',
        newTimestamp.toString()
      ]);
      redis.get.mockResolvedValue('user1');
      redis.hgetall.mockImplementation(key => {
        if (key === 'matchmaking:player:user1') {
          return Promise.resolve({ socketId: 'socket1' });
        }
        return Promise.resolve({});
      });
      redis.zrem.mockResolvedValue(1);
      redis.del.mockResolvedValue(1);

      const result = await QueueManager.removeTimedOutPlayers(60000);

      expect(result).toHaveLength(1);
      expect(result[0].playerId).toBe('user1');
    });

    it('should handle players without socket IDs', async () => {
      const now = Date.now();
      const oldTimestamp = now - 70000;

      redis.zrange.mockResolvedValue(['user1', oldTimestamp.toString()]);
      redis.hgetall.mockResolvedValue({});
      redis.zrem.mockResolvedValue(1);
      redis.del.mockResolvedValue(1);

      const result = await QueueManager.removeTimedOutPlayers(60000);

      expect(result).toHaveLength(1);
      expect(result[0].playerId).toBe('user1');
      expect(result[0].socketId).toBeNull();
    });
  });

  describe('getAllPlayersQueueStatus', () => {
    it('should return queue status for all players', async () => {
      redis.zrange.mockResolvedValue(['user1', '1234567890', 'user2', '1234567891']);
      redis.hgetall.mockImplementation(key => {
        if (key === 'matchmaking:player:user1') {
          return Promise.resolve({ socketId: 'socket1' });
        }
        if (key === 'matchmaking:player:user2') {
          return Promise.resolve({ socketId: 'socket2' });
        }
        return Promise.resolve({});
      });
      redis.zrank.mockImplementation((key, playerId) => {
        if (playerId === 'user1') return Promise.resolve(0);
        if (playerId === 'user2') return Promise.resolve(1);
        return Promise.resolve(null);
      });

      const result = await QueueManager.getAllPlayersQueueStatus();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ socketId: 'socket1', position: 1, estimatedWaitTime: 30 });
      expect(result[1]).toEqual({ socketId: 'socket2', position: 2, estimatedWaitTime: 60 });
    });
  });

  describe('removeFromQueueByUserId', () => {
    it('should remove player by userId', async () => {
      redis.get.mockResolvedValue('socket1');
      redis.zrem.mockResolvedValue(1);
      redis.del.mockResolvedValue(1);

      await QueueManager.removeFromQueueByUserId('user123');

      expect(redis.zrem).toHaveBeenCalledWith('matchmaking:queue', 'user123');
      expect(redis.get).toHaveBeenCalledWith('matchmaking:user:user123');
      expect(redis.del).toHaveBeenCalledWith('matchmaking:socket:socket1');
      expect(redis.del).toHaveBeenCalledWith('matchmaking:user:user123');
      expect(redis.del).toHaveBeenCalledWith('matchmaking:player:user123');
    });

    it('should handle removal when socket not found', async () => {
      redis.get.mockResolvedValue(null);
      redis.zrem.mockResolvedValue(1);
      redis.del.mockResolvedValue(1);

      await QueueManager.removeFromQueueByUserId('user123');

      expect(redis.zrem).toHaveBeenCalledWith('matchmaking:queue', 'user123');
      expect(redis.del).not.toHaveBeenCalledWith('matchmaking:socket:');
    });
  });
});
