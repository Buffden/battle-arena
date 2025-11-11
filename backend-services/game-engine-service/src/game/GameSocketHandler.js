console.log('GameSocketHandler file loaded');
const { log } = require('winston');
const logger = require('../utils/logger');
const GameRoomManager = require('./GameRoomManager');
// const GameSocketHandler = require('../game/GameSocketHandler');
// const GameRoomManager = require('../game/GameRoomManager');

class GameSocketHandler {
  constructor(io, gameRoomManager) {
    console.log('GameSocketHandler constructor called');
    logger.info('Initializing GameSocketHandler');
    this.io = io;
    this.gameRoomManager = gameRoomManager;
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    console.log('setupSocketHandlers called');
    logger.info('setupSocketHandlers');
    this.io.on('connection', (socket) => {
      logger.info(`New socket connection: ${socket.id} (User: ${socket.user.username})`);

      // Join game room
      socket.on('join_room', async (data) => {
        try {
          const { roomId, token } = data;
          logger.info(`Player ${socket.user.username} attempting to join room ${roomId}`);
          
          const room = await this.gameRoomManager.joinRoom(roomId, token, socket.id);
          
          if (room) {
            socket.join(roomId);
            socket.roomId = roomId;
            
            // Send current game state to the player
            const playerId = socket.user.id;
            const gameState = room.getPlayerView(playerId);
            socket.emit('gameState', gameState);
            logger.debug(`Sent game state to player ${socket.user.username}`);
            
            // Send available actions
            const actions = room.getAvailableActions(playerId);
            socket.emit('available_actions', actions);
            logger.debug(`Sent available actions to player ${socket.user.username}`);
            
            // Notify other players
            socket.to(roomId).emit('player_joined', {
              playerId: playerId,
              username: socket.user.username
            });
            logger.info(`Player ${socket.user.username} joined room ${roomId}`);
      
            // --- AUTO-START LOGIC ---
            // If both players are present and game hasn't started, start the game
            if (room.players.size === 2 && !room.gameState) {
              await room.startGame();
              // Emit the initial game state to all players in the room
              this.io.to(roomId).emit('gameState', room.getFullState());
              logger.info(`Auto-started game in room ${roomId} and emitted initial game state.`);
            }
          }
        } catch (error) {
          logger.error(`Error joining room: ${error.message}`, error);
          socket.emit('error', { message: error.message });
        }
      });

      // Start game
      socket.on('start_game', async (data) => {
        try {
          const { useXpBased } = data;
          logger.info(`Starting game in room ${socket.roomId} (XP-based: ${useXpBased})`);
          
          const room = this.gameRoomManager.getRoom(socket.roomId);
          
          if (room) {
            const gameState = room.startGame(useXpBased);
            this.io.to(socket.roomId).emit('game_started', gameState);
            logger.info(`Game started in room ${socket.roomId}`);
            
            // Send available actions to all players
            room.players.forEach(player => {
              const actions = room.getAvailableActions(player.id);
              this.io.to(socket.roomId).emit('available_actions', {
                playerId: player.id,
                actions
              });
              logger.debug(`Sent available actions to player ${player.username}`);
            });
          }
        } catch (error) {
          logger.error(`Error starting game: ${error.message}`, error);
          socket.emit('error', { message: error.message });
        }
      });

      // Player action
      socket.on('player_action', async (data) => {
        try {
          const { action } = data;
          logger.info(`Processing action from player ${socket.user.username}:`, action);
          
          const room = this.gameRoomManager.getRoom(socket.roomId);
          
          if (room) {
            const gameState = room.handlePlayerAction(socket.user.id, action);
            
            // Emit game state update to all players
            this.io.to(socket.roomId).emit('game_state_update', gameState);
            logger.debug(`Sent game state update to room ${socket.roomId}`);
            
            // If it was a shot, emit trajectory for visualization
            if (action.type === 'shoot') {
              const playerState = gameState.playerStates.find(p => p.id === socket.user.id);
              const trajectory = room.physicsEngine.calculateTrajectory(
                playerState.position,
                action.angle,
                action.power
              );
              this.io.to(socket.roomId).emit('shot_trajectory', {
                playerId: socket.user.id,
                trajectory
              });
              logger.debug(`Sent shot trajectory for player ${socket.user.username}`);
            }
            
            // Send updated available actions to current player
            const currentPlayerId = gameState.currentTurn;
            const actions = room.getAvailableActions(currentPlayerId);
            this.io.to(socket.roomId).emit('available_actions', {
              playerId: currentPlayerId,
              actions
            });
            logger.debug(`Sent updated available actions to current player ${currentPlayerId}`);

            // If game has ended, send results
            if (room.status === 'ended') {
              const results = room.getResults();
              this.io.to(socket.roomId).emit('game_ended', {
                ...results,
                reason: 'game_completed'
              });
              logger.info(`Game ended in room ${socket.roomId}. Results:`, results);
            }
          }
        } catch (error) {
          logger.error(`Error handling player action: ${error.message}`, error);
          socket.emit('error', { message: error.message });
        }
      });

      // Get available actions
      socket.on('get_available_actions', () => {
        try {
          logger.debug(`Player ${socket.user.username} requesting available actions`);
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (room) {
            const actions = room.getAvailableActions(socket.user.id);
            socket.emit('available_actions', {
              playerId: socket.user.id,
              actions
            });
            logger.debug(`Sent available actions to player ${socket.user.username}`);
          }
        } catch (error) {
          logger.error(`Error getting available actions: ${error.message}`, error);
          socket.emit('error', { message: error.message });
        }
      });

      // Get game results
      socket.on('get_game_results', () => {
        try {
          logger.debug(`Player ${socket.user.username} requesting game results`);
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (room) {
            const results = room.getResults(socket.user.id);
            socket.emit('game_results', results);
            logger.debug(`Sent game results to player ${socket.user.username}`);
          }
        } catch (error) {
          logger.error(`Error getting game results: ${error.message}`, error);
          socket.emit('error', { message: error.message });
        }
      });

      // Replay events
      socket.on('replay:get', async (data, callback) => {
        try {
          logger.info(`Replay request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for replay request`);
            throw new Error('Room not found');
          }

          const replayData = room.getReplayData(data.options);
          if (!replayData) {
            logger.warn(`No replay data available for room ${data.roomId}`);
            throw new Error('No replay data available');
          }

          logger.debug(`Sending replay data to player ${socket.user.username}`);
          callback({ success: true, data: replayData });
        } catch (error) {
          logger.error('Error handling replay request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('replay:getTurn', async (data, callback) => {
        try {
          logger.info(`Turn replay request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for turn replay request`);
            throw new Error('Room not found');
          }

          const turnData = room.getReplayData({ turnNumber: data.turnNumber });
          if (!turnData) {
            logger.warn(`Turn ${data.turnNumber} not found in replay data`);
            throw new Error('Turn not found');
          }

          logger.debug(`Sending turn ${data.turnNumber} data to player ${socket.user.username}`);
          callback({ success: true, data: turnData });
        } catch (error) {
          logger.error('Error handling turn replay request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('replay:getPlayer', async (data, callback) => {
        try {
          logger.info(`Player replay request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for player replay request`);
            throw new Error('Room not found');
          }

          const playerData = room.getReplayData({ playerId: data.playerId });
          if (!playerData) {
            logger.warn(`Player ${data.playerId} not found in replay data`);
            throw new Error('Player not found');
          }

          logger.debug(`Sending player ${data.playerId} replay data to player ${socket.user.username}`);
          callback({ success: true, data: playerData });
        } catch (error) {
          logger.error('Error handling player replay request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('replay:getTimeRange', async (data, callback) => {
        try {
          logger.info(`Time range replay request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for time range replay request`);
            throw new Error('Room not found');
          }

          const timeRangeData = room.getReplayData({
            startTime: data.startTime,
            endTime: data.endTime
          });
          if (!timeRangeData) {
            logger.warn(`No replay data available for time range ${data.startTime} to ${data.endTime}`);
            throw new Error('No replay data available for time range');
          }

          logger.debug(`Sending time range replay data to player ${socket.user.username}`);
          callback({ success: true, data: timeRangeData });
        } catch (error) {
          logger.error('Error handling time range replay request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('replay:getRound', async (data, callback) => {
        try {
          logger.info(`Round replay request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for round replay request`);
            throw new Error('Room not found');
          }

          const roundData = room.getReplayData({ round: data.round });
          if (!roundData) {
            logger.warn(`Round ${data.round} not found in replay data`);
            throw new Error('Round not found');
          }

          logger.debug(`Sending round ${data.round} replay data to player ${socket.user.username}`);
          callback({ success: true, data: roundData });
        } catch (error) {
          logger.error('Error handling round replay request:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Statistics events
      socket.on('stats:get', async (data, callback) => {
        try {
          logger.info(`Statistics request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for statistics request`);
            throw new Error('Room not found');
          }

          const stats = room.getStatistics();
          logger.debug(`Sending statistics to player ${socket.user.username}`);
          callback({ success: true, data: stats });
        } catch (error) {
          logger.error('Error handling statistics request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('stats:getPlayer', async (data, callback) => {
        try {
          logger.info(`Player statistics request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for player statistics request`);
            throw new Error('Room not found');
          }

          const playerStats = room.getStatistics({ playerId: data.playerId });
          if (!playerStats) {
            logger.warn(`No statistics found for player ${data.playerId}`);
            throw new Error('Player statistics not found');
          }

          logger.debug(`Sending player ${data.playerId} statistics to player ${socket.user.username}`);
          callback({ success: true, data: playerStats });
        } catch (error) {
          logger.error('Error handling player statistics request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('stats:getTopPlayers', async (data, callback) => {
        try {
          logger.info(`Top players request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for top players request`);
            throw new Error('Room not found');
          }

          const topPlayers = room.getStatistics({
            topPlayers: true,
            metric: data.metric,
            limit: data.limit
          });

          logger.debug(`Sending top players data to player ${socket.user.username}`);
          callback({ success: true, data: topPlayers });
        } catch (error) {
          logger.error('Error handling top players request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('stats:getMultiplePlayers', async (data, callback) => {
        try {
          logger.info(`Multiple players statistics request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for multiple players statistics request`);
            throw new Error('Room not found');
          }

          const playerStats = room.getStatistics({ playerIds: data.playerIds });
          logger.debug(`Sending multiple players statistics to player ${socket.user.username}`);
          callback({ success: true, data: playerStats });
        } catch (error) {
          logger.error('Error handling multiple players statistics request:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Settings events
      socket.on('settings:get', async (data, callback) => {
        try {
          logger.info(`Settings request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for settings request`);
            throw new Error('Room not found');
          }

          const settings = room.getSettings(data.category);
          logger.debug(`Sending settings to player ${socket.user.username}`);
          callback({ success: true, data: settings });
        } catch (error) {
          logger.error('Error handling settings request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('settings:update', async (data, callback) => {
        try {
          logger.info(`Settings update request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for settings update`);
            throw new Error('Room not found');
          }

          // Check if player is room owner
          if (!room.isRoomOwner(socket.user.id)) {
            logger.warn(`Player ${socket.user.username} is not room owner`);
            throw new Error('Only room owner can update settings');
          }

          const updatedSettings = room.updateSettings(data.settings);
          logger.debug(`Settings updated by player ${socket.user.username}`);
          callback({ success: true, data: updatedSettings });
        } catch (error) {
          logger.error('Error handling settings update:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('settings:applyMode', async (data, callback) => {
        try {
          logger.info(`Game mode request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for game mode request`);
            throw new Error('Room not found');
          }

          // Check if player is room owner
          if (!room.isRoomOwner(socket.user.id)) {
            logger.warn(`Player ${socket.user.username} is not room owner`);
            throw new Error('Only room owner can change game mode');
          }

          const updatedSettings = room.applyGameMode(data.mode);
          logger.debug(`Game mode ${data.mode} applied by player ${socket.user.username}`);
          callback({ success: true, data: updatedSettings });
        } catch (error) {
          logger.error('Error handling game mode request:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('settings:updateWeather', async (data, callback) => {
        try {
          logger.info(`Weather update request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for weather update`);
            throw new Error('Room not found');
          }

          // Check if player is room owner
          if (!room.isRoomOwner(socket.user.id)) {
            logger.warn(`Player ${socket.user.username} is not room owner`);
            throw new Error('Only room owner can update weather');
          }

          const weatherSettings = room.updateWeather(data.type, data.options);
          logger.debug(`Weather updated to ${data.type} by player ${socket.user.username}`);
          callback({ success: true, data: weatherSettings });
        } catch (error) {
          logger.error('Error handling weather update:', error);
          callback({ success: false, error: error.message });
        }
      });

      socket.on('settings:reset', async (data, callback) => {
        try {
          logger.info(`Settings reset request from player ${socket.user.username} for room ${data.roomId}`);
          const room = this.gameRoomManager.getRoom(data.roomId);
          if (!room) {
            logger.warn(`Room ${data.roomId} not found for settings reset`);
            throw new Error('Room not found');
          }

          // Check if player is room owner
          if (!room.isRoomOwner(socket.user.id)) {
            logger.warn(`Player ${socket.user.username} is not room owner`);
            throw new Error('Only room owner can reset settings');
          }

          const defaultSettings = room.settings.resetSettings();
          logger.debug(`Settings reset by player ${socket.user.username}`);
          callback({ success: true, data: defaultSettings });
        } catch (error) {
          logger.error('Error handling settings reset:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Persistence events
      // Save game state
      socket.on('game:save', async (callback) => {
        logger.info(`Save game request from socket ${socket.id}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const success = await room.saveGameState();
          callback({ success });
        } catch (error) {
          logger.error('Error saving game:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Load game state
      socket.on('game:load', async (callback) => {
        logger.info(`Load game request from socket ${socket.id}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const success = await room.loadGameState();
          if (success) {
            socket.emit('game:state', room.getGameState());
          }
          callback({ success });
        } catch (error) {
          logger.error('Error loading game:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Save snapshot
      socket.on('game:saveSnapshot', async (callback) => {
        logger.info(`Save snapshot request from socket ${socket.id}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const success = await room.saveSnapshot();
          callback({ success });
        } catch (error) {
          logger.error('Error saving snapshot:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Load snapshot
      socket.on('game:loadSnapshot', async ({ timestamp }, callback) => {
        logger.info(`Load snapshot request from socket ${socket.id} at ${timestamp}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const success = await room.loadSnapshot(timestamp);
          if (success) {
            socket.emit('game:state', room.getGameState());
          }
          callback({ success });
        } catch (error) {
          logger.error('Error loading snapshot:', error);
          callback({ success: false, error: error.message });
        }
      });

      // List snapshots
      socket.on('game:listSnapshots', async (callback) => {
        logger.info(`List snapshots request from socket ${socket.id}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const snapshots = await room.persistence.listSnapshots(room.roomId);
          callback({ success: true, snapshots });
        } catch (error) {
          logger.error('Error listing snapshots:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Save statistics
      socket.on('game:saveStatistics', async (callback) => {
        logger.info(`Save statistics request from socket ${socket.id}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const statistics = room.getStatistics();
          const success = await room.saveStatistics(statistics);
          callback({ success });
        } catch (error) {
          logger.error('Error saving statistics:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Load statistics
      socket.on('game:loadStatistics', async (callback) => {
        logger.info(`Load statistics request from socket ${socket.id}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const statistics = await room.loadStatistics();
          callback({ success: true, statistics });
        } catch (error) {
          logger.error('Error loading statistics:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Save settings
      socket.on('game:saveSettings', async (callback) => {
        logger.info(`Save settings request from socket ${socket.id}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const success = await room.saveSettings();
          callback({ success });
        } catch (error) {
          logger.error('Error saving settings:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Load settings
      socket.on('game:loadSettings', async (callback) => {
        logger.info(`Load settings request from socket ${socket.id}`);
        try {
          const room = this.gameRoomManager.getRoom(socket.roomId);
          if (!room) {
            logger.warn(`Room not found for socket ${socket.id}`);
            return callback({ success: false, error: 'Room not found' });
          }

          const success = await room.loadSettings();
          if (success) {
            socket.emit('game:settings', room.getSettings());
          }
          callback({ success });
        } catch (error) {
          logger.error('Error loading settings:', error);
          callback({ success: false, error: error.message });
        }
      });

      // Disconnect
      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id} (User: ${socket.user.username})`);
        if (socket.roomId) {
          this.handlePlayerDisconnect(socket);
        }
      });
    });
  }

  async handlePlayerDisconnect(socket) {
    try {
      logger.info(`Handling disconnect for player ${socket.user.username}`);
      const room = this.gameRoomManager.getRoom(socket.roomId);
      if (room) {
        // Notify other players
        socket.to(socket.roomId).emit('player_disconnected', {
          playerId: socket.user.id,
          username: socket.user.username
        });
        logger.info(`Notified room ${socket.roomId} of player ${socket.user.username} disconnection`);

        // If game is in progress, end it
        if (room.status === 'playing') {
          const gameState = room.endGame();
          const results = room.getResults();
          this.io.to(socket.roomId).emit('game_ended', {
            ...results,
            reason: 'player_disconnected'
          });
          logger.info(`Game ended due to player disconnect. Results:`, results);
        }

        // Remove player from room
        await this.gameRoomManager.leaveRoom(socket.roomId, socket.user.id);
        logger.info(`Removed player ${socket.user.username} from room ${socket.roomId}`);
      }
    } catch (error) {
      logger.error(`Error handling player disconnect: ${error.message}`, error);
    }
  }
}

module.exports = GameSocketHandler; 