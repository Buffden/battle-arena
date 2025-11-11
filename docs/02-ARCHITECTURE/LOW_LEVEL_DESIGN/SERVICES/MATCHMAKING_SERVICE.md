# Matchmaking Service - Low-Level Design (LLD)

**Part of:** [Low-Level Design (LLD)](../README.md)  
**Service:** Matchmaking Service (Node.js)  
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
- Hero selection management (multiple hero selection, hero matching, hero assignment)
- Player queue management
- Global score/rank-based matchmaking algorithm
- Queue expansion (after 5 minutes, widen score/rank range)
- Arena selection management (voting/elimination system)
- Weapon selection management (alternating selection, 30-second timer)
- Lobby creation and management
- Match acceptance handling
- Estimated wait time calculation
- Reconnection handling

### 1.2 Key Components
- **MatchmakingController** - WebSocket event handler (Facade Pattern)
- **MatchmakingService** - Main matchmaking service orchestration (Facade Pattern)
- **MatchmakingEngine** - Core matchmaking logic (Strategy Pattern)
- **QueueManager** - Queue management (Facade Pattern)
- **HeroSelector** - Hero selection (Strategy Pattern)
- **ArenaSelector** - Arena selection (State Pattern)
- **WeaponSelector** - Weapon selection (State Pattern)
- **LobbyManager** - Lobby management (Factory Pattern)

### 1.3 Design Patterns Applied
- **Facade Pattern** - MatchmakingController, MatchmakingService, QueueManager
- **Strategy Pattern** - MatchingStrategy, HeroSelectionStrategy
- **State Pattern** - ArenaSelectionState, WeaponSelectionState
- **Factory Pattern** - LobbyFactory, MatchFactory
- **Observer Pattern** - MatchObserver, QueueObserver
- **Command Pattern** - JoinQueueCommand, LeaveQueueCommand
- **Singleton Pattern** - ConfigurationManager

---

## 2. UML Class Diagram

**See:** [Matchmaking Service Class Diagram](../../../03-DIAGRAMS/class-diagrams/matchmaking-service.puml)

### 2.1 Class Relationships

```
MatchmakingController
    ├── depends on → MatchmakingService
    ├── depends on → HeroSelector
    ├── depends on → ArenaSelector
    └── depends on → WeaponSelector

MatchmakingService
    ├── depends on → MatchmakingEngine
    ├── depends on → QueueManager
    ├── depends on → LobbyManager
    ├── depends on → HeroSelector
    ├── depends on → ArenaSelector
    └── depends on → WeaponSelector

MatchmakingEngine
    ├── depends on → QueueManager
    ├── depends on → MatchingStrategy
    ├── depends on → HeroSelector
    └── depends on → ConfigurationManager

QueueManager
    ├── depends on → RedisClient
    └── depends on → ConfigurationManager

HeroSelector
    └── depends on → HeroSelectionStrategy

ArenaSelector
    ├── depends on → ArenaRepository
    ├── depends on → RedisClient
    └── depends on → ArenaSelectionState

WeaponSelector
    ├── depends on → WeaponRepository
    ├── depends on → RedisClient
    ├── depends on → WeaponSelectionState
    └── depends on → SelectionTimer

LobbyManager
    ├── depends on → RedisClient
    └── depends on → LobbyFactory

MatchingStrategy (interface)
    └── implemented by → ScoreBasedMatchingStrategy

HeroSelectionStrategy (interface)
    └── implemented by → RandomHeroSelectionStrategy

ArenaSelectionState
    └── manages → Arena selection state

WeaponSelectionState
    └── manages → Weapon selection state
```

---

## 3. Class Responsibilities (C4 Code Level)

### 3.1 MatchmakingController
**Role:** Facade for matchmaking operations  
**Responsibilities:**
- Handle WebSocket events for matchmaking
- Validate event data
- Delegate business logic to MatchmakingService
- Emit WebSocket events to clients
- Handle exceptions and errors

