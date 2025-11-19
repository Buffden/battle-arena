# EPIC-VS-3: First Playable Match

**Copy and paste this template directly into GitHub Issues.**

**Note:** All technical implementation details from Phase 5 (Matchmaking), Phase 6 (Game Engine), and Phase 7 (Frontend - gameplay parts) have been consolidated into this file. You no longer need to reference multiple Phase documents when creating GitHub issues.

---

## EPIC-VS-3: First Playable Match

### Issue Template:

```
Title: EPIC-VS-3: First Playable Match

Description:
## Overview
Implement the third vertical slice where a player can play a complete match from start to finish. This epic enables the core gameplay experience - players can join a matchmaking queue, get matched, enter a game room, play a turn-based artillery battle, and see the match result. This is the first playable version of the game.

**This is the third vertical slice** - it enables players to actually play the game end-to-end.

## Vertical Slice Goal
A player can:
1. Click "Play" and join matchmaking queue
2. Get matched (with bot opponent for MVP)
3. Enter game room and see arena
4. Play a complete match (move, fire shots, take turns)
5. See match result (win/loss)

## Success Criteria
- [ ] Player can click "Play" button and join matchmaking queue
- [ ] Matchmaking queue shows position and estimated wait time
- [ ] Player gets matched (bot opponent for MVP)
- [ ] Player enters game room and sees game arena
- [ ] Player can move hero (left/right, 4 moves per match)
- [ ] Player can fire shots with weapon (aim, power, fire)
- [ ] Turn system works (15-second turns, alternating players)
- [ ] Physics engine calculates projectile trajectory and collisions
- [ ] Health system tracks damage and win conditions
- [ ] Match result displayed (winner, scores, stats)
- [ ] End-to-end flow works: Join Queue → Match → Play → Result

## MVP Scope (Minimal for First Playable Match)

**What's Included:**
- Bot opponent (no real player matching yet)
- Default hero (no hero selection yet)
- Default weapon (no weapon selection yet)
- Default arena (no arena selection yet)
- Basic physics (no fancy effects)
- Simple scoring (basic win/loss, no complex scoring yet)

**What's Deferred:**
- Hero selection (VS-4 or later)
- Weapon selection (VS-4 or later)
- Arena selection (VS-4 or later)
- Real player matching (VS-4 or later)
- Complex scoring (combos, saves, etc. - VS-4 or later)

## Technical References

### Phase Documents (Technical Implementation Details)
This epic references Phase 5 (Matchmaking), Phase 6 (Game Engine), and Phase 7 (Frontend) for technical specifications.

- **Matchmaking Service:** See Phase 5 (PHASE-5 issue) - STORY-5-1, STORY-5-3, STORY-5-5, STORY-5-6
- **Game Engine Service:** See Phase 6 (PHASE-6 issue) - STORY-6-1, STORY-6-2, STORY-6-3, STORY-6-4, STORY-6-5, STORY-6-6
- **Frontend:** See Phase 7 (PHASE-7 issue) - Matchmaking UI, Game Arena UI, Gameplay UI

### Architecture References

**Sequence Diagrams:**
- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml) - Complete matchmaking flow
- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/gameplay-flow.puml) - Complete gameplay flow
- [Movement Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/movement-flow.puml) - Hero movement flow
- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Match result flow
- [Sequence Diagrams Index](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/README.md)

**Class Diagrams:**
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml)
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml)
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml)

**State Diagrams:**
- [Game State Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/state-diagrams/game-state.puml) - Game state transitions
- [Turn State Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/state-diagrams/turn-state.puml) - Turn state transitions

**Architecture Documents:**
- [System Architecture - Matchmaking Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#24-matchmaking-service)
- [System Architecture - Game Engine Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#25-game-engine-service)
- [Matchmaking Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md)
- [Game Engine Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md)
- [Frontend Components Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) - WebSocket patterns

## Stories (Player Experience)

### VS-3-1: Player can click "Play" and join matchmaking queue

**User Story:** As a player, I want to click "Play" and join a matchmaking queue so that I can find an opponent and play a match.

**Acceptance Criteria:**
- [ ] "Play" button visible on dashboard/home screen
- [ ] Clicking "Play" opens matchmaking UI
- [ ] Player joins matchmaking queue via WebSocket
- [ ] Queue status displayed (position, estimated wait time)
- [ ] Queue status updates in real-time
- [ ] Player can cancel queue (leave queue)
- [ ] Default hero assigned automatically (no selection yet)

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-3-1-1: Matchmaking Service Foundation Setup (BE)**

**Description:**
Set up the Node.js project structure, dependencies, and configuration for the Matchmaking Service. This is a prerequisite for all other matchmaking tasks.

**Related Diagrams & Documents:**
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml)
- [System Architecture - Matchmaking Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#24-matchmaking-service)
- [Matchmaking Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md)

**Acceptance Criteria:**
- [ ] Node.js project structure created (`backend-services/matchmaking-service/`)
- [ ] Express HTTP server configured
- [ ] Socket.io WebSocket server configured
- [ ] Redis client connection configured
- [ ] Project structure follows clean architecture (controller, service, manager, model, config)
- [ ] Environment variables configured (port 3002, Redis URI, JWT secret)
- [ ] Health check endpoint working (`/health`)
- [ ] Socket.io connection handler implemented
- [ ] Basic error handling and logging configured
- [ ] All dependencies installed (express, socket.io, redis, jsonwebtoken, etc.)

**Technical Details:**

**Project Structure:**
```

