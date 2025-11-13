# Phase 3: Profile Service

**Copy and paste these templates directly into GitHub Issues.**

---

## Epic-3: Profile Service

### Issue Template:
```
Title: Epic-3: Profile Service

Description:
## Overview
Implement complete profile management system for user profiles, global score tracking, rank tier calculation, and statistics using Spring Boot. This epic establishes the Profile Service (Port 8082) that manages user profiles, tracks global scores (infinite, no level cap), calculates Valorant-style rank tiers based on score ranges, and maintains win/loss statistics. The service follows clean architecture principles and design patterns (Facade, Strategy, Repository, Proxy).

## Goals
- User profile management (view, update, avatar)
- Global score tracking (infinite, no level cap, updated after matches)
- Rank tier calculation (Valorant-style based on score ranges)
- Win/loss statistics tracking and display
- Player progression tracking and rank changes
- Redis caching for performance optimization

## Success Criteria
- [ ] Users can view their profile with all statistics
- [ ] Users can update their profile (display name, avatar)
- [ ] Global score tracked and updated after each match
- [ ] Rank tiers calculated correctly from score ranges
- [ ] Statistics (wins, losses, matches played, win percentage) tracked and displayed
- [ ] Score updates are atomic and thread-safe
- [ ] Rank tier updates automatically when score changes
- [ ] Redis caching implemented for profile data
- [ ] Unit tests with 80%+ code coverage
- [ ] Integration tests for all endpoints
- [ ] MongoDB Profiles collection properly indexed

## Technical Architecture

### Service Details
Based on [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 2.2:
- **Technology:** Spring Boot 3.x (Java 17)
- **Port:** 8082 (internal, accessed via Nginx API Gateway)
- **Database:** MongoDB (Profiles collection)
- **Cache:** Redis (for profile data caching)
- **Communication:** REST API (HTTP/HTTPS)
- **Security:** JWT token validation (from Auth Service)

### Key Components
Based on [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md):
- **ProfileController** - REST API endpoint handler (Facade Pattern)
- **ProfileService** - Business logic for profile management (Strategy Pattern)
- **ProfileRepository** - Data access layer (Repository Pattern)
- **ScoreCalculator** - Score calculation (Strategy Pattern)
- **RankTierCalculator** - Rank tier calculation (Strategy Pattern)
- **RedisCache** - Caching layer (Proxy Pattern)

### Design Patterns Applied
- **Facade Pattern** - ProfileController provides simplified interface
- **Strategy Pattern** - Scoring strategies, rank tier calculation strategies
- **Repository Pattern** - ProfileRepository abstracts data access
- **Proxy Pattern** - RedisCache provides caching proxy

### Score and Rank System
- **Global Score:** Infinite, no level cap, updated after each match
- **Rank Tiers:** Valorant-style (Iron, Bronze, Silver, Gold, Platinum, Diamond, Master, Grandmaster)
- **Score Ranges:** Configurable ranges determine rank tiers
- **Rank Calculation:** Automatic rank tier update when score changes

## Related Documentation
- [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - Complete service design, components, and patterns
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Profile Service overview (section 2.2)
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Backend service structure (section 2.1)
- [Database Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Profiles collection schema
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Critical design principles (REUSABILITY, SOLID, DRY, Clean Code, Secure Programming)

## Architecture Diagrams
- **Profile Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Profile%20Service.png`
- **Profile Update Flow Sequence Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Profile%20Update%20Flow.png`

## Labels
epic:profile, backend:profile, priority:high

## Milestone
Phase 3: Profile Management
```

---

### Story-3.1: Profile Service - Spring Boot Setup

#### Issue Template:
```
Title: Story-3.1: Profile Service - Spring Boot Setup

Description:
## Epic
Related to #X (Epic-3 issue number)

## Description
Initialize Spring Boot project for Profile Service with MongoDB and Redis integration following clean architecture principles. Set up the complete project structure with proper package organization, MongoDB connection, Redis caching, JWT validation, and API documentation tools.

## Acceptance Criteria
- [ ] Spring Boot 3.x project created (Java 17)
- [ ] Maven dependencies configured (MongoDB, Redis, JWT validation, Swagger)
- [ ] Application properties configured (port 8082, MongoDB URI, Redis connection, CORS)
- [ ] Package structure follows clean architecture (controller, service, repository, model, dto, config)
- [ ] Application.java main class created
- [ ] Health check endpoint working (/health)
- [ ] Redis connection configured and tested

## Technical Details

### Spring Boot Project Structure
Based on [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.1 and [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md):

**Package Structure:**
```
src/main/java/com/battlearena/profile/
  - Application.java
  - controller/
    - ProfileController.java
  - service/
    - ProfileService.java
    - ScoreCalculator.java
    - RankTierCalculator.java
  - repository/
    - ProfileRepository.java
  - model/
    - Profile.java
    - RankTier.java
  - dto/
    - ProfileResponse.java
    - UpdateProfileRequest.java
    - ScoreUpdateRequest.java
  - config/
    - RedisConfig.java
    - SwaggerConfig.java
  - cache/
    - RedisCache.java
  - exception/
    - GlobalExceptionHandler.java