**Dependencies:**
- MatchmakingService (business logic)
- HeroSelector (hero selection)
- ArenaSelector (arena selection)
- WeaponSelector (weapon selection)

**Collaborations:**
- Receives WebSocket events from clients
- Delegates to MatchmakingService
- Emits events to clients

### 3.2 MatchmakingService
**Role:** Main matchmaking service orchestration  
**Responsibilities:**
- Orchestrate matchmaking operations
- Coordinate queue management
- Coordinate lobby management
- Coordinate hero selection
- Coordinate arena selection
- Coordinate weapon selection

**Dependencies:**
- MatchmakingEngine (matchmaking logic)
- QueueManager (queue management)
- LobbyManager (lobby management)
- HeroSelector (hero selection)
- ArenaSelector (arena selection)
- WeaponSelector (weapon selection)

**Collaborations:**
- Uses MatchmakingEngine for matchmaking
- Uses QueueManager for queue operations
- Uses LobbyManager for lobby operations
- Uses HeroSelector, ArenaSelector, WeaponSelector for selection operations

### 3.3 MatchmakingEngine
**Role:** Core matchmaking logic  
**Responsibilities:**
- Find matching players
- Calculate match scores
- Check hero compatibility
- Apply matching algorithms
- Manage matchmaking process

**Dependencies:**
- QueueManager (queue access)
- MatchingStrategy (matching algorithm)
- HeroSelector (hero selection)
- ConfigurationManager (configuration)

**Collaborations:**
- Uses QueueManager to access queue
- Uses MatchingStrategy for matching algorithm
- Uses HeroSelector for hero selection

### 3.4 QueueManager
**Role:** Queue management facade  
**Responsibilities:**
- Manage matchmaking queues in Redis
- Add players to queue
- Remove players from queue
- Get players from queue
- Expand queue range after timeout
- Calculate estimated wait time

**Dependencies:**
- RedisClient (Redis access)
- ConfigurationManager (configuration)

**Collaborations:**
- Used by MatchmakingEngine for queue operations
- Interacts with Redis for queue storage

### 3.5 HeroSelector
**Role:** Hero selection orchestrator  
**Responsibilities:**
- Select hero from matched heroes
- Get common heroes between players
- Apply hero selection strategies
- Manage hero selection process

**Dependencies:**
- HeroSelectionStrategy (selection algorithm)

**Collaborations:**
- Used by MatchmakingEngine for hero selection
- Uses HeroSelectionStrategy for selection algorithm

### 3.6 ArenaSelector
**Role:** Arena selection manager  
**Responsibilities:**
- Start arena selection
- Manage arena elimination
- Check arena selection completion
- Get selected arena
- Manage arena selection state

**Dependencies:**
- ArenaRepository (arena data)
- RedisClient (state storage)
- ArenaSelectionState (state management)

**Collaborations:**
- Used by MatchmakingService for arena selection
- Uses ArenaRepository for arena data
- Uses ArenaSelectionState for state management

### 3.7 WeaponSelector
**Role:** Weapon selection manager  
**Responsibilities:**
- Start weapon selection
- Manage weapon selection (alternating)
- Handle selection timeout
- Get selected weapons
- Manage weapon selection state

**Dependencies:**
- WeaponRepository (weapon data)
- RedisClient (state storage)
- WeaponSelectionState (state management)
- SelectionTimer (timer management)

**Collaborations:**
- Used by MatchmakingService for weapon selection
- Uses WeaponRepository for weapon data
- Uses WeaponSelectionState for state management
- Uses SelectionTimer for timer management

### 3.8 LobbyManager
**Role:** Lobby management orchestrator  
**Responsibilities:**
- Create lobbies
- Get lobbies
- Accept matches
- Reject matches
- Delete lobbies
- Manage lobby state

**Dependencies:**
- RedisClient (lobby storage)
- LobbyFactory (lobby creation)

