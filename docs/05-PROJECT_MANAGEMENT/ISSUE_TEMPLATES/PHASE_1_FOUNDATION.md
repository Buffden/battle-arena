# Phase 1: Foundation & Infrastructure Setup

**Copy and paste these templates directly into GitHub Issues.**

---

## Epic-1: Foundation & Infrastructure Setup

### Issue Template:
```
Title: Epic-1: Foundation & Infrastructure Setup

Description:
## Overview
Set up the complete foundation for the Battle Arena multiplayer artillery battle game project. This epic establishes the microservices architecture foundation with 5 backend services (3 Spring Boot, 2 Node.js), Angular frontend, and infrastructure tooling following clean architecture principles.

## Goals
- Establish project structure following clean architecture with strict separation of concerns
- Set up local development environment using Docker Compose (recommended for <1,000 users/month)
- Configure CI/CD pipelines with GitHub Actions (testing, building, code quality checks)
- Set up development tooling and code quality infrastructure (linters, formatters, pre-commit hooks, testing frameworks)
- Prepare infrastructure for all services following the system architecture

## Success Criteria
- [ ] All service directories created (Auth:8081, Profile:8082, Leaderboard:8083, Matchmaking:3002, Game Engine:5002 - **internal ports only**)
- [ ] Docker Compose working locally with MongoDB (27017) and Redis (6379 - **internal ports, host ports only for dev convenience**)
- [ ] Nginx API Gateway configured (ONLY service with external ports 80/443)
- [ ] Services communicate internally via Docker network (service names, not localhost)
- [ ] CI/CD pipelines configured with GitHub Actions (testing, building, code quality, security scanning)
- [ ] Testing frameworks configured (JUnit, Jest, Jasmine) with 80%+ coverage targets
- [ ] Code quality tools configured (ESLint, Prettier, Checkstyle) and enforced
- [ ] Pre-commit hooks configured (Husky, lint-staged) for automatic code quality checks
- [ ] Development tooling infrastructure complete (API docs, editor configs, dependency management)
- [ ] Development environment documented with service ports and responsibilities

## ⚠️ Critical Architecture Note: Port Management

**Services run in Docker/Kubernetes and communicate internally:**

- **Nginx API Gateway**: ONLY service with external ports (80, 443)
- **Backend Services**: NO host ports - internal ports only (8081, 8082, 8083, 3002, 5002)
- **Databases**: Internal ports only - host ports exposed ONLY for development convenience
- **Service Communication**: Use service names (`auth-service:8081`) NOT `localhost:8081`
- **Production**: Remove all database host port mappings, use internal network only

## ⏭️ Deferred to Later Phases

**Phase 1 focuses on foundation only.** The following will be implemented in later phases:

### Phase 2+ (Service Implementation)
- **API Documentation (Swagger/OpenAPI)** - Configured when first REST API service is implemented (Phase 2: Authentication)
- **Service-specific Dockerfiles** - Created when implementing each service (Phase 8: Deployment)
- **Service configurations** - Added as services are built (application.properties, package.json, etc.)
- **Service-specific logging** - Added during service implementation when needed

### Phase 8 (Deployment & Production)
- **Dockerfiles for all services** - Multi-stage builds, health checks, optimization
- **Production Docker Compose** - Full service orchestration for production
- **Kubernetes deployment** - Production orchestration (if needed for >10,000 users/day)
- **Logging infrastructure** - ELK Stack or Grafana Cloud (when services need observability)
- **Monitoring infrastructure** - Prometheus, Grafana (when services are running)
- **Distributed tracing** - Jaeger/Zipkin (optional, for production)

**Rationale:** 
- Phase 1 establishes the foundation (structure, dev environment basics, CI/CD, development tooling)
- API documentation is added in Phase 2 when first REST APIs are implemented
- Service-specific implementations (Dockerfiles, logging, monitoring) are added when services are built and need them
- This follows an incremental approach: build foundation → implement services → add production infrastructure

## Related Documentation
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Microservices architecture overview
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Service structure and responsibilities
- [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Development and production deployment strategies
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Critical design principles (REUSABILITY, SOLID, DRY, Clean Code, Secure Programming)

## Architecture Diagrams
- **System Architecture:** `https://github.com/{username}/{repo}/blob/{branch}/docs/03-DIAGRAMS/exported/architecture/System%20Architecture.png`
- **Container Diagram:** `https://github.com/{username}/{repo}/blob/{branch}/docs/03-DIAGRAMS/exported/architecture/Container%20Diagram.png`
- **Component Diagram:** `https://github.com/{username}/{repo}/blob/{branch}/docs/03-DIAGRAMS/exported/architecture/Component%20Diagram%20-%20Game%20Engine%20Service.png`

## Labels
epic:foundation, infrastructure, priority:high

## Milestone
Phase 1: Foundation
```

---

### Story-1.1: Set up project structure and repository

#### Issue Template:
```
Title: Story-1.1: Set up project structure and repository

Description:
## Epic
Related to #X (Epic-1 issue number)

## Description
Set up the complete project structure with all microservices, frontend, and infrastructure directories following clean architecture principles with strict separation of concerns. The structure must support 5 backend services (3 Spring Boot services on ports 8081-8083, 2 Node.js services on ports 3002 and 5002), Angular frontend, and deployment configurations.

## Acceptance Criteria
- [ ] Repository structure created following the architecture specification
- [ ] All 5 backend service directories initialized (auth-service, profile-service, leaderboard-service, matchmaking-service, game-engine)
- [ ] Frontend service directory initialized (Angular application)
- [ ] README files created for each service with port numbers and responsibilities
- [ ] .gitignore configured for all services (Java, Node.js, Angular patterns)
- [ ] Basic documentation structure in place (docs/ already exists)

## Technical Details

### Backend Services Structure
Based on [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md):

**Spring Boot Services (Java):**
- `backend-services/auth-service/` - Port 8081, MongoDB (Users collection), REST API
- `backend-services/profile-service/` - Port 8082, MongoDB (Profiles collection), REST API
- `backend-services/leaderboard-service/` - Port 8083, MongoDB (Leaderboard collection), REST API

**Node.js Services:**
- `backend-services/matchmaking-service/` - Port 3002, Redis (Queue, Lobby), WebSocket (Socket.io)
- `backend-services/game-engine/` - Port 5002, MongoDB (Matches collection), Redis (Game state), WebSocket (Socket.io)

### Frontend Structure
- `frontend-service/` - Angular application with modules: auth, dashboard, hero-selection, matchmaking, arena-selection, weapon-selection, arena, profile, leaderboard

### Infrastructure Structure
- `deployments/docker/` - Dockerfiles for all services
- `deployments/kubernetes/` - Kubernetes manifests (for future production deployment)
- `database/init/` - MongoDB initialization scripts
- `scripts/` - Utility scripts for setup and deployment

### Design Principles Compliance
All structure must follow [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md):
- **REUSABILITY** - Shared utilities and common components
- **CLEAN ARCHITECTURE** - Strict layer separation (controller, service, repository, model, dto)
- **SOLID Principles** - Single responsibility per component
- **DRY** - No code duplication

## Related Documentation
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Service structure details
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service responsibilities and ports