backend-services/matchmaking-service/
├── src/
│ ├── index.ts
│ ├── config/
│ │ ├── redis.config.ts
│ │ ├── socket.config.ts
│ │ └── env.config.ts
│ ├── controllers/
│ │ └── MatchmakingController.ts
│ ├── services/
│ │ ├── MatchmakingService.ts
│ │ ├── MatchmakingEngine.ts
│ │ ├── QueueManager.ts
│ │ ├── HeroSelector.ts
│ │ ├── ArenaSelector.ts
│ │ ├── WeaponSelector.ts
│ │ └── LobbyManager.ts
│ ├── middleware/
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ └── logging.middleware.ts
│ ├── routes/
│ │ └── health.routes.ts
│ ├── utils/
│ │ ├── logger.ts
│ │ └── validators.ts
│ ├── types/
│ │ ├── hero.types.ts
│ │ ├── queue.types.ts
│ │ └── match.types.ts
│ ├── models/
│ │ ├── Hero.ts
│ │ ├── QueueEntry.ts
│ │ └── Lobby.ts
│ ├── middleware/
│ │ └── auth.middleware.ts
│ └── types/
│ └── matchmaking.types.ts
├── package.json
├── tsconfig.json (if TypeScript)
├── .env.example
└── README.md

````

**Required Dependencies (package.json):**
- express
- socket.io
- redis
- jsonwebtoken
- dotenv
- typescript
- @types/node, @types/express, @types/socket.io

**Environment Variables:**
```env
PORT=3002
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=${JWT_SECRET}
````

---

**TASK-VS-3-1-2: Join Matchmaking Queue Feature (BE + FE)**

**Description:**
Implement complete join queue feature including backend queue management and frontend matchmaking UI. This task combines all queue-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml) - Join queue flow
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml) - Queue service structure
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - MatchmakingService and components

**Acceptance Criteria:**

- [ ] Socket.io event handler for `join-queue` created
- [ ] JWT token validation on WebSocket connection
- [ ] QueueManager.addToQueue() method implemented
- [ ] Player added to Redis queue (Sorted Set by score)
- [ ] Default hero assigned automatically (single default hero for MVP)
- [ ] Queue status calculated (position, estimated wait time)
- [ ] Queue status emitted to player via Socket.io
- [ ] Matchmaking UI component created
- [ ] "Play" button triggers join queue
- [ ] Queue status displayed (position, ETA)
- [ ] Real-time queue status updates
- [ ] Leave queue functionality
- [ ] End-to-end test: Click Play → Join Queue → See Status → Leave Queue

**Technical Details:**

**Backend - Queue Service:**
**File:** `src/services/QueueManager.ts`

```typescript
export class QueueManager {
  async addToQueue(playerId: string, heroId: string, globalScore: number, socketId: string): Promise<QueueStatus> {
    // 1. Add player to Redis sorted set (key: matchmaking:queue, score: globalScore)
    // 2. Store queue entry with playerId, heroId, socketId, timestamp
    // 3. Calculate position in queue
    // 4. Calculate estimated wait time
    // 5. Return QueueStatus
  }

  async removeFromQueue(playerId: string): Promise<void> {
    // Remove player from Redis queue
  }

