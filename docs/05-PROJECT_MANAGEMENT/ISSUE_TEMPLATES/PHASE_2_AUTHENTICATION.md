# Phase 2: Authentication & User Management

**Copy and paste these templates directly into GitHub Issues.**

---

## EPIC-2: Authentication & User Management

### Issue Template:

```
Title: EPIC-2: Authentication & User Management

Description:
## Overview
Implement complete authentication and user management system using Spring Boot with JWT tokens. This epic establishes the foundation for user authentication across all services, following clean architecture principles and design patterns (Facade, Strategy, Repository, Singleton). The Auth Service (Port 8081) handles user registration, authentication, JWT token generation/validation, and password security using BCrypt hashing.

## Goals
- User registration with username and email validation
- User login with credential verification
- Google OAuth login support (optional, Story-2.7)
- JWT token generation (HS512 algorithm, 24-hour expiration)
- Secure password hashing (BCrypt with 12 rounds)
- JWT token validation middleware for protected endpoints
- Session management and logout functionality
- API documentation with Swagger/OpenAPI

## Success Criteria
- [ ] Users can register with username, email, and password
- [ ] Users can login and receive JWT tokens
- [ ] JWT tokens generated with proper claims (username, expiration)
- [ ] Passwords securely hashed with BCrypt (12 rounds, never stored in plain text)
- [ ] JWT authentication filter working for protected endpoints
- [ ] Token validation working across services
- [ ] API documentation accessible via Swagger UI
- [ ] Unit tests with 80%+ code coverage
- [ ] Integration tests for all endpoints
- [ ] MongoDB Users collection properly indexed

## Technical Architecture

### Service Details
Based on [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) section 2.1:
- **Technology:** Spring Boot 3.x (Java 17)
- **Port:** 8081 (internal, accessed via Nginx API Gateway)
- **Database:** MongoDB (Users collection)
- **Communication:** REST API (HTTP/HTTPS)
- **Security:** JWT (HS512), BCrypt password hashing

### Key Components
Based on [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md):
- **AuthController** - REST API endpoint handler (Facade Pattern)
- **AuthService** - Business logic for authentication (Strategy Pattern)
- **UserRepository** - Data access layer (Repository Pattern)
- **JwtTokenManager** - JWT token management (Singleton Pattern)
- **PasswordEncoder** - Password hashing (Strategy Pattern)

### Design Patterns Applied
- **Facade Pattern** - AuthController provides simplified interface
- **Strategy Pattern** - Authentication strategies, password encoding strategies
- **Repository Pattern** - UserRepository abstracts data access
- **Singleton Pattern** - JwtTokenManager single instance

### Security Requirements
Based on [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md):
- **JWT Algorithm:** HS512 (HMAC with SHA-512)
- **Token Expiration:** 24 hours for access token
- **Password Hashing:** BCrypt with 12 rounds (high cost factor)
- **Token Storage:** HTTP-only cookies (preferred) or secure localStorage
- **Secret Key:** Strong, randomly generated, stored in environment variables

## Related Documentation
- [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - Complete service design, components, and patterns
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Auth Service overview (section 2.1)
- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - JWT authentication, OAuth authentication, and password security (sections 1.1-1.4, 2.1)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Backend service structure (section 2.1)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Users collection schema with OAuth support (section 1.1)
- [Data Flow](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md) - Authentication flows including Google OAuth (sections 1.1-1.4)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) - REST API endpoints including OAuth (section 1.3)
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Critical design principles (REUSABILITY, SOLID, DRY, Clean Code, Secure Programming)

## Architecture Diagrams
- **Auth Service Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Auth%20Service.png`
- **Authentication Flow Sequence Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Authentication%20Flow.png` (includes Google OAuth flow)
- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png` (includes OAuth fields)
- **Database Schema Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Database%20Schema%20Class%20Diagram.png` (includes OAuth fields)

## Labels
epic:auth, backend:auth, priority:high

## Milestone
Phase 2: Authentication
```

---

### STORY-2-1: Auth Service - Spring Boot Setup

#### Issue Template:

```
Title: STORY-2-1: Auth Service - Spring Boot Setup

Description:
## Epic
Related to #X (EPIC-2 issue number)

## Description
Initialize Spring Boot project for Auth Service with all necessary dependencies and configurations following clean architecture principles. Set up the complete project structure with proper package organization, MongoDB connection, Spring Security configuration, and API documentation tools.

## Acceptance Criteria
- [ ] Spring Boot 3.x project created (Java 17)
- [ ] Maven dependencies configured (Spring Security, MongoDB, JWT, Validation, Swagger)
- [ ] Application properties configured (port 8081, MongoDB URI, JWT secret/expiration, CORS)
- [ ] Package structure follows clean architecture (controller, service, repository, model, dto, config, security)
- [ ] Application.java main class created
- [ ] Health check endpoint working (/health)
- [ ] Swagger/OpenAPI configured and accessible

## Technical Details

### Spring Boot Project Structure
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.1 and [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md):

**Package Structure:**
```

src/main/java/com/battlearena/auth/

- Application.java
- controller/
  - AuthController.java
- service/
  - AuthService.java
  - UserService.java
- repository/
  - UserRepository.java
- model/
  - User.java
- dto/
  - RegisterRequest.java
  - RegisterResponse.java
  - LoginRequest.java
  - LoginResponse.java
- config/
  - SecurityConfig.java
  - SwaggerConfig.java
- security/
  - JwtTokenManager.java
  - JwtAuthenticationFilter.java
  - PasswordEncoder.java
- exception/
  - GlobalExceptionHandler.java

````

### Required Dependencies (pom.xml)
- `spring-boot-starter-web` - REST API support
- `spring-boot-starter-security` - Security framework
- `spring-boot-starter-data-mongodb` - MongoDB integration
- `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` - JWT library
- `spring-boot-starter-validation` - Input validation
- `springdoc-openapi-starter-webmvc-ui` - Swagger/OpenAPI documentation
- `spring-boot-starter-test` - Testing framework

### Application Properties Configuration
**File:** `src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8081
spring.application.name=auth-service

# MongoDB Configuration
spring.data.mongodb.uri=${MONGODB_URI:mongodb://mongodb:27017/battlearena}
spring.data.mongodb.database=battlearena

# JWT Configuration
jwt.secret=${JWT_SECRET:your-secret-key-change-in-production}
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=*

# Logging
logging.level.com.battlearena.auth=INFO
````

### Design Principles

Follow [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md):

- **Clean Architecture** - Strict separation of concerns (controller → service → repository)
- **SOLID Principles** - Single responsibility, dependency inversion
- **DRY** - Reusable components (JWT utilities, exception handlers)
- **Secure Programming** - Security-first approach, input validation

## Related Documentation

- [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - Service design and component structure (sections 1-3)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Spring Boot service structure (section 2.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Auth Service overview (section 2.1)

## Labels

epic:auth, backend:auth, feature, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-1-1: Create Spring Boot project structure
```

