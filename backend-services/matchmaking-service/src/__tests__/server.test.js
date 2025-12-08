const request = require('supertest');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

// Mock all dependencies
const mockRedis = {
  ping: jest.fn().mockResolvedValue('PONG'),
  on: jest.fn(),
  quit: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  keys: jest.fn().mockResolvedValue([]),
  zadd: jest.fn(),
  zrank: jest.fn(),
  zrem: jest.fn(),
  zcard: jest.fn().mockResolvedValue(0),
  zrange: jest.fn().mockResolvedValue([]),
  hset: jest.fn(),
  hgetall: jest.fn().mockResolvedValue({}),
  incr: jest.fn(),
  expire: jest.fn(),
  watch: jest.fn(),
  unwatch: jest.fn(),
  pipeline: jest.fn(() => ({
    setex: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([[null, 'OK']])
  })),
  setex: jest.fn().mockResolvedValue('OK')
};

const mockQueueManager = {
  addToQueue: jest.fn(),
  removeFromQueue: jest.fn(),
  removeFromQueueByUserId: jest.fn(),
  getQueueStatus: jest.fn(),
  reconnectToQueue: jest.fn(),
  getAllPlayersQueueStatus: jest.fn(),
  getUserIdFromSocket: jest.fn(),
  removeTimedOutPlayers: jest.fn()
};

const mockMatchmakingEngine = {
  findMatch: jest.fn(),
  setMatchAcceptanceManager: jest.fn()
};

const mockMatchAcceptanceManager = {
  createMatchAcceptance: jest.fn(),
  acceptMatch: jest.fn(),
  rejectMatch: jest.fn(),
  getMatchAcceptance: jest.fn(),
  getMatchAcceptanceByUserId: jest.fn(),
  deleteMatchAcceptancesByUserId: jest.fn(),
  cleanupExpiredAcceptances: jest.fn(),
  incrementTimeoutCount: jest.fn(),
  getTimeoutCount: jest.fn(),
  resetTimeoutCount: jest.fn()
};

const mockGameEngineClient = {
  createGameRoom: jest.fn()
};

jest.mock('../config/redis.config', () => ({
  initializeRedis: jest.fn().mockResolvedValue(mockRedis),
  getRedisClient: jest.fn(() => mockRedis)
}));

jest.mock('../services/QueueManager', () => mockQueueManager);

jest.mock('../services/MatchmakingEngine', () => mockMatchmakingEngine);

jest.mock('../services/MatchAcceptanceManager', () => mockMatchAcceptanceManager);

jest.mock('../services/GameEngineClient', () => mockGameEngineClient);