```

### Required Dependencies (pom.xml)
- `spring-boot-starter-web` - REST API support
- `spring-boot-starter-data-mongodb` - MongoDB integration
- `spring-boot-starter-data-redis` - Redis integration
- `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` - JWT validation library
- `spring-boot-starter-validation` - Input validation
- `springdoc-openapi-starter-webmvc-ui` - Swagger/OpenAPI documentation
- `spring-boot-starter-test` - Testing framework

### Application Properties Configuration
**File:** `src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8082
spring.application.name=profile-service

# MongoDB Configuration
spring.data.mongodb.uri=${MONGODB_URI:mongodb://mongodb:27017/battlearena}
spring.data.mongodb.database=battlearena

# Redis Configuration
spring.data.redis.host=${REDIS_HOST:redis}
spring.data.redis.port=${REDIS_PORT:6379}
spring.data.redis.timeout=2000ms

# JWT Configuration (for token validation)
jwt.secret=${JWT_SECRET:your-secret-key-change-in-production}

# CORS Configuration
cors.allowed-origins=*

# Logging
logging.level.com.battlearena.profile=INFO
```

### Design Principles
Follow [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md):
- **Clean Architecture** - Strict separation of concerns (controller → service → repository)
- **SOLID Principles** - Single responsibility, dependency inversion
- **DRY** - Reusable components (score calculation, rank tier calculation)
- **Reusability** - Score and rank calculation strategies designed for reuse

## Related Documentation
- [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - Service design and component structure (sections 1-3)
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Spring Boot service structure (section 2.1)
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Profile Service overview (section 2.2)

## Labels
epic:profile, backend:profile, feature, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.1.1: Create Spring Boot project structure
```
Title: Task-3.1.1: Create Spring Boot project structure

Description:
## Story
Related to #X (Story-3.1 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create the Spring Boot project structure for Profile Service following clean architecture.

## Acceptance Criteria
- [ ] Maven project structure created
- [ ] Package structure follows clean architecture
- [ ] Main Application class created
- [ ] Directory structure documented

## Technical Details
Create structure:
- src/main/java/com/battlearena/profile/
  - Application.java
  - controller/
  - service/
  - repository/
  - model/
  - dto/
- src/main/resources/
  - application.properties
- pom.xml

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.1.2: Add Maven dependencies
```
Title: Task-3.1.2: Add Maven dependencies

Description:
## Story
Related to #X (Story-3.1 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Add all necessary Maven dependencies to pom.xml.

## Acceptance Criteria
- [ ] Spring Boot starter web
- [ ] Spring Boot starter data MongoDB
- [ ] JWT validation library
- [ ] Validation dependencies
- [ ] Testing dependencies

## Technical Details
Add to pom.xml:
- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- JWT library for token validation
- spring-boot-starter-validation
- spring-boot-starter-test

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.1.3: Configure MongoDB connection
```
Title: Task-3.1.3: Configure MongoDB connection

Description:
## Story
Related to #X (Story-3.1 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Configure MongoDB connection in application.properties.

## Acceptance Criteria
- [ ] MongoDB connection string configured
- [ ] Database name set
- [ ] Connection pool configured
- [ ] Connection tested

## Technical Details
In application.properties:
- spring.data.mongodb.uri=${MONGODB_URI}
- spring.data.mongodb.database=battlearena
- Configure connection pool settings

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.1.4: Set up package structure
```
Title: Task-3.1.4: Set up package structure

Description:
## Story
Related to #X (Story-3.1 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create package structure following clean architecture principles.

## Acceptance Criteria
- [ ] Controller package created
- [ ] Service package created
- [ ] Repository package created
- [ ] Model package created
- [ ] DTO package created

## Technical Details
Create packages:
- com.battlearena.profile.controller
- com.battlearena.profile.service
- com.battlearena.profile.repository
- com.battlearena.profile.model
- com.battlearena.profile.dto

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.1.5: Create Application.java
```
Title: Task-3.1.5: Create Application.java

Description:
## Story
Related to #X (Story-3.1 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create the main Spring Boot application class.

## Acceptance Criteria
- [ ] Application.java created
- [ ] @SpringBootApplication annotation
- [ ] Application starts successfully

## Technical Details
Create:
- com.battlearena.profile.Application
- Add @SpringBootApplication
- Add main method
- Test application startup

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.1.6: Configure application.properties
```
Title: Task-3.1.6: Configure application.properties

Description:
## Story
Related to #X (Story-3.1 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Configure application.properties with all necessary settings.

## Acceptance Criteria
- [ ] Server port configured (8082)
- [ ] MongoDB connection configured
- [ ] Logging configuration
- [ ] CORS configuration

## Technical Details
Configure:
- server.port=8082
- spring.data.mongodb.uri
- Logging levels
- CORS allowed origins

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.1.7: Create health check endpoint
```
Title: Task-3.1.7: Create health check endpoint

Description:
## Story
Related to #X (Story-3.1 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create a basic health check endpoint to verify service is running.

## Acceptance Criteria
- [ ] GET /actuator/health endpoint
- [ ] Returns service status
- [ ] Endpoint accessible

## Technical Details
- Use Spring Boot Actuator
- Or create custom /health endpoint
- Return JSON: {"status": "UP", "service": "profile-service"}

## Labels
epic:profile, backend:profile, task, priority:medium

## Milestone
Phase 3: Profile Management
```

---

### Story-3.2: Implement view profile endpoint

#### Issue Template:
```
Title: Story-3.2: Implement view profile endpoint

Description:
## Epic
Related to #X (Epic-3 issue number)

## User Story
As a user, I want to view my profile so that I can see my statistics.

## Acceptance Criteria
- [ ] GET /api/profile/me endpoint
- [ ] Returns user profile with statistics
- [ ] JWT authentication required
- [ ] Profile data from MongoDB
- [ ] Unit tests with 80%+ coverage

## Technical Details

### Implementation Flow
Based on [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) sections 3-5:

**View Profile Flow:**
1. Client sends GET /api/profile/me with JWT token in Authorization header
2. JWT authentication filter validates token and extracts userId
3. ProfileController receives request with authenticated userId
4. ProfileController delegates to ProfileService.getProfileByUserId()
5. ProfileService checks Redis cache first (if implemented)
6. ProfileService retrieves profile from ProfileRepository (MongoDB)
7. ProfileService calculates win percentage and formats statistics
8. ProfileController returns ProfileResponse with all profile data

### Components to Create
- **Profile Model** - MongoDB entity with all profile fields
- **ProfileRepository** - Spring Data MongoDB repository with userId lookup
- **ProfileService** - Business logic for profile retrieval
- **ProfileController** - REST endpoint handler (Facade Pattern)
- **ProfileResponse DTO** - Response data transfer object
- **JWT Authentication Filter** - Token validation (reuse from Auth Service or create new)

### Design Patterns
- **Facade Pattern** - ProfileController provides simplified interface
- **Repository Pattern** - ProfileRepository abstracts data access
- **Proxy Pattern** - RedisCache provides caching proxy (optional)

## Related Documentation
- [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - Service design and profile retrieval (sections 3.1-3.2, 5.1-5.2)
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Profile Service overview (section 2.2)
- [Database Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Profiles collection schema (section 1.2)
- [Database Schema LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/DATABASE_SCHEMA.md) - Profile entity model and repository design (section 3.2)
- [Data Flow](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md) - Profile update and score update flows
- [Error Handling](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/ERROR_HANDLING.md) - Error handling patterns for profile operations

## Architecture Diagrams
- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png`
- **Database Schema Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Database%20Schema%20Class%20Diagram.png`

## Labels
epic:profile, backend:profile, feature, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.2.1: Create Profile model/entity
```
Title: Task-3.2.1: Create Profile model/entity

Description:
## Story
Related to #X (Story-3.2 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create Profile entity/model for MongoDB with all required fields.

## Acceptance Criteria
- [ ] Profile class created
- [ ] Fields: id, userId, username, displayName, avatar, globalScore, rankTier, wins, losses, matchesPlayed
- [ ] MongoDB annotations (@Document, @Id)
- [ ] Validation annotations
- [ ] Getters and setters

## Technical Details

### Profile Entity Structure
Based on [Database Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) and [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md):

**File:** `com.battlearena.profile.model.Profile`

```java
@Document(collection = "profiles")
public class Profile {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String userId; // Reference to Auth Service user ID
    
    private String username;
    private String displayName;
    private String avatar; // URL to avatar image
    
    @Indexed
    private Long globalScore = 0L; // Infinite, no level cap
    
    @Indexed
    private String rankTier; // Valorant-style rank (Iron, Bronze, etc.)
    
    private Integer wins = 0;
    private Integer losses = 0;
    private Integer matchesPlayed = 0;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Database Indexes
- **userId** - Unique index for fast lookups
- **globalScore** - Indexed for leaderboard queries
- **rankTier** - Indexed for filtering by rank

### Field Descriptions
- **globalScore** - Infinite score, no level cap, updated after each match
- **rankTier** - Calculated from globalScore using Valorant-style ranges
- **wins/losses/matchesPlayed** - Statistics tracked per match

## Related Documentation
- [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - Profile entity design (section 3.8)
- [Database Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Profiles collection schema (section 1.2)
- [Database Schema LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/DATABASE_SCHEMA.md) - Profile entity model, indexes, and validation (section 3.2)
- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png`

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.2.2: Create ProfileRepository
```
Title: Task-3.2.2: Create ProfileRepository

Description:
## Story
Related to #X (Story-3.2 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create Spring Data MongoDB repository interface for Profile.

## Acceptance Criteria
- [ ] ProfileRepository interface created
- [ ] Extends MongoRepository
- [ ] Custom query methods for userId lookup

## Technical Details

### ProfileRepository Implementation
Based on [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) section 3.3:

**File:** `com.battlearena.profile.repository.ProfileRepository`

**Interface:**
```java
@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {
    // Find profile by user ID (primary lookup method)
    Optional<Profile> findByUserId(String userId);
    
    // Find profile by username (for leaderboard lookups)
    Optional<Profile> findByUsername(String username);
    
    // Check if profile exists for user
    boolean existsByUserId(String userId);
    
    // Update global score atomically
    @Query("{ $inc: { globalScore: ?1 } }")
    void incrementGlobalScore(String userId, Long scoreDelta);
    
    // Increment wins
    void incrementWins(String userId);
    
    // Increment losses
    void incrementLosses(String userId);
}
```

**Spring Data MongoDB Features:**
- Automatic query method generation
- Custom queries for atomic updates
- Uses MongoDB indexes (userId, globalScore, rankTier) for performance

**Usage in Service:**
- Profile retrieval: Find by userId
- Score updates: Atomic increment operations
- Statistics updates: Increment wins/losses

## Related Documentation
- [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - ProfileRepository design (section 3.3, 5.3)
- [Repository Pattern](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - Pattern application (section 4.4)

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.2.3: Create ProfileService
```
Title: Task-3.2.3: Create ProfileService

Description:
## Story
Related to #X (Story-3.2 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create ProfileService with business logic for profile operations.

## Acceptance Criteria
- [ ] ProfileService class created
- [ ] getProfileByUserId method
- [ ] JWT token validation
- [ ] Profile data retrieval from MongoDB

## Technical Details
Create:
- com.battlearena.profile.service.ProfileService
- Methods:
  - Profile getProfileByUserId(String userId)
  - Validate JWT token
  - Retrieve profile from repository
  - Return profile with statistics

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.2.4: Create ProfileController
```
Title: Task-3.2.4: Create ProfileController

Description:
## Story
Related to #X (Story-3.2 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create REST controller with GET /api/profile/me endpoint.

## Acceptance Criteria
- [ ] ProfileController created
- [ ] GET /api/profile/me endpoint
- [ ] JWT authentication required
- [ ] Calls ProfileService
- [ ] Returns ProfileResponse

## Technical Details
Create:
- com.battlearena.profile.controller.ProfileController
- Endpoint: GET /api/profile/me
- Extract userId from JWT token
- Call ProfileService.getProfileByUserId
- Return ProfileResponse DTO

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.2.5: Implement JWT authentication
```
Title: Task-3.2.5: Implement JWT authentication

Description:
## Story
Related to #X (Story-3.2 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Implement JWT token validation for protected endpoints.

## Acceptance Criteria
- [ ] JWT validation filter/interceptor
- [ ] Token extraction from Authorization header
- [ ] Token validation
- [ ] User ID extraction from token

## Technical Details
- Use JWT validation filter (similar to Auth Service)
- Extract token from "Authorization: Bearer <token>"
- Validate token
- Extract userId from token claims
- Pass userId to service layer

## Labels
epic:profile, backend:profile, security, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.2.6: Create ProfileResponse DTO
```
Title: Task-3.2.6: Create ProfileResponse DTO

Description:
## Story
Related to #X (Story-3.2 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create Data Transfer Object for profile response.

## Acceptance Criteria
- [ ] ProfileResponse DTO created
- [ ] All profile fields included
- [ ] Statistics included
- [ ] Rank tier included

## Technical Details
Create:
- com.battlearena.profile.dto.ProfileResponse
  - String id
  - String username
  - String displayName
  - String avatar
  - Long globalScore
  - String rankTier
  - Integer wins
  - Integer losses
  - Integer matchesPlayed
  - Double winPercentage

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.2.7: Write unit tests for ProfileService
```
Title: Task-3.2.7: Write unit tests for ProfileService

Description:
## Story
Related to #X (Story-3.2 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Write comprehensive unit tests for ProfileService.

## Acceptance Criteria
- [ ] Test getProfileByUserId success
- [ ] Test profile not found
- [ ] Test invalid userId
- [ ] 80%+ code coverage

## Technical Details
Create:
- ProfileServiceTest class
- Mock ProfileRepository
- Test cases:
  - getProfileByUserId_success
  - getProfileByUserId_notFound
  - getProfileByUserId_invalidUserId

## Labels
epic:profile, backend:profile, testing, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.2.8: Write integration tests for endpoint
```
Title: Task-3.2.8: Write integration tests for endpoint

Description:
## Story
Related to #X (Story-3.2 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Write integration tests for GET /api/profile/me endpoint.

## Acceptance Criteria
- [ ] Test successful profile retrieval
- [ ] Test with valid JWT token
- [ ] Test with invalid JWT token
- [ ] Test with missing token

## Technical Details
Create:
- ProfileControllerIntegrationTest
- Use @SpringBootTest
- Use TestRestTemplate
- Test HTTP requests/responses
- Use embedded MongoDB for testing

## Labels
epic:profile, backend:profile, testing, priority:high

## Milestone
Phase 3: Profile Management
```

---

### Story-3.3: Implement update profile endpoint

#### Issue Template:
```
Title: Story-3.3: Implement update profile endpoint

Description:
## Epic
Related to #X (Epic-3 issue number)

## User Story
As a user, I want to update my profile so that I can customize my display name and avatar.

## Acceptance Criteria
- [ ] PUT /api/profile/me endpoint
- [ ] Update display name
- [ ] Update avatar (URL or file upload)
- [ ] Validation on input
- [ ] Profile updated in MongoDB
- [ ] Unit tests with 80%+ coverage

## Technical Details
- Create UpdateProfileRequest DTO
- Implement update logic in ProfileService
- Create PUT endpoint in ProfileController
- Add input validation
- Handle avatar upload (if file upload)

## Subtasks
- [ ] Create UpdateProfileRequest DTO (Task-3.3.1)
- [ ] Implement update logic in ProfileService (Task-3.3.2)
- [ ] Create PUT endpoint in ProfileController (Task-3.3.3)
- [ ] Add input validation (Task-3.3.4)
- [ ] Handle avatar upload (if file upload) (Task-3.3.5)
- [ ] Write tests for update endpoint (Task-3.3.6)
- [ ] Update API documentation (Task-3.3.7)

## Labels
epic:profile, backend:profile, feature, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.3.1: Create UpdateProfileRequest DTO
```
Title: Task-3.3.1: Create UpdateProfileRequest DTO

Description:
## Story
Related to #X (Story-3.3 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create Data Transfer Object for profile update request.

## Acceptance Criteria
- [ ] UpdateProfileRequest DTO created
- [ ] Fields: displayName, avatar
- [ ] Validation annotations
- [ ] Optional fields support

## Technical Details
Create:
- com.battlearena.profile.dto.UpdateProfileRequest
  - String displayName (optional, @Size)
  - String avatar (optional, URL validation)

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.3.2: Implement update logic in ProfileService
```
Title: Task-3.3.2: Implement update logic in ProfileService

Description:
## Story
Related to #X (Story-3.3 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Implement updateProfile method in ProfileService.

## Acceptance Criteria
- [ ] updateProfile method created
- [ ] Profile lookup by userId
- [ ] Update fields if provided
- [ ] Save updated profile
- [ ] Return updated profile

## Technical Details
Create method:
- Profile updateProfile(String userId, UpdateProfileRequest request)
- Find profile by userId
- Update displayName if provided
- Update avatar if provided
- Save to MongoDB
- Return updated profile

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.3.3: Create PUT endpoint in ProfileController
```
Title: Task-3.3.3: Create PUT endpoint in ProfileController

Description:
## Story
Related to #X (Story-3.3 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create PUT /api/profile/me endpoint in ProfileController.

## Acceptance Criteria
- [ ] PUT /api/profile/me endpoint
- [ ] Accepts UpdateProfileRequest
- [ ] JWT authentication required
- [ ] Calls ProfileService.updateProfile
- [ ] Returns updated ProfileResponse

## Technical Details
Create endpoint:
- PUT /api/profile/me
- Extract userId from JWT token
- Accept UpdateProfileRequest
- Call ProfileService.updateProfile
- Return ProfileResponse

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.3.4: Add input validation
```
Title: Task-3.3.4: Add input validation

Description:
## Story
Related to #X (Story-3.3 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Add input validation for update profile request.

## Acceptance Criteria
- [ ] Display name validation (length, characters)
- [ ] Avatar URL validation
- [ ] Validation error messages
- [ ] Proper error responses

## Technical Details
- Add @Valid annotation
- Add validation annotations to DTO
- Handle validation errors
- Return appropriate error responses

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.3.5: Handle avatar upload (if file upload)
```
Title: Task-3.3.5: Handle avatar upload (if file upload)

Description:
## Story
Related to #X (Story-3.3 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Implement avatar file upload functionality if file upload is chosen over URL-based avatars. This is optional and depends on the chosen implementation approach.

## Acceptance Criteria
- [ ] File upload endpoint created (if implementing file upload)
- [ ] File validation (type, size)
- [ ] File storage configured (local or cloud storage)
- [ ] Avatar URL returned after upload
- [ ] File upload security implemented

## Technical Details

### Implementation Options

**Option 1: URL-based (Simpler)**
- User provides avatar URL
- No file upload needed
- Validate URL format
- Store URL in profile

**Option 2: File Upload (More Complex)**
- Accept image file (JPEG, PNG)
- Validate file type and size
- Store file (local filesystem or cloud storage like S3)
- Generate and store file URL
- Return URL to client

### File Upload Implementation (if chosen)
- Create FileUploadService
- Configure file storage location
- Implement file validation
- Implement file upload endpoint
- Handle file deletion on update

### Security Considerations
- Validate file type (only images)
- Limit file size (e.g., 5MB max)
- Sanitize file names
- Store files outside web root (if local)
- Use cloud storage for production (recommended)

## Related Documentation
- [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - Profile update flow
- [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - File upload security

## Labels
epic:profile, backend:profile, feature, task, priority:medium

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.3.6: Write tests for update endpoint
```
Title: Task-3.3.6: Write tests for update endpoint

Description:
## Story
Related to #X (Story-3.3 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Write unit and integration tests for update profile endpoint.

## Acceptance Criteria
- [ ] Test successful update
- [ ] Test partial update
- [ ] Test validation errors
- [ ] Test unauthorized access
- [ ] 80%+ code coverage

## Technical Details
Create:
- ProfileServiceTest.updateProfile_success
- ProfileServiceTest.updateProfile_partial
- ProfileControllerIntegrationTest.updateProfile_success
- ProfileControllerIntegrationTest.updateProfile_validationError

## Labels
epic:profile, backend:profile, testing, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.3.7: Update API documentation
```
Title: Task-3.3.7: Update API documentation

Description:
## Story
Related to #X (Story-3.3 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Update API documentation (Swagger/OpenAPI) with the update profile endpoint details.

## Acceptance Criteria
- [ ] PUT /api/profile/me endpoint documented
- [ ] Request body schema documented
- [ ] Response schema documented
- [ ] Error responses documented
- [ ] Authentication requirements documented

## Technical Details

### API Documentation Updates
- Add PUT /api/profile/me endpoint
- Document UpdateProfileRequest schema
- Document ProfileResponse schema
- Document error responses (400, 401, 404, 500)
- Add example requests and responses

### Swagger/OpenAPI Annotations
- @Operation annotation for endpoint
- @ApiResponse for success and error cases
- @Schema for request/response models

## Related Documentation
- [Profile Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - API design
- SpringDoc OpenAPI documentation

## Labels
epic:profile, backend:profile, documentation, task, priority:medium

## Milestone
Phase 3: Profile Management
```

---

### Story-3.4: Implement global score tracking system

#### Issue Template:
```
Title: Story-3.4: Implement global score tracking system

Description:
## Epic
Related to #X (Epic-3 issue number)

## User Story
As a user, I want to see my XP and level so that I can track my progression.

## Acceptance Criteria
- [ ] Global score stored (infinite, no level cap)
- [ ] Score updates after matches
- [ ] Score displayed in profile
- [ ] Score history tracked (optional)

## Technical Details
- Add globalScore field to Profile model
- Create score update method
- Implement score calculation logic
- Create score update endpoint (or internal service call)
- Add score to profile response

## Labels
epic:profile, backend:profile, feature, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.4.1: Add globalScore field to Profile model
```
Title: Task-3.4.1: Add globalScore field to Profile model

Description:
## Story
Related to #X (Story-3.4 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Add globalScore field to Profile entity.

## Acceptance Criteria
- [ ] globalScore field added
- [ ] Type: Long (infinite, no cap)
- [ ] Default value: 0
- [ ] Indexed for leaderboard queries

## Technical Details
Add to Profile model:
- Long globalScore = 0L
- Add @Indexed annotation for performance
- Update database migration if needed

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.4.2: Create score update method
```
Title: Task-3.4.2: Create score update method

Description:
## Story
Related to #X (Story-3.4 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create method to update global score in ProfileService.

## Acceptance Criteria
- [ ] updateGlobalScore method created
- [ ] Accepts userId and score delta
- [ ] Updates score atomically
- [ ] Returns updated score

## Technical Details
Create method:
- Long updateGlobalScore(String userId, Long scoreDelta)
- Find profile by userId
- Update globalScore atomically (increment)
- Save to MongoDB
- Return new globalScore

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.4.3: Implement score calculation logic
```
Title: Task-3.4.3: Implement score calculation logic

Description:
## Story
Related to #X (Story-3.4 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Implement logic to calculate score updates from match results.

## Acceptance Criteria
- [ ] Score calculation based on match result
- [ ] Win/loss score differences
- [ ] Score can be negative (for losses)
- [ ] Score formula documented

## Technical Details
Implement:
- Calculate score delta from match result
- Win: positive score
- Loss: negative score (smaller)
- Draw: minimal score change
- Formula: to be determined during implementation

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.4.4: Create score update endpoint (or internal service call)
```
Title: Task-3.4.4: Create score update endpoint (or internal service call)

Description:
## Story
Related to #X (Story-3.4 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create endpoint or internal service method to update score after matches.

## Acceptance Criteria
- [ ] Score update method accessible
- [ ] Can be called from Game Engine Service
- [ ] Atomic update operation
- [ ] Error handling

## Technical Details
Create:
- Internal service method: updateScoreAfterMatch(String userId, Long scoreDelta)
- Or REST endpoint: POST /api/profile/score/update (internal only)
- Ensure atomic updates
- Handle errors gracefully

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.4.5: Add score to profile response
```
Title: Task-3.4.5: Add score to profile response

Description:
## Story
Related to #X (Story-3.4 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Include globalScore in ProfileResponse DTO.

## Acceptance Criteria
- [ ] globalScore included in ProfileResponse
- [ ] Score displayed correctly
- [ ] Score formatting (if needed)

## Technical Details
Update ProfileResponse:
- Add Long globalScore field
- Ensure score is included in all profile responses
- Format score for display (optional)

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.4.6: Write tests for score tracking
```
Title: Task-3.4.6: Write tests for score tracking

Description:
## Story
Related to #X (Story-3.4 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Write tests for global score tracking functionality.

## Acceptance Criteria
- [ ] Test score update
- [ ] Test score increment
- [ ] Test score decrement
- [ ] Test atomic updates
- [ ] 80%+ code coverage

## Technical Details
Create:
- ProfileServiceTest.updateGlobalScore_success
- ProfileServiceTest.updateGlobalScore_increment
- ProfileServiceTest.updateGlobalScore_decrement
- Test atomicity

## Labels
epic:profile, backend:profile, testing, priority:high

## Milestone
Phase 3: Profile Management
```

---

### Story-3.5: Implement rank tier calculation (Valorant-style)

#### Issue Template:
```
Title: Story-3.5: Implement rank tier calculation (Valorant-style)

Description:
## Epic
Related to #X (Epic-3 issue number)

## Description
Calculate and display rank tiers based on global score ranges (like Valorant ranking system).

## Acceptance Criteria
- [ ] Rank tiers defined (Iron, Bronze, Silver, Gold, Platinum, Diamond, etc.)
- [ ] Score ranges for each tier
- [ ] Rank calculation based on score
- [ ] Rank displayed in profile
- [ ] Rank change tracking

## Technical Details
- Define rank tier structure
- Create RankTier enum/class
- Define score ranges for each tier
- Implement rank calculation logic
- Add rankTier field to Profile
- Create rank update method

## Labels
epic:profile, backend:profile, feature, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.5.1: Define rank tier structure
```
Title: Task-3.5.1: Define rank tier structure

Description:
## Story
Related to #X (Story-3.5 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Define rank tier structure with tiers and score ranges.

## Acceptance Criteria
- [ ] Rank tiers defined
- [ ] Score ranges for each tier
- [ ] Tier order defined
- [ ] Structure documented

## Technical Details
Define tiers:
- Iron: 0-100
- Bronze: 101-500
- Silver: 501-1000
- Gold: 1001-2000
- Platinum: 2001-3500
- Diamond: 3501-5000
- Master: 5001-7500
- Grandmaster: 7501+
(Adjust ranges as needed)

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.5.2: Create RankTier enum/class
```
Title: Task-3.5.2: Create RankTier enum/class

Description:
## Story
Related to #X (Story-3.5 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create RankTier enum or class to represent rank tiers.

## Acceptance Criteria
- [ ] RankTier enum/class created
- [ ] All tiers included
- [ ] Score range methods
- [ ] Tier comparison methods

## Technical Details
Create:
- com.battlearena.profile.model.RankTier (enum)
- Values: IRON, BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, MASTER, GRANDMASTER
- Methods:
  - getMinScore()
  - getMaxScore()
  - fromScore(Long score)

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.5.3: Implement rank calculation logic
```
Title: Task-3.5.3: Implement rank calculation logic

Description:
## Story
Related to #X (Story-3.5 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Implement logic to calculate rank tier from global score.

## Acceptance Criteria
- [ ] calculateRankTier method created
- [ ] Takes globalScore as input
- [ ] Returns RankTier
- [ ] Handles all score ranges

## Technical Details
Create method:
- RankTier calculateRankTier(Long globalScore)
- Iterate through tiers
- Find tier matching score range
- Return appropriate RankTier

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.5.4: Add rankTier field to Profile
```
Title: Task-3.5.4: Add rankTier field to Profile

Description:
## Story
Related to #X (Story-3.5 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Add rankTier field to Profile model.

## Acceptance Criteria
- [ ] rankTier field added
- [ ] Type: String or RankTier enum
- [ ] Auto-calculated on score update
- [ ] Indexed for queries

## Technical Details
Add to Profile model:
- String rankTier (or RankTier enum)
- Auto-calculate when score updates
- Add @Indexed for leaderboard queries

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.5.5: Create rank update method
```
Title: Task-3.5.5: Create rank update method

Description:
## Story
Related to #X (Story-3.5 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create method to update rank tier when score changes.

## Acceptance Criteria
- [ ] updateRankTier method created
- [ ] Called after score update
- [ ] Calculates new rank
- [ ] Updates profile
- [ ] Tracks rank changes

## Technical Details
Create method:
- void updateRankTier(String userId)
- Get current profile
- Calculate new rank from score
- Update rankTier if changed
- Save profile
- Track rank change (optional)

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.5.6: Add rank to profile response
```
Title: Task-3.5.6: Add rank to profile response

Description:
## Story
Related to #X (Story-3.5 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Include rankTier in ProfileResponse DTO.

## Acceptance Criteria
- [ ] rankTier included in ProfileResponse
- [ ] Rank displayed correctly
- [ ] Rank formatting (if needed)

## Technical Details
Update ProfileResponse:
- Add String rankTier field
- Ensure rank is included in all profile responses
- Format rank for display (optional)

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.5.7: Write tests for rank calculation
```
Title: Task-3.5.7: Write tests for rank calculation

Description:
## Story
Related to #X (Story-3.5 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Write tests for rank tier calculation logic.

## Acceptance Criteria
- [ ] Test rank calculation for each tier
- [ ] Test boundary values
- [ ] Test rank updates
- [ ] 80%+ code coverage

## Technical Details
Create:
- RankTierTest.calculateRankTier_iron
- RankTierTest.calculateRankTier_bronze
- RankTierTest.calculateRankTier_boundaryValues
- ProfileServiceTest.updateRankTier_success

## Labels
epic:profile, backend:profile, testing, priority:high

## Milestone
Phase 3: Profile Management
```

---

### Story-3.6: Implement win/loss statistics tracking

#### Issue Template:
```
Title: Story-3.6: Implement win/loss statistics tracking

Description:
## Epic
Related to #X (Epic-3 issue number)

## User Story
As a user, I want to see my win/loss statistics so that I can track my performance.

## Acceptance Criteria
- [ ] Wins tracked
- [ ] Losses tracked
- [ ] Matches played tracked
- [ ] Win percentage calculated
- [ ] Statistics displayed in profile
- [ ] Unit tests with 80%+ coverage

## Technical Details
- Add statistics fields to Profile (wins, losses, matchesPlayed)
- Create update statistics method
- Implement win/loss tracking
- Calculate win percentage
- Add statistics to profile response

## Labels
epic:profile, backend:profile, feature, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.6.1: Add statistics fields to Profile
```
Title: Task-3.6.1: Add statistics fields to Profile

Description:
## Story
Related to #X (Story-3.6 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Add statistics fields (wins, losses, matchesPlayed) to Profile model.

## Acceptance Criteria
- [ ] wins field added (Integer, default 0)
- [ ] losses field added (Integer, default 0)
- [ ] matchesPlayed field added (Integer, default 0)
- [ ] Fields initialized to 0

## Technical Details
Add to Profile model:
- Integer wins = 0
- Integer losses = 0
- Integer matchesPlayed = 0
- Initialize all to 0

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.6.2: Create update statistics method
```
Title: Task-3.6.2: Create update statistics method

Description:
## Story
Related to #X (Story-3.6 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Create method to update statistics after match completion.

## Acceptance Criteria
- [ ] updateStatistics method created
- [ ] Accepts userId and match result
- [ ] Updates wins/losses/matchesPlayed
- [ ] Atomic update operation

## Technical Details
Create method:
- void updateStatistics(String userId, MatchResult result)
- Find profile by userId
- Increment matchesPlayed
- Increment wins if won, losses if lost
- Save to MongoDB atomically

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.6.3: Implement win/loss tracking
```
Title: Task-3.6.3: Implement win/loss tracking

Description:
## Story
Related to #X (Story-3.6 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Implement logic to track wins and losses from match results.

## Acceptance Criteria
- [ ] Win tracking implemented
- [ ] Loss tracking implemented
- [ ] Draw handling (if applicable)
- [ ] Statistics updated correctly

## Technical Details
Implement:
- Track win: increment wins
- Track loss: increment losses
- Track draw: increment matchesPlayed only (or handle as needed)
- Ensure atomic updates

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.6.4: Calculate win percentage
```
Title: Task-3.6.4: Calculate win percentage

Description:
## Story
Related to #X (Story-3.6 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Implement logic to calculate win percentage.

## Acceptance Criteria
- [ ] calculateWinPercentage method created
- [ ] Formula: (wins / matchesPlayed) * 100
- [ ] Handles division by zero
- [ ] Returns percentage as double

## Technical Details
Create method:
- Double calculateWinPercentage(Integer wins, Integer matchesPlayed)
- Formula: matchesPlayed > 0 ? (wins * 100.0 / matchesPlayed) : 0.0
- Handle division by zero
- Round to 2 decimal places (optional)

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.6.5: Add statistics to profile response
```
Title: Task-3.6.5: Add statistics to profile response

Description:
## Story
Related to #X (Story-3.6 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Include statistics in ProfileResponse DTO.

## Acceptance Criteria
- [ ] Statistics included in ProfileResponse
- [ ] wins, losses, matchesPlayed included
- [ ] winPercentage calculated and included
- [ ] Statistics displayed correctly

## Technical Details
Update ProfileResponse:
- Add Integer wins
- Add Integer losses
- Add Integer matchesPlayed
- Add Double winPercentage
- Calculate winPercentage when building response

## Labels
epic:profile, backend:profile, task, priority:high

## Milestone
Phase 3: Profile Management
```

#### Subtask: Task-3.6.6: Write tests for statistics tracking
```
Title: Task-3.6.6: Write tests for statistics tracking

Description:
## Story
Related to #X (Story-3.6 issue number)

## Epic
Related to #X (Epic-3 issue number)

## Description
Write tests for win/loss statistics tracking.

## Acceptance Criteria
- [ ] Test win tracking
- [ ] Test loss tracking
- [ ] Test win percentage calculation
- [ ] Test division by zero
- [ ] 80%+ code coverage

## Technical Details
Create:
- ProfileServiceTest.updateStatistics_win
- ProfileServiceTest.updateStatistics_loss
- ProfileServiceTest.calculateWinPercentage_success
- ProfileServiceTest.calculateWinPercentage_zeroMatches

## Labels
epic:profile, backend:profile, testing, priority:high

## Milestone
Phase 3: Profile Management
```

---

## 📝 Usage Instructions

1. **Create Epic Issue:** Copy the Epic template and create issue (e.g., #X)
2. **Create Story Issues:** Copy story templates, replace `#X` with Epic issue number, replace `#X` with story issue numbers
3. **Create Subtask Issues:** Copy subtask templates, replace `#X` with Story issue number, replace `#X` with Epic issue number
4. **Create Branches:** Use format `feature/#X-story-or-subtask-title` where X is the issue number
5. **Link in Commits:** Use `Related to #X` or `Closes #X` in commit messages
6. **Link in PRs:** Use `Closes #X` and `Related to #X` in PR descriptions

