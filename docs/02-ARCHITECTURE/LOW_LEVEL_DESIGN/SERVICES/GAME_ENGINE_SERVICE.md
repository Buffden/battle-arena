# Game Engine Service - Low-Level Design (LLD)

**Part of:** [Low-Level Design (LLD)](../README.md)  
**Service:** Game Engine Service (Node.js)  
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

## 1. Service Overview

### 1.1 Responsibilities
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

### 1.2 Key Components
- **GameEngineController** - WebSocket event handler (Facade Pattern)
- **GameEngine** - Main game engine orchestration (Facade Pattern)
- **GameRoomManager** - Game room management (Factory Pattern)
- **TurnManager** - Turn management (State Pattern)
- **MovementManager** - Movement system (Command Pattern)
- **PhysicsEngine** - Physics calculations (Strategy Pattern, Adapter Pattern)
- **ScoringSystem** - Scoring system (Strategy Pattern, Decorator Pattern)
- **HealthSystem** - Health system (Strategy Pattern)
- **WinConditionChecker** - Win condition detection (Strategy Pattern)
- **WeaponSynergySystem** - Weapon synergy system (Strategy Pattern)
- **MatchResultProcessor** - Match result processing (Template Method Pattern)

### 1.3 Design Patterns Applied
- **Facade Pattern** - GameEngineController, GameEngine
- **Strategy Pattern** - PhysicsStrategy, ScoringStrategy, WinConditionStrategy, WeaponSynergyStrategy
- **State Pattern** - GameState, TurnState
- **Command Pattern** - MoveCommand, FireCommand, ActionCommand
- **Observer Pattern** - GameStateObserver, TurnObserver
- **Template Method Pattern** - MatchResultProcessor
- **Factory Pattern** - GameRoomFactory, GameStateFactory
- **Adapter Pattern** - MatterJsAdapter (Matter.js physics engine)
- **Decorator Pattern** - ScoringDecorator (score modifiers)
- **Singleton Pattern** - ConfigurationManager

---

## 2. UML Class Diagram

**See:** [Game Engine Service Class Diagram](../../../03-DIAGRAMS/class-diagrams/game-engine-service.puml)

### 2.1 Class Relationships

```
GameEngineController
    ├── depends on → GameEngine
    └── depends on → GameRoomManager

GameEngine
    ├── depends on → GameRoomManager
    ├── depends on → TurnManager
    ├── depends on → MovementManager
    ├── depends on → PhysicsEngine
    ├── depends on → ScoringSystem
    ├── depends on → HealthSystem
    ├── depends on → WinConditionChecker
    ├── depends on → WeaponSynergySystem
    └── depends on → MatchResultProcessor

GameRoomManager
    ├── depends on → RedisClient
    ├── depends on → GameRoomFactory
    └── depends on → GameStateCache

TurnManager
    ├── depends on → TurnState
    ├── depends on → TurnTimer
    └── depends on → ConfigurationManager

MovementManager
    ├── depends on → MovementValidator
    ├── depends on → MovementCalculator
    └── depends on → ScoringSystem

PhysicsEngine
    ├── depends on → Matter.Engine
    ├── depends on → PhysicsStrategy
    └── depends on → ConfigurationManager

ScoringSystem
    ├── depends on → ScoringStrategy
    ├── depends on → ScoreCalculator
    └── depends on → ConfigurationManager

HealthSystem
    ├── depends on → HealthCalculator
    └── depends on → ConfigurationManager

WinConditionChecker
    ├── depends on → WinConditionStrategy
    ├── depends on → HealthSystem
    └── depends on → ScoringSystem

WeaponSynergySystem
    ├── depends on → WeaponSynergyStrategy
    └── depends on → ConfigurationManager

MatchResultProcessor
    ├── depends on → MatchRepository
    ├── depends on → ProfileServiceClient
    └── depends on → LeaderboardServiceClient

GameState
    └── manages → Game state

TurnState
    └── manages → Turn state
```

---

## 3. Class Responsibilities (C4 Code Level)