  async getQueueStatus(playerId: string): Promise<QueueStatus> {
    // Get player position and estimated wait time
  }
}
```

**Backend - Socket.io Handler:**
**File:** `src/controllers/MatchmakingController.ts`

```typescript
io.on("connection", (socket) => {
  socket.on("join-queue", async (data: { playerId: string }) => {
    // 1. Validate JWT token
    // 2. Get player global score (from Profile Service or default to 0)
    // 3. Assign default hero (single hero for MVP)
    // 4. Add to queue via QueueManager
    // 5. Emit queue-status to player
  });

  socket.on("leave-queue", async (data: { playerId: string }) => {
    // 1. Remove from queue
    // 2. Emit confirmation
  });
});
```

**Frontend - Matchmaking Component:**
**File:** `src/app/matchmaking/components/matchmaking/matchmaking.component.ts`

```typescript
@Component({
  selector: "app-matchmaking",
  templateUrl: "./matchmaking.component.html",
})
export class MatchmakingComponent {
  queueStatus: QueueStatus | null = null;
  isInQueue = false;

  constructor(private matchmakingService: MatchmakingService) {}

  joinQueue(): void {
    this.matchmakingService.joinQueue().subscribe({
      next: (status) => {
        this.queueStatus = status;
        this.isInQueue = true;
      },
    });
  }

  leaveQueue(): void {
    this.matchmakingService.leaveQueue().subscribe({
      next: () => {
        this.isInQueue = false;
        this.queueStatus = null;
      },
    });
  }
}
```

**Frontend - MatchmakingService:**
**File:** `src/app/services/matchmaking.service.ts`

```typescript
@Injectable()
export class MatchmakingService {
  private socket: Socket;

  joinQueue(): Observable<QueueStatus> {
    this.socket.emit("join-queue", { playerId: this.authService.getUserId() });
    return this.socket.fromEvent<QueueStatus>("queue-status");
  }

  leaveQueue(): Observable<void> {
    this.socket.emit("leave-queue", { playerId: this.authService.getUserId() });
    return new Observable((observer) => observer.next());
  }
}
```

**End-to-End Test Scenario:**

1. Player clicks "Play" button
2. Verify Socket.io connection established
3. Verify `join-queue` event sent
4. Verify player added to Redis queue
5. Verify `queue-status` event received
6. Verify queue status displayed (position, ETA)
7. Test leave queue functionality

**Definition of Done:**

- Player can click Play → join queue → see queue status
- Queue status updates in real-time
- Player can leave queue
- Default hero assigned automatically

---

### VS-3-2: Player gets matched and enters game room

**User Story:** As a player, I want to get matched with an opponent so that I can start playing a match.

**Acceptance Criteria:**

- [ ] Matchmaking algorithm finds match (bot opponent for MVP)
- [ ] Match created with player and bot
- [ ] Game room created in Game Engine Service
- [ ] Players notified of match found
- [ ] Players redirected to game room
- [ ] Game room state initialized (default hero, default weapon, default arena)

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-3-2-1: Matchmaking Algorithm (BE)**

**Description:**
Implement basic matchmaking algorithm that matches players with bot opponents for MVP. This is a simplified version that will be enhanced in later epics.

**Related Diagrams & Documents:**

- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml) - Match found flow
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml) - MatchmakingEngine structure

**Acceptance Criteria:**

- [ ] MatchmakingEngine.findMatch() method implemented
- [ ] Bot opponent creation logic (for MVP)
- [ ] Match created with player and bot
- [ ] Match data sent to Game Engine Service
- [ ] Players notified via Socket.io `match-found` event
- [ ] Queue entry removed after match found
- [ ] Unit tests for matchmaking algorithm

**Technical Details:**

**Backend - Matchmaking Engine:**
**File:** `src/services/MatchmakingEngine.ts`

```typescript
export class MatchmakingEngine {
  async findMatch(playerId: string): Promise<Match | null> {
    // MVP: Match with bot opponent
    // 1. Get player from queue
    // 2. Create bot opponent (default hero, default score)
    // 3. Create match object
    // 4. Send match to Game Engine Service
    // 5. Notify player via Socket.io
    // 6. Return match
  }

