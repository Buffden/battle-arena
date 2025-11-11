# Component Design

**Part of:** [High-Level Design (HLD)](./README.md)  
**Last Updated:** 2024

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**This document and all implementation MUST strictly adhere to the following principles:**

1. **REUSABILITY** - All components, services, and utilities MUST be designed for maximum reusability across the system
2. **GOOD CODE PRACTICES** - Follow SOLID principles, DRY (Don't Repeat Yourself), and industry best practices
3. **CLEAN CODE** - Code must be readable, self-documenting, and maintainable
4. **CLEAN ARCHITECTURE** - Strict separation of concerns with clear boundaries between layers
5. **SECURE PROGRAMMING** - Security-first approach with defense in depth, input validation, and secure communication

**These principles are NON-NEGOTIABLE and must be enforced in every line of code and every architectural decision.**

---

## 1. Frontend Components

### 1.1 Angular Application Structure

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
```

### 1.2 Key Frontend Services

#### AuthService
- **Purpose:** Handles authentication and JWT token management
- **Responsibilities:**
  - User login and registration
  - JWT token storage and retrieval
  - Token refresh
  - Logout functionality
- **Methods:**
  - `login(username, password)`
  - `register(userData)`
  - `logout()`
  - `getToken()`
  - `isAuthenticated()`

#### GameService
- **Purpose:** Manages game state and WebSocket communication
- **Responsibilities:**
  - WebSocket connection management
  - Game state synchronization
  - Game event handling
  - Movement system management
  - Turn management
  - Match result processing
- **Methods:**
  - `connectToGame(roomId)`
  - `sendAction(action)`
  - `moveHero(direction: 'left' | 'right')`
  - `fireWeapon(angle: number, power: number, weaponId: string)`
  - `onGameStateUpdate(callback)`
  - `onTurnUpdate(callback)`
  - `onMatchEnd(callback)`
  - `disconnectFromGame()`
  - `reconnectToGame(roomId)`

#### HeroSelectionService
- **Purpose:** Manages hero selection before matchmaking
- **Responsibilities:**
  - Multiple hero selection
  - Hero selection storage
  - Hero selection priority management
- **Methods:**
  - `selectHeroes(heroIds: string[])`
  - `getSelectedHeroes()`
  - `clearSelection()`
  - `updateHeroPriority(heroIds: string[])`

#### MatchmakingService
- **Purpose:** Handles queue joining and match notifications
- **Responsibilities:**
  - Queue joining/leaving with hero selection
  - Match notification handling
  - Hero assignment notification
  - Lobby acceptance/rejection
  - Queue status updates
  - Estimated wait time
- **Methods:**
  - `joinQueue(heroIds: string[])`
  - `leaveQueue()`
  - `onMatchFound(callback)`
  - `onHeroAssigned(callback)`
  - `acceptMatch(matchId)`
  - `rejectMatch(matchId)`
  - `getQueueStatus()`

#### ArenaSelectionService
- **Purpose:** Manages arena selection (voting/elimination)
- **Responsibilities:**
  - Arena voting/elimination
  - Arena selection state management
  - Arena preview management
- **Methods:**
  - `getAvailableArenas(heroType: string)`
  - `eliminateArena(arenaId: string)`
  - `onArenaEliminated(callback)`
  - `onArenaSelected(callback)`

#### WeaponSelectionService
- **Purpose:** Manages weapon selection (alternating selection)
- **Responsibilities:**
  - Weapon selection (alternating)
  - Weapon selection timer management
  - Weapon selection visibility
- **Methods:**
  - `selectWeapon(weaponId: string)`
  - `onWeaponSelected(callback)`
  - `onSelectionComplete(callback)`
  - `getSelectionTimer()`

#### ProfileService
- **Purpose:** Manages user profile data
- **Responsibilities:**
  - Profile data fetching
  - Profile updates
  - Global score tracking
  - Rank tier retrieval
  - Statistics retrieval
  - Avatar management
- **Methods:**
  - `getProfile()`
  - `updateProfile(profileData)`
  - `getGlobalScore()`
  - `getRankTier()`
  - `getStatistics()`
  - `updateAvatar(avatarUrl)`

#### LeaderboardService
- **Purpose:** Fetches leaderboard data with filtering
- **Responsibilities:**
  - Leaderboard data fetching with filters
  - Ranking retrieval
  - Rank tier retrieval
  - Statistics aggregation
- **Methods:**
  - `getLeaderboard(filters: LeaderboardFilters, limit: number)`
  - `getPlayerRank(playerId: string)`
  - `getPlayerRankTier(playerId: string)`
  - `getTopPlayers(filters: LeaderboardFilters, limit: number)`
  - `filterByRegion(region: string)`
  - `filterByHeroType(heroType: string)`
  - `filterByWinPercentage(minWinPercentage: number)`
  - `filterByWeaponUsage(weaponId: string)`

---

## 2. Backend Services Architecture

### 2.1 Spring Boot Services (Auth, Profile, Leaderboard)

#### Service Structure
```
service-name/
├── src/main/java/
│   ├── controller/            # REST controllers
│   ├── service/               # Business logic
│   ├── repository/            # Data access layer
│   ├── model/                 # Entity models
│   ├── dto/                   # Data transfer objects
│   ├── security/              # Security configuration
│   ├── config/                # Configuration classes
│   └── exception/             # Exception handlers
├── src/main/resources/
│   └── application.properties # Configuration
└── pom.xml                    # Maven dependencies
```

#### Layer Responsibilities

**Controller Layer**
- **Purpose:** Handle HTTP requests and responses
- **Responsibilities:**
  - Request validation
  - Response formatting
  - Error handling
  - Authentication/Authorization

**Service Layer**
- **Purpose:** Business logic implementation
- **Responsibilities:**
  - Business rule enforcement
  - Data transformation
  - Service coordination
  - Transaction management

**Repository Layer**
- **Purpose:** Data access abstraction
- **Responsibilities:**
  - Database operations
  - Query optimization
  - Data mapping
  - Connection management

**Model Layer**
- **Purpose:** Entity representation
- **Responsibilities:**
  - Data structure definition
  - Validation rules
  - Relationships definition

**DTO Layer**
- **Purpose:** Data transfer objects
- **Responsibilities:**
  - API contract definition
  - Data validation
  - Serialization/Deserialization

---

### 2.2 Node.js Services (Matchmaking, Game Engine)

#### Service Structure
```
service-name/
├── src/
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   ├── routes/                # Route definitions
│   ├── utils/                 # Utility functions
│   └── types/                 # Type definitions
├── server.js                  # Application entry point
└── package.json               # NPM dependencies
```

#### Layer Responsibilities

**Controller Layer**
- **Purpose:** Handle HTTP requests and WebSocket events
- **Responsibilities:**
  - Request validation
  - Event handling
  - Response formatting
  - Error handling

**Service Layer**
- **Purpose:** Business logic implementation
- **Responsibilities:**
  - Business rule enforcement
  - State management
  - Service coordination
  - Event emission

**Middleware Layer**
- **Purpose:** Request/response processing
- **Responsibilities:**
  - Authentication
  - Logging
  - Error handling
  - Request validation

**Routes Layer**
- **Purpose:** Route definitions
- **Responsibilities:**
  - Route mapping
  - Route handlers
  - Route middleware
  - Route validation

---

## 3. Component Reusability

### 3.1 Shared Components
- **Authentication Middleware** - Reusable across all services
- **Validation Utilities** - Common validation functions
- **Error Handlers** - Standardized error handling
- **Logging Utilities** - Centralized logging
- **Configuration Management** - Environment-based configuration

### 3.2 Common Patterns
- **Repository Pattern** - Data access abstraction
- **Service Pattern** - Business logic encapsulation
- **DTO Pattern** - Data transfer objects
- **Factory Pattern** - Object creation
- **Observer Pattern** - Event-driven communication

---

## 4. Component Communication

### 4.1 Frontend to Backend
- **REST API** - HTTP/HTTPS for standard operations
- **WebSocket** - Real-time communication for game events
- **JSON** - Data format for all communications

### 4.2 Backend Services
- **REST API** - Inter-service communication
- **Redis Pub/Sub** - Event-driven communication
- **Database** - Shared data storage

---

## 5. Related Documentation

- [System Architecture](./02-SYSTEM_ARCHITECTURE.md) - System architecture overview
- [Data Flow](./04-DATA_FLOW.md) - Data flow diagrams
- [Communication Patterns](./05-COMMUNICATION_PATTERNS.md) - Communication patterns
- [Low-Level Design (LLD)](../LOW_LEVEL_DESIGN/README.md) - Detailed component specifications (To be created)

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