### 3.1 GameEngineController
**Role:** Facade for game engine operations  
**Responsibilities:**
- Handle WebSocket events for game operations
- Validate event data
- Delegate business logic to GameEngine
- Emit WebSocket events to clients
- Handle exceptions and errors

**Dependencies:**
- GameEngine (business logic)
- GameRoomManager (game room management)

**Collaborations:**
- Receives WebSocket events from clients
- Delegates to GameEngine
- Emits events to clients

### 3.2 GameEngine
**Role:** Main game engine orchestration  
**Responsibilities:**
- Orchestrate game operations
- Coordinate game room management
- Coordinate turn management
- Coordinate movement system
- Coordinate physics engine
- Coordinate scoring system
- Coordinate health system
- Coordinate win condition checking
- Coordinate weapon synergy system
- Coordinate match result processing

**Dependencies:**
- GameRoomManager (game room management)
- TurnManager (turn management)
- MovementManager (movement system)
- PhysicsEngine (physics calculations)
- ScoringSystem (scoring system)
- HealthSystem (health system)
- WinConditionChecker (win condition detection)
- WeaponSynergySystem (weapon synergy system)
- MatchResultProcessor (match result processing)

**Collaborations:**
- Uses GameRoomManager for game room operations
- Uses TurnManager for turn operations
- Uses MovementManager for movement operations
- Uses PhysicsEngine for physics calculations
- Uses ScoringSystem for score calculations
- Uses HealthSystem for health management
- Uses WinConditionChecker for win condition detection
- Uses WeaponSynergySystem for weapon synergy
- Uses MatchResultProcessor for match result processing

### 3.3 GameRoomManager
**Role:** Game room management orchestrator  
**Responsibilities:**
- Create game rooms
- Get game rooms
- Get game state
- Update game state
- Delete game rooms
- Manage game room state

**Dependencies:**
- RedisClient (game state cache)
- GameRoomFactory (game room creation)
- GameStateCache (game state caching)

**Collaborations:**
- Used by GameEngine for game room operations
- Uses GameRoomFactory for game room creation
- Interacts with Redis for game state caching

### 3.4 TurnManager
**Role:** Turn management orchestrator  
**Responsibilities:**
- Start turns
- End turns
- Get current turn
- Check if turn is expired
- Handle turn timeout
- Check if match should end

**Dependencies:**
- TurnState (turn state management)
- TurnTimer (turn timer management)
- ConfigurationManager (configuration)

**Collaborations:**
- Used by GameEngine for turn operations
- Uses TurnState for turn state management
- Uses TurnTimer for turn timer management

### 3.5 MovementManager
**Role:** Movement system orchestrator  
**Responsibilities:**
- Move players
- Check if player can move
- Get remaining moves
- Calculate movement score (repositioning save)
- Validate movement
- Process movement

**Dependencies:**
- MovementValidator (movement validation)
- MovementCalculator (movement calculation)
- ScoringSystem (scoring for repositioning saves)

**Collaborations:**
- Used by GameEngine for movement operations
- Uses MovementValidator for movement validation
- Uses MovementCalculator for movement calculation
- Uses ScoringSystem for movement scoring

### 3.6 PhysicsEngine
**Role:** Physics calculations orchestrator  
**Responsibilities:**
- Calculate projectile trajectories
- Calculate projectile impact
- Get arena gravity
- Apply physics calculations
- Manage physics engine

**Dependencies:**
- Matter.Engine (Matter.js physics engine)
- PhysicsStrategy (physics calculation strategy)
- ConfigurationManager (configuration)

**Collaborations:**
- Used by GameEngine for physics calculations
- Uses Matter.Engine for physics engine
- Uses PhysicsStrategy for physics calculation strategy

### 3.7 ScoringSystem
**Role:** Scoring system orchestrator  
**Responsibilities:**
- Calculate accuracy score
- Calculate back-to-back hit bonus
- Calculate repositioning save score
- Calculate total score for action
- Apply scoring strategies
- Apply score modifiers (decorators)

**Dependencies:**
- ScoringStrategy (scoring strategy)
- ScoreCalculator (score calculation)
- ConfigurationManager (configuration)

**Collaborations:**
- Used by GameEngine for score calculations
- Uses ScoringStrategy for scoring strategy
- Uses ScoreCalculator for score calculation

