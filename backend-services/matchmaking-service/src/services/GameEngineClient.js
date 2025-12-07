const http = require('node:http');

/**
 * GameEngineClient handles HTTP communication with Game Engine Service
 */
class GameEngineClient {
  constructor() {
    // Note: HTTP is used for internal service-to-service communication within Docker network
    // This is safe as it's not exposed to external networks
    // For production with external services, use HTTPS via GAME_ENGINE_URL environment variable
    this.baseUrl = process.env.GAME_ENGINE_URL || 'http://game-engine:5002';
    this.timeout = 5000; // 5 seconds timeout
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

        const req = http.request(options, res => {
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
