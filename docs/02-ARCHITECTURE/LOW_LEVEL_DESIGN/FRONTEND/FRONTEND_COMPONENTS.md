# Frontend Components - Low-Level Design (LLD)

**Part of:** [Low-Level Design (LLD)](../README.md)  
**Technology:** Angular 17+ (TypeScript)  
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

## 1. Frontend Overview

### 1.1 Responsibilities
- User interface and user experience
- Client-side state management
- WebSocket communication with backend services
- REST API communication with backend services
- Game rendering (Phaser 3)
- Real-time game state display
- User input handling

### 1.2 Key Components
- **Services** - Angular services for business logic (Singleton Pattern, Observer Pattern)
- **Components** - Angular components for UI (Component Pattern)
- **Guards** - Route guards for authentication (Guard Pattern)
- **Interceptors** - HTTP interceptors for request/response handling (Interceptor Pattern)
- **Models** - TypeScript interfaces and models (DTO Pattern)

### 1.3 Design Patterns Applied
- **Singleton Pattern** - Angular services (providedIn: 'root')
- **Observer Pattern** - RxJS Observables for state management
- **Strategy Pattern** - Different routing strategies
- **State Pattern** - Component state management
- **Factory Pattern** - Component factory for dynamic components
- **Adapter Pattern** - HTTP client adapter, WebSocket adapter

---

## 2. UML Class Diagram

**See:** [Frontend Components Class Diagram](../../../03-DIAGRAMS/class-diagrams/frontend-components.puml)

### 2.1 Class Relationships

```
AuthService
    ├── depends on → HttpClient
    └── depends on → Router

GameService
    ├── depends on → Socket (Socket.io)
    └── uses → RxJS Observables

HeroSelectionService
    └── uses → RxJS Observables

MatchmakingService
    ├── depends on → Socket (Socket.io)
    └── uses → RxJS Observables

ArenaSelectionService
    ├── depends on → Socket (Socket.io)
    └── uses → RxJS Observables

WeaponSelectionService
    ├── depends on → Socket (Socket.io)
    └── uses → RxJS Observables

ProfileService
    ├── depends on → HttpClient
    └── uses → RxJS Observables

LeaderboardService
    ├── depends on → HttpClient
    └── uses → RxJS Observables

HeroSelectionComponent
    ├── depends on → HeroService
    └── depends on → HeroSelectionService

MatchmakingComponent
    └── depends on → MatchmakingService
```

---

## 3. Service Responsibilities (C4 Code Level)

### 3.1 AuthService
**Role:** Authentication service  
**Responsibilities:**
- Handle user authentication
- Handle Google OAuth authentication
- Manage JWT token storage
- Provide authentication state
- Handle login and registration
- Handle logout

**Dependencies:**
- HttpClient (HTTP communication)
- Router (navigation)

**Collaborations:**
- Used by components for authentication
- Communicates with Auth Service (backend)
- Manages authentication state

### 3.2 GameService
**Role:** Game state service  
**Responsibilities:**
- Manage WebSocket connection to Game Engine Service
- Handle game state updates
- Emit game actions
- Manage game state synchronization
- Handle game events

**Dependencies:**
- Socket (Socket.io client)
- RxJS Observables (state management)

**Collaborations:**
- Used by game components for game operations
- Communicates with Game Engine Service (backend)
- Manages game state

### 3.3 HeroSelectionService
**Role:** Hero selection service  
**Responsibilities:**
- Manage hero selection state
- Store selected heroes
- Provide hero selection state
- Manage hero selection priority

**Dependencies:**
- RxJS Observables (state management)
- Local Storage (optional, for persistence)

**Collaborations:**
- Used by hero selection components
- Used by matchmaking service
- Manages hero selection state

### 3.4 MatchmakingService
**Role:** Matchmaking service  
**Responsibilities:**
- Manage WebSocket connection to Matchmaking Service
- Handle queue operations
- Handle match events
- Manage match acceptance/rejection
- Handle queue status updates

**Dependencies:**
- Socket (Socket.io client)
- RxJS Observables (state management)

