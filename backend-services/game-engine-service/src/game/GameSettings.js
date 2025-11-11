const logger = require('../utils/logger');

class GameSettings {
  constructor() {
    logger.info('Initializing game settings');
    this.settings = {
      game: {
        maxRounds: 10,
        roundTimeLimit: 60, // seconds
        maxPlayers: 2,
        minPlayers: 2,
        gameMode: 'standard', // standard, tournament, practice
        allowSpectators: true,
        maxSpectators: 10
      },
      physics: {
        gravity: 9.8,
        windEnabled: true,
        maxWindSpeed: 10,
        windChangeInterval: 30, // seconds
        terrainComplexity: 'medium', // low, medium, high
        projectileSpeed: 20,
        maxProjectileDistance: 1000
      },
      player: {
        startingHealth: 100,
        maxHealth: 100,
        moveSpeed: 5,
        maxMoveDistance: 50,
        powerIncrement: 5,
        maxPower: 100,
        angleIncrement: 5,
        maxAngle: 90
      },
      weapons: {
        defaultDamage: 20,
        criticalHitMultiplier: 2,
        splashDamageEnabled: true,
        splashRadius: 10,
        splashDamageFalloff: 0.5
      },
      weather: {
        enabled: false,
        types: ['clear', 'rain', 'snow', 'fog'],
        currentType: 'clear',
        visibility: 1.0,
        windMultiplier: 1.0
      }
    };
  }

  /**
   * Update game settings
   * @param {Object} newSettings - New settings to apply
   * @returns {Object} Updated settings
   */
  updateSettings(newSettings) {
    logger.info('Updating game settings');
    try {
      // Validate and update each category
      Object.keys(newSettings).forEach(category => {
        if (this.settings[category]) {
          logger.debug(`Updating ${category} settings`);
          this.settings[category] = {
            ...this.settings[category],
            ...newSettings[category]
          };
        } else {
          logger.warn(`Invalid settings category: ${category}`);
        }
      });

      // Validate critical settings
      this.validateSettings();
      logger.info('Game settings updated successfully');
      return this.getSettings();
    } catch (error) {
      logger.error('Error updating game settings:', error);
      throw error;
    }
  }

  /**
   * Validate game settings
   * @throws {Error} If settings are invalid
   */
  validateSettings() {
    logger.debug('Validating game settings');
    const { game, physics, player, weapons } = this.settings;

    // Game settings validation
    if (game.maxRounds < 1) {
      throw new Error('Max rounds must be at least 1');
    }
    if (game.roundTimeLimit < 10) {
      throw new Error('Round time limit must be at least 10 seconds');
    }
    if (game.maxPlayers < game.minPlayers) {
      throw new Error('Max players cannot be less than min players');
    }

    // Physics settings validation
    if (physics.gravity <= 0) {
      throw new Error('Gravity must be positive');
    }
    if (physics.maxWindSpeed < 0) {
      throw new Error('Max wind speed cannot be negative');
    }
    if (physics.windChangeInterval < 5) {
      throw new Error('Wind change interval must be at least 5 seconds');
    }

    // Player settings validation
    if (player.startingHealth <= 0 || player.maxHealth <= 0) {
      throw new Error('Health values must be positive');
    }
    if (player.moveSpeed <= 0) {
      throw new Error('Move speed must be positive');
    }
    if (player.maxMoveDistance <= 0) {
      throw new Error('Max move distance must be positive');
    }

    // Weapons settings validation
    if (weapons.defaultDamage <= 0) {
      throw new Error('Default damage must be positive');
    }
    if (weapons.criticalHitMultiplier < 1) {
      throw new Error('Critical hit multiplier must be at least 1');
    }
    if (weapons.splashRadius < 0) {
      throw new Error('Splash radius cannot be negative');
    }
    if (weapons.splashDamageFalloff < 0 || weapons.splashDamageFalloff > 1) {
      throw new Error('Splash damage falloff must be between 0 and 1');
    }

    logger.debug('Game settings validation successful');
  }

  /**
   * Get all game settings
   * @returns {Object} Current game settings
   */
  getSettings() {
    logger.debug('Getting all game settings');
    return { ...this.settings };
  }