**Collaborations:**
- Used by MatchmakingService for lobby operations
- Uses LobbyFactory for lobby creation
- Interacts with Redis for lobby storage

### 3.9 MatchingStrategy (Interface)
**Role:** Matching algorithm abstraction  
**Responsibilities:**
- Define matching algorithm interface
- Allow different matching strategies
- Provide flexibility in matching algorithms

**Implementations:**
- ScoreBasedMatchingStrategy (score-based matching)

**Collaborations:**
- Used by MatchmakingEngine for matching algorithms

### 3.10 HeroSelectionStrategy (Interface)
**Role:** Hero selection algorithm abstraction  
**Responsibilities:**
- Define hero selection algorithm interface
- Allow different hero selection strategies
- Provide flexibility in hero selection algorithms

**Implementations:**
- RandomHeroSelectionStrategy (random selection from common heroes)

**Collaborations:**
- Used by HeroSelector for hero selection algorithms

### 3.11 ArenaSelectionState
**Role:** Arena selection state manager  
**Responsibilities:**
- Manage arena selection state
- Track available arenas
- Track eliminated arenas
- Track selected arena
- Check selection completion

**Dependencies:**
- Arena data (available arenas)

**Collaborations:**
- Used by ArenaSelector for state management

### 3.12 WeaponSelectionState
**Role:** Weapon selection state manager  
**Responsibilities:**
- Manage weapon selection state
- Track player weapons
- Track current player
- Track selection timer
- Check selection completion

**Dependencies:**
- Weapon data (available weapons)
- Timer (selection timer)

**Collaborations:**
- Used by WeaponSelector for state management

---

## 4. Design Pattern Applications

### 4.1 Facade Pattern - MatchmakingController
**Pattern:** Facade Pattern  
**Intent:** Provide a unified interface to a set of interfaces in a subsystem  
**Participants:**
- **Facade:** MatchmakingController
- **Subsystem Classes:** MatchmakingService, HeroSelector, ArenaSelector, WeaponSelector

**Why:** Simplifies client interaction with matchmaking subsystem  
**Consequences:**
- ✅ Simplifies client interface
- ✅ Decouples clients from subsystem
- ❌ May reduce flexibility

### 4.2 Strategy Pattern - MatchingStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** MatchingStrategy (interface)
- **ConcreteStrategy:** ScoreBasedMatchingStrategy
- **Context:** MatchmakingEngine

**Why:** Allows different matching algorithms without changing MatchmakingEngine  
**Consequences:**
- ✅ Flexibility in matching algorithms
- ✅ Easy to add new matching strategies
- ❌ Increased number of classes

### 4.3 Strategy Pattern - HeroSelectionStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** HeroSelectionStrategy (interface)
- **ConcreteStrategy:** RandomHeroSelectionStrategy
- **Context:** HeroSelector

**Why:** Allows different hero selection algorithms without changing HeroSelector  
**Consequences:**
- ✅ Flexibility in hero selection algorithms
- ✅ Easy to add new hero selection strategies
- ❌ Increased number of classes

### 4.4 State Pattern - ArenaSelectionState
**Pattern:** State Pattern  
**Intent:** Allow an object to alter its behavior when its internal state changes  
**Participants:**
- **Context:** ArenaSelector
- **State:** ArenaSelectionState
- **ConcreteState:** InProgressState, CompletedState

**Why:** Manages arena selection state transitions  
**Consequences:**
- ✅ Encapsulates state-specific behavior
- ✅ Makes state transitions explicit
- ✅ Easy to add new states
- ❌ Increased number of classes

### 4.5 State Pattern - WeaponSelectionState
**Pattern:** State Pattern  
**Intent:** Allow an object to alter its behavior when its internal state changes  
**Participants:**
- **Context:** WeaponSelector
- **State:** WeaponSelectionState
- **ConcreteState:** InProgressState, CompletedState

**Why:** Manages weapon selection state transitions  
**Consequences:**
- ✅ Encapsulates state-specific behavior
- ✅ Makes state transitions explicit
- ✅ Easy to add new states
- ❌ Increased number of classes

