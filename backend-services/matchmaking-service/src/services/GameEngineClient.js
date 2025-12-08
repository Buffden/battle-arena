const http = require('node:http');
const https = require('node:https');
const matchmakingConfig = require('../config/matchmaking.config');

/**
 * GameEngineClient handles HTTP/HTTPS communication with Game Engine Service
 *
 * Security: HTTPS is strongly recommended for all environments.
 * HTTP should only be used for local development within isolated Docker networks.
 * Always use HTTPS in production via GAME_ENGINE_URL environment variable.
 */
class GameEngineClient {
  constructor() {
    // Get service URL from centralized config (which requires GAME_ENGINE_URL env var)
    this.baseUrl = matchmakingConfig.services.gameEngineUrl;
    this.timeout = matchmakingConfig.services.gameEngineTimeoutMs;

    // Security warning: Warn if HTTP is used in production
    if (process.env.NODE_ENV === 'production' && this.baseUrl.startsWith('http://')) {
      // eslint-disable-next-line no-console
      console.error(
        '❌ SECURITY ERROR: Using insecure HTTP for Game Engine communication in production! ' +
          'Set GAME_ENGINE_URL=https://... to use secure HTTPS.'
      );
    } else if (this.baseUrl.startsWith('https://')) {
      // eslint-disable-next-line no-console
      console.log('✓ Using secure HTTPS for Game Engine communication');
    }
  }

  /**
   * Get the appropriate HTTP module based on URL protocol
   * @param {string} url - URL string
   * @returns {Object} HTTP or HTTPS module
   */
  _getHttpModule(url) {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' ? https : http;
  }

  /**
   * Send match data to Game Engine Service to create a game room
   * @param {Object} matchData - Match object with matchId and players
   * @returns {Promise<{success: boolean, gameRoomId?: string, matchId?: string, error?: string}>}
   */
  async createGameRoom(matchData) {
    return new Promise((resolve, _reject) => {
      try {
        const url = new URL(`${this.baseUrl}/api/game/create-room`);
        const postData = JSON.stringify({
          matchId: matchData.matchId,
          players: matchData.players.map(player => ({
            userId: player.userId,
            heroId: player.heroId
          }))
        });

        const options = {
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          },
          timeout: this.timeout
        };

        // Use HTTPS for secure communication, fallback to HTTP only for local development
        const httpModule = this._getHttpModule(this.baseUrl);
        const req = httpModule.request(options, res => {
          let responseData = '';

          res.on('data', chunk => {
            responseData += chunk;
          });

          res.on('end', () => {
            try {
              if (res.statusCode >= 200 && res.statusCode < 300) {
                const parsed = JSON.parse(responseData);
                resolve({
                  success: true,
                  gameRoomId: parsed.gameRoomId || matchData.matchId,
                  matchId: parsed.matchId || matchData.matchId
                });
              } else {
                resolve({
                  success: false,
                  error: `Game Engine returned status ${res.statusCode}: ${responseData}`
                });
              }
            } catch (parseError) {
              resolve({
                success: false,
                error: `Failed to parse Game Engine response: ${parseError.message}`
              });
            }
          });
        });

        req.on('error', error => {
          resolve({
            success: false,
            error: `Game Engine request failed: ${error.message}`
          });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({
            success: false,
            error: 'Game Engine request timeout'
          });
        });

        req.write(postData);
        req.end();
      } catch (error) {
        resolve({
          success: false,
          error: `Failed to create game room: ${error.message}`
        });
      }
    });
  }
}

module.exports = new GameEngineClient();
