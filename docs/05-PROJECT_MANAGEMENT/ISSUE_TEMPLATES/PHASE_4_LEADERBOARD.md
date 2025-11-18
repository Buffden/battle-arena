# Phase 4: Leaderboard Service

**⚠️ NOTE: This is REFERENCE DOCUMENTATION for Leaderboard Service technical details.**

**For implementation planning, see:**

- EPIC-5: Progression & Competition (uses Leaderboard Service details from this file)

**This phase file contains:**

- Leaderboard Service architecture
- Design patterns (Facade, Repository, Strategy)
- API specifications
- Code structure examples
- Technical implementation details
- Stories and tasks for Leaderboard Service

**Epics will reference this file for technical specs, but implementation follows epic-based feature development (game studio approach).**

---

**Copy and paste these templates directly into GitHub Issues.**

---

## PHASE-4: Leaderboard Service - Technical Reference

### Issue Template:

```
Title: PHASE-4: Leaderboard Service

Description:
## Overview
Implement a scalable leaderboard system that exposes global and filtered rankings for players based on their profile statistics and rank tiers. This phase document provides technical reference for the Leaderboard Service (Port 8083) that reads from the Profiles collection, aggregates statistics, applies filters, and exposes REST APIs for the frontend. The service follows clean architecture principles and design patterns (Facade, Repository, Strategy).

## Goals
- Global leaderboard of top players by global score
- Rank tier display (Valorant-style tiers from Profile Service)
- Filtering by region, hero type, win percentage, and weapons
- Pagination and sorting support
- Statistics display (wins, losses, win%, matches played)
- Efficient MongoDB queries and indexes

## Success Criteria
- [ ] Users can view a global leaderboard of top players
- [ ] Leaderboard includes rank tier, wins, losses, win%, matches played
- [ ] Filtering (region, hero type, win%, weapons) works and can be combined
- [ ] Pagination works for large leaderboards
- [ ] Queries are efficient and backed by proper indexes
- [ ] Unit tests with 80%+ coverage
- [ ] Integration tests for all leaderboard endpoints

## Impact Areas
- **Profile Service:** Leaderboard reads from Profiles collection; changes to `globalScore`, `rankTier`, or statistics fields impact leaderboard logic and projections.
- **Frontend:** Leaderboard UI depends on API response shape and performance; breaking changes in DTOs will break Angular leaderboard components.
- **Matchmaking/Game Engine:** Post-match pipelines push results that ultimately affect rankings; incorrect integration leads to stale or inconsistent leaderboards.
- **Database Performance:** Heavy aggregations or missing indexes on key fields (e.g. `globalScore`, `rankTier`, `winRate`) can degrade performance across the cluster.

## Technical Architecture

### Service Details
Based on [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 2.3:
- **Technology:** Spring Boot 3.x (Java 17)
- **Port:** 8083 (internal, accessed via Nginx API Gateway)
- **Database:** MongoDB (Profiles collection as read model)
- **Communication:** REST API (HTTP/HTTPS)
- **Security:** JWT token validation (from Auth Service)

### Key Components
Based on [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md):
- **LeaderboardController** - REST API endpoint handler (Facade Pattern)
- **LeaderboardService** - Business logic for leaderboard queries (Strategy Pattern)
- **LeaderboardRepository** - Data access layer (Repository Pattern, MongoDB aggregation)
- **FilterCriteria** - DTO for filter parameters (region, hero, win%, weapons)

### Design Patterns Applied
- **Facade Pattern** - LeaderboardController provides simplified interface
- **Repository Pattern** - LeaderboardRepository abstracts aggregate queries
- **Strategy Pattern** - Filtering and sorting strategies

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – responsibilities, components, and APIs
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – global score, rank tiers, and statistics fields
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Leaderboard overview (section 2.3)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Profiles collection schema and indexes
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Backend service structure and layering

## Architecture Diagrams
- **Leaderboard Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Leaderboard%20Service.png`
- **Post-Match Flow Sequence Diagram (Leaderboard update):** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Post-Match%20Flow.png`

## Labels
phase:leaderboard, backend:leaderboard, priority:medium

## Milestone
Phase 4: Leaderboard
```

---

### STORY-4-1: Leaderboard Service - Spring Boot Setup

#### Issue Template:

```
Title: STORY-4-1: Leaderboard Service - Spring Boot Setup

Description:
## Epic
Related to #X (PHASE-4 issue number)

## Description
Initialize Spring Boot project for Leaderboard Service with MongoDB integration following clean architecture principles. Set up the complete project structure with proper package organization, MongoDB connection, JWT validation, and API documentation tools.

## Acceptance Criteria
- [ ] Spring Boot 3.x project created (Java 17)
- [ ] Maven dependencies configured (MongoDB, JWT validation, Swagger)
- [ ] Application properties configured (port 8083, MongoDB URI, CORS)
- [ ] Package structure follows clean architecture (controller, service, repository, model, dto, config)
- [ ] Application.java main class created
- [ ] Health check endpoint working (/health)

## Technical Details

### Spring Boot Project Structure
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.1 and [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md):

**Package Structure:**

```

src/main/java/com/battlearena/leaderboard/

- Application.java
- controller/
  - LeaderboardController.java
- service/
  - LeaderboardService.java
- repository/
  - LeaderboardRepository.java
- dto/
  - LeaderboardResponse.java
  - FilterCriteria.java
- config/
  - SwaggerConfig.java
  - SecurityConfig.java

````

### Required Dependencies (pom.xml)
- `spring-boot-starter-web`
- `spring-boot-starter-data-mongodb`
- `spring-boot-starter-security` (JWT validation)
- `springdoc-openapi-starter-webmvc-ui`
- `spring-boot-starter-test`

### Application Properties Configuration
**File:** `src/main/resources/application.properties`

