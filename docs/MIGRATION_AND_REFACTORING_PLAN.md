# 🔄 Migration and Refactoring Plan
## Battle Arena - Aligning Implementation with Architecture

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Active - Implementation Guide

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**This refactoring MUST strictly adhere to the following principles:**

1. **REUSABILITY** - All components, services, and utilities MUST be designed for maximum reusability across the system
2. **GOOD CODE PRACTICES** - Follow SOLID principles, DRY (Don't Repeat Yourself), and industry best practices
3. **CLEAN CODE** - Code must be readable, self-documenting, and maintainable
4. **CLEAN ARCHITECTURE** - Strict separation of concerns with clear boundaries between layers
5. **SECURE PROGRAMMING** - Security-first approach with defense in depth, input validation, and secure communication

**These principles are NON-NEGOTIABLE and must be enforced in every line of code and every architectural decision.**

---

## 1. Current State Analysis

### 1.1 What Exists ✅

#### Backend Services
- ✅ **Auth Service** (Spring Boot) - Basic authentication implemented
- ✅ **Profile Service** (Spring Boot) - Basic profile management
- ✅ **Leaderboard Service** (Spring Boot) - Basic leaderboard
- ✅ **Matchmaking Service** (Node.js) - Basic matchmaking
- ✅ **Game Engine Service** (Node.js) - Basic game logic
- ✅ **Docker Compose** - Services containerized
- ✅ **MongoDB** - Database configured
- ✅ **Redis** - Cache/queue configured

#### Frontend
- ✅ **Angular Service** - Basic frontend structure
- ✅ **Auth Components** - Login/registration
- ✅ **Matchmaking Component** - Basic matchmaking UI
- ✅ **Dashboard** - Basic dashboard

### 1.2 What's Missing ❌

#### Backend Services
- ❌ **Configuration Service** (Spring Boot) - **MISSING**
- ❌ **Hero/Weapon/Arena Data Models** - **MISSING**
- ❌ **Game Engine Components** - Many components missing (TurnManager, MovementManager, ScoringSystem, etc.)
- ❌ **Matchmaking Features** - Hero selection, arena selection, weapon selection
- ❌ **Design Patterns** - Not following documented patterns (Strategy, Factory, State, etc.)

#### Data Models
- ❌ **Hero Model** - Missing
- ❌ **Weapon Model** - Missing
- ❌ **Arena Model** - Missing
- ❌ **Profile Model** - Missing `globalScore`, `rankTier`, `region`
- ❌ **Match Model** - Missing many fields (heroes, weapons, arena, scores, HP)
- ❌ **Leaderboard Model** - Missing filtering fields

#### Features
- ❌ **Hero Selection System** - Missing
- ❌ **Arena Selection System** - Missing
- ❌ **Weapon Selection System** - Missing
- ❌ **Turn Management** - Missing (15s timer, turn count)
- ❌ **Movement System** - Missing (4 moves per game)
- ❌ **Scoring System** - Missing (accuracy, back-to-back hits, repositioning saves)
- ❌ **Win/Draw Conditions** - Missing (HP = 0, match timer, turn count)
- ❌ **Rank Tier System** - Missing (Valorant-style)
- ❌ **Global Score System** - Missing (infinite score, no level cap)
- ❌ **Leaderboard Filtering** - Missing (region, hero, win%, weapons)
- ❌ **Queue Expansion** - Missing (after 5 minutes)
- ❌ **Weapon Synergies** - Missing

### 1.3 Structural Issues 🚨

#### Package Naming Inconsistencies
- ❌ `Auth.Service` (groupId) should be `com.battlearena`
- ❌ `Profile.Service` (groupId) should be `com.battlearena`
- ❌ Test packages inconsistent (`Auth.Service` vs `com.battlearena.auth`)

#### Folder Structure Issues
- ❌ Nested folders: `auth-service/backend-services/game-engine/`
- ❌ Duplicate target folders: `com.battlearena.auth/`, `com.battlearena.profile/`, `com.battlearena.leaderboard/`
- ❌ Missing standardized folder structure

#### Code Structure Issues
- ❌ User model uses `xp` and `level` instead of `globalScore` and `rankTier`
- ❌ Missing repository pattern implementation
- ❌ Missing service layer separation
- ❌ Missing DTOs for all endpoints
- ❌ Missing validation
- ❌ Missing error handling strategies
- ❌ Missing design pattern implementations

---

## 2. Refactoring Strategy

### 2.1 Phased Approach

We will refactor in **6 phases** to minimize risk and ensure incremental progress:

1. **Phase 1: Foundation** - Fix package names, folder structure, and basic models
2. **Phase 2: Data Models** - Create all data models (Hero, Weapon, Arena, updated Profile, Match, Leaderboard)
3. **Phase 3: Configuration Service** - Create Configuration Service
4. **Phase 4: Service Refactoring** - Refactor existing services to follow LLD
5. **Phase 5: Game Features** - Implement game features (hero selection, arena selection, weapon selection, turn management, movement, scoring)
6. **Phase 6: Frontend Integration** - Update frontend to use new backend APIs

### 2.2 Migration Principles

1. **Backward Compatibility** - Maintain existing functionality while refactoring
2. **Incremental Changes** - Small, testable changes
3. **Test Coverage** - Write tests before refactoring
4. **Documentation** - Update documentation as we refactor
5. **Git Branches** - Use feature branches for each phase

---

## 3. Phase 1: Foundation (Week 1)

### 3.1 Fix Package Names

#### Auth Service
- [ ] Update `pom.xml`: Change `groupId` from `Auth.Service` to `com.battlearena`
- [ ] Update `artifactId` from `com.battlearena.auth` to `auth-service`
- [ ] Verify all Java files use `package com.battlearena.auth.*`
- [ ] Update test packages to match

#### Profile Service
- [ ] Update `pom.xml`: Change `groupId` from `Profile.Service` to `com.battlearena`
- [ ] Update `artifactId` from `com.battlearena.profile` to `profile-service`
- [ ] Verify all Java files use `package com.battlearena.profile.*`
- [ ] Update test packages to match

#### Leaderboard Service
- [ ] Update `pom.xml`: Change `groupId` from `Leaderboard.Service` to `com.battlearena`
- [ ] Update `artifactId` from `com.battlearena.leaderboard` to `leaderboard-service`
- [ ] Verify all Java files use `package com.battlearena.leaderboard.*`
- [ ] Update test packages to match

### 3.2 Clean Up Folder Structure

#### Remove Nested Folders
- [ ] Remove `auth-service/backend-services/` folder
- [ ] Remove `matchmaking-service/backend-services/` folder
- [ ] Remove duplicate target folders: `com.battlearena.auth/`, `com.battlearena.profile/`, `com.battlearena.leaderboard/`

#### Standardize Structure
- [ ] Ensure all services follow this structure:
  ```
  {service-name}/
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── com/battlearena/{service}/
    │   │   │       ├── controller/
    │   │   │       ├── service/
    │   │   │       ├── repository/
    │   │   │       ├── model/
    │   │   │       ├── dto/
    │   │   │       ├── config/
    │   │   │       └── util/
    │   │   └── resources/
    │   │       └── application.properties
    │   └── test/
    │       └── java/
    │           └── com/battlearena/{service}/
    ├── pom.xml (for Spring Boot) or package.json (for Node.js)
    └── README.md
  ```

### 3.3 Update User Model

#### Auth Service - User Model
- [ ] Remove `xp` and `level` fields (move to Profile Service)
- [ ] Keep only authentication-related fields:
  - `id`, `username`, `email`, `password`, `authType`, `createdAt`, `updatedAt`
- [ ] Add `createdAt` and `updatedAt` fields if missing
- [ ] Update UserRepository to match new model

#### Profile Service - Profile Model
- [ ] Add `globalScore` field (long, default: 0)
- [ ] Add `rankTier` field (String, default: "Bronze")
- [ ] Add `region` field (String)
- [ ] Add `wins`, `losses`, `matchesPlayed` fields
- [ ] Remove `xp` and `level` if they exist
- [ ] Update ProfileRepository to match new model

### 3.4 Update Docker Compose

- [ ] Verify all services use correct ports:
  - Auth Service: 8081
  - Profile Service: 8082
  - Leaderboard Service: 8083
  - Matchmaking Service: 3002
  - Game Engine Service: 5002
- [ ] Add Configuration Service (port 8084) - placeholder for Phase 3
- [ ] Verify environment variables match documented architecture

### 3.5 Create Base Classes

#### Common DTOs
- [ ] Create `BaseResponse` DTO
- [ ] Create `ErrorResponse` DTO
- [ ] Create `PaginationResponse` DTO

#### Common Utilities
- [ ] Create `ResponseUtil` for standardized responses
- [ ] Create `ValidationUtil` for input validation
- [ ] Create `ExceptionHandler` for global exception handling

---

## 4. Phase 2: Data Models (Week 2)

### 4.1 Create Hero Model

#### MongoDB Collection: `heroes`
- [ ] Create `Hero` model with fields:
  - `_id`, `heroId`, `heroType`, `name`, `size`, `hitbox`, `baseHP`, `speed`, `weapons`, `animations`, `characteristics`, `createdAt`, `updatedAt`
- [ ] Create `HeroRepository` interface
- [ ] Create `HeroService` with CRUD operations
- [ ] Create `HeroController` with REST endpoints
- [ ] Add validation and error handling

### 4.2 Create Weapon Model

#### MongoDB Collection: `weapons`
- [ ] Create `Weapon` model with fields:
  - `_id`, `weaponId`, `heroType`, `name`, `damage`, `range`, `trajectory`, `weight`, `physics`, `animations`, `synergies`, `createdAt`, `updatedAt`
- [ ] Create `WeaponRepository` interface
- [ ] Create `WeaponService` with CRUD operations
- [ ] Create `WeaponController` with REST endpoints
- [ ] Add validation and error handling

### 4.3 Create Arena Model

#### MongoDB Collection: `arenas`
- [ ] Create `Arena` model with fields:
  - `_id`, `arenaId`, `heroTypes`, `name`, `terrain`, `gravity`, `previewImage`, `boundaries`, `createdAt`, `updatedAt`
- [ ] Create `ArenaRepository` interface
- [ ] Create `ArenaService` with CRUD operations
- [ ] Create `ArenaController` with REST endpoints
- [ ] Add validation and error handling

### 4.4 Update Profile Model

#### MongoDB Collection: `profiles`
- [ ] Add `globalScore` field (long, default: 0)
- [ ] Add `rankTier` field (String, default: "Bronze")
- [ ] Add `region` field (String)
- [ ] Add `wins` field (int, default: 0)
- [ ] Add `losses` field (int, default: 0)
- [ ] Add `matchesPlayed` field (int, default: 0)
- [ ] Add `bio` field (String, optional)
- [ ] Add `achievements` field (List<String>, default: [])
- [ ] Update `ProfileRepository` with new fields
- [ ] Create migration script to update existing profiles

### 4.5 Update Match Model

#### MongoDB Collection: `matches`
- [ ] Add `player1Hero` field (String)
- [ ] Add `player2Hero` field (String)
- [ ] Add `player1Weapons` field (List<String>)
- [ ] Add `player2Weapons` field (List<String>)
- [ ] Add `arenaId` field (String)
- [ ] Add `player1Score` field (Number)
- [ ] Add `player2Score` field (Number)
- [ ] Add `player1HP` field (Number)
- [ ] Add `player2HP` field (Number)
- [ ] Add `isDraw` field (Boolean)
- [ ] Update `MatchRepository` with new fields
- [ ] Create migration script to update existing matches

### 4.6 Update Leaderboard Model

#### MongoDB Collection: `leaderboard`
- [ ] Add `rankTier` field (String)
- [ ] Add `region` field (String)
- [ ] Add `heroType` field (String)
- [ ] Add `weaponUsage` field (Map<String, Integer>)
- [ ] Update `LeaderboardRepository` with new fields
- [ ] Create migration script to update existing leaderboard entries

### 4.7 Create Database Indexes

- [ ] Create indexes for `heroes` collection:
  - `heroId` (unique)
  - `heroType`
  - `name`
- [ ] Create indexes for `weapons` collection:
  - `weaponId` (unique)
  - `heroType`
  - `name`
- [ ] Create indexes for `arenas` collection:
  - `arenaId` (unique)
  - `heroTypes`
  - `name`
- [ ] Create indexes for `profiles` collection:
  - `userId` (unique)
  - `globalScore` (descending)
  - `rankTier`
  - `region`
- [ ] Create indexes for `matches` collection:
  - `matchId` (unique)
  - `player1Id`, `player2Id`, `winnerId`
  - `player1Hero`, `player2Hero`
  - `arenaId`
- [ ] Create indexes for `leaderboard` collection:
  - `userId` (unique)
  - `rank`, `globalScore` (descending)
  - `rankTier`, `region`, `heroType`
  - Compound indexes for filtering

---

## 5. Phase 3: Configuration Service (Week 3)

### 5.1 Create Configuration Service

#### Spring Boot Service
- [ ] Create new Spring Boot project: `configuration-service`
- [ ] Update `pom.xml` with dependencies:
  - Spring Boot Web
  - Spring Boot Data MongoDB
  - Spring Boot Security
  - JWT
  - Lombok
- [ ] Set port to `8084`
- [ ] Create package structure: `com.battlearena.configuration.*`

#### Configuration Model
- [ ] Create `ConfigFile` model:
  - `_id`, `configType`, `configName`, `configData`, `version`, `isActive`, `createdAt`, `updatedAt`
- [ ] Create `ConfigFileRepository` interface
- [ ] Create `ConfigFileService` with CRUD operations
- [ ] Create `ConfigFileController` with REST endpoints

#### Configuration Types
- [ ] Create `RankTierConfig` (rank tier ranges)
- [ ] Create `ScoringFormulaConfig` (scoring formulas)
- [ ] Create `GameParameterConfig` (game parameters)
- [ ] Create `PenaltyConfig` (penalties)
- [ ] Create `WeaponConfig` (weapon configurations - metadata only, data in MongoDB)

#### Configuration Manager
- [ ] Create `ConfigurationManager` service
- [ ] Implement caching with Redis
- [ ] Implement configuration retrieval methods
- [ ] Implement configuration update methods
- [ ] Add validation and error handling

#### Docker Configuration
- [ ] Update `docker-compose.yml` to include Configuration Service
- [ ] Create Dockerfile for Configuration Service
- [ ] Test service startup and connectivity

---

## 6. Phase 4: Service Refactoring (Week 4-5)

### 6.1 Auth Service Refactoring

#### Follow LLD Structure
- [ ] Refactor to follow `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md`
- [ ] Implement Repository Pattern
- [ ] Implement Service Layer separation
- [ ] Create DTOs for all endpoints
- [ ] Add validation
- [ ] Add error handling
- [ ] Implement JWT token refresh (if needed)

#### Design Patterns
- [ ] Implement Facade Pattern for `AuthController`
- [ ] Implement Strategy Pattern for authentication methods (if needed)
- [ ] Implement Repository Pattern for `UserRepository`

### 6.2 Profile Service Refactoring

#### Follow LLD Structure
- [ ] Refactor to follow `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md`
- [ ] Implement Repository Pattern
- [ ] Implement Service Layer separation
- [ ] Create DTOs for all endpoints
- [ ] Add validation
- [ ] Add error handling

#### Score and Rank Tier System
- [ ] Implement `ScoreCalculator` with Strategy Pattern
- [ ] Implement `RankTierCalculator` with Strategy Pattern
- [ ] Implement `ValorantStyleRankTierStrategy`
- [ ] Implement global score calculation (infinite, no level cap)
- [ ] Implement rank tier calculation (based on score ranges)
- [ ] Implement rank change calculation (based on match score)
- [ ] Integrate with Configuration Service for rank tier ranges

#### Design Patterns
- [ ] Implement Facade Pattern for `ProfileController`
- [ ] Implement Strategy Pattern for `ScoringStrategy` and `RankTierStrategy`
- [ ] Implement Proxy Pattern for `RedisCache`
- [ ] Implement Repository Pattern for `ProfileRepository`

### 6.3 Leaderboard Service Refactoring

#### Follow LLD Structure
- [ ] Refactor to follow `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md`
- [ ] Implement Repository Pattern
- [ ] Implement Service Layer separation
- [ ] Create DTOs for all endpoints
- [ ] Add validation
- [ ] Add error handling

#### Filtering System
- [ ] Implement `FilterStrategy` interface
- [ ] Implement `RegionFilterStrategy`
- [ ] Implement `HeroTypeFilterStrategy`
- [ ] Implement `WinPercentageFilterStrategy`
- [ ] Implement `WeaponUsageFilterStrategy`
- [ ] Implement `CompositeFilterStrategy`
- [ ] Implement ranking algorithms
- [ ] Implement leaderboard updates

#### Design Patterns
- [ ] Implement Facade Pattern for `LeaderboardController`
- [ ] Implement Strategy Pattern for `RankingStrategy` and `FilterStrategy`
- [ ] Implement Composite Pattern for `CompositeFilterStrategy`
- [ ] Implement Proxy Pattern for `RedisCache`
- [ ] Implement Repository Pattern for `LeaderboardRepository`

### 6.4 Matchmaking Service Refactoring

#### Follow LLD Structure
- [ ] Refactor to follow `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md`
- [ ] Implement Repository Pattern
- [ ] Implement Service Layer separation
- [ ] Create DTOs for all endpoints
- [ ] Add validation
- [ ] Add error handling

#### Matchmaking Engine
- [ ] Implement `MatchmakingEngine` with Strategy Pattern
- [ ] Implement `QueueManager` with hero-based queues
- [ ] Implement `HeroSelector` with Strategy Pattern
- [ ] Implement `ArenaSelector` with State Pattern
- [ ] Implement `WeaponSelector` with State Pattern
- [ ] Implement `LobbyManager` with Factory Pattern
- [ ] Implement global score/rank-based matching
- [ ] Implement queue expansion (after 5 minutes)
- [ ] Implement estimated wait time calculation
- [ ] Integrate with Configuration Service for matching config

#### Design Patterns
- [ ] Implement Facade Pattern for `MatchmakingController`
- [ ] Implement Strategy Pattern for `MatchingStrategy` and `HeroSelectionStrategy`
- [ ] Implement State Pattern for `ArenaSelectionState` and `WeaponSelectionState`
- [ ] Implement Factory Pattern for `LobbyFactory`
- [ ] Implement Repository Pattern for `ArenaRepository` and `WeaponRepository`

### 6.5 Game Engine Service Refactoring

#### Follow LLD Structure
- [ ] Refactor to follow `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md`
- [ ] Implement Repository Pattern
- [ ] Implement Service Layer separation
- [ ] Create DTOs for all endpoints
- [ ] Add validation
- [ ] Add error handling

#### Game Engine Components
- [ ] Implement `GameRoomManager` with Factory Pattern
- [ ] Implement `TurnManager` with State Pattern
- [ ] Implement `MovementManager` with Command Pattern
- [ ] Implement `PhysicsEngine` with Strategy Pattern and Adapter Pattern
- [ ] Implement `ScoringSystem` with Strategy Pattern and Decorator Pattern
- [ ] Implement `HealthSystem` with Strategy Pattern
- [ ] Implement `WinConditionChecker` with Strategy Pattern
- [ ] Implement `WeaponSynergySystem` with Strategy Pattern
- [ ] Implement `MatchResultProcessor` with Template Method Pattern
- [ ] Integrate with Configuration Service for scoring formulas and penalties

#### Design Patterns
- [ ] Implement Facade Pattern for `GameEngineController`
- [ ] Implement Strategy Pattern for `PhysicsStrategy`, `ScoringStrategy`, `WinConditionStrategy`, `WeaponSynergyStrategy`
- [ ] Implement State Pattern for `GameState` and `TurnState`
- [ ] Implement Command Pattern for `MoveCommand` and `FireCommand`
- [ ] Implement Observer Pattern for `GameStateObserver` and `TurnObserver`
- [ ] Implement Template Method Pattern for `MatchResultProcessor`
- [ ] Implement Factory Pattern for `GameRoomFactory`
- [ ] Implement Adapter Pattern for `MatterJsAdapter`
- [ ] Implement Decorator Pattern for `ScoringDecorator`

---

## 7. Phase 5: Game Features (Week 6-8)

### 7.1 Hero Selection System

#### Frontend
- [ ] Create `HeroSelectionComponent`
- [ ] Create `HeroSelectionService`
- [ ] Implement hero selection UI
- [ ] Implement multiple hero selection
- [ ] Implement hero priority management

#### Backend
- [ ] Integrate with Matchmaking Service
- [ ] Implement hero selection API
- [ ] Implement hero matching logic
- [ ] Implement hero assignment (random from common heroes)

### 7.2 Arena Selection System

#### Frontend
- [ ] Create `ArenaSelectionComponent`
- [ ] Create `ArenaSelectionService`
- [ ] Implement arena selection UI (voting/elimination)
- [ ] Implement real-time arena elimination updates

#### Backend
- [ ] Integrate with Matchmaking Service
- [ ] Implement arena selection API
- [ ] Implement voting/elimination logic
- [ ] Implement arena auto-selection when one remains

### 7.3 Weapon Selection System

#### Frontend
- [ ] Create `WeaponSelectionComponent`
- [ ] Create `WeaponSelectionService`
- [ ] Implement weapon selection UI (alternating selection)
- [ ] Implement 30-second total timer
- [ ] Implement weapon selection countdown

#### Backend
- [ ] Integrate with Matchmaking Service
- [ ] Implement weapon selection API
- [ ] Implement alternating selection logic
- [ ] Implement 30-second total timer
- [ ] Implement random weapon selection on timeout
- [ ] Implement weapon lock after selection

### 7.4 Turn Management System

#### Backend
- [ ] Implement `TurnManager` with 15-second timer
- [ ] Implement turn count tracking (10 turns per player)
- [ ] Implement match timer (4-5 minutes)
- [ ] Implement turn timeout handling
- [ ] Implement turn switching logic
- [ ] Integrate with Game Engine Service

#### Frontend
- [ ] Display turn timer (15 seconds)
- [ ] Display match timer (4-5 minutes)
- [ ] Display turn count (X/10)
- [ ] Handle turn timeout

### 7.5 Movement System

#### Backend
- [ ] Implement `MovementManager` with 4 moves per game
- [ ] Implement movement validation (left/right only, arena boundaries)
- [ ] Implement movement count tracking
- [ ] Implement repositioning save scoring
- [ ] Integrate with Game Engine Service

#### Frontend
- [ ] Implement movement UI (left/right buttons)
- [ ] Display remaining moves (X/4)
- [ ] Handle movement validation errors

### 7.6 Scoring System

#### Backend
- [ ] Implement `ScoringSystem` with accuracy scoring
- [ ] Implement back-to-back hit bonus
- [ ] Implement repositioning save scoring
- [ ] Integrate with Configuration Service for scoring formulas
- [ ] Integrate with Game Engine Service

#### Frontend
- [ ] Display score updates in real-time
- [ ] Display scoring breakdown (accuracy, bonuses, saves)

### 7.7 Win/Draw Conditions

#### Backend
- [ ] Implement `WinConditionChecker` with instant loss (HP = 0)
- [ ] Implement match end conditions (timer, turns, HP)
- [ ] Implement draw condition (same HP AND same score)
- [ ] Implement winner determination (higher HP, then higher score)
- [ ] Integrate with Game Engine Service

#### Frontend
- [ ] Display win/loss/draw notifications
- [ ] Display match results
- [ ] Display score and rank updates

### 7.8 Weapon Synergies

#### Backend
- [ ] Implement `WeaponSynergySystem` with dynamic synergies
- [ ] Implement synergy detection (e.g., gasoline + torch)
- [ ] Implement synergy effects (increased damage, special effects)
- [ ] Integrate with Configuration Service for synergy config
- [ ] Integrate with Game Engine Service

#### Frontend
- [ ] Display synergy notifications
- [ ] Display synergy effects

---

## 8. Phase 6: Frontend Integration (Week 9-10)

### 8.1 Update Frontend Services

#### Auth Service
- [ ] Update `AuthService` to use new API endpoints
- [ ] Update error handling
- [ ] Update token management

#### Profile Service
- [ ] Update `ProfileService` to use new API endpoints
- [ ] Update score and rank tier display
- [ ] Update profile management

#### Leaderboard Service
- [ ] Update `LeaderboardService` to use new API endpoints
- [ ] Implement filtering (region, hero, win%, weapons)
- [ ] Update leaderboard display

#### Matchmaking Service
- [ ] Update `MatchmakingService` to use new WebSocket events
- [ ] Implement hero selection
- [ ] Implement arena selection
- [ ] Implement weapon selection
- [ ] Update queue status display

#### Game Service
- [ ] Update `GameService` to use new WebSocket events
- [ ] Implement turn management UI
- [ ] Implement movement UI
- [ ] Implement scoring display
- [ ] Implement win/loss/draw notifications

### 8.2 Update Frontend Components

#### Hero Selection Component
- [ ] Create `HeroSelectionComponent`
- [ ] Implement hero selection UI
- [ ] Implement multiple hero selection
- [ ] Integrate with `HeroSelectionService`

#### Arena Selection Component
- [ ] Create `ArenaSelectionComponent`
- [ ] Implement arena selection UI (voting/elimination)
- [ ] Integrate with `ArenaSelectionService`

#### Weapon Selection Component
- [ ] Create `WeaponSelectionComponent`
- [ ] Implement weapon selection UI (alternating selection)
- [ ] Implement 30-second total timer
- [ ] Integrate with `WeaponSelectionService`

#### Game Arena Component
- [ ] Update `GameArenaComponent` with Phaser 3
- [ ] Implement turn management UI
- [ ] Implement movement UI
- [ ] Implement scoring display
- [ ] Implement win/loss/draw notifications

### 8.3 Update Frontend Routes

- [ ] Update `app.routes.ts` with new routes:
  - `/hero-selection`
  - `/arena-selection`
  - `/weapon-selection`
  - `/game-arena`
- [ ] Update route guards
- [ ] Update route navigation

---

## 9. Testing Strategy

### 9.1 Unit Tests

- [ ] Write unit tests for all services
- [ ] Write unit tests for all repositories
- [ ] Write unit tests for all controllers
- [ ] Write unit tests for all utilities
- [ ] Achieve 80%+ code coverage

### 9.2 Integration Tests

- [ ] Write integration tests for all APIs
- [ ] Write integration tests for WebSocket events
- [ ] Write integration tests for database operations
- [ ] Write integration tests for Redis operations

### 9.3 End-to-End Tests

- [ ] Write E2E tests for user flows:
  - Registration → Login → Hero Selection → Matchmaking → Arena Selection → Weapon Selection → Gameplay → Post-Match
- [ ] Write E2E tests for error scenarios
- [ ] Write E2E tests for edge cases

### 9.4 Performance Tests

- [ ] Write performance tests for matchmaking
- [ ] Write performance tests for game engine
- [ ] Write performance tests for database queries
- [ ] Write performance tests for Redis operations

---

## 10. Documentation Updates

### 10.1 Code Documentation

- [ ] Add JavaDoc comments to all Java classes
- [ ] Add JSDoc comments to all JavaScript classes
- [ ] Add inline comments for complex logic
- [ ] Update README files for each service

### 10.2 API Documentation

- [ ] Update API documentation (Swagger/OpenAPI)
- [ ] Document all REST endpoints
- [ ] Document all WebSocket events
- [ ] Document request/response formats
- [ ] Document error codes and messages

### 10.3 Architecture Documentation

- [ ] Update architecture diagrams if needed
- [ ] Update sequence diagrams if needed
- [ ] Update class diagrams if needed
- [ ] Update deployment diagrams if needed

---

## 11. Deployment Strategy

### 11.1 Docker Configuration

- [ ] Update Dockerfiles for all services
- [ ] Update docker-compose.yml
- [ ] Test Docker builds
- [ ] Test Docker deployments

### 11.2 Environment Configuration

- [ ] Create environment configuration files
- [ ] Document environment variables
- [ ] Create .env.example files
- [ ] Update deployment documentation

### 11.3 CI/CD Pipeline

- [ ] Update CI/CD pipeline for new services
- [ ] Add tests to CI/CD pipeline
- [ ] Add deployment to CI/CD pipeline
- [ ] Test CI/CD pipeline

---

## 12. Risk Mitigation

### 12.1 Technical Risks

- **Risk:** Breaking existing functionality during refactoring
  - **Mitigation:** Write tests before refactoring, use feature branches, incremental changes

- **Risk:** Database migration issues
  - **Mitigation:** Create migration scripts, test migrations, backup database

- **Risk:** Performance issues with new architecture
  - **Mitigation:** Performance testing, load testing, optimization

### 12.2 Schedule Risks

- **Risk:** Delays in implementation
  - **Mitigation:** Prioritize features, incremental delivery, regular reviews

- **Risk:** Scope creep
  - **Mitigation:** Stick to documented architecture, regular reviews, change management

### 12.3 Team Risks

- **Risk:** Knowledge gaps
  - **Mitigation:** Training, documentation, code reviews, pair programming

---

## 13. Success Criteria

### 13.1 Phase 1 Success Criteria

- ✅ All package names fixed
- ✅ All folder structures cleaned up
- ✅ User model updated
- ✅ Docker compose updated
- ✅ Base classes created

### 13.2 Phase 2 Success Criteria

- ✅ All data models created
- ✅ All repositories created
- ✅ All indexes created
- ✅ Migration scripts created and tested

### 13.3 Phase 3 Success Criteria

- ✅ Configuration Service created
- ✅ Configuration models created
- ✅ Configuration Manager implemented
- ✅ Redis caching implemented
- ✅ Docker configuration updated

### 13.4 Phase 4 Success Criteria

- ✅ All services refactored to follow LLD
- ✅ All design patterns implemented
- ✅ All DTOs created
- ✅ All validation implemented
- ✅ All error handling implemented

### 13.5 Phase 5 Success Criteria

- ✅ Hero selection system implemented
- ✅ Arena selection system implemented
- ✅ Weapon selection system implemented
- ✅ Turn management system implemented
- ✅ Movement system implemented
- ✅ Scoring system implemented
- ✅ Win/draw conditions implemented
- ✅ Weapon synergies implemented

### 13.6 Phase 6 Success Criteria

- ✅ Frontend services updated
- ✅ Frontend components updated
- ✅ Frontend routes updated
- ✅ End-to-end testing completed
- ✅ Documentation updated

---

## 14. Timeline

### Week 1: Foundation
- Phase 1: Fix package names, folder structure, basic models

### Week 2: Data Models
- Phase 2: Create all data models (Hero, Weapon, Arena, updated Profile, Match, Leaderboard)

### Week 3: Configuration Service
- Phase 3: Create Configuration Service

### Week 4-5: Service Refactoring
- Phase 4: Refactor existing services to follow LLD

### Week 6-8: Game Features
- Phase 5: Implement game features (hero selection, arena selection, weapon selection, turn management, movement, scoring)

### Week 9-10: Frontend Integration
- Phase 6: Update frontend to use new backend APIs

### Week 11: Testing and Documentation
- Testing: Unit tests, integration tests, E2E tests
- Documentation: Code documentation, API documentation, architecture documentation

### Week 12: Deployment and Review
- Deployment: Docker configuration, environment configuration, CI/CD pipeline
- Review: Code review, architecture review, performance review

---

## 15. Next Steps

### Immediate Actions (This Week)

1. **Review this document** with the team
2. **Create feature branches** for Phase 1
3. **Start Phase 1** - Fix package names and folder structure
4. **Set up project management** - Create tasks, assign owners, set deadlines
5. **Schedule regular reviews** - Weekly progress reviews, daily standups

### Short-term Actions (Next 2 Weeks)

1. **Complete Phase 1** - Foundation
2. **Start Phase 2** - Data Models
3. **Set up testing framework** - Unit tests, integration tests
4. **Update documentation** - As we refactor

### Long-term Actions (Next 3 Months)

1. **Complete all phases** - Phases 1-6
2. **Complete testing** - Unit tests, integration tests, E2E tests
3. **Complete documentation** - Code documentation, API documentation
4. **Deploy to production** - Docker configuration, CI/CD pipeline

---

## 16. Conclusion

This migration and refactoring plan provides a comprehensive roadmap to align the current implementation with the documented architecture. By following this phased approach, we can:

1. **Minimize risk** - Incremental changes, backward compatibility
2. **Ensure quality** - Testing, code reviews, documentation
3. **Maintain progress** - Regular reviews, clear milestones
4. **Achieve goals** - Align with architecture, implement all features

**Remember:** This is a living document. Update it as we progress through the refactoring phases.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Active - Implementation Guide  
**Next Review:** Weekly

