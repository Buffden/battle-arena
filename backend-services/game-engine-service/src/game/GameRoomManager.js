const logger = require('../utils/logger');

class GameRoomManager {
  constructor() {
    this.rooms = new Map(); // Map<roomId, GameRoom>
    this.playerRooms = new Map(); // Map<playerId, roomId>
  }

  /**
   * Create a new game room
   * @param {string} roomId - Unique room identifier
   * @param {Array} players - Array of player objects with id, username, and xp
   * @returns {GameRoom} The created game room
   */
  createRoom(roomId, players) {
    if (this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} already exists`);
    }

    if (!Array.isArray(players) || players.length !== 2) {
      throw new Error('Room must be created with exactly 2 players');
    }

    // Validate players
    players.forEach(player => {
      if (!player.id || !player.username) {
        throw new Error('Invalid player data');
      }
      if (this.playerRooms.has(player.id)) {
        throw new Error(`Player ${player.username} is already in a room`);
      }
    });

    const room = new GameRoom(roomId, this.io);
    players.forEach(player => {
      room.players.set(player.id, player);
    });
    this.rooms.set(roomId, room);

    // Track player-room associations
    players.forEach(player => {
      this.playerRooms.set(player.id, roomId);
    });

    logger.info(`Created game room ${roomId} with players: ${players.map(p => p.username).join(', ')}`);
    return room;
  }

  /**
   * Get a game room by ID
   * @param {string} roomId - Room identifier
   * @returns {GameRoom|null} The game room or null if not found
   */
  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  /**
   * Get a player's current room
   * @param {string} playerId - Player identifier
   * @returns {GameRoom|null} The game room or null if player is not in a room
   */
  getPlayerRoom(playerId) {
    const roomId = this.playerRooms.get(playerId);
    return roomId ? this.rooms.get(roomId) : null;
  }

  /**
   * Remove a game room
   * @param {string} roomId - Room identifier
   */
  removeRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      // Remove player-room associations
      room.players.forEach(player => {
        this.playerRooms.delete(player.id);
      });
      this.rooms.delete(roomId);
      logger.info(`Removed game room ${roomId}`);
    }
  }

  /**
   * Validate if a player can join a room
   * @param {string} roomId - Room identifier
   * @param {Object} player - Player object
   * @returns {boolean} True if player can join
   */
  canPlayerJoin(roomId, player) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    // Check if player is already in another room
    if (this.playerRooms.has(player.id)) {
      return this.playerRooms.get(player.id) === roomId;
    }

    // Check if room has space and player is in the room's player list
    return room.players.length < 2 && 
           room.players.some(p => p.id === player.id);
  }

  /**
   * Allow a player to join a room, or return the room if already joined
   * @param {string} roomId - Room identifier
   * @param {string} token - Player's auth token (optional, for future use)
   * @param {string} socketId - Player's socket id (optional, for logging)
   * @returns {GameRoom} The game room
   */
  async joinRoom(roomId, token, socketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} does not exist`);
    }
    // For now, just log the join attempt. You can add player validation here if needed.
    logger.info(`Player with socket ${socketId} attempting to join room ${roomId}`);
    // Optionally, add player to room.players here if needed
    return room;
  }
}

module.exports = GameRoomManager; 