```properties
server.port=8083
spring.application.name=leaderboard-service
spring.data.mongodb.uri=${MONGODB_URI:mongodb://mongodb:27017/battlearena}
spring.data.mongodb.database=battlearena
jwt.secret=${JWT_SECRET:your-secret-key-change-in-production}
logging.level.com.battlearena.leaderboard=INFO
```

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md)

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-1-1: Create Spring Boot project structure
```
Title: TASK-4-1-1: Create Spring Boot project structure

Description:
## Story
Related to #X (STORY-4-1 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Create the complete Spring Boot project structure for Leaderboard Service following clean architecture principles with strict layer separation. The structure must support the Facade, Repository, and Strategy design patterns as specified in the Leaderboard Service LLD. This includes establishing the proper Maven directory layout, package organization, and main application class to bootstrap the service.

## Acceptance Criteria
- [ ] Maven project structure created with standard `src/main/java`, `src/main/resources`, `src/test/java` directories
- [ ] Root package `com.battlearena.leaderboard` created
- [ ] Package structure follows clean architecture layers: `controller`, `service`, `repository`, `dto`, `config`, `exception`, `model`
- [ ] Main `Application.java` class created with `@SpringBootApplication` annotation
- [ ] Package structure documented and matches Leaderboard Service LLD specification
- [ ] All packages follow Java naming conventions and are properly organized

## Technical Details

### Required Folder Structure
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.1 and [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md):

```
backend-services/leaderboard-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── battlearena/
│   │   │           └── leaderboard/
│   │   │               ├── Application.java
│   │   │               ├── controller/
│   │   │               │   └── LeaderboardController.java
│   │   │               ├── service/
│   │   │               │   ├── LeaderboardService.java
│   │   │               │   └── strategy/
│   │   │               │       ├── RankingStrategy.java
│   │   │               │       ├── FilterStrategy.java
│   │   │               │       └── impl/
│   │   │               ├── repository/
│   │   │               │   └── LeaderboardRepository.java
│   │   │               ├── dto/
│   │   │               │   ├── LeaderboardResponse.java
│   │   │               │   └── FilterCriteria.java
│   │   │               ├── model/
│   │   │               │   └── LeaderboardEntry.java
│   │   │               ├── config/
│   │   │               │   ├── SwaggerConfig.java
│   │   │               │   └── SecurityConfig.java
│   │   │               └── exception/
│   │   │                   └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── battlearena/
│                   └── leaderboard/
│                       ├── controller/
│                       ├── service/
│                       └── repository/
├── pom.xml
└── README.md
```

### Design Patterns Applied
Based on [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) section 1.3:

- **Facade Pattern**: `LeaderboardController` provides a simplified interface to the leaderboard subsystem, hiding complexity of service layer
- **Repository Pattern**: `LeaderboardRepository` abstracts MongoDB data access operations
- **Strategy Pattern**: `RankingStrategy` and `FilterStrategy` interfaces allow interchangeable algorithms for ranking and filtering
- **Clean Architecture**: Strict separation between controller (presentation), service (business logic), and repository (data access) layers

### Package Organization Principles
- **controller/**: REST API endpoints, request/response handling, validation (Facade Pattern)
- **service/**: Business logic orchestration, strategy coordination (Strategy Pattern)
- **service/strategy/**: Strategy pattern implementations for ranking and filtering algorithms
- **repository/**: Data access abstraction, MongoDB operations (Repository Pattern)
- **dto/**: Data Transfer Objects for API requests/responses
- **model/**: Entity models representing MongoDB documents
- **config/**: Spring configuration classes (Swagger, Security, etc.)
- **exception/**: Global exception handling and custom exceptions

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Service structure, components, and design patterns (sections 1.2, 1.3, 3)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Backend service structure and layering (section 2.1)
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) – Clean Architecture and SOLID principles
- **Leaderboard Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Leaderboard%20Service.png`

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-1-2: Add Maven dependencies
```
Title: TASK-4-1-2: Add Maven dependencies

Description:
## Story
Related to #X (STORY-4-1 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Configure all required Maven dependencies in `pom.xml` for Leaderboard Service to support Spring Boot web functionality, MongoDB data access, JWT-based security, API documentation, and comprehensive testing. The dependencies must align with Spring Boot 3.x and Java 17 requirements, ensuring compatibility with the microservices architecture and following the same dependency management approach as other Spring Boot services (Auth, Profile).

## Acceptance Criteria
- [ ] Spring Boot parent POM configured (version 3.x)
- [ ] `spring-boot-starter-web` dependency added for REST API support
- [ ] `spring-boot-starter-data-mongodb` dependency added for MongoDB integration
- [ ] `spring-boot-starter-security` dependency added for JWT validation
- [ ] `springdoc-openapi-starter-webmvc-ui` dependency added for Swagger/OpenAPI documentation
- [ ] `spring-boot-starter-test` dependency added for testing framework
- [ ] `spring-boot-starter-actuator` dependency added for health checks (optional but recommended)
- [ ] Java version set to 17 in Maven compiler plugin
- [ ] All dependency versions managed through Spring Boot parent POM
- [ ] Dependencies match versions used in auth-service and profile-service for consistency

## Technical Details

### Required Dependencies (pom.xml)
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) and [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md):

**Core Dependencies:**
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.6</version>
    <relativePath/>
</parent>

<dependencies>
    <!-- Web Framework -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- MongoDB Integration -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>

    <!-- Security & JWT -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- API Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>

    <!-- Health Checks -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

**Maven Compiler Configuration:**
```xml
<properties>
    <java.version>17</java.version>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
</properties>
```

### Dependency Version Management
- Use Spring Boot parent POM for version management to ensure compatibility
- Match dependency versions with auth-service and profile-service for consistency
- Use Spring Boot 3.x compatible versions for all dependencies

## Related Documentation
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Backend service dependencies (section 2.1)
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Service technology stack
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service technology requirements (section 2.3)

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-1-3: Configure application.properties
```
Title: TASK-4-1-3: Configure application.properties

Description:
## Story
Related to #X (STORY-4-1 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Configure `application.properties` with all necessary settings for Leaderboard Service including server port (8083), MongoDB connection details, JWT validation configuration, CORS settings, logging levels, and actuator endpoints. The configuration must support both local development (Docker Compose) and production environments using environment variables for sensitive values. This ensures the service can connect to MongoDB, validate JWT tokens from Auth Service, and expose health check endpoints.

## Acceptance Criteria
- [ ] Server port 8083 configured
- [ ] Spring application name set to `leaderboard-service`
- [ ] MongoDB URI configured with environment variable support (`MONGODB_URI`)
- [ ] MongoDB database name set to `battlearena`
- [ ] JWT secret configured with environment variable support (`JWT_SECRET`)
- [ ] CORS configuration added for frontend communication
- [ ] Logging level configured for the service package
- [ ] Actuator health endpoint enabled (`management.endpoints.web.exposure.include=health`)
- [ ] Environment-specific profiles supported (dev, prod)
- [ ] Configuration documented with comments explaining each property

## Technical Details

### Application Properties Configuration
**File:** `src/main/resources/application.properties`

