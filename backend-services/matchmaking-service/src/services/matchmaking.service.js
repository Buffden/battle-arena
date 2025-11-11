const redisService = require('./redis.service');
const logger = require('../utils/logger');
const axios = require('axios');

class MatchmakingService {
  constructor() {
    this.XP_RANGE = 200; // Maximum XP difference between players
    this.MIN_PLAYERS_PER_MATCH = 2;
    this.MAX_PLAYERS_PER_MATCH = 2;
    this.QUEUE_CHECK_INTERVAL = 5000; // 5 seconds
    this.playerQueue = new Map(); // Map<playerId, socket>
    this.pendingMatchNotifications = {};
    this.io = null;
  }

  /**
   * Initialize the service with Socket.IO instance
   * @param {Server} io - Socket.IO server instance
   */
  initialize(io) {
    this.io = io;
    // Start queue processing
    setInterval(() => this.processQueue(), this.QUEUE_CHECK_INTERVAL);
  }

  /**
   * Handle player joining the queue
   * @param {Object} player - Player object with id, username, and xp
   * @param {Socket} socket - Socket instance
   */
  async handlePlayerJoin(player, socket) {
    try {
      if (!player.id || !player.username) {
        throw new Error('Invalid player data');
      }

      // Check if player is already in queue
      if (this.playerQueue.has(player.id)) {
        logger.info(`Player ${player.username} (${player.id}) already in queue, ignoring duplicate join`);
        return;
      }

      // Add player to queue
      this.playerQueue.set(player.id, socket);
      await redisService.addToQueue(player);
      logger.info(`Player ${player.username} (${player.id}) joined queue`);
    } catch (error) {
      logger.error('Error adding player to queue:', error);
      throw error;
    }
  }

  /**
   * Process the matchmaking queue
   */
  async processQueue() {
    try {
      logger.info(`Processing queue. Current queue size: ${this.playerQueue.size}`);
      // Get all players from queue
      const players = Array.from(this.playerQueue.entries());
      if (players.length < this.MIN_PLAYERS_PER_MATCH) {
        logger.info('Not enough players to match.');
        return;
      }
      // Sort players by xp
      players.sort(([, a], [, b]) => a.user.xp - b.user.xp);
      // Match players in pairs
      for (let i = 0; i < players.length - 1; i += 2) {
        const [player1Id, socket1] = players[i];
        const [player2Id, socket2] = players[i + 1];
        logger.info(`Considering pair: ${player1Id} vs ${player2Id}`);
        // Skip if trying to match same player
        if (player1Id === player2Id) {
          logger.info('Skipping pair: same player.');
          continue;
        }
        const player1 = socket1.user;
        const player2 = socket2.user;
        logger.info(`Player1: ${player1.username} (${player1.xp}), Player2: ${player2.username} (${player2.xp})`);
        // Only create a match if xp difference is within range
        if (Math.abs(player1.xp - player2.xp) <= this.XP_RANGE) {
          logger.info(`Matching players: ${player1.username} and ${player2.username}`);
          await this.createMatch([player1, player2]);
          // Remove matched players from queue
          this.playerQueue.delete(player1Id);
          this.playerQueue.delete(player2Id);
        } else {
          logger.info(`Skipping pair: xp difference too high (${Math.abs(player1.xp - player2.xp)})`);
        }
      }
    } catch (error) {
      logger.error('Error processing queue:', error);
    }
  }

  /**
   * Handle player leaving the queue
   * @param {string} playerId - Player ID
   */
  async handlePlayerLeave(playerId) {
    try {
      if (!playerId) {
        throw new Error('Player ID is required');
      }

      // Remove from local queue
      this.playerQueue.delete(playerId);
      
      // Remove from Redis queue
      await redisService.removeFromQueue(playerId);
      logger.info(`Player ${playerId} left the queue`);
    } catch (error) {
      logger.error('Error removing player from queue:', error);
      throw error;
    }
  }