## Labels
epic:foundation, infrastructure, feature, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.1: Create root project structure
```
Title: Task-1.1.1: Create root project structure

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create the root directory structure for the Battle Arena project following the microservices architecture specification. The structure must support 5 backend services, Angular frontend, Docker/Kubernetes deployments, and database initialization scripts.

## Acceptance Criteria
- [ ] Root directories created with proper naming conventions
- [ ] Directory structure documented in root README.md
- [ ] Structure follows the architecture specification from System Architecture document
- [ ] All directories follow clean architecture principles

## Technical Details

### Required Root Directories
Based on [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) and [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md):

```
battle-arena/
├── backend-services/     # 5 microservices (3 Spring Boot, 2 Node.js)
├── frontend-service/    # Angular application
├── deployments/          # Docker and Kubernetes configurations
├── database/             # MongoDB initialization scripts
├── scripts/              # Utility scripts
└── docs/                 # Documentation (already exists)
```

### Directory Purpose
- **backend-services/**: Contains all 5 microservices (Auth:8081, Profile:8082, Leaderboard:8083, Matchmaking:3002, Game Engine:5002)
- **frontend-service/**: Angular application with modular structure (auth, dashboard, hero-selection, matchmaking, arena-selection, weapon-selection, arena, profile, leaderboard)
- **deployments/**: Docker Compose for local development, Kubernetes manifests for production
- **database/**: MongoDB initialization scripts for collections (Users, Profiles, Matches, Leaderboard, Heroes, Weapons, Arenas)
- **scripts/**: Setup, deployment, and utility scripts

### Design Principles
Follow [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md):
- **Separation of Concerns**: Each directory has a single, clear purpose
- **Clean Architecture**: Structure supports layer separation within services

## Related Documentation
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service architecture and ports
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Frontend and backend structure

## Labels
epic:foundation, infrastructure, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.2: Initialize backend-services directory
```
Title: Task-1.1.2: Initialize backend-services directory

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create directory structure for all 5 backend microservices following the architecture specification. Each service must have the appropriate structure based on its technology stack (Spring Boot for Auth/Profile/Leaderboard, Node.js for Matchmaking/Game Engine).

## Acceptance Criteria
- [ ] auth-service directory created (Spring Boot, Port 8081)
- [ ] profile-service directory created (Spring Boot, Port 8082)
- [ ] leaderboard-service directory created (Spring Boot, Port 8083)
- [ ] matchmaking-service directory created (Node.js, Port 3002)
- [ ] game-engine directory created (Node.js, Port 5002)
- [ ] Each service has technology-appropriate structure
- [ ] Each service has README.md with port, technology, and responsibilities

## Technical Details

