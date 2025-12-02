# EPIC-VS-2: Player Authentication & Identity

**Note:** All technical implementation details from Phase 2 (Authentication) and Phase 7 (Frontend) have been consolidated into this file. You no longer need to reference multiple Phase documents when creating GitHub issues.

---

## EPIC-VS-2: Player Authentication & Identity

### Issue Template

**Title:** EPIC-VS-2: Player Authentication & Identity

**Description:**

## Overview

Implement the second vertical slice where a player can register, login, and logout. This epic establishes player identity and authentication, which is the foundation for all future gameplay features. Players must be able to create accounts and securely access the game.

**This is the second vertical slice** - it enables all future features by establishing player identity.

## Vertical Slice Goal

A player can:

1. Register a new account with username, email, and password
2. Login with their credentials and receive a JWT token
3. Logout and securely end their session

## Success Criteria

- [ ] Player can register with username, email, and password
- [ ] Player can login with credentials and receive JWT token
- [ ] Player can logout and session is terminated
- [ ] Passwords are securely hashed (BCrypt, never stored in plain text)
- [ ] JWT tokens are generated with proper claims and expiration
- [ ] Frontend can store and use JWT tokens for authenticated requests
- [ ] End-to-end flow works: Register → Login → Access protected route → Logout

## Technical References

### Phase Documents (Technical Implementation Details)

This epic references Phase 2 (Authentication) for technical specifications.

- **Auth Service:** See Phase 2 (PHASE-2 issue) - STORY-2-1, STORY-2-2, STORY-2-3
- **Frontend:** See Phase 7 (PHASE-7 issue) - STORY-7-2 (Authentication UI)

### Architecture References

**Sequence Diagrams:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Authentication%20Flow.png)
- [Session Timeout Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Session%20Timeout%20Flow.png)
- [Sequence Diagrams Index](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/README.md)

**Class Diagrams:**

- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Auth%20Service%20Class%20Diagram.png)
- [Database Schema Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Database%20Schema%20Class%20Diagram.png)
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png)

**ER Diagrams:**

- [Database ER Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png) - Entity relationships

**Architecture Documents:**

- [System Architecture - Auth Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#21-auth-service)
- [Auth Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)
- [Frontend Components Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md)
- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md)
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Critical design principles (REUSABILITY, SOLID, DRY, Clean Code, Secure Programming)

## ⚠️ CRITICAL DESIGN PRINCIPLES

**This epic and all implementation MUST strictly adhere to the following principles:**