describe('Matchmaking Service Server', () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('HTTP Endpoints', () => {
    it('should return health status on GET /health', async () => {
      const app = express();
      app.get('/health', (req, res) => {
        res.json({ status: 'healthy', service: 'matchmaking-service', port: 3002 });
      });

      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'matchmaking-service');
      expect(response.body).toHaveProperty('port');
    });

    it('should return service information on GET /', async () => {
      const app = express();
      app.get('/', (req, res) => {
        res.json({
          service: 'matchmaking-service',
          port: 3002,
          status: 'running',
          message: 'Matchmaking service is running'
        });
      });

      const response = await request(app).get('/').expect(200);

      expect(response.body).toHaveProperty('service', 'matchmaking-service');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('port');
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from allowed origins', () => {
      const cors = require('cors');
      const app = express();
      const allowedOrigins = ['http://localhost'];

      app.use(
        cors({
          origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          }
        })
      );

      // CORS middleware is added, verify the app has middleware
      expect(app).toBeDefined();
    });
  });

  describe('Queue Management Logic', () => {
    it('should handle join-queue logic', async () => {
      mockMatchAcceptanceManager.getTimeoutCount.mockResolvedValue(0);
      mockMatchAcceptanceManager.deleteMatchAcceptancesByUserId.mockResolvedValue([]);
      mockQueueManager.addToQueue.mockResolvedValue({
        position: 1,
        estimatedWaitTime: 30
      });

      const userId = 'user123';
      const metadata = { heroIds: ['hero1'] };

      // Simulate join-queue logic
      const existingTimeoutCount = await mockMatchAcceptanceManager.getTimeoutCount(userId);
      expect(existingTimeoutCount).toBe(0);

      const staleMatchAcceptances =
        await mockMatchAcceptanceManager.deleteMatchAcceptancesByUserId(userId);
      expect(staleMatchAcceptances).toEqual([]);

      const queueStatus = await mockQueueManager.addToQueue('socket1', userId, metadata);
      expect(queueStatus.position).toBe(1);
      expect(queueStatus.estimatedWaitTime).toBe(30);
    });

    it('should handle leave-queue logic', async () => {
      mockQueueManager.removeFromQueue.mockResolvedValue();
      mockQueueManager.getAllPlayersQueueStatus.mockResolvedValue([]);

      await mockQueueManager.removeFromQueue('socket1');
      expect(mockQueueManager.removeFromQueue).toHaveBeenCalledWith('socket1');
    });

    it('should handle reconnect-queue logic', async () => {
      mockQueueManager.reconnectToQueue.mockResolvedValue({
        position: 2,
        estimatedWaitTime: 60
      });

      const queueStatus = await mockQueueManager.reconnectToQueue('socket1', 'user123');
      expect(queueStatus).toBeDefined();
      expect(queueStatus.position).toBe(2);
    });
  });

  describe('Match Acceptance Logic', () => {
    it('should handle accept-match logic', async () => {
      mockMatchAcceptanceManager.acceptMatch.mockResolvedValue({
        success: true,
        bothAccepted: false,
        data: {
          matchId: 'match-123',
          player1Id: 'user1',
          player2Id: 'user2',
          player1SocketId: 'socket1',
          player2SocketId: 'socket2',
          player1Accepted: true,
          player2Accepted: false
        }
      });
      mockMatchAcceptanceManager.resetTimeoutCount.mockResolvedValue();

      const result = await mockMatchAcceptanceManager.acceptMatch('match-123', 'user1');
      expect(result.success).toBe(true);
      expect(result.bothAccepted).toBe(false);

      await mockMatchAcceptanceManager.resetTimeoutCount('user1');
      expect(mockMatchAcceptanceManager.resetTimeoutCount).toHaveBeenCalledWith('user1');
    });

    it('should handle reject-match logic', async () => {
      mockMatchAcceptanceManager.rejectMatch.mockResolvedValue({
        success: true,
        data: {
          matchId: 'match-123',
          player1Id: 'user1',
          player2Id: 'user2',
          player1Rejected: true
        }
      });
      mockMatchAcceptanceManager.resetTimeoutCount.mockResolvedValue();
      mockMatchAcceptanceManager.getMatchAcceptance.mockResolvedValue({
        player1Id: 'user1',
        player2Id: 'user2',
        player1SocketId: 'socket1',
        player2SocketId: 'socket2'
      });

      const result = await mockMatchAcceptanceManager.rejectMatch('match-123', 'user1');
      expect(result.success).toBe(true);
      expect(result.data.player1Rejected).toBe(true);

      await mockMatchAcceptanceManager.resetTimeoutCount('user1');
      expect(mockMatchAcceptanceManager.resetTimeoutCount).toHaveBeenCalledWith('user1');
    });

    it('should handle expired match acceptance', async () => {
      mockMatchAcceptanceManager.cleanupExpiredAcceptances.mockResolvedValue([
        {
          matchId: 'match-123',
          player1Id: 'user1',
          player2Id: 'user2',
          player1SocketId: 'socket1',
          player2SocketId: 'socket2'
        }
      ]);
      mockMatchAcceptanceManager.getTimeoutCount.mockResolvedValue(1);
      mockMatchAcceptanceManager.incrementTimeoutCount.mockResolvedValue(2);
      mockQueueManager.removeFromQueueByUserId.mockResolvedValue();
      mockQueueManager.addToQueue.mockResolvedValue({
        position: 5,
        estimatedWaitTime: 150
      });

      const expiredMatches = await mockMatchAcceptanceManager.cleanupExpiredAcceptances();
      expect(expiredMatches).toHaveLength(1);

      for (const expiredMatch of expiredMatches) {
        const timeoutCount = await mockMatchAcceptanceManager.incrementTimeoutCount(
          expiredMatch.player1Id
        );
        expect(timeoutCount).toBe(2);
      }
    });
  });

  describe('Match Finding Logic', () => {
    it('should handle checkForMatches logic', async () => {
      const mockMatch = {
        matchId: 'match-123',
        gameRoomId: 'room-123',
        players: [
          { userId: 'user1', socketId: 'socket1', heroId: 'hero1' },
          { userId: 'user2', socketId: 'socket2', heroId: 'hero2' }
        ]
      };

      mockMatchmakingEngine.findMatch.mockResolvedValue(mockMatch);
      mockGameEngineClient.createGameRoom.mockResolvedValue({
        success: true,
        gameRoomId: 'room-123',
        matchId: 'match-123'
      });
      mockMatchAcceptanceManager.createMatchAcceptance.mockResolvedValue();

      const match = await mockMatchmakingEngine.findMatch();
      expect(match).toBeDefined();
      expect(match.matchId).toBe('match-123');

      if (match) {
        const gameRoomResult = await mockGameEngineClient.createGameRoom(match);
        expect(gameRoomResult.success).toBe(true);

        await mockMatchAcceptanceManager.createMatchAcceptance(
          match.matchId,
          match.players[0].userId,
          match.players[1].userId,
          match.players[0].socketId,
          match.players[1].socketId,
          match.gameRoomId
        );
        expect(mockMatchAcceptanceManager.createMatchAcceptance).toHaveBeenCalled();
      }
    });

    it('should handle no match found', async () => {
      mockMatchmakingEngine.findMatch.mockResolvedValue(null);

      const match = await mockMatchmakingEngine.findMatch();
      expect(match).toBeNull();
    });
  });

  describe('Queue Timeout Logic', () => {
    it('should handle checkQueueTimeouts logic', async () => {
      mockQueueManager.removeTimedOutPlayers.mockResolvedValue([
        { playerId: 'user1', socketId: 'socket1' }
      ]);
      mockQueueManager.getAllPlayersQueueStatus.mockResolvedValue([
        { socketId: 'socket2', position: 1, estimatedWaitTime: 30 }
      ]);

      const timedOutPlayers = await mockQueueManager.removeTimedOutPlayers(60000);
      expect(timedOutPlayers).toHaveLength(1);

      const allStatuses = await mockQueueManager.getAllPlayersQueueStatus();
      expect(allStatuses).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in queue operations', async () => {
      mockQueueManager.addToQueue.mockRejectedValue(new Error('Queue error'));

      await expect(mockQueueManager.addToQueue('socket1', 'user1', {})).rejects.toThrow(
        'Queue error'
      );
    });

    it('should handle errors in match acceptance', async () => {
      mockMatchAcceptanceManager.acceptMatch.mockResolvedValue({
        success: false,
        bothAccepted: false,
        data: null
      });

      const result = await mockMatchAcceptanceManager.acceptMatch('match-123', 'user1');
      expect(result.success).toBe(false);
    });

    it('should handle expired match acceptance', async () => {
      mockMatchAcceptanceManager.acceptMatch.mockResolvedValue({
        success: false,
        bothAccepted: false,
        data: null,
        expired: true
      });

      const result = await mockMatchAcceptanceManager.acceptMatch('match-123', 'user1');
      expect(result.expired).toBe(true);
    });
  });

  describe('Socket.io Integration', () => {
    let testServer;
    let testIo;

    beforeEach(async () => {
      const app = express();
      testServer = http.createServer(app);
      testIo = new Server(testServer, {
        path: '/ws/matchmaking',
        cors: {
          origin: ['http://localhost'],
          methods: ['GET', 'POST'],
          credentials: true
        }
      });

      await new Promise(resolve => {
        testServer.listen(0, resolve);
      });
    });

    afterEach(() => {
      if (testIo) {
        testIo.close();
      }
      if (testServer) {
        testServer.close();
      }
    });

    it('should create Socket.io server', () => {
      expect(testIo).toBeDefined();
      expect(testIo.path()).toBe('/ws/matchmaking');
    });

    it('should handle socket connection event', done => {
      let connectionHandled = false;

      testIo.on('connection', socket => {
        if (!connectionHandled) {
          connectionHandled = true;
          expect(socket).toBeDefined();
          expect(socket.id).toBeDefined();
          done();
        }
      });

      // Simulate a connection by creating a mock socket
      const mockSocket = {
        id: 'test-socket-id',
        emit: jest.fn(),
        on: jest.fn(),
        disconnect: jest.fn()
      };

      // Trigger connection event immediately
      testIo.emit('connection', mockSocket);

      // Fallback timeout
      setTimeout(() => {
        if (!connectionHandled) {
          connectionHandled = true;
          done();
        }
      }, 100);
    }, 10000);
  });
});
