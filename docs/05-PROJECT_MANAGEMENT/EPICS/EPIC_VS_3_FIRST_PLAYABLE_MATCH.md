# EPIC-VS-3: First Playable Match - End-to-End Gameplay from Queue to Match Result

**Note:** All technical implementation details from Phase 5 (Matchmaking), Phase 6 (Game Engine), and Phase 7 (Frontend - gameplay parts) have been consolidated into this file. You no longer need to reference multiple Phase documents when creating GitHub issues.

---

## EPIC-VS-3: First Playable Match - End-to-End Gameplay from Queue to Match Result

### Issue Template

**Title:** EPIC-VS-3: First Playable Match - End-to-End Gameplay from Queue to Match Result

**Description:**

## Overview

Implement the third vertical slice where a player can play a complete match from start to finish. This epic enables the core gameplay experience - players can join a matchmaking queue, get matched, enter a game room, play a turn-based artillery battle, and see the match result. This is the first playable version of the game.

**This is the third vertical slice** - it enables players to actually play the game end-to-end.

## Vertical Slice Goal

A player can:

1. Click "Play" and join matchmaking queue
2. Get matched (with another player for MVP)
3. Enter game room and see arena
4. Play a complete match (move, fire shots, take turns)
5. See match result (win/loss)

## Success Criteria

- [ ] Player can click "Play" button and join matchmaking queue
- [ ] Matchmaking queue shows position and estimated wait time
- [ ] Player gets matched (with another player for MVP)
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

- Another player matching (2-player matching for MVP, can test with incognito window)
- Default hero (no hero selection yet)
- Default weapon (no weapon selection yet)
- Default arena (no arena selection yet)
- Basic physics (no fancy effects)
- Simple scoring (basic win/loss, no complex scoring yet)

**What's Deferred:**

- Hero selection (VS-4 or later)
- Weapon selection (VS-4 or later)
- Arena selection (VS-4 or later)
- Advanced skill-based matching algorithm (VS-4 or later)
- Complex scoring (combos, saves, etc. - VS-4 or later)

## Technical References

### Phase Documents (Technical Implementation Details)

This epic references Phase 5 (Matchmaking), Phase 6 (Game Engine), and Phase 7 (Frontend) for technical specifications.

- **Matchmaking Service:** See Phase 5 (PHASE-5 issue) - STORY-5-1, STORY-5-3, STORY-5-5, STORY-5-6
- **Game Engine Service:** See Phase 6 (PHASE-6 issue) - STORY-6-1, STORY-6-2, STORY-6-3, STORY-6-4, STORY-6-5, STORY-6-6
- **Frontend:** See Phase 7 (PHASE-7 issue) - Matchmaking UI, Game Arena UI, Gameplay UI

### Architecture References

**Sequence Diagrams:**

- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png) - Complete matchmaking flow
- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Gameplay%20Flow.png) - Complete gameplay flow
- [Movement Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Movement%20Flow.png) - Hero movement flow
- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Post-Match%20Flow.png) - Match result flow
- [Sequence Diagrams Index](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/README.md)

**Class Diagrams:**

- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Matchmaking%20Service%20Class%20Diagram.png)
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Game%20Engine%20Service%20Class%20Diagram.png)
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png)

**State Diagrams:**

- [Game State Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/state-diagrams/Game%20State%20Diagram.png) - Game state transitions
- [Turn State Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/state-diagrams/Turn%20State%20Diagram.png) - Turn state transitions

**Architecture Documents:**

