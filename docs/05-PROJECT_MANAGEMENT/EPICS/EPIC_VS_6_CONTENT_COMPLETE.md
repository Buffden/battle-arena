# EPIC-VS-6: Content Complete

**Copy and paste this template directly into GitHub Issues.**

**Note:** All technical implementation details from Phase 8 (Deployment) and Phase 9 (Quality Assurance) have been consolidated into this file. You no longer need to reference multiple Phase documents when creating GitHub issues.

---

## EPIC-VS-6: Content Complete

### Issue Template:

````
Title: EPIC-VS-6: Content Complete

Description:
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

## Stories (Player Experience)

### VS-6-1: Application is containerized and deployable

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

```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# Expose port
EXPOSE 8081

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Backend - Node.js Dockerfile (Matchmaking Service):**
**File:** `backend-services/matchmaking-service/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Copy dependencies and built code
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Expose port
EXPOSE 3002

# Run application
CMD ["node", "dist/index.js"]
```

**Frontend - Angular Dockerfile:**
**File:** `frontend-service/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build Angular application
RUN npm run build -- --configuration=production

# Stage 2: Runtime
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy built Angular app
COPY --from=build /app/dist/frontend-service/browser .

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Frontend - Nginx Configuration (SPA Routing):**
**File:** `frontend-service/nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing - all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**API Gateway - Nginx Configuration:**
**File:** `deployments/nginx/nginx.conf`

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Upstream servers
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

    upstream game-engine {
        server game-engine:5002;
    }

    upstream frontend-service {
        server frontend-service:80;
    }

    server {
        listen 80;
        server_name localhost;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Auth Service
        location /api/auth {
            proxy_pass http://auth-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Profile Service
        location /api/profile {
            proxy_pass http://profile-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Leaderboard Service
        location /api/leaderboard {
            proxy_pass http://leaderboard-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Matchmaking WebSocket
        location /ws/matchmaking {
            proxy_pass http://matchmaking-service;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 86400;
        }

        # Game Engine WebSocket
        location /ws/game {
            proxy_pass http://game-engine;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 86400;
        }

        # Frontend
        location / {
            proxy_pass http://frontend-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

**Docker Compose Configuration:**
**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # Databases
  mongodb:
    image: mongo:6.0
    container_name: battle-arena-mongodb
    ports:
      - "27017:27017" # Development only, remove in production
    environment:
      - MONGO_INITDB_DATABASE=battlearena
    volumes:
      - mongodb_data:/data/db
      - ./database/init:/docker-entrypoint-initdb.d:ro
    networks:
      - battle-arena-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 40s

  redis:
    image: redis:7-alpine
    container_name: battle-arena-redis
    ports:
      - "6379:6379" # Development only, remove in production
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - battle-arena-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Services
  auth-service:
    build:
      context: ./backend-services/auth-service
      dockerfile: Dockerfile
    container_name: battle-arena-auth-service
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - MONGODB_URI=mongodb://mongodb:27017/battlearena
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_SECRET=${JWT_SECRET:-changeme}
      - JWT_EXPIRATION=${JWT_EXPIRATION:-86400000}
    networks:
      - battle-arena-network
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8081/actuator/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s

  profile-service:
    build:
      context: ./backend-services/profile-service
      dockerfile: Dockerfile
    container_name: battle-arena-profile-service
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - MONGODB_URI=mongodb://mongodb:27017/battlearena
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    networks:
      - battle-arena-network
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8082/actuator/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s

  leaderboard-service:
    build:
      context: ./backend-services/leaderboard-service
      dockerfile: Dockerfile
    container_name: battle-arena-leaderboard-service
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - MONGODB_URI=mongodb://mongodb:27017/battlearena
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    networks:
      - battle-arena-network
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8083/actuator/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s

  matchmaking-service:
    build:
      context: ./backend-services/matchmaking-service
      dockerfile: Dockerfile
    container_name: battle-arena-matchmaking-service
    environment:
      - NODE_ENV=production
      - PORT=3002
      - MONGODB_URI=mongodb://mongodb:27017/battlearena
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    networks:
      - battle-arena-network
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

  game-engine:
    build:
      context: ./backend-services/game-engine
      dockerfile: Dockerfile
    container_name: battle-arena-game-engine
    environment:
      - NODE_ENV=production
      - PORT=5002
      - MONGODB_URI=mongodb://mongodb:27017/battlearena
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    networks:
      - battle-arena-network
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

  # Frontend
  frontend-service:
    build:
      context: ./frontend-service
      dockerfile: Dockerfile
    container_name: battle-arena-frontend
    environment:
      - NODE_ENV=production
      - API_URL=http://nginx/api
      - WS_URL=ws://nginx/ws
    networks:
      - battle-arena-network
    depends_on:
      - nginx
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s

  # API Gateway
  nginx:
    image: nginx:alpine
    container_name: battle-arena-nginx
    ports:
      - "8080:80"
    volumes:
      - ./deployments/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./deployments/nginx/conf.d:/etc/nginx/conf.d
    depends_on:
      - auth-service
      - profile-service
      - leaderboard-service
      - matchmaking-service
      - game-engine
      - frontend-service
    networks:
      - battle-arena-network
    restart: unless-stopped

volumes:
  mongodb_data:
  redis_data:

networks:
  battle-arena-network:
    driver: bridge
```