Based on [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 2.3:

```properties
# Server Configuration
server.port=8083
spring.application.name=leaderboard-service

# MongoDB Configuration
spring.data.mongodb.uri=${MONGODB_URI:mongodb://mongodb:27017/battlearena}
spring.data.mongodb.database=battlearena
spring.data.mongodb.auto-index-creation=true

# JWT Configuration
jwt.secret=${JWT_SECRET:your-secret-key-change-in-production}
jwt.issuer=auth-service
jwt.audience=leaderboard-service

# CORS Configuration
spring.web.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:4200}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true

# Actuator Configuration
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when-authorized
management.health.mongo.enabled=true

# Logging Configuration
logging.level.com.battlearena.leaderboard=INFO
logging.level.org.springframework.data.mongodb.core=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
```

### Environment Variable Support
- Use `${VARIABLE_NAME:default-value}` syntax for environment variable substitution
- Support Docker Compose environment variables for local development
- Support Kubernetes ConfigMap/Secret injection for production
- Document all required environment variables in README

### Configuration Profiles
Create separate profile files for different environments:
- `application-dev.properties` - Local development settings
- `application-prod.properties` - Production settings (minimal, uses env vars)

## Related Documentation
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service port and communication (section 2.3)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – MongoDB connection requirements
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Service configuration patterns

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-1-4: Create health check endpoint
```
Title: TASK-4-1-4: Create health check endpoint

Description:
## Story
Related to #X (STORY-4-1 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Enable Spring Boot Actuator health check endpoint for Leaderboard Service to support service monitoring, load balancer health checks, and Kubernetes liveness/readiness probes. The health endpoint must verify MongoDB connectivity and return appropriate status codes (UP, DOWN) based on service and database availability. This is critical for production deployment and service orchestration.

## Acceptance Criteria
- [ ] Spring Boot Actuator dependency included in pom.xml
- [ ] Actuator health endpoint enabled in application.properties
- [ ] `/actuator/health` endpoint accessible and returns JSON response
- [ ] Health endpoint includes MongoDB connectivity check
- [ ] Health endpoint returns HTTP 200 when service is UP
- [ ] Health endpoint returns HTTP 503 when service is DOWN
- [ ] Health details visible when authorized (for debugging)
- [ ] Custom health indicators implemented if needed (MongoDB, Redis cache)
- [ ] Health endpoint tested and verified working

## Technical Details

### Actuator Health Configuration
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md):

**application.properties:**
```properties
# Actuator Configuration
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when-authorized
management.health.mongo.enabled=true
management.health.defaults.enabled=true
```

### Health Endpoint Response Format
**When Service is UP:**
```json
{
  "status": "UP",
  "components": {
    "mongo": {
      "status": "UP",
      "details": {
        "database": "battlearena"
      }
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

**When Service is DOWN:**
```json
{
  "status": "DOWN",
  "components": {
    "mongo": {
      "status": "DOWN",
      "details": {
        "error": "Connection refused"
      }
    }
  }
}
```

### Custom Health Indicators (Optional)
If custom health checks are needed:
- Create `MongoHealthIndicator` to verify MongoDB connection
- Create `RedisHealthIndicator` if Redis caching is added later
- Implement `HealthIndicator` interface from Spring Boot Actuator

### Health Check Endpoint Location
- **Endpoint URL:** `http://localhost:8083/actuator/health`
- **Method:** GET
- **Authentication:** Optional (can be public for load balancers)
- **Response Format:** JSON

## Related Documentation
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Service health check patterns
- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Health checks for Kubernetes/Docker

## Labels
phase:leaderboard, backend:leaderboard, task, priority:low

## Milestone
Phase 4: Leaderboard
```

---

### STORY-4-2: Global Leaderboard (US-039)

#### Issue Template:

```
Title: STORY-4-2: Implement global leaderboard endpoint

Description:
## Epic
Related to #X (PHASE-4 issue number)

## User Story
As a user, I want to view the global leaderboard so that I can see top players.

## Acceptance Criteria
- [ ] GET /api/leaderboard endpoint
- [ ] Returns top players by global score
- [ ] Pagination support
- [ ] Sorted by score (descending)
- [ ] Unit tests with 80%+ coverage

## Technical Details
- Use Profiles collection as read model
- Implement MongoDB aggregation for sorting and limiting results
- Support pagination via `page` and `size` query parameters
- Include player statistics and rank tier in response

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md)
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md)

## Labels
phase:leaderboard, backend:leaderboard, feature, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-2-1: Create LeaderboardService
```
Title: TASK-4-2-1: Create LeaderboardService

Description:
## Story
Related to #X (STORY-4-2 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Create the `LeaderboardService` class that orchestrates leaderboard business logic following the Strategy pattern as specified in the Leaderboard Service LLD. The service must coordinate between the repository layer (data access), ranking strategies, and filtering strategies to generate paginated leaderboard results. This service acts as the central business logic coordinator, implementing clean architecture principles by delegating data access to repositories and algorithm execution to strategy implementations.

## Acceptance Criteria
- [ ] `LeaderboardService` class created in `service` package
- [ ] Service annotated with `@Service` Spring annotation
- [ ] Service depends on `LeaderboardRepository` for data access
- [ ] Method `getTopPlayers(int page, int size)` implemented for paginated leaderboard
- [ ] Method returns `LeaderboardResponse` DTO with paginated results
- [ ] Service handles pagination logic (page number, size, offset calculation)
- [ ] Service delegates to repository for MongoDB aggregation queries
- [ ] Service follows single responsibility principle (business logic only)
- [ ] Service is testable with dependency injection
- [ ] Service methods are documented with JavaDoc

## Technical Details

### Service Class Structure
Based on [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) section 3.2:

**File:** `src/main/java/com/battlearena/leaderboard/service/LeaderboardService.java`

```java
@Service
public class LeaderboardService {
    private final LeaderboardRepository leaderboardRepository;

    public LeaderboardService(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
    }

    public LeaderboardResponse getTopPlayers(int page, int size) {
        // Pagination logic
        // Delegate to repository
        // Return DTO
    }
}
```

### Design Patterns Applied
- **Strategy Pattern**: Service coordinates with `RankingStrategy` and `FilterStrategy` (to be implemented in later tasks)
- **Repository Pattern**: Service depends on `LeaderboardRepository` for data access abstraction
- **Dependency Injection**: Constructor injection for testability and SOLID principles

### Service Responsibilities
Based on [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) section 3.2:
- Coordinate leaderboard operations
- Generate leaderboards with pagination
- Apply ranking algorithms (via RankingStrategy)
- Apply filtering algorithms (via FilterStrategy)
- Aggregate statistics
- Transform repository results to DTOs

### Pagination Logic
- Calculate offset: `offset = (page - 1) * size`
- Validate page number (must be >= 1)
- Validate page size (must be between 1 and max page size, e.g., 100)
- Return total count for frontend pagination UI

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Service responsibilities and design patterns (sections 3.2, 4)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Service layer structure (section 2.1)
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) – SOLID principles and clean architecture
- **Leaderboard Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Leaderboard%20Service.png`

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-2-2: Create LeaderboardController
```
Title: TASK-4-2-2: Create LeaderboardController

Description:
## Story
Related to #X (STORY-4-2 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Create the `LeaderboardController` class implementing the Facade pattern to provide a simplified REST API interface for leaderboard operations. The controller must handle HTTP requests, validate query parameters (page, size), delegate business logic to `LeaderboardService`, format responses, and handle exceptions. This follows clean architecture by keeping the controller thin and focused on HTTP concerns only, while business logic resides in the service layer.

## Acceptance Criteria
- [ ] `LeaderboardController` class created in `controller` package
- [ ] Controller annotated with `@RestController` and `@RequestMapping("/api/leaderboard")`
- [ ] Controller depends on `LeaderboardService` via constructor injection
- [ ] GET endpoint `/api/leaderboard` implemented with pagination parameters
- [ ] Endpoint accepts `page` and `size` query parameters (optional with defaults)
- [ ] Endpoint returns `ResponseEntity<LeaderboardResponse>` with HTTP 200
- [ ] Controller validates query parameters (page >= 1, size between 1-100)
- [ ] Controller handles exceptions and returns appropriate HTTP status codes
- [ ] Controller is documented with Swagger/OpenAPI annotations
- [ ] CORS headers configured for frontend access
- [ ] JWT authentication configured (if required by security policy)

## Technical Details

### Controller Class Structure
Based on [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) section 3.1:

**File:** `src/main/java/com/battlearena/leaderboard/controller/LeaderboardController.java`

```java
@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "${spring.web.cors.allowed-origins}")
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    @Operation(summary = "Get global leaderboard", description = "Returns paginated list of top players")
    public ResponseEntity<LeaderboardResponse> getLeaderboard(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Validate parameters
        // Delegate to service
        // Return response
    }
}
```

### Design Patterns Applied
- **Facade Pattern**: Controller provides simplified interface to leaderboard subsystem, hiding complexity of service layer
- **Dependency Injection**: Constructor injection for testability
- **RESTful API Design**: Follows REST conventions for resource access

### API Endpoint Specification
- **URL:** `GET /api/leaderboard`
- **Query Parameters:**
  - `page` (optional, default: 1) - Page number (1-indexed)
  - `size` (optional, default: 20) - Page size (1-100)
- **Response:** `200 OK` with `LeaderboardResponse` JSON body
- **Error Responses:**
  - `400 Bad Request` - Invalid query parameters
  - `500 Internal Server Error` - Server errors

### Swagger/OpenAPI Documentation
Annotate controller methods with:
- `@Operation` - Endpoint description
- `@Parameter` - Query parameter descriptions
- `@ApiResponse` - Response documentation

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Controller responsibilities and Facade pattern (sections 3.1, 4.1)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Controller layer structure (section 2.1)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – REST API design patterns
- **Leaderboard Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Leaderboard%20Service.png`

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-2-3: Implement leaderboard aggregation query
```
Title: TASK-4-2-3: Implement leaderboard aggregation query

Description:
## Story
Related to #X (STORY-4-2 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Implement MongoDB aggregation pipeline in `LeaderboardRepository` to query the Profiles collection, sort players by `globalScore` in descending order, project required fields (username, rankTier, statistics), and support pagination. The aggregation must leverage MongoDB indexes on `globalScore` for optimal performance and return results efficiently even with large datasets. This is the core data access implementation that powers the leaderboard functionality.

## Acceptance Criteria
- [ ] `LeaderboardRepository` interface created extending `MongoRepository` or using `MongoTemplate`
- [ ] Aggregation pipeline implemented with `$sort` stage on `globalScore` descending
- [ ] Aggregation pipeline includes `$project` stage to select required fields
- [ ] Aggregation pipeline supports pagination with `$skip` and `$limit` stages
- [ ] Projection includes: `userId`, `displayName`, `globalScore`, `rankTier`, `wins`, `losses`, `matchesPlayed`, `winRate`
- [ ] Aggregation uses MongoDB indexes on `globalScore` (verify with explain plan)
- [ ] Repository method returns `List<LeaderboardEntry>` or custom projection DTO
- [ ] Total count query implemented separately for pagination metadata
- [ ] Aggregation handles edge cases (null values, empty collections)
- [ ] Query performance tested and optimized

## Technical Details

### Repository Interface Structure
Based on [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) section 3.3:

**File:** `src/main/java/com/battlearena/leaderboard/repository/LeaderboardRepository.java`

```java
@Repository
public interface LeaderboardRepository extends MongoRepository<Profile, String> {
    @Aggregation(pipeline = {
        "{ $sort: { globalScore: -1 } }",
        "{ $skip: ?0 }",
        "{ $limit: ?1 }",
        "{ $project: { ... } }"
    })
    List<LeaderboardEntry> findTopPlayers(int skip, int limit);