### 3.8 HealthSystem
**Role:** Health system orchestrator  
**Responsibilities:**
- Get starting HP for hero type
- Calculate damage
- Apply damage
- Check if player is dead
- Manage player health

**Dependencies:**
- HealthCalculator (health calculation)
- ConfigurationManager (configuration)

**Collaborations:**
- Used by GameEngine for health management
- Uses HealthCalculator for health calculation

### 3.9 WinConditionChecker
**Role:** Win condition detection orchestrator  
**Responsibilities:**
- Check win condition
- Check draw condition
- Determine winner at match end
- Apply win condition strategies

**Dependencies:**
- WinConditionStrategy (win condition strategy)
- HealthSystem (health system)
- ScoringSystem (scoring system)

**Collaborations:**
- Used by GameEngine for win condition detection
- Uses WinConditionStrategy for win condition strategy
- Uses HealthSystem for health checks
- Uses ScoringSystem for score checks

### 3.10 WeaponSynergySystem
**Role:** Weapon synergy system orchestrator  
**Responsibilities:**
- Check for weapon synergy
- Apply weapon synergy
- Manage weapon synergy effects
- Apply weapon synergy strategies

**Dependencies:**
- WeaponSynergyStrategy (weapon synergy strategy)
- ConfigurationManager (configuration)

**Collaborations:**
- Used by GameEngine for weapon synergy
- Uses WeaponSynergyStrategy for weapon synergy strategy

### 3.11 MatchResultProcessor
**Role:** Match result processing orchestrator  
**Responsibilities:**
- Process match result
- Save match to database
- Update player profiles
- Update leaderboard
- Manage match result processing

**Dependencies:**
- MatchRepository (match data access)
- ProfileServiceClient (profile service client)
- LeaderboardServiceClient (leaderboard service client)

**Collaborations:**
- Used by GameEngine for match result processing
- Uses MatchRepository for match data access
- Uses ProfileServiceClient for profile updates
- Uses LeaderboardServiceClient for leaderboard updates

### 3.12 GameState
**Role:** Game state manager  
**Responsibilities:**
- Manage game state
- Track game state data
- Update game state
- Get game state snapshot
- Manage game state transitions

**Dependencies:**
- Game configuration (game setup data)

**Collaborations:**
- Used by GameRoomManager for game state management
- Used by GameEngine for game state operations

### 3.13 TurnState
**Role:** Turn state manager  
**Responsibilities:**
- Manage turn state
- Track turn data
- Check if turn is expired
- Get remaining time
- Manage turn state transitions

**Dependencies:**
- Turn configuration (turn setup data)

**Collaborations:**
- Used by TurnManager for turn state management
- Used by GameEngine for turn operations

---

## 4. Design Pattern Applications

### 4.1 Facade Pattern - GameEngineController
**Pattern:** Facade Pattern  
**Intent:** Provide a unified interface to a set of interfaces in a subsystem  
**Participants:**
- **Facade:** GameEngineController
- **Subsystem Classes:** GameEngine, GameRoomManager

**Why:** Simplifies client interaction with game engine subsystem  
**Consequences:**
- ✅ Simplifies client interface
- ✅ Decouples clients from subsystem
- ❌ May reduce flexibility

### 4.2 Strategy Pattern - PhysicsStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** PhysicsStrategy (interface)
- **ConcreteStrategy:** MatterJsPhysicsStrategy
- **Context:** PhysicsEngine

**Why:** Allows different physics calculation strategies without changing PhysicsEngine  
**Consequences:**
- ✅ Flexibility in physics calculation strategies
- ✅ Easy to add new physics strategies
- ❌ Increased number of classes

### 4.3 Strategy Pattern - ScoringStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** ScoringStrategy (interface)
- **ConcreteStrategy:** AccuracyScoringStrategy, BackToBackScoringStrategy, RepositioningSaveScoringStrategy
- **Context:** ScoringSystem

**Why:** Allows different scoring strategies without changing ScoringSystem  
**Consequences:**
- ✅ Flexibility in scoring strategies
- ✅ Easy to add new scoring strategies
- ❌ Increased number of classes

