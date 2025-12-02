# EPIC-VS-6: Content Complete - Docker Containerization, Testing, API Documentation, Polish

**Note:** All technical implementation details from Phase 8 (Deployment) and Phase 9 (Quality Assurance) have been consolidated into this file. You no longer need to reference multiple Phase documents when creating GitHub issues.

---

## EPIC-VS-6: Content Complete - Docker Containerization, Testing, API Documentation, Polish

### Issue Template

**Title:** EPIC-VS-6: Content Complete - Docker Containerization, Testing, API Documentation, Polish

**Description:**

## Overview

Implement the sixth vertical slice to reach Content Complete milestone - the game is feature-complete, polished, tested, and ready for final bug fixes. This epic includes deployment infrastructure (Docker, docker-compose, Nginx), comprehensive testing (unit, integration, E2E), API documentation, performance optimization, security hardening, and UI/UX polish. This is the "feature freeze" milestone - no new features, only bug fixes and polish.

**This is the sixth vertical slice** - it prepares the game for launch by ensuring deployment readiness, quality assurance, and polish.

## Vertical Slice Goal

The game is:

1. Fully containerized and deployable (Docker, docker-compose)
2. Comprehensively tested (80%+ unit coverage, integration tests, E2E tests)
3. Fully documented (API docs, deployment guides)
4. Performance optimized (response times, resource usage)
5. Security hardened (vulnerability scanning, secure configurations)
6. UI/UX polished (animations, feedback, error handling)

## Success Criteria

- [ ] All services containerized with Docker (multi-stage builds, optimized images)
- [ ] Docker Compose configuration for local development
- [ ] Nginx API Gateway configured (upstreams, routing, WebSocket support)
- [ ] 80%+ unit test coverage across all services
- [ ] Integration tests for all critical APIs and WebSocket flows
- [ ] E2E tests for complete user journeys
- [ ] Swagger/OpenAPI documentation for all services
- [ ] Performance benchmarks met (response times, throughput)
- [ ] Security vulnerabilities addressed
- [ ] UI/UX polished (loading states, error messages, animations)
- [ ] Deployment documentation complete
- [ ] Monitoring and logging configured

## MVP Scope (Minimal for Content Complete Milestone)

**What's Included:**

- Dockerfiles for all services (Spring Boot, Node.js, Angular)
- Docker Compose for local development
- Nginx API Gateway configuration
- 80%+ unit test coverage
- Integration tests for critical flows
- E2E tests for main user journeys
- Swagger/OpenAPI documentation
- Basic performance optimization
- Security best practices (non-root users, minimal images)
- UI/UX improvements (error handling, loading states)

**What's Deferred:**

- Advanced performance tuning (caching strategies, database optimization)
- Advanced security features (rate limiting, DDoS protection)
- Advanced monitoring (APM, distributed tracing)
- Advanced UI animations and effects
- Load testing and stress testing
- Production deployment automation (Kubernetes, CI/CD for production)

## Technical References

### Phase Documents (Technical Implementation Details)

This epic references Phase 8 (Deployment) and Phase 9 (Quality Assurance) for technical specifications.

- **Deployment:** See Phase 8 (PHASE-8 issue) - STORY-8-1, STORY-8-2, STORY-8-3
- **Quality Assurance:** See Phase 9 (PHASE-9 issue) - STORY-9-1, STORY-9-2, STORY-9-3

### Architecture References

**Architecture Documents:**

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Containerization and deployment
- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Testing approach
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service architecture
- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Security best practices

**Architecture Diagrams:**

- [System Architecture Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/architecture/System%20Architecture.png) - High-level system architecture
- [Container Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/architecture/Container%20Diagram.png) - Container and deployment architecture
- [Deployment Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/architecture/Deployment%20Diagram.png) - Production deployment architecture
- [Component Diagram - Game Engine Service](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/architecture/Component%20Diagram%20-%20Game%20Engine%20Service.png) - Service component architecture

## Stories (Player Experience)

### VS-6-1: Containerize All Services with Docker Multi-Stage Builds and Docker Compose

**User Story:** As a developer, I want the application to be containerized with Docker so that I can deploy it consistently across environments.

**Related Diagrams & Documents:**

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Containerization strategy
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service ports and configuration

**Acceptance Criteria:**