    long count();
}
```

### MongoDB Aggregation Pipeline
Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 1.2:

**Pipeline Stages:**
1. **$match** (optional): Filter criteria (to be added in filtering tasks)
2. **$sort**: Sort by `globalScore: -1` (descending)
3. **$skip**: Skip records for pagination (`(page - 1) * size`)
4. **$limit**: Limit results to page size
5. **$project**: Select and transform fields

**Example Aggregation:**
```javascript
[
  { $sort: { globalScore: -1 } },
  { $skip: 0 },
  { $limit: 20 },
  { $project: {
      userId: "$_id",
      displayName: 1,
      globalScore: 1,
      rankTier: 1,
      wins: 1,
      losses: 1,
      matchesPlayed: 1,
      winRate: { $cond: [
        { $eq: ["$matchesPlayed", 0] },
        0,
        { $divide: ["$wins", "$matchesPlayed"] }
      ]}
    }
  }
]
```

### Database Indexes Required
Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 1.2:
- **Profiles Collection:**
  - `globalScore` - Descending index (for sorting)
  - `rankTier` - Ascending index (for filtering)
  - `region` - Ascending index (for filtering)

### Design Patterns Applied
- **Repository Pattern**: Abstracts MongoDB aggregation operations
- **Query Optimization**: Leverages MongoDB indexes for performance

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Repository responsibilities (section 3.3)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Profiles collection schema and indexes (section 1.2)
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Profile data structure
- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png`

## Labels
phase:leaderboard, backend:leaderboard, task, priority:high

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-2-4: Add pagination support
```
Title: TASK-4-2-4: Add pagination support

Description:
## Story
Related to #X (STORY-4-2 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Implement comprehensive pagination support throughout the leaderboard stack (Controller, Service, Repository) to handle large datasets efficiently. Pagination must include query parameter validation, default values, maximum page size limits, offset calculation, total count retrieval, and pagination metadata in API responses. This ensures the frontend can display leaderboards with proper page navigation and prevents performance issues with large result sets.

## Acceptance Criteria
- [ ] Controller accepts `page` and `size` query parameters with defaults (page=1, size=20)
- [ ] Controller validates page number (must be >= 1)
- [ ] Controller validates page size (must be between 1 and 100)
- [ ] Service calculates offset: `offset = (page - 1) * size`
- [ ] Repository implements `$skip` and `$limit` in aggregation pipeline
- [ ] Total count query implemented separately for pagination metadata
- [ ] `LeaderboardResponse` DTO includes pagination metadata (totalCount, totalPages, currentPage, pageSize)
- [ ] Pagination works correctly with edge cases (page beyond total, empty results)
- [ ] Default page size configurable via application.properties
- [ ] Maximum page size enforced to prevent performance issues

## Technical Details

### Pagination Implementation Flow
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md):

**Controller Layer:**
```java
@GetMapping
public ResponseEntity<LeaderboardResponse> getLeaderboard(
        @RequestParam(defaultValue = "1") @Min(1) int page,
        @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
    // Validate and delegate
}
```

**Service Layer:**
```java
public LeaderboardResponse getTopPlayers(int page, int size) {
    int offset = (page - 1) * size;
    List<LeaderboardEntry> entries = repository.findTopPlayers(offset, size);
    long totalCount = repository.count();
    int totalPages = (int) Math.ceil((double) totalCount / size);

    return LeaderboardResponse.builder()
        .entries(entries)
        .totalCount(totalCount)
        .totalPages(totalPages)
        .currentPage(page)
        .pageSize(size)
        .build();
}
```

**Repository Layer:**
```java
@Aggregation(pipeline = {
    "{ $sort: { globalScore: -1 } }",
    "{ $skip: ?0 }",
    "{ $limit: ?1 }"
})
List<LeaderboardEntry> findTopPlayers(int skip, int limit);
```

### Pagination Metadata in Response
**LeaderboardResponse DTO Structure:**
```java
public class LeaderboardResponse {
    private List<LeaderboardEntry> entries;
    private long totalCount;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
}
```

### Configuration
**application.properties:**
```properties
leaderboard.pagination.default-page-size=20
leaderboard.pagination.max-page-size=100
```

## Related Documentation
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Pagination patterns
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Service pagination logic

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-2-5: Create LeaderboardResponse DTO
```
Title: TASK-4-2-5: Create LeaderboardResponse DTO