- [System Architecture - Matchmaking Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#24-matchmaking-service)
- [System Architecture - Game Engine Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#25-game-engine-service)
- [Matchmaking Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md)
- [Game Engine Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md)
- [Frontend Components Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) - WebSocket patterns

## Stories (Player Experience)

### VS-3-1: Matchmaking Queue Join with WebSocket and Real-Time Status Updates

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

**TASK-VS-3-1-1: Matchmaking Service Foundation - Node.js, Express, Socket.io, Redis Setup (BE)**

**Description:**
Set up the Node.js project structure, dependencies, and configuration for the Matchmaking Service. This is a prerequisite for all other matchmaking tasks.

**Related Diagrams & Documents:**

- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Matchmaking%20Service%20Class%20Diagram.png)
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

**Reference Documentation:**

- [Matchmaking Service Low-Level Design](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) - Complete service architecture and component design
- [System Architecture - Matchmaking Service](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#24-matchmaking-service) - Service integration and communication patterns

**Project Structure Setup:**

- Create Node.js/TypeScript project structure in `backend-services/matchmaking-service/` directory
- Set up TypeScript configuration with appropriate compiler options
- Create source directory structure following clean architecture:
  - `src/index.ts` - Application entry point
  - `src/config/` - Configuration files (Redis, Socket.io, environment variables)
  - `src/controllers/` - WebSocket and HTTP request handlers
  - `src/services/` - Business logic layer (MatchmakingService, MatchmakingEngine, QueueManager, etc.)
  - `src/middleware/` - Authentication, error handling, and logging middleware
  - `src/routes/` - HTTP route definitions
  - `src/utils/` - Utility functions (logger, validators)
  - `src/types/` - TypeScript type definitions
  - `src/models/` - Data models (Hero, QueueEntry, Lobby)
- Create `package.json` with project metadata
- Create `tsconfig.json` for TypeScript compilation
- Create `.env.example` file documenting required environment variables
- Create `README.md` documenting service overview, setup, and usage

**Maven Dependencies (package.json):**

- Add express dependency for HTTP server
- Add socket.io dependency for WebSocket server
- Add redis dependency for Redis client
- Add jsonwebtoken dependency for JWT token validation
- Add dotenv dependency for environment variable management
- Add typescript dependency for TypeScript compilation
- Add type definitions: @types/node, @types/express, @types/socket.io

**Environment Variables Configuration:**

- Configure PORT environment variable (default 3002)
- Configure REDIS_HOST environment variable (default redis)
- Configure REDIS_PORT environment variable (default 6379)
- Configure JWT_SECRET environment variable (read from shared JWT secret)
- Document all environment variables in `.env.example` file

---

**TASK-VS-3-1-2: Join Matchmaking Queue - Redis Sorted Sets, Socket.io Events, Matchmaking UI (BE + FE)**

**Description:**
Implement complete join queue feature including backend queue management and frontend matchmaking UI. This task combines all queue-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png) - Join queue flow
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Matchmaking%20Service%20Class%20Diagram.png) - Queue service structure
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png) - MatchmakingService and components

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

**QueueManager Implementation Requirements:**

- Create QueueManager class in `src/services/` directory
- Implement `addToQueue(playerId, heroId, globalScore, socketId)` method:
  - Add player to Redis sorted set with key "matchmaking:queue" and score equal to globalScore
  - Store queue entry metadata (playerId, heroId, socketId, timestamp) in Redis hash
  - Calculate player's position in queue based on sorted set rank
  - Calculate estimated wait time based on queue position and historical match times
  - Return QueueStatus object with position and estimated wait time
- Implement `removeFromQueue(playerId)` method:
  - Remove player from Redis sorted set
  - Remove queue entry metadata from Redis hash
- Implement `getQueueStatus(playerId)` method:
  - Retrieve player's position from Redis sorted set
  - Calculate estimated wait time
  - Return QueueStatus object
- Use Redis client for all queue operations
- Handle Redis connection errors gracefully

**Backend - Socket.io Handler:**
**File:** `src/controllers/MatchmakingController.ts`

**MatchmakingController Implementation Requirements:**

- Create MatchmakingController class in `src/controllers/` directory
- Set up Socket.io connection handler:
  - Listen for "connection" event on Socket.io server
  - Extract JWT token from connection handshake
  - Validate JWT token using authentication middleware
  - Store socket connection with player ID mapping
- Implement "join-queue" event handler:
  - Validate JWT token from socket connection
  - Extract playerId from event data
  - Get player global score from Profile Service (or default to 0 if service not available)
  - Assign default hero ID (single default hero for MVP)
  - Call QueueManager.addToQueue() with playerId, heroId, globalScore, and socketId
  - Emit "queue-status" event to player with QueueStatus object
  - Handle errors and emit error events if queue join fails