### 4.4 State Pattern - GameState
**Pattern:** State Pattern  
**Intent:** Allow an object to alter its behavior when its internal state changes  
**Participants:**
- **Context:** GameEngine
- **State:** GameState
- **ConcreteState:** WaitingState, PlayingState, PausedState, EndedState

**Why:** Manages game state transitions  
**Consequences:**
- ✅ Encapsulates state-specific behavior
- ✅ Makes state transitions explicit
- ✅ Easy to add new states
- ❌ Increased number of classes

### 4.5 State Pattern - TurnState
**Pattern:** State Pattern  
**Intent:** Allow an object to alter its behavior when its internal state changes  
**Participants:**
- **Context:** TurnManager
- **State:** TurnState
- **ConcreteState:** ActiveState, ExpiredState, CompletedState

**Why:** Manages turn state transitions  
**Consequences:**
- ✅ Encapsulates state-specific behavior
- ✅ Makes state transitions explicit
- ✅ Easy to add new states
- ❌ Increased number of classes

### 4.6 Command Pattern - MoveCommand
**Pattern:** Command Pattern  
**Intent:** Encapsulate a request as an object, thereby letting you parameterize clients with different requests  
**Participants:**
- **Command:** MoveCommand
- **Receiver:** MovementManager
- **Invoker:** GameEngineController

**Why:** Encapsulates movement operations as commands  
**Consequences:**
- ✅ Encapsulates requests as objects
- ✅ Supports undo operations (future enhancement)
- ✅ Supports logging and queuing
- ❌ Increased number of classes

### 4.7 Observer Pattern - GameStateObserver
**Pattern:** Observer Pattern  
**Intent:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified  
**Participants:**
- **Subject:** GameEngine
- **Observer:** GameStateObserver
- **ConcreteObserver:** GameStateNotificationObserver

**Why:** Notifies clients about game state changes  
**Consequences:**
- ✅ Decouples subject from observers
- ✅ Supports broadcast communication
- ✅ Easy to add new observers
- ❌ May cause performance issues with many observers

### 4.8 Template Method Pattern - MatchResultProcessor
**Pattern:** Template Method Pattern  
**Intent:** Define the skeleton of an algorithm in an operation, deferring some steps to subclasses  
**Participants:**
- **AbstractClass:** MatchResultProcessor
- **ConcreteClass:** DefaultMatchResultProcessor

**Why:** Defines the algorithm skeleton for match result processing  
**Consequences:**
- ✅ Code reuse
- ✅ Consistent algorithm structure
- ✅ Easy to extend algorithm
- ❌ May limit flexibility

### 4.9 Factory Pattern - GameRoomFactory
**Pattern:** Factory Pattern  
**Intent:** Define an interface for creating an object, but let subclasses decide which class to instantiate  
**Participants:**
- **Factory:** GameRoomFactory
- **Product:** GameRoom

**Why:** Encapsulates game room creation logic  
**Consequences:**
- ✅ Encapsulates object creation
- ✅ Provides flexibility in object creation
- ✅ Reduces coupling
- ❌ Increased number of classes

### 4.10 Adapter Pattern - MatterJsAdapter
**Pattern:** Adapter Pattern  
**Intent:** Convert the interface of a class into another interface clients expect  
**Participants:**
- **Target:** PhysicsEngine
- **Adaptee:** Matter.Engine
- **Adapter:** MatterJsAdapter

**Why:** Adapts Matter.js physics engine to PhysicsEngine interface  
**Consequences:**
- ✅ Allows incompatible interfaces to work together
- ✅ Decouples client from adaptee
- ✅ Easy to swap physics engines
- ❌ Increased complexity

### 4.11 Decorator Pattern - ScoringDecorator
**Pattern:** Decorator Pattern  
**Intent:** Attach additional responsibilities to an object dynamically  
**Participants:**
- **Component:** ScoreCalculator
- **Decorator:** ScoringDecorator
- **ConcreteDecorator:** BackToBackScoringDecorator, RepositioningSaveScoringDecorator