Description:
## Story
Related to #X (STORY-4-2 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Create comprehensive `LeaderboardResponse` and `LeaderboardEntry` DTOs that structure the API response with player information, global scores, rank tiers, statistics, and pagination metadata. The DTOs must match the frontend expectations, include all required fields for leaderboard display, and follow Java best practices with proper serialization annotations. This ensures type-safe data transfer between service and controller layers and provides a clear API contract for frontend integration.

## Acceptance Criteria
- [ ] `LeaderboardResponse` DTO created in `dto` package
- [ ] `LeaderboardEntry` nested DTO created for individual player entries
- [ ] Response includes pagination metadata (totalCount, totalPages, currentPage, pageSize, hasNext, hasPrevious)
- [ ] Entry includes player identification (userId, displayName, avatar)
- [ ] Entry includes ranking data (rank, globalScore, rankTier)
- [ ] Entry includes statistics (wins, losses, matchesPlayed, winRate)
- [ ] DTOs use Lombok annotations for boilerplate reduction (if Lombok is used)
- [ ] DTOs include Jackson annotations for JSON serialization
- [ ] DTOs are immutable or use builder pattern
- [ ] DTOs match frontend TypeScript interfaces (documented)
- [ ] DTOs include JavaDoc documentation

## Technical Details

### DTO Structure
Based on [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) section 2.1:

**File:** `src/main/java/com/battlearena/leaderboard/dto/LeaderboardResponse.java`

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardResponse {
    private List<LeaderboardEntry> entries;
    private long totalCount;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
}
```

**File:** `src/main/java/com/battlearena/leaderboard/dto/LeaderboardEntry.java`

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {
    private String userId;
    private String displayName;
    private String avatar;
    private int rank;
    private long globalScore;
    private String rankTier;
    private int wins;
    private int losses;
    private int matchesPlayed;
    private double winRate;
    private String region; // Optional, for future filtering
}
```

### JSON Response Example
```json
{
  "entries": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "displayName": "Player1",
      "avatar": "https://example.com/avatar1.png",
      "rank": 1,
      "globalScore": 15000,
      "rankTier": "Diamond",
      "wins": 150,
      "losses": 50,
      "matchesPlayed": 200,
      "winRate": 0.75,
      "region": "NA"
    }
  ],
  "totalCount": 1000,
  "totalPages": 50,
  "currentPage": 1,
  "pageSize": 20,
  "hasNext": true,
  "hasPrevious": false
}
```

### DTO Design Principles
- **Immutability**: Use `@Builder` pattern for immutable DTOs
- **Serialization**: Jackson annotations for JSON mapping
- **Validation**: Bean Validation annotations if needed
- **Documentation**: JavaDoc for API contract clarity

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – DTO structure (section 2.1)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – DTO layer patterns
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Profiles collection fields
- **Leaderboard Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Leaderboard%20Service.png`

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-2-6: Write tests for global leaderboard
```
Title: TASK-4-2-6: Write tests for global leaderboard

Description:
## Story
Related to #X (STORY-4-2 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Write comprehensive unit and integration tests for the global leaderboard functionality to ensure 80%+ code coverage, validate business logic, verify pagination behavior, test edge cases, and confirm API contract compliance. Tests must cover service layer logic, repository aggregation queries, controller endpoint behavior, DTO serialization, and error handling scenarios. This ensures reliability, maintainability, and confidence in refactoring.

## Acceptance Criteria
- [ ] Unit tests for `LeaderboardService` with mocked repository
- [ ] Unit tests cover pagination logic (offset calculation, edge cases)
- [ ] Unit tests cover service method return values and DTO transformation
- [ ] Integration tests for `GET /api/leaderboard` endpoint using `@WebMvcTest`
- [ ] Integration tests verify HTTP status codes, response body structure
- [ ] Integration tests cover query parameter validation (page, size)
- [ ] Repository tests using embedded MongoDB or Testcontainers
- [ ] Repository tests verify aggregation pipeline correctness
- [ ] Tests cover edge cases (empty results, page beyond total, invalid parameters)
- [ ] Test data fixtures created for consistent test scenarios
- [ ] Code coverage reaches 80%+ for service and controller layers
- [ ] Tests are documented with clear test names and assertions

## Technical Details

### Unit Test Structure
Based on [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md):

**File:** `src/test/java/com/battlearena/leaderboard/service/LeaderboardServiceTest.java`

```java
@ExtendWith(MockitoExtension.class)
class LeaderboardServiceTest {
    @Mock
    private LeaderboardRepository repository;

    @InjectMocks
    private LeaderboardService service;

    @Test
    void getTopPlayers_ReturnsPaginatedResults() {
        // Arrange
        // Act
        // Assert
    }

    @Test
    void getTopPlayers_CalculatesOffsetCorrectly() {
        // Test pagination offset calculation
    }
}
```

### Integration Test Structure
**File:** `src/test/java/com/battlearena/leaderboard/controller/LeaderboardControllerTest.java`

```java
@WebMvcTest(LeaderboardController.class)
class LeaderboardControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LeaderboardService service;

    @Test
    void getLeaderboard_Returns200WithValidParameters() throws Exception {
        mockMvc.perform(get("/api/leaderboard")
                .param("page", "1")
                .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entries").isArray());
    }
}
```

### Test Data Fixtures
Create test data builders or fixtures:
- Sample `Profile` entities with various `globalScore` values
- Expected `LeaderboardResponse` DTOs for assertions
- Edge case scenarios (empty results, single page, last page)

### Test Coverage Goals
- **Service Layer**: 80%+ coverage
- **Controller Layer**: 80%+ coverage
- **Repository Layer**: Integration tests for aggregation queries
- **Edge Cases**: Empty results, invalid parameters, boundary conditions

## Related Documentation
- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Testing patterns and best practices
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Testing layer structure
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) – Testability principles

## Labels
phase:leaderboard, backend:leaderboard, testing, priority:medium

