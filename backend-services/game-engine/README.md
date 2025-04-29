# Game Engine Service

This service handles the core game mechanics and physics for the Battle Arena game using Matter.js for physics simulation and Socket.IO for real-time communication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=3003
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

3. Start the service:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

- `GET /health`: Health check endpoint
- WebSocket events:
  - `joinGame`: Join a game room
  - `playerAction`: Handle player actions (movement, shooting, etc.)
  - `gameState`: Receive game state updates
  - `playerJoined`: Notify when a new player joins

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`

## Architecture

The service uses:
- Express.js for HTTP server
- Socket.IO for real-time communication
- Matter.js for physics simulation
- Winston for logging
- Helmet for security headers
- Express Rate Limit for request limiting

## Game Mechanics

The service handles:
- Tank movement and physics
- Projectile physics
- Terrain generation and collision
- Game state synchronization
- Player actions and events 