### Spring Boot Services Structure
Based on [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.1:

**For auth-service, profile-service, leaderboard-service:**
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
├── pom.xml                    # Maven dependencies
├── README.md                  # Service documentation
└── .gitignore                 # Java/Spring Boot patterns
```

### Node.js Services Structure
Based on [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.2:

**For matchmaking-service, game-engine:**
```
service-name/
├── src/
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── services/               # Business logic
│   ├── middleware/             # Express middleware
│   ├── routes/                 # Route definitions
│   ├── utils/                  # Utility functions
│   └── types/                  # Type definitions
├── server.js                   # Application entry point
├── package.json                # NPM dependencies
├── README.md                   # Service documentation
└── .gitignore                 # Node.js patterns
```

### Service Responsibilities
Based on [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md):

- **auth-service (8081)**: User registration, authentication, JWT token generation/validation, password hashing, MongoDB (Users collection)
- **profile-service (8082)**: User profile management, global score tracking (infinite, no level cap), rank tier calculation (Valorant-style), MongoDB (Profiles collection)
- **leaderboard-service (8083)**: Top players ranking, leaderboard with filtering (region, hero type, win percentage, weapons), MongoDB (Leaderboard collection)
- **matchmaking-service (3002)**: Hero selection, player queue, matchmaking algorithm, arena/weapon selection, Redis (Queue, Lobby), WebSocket (Socket.io)
- **game-engine (5002)**: Game room management, real-time game state, turn management, physics (Matter.js), scoring, MongoDB (Matches collection), Redis (Game state), WebSocket (Socket.io)

## Related Documentation
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service responsibilities and ports (sections 2.1-2.5)
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Service structure (sections 2.1-2.2)
- [Low-Level Design](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/README.md) - Detailed service design patterns

## Labels
epic:foundation, backend, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.3: Initialize frontend-service directory
```
Title: Task-1.1.3: Initialize frontend-service directory

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create directory structure for Angular frontend service following the component design specification. The frontend must support all game modules: authentication, dashboard, hero selection, matchmaking, arena selection, weapon selection, game arena, profile, and leaderboard.

## Acceptance Criteria
- [ ] frontend-service directory created
- [ ] Angular application structure prepared with modular architecture
- [ ] README.md created with frontend responsibilities
- [ ] .gitignore configured for Angular/Node.js patterns
- [ ] Structure supports all required modules

## Technical Details

### Angular Application Structure
Based on [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 1.1:

```
frontend-service/
├── src/
│   ├── app/
│   │   ├── auth/              # Authentication module
│   │   ├── dashboard/          # Dashboard module
│   │   ├── hero-selection/    # Hero selection module
│   │   ├── matchmaking/        # Matchmaking module
│   │   ├── arena-selection/    # Arena selection module
│   │   ├── weapon-selection/   # Weapon selection module
│   │   ├── pages/
│   │   │   └── arena/          # Game arena module
│   │   ├── profile/           # Profile module
│   │   ├── leaderboard/       # Leaderboard module
│   │   ├── shared/            # Shared components
│   │   ├── services/          # Angular services
│   │   ├── guards/            # Route guards
│   │   └── interceptors/      # HTTP interceptors
│   └── assets/                # Static assets
├── README.md                  # Frontend documentation
├── .gitignore                 # Angular/Node.js patterns
└── package.json               # NPM dependencies (created during Angular init)
```

### Frontend Services Required
Based on [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 1.2:

- **AuthService**: Login, registration, JWT token management
- **GameService**: WebSocket connection, game state synchronization, turn management
- **HeroSelectionService**: Multiple hero selection management
- **MatchmakingService**: Queue joining/leaving, match notifications
- **ArenaSelectionService**: Arena voting/elimination
- **WeaponSelectionService**: Alternating weapon selection
- **ProfileService**: Profile data, global score, rank tier
- **LeaderboardService**: Leaderboard data with filtering

### Communication Patterns
- **REST API**: HTTP/HTTPS for standard operations (Auth, Profile, Leaderboard services)
- **WebSocket**: Real-time communication for game events (Matchmaking, Game Engine services)
- **JSON**: Data format for all communications

## Related Documentation
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Frontend structure and services (sections 1.1-1.2)
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Frontend responsibilities and communication patterns
- **Frontend Components Class Diagram:** `https://github.com/{username}/{repo}/blob/{branch}/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png`

## Labels
epic:foundation, frontend, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.4: Create deployments directory structure
```
Title: Task-1.1.4: Create deployments directory structure

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create directory structure for deployment configurations (Docker, Kubernetes).

## Acceptance Criteria
- [ ] deployments/docker/ directory created
- [ ] deployments/kubernetes/ directory created (for future)
- [ ] Placeholder files created

## Technical Details
Create:
- deployments/
  - docker/
  - kubernetes/ (placeholder for future)

## Labels
epic:foundation, infrastructure, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.5: Create database directory for init scripts
```
Title: Task-1.1.5: Create database directory for init scripts

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create directory for database initialization scripts.

## Acceptance Criteria
- [ ] database/ directory created
- [ ] database/init/ directory created
- [ ] Placeholder init script created

## Technical Details
Create:
- database/
  - init/
    - init.js (placeholder for MongoDB init)

## Labels
epic:foundation, database, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.6: Create scripts directory
```
Title: Task-1.1.6: Create scripts directory

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create directory for utility scripts (setup, deployment, etc.).

## Acceptance Criteria
- [ ] scripts/ directory created
- [ ] README.md in scripts directory

## Technical Details
Create:
- scripts/
  - README.md

## Labels
epic:foundation, infrastructure, task, priority:low

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.7: Configure .gitignore for all services
```
Title: Task-1.1.7: Configure .gitignore for all services

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create and configure .gitignore files for all services and root directory.

## Acceptance Criteria
- [ ] Root .gitignore configured
- [ ] Java .gitignore patterns (for Spring Boot services)
- [ ] Node.js .gitignore patterns (for Node.js services)
- [ ] Angular .gitignore patterns (for frontend)
- [ ] Docker .gitignore patterns

## Technical Details
Create .gitignore files:
- Root .gitignore (common patterns)
- backend-services/*/.gitignore (Java patterns)
- backend-services/matchmaking-service/.gitignore (Node.js)
- backend-services/game-engine/.gitignore (Node.js)
- frontend-service/.gitignore (Angular)

## Labels
epic:foundation, infrastructure, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.8: Create service-specific README files
```
Title: Task-1.1.8: Create service-specific README files

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create README.md files for each service with basic information.

## Acceptance Criteria
- [ ] README for auth-service
- [ ] README for profile-service
- [ ] README for leaderboard-service
- [ ] README for matchmaking-service
- [ ] README for game-engine
- [ ] README for frontend-service
- [ ] Each README includes service description, port, technology

## Technical Details
Each README should include:
- Service name and description
- Technology stack
- Port number
- Responsibilities
- Status: Ready for Implementation

## Labels
epic:foundation, documentation, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.1.9: Create root README.md
```
Title: Task-1.1.9: Create root README.md

Description:
## Story
Related to #X (Story-1.1 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create comprehensive root README.md file that serves as the main entry point for the project. The README should provide project overview, architecture summary, technology stack, getting started guide, and links to detailed documentation.

## Acceptance Criteria
- [ ] Root README.md created in project root
- [ ] Project overview and description included
- [ ] Architecture summary (microservices overview)
- [ ] Technology stack listed
- [ ] Getting started guide included
- [ ] Links to detailed documentation (docs folder)
- [ ] Project structure overview
- [ ] Prerequisites listed
- [ ] Quick start instructions
- [ ] Contributing guidelines reference

## Technical Details

### README Structure
Based on [Project Description](../../00-PROJECT_DEFINITION/PROJECT_DESCRIPTION.md) and [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md):

**Required Sections:**
1. **Project Title & Badges**
   - Project name: Battle Arena
   - Status badges (if applicable)
   - License badge

2. **Project Overview**
   - Brief description (multiplayer 2D artillery battle game)
   - Key features summary
   - Technology highlights

3. **Architecture Overview**
   - Microservices architecture summary
   - Service list with ports:
     - Auth Service (Spring Boot, 8081)
     - Profile Service (Spring Boot, 8082)
     - Leaderboard Service (Spring Boot, 8083)
     - Matchmaking Service (Node.js, 3002)
     - Game Engine Service (Node.js, 5002)
     - Frontend Service (Angular, 4200)
   - Data stores: MongoDB, Redis
   - API Gateway: Nginx

4. **Technology Stack**
   - Backend: Spring Boot (Java), Node.js, Express
   - Frontend: Angular, TypeScript
   - Databases: MongoDB, Redis
   - Infrastructure: Docker, Docker Compose, Nginx
   - Real-time: Socket.io, WebSocket
   - Game Engine: Matter.js

5. **Prerequisites**
   - Docker & Docker Compose
   - Java 17+ (for Spring Boot services)
   - Node.js 18+ (for Node.js services)
   - Git

6. **Getting Started**
   - Clone repository
   - Environment setup (.env.example)
   - Docker Compose startup
   - Service access URLs

7. **Project Structure**
   - Directory tree overview
   - Key directories explained

8. **Documentation**
   - Links to docs folder
   - Architecture documentation
   - API documentation
   - Design documents

9. **Development**
   - Development workflow
   - Testing instructions
   - Code quality standards

10. **Contributing**
    - Link to contributing guidelines (if exists)
    - Code of conduct reference

### Example README Content
```markdown
# Battle Arena - Multiplayer Artillery Battle Game

[![Status](https://img.shields.io/badge/status-active-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## Overview

Battle Arena is a real-time multiplayer 2D artillery battle game featuring...
[Brief description from Project Description]

## Architecture

This project follows a microservices architecture with:
- 5 backend services (3 Spring Boot, 2 Node.js)
- Angular frontend
- MongoDB for persistent data
- Redis for caching and queues
- Nginx as API Gateway

[Service details...]

## Technology Stack

[Technology list...]

## Getting Started

[Quick start instructions...]

## Documentation

See [docs/README.md](docs/README.md) for complete documentation.

## Contributing

[Contributing guidelines...]
```

## Related Documentation
- [Project Description](../../00-PROJECT_DEFINITION/PROJECT_DESCRIPTION.md) - Project overview and features
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Architecture details
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Service structure

## Labels
epic:foundation, documentation, task, priority:high

## Milestone
Phase 1: Foundation
```

---

### Story-1.2: Set up development environment and tooling

#### Issue Template:
```
Title: Story-1.2: Set up development environment and tooling

Description:
## Epic
Related to #X (Epic-1 issue number)

## Description
Configure development environment with Docker Compose for local development following the deployment architecture specification. This setup is recommended for student projects (<1,000 users/month) and provides a simple, free orchestration solution for all services, databases, and infrastructure.

## Acceptance Criteria
- [ ] Docker and Docker Compose installed and verified
- [ ] Local development environment working with all services
- [ ] MongoDB container configured (port 27017) with required collections
- [ ] Redis container configured (port 6379) for caching and queues
- [ ] Nginx API Gateway configured with request routing and WebSocket support
- [ ] Docker Compose network configured for service communication
- [ ] Development scripts created for easy startup/shutdown
- [ ] Environment variable templates created (.env.example)

## Technical Details

### Docker Compose Configuration
Based on [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) section 1.1:

**Recommended for:** Student projects (<1,000 users/month), local development
**Cost:** $0/month (local) or $5-10/month (small cloud VM)

### Required Services
- **MongoDB**: Port 27017, persistent volumes, initialization scripts
- **Redis**: Port 6379, persistent volumes (optional for development)
- **Backend Services**: Auth (8081), Profile (8082), Leaderboard (8083), Matchmaking (3002), Game Engine (5002)
- **Frontend Service**: Angular application (4200)
- **Network**: Docker network for inter-service communication

### MongoDB Collections Required
Based on [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 4.1:
- Users (Auth Service)
- Profiles (Profile Service)
- Matches (Game Engine Service)
- Leaderboard (Leaderboard Service)
- Heroes, Weapons, Arenas (Configuration data)

### Redis Data Structures
Based on [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 4.2:
- **Sorted Sets**: Matchmaking queue (hero-based queues)
- **Hash**: Lobby storage, Game state cache
- **String**: Cache data, Hero/Weapon/Arena configurations

## Related Documentation
- [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Development environment setup (section 1.1)
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Data storage requirements (sections 4.1-4.2)
- **Deployment Diagram:** `https://github.com/{username}/{repo}/blob/{branch}/docs/03-DIAGRAMS/exported/architecture/Deployment%20Diagram.png`

## Labels
epic:foundation, infrastructure, feature, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.2.1: Install and verify Docker and Docker Compose
```
Title: Task-1.2.1: Install and verify Docker and Docker Compose

Description:
## Story
Related to #X (Story-1.2 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Install Docker and Docker Compose and verify installation.

## Acceptance Criteria
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Both verified working
- [ ] Installation documented

## Technical Details
- Install Docker Desktop (Mac/Windows) or Docker Engine (Linux)
- Install Docker Compose
- Verify with: docker --version, docker-compose --version
- Test with: docker run hello-world

## Labels
epic:foundation, infrastructure, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.2.2: Create docker-compose.yml for local development
```
Title: Task-1.2.2: Create docker-compose.yml for local development

Description:
## Story
Related to #X (Story-1.2 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create docker-compose.yml file for running all services locally following the deployment architecture. **Critical:** Services communicate internally via Docker network using service names. Only Nginx API Gateway exposes external ports (80/443). Backend services have NO host ports - they're accessed only via Nginx. Database ports (MongoDB/Redis) are exposed only for development convenience and should be removed in production.

## Acceptance Criteria
- [ ] docker-compose.yml created in root directory
- [ ] Nginx API Gateway service defined (ONLY service with external ports 80/443)
- [ ] MongoDB service defined with internal port 27017, volumes, and init scripts
- [ ] Redis service defined with internal port 6379 and persistence (optional)
- [ ] Docker network defined for inter-service communication
- [ ] Volume definitions for MongoDB data persistence
- [ ] Environment variable placeholders for service configuration
- [ ] Health checks configured for MongoDB and Redis
- [ ] Backend services configured with NO host ports (internal communication only)
- [ ] Services use service names for inter-service communication (not localhost)
- [ ] All backend services defined (commented out initially, enabled as services are built)

## Technical Details

### Docker Compose Structure
Based on [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) section 1.1:

```yaml
version: '3.8'

services:
  # Nginx API Gateway - ONLY service that exposes ports to host
  nginx:
    image: nginx:latest
    ports:
      - "80:80"      # HTTP
      - "443:443"    # HTTPS (when SSL configured)
    volumes:
      - ./deployments/nginx/nginx.conf:/etc/nginx/nginx.conf
    networks:
      - battle-arena-network
    depends_on:
      - mongodb
      - redis
      # - auth-service (when implemented)
      # - profile-service (when implemented)
      # - etc.

  mongodb:
    image: mongo:latest
    # Port exposed ONLY for development convenience (direct DB access, debugging)
    # In production, remove port mapping - services access via service name
    ports:
      - "27017:27017"  # Remove in production, use internal network only
    volumes:
      - mongodb_data:/data/db
      - ./database/init:/docker-entrypoint-initdb.d
    networks:
      - battle-arena-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:latest
    # Port exposed ONLY for development convenience (direct Redis access, debugging)
    # In production, remove port mapping - services access via service name
    ports:
      - "6379:6379"  # Remove in production, use internal network only
    volumes:
      - redis_data:/data
    networks:
      - battle-arena-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend services - NO host ports exposed
  # Services communicate internally via Docker network using service names
  # Example: auth-service connects to mongodb using "mongodb:27017" (not localhost:27017)
  # auth-service:
  #   build: ./backend-services/auth-service
  #   # NO ports exposed - accessed only via Nginx
  #   environment:
  #     - MONGODB_URI=mongodb://mongodb:27017/battlearena
  #     - REDIS_HOST=redis
  #     - REDIS_PORT=6379
  #   networks:
  #     - battle-arena-network
  #   depends_on:
  #     - mongodb
  #     - redis

volumes:
  mongodb_data:
  redis_data:

networks:
  battle-arena-network:
    driver: bridge
```

### ⚠️ Critical Architecture Principle: Internal Communication Only

**Services MUST communicate via Docker network, NOT via host ports:**

1. **Internal Communication:**
   - Services use service names: `mongodb:27017`, `redis:6379`, `auth-service:8081`
   - **NOT** `localhost:27017` or `127.0.0.1:8081`
   - All inter-service communication happens within Docker network

2. **Port Exposure Rules:**
   - **Nginx (API Gateway)**: ONLY service that exposes ports to host (80, 443)
   - **Backend Services**: NO host ports exposed - accessed only via Nginx
   - **Databases (MongoDB/Redis)**: Ports exposed ONLY for development convenience (debugging, direct access)
     - In production: Remove port mappings, use internal network only

3. **Service Discovery:**
   - Docker Compose: Services discover each other by service name (e.g., `auth-service`)
   - Kubernetes: Services discover via Kubernetes Service DNS (e.g., `auth-service.default.svc.cluster.local`)
   - Nginx routes external traffic to internal services by service name

### MongoDB Configuration
- **Internal Port**: 27017 (within Docker network)
- **Host Port**: 27017 (exposed ONLY for development convenience - remove in production)
- **Service Access**: Services connect using `mongodb:27017` (not `localhost:27017`)
- **Volumes**: Persistent storage for database data
- **Init Scripts**: `/database/init/init.js` for collection initialization
- **Collections**: Users, Profiles, Matches, Leaderboard, Heroes, Weapons, Arenas

### Redis Configuration
- **Internal Port**: 6379 (within Docker network)
- **Host Port**: 6379 (exposed ONLY for development convenience - remove in production)
- **Service Access**: Services connect using `redis:6379` (not `localhost:6379`)
- **Data Structures**: Sorted Sets (matchmaking queue), Hash (lobby/game state), String (cache)
- **Persistence**: Optional for development (can use in-memory)

### Network Configuration
- **Network Name**: `battle-arena-network`
- **Driver**: Bridge (for local development)
- **Purpose**: Enable inter-service communication via service names
- **Service Discovery**: Services reference each other by service name (e.g., `auth-service`, `mongodb`, `redis`)

### Nginx API Gateway Configuration
- **External Ports**: 80 (HTTP), 443 (HTTPS) - ONLY external ports
- **Internal Routing**: Routes to services by service name (e.g., `http://auth-service:8081`)
- **Load Balancing**: Can load balance across multiple service instances
- **SSL Termination**: Handles HTTPS/WSS encryption

## Related Documentation
- [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Docker Compose setup (section 1.1)
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service ports and data storage (sections 2.1-2.5, 4.1-4.2)
- **Cluster 1 Student Deployment:** `https://github.com/{username}/{repo}/blob/{branch}/docs/03-DIAGRAMS/exported/architecture/Cluster%201%20Student%20Deployment.png`
- Networks and volumes

## Labels
epic:foundation, infrastructure, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.2.3: Configure MongoDB container
```
Title: Task-1.2.3: Configure MongoDB container

Description:
## Story
Related to #X (Story-1.2 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Configure MongoDB container in docker-compose.yml with proper settings.

## Acceptance Criteria
- [ ] MongoDB container configured
- [ ] Port 27017 exposed
- [ ] Volume for data persistence
- [ ] Environment variables set
- [ ] Health check configured

## Technical Details
MongoDB configuration:
- Image: mongo:6.0
- Port: 27017:27017
- Volume: ./database/data:/data/db
- Environment: MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD
- Health check: mongosh --eval "db.adminCommand('ping')"

## Labels
epic:foundation, database, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.2.4: Configure Redis container
```
Title: Task-1.2.4: Configure Redis container

Description:
## Story
Related to #X (Story-1.2 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Configure Redis container in docker-compose.yml with proper settings.

## Acceptance Criteria
- [ ] Redis container configured
- [ ] Port 6379 exposed
- [ ] Volume for data persistence (optional)
- [ ] Health check configured

## Technical Details
Redis configuration:
- Image: redis:7.0
- Port: 6379:6379
- Volume: ./database/redis:/data (optional)
- Health check: redis-cli ping

## Labels
epic:foundation, database, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.2.5: Create development startup scripts
```
Title: Task-1.2.5: Create development startup scripts

Description:
## Story
Related to #X (Story-1.2 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create scripts to help with local development (start, stop, restart services).

## Acceptance Criteria
- [ ] start-dev.sh script created
- [ ] stop-dev.sh script created
- [ ] restart-dev.sh script created
- [ ] Scripts are executable
- [ ] Scripts documented

## Technical Details
Create scripts in scripts/ directory:
- start-dev.sh: Start all services (docker-compose up)
- stop-dev.sh: Stop all services (docker-compose down)
- restart-dev.sh: Restart all services
- Make scripts executable: chmod +x scripts/*.sh

## Labels
epic:foundation, infrastructure, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.2.6: Create environment variable templates
```
Title: Task-1.2.6: Create environment variable templates

Description:
## Story
Related to #X (Story-1.2 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create .env.example files for all services with required environment variables.

## Acceptance Criteria
- [ ] .env.example for root directory
- [ ] .env.example for each backend service
- [ ] .env.example for frontend
- [ ] All variables documented
- [ ] .env files in .gitignore

## Technical Details
Create .env.example files with:
- MongoDB connection string
- Redis connection string
- JWT secret keys
- Service ports
- API URLs
- Document each variable

## Labels
epic:foundation, infrastructure, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.2.7: Test local development environment
```
Title: Task-1.2.7: Test local development environment

Description:
## Story
Related to #X (Story-1.2 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Test that the local development environment works correctly.

## Acceptance Criteria
- [ ] Docker Compose starts successfully
- [ ] MongoDB accessible
- [ ] Redis accessible
- [ ] All services can connect to databases
- [ ] Environment variables loaded correctly

## Technical Details
Test steps:
1. Run: docker-compose up -d
2. Verify MongoDB: docker exec -it battle-arena-mongodb mongosh
3. Verify Redis: docker exec -it battle-arena-redis redis-cli ping
4. Check logs: docker-compose logs
5. Test connectivity from services

## Labels
epic:foundation, infrastructure, testing, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.2.8: Create Nginx API Gateway configuration
```
Title: Task-1.2.8: Create Nginx API Gateway configuration

Description:
## Story
Related to #X (Story-1.2 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create Nginx configuration file for API Gateway that routes requests to backend services, handles load balancing, and manages WebSocket connections. The Nginx configuration must support all services and follow the system architecture specification.

## Acceptance Criteria
- [ ] Nginx configuration file created (deployments/nginx/nginx.conf)
- [ ] Request routing configured for all backend services
- [ ] WebSocket support configured (upgrade headers)
- [ ] Load balancing configured (round-robin)
- [ ] CORS configuration included
- [ ] Health check endpoints configured
- [ ] SSL/TLS placeholders included (for future HTTPS)
- [ ] Rate limiting placeholders included
- [ ] Configuration documented

## Technical Details

### Nginx Configuration Structure
Based on [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 5.1 and [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md):

**File Location:** `deployments/nginx/nginx.conf`

### Required Configuration

**1. Upstream Services (Backend Services):**
```nginx
upstream auth-service {
    server auth-service:8081;
}

upstream profile-service {
    server profile-service:8082;
}

upstream leaderboard-service {
    server leaderboard-service:8083;
}

upstream matchmaking-service {
    server matchmaking-service:3002;
}

upstream game-engine-service {
    server game-engine:5002;
}
```

**2. HTTP Server Block:**
```nginx
server {
    listen 80;
    server_name localhost;

    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;

    # Auth Service routes
    location /api/auth {
        proxy_pass http://auth-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Profile Service routes
    location /api/profile {
        proxy_pass http://profile-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Leaderboard Service routes
    location /api/leaderboard {
        proxy_pass http://leaderboard-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Matchmaking Service WebSocket
    location /ws/matchmaking {
        proxy_pass http://matchmaking-service;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Game Engine Service WebSocket
    location /ws/game {
        proxy_pass http://game-engine-service;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

**3. HTTPS Server Block (Placeholder for Future):**
```nginx
# server {
#     listen 443 ssl;
#     server_name localhost;
#     
#     ssl_certificate /etc/nginx/ssl/cert.pem;
#     ssl_certificate_key /etc/nginx/ssl/key.pem;
#     
#     # Same location blocks as HTTP
# }
```

### Key Features

**Request Routing:**
- `/api/auth/*` → Auth Service (8081)
- `/api/profile/*` → Profile Service (8082)
- `/api/leaderboard/*` → Leaderboard Service (8083)
- `/ws/matchmaking` → Matchmaking Service (3002) - WebSocket
- `/ws/game` → Game Engine Service (5002) - WebSocket

**WebSocket Support:**
- Upgrade headers configured
- Connection upgrade handling
- WebSocket-specific proxy settings

**Load Balancing:**
- Round-robin (default)
- Can be extended to least connections, IP hash for WebSocket

**CORS Configuration:**
- Allow all origins (development)
- Allow common HTTP methods
- Allow Authorization and Content-Type headers

**Health Checks:**
- `/health` endpoint for gateway health
- Backend service health checks (future)

### Service Discovery
- Services referenced by Docker service names (e.g., `auth-service:8081`)
- Works within Docker Compose network
- No hardcoded IPs or localhost

## Related Documentation
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - API Gateway requirements (section 5.1-5.2)
- [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Nginx configuration (section 1.1)
- [Communication Patterns](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) - REST and WebSocket patterns

## Labels
epic:foundation, infrastructure, api-gateway, task, priority:high

## Milestone
Phase 1: Foundation
```

---

### Story-1.3: Set up CI/CD pipeline with GitHub Actions

#### Issue Template:
```
Title: Story-1.3: Set up CI/CD pipeline with GitHub Actions

Description:
## Epic
Related to #X (Epic-1 issue number)

## Description
Create comprehensive GitHub Actions workflows for automated testing, building, code quality checks, security scanning, and deployment following the CI/CD requirements. The workflows must enforce code quality standards, run tests with coverage reporting, perform security scanning, and verify builds before merging.

## Acceptance Criteria
- [ ] CI pipeline runs on PRs and pushes to main/develop
- [ ] Backend CI workflow created (includes testing, code quality, coverage, security scanning)
- [ ] Frontend CI workflow created (includes testing, code quality, coverage)
- [ ] Security scanning workflow created (dependency scanning, SAST)
- [ ] Build verification works for all services
- [ ] Workflows documented with clear descriptions
- [ ] Docker image building configured (for future deployment)
- [ ] Deployment pipeline configured (for future)

## Technical Details

### CI/CD Pipeline Requirements
Based on [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) section 5.1:

**Continuous Integration Steps:**
1. **Code Quality Checks:**
   - ESLint for Node.js/Angular
   - Checkstyle for Java services
   - Prettier formatting check
   - Fail build on quality violations

2. **Automated Testing:**
   - Unit tests (JUnit, Jest, Jasmine)
   - Integration tests (Spring Boot Test, Supertest)
   - Coverage reporting (JaCoCo, Istanbul, Karma)
   - Enforce 80%+ coverage threshold

3. **Security Scanning:**
   - Dependency vulnerability scanning (npm audit, Maven dependency check)
   - SAST (Static Application Security Testing)
   - Fail build on critical vulnerabilities

4. **Build Verification:**
   - Maven build for Java services
   - npm build for Node.js services
   - Angular build for frontend
   - Verify all services build successfully

5. **Docker Image Building (Future):**
   - Build Docker images for all services
   - Push to container registry
   - Image vulnerability scanning

### Workflow Structure
**Backend CI Workflow (.github/workflows/backend-ci.yml):**
- Matrix strategy for multiple services
- Java services: Setup Java 17, Maven test, Maven build, Checkstyle
- Node.js services: Setup Node.js, npm test, npm build, ESLint
- Coverage reporting and upload
- Security scanning

**Frontend CI Workflow (.github/workflows/frontend-ci.yml):**
- Setup Node.js
- Install dependencies
- Run ESLint
- Run tests (Jasmine/Karma)
- Build Angular app
- Coverage reporting

**Security Workflow (.github/workflows/security.yml):**
- Dependency scanning
- SAST scanning
- License compliance checking

## Related Documentation
- [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - CI/CD requirements (section 5.1)
- [Testing Strategy](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Testing approach and coverage targets
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Code quality and testing requirements (section 5.2)

## Labels
epic:foundation, infrastructure, feature, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.3.1: Create GitHub Actions workflow for backend services
```
Title: Task-1.3.1: Create GitHub Actions workflow for backend services

Description:
## Story
Related to #X (Story-1.3 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create GitHub Actions workflow for Spring Boot and Node.js backend services. The workflow must include automated testing (unit and integration), code quality checks (Checkstyle, ESLint), code coverage reporting (80%+ target), security scanning, and build verification.

## Acceptance Criteria
- [ ] Workflow file created (.github/workflows/backend-ci.yml)
- [ ] Triggers configured (PR and push to main/develop)
- [ ] Java 17 setup for Spring Boot services
- [ ] Node.js 18 setup for Node.js services
- [ ] Automated testing configured (unit and integration tests)
- [ ] Code quality checks configured (Checkstyle for Java, ESLint for Node.js)
- [ ] Code coverage reporting configured (JaCoCo for Java, Istanbul for Node.js)
- [ ] Coverage threshold enforcement (80%+)
- [ ] Security scanning configured (dependency scanning)
- [ ] Build verification for all services
- [ ] Coverage reports uploaded to Codecov or similar

## Technical Details

### Workflow Configuration
**File:** `.github/workflows/backend-ci.yml`

**Triggers:**
- `pull_request` to main/develop
- `push` to main/develop

**Jobs Structure:**
```yaml
name: Backend CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  java-services:
    strategy:
      matrix:
        service: [auth-service, profile-service, leaderboard-service]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Run tests
        run: mvn test
      - name: Run Checkstyle
        run: mvn checkstyle:check
      - name: Generate coverage
        run: mvn jacoco:report
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  nodejs-services:
    strategy:
      matrix:
        service: [matchmaking-service, game-engine]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run ESLint
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Generate coverage
        run: npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Required Checks
- Tests must pass
- Code quality checks must pass
- Coverage threshold must be met (80%+)
- Security scanning must pass
- Build must succeed

## Labels
epic:foundation, infrastructure, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.3.2: Create GitHub Actions workflow for frontend
```
Title: Task-1.3.2: Create GitHub Actions workflow for frontend

Description:
## Story
Related to #X (Story-1.3 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create GitHub Actions workflow for Angular frontend. The workflow must include automated testing, code quality checks (ESLint, Prettier), code coverage reporting (80%+ target), and build verification.

## Acceptance Criteria
- [ ] Workflow file created (.github/workflows/frontend-ci.yml)
- [ ] Triggers configured (PR and push to main/develop)
- [ ] Node.js 18 setup
- [ ] Automated testing configured (Jasmine/Karma)
- [ ] Code quality checks configured (ESLint, Prettier)
- [ ] Code coverage reporting configured (Karma coverage)
- [ ] Coverage threshold enforcement (80%+)
- [ ] Angular build verification
- [ ] Coverage reports uploaded to Codecov or similar

## Technical Details

### Workflow Configuration
**File:** `.github/workflows/frontend-ci.yml`

**Triggers:**
- `pull_request` to main/develop
- `push` to main/develop

**Jobs Structure:**
```yaml
name: Frontend CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  frontend-ci:
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run ESLint
        run: npm run lint
      - name: Run Prettier check
        run: npm run format:check
      - name: Run tests
        run: npm test
      - name: Generate coverage
        run: npm run test:coverage
      - name: Build Angular app
        run: npm run build
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Required Checks
- ESLint must pass
- Prettier formatting must be correct
- Tests must pass
- Coverage threshold must be met (80%+)
- Build must succeed

## Labels
epic:foundation, infrastructure, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.3.3: Create security scanning workflow
```
Title: Task-1.3.3: Create security scanning workflow

Description:
## Story
Related to #X (Story-1.3 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create dedicated GitHub Actions workflow for security scanning including dependency vulnerability scanning, SAST (Static Application Security Testing), and license compliance checking.

## Acceptance Criteria
- [ ] Security workflow file created (.github/workflows/security.yml)
- [ ] Dependency vulnerability scanning configured (npm audit, Maven dependency check)
- [ ] SAST scanning configured (CodeQL or similar)
- [ ] License compliance checking configured
- [ ] Workflow runs on PRs and pushes
- [ ] Build fails on critical vulnerabilities
- [ ] Security reports available as artifacts

## Technical Details

### Security Workflow Structure
**File:** `.github/workflows/security.yml`

**Triggers:**
- `pull_request` to main/develop
- `push` to main/develop
- `schedule` (weekly scans)

**Jobs:**
```yaml
name: Security Scanning

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  dependency-scanning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run npm audit
        run: |
          cd backend-services/matchmaking-service && npm audit --audit-level=moderate
          cd ../game-engine && npm audit --audit-level=moderate
          cd ../../frontend-service && npm audit --audit-level=moderate
      - name: Run Maven dependency check
        run: |
          cd backend-services/auth-service && mvn dependency-check:check
          cd ../profile-service && mvn dependency-check:check
          cd ../leaderboard-service && mvn dependency-check:check

  sast-scanning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: java, javascript
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  license-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check licenses
        run: |
          # Check npm licenses
          npm run license-check
          # Check Maven licenses
          mvn license:check
```

### Security Scanning Tools
- **Dependency Scanning:** npm audit, OWASP Dependency Check (Maven)
- **SAST:** GitHub CodeQL, SonarQube (optional)
- **License Compliance:** license-checker (npm), license-maven-plugin (Maven)

### Failure Criteria
- Critical vulnerabilities fail the build
- High vulnerabilities warn but don't fail (can be configured)
- License violations fail the build

## Related Documentation
- [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Security scanning requirements (section 5.1)
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Security requirements

## Labels
epic:foundation, infrastructure, security, task, priority:high

## Milestone
Phase 1: Foundation
```

---

### Story-1.4: Set up development tooling and code quality infrastructure

#### Issue Template:
```
Title: Story-1.4: Set up development tooling and code quality infrastructure

Description:
## Epic
Related to #X (Epic-1 issue number)

## Description
Set up foundational development tooling, code quality tools, testing frameworks, and automation infrastructure to enforce code quality standards and enable efficient development workflow. This includes linters, formatters, pre-commit hooks, code coverage tools, and development scripts. **Note:** API documentation tools (Swagger/OpenAPI) will be configured in Phase 2 when REST APIs are implemented.

## Acceptance Criteria
- [ ] Testing frameworks configured (JUnit, Jest, Jasmine)
- [ ] Code quality tools configured (ESLint, Prettier, Checkstyle)
- [ ] Pre-commit hooks configured (Husky, lint-staged)
- [ ] Code coverage tools configured (JaCoCo, Istanbul, Karma)
- [ ] Editor/IDE configuration files created
- [ ] Dependency management and security scanning configured
- [ ] Development scripts created
- [ ] Git hooks configured
- [ ] Branch protection rules configured (optional, for production)

## Technical Details

### Testing Framework Setup
Based on [Testing Strategy](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md):

**Java Services (Spring Boot):**
- JUnit 5 for unit testing
- Spring Boot Test for integration testing
- Mockito for mocking
- JaCoCo for code coverage (80%+ target)

**Node.js Services:**
- Jest for unit and integration testing
- Supertest for API testing
- Istanbul/NYC for code coverage (80%+ target)

**Angular Frontend:**
- Jasmine for unit testing
- Karma for test runner
- Angular Testing Utilities
- Code coverage (80%+ target)

### Code Quality Tools
Based on [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) and [Project Description](../../00-PROJECT_DEFINITION/PROJECT_DESCRIPTION.md):

**Java Services:**
- Checkstyle for code style enforcement
- SpotBugs for static analysis
- PMD for code quality (optional)

**Node.js Services:**
- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- TypeScript strict mode

**Angular Frontend:**
- ESLint for TypeScript linting
- Prettier for code formatting
- Angular ESLint rules

### Pre-commit Hooks
- Husky for Git hooks
- lint-staged for running linters on staged files
- Pre-commit checks: linting, formatting, tests (optional)

### Code Coverage Tools
- JaCoCo (Java) - 80%+ coverage target
- Istanbul/NYC (Node.js) - 80%+ coverage target
- Karma coverage (Angular) - 80%+ coverage target
- Coverage reports in CI/CD

### Editor/IDE Configuration
- .editorconfig for consistent code style
- IDE-specific settings (VSCode, IntelliJ IDEA)
- Recommended extensions/plugins

### Dependency Management
- Dependabot for dependency updates
- npm audit / Maven dependency check
- Security vulnerability scanning
- License compliance checking

### Development Scripts
- Scripts for common tasks (test, lint, format, build)
- Scripts for database operations
- Scripts for service management

## Related Documentation
- [Testing Strategy](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Testing approach and tools (sections 5.1-5.4)
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Code quality requirements (section 5.2)
- [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - CI/CD requirements (section 5.1)
- [Project Description](../../00-PROJECT_DEFINITION/PROJECT_DESCRIPTION.md) - Technology stack (section 6)

## Labels
epic:foundation, infrastructure, tooling, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.4.1: Configure testing frameworks
```
Title: Task-1.4.1: Configure testing frameworks

Description:
## Story
Related to #X (Story-1.4 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Configure testing frameworks for all services (JUnit for Java, Jest for Node.js, Jasmine/Karma for Angular) following the testing strategy specification. Set up test directory structures and basic test configuration files.

## Acceptance Criteria
- [ ] JUnit 5 configured for Spring Boot services (auth, profile, leaderboard)
- [ ] Jest configured for Node.js services (matchmaking, game-engine)
- [ ] Jasmine/Karma configured for Angular frontend
- [ ] Test directory structures created
- [ ] Test configuration files created (pom.xml test dependencies, jest.config.js, karma.conf.js)
- [ ] Basic test examples created (to verify setup)

## Technical Details

### Spring Boot Services (Java)
Based on [Testing Strategy](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) section 5.1:

**Dependencies (pom.xml):**
```xml
<dependencies>
  <!-- JUnit 5 -->
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
  </dependency>
  <!-- Spring Boot Test -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
  <!-- Mockito -->
  <dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
  </dependency>
  <!-- JaCoCo for coverage -->
  <dependency>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
  </dependency>
</dependencies>
```

**Test Structure:**
```
src/test/java/
├── unit/              # Unit tests
├── integration/       # Integration tests
└── resources/         # Test resources
```

### Node.js Services
**Dependencies (package.json):**
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.0.0",
    "@types/jest": "^29.0.0"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Test Structure:**
```
src/
├── __tests__/         # Test files
└── __mocks__/         # Mock files
```

### Angular Frontend
**Dependencies (package.json):**
- Jasmine (included with Angular CLI)
- Karma (included with Angular CLI)
- Angular Testing Utilities

**Test Structure:**
```
src/app/
├── *.spec.ts         # Component/service tests
```

## Related Documentation
- [Testing Strategy](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Testing tools and frameworks (sections 5.1-5.4)

## Labels
epic:foundation, testing, tooling, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.4.2: Configure code quality tools (linters and formatters)
```
Title: Task-1.4.2: Configure code quality tools (linters and formatters)

Description:
## Story
Related to #X (Story-1.4 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Configure code quality tools (ESLint, Prettier, Checkstyle) for all services to enforce code quality standards and maintain consistent code style across the project.

## Acceptance Criteria
- [ ] ESLint configured for Node.js services and Angular frontend
- [ ] Prettier configured for all JavaScript/TypeScript code
- [ ] Checkstyle configured for Java services
- [ ] Configuration files created (.eslintrc, .prettierrc, checkstyle.xml)
- [ ] IDE integration configured
- [ ] Code quality rules documented

## Technical Details

### Java Services (Checkstyle)
**Configuration:** `checkstyle.xml` in each service root
**Rules:** Google Java Style Guide or Sun Code Conventions
**Maven Plugin:**
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-checkstyle-plugin</artifactId>
</plugin>
```

### Node.js Services (ESLint + Prettier)
**Configuration Files:**
- `.eslintrc.js` - ESLint rules
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to ignore

**ESLint Rules:**
- TypeScript recommended rules
- Node.js best practices
- Security rules

### Angular Frontend (ESLint + Prettier)
**Configuration Files:**
- `.eslintrc.json` - Angular ESLint rules
- `.prettierrc` - Prettier formatting rules
- `angular.json` - ESLint integration

## Related Documentation
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Code quality standards (section 2)
- [Project Description](../../00-PROJECT_DEFINITION/PROJECT_DESCRIPTION.md) - Code quality tools (section 6)

## Labels
epic:foundation, code-quality, tooling, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.4.3: Configure pre-commit hooks
```
Title: Task-1.4.3: Configure pre-commit hooks

Description:
## Story
Related to #X (Story-1.4 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Configure pre-commit hooks using Husky and lint-staged to automatically run linters and formatters before commits, ensuring code quality standards are enforced at the commit level.

## Acceptance Criteria
- [ ] Husky installed and configured
- [ ] lint-staged configured
- [ ] Pre-commit hook runs ESLint/Checkstyle
- [ ] Pre-commit hook runs Prettier (format on save)
- [ ] Pre-commit hook prevents commits with linting errors
- [ ] Configuration documented

## Technical Details

### Husky Setup
**Installation:**
```bash
npm install --save-dev husky lint-staged
npx husky install
```

**Configuration (package.json):**
```json
{
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"],
    "*.java": ["checkstyle"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**Pre-commit Hook (.husky/pre-commit):**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

### Hook Behavior
- Run linters on staged files
- Auto-fix issues where possible
- Prevent commit if critical errors remain
- Format code automatically

## Related Documentation
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Code quality enforcement

## Labels
epic:foundation, tooling, automation, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.4.4: Configure code coverage tools
```
Title: Task-1.4.4: Configure code coverage tools

Description:
## Story
Related to #X (Story-1.4 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Configure code coverage tools (JaCoCo for Java, Istanbul/NYC for Node.js, Karma for Angular) to track and enforce 80%+ code coverage target as specified in the testing strategy.

## Acceptance Criteria
- [ ] JaCoCo configured for Spring Boot services
- [ ] Istanbul/NYC configured for Node.js services
- [ ] Karma coverage configured for Angular
- [ ] Coverage reports generated
- [ ] Coverage thresholds set (80%+)
- [ ] Coverage reports integrated with CI/CD

## Technical Details

### Java Services (JaCoCo)
**Maven Plugin:**
```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <configuration>
    <rules>
      <rule>
        <limits>
          <limit>
            <counter>LINE</counter>
            <value>COVEREDRATIO</value>
            <minimum>0.80</minimum>
          </limit>
        </limits>
      </rule>
    </rules>
  </configuration>
</plugin>
```

**Coverage Target:** 80%+ line coverage

### Node.js Services (Istanbul/NYC)
**Jest Configuration (jest.config.js):**
```javascript
module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Angular (Karma)
**Coverage Configuration (karma.conf.js):**
- Coverage reporter configured
- Coverage thresholds set
- HTML reports generated

## Related Documentation
- [Testing Strategy](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Coverage targets (sections 5.1-5.2)
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Testing requirements (section 5.2)

## Labels
epic:foundation, testing, tooling, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.4.5: Configure editor and IDE settings
```
Title: Task-1.4.5: Configure editor and IDE settings

Description:
## Story
Related to #X (Story-1.4 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create editor and IDE configuration files (.editorconfig, IDE-specific settings) to ensure consistent code formatting and development experience across all team members.

## Acceptance Criteria
- [ ] .editorconfig file created
- [ ] VSCode settings configured (.vscode/settings.json)
- [ ] IntelliJ IDEA settings configured (optional)
- [ ] Recommended extensions/plugins documented
- [ ] Code style consistency enforced

## Technical Details

### .editorconfig
**Configuration:**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{java,js,ts,json}]
indent_style = space
indent_size = 2

[*.java]
indent_size = 4
```

### VSCode Settings
**Recommended Extensions:**
- ESLint
- Prettier
- Java Extension Pack
- Angular Language Service
- Docker
- GitLens

### IDE Settings
- Code formatting on save
- Import organization
- Code style enforcement

## Labels
epic:foundation, tooling, task, priority:low

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.4.6: Configure dependency management and security scanning
```
Title: Task-1.4.6: Configure dependency management and security scanning

Description:
## Story
Related to #X (Story-1.4 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Configure dependency management tools (Dependabot, npm audit, Maven dependency check) and security vulnerability scanning to ensure dependencies are up-to-date and secure.

## Acceptance Criteria
- [ ] Dependabot configured for GitHub
- [ ] npm audit configured for Node.js services
- [ ] Maven dependency check configured for Java services
- [ ] Security scanning in CI/CD pipeline
- [ ] Dependency update workflow configured
- [ ] License compliance checking configured

## Technical Details

### Dependabot Configuration
**File:** `.github/dependabot.yml`
```yaml
version: 2
updates:
  - package-ecosystem: "maven"
    directory: "/backend-services/auth-service"
    schedule:
      interval: "weekly"
  - package-ecosystem: "npm"
    directory: "/backend-services/matchmaking-service"
    schedule:
      interval: "weekly"
```

### Security Scanning
**Maven (Java):**
- OWASP Dependency Check plugin
- Maven dependency plugin

**npm (Node.js):**
- `npm audit` for vulnerability scanning
- `npm audit fix` for automatic fixes

**CI/CD Integration:**
- Security scanning in GitHub Actions
- Fail build on critical vulnerabilities

## Related Documentation
- [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Security scanning (section 5.1)

## Labels
epic:foundation, security, tooling, task, priority:high

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.4.7: Create comprehensive development scripts
```
Title: Task-1.4.7: Create comprehensive development scripts

Description:
## Story
Related to #X (Story-1.4 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Create comprehensive development scripts for common tasks (test, lint, format, build, coverage) to streamline development workflow and ensure consistency across all services.

## Acceptance Criteria
- [ ] Root-level scripts for common tasks
- [ ] Service-specific scripts
- [ ] Scripts for testing (unit, integration, coverage)
- [ ] Scripts for code quality (lint, format)
- [ ] Scripts for building services
- [ ] Scripts documented

## Technical Details

### Root-Level Scripts
**scripts/dev-tools.sh:**
```bash
#!/bin/bash
# Common development tasks

# Run all tests
test-all() {
  # Java services
  # Node.js services
  # Angular
}

# Run all linters
lint-all() {
  # Checkstyle for Java
  # ESLint for Node.js/Angular
}

# Format all code
format-all() {
  # Prettier for JS/TS
  # Checkstyle for Java
}

# Generate coverage reports
coverage-all() {
  # JaCoCo for Java
  # Istanbul for Node.js
  # Karma for Angular
}
```

### Service-Specific Scripts
Each service should have:
- `npm run test` or `mvn test`
- `npm run lint` or `mvn checkstyle:check`
- `npm run format` or `mvn formatter:format`
- `npm run coverage` or `mvn jacoco:report`

## Labels
epic:foundation, tooling, scripts, task, priority:medium

## Milestone
Phase 1: Foundation
```

#### Subtask: Task-1.4.8: Configure GitHub branch protection and PR templates
```
Title: Task-1.4.8: Configure GitHub branch protection and PR templates

Description:
## Story
Related to #X (Story-1.4 issue number)

## Epic
Related to #X (Epic-1 issue number)

## Description
Configure GitHub branch protection rules for main/develop branches and create PR templates to ensure code quality and proper review process.

## Acceptance Criteria
- [ ] Branch protection rules configured for main branch
- [ ] Branch protection rules configured for develop branch
- [ ] PR template created
- [ ] Required checks configured (CI, tests, linting)
- [ ] Required reviews configured (optional)
- [ ] Documentation updated

## Technical Details

### Branch Protection Rules
**Main Branch:**
- Require pull request reviews
- Require status checks to pass (CI, tests, linting)
- Require branches to be up to date
- Require conversation resolution before merging
- Do not allow force pushes

**Develop Branch:**
- Require status checks to pass
- Allow force pushes (for hotfixes)

### PR Template
**File:** `.github/pull_request_template.md`
```markdown
## Description
Brief description of changes

## Related Issues
Closes #X
Related to #X

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

## Labels
epic:foundation, tooling, github, task, priority:medium

## Milestone
Phase 1: Foundation
```

---

## 📝 Usage Instructions

1. **Create Epic Issue:** Copy the Epic template and create issue (e.g., #X)
2. **Create Story Issues:** Copy story templates, replace `#X` with Epic issue number, replace `#X` with story issue numbers
3. **Create Subtask Issues:** Copy subtask templates, replace `#X` with Story issue number, replace `#X` with Epic issue number
4. **Create Branches:** 
   - **Recommended:** Use manual branch naming: `feature/epic-1-story-1-description`
   - **Or:** Use issue number: `feature/#X-description`
   - **Auto-generated:** Will be `epic-1-title`, `story-1-1-title`, `task-1-1-1-title` (clear hierarchy)
5. **Link in Commits:** Use `Related to #X` or `Closes #X` in commit messages
6. **Link in PRs:** Use `Closes #X` and `Related to #X` in PR descriptions