  private createBotOpponent(): BotPlayer {
    // Create bot with default hero and score
    return {
      id: `bot-${Date.now()}`,
      heroId: "default-hero",
      globalScore: 0,
      isBot: true,
    };
  }
}
```

**End-to-End Test Scenario:**

1. Player in queue
2. Matchmaking algorithm runs
3. Bot opponent created
4. Match created
5. Game room created in Game Engine
6. Player notified of match found
7. Player redirected to game room

**Definition of Done:**

- Player gets matched with bot opponent
- Match created and sent to Game Engine
- Player notified and redirected to game

---

**TASK-VS-3-2-2: Game Room Creation (BE)**

**Description:**
Implement game room creation in Game Engine Service when match is assigned from Matchmaking Service.

**Related Diagrams & Documents:**

- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/gameplay-flow.puml) - Game room creation
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml) - GameRoomManager structure
- [Game State Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/state-diagrams/game-state.puml) - State transitions

**Acceptance Criteria:**

- [ ] GameRoomManager.createGameRoom() method implemented
- [ ] Game room created with match data (players, default hero, default weapon, default arena)
- [ ] Game state initialized (health, positions, scores, moves)
- [ ] Game state stored in Redis
- [ ] Socket.io room created for players
- [ ] Players notified of game start
- [ ] Unit tests for game room creation

**Technical Details:**

**Backend - Game Room Manager:**
**File:** `src/service/GameRoomManager.ts`

```typescript
export class GameRoomManager {
  async createGameRoom(matchId: string, matchData: MatchData): Promise<GameRoom> {
    // 1. Create game room with match data
    // 2. Initialize game state (default hero, default weapon, default arena)
    // 3. Set initial positions, health, scores, moves
    // 4. Store in Redis (key: game:{matchId})
    // 5. Create Socket.io room
    // 6. Emit game-started event to players
    // 7. Return game room
  }
}
```

**Game State Initialization:**

- Default hero assigned to both players
- Default weapon assigned (single weapon for MVP)
- Default arena selected
- Initial positions set (left and right sides)
- Health set to 100 (or default HP)
- Scores initialized to 0
- Moves initialized to 4 per player
- Turn set to player 1

**End-to-End Test Scenario:**

1. Match received from Matchmaking Service
2. Game room created
3. Game state initialized
4. Game state stored in Redis
5. Socket.io room created
6. Players notified of game start

**Definition of Done:**

- Game room created when match assigned
- Game state initialized with defaults
- Players can connect to game room

---

### VS-3-3: Player can see game arena and their hero

**User Story:** As a player, I want to see the game arena and my hero so that I can understand the game state and prepare for my turn.

**Acceptance Criteria:**

- [ ] Game arena rendered on screen
- [ ] Player's hero visible at starting position
- [ ] Opponent's hero visible at starting position
- [ ] Arena terrain/background displayed
- [ ] Game HUD visible (health, score, turn indicator)
- [ ] Game state synchronized from server

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-3-3-1: Game Arena UI (FE)**

**Description:**
Implement game arena UI component that displays the game state, heroes, and arena. This includes the game canvas, HUD, and real-time state synchronization.

**Related Diagrams & Documents:**

- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - GameService and components
- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/gameplay-flow.puml) - Game state updates

**Acceptance Criteria:**

- [ ] Game arena component created
- [ ] Game canvas rendered (Phaser 3 or HTML5 Canvas)
- [ ] Default arena background/terrain displayed
- [ ] Player hero sprite rendered at starting position
- [ ] Opponent hero sprite rendered at starting position
- [ ] Game HUD component created (health bars, scores, turn indicator)
- [ ] GameService connects to Game Engine via Socket.io
- [ ] Game state received and rendered
- [ ] Real-time state updates displayed
- [ ] End-to-end test: Enter game room → See arena → See heroes → See HUD

**Technical Details:**

**Frontend - Game Arena Component:**
**File:** `src/app/arena/components/game-arena/game-arena.component.ts`

```typescript
@Component({
  selector: "app-game-arena",
  templateUrl: "./game-arena.component.html",
})
export class GameArenaComponent implements OnInit, OnDestroy {
  gameState: GameState | null = null;
  gameScene: Phaser.Scene | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.connectToGame(this.matchId);
    this.gameService.getGameState().subscribe((state) => {
      this.gameState = state;
      this.updateGameScene(state);
    });
  }

  private updateGameScene(state: GameState): void {
    // Update Phaser scene with game state
    // Update hero positions
    // Update health bars
    // Update scores
    // Update turn indicator
  }
}
```

**Frontend - GameService:**
**File:** `src/app/services/game.service.ts`

```typescript
@Injectable()
export class GameService {
  private socket: Socket;
  private gameStateSubject = new BehaviorSubject<GameState | null>(null);