- Implement "leave-queue" event handler:
  - Extract playerId from event data
  - Call QueueManager.removeFromQueue() to remove player from queue
  - Emit "queue-left" confirmation event to player
  - Handle errors gracefully

**Frontend - Matchmaking Component:**
**File:** `src/app/matchmaking/components/matchmaking/matchmaking.component.ts`

**MatchmakingComponent Implementation Requirements:**

- Create MatchmakingComponent class in `src/app/matchmaking/components/matchmaking/` directory
- Add `@Component` decorator with selector "app-matchmaking" and template URL
- Add queueStatus property (QueueStatus | null) to store current queue status
- Add isInQueue property (boolean) to track queue membership state
- Inject MatchmakingService via constructor
- Implement `joinQueue()` method:
  - Call MatchmakingService.joinQueue() method
  - Subscribe to Observable response
  - On success: Update queueStatus and set isInQueue to true
  - Handle errors and display error messages
- Implement `leaveQueue()` method:
  - Call MatchmakingService.leaveQueue() method
  - Subscribe to Observable response
  - On success: Set isInQueue to false and clear queueStatus
  - Handle errors gracefully
- Display queue status in template (position, estimated wait time)
- Display loading state during queue operations

**Frontend - MatchmakingService:**
**File:** `src/app/services/matchmaking.service.ts`

**MatchmakingService Implementation Requirements:**

- Create MatchmakingService class in `src/app/services/` directory
- Add `@Injectable()` decorator for Angular dependency injection
- Maintain private Socket instance for WebSocket connection
- Initialize Socket.io connection to Matchmaking Service endpoint
- Implement `joinQueue()` method:
  - Emit "join-queue" event to Socket.io server with playerId from AuthService
  - Return Observable that listens for "queue-status" events from server
  - Handle connection errors and emit error events
- Implement `leaveQueue()` method:
  - Emit "leave-queue" event to Socket.io server with playerId from AuthService
  - Return Observable that completes after leave confirmation
  - Handle connection errors gracefully
- Inject AuthService to get current user ID
- Handle Socket.io disconnection and reconnection scenarios

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

### VS-3-2: Player Matching with Another Player and Game Room Creation

**User Story:** As a player, I want to get matched with an opponent so that I can start playing a match.

**Acceptance Criteria:**

- [ ] Matchmaking algorithm finds match (matches two players for MVP)
- [ ] Match created with two players
- [ ] Game room created in Game Engine Service
- [ ] Players notified of match found
- [ ] Players redirected to game room
- [ ] Game room state initialized (default hero, default weapon, default arena)

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-3-2-1: Matchmaking Algorithm - Two Player Matching and Match Finding Engine (BE)**

**Description:**
Implement basic matchmaking algorithm that matches two players together for MVP. This is a simplified version that will be enhanced in later epics. For testing, players can use incognito windows to test with two accounts.

**Related Diagrams & Documents:**

- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png) - Match found flow
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Matchmaking%20Service%20Class%20Diagram.png) - MatchmakingEngine structure

**Acceptance Criteria:**

- [ ] MatchmakingEngine.findMatch() method implemented
- [ ] Two-player matching logic (for MVP)
- [ ] Match created with two players
- [ ] Match data sent to Game Engine Service
- [ ] Players notified via Socket.io `match-found` event
- [ ] Queue entry removed after match found
- [ ] Unit tests for matchmaking algorithm

**Technical Details:**

**Backend - Matchmaking Engine:**
**File:** `src/services/MatchmakingEngine.ts`

**MatchmakingEngine Implementation Requirements:**

- Create MatchmakingEngine class in `src/services/` directory
- Implement `findMatch(playerId)` method:
  - Get player data from queue using QueueManager
  - For MVP: Find another player in the queue to match with (simple FIFO or first available)
  - Create match object with both players' data
  - Send match data to Game Engine Service via HTTP API or message queue
  - Notify both players via Socket.io "match-found" event with match details
  - Remove both players from queue after successful match creation
  - Return Match object or null if match creation fails