**Collaborations:**
- Used by matchmaking components
- Communicates with Matchmaking Service (backend)
- Manages matchmaking state

### 3.5 ArenaSelectionService
**Role:** Arena selection service  
**Responsibilities:**
- Manage WebSocket connection to Matchmaking Service
- Handle arena selection events
- Handle arena elimination
- Manage arena selection state

**Dependencies:**
- Socket (Socket.io client)
- RxJS Observables (state management)

**Collaborations:**
- Used by arena selection components
- Communicates with Matchmaking Service (backend)
- Manages arena selection state

### 3.6 WeaponSelectionService
**Role:** Weapon selection service  
**Responsibilities:**
- Manage WebSocket connection to Matchmaking Service
- Handle weapon selection events
- Handle weapon selection timer
- Manage weapon selection state

**Dependencies:**
- Socket (Socket.io client)
- RxJS Observables (state management)
- Timer (selection timer)

**Collaborations:**
- Used by weapon selection components
- Communicates with Matchmaking Service (backend)
- Manages weapon selection state

### 3.7 ProfileService
**Role:** Profile service  
**Responsibilities:**
- Handle profile data fetching
- Handle profile updates
- Handle global score retrieval
- Handle rank tier retrieval
- Handle statistics retrieval

**Dependencies:**
- HttpClient (HTTP communication)
- RxJS Observables (state management)

**Collaborations:**
- Used by profile components
- Communicates with Profile Service (backend)
- Manages profile state

### 3.8 LeaderboardService
**Role:** Leaderboard service  
**Responsibilities:**
- Handle leaderboard data fetching
- Handle leaderboard filtering
- Handle player rank retrieval
- Handle rank tier retrieval

**Dependencies:**
- HttpClient (HTTP communication)
- RxJS Observables (state management)

**Collaborations:**
- Used by leaderboard components
- Communicates with Leaderboard Service (backend)
- Manages leaderboard state

---

## 4. Component Responsibilities (C4 Code Level)

### 4.1 HeroSelectionComponent
**Role:** Hero selection UI component  
**Responsibilities:**
- Display available heroes
- Handle hero selection
- Manage hero selection UI state
- Navigate to matchmaking

**Dependencies:**
- HeroService (hero data)
- HeroSelectionService (hero selection state)

**Collaborations:**
- Used by users for hero selection
- Uses HeroService for hero data
- Uses HeroSelectionService for selection state

### 4.2 MatchmakingComponent
**Role:** Matchmaking UI component  
**Responsibilities:**
- Display matchmaking queue status
- Display estimated wait time
- Handle queue join/leave
- Handle match acceptance/rejection

**Dependencies:**
- MatchmakingService (matchmaking operations)

**Collaborations:**
- Used by users for matchmaking
- Uses MatchmakingService for matchmaking operations

### 4.3 ArenaSelectionComponent
**Role:** Arena selection UI component  
**Responsibilities:**
- Display available arenas
- Handle arena elimination
- Display arena selection state
- Navigate to weapon selection

**Dependencies:**
- ArenaSelectionService (arena selection operations)

**Collaborations:**
- Used by users for arena selection
- Uses ArenaSelectionService for arena selection operations

### 4.4 WeaponSelectionComponent
**Role:** Weapon selection UI component  
**Responsibilities:**
- Display available weapons
- Handle weapon selection
- Display selection timer
- Display weapon selection state

**Dependencies:**
- WeaponSelectionService (weapon selection operations)

**Collaborations:**
- Used by users for weapon selection
- Uses WeaponSelectionService for weapon selection operations

### 4.5 GameArenaComponent
**Role:** Game arena UI component  
**Responsibilities:**
- Display game arena (Phaser 3)
- Handle player input
- Display game state
- Handle game actions

**Dependencies:**
- GameService (game operations)
- Phaser 3 (game rendering)

**Collaborations:**
- Used by users for gameplay
- Uses GameService for game operations
- Uses Phaser 3 for game rendering

---

## 5. Design Pattern Applications