**Why:** Adds scoring modifiers dynamically  
**Consequences:**
- ✅ Adds responsibilities dynamically
- ✅ Flexible combination of features
- ✅ Easy to add new decorators
- ❌ Increased complexity

---

## 5. Method Signatures (Not Implementations)

### 5.1 GameEngineController
```typescript
// Responsibilities: Handle WebSocket events for game operations
export class GameEngineController {
    // Handle game start event
    handleGameStart(socket: Socket, data: GameStartData): void;
    
    // Handle player action event
    handlePlayerAction(socket: Socket, data: PlayerActionData): void;
    
    // Handle player move event
    handlePlayerMove(socket: Socket, data: PlayerMoveData): void;
    
    // Handle player fire event
    handlePlayerFire(socket: Socket, data: PlayerFireData): void;
    
    // Handle player disconnect
    handlePlayerDisconnect(socket: Socket): void;
    
    // Handle player reconnect
    handlePlayerReconnect(socket: Socket, data: ReconnectData): void;
}
```

### 5.2 GameEngine
```typescript
// Responsibilities: Orchestrate game operations
export class GameEngine {
    // Start game
    startGame(matchId: string, gameConfig: GameConfig): Promise<GameState>;
    
    // Process player action
    processPlayerAction(matchId: string, playerId: string, action: GameAction): Promise<GameState>;
    
    // End game
    endGame(matchId: string): Promise<MatchResult>;
}
```

### 5.3 GameRoomManager
```typescript
// Responsibilities: Manage game rooms
export class GameRoomManager {
    // Create game room
    createGameRoom(matchId: string, gameConfig: GameConfig): Promise<GameRoom>;
    
    // Get game room
    getGameRoom(matchId: string): Promise<GameRoom | null>;
    
    // Get game state
    getGameState(matchId: string): Promise<GameState | null>;
    
    // Update game state
    updateGameState(matchId: string, gameState: GameState): Promise<void>;
    
    // Delete game room
    deleteGameRoom(matchId: string): Promise<void>;
}
```

### 5.4 TurnManager
```typescript
// Responsibilities: Manage turn-based gameplay
export class TurnManager {
    // Start turn
    startTurn(matchId: string, playerId: string): Promise<TurnState>;
    
    // End turn
    endTurn(matchId: string): Promise<TurnState>;
    
    // Get current turn
    getCurrentTurn(matchId: string): Promise<TurnState | null>;
    
    // Check if turn is expired
    isTurnExpired(matchId: string): Promise<boolean>;
    
    // Handle turn timeout
    handleTurnTimeout(matchId: string): Promise<TurnState>;
    
    // Check if match should end
    shouldEndMatch(matchId: string): Promise<boolean>;
}
```

### 5.5 MovementManager
```typescript
// Responsibilities: Manage player movement
export class MovementManager {
    // Move player
    movePlayer(matchId: string, playerId: string, direction: 'left' | 'right'): Promise<MovementResult>;
    
    // Check if player can move
    canMove(matchId: string, playerId: string): Promise<boolean>;
    
    // Get remaining moves
    getRemainingMoves(matchId: string, playerId: string): Promise<number>;
    
    // Calculate movement score (repositioning save)
    calculateMovementScore(matchId: string, playerId: string, enemyShot: ShotData): Promise<number>;
}
```

### 5.6 PhysicsEngine
```typescript
// Responsibilities: Physics calculations using Matter.js
export class PhysicsEngine {
    // Calculate projectile trajectory
    calculateTrajectory(weaponId: string, angle: number, power: number, arenaId: string, startPosition: Position): Promise<ProjectileTrajectory>;
    
    // Calculate projectile impact
    calculateImpact(trajectory: ProjectileTrajectory, targetPosition: Position): Promise<ImpactResult>;
    
    // Get arena gravity
    getArenaGravity(arenaId: string): Promise<number>;
}
```