- [ ] Dockerfile for Auth Service (Spring Boot) with multi-stage build
- [ ] Dockerfile for Profile Service (Spring Boot) with multi-stage build
- [ ] Dockerfile for Leaderboard Service (Spring Boot) with multi-stage build
- [ ] Dockerfile for Matchmaking Service (Node.js) with multi-stage build
- [ ] Dockerfile for Game Engine Service (Node.js) with multi-stage build
- [ ] Dockerfile for Frontend (Angular) with multi-stage build
- [ ] All Dockerfiles use appropriate base images
- [ ] Multi-stage builds implemented for optimization
- [ ] Health checks configured for all services
- [ ] Non-root users configured
- [ ] Image sizes optimized
- [ ] .dockerignore files created
- [ ] Docker Compose configuration for local development
- [ ] Nginx API Gateway configured (upstreams, routing, WebSocket support)
- [ ] Health checks configured in docker-compose.yml
- [ ] Service dependencies with health-based conditions
- [ ] End-to-end test: docker-compose up → All services running → Application accessible

**Technical Details:**

**Backend - Spring Boot Dockerfile (Auth Service):**
**File:** `backend-services/auth-service/Dockerfile`

**Spring Boot Dockerfile Implementation Requirements:**

- Create multi-stage Dockerfile with two stages: Build and Runtime
- **Build Stage:**
  - Use base image: maven:3.9-eclipse-temurin-17
  - Set working directory to /app
  - Copy pom.xml file first (for dependency caching)
  - Run mvn dependency:go-offline to download dependencies (creates cached layer)
  - Copy source code (src directory)
  - Run mvn clean package -DskipTests to build JAR file
- **Runtime Stage:**
  - Use base image: eclipse-temurin:17-jre-alpine (smaller runtime image)
  - Set working directory to /app
  - Create non-root user (spring:spring) for security
  - Switch to non-root user
  - Copy JAR file from build stage to app.jar
  - Configure health check:
    - Interval: 30 seconds
    - Timeout: 3 seconds
    - Start period: 40 seconds
    - Retries: 3
    - Command: wget to check /actuator/health endpoint
  - Expose port 8081
  - Set ENTRYPOINT to run Java application: java -jar app.jar

**Backend - Node.js Dockerfile (Matchmaking Service):**
**File:** `backend-services/matchmaking-service/Dockerfile`

**Node.js Dockerfile Implementation Requirements:**

- Create multi-stage Dockerfile with two stages: Build and Runtime
- **Build Stage:**
  - Use base image: node:20-alpine
  - Set working directory to /app
  - Copy package.json and package-lock.json files first (for dependency caching)
  - Run npm ci to install dependencies (clean install for reproducible builds)
  - Clean npm cache to reduce image size
  - Copy all source code
  - Run npm run build to compile TypeScript to JavaScript
- **Runtime Stage:**
  - Use base image: node:20-alpine (smaller runtime image)
  - Set working directory to /app
  - Create non-root user (nodejs:nodejs, UID 1001, GID 1001) for security
  - Switch to non-root user
  - Copy node_modules, dist directory, and package files from build stage
  - Set ownership to nodejs:nodejs for all copied files
  - Configure health check:
    - Interval: 30 seconds
    - Timeout: 3 seconds
    - Start period: 10 seconds
    - Retries: 3
    - Command: Node.js HTTP request to /health endpoint
  - Expose port 3002
  - Set CMD to run Node.js application: node dist/index.js

**Frontend - Angular Dockerfile:**
**File:** `frontend-service/Dockerfile`

**Angular Dockerfile Implementation Requirements:**

- Create multi-stage Dockerfile with two stages: Build and Runtime
- **Build Stage:**
  - Use base image: node:20-alpine
  - Set working directory to /app
  - Copy package.json and package-lock.json files first (for dependency caching)
  - Run npm ci to install dependencies
  - Clean npm cache to reduce image size
  - Copy all source code
  - Run npm run build with production configuration to build Angular application
- **Runtime Stage:**
  - Use base image: nginx:alpine (lightweight web server)
  - Set working directory to /usr/share/nginx/html
  - Remove default Nginx static assets
  - Copy built Angular application from build stage (dist/frontend-service/browser directory)
  - Copy custom Nginx configuration file to /etc/nginx/conf.d/default.conf
  - Configure health check:
    - Interval: 30 seconds
    - Timeout: 3 seconds
    - Start period: 5 seconds
    - Retries: 3
    - Command: wget to check root endpoint
  - Expose port 80
  - Set CMD to start Nginx in foreground mode: nginx -g "daemon off;"