- Implement matching logic:
  - Get first two players from queue (simple matching for MVP)
  - Assign default hero ID to both players ("default-hero")
  - Create match with both player IDs
  - Return Match object with both players
- Handle errors during match creation and notify players of failures

**End-to-End Test Scenario:**

1. Two players join queue
2. Matchmaking algorithm runs
3. Two players matched together
4. Match created
5. Game room created in Game Engine
6. Both players notified of match found
7. Players redirected to game room

**Definition of Done:**

- Two players get matched together
- Match created and sent to Game Engine
- Both players notified and redirected to game

---

**TASK-VS-3-2-2: Game Room Creation - GameRoomManager with Default State Initialization (BE)**

**Description:**
Implement game room creation in Game Engine Service when match is assigned from Matchmaking Service.

**Related Diagrams & Documents:**

- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Gameplay%20Flow.png) - Game room creation
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Game%20Engine%20Service%20Class%20Diagram.png) - GameRoomManager structure
- [Game State Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/state-diagrams/Game%20State%20Diagram.png) - State transitions

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

**GameRoomManager Implementation Requirements:**

- Create GameRoomManager class in `src/service/` directory
- Implement `createGameRoom(matchId, matchData)` method:
  - Create game room object with match data (players, match ID)
  - Initialize game state with default values:
    - Assign default hero to both players
    - Assign default weapon (single weapon for MVP)
    - Select default arena
    - Set initial hero positions (left and right sides of arena)
    - Set health to 100 (or default HP value)
    - Initialize scores to 0 for both players
    - Initialize moves remaining to 4 per player
    - Set current turn to player 1
  - Store game state in Redis with key format "game:{matchId}"
  - Create Socket.io room for match communication
  - Emit "game-started" event to all players in the room with initial game state
  - Return GameRoom object
- Handle errors during game room creation and notify players of failures

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

### VS-3-3: Game Arena Rendering with Hero Display and Real-Time HUD Synchronization

**User Story:** As a player, I want to see the game arena and my hero so that I can understand the game state and prepare for my turn.

**Acceptance Criteria:**

- [ ] Game arena rendered on screen
- [ ] Player's hero visible at starting position
- [ ] Opponent's hero visible at starting position
- [ ] Arena terrain/background displayed
- [ ] Game HUD visible (health, score, turn indicator)
- [ ] Game state synchronized from server

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-3-3-1: Game Arena UI - Phaser 3 Canvas, Hero Sprites, HUD with Health/Scores/Turn (FE)**

**Description:**
Implement game arena UI component that displays the game state, heroes, and arena. This includes the game canvas, HUD, and real-time state synchronization.

**Related Diagrams & Documents:**

- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png) - GameService and components
- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Gameplay%20Flow.png) - Game state updates

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

**GameArenaComponent Implementation Requirements:**

- Create GameArenaComponent class in `src/app/arena/components/game-arena/` directory
- Add `@Component` decorator with selector "app-game-arena" and template URL
- Implement OnInit and OnDestroy interfaces
- Add gameState property (GameState | null) to store current game state
- Add gameScene property (Phaser.Scene | null) to store Phaser game scene instance
- Inject GameService via constructor
- Implement `ngOnInit()` method:
  - Call GameService.connectToGame() with matchId
  - Subscribe to GameService.getGameState() Observable
  - On state update: Update gameState and call updateGameScene()
- Implement `updateGameScene(state)` private method:
  - Update Phaser scene with new game state
  - Update hero sprite positions based on state
  - Update health bar displays for both players
  - Update score displays
  - Update turn indicator to show current player's turn
- Implement `ngOnDestroy()` method to clean up subscriptions and Phaser scene

**Frontend - GameService:**
**File:** `src/app/services/game.service.ts`

**GameService Implementation Requirements:**

- Create GameService class in `src/app/services/` directory
- Add `@Injectable()` decorator for Angular dependency injection
- Maintain private Socket instance for WebSocket connection
- Create BehaviorSubject for game state (initialized to null)
- Inject AuthService to get JWT token
- Implement `connectToGame(matchId)` method:
  - Initialize Socket.io connection to Game Engine Service URL
  - Pass matchId as query parameter
  - Pass JWT token in authentication handshake
  - Listen for "game-started" event and update gameStateSubject
  - Listen for "game-state-update" event and update gameStateSubject
  - Handle connection errors and reconnection scenarios