### 5.7 ScoringSystem
```typescript
// Responsibilities: Calculate scores
export class ScoringSystem {
    // Calculate accuracy score
    calculateAccuracyScore(hitArea: number, maxHitArea: number): number;
    
    // Calculate back-to-back hit bonus
    calculateBackToBackBonus(matchId: string, playerId: string): Promise<number>;
    
    // Calculate repositioning save score
    calculateRepositioningSaveScore(matchId: string, playerId: string, enemyShot: ShotData): Promise<number>;
    
    // Calculate total score for action
    calculateTotalScore(matchId: string, playerId: string, action: GameAction): Promise<number>;
}
```

### 5.8 HealthSystem
```typescript
// Responsibilities: Manage player health
export class HealthSystem {
    // Get starting HP for hero type
    getStartingHP(heroType: string): Promise<number>;
    
    // Calculate damage
    calculateDamage(weaponId: string, accuracy: number): Promise<number>;
    
    // Apply damage
    applyDamage(matchId: string, playerId: string, damage: number): Promise<HealthUpdate>;
    
    // Check if player is dead
    isPlayerDead(matchId: string, playerId: string): Promise<boolean>;
}
```

### 5.9 WinConditionChecker
```typescript
// Responsibilities: Check win conditions
export class WinConditionChecker {
    // Check win condition
    checkWinCondition(matchId: string): Promise<WinConditionResult>;
    
    // Check draw condition
    checkDrawCondition(matchId: string): Promise<boolean>;
    
    // Determine winner at match end
    determineWinner(matchId: string): Promise<string | null>;
}
```

### 5.10 WeaponSynergySystem
```typescript
// Responsibilities: Handle weapon synergies
export class WeaponSynergySystem {
    // Check for weapon synergy
    checkWeaponSynergy(matchId: string, playerId: string, weaponId: string): Promise<WeaponSynergyResult | null>;
    
    // Apply weapon synergy
    applyWeaponSynergy(matchId: string, playerId: string, synergyResult: WeaponSynergyResult): Promise<SynergyEffect>;
}
```

### 5.11 MatchResultProcessor
```typescript
// Responsibilities: Process match results
export class MatchResultProcessor {
    // Process match result
    processMatchResult(matchId: string, matchResult: MatchResult): Promise<void>;
}
```

### 5.12 GameState
```typescript
// Responsibilities: Manage game state
export class GameState {
    // Update game state
    update(updates: Partial<GameState>): void;
    
    // Get game state snapshot
    getSnapshot(): GameStateSnapshot;
}
```

### 5.13 TurnState
```typescript
// Responsibilities: Manage turn state
export class TurnState {
    // Check if turn is expired
    isExpired(): boolean;
    
    // Get remaining time
    getRemainingTime(): number;
}
```

---

## 6. Class Relationships

### 6.1 Inheritance
- **MatterJsPhysicsStrategy** implements **PhysicsStrategy**
- **AccuracyScoringStrategy**, **BackToBackScoringStrategy**, **RepositioningSaveScoringStrategy** implement **ScoringStrategy**
- **DefaultWinConditionStrategy** implements **WinConditionStrategy**
- **DefaultWeaponSynergyStrategy** implements **WeaponSynergyStrategy**

### 6.2 Composition
- **GameEngineController** contains **GameEngine** and **GameRoomManager**
- **GameEngine** contains **GameRoomManager**, **TurnManager**, **MovementManager**, **PhysicsEngine**, **ScoringSystem**, **HealthSystem**, **WinConditionChecker**, **WeaponSynergySystem**, **MatchResultProcessor**
- **TurnManager** contains **TurnState** and **TurnTimer**
- **MovementManager** contains **MovementValidator** and **MovementCalculator**
- **PhysicsEngine** contains **Matter.Engine** and **PhysicsStrategy**
- **ScoringSystem** contains **ScoringStrategy** and **ScoreCalculator**
- **HealthSystem** contains **HealthCalculator**
- **WinConditionChecker** contains **WinConditionStrategy**
- **WeaponSynergySystem** contains **WeaponSynergyStrategy**

### 6.3 Aggregation
- **GameRoomManager** aggregates **GameRoom** entities (via GameRoomFactory)
- **MatchResultProcessor** aggregates **MatchResult** entities