**Frontend - Nginx Configuration (SPA Routing):**
**File:** `frontend-service/nginx.conf`

**Frontend Nginx Configuration Implementation Requirements:**

- Create Nginx server block configuration file
- Configure server to listen on port 80
- Set server_name to localhost
- Set root directory to /usr/share/nginx/html
- Set index file to index.html
- Configure SPA routing:
  - Location block for root path (/)
  - Use try_files directive to serve index.html for all routes (enables client-side routing)
  - Pattern: try_files $uri $uri/ /index.html
- Configure static asset caching:
  - Location block matching static file extensions (js, css, png, jpg, jpeg, gif, ico, svg)
  - Set expires to 1 year for long-term caching
  - Add Cache-Control header with "public, immutable" for browser caching

**API Gateway - Nginx Configuration:**
**File:** `deployments/nginx/nginx.conf`

**API Gateway Nginx Configuration Implementation Requirements:**

- Create main Nginx configuration file for API Gateway
- Configure global settings:
  - Set user to nginx
  - Set worker_processes to auto (based on CPU cores)
  - Configure error log location and log level (warn)
  - Set PID file location
- Configure events block:
  - Set worker_connections to 1024
- Configure http block:
  - Include mime.types for content type detection
  - Set default_type to application/octet-stream
  - Define log format for access logs (include remote_addr, time, request, status, etc.)
  - Configure access_log with main format
  - Enable sendfile, tcp_nopush, tcp_nodelay for performance
  - Set keepalive_timeout to 65 seconds
  - Set types_hash_max_size to 2048
- Configure upstream servers for each service:
  - auth-service: server auth-service:8081
  - profile-service: server profile-service:8082
  - leaderboard-service: server leaderboard-service:8083
  - matchmaking-service: server matchmaking-service:3002
  - game-engine: server game-engine:5002
  - frontend-service: server frontend-service:80
- Configure server block:
  - Listen on port 80
  - Set server_name to localhost
  - Configure health check endpoint (/health):
    - Disable access logging
    - Return HTTP 200 with "healthy" message
    - Set Content-Type header to text/plain
  - Configure REST API proxy locations:
    - /api/auth → proxy to auth-service upstream
    - /api/profile → proxy to profile-service upstream
    - /api/leaderboard → proxy to leaderboard-service upstream
    - Set proxy headers: Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto
  - Configure WebSocket proxy locations:
    - /ws/matchmaking → proxy to matchmaking-service upstream
    - /ws/game → proxy to game-engine upstream
    - Set proxy_http_version to 1.1
    - Set Upgrade and Connection headers for WebSocket upgrade
    - Set proxy_read_timeout to 86400 (24 hours) for long-lived connections
    - Set all standard proxy headers
  - Configure frontend proxy location:
    - / → proxy to frontend-service upstream
    - Set all standard proxy headers

**Docker Compose Configuration:**
**File:** `docker-compose.yml`

**Docker Compose Configuration Implementation Requirements:**

- Create docker-compose.yml file with version 3.8
- Configure database services:
  - **mongodb:**
    - Use image: mongo:6.0
    - Set container name: battle-arena-mongodb
    - Expose port 27017 (development only, remove in production)
    - Set environment variable: MONGO_INITDB_DATABASE=battlearena
    - Configure volumes: mongodb_data for persistence, init scripts directory
    - Add to battle-arena-network
    - Set restart policy: unless-stopped
    - Configure health check: mongosh ping command, interval 10s, timeout 5s, retries 5, start period 40s
  - **redis:**
    - Use image: redis:7-alpine
    - Set container name: battle-arena-redis
    - Expose port 6379 (development only, remove in production)
    - Configure command: redis-server --appendonly yes (for persistence)
    - Configure volumes: redis_data for persistence
    - Add to battle-arena-network
    - Set restart policy: unless-stopped
    - Configure health check: redis-cli ping, interval 10s, timeout 5s, retries 5
