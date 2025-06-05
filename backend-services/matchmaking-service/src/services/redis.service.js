const Redis = require('ioredis');
const logger = require('../utils/logger');

class RedisService {
  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        logger.info(`Redis connection attempt ${times}, retrying in ${delay}ms...`);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      }
    });
    
    this.queueKey = 'matchmaking:queue';
    this.lobbiesKey = 'matchmaking:lobbies';
    this.playerQueueKey = 'matchmaking:player_queue';
    
    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('reconnecting', () => {
      logger.info('Reconnecting to Redis...');
    });
  }

  /**
   * Add player to matchmaking queue
   * @param {Object} player - Player data
   * @returns {Promise<void>}
   */
  async addToQueue(player) {
    const playerData = JSON.stringify({
      id: player.id,
      username: player.username,
      xp: player.xp || 1000,
      timestamp: Date.now()
    });
    
    await this.client.zadd(this.queueKey, player.xp || 1000, playerData);
    await this.client.hset(this.playerQueueKey, player.id, playerData);
    logger.info(`Player ${player.username} added to queue`);
  }

  /**
   * Remove player from matchmaking queue
   * @param {string} playerId - Player ID
   * @returns {Promise<void>}
   */
  async removeFromQueue(playerId) {
    try {
      const playerData = await this.client.hget(this.playerQueueKey, playerId);
      
      if (playerData) {
        await this.client.zrem(this.queueKey, playerData);
        await this.client.hdel(this.playerQueueKey, playerId);
        
        const player = JSON.parse(playerData);
        logger.info(`Player ${player.username} removed from queue`);
      } else {
        logger.warn(`Player ${playerId} not found in queue`);
      }
    } catch (error) {
      logger.error(`Error removing player ${playerId} from queue:`, error);
      throw error;
    }
  }

  /**
   * Get players in queue within XP range
   * @param {number} xp - Player's XP
   * @param {number} range - XP range for matching
   * @returns {Promise<Array>} Array of players in range
   */
  async getPlayersInRange(xp, range = 200) {
    const min = xp - range;
    const max = xp + range;
    const players = await this.client.zrangebyscore(this.queueKey, min, max);
    return players.map(player => JSON.parse(player));
  }

  /**
   * Create a new lobby
   * @param {Array} players - Array of player data
   * @returns {Promise<string>} Lobby ID
   */
  async createLobby(players) {
    const lobbyId = `lobby:${Date.now()}`;
    const lobbyData = {
      id: lobbyId,
      players: players,
      status: 'waiting',
      createdAt: Date.now()
    };
    
    await this.client.hset(this.lobbiesKey, lobbyId, JSON.stringify(lobbyData));
    logger.info(`Created lobby ${lobbyId} with ${players.length} players`);
    return lobbyId;
  }

  /**
   * Get lobby data
   * @param {string} lobbyId - Lobby ID
   * @returns {Promise<Object>} Lobby data
   */
  async getLobby(lobbyId) {
    const lobbyData = await this.client.hget(this.lobbiesKey, lobbyId);
    return lobbyData ? JSON.parse(lobbyData) : null;
  }

  /**
   * Update lobby status
   * @param {string} lobbyId - Lobby ID
   * @param {string} status - New status
   * @returns {Promise<void>}
   */
  async updateLobbyStatus(lobbyId, status) {
    const lobby = await this.getLobby(lobbyId);
    if (lobby) {
      lobby.status = status;
      await this.client.hset(this.lobbiesKey, lobbyId, JSON.stringify(lobby));
      logger.info(`Updated lobby ${lobbyId} status to ${status}`);
    }
  }

  /**
   * Remove lobby
   * @param {string} lobbyId - Lobby ID
   * @returns {Promise<void>}
   */
  async removeLobby(lobbyId) {
    await this.client.hdel(this.lobbiesKey, lobbyId);
    logger.info(`Removed lobby ${lobbyId}`);
  }
}

module.exports = new RedisService(); 