  /**
   * Get settings for a specific category
   * @param {string} category - Settings category
   * @returns {Object} Category settings
   */
  getCategorySettings(category) {
    logger.debug(`Getting settings for category: ${category}`);
    if (!this.settings[category]) {
      logger.warn(`Invalid settings category: ${category}`);
      return null;
    }
    return { ...this.settings[category] };
  }

  /**
   * Get a specific setting value
   * @param {string} category - Settings category
   * @param {string} key - Setting key
   * @returns {*} Setting value
   */
  getSetting(category, key) {
    logger.debug(`Getting setting ${category}.${key}`);
    if (!this.settings[category] || this.settings[category][key] === undefined) {
      logger.warn(`Invalid setting: ${category}.${key}`);
      return null;
    }
    return this.settings[category][key];
  }

  /**
   * Update weather settings
   * @param {string} type - Weather type
   * @param {Object} options - Weather options
   * @returns {Object} Updated weather settings
   */
  updateWeather(type, options = {}) {
    logger.info(`Updating weather to ${type}`);
    if (!this.settings.weather.types.includes(type)) {
      logger.warn(`Invalid weather type: ${type}`);
      throw new Error('Invalid weather type');
    }

    this.settings.weather = {
      ...this.settings.weather,
      currentType: type,
      ...options
    };

    logger.debug('Weather settings updated successfully');
    return this.getCategorySettings('weather');
  }

  /**
   * Reset settings to default
   */
  resetSettings() {
    logger.info('Resetting game settings to default');
    this.settings = {
      game: {
        maxRounds: 10,
        roundTimeLimit: 60,
        maxPlayers: 2,
        minPlayers: 2,
        gameMode: 'standard',
        allowSpectators: true,
        maxSpectators: 10
      },
      physics: {
        gravity: 9.8,
        windEnabled: true,
        maxWindSpeed: 10,
        windChangeInterval: 30,
        terrainComplexity: 'medium',
        projectileSpeed: 20,
        maxProjectileDistance: 1000
      },
      player: {
        startingHealth: 100,
        maxHealth: 100,
        moveSpeed: 5,
        maxMoveDistance: 50,
        powerIncrement: 5,
        maxPower: 100,
        angleIncrement: 5,
        maxAngle: 90
      },
      weapons: {
        defaultDamage: 20,
        criticalHitMultiplier: 2,
        splashDamageEnabled: true,
        splashRadius: 10,
        splashDamageFalloff: 0.5
      },
      weather: {
        enabled: false,
        types: ['clear', 'rain', 'snow', 'fog'],
        currentType: 'clear',
        visibility: 1.0,
        windMultiplier: 1.0
      }
    };
  }

  /**
   * Get settings for a specific game mode
   * @param {string} mode - Game mode
   * @returns {Object} Mode-specific settings
   */
  getModeSettings(mode) {
    logger.debug(`Getting settings for game mode: ${mode}`);
    const modeSettings = {
      standard: {
        game: {
          maxRounds: 10,
          roundTimeLimit: 60
        },
        physics: {
          windEnabled: true,
          terrainComplexity: 'medium'
        }
      },
      tournament: {
        game: {
          maxRounds: 15,
          roundTimeLimit: 45
        },
        physics: {
          windEnabled: true,
          terrainComplexity: 'high'
        }
      },
      practice: {
        game: {
          maxRounds: 5,
          roundTimeLimit: 90
        },
        physics: {
          windEnabled: false,
          terrainComplexity: 'low'
        }
      }
    };

    if (!modeSettings[mode]) {
      logger.warn(`Invalid game mode: ${mode}`);
      return null;
    }

    return modeSettings[mode];
  }

  /**
   * Apply settings for a specific game mode
   * @param {string} mode - Game mode
   * @returns {Object} Updated settings
   */
  applyModeSettings(mode) {
    logger.info(`Applying settings for game mode: ${mode}`);
    const modeSettings = this.getModeSettings(mode);
    if (!modeSettings) {
      throw new Error('Invalid game mode');
    }

    return this.updateSettings(modeSettings);
  }
}

module.exports = GameSettings; 