### 4.6 Factory Pattern - LobbyFactory
**Pattern:** Factory Pattern  
**Intent:** Define an interface for creating an object, but let subclasses decide which class to instantiate  
**Participants:**
- **Factory:** LobbyFactory
- **Product:** Lobby

**Why:** Encapsulates lobby creation logic  
**Consequences:**
- ✅ Encapsulates object creation
- ✅ Provides flexibility in object creation
- ✅ Reduces coupling
- ❌ Increased number of classes

### 4.7 Observer Pattern - MatchObserver
**Pattern:** Observer Pattern  
**Intent:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified  
**Participants:**
- **Subject:** MatchmakingEngine
- **Observer:** MatchObserver
- **ConcreteObserver:** MatchNotificationObserver

**Why:** Notifies clients about match events  
**Consequences:**
- ✅ Decouples subject from observers
- ✅ Supports broadcast communication
- ✅ Easy to add new observers
- ❌ May cause performance issues with many observers

### 4.8 Command Pattern - JoinQueueCommand
**Pattern:** Command Pattern  
**Intent:** Encapsulate a request as an object, thereby letting you parameterize clients with different requests  
**Participants:**
- **Command:** JoinQueueCommand
- **Receiver:** QueueManager
- **Invoker:** MatchmakingController

**Why:** Encapsulates queue operations as commands  
**Consequences:**
- ✅ Encapsulates requests as objects
- ✅ Supports undo operations
- ✅ Supports logging and queuing
- ❌ Increased number of classes

---

## 5. Method Signatures (Not Implementations)

### 5.1 MatchmakingController
```typescript
// Responsibilities: Handle WebSocket events for matchmaking
export class MatchmakingController {
    // Handle join queue event
    handleJoinQueue(socket: Socket, data: { heroIds: string[] }): void;
    
    // Handle leave queue event
    handleLeaveQueue(socket: Socket): void;
    
    // Handle match acceptance
    handleMatchAccept(socket: Socket, data: { matchId: string }): void;
    
    // Handle match rejection
    handleMatchReject(socket: Socket, data: { matchId: string }): void;
    
    // Handle arena elimination
    handleArenaElimination(socket: Socket, data: { matchId: string, arenaId: string }): void;
    
    // Handle weapon selection
    handleWeaponSelection(socket: Socket, data: { matchId: string, weaponId: string }): void;
}
```

### 5.2 MatchmakingService
```typescript
// Responsibilities: Orchestrate matchmaking operations
export class MatchmakingService {
    // Join matchmaking queue
    joinQueue(playerId: string, heroIds: string[], socketId: string): Promise<QueueStatus>;
    
    // Leave matchmaking queue
    leaveQueue(playerId: string): Promise<void>;
    
    // Find match for player
    findMatch(playerId: string): Promise<Match | null>;
}
```

### 5.3 MatchmakingEngine
```typescript
// Responsibilities: Core matchmaking logic
export class MatchmakingEngine {
    // Find match for player
    findMatch(playerId: string): Promise<Match | null>;
}
```

### 5.4 QueueManager
```typescript
// Responsibilities: Manage matchmaking queues
export class QueueManager {
    // Add player to queue
    addToQueue(playerId: string, heroIds: string[], globalScore: number, socketId: string): Promise<void>;
    
    // Remove player from queue
    removeFromQueue(playerId: string): Promise<void>;
    
    // Get players in queue for hero type
    getPlayersInQueue(heroType: string, scoreRange: ScoreRange): Promise<QueueEntry[]>;
    
    // Expand queue range after timeout
    expandQueueRange(heroType: string, baseScore: number): Promise<ScoreRange>;
    
    // Calculate estimated wait time
    calculateEstimatedWaitTime(heroType: string, playerScore: number): Promise<number>;
}
```

