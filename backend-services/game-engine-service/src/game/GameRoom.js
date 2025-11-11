const logger = require('../utils/logger');
const GameState = require('./GameState');
const PhysicsEngine = require('./PhysicsEngine');
const ActionHandler = require('./ActionHandler');
const GameResults = require('./GameResults');
const GameReplay = require('./GameReplay');
const GameStatistics = require('./GameStatistics');
const GameSettings = require('./GameSettings');
const GamePersistence = require('./GamePersistence');

class GameRoom {
  constructor(roomId, io) {
    logger.info(`Creating new game room: ${roomId}`);
    this.roomId = roomId;
    this.io = io;
    this.players = new Map();
    this.gameState = null;
    this.physicsEngine = new PhysicsEngine();
    this.actionHandler = null;
    this.results = null;
    this.replay = null;
    this.statistics = new GameStatistics();
    this.settings = new GameSettings();
    this.persistence = new GamePersistence();
    this.createdAt = Date.now();
    this.lastActivity = Date.now();
    this.status = 'waiting'; // waiting, playing, ended
    this.isActive = false;
  }

  /**
   * Start the game
   * @param {boolean} useXpBased - Whether to use XP for turn order
   * @returns {Object} Initial game state
   */
  async startGame(useXpBased = false) {
    logger.info(`Starting game in room ${this.roomId} (XP-based: ${useXpBased})`);
    
    if (this.status !== 'waiting') {
      logger.warn(`Game in room ${this.roomId} is already in progress`);
      throw new Error('Game is already in progress');
    }

    if (this.players.size !== this.settings.getSetting('game', 'maxPlayers')) {
      logger.error(`Invalid player count in room ${this.roomId}: ${this.players.size}`);
      throw new Error('Game requires exactly 2 players');
    }

    this.isActive = true;
    this.gameState = new GameState(Array.from(this.players.values()));
    this.actionHandler = new ActionHandler(this.physicsEngine);
    this.gameState.status = 'playing';
    this.gameState.createdAt = Date.now();
    this.lastActivity = Date.now();

    // Apply game settings to game state
    await this.applyGameSettings();
    await this.saveGameState();

    // Notify all players
    this.io.to(this.roomId).emit('game:started', {
      gameState: this.gameState,
      settings: this.settings.getSettings()
    });

    logger.info(`Game started in room ${this.roomId}`);
    return this.gameState.getFullState();
  }

  /**
   * Apply game settings to current game state
   */
  async applyGameSettings() {
    logger.debug('Applying game settings to game state');
    const settings = this.settings.getSettings();

    // Apply physics settings
    this.gameState.physics = {
      ...this.gameState.physics,
      gravity: settings.physics.gravity,
      windEnabled: settings.physics.windEnabled,
      maxWindSpeed: settings.physics.maxWindSpeed,
      windChangeInterval: settings.physics.windChangeInterval
    };

    // Apply player settings
    this.gameState.playerStates.forEach(playerState => {
      playerState.health = settings.player.startingHealth;
      playerState.maxHealth = settings.player.maxHealth;
      playerState.moveSpeed = settings.player.moveSpeed;
      playerState.maxMoveDistance = settings.player.maxMoveDistance;
      playerState.powerIncrement = settings.player.powerIncrement;
      playerState.maxPower = settings.player.maxPower;
      playerState.angleIncrement = settings.player.angleIncrement;
      playerState.maxAngle = settings.player.maxAngle;
    });

    // Apply weapon settings
    this.gameState.weapons = {
      ...this.gameState.weapons,
      defaultDamage: settings.weapons.defaultDamage,
      criticalHitMultiplier: settings.weapons.criticalHitMultiplier,
      splashDamageEnabled: settings.weapons.splashDamageEnabled,
      splashRadius: settings.weapons.splashRadius,
      splashDamageFalloff: settings.weapons.splashDamageFalloff
    };

    // Apply weather settings
    this.gameState.weather = {
      ...this.gameState.weather,
      ...settings.weather
    };

    logger.debug('Game settings applied successfully');
    await this.saveGameState();
  }

  /**
   * Update game settings
   * @param {Object} newSettings - New settings to apply
   * @returns {Object} Updated settings
   */
  async updateSettings(newSettings) {
    logger.info(`Updating settings for room ${this.roomId}`);
    try {
      const updatedSettings = this.settings.updateSettings(newSettings);
      
      // If game is in progress, apply new settings
      if (this.gameState && this.gameState.status === 'playing') {
        await this.applyGameSettings();
      }

      // Notify all players
      this.io.to(this.roomId).emit('game:settingsUpdated', {
        settings: updatedSettings
      });

      logger.info('Game settings updated successfully');
      await this.saveSettings();
      return updatedSettings;
    } catch (error) {
      logger.error('Error updating game settings:', error);
      throw error;
    }
  }

