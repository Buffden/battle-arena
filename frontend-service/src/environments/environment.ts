export const environment = {
  production: false,
  apiUrls: {
    auth: '/api/auth',
    profile: '/api/profile',
    leaderboard: '/api/leaderboard',
    matchmaking: '/api/matchmaking',
    test: '/api/test'
  },
  gameService: {
    url: 'http://localhost:5002',
    socketPath: '/socket.io',
    target: 'http://localhost:3003',
    testEndpoints: {
      createMatch: '/api/test/test-match',
      getMatchState: '/api/test/test-match/:roomId',
      simulateAction: '/api/test/test-match/:roomId/action',
      endMatch: '/api/test/test-match/:roomId/end'
    }
  }
};