### 5.5 HeroSelector
```typescript
// Responsibilities: Select hero from matched heroes
export class HeroSelector {
    // Select hero from matched heroes
    selectHero(player1Heroes: string[], player2Heroes: string[]): string;
    
    // Get common heroes
    getCommonHeroes(player1Heroes: string[], player2Heroes: string[]): string[];
}
```

### 5.6 ArenaSelector
```typescript
// Responsibilities: Manage arena selection
export class ArenaSelector {
    // Start arena selection
    startArenaSelection(matchId: string, heroType: string): Promise<ArenaSelectionState>;
    
    // Eliminate arena
    eliminateArena(matchId: string, arenaId: string, playerId: string): Promise<ArenaSelectionState>;
    
    // Get selected arena
    getSelectedArena(matchId: string): Promise<string | null>;
}
```

### 5.7 WeaponSelector
```typescript
// Responsibilities: Manage weapon selection
export class WeaponSelector {
    // Start weapon selection
    startWeaponSelection(matchId: string, heroType: string): Promise<WeaponSelectionState>;
    
    // Select weapon
    selectWeapon(matchId: string, weaponId: string, playerId: string): Promise<WeaponSelectionState>;
    
    // Get selected weapons
    getSelectedWeapons(matchId: string): Promise<WeaponSelection>;
    
    // Handle selection timeout
    handleSelectionTimeout(matchId: string, playerId: string): Promise<WeaponSelectionState>;
}
```

### 5.8 LobbyManager
```typescript
// Responsibilities: Manage match lobbies
export class LobbyManager {
    // Create lobby
    createLobby(player1Id: string, player2Id: string, assignedHero: string): Promise<Lobby>;
    
    // Get lobby
    getLobby(matchId: string): Promise<Lobby | null>;
    
    // Accept match
    acceptMatch(matchId: string, playerId: string): Promise<Lobby>;
    
    // Reject match
    rejectMatch(matchId: string, playerId: string): Promise<void>;
    
    // Delete lobby
    deleteLobby(matchId: string): Promise<void>;
}
```

### 5.9 MatchingStrategy (Interface)
```typescript
// Responsibilities: Define matching algorithm interface
export interface MatchingStrategy {
    // Find matching player
    findMatchingPlayer(playerId: string, queueEntries: QueueEntry[]): Promise<QueueEntry | null>;
}
```

### 5.10 HeroSelectionStrategy (Interface)
```typescript
// Responsibilities: Define hero selection algorithm interface
export interface HeroSelectionStrategy {
    // Select hero from matched heroes
    selectHero(player1Heroes: string[], player2Heroes: string[]): string;
}
```

### 5.11 ArenaSelectionState
```typescript
// Responsibilities: Manage arena selection state
export class ArenaSelectionState {
    // Eliminate arena
    eliminateArena(arenaId: string, playerId: string): void;
    
    // Check if selection is complete
    isSelectionComplete(): boolean;
    
    // Get remaining arena
    getRemainingArena(): string | null;
}
```

### 5.12 WeaponSelectionState
```typescript
// Responsibilities: Manage weapon selection state
export class WeaponSelectionState {
    // Select weapon
    selectWeapon(weaponId: string, playerId: string): void;
    
    // Switch current player
    switchPlayer(): void;
    
    // Check if selection is complete
    isSelectionComplete(): boolean;
    
    // Handle timeout
    handleTimeout(playerId: string): void;
}
```

---

## 6. Class Relationships

### 6.1 Inheritance
- **ScoreBasedMatchingStrategy** implements **MatchingStrategy**
- **RandomHeroSelectionStrategy** implements **HeroSelectionStrategy**

### 6.2 Composition
- **MatchmakingController** contains **MatchmakingService**, **HeroSelector**, **ArenaSelector**, **WeaponSelector**
- **MatchmakingService** contains **MatchmakingEngine**, **QueueManager**, **LobbyManager**, **HeroSelector**, **ArenaSelector**, **WeaponSelector**
- **MatchmakingEngine** contains **QueueManager**, **MatchingStrategy**, **HeroSelector**
- **HeroSelector** contains **HeroSelectionStrategy**
- **ArenaSelector** contains **ArenaSelectionState**
- **WeaponSelector** contains **WeaponSelectionState**