## Milestone
Phase 4: Leaderboard
```

---

### STORY-4-3: Leaderboard Filtering (US-041)

#### Issue Template:

```
Title: STORY-4-3: Implement leaderboard filtering (region, hero, win%, weapons)

Description:
## Epic
Related to #X (PHASE-4 issue number)

## User Story
As a user, I want to filter leaderboard by region, hero type, winning percentage, and weapons so that I can see rankings in different categories.

## Acceptance Criteria
- [ ] Filter by region
- [ ] Filter by hero type
- [ ] Filter by winning percentage range
- [ ] Filter by weapons used
- [ ] Multiple filters can be combined
- [ ] Pagination works with filters

## Technical Details
- Implement FilterCriteria DTO for all filter fields
- Apply filters in MongoDB aggregation pipeline
- Ensure indexes support common filter combinations

## Labels
phase:leaderboard, backend:leaderboard, feature, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-3-1: Create FilterCriteria DTO
```
Title: TASK-4-3-1: Create FilterCriteria DTO

Description:
## Story
Related to #X (STORY-4-3 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Create a comprehensive `FilterCriteria` DTO that captures all filterable attributes for leaderboard queries (region, hero type, win percentage range, weapons, rank tier) in a type-safe way that maps cleanly from HTTP query parameters to repository-level filters. The DTO must support parameter binding from HTTP query strings, include validation annotations, and follow the Parameter Object pattern to avoid method parameter explosion. This enables flexible filtering while maintaining clean API design.

## Acceptance Criteria
- [ ] `FilterCriteria` DTO created in `dto` package
- [ ] DTO fields defined: `region`, `heroType`, `minWinPercent`, `maxWinPercent`, `weaponIds`, `rankTier`, `page`, `size`, `sort`
- [ ] DTO uses appropriate Java types (String, Double, List<String>, Integer)
- [ ] DTO includes Bean Validation annotations (`@Min`, `@Max`, `@Size`, `@Pattern`)
- [ ] DTO supports query parameter binding via `@RequestParam` or `@ModelAttribute`
- [ ] DTO used by `LeaderboardController` to bind query parameters
- [ ] DTO passed to `LeaderboardService` as a single parameter (Parameter Object pattern)
- [ ] DTO includes builder pattern or Lombok annotations
- [ ] DTO validates win percentage range (min <= max)
- [ ] DTO validates page and size parameters
- [ ] DTO is documented with JavaDoc

## Technical Details

### DTO Structure
Based on [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) and [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md):

**File:** `src/main/java/com/battlearena/leaderboard/dto/FilterCriteria.java`

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterCriteria {
    @Pattern(regexp = "^[A-Z]{2}$", message = "Region must be 2-letter code")
    private String region;

    private String heroType;

    @Min(0) @Max(100)
    private Double minWinPercent;

    @Min(0) @Max(100)
    private Double maxWinPercent;

    @Size(max = 10, message = "Maximum 10 weapon IDs allowed")
    private List<String> weaponIds;

    private String rankTier;

    @Min(1)
    private Integer page = 1;

    @Min(1) @Max(100)
    private Integer size = 20;

    @Pattern(regexp = "^(globalScore|winRate|matchesPlayed),(ASC|DESC)$")
    private String sort = "globalScore,DESC";

    @AssertTrue(message = "minWinPercent must be <= maxWinPercent")
    private boolean isValidWinPercentRange() {
        if (minWinPercent == null || maxWinPercent == null) return true;
        return minWinPercent <= maxWinPercent;
    }
}
```

### Design Patterns Applied
- **Parameter Object Pattern**: Encapsulates multiple filter parameters into a single object
- **Builder Pattern**: Supports fluent construction of filter criteria
- **Validation Pattern**: Bean Validation ensures data integrity

### Query Parameter Mapping
**HTTP Query String Example:**
```
GET /api/leaderboard?region=NA&heroType=tank&minWinPercent=50&maxWinPercent=80&weaponIds=weapon1&weaponIds=weapon2&page=1&size=20&sort=globalScore,DESC
```

**Controller Binding:**
```java
@GetMapping
public ResponseEntity<LeaderboardResponse> getLeaderboard(
        @Valid FilterCriteria criteria) {
    // Use criteria object
}
```

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Filtering section and FilterStrategy pattern
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Profiles collection filterable fields (section 1.2)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – DTO patterns
- **Leaderboard Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Leaderboard%20Service.png`

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-3-2: Implement region filtering
```
Title: TASK-4-3-2: Implement region filtering

Description:
## Story
Related to #X (STORY-4-3 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Implement region-based filtering in the MongoDB aggregation pipeline to allow users to view leaderboards filtered by player region (e.g., NA, EU, ASIA). The filter must be applied at the database level using MongoDB `$match` stage for optimal performance, leveraging the `region` index on the Profiles collection. This enables regional leaderboards while maintaining query efficiency.

## Acceptance Criteria
- [ ] Repository method accepts `FilterCriteria` with `region` field
- [ ] When `region` is provided in criteria, `$match` stage filters by `region` field
- [ ] When `region` is null or empty, no filter is applied (all regions included)
- [ ] Region filter is applied at aggregation stage, not in-memory
- [ ] Aggregation uses `region` index for optimal performance
- [ ] Region filter works correctly with pagination
- [ ] Region filter can be combined with other filters
- [ ] Invalid region values are handled gracefully
- [ ] Region filter is tested with unit and integration tests

## Technical Details

### MongoDB Aggregation Pipeline Enhancement
Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 1.2:

**Repository Method:**
```java
@Aggregation(pipeline = {
    "{ $match: { region: ?0 } }",  // Conditional based on criteria
    "{ $sort: { globalScore: -1 } }",
    "{ $skip: ?1 }",
    "{ $limit: ?2 }"
})
List<LeaderboardEntry> findTopPlayersByRegion(String region, int skip, int limit);
```

**Dynamic Pipeline Construction:**
```java
public List<LeaderboardEntry> findTopPlayers(FilterCriteria criteria) {
    List<Bson> pipeline = new ArrayList<>();

    // Add $match stage if region is provided
    if (criteria.getRegion() != null && !criteria.getRegion().isEmpty()) {
        pipeline.add(Aggregates.match(Filters.eq("region", criteria.getRegion())));
    }

    // Add sort, skip, limit stages
    pipeline.add(Aggregates.sort(Sorts.descending("globalScore")));
    pipeline.add(Aggregates.skip((criteria.getPage() - 1) * criteria.getSize()));
    pipeline.add(Aggregates.limit(criteria.getSize()));

    return mongoTemplate.aggregate(pipeline, Profile.class, LeaderboardEntry.class)
        .getMappedResults();
}
```

### Database Index Requirements
Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 1.2:
- **Profiles Collection Index:** `region: 1` (ascending index)
- **Compound Index:** `{ region: 1, globalScore: -1 }` (for efficient region + score sorting)

### Design Patterns Applied
- **Strategy Pattern**: Region filtering can be implemented as a `FilterStrategy` implementation
- **Repository Pattern**: Filtering logic encapsulated in repository layer