### 5.1 Singleton Pattern - Angular Services
**Pattern:** Singleton Pattern  
**Intent:** Ensure a class has only one instance and provide global access  
**Participants:**
- **Singleton:** Angular services (providedIn: 'root')

**Why:** Single instance services across the application  
**Consequences:**
- ✅ Controlled access to single instance
- ✅ Reduced memory footprint
- ✅ Shared state across components
- ❌ Global state (potential testing issues)

### 5.2 Observer Pattern - RxJS Observables
**Pattern:** Observer Pattern  
**Intent:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified  
**Participants:**
- **Subject:** RxJS Observables (BehaviorSubject, Subject)
- **Observer:** Components, Services

**Why:** Reactive state management and event-driven communication  
**Consequences:**
- ✅ Decouples subject from observers
- ✅ Supports broadcast communication
- ✅ Easy to add new observers
- ✅ Reactive programming paradigm
- ❌ May cause performance issues with many observers

### 5.3 State Pattern - Component State
**Pattern:** State Pattern  
**Intent:** Allow an object to alter its behavior when its internal state changes  
**Participants:**
- **Context:** Angular Components
- **State:** Component state (loading, loaded, error)

**Why:** Manages component state transitions  
**Consequences:**
- ✅ Encapsulates state-specific behavior
- ✅ Makes state transitions explicit
- ✅ Easy to add new states
- ❌ Increased complexity

### 5.4 Factory Pattern - Component Factory
**Pattern:** Factory Pattern  
**Intent:** Define an interface for creating an object, but let subclasses decide which class to instantiate  
**Participants:**
- **Factory:** ComponentFactoryResolver
- **Product:** Angular Components

**Why:** Dynamic component creation  
**Consequences:**
- ✅ Encapsulates object creation
- ✅ Provides flexibility in object creation
- ✅ Reduces coupling
- ❌ Increased complexity

### 5.5 Adapter Pattern - HttpClientAdapter
**Pattern:** Adapter Pattern  
**Intent:** Convert the interface of a class into another interface clients expect  
**Participants:**
- **Target:** Angular HttpClient
- **Adaptee:** HTTP library
- **Adapter:** HttpClientAdapter (Angular HttpClient)

**Why:** Adapts HTTP library to Angular HttpClient interface  
**Consequences:**
- ✅ Allows incompatible interfaces to work together
- ✅ Decouples client from adaptee
- ✅ Easy to swap HTTP libraries
- ❌ Increased complexity

---

## 6. Method Signatures (Not Implementations)

### 6.1 AuthService
```typescript
// Responsibilities: Handle user authentication
export class AuthService {
    // Login user
    login(username: string, password: string): Observable<AuthResponse>;
    
    // Register user
    register(userData: RegisterRequest): Observable<AuthResponse>;
    
    // Login with Google OAuth
    loginWithGoogle(authorizationCode: string): Observable<AuthResponse>;
    
    // Logout user
    logout(): void;
    
    // Get JWT token
    getToken(): string | null;
    
    // Check if user is authenticated
    isAuthenticated(): boolean;
    
    // Get current user
    getUser(): Observable<User | null>;
}
```

### 6.2 GameService
```typescript
// Responsibilities: Manage game state and WebSocket communication
export class GameService {
    // Connect to game
    connectToGame(roomId: string): void;
    
    // Move hero
    moveHero(direction: 'left' | 'right'): void;
    
    // Fire weapon
    fireWeapon(angle: number, power: number, weaponId: string): void;
    
    // Subscribe to game state updates
    onGameStateUpdate(callback: (state: GameState) => void): void;
    
    // Subscribe to turn updates
    onTurnUpdate(callback: (turn: TurnState) => void): void;
    
    // Subscribe to match end
    onMatchEnd(callback: (result: MatchResult) => void): void;
    
    // Disconnect from game
    disconnectFromGame(): void;
    
    // Reconnect to game
    reconnectToGame(roomId: string): void;
}
```