  /**
   * Get current game settings
   * @param {string} category - Optional settings category
   * @returns {Object} Game settings
   */
  getSettings(category = null) {
    logger.debug(`Getting settings for room ${this.roomId}`);
    if (category) {
      return this.settings.getCategorySettings(category);
    }
    return this.settings.getSettings();
  }

  /**
   * Apply game mode settings
   * @param {string} mode - Game mode
   * @returns {Object} Updated settings
   */
  applyGameMode(mode) {
    logger.info(`Applying game mode ${mode} to room ${this.roomId}`);
    try {
      const updatedSettings = this.settings.applyModeSettings(mode);
      
      // If game is in progress, apply new settings
      if (this.gameState && this.gameState.status === 'playing') {
        this.applyGameSettings();
      }

      // Notify all players
      this.io.to(this.roomId).emit('game:modeChanged', {
        mode,
        settings: updatedSettings
      });

      logger.info(`Game mode ${mode} applied successfully`);
      return updatedSettings;
    } catch (error) {
      logger.error('Error applying game mode:', error);
      throw error;
    }
  }

  /**
   * Update weather settings
   * @param {string} type - Weather type
   * @param {Object} options - Weather options
   * @returns {Object} Updated weather settings
   */
  updateWeather(type, options = {}) {
    logger.info(`Updating weather to ${type} in room ${this.roomId}`);
    try {
      const weatherSettings = this.settings.updateWeather(type, options);
      
      // If game is in progress, apply new weather
      if (this.gameState && this.gameState.status === 'playing') {
        this.gameState.weather = {
          ...this.gameState.weather,
          ...weatherSettings
        };
      }

      // Notify all players
      this.io.to(this.roomId).emit('game:weatherChanged', {
        weather: weatherSettings
      });

      logger.info('Weather settings updated successfully');
      return weatherSettings;
    } catch (error) {
      logger.error('Error updating weather settings:', error);
      throw error;
    }
  }

  /**
   * Handle player action
   * @param {string} playerId - Player ID
   * @param {Object} action - Player action
   * @returns {Object} Updated game state
   */
  async handlePlayerAction(playerId, action) {
    logger.info(`Processing action from player ${playerId} in room ${this.roomId}:`, action);

    if (this.status !== 'playing') {
      logger.warn(`Invalid game status for action in room ${this.roomId}: ${this.status}`);
      throw new Error('Game is not in progress');
    }

    try {
      // Handle the action
      this.gameState = this.actionHandler.handleAction(this.gameState, playerId, action);
      logger.debug(`Action processed successfully for player ${playerId}`);

      // If the action was a shot, update wind for next turn
      if (action.type === this.actionHandler.actionTypes.SHOOT) {
        const newWind = Math.random() * 2 - 1;
        this.physicsEngine.updateWind(newWind);
        logger.info(`Wind updated to ${newWind.toFixed(2)} after shot`);
      }

      // Switch turn if the action was a shot
      if (action.type === this.actionHandler.actionTypes.SHOOT) {
        const newTurn = this.gameState.switchTurn();
        logger.info(`Turn switched to player ${newTurn}`);
      }

      // Check if game should end
      if (this.gameState.checkGameEnd()) {
        logger.info(`Game end condition met in room ${this.roomId}`);
        await this.endGame();
      }

      this.lastActivity = Date.now();
      await this.saveGameState();
      await this.saveSnapshot();
      return this.gameState.getFullState();
    } catch (error) {
      logger.error(`Error handling player action in room ${this.roomId}:`, error);
      throw error;
    }
  }

  /**
   * Get available actions for a player
   * @param {string} playerId - Player ID
   * @returns {Array} Available actions
   */
  getAvailableActions(playerId) {
    logger.debug(`Getting available actions for player ${playerId} in room ${this.roomId}`);
    return this.actionHandler.getAvailableActions(this.gameState, playerId);
  }

  /**
   * Get game state for a specific player
   * @param {string} playerId - Player ID
   * @returns {Object} Game state visible to the player
   */
  getPlayerView(playerId) {
    logger.debug(`Getting player view for ${playerId} in room ${this.roomId}`);
    const view = this.gameState.getPlayerView(playerId);
    view.wind = this.physicsEngine.wind;
    view.terrain = this.physicsEngine.terrain;
    return view;
  }

