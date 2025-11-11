# Matchmaking Service

**Technology:** Node.js (Express, Socket.io)  
**Port:** 3002  
**Status:** 🚧 Ready for Implementation

## Overview

Matchmaking service for Battle Arena. Handles player matching, hero selection, arena selection, and weapon selection.

## Responsibilities

- Hero selection management (multiple hero selection, hero matching, hero assignment)
- Player queue management
- Global score/rank-based matchmaking algorithm
- Queue expansion (after 5 minutes, widen XP/score/rank range)
- Arena selection management (voting/elimination system)
- Weapon selection management (alternating selection, 30-second timer)
- Lobby creation and management
- Match acceptance handling
- Estimated wait time calculation
- Reconnection handling

## Design Documentation

See: [Matchmaking Service LLD](../../docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md)

## Implementation Guidelines

1. Follow the LLD documentation for class structure and design patterns
2. Implement classes according to the UML class diagram
3. Apply design patterns specified in the LLD
4. Follow clean architecture principles
5. Use Socket.io for WebSocket communication
6. Use Redis for queue management and caching

## Structure

```
matchmaking-service/
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
- `ioredis` or `redis` - Redis queue management
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
6. Run the service on port 3002
 