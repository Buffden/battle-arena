# Phase 5: Matchmaking Service

**⚠️ NOTE: This is REFERENCE DOCUMENTATION for Matchmaking Service technical details.**

**For implementation planning, see:**

- EPIC-4: Matchmaking & Pre-Game (uses Matchmaking Service details from this file)

**This phase file contains:**

- Matchmaking Service architecture
- Design patterns (Facade, Strategy, Repository, Event-Driven)
- API specifications
- Code structure examples
- Technical implementation details
- Stories and tasks for Matchmaking Service

**Epics will reference this file for technical specs, but implementation follows epic-based feature development (game studio approach).**

---

**Copy and paste these templates directly into GitHub Issues.**

---

## PHASE-5: Matchmaking Service - Technical Reference

### Issue Template:

```
Title: PHASE-5: Matchmaking Service

Description:
## Overview
Implement a real-time matchmaking system using Node.js, Socket.io, and Redis. This phase document provides technical reference for the Matchmaking Service (Port 3002) that manages hero selection, matchmaking queues, matchmaking algorithm, queue status, and arena/weapon selection coordination. The service follows clean architecture principles and design patterns (Facade, Strategy, Repository, Event-Driven).

## Goals
- Real-time matchmaking queue management
- Multiple hero selection and storage
- Matchmaking based on global score/rank and hero compatibility
- Queue status (position, ETA) updates via Socket.io
- Arena selection voting/elimination integration
- Weapon selection coordination (turn-based picks)

## Success Criteria
- [ ] Users can join and leave matchmaking queue
- [ ] Hero selection stored and used for matchmaking
- [ ] Matches created based on score/rank and hero compatibility
- [ ] Queue position and estimated wait time displayed
- [ ] Integration with Profile Service (scores) and Game Engine Service (match creation)
- [ ] Unit tests with 80%+ coverage for core algorithms

## Technical Architecture

### Service Details
Based on [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 2.4:
- **Technology:** Node.js (Express + Socket.io)
- **Port:** 3002
- **Data Store:** Redis (queues, lobby, matchmaking state)
- **Communication:** WebSocket (Socket.io) and internal REST calls
- **Security:** JWT validation on WebSocket connections

### Key Components
Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md):
- **MatchmakingGateway** (Socket.io) - Entry point for real-time events
- **MatchmakingService** - Matchmaking algorithm and queue logic
- **QueueService** - Redis-based queue operations
- **HeroSelectionService** - Manages multiple hero selection
- **ArenaSelectionService** - Handles arena voting/elimination flow
- **WeaponSelectionService** - Coordinates weapon drafting

## Related Documentation
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md)

## Labels
phase:matchmaking, backend:matchmaking, priority:high

## Milestone
Phase 5: Matchmaking
```

---

### STORY-5-1: Matchmaking Service - Node.js Setup

#### Issue Template:

```
Title: STORY-5-1: Matchmaking Service - Node.js Setup

Description:
## Epic
Related to #X (PHASE-5 issue number)

## Description
Initialize Node.js project for Matchmaking Service with Express, Socket.io, and Redis integration following the LLD and component design.

## Acceptance Criteria
- [ ] Node.js project created
- [ ] Express server configured
- [ ] Socket.io server configured
- [ ] Redis connection configured
- [ ] Project structure follows clean architecture
- [ ] Basic health endpoint exposed (e.g. GET `/health`)
- [ ] Local README documents how to run the service in dev and via Docker

## Technical Details
- Create `backend-services/matchmaking-service/`
- Use TypeScript (recommended) or JavaScript
- Configure environment variables for Redis and JWT
- Ensure logging and basic error handling middleware are wired into Express

## Related Documentation
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) (sections 1.1–1.3)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Matchmaking responsibilities (section 2.4)
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Matchmaking%20Service%20Class%20Diagram.png)

## Labels
phase:matchmaking, backend:matchmaking, feature, priority:high

## Milestone
Phase 5: Matchmaking
```

#### Subtask: TASK-5-1-1: Create Node.js project structure

```
Title: TASK-5-1-1: Create Node.js project structure

Description:
## Story
Related to #X (STORY-5-1 issue number)

## Epic
Related to #X (PHASE-5 issue number)

## Description
Create the complete Node.js project structure for Matchmaking Service following clean architecture principles with strict layer separation. The structure must support Express HTTP server, Socket.io WebSocket server, Redis integration, and all matchmaking components as specified in the Matchmaking Service LLD. This includes establishing the proper directory layout, package organization, and entry point to bootstrap the service with both HTTP and WebSocket capabilities.

## Acceptance Criteria
- [ ] `backend-services/matchmaking-service/` directory created
- [ ] Standard Node.js directory structure created: `src/`, `src/config/`, `src/controllers/`, `src/services/`, `src/middleware/`, `src/routes/`, `src/utils/`, `src/types/`, `src/models/`
- [ ] Main entry point created (`server.js` or `index.ts`) that starts Express and Socket.io servers
- [ ] Directory structure follows clean architecture layers (controllers, services, middleware, utils)
- [ ] Package structure documented and matches Matchmaking Service LLD specification
- [ ] README.md created with service description, port (3002), and how to run
- [ ] All directories follow Node.js/TypeScript naming conventions
- [ ] Structure supports Facade, Strategy, State, and Factory design patterns

## Technical Details

### Required Folder Structure
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.2 and [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md):

```

backend-services/matchmaking-service/
├── src/
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
│ └── index.ts (or server.js)
├── package.json
├── tsconfig.json (if TypeScript)
├── .env.example
└── README.md

````

### Design Patterns Applied
Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 1.3:

- **Facade Pattern**: `MatchmakingController`, `MatchmakingService`, `QueueManager` provide simplified interfaces
- **Strategy Pattern**: `MatchingStrategy`, `HeroSelectionStrategy` interfaces for interchangeable algorithms
- **State Pattern**: `ArenaSelectionState`, `WeaponSelectionState` for state management
- **Factory Pattern**: `LobbyFactory`, `MatchFactory` for object creation
- **Clean Architecture**: Strict separation between controllers (presentation), services (business logic), and data access layers