  connectToGame(matchId: string): void {
    this.socket = io(`${this.gameEngineUrl}`, {
      query: { matchId },
      auth: { token: this.authService.getToken() },
    });

    this.socket.on("game-started", (gameState: GameState) => {
      this.gameStateSubject.next(gameState);
    });

    this.socket.on("game-state-update", (gameState: GameState) => {
      this.gameStateSubject.next(gameState);
    });
  }

  getGameState(): Observable<GameState> {
    return this.gameStateSubject.asObservable();
  }
}
```

**End-to-End Test Scenario:**

1. Player enters game room
2. GameService connects to Game Engine
3. Game state received
4. Arena rendered with default arena
5. Heroes rendered at starting positions
6. HUD displayed (health, scores, turn)
7. Real-time updates displayed

**Definition of Done:**

- Player can see game arena
- Player can see their hero and opponent
- Game state synchronized and displayed
- HUD shows current game state

---

### VS-3-4: Player can move and fire shots

**User Story:** As a player, I want to move my hero and fire shots so that I can play the game and try to win.

**Acceptance Criteria:**

- [ ] Player can move hero left/right (arrow keys or buttons)
- [ ] Movement limited to 4 moves per match
- [ ] Player can aim weapon (angle adjustment)
- [ ] Player can set power (power slider)
- [ ] Player can fire weapon (fire button)
- [ ] Turn timer displayed (15 seconds)
- [ ] Turn switches after action or timeout
- [ ] Physics engine calculates projectile trajectory
- [ ] Collisions detected and damage calculated
- [ ] Game state updated and synchronized

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-3-4-1: Movement System (BE + FE)**

**Description:**
Implement hero movement system including backend movement validation and frontend movement controls. This task combines all movement-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Movement Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/movement-flow.puml) - Movement flow
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml) - MovementManager structure

**Acceptance Criteria:**

- [ ] MovementManager.validateMove() method implemented
- [ ] Movement limits enforced (4 moves per match, left/right only)
- [ ] Movement applied to game state
- [ ] Game state updated in Redis
- [ ] Movement event emitted to all players
- [ ] Frontend movement controls (arrow keys or buttons)
- [ ] Movement sent to Game Engine via Socket.io
- [ ] Hero position updated in real-time
- [ ] Move counter displayed
- [ ] End-to-end test: Move hero → Verify backend validation → See position update

**Technical Details:**

**Backend - Movement Service:**
**File:** `src/service/MovementManager.ts`

```typescript
export class MovementManager {
  validateMove(gameState: GameState, playerId: string, direction: "left" | "right"): boolean {
    // 1. Check if it's player's turn
    // 2. Check if player has moves remaining (max 4)
    // 3. Check if movement is valid (left/right only, within bounds)
    // 4. Return true if valid, false otherwise
  }

  applyMove(gameState: GameState, playerId: string, direction: "left" | "right"): GameState {
    // 1. Update hero position
    // 2. Decrement moves remaining
    // 3. Update game state
    // 4. Return updated game state
  }
}
```

**Backend - Socket.io Handler:**
**File:** `src/controller/GameEngineController.ts`

```typescript
socket.on("player-move", async (data: { matchId: string; playerId: string; direction: string }) => {
  // 1. Get game state from Redis
  // 2. Validate move via MovementManager
  // 3. Apply move via MovementManager
  // 4. Update game state in Redis
  // 5. Emit game-state-update to all players
});
```

**Frontend - Movement Controls:**
**File:** `src/app/arena/components/game-arena/game-arena.component.ts`

```typescript
onMove(direction: 'left' | 'right'): void {
  if (this.gameState?.currentTurn === this.playerId && this.canMove()) {
    this.gameService.moveHero(this.matchId, this.playerId, direction).subscribe({
      next: (updatedState) => {
        this.gameState = updatedState;
      },
    });
  }
}