### 6.4 Dependency
- **GameEngineController** depends on **GameEngine** and **GameRoomManager**
- **GameEngine** depends on **GameRoomManager**, **TurnManager**, **MovementManager**, **PhysicsEngine**, **ScoringSystem**, **HealthSystem**, **WinConditionChecker**, **WeaponSynergySystem**, **MatchResultProcessor**
- **GameRoomManager** depends on **RedisClient**, **GameRoomFactory**, **GameStateCache**
- **TurnManager** depends on **TurnState**, **TurnTimer**, **ConfigurationManager**
- **MovementManager** depends on **MovementValidator**, **MovementCalculator**, **ScoringSystem**
- **PhysicsEngine** depends on **Matter.Engine**, **PhysicsStrategy**, **ConfigurationManager**
- **ScoringSystem** depends on **ScoringStrategy**, **ScoreCalculator**, **ConfigurationManager**
- **HealthSystem** depends on **HealthCalculator**, **ConfigurationManager**
- **WinConditionChecker** depends on **WinConditionStrategy**, **HealthSystem**, **ScoringSystem**
- **WeaponSynergySystem** depends on **WeaponSynergyStrategy**, **ConfigurationManager**
- **MatchResultProcessor** depends on **MatchRepository**, **ProfileServiceClient**, **LeaderboardServiceClient**

---

## 7. Sequence Diagrams

**See:** [Gameplay Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/gameplay-flow.puml)  
**See:** [Movement Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/movement-flow.puml)  
**See:** [Post-Match Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/post-match-flow.puml)

### 7.1 Game Start Flow
```
Client → GameEngineController → GameEngine → GameRoomManager → GameRoomFactory
                                                              ↓
                                                        GameState
                                                              ↓
                                                        Redis (state cache)
                                                              ↓
                                                        GameEngine → GameEngineController → Client
```

### 7.2 Player Action Flow
```
Client → GameEngineController → GameEngine → MovementManager (if move)
                                                      ↓
                                                TurnManager
                                                      ↓
                                                PhysicsEngine
                                                      ↓
                                                HealthSystem
                                                      ↓
                                                ScoringSystem
                                                      ↓
                                                WinConditionChecker
                                                      ↓
                                                GameRoomManager → Redis
                                                      ↓
                                                GameEngine → GameEngineController → Client
```

### 7.3 Match End Flow
```
GameEngine → WinConditionChecker → MatchResultProcessor → MatchRepository → MongoDB
                                                          ↓
                                                    ProfileServiceClient
                                                          ↓
                                                    LeaderboardServiceClient
                                                          ↓
                                                    GameEngine → GameEngineController → Client
```

---

## 8. State Diagrams

**See:** [Game State Diagram](../../../03-DIAGRAMS/state-diagrams/game-state.puml)  
**See:** [Turn State Diagram](../../../03-DIAGRAMS/state-diagrams/turn-state.puml)

### 8.1 Game State Machine
```
WAITING → (game start) → PLAYING
PLAYING → (pause) → PAUSED
PAUSED → (resume) → PLAYING
PLAYING → (match end) → ENDED
```

### 8.2 Turn State Machine
```
ACTIVE → (action received) → PROCESSING
PROCESSING → (action completed) → COMPLETED
COMPLETED → (next turn) → ACTIVE
ACTIVE → (timeout) → EXPIRED
EXPIRED → (auto-end) → COMPLETED
```

---

## 9. Related Documentation

- [High-Level Design - Component Design](../../HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Component specifications
- [High-Level Design - Data Flow](../../HIGH_LEVEL_DESIGN/04-DATA_FLOW.md) - Data flow diagrams
- [High-Level Design - Database Design](../../HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Database schema
- [Error Handling](../COMMON/ERROR_HANDLING.md) - Error handling patterns
- [Testing Strategy](../COMMON/TESTING_STRATEGY.md) - Testing approach
- [Class Diagram](../../../03-DIAGRAMS/class-diagrams/game-engine-service.puml) - UML class diagram

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** System Architecture Team
- **Reviewer:** Technical Lead
- **Status:** Design-Focused (Restructured)
- **Next Review Date:** After implementation phase

---

**⚠️ REMINDER: This is DESIGN, not IMPLEMENTATION - Focus on Roles, Responsibilities, Relationships, and Patterns**