### 6.3 HeroSelectionService
```typescript
// Responsibilities: Manage hero selection state
export class HeroSelectionService {
    // Select heroes
    selectHeroes(heroIds: string[]): void;
    
    // Get selected heroes
    getSelectedHeroes(): string[];
    
    // Clear selection
    clearSelection(): void;
    
    // Update hero priority
    updateHeroPriority(heroIds: string[]): void;
}
```

### 6.4 MatchmakingService
```typescript
// Responsibilities: Handle matchmaking and queue management
export class MatchmakingService {
    // Join queue
    joinQueue(heroIds: string[]): void;
    
    // Leave queue
    leaveQueue(): void;
    
    // Accept match
    acceptMatch(matchId: string): void;
    
    // Reject match
    rejectMatch(matchId: string): void;
    
    // Get queue status
    getQueueStatus(): Observable<QueueStatus>;
    
    // Subscribe to match found
    onMatchFound(callback: (match: Match) => void): void;
    
    // Subscribe to hero assigned
    onHeroAssigned(callback: (hero: string) => void): void;
}
```

### 6.5 ArenaSelectionService
```typescript
// Responsibilities: Manage arena selection
export class ArenaSelectionService {
    // Get available arenas
    getAvailableArenas(heroType: string): Observable<Arena[]>;
    
    // Eliminate arena
    eliminateArena(arenaId: string): void;
    
    // Subscribe to arena eliminated
    onArenaEliminated(callback: (arenaId: string) => void): void;
    
    // Subscribe to arena selected
    onArenaSelected(callback: (arenaId: string) => void): void;
}
```

### 6.6 WeaponSelectionService
```typescript
// Responsibilities: Manage weapon selection
export class WeaponSelectionService {
    // Select weapon
    selectWeapon(weaponId: string): void;
    
    // Subscribe to weapon selected
    onWeaponSelected(callback: (weaponId: string) => void): void;
    
    // Subscribe to selection complete
    onSelectionComplete(callback: () => void): void;
    
    // Get selection timer
    getSelectionTimer(): Observable<number>;
}
```

### 6.7 ProfileService
```typescript
// Responsibilities: Handle profile data
export class ProfileService {
    // Get profile
    getProfile(): Observable<Profile>;
    
    // Update profile
    updateProfile(profileData: UpdateProfileRequest): Observable<Profile>;
    
    // Get global score
    getGlobalScore(): Observable<number>;
    
    // Get rank tier
    getRankTier(): Observable<string>;
    
    // Get statistics
    getStatistics(): Observable<PlayerStatistics>;
    
    // Update avatar
    updateAvatar(avatarUrl: string): Observable<void>;
}
```

### 6.8 LeaderboardService
```typescript
// Responsibilities: Handle leaderboard data
export class LeaderboardService {
    // Get leaderboard
    getLeaderboard(filters: LeaderboardFilters, limit: number): Observable<Leaderboard>;
    
    // Get player rank
    getPlayerRank(playerId: string): Observable<PlayerRank>;
    
    // Get player rank tier
    getPlayerRankTier(playerId: string): Observable<string>;
    
    // Get top players
    getTopPlayers(filters: LeaderboardFilters, limit: number): Observable<Leaderboard>;
}
```

---

## 7. Class Relationships

### 7.1 Inheritance
- Angular Components extend Component base class
- Angular Services are injectable (Singleton)

### 7.2 Composition
- Components contain Services
- Services contain RxJS Observables
- Components contain child components

### 7.3 Dependency
- Components depend on Services
- Services depend on HttpClient, Socket, RxJS Observables
- Services depend on other Services

---

## 8. Sequence Diagrams

**See:** [Frontend Game Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/frontend-game-flow.puml)

### 8.1 Game Flow
```
User → Component → Service → Backend Service
                          ↓
                    RxJS Observable
                          ↓
                    Component → User
```

---

## 9. Related Documentation

- [High-Level Design - Component Design](../../HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Component specifications
- [Error Handling](../COMMON/ERROR_HANDLING.md) - Error handling patterns
- [Testing Strategy](../COMMON/TESTING_STRATEGY.md) - Testing approach
- [Class Diagram](../../../03-DIAGRAMS/class-diagrams/frontend-components.puml) - UML class diagram

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