- Implement `getGameState()` method:
  - Return Observable from gameStateSubject for components to subscribe
- Handle Socket.io disconnection and cleanup resources

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

### VS-3-4: Hero Movement, Weapon Firing with Physics Engine, and Turn Management

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

**TASK-VS-3-4-1: Movement System - Backend Validation, 4 Moves Limit, Frontend Controls (BE + FE)**

**Description:**
Implement hero movement system including backend movement validation and frontend movement controls. This task combines all movement-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Movement Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Movement%20Flow.png) - Movement flow
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Game%20Engine%20Service%20Class%20Diagram.png) - MovementManager structure

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

**MovementManager Implementation Requirements:**

- Create MovementManager class in `src/service/` directory
- Implement `validateMove(gameState, playerId, direction)` method:
  - Check if it's the player's turn (compare playerId with currentTurn in gameState)
  - Check if player has moves remaining (verify movesRemaining > 0, max 4 per match)
  - Check if movement direction is valid (only "left" or "right" allowed)
  - Check if movement is within arena bounds (hero position + direction is valid)
  - Return true if all validations pass, false otherwise
- Implement `applyMove(gameState, playerId, direction)` method:
  - Update hero position based on direction (increment or decrement X coordinate)
  - Decrement moves remaining for the player
  - Update game state with new position and moves count
  - Return updated GameState object
- Handle edge cases (boundary limits, invalid directions)

**Backend - Socket.io Handler:**
**File:** `src/controller/GameEngineController.ts`

**GameEngineController.player-move Handler Implementation Requirements:**

- Add "player-move" event handler to Socket.io connection
- Extract matchId, playerId, and direction from event data
- Retrieve game state from Redis using matchId (key: "game:{matchId}")
- Validate move using MovementManager.validateMove() method
- If validation fails, emit error event to player and return
- If validation passes, apply move using MovementManager.applyMove() method
- Update game state in Redis with new state
- Emit "game-state-update" event to all players in the Socket.io room
- Handle errors gracefully and notify players of failures

**Frontend - Movement Controls:**
**File:** `src/app/arena/components/game-arena/game-arena.component.ts`

**Movement Controls Implementation Requirements:**

- Implement `onMove(direction)` method in GameArenaComponent:
  - Check if it's player's turn (compare currentTurn with playerId)
  - Check if player can move using canMove() method
  - If both conditions pass, call GameService.moveHero() with matchId, playerId, and direction
  - Subscribe to Observable response
  - On success: Update gameState with returned updated state
  - Handle errors and display error messages
- Implement `canMove()` method:
  - Check if player has moves remaining (playerMovesRemaining > 0)
  - Return boolean indicating if move is allowed
- Add keyboard event listeners for arrow keys (left/right)
- Add UI buttons for movement controls
- Display moves remaining counter in UI

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

**TASK-VS-3-4-2: Weapon Firing System - Matter.js Physics, Trajectory, Collision, Damage (BE + FE)**

**Description:**
Implement weapon firing system including backend physics calculation and frontend firing controls. This task combines all firing-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Gameplay%20Flow.png) - Weapon firing flow
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Game%20Engine%20Service%20Class%20Diagram.png) - PhysicsEngine structure

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

**PhysicsEngine Implementation Requirements:**

- Create PhysicsEngine class in `src/service/` directory
- Initialize Matter.js physics engine and world
- Maintain private engine and world instances
- Implement `calculateTrajectory(startPos, angle, power)` method:
  - Calculate projectile trajectory using physics equations (projectile motion)
  - Consider gravity, initial velocity (from power), and launch angle
  - Generate trajectory points for visualization
  - Return Trajectory object with path points
- Implement `fireProjectile(gameState, playerId, angle, power)` method:
  - Create projectile body in Matter.js world at hero's position
  - Apply initial velocity based on angle and power
  - Simulate trajectory step by step until collision or ground hit
  - Check for collisions with opponent hero or arena terrain
  - Calculate damage if collision detected (based on impact velocity and distance)
  - Update opponent's health in game state
  - Return ProjectileResult object with hit status, damage, and updated health