### Package Organization Principles
- **controllers/**: WebSocket event handlers, HTTP route handlers (Facade Pattern)
- **services/**: Business logic orchestration, matchmaking algorithms (Strategy Pattern)
- **middleware/**: Authentication, error handling, logging, request validation
- **routes/**: HTTP route definitions (health checks, REST endpoints)
- **utils/**: Shared utilities, validators, logger
- **types/**: TypeScript type definitions and interfaces
- **models/**: Data models representing entities (Hero, QueueEntry, Lobby)
- **config/**: Configuration modules (Redis, Socket.io, environment variables)

### Entry Point Structure
**File:** `src/index.ts` (or `server.js`)

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeRedis } from './config/redis.config';
import { initializeSocket } from './config/socket.config';
import healthRoutes from './routes/health.routes';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }
});

// Initialize Redis
await initializeRedis();

// HTTP routes
app.use('/health', healthRoutes);

// Socket.io setup
initializeSocket(io);

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Matchmaking Service running on port ${PORT}`);
});
````

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Service structure, components, and design patterns (sections 1.2, 1.3, 3)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Node.js service structure and layering (section 2.2)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Matchmaking Service overview (section 2.4)
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) – Clean Architecture and SOLID principles
- **Matchmaking Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Matchmaking%20Service%20Class%20Diagram.png`

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-1-2: Initialize package.json and install dependencies
```

Title: TASK-5-1-2: Initialize package.json and install dependencies

Description:

## Story

Related to #X (STORY-5-1 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Configure all required npm dependencies in `package.json` for Matchmaking Service to support Express HTTP server, Socket.io WebSocket functionality, Redis data access, JWT authentication, TypeScript compilation, and development tooling. The dependencies must align with Node.js best practices, ensure compatibility between packages, and follow the same dependency management approach as other Node.js services (Game Engine). This establishes the foundation for real-time matchmaking capabilities.

## Acceptance Criteria

- [ ] `package.json` initialized with service name, version, description
- [ ] Express dependency added (`express`) for HTTP server
- [ ] Socket.io dependencies added (`socket.io`, `socket.io-client` types if needed)
- [ ] Redis client dependency added (`ioredis`) for Redis operations
- [ ] JWT dependency added (`jsonwebtoken`) for authentication
- [ ] Environment variable management added (`dotenv`)
- [ ] TypeScript dependencies added (`typescript`, `ts-node`, `@types/node`, `@types/express`, `@types/socket.io`, `@types/jsonwebtoken`)
- [ ] Development dependencies added (ESLint, Prettier, Jest for testing)
- [ ] Scripts configured: `start`, `dev`, `build`, `test`, `lint`
- [ ] All dependency versions are compatible and locked in `package-lock.json`
- [ ] Dependencies match versions used in game-engine service for consistency

## Technical Details

### Required Dependencies (package.json)

Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.2 and [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md):

**Runtime Dependencies:**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.5.4",
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
- Match dependency versions with game-engine service where applicable
- Use TypeScript 5.x for modern language features

## Related Documentation

- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Node.js service dependencies (section 2.2)
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Service technology stack
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service technology requirements (section 2.4)

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-1-3: Configure Express and Socket.io
```

Title: TASK-5-1-3: Configure Express and Socket.io

Description:

## Story

Related to #X (STORY-5-1 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Configure Express HTTP server with essential middleware (JSON parsing, CORS, error handling, logging) and attach Socket.io WebSocket server to enable real-time bidirectional communication. The Express server must handle HTTP health checks and REST endpoints, while Socket.io must support WebSocket connections for matchmaking events (join queue, leave queue, hero selection). This dual-server setup enables both traditional HTTP and real-time WebSocket communication patterns required for matchmaking functionality.

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
- [ ] HTTP server listens on configured port (3002 by default)
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
    socket.emit("connected", { message: "Connected to matchmaking service" });
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

const app = configureExpress();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Matchmaking Service running on port ${PORT}`);
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
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Socket.io integration

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-1-4: Configure Redis connection
```

Title: TASK-5-1-4: Configure Redis connection

Description:

## Story

Related to #X (STORY-5-1 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Configure Redis client connection using `ioredis` library with environment variable support for connection details (host, port, password, database). Implement connection pooling, error handling, reconnection logic, and a startup health check to verify Redis connectivity. The Redis client must be configured as a singleton service that can be reused across the application for queue operations, lobby management, and matchmaking state storage. This is critical infrastructure for matchmaking queue persistence and real-time state management.

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

## Technical Details

### Redis Configuration

Based on [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 2.4:

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
    enableReadyCheck: true,
    lazyConnect: false,
  });

  // Event handlers
  redisClient.on("connect", () => {
    logger.info("Redis client connecting...");
  });

  redisClient.on("ready", () => {
    logger.info("Redis client ready");
  });

  redisClient.on("error", (err) => {
    logger.error("Redis client error:", err);
  });

  redisClient.on("close", () => {
    logger.warn("Redis client connection closed");
  });

  redisClient.on("reconnecting", () => {
    logger.info("Redis client reconnecting...");
  });

  // Health check
  try {
    await redisClient.ping();
    logger.info("Redis connection verified");
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

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info("Redis connection closed");
  }
}
```

### Environment Variables

**File:** `.env.example`

```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Redis Data Structures for Matchmaking

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md):

**Queue Structure:**

- **Sorted Set**: `matchmaking:queue:{region}` - Stores queue entries by score
- **Hash**: `matchmaking:player:{userId}` - Stores player metadata (score, rank, heroes)

**Lobby Structure:**

- **Hash**: `lobby:{lobbyId}` - Stores lobby state
- **Set**: `lobby:{lobbyId}:players` - Stores player IDs in lobby

### Design Patterns Applied

- **Singleton Pattern**: Redis client is a singleton instance
- **Factory Pattern**: `initializeRedis()` creates and configures client
- **Observer Pattern**: Event handlers monitor connection state

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Redis usage and QueueManager (sections 3.4, 4)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Redis integration (section 2.4)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Data store patterns

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

---

### STORY-5-2: Hero Selection System (US-009, US-010, US-011)

#### Issue Template:

```

Title: STORY-5-2: Implement multiple hero selection before matchmaking

Description:

## Epic

Related to #X (PHASE-5 issue number)

## User Story

As a user, I want to select multiple heroes before matchmaking so that I can increase my match chances.

## Acceptance Criteria

- [ ] Users can select multiple heroes (checkbox style)
- [ ] Hero selection stored with priority order
- [ ] Selection persisted in Redis or Profiles for matchmaking
- [ ] Selected hero surfaced to Game Engine before match
- [ ] Invalid hero IDs or malformed payloads are handled with clear error events

## Technical Details

- Socket.io event (e.g. `hero-selection`)
- Store hero IDs, priority order, and timestamp in Redis
- Validate selected heroes against allowed list
- Integrate with HeroSelector and HeroSelectionStrategy from LLD

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) (HeroSelector, section 3.5)
- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png)
- [Database Design – Profiles collection](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Hero-related fields for players

## Labels

phase:matchmaking, backend:matchmaking, feature, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-2-1: Create Hero model (backend representation)
```

Title: TASK-5-2-1: Create Hero model (backend representation)

Description:

## Story

Related to #X (STORY-5-2 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Define comprehensive TypeScript interfaces and classes for hero data used throughout the matchmaking system. The Hero model must include all attributes required for hero selection, compatibility checking, and matchmaking algorithms as specified in the Matchmaking Service LLD. This includes hero identification, type classification, rarity, compatibility tags, and any metadata needed for hero selection strategies. The model serves as the single source of truth for hero data structure across the service.

## Acceptance Criteria

- [ ] Hero interface/class created in `src/models/Hero.ts` or `src/types/hero.types.ts`
- [ ] Model includes fields: `id`, `name`, `type`, `rarity`, `tags`, `compatibilityRules`
- [ ] Model matches hero attributes defined in Matchmaking Service LLD
- [ ] Model includes TypeScript types for type safety
- [ ] Model includes validation methods or decorators
- [ ] Model is exported and can be imported across services
- [ ] Model includes JSDoc documentation
- [ ] Model supports hero compatibility checking methods
- [ ] Model matches game design hero specifications

## Technical Details

### Hero Model Structure

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.5:

**File:** `src/models/Hero.ts`

```typescript
export enum HeroType {
  TANK = "tank",
  DAMAGE = "damage",
  SUPPORT = "support",
}

export enum HeroRarity {
  COMMON = "common",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

export interface Hero {
  id: string;
  name: string;
  type: HeroType;
  rarity: HeroRarity;
  tags: string[]; // e.g., ['melee', 'ranged', 'magic']
  compatibilityRules?: {
    incompatibleWith?: string[]; // Hero IDs that cannot be matched together
    preferredWith?: string[]; // Hero IDs that work well together
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class HeroModel implements Hero {
  constructor(
    public id: string,
    public name: string,
    public type: HeroType,
    public rarity: HeroRarity,
    public tags: string[] = [],
    public compatibilityRules?: Hero["compatibilityRules"],
  ) {}

  /**
   * Check if this hero is compatible with another hero
   */
  isCompatibleWith(otherHero: Hero): boolean {
    if (!this.compatibilityRules?.incompatibleWith) {
      return true;
    }
    return !this.compatibilityRules.incompatibleWith.includes(otherHero.id);
  }

  /**
   * Check if this hero is preferred with another hero
   */
  isPreferredWith(otherHero: Hero): boolean {
    if (!this.compatibilityRules?.preferredWith) {
      return false;
    }
    return this.compatibilityRules.preferredWith.includes(otherHero.id);
  }
}
```

### Hero Selection Types

**File:** `src/types/hero.types.ts`

```typescript
export interface HeroSelection {
  userId: string;
  heroIds: string[];
  priority: number[]; // Priority order (0 = highest priority)
  timestamp: Date;
}