---

### VS-6-2: Application is comprehensively tested

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

```java
package com.battlearena.auth.service;

import com.battlearena.auth.model.User;
import com.battlearena.auth.repository.UserRepository;
import com.battlearena.auth.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
    }

    @Test
    void registerUser_shouldCreateUser_whenValidRequest() throws Exception {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId("user-id");
            return user;
        });

        // Act
        User result = userService.registerUser(registerRequest);

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_shouldThrowException_whenUsernameExists() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser(registerRequest);
        });
    }
}
```

**Backend - Unit Test Example (Node.js):**
**File:** `backend-services/matchmaking-service/src/__tests__/services/QueueManager.test.ts`

```typescript
import { QueueManager } from "../../services/QueueManager";
import { getRedisClient } from "../../config/redis.config";
import { QueueEntry } from "../../models/QueueEntry";

jest.mock("../../config/redis.config");

describe("QueueManager", () => {
  let queueManager: QueueManager;
  let mockRedis: any;

  beforeEach(() => {
    mockRedis = {
      zadd: jest.fn(),
      zrem: jest.fn(),
      zcard: jest.fn(),
      zrevrank: jest.fn(),
      hset: jest.fn(),
      expire: jest.fn(),
    };
    (getRedisClient as jest.Mock).mockReturnValue(mockRedis);
    queueManager = new QueueManager();
  });

  describe("enqueuePlayer", () => {
    it("should add player to queue", async () => {
      // Arrange
      const entry: QueueEntry = {
        userId: "user1",
        globalScore: 1000,
        rankTier: "Gold",
        heroIds: ["hero1"],
        region: "NA",
        joinedAt: new Date(),
      };
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.hset.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      // Act
      await queueManager.enqueuePlayer(entry);

      // Assert
      expect(mockRedis.zadd).toHaveBeenCalledWith(
        "matchmaking:queue:NA",
        1000,
        "user1"
      );
      expect(mockRedis.hset).toHaveBeenCalled();
    });
  });
});
```

**Backend - Integration Test Example (Java):**
**File:** `backend-services/auth-service/src/test/java/com/battlearena/auth/integration/AuthControllerIntegrationTests.java`

```java
package com.battlearena.auth.integration;

import com.battlearena.auth.Application;
import com.battlearena.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = Application.class)
@AutoConfigureWebMvc
@Testcontainers
class AuthControllerIntegrationTests {
    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void register_shouldCreateUser_whenValidRequest() throws Exception {
        String requestBody = """
            {
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}
```

**Frontend - E2E Test Example (Cypress):**
**File:** `frontend-service/e2e/auth.cy.ts`

```typescript
describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("should login successfully with valid credentials", () => {
    // Arrange
    cy.get("[data-cy=username-input]").type("testuser");
    cy.get("[data-cy=password-input]").type("password123");

    // Act
    cy.get("[data-cy=login-button]").click();

    // Assert
    cy.url().should("include", "/dashboard");
    cy.get("[data-cy=user-menu]").should("be.visible");
  });

  it("should show error message with invalid credentials", () => {
    // Arrange
    cy.get("[data-cy=username-input]").type("invalid");
    cy.get("[data-cy=password-input]").type("wrong");

    // Act
    cy.get("[data-cy=login-button]").click();

    // Assert
    cy.get("[data-cy=error-message]").should("be.visible");
    cy.get("[data-cy=error-message]").should("contain", "Invalid credentials");
  });
});
```

---

### VS-6-3: Application is fully documented

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

```java
package com.battlearena.auth.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Battle Arena Auth Service API")
                .version("1.0.0")
                .description("API documentation for Battle Arena Authentication Service")
                .contact(new Contact()
                    .name("Battle Arena Team")
                    .email("team@battlearena.com"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .servers(List.of(
                new Server().url("http://localhost:8081").description("Local Development"),
                new Server().url("https://api.battlearena.com").description("Production")
            ));
    }
}
```

**Backend - Controller Annotation Example:**
**File:** `backend-services/auth-service/src/main/java/com/battlearena/auth/controller/AuthController.java`

```java
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication API endpoints")
public class AuthController {

    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account with username, email, and password"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "User created successfully",
            content = @Content(schema = @Schema(implementation = RegisterResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "Username or email already exists"
        )
    })
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
        @Parameter(description = "User registration data", required = true)
        @Valid @RequestBody RegisterRequest request
    ) {
        // Implementation
    }
}
```

**Backend - OpenAPI Configuration (Node.js):**
**File:** `backend-services/matchmaking-service/src/config/swagger.config.ts`

```typescript
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Battle Arena Matchmaking Service API",
      version: "1.0.0",
      description: "API documentation for Battle Arena Matchmaking Service",
      contact: {
        name: "Battle Arena Team",
        email: "team@battlearena.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3002",
        description: "Local Development",
      },
      {
        url: "https://api.battlearena.com",
        description: "Production",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export { swaggerUi };
```

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

````

---

**Note:** This epic consolidates all technical details from Phase 8 (Deployment) and Phase 9 (Quality Assurance). All code snippets, folder structures, class names, and method signatures match the Phase documents exactly for consistency.