- Configure backend services (auth-service, profile-service, leaderboard-service):
  - Build from Dockerfile in respective service directories
  - Set container names with battle-arena prefix
  - Configure environment variables:
    - SPRING_PROFILES_ACTIVE=docker
    - MONGODB_URI=mongodb://mongodb:27017/battlearena
    - REDIS_HOST=redis, REDIS_PORT=6379
    - JWT_SECRET and JWT_EXPIRATION for auth-service (with defaults)
  - Add to battle-arena-network
  - Configure depends_on with health-based conditions for mongodb and redis
  - Set restart policy: unless-stopped
  - Configure health checks: wget to /actuator/health endpoint, interval 30s, timeout 3s, retries 3, start period 40s
- Configure Node.js services (matchmaking-service, game-engine):
  - Build from Dockerfile in respective service directories
  - Set container names with battle-arena prefix
  - Configure environment variables:
    - NODE_ENV=production
    - PORT (3002 for matchmaking, 5002 for game-engine)
    - MONGODB_URI, REDIS_HOST, REDIS_PORT
  - Add to battle-arena-network
  - Configure depends_on with health-based conditions for mongodb and redis
  - Set restart policy: unless-stopped
  - Configure health checks: Node.js HTTP request to /health endpoint, interval 30s, timeout 3s, retries 3, start period 10s
- Configure frontend-service:
  - Build from Dockerfile in frontend-service directory
  - Set container name: battle-arena-frontend
  - Configure environment variables:
    - NODE_ENV=production
    - API_URL=http://nginx/api
    - WS_URL=ws://nginx/ws
  - Add to battle-arena-network
  - Configure depends_on: nginx (no health condition)
  - Set restart policy: unless-stopped
  - Configure health check: wget to root endpoint, interval 30s, timeout 3s, retries 3, start period 5s
- Configure nginx (API Gateway):
  - Use image: nginx:alpine
  - Set container name: battle-arena-nginx
  - Expose port 8080:80 (map host 8080 to container 80)
  - Mount volumes: nginx.conf and conf.d directory
  - Configure depends_on: all backend and frontend services
  - Add to battle-arena-network
  - Set restart policy: unless-stopped
- Configure volumes:
  - mongodb_data: for MongoDB data persistence
  - redis_data: for Redis data persistence
- Configure networks:
  - battle-arena-network: bridge driver for service communication

---

### VS-6-2: Comprehensive Testing with 80%+ Unit Coverage, Integration Tests, and E2E Tests

**User Story:** As a developer, I want comprehensive tests (unit, integration, E2E) so that I can ensure code quality and catch bugs early.

**Related Diagrams & Documents:**

- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Testing approach
- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) - Testing tools

**Acceptance Criteria:**

- [ ] 80%+ unit test coverage for all services
- [ ] Unit tests for all Spring Boot services (Auth, Profile, Leaderboard)
- [ ] Unit tests for all Node.js services (Matchmaking, Game Engine)
- [ ] Unit tests for key frontend components and services
- [ ] Integration tests for all backend APIs
- [ ] Integration tests for WebSocket flows (Matchmaking, Game Engine)
- [ ] E2E tests for authentication flow
- [ ] E2E tests for matchmaking flow
- [ ] E2E tests for gameplay flow
- [ ] E2E tests for profile/leaderboard flow
- [ ] Coverage reports generated in CI/CD
- [ ] Coverage thresholds enforced (80%+)
- [ ] Tests run in CI/CD pipelines
- [ ] End-to-end test: Run all tests → Coverage reports → CI/CD passes

**Technical Details:**

**Backend - Unit Test Example (Java):**
**File:** `backend-services/auth-service/src/test/java/com/battlearena/auth/service/UserServiceTests.java`

**Java Unit Test Implementation Requirements:**

- Create test class in test package mirroring main package structure
- Use JUnit 5 and Mockito for testing
- Add `@ExtendWith(MockitoExtension.class)` annotation to enable Mockito
- Mock dependencies using `@Mock` annotation:
  - UserRepository
  - PasswordEncoder
- Inject service under test using `@InjectMocks` annotation:
  - UserService
- Set up test data in `@BeforeEach` method:
  - Create RegisterRequest object with test data (username, email, password)
- Write test methods following Arrange-Act-Assert pattern:
  - **Test: registerUser_shouldCreateUser_whenValidRequest**
    - Arrange: Mock repository methods to return false for exists checks, mock password encoder to return hashed password, mock save to return user with ID
    - Act: Call service method with RegisterRequest
    - Assert: Verify result is not null, verify username and email match, verify repository.save() was called
  - **Test: registerUser_shouldThrowException_whenUsernameExists**
    - Arrange: Mock repository to return true for username exists check
    - Act & Assert: Verify UserAlreadyExistsException is thrown when service method is called
