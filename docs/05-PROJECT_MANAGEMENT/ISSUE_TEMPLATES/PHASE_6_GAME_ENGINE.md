# Phase 6: Game Engine Service

**⚠️ NOTE: This is REFERENCE DOCUMENTATION for Game Engine Service technical details.**

**For implementation planning, see:**

- EPIC-3: Core Gameplay Loop (uses Game Engine Service details from this file)
- EPIC-5: Progression & Competition (uses Game Engine Service post-match details)

**This phase file contains:**

- Game Engine Service architecture
- Design patterns and game server best practices
- API specifications
- Code structure examples
- Technical implementation details
- Stories and tasks for Game Engine Service

**Epics will reference this file for technical specs, but implementation follows epic-based feature development (game studio approach).**

---

**Copy and paste these templates directly into GitHub Issues.**

---

## PHASE-6: Game Engine Service - Technical Reference

### Issue Template:

```
Title: PHASE-6: Game Engine Service

Description:
## Overview
Implement the real-time game engine for 2D artillery battles using Node.js, Socket.io, and Matter.js. This phase document provides technical reference for the Game Engine Service that manages game rooms, turn system, movement, physics, scoring, win conditions, and disconnections. The service follows clean architecture and game server best practices.

## Goals
- Real-time turn-based gameplay loop
- Game room creation and lifecycle management
- Movement system (4 moves per game, left/right only)
- Physics-based projectile system with Matter.js
- Scoring based on accuracy, combos, and saves
- Health system and win condition detection
- Disconnection and rejoin handling

## Success Criteria
- [ ] Players can play a full match end-to-end
- [ ] Turn timing and limits enforced
- [ ] Physics and collisions behave as designed
- [ ] Scores and results propagated to Profile & Leaderboard services
- [ ] Robust handling of disconnects and rejoins
- [ ] Unit tests for core logic and integration tests for key flows

## Technical Architecture

### Service Details
Based on [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 2.5:
- **Technology:** Node.js (Express + Socket.io + Matter.js)
- **Port:** 5002
- **Data Store:** Redis (game state, rooms), MongoDB (match history via Game Engine or separate service)
- **Communication:** WebSocket (Socket.io) and internal REST calls

### Key Components
Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md):
- **GameGateway** - Socket.io event layer
- **GameRoomService** - Room creation, assignment, and cleanup
- **TurnService** - Turn timers, switching, and limits
- **MovementService** - Hero movement rules
- **PhysicsService** - Matter.js world, projectiles, collisions
- **ScoreService** - Scoring logic (accuracy, combos, saves)
- **WinConditionService** - Win/draw detection
- **DisconnectionService** - Disconnect/rejoin logic

## Related Documentation
- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md)

## Labels
phase:game-engine, backend:game-engine, priority:high

## Milestone
Phase 6: Game Engine
```

---

### STORY-6-1: Game Engine Service - Node.js Setup

#### Issue Template:

```
Title: STORY-6-1: Game Engine Service - Node.js Setup

Description:
## Epic
Related to #X (PHASE-6 issue number)

## Description
Initialize Node.js project for Game Engine Service with Express, Socket.io, Matter.js, and Redis integration following clean architecture principles. Set up the complete project structure with proper package organization, WebSocket server configuration, physics engine integration, and Redis connection for game state management. This establishes the foundation for real-time game engine capabilities with physics simulation, turn management, and state persistence.

## Acceptance Criteria
- [ ] Node.js project created with TypeScript support
- [ ] Express HTTP server configured with middleware (JSON parsing, CORS, error handling)
- [ ] Socket.io WebSocket server configured and attached to HTTP server
- [ ] Matter.js physics engine integrated and configured
- [ ] Redis client connection configured with environment variable support
- [ ] Project structure follows clean architecture (controller, service, manager, model, config)
- [ ] TypeScript configuration file (`tsconfig.json`) created
- [ ] Environment variables configured (`.env` file with port, Redis, JWT settings)
- [ ] Health check endpoint working (`/health`)
- [ ] Socket.io connection handler implemented (logs connect/disconnect)
- [ ] Basic error handling and logging configured
- [ ] All dependencies installed and locked in `package-lock.json`

## Technical Details

### Node.js Project Structure
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.2 and [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md):

**Package Structure:**

```

backend-services/game-engine/
├── src/
│ ├── index.ts
│ ├── controller/
│ │ └── GameEngineController.ts
│ ├── service/
│ │ ├── GameEngine.ts
│ │ ├── GameRoomManager.ts
│ │ ├── TurnManager.ts
│ │ ├── MovementManager.ts
│ │ ├── PhysicsEngine.ts
│ │ ├── ScoringSystem.ts
│ │ ├── HealthSystem.ts
│ │ ├── WinConditionChecker.ts
│ │ ├── WeaponSynergySystem.ts
│ │ └── MatchResultProcessor.ts
│ ├── manager/
│ │ ├── GameState.ts
│ │ └── TurnState.ts
│ ├── model/
│ │ ├── GameRoom.ts
│ │ ├── GameState.ts
│ │ └── MatchResult.ts
│ ├── strategy/
│ │ ├── PhysicsStrategy.ts
│ │ ├── ScoringStrategy.ts
│ │ ├── WinConditionStrategy.ts
│ │ └── WeaponSynergyStrategy.ts
│ ├── factory/
│ │ └── GameRoomFactory.ts
│ ├── adapter/
│ │ └── MatterJsAdapter.ts
│ ├── config/
│ │ ├── express.config.ts
│ │ ├── socket.config.ts
│ │ ├── redis.config.ts
│ │ └── matter.config.ts
│ ├── middleware/
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ └── logging.middleware.ts
│ ├── utils/
│ │ ├── logger.ts
│ │ └── validator.ts
│ └── routes/
│ └── health.routes.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md

````

### Required Dependencies (package.json)
Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md):

**Runtime Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.5.4",
    "matter-js": "^0.19.0",
    "ioredis": "^5.3.2",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "winston": "^3.10.0"
  }
}
````

**Development Dependencies:**

```json
{
  "devDependencies": {
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "@types/express": "^4.17.17",
    "@types/node": "^20.5.0",
    "@types/socket.io": "^3.0.2",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/cors": "^2.8.13",
    "@typescript-eslint/eslint-plugin": "^6.2.1",
    "@typescript-eslint/parser": "^6.2.1",
    "eslint": "^8.46.0",
    "prettier": "^3.0.0",
    "jest": "^29.6.2",
    "@types/jest": "^29.5.3",
    "ts-jest": "^29.1.1"
  }
}
```

### Design Patterns Applied

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 1.3:

- **Facade Pattern**: `GameEngineController` provides a simplified interface to the game engine subsystem, hiding complexity of service layer
- **Strategy Pattern**: `PhysicsStrategy`, `ScoringStrategy`, `WinConditionStrategy`, `WeaponSynergyStrategy` interfaces allow interchangeable algorithms
- **State Pattern**: `GameState` and `TurnState` manage game and turn state transitions
- **Command Pattern**: `MoveCommand`, `FireCommand` encapsulate game actions as commands
- **Observer Pattern**: `GameStateObserver`, `TurnObserver` notify clients about state changes
- **Factory Pattern**: `GameRoomFactory` encapsulates game room creation logic
- **Adapter Pattern**: `MatterJsAdapter` adapts Matter.js physics engine to PhysicsEngine interface
- **Decorator Pattern**: `ScoringDecorator` adds scoring modifiers dynamically
- **Template Method Pattern**: `MatchResultProcessor` defines algorithm skeleton for match result processing
- **Clean Architecture**: Strict separation between controller (presentation), service (business logic), and manager (state management) layers

### Package Organization Principles