  /**
   * Get full game state
   * @returns {Object} Complete game state
   */
  getFullState() {
    logger.debug(`Getting full game state for room ${this.roomId}`);
    const state = this.gameState.getFullState();
    state.wind = this.physicsEngine.wind;
    state.terrain = this.physicsEngine.terrain;
    return state;
  }

  /**
   * End the game
   * @returns {Object} Final game state
   */
  async endGame() {
    logger.info(`Ending game in room ${this.roomId}`);
    if (!this.gameState) {
      logger.warn('No game state found when ending game');
      return;
    }

    this.gameState.status = 'ended';
    this.gameState.endTime = Date.now();

    // Process results
    this.results = new GameResults(this.gameState, Array.from(this.players.values()));
    this.results.processResults();

    // Create replay
    this.replay = new GameReplay(this.gameState, Array.from(this.players.values()));

    // Update statistics
    this.statistics.updateGameStats({
      duration: this.gameState.endTime - this.gameState.createdAt,
      results: this.results.getFormattedResults(),
      replay: this.replay.getFullReplayData()
    });

    // Notify all players
    this.io.to(this.roomId).emit('game:ended', {
      results: this.results.getFormattedResults(),
      replay: this.replay.getMetadata(),
      statistics: this.statistics.getGameStats()
    });

    logger.info(`Game ended in room ${this.roomId}. Winner: ${this.gameState.winner}`);
    await this.saveGameState();
    await this.saveStatistics(this.results.getFormattedResults());
    await this.saveSnapshot();
  }

  /**
   * Get game results
   * @param {string} playerId - Optional player ID for player-specific results
   * @returns {Object} Game results
   */
  getResults(playerId = null) {
    if (!this.results) {
      logger.warn(`No results available for room ${this.roomId}`);
      return null;
    }

    if (playerId) {
      logger.debug(`Getting results for player ${playerId} in room ${this.roomId}`);
      return this.results.getPlayerResults(playerId);
    }

    logger.debug(`Getting full results for room ${this.roomId}`);
    return this.results.getFormattedResults();
  }

  /**
   * Check if room is inactive
   * @param {number} timeout - Timeout in milliseconds
   * @returns {boolean} True if room is inactive
   */
  isInactive(timeout = 5 * 60 * 1000) { // 5 minutes
    const inactive = Date.now() - this.lastActivity > timeout;
    if (inactive) {
      logger.info(`Room ${this.roomId} is inactive (last activity: ${new Date(this.lastActivity).toISOString()})`);
    }
    return inactive;
  }

  /**
   * Get replay data
   * @param {Object} options - Replay options
   * @returns {Object} Replay data
   */
  getReplayData(options = {}) {
    logger.debug(`Getting replay data for room ${this.roomId}`, options);
    if (!this.replay) {
      logger.warn('No replay data available');
      return null;
    }

    if (options.playerId) {
      return this.replay.getPlayerReplayData(options.playerId);
    }

    if (options.turnNumber) {
      return this.replay.getTurnData(options.turnNumber);
    }

    if (options.timestamp) {
      return this.replay.getTurnDataAtTime(options.timestamp);
    }

    if (options.startTime && options.endTime) {
      return this.replay.getTimeRangeData(options.startTime, options.endTime);
    }

    if (options.round) {
      return this.replay.getRoundData(options.round);
    }

    return this.replay.getFullReplayData();
  }

  /**
   * Get game statistics
   * @param {Object} options - Statistics options
   * @returns {Object} Statistics data
   */
  getStatistics(options = {}) {
    logger.debug(`Getting statistics for room ${this.roomId}`, options);
    
    if (options.playerId) {
      return this.statistics.getPlayerStats(options.playerId);
    }

    if (options.playerIds) {
      return this.statistics.getMultiplePlayerStats(options.playerIds);
    }

    if (options.topPlayers) {
      return this.statistics.getTopPlayers(
        options.metric || 'winRate',
        options.limit || 10
      );
    }

    return this.statistics.getGameStats();
  }

  /**
   * Save current game state
   * @returns {Promise<boolean>} Success status
   */
  async saveGameState() {
    logger.info(`Saving game state for room ${this.roomId}`);
    try {
      const gameData = {
        roomId: this.roomId,
        ownerId: this.ownerId,
        players: Array.from(this.players.entries()),
        gameState: this.gameState.getState(),
        settings: this.settings.getSettings(),
        isActive: this.isActive,
        lastActivity: this.lastActivity,
        results: this.results
      };

      await this.persistence.saveGame(this.roomId, gameData);
      logger.debug(`Game state saved for room ${this.roomId}`);
      return true;
    } catch (error) {
      logger.error(`Error saving game state for room ${this.roomId}:`, error);
      return false;
    }
  }