canMove(): boolean {
  return (this.gameState?.playerMovesRemaining || 0) > 0;
}
```

**End-to-End Test Scenario:**

1. Player's turn starts
2. Player presses left/right arrow
3. Movement sent to Game Engine
4. Backend validates move
5. Game state updated
6. All players see updated position
7. Move counter decremented

**Definition of Done:**

- Player can move hero left/right
- Movement limited to 4 moves per match
- Movement validated and synchronized
- Move counter displayed and updated

---

**TASK-VS-3-4-2: Weapon Firing System (BE + FE)**

**Description:**
Implement weapon firing system including backend physics calculation and frontend firing controls. This task combines all firing-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/gameplay-flow.puml) - Weapon firing flow
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml) - PhysicsEngine structure

**Acceptance Criteria:**

- [ ] PhysicsEngine.calculateTrajectory() method implemented
- [ ] Matter.js physics engine integrated
- [ ] Projectile created and added to physics world
- [ ] Collision detection implemented
- [ ] Damage calculation implemented
- [ ] Health updated after hit
- [ ] Game state updated and synchronized
- [ ] Frontend aiming controls (angle slider, power slider)
- [ ] Fire button triggers shot
- [ ] Projectile animation displayed
- [ ] Hit detection and damage displayed
- [ ] End-to-end test: Aim → Fire → See projectile → See damage → See health update

**Technical Details:**

**Backend - Physics Service:**
**File:** `src/service/PhysicsEngine.ts`

```typescript
export class PhysicsEngine {
  private engine: Matter.Engine;
  private world: Matter.World;

  calculateTrajectory(startPos: Position, angle: number, power: number): Trajectory {
    // Calculate projectile trajectory using physics
    // Return trajectory points
  }

  fireProjectile(gameState: GameState, playerId: string, angle: number, power: number): ProjectileResult {
    // 1. Create projectile in Matter.js world
    // 2. Simulate trajectory
    // 3. Check for collisions
    // 4. Calculate damage if hit
    // 5. Update health
    // 6. Return projectile result
  }
}
```

**Backend - Socket.io Handler:**
**File:** `src/controller/GameEngineController.ts`

```typescript
socket.on("player-fire", async (data: { matchId: string; playerId: string; angle: number; power: number }) => {
  // 1. Get game state from Redis
  // 2. Validate it's player's turn
  // 3. Fire projectile via PhysicsEngine
  // 4. Update game state (health, scores)
  // 5. Check win condition
  // 6. Update game state in Redis
  // 7. Emit game-state-update to all players
  // 8. Switch turn if match not ended
});
```

**Frontend - Firing Controls:**
**File:** `src/app/arena/components/game-arena/game-arena.component.ts`

```typescript
onFire(angle: number, power: number): void {
  if (this.gameState?.currentTurn === this.playerId) {
    this.gameService.fireWeapon(this.matchId, this.playerId, angle, power).subscribe({
      next: (result) => {
        this.animateProjectile(result.trajectory);
        if (result.hit) {
          this.showDamage(result.damage);
          this.updateHealth(result.health);
        }
      },
    });
  }
}
```

**End-to-End Test Scenario:**

1. Player's turn starts
2. Player adjusts angle and power
3. Player clicks fire button
4. Projectile fired and trajectory calculated
5. Collision detected
6. Damage calculated and applied
7. Health updated
8. Game state synchronized
9. Turn switches

**Definition of Done:**

- Player can aim and fire weapon
- Physics engine calculates trajectory
- Collisions detected and damage applied
- Health updated and synchronized
- Turn switches after firing

---

**TASK-VS-3-4-3: Turn Management System (BE + FE)**

**Description:**
Implement turn management system including turn timers, turn switching, and turn indicators. This is shared infrastructure used by movement and firing features.

**Related Diagrams & Documents:**

- [Turn State Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/state-diagrams/turn-state.puml) - Turn state transitions
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml) - TurnManager structure

**Acceptance Criteria:**

- [ ] TurnManager.startTurn() method implemented
- [ ] Turn timer (15 seconds) implemented
- [ ] Turn switching logic implemented
- [ ] Turn timeout handling (auto-switch if no action)
- [ ] Turn state stored in Redis
- [ ] Turn indicator displayed on frontend
- [ ] Turn timer countdown displayed
- [ ] Turn switches after action or timeout
- [ ] Unit tests for turn management

**Technical Details:**

**Backend - Turn Service:**
**File:** `src/service/TurnManager.ts`

```typescript
export class TurnManager {
  startTurn(matchId: string, playerId: string): void {
    // 1. Set current turn to playerId
    // 2. Start 15-second timer
    // 3. Emit turn-started event
    // 4. If timer expires, switch turn automatically
  }