- **controller/**: WebSocket event handlers, request/response handling, validation (Facade Pattern)
- **service/**: Business logic orchestration, strategy coordination (Strategy Pattern)
- **manager/**: State management (State Pattern)
- **strategy/**: Strategy pattern implementations for physics, scoring, win conditions, weapon synergies
- **factory/**: Factory pattern implementations for object creation
- **adapter/**: Adapter pattern implementations for external libraries (Matter.js)
- **model/**: Entity models representing game state and data structures
- **config/**: Configuration classes (Express, Socket.io, Redis, Matter.js)
- **middleware/**: Cross-cutting concerns (authentication, error handling, logging)
- **utils/**: Utility functions (logging, validation)

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Service structure, components, and design patterns (sections 1.2, 1.3, 3, 4)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Node.js service structure and layering (section 2.2)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Game Engine Service overview (section 2.5)
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) – Clean Architecture and SOLID principles
- **Game Engine Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml`

## Labels

phase:game-engine, backend:game-engine, feature, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-1-1: Create Node.js project structure
```

Title: TASK-6-1-1: Create Node.js project structure

Description:

## Story

Related to #X (STORY-6-1 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Create the complete Node.js project structure for Game Engine Service following clean architecture principles with strict layer separation. The structure must support the Facade, Strategy, State, Command, Observer, Factory, Adapter, Decorator, and Template Method design patterns as specified in the Game Engine Service LLD. This includes establishing the proper directory layout, package organization, and entry point to bootstrap the service.

## Acceptance Criteria

- [ ] Project root directory created (`backend-services/game-engine/`)
- [ ] Standard Node.js directory structure created (`src/`, `dist/`, `node_modules/`)
- [ ] TypeScript source directory created (`src/`)
- [ ] Package structure follows clean architecture layers: `controller`, `service`, `manager`, `strategy`, `factory`, `adapter`, `model`, `config`, `middleware`, `utils`, `routes`
- [ ] Entry point file created (`src/index.ts`)
- [ ] Package structure documented and matches Game Engine Service LLD specification
- [ ] All packages follow TypeScript naming conventions and are properly organized
- [ ] Test directory structure created (`src/__tests__/` or separate `tests/` directory)

## Technical Details

### Required Folder Structure

Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.2 and [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md):

```
backend-services/game-engine/
├── src/
│   ├── index.ts
│   ├── controller/
│   │   └── GameEngineController.ts
│   ├── service/
│   │   ├── GameEngine.ts
│   │   ├── GameRoomManager.ts
│   │   ├── TurnManager.ts
│   │   ├── MovementManager.ts
│   │   ├── PhysicsEngine.ts
│   │   ├── ScoringSystem.ts
│   │   ├── HealthSystem.ts
│   │   ├── WinConditionChecker.ts
│   │   ├── WeaponSynergySystem.ts
│   │   └── MatchResultProcessor.ts
│   ├── manager/
│   │   ├── GameState.ts
│   │   └── TurnState.ts
│   ├── model/
│   │   ├── GameRoom.ts
│   │   ├── GameState.ts
│   │   └── MatchResult.ts
│   ├── strategy/
│   │   ├── PhysicsStrategy.ts
│   │   ├── ScoringStrategy.ts
│   │   ├── WinConditionStrategy.ts
│   │   └── WeaponSynergyStrategy.ts
│   ├── factory/
│   │   └── GameRoomFactory.ts
│   ├── adapter/
│   │   └── MatterJsAdapter.ts
│   ├── config/
│   │   ├── express.config.ts
│   │   ├── socket.config.ts
│   │   ├── redis.config.ts
│   │   └── matter.config.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logging.middleware.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── validator.ts
│   └── routes/
│       └── health.routes.ts
├── src/__tests__/
│   ├── controller/
│   ├── service/
│   └── manager/
├── dist/
├── node_modules/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

### Design Patterns Applied

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 1.3:

- **Facade Pattern**: `controller/` contains `GameEngineController` that provides simplified interface
- **Strategy Pattern**: `strategy/` contains strategy interfaces and implementations for physics, scoring, win conditions, weapon synergies
- **State Pattern**: `manager/` contains `GameState` and `TurnState` for state management
- **Command Pattern**: Commands will be implemented in service layer for game actions
- **Observer Pattern**: Observers will be implemented for game state notifications
- **Factory Pattern**: `factory/` contains `GameRoomFactory` for game room creation
- **Adapter Pattern**: `adapter/` contains `MatterJsAdapter` for Matter.js integration
- **Decorator Pattern**: Decorators will be implemented for scoring modifiers
- **Template Method Pattern**: `MatchResultProcessor` uses template method pattern
- **Clean Architecture**: Strict separation between controller (presentation), service (business logic), manager (state), and model (data) layers

### Package Organization Principles

- **controller/**: WebSocket event handlers, request/response handling, validation (Facade Pattern)
- **service/**: Business logic orchestration, strategy coordination (Strategy Pattern)
- **manager/**: State management (State Pattern)
- **strategy/**: Strategy pattern implementations for interchangeable algorithms
- **factory/**: Factory pattern implementations for object creation
- **adapter/**: Adapter pattern implementations for external libraries
- **model/**: Entity models representing game state and data structures
- **config/**: Configuration classes for external services
- **middleware/**: Cross-cutting concerns (authentication, error handling, logging)
- **utils/**: Utility functions (logging, validation)
- **routes/**: HTTP route handlers

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Service structure, components, and design patterns (sections 1.2, 1.3, 3, 4)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Node.js service structure and layering (section 2.2)
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) – Clean Architecture and SOLID principles
- **Game Engine Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml`

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-1-2: Install core dependencies (Express, Socket.io, Matter.js, Redis)
```

Title: TASK-6-1-2: Install core dependencies (Express, Socket.io, Matter.js, Redis)

Description:

## Story

Related to #X (STORY-6-1 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Configure all required npm dependencies in `package.json` for Game Engine Service to support Express HTTP server, Socket.io WebSocket functionality, Matter.js physics engine, Redis data access, JWT authentication, TypeScript compilation, and development tooling. The dependencies must align with Node.js best practices, ensure compatibility between packages, and follow the same dependency management approach as other Node.js services (Matchmaking). This establishes the foundation for real-time game engine capabilities with physics simulation.

## Acceptance Criteria

- [ ] `package.json` initialized with service name, version, description
- [ ] Express dependency added (`express`) for HTTP server
- [ ] Socket.io dependencies added (`socket.io`) for WebSocket server
- [ ] Matter.js dependency added (`matter-js`) for physics engine
- [ ] Redis client dependency added (`ioredis`) for Redis operations
- [ ] JWT dependency added (`jsonwebtoken`) for authentication
- [ ] Environment variable management added (`dotenv`)
- [ ] TypeScript dependencies added (`typescript`, `ts-node`, `@types/node`, `@types/express`, `@types/socket.io`, `@types/jsonwebtoken`)
- [ ] Development dependencies added (ESLint, Prettier, Jest for testing)
- [ ] Scripts configured: `start`, `dev`, `build`, `test`, `lint`
- [ ] All dependency versions are compatible and locked in `package-lock.json`
- [ ] Dependencies match versions used in matchmaking-service for consistency

## Technical Details

### Required Dependencies (package.json)

Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.2 and [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md):

**Runtime Dependencies:**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.5.4",
    "matter-js": "^0.19.0",
    "ioredis": "^5.3.2",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "winston": "^3.10.0"
  }
}
```

**Development Dependencies:**

```json
{
  "devDependencies": {
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "@types/express": "^4.17.17",
    "@types/node": "^20.5.0",
    "@types/socket.io": "^3.0.2",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/cors": "^2.8.13",
    "@typescript-eslint/eslint-plugin": "^6.2.1",
    "@typescript-eslint/parser": "^6.2.1",
    "eslint": "^8.46.0",
    "prettier": "^3.0.0",
    "jest": "^29.6.2",
    "@types/jest": "^29.5.3",
    "ts-jest": "^29.1.1"
  }
}
```

**Package.json Scripts:**

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Dependency Version Management

- Use semantic versioning (^) for minor/patch updates
- Lock versions in `package-lock.json` for consistency
- Match dependency versions with matchmaking-service where applicable
- Use TypeScript 5.x for modern language features
- Matter.js 0.19.0 for stable physics engine

## Related Documentation

- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Node.js service dependencies (section 2.2)
- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Service technology stack
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service technology requirements (section 2.5)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-1-3: Configure server.js and base Socket.io connection
```

Title: TASK-6-1-3: Configure server.js and base Socket.io connection

Description:

## Story

Related to #X (STORY-6-1 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Configure Express HTTP server with essential middleware (JSON parsing, CORS, error handling, logging) and attach Socket.io WebSocket server to enable real-time bidirectional communication. The Express server must handle HTTP health checks and REST endpoints, while Socket.io must support WebSocket connections for game events (game-start, player-action, player-move, player-fire, disconnect, reconnect). This dual-server setup enables both traditional HTTP and real-time WebSocket communication patterns required for game engine functionality.

## Acceptance Criteria

- [ ] Express app created and configured with middleware
- [ ] JSON body parsing middleware added (`express.json()`)
- [ ] CORS middleware configured for frontend communication
- [ ] Error handling middleware added
- [ ] Logging middleware added (request logging)
- [ ] HTTP server created from Express app
- [ ] Socket.io server attached to HTTP server
- [ ] Socket.io CORS configured for frontend connections
- [ ] Basic Socket.io connection handler implemented (logs connect/disconnect)
- [ ] HTTP server listens on configured port (5002 by default)
- [ ] Socket.io client can connect and receive connection acknowledgment
- [ ] Connection/disconnection events are logged for debugging

## Technical Details

### Express Configuration

Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.2:

**File:** `src/config/express.config.ts`

```typescript
import express, { Express } from "express";
import cors from "cors";
import { errorHandler } from "../middleware/error.middleware";
import { requestLogger } from "../middleware/logging.middleware";

export function configureExpress(): Express {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:4200",
      credentials: true,
    }),
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use(requestLogger);

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
}
```

### Socket.io Configuration

**File:** `src/config/socket.config.ts`

```typescript
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { authenticateSocket } from "../middleware/auth.middleware";

export function initializeSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:4200",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Authentication middleware
  io.use(authenticateSocket);

  // Connection handler
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Emit welcome message
    socket.emit("connected", { message: "Connected to game engine service" });
  });

  return io;
}
```

### Server Setup

**File:** `src/index.ts`

```typescript
import { createServer } from "http";
import { configureExpress } from "./config/express.config";
import { initializeSocket } from "./config/socket.config";
import healthRoutes from "./routes/health.routes";

const app = configureExpress();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// HTTP routes
app.use("/health", healthRoutes);

const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, () => {
  console.log(`Game Engine Service running on port ${PORT}`);
  console.log(`Socket.io server ready for connections`);
});
```

### Design Patterns Applied

- **Middleware Pattern**: Express middleware for cross-cutting concerns (logging, error handling)
- **Dependency Injection**: Configuration functions return configured instances
- **Separation of Concerns**: Express for HTTP, Socket.io for WebSocket

## Related Documentation

- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Node.js service structure (section 2.2)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – WebSocket and REST patterns
- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Socket.io integration

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-1-4: Configure Redis client and environment variables
```

Title: TASK-6-1-4: Configure Redis client and environment variables

Description:

## Story

Related to #X (STORY-6-1 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Configure Redis client connection using `ioredis` library with environment variable support for connection details (host, port, password, database). Implement connection pooling, error handling, reconnection logic, and a startup health check to verify Redis connectivity. The Redis client must be configured as a singleton service that can be reused across the application for game state storage, room management, and match data caching. This is critical infrastructure for game state persistence and real-time state management.

## Acceptance Criteria

- [ ] Redis client configured using `ioredis` library
- [ ] Connection details read from environment variables (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`)
- [ ] Connection pooling configured for performance
- [ ] Automatic reconnection logic implemented
- [ ] Connection health check performed on startup
- [ ] Connection errors logged with actionable messages
- [ ] Redis client exported as singleton service
- [ ] Client can be imported and used across services
- [ ] Connection status monitoring implemented
- [ ] Graceful shutdown handles Redis connection cleanup
- [ ] `.env.example` file created with all required environment variables

## Technical Details

### Redis Configuration

Based on [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 2.5:

**File:** `src/config/redis.config.ts`

```typescript
import Redis from "ioredis";
import { logger } from "../utils/logger";

let redisClient: Redis | null = null;

export async function initializeRedis(): Promise<Redis> {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis({
    host: process.env.REDIS_HOST || "redis",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || "0"),
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redisClient.on("connect", () => {
    logger.info("Redis client connected");
  });

  redisClient.on("error", (err) => {
    logger.error("Redis client error:", err);
  });

  redisClient.on("close", () => {
    logger.warn("Redis client connection closed");
  });

  // Health check
  try {
    await redisClient.ping();
    logger.info("Redis health check passed");
  } catch (error) {
    logger.error("Redis health check failed:", error);
    throw error;
  }

  return redisClient;
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call initializeRedis() first.");
  }
  return redisClient;
}
```

### Environment Variables

**File:** `.env.example`

```env
# Server Configuration
PORT=5002
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Game Engine Configuration
TURN_DURATION_SECONDS=15
MAX_TURNS_PER_PLAYER=10
MATCH_DURATION_MINUTES=5
REJOIN_WINDOW_SECONDS=60
```

### Redis Data Structures for Game Engine

Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 2.5:

**Game State Cache:**

- **Type:** Hash
- **Key:** `game:{matchId}`
- **Fields:** `state`, `player1Id`, `player2Id`, `player1Hero`, `player2Hero`, `player1Health`, `player2Health`, `player1Score`, `player2Score`, `player1Moves`, `player2Moves`, `player1Weapons`, `player2Weapons`, `arenaId`, `currentTurn`, `turnNumber`, `matchTimer`, `turnTimer`

## Related Documentation

- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Redis usage (section 2.5)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Redis data structures (section 2.5)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – Redis Pub/Sub patterns

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

---

### STORY-6-2: Game Room Management

#### Issue Template:

```

Title: STORY-6-2: Implement game room creation and management

Description:

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement comprehensive game room creation and lifecycle management system that creates game rooms when matches are assigned from Matchmaking Service, stores complete game state (players, arena, hero selections, weapons, initial positions), assigns players to rooms via Socket.io connections, and performs proper cleanup when matches end. The system must use Factory Pattern for room creation, Redis for state persistence, and support room lookup, state updates, and graceful termination. This is the foundation for all game operations and state management.

## Acceptance Criteria

- [ ] Game rooms created automatically when match is assigned from Matchmaking Service
- [ ] Room state stored in Redis with all required fields (players, arena, hero selections, weapons, initial positions, health, scores)
- [ ] Players assigned to rooms via Socket.io room joining mechanism
- [ ] Room lookup by matchId implemented
- [ ] Room state updates persisted to Redis atomically
- [ ] Rooms cleaned up when match ends (Redis keys deleted, Socket.io rooms left)
- [ ] Room state includes initial game configuration (arena gravity, hero HP, weapon configurations)
- [ ] Room creation validates match data (player IDs, hero selections, arena ID)
- [ ] Room state supports concurrent access with proper locking mechanisms
- [ ] Room cleanup handles edge cases (disconnections, timeouts, errors)
- [ ] Room state can be restored on reconnection
- [ ] Unit tests for GameRoomManager with 80%+ coverage

## Technical Details

### GameRoomManager Service Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 3.3:

**File:** `src/service/GameRoomManager.ts`

```typescript
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

### GameRoom Model Structure

**File:** `src/model/GameRoom.ts`

```typescript
export interface GameRoom {
  matchId: string;
  player1Id: string;
  player2Id: string;
  player1Hero: string;
  player2Hero: string;
  player1Weapons: string[];
  player2Weapons: string[];
  arenaId: string;
  arenaGravity: number;
  player1Position: Position;
  player2Position: Position;
  player1Health: number;
  player2Health: number;
  player1Score: number;
  player2Score: number;
  player1MovesUsed: number;
  player2MovesUsed: number;
  currentTurn: string; // player1Id or player2Id
  turnNumber: number;
  matchStartTime: Date;
  matchEndTime?: Date;
  status: GameStatus; // WAITING, PLAYING, ENDED
  createdAt: Date;
  updatedAt: Date;
}
```

### Redis Storage Structure

Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 2.5:

**Game State Cache:**

- **Type:** Hash
- **Key:** `game:{matchId}`
- **Fields:**
  - `state` - JSON string of game state
  - `player1Id` - Player 1 ID
  - `player2Id` - Player 2 ID
  - `player1Hero` - Player 1 hero type
  - `player2Hero` - Player 2 hero type
  - `player1Health` - Player 1 current health
  - `player2Health` - Player 2 current health
  - `player1Score` - Player 1 current score
  - `player2Score` - Player 2 current score
  - `player1Moves` - Player 1 moves used
  - `player2Moves` - Player 2 moves used
  - `player1Weapons` - JSON array of player 1 weapons
  - `player2Weapons` - JSON array of player 2 weapons
  - `arenaId` - Arena ID
  - `currentTurn` - Current player ID
  - `turnNumber` - Current turn number
  - `matchTimer` - Match start timestamp
  - `turnTimer` - Turn start timestamp
  - `status` - Game status (WAITING, PLAYING, ENDED)
- **TTL:** 1 hour (auto-cleanup for abandoned games)

### Design Patterns Applied

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 1.3:

- **Factory Pattern**: `GameRoomFactory` encapsulates game room creation logic, creating `GameRoom` instances with proper initialization
- **Repository Pattern**: Redis operations abstracted through `GameRoomManager`, providing clean interface for state persistence
- **State Pattern**: `GameState` manages game state transitions (WAITING → PLAYING → ENDED)
- **Singleton Pattern**: `GameRoomManager` instance shared across application

### Room Creation Flow

1. Matchmaking Service assigns match → emits `match-assigned` event
2. Game Engine receives event → calls `GameRoomManager.createGameRoom()`
3. `GameRoomFactory` creates `GameRoom` instance with match data
4. Room state stored in Redis hash `game:{matchId}`
5. Players join Socket.io room `match:{matchId}`
6. Room state initialized with starting positions, health, scores

### Room Cleanup Flow

1. Match ends (win condition, timeout, or error)
2. `GameRoomManager.deleteGameRoom()` called
3. Redis hash `game:{matchId}` deleted
4. Socket.io room `match:{matchId}` left by all sockets
5. Any associated timers or subscriptions cleaned up

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – GameRoomManager responsibilities (section 3.3)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Redis data structures (section 2.5)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Game Engine Service overview (section 2.5)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – WebSocket patterns
- **Game Engine Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml`

## Labels

phase:game-engine, backend:game-engine, feature, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-2-1: Create GameRoom model
```

Title: TASK-6-2-1: Create GameRoom model

Description:

## Story

Related to #X (STORY-6-2 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Create the `GameRoom` TypeScript interface/class that represents a game room with all required fields for match state, player data, game configuration, and status tracking. The model must include validation logic, serialization methods for Redis storage, and support for state transitions. This model serves as the core data structure for all game operations and must align with the Game Engine Service LLD specifications.

## Acceptance Criteria

- [ ] `GameRoom` interface/class created with all required fields
- [ ] Model includes player data (IDs, heroes, weapons, positions, health, scores, moves)
- [ ] Model includes game configuration (arena ID, gravity, match timing)
- [ ] Model includes state tracking (current turn, turn number, match status)
- [ ] Model includes timestamps (createdAt, updatedAt, matchStartTime, matchEndTime)
- [ ] Validation methods implemented (validate player data, arena compatibility)
- [ ] Serialization methods implemented (toJSON, fromJSON for Redis storage)
- [ ] State transition methods implemented (canTransitionTo, transitionTo)
- [ ] Model matches Game Engine Service LLD specification
- [ ] TypeScript types are properly defined and exported

## Technical Details

### GameRoom Model Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 3.3:

**File:** `src/model/GameRoom.ts`

```typescript
export enum GameStatus {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  ENDED = "ENDED",
}

export interface Position {
  x: number;
  y: number;
}

export interface GameRoom {
  matchId: string;
  player1Id: string;
  player2Id: string;
  player1Hero: string;
  player2Hero: string;
  player1Weapons: string[];
  player2Weapons: string[];
  arenaId: string;
  arenaGravity: number;
  player1Position: Position;
  player2Position: Position;
  player1Health: number;
  player2Health: number;
  player1Score: number;
  player2Score: number;
  player1MovesUsed: number;
  player2MovesUsed: number;
  currentTurn: string; // player1Id or player2Id
  turnNumber: number;
  matchStartTime: Date;
  matchEndTime?: Date;
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class GameRoomModel implements GameRoom {
  // Implementation with validation, serialization, state transitions
  validate(): boolean;
  toJSON(): string;
  static fromJSON(json: string): GameRoomModel;
  canTransitionTo(newStatus: GameStatus): boolean;
  transitionTo(newStatus: GameStatus): void;
}
```

### Validation Rules

- `matchId` must be non-empty string
- `player1Id` and `player2Id` must be different and non-empty
- `player1Hero` and `player2Hero` must be valid hero types
- `arenaId` must be valid arena ID
- `player1Health` and `player2Health` must be positive numbers
- `player1MovesUsed` and `player2MovesUsed` must be between 0 and 4
- `currentTurn` must be either `player1Id` or `player2Id`
- `turnNumber` must be non-negative integer

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – GameRoom structure (section 3.3)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Game state schema

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-2-2: Implement room creation and assignment logic
```

Title: TASK-6-2-2: Implement room creation and assignment logic

Description:

## Story

Related to #X (STORY-6-2 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement `GameRoomManager.createGameRoom()` method that creates game rooms when matches are assigned from Matchmaking Service. The implementation must use Factory Pattern for room creation, validate match data, initialize game state with starting positions and health, and assign players to Socket.io rooms. The room creation must be atomic and handle errors gracefully, ensuring room state is consistent and players can immediately start playing.

## Acceptance Criteria

- [ ] `createGameRoom()` method implemented in `GameRoomManager`
- [ ] Factory Pattern used for room creation (`GameRoomFactory`)
- [ ] Match data validation implemented (player IDs, hero selections, arena ID)
- [ ] Initial game state initialized (starting positions, health, scores, moves)
- [ ] Players assigned to Socket.io room `match:{matchId}`
- [ ] Room creation is atomic (all-or-nothing)
- [ ] Error handling implemented for invalid match data
- [ ] Room creation emits `game-room-created` event to players
- [ ] Room state persisted to Redis after creation
- [ ] Unit tests for room creation with various match configurations

## Technical Details

### GameRoomManager Implementation

**File:** `src/service/GameRoomManager.ts`

```typescript
export class GameRoomManager {
  constructor(
    private redisClient: Redis,
    private gameRoomFactory: GameRoomFactory,
    private io: Server,
  ) {}

  async createGameRoom(matchId: string, gameConfig: GameConfig): Promise<GameRoom> {
    // Validate match data
    this.validateGameConfig(gameConfig);

    // Create game room using factory
    const gameRoom = this.gameRoomFactory.create(matchId, gameConfig);

    // Store in Redis
    await this.storeGameRoom(matchId, gameRoom);

    // Assign players to Socket.io room
    this.assignPlayersToRoom(matchId, gameConfig.player1Id, gameConfig.player2Id);

    // Emit room created event
    this.io.to(`match:${matchId}`).emit("game-room-created", { matchId, gameRoom });

    return gameRoom;
  }

  private validateGameConfig(config: GameConfig): void {
    // Validation logic
  }

  private async storeGameRoom(matchId: string, gameRoom: GameRoom): Promise<void> {
    // Redis storage logic
  }

  private assignPlayersToRoom(matchId: string, player1Id: string, player2Id: string): void {
    // Socket.io room assignment
  }
}
```

### GameRoomFactory Implementation

**File:** `src/factory/GameRoomFactory.ts`

```typescript
export class GameRoomFactory {
  create(matchId: string, config: GameConfig): GameRoom {
    return {
      matchId,
      player1Id: config.player1Id,
      player2Id: config.player2Id,
      player1Hero: config.player1Hero,
      player2Hero: config.player2Hero,
      player1Weapons: config.player1Weapons,
      player2Weapons: config.player2Weapons,
      arenaId: config.arenaId,
      arenaGravity: config.arenaGravity,
      player1Position: this.getStartingPosition(config.arenaId, "player1"),
      player2Position: this.getStartingPosition(config.arenaId, "player2"),
      player1Health: this.getStartingHealth(config.player1Hero),
      player2Health: this.getStartingHealth(config.player2Hero),
      player1Score: 0,
      player2Score: 0,
      player1MovesUsed: 0,
      player2MovesUsed: 0,
      currentTurn: config.player1Id, // First player starts
      turnNumber: 1,
      matchStartTime: new Date(),
      status: GameStatus.WAITING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – GameRoomManager and Factory Pattern (sections 3.3, 4.9)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Match assignment flow

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-2-3: Store room state in Redis
```

Title: TASK-6-2-3: Store room state in Redis

Description:

## Story

Related to #X (STORY-6-2 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement Redis storage operations for game room state using hash data structure. The implementation must support storing complete game state, updating individual fields atomically, retrieving room state, and handling concurrent access with proper locking mechanisms. The Redis storage must align with the Database Design specification and support efficient state updates during gameplay.

## Acceptance Criteria

- [ ] Redis hash storage implemented for game state (`game:{matchId}`)
- [ ] `storeGameRoom()` method stores complete game state to Redis
- [ ] `getGameRoom()` method retrieves game state from Redis
- [ ] `updateGameState()` method updates game state atomically
- [ ] Redis operations handle serialization/deserialization of complex fields
- [ ] Concurrent access handled with Redis transactions or locks
- [ ] TTL configured for auto-cleanup of abandoned games (1 hour)
- [ ] Error handling for Redis connection failures
- [ ] State retrieval handles missing keys gracefully
- [ ] Unit tests for Redis storage operations

## Technical Details

### Redis Storage Implementation

Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 2.5:

**File:** `src/service/GameRoomManager.ts` (Redis methods)

```typescript
private async storeGameRoom(matchId: string, gameRoom: GameRoom): Promise<void> {
  const key = `game:${matchId}`;
  const state = JSON.stringify(gameRoom);

  await this.redisClient.hset(key, {
    state,
    player1Id: gameRoom.player1Id,
    player2Id: gameRoom.player2Id,
    player1Hero: gameRoom.player1Hero,
    player2Hero: gameRoom.player2Hero,
    player1Health: gameRoom.player1Health.toString(),
    player2Health: gameRoom.player2Health.toString(),
    player1Score: gameRoom.player1Score.toString(),
    player2Score: gameRoom.player2Score.toString(),
    player1Moves: gameRoom.player1MovesUsed.toString(),
    player2Moves: gameRoom.player2MovesUsed.toString(),
    player1Weapons: JSON.stringify(gameRoom.player1Weapons),
    player2Weapons: JSON.stringify(gameRoom.player2Weapons),
    arenaId: gameRoom.arenaId,
    currentTurn: gameRoom.currentTurn,
    turnNumber: gameRoom.turnNumber.toString(),
    matchTimer: gameRoom.matchStartTime.getTime().toString(),
    turnTimer: new Date().getTime().toString(),
    status: gameRoom.status
  });

  // Set TTL for auto-cleanup
  await this.redisClient.expire(key, 3600); // 1 hour
}

async getGameRoom(matchId: string): Promise<GameRoom | null> {
  const key = `game:${matchId}`;
  const exists = await this.redisClient.exists(key);

  if (!exists) {
    return null;
  }

  const state = await this.redisClient.hget(key, "state");
  if (!state) {
    return null;
  }

  return JSON.parse(state) as GameRoom;
}

async updateGameState(matchId: string, updates: Partial<GameRoom>): Promise<void> {
  const key = `game:${matchId}`;
  const pipeline = this.redisClient.pipeline();

  if (updates.player1Health !== undefined) {
    pipeline.hset(key, "player1Health", updates.player1Health.toString());
  }
  if (updates.player2Health !== undefined) {
    pipeline.hset(key, "player2Health", updates.player2Health.toString());
  }
  // ... other field updates

  // Update state JSON
  const currentRoom = await this.getGameRoom(matchId);
  if (currentRoom) {
    const updatedRoom = { ...currentRoom, ...updates, updatedAt: new Date() };
    pipeline.hset(key, "state", JSON.stringify(updatedRoom));
  }

  await pipeline.exec();
}
```

### Redis Data Structure

- **Type:** Hash
- **Key:** `game:{matchId}`
- **TTL:** 3600 seconds (1 hour)

## Related Documentation

- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Redis data structures (section 2.5)
- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – GameRoomManager (section 3.3)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-2-4: Implement room cleanup after match end
```

Title: TASK-6-2-4: Implement room cleanup after match end

Description:

## Story

Related to #X (STORY-6-2 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement comprehensive room cleanup logic that removes game room state from Redis, disconnects players from Socket.io rooms, cleans up any associated timers or subscriptions, and handles edge cases (disconnections, timeouts, errors). The cleanup must be idempotent and ensure no resource leaks occur when matches end normally or abnormally.

## Acceptance Criteria

- [ ] `deleteGameRoom()` method implemented in `GameRoomManager`
- [ ] Redis hash `game:{matchId}` deleted
- [ ] Socket.io room `match:{matchId}` left by all sockets
- [ ] Associated timers cleaned up (turn timers, match timers)
- [ ] Cleanup is idempotent (can be called multiple times safely)
- [ ] Edge cases handled (missing room, already deleted, Redis errors)
- [ ] Cleanup emits `game-room-deleted` event to players
- [ ] Match result saved to MongoDB before cleanup (if applicable)
- [ ] Unit tests for cleanup with various scenarios

## Technical Details

### Room Cleanup Implementation

**File:** `src/service/GameRoomManager.ts`

```typescript
async deleteGameRoom(matchId: string): Promise<void> {
  const key = `game:${matchId}`;

  // Check if room exists
  const exists = await this.redisClient.exists(key);
  if (!exists) {
    return; // Already deleted or never existed
  }

  // Get final game state before deletion
  const gameRoom = await this.getGameRoom(matchId);

  // Save match result to MongoDB (if needed)
  if (gameRoom && gameRoom.status === GameStatus.ENDED) {
    await this.saveMatchResult(gameRoom);
  }

  // Delete Redis hash
  await this.redisClient.del(key);

  // Leave Socket.io room
  this.io.socketsLeave(`match:${matchId}`);

  // Clean up timers
  this.cleanupTimers(matchId);

  // Emit cleanup event
  this.io.to(`match:${matchId}`).emit("game-room-deleted", { matchId });
}

private cleanupTimers(matchId: string): void {
  // Clean up turn timers, match timers, etc.
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – GameRoomManager cleanup (section 3.3)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Redis cleanup patterns

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

---

### STORY-6-3: Turn Management System (US-030, US-031, US-033)

#### Issue Template:

```

Title: STORY-6-3: Implement turn-based system (15s per turn, 4–5min total)

Description:

## Epic

Related to #X (PHASE-6 issue number)

## User Story

As a player, I want a clear turn system (15 seconds per turn, limited total duration) so that gameplay feels fair and paced.

## Description

Implement comprehensive turn management system that enforces 15-second turn timers, switches turns between players automatically, tracks turn counts and match duration, and ends matches when time limits or turn limits are reached. The system must use State Pattern for turn state management, emit Socket.io events for turn transitions, integrate with GameRoom state, and handle turn timeouts gracefully. This ensures fair, paced gameplay with clear turn boundaries.

## Acceptance Criteria

- [ ] 15-second turn timer implemented with countdown
- [ ] Turn switching between players automatically when timer expires
- [ ] Turn switching when player completes action (fire, move)
- [ ] Match ends after 4–5 minutes total duration OR 10 turns per player
- [ ] Turn events emitted to clients (`turn-started`, `turn-ended`, `turn-timeout`)
- [ ] Turn state persisted in Redis and synchronized across clients
- [ ] Turn timer can be paused/resumed for disconnections
- [ ] Turn count tracked per player (player1Turns, player2Turns)
- [ ] Match duration tracked from match start
- [ ] Turn timeout handling (auto-end turn if no action)
- [ ] Integration with GameRoom state for turn updates
- [ ] Unit tests for TurnManager with 80%+ coverage

## Technical Details

### TurnManager Service Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 3.4:

**File:** `src/service/TurnManager.ts`

```typescript
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

### TurnState Model Structure

**File:** `src/manager/TurnState.ts`

```typescript
export interface TurnState {
  matchId: string;
  currentPlayerId: string;
  turnNumber: number;
  turnStartTime: Date;
  turnEndTime?: Date;
  remainingSeconds: number;
  isExpired: boolean;
  player1Turns: number;
  player2Turns: number;
  matchDurationSeconds: number;
}
```

### Design Patterns Applied

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 1.3:

- **State Pattern**: `TurnState` manages turn state transitions (ACTIVE → EXPIRED → COMPLETED)
- **Observer Pattern**: Turn events emitted to clients via Socket.io
- **Strategy Pattern**: Turn timeout strategies can be configured

### Turn Flow

1. Match starts → First player's turn begins
2. 15-second timer starts
3. Player performs action (fire, move) OR timer expires
4. Turn ends → Switch to opponent
5. Repeat until match end condition (time limit or turn limit)

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – TurnManager responsibilities (section 3.4)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Turn system overview (section 2.5)
- **Game Engine Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml`

## Labels

phase:game-engine, backend:game-engine, feature, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-3-1: Create TurnService with timers
```

Title: TASK-6-3-1: Create TurnService with timers

Description:

## Story

Related to #X (STORY-6-3 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Create `TurnManager` service with turn timer functionality that starts 15-second countdown timers for each turn, tracks remaining time, handles turn expiration, and manages turn state transitions. The implementation must use State Pattern for turn state management, support timer pause/resume for disconnections, and integrate with Node.js timers for accurate countdown.

## Acceptance Criteria

- [ ] `TurnManager` class created with timer management methods
- [ ] 15-second turn timer implemented with countdown
- [ ] Turn timer starts when turn begins
- [ ] Turn timer stops when turn ends or expires
- [ ] Remaining time tracked and updated every second
- [ ] Turn expiration detection implemented
- [ ] Timer pause/resume support for disconnections
- [ ] Turn state persisted to Redis
- [ ] Timer cleanup on match end
- [ ] Unit tests for timer functionality

## Technical Details

### TurnManager Implementation

**File:** `src/service/TurnManager.ts`

```typescript
export class TurnManager {
  private turnTimers: Map<string, NodeJS.Timeout> = new Map();

  async startTurn(matchId: string, playerId: string): Promise<TurnState> {
    const turnState: TurnState = {
      matchId,
      currentPlayerId: playerId,
      turnNumber: await this.getNextTurnNumber(matchId),
      turnStartTime: new Date(),
      remainingSeconds: 15,
      isExpired: false,
      player1Turns: await this.getPlayerTurns(matchId, "player1"),
      player2Turns: await this.getPlayerTurns(matchId, "player2"),
      matchDurationSeconds: await this.getMatchDuration(matchId),
    };

    // Start countdown timer
    this.startCountdown(matchId, turnState);

    // Persist to Redis
    await this.saveTurnState(matchId, turnState);

    return turnState;
  }

  private startCountdown(matchId: string, turnState: TurnState): void {
    const timer = setInterval(async () => {
      turnState.remainingSeconds--;

      if (turnState.remainingSeconds <= 0) {
        turnState.isExpired = true;
        clearInterval(timer);
        this.turnTimers.delete(matchId);
        await this.handleTurnTimeout(matchId);
      } else {
        await this.saveTurnState(matchId, turnState);
      }
    }, 1000);

    this.turnTimers.set(matchId, timer);
  }
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – TurnManager (section 3.4)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-3-2: Implement turn-switch Socket.io events
```

Title: TASK-6-3-2: Implement turn-switch Socket.io events

Description:

## Story

Related to #X (STORY-6-3 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement Socket.io event handlers for turn switching that emit `turn-started`, `turn-ended`, and `turn-timeout` events to clients. The events must include turn state information (current player, remaining time, turn number) and be broadcast to all players in the match room.

## Acceptance Criteria

- [ ] `turn-started` event emitted when turn begins
- [ ] `turn-ended` event emitted when turn completes
- [ ] `turn-timeout` event emitted when timer expires
- [ ] Events include turn state (current player, remaining time, turn number)
- [ ] Events broadcast to match room (`match:{matchId}`)
- [ ] Event handlers integrated with TurnManager
- [ ] Unit tests for event emission

## Technical Details

### Socket.io Event Handlers

**File:** `src/controller/GameEngineController.ts`

```typescript
io.on("connection", (socket) => {
  socket.on("turn-action", async (data) => {
    const { matchId, action } = data;
    await turnManager.endTurn(matchId);
    const nextTurn = await turnManager.startTurn(matchId, getOpponent(matchId));
    io.to(`match:${matchId}`).emit("turn-started", nextTurn);
  });
});
```

## Related Documentation

- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – WebSocket patterns

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-3-3: Track turn counts and match duration
```

Title: TASK-6-3-3: Track turn counts and match duration

Description:

## Story

Related to #X (STORY-6-3 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement tracking of turn counts per player and total match duration to enforce match end conditions (4-5 minutes OR 10 turns per player). The tracking must persist to Redis and be checked on each turn transition.

## Acceptance Criteria

- [ ] Turn count tracked per player (player1Turns, player2Turns)
- [ ] Match duration tracked from match start
- [ ] Match end condition checked (4-5 minutes OR 10 turns per player)
- [ ] Turn counts persisted to Redis
- [ ] Match duration calculated accurately
- [ ] Unit tests for turn counting and duration tracking

## Technical Details

### Turn Counting Implementation

**File:** `src/service/TurnManager.ts`

```typescript
private async getPlayerTurns(matchId: string, playerId: string): Promise<number> {
  const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
  if (!gameRoom) return 0;

  return playerId === gameRoom.player1Id
    ? Math.floor((gameRoom.turnNumber + 1) / 2)
    : Math.floor(gameRoom.turnNumber / 2);
}

private async getMatchDuration(matchId: string): Promise<number> {
  const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
  if (!gameRoom) return 0;

  return Math.floor((new Date().getTime() - gameRoom.matchStartTime.getTime()) / 1000);
}

async shouldEndMatch(matchId: string): Promise<boolean> {
  const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
  if (!gameRoom) return false;

  const duration = await this.getMatchDuration(matchId);
  const maxDuration = 5 * 60; // 5 minutes

  const player1Turns = await this.getPlayerTurns(matchId, gameRoom.player1Id);
  const player2Turns = await this.getPlayerTurns(matchId, gameRoom.player2Id);
  const maxTurns = 10;

  return duration >= maxDuration || player1Turns >= maxTurns || player2Turns >= maxTurns;
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – TurnManager (section 3.4)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-3-4: Integrate with GameRoom state
```

Title: TASK-6-3-4: Integrate with GameRoom state

Description:

## Story

Related to #X (STORY-6-3 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Integrate TurnManager with GameRoomManager to update game room state with current turn information, persist turn state to Redis, and synchronize turn transitions with game state updates.

## Acceptance Criteria

- [ ] TurnManager updates GameRoom state on turn transitions
- [ ] Turn state persisted to Redis via GameRoomManager
- [ ] GameRoom.currentTurn updated on turn switch
- [ ] GameRoom.turnNumber incremented on turn switch
- [ ] Turn state synchronized with game state
- [ ] Unit tests for integration

## Technical Details

### Integration Implementation

**File:** `src/service/TurnManager.ts`

```typescript
async startTurn(matchId: string, playerId: string): Promise<TurnState> {
  // ... turn state creation ...

  // Update GameRoom state
  await this.gameRoomManager.updateGameState(matchId, {
    currentTurn: playerId,
    turnNumber: turnState.turnNumber
  });

  return turnState;
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – TurnManager integration (section 3.4)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

---

### STORY-6-4: Movement System (US-026)

#### Issue Template:

```

Title: STORY-6-4: Implement hero movement (4 moves per game, left/right only)

Description:

## Epic

Related to #X (PHASE-6 issue number)

## User Story

As a player, I want to move my hero within the arena (4 moves per game, left/right only) so that I can position strategically.

## Description

Implement comprehensive hero movement system that allows players to move their heroes left or right within arena boundaries, enforces a 4-move-per-game limit, validates movement against arena bounds, and broadcasts position updates to opponents in real-time. The system must use Command Pattern for movement actions, integrate with GameRoom state for position tracking, and support movement scoring for repositioning saves. This enables strategic positioning during gameplay.

## Acceptance Criteria

- [ ] Left/right movement implemented with direction validation
- [ ] 4 moves per game limit enforced per player
- [ ] Movement validated against arena boundaries (min/max X coordinates)
- [ ] Position updates broadcast to opponent via Socket.io
- [ ] Movement state persisted to Redis (movesUsed, currentPosition)
- [ ] Movement can only occur during player's turn
- [ ] Movement validated against current turn state
- [ ] Movement distance calculated and validated (step size)
- [ ] Movement scoring integrated (repositioning save detection)
- [ ] Movement events emitted (`hero-moved`, `move-failed`)
- [ ] Unit tests for MovementManager with 80%+ coverage
- [ ] Integration tests for movement flow

## Technical Details

### MovementManager Service Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 3.5:

**File:** `src/service/MovementManager.ts`

```typescript
export class MovementManager {
  // Move player
  movePlayer(matchId: string, playerId: string, direction: "left" | "right"): Promise<MovementResult>;

  // Check if player can move
  canMove(matchId: string, playerId: string): Promise<boolean>;

  // Get remaining moves
  getRemainingMoves(matchId: string, playerId: string): Promise<number>;

  // Calculate movement score (repositioning save)
  calculateMovementScore(matchId: string, playerId: string, enemyShot: ShotData): Promise<number>;
}
```

### Movement Model Structure

**File:** `src/model/Movement.ts`

```typescript
export interface MovementResult {
  success: boolean;
  newPosition: Position;
  movesRemaining: number;
  reason?: string; // If failed, why
}

export interface Position {
  x: number;
  y: number;
}
```

### Design Patterns Applied

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 1.3:

- **Command Pattern**: `MoveCommand` encapsulates movement operations as commands
- **Validation Pattern**: Movement validation before execution
- **State Pattern**: Movement state tracked in GameRoom

### Movement Rules

- Maximum 4 moves per player per game
- Only left/right movement (no up/down)
- Movement step size: [configurable, e.g., 50 pixels]
- Arena boundaries enforced (minX, maxX from arena configuration)
- Movement only allowed during player's turn
- Movement cannot overlap with opponent position

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – MovementManager responsibilities (section 3.5)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Movement system overview (section 2.5)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Arena boundaries schema
- **Game Engine Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml`

## Labels

phase:game-engine, backend:game-engine, feature, priority:medium

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-4-1: Create MovementService and move-hero event
```

Title: TASK-6-4-1: Create MovementService and move-hero event

Description:

## Story

Related to #X (STORY-6-4 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Create `MovementManager` service with movement logic and Socket.io event handler for `move-hero` events. The implementation must validate movement requests, check move limits, calculate new positions, update game state, and broadcast position updates to opponents. The movement must integrate with TurnManager to ensure moves only occur during player's turn.

## Acceptance Criteria

- [ ] `MovementManager` class created with movement methods
- [ ] `movePlayer()` method implemented with direction validation
- [ ] Socket.io event handler for `move-hero` event created
- [ ] Event handler validates player authentication
- [ ] Event handler validates turn state (player's turn)
- [ ] Movement validated against move limit (4 moves max)
- [ ] New position calculated based on direction
- [ ] GameRoom state updated with new position
- [ ] Position update broadcast to opponent
- [ ] Movement result emitted to requesting player
- [ ] Error handling for invalid movements
- [ ] Unit tests for MovementManager

## Technical Details

### MovementManager Implementation

**File:** `src/service/MovementManager.ts`

```typescript
export class MovementManager {
  constructor(
    private gameRoomManager: GameRoomManager,
    private turnManager: TurnManager,
    private io: Server,
  ) {}

  async movePlayer(matchId: string, playerId: string, direction: "left" | "right"): Promise<MovementResult> {
    // Validate turn
    const currentTurn = await this.turnManager.getCurrentTurn(matchId);
    if (!currentTurn || currentTurn.currentPlayerId !== playerId) {
      return { success: false, reason: "Not your turn" };
    }

    // Check if player can move
    if (!(await this.canMove(matchId, playerId))) {
      return { success: false, reason: "Move limit reached" };
    }

    // Get game room
    const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
    if (!gameRoom) {
      return { success: false, reason: "Game room not found" };
    }

    // Calculate new position
    const currentPosition = playerId === gameRoom.player1Id ? gameRoom.player1Position : gameRoom.player2Position;

    const newPosition = this.calculateNewPosition(currentPosition, direction, gameRoom.arenaId);

    // Validate arena boundaries
    if (!this.isValidPosition(newPosition, gameRoom.arenaId)) {
      return { success: false, reason: "Position out of bounds" };
    }

    // Update game state
    const movesUsed = playerId === gameRoom.player1Id ? gameRoom.player1MovesUsed + 1 : gameRoom.player2MovesUsed + 1;

    await this.gameRoomManager.updateGameState(matchId, {
      ...(playerId === gameRoom.player1Id ? { player1Position: newPosition, player1MovesUsed: movesUsed } : { player2Position: newPosition, player2MovesUsed: movesUsed }),
    });

    // Broadcast to opponent
    const opponentId = playerId === gameRoom.player1Id ? gameRoom.player2Id : gameRoom.player1Id;
    this.io.to(`match:${matchId}`).emit("hero-moved", {
      playerId,
      newPosition,
      movesRemaining: 4 - movesUsed,
    });

    return {
      success: true,
      newPosition,
      movesRemaining: 4 - movesUsed,
    };
  }

  private calculateNewPosition(current: Position, direction: "left" | "right", arenaId: string): Position {
    const stepSize = 50; // Configurable
    return {
      x: direction === "left" ? current.x - stepSize : current.x + stepSize,
      y: current.y, // Y remains constant (only left/right movement)
    };
  }
}
```

### Socket.io Event Handler

**File:** `src/controller/GameEngineController.ts`

```typescript
socket.on("move-hero", async (data) => {
  const { matchId, direction } = data;
  const playerId = socket.data.userId; // From auth middleware

  const result = await movementManager.movePlayer(matchId, playerId, direction);

  if (result.success) {
    socket.emit("move-success", result);
  } else {
    socket.emit("move-failed", { reason: result.reason });
  }
});
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – MovementManager (section 3.5)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – WebSocket patterns

## Labels

phase:game-engine, backend:game-engine, task, priority:medium

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-4-2: Track moves used per player
```

Title: TASK-6-4-2: Track moves used per player

Description:

## Story

Related to #X (STORY-6-4 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement move tracking system that tracks moves used per player, persists to Redis via GameRoom state, and provides methods to check remaining moves and move availability. The tracking must be atomic and synchronized with game state updates.

## Acceptance Criteria

- [ ] Move count tracked per player (player1MovesUsed, player2MovesUsed)
- [ ] Move count persisted to Redis in GameRoom state
- [ ] `getRemainingMoves()` method returns remaining moves
- [ ] `canMove()` method checks if player can move (movesUsed < 4)
- [ ] Move count incremented atomically on movement
- [ ] Move count retrieved from GameRoom state
- [ ] Unit tests for move tracking

## Technical Details

### Move Tracking Implementation

**File:** `src/service/MovementManager.ts`

```typescript
async getRemainingMoves(matchId: string, playerId: string): Promise<number> {
  const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
  if (!gameRoom) return 0;

  const movesUsed = playerId === gameRoom.player1Id
    ? gameRoom.player1MovesUsed
    : gameRoom.player2MovesUsed;

  return Math.max(0, 4 - movesUsed);
}

async canMove(matchId: string, playerId: string): Promise<boolean> {
  const remaining = await this.getRemainingMoves(matchId, playerId);
  return remaining > 0;
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – MovementManager (section 3.5)

## Labels

phase:game-engine, backend:game-engine, task, priority:medium

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-4-3: Enforce arena boundaries and move limit
```

Title: TASK-6-4-3: Enforce arena boundaries and move limit

Description:

## Story

Related to #X (STORY-6-4 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement comprehensive validation for movement that enforces arena boundaries (min/max X coordinates from arena configuration) and validates move limits before allowing movement. The validation must prevent out-of-bounds movement and provide clear error messages.

## Acceptance Criteria

- [ ] Arena boundaries retrieved from arena configuration
- [ ] Position validation against minX and maxX boundaries
- [ ] Movement rejected if new position out of bounds
- [ ] Move limit validation (4 moves max) before movement
- [ ] Clear error messages for validation failures
- [ ] Boundary validation integrated into movement flow
- [ ] Unit tests for boundary validation
- [ ] Unit tests for move limit validation

## Technical Details

### Boundary Validation Implementation

**File:** `src/service/MovementManager.ts`

```typescript
private async isValidPosition(position: Position, arenaId: string): Promise<boolean> {
  // Get arena configuration
  const arena = await this.getArenaConfig(arenaId);
  if (!arena) return false;

  // Check boundaries
  return position.x >= arena.boundaries.minX
    && position.x <= arena.boundaries.maxX
    && position.y >= arena.boundaries.minY
    && position.y <= arena.boundaries.maxY;
}

private async getArenaConfig(arenaId: string): Promise<ArenaConfig | null> {
  // Retrieve from Redis cache or configuration service
  const cached = await this.redisClient.get(`config:arena:${arenaId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  // Fallback to configuration service or database
  return null;
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – MovementManager validation (section 3.5)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Arena boundaries schema

## Labels

phase:game-engine, backend:game-engine, task, priority:medium

## Milestone

Phase 6: Game Engine

```

---

### STORY-6-5: Physics Engine Integration (US-025, US-027, US-028)

#### Issue Template:

```

Title: STORY-6-5: Integrate Matter.js physics engine for projectile system

Description:

## Epic

Related to #X (PHASE-6 issue number)

## User Story

As a player, I want realistic projectile arcs and collisions so that gameplay feels skill-based.

## Description

Integrate Matter.js physics engine to create realistic projectile trajectories with gravity, arena-specific gravity values, collision detection, and hit events. The system must create a Matter.js world per game room, simulate projectile bodies with physics, apply arena-specific gravity, detect collisions with terrain and players, and emit hit events for damage calculation. The implementation must use Adapter Pattern to wrap Matter.js, Strategy Pattern for different physics strategies, and integrate with the scoring system for accuracy calculations.

## Acceptance Criteria

- [ ] Matter.js engine created per game room with world configuration
- [ ] Projectile bodies created and simulated with gravity
- [ ] Arena-specific gravity values applied from arena configuration
- [ ] Collision detection implemented for terrain and player bodies
- [ ] Hit events emitted when projectiles collide with players
- [ ] Projectile trajectory calculated and tracked
- [ ] Physics update loop running at consistent frame rate
- [ ] Projectile bodies cleaned up after impact or timeout
- [ ] Physics world synchronized with game state
- [ ] Adapter Pattern used to wrap Matter.js engine
- [ ] Strategy Pattern used for different physics calculations
- [ ] Unit tests for PhysicsEngine with 80%+ coverage
- [ ] Integration tests for physics simulation

## Technical Details

### PhysicsEngine Service Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 3.6:

**File:** `src/service/PhysicsEngine.ts`

```typescript
export class PhysicsEngine {
  // Calculate projectile trajectory
  calculateTrajectory(weaponId: string, angle: number, power: number, arenaId: string, startPosition: Position): Promise<ProjectileTrajectory>;

  // Calculate projectile impact
  calculateImpact(trajectory: ProjectileTrajectory, targetPosition: Position): Promise<ImpactResult>;

  // Get arena gravity
  getArenaGravity(arenaId: string): Promise<number>;

  // Create physics world for game room
  createWorld(matchId: string, arenaId: string): Promise<Matter.World>;

  // Fire projectile
  fireProjectile(matchId: string, weaponId: string, angle: number, power: number, startPosition: Position): Promise<Projectile>;
}
```

### MatterJsAdapter Structure

**File:** `src/adapter/MatterJsAdapter.ts`

```typescript
export class MatterJsAdapter {
  private engine: Matter.Engine;
  private world: Matter.World;

  createWorld(arenaGravity: number): Matter.World;
  createProjectileBody(position: Position, velocity: Matter.Vector): Matter.Body;
  update(deltaTime: number): void;
  detectCollisions(callback: (bodyA: Matter.Body, bodyB: Matter.Body) => void): void;
}
```

### Design Patterns Applied

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 1.3:

- **Adapter Pattern**: `MatterJsAdapter` adapts Matter.js physics engine to PhysicsEngine interface
- **Strategy Pattern**: `PhysicsStrategy` allows different physics calculation strategies
- **Factory Pattern**: Physics world factory creates worlds per game room

### Physics Configuration

- Arena-specific gravity values (from arena configuration)
- Projectile mass and air resistance
- Collision categories (terrain, players, projectiles)
- Update frequency (e.g., 60 FPS)

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – PhysicsEngine responsibilities (section 3.6)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Physics system overview (section 2.5)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Arena gravity configuration
- **Game Engine Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml`

## Labels

phase:game-engine, backend:game-engine, feature, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-5-1: Set up Matter.js engine and world factory
```

Title: TASK-6-5-1: Set up Matter.js engine and world factory

Description:

## Story

Related to #X (STORY-6-5 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Set up Matter.js physics engine integration with world factory that creates physics worlds per game room, configures arena-specific gravity, sets up collision categories, and initializes the physics engine. The implementation must use Adapter Pattern to wrap Matter.js and provide a clean interface for the PhysicsEngine service.

## Acceptance Criteria

- [ ] Matter.js dependency installed and configured
- [ ] `MatterJsAdapter` class created with Adapter Pattern
- [ ] Physics world factory implemented
- [ ] Arena gravity retrieved from configuration and applied
- [ ] Collision categories defined (terrain, players, projectiles)
- [ ] Physics world created per game room
- [ ] World configuration stored and managed
- [ ] Unit tests for adapter and factory

## Technical Details

### MatterJsAdapter Implementation

**File:** `src/adapter/MatterJsAdapter.ts`

```typescript
import Matter from "matter-js";

export class MatterJsAdapter {
  private engine: Matter.Engine;
  private world: Matter.World;

  constructor(arenaGravity: number) {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;

    // Configure gravity (Matter.js uses {x, y} format)
    this.engine.world.gravity.y = arenaGravity;
    this.engine.world.gravity.x = 0; // No horizontal gravity
  }

  createWorld(arenaGravity: number): Matter.World {
    const engine = Matter.Engine.create();
    engine.world.gravity.y = arenaGravity;
    engine.world.gravity.x = 0;
    return engine.world;
  }

  update(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime);
  }

  getWorld(): Matter.World {
    return this.world;
  }
}
```

### Physics World Factory

**File:** `src/factory/PhysicsWorldFactory.ts`

```typescript
export class PhysicsWorldFactory {
  async createWorld(matchId: string, arenaId: string): Promise<Matter.World> {
    // Get arena gravity
    const arenaGravity = await this.getArenaGravity(arenaId);

    // Create adapter
    const adapter = new MatterJsAdapter(arenaGravity);

    // Create world
    const world = adapter.createWorld(arenaGravity);

    // Store world reference
    await this.storeWorld(matchId, world);

    return world;
  }

  private async getArenaGravity(arenaId: string): Promise<number> {
    // Retrieve from Redis cache or configuration
    const cached = await this.redisClient.get(`config:arena:${arenaId}`);
    if (cached) {
      const arena = JSON.parse(cached);
      return arena.gravity;
    }
    return 0.8; // Default gravity
  }
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Adapter Pattern (section 4.10)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Arena gravity configuration

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-5-2: Implement projectile creation and update loop
```

Title: TASK-6-5-2: Implement projectile creation and update loop

Description:

## Story

Related to #X (STORY-6-5 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement projectile creation system that creates Matter.js bodies for projectiles, calculates initial velocity from angle and power, and implements physics update loop that runs at consistent frame rate. The update loop must track projectile positions, handle projectile lifecycle (creation, simulation, cleanup), and integrate with game state.

## Acceptance Criteria

- [ ] Projectile body creation implemented
- [ ] Initial velocity calculated from angle and power
- [ ] Physics update loop running at 60 FPS (or configurable)
- [ ] Projectile positions tracked and updated
- [ ] Projectile lifecycle managed (create, update, cleanup)
- [ ] Projectile timeout handling (remove after max flight time)
- [ ] Update loop integrated with game state
- [ ] Unit tests for projectile creation and update

## Technical Details

### Projectile Creation Implementation

**File:** `src/service/PhysicsEngine.ts`

```typescript
async fireProjectile(matchId: string, weaponId: string, angle: number, power: number, startPosition: Position): Promise<Projectile> {
  const world = await this.getWorld(matchId);
  if (!world) {
    throw new Error('Physics world not found');
  }

  // Calculate initial velocity from angle and power
  const velocity = this.calculateVelocity(angle, power);

  // Create projectile body
  const body = Matter.Bodies.circle(startPosition.x, startPosition.y, 5, {
    frictionAir: 0.01,
    restitution: 0.5,
    collisionFilter: {
      category: 0x0002, // Projectile category
      mask: 0x0001 | 0x0004 // Collide with terrain and players
    }
  });

  // Set velocity
  Matter.Body.setVelocity(body, velocity);

  // Add to world
  Matter.World.add(world, body);

  // Create projectile object
  const projectile: Projectile = {
    id: generateId(),
    body,
    weaponId,
    startPosition,
    startTime: Date.now()
  };

  // Store projectile
  await this.storeProjectile(matchId, projectile);

  return projectile;
}

private calculateVelocity(angle: number, power: number): Matter.Vector {
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.cos(radians) * power,
    y: Math.sin(radians) * power
  };
}
```

### Physics Update Loop

**File:** `src/service/PhysicsEngine.ts`

```typescript
private startUpdateLoop(matchId: string): void {
  const interval = setInterval(async () => {
    const world = await this.getWorld(matchId);
    if (!world) {
      clearInterval(interval);
      return;
    }

    // Update physics engine
    Matter.Engine.update(this.engine, 1000 / 60); // 60 FPS

    // Update projectile positions
    await this.updateProjectiles(matchId);

    // Check for timeouts
    await this.checkProjectileTimeouts(matchId);
  }, 1000 / 60); // 60 FPS

  this.updateLoops.set(matchId, interval);
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – PhysicsEngine (section 3.6)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-5-3: Implement collision and hit detection callbacks
```

Title: TASK-6-5-3: Implement collision and hit detection callbacks

Description:

## Story

Related to #X (STORY-6-5 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement collision detection system that detects collisions between projectiles and terrain/players, calculates hit accuracy, emits hit events, and triggers damage calculation. The collision detection must use Matter.js collision events, identify collision types (terrain hit, player hit), calculate impact position and accuracy, and integrate with HealthSystem and ScoringSystem.

## Acceptance Criteria

- [ ] Matter.js collision events registered
- [ ] Collision detection for terrain hits
- [ ] Collision detection for player hits
- [ ] Hit accuracy calculated (distance from target)
- [ ] Hit events emitted via Socket.io
- [ ] Collision callbacks integrated with HealthSystem
- [ ] Collision callbacks integrated with ScoringSystem
- [ ] Projectile cleanup after collision
- [ ] Unit tests for collision detection

## Technical Details

### Collision Detection Implementation

**File:** `src/service/PhysicsEngine.ts`

```typescript
private setupCollisionDetection(matchId: string): void {
  Matter.Events.on(this.engine, 'collisionStart', async (event) => {
    const pairs = event.pairs;

    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;

      // Check if projectile hit something
      if (this.isProjectile(bodyA) || this.isProjectile(bodyB)) {
        const projectile = this.isProjectile(bodyA) ? bodyA : bodyB;
        const target = this.isProjectile(bodyA) ? bodyB : bodyA;

        // Get projectile data
        const projectileData = await this.getProjectileData(matchId, projectile.id);
        if (!projectileData) continue;

        // Check collision type
        if (this.isPlayer(target)) {
          // Player hit
          await this.handlePlayerHit(matchId, projectileData, target);
        } else if (this.isTerrain(target)) {
          // Terrain hit
          await this.handleTerrainHit(matchId, projectileData, target);
        }

        // Remove projectile
        await this.removeProjectile(matchId, projectile.id);
      }
    }
  });
}

private async handlePlayerHit(matchId: string, projectile: Projectile, targetBody: Matter.Body): Promise<void> {
  const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
  if (!gameRoom) return;

  // Determine which player was hit
  const hitPlayerId = this.getPlayerIdFromBody(targetBody, gameRoom);
  if (!hitPlayerId) return;

  // Calculate hit accuracy
  const targetPosition = this.getPlayerPosition(hitPlayerId, gameRoom);
  const hitPosition = { x: targetBody.position.x, y: targetBody.position.y };
  const accuracy = this.calculateAccuracy(hitPosition, targetPosition);

  // Emit hit event
  this.io.to(`match:${matchId}`).emit('projectile-hit', {
    projectileId: projectile.id,
    hitPlayerId,
    hitPosition,
    accuracy
  });

  // Trigger damage calculation
  await this.healthSystem.applyDamage(matchId, hitPlayerId, projectile.weaponId, accuracy);

  // Trigger scoring
  await this.scoringSystem.calculateHitScore(matchId, projectile.weaponId, accuracy);
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – PhysicsEngine collision (section 3.6)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

---

### STORY-6-6: Scoring & Win Conditions (US-035–US-038, US-032, US-034)

#### Issue Template:

```

Title: STORY-6-6: Implement scoring system and win condition detection

Description:

## Epic

Related to #X (PHASE-6 issue number)

## User Story

As a player, I want fair scoring and clear win conditions so that matches feel rewarding.

## Description

Implement comprehensive scoring system with accuracy-based scoring, bonuses for back-to-back hits and repositioning saves, and win condition detection that handles instant wins (HP = 0), wins by higher HP at match end, and draw conditions (same HP and score). The system must use Strategy Pattern for different scoring strategies, Decorator Pattern for score modifiers, integrate with HealthSystem for HP tracking, and use MatchResultProcessor to update Profile and Leaderboard services after match completion. This ensures fair, rewarding gameplay with clear match outcomes.

## Acceptance Criteria

- [ ] Accuracy-based scoring implemented (based on hit distance from target)
- [ ] Back-to-back hit bonus calculated and applied
- [ ] Repositioning save bonus calculated and applied (movement after enemy shot)
- [ ] Instant win detection when player HP reaches 0
- [ ] Win condition checked at match end (higher HP wins)
- [ ] Draw condition detected (same HP AND same score)
- [ ] Scoring strategies implemented using Strategy Pattern
- [ ] Score modifiers applied using Decorator Pattern
- [ ] Match result processed and saved to MongoDB
- [ ] Profile Service called to update player statistics
- [ ] Leaderboard Service called to update rankings
- [ ] Match result events emitted to clients
- [ ] Unit tests for ScoringSystem with 80%+ coverage
- [ ] Unit tests for WinConditionChecker with 80%+ coverage
- [ ] Integration tests for match result processing

## Technical Details

### ScoringSystem Service Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 3.7:

**File:** `src/service/ScoringSystem.ts`

```typescript
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

### WinConditionChecker Service Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 3.9:

**File:** `src/service/WinConditionChecker.ts`

```typescript
export class WinConditionChecker {
  // Check win condition
  checkWinCondition(matchId: string): Promise<WinConditionResult>;

  // Check draw condition
  checkDrawCondition(matchId: string): Promise<boolean>;

  // Determine winner at match end
  determineWinner(matchId: string): Promise<string | null>;
}
```

### MatchResultProcessor Service Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 3.11:

**File:** `src/service/MatchResultProcessor.ts`

```typescript
export class MatchResultProcessor {
  // Process match result
  processMatchResult(matchId: string, matchResult: MatchResult): Promise<void>;
}
```

### Design Patterns Applied

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) section 1.3:

- **Strategy Pattern**: `ScoringStrategy` allows different scoring algorithms (accuracy, back-to-back, repositioning)
- **Decorator Pattern**: `ScoringDecorator` adds score modifiers dynamically
- **Strategy Pattern**: `WinConditionStrategy` allows different win condition algorithms
- **Template Method Pattern**: `MatchResultProcessor` defines algorithm skeleton for match result processing

### Scoring Formulas

- **Accuracy Score:** Based on hit distance from target center (closer = higher score)
- **Back-to-Back Bonus:** Multiplier for consecutive hits (e.g., 1.5x for 2 hits, 2x for 3+ hits)
- **Repositioning Save:** Bonus points if player moved after enemy shot and avoided hit

### Win Conditions

1. **Instant Win:** Player HP reaches 0 → opponent wins immediately
2. **Match End Win:** At match end (time limit or turn limit), player with higher HP wins
3. **Draw:** Same HP AND same score → match is a draw

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – ScoringSystem, WinConditionChecker, MatchResultProcessor (sections 3.7, 3.9, 3.11)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Scoring and win conditions (section 2.5)
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Profile update API
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Leaderboard update API
- **Game Engine Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml`

## Labels

phase:game-engine, backend:game-engine, feature, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-6-1: Implement ScoreService and scoring formulas
```

Title: TASK-6-6-1: Implement ScoreService and scoring formulas

Description:

## Story

Related to #X (STORY-6-6 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement `ScoringSystem` service with accuracy-based scoring, back-to-back hit bonuses, and repositioning save bonuses. The implementation must use Strategy Pattern for different scoring strategies, Decorator Pattern for score modifiers, calculate scores based on hit accuracy, track consecutive hits for bonuses, and detect repositioning saves. Scores must be persisted to game state and updated in real-time.

## Acceptance Criteria

- [ ] `ScoringSystem` class created with scoring methods
- [ ] Accuracy score calculation implemented (based on hit distance)
- [ ] Back-to-back hit tracking implemented
- [ ] Back-to-back bonus calculation implemented
- [ ] Repositioning save detection implemented
- [ ] Repositioning save bonus calculation implemented
- [ ] Total score calculation combines all components
- [ ] Score persisted to GameRoom state
- [ ] Strategy Pattern used for scoring strategies
- [ ] Decorator Pattern used for score modifiers
- [ ] Unit tests for all scoring formulas
- [ ] Unit tests for score modifiers

## Technical Details

### ScoringSystem Implementation

**File:** `src/service/ScoringSystem.ts`

```typescript
export class ScoringSystem {
  constructor(
    private gameRoomManager: GameRoomManager,
    private scoringStrategies: Map<string, ScoringStrategy>,
    private scoreDecorators: ScoringDecorator[],
  ) {}

  calculateAccuracyScore(hitArea: number, maxHitArea: number): number {
    // Accuracy = (1 - (hitArea / maxHitArea)) * baseScore
    const accuracy = 1 - hitArea / maxHitArea;
    const baseScore = 100;
    return Math.max(0, Math.floor(accuracy * baseScore));
  }

  async calculateBackToBackBonus(matchId: string, playerId: string): Promise<number> {
    const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
    if (!gameRoom) return 0;

    // Get consecutive hits count
    const consecutiveHits = await this.getConsecutiveHits(matchId, playerId);

    if (consecutiveHits >= 3) {
      return 50; // 2x bonus for 3+ hits
    } else if (consecutiveHits === 2) {
      return 25; // 1.5x bonus for 2 hits
    }
    return 0;
  }

  async calculateRepositioningSaveScore(matchId: string, playerId: string, enemyShot: ShotData): Promise<number> {
    // Check if player moved after enemy shot
    const movedAfterShot = await this.checkMovementAfterShot(matchId, playerId, enemyShot);
    if (movedAfterShot) {
      return 30; // Repositioning save bonus
    }
    return 0;
  }

  async calculateTotalScore(matchId: string, playerId: string, action: GameAction): Promise<number> {
    let totalScore = 0;

    // Base accuracy score
    if (action.type === "hit") {
      totalScore += this.calculateAccuracyScore(action.hitArea, action.maxHitArea);
    }

    // Back-to-back bonus
    totalScore += await this.calculateBackToBackBonus(matchId, playerId);

    // Repositioning save bonus
    if (action.type === "save") {
      totalScore += await this.calculateRepositioningSaveScore(matchId, playerId, action.enemyShot);
    }

    // Apply decorators
    for (const decorator of this.scoreDecorators) {
      totalScore = decorator.modify(totalScore, action);
    }

    // Update game state
    await this.updatePlayerScore(matchId, playerId, totalScore);

    return totalScore;
  }
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – ScoringSystem (section 3.7)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-6-2: Implement WinConditionService
```

Title: TASK-6-6-2: Implement WinConditionService

Description:

## Story

Related to #X (STORY-6-6 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement `WinConditionChecker` service that detects win conditions (instant win on HP = 0, win by higher HP at match end) and draw conditions (same HP and score). The implementation must check win conditions continuously during gameplay and at match end, integrate with HealthSystem and ScoringSystem, and emit win/draw events.

## Acceptance Criteria

- [ ] `WinConditionChecker` class created with win condition methods
- [ ] Instant win detection when HP = 0
- [ ] Match end win condition (higher HP wins)
- [ ] Draw condition detection (same HP AND same score)
- [ ] Win condition checked after each damage application
- [ ] Win condition checked at match end
- [ ] Win/draw events emitted via Socket.io
- [ ] Strategy Pattern used for win condition strategies
- [ ] Unit tests for all win conditions
- [ ] Unit tests for draw conditions

## Technical Details

### WinConditionChecker Implementation

**File:** `src/service/WinConditionChecker.ts`

```typescript
export class WinConditionChecker {
  constructor(
    private gameRoomManager: GameRoomManager,
    private healthSystem: HealthSystem,
    private scoringSystem: ScoringSystem,
  ) {}

  async checkWinCondition(matchId: string): Promise<WinConditionResult> {
    const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
    if (!gameRoom) {
      return { hasWinner: false };
    }

    // Check instant win (HP = 0)
    if (gameRoom.player1Health <= 0) {
      return { hasWinner: true, winnerId: gameRoom.player2Id, reason: "instant_win" };
    }
    if (gameRoom.player2Health <= 0) {
      return { hasWinner: true, winnerId: gameRoom.player1Id, reason: "instant_win" };
    }

    // Check match end conditions
    const shouldEnd = await this.turnManager.shouldEndMatch(matchId);
    if (shouldEnd) {
      return await this.determineWinner(matchId);
    }

    return { hasWinner: false };
  }

  async determineWinner(matchId: string): Promise<WinConditionResult> {
    const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
    if (!gameRoom) {
      return { hasWinner: false };
    }

    // Check draw condition (same HP AND same score)
    if (gameRoom.player1Health === gameRoom.player2Health && gameRoom.player1Score === gameRoom.player2Score) {
      return { hasWinner: false, isDraw: true };
    }

    // Higher HP wins
    if (gameRoom.player1Health > gameRoom.player2Health) {
      return { hasWinner: true, winnerId: gameRoom.player1Id, reason: "higher_hp" };
    } else if (gameRoom.player2Health > gameRoom.player1Health) {
      return { hasWinner: true, winnerId: gameRoom.player2Id, reason: "higher_hp" };
    }

    // If HP is same, higher score wins
    if (gameRoom.player1Score > gameRoom.player2Score) {
      return { hasWinner: true, winnerId: gameRoom.player1Id, reason: "higher_score" };
    } else if (gameRoom.player2Score > gameRoom.player1Score) {
      return { hasWinner: true, winnerId: gameRoom.player2Id, reason: "higher_score" };
    }

    // True draw
    return { hasWinner: false, isDraw: true };
  }
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – WinConditionChecker (section 3.9)

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-6-3: Emit match result and call Profile Service to update stats
```

Title: TASK-6-6-3: Emit match result and call Profile Service to update stats

Description:

## Story

Related to #X (STORY-6-6 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement `MatchResultProcessor` service that processes match results, saves match data to MongoDB, calls Profile Service to update player statistics (wins, losses, global score), and calls Leaderboard Service to update rankings. The implementation must use Template Method Pattern, handle errors gracefully, emit match result events to clients, and ensure data consistency across services.

## Acceptance Criteria

- [ ] `MatchResultProcessor` class created with result processing methods
- [ ] Match result saved to MongoDB Matches collection
- [ ] Profile Service called to update player statistics
- [ ] Leaderboard Service called to update rankings
- [ ] Match result events emitted to clients
- [ ] Error handling for service calls
- [ ] Retry logic for failed service calls
- [ ] Template Method Pattern used for processing algorithm
- [ ] Unit tests for match result processing
- [ ] Integration tests for service calls

## Technical Details

### MatchResultProcessor Implementation

**File:** `src/service/MatchResultProcessor.ts`

```typescript
export class MatchResultProcessor {
  constructor(
    private matchRepository: MatchRepository,
    private profileServiceClient: ProfileServiceClient,
    private leaderboardServiceClient: LeaderboardServiceClient,
    private io: Server,
  ) {}

  async processMatchResult(matchId: string, matchResult: MatchResult): Promise<void> {
    // Save match to MongoDB
    await this.saveMatch(matchId, matchResult);

    // Update player profiles
    await this.updatePlayerProfiles(matchId, matchResult);

    // Update leaderboard
    await this.updateLeaderboard(matchId, matchResult);

    // Emit match result event
    this.io.to(`match:${matchId}`).emit("match-result", matchResult);
  }

  private async saveMatch(matchId: string, matchResult: MatchResult): Promise<void> {
    const match = {
      matchId,
      player1Id: matchResult.player1Id,
      player2Id: matchResult.player2Id,
      winnerId: matchResult.winnerId,
      isDraw: matchResult.isDraw,
      player1Score: matchResult.player1Score,
      player2Score: matchResult.player2Score,
      player1Health: matchResult.player1Health,
      player2Health: matchResult.player2Health,
      duration: matchResult.duration,
      completedAt: new Date(),
    };

    await this.matchRepository.save(match);
  }

  private async updatePlayerProfiles(matchId: string, matchResult: MatchResult): Promise<void> {
    // Update player 1
    await this.profileServiceClient.updateMatchResult(matchResult.player1Id, {
      won: matchResult.winnerId === matchResult.player1Id,
      scoreChange: matchResult.player1Score,
    });

    // Update player 2
    await this.profileServiceClient.updateMatchResult(matchResult.player2Id, {
      won: matchResult.winnerId === matchResult.player2Id,
      scoreChange: matchResult.player2Score,
    });
  }

  private async updateLeaderboard(matchId: string, matchResult: MatchResult): Promise<void> {
    // Leaderboard updates are handled by Profile Service score changes
    // No direct call needed if leaderboard reads from Profile Service
  }
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – MatchResultProcessor (section 3.11)
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Profile update API
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – Inter-service communication

## Labels

phase:game-engine, backend:game-engine, task, priority:high

## Milestone

Phase 6: Game Engine

```

---

### STORY-6-7: Disconnection Handling

#### Issue Template:

```

Title: STORY-6-7: Implement disconnection handling (1-minute rejoin window)

Description:

## Epic

Related to #X (PHASE-6 issue number)

## User Story

As a player, I want to be able to rejoin a match within a short window so that network issues don't auto-lose games.

## Description

Implement comprehensive disconnection handling system that detects player disconnections, provides a 1-minute rejoin window per match, restores game state on rejoin, and handles forfeit logic when rejoin window expires. The system must track player connections/disconnections via Socket.io events, generate rejoin tokens, manage rejoin window timers, pause game state during rejoin window, restore complete game state on rejoin, and automatically forfeit matches when rejoin window expires. This ensures players don't lose matches due to temporary network issues while preventing indefinite game pauses.

## Acceptance Criteria

- [ ] Disconnection detection via Socket.io disconnect events
- [ ] Connection tracking per player per match
- [ ] 1-minute rejoin window timer per match
- [ ] Rejoin token generation and validation
- [ ] Game state paused during rejoin window (turn timer paused)
- [ ] Rejoin restores complete game state (position, health, score, turn state)
- [ ] Rejoin events emitted to clients
- [ ] Forfeit logic when rejoin window expires (1 minute)
- [ ] Match ends automatically on forfeit
- [ ] Rejoin token stored in Redis with TTL
- [ ] Rejoin validation (token, matchId, playerId)
- [ ] Unit tests for disconnection handling
- [ ] Integration tests for rejoin flow

## Technical Details

### DisconnectionService Structure

Based on [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md):

**File:** `src/service/DisconnectionService.ts`

```typescript
export class DisconnectionService {
  // Track disconnection
  handleDisconnection(matchId: string, playerId: string): Promise<void>;

  // Handle rejoin
  handleRejoin(matchId: string, playerId: string, rejoinToken: string): Promise<RejoinResult>;

  // Check if player can rejoin
  canRejoin(matchId: string, playerId: string): Promise<boolean>;

  // Forfeit match
  forfeitMatch(matchId: string, playerId: string): Promise<void>;
}
```

### Rejoin Token Structure

**Redis Storage:**

- **Type:** String
- **Key:** `rejoin:{matchId}:{playerId}`
- **Value:** JSON string with `{ token, expiresAt, gameState }`
- **TTL:** 60 seconds (1 minute)

### Design Patterns Applied

- **State Pattern**: Game state paused/resumed during rejoin window
- **Token Pattern**: Rejoin tokens for secure rejoin validation
- **Observer Pattern**: Disconnection/rejoin events emitted to clients

### Rejoin Flow

1. Player disconnects → `disconnect` event fired
2. DisconnectionService detects → generates rejoin token
3. Rejoin window timer starts (60 seconds)
4. Game state paused (turn timer paused)
5. Player reconnects → provides rejoin token
6. Token validated → game state restored
7. Game resumes → turn timer resumes

### Forfeit Flow

1. Rejoin window expires (60 seconds)
2. Forfeit logic triggered
3. Match ends → opponent wins
4. Match result processed
5. Game room cleaned up

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Disconnection handling
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Disconnection handling (section 2.5)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Redis rejoin token storage
- **Game Engine Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml`

## Labels

phase:game-engine, backend:game-engine, feature, priority:medium

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-7-1: Track player connections/disconnections
```

Title: TASK-6-7-1: Track player connections/disconnections

Description:

## Story

Related to #X (STORY-6-7 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement connection tracking system that monitors player connections and disconnections via Socket.io events, stores connection state in Redis, and triggers disconnection handling when players disconnect. The tracking must identify which players are connected to which matches, handle multiple connection attempts, and clean up connection state on match end.

## Acceptance Criteria

- [ ] Socket.io disconnect event handler implemented
- [ ] Connection state tracked per player per match
- [ ] Connection state stored in Redis
- [ ] Disconnection detection triggers rejoin window
- [ ] Multiple connection attempts handled (idempotent)
- [ ] Connection state cleaned up on match end
- [ ] Connection events logged for debugging
- [ ] Unit tests for connection tracking

## Technical Details

### Connection Tracking Implementation

**File:** `src/service/DisconnectionService.ts`

```typescript
export class DisconnectionService {
  constructor(
    private gameRoomManager: GameRoomManager,
    private redisClient: Redis,
    private io: Server,
  ) {}

  async handleDisconnection(matchId: string, playerId: string): Promise<void> {
    // Mark player as disconnected
    await this.markDisconnected(matchId, playerId);

    // Generate rejoin token
    const rejoinToken = this.generateRejoinToken();

    // Store rejoin token with game state
    const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
    if (gameRoom) {
      await this.storeRejoinToken(matchId, playerId, rejoinToken, gameRoom);
    }

    // Start rejoin window timer
    this.startRejoinWindow(matchId, playerId);

    // Pause game state
    await this.pauseGameState(matchId);

    // Emit disconnection event
    this.io.to(`match:${matchId}`).emit("player-disconnected", {
      playerId,
      rejoinWindowSeconds: 60,
    });
  }

  private async markDisconnected(matchId: string, playerId: string): Promise<void> {
    const key = `connection:{matchId}:{playerId}`;
    await this.redisClient.setex(
      key,
      60,
      JSON.stringify({
        connected: false,
        disconnectedAt: new Date(),
      }),
    );
  }
}
```

### Socket.io Event Handler

**File:** `src/controller/GameEngineController.ts`

```typescript
socket.on("disconnect", async () => {
  const matchId = socket.data.matchId;
  const playerId = socket.data.userId;

  if (matchId && playerId) {
    await disconnectionService.handleDisconnection(matchId, playerId);
  }
});
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Disconnection handling
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – WebSocket patterns

## Labels

phase:game-engine, backend:game-engine, task, priority:medium

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-7-2: Implement rejoin tokens and window timers
```

Title: TASK-6-7-2: Implement rejoin tokens and window timers

Description:

## Story

Related to #X (STORY-6-7 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement rejoin token generation, validation, and storage system with 1-minute rejoin window timers. The system must generate secure rejoin tokens, store them in Redis with TTL, validate tokens on rejoin attempts, manage rejoin window timers, and handle token expiration. Rejoin tokens must include game state snapshot for restoration.

## Acceptance Criteria

- [ ] Rejoin token generation implemented (secure random token)
- [ ] Rejoin token stored in Redis with TTL (60 seconds)
- [ ] Rejoin token includes game state snapshot
- [ ] Rejoin window timer implemented (60 seconds)
- [ ] Token validation on rejoin attempts
- [ ] Token expiration handling
- [ ] Game state snapshot stored with token
- [ ] Unit tests for token generation and validation

## Technical Details

### Rejoin Token Implementation

**File:** `src/service/DisconnectionService.ts`

```typescript
private generateRejoinToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

private async storeRejoinToken(matchId: string, playerId: string, token: string, gameRoom: GameRoom): Promise<void> {
  const key = `rejoin:${matchId}:${playerId}`;
  const value = JSON.stringify({
    token,
    expiresAt: new Date(Date.now() + 60000), // 1 minute
    gameState: {
      player1Position: gameRoom.player1Position,
      player2Position: gameRoom.player2Position,
      player1Health: gameRoom.player1Health,
      player2Health: gameRoom.player2Health,
      player1Score: gameRoom.player1Score,
      player2Score: gameRoom.player2Score,
      currentTurn: gameRoom.currentTurn,
      turnNumber: gameRoom.turnNumber
    }
  });

  await this.redisClient.setex(key, 60, value); // 60 second TTL
}

async handleRejoin(matchId: string, playerId: string, rejoinToken: string): Promise<RejoinResult> {
  const key = `rejoin:${matchId}:${playerId}`;
  const data = await this.redisClient.get(key);

  if (!data) {
    return { success: false, reason: 'Rejoin window expired' };
  }

  const rejoinData = JSON.parse(data);

  if (rejoinData.token !== rejoinToken) {
    return { success: false, reason: 'Invalid rejoin token' };
  }

  // Restore game state
  await this.restoreGameState(matchId, rejoinData.gameState);

  // Delete rejoin token
  await this.redisClient.del(key);

  // Resume game state
  await this.resumeGameState(matchId);

  // Emit rejoin event
  this.io.to(`match:${matchId}`).emit('player-rejoined', { playerId });

  return { success: true, gameState: rejoinData.gameState };
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Disconnection handling
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Redis token storage

## Labels

phase:game-engine, backend:game-engine, task, priority:medium

## Milestone

Phase 6: Game Engine

```

#### Subtask: TASK-6-7-3: Implement forfeit and match end on no rejoin
```

Title: TASK-6-7-3: Implement forfeit and match end on no rejoin

Description:

## Story

Related to #X (STORY-6-7 issue number)

## Epic

Related to #X (PHASE-6 issue number)

## Description

Implement forfeit logic that automatically ends matches when rejoin window expires (1 minute) without player rejoin. The forfeit must declare the opponent as winner, process match result, clean up game state, and handle edge cases (both players disconnect, rejoin after forfeit attempt).

## Acceptance Criteria

- [ ] Rejoin window timer expires after 60 seconds
- [ ] Forfeit logic triggered on expiration
- [ ] Opponent declared as winner
- [ ] Match result processed (opponent wins)
- [ ] Match end events emitted
- [ ] Game room cleaned up
- [ ] Edge cases handled (both players disconnect)
- [ ] Rejoin attempts after forfeit rejected
- [ ] Unit tests for forfeit logic

## Technical Details

### Forfeit Implementation

**File:** `src/service/DisconnectionService.ts`

```typescript
private startRejoinWindow(matchId: string, playerId: string): void {
  const timer = setTimeout(async () => {
    // Check if player rejoined
    const canRejoin = await this.canRejoin(matchId, playerId);
    if (!canRejoin) {
      // Forfeit match
      await this.forfeitMatch(matchId, playerId);
    }
  }, 60000); // 60 seconds

  this.rejoinTimers.set(`${matchId}:${playerId}`, timer);
}

async forfeitMatch(matchId: string, playerId: string): Promise<void> {
  const gameRoom = await this.gameRoomManager.getGameRoom(matchId);
  if (!gameRoom) return;

  // Determine winner (opponent)
  const winnerId = playerId === gameRoom.player1Id
    ? gameRoom.player2Id
    : gameRoom.player1Id;

  // Create match result
  const matchResult: MatchResult = {
    matchId,
    player1Id: gameRoom.player1Id,
    player2Id: gameRoom.player2Id,
    winnerId,
    isDraw: false,
    player1Score: gameRoom.player1Score,
    player2Score: gameRoom.player2Score,
    player1Health: gameRoom.player1Health,
    player2Health: gameRoom.player2Health,
    duration: Math.floor((new Date().getTime() - gameRoom.matchStartTime.getTime()) / 1000),
    forfeit: true,
    forfeitPlayerId: playerId
  };

  // Process match result
  await this.matchResultProcessor.processMatchResult(matchId, matchResult);

  // Emit forfeit event
  this.io.to(`match:${matchId}`).emit('match-forfeit', {
    forfeitPlayerId: playerId,
    winnerId
  });

  // Clean up game room
  await this.gameRoomManager.deleteGameRoom(matchId);
}
```

## Related Documentation

- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Disconnection handling
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Forfeit handling

## Labels

phase:game-engine, backend:game-engine, task, priority:medium

## Milestone

Phase 6: Game Engine

```

```