  /**
   * Load game state
   * @returns {Promise<boolean>} Success status
   */
  async loadGameState() {
    logger.info(`Loading game state for room ${this.roomId}`);
    try {
      const gameData = await this.persistence.loadGame(this.roomId);
      
      this.ownerId = gameData.ownerId;
      this.players = new Map(gameData.players);
      this.gameState.setState(gameData.gameState);
      this.settings.updateSettings(gameData.settings);
      this.isActive = gameData.isActive;
      this.lastActivity = gameData.lastActivity;
      this.results = gameData.results;

      logger.debug(`Game state loaded for room ${this.roomId}`);
      return true;
    } catch (error) {
      logger.error(`Error loading game state for room ${this.roomId}:`, error);
      return false;
    }
  }

  /**
   * Save game snapshot
   * @returns {Promise<boolean>} Success status
   */
  async saveSnapshot() {
    logger.info(`Saving snapshot for room ${this.roomId}`);
    try {
      const snapshot = {
        roomId: this.roomId,
        gameState: this.gameState.getState(),
        players: Array.from(this.players.entries()),
        settings: this.settings.getSettings(),
        isActive: this.isActive,
        lastActivity: this.lastActivity
      };

      await this.persistence.saveSnapshot(this.roomId, snapshot);
      logger.debug(`Snapshot saved for room ${this.roomId}`);
      return true;
    } catch (error) {
      logger.error(`Error saving snapshot for room ${this.roomId}:`, error);
      return false;
    }
  }

  /**
   * Load game snapshot
   * @param {number} timestamp - Snapshot timestamp
   * @returns {Promise<boolean>} Success status
   */
  async loadSnapshot(timestamp) {
    logger.info(`Loading snapshot for room ${this.roomId} at ${timestamp}`);
    try {
      const snapshot = await this.persistence.loadSnapshot(this.roomId, timestamp);
      
      this.gameState.setState(snapshot.gameState);
      this.players = new Map(snapshot.players);
      this.settings.updateSettings(snapshot.settings);
      this.isActive = snapshot.isActive;
      this.lastActivity = snapshot.lastActivity;

      logger.debug(`Snapshot loaded for room ${this.roomId}`);
      return true;
    } catch (error) {
      logger.error(`Error loading snapshot for room ${this.roomId}:`, error);
      return false;
    }
  }

  /**
   * Save game statistics
   * @param {Object} statistics - Game statistics
   * @returns {Promise<boolean>} Success status
   */
  async saveStatistics(statistics) {
    logger.info(`Saving statistics for room ${this.roomId}`);
    try {
      await this.persistence.saveStatistics(this.roomId, statistics);
      logger.debug(`Statistics saved for room ${this.roomId}`);
      return true;
    } catch (error) {
      logger.error(`Error saving statistics for room ${this.roomId}:`, error);
      return false;
    }
  }

  /**
   * Load game statistics
   * @returns {Promise<Object>} Game statistics
   */
  async loadStatistics() {
    logger.info(`Loading statistics for room ${this.roomId}`);
    try {
      const statistics = await this.persistence.loadStatistics(this.roomId);
      logger.debug(`Statistics loaded for room ${this.roomId}`);
      return statistics;
    } catch (error) {
      logger.error(`Error loading statistics for room ${this.roomId}:`, error);
      return null;
    }
  }

  /**
   * Save game settings
   * @returns {Promise<boolean>} Success status
   */
  async saveSettings() {
    logger.info(`Saving settings for room ${this.roomId}`);
    try {
      const settings = this.settings.getSettings();
      await this.persistence.saveSettings(this.roomId, settings);
      logger.debug(`Settings saved for room ${this.roomId}`);
      return true;
    } catch (error) {
      logger.error(`Error saving settings for room ${this.roomId}:`, error);
      return false;
    }
  }

  /**
   * Load game settings
   * @returns {Promise<boolean>} Success status
   */
  async loadSettings() {
    logger.info(`Loading settings for room ${this.roomId}`);
    try {
      const settings = await this.persistence.loadSettings(this.roomId);
      this.settings.updateSettings(settings);
      logger.debug(`Settings loaded for room ${this.roomId}`);
      return true;
    } catch (error) {
      logger.error(`Error loading settings for room ${this.roomId}:`, error);
      return false;
    }
  }
}

module.exports = GameRoom; 