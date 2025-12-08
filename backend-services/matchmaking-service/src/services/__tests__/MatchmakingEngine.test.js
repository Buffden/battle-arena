const MatchmakingEngine = require('../MatchmakingEngine');
const queueManager = require('../QueueManager');
const gameEngineClient = require('../GameEngineClient');
const { createPlayers } = require('./utils/test-helpers');

// Mock dependencies
jest.mock('../QueueManager');
jest.mock('../GameEngineClient');

describe('MatchmakingEngine', () => {
  let matchAcceptanceManager;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock MatchAcceptanceManager
    matchAcceptanceManager = {
      getMatchAcceptanceByUserId: jest.fn()
    };

    // Reset the MatchmakingEngine instance state
    MatchmakingEngine.setMatchAcceptanceManager(null);
  });

  describe('setMatchAcceptanceManager', () => {
    it('should set the MatchAcceptanceManager instance', () => {
      MatchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);
      expect(MatchmakingEngine.matchAcceptanceManager).toBe(matchAcceptanceManager);
    });

    it('should allow setting to null', () => {
      MatchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);
      MatchmakingEngine.setMatchAcceptanceManager(null);
      expect(MatchmakingEngine.matchAcceptanceManager).toBeNull();
    });
  });

  describe('getFirstTwoAvailablePlayers', () => {
    it('should return null when queue has less than 2 players', async () => {
      queueManager.getAllPlayersWithSockets.mockResolvedValue(createPlayers(1));

      const result = await MatchmakingEngine.getFirstTwoAvailablePlayers();

      expect(result).toBeNull();
      expect(queueManager.getAllPlayersWithSockets).toHaveBeenCalledTimes(1);
    });

    it('should return null when queue is empty', async () => {
      queueManager.getAllPlayersWithSockets.mockResolvedValue([]);

      const result = await MatchmakingEngine.getFirstTwoAvailablePlayers();

      expect(result).toBeNull();
    });

    it('should return first two players when matchAcceptanceManager is not set', async () => {
      const players = createPlayers(3);
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);

      const result = await MatchmakingEngine.getFirstTwoAvailablePlayers();

      expect(result).toEqual(createPlayers(2));
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).not.toHaveBeenCalled();
    });

    it('should return first two available players when none are in match acceptance', async () => {
      MatchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);

      const players = [
        { playerId: 'player1', socketId: 'socket1' },
        { playerId: 'player2', socketId: 'socket2' },
        { playerId: 'player3', socketId: 'socket3' }
      ];
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);

      const result = await MatchmakingEngine.getFirstTwoAvailablePlayers();

      expect(result).toEqual([
        { playerId: 'player1', socketId: 'socket1' },
        { playerId: 'player2', socketId: 'socket2' }
      ]);
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledTimes(2);
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledWith('player1');
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledWith('player2');
    });

    it('should skip players already in match acceptance and return next available', async () => {
      MatchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);

      const players = [
        { playerId: 'player1', socketId: 'socket1' },
        { playerId: 'player2', socketId: 'socket2' },
        { playerId: 'player3', socketId: 'socket3' },
        { playerId: 'player4', socketId: 'socket4' }
      ];
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);

      // Player 1 is in a match acceptance session
      matchAcceptanceManager.getMatchAcceptanceByUserId
        .mockResolvedValueOnce({ matchId: 'match-123', player1Id: 'player1' }) // player1
        .mockResolvedValueOnce(null) // player2
        .mockResolvedValueOnce(null); // player3

      const result = await MatchmakingEngine.getFirstTwoAvailablePlayers();

      expect(result).toEqual([
        { playerId: 'player2', socketId: 'socket2' },
        { playerId: 'player3', socketId: 'socket3' }
      ]);
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledTimes(3);
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledWith('player1');
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledWith('player2');
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledWith('player3');
    });

    it('should return null when only one available player after filtering', async () => {
      MatchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);

      const players = [
        { playerId: 'player1', socketId: 'socket1' },
        { playerId: 'player2', socketId: 'socket2' }
      ];
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);

      // Player 1 is in a match acceptance session
      matchAcceptanceManager.getMatchAcceptanceByUserId
        .mockResolvedValueOnce({ matchId: 'match-123', player1Id: 'player1' }) // player1
        .mockResolvedValueOnce(null); // player2

      const result = await MatchmakingEngine.getFirstTwoAvailablePlayers();

      expect(result).toBeNull();
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledTimes(2);
    });

    it('should return null when all players are in match acceptance sessions', async () => {
      MatchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);

      const players = [
        { playerId: 'player1', socketId: 'socket1' },
        { playerId: 'player2', socketId: 'socket2' }
      ];
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);

      // Both players are in match acceptance sessions
      matchAcceptanceManager.getMatchAcceptanceByUserId
        .mockResolvedValueOnce({ matchId: 'match-123', player1Id: 'player1' })
        .mockResolvedValueOnce({ matchId: 'match-456', player1Id: 'player2' });

      const result = await MatchmakingEngine.getFirstTwoAvailablePlayers();

      expect(result).toBeNull();
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledTimes(2);
    });

    it('should stop checking once two available players are found', async () => {
      MatchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);

      const players = [
        { playerId: 'player1', socketId: 'socket1' },
        { playerId: 'player2', socketId: 'socket2' },
        { playerId: 'player3', socketId: 'socket3' },
        { playerId: 'player4', socketId: 'socket4' }
      ];
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);

      const result = await MatchmakingEngine.getFirstTwoAvailablePlayers();

      expect(result).toEqual([
        { playerId: 'player1', socketId: 'socket1' },
        { playerId: 'player2', socketId: 'socket2' }
      ]);
      // Should only check first 2 players, not all 4
      expect(matchAcceptanceManager.getMatchAcceptanceByUserId).toHaveBeenCalledTimes(2);
    });
  });

  describe('getFirstTwoPlayers', () => {
    it('should call getFirstTwoAvailablePlayers (deprecated method)', async () => {
      const players = [
        { playerId: 'player1', socketId: 'socket1' },
        { playerId: 'player2', socketId: 'socket2' }
      ];
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);

      const result = await MatchmakingEngine.getFirstTwoPlayers();

      expect(result).toEqual(players);
      expect(queueManager.getAllPlayersWithSockets).toHaveBeenCalledTimes(1);
    });
  });

  describe('createMatchObject', () => {
    it('should create a match object with correct structure', () => {
      const players = createPlayers(2);

      const match = MatchmakingEngine.createMatchObject(players);

      expect(match).toHaveProperty('matchId');
      expect(match).toHaveProperty('players');
      expect(match).toHaveProperty('createdAt');
      expect(match.matchId).toMatch(/^match-\d+-[a-z0-9]+$/);
      expect(match.players).toHaveLength(2);
      expect(match.players[0]).toEqual({
        userId: 'player1',
        socketId: 'socket1',
        heroId: 'default-hero'
      });
      expect(match.players[1]).toEqual({
        userId: 'player2',
        socketId: 'socket2',
        heroId: 'default-hero'
      });
      expect(typeof match.createdAt).toBe('number');
    });

    it('should generate unique match IDs', () => {
      const players = createPlayers(2);

      const match1 = MatchmakingEngine.createMatchObject(players);
      // Small delay to ensure different timestamp
      const match2 = MatchmakingEngine.createMatchObject(players);

      expect(match1.matchId).not.toBe(match2.matchId);
    });

    it('should assign default hero ID to all players', () => {
      const players = createPlayers(2);

      const match = MatchmakingEngine.createMatchObject(players);

      expect(match.players[0].heroId).toBe('default-hero');
      expect(match.players[1].heroId).toBe('default-hero');
    });

    it('should handle players with userId property', () => {
      const players = createPlayers(2, { includeUserId: true });

      const match = MatchmakingEngine.createMatchObject(players);

      // Should use playerId, not userId
      expect(match.players[0].userId).toBe('player1');
      expect(match.players[1].userId).toBe('player2');
    });
  });

  describe('findMatch', () => {
    beforeEach(() => {
      MatchmakingEngine.setMatchAcceptanceManager(matchAcceptanceManager);
    });

    it('should return null when queue has less than 2 players', async () => {
      queueManager.getQueueLength.mockResolvedValue(1);

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
      expect(queueManager.getQueueLength).toHaveBeenCalledTimes(1);
      expect(queueManager.getAllPlayersWithSockets).not.toHaveBeenCalled();
      expect(gameEngineClient.createGameRoom).not.toHaveBeenCalled();
    });

    it('should return null when queue has 0 players', async () => {
      queueManager.getQueueLength.mockResolvedValue(0);

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
    });

    it('should return null when queue has exactly 1 player', async () => {
      queueManager.getQueueLength.mockResolvedValue(1);

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
    });

    it('should return null when getFirstTwoAvailablePlayers returns null', async () => {
      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockResolvedValue([
        { playerId: 'player1', socketId: 'socket1' }
      ]);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
      expect(queueManager.getQueueLength).toHaveBeenCalledTimes(1);
      expect(gameEngineClient.createGameRoom).not.toHaveBeenCalled();
    });

    it('should return null when getFirstTwoAvailablePlayers returns less than 2 players', async () => {
      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockResolvedValue([]);

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
    });

    it('should create match and return it when Game Engine succeeds', async () => {
      const players = createPlayers(2);

      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);
      gameEngineClient.createGameRoom.mockResolvedValue({
        success: true,
        gameRoomId: 'game-room-123'
      });

      const result = await MatchmakingEngine.findMatch();

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('matchId');
      expect(result).toHaveProperty('gameRoomId', 'game-room-123');
      expect(result).toHaveProperty('players');
      expect(result.players).toHaveLength(2);
      expect(result.players[0].userId).toBe('player1');
      expect(result.players[1].userId).toBe('player2');
      expect(gameEngineClient.createGameRoom).toHaveBeenCalledTimes(1);
      expect(gameEngineClient.createGameRoom).toHaveBeenCalledWith(
        expect.objectContaining({
          matchId: expect.any(String),
          players: expect.arrayContaining([
            expect.objectContaining({ userId: 'player1', heroId: 'default-hero' }),
            expect.objectContaining({ userId: 'player2', heroId: 'default-hero' })
          ])
        })
      );
    });

    it('should return match even when Game Engine fails (with error logged)', async () => {
      const players = createPlayers(2);

      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);
      gameEngineClient.createGameRoom.mockResolvedValue({
        success: false,
        error: 'Game Engine unavailable'
      });

      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await MatchmakingEngine.findMatch();

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('matchId');
      expect(result).not.toHaveProperty('gameRoomId');
      expect(result.players).toHaveLength(2);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create game room')
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle errors from queueManager.getQueueLength', async () => {
      const error = new Error('Redis connection failed');
      queueManager.getQueueLength.mockRejectedValue(error);

      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle errors from getFirstTwoAvailablePlayers', async () => {
      const error = new Error('Failed to get players');
      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockRejectedValue(error);

      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle errors from gameEngineClient.createGameRoom', async () => {
      const players = createPlayers(2);

      const error = new Error('Game Engine request failed');
      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);
      gameEngineClient.createGameRoom.mockRejectedValue(error);

      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle errors from createMatchObject', async () => {
      const players = createPlayers(2);

      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);

      // Mock createMatchObject to throw an error
      const originalCreateMatchObject = MatchmakingEngine.createMatchObject;
      MatchmakingEngine.createMatchObject = jest.fn(() => {
        throw new Error('Failed to create match object');
      });

      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await MatchmakingEngine.findMatch();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore original method
      MatchmakingEngine.createMatchObject = originalCreateMatchObject;
      consoleErrorSpy.mockRestore();
    });

    it('should use gameRoomId from Game Engine response when provided', async () => {
      const players = createPlayers(2);

      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);
      gameEngineClient.createGameRoom.mockResolvedValue({
        success: true,
        gameRoomId: 'custom-game-room-id-456'
      });

      const result = await MatchmakingEngine.findMatch();

      expect(result.gameRoomId).toBe('custom-game-room-id-456');
    });

    it('should handle queue with exactly 2 players', async () => {
      const players = createPlayers(2);

      queueManager.getQueueLength.mockResolvedValue(2);
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);
      gameEngineClient.createGameRoom.mockResolvedValue({
        success: true,
        gameRoomId: 'game-room-123'
      });

      const result = await MatchmakingEngine.findMatch();

      expect(result).not.toBeNull();
      expect(result.players).toHaveLength(2);
    });

    it('should handle queue with more than 2 players', async () => {
      const players = createPlayers(3);

      queueManager.getQueueLength.mockResolvedValue(3);
      queueManager.getAllPlayersWithSockets.mockResolvedValue(players);
      matchAcceptanceManager.getMatchAcceptanceByUserId.mockResolvedValue(null);
      gameEngineClient.createGameRoom.mockResolvedValue({
        success: true,
        gameRoomId: 'game-room-123'
      });

      const result = await MatchmakingEngine.findMatch();

      expect(result).not.toBeNull();
      // Should match first two players (FIFO)
      expect(result.players[0].userId).toBe('player1');
      expect(result.players[1].userId).toBe('player2');
    });
  });
});