  switchTurn(matchId: string): void {
    // 1. Get current turn
    // 2. Switch to other player
    // 3. Start new turn
    // 4. Emit turn-switched event
  }

  handleTurnTimeout(matchId: string): void {
    // 1. Switch turn automatically
    // 2. Emit turn-timeout event
  }
}
```

**Frontend - Turn Indicator:**
**File:** `src/app/arena/components/game-arena/game-arena.component.ts`

```typescript
get isMyTurn(): boolean {
  return this.gameState?.currentTurn === this.playerId;
}

get turnTimeRemaining(): number {
  return this.gameState?.turnTimer || 0;
}
```

**End-to-End Test Scenario:**

1. Game starts, player 1's turn
2. Turn timer starts (15 seconds)
3. Player 1 takes action (move or fire)
4. Turn switches to player 2
5. If no action, turn auto-switches after timeout
6. Turn indicator updates for both players

**Definition of Done:**

- Turn system works correctly
- Turn timer displayed and functional
- Turn switches after action or timeout
- Turn indicator shows current player

---

### VS-3-5: Player can see match result

**User Story:** As a player, I want to see the match result so that I know if I won or lost and what my score was.

**Acceptance Criteria:**

- [ ] Win condition detected (health reaches 0 or match timeout)
- [ ] Match result calculated (winner, scores, stats)
- [ ] Match result displayed on screen
- [ ] Match result stored in database
- [ ] Player can return to dashboard
- [ ] Match history updated (if Profile Service integrated)

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-3-5-1: Win Condition & Match Result (BE + FE)**

**Description:**
Implement win condition detection, match result calculation, and match result display. This task combines all match result-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Match result flow
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml) - WinConditionChecker structure

**Acceptance Criteria:**

- [ ] WinConditionChecker.checkWinCondition() method implemented
- [ ] Win conditions: health reaches 0, match timeout
- [ ] Match result calculated (winner, scores, stats)
- [ ] Match result stored in MongoDB (if integrated)
- [ ] Match result emitted to players
- [ ] Match result screen component created
- [ ] Winner displayed
- [ ] Scores and stats displayed
- [ ] Return to dashboard button
- [ ] End-to-end test: Match ends → Result calculated → Result displayed → Return to dashboard

**Technical Details:**

**Backend - Win Condition Service:**
**File:** `src/service/WinConditionChecker.ts`

```typescript
export class WinConditionChecker {
  checkWinCondition(gameState: GameState): WinCondition | null {
    // 1. Check if any player health <= 0
    // 2. Check if match timeout reached
    // 3. Return win condition if met, null otherwise
  }

  calculateMatchResult(gameState: GameState, winCondition: WinCondition): MatchResult {
    // 1. Determine winner
    // 2. Calculate final scores
    // 3. Calculate stats (damage dealt, accuracy, etc.)
    // 4. Return match result
  }
}
```

**Backend - Match Result Storage:**
**File:** `src/service/MatchResultProcessor.ts`

```typescript
export class MatchResultProcessor {
  async processMatchResult(matchId: string, matchResult: MatchResult): Promise<void> {
    // 1. Store match result in MongoDB
    // 2. Update player profiles (if Profile Service integrated)
    // 3. Update leaderboard (if Leaderboard Service integrated)
    // 4. Clean up game room
  }
}
```

**Frontend - Match Result Component:**
**File:** `src/app/arena/components/match-result/match-result.component.ts`

```typescript
@Component({
  selector: "app-match-result",
  templateUrl: "./match-result.component.html",
})
export class MatchResultComponent {
  matchResult: MatchResult | null = null;

  constructor(
    private gameService: GameService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.gameService.getMatchResult().subscribe((result) => {
      this.matchResult = result;
    });
  }