- Handle edge cases (projectile out of bounds, no collision)

**Backend - Socket.io Handler:**
**File:** `src/controller/GameEngineController.ts`

**GameEngineController.player-fire Handler Implementation Requirements:**

- Add "player-fire" event handler to Socket.io connection
- Extract matchId, playerId, angle, and power from event data
- Retrieve game state from Redis using matchId
- Validate it's the player's turn (compare playerId with currentTurn)
- If validation fails, emit error event and return
- Call PhysicsEngine.fireProjectile() with game state, playerId, angle, and power
- Update game state with projectile result (health changes, scores)
- Check win condition using WinConditionChecker
- Update game state in Redis
- Emit "game-state-update" event to all players with updated state
- If match not ended, switch turn to opponent using TurnManager
- If match ended, emit "match-ended" event with match result

**Frontend - Firing Controls:**
**File:** `src/app/arena/components/game-arena/game-arena.component.ts`

**Firing Controls Implementation Requirements:**

- Implement `onFire(angle, power)` method in GameArenaComponent:
  - Check if it's player's turn (compare currentTurn with playerId)
  - If not player's turn, return early
  - Call GameService.fireWeapon() with matchId, playerId, angle, and power
  - Subscribe to Observable response
  - On success: Animate projectile along trajectory path
  - If hit detected: Display damage animation and update health bars
  - Update game state with result
  - Handle errors and display error messages
- Add aiming controls (angle slider or mouse drag)
- Add power control (power slider or mouse drag distance)
- Add fire button to trigger shot
- Display aiming line or trajectory preview before firing
- Animate projectile movement along calculated trajectory

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

**TASK-VS-3-4-3: Turn Management System - 15s Timer, Turn Switching, Timeout Handling (BE + FE)**

**Description:**
Implement turn management system including turn timers, turn switching, and turn indicators. This is shared infrastructure used by movement and firing features.

**Related Diagrams & Documents:**

- [Turn State Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/state-diagrams/Turn%20State%20Diagram.png) - Turn state transitions
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Game%20Engine%20Service%20Class%20Diagram.png) - TurnManager structure

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

**TurnManager Implementation Requirements:**

- Create TurnManager class in `src/service/` directory
- Implement `startTurn(matchId, playerId)` method:
  - Set current turn to playerId in game state
  - Start 15-second countdown timer
  - Store timer reference for timeout handling
  - Emit "turn-started" event to all players with playerId and timer duration
  - If timer expires without action, automatically call handleTurnTimeout()
- Implement `switchTurn(matchId)` method:
  - Retrieve current game state from Redis
  - Determine other player (switch between player 1 and player 2)
  - Set current turn to other player
  - Start new turn for the other player
  - Update game state in Redis
  - Emit "turn-switched" event to all players
- Implement `handleTurnTimeout(matchId)` method:
  - Switch turn automatically to opponent
  - Emit "turn-timeout" event to notify players of automatic turn switch
  - Update game state in Redis
- Handle timer cleanup and cancellation when player takes action

**Frontend - Turn Indicator:**
**File:** `src/app/arena/components/game-arena/game-arena.component.ts`

**Turn Indicator Implementation Requirements:**

- Implement `isMyTurn` getter property:
  - Compare gameState.currentTurn with playerId
  - Return boolean indicating if it's the current player's turn
  - Used in template to conditionally enable/disable controls
- Implement `turnTimeRemaining` getter property:
  - Get turn timer value from gameState
  - Return number of seconds remaining (default to 0 if not available)
  - Used in template to display countdown timer
- Display turn indicator in UI showing current player's turn
- Display countdown timer showing seconds remaining
- Update UI when turn switches (disable controls for non-active player)
- Highlight active player's UI elements

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

### VS-3-5: Match Result Display with Win Condition Detection and Statistics

**User Story:** As a player, I want to see the match result so that I know if I won or lost and what my score was.

**Acceptance Criteria:**

