const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class GamePersistence {
  constructor() {
    logger.info('Initializing game persistence');
    this.storageDir = path.join(process.cwd(), 'storage', 'games');
    this.ensureStorageDirectory();
  }

  /**
   * Ensure storage directory exists
   */
  async ensureStorageDirectory() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
      logger.debug('Storage directory ensured');
    } catch (error) {
      logger.error('Error creating storage directory:', error);
      throw error;
    }
  }

  /**
   * Save game state
   * @param {string} gameId - Game ID
   * @param {Object} gameData - Game data to save
   * @returns {Promise<boolean>} Success status
   */
  async saveGame(gameId, gameData) {
    logger.info(`Saving game state for game ${gameId}`);
    try {
      const filePath = path.join(this.storageDir, `${gameId}.json`);
      const data = {
        gameId,
        timestamp: Date.now(),
        ...gameData
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      logger.debug(`Game state saved to ${filePath}`);
      return true;
    } catch (error) {
      logger.error(`Error saving game state for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Load game state
   * @param {string} gameId - Game ID
   * @returns {Promise<Object>} Game data
   */
  async loadGame(gameId) {
    logger.info(`Loading game state for game ${gameId}`);
    try {
      const filePath = path.join(this.storageDir, `${gameId}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      const gameData = JSON.parse(data);
      
      logger.debug(`Game state loaded from ${filePath}`);
      return gameData;
    } catch (error) {
      logger.error(`Error loading game state for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Delete game state
   * @param {string} gameId - Game ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteGame(gameId) {
    logger.info(`Deleting game state for game ${gameId}`);
    try {
      const filePath = path.join(this.storageDir, `${gameId}.json`);
      await fs.unlink(filePath);
      
      logger.debug(`Game state deleted from ${filePath}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting game state for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * List all saved games
   * @returns {Promise<Array>} List of saved games
   */
  async listGames() {
    logger.info('Listing all saved games');
    try {
      const files = await fs.readdir(this.storageDir);
      const games = await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(async file => {
            const data = await fs.readFile(path.join(this.storageDir, file), 'utf8');
            return JSON.parse(data);
          })
      );

      logger.debug(`Found ${games.length} saved games`);
      return games;
    } catch (error) {
      logger.error('Error listing saved games:', error);
      throw error;
    }
  }

  /**
   * Save game snapshot
   * @param {string} gameId - Game ID
   * @param {Object} snapshot - Game snapshot data
   * @returns {Promise<boolean>} Success status
   */
  async saveSnapshot(gameId, snapshot) {
    logger.info(`Saving snapshot for game ${gameId}`);
    try {
      const snapshotsDir = path.join(this.storageDir, gameId, 'snapshots');
      await fs.mkdir(snapshotsDir, { recursive: true });

      const timestamp = Date.now();
      const filePath = path.join(snapshotsDir, `${timestamp}.json`);
      const data = {
        gameId,
        timestamp,
        ...snapshot
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      logger.debug(`Snapshot saved to ${filePath}`);
      return true;
    } catch (error) {
      logger.error(`Error saving snapshot for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Load game snapshot
   * @param {string} gameId - Game ID
   * @param {number} timestamp - Snapshot timestamp
   * @returns {Promise<Object>} Snapshot data
   */
  async loadSnapshot(gameId, timestamp) {
    logger.info(`Loading snapshot for game ${gameId} at ${timestamp}`);
    try {
      const filePath = path.join(this.storageDir, gameId, 'snapshots', `${timestamp}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      const snapshot = JSON.parse(data);
      
      logger.debug(`Snapshot loaded from ${filePath}`);
      return snapshot;
    } catch (error) {
      logger.error(`Error loading snapshot for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * List game snapshots
   * @param {string} gameId - Game ID
   * @returns {Promise<Array>} List of snapshots
   */
  async listSnapshots(gameId) {
    logger.info(`Listing snapshots for game ${gameId}`);
    try {
      const snapshotsDir = path.join(this.storageDir, gameId, 'snapshots');
      const files = await fs.readdir(snapshotsDir);
      const snapshots = await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(async file => {
            const data = await fs.readFile(path.join(snapshotsDir, file), 'utf8');
            return JSON.parse(data);
          })
      );

      logger.debug(`Found ${snapshots.length} snapshots for game ${gameId}`);
      return snapshots;
    } catch (error) {
      logger.error(`Error listing snapshots for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Save game statistics
   * @param {string} gameId - Game ID
   * @param {Object} statistics - Game statistics
   * @returns {Promise<boolean>} Success status
   */
  async saveStatistics(gameId, statistics) {
    logger.info(`Saving statistics for game ${gameId}`);
    try {
      const statsDir = path.join(this.storageDir, 'statistics');
      await fs.mkdir(statsDir, { recursive: true });

      const filePath = path.join(statsDir, `${gameId}.json`);
      const data = {
        gameId,
        timestamp: Date.now(),
        ...statistics
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      logger.debug(`Statistics saved to ${filePath}`);
      return true;
    } catch (error) {
      logger.error(`Error saving statistics for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Load game statistics
   * @param {string} gameId - Game ID
   * @returns {Promise<Object>} Game statistics
   */
  async loadStatistics(gameId) {
    logger.info(`Loading statistics for game ${gameId}`);
    try {
      const filePath = path.join(this.storageDir, 'statistics', `${gameId}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      const statistics = JSON.parse(data);
      
      logger.debug(`Statistics loaded from ${filePath}`);
      return statistics;
    } catch (error) {
      logger.error(`Error loading statistics for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Save game settings
   * @param {string} gameId - Game ID
   * @param {Object} settings - Game settings
   * @returns {Promise<boolean>} Success status
   */
  async saveSettings(gameId, settings) {
    logger.info(`Saving settings for game ${gameId}`);
    try {
      const settingsDir = path.join(this.storageDir, 'settings');
      await fs.mkdir(settingsDir, { recursive: true });

      const filePath = path.join(settingsDir, `${gameId}.json`);
      const data = {
        gameId,
        timestamp: Date.now(),
        ...settings
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      logger.debug(`Settings saved to ${filePath}`);
      return true;
    } catch (error) {
      logger.error(`Error saving settings for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Load game settings
   * @param {string} gameId - Game ID
   * @returns {Promise<Object>} Game settings
   */
  async loadSettings(gameId) {
    logger.info(`Loading settings for game ${gameId}`);
    try {
      const filePath = path.join(this.storageDir, 'settings', `${gameId}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      const settings = JSON.parse(data);
      
      logger.debug(`Settings loaded from ${filePath}`);
      return settings;
    } catch (error) {
      logger.error(`Error loading settings for game ${gameId}:`, error);
      throw error;
    }
  }
}

module.exports = GamePersistence; 