1. **REUSABILITY** - All components, services, and utilities MUST be designed for maximum reusability across the system
2. **GOOD CODE PRACTICES** - Follow SOLID principles, DRY (Don't Repeat Yourself), and industry best practices
3. **CLEAN CODE** - Code must be readable, self-documenting, and maintainable
4. **CLEAN ARCHITECTURE** - Strict separation of concerns with clear boundaries between layers
5. **SECURE PROGRAMMING** - Security-first approach with defense in depth, input validation, and secure communication

**These principles are NON-NEGOTIABLE and must be enforced in every line of code and every architectural decision.**

## Design Patterns & Architecture

### Design Patterns Applied

Based on [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md):

- **Facade Pattern** - AuthController provides simplified interface to authentication subsystem
  - **Why:** Simplifies client interaction, decouples clients from subsystem
  - **Implementation:** AuthController delegates to AuthService and JwtTokenManager

- **Strategy Pattern** - Authentication strategies (local, OAuth), password encoding strategies
  - **Why:** Allows different authentication methods without changing AuthService
  - **Implementation:** AuthenticationStrategy interface with concrete implementations

- **Repository Pattern** - UserRepository abstracts data access
  - **Why:** Decouples business logic from data access, enables testability
  - **Implementation:** UserRepository interface extends MongoRepository

- **Singleton Pattern** - JwtTokenManager single instance
  - **Why:** Single instance manages JWT configuration and operations
  - **Implementation:** Spring @Service annotation ensures single instance

- **Factory Pattern** - User entity creation (optional, for complex user creation logic)

### Clean Architecture Principles

**Layer Separation:**

```

Controller Layer (Presentation)
↓ depends on
Service Layer (Business Logic)
↓ depends on
Repository Layer (Data Access)
↓ depends on
Model Layer (Domain Entities)
```

**Dependency Flow:**

- Dependencies flow **inward** (controller → service → repository)
- Outer layers depend on inner layers, **never the reverse**
- Use **interfaces** for abstraction between layers
- **Dependency Injection** for loose coupling

**Package Organization:**

- **controller/** - REST API endpoints (Facade Pattern)
- **service/** - Business logic (Strategy Pattern)
- **repository/** - Data access (Repository Pattern)
- **model/** - Domain entities (no dependencies)
- **dto/** - Data Transfer Objects (no dependencies)
- **config/** - Configuration classes (Spring @Configuration)
- **security/** - Security components (Singleton Pattern)
- **exception/** - Exception handlers (GlobalExceptionHandler)

### SOLID Principles Application

**Single Responsibility Principle (SRP):**

- Each class has **one reason to change**
- `AuthController` - Only handles HTTP requests/responses
- `AuthService` - Only handles business logic
- `UserRepository` - Only handles data access
- `JwtTokenManager` - Only handles JWT operations

**Open/Closed Principle (OCP):**

- Classes open for **extension**, closed for **modification**
- Use **Strategy Pattern** for authentication methods
- Use **interfaces** for extensibility

**Liskov Substitution Principle (LSP):**

- Subtypes must be **substitutable** for their base types
- Repository implementations must be interchangeable

**Interface Segregation Principle (ISP):**

- Clients should not depend on interfaces they don't use
- Create **specific interfaces** (e.g., `UserRepository` not `GenericRepository`)

**Dependency Inversion Principle (DIP):**

- Depend on **abstractions**, not concretions
- Use **dependency injection** for all dependencies
- Services depend on **interfaces**, not implementations

### Code Quality Standards

**Meaningful Naming:**

- Use **descriptive names** (e.g., `registerUser()` not `reg()`)
- Follow **Java naming conventions** (camelCase for methods, PascalCase for classes)
- Use **self-documenting code** (code should explain itself)

**DRY (Don't Repeat Yourself):**

- Extract **common functionality** into reusable methods
- Use **shared utilities** for JWT operations, validation
- Create **base classes** for common exception handling

**Comprehensive Documentation:**

- **JavaDoc** comments for all public methods
- **API documentation** with Swagger annotations
- **Architecture decisions** documented in code comments

**Testing Requirements:**

- **80%+ code coverage** for unit tests
- **Integration tests** for all endpoints
- **Mock dependencies** for unit testing
- **Test edge cases** and error scenarios

### Security Best Practices

**Input Validation:**

- Validate **all input** at controller level (`@Valid` annotations)
- Validate **business rules** at service level
- **Sanitize** user input to prevent injection attacks

**Password Security:**

- **Never store** passwords in plain text
- Use **BCrypt** with 12 rounds minimum
- **Never log** passwords or sensitive data

**JWT Security:**

- Use **strong secret keys** (stored in environment variables)
- Set **appropriate expiration** times (24 hours)
- **Validate tokens** on every request
- Use **HS512 algorithm** for signing

**Error Handling:**

- **Never expose** internal errors to clients
- Return **generic error messages** to users
- **Log detailed errors** for debugging
- Use **GlobalExceptionHandler** for consistent error responses

### Industrial Standards

**REST API Design:**

- Use **HTTP status codes** correctly (200, 201, 400, 401, 404, 500)
- Follow **RESTful conventions** (nouns for resources, verbs for actions)
- Use **consistent response formats** (JSON with consistent structure)
- Implement **proper error responses** with error codes and messages

**Database Design:**

- Use **indexes** for frequently queried fields (username, email)
- Implement **unique constraints** at database level
- Use **MongoDB ObjectId** for primary keys
- **Never expose** database IDs directly to clients

**Logging Standards:**

- Use **structured logging** (JSON format)
- Log **at appropriate levels** (INFO, WARN, ERROR)
- **Never log** sensitive data (passwords, tokens, PII)
- Include **correlation IDs** for request tracing

**Configuration Management:**

- Use **environment variables** for sensitive configuration
- Provide **default values** for development
- **Never commit** secrets to version control
- Use **configuration profiles** for different environments

## Stories (Player Experience)

### VS-2-1: Implement player registration with username email and password

**User Story:** As a player, I want to register with username, email, and password so that I can create an account and play the game.

**Acceptance Criteria:**

- [ ] Registration form visible on frontend
- [ ] Player can enter username, email, and password
- [ ] Form validates input (username length, email format, password strength)
- [ ] Registration request sent to Auth Service
- [ ] Auth Service validates username/email uniqueness
- [ ] Password is hashed with BCrypt (12 rounds) before storing
- [ ] User account created in MongoDB
- [ ] Success message displayed to player
- [ ] Player redirected to login page after successful registration

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-2-1-1: Auth Service Foundation Setup**

**Description:**
Set up the Spring Boot project structure, dependencies, and configuration for the Auth Service. This is a prerequisite for all other tasks.

**Related Diagrams & Documents:**

- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Auth%20Service%20Class%20Diagram.png)
- [System Architecture - Auth Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#21-auth-service)
- [Auth Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md)

**Acceptance Criteria:**

- [x] Maven project structure created
- [x] Package structure follows clean architecture
- [x] Main Application class created
- [x] All Maven dependencies added (Spring Boot, Security, MongoDB, JWT, Validation, Swagger)
- [x] application.yaml configured (port 8081, MongoDB URI, JWT secret/expiration, CORS)
- [x] SecurityConfig created with PasswordEncoder, SecurityFilterChain, and CORS configuration
- [x] SwaggerConfig created with OpenAPI configuration
- [x] GlobalExceptionHandler created with proper error handling
- [x] Custom exceptions created (UserAlreadyExistsException, InvalidCredentialsException)
- [x] Spring Boot Actuator dependency added for health checks
- [x] Actuator endpoints configured in application.yaml
- [x] Health check endpoint working (/actuator/health)
- [x] Swagger/OpenAPI configuration added to application.yaml (springdoc properties)
- [x] Swagger/OpenAPI accessible at /swagger-ui.html
- [x] OpenAPI specification available at /api-docs
- [x] Maven build plugins configured (compiler, JaCoCo, Checkstyle)
- [x] Java 17 and Spring Boot 3.3.6 versions specified
- [x] Application.java main class created with @SpringBootApplication
- [x] Application starts successfully and health check works
- [x] Dockerfile created with multi-stage build (Maven build + JRE runtime)
- [x] .dockerignore file created to exclude unnecessary files
- [x] docker-compose.yml auth-service section uncommented and configured
- [x] Health check configured in docker-compose.yml
- [x] Service configured for Docker-only deployment (no host ports exposed)
- [x] Nginx API Gateway configured to route /api/auth requests to auth-service

**Additional Work Completed (Beyond Task Scope):**

While implementing TASK-VS-2-1-1, the following additional infrastructure work was completed to ensure the entire microservices ecosystem is functional:

1. **Enabled All Microservices in docker-compose.yml:**
   - Uncommented and configured profile-service (port 8082)
   - Uncommented and configured leaderboard-service (port 8083)
   - Uncommented and configured matchmaking-service (port 3002)
   - Uncommented and configured game-engine (port 5002)
   - Uncommented and configured frontend-service (port 4200)
   - Added health checks for all services
   - Configured proper service dependencies and startup order

2. **Created Dockerfiles for All Services:**
   - Created Dockerfile for profile-service (multi-stage Spring Boot build)
   - Created Dockerfile for leaderboard-service (multi-stage Spring Boot build)
   - Created Dockerfile for matchmaking-service (multi-stage Node.js build)
   - Created Dockerfile for game-engine (multi-stage Node.js build)
   - Created Dockerfile for frontend-service (multi-stage Angular build with nginx)
   - Created .dockerignore files for all services

3. **Nginx API Gateway Configuration:**
   - Configured routing for /api/profile → profile-service:8082
   - Configured routing for /api/leaderboard → leaderboard-service:8083
   - Configured WebSocket support for /ws/matchmaking → matchmaking-service:3002
   - Configured WebSocket support for /ws/game → game-engine:5002
   - Configured frontend service routing at root path (/)
   - Implemented path rewriting to strip /api/ and /ws/ prefixes before proxying
   - Added CORS headers and OPTIONS preflight request handling for all endpoints

4. **Service Configuration Updates:**
   - Updated profile-service application.yaml with port 8082 and MongoDB settings
   - Updated leaderboard-service application.yaml with port 8083 and MongoDB settings
   - Ensured consistency across all service configurations

**Verification:**

- All services verified healthy and running in Docker containers
- Auth service health check accessible at http://localhost/api/auth/actuator/health
- Swagger UI accessible at http://localhost/swagger-ui.html
- OpenAPI docs accessible at http://localhost/api-docs
- All microservices accessible through Nginx API Gateway
- No host ports exposed (Docker-only deployment as required)

**Technical Details:**

**Reference Documentation:**

- [Auth Service Low-Level Design](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) - Complete service architecture and component design
- [System Architecture - Auth Service](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#21-auth-service) - Service integration and communication patterns
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Backend service structure and dependencies

**Project Structure Setup:**

- Create Maven project structure in `backend-services/auth-service/` directory
- Set up standard Maven directory layout (src/main/java, src/main/resources, src/test/java)
- Create package structure following clean architecture principles:
  - `com.battlearena.auth_service` - Main package
  - `com.battlearena.auth_service.config` - Configuration classes
  - `com.battlearena.auth_service.controller` - REST API endpoints
  - `com.battlearena.auth_service.service` - Business logic layer
  - `com.battlearena.auth_service.repository` - Data access layer
  - `com.battlearena.auth_service.model` - Domain entities
  - `com.battlearena.auth_service.dto` - Data Transfer Objects
  - `com.battlearena.auth_service.security` - Security components
  - `com.battlearena.auth_service.exception` - Exception handlers
- Create test package structure mirroring main package structure
- Add `checkstyle.xml` configuration file for code quality checks
- Create `README.md` file documenting service overview, technology stack, endpoints, and environment variables

**Maven Dependencies (pom.xml):**

- Configure Spring Boot parent POM version 3.3.6
- Set Java version to 17 in properties section
- Add Spring Boot starter dependencies:
  - spring-boot-starter-web (REST API support)
  - spring-boot-starter-security (Security framework)
  - spring-boot-starter-data-mongodb (MongoDB integration)
  - spring-boot-starter-actuator (Health checks and monitoring)
  - spring-boot-starter-validation (Input validation)
- Add JWT libraries (io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson version 0.12.3)
- Add SpringDoc OpenAPI dependency (springdoc-openapi-starter-webmvc-ui version 2.3.0) for Swagger documentation
- Add Lombok dependency (optional, for reducing boilerplate code)
- Add Spring Boot DevTools (optional, for development)
- Add testing dependencies (spring-boot-starter-test, spring-security-test)
- Configure Maven compiler plugin for Java 17 source and target
- Configure Spring Boot Maven plugin with Lombok exclusion
- Add JaCoCo Maven plugin (version 0.8.14) for code coverage with 80% minimum requirement
- Add Maven Checkstyle plugin (version 3.6.0) for code quality enforcement

**Application Configuration (application.yaml):**

- Configure server port (default 8081, configurable via SERVER_PORT environment variable)
- Set Spring application name to "auth-service"
- Configure MongoDB connection URI (default mongodb://mongodb:27017/battlearena, configurable via MONGODB_URI)
- Configure MongoDB database name (default battlearena, configurable via MONGODB_DATABASE)
- Set JWT secret key (configurable via JWT_SECRET environment variable, with production warning)
- Set JWT expiration time in milliseconds (default 86400000, configurable via JWT_EXPIRATION)
- Configure CORS allowed origins (default "\*", configurable via CORS_ALLOWED_ORIGINS)
- Configure SpringDoc OpenAPI settings:
  - Set API docs path to /api-docs
  - Set Swagger UI path to /swagger-ui.html
  - Configure operation and tag sorting
  - Enable try-it-out functionality
  - Set default media types to application/json
- Configure Spring Boot Actuator:
  - Expose health, info, metrics, and prometheus endpoints
  - Set health details visibility to when-authorized
  - Configure metrics tags with application name and environment
- Configure logging levels:
  - Root logger level (configurable via LOG_LEVEL_ROOT, default INFO)
  - Service-specific logger level (configurable via LOG_LEVEL, default INFO)
  - Spring Web logger level (configurable via LOG_LEVEL_SPRING_WEB, default INFO)
  - Spring Security logger level (configurable via LOG_LEVEL_SPRING_SECURITY, default WARN)
  - MongoDB logger level (configurable via LOG_LEVEL_MONGODB, default WARN)
- Configure logging patterns for console and file output

**Main Application Class:**

- Create `AuthServiceApplication.java` in `com.battlearena.auth_service` package
- Add `@SpringBootApplication` annotation to enable Spring Boot auto-configuration
- Implement main method that calls `SpringApplication.run()`
- Ensure the class serves as the application entry point and component scanning root

**Security Configuration (SecurityConfig.java):**

- Create `SecurityConfig` class in `com.battlearena.auth_service.config` package
- Add `@Configuration` and `@EnableWebSecurity` annotations
- Inject CORS allowed origins from application.yaml using `@Value` annotation
- Create `PasswordEncoder` bean using BCrypt with 12 rounds for high security
- Configure `SecurityFilterChain` bean:
  - Disable CSRF protection (for stateless JWT authentication)
  - Enable CORS with custom configuration source
  - Set session management to stateless
  - Configure authorization rules:
    - Permit all requests to `/api/auth/**` endpoints
    - Permit all requests to `/actuator/health` endpoint
    - Permit all requests to Swagger UI and API docs endpoints
    - Require authentication for all other requests
- Create `CorsConfigurationSource` bean:
  - Parse allowed origins from configuration (support comma-separated values or "\*")
  - Configure allowed HTTP methods (GET, POST, PUT, DELETE, OPTIONS, PATCH)
  - Allow all headers
  - Enable credentials
  - Set preflight request cache to 1 hour

**Swagger Configuration (SwaggerConfig.java):**

- Create `SwaggerConfig` class in `com.battlearena.auth_service.config` package
- Add `@Configuration` annotation
- Create `OpenAPI` bean with:
  - API title: "Battle Arena Auth Service API"
  - API version: "1.0.0"
  - API description: "API documentation for Battle Arena Authentication Service"
  - Contact information (name and email)
  - License information (MIT License)
  - Server URLs for local development and production environments

**Global Exception Handler (GlobalExceptionHandler.java):**

- Create `GlobalExceptionHandler` class in `com.battlearena.auth_service.exception` package
- Add `@RestControllerAdvice` annotation for global exception handling
- Implement exception handler for `MethodArgumentNotValidException`:
  - Extract validation errors from binding result
  - Format error response with timestamp, status, error type, message, and field errors
  - Return HTTP 400 Bad Request status
- Implement exception handler for `UserAlreadyExistsException`:
  - Format error response with timestamp, status, error type, and message
  - Return HTTP 409 Conflict status
- Implement exception handler for `InvalidCredentialsException`:
  - Format error response with timestamp, status, error type, and message
  - Return HTTP 401 Unauthorized status
- Implement generic exception handler for all other exceptions:
  - Format error response with timestamp, status, generic error message
  - Return HTTP 500 Internal Server Error status
  - Log errors for debugging purposes

**Custom Exception Classes:**

- Create `UserAlreadyExistsException` class in `com.battlearena.auth_service.exception` package
  - Extend `Exception` class
  - Accept message parameter in constructor
- Create `InvalidCredentialsException` class in `com.battlearena.auth_service.exception` package
  - Extend `Exception` class
  - Accept message parameter in constructor

**Testing Structure:**

- Create test package structure mirroring main package structure
- Set up test classes for:
  - SecurityConfigTest in config package
  - AuthControllerTest in controller package
  - UserServiceTest in service package
  - UserRepositoryTest in repository package

**Code Quality Configuration:**

- Ensure `checkstyle.xml` file exists in project root
- Configure JaCoCo plugin to enforce 80% minimum code coverage
- Configure Maven compiler plugin to use Java 17 source and target

**Service Documentation:**

- Create or update `README.md` file in `backend-services/auth-service/` directory
- Document technology stack (Spring Boot 3.3.6, Java 17, MongoDB, JWT, BCrypt)
- Document service port (8081)
- Document all API endpoints
- Document required and optional environment variables
- Document local development setup instructions

**Docker Configuration:**

**Dockerfile Implementation:**

- Create `Dockerfile` in `backend-services/auth-service/` directory
- Use multi-stage build:
  - **Build Stage:** Use `maven:3.9-eclipse-temurin-17` as base image
    - Copy `pom.xml` and download dependencies first (cached layer)
    - Copy source code and build JAR file
    - Run `mvn clean package -DskipTests`
  - **Runtime Stage:** Use `eclipse-temurin:17-jre-alpine` as base image
    - Install `wget` for health checks
    - Create non-root user (`spring:spring`)
    - Copy JAR file from build stage
    - Configure health check using actuator endpoint
    - Expose port 8081 (internal container port, not exposed to host)
    - Set entrypoint to run JAR file
- Optimize image size using Alpine-based JRE image
- Follow security best practices (non-root user)

**.dockerignore File:**

- Create `.dockerignore` file in `backend-services/auth-service/` directory
- Exclude unnecessary files:
  - `target/` directory
  - `.git/` directory
  - IDE files (`.idea/`, `*.iml`)
  - OS files (`.DS_Store`)
  - Documentation files (`.md`, `README.md`)
  - Build tools (`mvnw`, `mvnw.cmd`, `.mvn/`)
  - `compose.yaml` (local compose file)

**Docker Compose Configuration:**

- Uncomment `auth-service` section in root `docker-compose.yml` file
- Configure service with:
  - Build context: `./backend-services/auth-service`
  - Dockerfile: `Dockerfile`
  - Container name: `battle-arena-auth-service`
  - **NO ports exposed** (Docker-only deployment, accessed via Nginx)
  - Environment variables:
    - `SPRING_PROFILES_ACTIVE=docker`
    - `MONGODB_URI=mongodb://mongodb:27017/battlearena`
    - `MONGODB_DATABASE=battlearena`
    - `JWT_SECRET=${JWT_SECRET:-changeme}`
    - `JWT_EXPIRATION=${JWT_EXPIRATION:-86400000}`
    - `CORS_ALLOWED_ORIGINS=*`
  - Network: `battle-arena-network`
  - Dependencies: `mongodb` and `redis` (with health check conditions)
  - Restart policy: `unless-stopped`
  - Health check:
    - Command: `wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health`
    - Interval: 30s
    - Timeout: 3s
    - Retries: 3
    - Start period: 40s

**Docker Deployment Notes:**

- Service runs in Docker containers with **NO host ports exposed**
- Services communicate internally via Docker network using service names
- Access is only through Nginx API Gateway (port 80/443 on host)
- Internal container port: 8081 (not exposed to host)
- MongoDB connection: Uses Docker service name "mongodb" (not localhost)
- Application.yaml should include comments clarifying Docker-only deployment

---

**TASK-VS-2-1-2: User Registration Feature (DB + BE + FE)**

**Description:**
Implement complete user registration feature including database model, backend API, password hashing, and frontend registration form. This task combines all registration-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Authentication%20Flow.png) - Registration flow
- [Database Schema Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Database%20Schema%20Class%20Diagram.png) - User entity structure
- [Database ER Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/er-diagrams/Database%20ER%20Diagram.png) - User entity relationships
- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Auth%20Service%20Class%20Diagram.png) - Service layer structure
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png) - AuthService and components
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - User collection schema

**Acceptance Criteria:**

- [ ] User model/entity created with MongoDB annotations and validation
- [ ] UserRepository interface created with query methods
- [ ] Password hashing with BCrypt (12 rounds) configured
- [ ] UserService with registration business logic implemented
- [ ] RegisterRequest and RegisterResponse DTOs created
- [ ] POST /api/auth/register endpoint created in AuthController
- [ ] Registration component created with reactive form
- [ ] Form validation (username, email, password)
- [ ] UserService.registerUser() method implemented
- [ ] Error handling for duplicate username/email
- [ ] Success message and redirect to login page
- [ ] End-to-end test: Fill form → Submit → User created in DB → Success message

**Technical Details:**

**Backend - Database & Model:**
**File:** `com.battlearena.auth.model.User`

**Class Responsibilities (C4 Code Level):**

- **Role:** Domain entity representing a user
- **Responsibilities:**
  - Represent user data structure
  - Enforce data constraints (validation annotations)
  - Provide data structure for MongoDB persistence
- **Dependencies:**
  - MongoDB annotations (`@Document`, `@Id`, `@Indexed`)
  - Validation annotations (`@NotBlank`, `@Size`, `@Email`)
- **Design Pattern:** Domain Entity (Domain-Driven Design)
- **SOLID Principles:**
  - **SRP:** Single responsibility - only represents user data
  - No business logic in entity (separation of concerns)
- **Database Design Standards:**
  - Use `@Indexed(unique = true)` for username and email (performance + data integrity)
  - Use MongoDB ObjectId for primary key (`@Id`)
  - Never expose password hash in API responses (use DTOs)
  - Include audit fields (createdAt, updatedAt, lastLoginAt)

**User Entity Implementation Requirements:**

- Create User class in `com.battlearena.auth_service.model` package
- Add `@Document(collection = "users")` annotation to map to MongoDB collection
- Add `@Id` annotation to id field (String type for MongoDB ObjectId)
- Add `@Indexed(unique = true)` to username field for database uniqueness and performance
- Add `@NotBlank` and `@Size(min = 3, max = 20)` validation annotations to username field
- Add `@Indexed(unique = true)` to email field for database uniqueness and performance
- Add `@NotBlank` and `@Email` validation annotations to email field
- Add passwordHash field (String type, never expose in API responses)
- Add audit fields: createdAt, updatedAt, lastLoginAt (LocalDateTime type)
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Repository:**
**File:** `com.battlearena.auth.repository.UserRepository`

**Class Responsibilities (C4 Code Level):**

- **Role:** Data access abstraction (Repository Pattern)
- **Responsibilities:**
  - Abstract database operations for User entity
  - Provide CRUD operations (inherited from MongoRepository)
  - Provide custom query methods for business needs
  - Handle data persistence and retrieval
- **Dependencies:**
  - MongoDB (database) - via Spring Data MongoDB
  - User entity (data model)
- **Design Pattern:** **Repository Pattern** - Mediates between domain and data mapping layers
- **SOLID Principles:**
  - **SRP:** Single responsibility - only handles data access
  - **DIP:** Depends on abstraction (MongoRepository interface)
  - **ISP:** Specific interface for User operations only
- **Benefits:**
  - Decouples business logic from data access
  - Enables easy testing with mock repositories
  - Centralized data access logic
  - Spring Data MongoDB provides implementation automatically

**UserRepository Implementation Requirements:**

- Create UserRepository interface in `com.battlearena.auth_service.repository` package
- Extend MongoRepository interface with User entity and String ID type
- Add `@Repository` annotation for Spring component scanning
- Define custom query methods that Spring Data MongoDB will auto-implement:
  - `findByUsername(String username)` - Returns Optional<User>, empty if not found
  - `findByEmail(String email)` - Returns Optional<User>, empty if not found
  - `existsByUsername(String username)` - Returns boolean indicating if username exists
  - `existsByEmail(String email)` - Returns boolean indicating if email exists
- Spring Data MongoDB will automatically generate implementation based on method names
- Use Optional return types for find methods to handle null cases safely

**Backend - Security Configuration:**
**File:** `com.battlearena.auth_service.config.SecurityConfig`

**Note:** SecurityConfig is already implemented in VS-2-1-1. This section documents what was configured:

- Password encoder (BCrypt with 12 rounds)
- CORS configuration (reads from application.yaml, supports environment variables)
- CSRF disabled (for stateless JWT authentication)
- Stateless session management
- Public endpoints configured (auth endpoints, health check, Swagger)
- Security filter chain properly configured

**Backend - Swagger Configuration:**
**File:** `com.battlearena.auth_service.config.SwaggerConfig`

**SwaggerConfig Implementation Requirements:**

- Create SwaggerConfig class in `com.battlearena.auth_service.config` package
- Add `@Configuration` annotation for Spring configuration
- Create `OpenAPI` bean method that returns OpenAPI configuration
- Configure API information:
  - Title: "Battle Arena Auth Service API"
  - Version: "1.0.0"
  - Description: "API documentation for Battle Arena Authentication Service"
  - Contact information with team name and email
  - License information (MIT License)
- Configure server URLs:
  - Local development server: http://localhost:8081
  - Production server: https://api.battlearena.com

**Backend - Global Exception Handler:**
**File:** `com.battlearena.auth_service.exception.GlobalExceptionHandler`

**GlobalExceptionHandler Implementation Requirements:**

- Create GlobalExceptionHandler class in `com.battlearena.auth_service.exception` package
- Add `@RestControllerAdvice` annotation for global exception handling across all controllers
- Implement exception handler for `MethodArgumentNotValidException`:
  - Extract field errors from binding result
  - Build error response map with timestamp, HTTP status (400), error type, message, and field-specific errors
  - Return ResponseEntity with Bad Request status
- Implement exception handler for `UserAlreadyExistsException`:
  - Build error response map with timestamp, HTTP status (409 Conflict), error type, and exception message
  - Return ResponseEntity with Conflict status
- Implement exception handler for `InvalidCredentialsException`:
  - Build error response map with timestamp, HTTP status (401 Unauthorized), error type, and exception message
  - Return ResponseEntity with Unauthorized status
- Implement generic exception handler for all other exceptions:
  - Build error response map with timestamp, HTTP status (500), generic error message
  - Log exception details for debugging
  - Return ResponseEntity with Internal Server Error status
- All error responses should include consistent structure: timestamp, status code, error type, and message

**Backend - Custom Exceptions:**
**File:** `com.battlearena.auth_service.exception.UserAlreadyExistsException`

**UserAlreadyExistsException Implementation Requirements:**

- Create UserAlreadyExistsException class in `com.battlearena.auth_service.exception` package
- Extend Exception class
- Add constructor that accepts String message parameter
- Pass message to parent Exception constructor

**File:** `com.battlearena.auth_service.exception.InvalidCredentialsException`

**InvalidCredentialsException Implementation Requirements:**

- Create InvalidCredentialsException class in `com.battlearena.auth_service.exception` package
- Extend Exception class
- Add constructor that accepts String message parameter
- Pass message to parent Exception constructor

**Backend - Service:**
**File:** `com.battlearena.auth.service.UserService`

**Class Responsibilities (C4 Code Level):**

- **Role:** Business logic orchestrator for user operations
- **Responsibilities:**
  - Coordinate user registration operations
  - Coordinate user authentication operations
  - Validate business rules (username uniqueness, email uniqueness)
  - Enforce password security (hashing, validation)
  - Generate JWT tokens for authenticated users
- **Dependencies:**
  - UserRepository (data access) - **Repository Pattern**
  - PasswordEncoder (password hashing) - **Strategy Pattern**
  - JwtTokenManager (token generation) - **Singleton Pattern**
- **Design Pattern:** Service layer with **Strategy Pattern** for authentication
- **SOLID Principles:**
  - **SRP:** Single responsibility - only handles user business logic
  - **DIP:** Depends on abstractions (interfaces), not concrete implementations
  - **OCP:** Open for extension (can add new authentication strategies)

**UserService Implementation Requirements:**

- Create UserService class in `com.battlearena.auth_service.service` package
- Add `@Service` annotation for Spring service component
- Use constructor injection for dependencies (UserRepository, PasswordEncoder, JwtTokenManager)
- Implement `registerUser(RegisterRequest request)` method:
  - Validate input data (username format, email format) - Input validation
  - Check if username exists using UserRepository.existsByUsername() - Business rule validation
  - Check if email exists using UserRepository.existsByEmail() - Business rule validation
  - Throw UserAlreadyExistsException if username or email already exists
  - Hash password using PasswordEncoder.encode() - Security: Never store plain text passwords
  - Create User entity with username, email, hashed password, and audit timestamps
  - Save user to MongoDB using UserRepository.save() - Repository Pattern
  - Return created User entity
- Implement `loginUser(LoginRequest request)` method:
  - Find user by username using UserRepository.findByUsername() - Repository Pattern
  - Throw InvalidCredentialsException if user not found
  - Verify password using PasswordEncoder.matches() - Security: Secure password verification
  - Throw InvalidCredentialsException if password doesn't match
  - Generate JWT token using JwtTokenManager.generateToken() - Singleton Pattern
  - Create AuthResponse DTO with token, username, and email
  - Return AuthResponse
- Follow SOLID principles: Single Responsibility (user operations only), Dependency Inversion (depend on abstractions)

**Backend - DTOs:**

**RegisterRequest Implementation Requirements:**

- Create RegisterRequest class in `com.battlearena.auth_service.dto` package
- Add username field (String) with validation:
  - `@NotBlank` annotation with message "Username is required"
  - `@Size(min = 3, max = 20)` annotation with message "Username must be between 3 and 20 characters"
- Add email field (String) with validation:
  - `@NotBlank` annotation with message "Email is required"
  - `@Email` annotation with message "Email must be valid"
- Add password field (String) with validation:
  - `@NotBlank` annotation with message "Password is required"
  - `@Size(min = 8)` annotation with message "Password must be at least 8 characters"
- Implement getters and setters (or use Lombok @Data annotation)

**RegisterResponse Implementation Requirements:**

- Create RegisterResponse class in `com.battlearena.auth_service.dto` package
- Add id field (String) - User ID from database
- Add username field (String) - User's username
- Add email field (String) - User's email
- Add message field (String) - Success message
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Controller:**
**File:** `com.battlearena.auth.controller.AuthController`

**Class Responsibilities (C4 Code Level):**

- **Role:** Facade for authentication operations (Facade Pattern)
- **Responsibilities:**
  - Handle HTTP requests for authentication endpoints
  - Validate request data using `@Valid` annotations
  - Delegate business logic to UserService
  - Format HTTP responses with proper status codes
  - Handle exceptions (delegated to GlobalExceptionHandler)
- **Dependencies:**
  - UserService (business logic) - **Strategy Pattern**
  - Spring Validation framework (input validation)
- **Design Pattern:** **Facade Pattern** - Provides simplified interface to authentication subsystem
- **SOLID Principles:**
  - **SRP:** Single responsibility - only handles HTTP request/response
  - **DIP:** Depends on UserService abstraction (interface), not implementation
  - **OCP:** Open for extension (can add new endpoints), closed for modification
- **REST API Standards:**
  - Use proper HTTP methods (POST for registration/login)
  - Return appropriate status codes (201 for creation, 200 for success)
  - Use consistent response format (DTOs)
  - Document endpoints with Swagger annotations

**AuthController Implementation Requirements:**

- Create AuthController class in `com.battlearena.auth_service.controller` package
- Add `@RestController` annotation for REST API controller
- Add `@RequestMapping("/api/auth")` annotation to set base path for all endpoints
- Add `@Tag` annotation for Swagger documentation (name: "Authentication", description: "Authentication API endpoints")
- Use constructor injection for UserService dependency (Dependency Inversion Principle)
- Implement `register(@Valid @RequestBody RegisterRequest request)` endpoint:
  - Add `@PostMapping("/register")` annotation
  - Add `@Operation` annotation for Swagger documentation (summary and description)
  - Add `@Valid` annotation to request parameter for automatic validation
  - Delegate business logic to UserService.registerUser() - Facade Pattern
  - Map User domain entity to RegisterResponse DTO (separation of concerns)
  - Set response fields: id, username, email, message ("Registration successful")
  - Return ResponseEntity with HTTP 201 Created status code (REST API standard)
  - Exception handling delegated to GlobalExceptionHandler

**Frontend - Registration Component:**
**File:** `src/app/auth/components/register/register.component.ts`

**RegisterComponent Implementation Requirements:**

- Create RegisterComponent class in `src/app/auth/components/register/` directory
- Add `@Component` decorator with selector "app-register", template, and styles
- Implement OnInit interface
- Create reactive form using FormBuilder with three form controls:
  - username: Required, minimum length 3, maximum length 20
  - email: Required, valid email format
  - password: Required, minimum length 8
- Add errorMessage property (string | null) for displaying error messages
- Add loading property (boolean) for showing loading state during API call
- Inject FormBuilder, AuthService, and Router via constructor
- Implement `onSubmit()` method:
  - Check if form is valid
  - Set loading to true
  - Call AuthService.register() with form values
  - On success: Navigate to login page using Router
  - On error: Extract error message from response, set errorMessage, set loading to false

**Frontend - AuthService.register() Method:**
**File:** `src/app/services/auth.service.ts`

**AuthService.register() Implementation Requirements:**

- Implement register method that accepts RegisterRequest object
- Make HTTP POST request to `${apiUrl}/register` endpoint
- Send userData in request body
- Return Observable<RegisterResponse>
- Handle errors in component subscription

**End-to-End Test Scenario:**

1. Navigate to registration page
2. Fill form with username, email, password
3. Submit form
4. Verify API call to POST /api/auth/register
5. Verify user created in MongoDB with hashed password
6. Verify success message displayed
7. Verify redirect to login page
8. Test duplicate username/email shows error

**Definition of Done:**

- Player can fill registration form → submit → see success message
- User account exists in MongoDB with hashed password
- Duplicate username/email shows error message

---

### VS-2-2: Implement player login with JWT token generation

**User Story:** As a player, I want to login with my username and password so that I can access the game.

**Acceptance Criteria:**

- [ ] Login form visible on frontend
- [ ] Player can enter username and password
- [ ] Login request sent to Auth Service
- [ ] Auth Service validates credentials
- [ ] JWT token generated with proper claims (username, expiration)
- [ ] JWT token returned to frontend
- [ ] Frontend stores JWT token (HTTP-only cookie or secure storage)
- [ ] Player redirected to dashboard after successful login
- [ ] Invalid credentials show error message

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-2-2-1: User Login Feature (BE + FE)**

**Description:**
Implement complete user login feature including JWT token generation, backend login endpoint, and frontend login form. This task combines all login-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Authentication%20Flow.png) - Login flow
- [Session Timeout Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Session%20Timeout%20Flow.png) - Token expiration handling
- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Auth%20Service%20Class%20Diagram.png) - JWT service structure
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png) - AuthService login methods
- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - JWT implementation details

**Acceptance Criteria:**

- [ ] JWT utility class (JwtTokenManager) created with token generation and validation
- [ ] JWT secret and expiration configured in application.yaml
- [ ] UserService.loginUser() method implemented with credential validation
- [ ] LoginRequest and LoginResponse DTOs created
- [ ] POST /api/auth/login endpoint created in AuthController
- [ ] Login component created with reactive form
- [ ] Form validation (username, password required)
- [ ] UserService.loginUser() method implemented
- [ ] JWT token stored in localStorage
- [ ] Error handling for invalid credentials
- [ ] Success redirect to dashboard
- [ ] End-to-end test: Fill form → Submit → JWT received → Redirect to dashboard

**Technical Details:**

**Backend - JWT Utility:**
**File:** `com.battlearena.auth_service.security.JwtTokenManager`

**JwtTokenManager Implementation Requirements:**

- Create JwtTokenManager class in `com.battlearena.auth_service.security` package
- Add `@Component` or `@Service` annotation for Spring dependency injection
- Implement `generateToken(User user)` method:
  - Accept User entity as parameter
  - Extract username from user
  - Create JWT claims with username, expiration time, and issued at time
  - Sign token with HS512 algorithm using secret key from configuration
  - Return JWT token as String
- Implement `validateToken(String token)` method:
  - Accept JWT token string
  - Parse and validate token signature using secret key
  - Return Claims object if valid
  - Throw JwtException if token is invalid or expired
- Implement `extractUsername(String token)` method:
  - Extract username claim from JWT token
  - Return username as String
- Implement `isTokenExpired(String token)` method:
  - Check expiration claim in token
  - Return boolean indicating if token is expired
- Inject JWT secret and expiration from application.yaml configuration

**JWT Configuration:**

- Algorithm: HS512 (HMAC with SHA-512)
- Expiration: 24 hours (86400000 milliseconds)
- Secret Key: Read from environment variable (JWT_SECRET)
- Claims: username, expiration, issuedAt

**Backend - Internal DTO:**
**AuthResponse (used internally by UserService):**

**AuthResponse Implementation Requirements:**

- Create AuthResponse class in `com.battlearena.auth_service.dto` package
- Add token field (String) - JWT token
- Add username field (String) - User's username
- Add email field (String) - User's email
- Implement getters and setters (or use Lombok @Data annotation)
- Used internally by UserService to pass authentication data

**Backend - DTOs:**

**LoginRequest Implementation Requirements:**

- Create LoginRequest class in `com.battlearena.auth_service.dto` package
- Add username field (String) with validation:
  - `@NotBlank` annotation with message "Username is required"
- Add password field (String) with validation:
  - `@NotBlank` annotation with message "Password is required"
- Implement getters and setters (or use Lombok @Data annotation)

**LoginResponse Implementation Requirements:**

- Create LoginResponse class in `com.battlearena.auth_service.dto` package
- Add token field (String) - JWT token
- Add username field (String) - User's username
- Add email field (String) - User's email
- Add message field (String) - Success message
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Controller:**
**File:** `com.battlearena.auth_service.controller.AuthController`

**AuthController.login() Implementation Requirements:**

- Add `login(@Valid @RequestBody LoginRequest request)` method to AuthController
- Add `@PostMapping("/login")` annotation
- Add `@Operation` annotation for Swagger documentation (summary: "Login user")
- Add `@Valid` annotation to request parameter for automatic validation
- Call UserService.loginUser() to get AuthResponse - Facade Pattern
- Map AuthResponse to LoginResponse DTO:
  - Set token from AuthResponse
  - Set username from AuthResponse
  - Set email from AuthResponse
  - Set message to "Login successful"
- Return ResponseEntity with HTTP 200 OK status and LoginResponse body
- Exception handling delegated to GlobalExceptionHandler

**Frontend - Login Component:**
**File:** `src/app/auth/components/login/login.component.ts`

**LoginComponent Implementation Requirements:**

- Create LoginComponent class in `src/app/auth/components/login/` directory
- Add `@Component` decorator with selector "app-login", template, and styles
- Implement OnInit interface
- Create reactive form using FormBuilder with two form controls:
  - username: Required
  - password: Required
- Add errorMessage property (string | null) for displaying error messages
- Add loading property (boolean) for showing loading state during API call
- Inject FormBuilder, AuthService, and Router via constructor
- Implement `onSubmit()` method:
  - Check if form is valid
  - Set loading to true
  - Call AuthService.login() with username and password from form
  - On success: Navigate to dashboard using Router
  - On error: Extract error message from response, set errorMessage, set loading to false

**Frontend - AuthService.login() Method:**
**File:** `src/app/services/auth.service.ts`

**AuthService.login() Implementation Requirements:**

- Implement login method that accepts username and password strings
- Make HTTP POST request to `${apiUrl}/login` endpoint
- Send username and password in request body
- Use RxJS pipe with tap operator to:
  - Store JWT token using setToken() method
  - Store user information using setUser() method
- Return Observable<LoginResponse>
- Handle errors in component subscription

**End-to-End Test Scenario:**

1. Navigate to login page
2. Fill form with username and password
3. Submit form
4. Verify API call to POST /api/auth/login
5. Verify JWT token received and stored
6. Verify redirect to dashboard
7. Test invalid credentials show error message

**Definition of Done:**

- Player can enter credentials → login → receive JWT token
- JWT token stored securely in frontend
- Player can access protected routes with JWT token
- Invalid credentials show error message

---

**TASK-VS-2-2-2: Auth Infrastructure (JWT Storage, Guards, Interceptors)**

**Description:**
Implement shared authentication infrastructure including JWT storage, HTTP interceptor, and route guards. This is shared infrastructure used by both login and logout features.

**Related Diagrams & Documents:**

- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png) - AuthService, Guards, Interceptors
- [Session Timeout Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Session%20Timeout%20Flow.png) - Token validation flow
- [Frontend Components Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) - Component architecture

**Acceptance Criteria:**

- [ ] HTTP interceptor created for JWT injection
- [ ] Interceptor adds Authorization header to requests
- [ ] Interceptor handles 401 errors and redirects to login
- [ ] AuthGuard created for route protection
- [ ] Guard checks authentication state
- [ ] Guard redirects unauthenticated users to login
- [ ] JWT storage mechanism implemented securely
- [ ] Token expiration handling
- [ ] Unit tests for interceptor
- [ ] Unit tests for guard

**Technical Details:**

**HTTP Interceptor:**
**File:** `src/app/interceptors/auth.interceptor.ts`

**AuthInterceptor Implementation Requirements:**

- Create AuthInterceptor class in `src/app/interceptors/` directory
- Add `@Injectable()` decorator
- Implement HttpInterceptor interface
- Inject AuthService and Router via constructor
- Implement `intercept(req: HttpRequest<any>, next: HttpHandler)` method:
  - Get JWT token from AuthService.getToken()
  - If token exists, clone request and add Authorization header with "Bearer {token}" format
  - Pass request to next handler
  - Use RxJS pipe with catchError operator to handle HTTP errors
  - If error status is 401 (Unauthorized):
    - Call AuthService.logout() to clear token
    - Navigate to login page using Router
  - Re-throw error for component handling

**AuthGuard:**
**File:** `src/app/guards/auth.guard.ts`

**AuthGuard Implementation Requirements:**

- Create AuthGuard class in `src/app/guards/` directory
- Add `@Injectable({ providedIn: "root" })` decorator for singleton service
- Implement CanActivate interface
- Inject AuthService and Router via constructor
- Implement `canActivate()` method:
  - Check if user is authenticated using AuthService.isAuthenticated()
  - If authenticated, return true to allow route access
  - If not authenticated, navigate to login page and return false to block route access

---

### VS-2-3: Implement player logout with session termination

**User Story:** As a player, I want to logout so that I can securely end my session.

**Acceptance Criteria:**

- [ ] Logout button visible when player is logged in
- [ ] Clicking logout removes JWT token from storage
- [ ] Player redirected to login page
- [ ] Player cannot access protected routes after logout
- [ ] Session is terminated on client side

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-2-3-1: User Logout Feature (BE + FE)**

**Description:**
Implement complete user logout feature including optional backend logout endpoint and frontend logout functionality. This task combines all logout-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Authentication%20Flow.png) - Logout flow
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Frontend%20Components%20Class%20Diagram.png) - AuthService logout method
- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/class-diagrams/Auth%20Service%20Class%20Diagram.png) - Logout endpoint

**Acceptance Criteria:**

- [ ] POST /api/auth/logout endpoint created (optional - JWT logout is typically client-side)
- [ ] Logout method in AuthService clears token
- [ ] Logout method clears user state
- [ ] Logout button in navigation component
- [ ] Redirect to login after logout
- [ ] Player cannot access protected routes after logout
- [ ] End-to-end test: Click logout → Token removed → Redirect to login → Cannot access protected routes

**Technical Details:**

**Backend - Logout Response DTO:**
**LogoutResponse Implementation Requirements:**

- Create LogoutResponse class in `com.battlearena.auth_service.dto` package
- Add message field (String) - Success message
- Add constructor that accepts message parameter
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Logout Endpoint (Optional):**
**File:** `com.battlearena.auth_service.controller.AuthController`

**AuthController.logout() Implementation Requirements:**

- Add `logout()` method to AuthController
- Add `@PostMapping("/logout")` annotation
- Add `@Operation` annotation for Swagger documentation (summary: "Logout user")
- Optionally invalidate token if using token blacklist mechanism
- Create LogoutResponse with message "Logout successful"
- Return ResponseEntity with HTTP 200 OK status and LogoutResponse body

**Note:** For JWT-based authentication, logout is typically handled client-side by removing the token. Server-side logout is optional and may require a token blacklist.

**Frontend - Logout in AuthService:**
**File:** `src/app/services/auth.service.ts`

**AuthService.logout() Implementation Requirements:**

- Implement logout method with no parameters
- Remove JWT token from localStorage using removeItem("token")
- Clear current user state by setting currentUserSubject to null
- Navigate to login page using Router.navigate(["/auth/login"])

**Frontend - Logout Button Component:**
**File:** `src/app/components/navigation/navigation.component.ts`

**NavigationComponent Implementation Requirements:**

- Create NavigationComponent class in `src/app/components/navigation/` directory
- Add `@Component` decorator with selector "app-navigation" and template
- Inject AuthService and Router via constructor
- Implement `logout()` method:
  - Call AuthService.logout() to handle logout logic
- Implement `isAuthenticated()` method:
  - Return AuthService.isAuthenticated() to check authentication state
  - Used in template to conditionally show/hide logout button

**End-to-End Test Scenario:**

1. Player is logged in
2. Click logout button
3. Verify JWT token removed from localStorage
4. Verify user state cleared
5. Verify redirect to login page
6. Verify cannot access protected routes
7. Verify new login required to access game

**Definition of Done:**

- Player clicks logout → token removed → redirected to login
- Player cannot access protected routes after logout
- New login required to access game

---

## Integration Testing

**Related Diagrams:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/sequence-diagrams/Authentication%20Flow.png) - Complete authentication flow

### End-to-End Test Scenario

1. Navigate to registration page
2. Fill registration form (username, email, password)
3. Submit registration
4. See success message
5. Navigate to login page
6. Enter credentials
7. Submit login
8. Receive JWT token
9. Access protected route (dashboard)
10. Click logout
11. Verify redirected to login
12. Verify cannot access protected route

**Test should pass:** ✅ All steps complete without errors

---

## Security Requirements

**Related Documents:**

- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Complete security implementation guide

### Password Security

- Passwords must be hashed with BCrypt (12 rounds minimum)
- Passwords never stored in plain text
- Password validation (minimum length, complexity if required)

### JWT Token Security

- JWT algorithm: HS512 (HMAC with SHA-512)
- Token expiration: 24 hours
- Secret key stored in environment variables (never in code)
- Token stored securely (HTTP-only cookies preferred, or secure localStorage)

### Input Validation

- Username validation (length, characters)
- Email validation (format)
- Password validation (strength requirements)
- Server-side validation (never trust client)

---

## Dependencies

### Prerequisites

- ✅ Phase 1 (Foundation) must be completed
  - [Phase 1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_1_FOUNDATION.md)
- ✅ MongoDB running (via Docker Compose)
  - [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)
- ✅ Nginx API Gateway configured
  - [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md)

### Blocking Issues

- EPIC-VS-1 (Foundation) must be completed first

---

## Technical Debt & Future Enhancements

### Not in Scope (For Future Epics)

- Google OAuth login (can be added in VS-4 or later)
- Password reset functionality
- Email verification
- Refresh tokens (if needed for longer sessions)
- Two-factor authentication

### Marked for Future

- [ ] Google OAuth integration (optional feature)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Session refresh mechanism

---

## Labels

epic:vertical-slice, epic:authentication, priority:high, milestone:VS-2

## Milestone

VS-2: Player Authentication & Identity

## Related Epics

- EPIC-VS-1: Foundation & Infrastructure Setup (prerequisite)
- EPIC-VS-3: First Playable Match (depends on VS-2)
- EPIC-VS-4: Profile & Progression (depends on VS-2)

```

---

## How to Use This Template

1. **Create Epic Issue:**

   - Copy the EPIC-VS-2 template above
   - Create issue in GitHub
   - Assign to milestone "VS-2: Player Authentication & Identity"

2. **Create Story Issues:**

   - For each VS-2-X story, create a separate issue
   - Link to EPIC-VS-2 as parent
   - Copy tasks from Phase 2 documents
   - Link to Phase 2 issues for technical reference

3. **Create Task Issues:**

   - For each task, create subtask or separate issue
   - Link to story as parent
   - Reference Phase 2 document for technical details

4. **Track Progress:**
   - Use GitHub Projects Kanban board
   - Move stories through: Backlog → To Do → In Progress → Review → Done
   - Update epic when all stories complete

---

## Example Story Issue (VS-2-1)

**Title:** VS-2-1: Implement player registration with username email and password

Description:

## Epic

Related to #X (EPIC-VS-2 issue number)

## User Story

As a player, I want to register with username, email, and password so that I can create an account and play the game.

## Acceptance Criteria

[Copy from EPIC-VS-2 above]

## Technical Reference

- **Auth Service:** See Phase 2, STORY-2-2
  - [Phase 2 Authentication Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_2_AUTHENTICATION.md)
- **Frontend:** See Phase 7, STORY-7-2
  - [Phase 7 Frontend Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_7_FRONTEND.md) (if exists)

## Tasks

- TASK-VS-2-1-2: User Registration Feature (DB + BE + FE)

  - Implementation: Complete registration feature with database, backend, and frontend

- TASK-VS-2-2-1: User Login Feature (BE + FE)

  - Implementation: Complete login feature with JWT token generation

- TASK-VS-2-2-2: Auth Infrastructure (JWT Storage, Guards, Interceptors)

  - Implementation: Shared authentication infrastructure

- TASK-VS-2-3-1: User Logout Feature (BE + FE)
  - Implementation: Complete logout feature

## Labels

story:vertical-slice, backend:auth, frontend, priority:high

## Milestone

VS-2: Player Authentication & Identity

---

**This template demonstrates how to:**

1. Structure vertical slice epics with player focus
2. Reference Phase documents for technical details
3. Break down into player-focused stories
4. Pull tasks from Phase documents
5. Define clear acceptance criteria and definitions of done
```
