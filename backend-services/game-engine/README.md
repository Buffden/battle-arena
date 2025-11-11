# Game Engine Service

**Technology:** Node.js (Express, Socket.io, Matter.js)  
**Port:** 5002  
**Status:** 🚧 Ready for Implementation

## Overview

Game engine service for Battle Arena. Handles game logic, physics, movement, scoring, and turn management.

## Responsibilities

- Game room management
- Real-time game state synchronization
- Turn management (15 seconds per turn, 4-5 minutes total OR 10 turns per player)
- Movement system (4 moves per game, left/right only, movement scoring)
- Physics calculations (Matter.js, gravity varies by arena, no wind)
- Action processing (aim, fire, move)
- Scoring system (accuracy, back-to-back hits, repositioning saves)
- Health system (different HP per hero type, balanced HP when matched)
- Win condition detection (HP = 0 = instant loss, or player with more HP at match end)
- Draw condition detection (same HP AND same score = draw)
- Weapon synergy system (dynamic system, e.g., gasoline + torch)
- Match result processing
- Configuration file support (weapons, penalties, rank tiers, scoring formulas)
- Disconnection handling (1 minute rejoin window, configurable penalties)

## Design Documentation

See: [Game Engine Service LLD](../../docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md)

## Implementation Guidelines

1. Follow the LLD documentation for class structure and design patterns
2. Implement classes according to the UML class diagram
3. Apply design patterns specified in the LLD
4. Follow clean architecture principles
5. Use Socket.io for WebSocket communication
6. Use Matter.js for physics calculations
7. Use Redis for game state caching
8. Use MongoDB for match result storage

## Structure

```
game-engine/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── middleware/     # Express middleware
│   ├── routes/         # Route definitions
│   ├── utils/          # Utility functions
│   └── types/          # Type definitions
├── server.js           # Application entry point
└── package.json        # NPM dependencies
```

## Dependencies

### Required Dependencies (to be added during implementation)
- `socket.io` - WebSocket communication
- `matter-js` - Physics engine
- `ioredis` or `redis` - Redis caching
- `mongodb` - MongoDB data access
- `jsonwebtoken` - JWT token validation
- `cors` - CORS configuration
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `winston` - Logging
- `dotenv` - Environment variables

### Required DevDependencies
- `nodemon` - Development server
- `jest` - Testing framework
- `eslint` - Linting
- `socket.io-client` - Testing WebSocket connections

## Getting Started

1. Review the LLD documentation
2. Install dependencies: `npm install`
3. Add required dependencies as listed above
4. Implement classes according to the design
5. Write unit tests
6. Run the service on port 5002