- Use descriptive test method names following pattern: methodName_shouldDoSomething_whenCondition
- Achieve 80%+ code coverage for all service classes

**Backend - Unit Test Example (Node.js):**
**File:** `backend-services/matchmaking-service/src/__tests__/services/QueueManager.test.ts`

**Node.js Unit Test Implementation Requirements:**

- Create test file in `__tests__` directory mirroring source structure
- Use Jest testing framework
- Mock external dependencies (Redis client) using jest.mock()
- Set up test suite with describe() blocks:
  - Main describe block for class being tested (QueueManager)
  - Nested describe blocks for method groups
- Set up test fixtures in beforeEach():
  - Create mock Redis client object with all required methods (zadd, zrem, zcard, zrevrank, hset, expire)
  - Mock getRedisClient() to return mock Redis client
  - Instantiate service under test (QueueManager)
- Write test cases following Arrange-Act-Assert pattern:
  - **Test: should add player to queue**
    - Arrange: Create QueueEntry object with test data (userId, globalScore, rankTier, heroIds, region, joinedAt), mock Redis methods to return resolved values
    - Act: Call service method (enqueuePlayer) with test entry
    - Assert: Verify Redis methods were called with correct parameters (zadd with queue key, score, userId), verify hset was called
- Use descriptive test descriptions: "should [expected behavior]"
- Achieve 80%+ code coverage for all service classes

**Backend - Integration Test Example (Java):**
**File:** `backend-services/auth-service/src/test/java/com/battlearena/auth/integration/AuthControllerIntegrationTests.java`

**Java Integration Test Implementation Requirements:**

- Create integration test class in integration test package
- Use Spring Boot Test and Testcontainers for real database testing
- Add `@SpringBootTest` annotation with Application class
- Add `@AutoConfigureWebMvc` annotation to enable MockMvc
- Add `@Testcontainers` annotation to enable Testcontainers support
- Set up MongoDB container using `@Container` annotation:
  - Use MongoDBContainer with mongo:6.0 image
  - Configure as static container
- Configure dynamic properties using `@DynamicPropertySource`:
  - Set MongoDB URI from container's replica set URL
- Autowire dependencies:
  - MockMvc for HTTP request testing
  - UserRepository for database cleanup
- Set up test data in `@BeforeEach` method:
  - Delete all users from repository to ensure clean state
- Write integration test methods:
  - **Test: register_shouldCreateUser_whenValidRequest**
    - Create JSON request body with test user data (username, email, password)
    - Perform POST request to /api/auth/register endpoint
    - Set Content-Type to APPLICATION_JSON
    - Assert HTTP status is 201 Created
    - Assert response JSON contains correct username and email
- Test all critical API endpoints end-to-end
- Use real database containers (Testcontainers) for integration testing

**Frontend - E2E Test Example (Cypress):**
**File:** `frontend-service/e2e/auth.cy.ts`

**Cypress E2E Test Implementation Requirements:**

- Create E2E test file in e2e directory
- Use Cypress testing framework
- Set up test suite with describe() block:
  - Describe block for "Authentication Flow"
- Set up test fixtures in beforeEach():
  - Visit login page (/auth/login) before each test
- Write E2E test cases following Arrange-Act-Assert pattern:
  - **Test: should login successfully with valid credentials**
    - Arrange: Type username and password into input fields using data-cy selectors
    - Act: Click login button
    - Assert: Verify URL includes /dashboard, verify user menu is visible
  - **Test: should show error message with invalid credentials**
    - Arrange: Type invalid username and password
    - Act: Click login button
    - Assert: Verify error message is visible and contains "Invalid credentials"
- Use data-cy attributes for reliable element selection
- Test complete user journeys end-to-end (registration, login, matchmaking, gameplay)
- Ensure all critical user flows are covered

---

### VS-6-3: API Documentation with Swagger/OpenAPI Setup for All Services

**User Story:** As a developer, I want comprehensive API documentation so that I can understand and integrate with the APIs easily.

**Related Diagrams & Documents:**

- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Documentation approach
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - API endpoints