## Related Documentation
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Profiles collection schema and indexes (section 1.2)
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – FilterStrategy pattern (section 3.5)
- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png`

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-3-3: Implement hero type filtering
```
Title: TASK-4-3-3: Implement hero type filtering

Description:
## Story
Related to #X (STORY-4-3 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Allow leaderboard to be filtered by primary hero type (e.g., tank, support, damage) so that users can see rankings for specific hero archetypes.

## Acceptance Criteria
- [ ] When `heroType` is provided, only profiles with matching heroType statistics are returned.
- [ ] Multiple heroType values (if supported) are handled correctly (e.g., OR logic).

## Technical Details
- Determine which field(s) in Profiles or derived leaderboard data represent hero type usage.
- Add `$match` or `$filter` stages to the aggregation pipeline based on `heroType`.

## Related Documentation
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – hero-related stats
```

#### Subtask: TASK-4-3-4: Implement win percentage filtering
```
Title: TASK-4-3-4: Implement win percentage filtering

Description:
## Story
Related to #X (STORY-4-3 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Filter leaderboard results by win percentage range (e.g., 50–70%) so that competitive players can explore peers within specific performance bands.

## Acceptance Criteria
- [ ] When `minWinPercent` and/or `maxWinPercent` are provided, only players whose win% falls within that range are returned.
- [ ] When range is invalid (min > max), request is rejected with a clear error.

## Technical Details
- Either:
  - Precompute and persist win% in Profiles, or
  - Compute win% within aggregation (`wins / matchesPlayed`) and filter using `$expr`.
- Ensure indexes on `wins` and `matchesPlayed` exist if computed on the fly.

## Related Documentation
- [Database Design – Profiles collection](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)
```

#### Subtask: TASK-4-3-5: Implement weapons filtering
```
Title: TASK-4-3-5: Implement weapons filtering

Description:
## Story
Related to #X (STORY-4-3 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Filter leaderboard by frequently used weapons so that users can explore rankings for specific weapon archetypes or meta builds.

## Acceptance Criteria
- [ ] When `weaponIds` are provided, only players with usage of those weapons are returned (as per defined rule: any/all).
- [ ] Filtering logic is documented (e.g., players who used weapon in at least X% of matches).

## Technical Details
- Use weapon usage statistics from Profiles or a derived collection (e.g. `weaponUsage` array).
- Apply `$match` with `$in` or `$all` operators on weapon IDs, depending on rule.

## Related Documentation
- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Post-Match%20Flow.png) – where weapon usage feeds into stats
```

#### Subtask: TASK-4-3-6: Combine multiple filters
```
Title: TASK-4-3-6: Combine multiple filters

Description:
## Story
Related to #X (STORY-4-3 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Ensure that region, heroType, win%, weapons, and rankTier filters can be applied simultaneously without breaking pagination, performance, or correctness.

## Acceptance Criteria
- [ ] Any combination of filters produces correct, predictable results.
- [ ] Aggregation pipeline remains performant with common combinations (based on expected data volume).
- [ ] Filters are documented for frontend integration.

## Technical Details
- Compose `$match` stages in aggregation in a single optimized stage where possible.
- Use explain plans to verify index usage and adjust indexes as needed.

## Related Documentation
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – filtering and performance considerations
```

#### Subtask: TASK-4-3-7: Update leaderboard query and tests
```
Title: TASK-4-3-7: Update leaderboard query and tests

Description:
## Story
Related to #X (STORY-4-3 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Update the core leaderboard aggregation and test suite to cover all filter combinations and guard against regressions.

## Acceptance Criteria
- [ ] Aggregation pipeline updated to include all filter logic.
- [ ] Unit tests cover individual filters and common combinations.
- [ ] Integration tests verify filtered API responses against seeded data.

## Technical Details
- Add tests at repository/service level using an embedded MongoDB or testcontainer setup.
- Include negative tests for invalid filter values and combinations.

## Related Documentation
- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md)
```

---

### STORY-4-4: Rank Tier Display (US-040)

#### Issue Template:

```
Title: STORY-4-4: Display rank tiers on leaderboard

Description:
## Epic
Related to #X (PHASE-4 issue number)

## User Story
As a user, I want to see rank tiers on the leaderboard so that I know player positions.

## Acceptance Criteria
- [ ] Rank tier displayed for each player
- [ ] Rank tier icons/badges (optional)
- [ ] Rank tier in leaderboard response

## Technical Details
- Read rankTier from Profiles/Leaderboard read model
- Map rankTier to display label and optional icon

## Labels
phase:leaderboard, backend:leaderboard, feature, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-4-1: Include rankTier in aggregation and DTO
```
Title: TASK-4-4-1: Include rankTier in aggregation and DTO

Description:
## Story
Related to #X (STORY-4-4 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Ensure that `rankTier` field is included in the MongoDB aggregation projection and `LeaderboardEntry` DTO so that rank tier information (e.g., Bronze, Silver, Gold, Platinum, Diamond, Immortal) is available in the leaderboard API response. The rank tier is calculated by Profile Service based on global score ranges and must be displayed alongside player rankings to provide context about player skill levels.

## Acceptance Criteria
- [ ] `rankTier` field included in MongoDB aggregation `$project` stage
- [ ] `rankTier` field added to `LeaderboardEntry` DTO
- [ ] Rank tier values match Profile Service rank tier calculation (Valorant-style)
- [ ] Rank tier displayed correctly in API response JSON
- [ ] Rank tier can be used for filtering (if FilterCriteria supports it)
- [ ] Rank tier field is documented in API documentation (Swagger)
- [ ] Rank tier values validated against known tier list
- [ ] Tests verify rank tier is included in responses

## Technical Details

### Aggregation Projection Update
Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) and [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md):

**MongoDB Aggregation:**
```javascript
{
  $project: {
    userId: "$_id",
    displayName: 1,
    globalScore: 1,
    rankTier: 1,  // Include rank tier
    wins: 1,
    losses: 1,
    matchesPlayed: 1,
    winRate: { $divide: ["$wins", "$matchesPlayed"] }
  }
}
```

**DTO Update:**
```java
public class LeaderboardEntry {
    private String userId;
    private String displayName;
    private long globalScore;
    private String rankTier;  // Valorant-style: Bronze, Silver, Gold, Platinum, Diamond, Immortal
    // ... other fields
}
```

### Rank Tier Values
Based on Profile Service rank tier calculation:
- **Bronze** - Lower tier players
- **Silver** - Mid-tier players
- **Gold** - Upper mid-tier players
- **Platinum** - High-tier players
- **Diamond** - Very high-tier players
- **Immortal** - Top-tier players

## Related Documentation
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Rank tier calculation logic
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Profiles collection rankTier field (section 1.2)
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Rank tier display

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-4-2: Add rank tier icons/badges (optional, FE)
```
Title: TASK-4-4-2: Add rank tier icons/badges (optional, FE)