### 6.3 Aggregation
- **LobbyManager** aggregates **Lobby** entities (via LobbyFactory)

### 6.4 Dependency
- **MatchmakingController** depends on **MatchmakingService**, **HeroSelector**, **ArenaSelector**, **WeaponSelector**
- **MatchmakingService** depends on **MatchmakingEngine**, **QueueManager**, **LobbyManager**, **HeroSelector**, **ArenaSelector**, **WeaponSelector**
- **QueueManager** depends on **RedisClient** and **ConfigurationManager**
- **ArenaSelector** depends on **ArenaRepository**, **RedisClient**, **ArenaSelectionState**
- **WeaponSelector** depends on **WeaponRepository**, **RedisClient**, **WeaponSelectionState**, **SelectionTimer**

---

## 7. Sequence Diagrams

**See:** [Matchmaking Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml)  
**See:** [Hero Selection Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/hero-selection-flow.puml)  
**See:** [Arena Selection Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/arena-selection-flow.puml)  
**See:** [Weapon Selection Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/weapon-selection-flow.puml)

### 7.1 Matchmaking Flow
```
Client → MatchmakingController → MatchmakingService → MatchmakingEngine → QueueManager → Redis
                                                                          ↓
                                                                    MatchingStrategy
                                                                          ↓
                                                                    HeroSelector
                                                                          ↓
                                                                    LobbyManager → Redis
                                                                          ↓
                                                                    MatchmakingService → MatchmakingController → Client
```

### 7.2 Arena Selection Flow
```
Client → MatchmakingController → MatchmakingService → ArenaSelector → ArenaSelectionState
                                                                      ↓
                                                                ArenaRepository
                                                                      ↓
                                                                Redis (state storage)
                                                                      ↓
                                                                ArenaSelector → MatchmakingService → MatchmakingController → Client
```

### 7.3 Weapon Selection Flow
```
Client → MatchmakingController → MatchmakingService → WeaponSelector → WeaponSelectionState
                                                                      ↓
                                                                WeaponRepository
                                                                      ↓
                                                                SelectionTimer
                                                                      ↓
                                                                Redis (state storage)
                                                                      ↓
                                                                WeaponSelector → MatchmakingService → MatchmakingController → Client
```

---

## 8. State Diagrams

**See:** [Arena Selection State Diagram](../../../03-DIAGRAMS/state-diagrams/arena-selection-state.puml)  
**See:** [Weapon Selection State Diagram](../../../03-DIAGRAMS/state-diagrams/weapon-selection-state.puml)

### 8.1 Arena Selection State Machine
```
IN_PROGRESS → (arena eliminated) → IN_PROGRESS
IN_PROGRESS → (one arena remains) → COMPLETED
COMPLETED → (arena selected) → FINAL
```

### 8.2 Weapon Selection State Machine
```
IN_PROGRESS → (weapon selected) → IN_PROGRESS (switch player)
IN_PROGRESS → (10 weapons each) → COMPLETED
IN_PROGRESS → (timeout) → COMPLETED (random weapon)
COMPLETED → (weapons locked) → FINAL
```

---

## 9. Related Documentation

- [High-Level Design - Component Design](../../HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Component specifications
- [High-Level Design - Data Flow](../../HIGH_LEVEL_DESIGN/04-DATA_FLOW.md) - Data flow diagrams
- [High-Level Design - Database Design](../../HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Database schema
- [Error Handling](../COMMON/ERROR_HANDLING.md) - Error handling patterns
- [Testing Strategy](../COMMON/TESTING_STRATEGY.md) - Testing approach
- [Class Diagram](../../../03-DIAGRAMS/class-diagrams/matchmaking-service.puml) - UML class diagram

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