Title: TASK-2-1-1: Create Spring Boot project structure

Description:

## Story

Related to #X (STORY-2-1 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create the Spring Boot project structure for Auth Service following clean architecture.

## Acceptance Criteria

- [ ] Maven project structure created
- [ ] Package structure follows clean architecture
- [ ] Main Application class created
- [ ] Directory structure documented

## Technical Details

### Project Structure

Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 2.1 and [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md):

Create structure:

```
src/main/java/com/battlearena/auth/
  - Application.java
  - config/
  - controller/
  - service/
  - repository/
  - model/
  - dto/
  - security/
  - exception/
src/main/resources/
  - application.properties
pom.xml
```

### Package Organization

- **controller/** - REST API endpoints (AuthController)
- **service/** - Business logic (AuthService, UserService)
- **repository/** - Data access layer (UserRepository)
- **model/** - Entity classes (User)
- **dto/** - Data Transfer Objects (Request/Response DTOs)
- **config/** - Configuration classes (SecurityConfig, SwaggerConfig)
- **security/** - Security components (JwtTokenManager, JwtAuthenticationFilter)
- **exception/** - Exception handlers (GlobalExceptionHandler)

### Design Principles

Follow [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md):

- **Separation of Concerns** - Each package has a single, clear purpose
- **Clean Architecture** - Dependencies flow inward (controller → service → repository)
- **Reusability** - Security components designed for reuse across services

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-1-2: Add Maven dependencies
```

Title: TASK-2-1-2: Add Maven dependencies

Description:

## Story

Related to #X (STORY-2-1 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Add all necessary Maven dependencies to pom.xml.

## Acceptance Criteria

- [ ] Spring Boot starter web
- [ ] Spring Boot starter security
- [ ] Spring Boot starter data MongoDB
- [ ] JWT library (io.jsonwebtoken)
- [ ] Validation dependencies
- [ ] Lombok (optional)
- [ ] Testing dependencies

## Technical Details

Add to pom.xml:

- spring-boot-starter-web
- spring-boot-starter-security
- spring-boot-starter-data-mongodb
- io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson
- spring-boot-starter-validation
- lombok (optional)
- spring-boot-starter-test

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-1-3: Configure application.properties
```

Title: TASK-2-1-3: Configure application.properties

Description:

## Story

Related to #X (STORY-2-1 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Configure application.properties with all necessary settings.

## Acceptance Criteria

- [ ] Server port configured (8081)
- [ ] MongoDB connection string
- [ ] JWT secret and expiration
- [ ] CORS configuration
- [ ] Logging configuration

## Technical Details

Configure:

- server.port=8081
- spring.data.mongodb.uri
- jwt.secret
- jwt.expiration
- CORS allowed origins
- Logging levels

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-1-4: Set up package structure
```

Title: TASK-2-1-4: Set up package structure

Description:

## Story

Related to #X (STORY-2-1 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create package structure following clean architecture principles.

## Acceptance Criteria

- [ ] Controller package created
- [ ] Service package created
- [ ] Repository package created
- [ ] Model package created
- [ ] DTO package created
- [ ] Config package created
- [ ] Security package created

## Technical Details

Create packages:

- com.battlearena.auth.controller
- com.battlearena.auth.service
- com.battlearena.auth.repository
- com.battlearena.auth.model
- com.battlearena.auth.dto
- com.battlearena.auth.config
- com.battlearena.auth.security

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-1-5: Create Application.java main class
```

Title: TASK-2-1-5: Create Application.java main class

Description:

## Story

Related to #X (STORY-2-1 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create the main Spring Boot application class.

## Acceptance Criteria

- [ ] Application.java created
- [ ] @SpringBootApplication annotation
- [ ] Application starts successfully
- [ ] Health check works

## Technical Details

Create:

- com.battlearena.auth.Application
- Add @SpringBootApplication
- Add main method
- Test application startup

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-1-6: Create health check endpoint
```

Title: TASK-2-1-6: Create health check endpoint

Description:

## Story

Related to #X (STORY-2-1 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create a health check endpoint for the Auth Service to verify service availability.

## Acceptance Criteria

- [ ] Health check endpoint created (/health)
- [ ] Endpoint returns service status
- [ ] Endpoint accessible without authentication

## Technical Details

- Create HealthController with /health endpoint
- Return JSON response with status: "UP"
- Endpoint should be public (no authentication required)

## Labels

epic:auth, backend:auth, task, priority:low

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-1-7: Configure API documentation (Swagger/OpenAPI)
```

Title: TASK-2-1-7: Configure API documentation (Swagger/OpenAPI)

Description:

## Story

Related to #X (STORY-2-1 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Configure Swagger/OpenAPI for REST API documentation in Auth Service. Set up SpringDoc OpenAPI for automatic API documentation generation and Swagger UI for interactive API exploration. This enables API documentation from the first service implementation.

## Acceptance Criteria

- [ ] SpringDoc OpenAPI dependency added to pom.xml
- [ ] SpringDoc OpenAPI configured in application.properties
- [ ] Swagger UI accessible at /swagger-ui.html
- [ ] OpenAPI specification available at /api-docs
- [ ] API documentation standards documented

## Technical Details

### Dependencies (pom.xml)

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.0.0</version>
</dependency>
```

### Configuration (application.properties)

```properties
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
```

### Endpoints

- `/api-docs` - OpenAPI JSON specification
- `/swagger-ui.html` - Swagger UI interface

### API Documentation Standards

- Use `@Operation` annotation for endpoint descriptions
- Use `@ApiResponse` for response documentation
- Use `@Parameter` for parameter descriptions
- Include request/response examples
- Document authentication requirements
- Document error responses

### Example Usage

```java
@Operation(summary = "Register a new user", description = "Creates a new user account")
@ApiResponses(value = {
    @ApiResponse(responseCode = "201", description = "User created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input"),
    @ApiResponse(responseCode = "409", description = "User already exists")
})
@PostMapping("/register")
public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
    // Implementation
}
```

## Related Documentation

- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - REST API endpoints (section 2.1)
- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - Service design

## Labels

epic:auth, backend:auth, documentation, task, priority:medium

## Milestone

Phase 2: Authentication

```

---

### STORY-2-2: Implement user registration endpoint

#### Issue Template:
```

Title: STORY-2-2: Implement user registration endpoint

Description:

## Epic

Related to #X (EPIC-2 issue number)

## User Story

As a user, I want to register with username and email so that I can create an account.

## Acceptance Criteria

- [ ] POST /api/auth/register endpoint created
- [ ] Username and email validation
- [ ] Duplicate username/email check
- [ ] Password hashing with BCrypt (12 rounds)
- [ ] User saved to MongoDB
- [ ] Success response returned
- [ ] Unit tests with 80%+ coverage

## Technical Details

### Implementation Flow

Based on [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) sections 3-5:

**Registration Flow:**

1. Client sends POST /api/auth/register with RegisterRequest (username, email, password)
2. AuthController validates request using @Valid
3. AuthController delegates to AuthService.register()
4. AuthService validates input, checks duplicates via UserRepository
5. AuthService hashes password using PasswordEncoder (BCrypt, 12 rounds)
6. AuthService saves user via UserRepository to MongoDB
7. AuthController returns RegisterResponse with user details

### Components to Create

- **User Model** - MongoDB entity with validation annotations
- **UserRepository** - Spring Data MongoDB repository with custom query methods
- **AuthService** - Business logic for registration (duplicate check, password hashing)
- **AuthController** - REST endpoint handler (Facade Pattern)
- **RegisterRequest/RegisterResponse DTOs** - Request/response data transfer objects
- **PasswordEncoder** - BCrypt password hashing (12 rounds)

### Design Patterns

- **Facade Pattern** - AuthController provides simplified interface
- **Repository Pattern** - UserRepository abstracts data access
- **Strategy Pattern** - PasswordEncoder uses BCrypt strategy

## Related Documentation

- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - Service design and registration flow (sections 3.2, 5.2, 7.1)
- [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Password hashing requirements (section 2.1)
- [Database Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Users collection schema (section 1.1)
- [Database Schema LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/DATABASE_SCHEMA.md) - User entity model and repository design (section 3.1)
- [Data Flow](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md) - User registration and login flows (sections 1.1-1.2)
- [Error Handling](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/ERROR_HANDLING.md) - Error handling patterns for registration and authentication

## Architecture Diagrams

- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png`
- **Database Schema Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Database%20Schema%20Class%20Diagram.png`

## Labels

epic:auth, backend:auth, feature, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-2-1: Create User model/entity
```

Title: TASK-2-2-1: Create User model/entity

Description:

## Story

Related to #X (STORY-2-2 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create User entity/model for MongoDB following the database schema specification. The User entity represents user accounts in the system and must include proper validation, indexing, and MongoDB annotations.

## Acceptance Criteria

- [ ] User class created with all required fields
- [ ] Fields: id, username, email, passwordHash (nullable for OAuth), OAuth fields (googleId, provider, providerId, firstName, lastName, pictureUrl), createdAt, updatedAt, lastLoginAt
- [ ] MongoDB annotations (@Document, @Id, @Indexed) properly configured
- [ ] Validation annotations (@NotBlank, @Email, @Size) - passwordHash nullable for OAuth users
- [ ] Username, email, and googleId indexed for performance
- [ ] OAuth support fields included (for Google OAuth login - Story-2.7)
- [ ] Getters and setters (or Lombok @Data)
- [ ] Timestamp fields for audit trail

## Technical Details

### User Entity Structure

Based on [Database Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) and [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md):

**File:** `com.battlearena.auth.model.User`

```java
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    // Password (nullable for OAuth users)
    private String passwordHash; // Hashed with BCrypt, nullable for OAuth users

    // OAuth fields (for Google OAuth login - Story-2.7)
    @Indexed(unique = true, sparse = true)
    private String googleId; // Google user ID (unique, nullable)

    private String provider; // "local" or "google" (enum: AuthProvider)
    private String providerId; // OAuth provider user ID

    // OAuth user info
    private String firstName; // From Google profile
    private String lastName; // From Google profile
    private String pictureUrl; // Profile picture URL from Google

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
}
```

### Database Indexes

- **username** - Unique index for fast lookups and duplicate prevention
- **email** - Unique index for fast lookups and duplicate prevention
- **googleId** - Unique sparse index (for OAuth users)
- **provider** - Ascending index (for OAuth queries)
- **id** - Primary key (MongoDB ObjectId)
- **Compound index:** `{email: 1, provider: 1}` (for OAuth lookups)

### Validation Rules

- Username: 3-20 characters, alphanumeric (optional)
- Email: Valid email format
- PasswordHash: Required for local users, nullable for OAuth users
- Provider: Must be "local" or "google"
- If provider is "local": passwordHash is required
- If provider is "google": passwordHash is null, googleId is required

## Related Documentation

- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - User entity design (section 3.6)
- [Database Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Users collection schema (section 1.1)
- [Database Schema LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/DATABASE_SCHEMA.md) - User entity model, indexes, and validation (section 3.1)
- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png`

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-2-2: Create UserRepository interface
```

Title: TASK-2-2-2: Create UserRepository interface

Description:

## Story

Related to #X (STORY-2-2 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create Spring Data MongoDB repository interface for User.

## Acceptance Criteria

- [ ] UserRepository interface created
- [ ] Extends MongoRepository
- [ ] Custom query methods for username/email lookup

## Technical Details

### UserRepository Implementation

Based on [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) section 3.3:

**File:** `com.battlearena.auth.repository.UserRepository`

**Interface:**

```java
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Find user by username (for login)
    Optional<User> findByUsername(String username);

    // Find user by email (for duplicate check)
    Optional<User> findByEmail(String email);

    // Find user by Google ID (for OAuth login - Story-2.7)
    Optional<User> findByGoogleId(String googleId);

    // Find user by email and provider (for OAuth account linking - Story-2.7)
    Optional<User> findByEmailAndProvider(String email, String provider);

    // Check if username exists (for registration validation)
    boolean existsByUsername(String username);

    // Check if email exists (for registration validation)
    boolean existsByEmail(String email);

    // Check if Google ID exists (for OAuth validation - Story-2.7)
    boolean existsByGoogleId(String googleId);
}
```

**Spring Data MongoDB Features:**

- Automatic query method generation from method names
- `findByUsername` - generates query: `{ username: ?0 }`
- `findByGoogleId` - generates query: `{ googleId: ?0 }` (uses sparse index)
- `findByEmailAndProvider` - generates query: `{ email: ?0, provider: ?1 }` (uses compound index)
- `existsByUsername` - generates query: `{ username: ?0 }` with exists check
- Uses MongoDB indexes for performance

**Usage in Service:**

- Registration: Check duplicates before saving
- Login: Find user by username for credential verification
- OAuth Login (Story-2.7): Find user by googleId or email+provider for account linking

## Related Documentation

- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - UserRepository design (section 3.3, 5.3)
- [Repository Pattern](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - Pattern application (section 4.3)

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-2-3: Create UserService with registration logic
```

Title: TASK-2-2-3: Create UserService with registration logic

Description:

## Story

Related to #X (STORY-2-2 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create UserService with user registration business logic.

## Acceptance Criteria

- [ ] UserService class created
- [ ] registerUser method implemented
- [ ] Input validation
- [ ] Duplicate check
- [ ] Password hashing
- [ ] User saved to database
- [ ] Exception handling

## Technical Details

### UserService Implementation

Based on [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) section 3.2:

**File:** `com.battlearena.auth.service.UserService`

**Responsibilities:**

- Coordinate registration operations
- Validate user input
- Check for duplicate username/email
- Hash passwords securely
- Save users to database
- Enforce business rules

**Method Signature:**

```java
public User registerUser(RegisterRequest request) throws UserAlreadyExistsException {
    // 1. Validate input (username, email format)
    // 2. Check if username exists (UserRepository.existsByUsername)
    // 3. Check if email exists (UserRepository.existsByEmail)
    // 4. Hash password (PasswordEncoder.encode)
    // 5. Create User entity
    // 6. Save to MongoDB (UserRepository.save)
    // 7. Return created user
}
```

**Dependencies:**

- UserRepository (data access)
- PasswordEncoder (password hashing)

**Exception Handling:**

- UserAlreadyExistsException - if username or email already exists
- ValidationException - if input validation fails

## Related Documentation

- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - AuthService design (section 3.2, 5.2)
- [Design Principles](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Clean code and SOLID principles

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-2-4: Create AuthController with /register endpoint
```

Title: TASK-2-2-4: Create AuthController with /register endpoint

Description:

## Story

Related to #X (STORY-2-2 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create REST controller with user registration endpoint.

## Acceptance Criteria

- [ ] AuthController created
- [ ] POST /api/auth/register endpoint
- [ ] Request validation
- [ ] Calls UserService
- [ ] Returns appropriate response
- [ ] Error handling

## Technical Details

### AuthController Implementation

Based on [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) section 3.1:

**File:** `com.battlearena.auth.controller.AuthController`

**Endpoint:** `POST /api/auth/register`

**Request Body (RegisterRequest):**

```json
{
  "username": "player1",
  "email": "player1@example.com",
  "password": "securePassword123"
}
```

**Response (RegisterResponse):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "player1",
  "email": "player1@example.com",
  "message": "User registered successfully"
}
```

**Implementation:**

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<RegisterResponse> register(
        @Valid @RequestBody RegisterRequest request) {
        // 1. Validate request (@Valid handles validation)
        // 2. Call AuthService.registerUser(request)
        // 3. Map User to RegisterResponse
        // 4. Return ResponseEntity with status 201 CREATED
    }
}
```

**Error Responses:**

- 400 Bad Request - Validation errors
- 409 Conflict - Username or email already exists
- 500 Internal Server Error - Server errors

## Related Documentation

- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - AuthController design (section 3.1, 5.1)
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - REST API structure

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-2-5: Create DTOs for request/response
```

Title: TASK-2-2-5: Create DTOs for request/response

Description:

## Story

Related to #X (STORY-2-2 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create Data Transfer Objects for registration request and response.

## Acceptance Criteria

- [ ] RegisterRequest DTO created
- [ ] RegisterResponse DTO created
- [ ] Validation annotations
- [ ] Proper field mapping

## Technical Details

Create:

- com.battlearena.auth.dto.RegisterRequest
  - String username
  - String email
  - String password
  - Validation: @NotBlank, @Email, @Size
- com.battlearena.auth.dto.RegisterResponse
  - String id
  - String username
  - String email
  - String message

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-2-6: Implement password hashing with BCrypt
```

Title: TASK-2-2-6: Implement password hashing with BCrypt

Description:

## Story

Related to #X (STORY-2-2 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Implement secure password hashing using BCrypt with 12 rounds.

## Acceptance Criteria

- [ ] BCrypt configured (12 rounds)
- [ ] PasswordEncoder bean created
- [ ] Passwords hashed before saving
- [ ] Passwords never stored in plain text

## Technical Details

### BCrypt Configuration

Based on [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) section 2.1:

**Configuration:**

```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // 12 rounds for high security
    }
}
```

**Security Requirements:**

- **Algorithm:** BCrypt with salt
- **Rounds:** 12 rounds (high cost factor for security)
- **Storage:** Hashed passwords stored in database
- **Never:** Store passwords in plain text, log passwords, or return passwords in responses

**Usage:**

- Hash passwords during registration
- Verify passwords during login
- Use PasswordEncoder bean via dependency injection

## Related Documentation

- [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Password hashing requirements (section 2.1)
- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - PasswordEncoder design (section 3.5, 5.5)

## Labels

epic:auth, backend:auth, security, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-2-7: Write unit tests for UserService
```

Title: TASK-2-2-7: Write unit tests for UserService

Description:

## Story

Related to #X (STORY-2-2 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Write comprehensive unit tests for UserService registration logic.

## Acceptance Criteria

- [ ] Test successful registration
- [ ] Test duplicate username
- [ ] Test duplicate email
- [ ] Test invalid input
- [ ] 80%+ code coverage

## Technical Details

Create:

- UserServiceTest class
- Mock UserRepository
- Test cases:
  - registerUser_success
  - registerUser_duplicateUsername
  - registerUser_duplicateEmail
  - registerUser_invalidInput

## Labels

epic:auth, backend:auth, testing, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-2-8: Write integration tests for /register endpoint
```

Title: TASK-2-2-8: Write integration tests for /register endpoint

Description:

## Story

Related to #X (STORY-2-2 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Write integration tests for the registration endpoint.

## Acceptance Criteria

- [ ] Test successful registration
- [ ] Test duplicate username
- [ ] Test duplicate email
- [ ] Test validation errors
- [ ] Test with embedded MongoDB

## Technical Details

Create:

- AuthControllerIntegrationTest
- Use @SpringBootTest
- Use TestRestTemplate
- Test HTTP requests/responses
- Use embedded MongoDB for testing

## Labels

epic:auth, backend:auth, testing, priority:high

## Milestone

Phase 2: Authentication

```

---

### STORY-2-3: Implement user login with JWT token generation

#### Issue Template:
```

Title: STORY-2-3: Implement user login with JWT token generation

Description:

## Epic

Related to #X (EPIC-2 issue number)

## User Story

As a user, I want to login with my credentials so that I can access the game.

## Acceptance Criteria

- [ ] POST /api/auth/login endpoint created
- [ ] Credential validation
- [ ] JWT token generation
- [ ] Token returned in response
- [ ] User info returned
- [ ] Unit tests with 80%+ coverage

## Technical Details

- Create JWT utility class
- Configure JWT secret and expiration
- Implement credential validation in UserService
- Create login method in UserService
- Create /login endpoint in AuthController

## Labels

epic:auth, backend:auth, feature, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-3-1: Create JWT utility class
```

Title: TASK-2-3-1: Create JWT utility class

Description:

## Story

Related to #X (STORY-2-3 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create utility class for JWT token generation and validation.

## Acceptance Criteria

- [ ] JwtTokenProvider class created
- [ ] generateToken method
- [ ] validateToken method
- [ ] getUsernameFromToken method
- [ ] Uses configured secret and expiration

## Technical Details

### JwtTokenManager Implementation

Based on [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) section 3.4 and [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) section 1.2:

**File:** `com.battlearena.auth.security.JwtTokenManager`

**Responsibilities:**

- Generate JWT tokens with proper claims
- Validate JWT tokens
- Extract token claims (username, expiration)
- Manage token expiration

**Method Signatures:**

```java
public class JwtTokenManager {
    // Generate JWT token for user
    String generateToken(User user);

    // Validate JWT token
    Claims validateToken(String token) throws JwtException;

    // Extract username from token
    String extractUsername(String token);

    // Check if token is expired
    boolean isTokenExpired(String token);
}
```

**JWT Configuration:**

- **Algorithm:** HS512 (HMAC with SHA-512)
- **Expiration:** 24 hours (86400000 milliseconds)
- **Secret Key:** Read from environment variable (JWT_SECRET)
- **Claims:** username, expiration, issuedAt

**Token Structure:**

```json
{
  "sub": "username",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Related Documentation

- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - JwtTokenManager design (section 3.4, 5.4)
- [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - JWT token structure and configuration (sections 1.2-1.3)

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-3-2: Configure JWT secret and expiration
```

Title: TASK-2-3-2: Configure JWT secret and expiration

Description:

## Story

Related to #X (STORY-2-3 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Configure JWT secret key and token expiration time.

## Acceptance Criteria

- [ ] JWT secret configured in properties
- [ ] Token expiration configured (e.g., 24 hours)
- [ ] Secret is secure (not hardcoded)
- [ ] Uses environment variables

## Technical Details

In application.properties:

- jwt.secret=${JWT_SECRET}
- jwt.expiration=86400000 (24 hours in milliseconds)

Use environment variable for secret in production.

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-3-3: Implement credential validation in UserService
```

Title: TASK-2-3-3: Implement credential validation in UserService

Description:

## Story

Related to #X (STORY-2-3 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Implement login method in UserService with credential validation.

## Acceptance Criteria

- [ ] loginUser method implemented
- [ ] Username lookup
- [ ] Password verification
- [ ] Exception handling for invalid credentials

## Technical Details

### Login Implementation

Based on [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) section 3.2 and [Data Flow](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md) section 1.2:

**Method Signature:**

```java
public AuthResponse loginUser(LoginRequest request) throws InvalidCredentialsException {
    // 1. Find user by username (UserRepository.findByUsername)
    // 2. Verify password (PasswordEncoder.matches)
    // 3. Generate JWT token (JwtTokenManager.generateToken)
    // 4. Return AuthResponse with token and user info
}
```

**Login Flow:**

1. User provides username and password
2. Service finds user by username
3. Service verifies password hash using BCrypt
4. If valid, generate JWT token
5. Return token and user information

**Error Handling:**

- InvalidCredentialsException - if username not found or password incorrect
- Use [Error Handling](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/ERROR_HANDLING.md) patterns for consistent error responses

## Related Documentation

- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - AuthService login method (section 3.2, 5.2)
- [Data Flow](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md) - User login flow (section 1.2)
- [Error Handling](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/ERROR_HANDLING.md) - Error handling patterns

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-3-4: Create login endpoint in AuthController
```

Title: TASK-2-3-4: Create login endpoint in AuthController

Description:

## Story

Related to #X (STORY-2-3 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create POST /api/auth/login endpoint.

## Acceptance Criteria

- [ ] POST /api/auth/login endpoint
- [ ] Accepts LoginRequest
- [ ] Calls UserService.loginUser
- [ ] Generates JWT token
- [ ] Returns LoginResponse with token

## Technical Details

Create endpoint:

- POST /api/auth/login
- Request: LoginRequest (username, password)
- Validate credentials
- Generate JWT token
- Response: LoginResponse (token, user info)

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-3-5: Create LoginRequest and LoginResponse DTOs
```

Title: TASK-2-3-5: Create LoginRequest and LoginResponse DTOs

Description:

## Story

Related to #X (STORY-2-3 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create DTOs for login request and response.

## Acceptance Criteria

- [ ] LoginRequest DTO created
- [ ] LoginResponse DTO created
- [ ] Validation annotations
- [ ] Proper field mapping

## Technical Details

Create:

- com.battlearena.auth.dto.LoginRequest
  - String username (@NotBlank)
  - String password (@NotBlank)
- com.battlearena.auth.dto.LoginResponse
  - String token
  - String username
  - String email
  - String message

## Labels

epic:auth, backend:auth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-3-6: Write unit tests for login
```

Title: TASK-2-3-6: Write unit tests for login

Description:

## Story

Related to #X (STORY-2-3 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Write unit tests for login functionality.

## Acceptance Criteria

- [ ] Test successful login
- [ ] Test invalid username
- [ ] Test invalid password
- [ ] Test JWT token generation
- [ ] 80%+ code coverage

## Technical Details

Create:

- UserServiceTest.loginUser_success
- UserServiceTest.loginUser_invalidUsername
- UserServiceTest.loginUser_invalidPassword
- Mock dependencies

## Labels

epic:auth, backend:auth, testing, priority:high

## Milestone

Phase 2: Authentication

```

---

### STORY-2-4: Implement secure password hashing

#### Issue Template:
```

Title: STORY-2-4: Implement secure password hashing

Description:

## Epic

Related to #X (EPIC-2 issue number)

## User Story

As a user, I want my password to be securely hashed so that my account is protected.

## Acceptance Criteria

- [ ] BCrypt password hashing (12 rounds)
- [ ] Passwords never stored in plain text
- [ ] Password validation on login
- [ ] Security best practices followed

## Technical Details

- Configure BCrypt with 12 rounds
- Create PasswordEncoder bean
- Implement password hashing in registration
- Implement password verification in login

## Subtasks

- [ ] Configure BCrypt with 12 rounds (Task-2.2.6)
- [ ] Create PasswordEncoder bean (Task-2.2.6)
- [ ] Implement password hashing in registration (Task-2.2.6)
- [ ] Implement password verification in login (Task-2.2.6)
- [ ] Add password strength validation (optional) (Task-2.4.1)
- [ ] Write security tests (Task-2.4.2)
- [ ] Document password security practices (Task-2.4.3)

## Labels

epic:auth, backend:auth, security, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-4-1: Add password strength validation (optional)
```

Title: TASK-2-4-1: Add password strength validation (optional)

Description:

## Story

Related to #X (STORY-2-4 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Add optional password strength validation to improve security. This is an optional enhancement that can be implemented if time permits.

## Acceptance Criteria

- [ ] Password strength rules defined (minimum length, complexity)
- [ ] Validation implemented in registration
- [ ] Clear error messages for weak passwords
- [ ] Validation configurable (can be disabled)

## Technical Details

### Password Strength Rules (Optional)

- Minimum 8 characters (already required)
- At least one uppercase letter (optional)
- At least one lowercase letter (optional)
- At least one number (optional)
- At least one special character (optional)

### Implementation

- Create PasswordValidator utility class
- Add validation in RegisterRequest DTO or AuthService
- Return clear error messages
- Make validation configurable via properties

## Related Documentation

- [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Password security requirements

## Labels

epic:auth, backend:auth, security, task, priority:low

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-4-2: Write security tests
```

Title: TASK-2-4-2: Write security tests

Description:

## Story

Related to #X (STORY-2-4 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Write comprehensive security tests for password hashing and authentication.

## Acceptance Criteria

- [ ] Test password hashing (BCrypt)
- [ ] Test password verification
- [ ] Test that passwords are never stored in plain text
- [ ] Test password strength validation (if implemented)
- [ ] Test authentication security

## Technical Details

### Test Cases

- Password hashing produces different hashes for same password (salt)
- Password verification works correctly
- Plain text passwords never appear in logs or responses
- Password hashing performance is acceptable
- Invalid password attempts are handled securely

### Test Implementation

- Create SecurityTest class
- Use JUnit and Mockito
- Test PasswordEncoder behavior
- Test AuthService security

## Related Documentation

- [Testing Strategy](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Security testing approach
- [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Security requirements

## Labels

epic:auth, backend:auth, security, testing, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-4-3: Document password security practices
```

Title: TASK-2-4-3: Document password security practices

Description:

## Story

Related to #X (STORY-2-4 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Document password security practices and implementation details for future reference and compliance.

## Acceptance Criteria

- [ ] Password hashing algorithm documented
- [ ] BCrypt configuration documented
- [ ] Security best practices documented
- [ ] Implementation details documented
- [ ] Compliance notes added

## Technical Details

### Documentation Sections

1. **Password Hashing**
   - Algorithm: BCrypt
   - Rounds: 12
   - Salt: Automatic (BCrypt handles)

2. **Security Practices**
   - Passwords never stored in plain text
   - Passwords never logged
   - Passwords never returned in responses
   - Secure password transmission (HTTPS)

3. **Implementation Details**
   - PasswordEncoder configuration
   - Hashing during registration
   - Verification during login

4. **Compliance**
   - OWASP guidelines followed
   - Industry best practices

### Documentation Location

- Add to Auth Service README
- Add to Security Architecture document
- Add to API documentation

## Related Documentation

- [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Password security (section 2.1)

## Labels

epic:auth, backend:auth, security, documentation, priority:medium

## Milestone

Phase 2: Authentication

```

*(Note: This story is already covered in registration subtasks, but provides emphasis on security)*

---

### STORY-2-5: Implement logout and session management

#### Issue Template:
```

Title: STORY-2-5: Implement logout and session management

Description:

## Epic

Related to #X (EPIC-2 issue number)

## User Story

As a user, I want to logout so that I can securely end my session.

## Acceptance Criteria

- [ ] POST /api/auth/logout endpoint
- [ ] Token invalidation (if using token blacklist)
- [ ] Session cleanup
- [ ] Success response

## Technical Details

- Create logout endpoint
- Implement token invalidation (optional - depends on JWT strategy)
- Add session management
- Write tests

## Labels

epic:auth, backend:auth, feature, priority:medium

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-5-1: Create logout endpoint
```

Title: TASK-2-5-1: Create logout endpoint

Description:

## Story

Related to #X (STORY-2-5 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create POST /api/auth/logout endpoint.

## Acceptance Criteria

- [ ] POST /api/auth/logout endpoint
- [ ] JWT authentication required
- [ ] Returns success response

## Technical Details

Create:

- POST /api/auth/logout in AuthController
- Extract token from request
- Optionally invalidate token (if using blacklist)
- Return success response

## Labels

epic:auth, backend:auth, task, priority:medium

## Milestone

Phase 2: Authentication

```

---

### STORY-2-6: Create JWT token validation filter/interceptor

#### Issue Template:
```

Title: STORY-2-6: Create JWT token validation filter/interceptor

Description:

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create middleware to validate JWT tokens on protected endpoints across all services.

## Acceptance Criteria

- [ ] JWT validation filter created
- [ ] Token extraction from headers
- [ ] Token validation logic
- [ ] Error handling for invalid tokens
- [ ] Reusable across services

## Technical Details

- Create JwtAuthenticationFilter
- Create JwtTokenProvider utility
- Configure Spring Security
- Add token validation logic
- Handle expired tokens
- Handle invalid tokens

## Labels

epic:auth, backend:auth, security, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-6-1: Create JwtAuthenticationFilter
```

Title: TASK-2-6-1: Create JwtAuthenticationFilter

Description:

## Story

Related to #X (STORY-2-6 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create JWT authentication filter for Spring Security.

## Acceptance Criteria

- [ ] JwtAuthenticationFilter class created
- [ ] Extends OncePerRequestFilter
- [ ] Token extraction from Authorization header
- [ ] Token validation
- [ ] Sets authentication in SecurityContext

## Technical Details

Create:

- com.battlearena.auth.security.JwtAuthenticationFilter
- Extends OncePerRequestFilter
- Extract token from "Authorization: Bearer <token>"
- Validate token using JwtTokenProvider
- Set authentication in SecurityContext

## Labels

epic:auth, backend:auth, security, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-6-2: Configure Spring Security
```

Title: TASK-2-6-2: Configure Spring Security

Description:

## Story

Related to #X (STORY-2-6 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Configure Spring Security with JWT authentication filter.

## Acceptance Criteria

- [ ] SecurityConfig class created
- [ ] JwtAuthenticationFilter added to filter chain
- [ ] Public endpoints configured (/api/auth/register, /api/auth/login)
- [ ] Protected endpoints require authentication
- [ ] CORS configured

## Technical Details

Create:

- com.battlearena.auth.config.SecurityConfig
- Add JwtAuthenticationFilter to filter chain
- Configure public endpoints
- Configure protected endpoints
- Configure CORS

## Labels

epic:auth, backend:auth, security, task, priority:high

## Milestone

Phase 2: Authentication

```

---

### STORY-2-7: Implement Google OAuth Login

#### Issue Template:
```

Title: STORY-2-7: Implement Google OAuth Login

Description:

## Epic

Related to #X (EPIC-2 issue number)

## User Story

As a user, I want to login with my Google account so that I can quickly access the game without creating a separate password.

## Acceptance Criteria

- [ ] Google OAuth 2.0 client configured in Auth Service
- [ ] User model updated to support OAuth providers (googleId, provider, etc.)
- [ ] POST /api/auth/google endpoint created
- [ ] Google OAuth token validation
- [ ] User creation/authentication via Google account
- [ ] JWT token generation after Google authentication
- [ ] Frontend Google login button integration
- [ ] Unit tests with 80%+ coverage
- [ ] Integration tests for Google OAuth flow

## Technical Details

### Implementation Flow

**Google OAuth Flow:**

1. User clicks "Sign in with Google" on frontend
2. Frontend redirects to Google OAuth consent screen
3. User authorizes application
4. Google redirects back with authorization code
5. Frontend sends authorization code to POST /api/auth/google
6. Auth Service exchanges code for Google access token
7. Auth Service validates token with Google
8. Auth Service retrieves user info from Google (email, name, picture)
9. Auth Service checks if user exists by googleId or email
10. If new user: Create user with Google info, generate JWT
11. If existing user: Update last login, generate JWT
12. Auth Service returns JWT token to frontend
13. Frontend stores token and redirects to dashboard

### Components to Create/Update

#### 1. User Model Updates

Update `User.java` to support OAuth:

```java
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String username;
    private String email;
    private String passwordHash; // Hashed with BCrypt, null for OAuth users

    // OAuth fields
    private String googleId; // Google user ID
    private String provider; // "local", "google"
    private String providerId; // OAuth provider user ID

    // User info from OAuth
    private String firstName;
    private String lastName;
    private String pictureUrl; // Profile picture from Google

    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    // ... existing fields
}
```

#### 2. Google OAuth Service

Create `GoogleOAuthService.java`:

- Exchange authorization code for access token
- Validate Google access token
- Retrieve user info from Google API
- Handle OAuth errors

#### 3. OAuth Controller Endpoint

Add to `AuthController.java`:

```java
@PostMapping("/google")
public ResponseEntity<LoginResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
    // Exchange code for token
    // Validate with Google
    // Create/update user
    // Generate JWT
    // Return response
}
```

#### 4. DTOs

- `GoogleAuthRequest.java` - Authorization code from frontend
- `GoogleUserInfo.java` - User info from Google API

### Required Dependencies (pom.xml)

```xml
<!-- Google OAuth Client -->
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.2.0</version>
</dependency>

<!-- Google OAuth2 -->
<dependency>
    <groupId>com.google.auth</groupId>
    <artifactId>google-auth-library-oauth2-http</artifactId>
    <version>1.19.0</version>
</dependency>

<!-- HTTP Client for Google API calls -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

### Application Properties Configuration

Add to `application.properties`:

```properties
# Google OAuth Configuration
google.oauth.client-id=${GOOGLE_CLIENT_ID:}
google.oauth.client-secret=${GOOGLE_CLIENT_SECRET:}
google.oauth.redirect-uri=${GOOGLE_REDIRECT_URI:http://localhost:4200/auth/google/callback}
google.oauth.scope=openid email profile
```

### Google Cloud Console Setup

1. Create project in Google Cloud Console
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs:
   - `http://localhost:4200/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
5. Copy Client ID and Client Secret to environment variables

### Frontend Integration

Frontend needs to:

1. Add Google Sign-In button
2. Handle Google OAuth redirect
3. Send authorization code to `/api/auth/google`
4. Store JWT token on success

### Design Patterns

- **Strategy Pattern** - OAuth authentication strategy (Google, future: Facebook, GitHub)
- **Factory Pattern** - OAuth provider factory (GoogleOAuthService, etc.)
- **Repository Pattern** - UserRepository with OAuth query methods

### Security Considerations

- Validate Google tokens server-side (never trust client)
- Store Google user ID for account linking
- Handle email conflicts (if email exists with different provider)
- Secure OAuth credentials (environment variables)
- CSRF protection for OAuth callback

### Error Handling

- Invalid authorization code
- Google API errors
- Network timeouts
- Email already exists with different provider
- Account linking scenarios

## Related Documentation

- [Auth Service LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - Service design and authentication patterns (includes OAuth components)
- [Security Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - OAuth authentication and security requirements (section 1.4)
- [Database Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Users collection schema with OAuth support (section 1.1)
- [Database Schema LLD](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/DATABASE_SCHEMA.md) - User entity model with OAuth fields
- [Data Flow](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md) - Google OAuth login flow (section 1.4)
- [System Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Auth Service with OAuth responsibilities (section 2.1)
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Frontend AuthService with Google OAuth (section 1.2)
- [Communication Patterns](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) - Google OAuth endpoint (section 1.3)

## Architecture Diagrams

- **Authentication Flow Sequence Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Authentication%20Flow.png`
- **Database ER Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png`

## Labels

epic:auth, backend:auth, feature, oauth, priority:medium

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-7-1: Update User model for OAuth support
```

Title: TASK-2-7-1: Update User model for OAuth support

Description:

## Story

Related to #X (STORY-2-7 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Update User entity to support OAuth providers (Google, future: Facebook, GitHub). Add fields for OAuth provider information, user info from OAuth, and account linking.

## Acceptance Criteria

- [ ] User model updated with OAuth fields (googleId, provider, providerId)
- [ ] User model updated with OAuth user info (firstName, lastName, pictureUrl)
- [ ] Password field made optional (null for OAuth users)
- [ ] MongoDB indexes updated for OAuth queries
- [ ] Migration script created (if needed)

## Technical Details

### User Model Fields

```java
// OAuth Provider Fields
private String googleId; // Google user ID (unique)
private String provider; // "local", "google" (enum: AuthProvider)
private String providerId; // OAuth provider user ID

// OAuth User Info
private String firstName; // From Google profile
private String lastName; // From Google profile
private String pictureUrl; // Profile picture URL from Google

// Password (nullable for OAuth users)
private String passwordHash; // Hashed with BCrypt, null for OAuth users
```

### MongoDB Indexes

```java
@Indexed(unique = true, sparse = true)
private String googleId; // Unique Google ID

@Indexed
private String provider; // Index for provider queries

@Indexed
private String email; // Index for email lookups (OAuth + local)
```

### Validation Rules

- If provider is "local": passwordHash is required
- If provider is "google": passwordHash is null, googleId is required
- Email must be unique across all providers
- Username can be auto-generated from email for OAuth users

## Labels

epic:auth, backend:auth, database, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-7-2: Create Google OAuth Service
```

Title: TASK-2-7-2: Create Google OAuth Service

Description:

## Story

Related to #X (STORY-2-7 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create GoogleOAuthService to handle Google OAuth token exchange, validation, and user info retrieval.

## Acceptance Criteria

- [ ] GoogleOAuthService class created
- [ ] Exchange authorization code for access token
- [ ] Validate Google access token
- [ ] Retrieve user info from Google API
- [ ] Handle OAuth errors and exceptions
- [ ] Unit tests with 80%+ coverage

## Technical Details

### GoogleOAuthService Methods

```java
public interface GoogleOAuthService {
    // Exchange authorization code for access token
    String exchangeCodeForToken(String authorizationCode);

    // Validate Google access token
    boolean validateToken(String accessToken);

    // Get user info from Google
    GoogleUserInfo getUserInfo(String accessToken);
}
```

### Implementation Details

- Use Google API Client library
- Make HTTP calls to Google OAuth endpoints
- Handle rate limiting and errors
- Cache token validation results (optional)

### Google API Endpoints

- Token Exchange: `https://oauth2.googleapis.com/token`
- Token Info: `https://www.googleapis.com/oauth2/v1/tokeninfo`
- User Info: `https://www.googleapis.com/oauth2/v2/userinfo`

## Labels

epic:auth, backend:auth, oauth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-7-3: Implement Google OAuth endpoint
```

Title: TASK-2-7-3: Implement Google OAuth endpoint

Description:

## Story

Related to #X (STORY-2-7 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Create POST /api/auth/google endpoint in AuthController to handle Google OAuth authentication flow.

## Acceptance Criteria

- [ ] POST /api/auth/google endpoint created
- [ ] Accepts GoogleAuthRequest (authorization code)
- [ ] Exchanges code for token via GoogleOAuthService
- [ ] Validates token and retrieves user info
- [ ] Creates or updates user in database
- [ ] Generates JWT token
- [ ] Returns LoginResponse with JWT token
- [ ] Error handling for OAuth failures
- [ ] Unit tests with 80%+ coverage

## Technical Details

### Endpoint Signature

```java
@PostMapping("/google")
@Operation(summary = "Authenticate with Google", description = "Authenticates user via Google OAuth")
public ResponseEntity<LoginResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
    // 1. Exchange code for token
    // 2. Validate token
    // 3. Get user info
    // 4. Find or create user
    // 5. Generate JWT
    // 6. Return response
}
```

### Request/Response DTOs

```java
// GoogleAuthRequest
public class GoogleAuthRequest {
    @NotBlank
    private String code; // Authorization code from Google
    private String redirectUri; // Optional, defaults to configured URI
}

// LoginResponse (reuse from Story-2.3)
public class LoginResponse {
    private String token;
    private String refreshToken; // Optional
    private UserDto user;
}
```

### Business Logic Flow

1. Validate authorization code
2. Exchange code for access token (GoogleOAuthService)
3. Validate access token (GoogleOAuthService)
4. Retrieve user info from Google (GoogleOAuthService)
5. Check if user exists by googleId or email
6. If new user: Create user with Google info
7. If existing user: Update last login
8. Generate JWT token (JwtTokenManager)
9. Return LoginResponse

## Labels

epic:auth, backend:auth, oauth, task, priority:high

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-7-4: Update UserRepository for OAuth queries
```

Title: TASK-2-7-4: Update UserRepository for OAuth queries

Description:

## Story

Related to #X (STORY-2-7 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Add query methods to UserRepository for OAuth user lookups (by googleId, email, provider).

## Acceptance Criteria

- [ ] findByGoogleId() method added
- [ ] findByEmailAndProvider() method added
- [ ] findByProvider() method added (optional, for future use)
- [ ] Query methods properly indexed
- [ ] Unit tests for repository methods

## Technical Details

### Repository Methods

```java
public interface UserRepository extends MongoRepository<User, String> {
    // Find user by Google ID
    Optional<User> findByGoogleId(String googleId);

    // Find user by email and provider
    Optional<User> findByEmailAndProvider(String email, String provider);

    // Find users by provider (for future analytics)
    List<User> findByProvider(String provider);
}
```

### MongoDB Indexes

Ensure indexes exist for:

- `googleId` (unique, sparse)
- `email` + `provider` (compound index for lookups)

## Labels

epic:auth, backend:auth, database, task, priority:medium

## Milestone

Phase 2: Authentication

```

#### Subtask: TASK-2-7-5: Add Google OAuth configuration
```

Title: TASK-2-7-5: Add Google OAuth configuration

Description:

## Story

Related to #X (STORY-2-7 issue number)

## Epic

Related to #X (EPIC-2 issue number)

## Description

Configure Google OAuth client credentials and settings in application.properties and environment variables.

## Acceptance Criteria

- [ ] Google OAuth properties added to application.properties
- [ ] Environment variables documented
- [ ] Google Cloud Console setup documented
- [ ] Configuration validation on startup
- [ ] Configuration class created (GoogleOAuthConfig)

## Technical Details

### Application Properties

```properties
# Google OAuth Configuration
google.oauth.client-id=${GOOGLE_CLIENT_ID:}
google.oauth.client-secret=${GOOGLE_CLIENT_SECRET:}
google.oauth.redirect-uri=${GOOGLE_REDIRECT_URI:http://localhost:4200/auth/google/callback}
google.oauth.scope=openid email profile
google.oauth.token-endpoint=https://oauth2.googleapis.com/token
google.oauth.userinfo-endpoint=https://www.googleapis.com/oauth2/v2/userinfo
```

### Configuration Class

```java
@Configuration
@ConfigurationProperties(prefix = "google.oauth")
public class GoogleOAuthConfig {
    private String clientId;
    private String clientSecret;
    private String redirectUri;
    private String scope;
    // ... getters and setters
}
```

### Environment Variables

- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GOOGLE_REDIRECT_URI` - OAuth redirect URI (optional, defaults to localhost)

## Labels

epic:auth, backend:auth, configuration, task, priority:medium

## Milestone

Phase 2: Authentication

```

---

## 📝 Usage Instructions

1. **Create Epic Issue:** Copy the Epic template and create issue (e.g., #X)
2. **Create Story Issues:** Copy story templates, replace `#X` with Epic issue number, replace `#X` with story issue numbers
3. **Create Subtask Issues:** Copy subtask templates, replace `#X` with Story issue number, replace `#X` with Epic issue number
4. **Create Branches:** Use format `feature/#X-story-or-subtask-title` where X is the issue number
5. **Link in Commits:** Use `Related to #X` or `Closes #X` in commit messages
6. **Link in PRs:** Use `Closes #X` and `Related to #X` in PR descriptions

```