Description:
## Story
Related to #X (STORY-4-4 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
**Note: This is a frontend task, but documented here for completeness.** Add visual rank tier icons/badges to the leaderboard UI to enhance user experience. The frontend should display rank tier badges (e.g., Bronze, Silver, Gold icons) next to player names in the leaderboard, using the `rankTier` field from the API response. This provides visual context for player skill levels and improves leaderboard readability.

## Acceptance Criteria
- [ ] Rank tier icons/badges displayed in leaderboard UI
- [ ] Icons match rank tier values from API (Bronze, Silver, Gold, Platinum, Diamond, Immortal)
- [ ] Icons are visually distinct and recognizable
- [ ] Icons are responsive and work on mobile devices
- [ ] Icon assets are optimized for web performance
- [ ] Icon mapping is configurable (if tier names change)

## Technical Details

### Frontend Implementation (Angular)
**Component:**
```typescript
// leaderboard.component.ts
export class LeaderboardComponent {
  getRankTierIcon(rankTier: string): string {
    const iconMap = {
      'Bronze': '/assets/icons/bronze.svg',
      'Silver': '/assets/icons/silver.svg',
      'Gold': '/assets/icons/gold.svg',
      'Platinum': '/assets/icons/platinum.svg',
      'Diamond': '/assets/icons/diamond.svg',
      'Immortal': '/assets/icons/immortal.svg'
    };
    return iconMap[rankTier] || '/assets/icons/default.svg';
  }
}
```

## Related Documentation
- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – Leaderboard component design
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Rank tier calculation

## Labels
phase:leaderboard, frontend:leaderboard, task, priority:low

## Milestone
Phase 4: Leaderboard
```

---

### STORY-4-5: Player Statistics on Leaderboard (US-042)

#### Issue Template:

```
Title: STORY-4-5: Display player statistics on leaderboard

Description:
## Epic
Related to #X (PHASE-4 issue number)

## User Story
As a user, I want to see player statistics on the leaderboard so that I can compare performance.

## Acceptance Criteria
- [ ] Wins displayed
- [ ] Losses displayed
- [ ] Win percentage displayed
- [ ] Matches played displayed
- [ ] Statistics in leaderboard response

## Technical Details
- Extend leaderboard projection to include statistics fields
- Calculate win percentage if not pre-computed

## Labels
phase:leaderboard, backend:leaderboard, feature, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-5-1: Add statistics to leaderboard query
```
Title: TASK-4-5-1: Add statistics to leaderboard query

Description:
## Story
Related to #X (STORY-4-5 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Extend the MongoDB aggregation pipeline to include player statistics (wins, losses, matches played, win rate) in the leaderboard query projection. The statistics must be calculated or retrieved from the Profiles collection and included in the aggregation `$project` stage. Win rate should be calculated dynamically if not pre-computed, handling edge cases like zero matches played. This enables comprehensive player performance comparison on the leaderboard.

## Acceptance Criteria
- [ ] `wins` field included in aggregation projection
- [ ] `losses` field included in aggregation projection
- [ ] `matchesPlayed` field included in aggregation projection
- [ ] `winRate` calculated in aggregation (wins / matchesPlayed) or retrieved if pre-computed
- [ ] Win rate calculation handles edge cases (division by zero, null values)
- [ ] Statistics fields match Profile Service statistics structure
- [ ] Aggregation projection includes all required statistics fields
- [ ] Statistics are properly typed in projection (numbers, not strings)
- [ ] Query performance verified with statistics included

## Technical Details

### Aggregation Projection with Statistics
Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 1.2:

**MongoDB Aggregation:**
```javascript
{
  $project: {
    userId: "$_id",
    displayName: 1,
    globalScore: 1,
    rankTier: 1,
    wins: 1,
    losses: 1,
    matchesPlayed: 1,
    winRate: {
      $cond: [
        { $eq: ["$matchesPlayed", 0] },
        0,
        { $divide: ["$wins", "$matchesPlayed"] }
      ]
    }
  }
}
```

### Statistics Fields from Profiles Collection
Based on [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) section 1.2:
- `wins` - Number of matches won
- `losses` - Number of matches lost
- `matchesPlayed` - Total matches played (wins + losses)
- `winRate` - Calculated: `wins / matchesPlayed` (0-1 range, or 0-100% if multiplied by 100)

### Edge Case Handling
- **Zero matches played**: Win rate = 0 (avoid division by zero)
- **Null values**: Default to 0 for wins/losses/matchesPlayed
- **Negative values**: Validate data integrity (should not occur)

## Related Documentation
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Profiles collection statistics fields (section 1.2)
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Statistics tracking
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Statistics aggregation
- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png`

## Labels
phase:leaderboard, backend:leaderboard, task, priority:medium

## Milestone
Phase 4: Leaderboard
```

#### Subtask: TASK-4-5-2: Include statistics in response and tests
```
Title: TASK-4-5-2: Include statistics in response and tests

Description:
## Story
Related to #X (STORY-4-5 issue number)

## Epic
Related to #X (PHASE-4 issue number)

## Description
Ensure that player statistics (wins, losses, matches played, win rate) are properly included in the `LeaderboardEntry` DTO and API response, and write comprehensive tests to verify statistics are correctly retrieved, calculated, and serialized. Tests must cover edge cases, data validation, and ensure statistics match the expected format for frontend consumption.

## Acceptance Criteria
- [ ] `LeaderboardEntry` DTO includes `wins`, `losses`, `matchesPlayed`, `winRate` fields
- [ ] Statistics fields are properly serialized to JSON in API response
- [ ] Win rate is formatted correctly (decimal 0-1 or percentage 0-100)
- [ ] Unit tests verify statistics are included in DTOs
- [ ] Integration tests verify statistics in API responses
- [ ] Tests cover edge cases (zero matches, null values, negative values)
- [ ] Tests verify win rate calculation correctness
- [ ] Statistics match Profile Service data structure
- [ ] API documentation (Swagger) includes statistics field descriptions

## Technical Details

### DTO Structure with Statistics
**LeaderboardEntry DTO:**
```java
@Data
@Builder
public class LeaderboardEntry {
    private String userId;
    private String displayName;
    private long globalScore;
    private String rankTier;
    private int wins;           // Statistics
    private int losses;         // Statistics
    private int matchesPlayed;  // Statistics
    private double winRate;     // Statistics (0.0-1.0 or 0-100)
    // ... other fields
}
```

### JSON Response Example
```json
{
  "entries": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "displayName": "Player1",
      "globalScore": 15000,
      "rankTier": "Diamond",
      "wins": 150,
      "losses": 50,
      "matchesPlayed": 200,
      "winRate": 0.75
    }
  ]
}
```

### Test Scenarios
**Unit Tests:**
- Verify DTO includes all statistics fields
- Verify win rate calculation (wins / matchesPlayed)
- Test edge cases (zero matches, null values)

**Integration Tests:**
- Verify statistics in API response
- Verify statistics match database values
- Test with various player statistics combinations

## Related Documentation
- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Testing patterns
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Statistics aggregation
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) – Statistics fields

## Labels
phase:leaderboard, backend:leaderboard, testing, priority:medium

## Milestone
Phase 4: Leaderboard
```


````