  /**
   * Create a match with the given players
   * @param {Array} players - Array of players to match
   */
  async createMatch(players) {
    try {
      logger.info(`Attempting to create match for players: ${players.map(p => p.username).join(', ')}`);
      // Only create match if we have exactly 2 players
      if (players.length !== this.MAX_PLAYERS_PER_MATCH) {
        logger.warn(`Cannot create match with ${players.length} players. Need exactly ${this.MAX_PLAYERS_PER_MATCH} players.`);
        return null;
      }
      // Ensure both sockets are connected before creating the match
      const sockets = [];
      for (const player of players) {
        const socket = this.findPlayerSocket(player.id);
        if (!socket) {
          logger.warn(`Player ${player.username} (${player.id}) not found in active connections. Storing pending match notification.`);
          this.pendingMatchNotifications[player.id] = {
            lobbyId: null, // Will be set after lobby creation
            players,
            status: 'pending'
          };
        }
        sockets.push(socket);
      }
      // Only proceed if both sockets are available
      if (sockets.some(s => !s)) {
        logger.warn('Not all players are connected. Aborting match creation.');
        return null;
      }
      // Create lobby
      const lobbyId = await redisService.createLobby(players);
      // Notify game engine to create the room
      try {
        await axios.post('http://game-engine-service:5002/api/rooms/create-room', {
          roomId: lobbyId,
          players
        });
        logger.info(`Notified game engine to create room ${lobbyId}`);
      } catch (err) {
        logger.error('Failed to notify game engine to create room:', err);
        // Optionally: handle error, retry, or abort match creation
      }
      // Update pending notifications with lobbyId
      for (const player of players) {
        if (this.pendingMatchNotifications[player.id]) {
          this.pendingMatchNotifications[player.id].lobbyId = lobbyId;
        }
      }
      // Remove players from queue
      for (const player of players) {
        await redisService.removeFromQueue(player.id);
      }
      logger.info(`Created match with ${players.length} players in lobby ${lobbyId}`);
      // Notify both players about the match
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const socket = sockets[i];
        if (socket) {
          socket.emit('matchFound', {
            lobbyId,
            players,
            status: 'pending' // Match is pending until both players accept
          });
        }
      }
      return {
        lobbyId,
        players,
        status: 'pending'
      };
    } catch (error) {
      logger.error('Error creating match:', error);
      throw error;
    }
  }

  /**
   * Find a player's socket by their ID
   * @param {string} playerId - Player ID
   * @returns {Socket|null} Socket instance or null if not found
   */
  findPlayerSocket(playerId) {
    if (!this.io) return null;
    const sockets = Array.from(this.io.sockets.sockets.values());
    return sockets.find(socket => socket.user?.id === playerId);
  }

  /**
   * Wait for a player's socket to be available, retrying up to maxRetries
   */
  async waitForPlayerSocket(playerId, maxRetries = 5, delayMs = 200) {
    for (let i = 0; i < maxRetries; i++) {
      const socket = this.findPlayerSocket(playerId);
      if (socket) return socket;
      await new Promise(res => setTimeout(res, delayMs));
    }
    return null;
  }

  // When a player reconnects, check for pending match notifications
  handlePlayerReconnect(socket) {
    const playerId = socket.user?.id;
    if (playerId && this.pendingMatchNotifications[playerId]) {
      const matchData = this.pendingMatchNotifications[playerId];
      if (matchData.lobbyId) {
        socket.emit('matchFound', matchData);
        logger.info(`Sent pending matchFound to reconnected player ${playerId}`);
        delete this.pendingMatchNotifications[playerId];
      }
    }
  }

  /**
   * Handle player accepting a match
   * @param {string} playerId - Player ID
   * @param {string} lobbyId - Lobby ID
   */
  async handleMatchAccept(playerId, lobbyId) {
    try {
      const lobby = await redisService.getLobby(lobbyId);
      if (!lobby) {
        throw new Error('Lobby not found');
      }

      // Update player's acceptance status
      await redisService.updatePlayerAcceptance(lobbyId, playerId, true);

      // Check if all players have accepted
      const allAccepted = await redisService.checkAllPlayersAccepted(lobbyId);
      
      if (allAccepted) {
        // Update match status to 'ready'
        await redisService.updateMatchStatus(lobbyId, 'ready');
        
        // Notify all players in the lobby
        if (this.io) {
          this.io.to(`lobby:${lobbyId}`).emit('matchReady', {
            lobbyId,
            players: lobby.players
          });
        }
      }

      return true;
    } catch (error) {
      logger.error('Error accepting match:', error);
      throw error;
    }
  }

  /**
   * Handle player rejecting a match
   * @param {string} playerId - Player ID
   * @param {string} lobbyId - Lobby ID
   */
  async handleMatchReject(playerId, lobbyId) {
    try {
      const lobby = await redisService.getLobby(lobbyId);
      if (!lobby) {
        throw new Error('Lobby not found');
      }

      // Notify all players in the lobby
      if (this.io) {
        this.io.to(`lobby:${lobbyId}`).emit('matchCancelled', {
          lobbyId,
          reason: 'player_rejected'
        });
      }

      // Clean up the lobby
      await redisService.deleteLobby(lobbyId);

      return true;
    } catch (error) {
      logger.error('Error rejecting match:', error);
      throw error;
    }
  }
}

module.exports = new MatchmakingService(); 