**Acceptance Criteria:**

- [ ] Swagger/OpenAPI setup for Spring Boot services (Auth, Profile, Leaderboard)
- [ ] OpenAPI documentation for Node.js services (Matchmaking, Game Engine)
- [ ] All REST API endpoints documented with descriptions
- [ ] All WebSocket endpoints documented
- [ ] Request/response models documented with schemas
- [ ] Authentication flows documented (JWT, OAuth)
- [ ] Error responses documented with status codes and examples
- [ ] Request/response examples provided
- [ ] Validation rules documented
- [ ] Swagger UI accessible for all services
- [ ] OpenAPI specification available in JSON/YAML format
- [ ] Deployment documentation complete
- [ ] End-to-end test: Access Swagger UI → View all endpoints → Test endpoints

**Technical Details:**

**Backend - Swagger Configuration (Spring Boot):**
**File:** `backend-services/auth-service/src/main/java/com/battlearena/auth/config/SwaggerConfig.java`

**SwaggerConfig Implementation Requirements:**

- Create SwaggerConfig class in config package
- Add `@Configuration` annotation for Spring configuration class
- Create `customOpenAPI()` method with `@Bean` annotation
- Configure OpenAPI object with:
  - Info section:
    - Title: "Battle Arena Auth Service API"
    - Version: "1.0.0"
    - Description: "API documentation for Battle Arena Authentication Service"
    - Contact: Name "Battle Arena Team", Email "team@battlearena.com"
    - License: Name "MIT License", URL to MIT license page
  - Servers list:
    - Local Development: http://localhost:8081
    - Production: https://api.battlearena.com
- Return configured OpenAPI bean

**Backend - Controller Annotation Example:**
**File:** `backend-services/auth-service/src/main/java/com/battlearena/auth/controller/AuthController.java`

**Controller Swagger Annotations Implementation Requirements:**

- Add `@Tag` annotation to controller class:
  - Name: "Authentication"
  - Description: "Authentication API endpoints"
- Add `@Operation` annotation to each endpoint method:
  - Summary: Brief description of endpoint purpose
  - Description: Detailed description of endpoint functionality
- Add `@ApiResponses` annotation to document response codes:
  - HTTP 201: Success response with description and response schema
  - HTTP 400: Bad request response with description
  - HTTP 409: Conflict response with description
  - Include `@Content` and `@Schema` annotations for response body structure
- Add `@Parameter` annotation to method parameters:
  - Description: Parameter description
  - Required: true/false flag
- Ensure all endpoints have comprehensive Swagger documentation

**Backend - OpenAPI Configuration (Node.js):**
**File:** `backend-services/matchmaking-service/src/config/swagger.config.ts`

**Node.js Swagger Configuration Implementation Requirements:**

- Import swagger-jsdoc and swagger-ui-express packages
- Create swaggerOptions object with:
  - Definition section:
    - OpenAPI version: "3.0.0"
    - Info section:
      - Title: "Battle Arena Matchmaking Service API"
      - Version: "1.0.0"
      - Description: "API documentation for Battle Arena Matchmaking Service"
      - Contact: Name and email
      - License: Name "MIT" and URL
    - Servers array:
      - Local Development: http://localhost:3002
      - Production: https://api.battlearena.com
  - APIs array: Paths to route and controller files for annotation scanning
- Generate swaggerSpec using swaggerJsdoc with swaggerOptions
- Export swaggerSpec and swaggerUi for use in Express app

---

## Related Epics

- **EPIC-VS-1:** Foundation & Infrastructure Setup (prerequisite)
- **EPIC-VS-2:** Authentication (prerequisite)
- **EPIC-VS-3:** First Playable Match (prerequisite)
- **EPIC-VS-4:** Profile & Progression (prerequisite)
- **EPIC-VS-5:** Full Game Features (prerequisite)

## Dependencies

- VS-1 through VS-5: All previous vertical slices must be complete
- All services must be implemented and functional
- All features must be working end-to-end

## Labels

epic:content-complete, vertical-slice:6, milestone:content-complete, priority:high

## Milestone

Content Complete: Deployment, Testing, Documentation

---

**Note:** This epic consolidates all technical details from Phase 8 (Deployment) and Phase 9 (Quality Assurance). All code snippets, folder structures, class names, and method signatures match the Phase documents exactly for consistency.
