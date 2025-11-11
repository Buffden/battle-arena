# Frontend Service

**Technology:** Angular  
**Port:** 4200  
**Status:** 🚧 Ready for Implementation

## Overview

Frontend service for Battle Arena. Provides the user interface and game client for the multiplayer artillery battle game.

## Responsibilities

- User authentication and authorization
- Dashboard and navigation
- Hero selection
- Matchmaking interface
- Arena selection (voting/elimination)
- Weapon selection (alternating)
- Game arena (gameplay interface)
- Profile management
- Leaderboard display

## Design Documentation

See: [Frontend Components LLD](../../docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md)  
See: [Component Design HLD](../../docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md)

## Implementation Guidelines

1. Follow the component design documentation for module structure
2. Implement modules: auth, dashboard, hero-selection, matchmaking, arena-selection, weapon-selection, arena, profile, leaderboard
3. Implement services: AuthService, GameService, HeroSelectionService, MatchmakingService, ArenaSelectionService, WeaponSelectionService, ProfileService, LeaderboardService
4. Implement guards and interceptors
5. Follow Angular best practices
6. Ensure responsive design

## Structure

```
frontend-service/
├── src/
│   ├── app/
│   │   ├── auth/              # Authentication module
│   │   ├── dashboard/         # Dashboard module
│   │   ├── hero-selection/    # Hero selection module
│   │   ├── matchmaking/       # Matchmaking module
│   │   ├── arena-selection/   # Arena selection module
│   │   ├── weapon-selection/  # Weapon selection module
│   │   ├── pages/
│   │   │   └── arena/         # Game arena module
│   │   ├── profile/           # Profile module
│   │   ├── leaderboard/       # Leaderboard module
│   │   ├── shared/            # Shared components
│   │   ├── services/          # Angular services
│   │   ├── guards/            # Route guards
│   │   └── interceptors/      # HTTP interceptors
│   └── assets/                # Static assets
└── package.json
```

## Getting Started

1. Review the component design documentation
2. Implement modules according to the design
3. Implement services for API communication
4. Implement guards for route protection
5. Implement interceptors for JWT token management
6. Run the service on port 4200

## Key Services

### AuthService
- User login and registration
- JWT token storage and retrieval
- Token refresh
- Logout functionality

### GameService
- WebSocket connection management
- Game state synchronization
- Game event handling
- Movement system management
- Turn management
- Match result processing

### MatchmakingService
- Queue joining/leaving with hero selection
- Match notification handling
- Hero assignment notification
- Lobby acceptance/rejection
- Queue status updates
- Estimated wait time

### ProfileService
- Profile data fetching
- Profile updates
- Global score tracking
- Rank tier retrieval
- Statistics retrieval
- Avatar management

### LeaderboardService
- Leaderboard data fetching with filters
- Ranking retrieval
- Rank tier retrieval
- Statistics aggregation

## Configuration

### proxy.conf.json
Proxy configuration for API services during development. Currently empty - configure as services are implemented.

Service ports:
- Auth Service: 8081
- Profile Service: 8082
- Leaderboard Service: 8083
- Matchmaking Service: 3002
- Game Engine Service: 5002

## Development

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test
```