  returnToDashboard(): void {
    this.router.navigate(["/dashboard"]);
  }
}
```

**End-to-End Test Scenario:**

1. Match ends (health reaches 0 or timeout)
2. Win condition detected
3. Match result calculated
4. Match result stored
5. Players notified of match result
6. Match result screen displayed
7. Player can return to dashboard

**Definition of Done:**

- Win conditions detected correctly
- Match result calculated and displayed
- Match result stored in database
- Player can return to dashboard

---

## Integration Testing

**Related Diagrams:**

- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml) - Complete matchmaking flow
- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/gameplay-flow.puml) - Complete gameplay flow
- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Match result flow

### End-to-End Test Scenario

```
1. Player logs in
2. Player clicks "Play" button
3. Player joins matchmaking queue
4. Player sees queue status (position, ETA)
5. Matchmaking algorithm finds match (bot opponent)
6. Player gets matched
7. Game room created
8. Player enters game room
9. Player sees game arena and heroes
10. Player's turn starts
11. Player moves hero (left/right)
12. Player aims weapon (angle, power)
13. Player fires weapon
14. Projectile trajectory calculated
15. Collision detected
16. Damage applied
17. Health updated
18. Turn switches
19. Opponent (bot) takes turn
20. Match continues until win condition
21. Match result displayed
22. Player returns to dashboard
```

**Test should pass:** ✅ All steps complete without errors

---

## Security Requirements

**Related Documents:**

- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Complete security implementation guide

### WebSocket Security

- JWT token validation on WebSocket connections
- Player authentication before joining queue
- Player authorization for game actions (only current player can act)
- Rate limiting on game actions

### Game State Security

- Game state validation on server side
- No client-side game state modification
- All game logic validated server-side
- Anti-cheat measures (action validation, timing checks)

---

## Dependencies

### Prerequisites

- ✅ EPIC-VS-1 (Foundation) must be completed
  - [EPIC-VS-1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/EPICS/EPIC_VS_1_FOUNDATION.md)
- ✅ EPIC-VS-2 (Authentication) must be completed
  - [EPIC-VS-2 Authentication Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/EPICS/EPIC_VS_2_AUTHENTICATION.md)
- ✅ Redis running (via Docker Compose)
  - [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)
- ✅ MongoDB running (via Docker Compose)
  - [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)

### Blocking Issues

- EPIC-VS-1 (Foundation) must be completed first
- EPIC-VS-2 (Authentication) must be completed first

---

## Technical Debt & Future Enhancements

### Not in Scope (For Future Epics)

- Hero selection (VS-4 or later)
- Weapon selection (VS-4 or later)
- Arena selection (VS-4 or later)
- Real player matching (VS-4 or later)
- Complex scoring (combos, saves, accuracy bonuses - VS-4 or later)
- Profile integration (VS-4 or later)
- Leaderboard integration (VS-4 or later)
- Disconnection handling (VS-4 or later)
- Reconnection handling (VS-4 or later)

### Marked for Future

- [ ] Hero selection before matchmaking
- [ ] Weapon selection before match
- [ ] Arena selection/voting
- [ ] Real player matching algorithm
- [ ] Complex scoring system
- [ ] Profile and leaderboard integration
- [ ] Disconnection and reconnection handling

---

## Labels

epic:vertical-slice, epic:gameplay, priority:high, milestone:VS-3

## Milestone

VS-3: First Playable Match

## Related Epics

- EPIC-VS-1: Foundation & Infrastructure Setup (prerequisite)
- EPIC-VS-2: Player Authentication & Identity (prerequisite)
- EPIC-VS-4: Profile & Progression (depends on VS-3)
- EPIC-VS-5: Full Game Features (depends on VS-3)

```

---

## How to Use This Template

1. **Create Epic Issue:**
   - Copy the EPIC-VS-3 template above
   - Create issue in GitHub
   - Assign to milestone "VS-3: First Playable Match"

2. **Create Story Issues:**
   - For each VS-3-X story, create a separate issue
   - Link to EPIC-VS-3 as parent
   - Copy tasks from Phase 5, 6, and 7 documents
   - Link to Phase documents for technical reference

3. **Create Task Issues:**
   - For each task, create subtask or separate issue
   - Link to story as parent
   - Reference Phase 5, 6, and 7 documents for technical details

4. **Track Progress:**
   - Use GitHub Projects Kanban board
   - Move stories through: Backlog → To Do → In Progress → Review → Done
   - Update epic when all stories complete

---

**This template demonstrates how to:**
1. Structure vertical slice epics with player focus
2. Reference Phase documents for technical details
3. Break down into player-focused stories
4. Pull tasks from Phase documents
5. Define clear acceptance criteria and definitions of done
6. Consolidate BE + FE tasks for end-to-end testing
```