export interface HeroSelectionRequest {
  heroIds: string[];
  priority?: number[]; // Optional, defaults to array order
}
```

### Design Patterns Applied

- **Model Pattern**: Encapsulates hero data and behavior
- **Strategy Pattern**: Hero compatibility rules can be implemented as strategies
- **Type Safety**: TypeScript interfaces ensure compile-time validation

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – HeroSelector and hero selection (section 3.5)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Heroes collection schema
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Model layer patterns

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-2-2: Implement hero selection Socket.io event handler
```

Title: TASK-5-2-2: Implement hero selection Socket.io event handler

Description:

## Story

Related to #X (STORY-5-2 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Create a Socket.io event handler for `hero-selection` events in the MatchmakingController that accepts hero selection payloads from clients, validates authentication and payload format, delegates to HeroSelector service for processing, and emits acknowledgment or error responses. The handler must implement the Facade pattern to provide a simplified interface for hero selection operations, ensuring proper error handling and real-time feedback to clients. This enables users to select multiple heroes with priority ordering before joining the matchmaking queue.

## Acceptance Criteria

- [ ] `hero-selection` Socket.io event handler created in `MatchmakingController`
- [ ] Handler validates JWT authentication from socket connection
- [ ] Handler validates payload format (heroIds array, optional priority array)
- [ ] Handler extracts userId from authenticated socket
- [ ] Handler delegates to `HeroSelector` service for processing
- [ ] Handler emits success acknowledgment with selection confirmation
- [ ] Handler emits error events for validation failures
- [ ] Handler handles edge cases (empty selection, invalid hero IDs)
- [ ] Handler is documented with JSDoc comments
- [ ] Handler follows error handling patterns

## Technical Details

### Event Handler Implementation

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.1:

**File:** `src/controllers/MatchmakingController.ts`

```typescript
import { Socket } from "socket.io";
import { HeroSelector } from "../services/HeroSelector";
import { HeroSelectionRequest } from "../types/hero.types";
import { validateHeroSelection } from "../utils/validators";

export class MatchmakingController {
  constructor(private heroSelector: HeroSelector) {}

  /**
   * Handle hero-selection Socket.io event
   */
  handleHeroSelection(socket: Socket, payload: HeroSelectionRequest): void {
    try {
      // Validate authentication (userId should be attached by auth middleware)
      const userId = (socket as any).userId;
      if (!userId) {
        socket.emit("error", { message: "Authentication required" });
        return;
      }

      // Validate payload
      const validationResult = validateHeroSelection(payload);
      if (!validationResult.valid) {
        socket.emit("hero-selection-error", {
          message: "Invalid hero selection",
          errors: validationResult.errors,
        });
        return;
      }

      // Process hero selection
      this.heroSelector
        .selectHeroes(userId, payload.heroIds, payload.priority)
        .then(() => {
          socket.emit("hero-selection-success", {
            message: "Hero selection saved",
            heroIds: payload.heroIds,
          });
        })
        .catch((error) => {
          socket.emit("hero-selection-error", {
            message: "Failed to save hero selection",
            error: error.message,
          });
        });
    } catch (error) {
      socket.emit("error", {
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
```

### Socket.io Event Registration

**File:** `src/config/socket.config.ts`

```typescript
import { MatchmakingController } from "../controllers/MatchmakingController";
import { HeroSelector } from "../services/HeroSelector";

io.on("connection", (socket) => {
  const controller = new MatchmakingController(new HeroSelector());

  // Register hero-selection event handler
  socket.on("hero-selection", (payload) => {
    controller.handleHeroSelection(socket, payload);
  });
});
```

### Design Patterns Applied

- **Facade Pattern**: Controller provides simplified interface for hero selection
- **Dependency Injection**: Controller receives HeroSelector as dependency
- **Error Handling Pattern**: Consistent error event emission

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – MatchmakingController and Facade pattern (sections 3.1, 4.1)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – WebSocket event patterns
- **Matchmaking Flow Sequence Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png`

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-2-3: Store hero selection in Redis
```

Title: TASK-5-2-3: Store hero selection in Redis

Description:

## Story

Related to #X (STORY-5-2 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Implement Redis persistence for hero selections in the HeroSelector service, storing hero IDs, priority order, and timestamp keyed by userId. The data must be stored in a format that can be efficiently retrieved during matchmaking algorithm execution, supporting fast lookups by userId and compatibility with the matchmaking engine's expected input format. This enables the matchmaking algorithm to access player hero preferences when finding compatible matches.

## Acceptance Criteria

- [ ] HeroSelector service implements `storeHeroSelection()` method
- [ ] Hero selection stored in Redis with key pattern: `hero-selection:{userId}`
- [ ] Stored data includes: heroIds array, priority array, timestamp
- [ ] Data stored as JSON string in Redis hash or string value
- [ ] TTL (time-to-live) configured for hero selection data (e.g., 1 hour)
- [ ] Hero selection can be retrieved by userId via `getHeroSelection()` method
- [ ] Data model matches matchmaking algorithm's expected input format
- [ ] Redis operations handle errors gracefully
- [ ] Data is serialized/deserialized correctly

## Technical Details

### Redis Storage Structure

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md):

**File:** `src/services/HeroSelector.ts`

```typescript
import { getRedisClient } from "../config/redis.config";
import { HeroSelection } from "../types/hero.types";

export class HeroSelector {
  private readonly REDIS_KEY_PREFIX = "hero-selection:";
  private readonly TTL_SECONDS = 3600; // 1 hour

  async storeHeroSelection(userId: string, heroIds: string[], priority?: number[]): Promise<void> {
    const redis = getRedisClient();
    const key = `${this.REDIS_KEY_PREFIX}${userId}`;

    const selection: HeroSelection = {
      userId,
      heroIds,
      priority: priority || heroIds.map((_, index) => index),
      timestamp: new Date(),
    };

    await redis.setex(key, this.TTL_SECONDS, JSON.stringify(selection));
  }

  async getHeroSelection(userId: string): Promise<HeroSelection | null> {
    const redis = getRedisClient();
    const key = `${this.REDIS_KEY_PREFIX}${userId}`;

    const data = await redis.get(key);
    if (!data) {
      return null;
    }

    return JSON.parse(data) as HeroSelection;
  }

  async deleteHeroSelection(userId: string): Promise<void> {
    const redis = getRedisClient();
    const key = `${this.REDIS_KEY_PREFIX}${userId}`;
    await redis.del(key);
  }
}
```

### Redis Key Structure

- **Key Pattern**: `hero-selection:{userId}`
- **Value Type**: JSON string
- **TTL**: 3600 seconds (1 hour)
- **Example Key**: `hero-selection:507f1f77bcf86cd799439011`