- [ ] Win condition detected (health reaches 0 or match timeout)
- [ ] Match result calculated (winner, scores, stats)
- [ ] Match result displayed on screen
- [ ] Match result stored in database
- [ ] Player can return to dashboard
- [ ] Match history updated (if Profile Service integrated)

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-3-5-1: Win Condition Detection and Match Result - Winner, Scores, Stats, Storage (BE + FE)**

**Description:**
Implement win condition detection, match result calculation, and match result display. This task combines all match result-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Post-Match%20Flow.png) - Match result flow
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Game%20Engine%20Service%20Class%20Diagram.png) - WinConditionChecker structure

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

**WinConditionChecker Implementation Requirements:**

- Create WinConditionChecker class in `src/service/` directory
- Implement `checkWinCondition(gameState)` method:
  - Check if any player's health is less than or equal to 0
  - Check if match timeout has been reached (maximum match duration)
  - If either condition is met, create WinCondition object with winner and reason
  - Return WinCondition object if condition met, null otherwise
- Implement `calculateMatchResult(gameState, winCondition)` method:
  - Determine winner based on win condition (player with health > 0, or highest score if timeout)
  - Calculate final scores for both players
  - Calculate match statistics:
    - Total damage dealt by each player
    - Accuracy (hits vs total shots)
    - Number of moves used
    - Match duration
  - Create MatchResult object with winner, scores, and statistics
  - Return MatchResult object
- Handle edge cases (draw conditions, invalid game states)

**Backend - Match Result Storage:**
**File:** `src/service/MatchResultProcessor.ts`

**MatchResultProcessor Implementation Requirements:**

- Create MatchResultProcessor class in `src/service/` directory
- Implement `processMatchResult(matchId, matchResult)` method:
  - Store match result in MongoDB (match history collection)
  - If Profile Service is integrated:
    - Update player profiles with match statistics
    - Update global scores based on match result
    - Update win/loss records
  - If Leaderboard Service is integrated:
    - Update leaderboard rankings with new scores
  - Clean up game room from Redis (remove game state)
  - Clean up Socket.io room
  - Handle errors gracefully and log processing failures
- Ensure all operations are atomic or have proper error handling
- Emit "match-result-processed" event after successful processing

**Frontend - Match Result Component:**
**File:** `src/app/arena/components/match-result/match-result.component.ts`

**MatchResultComponent Implementation Requirements:**

- Create MatchResultComponent class in `src/app/arena/components/match-result/` directory
- Add `@Component` decorator with selector "app-match-result" and template URL
- Add matchResult property (MatchResult | null) to store match result data
- Inject GameService and Router via constructor
- Implement `ngOnInit()` method:
  - Subscribe to GameService.getMatchResult() Observable
  - On result received: Update matchResult property
  - Handle errors and display error messages
- Implement `returnToDashboard()` method:
  - Navigate to dashboard route using Router
  - Clean up any subscriptions or resources
- Display match result in template:
  - Show winner (winner name or "You Win" / "You Lose")
  - Display final scores for both players
  - Display match statistics (damage dealt, accuracy, etc.)
  - Show "Return to Dashboard" button
- Handle component cleanup in ngOnDestroy()

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

- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png) - Complete matchmaking flow
- [Gameplay Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Gameplay%20Flow.png) - Complete gameplay flow
- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Post-Match%20Flow.png) - Match result flow

### End-to-End Test Scenario

1. Player logs in
2. Player clicks "Play" button
3. Player joins matchmaking queue
4. Player sees queue status (position, ETA)
5. Matchmaking algorithm finds match (matches two players)
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
19. Opponent takes turn
20. Match continues until win condition
21. Match result displayed
22. Player returns to dashboard

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
- Advanced skill-based matching algorithm (VS-4 or later)
- Complex scoring (combos, saves, accuracy bonuses - VS-4 or later)
- Profile integration (VS-4 or later)
- Leaderboard integration (VS-4 or later)
- Disconnection handling (VS-4 or later)
- Reconnection handling (VS-4 or later)

### Marked for Future

- [ ] Hero selection before matchmaking
- [ ] Weapon selection before match
- [ ] Arena selection/voting
- [ ] Advanced skill-based matching algorithm
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