### Data Format

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "heroIds": ["hero1", "hero2", "hero3"],
  "priority": [0, 1, 2],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Design Patterns Applied

- **Repository Pattern**: HeroSelector abstracts Redis operations
- **Strategy Pattern**: Hero selection strategies can be plugged in

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – HeroSelector and Redis usage (sections 3.5, 4)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Redis integration (section 2.4)

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-2-4: Validate hero selection and priority order
```

Title: TASK-5-2-4: Validate hero selection and priority order

Description:

## Story

Related to #X (STORY-5-2 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Implement comprehensive validation logic for hero selections to ensure data integrity, enforce business rules, and prevent invalid selections from entering the matchmaking system. Validation must check that selected heroes exist in the allowed hero pool, verify priority order consistency (no duplicates, valid indices), enforce maximum hero selection limits, and validate hero IDs format. This ensures the matchmaking algorithm receives valid, normalized hero selection data.

## Acceptance Criteria

- [ ] Validation function created in `src/utils/validators.ts`
- [ ] Validates hero IDs exist in allowed hero pool
- [ ] Validates no duplicate hero IDs in selection
- [ ] Validates priority array matches heroIds array length
- [ ] Validates priority array contains no duplicates
- [ ] Validates priority array values are within valid range (0 to length-1)
- [ ] Validates maximum hero selection limit (e.g., max 5 heroes)
- [ ] Validates minimum hero selection (e.g., at least 1 hero)
- [ ] Returns detailed validation errors for each failure
- [ ] Validation is unit tested with various scenarios

## Technical Details

### Validation Implementation

**File:** `src/utils/validators.ts`

```typescript
import { HeroSelectionRequest } from "../types/hero.types";
import { getAllowedHeroes } from "../services/HeroService";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export async function validateHeroSelection(payload: HeroSelectionRequest): Promise<ValidationResult> {
  const errors: string[] = [];

  // Validate heroIds array exists and is not empty
  if (!payload.heroIds || payload.heroIds.length === 0) {
    errors.push("At least one hero must be selected");
  }

  // Validate maximum hero selection limit
  const MAX_HEROES = 5;
  if (payload.heroIds.length > MAX_HEROES) {
    errors.push(`Maximum ${MAX_HEROES} heroes allowed`);
  }

  // Validate no duplicate hero IDs
  const uniqueHeroIds = new Set(payload.heroIds);
  if (uniqueHeroIds.size !== payload.heroIds.length) {
    errors.push("Duplicate hero IDs are not allowed");
  }

  // Validate hero IDs exist in allowed pool
  const allowedHeroes = await getAllowedHeroes();
  const allowedHeroIds = new Set(allowedHeroes.map((h) => h.id));
  for (const heroId of payload.heroIds) {
    if (!allowedHeroIds.has(heroId)) {
      errors.push(`Invalid hero ID: ${heroId}`);
    }
  }

  // Validate priority array if provided
  if (payload.priority) {
    if (payload.priority.length !== payload.heroIds.length) {
      errors.push("Priority array length must match heroIds array length");
    }

    const uniquePriorities = new Set(payload.priority);
    if (uniquePriorities.size !== payload.priority.length) {
      errors.push("Duplicate priority values are not allowed");
    }

    const validRange = Array.from({ length: payload.heroIds.length }, (_, i) => i);
    for (const priority of payload.priority) {
      if (!validRange.includes(priority)) {
        errors.push(`Invalid priority value: ${priority}. Must be between 0 and ${payload.heroIds.length - 1}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Business Rules

- **Minimum Heroes**: At least 1 hero must be selected
- **Maximum Heroes**: Maximum 5 heroes per selection
- **No Duplicates**: Each hero ID can only appear once
- **Valid Hero IDs**: All hero IDs must exist in the allowed hero pool
- **Priority Validation**: If provided, priority must be valid indices

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Hero selection validation
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Heroes collection schema

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

---

### STORY-5-3: Join Matchmaking Queue (US-012)

#### Issue Template:

```

Title: STORY-5-3: Implement join matchmaking queue

Description:

## Epic

Related to #X (PHASE-5 issue number)

## User Story

As a user, I want to join the matchmaking queue so that I can find a match.

## Acceptance Criteria

- [ ] Socket.io event: `join-queue`
- [ ] User added to Redis queue with metadata (score, rank, heroes)
- [ ] Queue status returned
- [ ] JWT authentication required
- [ ] Duplicate joins for same user/session are handled gracefully
- [ ] Errors from Redis are logged and surfaced as non-crashing error events

## Technical Details

- Queue structure in Redis (e.g. sorted set by score, rank, or timestamp)
- Metadata: userId, globalScore, rankTier, heroes, region
- Integration point with QueueManager and MatchmakingEngine (see LLD)

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) (QueueManager, MatchmakingEngine)
- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Matchmaking and Game Engine collaboration

## Labels

phase:matchmaking, backend:matchmaking, feature, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-3-1: Create matchmaking queue service
```

Title: TASK-5-3-1: Create matchmaking queue service

Description:

## Story

Related to #X (STORY-5-3 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Implement QueueManager service that abstracts all Redis queue operations following the Facade pattern as specified in the Matchmaking Service LLD. The service must provide methods to enqueue players, dequeue players, read queue length, inspect queue entries, calculate queue position, and support region-based queue separation. This service acts as the single point of access for all queue operations, encapsulating Redis data structure complexity and providing a clean interface for matchmaking algorithms and event handlers.

## Acceptance Criteria

- [ ] `QueueManager` class created in `src/services/QueueManager.ts`
- [ ] Service implements Facade pattern for queue operations
- [ ] `enqueuePlayer()` method adds player to Redis sorted set
- [ ] `dequeuePlayer()` method removes player from queue
- [ ] `getQueueLength()` method returns current queue size
- [ ] `getQueuePosition()` method calculates player's position in queue
- [ ] `getQueueEntries()` method retrieves queue entries for algorithm
- [ ] Service supports region-based queues (separate queues per region)
- [ ] Service uses Redis sorted sets for score-based ordering
- [ ] Service stores player metadata in Redis hashes
- [ ] Implementation is unit tested with mocked Redis client
- [ ] Service handles Redis errors gracefully

## Technical Details

### QueueManager Service Structure

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.4:

**File:** `src/services/QueueManager.ts`

```typescript
import { getRedisClient } from "../config/redis.config";
import { QueueEntry } from "../models/QueueEntry";

export class QueueManager {
  private readonly QUEUE_KEY_PREFIX = "matchmaking:queue:";
  private readonly PLAYER_KEY_PREFIX = "matchmaking:player:";

  /**
   * Add player to matchmaking queue
   */
  async enqueuePlayer(entry: QueueEntry): Promise<void> {
    const redis = getRedisClient();
    const queueKey = `${this.QUEUE_KEY_PREFIX}${entry.region}`;
    const playerKey = `${this.PLAYER_KEY_PREFIX}${entry.userId}`;

    // Add to sorted set (score = globalScore for ranking)
    await redis.zadd(queueKey, entry.globalScore, entry.userId);

    // Store player metadata in hash
    await redis.hset(playerKey, {
      userId: entry.userId,
      globalScore: entry.globalScore.toString(),
      rankTier: entry.rankTier,
      heroIds: JSON.stringify(entry.heroIds),
      region: entry.region,
      joinedAt: entry.joinedAt.toISOString(),
    });

    // Set TTL for player metadata (1 hour)
    await redis.expire(playerKey, 3600);
  }

  /**
   * Remove player from queue
   */
  async dequeuePlayer(userId: string, region: string): Promise<void> {
    const redis = getRedisClient();
    const queueKey = `${this.QUEUE_KEY_PREFIX}${region}`;
    const playerKey = `${this.PLAYER_KEY_PREFIX}${userId}`;

    await redis.zrem(queueKey, userId);
    await redis.del(playerKey);
  }

  /**
   * Get queue length
   */
  async getQueueLength(region: string): Promise<number> {
    const redis = getRedisClient();
    const queueKey = `${this.QUEUE_KEY_PREFIX}${region}`;
    return await redis.zcard(queueKey);
  }

  /**
   * Get player's position in queue
   */
  async getQueuePosition(userId: string, region: string): Promise<number> {
    const redis = getRedisClient();
    const queueKey = `${this.QUEUE_KEY_PREFIX}${region}`;
    const rank = await redis.zrevrank(queueKey, userId);
    return rank !== null ? rank + 1 : -1; // 1-indexed position
  }

  /**
   * Get queue entries within score range (for matchmaking algorithm)
   */
  async getQueueEntries(region: string, minScore: number, maxScore: number): Promise<QueueEntry[]> {
    const redis = getRedisClient();
    const queueKey = `${this.QUEUE_KEY_PREFIX}${region}`;

    // Get user IDs in score range
    const userIds = await redis.zrangebyscore(queueKey, minScore, maxScore);

    // Fetch metadata for each user
    const entries: QueueEntry[] = [];
    for (const userId of userIds) {
      const playerKey = `${this.PLAYER_KEY_PREFIX}${userId}`;
      const metadata = await redis.hgetall(playerKey);

      if (metadata && Object.keys(metadata).length > 0) {
        entries.push({
          userId,
          globalScore: parseInt(metadata.globalScore),
          rankTier: metadata.rankTier,
          heroIds: JSON.parse(metadata.heroIds),
          region: metadata.region,
          joinedAt: new Date(metadata.joinedAt),
        });
      }
    }

    return entries;
  }
}
```

### Redis Data Structures

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md):

**Sorted Set (Queue):**

- **Key**: `matchmaking:queue:{region}`
- **Score**: `globalScore` (for ranking)
- **Member**: `userId`

**Hash (Player Metadata):**

- **Key**: `matchmaking:player:{userId}`
- **Fields**: `userId`, `globalScore`, `rankTier`, `heroIds`, `region`, `joinedAt`

### Design Patterns Applied

- **Facade Pattern**: QueueManager provides simplified interface to Redis queue operations
- **Repository Pattern**: Abstracts Redis data access

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – QueueManager responsibilities and Facade pattern (sections 3.4, 4.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Redis queue structure (section 2.4)

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-3-2: Implement join-queue Socket.io event handler
```

Title: TASK-5-3-2: Implement join-queue Socket.io event handler

Description:

## Story

Related to #X (STORY-5-3 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Create a Socket.io event handler for `join-queue` events in the MatchmakingController that validates JWT authentication, retrieves user profile data (globalScore, rankTier, region), fetches hero selections, builds queue entry metadata, enqueues the player via QueueManager, and emits queue status to the client. The handler must implement proper error handling, prevent duplicate queue entries, and provide real-time feedback. This enables users to join the matchmaking queue and start searching for matches.

## Acceptance Criteria

- [ ] `join-queue` Socket.io event handler created in `MatchmakingController`
- [ ] Handler validates JWT authentication from socket connection
- [ ] Handler retrieves user profile data (globalScore, rankTier, region) from Profile Service or cache
- [ ] Handler fetches hero selections from Redis
- [ ] Handler builds QueueEntry with all required metadata
- [ ] Handler checks if user is already in queue (prevent duplicates)
- [ ] Handler delegates to QueueManager to enqueue player
- [ ] Handler emits success event with initial queue status (position, ETA)
- [ ] Handler emits error events for failures (authentication, validation, Redis errors)
- [ ] Handler handles edge cases (missing profile data, no hero selection)
- [ ] Handler is documented with JSDoc comments

## Technical Details

### Event Handler Implementation

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.1:

**File:** `src/controllers/MatchmakingController.ts`

```typescript
import { Socket } from "socket.io";
import { QueueManager } from "../services/QueueManager";
import { HeroSelector } from "../services/HeroSelector";
import { ProfileService } from "../services/ProfileService";
import { QueueEntry } from "../models/QueueEntry";

export class MatchmakingController {
  constructor(
    private queueManager: QueueManager,
    private heroSelector: HeroSelector,
    private profileService: ProfileService,
  ) {}

  async handleJoinQueue(socket: Socket): Promise<void> {
    try {
      const userId = (socket as any).userId;
      if (!userId) {
        socket.emit("join-queue-error", { message: "Authentication required" });
        return;
      }

      // Check if already in queue
      const profile = await this.profileService.getProfile(userId);
      if (await this.queueManager.isInQueue(userId, profile.region)) {
        socket.emit("join-queue-error", { message: "Already in queue" });
        return;
      }

      // Get hero selection
      const heroSelection = await this.heroSelector.getHeroSelection(userId);
      if (!heroSelection || heroSelection.heroIds.length === 0) {
        socket.emit("join-queue-error", { message: "Hero selection required" });
        return;
      }

      // Build queue entry
      const queueEntry: QueueEntry = {
        userId,
        globalScore: profile.globalScore,
        rankTier: profile.rankTier,
        heroIds: heroSelection.heroIds,
        region: profile.region,
        joinedAt: new Date(),
      };

      // Enqueue player
      await this.queueManager.enqueuePlayer(queueEntry);

      // Get initial queue status
      const position = await this.queueManager.getQueuePosition(userId, profile.region);
      const queueLength = await this.queueManager.getQueueLength(profile.region);

      // Emit success
      socket.emit("join-queue-success", {
        message: "Joined matchmaking queue",
        position,
        queueLength,
        estimatedWaitTime: this.calculateETA(position, queueLength),
      });
    } catch (error) {
      socket.emit("join-queue-error", {
        message: "Failed to join queue",
        error: error.message,
      });
    }
  }

  private calculateETA(position: number, queueLength: number): number {
    // Simple ETA calculation (can be enhanced with historical data)
    const avgMatchTime = 30; // seconds
    return Math.max(0, (position - 1) * avgMatchTime);
  }
}
```

### Design Patterns Applied

- **Facade Pattern**: Controller provides simplified interface for join queue operation
- **Dependency Injection**: Controller receives services as dependencies

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – MatchmakingController and join queue flow (sections 3.1, 3.4)
- **Matchmaking Flow Sequence Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png`

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-3-3: Store queue entry in Redis with metadata
```

Title: TASK-5-3-3: Store queue entry in Redis with metadata

Description:

## Story

Related to #X (STORY-5-3 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Define and implement the exact Redis data structures for storing queue entries with all required metadata (userId, globalScore, rankTier, heroIds, region, joinedAt) as specified in the Matchmaking Service LLD. The data structure must support efficient queries by the matchmaking algorithm (score range queries, region filtering), enable queue position calculation, and maintain data consistency. This establishes the persistent storage format for matchmaking queue state.

## Acceptance Criteria

- [ ] Redis sorted set structure defined for queue storage
- [ ] Redis hash structure defined for player metadata storage
- [ ] QueueEntry model matches Redis storage format
- [ ] Metadata includes all required fields: userId, globalScore, rankTier, heroIds, region, joinedAt
- [ ] Data structure supports efficient score range queries
- [ ] Data structure supports region-based queue separation
- [ ] TTL configured for queue entries to prevent stale data
- [ ] Data serialization/deserialization handles edge cases
- [ ] Redis operations are atomic where needed
- [ ] Data structure documented with examples

## Technical Details

### QueueEntry Model

**File:** `src/models/QueueEntry.ts`

```typescript
export interface QueueEntry {
  userId: string;
  globalScore: number;
  rankTier: string;
  heroIds: string[];
  region: string;
  joinedAt: Date;
}
```

### Redis Data Structure Design

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md):

**Sorted Set (Queue Index):**

- **Key**: `matchmaking:queue:{region}`
- **Score**: `globalScore` (for ranking and range queries)
- **Member**: `userId`
- **Operations**: `ZADD`, `ZREM`, `ZRANGEBYSCORE`, `ZREVRANK`, `ZCARD`

**Hash (Player Metadata):**

- **Key**: `matchmaking:player:{userId}`
- **Fields**:
  - `userId`: string
  - `globalScore`: number (as string)
  - `rankTier`: string
  - `heroIds`: JSON array string
  - `region`: string
  - `joinedAt`: ISO date string
- **TTL**: 3600 seconds (1 hour)

### Example Redis Data

**Sorted Set:**

```
matchmaking:queue:NA
  -> userId1 (score: 15000)
  -> userId2 (score: 12000)
  -> userId3 (score: 10000)
```

**Hash:**

```
matchmaking:player:userId1
  userId: "userId1"
  globalScore: "15000"
  rankTier: "Diamond"
  heroIds: '["hero1","hero2","hero3"]'
  region: "NA"
  joinedAt: "2024-01-15T10:30:00Z"
```

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Queue structure and QueueManager (sections 3.4, 4)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Redis queue design (section 2.4)

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

---

### STORY-5-4: Leave Matchmaking Queue (US-013)

#### Issue Template:

```

Title: STORY-5-4: Implement leave matchmaking queue

Description:

## Epic

Related to #X (PHASE-5 issue number)

## User Story

As a user, I want to leave the matchmaking queue so that I can cancel my search.

## Acceptance Criteria

- [ ] Socket.io event: `leave-queue`
- [ ] User removed from Redis queue
- [ ] Success response
- [ ] Leaving when not in queue does not cause server errors
- [ ] Queue metrics (length, per-region counts) remain consistent

## Labels

phase:matchmaking, backend:matchmaking, feature, priority:medium

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-4-1: Implement leave-queue Socket.io event handler
```

Title: TASK-5-4-1: Implement leave-queue Socket.io event handler

Description:

## Story

Related to #X (STORY-5-4 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Create a Socket.io event handler for `leave-queue` events in the MatchmakingController that validates authentication, retrieves user region, delegates to QueueManager to remove the player from the queue, and emits success/error responses. The handler must gracefully handle cases where the user is not in the queue (idempotent operation), prevent errors from being thrown, and provide clear feedback to clients. This enables users to cancel their matchmaking search at any time.

## Acceptance Criteria

- [ ] `leave-queue` Socket.io event handler created in `MatchmakingController`
- [ ] Handler validates JWT authentication from socket connection
- [ ] Handler retrieves user region from profile or socket metadata
- [ ] Handler delegates to QueueManager to dequeue player
- [ ] Handler handles case where user is not in queue (idempotent)
- [ ] Handler emits success event when player is removed
- [ ] Handler emits success event even if player was not in queue (no error)
- [ ] Handler emits error events only for critical failures (authentication, Redis errors)
- [ ] Handler logs queue removal for debugging
- [ ] Handler is documented with JSDoc comments

## Technical Details

### Event Handler Implementation

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.1:

**File:** `src/controllers/MatchmakingController.ts`

```typescript
async handleLeaveQueue(socket: Socket): Promise<void> {
  try {
    const userId = (socket as any).userId;
    if (!userId) {
      socket.emit('leave-queue-error', { message: 'Authentication required' });
      return;
    }

    // Get user region
    const profile = await this.profileService.getProfile(userId);
    const region = profile.region;

    // Check if in queue before attempting removal
    const isInQueue = await this.queueManager.isInQueue(userId, region);

    if (isInQueue) {
      // Remove from queue
      await this.queueManager.dequeuePlayer(userId, region);
      socket.emit('leave-queue-success', {
        message: 'Left matchmaking queue'
      });
    } else {
      // Already not in queue - still return success (idempotent)
      socket.emit('leave-queue-success', {
        message: 'Not in queue'
      });
    }
  } catch (error) {
    socket.emit('leave-queue-error', {
      message: 'Failed to leave queue',
      error: error.message
    });
  }
}
```

### Design Patterns Applied

- **Facade Pattern**: Controller provides simplified interface for leave queue operation
- **Idempotent Operation**: Leaving queue multiple times is safe and doesn't cause errors

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – MatchmakingController and leave queue flow (sections 3.1, 3.4)
- **Matchmaking Flow Sequence Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png`

## Labels

phase:matchmaking, backend:matchmaking, task, priority:medium

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-4-2: Remove user from Redis queue and clean up data
```

Title: TASK-5-4-2: Remove user from Redis queue and clean up data

Description:

## Story

Related to #X (STORY-5-4 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Implement comprehensive cleanup logic in QueueManager's `dequeuePlayer()` method to remove all queue-related Redis keys for a user, including the sorted set entry, player metadata hash, and any temporary matchmaking state. The cleanup must be atomic where possible, handle partial failures gracefully, and ensure no stale data remains that could affect future matchmaking attempts or cause memory leaks. This maintains Redis data consistency and prevents queue pollution.

## Acceptance Criteria

- [ ] `dequeuePlayer()` method removes user from Redis sorted set
- [ ] Method deletes player metadata hash from Redis
- [ ] Method removes any temporary matchmaking state keys
- [ ] Cleanup operations are atomic where possible (Redis transactions)
- [ ] Method handles partial failures (some keys missing) gracefully
- [ ] Method logs successful removal for debugging
- [ ] Method returns success even if user was not in queue (idempotent)
- [ ] No stale queue entries remain after cleanup
- [ ] Queue metrics (length, position) remain consistent after removal
- [ ] Cleanup is tested with unit tests

## Technical Details

### Cleanup Implementation

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.4:

**File:** `src/services/QueueManager.ts`

```typescript
/**
 * Remove player from queue and clean up all related data
 */
async dequeuePlayer(userId: string, region: string): Promise<void> {
  const redis = getRedisClient();
  const queueKey = `${this.QUEUE_KEY_PREFIX}${region}`;
  const playerKey = `${this.PLAYER_KEY_PREFIX}${userId}`;

  // Use Redis transaction for atomic cleanup
  const pipeline = redis.pipeline();

  // Remove from sorted set
  pipeline.zrem(queueKey, userId);

  // Delete player metadata
  pipeline.del(playerKey);

  // Remove any temporary matchmaking state
  pipeline.del(`matchmaking:temp:${userId}`);

  // Execute transaction
  await pipeline.exec();

  // Log for debugging
  logger.info(`Removed player ${userId} from queue ${region}`);
}
```

### Redis Keys to Clean Up

- **Sorted Set Entry**: `matchmaking:queue:{region}` - Remove userId member
- **Player Metadata Hash**: `matchmaking:player:{userId}` - Delete entire key
- **Temporary State**: `matchmaking:temp:{userId}` - Delete if exists
- **Hero Selection**: `hero-selection:{userId}` - Optional cleanup (may be kept for reuse)

### Design Patterns Applied

- **Repository Pattern**: QueueManager abstracts cleanup operations
- **Transaction Pattern**: Redis pipeline ensures atomic cleanup

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – QueueManager cleanup operations (section 3.4)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Redis data management (section 2.4)

## Labels

phase:matchmaking, backend:matchmaking, task, priority:medium

## Milestone

Phase 5: Matchmaking

```

---

### STORY-5-5: Matchmaking Algorithm (US-014, US-017)

#### Issue Template:

```

Title: STORY-5-5: Implement matchmaking algorithm (score/rank-based with hero compatibility)

Description:

## Epic

Related to #X (PHASE-5 issue number)

## User Story

As a user, I want to be matched with players of similar global score/rank and compatible hero selection so that I have fair matches.

## Acceptance Criteria

- [ ] Matchmaking based on global score/rank
- [ ] Hero compatibility checks
- [ ] Range widening after wait time
- [ ] Match creation triggers Game Engine

## Technical Details

- Periodic matchmaking job scanning Redis queues
- Score band widening logic (e.g. ±N score every X seconds)
- Hero compatibility rules from LLD

## Labels

phase:matchmaking, backend:matchmaking, feature, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-5-1: Design matchmaking algorithm and score bands
```

Title: TASK-5-5-1: Design matchmaking algorithm and score bands

Description:

## Story

Related to #X (STORY-5-5 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Design the core matchmaking algorithm specification including matching criteria (globalScore, rankTier, hero compatibility, region), initial score band width, score band widening strategy over time, and match quality scoring. The algorithm design must align with the Matchmaking Service LLD, support fair matchmaking, handle edge cases (low queue population, long wait times), and be documented for implementation. This establishes the foundation for the MatchmakingEngine implementation.

## Acceptance Criteria

- [ ] Algorithm design document created with matching criteria
- [ ] Initial score band width defined (e.g., ±500 points)
- [ ] Score band widening strategy defined (e.g., widen by 200 points every 30 seconds)
- [ ] Maximum score band width defined (e.g., ±2000 points)
- [ ] Rank tier matching rules defined (same tier preferred, adjacent tiers acceptable)
- [ ] Hero compatibility rules documented
- [ ] Region matching rules defined (same region preferred)
- [ ] Match quality scoring algorithm defined
- [ ] Edge cases handled (low queue, long waits, timeout scenarios)
- [ ] Design aligns with Matchmaking Service LLD specifications
- [ ] Design reviewed and approved

## Technical Details

### Matching Criteria

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.3:

**Primary Criteria:**

1. **Global Score**: Players within score band (initial ±500, widens over time)
2. **Rank Tier**: Same rank tier preferred, adjacent tiers acceptable
3. **Hero Compatibility**: Heroes must be compatible (no incompatible pairs)
4. **Region**: Same region preferred for latency

**Score Band Widening:**

- **Initial Band**: ±500 points
- **Widen Interval**: Every 30 seconds
- **Widen Amount**: +200 points per interval
- **Maximum Band**: ±2000 points
- **Timeout**: 5 minutes maximum wait

### Algorithm Flow

```
1. Get queue entries for region
2. For each player in queue:
   a. Calculate current score band based on wait time
   b. Find potential matches within score band
   c. Filter by rank tier compatibility
   d. Filter by hero compatibility
   e. Score match quality
   f. Select best match
3. Create match and notify players
4. Remove matched players from queue
```

### Match Quality Scoring

- **Score Difference**: Lower is better (closer scores = better match)
- **Rank Tier Match**: Same tier = +10, adjacent = +5, far = 0
- **Hero Compatibility**: Compatible = +5, preferred = +10
- **Region Match**: Same region = +5

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – MatchmakingEngine and algorithm (sections 3.3, 4.2)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Matchmaking algorithm overview (section 2.4)

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-5-2: Implement matchmaking loop and Redis queries
```

Title: TASK-5-5-2: Implement matchmaking loop and Redis queries

Description:

## Story

Related to #X (STORY-5-5 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Implement MatchmakingEngine with a periodic matchmaking loop that scans Redis queues, retrieves queue entries within score bands, pairs players based on the matchmaking algorithm, performs hero compatibility checks, creates matches, removes matched players from queues, and notifies Game Engine Service to create game rooms. The loop must run at configurable intervals, handle errors gracefully, and not block the event loop. This is the core matchmaking logic that finds and creates player matches.

## Acceptance Criteria

- [ ] `MatchmakingEngine` class created in `src/services/MatchmakingEngine.ts`
- [ ] Periodic matchmaking loop implemented (runs every 5-10 seconds)
- [ ] Loop scans all region queues from Redis
- [ ] Loop retrieves queue entries within score bands using QueueManager
- [ ] Loop pairs players based on algorithm criteria
- [ ] Loop creates matches and removes players from queue
- [ ] Loop notifies Game Engine Service via HTTP or message queue
- [ ] Loop handles errors gracefully (doesn't crash on Redis errors)
- [ ] Loop is non-blocking (uses async/await, doesn't block event loop)
- [ ] Loop can be started/stopped for graceful shutdown
- [ ] Implementation is unit tested with mocked dependencies

## Technical Details

### MatchmakingEngine Implementation

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.3:

**File:** `src/services/MatchmakingEngine.ts`

```typescript
import { QueueManager } from "./QueueManager";
import { HeroSelector } from "./HeroSelector";
import { MatchingStrategy } from "./strategy/MatchingStrategy";
import { GameEngineService } from "./GameEngineService";

export class MatchmakingEngine {
  private matchmakingInterval: NodeJS.Timeout | null = null;
  private readonly MATCHMAKING_INTERVAL_MS = 5000; // 5 seconds

  constructor(
    private queueManager: QueueManager,
    private heroSelector: HeroSelector,
    private matchingStrategy: MatchingStrategy,
    private gameEngineService: GameEngineService,
  ) {}

  /**
   * Start matchmaking loop
   */
  start(): void {
    if (this.matchmakingInterval) {
      return; // Already running
    }

    this.matchmakingInterval = setInterval(async () => {
      await this.runMatchmakingCycle();
    }, this.MATCHMAKING_INTERVAL_MS);
  }

  /**
   * Stop matchmaking loop
   */
  stop(): void {
    if (this.matchmakingInterval) {
      clearInterval(this.matchmakingInterval);
      this.matchmakingInterval = null;
    }
  }

  /**
   * Run one matchmaking cycle
   */
  private async runMatchmakingCycle(): Promise<void> {
    try {
      const regions = ["NA", "EU", "ASIA"]; // Get from config

      for (const region of regions) {
        await this.processRegionQueue(region);
      }
    } catch (error) {
      logger.error("Matchmaking cycle error:", error);
      // Don't throw - continue next cycle
    }
  }

  /**
   * Process queue for a specific region
   */
  private async processRegionQueue(region: string): Promise<void> {
    const queueLength = await this.queueManager.getQueueLength(region);
    if (queueLength < 2) {
      return; // Need at least 2 players
    }

    // Get queue entries
    const entries = await this.queueManager.getQueueEntries(region, 0, Infinity);

    // Find matches using strategy
    const matches = await this.matchingStrategy.findMatches(entries);

    // Process each match
    for (const match of matches) {
      await this.createMatch(match);
    }
  }

  /**
   * Create match and notify Game Engine
   */
  private async createMatch(match: Match): Promise<void> {
    // Remove players from queue
    for (const playerId of match.playerIds) {
      await this.queueManager.dequeuePlayer(playerId, match.region);
    }

    // Notify Game Engine to create game room
    await this.gameEngineService.createMatch(match);
  }
}
```

### Design Patterns Applied

- **Strategy Pattern**: MatchingStrategy interface for different matching algorithms
- **Observer Pattern**: MatchmakingEngine can notify observers of matches
- **Factory Pattern**: Match creation uses factory

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – MatchmakingEngine and matching loop (sections 3.3, 4.2)
- **Matchmaking Flow Sequence Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Matchmaking%20Flow.png`

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-5-3: Implement hero compatibility checks
```

Title: TASK-5-5-3: Implement hero compatibility checks

Description:

## Story

Related to #X (STORY-5-5 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Implement hero compatibility checking logic in the MatchmakingEngine that validates whether selected heroes from two players are compatible for a match. The compatibility rules must prevent incompatible hero pairings (e.g., mirror matches, counter picks), prefer compatible hero combinations, and support hero selection strategies from the HeroSelector. This ensures match quality by avoiding problematic hero combinations and promoting balanced matches.

## Acceptance Criteria

- [ ] Hero compatibility checking function implemented
- [ ] Function checks for incompatible hero pairs (from Hero model compatibilityRules)
- [ ] Function checks for preferred hero combinations
- [ ] Function validates hero selection compatibility between two players
- [ ] Compatibility logic is unit tested with various hero combinations
- [ ] Incompatible pairings are rejected during matchmaking
- [ ] Preferred pairings are prioritized in match quality scoring
- [ ] Compatibility rules are configurable (can be updated without code changes)
- [ ] Compatibility checks are performant (don't slow down matchmaking loop)

## Technical Details

### Hero Compatibility Implementation

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.5:

**File:** `src/services/MatchmakingEngine.ts`

```typescript
import { Hero } from '../models/Hero';
import { HeroSelector } from './HeroSelector';

/**
 * Check if two players' hero selections are compatible
 */
async areHeroesCompatible(
  player1HeroIds: string[],
  player2HeroIds: string[]
): Promise<{ compatible: boolean; score: number }> {
  // Get hero models
  const player1Heroes = await this.getHeroes(player1HeroIds);
  const player2Heroes = await this.getHeroes(player2HeroIds);

  let compatibilityScore = 0;

  // Check for incompatible pairs
  for (const hero1 of player1Heroes) {
    for (const hero2 of player2Heroes) {
      // Check if heroes are incompatible
      if (!hero1.isCompatibleWith(hero2)) {
        return { compatible: false, score: 0 };
      }

      // Check if heroes are preferred together
      if (hero1.isPreferredWith(hero2)) {
        compatibilityScore += 10;
      }
    }
  }

  return { compatible: true, score: compatibilityScore };
}
```

### Compatibility Rules

Based on Hero model compatibilityRules:

- **Incompatible Heroes**: Cannot be matched together (e.g., same hero, counter picks)
- **Preferred Heroes**: Work well together (bonus to match quality score)
- **Default**: All heroes are compatible unless specified otherwise

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Hero compatibility and HeroSelector (sections 3.5, 4.3)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Heroes collection compatibility rules

## Labels

phase:matchmaking, backend:matchmaking, task, priority:high

## Milestone

Phase 5: Matchmaking

```

---

### STORY-5-6: Queue Status Display (US-016)

#### Issue Template:

```

Title: STORY-5-6: Implement queue status with position and estimated wait time

Description:

## Epic

Related to #X (PHASE-5 issue number)

## User Story

As a user, I want to see my queue status so that I know my position and estimated wait time.

## Acceptance Criteria

- [ ] Queue position returned
- [ ] Estimated wait time calculated
- [ ] Real-time updates via Socket.io

## Technical Details

- Socket.io event: `queue-status`
- Estimated wait time based on current queue density and match rate

## Labels

phase:matchmaking, backend:matchmaking, feature, priority:medium

## Milestone

Phase 5: Matchmaking

```

#### Subtask: TASK-5-6-1: Calculate queue position and ETA
```

Title: TASK-5-6-1: Calculate queue position and ETA

Description:

## Story

Related to #X (STORY-5-6 issue number)

## Epic

Related to #X (PHASE-5 issue number)

## Description

Implement queue status calculation functionality in QueueManager that computes a player's current position in the matchmaking queue and estimates wait time based on queue length, historical match throughput, and current matchmaking rate. The status must be returned via Socket.io `queue-status` events, updated periodically or on-demand, and be performant to avoid overloading Redis. This provides real-time feedback to users about their matchmaking progress.

## Acceptance Criteria

- [ ] `getQueueStatus()` method implemented in QueueManager
- [ ] Method calculates queue position using Redis ZREVRANK
- [ ] Method calculates estimated wait time based on queue metrics
- [ ] ETA calculation uses historical match rate or simple heuristics
- [ ] Status includes: position, queueLength, estimatedWaitTime
- [ ] `queue-status` Socket.io event handler created in MatchmakingController
- [ ] Handler emits status updates periodically (e.g., every 10 seconds)
- [ ] Handler can also emit status on-demand (client request)
- [ ] Calculations are performant (don't overload Redis)
- [ ] Status updates stop when player leaves queue or finds match
- [ ] Implementation is unit tested

## Technical Details

### Queue Status Calculation

Based on [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) section 3.4:

**File:** `src/services/QueueManager.ts`

```typescript
export interface QueueStatus {
  position: number;
  queueLength: number;
  estimatedWaitTime: number; // seconds
  region: string;
}

/**
 * Get queue status for a player
 */
async getQueueStatus(userId: string, region: string): Promise<QueueStatus | null> {
  const queueKey = `${this.QUEUE_KEY_PREFIX}${region}`;
  const position = await this.getQueuePosition(userId, region);

  if (position === -1) {
    return null; // Not in queue
  }

  const queueLength = await this.getQueueLength(region);
  const estimatedWaitTime = this.calculateETA(position, queueLength);

  return {
    position,
    queueLength,
    estimatedWaitTime,
    region
  };
}

/**
 * Calculate estimated wait time
 */
private calculateETA(position: number, queueLength: number): number {
  // Simple heuristic: average match time * players ahead
  const avgMatchTime = 30; // seconds (can be calculated from historical data)
  const playersAhead = Math.max(0, position - 1);
  return playersAhead * avgMatchTime;
}
```

### Socket.io Event Handler

**File:** `src/controllers/MatchmakingController.ts`

```typescript
/**
 * Handle queue-status request
 */
async handleQueueStatus(socket: Socket): Promise<void> {
  try {
    const userId = (socket as any).userId;
    if (!userId) {
      return;
    }

    const profile = await this.profileService.getProfile(userId);
    const status = await this.queueManager.getQueueStatus(userId, profile.region);

    if (status) {
      socket.emit('queue-status', status);
    } else {
      socket.emit('queue-status', { message: 'Not in queue' });
    }
  } catch (error) {
    logger.error('Queue status error:', error);
  }
}

/**
 * Start periodic queue status updates
 */
startQueueStatusUpdates(socket: Socket, userId: string): void {
  const interval = setInterval(async () => {
    await this.handleQueueStatus(socket);
  }, 10000); // Every 10 seconds

  // Store interval ID for cleanup
  (socket as any).queueStatusInterval = interval;

  // Clean up on disconnect
  socket.on('disconnect', () => {
    clearInterval(interval);
  });
}
```

### ETA Calculation Strategies

1. **Simple Heuristic**: `(position - 1) * avgMatchTime`
2. **Historical Rate**: Use Redis to track matches per minute, calculate based on current rate
3. **Queue Density**: Factor in queue length and matchmaking frequency

## Related Documentation

- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Queue status and ETA calculation (section 3.4)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – Real-time updates via WebSocket

## Labels

phase:matchmaking, backend:matchmaking, task, priority:medium

## Milestone

Phase 5: Matchmaking

```

```
