# Phase 8: Infrastructure & Deployment

**⚠️ NOTE: This is REFERENCE DOCUMENTATION for Infrastructure & Deployment technical details.**

**For implementation planning, see:**

- EPIC-6: Polish & Additional Features (may include deployment tasks)
- All epics may reference deployment configuration from this file

**This phase file contains:**

- Docker configuration
- Docker Compose setup
- Nginx API Gateway configuration
- Deployment architecture
- Environment variable documentation
- Technical implementation details
- Stories and tasks for Infrastructure & Deployment

**Epics will reference this file for technical specs, but implementation follows epic-based feature development (game studio approach).**

---

**Copy and paste these templates directly into GitHub Issues.**

---

## PHASE-8: Infrastructure & Deployment - Technical Reference

### Issue Template:

```
Title: PHASE-8: Infrastructure & Deployment

Description:
## Overview
Containerize all services and provide Docker Compose and Nginx API Gateway configuration for local development and future deployment. This phase document provides technical reference for Dockerfiles, docker-compose, and Nginx routing configuration in line with the deployment architecture.

## Goals
- Dockerfiles for all backend and frontend services
- docker-compose.yml for local multi-service environment
- Nginx API Gateway as single external entrypoint
- Consistent environment variable configuration and documentation

## Success Criteria
- [ ] All services can be built and run via Docker
- [ ] docker-compose brings up full local stack
- [ ] Nginx properly routes requests to services
- [ ] Documentation explains local and deployment setup

## Related Documentation
- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md)

## Labels
phase:deployment, infrastructure, priority:medium

## Milestone
Phase 8: Deployment
```

---

### STORY-8-1: Docker Configuration

#### Issue Template:

```
Title: STORY-8-1: Create Dockerfiles for all services

Description:
## Epic
Related to #X (PHASE-8 issue number)

## User Story
As a developer, I want Dockerfiles for all services so that I can containerize and deploy the application consistently across environments.

## Description
Create comprehensive Dockerfiles for all backend services (Auth, Profile, Leaderboard, Matchmaking, Game Engine) and frontend service using multi-stage builds, health checks, and Docker best practices. Each Dockerfile must optimize for image size, build time, security, and production readiness. The Dockerfiles must follow the deployment architecture specifications, use appropriate base images, implement multi-stage builds for optimization, include health checks, and configure proper environment variables and dependencies.

## Acceptance Criteria
- [ ] Dockerfile for Auth Service (Spring Boot) with multi-stage build
- [ ] Dockerfile for Profile Service (Spring Boot) with multi-stage build
- [ ] Dockerfile for Leaderboard Service (Spring Boot) with multi-stage build
- [ ] Dockerfile for Matchmaking Service (Node.js) with multi-stage build
- [ ] Dockerfile for Game Engine Service (Node.js) with multi-stage build
- [ ] Dockerfile for Frontend (Angular) with multi-stage build
- [ ] All Dockerfiles use appropriate base images
- [ ] Multi-stage builds implemented for optimization
- [ ] Health checks configured for all services
- [ ] Environment variables properly configured
- [ ] Dependencies cached efficiently
- [ ] Security best practices applied (non-root user, minimal base images)
- [ ] Image size optimized
- [ ] Build context optimized (.dockerignore files)
- [ ] Documentation for each Dockerfile

## Technical Details

### Dockerfile Structure
Based on [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) section 2.1:

**Common Structure for Spring Boot Services:**
```

Stage 1: Build

- Use Maven base image
- Copy pom.xml and download dependencies
- Copy source code
- Build JAR file

Stage 2: Runtime

- Use OpenJDK runtime image
- Copy JAR from build stage
- Set non-root user
- Configure health check
- Expose port

```

**Common Structure for Node.js Services:**
```

Stage 1: Build

- Use Node.js base image
- Copy package.json and install dependencies
- Copy source code
- Build/compile TypeScript

Stage 2: Runtime

- Use Node.js alpine image
- Copy dependencies and built code
- Set non-root user
- Configure health check
- Expose port

```

**Common Structure for Angular Frontend:**
```

Stage 1: Build

- Use Node.js base image
- Copy package.json and install dependencies
- Copy source code
- Build Angular application

Stage 2: Runtime

- Use Nginx alpine image
- Copy built Angular app
- Configure Nginx
- Expose port 80

```

### Design Patterns Applied
- **Multi-Stage Build Pattern**: Separate build and runtime stages for optimization
- **Layer Caching Pattern**: Optimize Docker layer caching for faster builds
- **Security Pattern**: Non-root users, minimal base images, security scanning

### Docker Best Practices
- Use specific image versions (not `latest`)
- Implement multi-stage builds
- Use `.dockerignore` files
- Run as non-root user
- Use health checks
- Minimize image size
- Cache dependencies efficiently

## Related Documentation
- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Containerized services (section 2.1)
- [Cluster 1 Deployment Guide](https://github.com/Buffden/battle-arena/blob/main/docs/04-CONFIGURATIONS/cluster-1-student/DEPLOYMENT.md) – Docker Compose configuration
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service ports and configuration

## Labels
phase:deployment, infrastructure, feature, priority:medium

## Milestone
Phase 8: Deployment
```

#### Subtask: TASK-8-1-1: Create Dockerfile for Auth Service (Spring Boot)

````
Title: TASK-8-1-1: Create Dockerfile for Auth Service (Spring Boot)

Description:
## Story
Related to #X (STORY-8-1 issue number)

## Epic
Related to #X (PHASE-8 issue number)

## Description
Create Dockerfile for Auth Service using multi-stage build with Maven for building and OpenJDK for runtime. The Dockerfile must optimize for image size, implement health checks, use non-root user, and configure environment variables for MongoDB and Redis connections.

## Acceptance Criteria
- [ ] Multi-stage Dockerfile created
- [ ] Build stage uses Maven base image
- [ ] Runtime stage uses OpenJDK runtime image
- [ ] Dependencies cached efficiently
- [ ] JAR file built and copied to runtime stage
- [ ] Non-root user configured
- [ ] Health check configured
- [ ] Port 8081 exposed
- [ ] Environment variables documented
- [ ] .dockerignore file created
- [ ] Image size optimized

## Technical Details

### Dockerfile Implementation
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
RUN mvn clean package

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
````

### .dockerignore File

**File:** `backend-services/auth-service/.dockerignore`

```
target/
.git/
.gitignore
.idea/
*.iml
.DS_Store
README.md
```

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Containerized services (section 2.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Auth Service port (section 2.1)

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-1-2: Create Dockerfile for Profile Service (Spring Boot)
```

Title: TASK-8-1-2: Create Dockerfile for Profile Service (Spring Boot)

Description:

## Story

Related to #X (STORY-8-1 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Create Dockerfile for Profile Service using multi-stage build with Maven for building and OpenJDK for runtime. The Dockerfile must follow the same pattern as Auth Service, optimize for image size, implement health checks, and configure environment variables.

## Acceptance Criteria

- [ ] Multi-stage Dockerfile created
- [ ] Build stage uses Maven base image
- [ ] Runtime stage uses OpenJDK runtime image
- [ ] Dependencies cached efficiently
- [ ] JAR file built and copied to runtime stage
- [ ] Non-root user configured
- [ ] Health check configured
- [ ] Port 8082 exposed
- [ ] Environment variables documented
- [ ] .dockerignore file created
- [ ] Image size optimized

## Technical Details

### Dockerfile Implementation

**File:** `backend-services/profile-service/Dockerfile`

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
  CMD wget --no-verbose --tries=1 --spider http://localhost:8082/actuator/health || exit 1

# Expose port
EXPOSE 8082

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Containerized services (section 2.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Profile Service port (section 2.2)

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-1-3: Create Dockerfile for Leaderboard Service (Spring Boot)
```

Title: TASK-8-1-3: Create Dockerfile for Leaderboard Service (Spring Boot)

Description:

## Story

Related to #X (STORY-8-1 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Create Dockerfile for Leaderboard Service using multi-stage build with Maven for building and OpenJDK for runtime. The Dockerfile must follow the same pattern as other Spring Boot services, optimize for image size, implement health checks, and configure environment variables.

## Acceptance Criteria

- [ ] Multi-stage Dockerfile created
- [ ] Build stage uses Maven base image
- [ ] Runtime stage uses OpenJDK runtime image
- [ ] Dependencies cached efficiently
- [ ] JAR file built and copied to runtime stage
- [ ] Non-root user configured
- [ ] Health check configured
- [ ] Port 8083 exposed
- [ ] Environment variables documented
- [ ] .dockerignore file created
- [ ] Image size optimized

## Technical Details

### Dockerfile Implementation

**File:** `backend-services/leaderboard-service/Dockerfile`

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
  CMD wget --no-verbose --tries=1 --spider http://localhost:8083/actuator/health || exit 1

# Expose port
EXPOSE 8083

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Containerized services (section 2.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Leaderboard Service port (section 2.3)

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-1-4: Create Dockerfile for Matchmaking Service (Node.js)
```

Title: TASK-8-1-4: Create Dockerfile for Matchmaking Service (Node.js)

Description:

## Story

Related to #X (STORY-8-1 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Create Dockerfile for Matchmaking Service using multi-stage build with Node.js for building TypeScript and Node.js alpine for runtime. The Dockerfile must optimize for image size, implement health checks, use non-root user, and configure environment variables for MongoDB, Redis, and Socket.io.

## Acceptance Criteria

- [ ] Multi-stage Dockerfile created
- [ ] Build stage uses Node.js base image
- [ ] Runtime stage uses Node.js alpine image
- [ ] Dependencies cached efficiently
- [ ] TypeScript compiled in build stage
- [ ] Non-root user configured
- [ ] Health check configured
- [ ] Port 3002 exposed
- [ ] Environment variables documented
- [ ] .dockerignore file created
- [ ] Image size optimized

## Technical Details

### Dockerfile Implementation

**File:** `backend-services/matchmaking-service/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

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

### .dockerignore File

**File:** `backend-services/matchmaking-service/.dockerignore`

```
node_modules/
dist/
.git/
.gitignore
.env
*.log
.DS_Store
README.md
```

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Containerized services (section 2.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Matchmaking Service port (section 2.4)

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-1-5: Create Dockerfile for Game Engine Service (Node.js)
```

Title: TASK-8-1-5: Create Dockerfile for Game Engine Service (Node.js)

Description:

## Story

Related to #X (STORY-8-1 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Create Dockerfile for Game Engine Service using multi-stage build with Node.js for building TypeScript and Node.js alpine for runtime. The Dockerfile must follow the same pattern as Matchmaking Service, optimize for image size, implement health checks, and configure environment variables.

## Acceptance Criteria

- [ ] Multi-stage Dockerfile created
- [ ] Build stage uses Node.js base image
- [ ] Runtime stage uses Node.js alpine image
- [ ] Dependencies cached efficiently
- [ ] TypeScript compiled in build stage
- [ ] Non-root user configured
- [ ] Health check configured
- [ ] Port 5002 exposed
- [ ] Environment variables documented
- [ ] .dockerignore file created
- [ ] Image size optimized

## Technical Details

### Dockerfile Implementation

**File:** `backend-services/game-engine/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

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
  CMD node -e "require('http').get('http://localhost:5002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Expose port
EXPOSE 5002

# Run application
CMD ["node", "dist/index.js"]
```

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Containerized services (section 2.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Game Engine Service port (section 2.5)

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-1-6: Create Dockerfile for Frontend (Angular)
```

Title: TASK-8-1-6: Create Dockerfile for Frontend (Angular)

Description:

## Story

Related to #X (STORY-8-1 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Create Dockerfile for Frontend Service using multi-stage build with Node.js for building Angular application and Nginx alpine for serving static files. The Dockerfile must optimize for image size, configure Nginx for SPA routing, and implement health checks.

## Acceptance Criteria

- [ ] Multi-stage Dockerfile created
- [ ] Build stage uses Node.js base image
- [ ] Runtime stage uses Nginx alpine image
- [ ] Angular application built in build stage
- [ ] Nginx configured for SPA routing
- [ ] Health check configured
- [ ] Port 80 exposed
- [ ] Environment variables for API URLs
- [ ] .dockerignore file created
- [ ] Image size optimized

## Technical Details

### Dockerfile Implementation

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

### Nginx Configuration

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

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Containerized services (section 2.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Frontend Service (section 2.6)

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

---

### STORY-8-2: Docker Compose Configuration

#### Issue Template:

```

Title: STORY-8-2: Create docker-compose.yml for local development

Description:

## Epic

Related to #X (PHASE-8 issue number)

## User Story

As a developer, I want a Docker Compose configuration so that I can run the entire application stack locally with a single command.

## Description

Create comprehensive Docker Compose configuration for running all services locally, including all backend services, frontend, MongoDB, Redis, and Nginx API Gateway. The configuration must follow the deployment architecture specifications, implement health checks, configure service dependencies, set up shared networks and volumes, and ensure proper service discovery. The docker-compose.yml must enable local development with hot reload capabilities, proper environment variable configuration, and health-based service dependencies.

## Acceptance Criteria

- [ ] docker-compose.yml created at repository root
- [ ] All service containers defined (auth, profile, leaderboard, matchmaking, game-engine, frontend)
- [ ] MongoDB container configured with health checks
- [ ] Redis container configured with health checks
- [ ] Nginx API Gateway container configured
- [ ] Shared network (`battle-arena-network`) configured
- [ ] Named volumes configured (mongodb_data, redis_data)
- [ ] Health checks implemented for all services
- [ ] Service dependencies configured (health-based)
- [ ] Environment variables configured for all services
- [ ] Port mappings configured correctly (only Nginx exposes external ports)
- [ ] Restart policies configured
- [ ] Service discovery via Docker DNS working
- [ ] Documentation for docker-compose usage
- [ ] Test `docker-compose up` successfully starts all services

## Technical Details

### Docker Compose Structure

Based on [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) section 1.1 and [Cluster 1 Deployment Guide](https://github.com/Buffden/battle-arena/blob/main/docs/04-CONFIGURATIONS/cluster-1-student/DEPLOYMENT.md):

**Key Configuration Points:**

- **Network**: `battle-arena-network` (bridge driver) for inter-service communication
- **Volumes**: Named volumes for MongoDB and Redis persistent data
- **Port Exposure**: Only Nginx exposes external ports (80, 443); backend services use internal network only
- **Health Checks**: All services have health checks with appropriate intervals
- **Dependencies**: Health-based dependencies ensure services start in correct order
- **Service Discovery**: Services communicate using Docker DNS service names

### Design Patterns Applied

- **Service Discovery Pattern**: Docker DNS for service-to-service communication
- **Health Check Pattern**: Health checks for service availability
- **Dependency Pattern**: Health-based dependencies for startup ordering
- **Volume Pattern**: Named volumes for persistent data

### Service Configuration

- **Nginx**: External ports 80/443, depends on MongoDB and Redis health
- **MongoDB**: Port 27017 (development only), health check with 40s start period
- **Redis**: Port 6379 (development only), AOF persistence enabled
- **Backend Services**: No external ports, accessed via Nginx, depend on MongoDB/Redis health
- **Frontend**: No external ports, accessed via Nginx

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Docker Compose configuration (section 1.1)
- [Cluster 1 Deployment Guide](https://github.com/Buffden/battle-arena/blob/main/docs/04-CONFIGURATIONS/cluster-1-student/DEPLOYMENT.md) – Docker Compose setup
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service ports and communication

## Labels

phase:deployment, infrastructure, feature, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-2-1: Define all service containers in docker-compose.yml
```

Title: TASK-8-2-1: Define all service containers in docker-compose.yml

Description:

## Story

Related to #X (STORY-8-2 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Define all service containers in docker-compose.yml including auth-service, profile-service, leaderboard-service, matchmaking-service, game-engine, and frontend-service. Each service must have proper build context, container names, environment variables, network configuration, and health checks.

## Acceptance Criteria

- [ ] auth-service container defined with build context
- [ ] profile-service container defined with build context
- [ ] leaderboard-service container defined with build context
- [ ] matchmaking-service container defined with build context
- [ ] game-engine container defined with build context
- [ ] frontend-service container defined with build context
- [ ] All services use correct build contexts
- [ ] Container names follow naming convention
- [ ] Environment variables configured for each service
- [ ] Network configuration applied to all services
- [ ] Health checks configured for all services

## Technical Details

### Service Container Definitions

**File:** `docker-compose.yml`

```yaml
services:
  # Auth Service
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

  # Profile Service
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

  # Leaderboard Service
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

  # Matchmaking Service
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

  # Game Engine Service
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

  # Frontend Service
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
```

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Docker Compose services (section 1.1)
- [Cluster 1 Deployment Guide](https://github.com/Buffden/battle-arena/blob/main/docs/04-CONFIGURATIONS/cluster-1-student/DEPLOYMENT.md) – Service configuration

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-2-2: Configure MongoDB and Redis containers
```

Title: TASK-8-2-2: Configure MongoDB and Redis containers

Description:

## Story

Related to #X (STORY-8-2 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Configure MongoDB and Redis containers in docker-compose.yml with proper health checks, volumes for persistent data, environment variables, and network configuration. The containers must be configured according to the deployment architecture specifications.

## Acceptance Criteria

- [ ] MongoDB container configured with mongo:6.0 image
- [ ] Redis container configured with redis:7-alpine image
- [ ] MongoDB health check configured with 40s start period
- [ ] Redis health check configured
- [ ] Named volumes configured for persistent data
- [ ] Environment variables configured
- [ ] Network configuration applied
- [ ] Port mappings configured (development only)
- [ ] Restart policies configured

## Technical Details

### MongoDB and Redis Configuration

**File:** `docker-compose.yml`

```yaml
services:
  # MongoDB
  mongodb:
    image: mongo:6.0
    container_name: battle-arena-mongodb
    ports:
      - "27017:27017" # Development only, remove in production
    environment:
      - MONGO_INITDB_DATABASE=battlearena
      # Optional for production:
      # - MONGO_INITDB_ROOT_USERNAME=admin
      # - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
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

  # Redis
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
```

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Local databases (section 1.3)
- [Cluster 1 Deployment Guide](https://github.com/Buffden/battle-arena/blob/main/docs/04-CONFIGURATIONS/cluster-1-student/DEPLOYMENT.md) – MongoDB and Redis configuration

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-2-3: Configure volumes and networks
```

Title: TASK-8-2-3: Configure volumes and networks

Description:

## Story

Related to #X (STORY-8-2 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Configure named volumes for persistent data storage (MongoDB and Redis) and shared network for inter-service communication in docker-compose.yml. The volumes must persist data across container restarts, and the network must enable service discovery via Docker DNS.

## Acceptance Criteria

- [ ] Named volume `mongodb_data` configured
- [ ] Named volume `redis_data` configured
- [ ] Network `battle-arena-network` configured with bridge driver
- [ ] Volumes use local driver
- [ ] Network enables service discovery
- [ ] All services connected to network
- [ ] Volumes mounted correctly in services

## Technical Details

### Volumes and Networks Configuration

**File:** `docker-compose.yml`

```yaml
# Volumes - Persistent data storage
volumes:
  mongodb_data:
    driver: local
  redis_data:
    driver: local

# Networks - Inter-service communication
networks:
  battle-arena-network:
    driver: bridge
    name: battle-arena-network
```

### Volume Usage

- **mongodb_data**: Mounted at `/data/db` in MongoDB container for persistent database storage
- **redis_data**: Mounted at `/data` in Redis container for AOF persistence

### Network Usage

- **battle-arena-network**: All services connected to this network
- **Service Discovery**: Services communicate using Docker DNS (e.g., `mongodb:27017`, `redis:6379`, `auth-service:8081`)

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Docker Compose volumes and networks (section 1.1)
- [Cluster 1 Deployment Guide](https://github.com/Buffden/battle-arena/blob/main/docs/04-CONFIGURATIONS/cluster-1-student/DEPLOYMENT.md) – Volumes and networks

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-2-4: Test `docker-compose up` locally
```

Title: TASK-8-2-4: Test `docker-compose up` locally

Description:

## Story

Related to #X (STORY-8-2 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Test the complete Docker Compose setup by running `docker-compose up` and verifying all services start correctly, health checks pass, service discovery works, and services can communicate with each other. Document any issues and create a testing checklist.

## Acceptance Criteria

- [ ] `docker-compose up` command executes successfully
- [ ] All containers start without errors
- [ ] Health checks pass for all services
- [ ] MongoDB accessible via service name
- [ ] Redis accessible via service name
- [ ] Backend services can connect to MongoDB and Redis
- [ ] Nginx can route to backend services
- [ ] Frontend accessible via Nginx
- [ ] Service logs show no critical errors
- [ ] Testing checklist documented
- [ ] Common issues and solutions documented

## Technical Details

### Testing Commands

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Test service health
curl http://localhost/health

# Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Test Redis connection
docker-compose exec redis redis-cli ping

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Testing Checklist

1. All containers start successfully
2. Health checks pass for MongoDB (40s start period)
3. Health checks pass for Redis
4. Health checks pass for all backend services
5. Nginx health check passes
6. Frontend accessible at http://localhost
7. Backend services accessible via Nginx routing
8. MongoDB data persists after container restart
9. Redis data persists after container restart
10. Service discovery works (services can resolve each other by name)

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Docker Compose testing
- [Cluster 1 Deployment Guide](https://github.com/Buffden/battle-arena/blob/main/docs/04-CONFIGURATIONS/cluster-1-student/DEPLOYMENT.md) – Testing procedures

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

---

### STORY-8-3: Nginx API Gateway Configuration

#### Issue Template:

```

Title: STORY-8-3: Configure Nginx as API Gateway

Description:

## Epic

Related to #X (PHASE-8 issue number)

## User Story

As a developer, I want Nginx configured as an API Gateway so that all requests are routed through a single entry point with proper load balancing and WebSocket support.

## Description

Configure Nginx as reverse proxy and API gateway for routing HTTP and WebSocket requests to backend services. The configuration must implement upstream servers for all backend services, location blocks for routing rules, WebSocket upgrade support for matchmaking and game engine services, CORS rules for development, rate limiting, health check endpoints, and proper error handling. The Nginx configuration must follow the deployment architecture specifications, enable service discovery via Docker DNS, and support both REST API and WebSocket communication patterns.

## Acceptance Criteria

- [ ] nginx.conf created under `deployments/nginx/` directory
- [ ] Upstream servers defined for all backend services
- [ ] Location blocks configured for all service routes
- [ ] HTTP routing rules defined (`/api/auth/*`, `/api/profile/*`, `/api/leaderboard/*`)
- [ ] WebSocket routing rules defined (`/ws/matchmaking`, `/ws/game`)
- [ ] WebSocket upgrade headers configured
- [ ] CORS rules configured for development
- [ ] Rate limiting configured (optional, for production)
- [ ] Health check endpoint configured (`/health`)
- [ ] Error pages configured
- [ ] Frontend static file serving configured
- [ ] SPA routing support (all routes serve index.html)
- [ ] Request/response logging configured
- [ ] Security headers configured
- [ ] Configuration tested and verified

## Technical Details

### Nginx Configuration Structure

Based on [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) section 2.2:

**Routing Rules:**

- `/api/auth/*` → auth-service:8081
- `/api/profile/*` → profile-service:8082
- `/api/leaderboard/*` → leaderboard-service:8083
- `/ws/matchmaking` → matchmaking-service:3002 (WebSocket)
- `/ws/game` → game-engine:5002 (WebSocket)
- `/` → frontend-service:80 (static files)

### Design Patterns Applied

- **Reverse Proxy Pattern**: Nginx as reverse proxy for backend services
- **API Gateway Pattern**: Single entry point for all API requests
- **Load Balancing Pattern**: Upstream servers for load distribution
- **WebSocket Proxy Pattern**: WebSocket upgrade and proxy support

### Nginx Features

- Upstream server definitions
- Location-based routing
- WebSocket upgrade support
- CORS configuration
- Rate limiting (optional)
- Health check endpoints
- Error handling
- Static file serving
- SPA routing support

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – API Gateway configuration (section 2.2)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service ports and routing
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – WebSocket patterns

## Labels

phase:deployment, infrastructure, feature, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-3-1: Create nginx.conf with upstreams and location blocks
```

Title: TASK-8-3-1: Create nginx.conf with upstreams and location blocks

Description:

## Story

Related to #X (STORY-8-3 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Create comprehensive nginx.conf configuration file with upstream server definitions for all backend services and location blocks for routing HTTP requests. The configuration must define upstreams for auth-service, profile-service, leaderboard-service, matchmaking-service, game-engine, and frontend-service, and implement location-based routing rules.

## Acceptance Criteria

- [ ] nginx.conf file created in `deployments/nginx/` directory
- [ ] Upstream servers defined for all backend services
- [ ] Location blocks configured for REST API routes
- [ ] Location block configured for frontend static files
- [ ] Health check endpoint configured
- [ ] Error handling configured
- [ ] Request logging configured
- [ ] Security headers configured
- [ ] Configuration syntax validated

## Technical Details

### Nginx Configuration

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

        # Auth Service API
        location /api/auth/ {
            proxy_pass http://auth-service/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Profile Service API
        location /api/profile/ {
            proxy_pass http://profile-service/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Leaderboard Service API
        location /api/leaderboard/ {
            proxy_pass http://leaderboard-service/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Frontend static files
        location / {
            proxy_pass http://frontend-service/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – API Gateway routing (section 2.2)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service ports

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-3-2: Configure WebSocket proxy for matchmaking/game engine
```

Title: TASK-8-3-2: Configure WebSocket proxy for matchmaking/game engine

Description:

## Story

Related to #X (STORY-8-3 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Configure WebSocket proxy support in nginx.conf for matchmaking-service and game-engine services. The configuration must include WebSocket upgrade headers, connection upgrade handling, timeout settings, and proper routing for WebSocket endpoints.

## Acceptance Criteria

- [ ] WebSocket location blocks configured for `/ws/matchmaking`
- [ ] WebSocket location blocks configured for `/ws/game`
- [ ] WebSocket upgrade headers configured
- [ ] Connection upgrade handling implemented
- [ ] WebSocket timeouts configured
- [ ] Proxy buffering disabled for WebSocket
- [ ] WebSocket routing tested and verified

## Technical Details

### WebSocket Configuration

**File:** `deployments/nginx/nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;

    # Matchmaking Service WebSocket
    location /ws/matchmaking {
        proxy_pass http://matchmaking-service;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket specific settings
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
        proxy_buffering off;
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

        # WebSocket specific settings
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
        proxy_buffering off;
    }
}
```

### WebSocket Configuration Details

- **Upgrade Header**: Required for WebSocket handshake
- **Connection Header**: Set to "upgrade" for WebSocket connections
- **Timeouts**: Extended timeouts (86400s = 24 hours) for long-lived connections
- **Buffering**: Disabled for real-time communication
- **HTTP Version**: 1.1 required for WebSocket support

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – WebSocket routing (section 2.2)
- [Communication Patterns](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/05-COMMUNICATION_PATTERNS.md) – WebSocket patterns

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```

#### Subtask: TASK-8-3-3: Test routing through Nginx against local stack
```

Title: TASK-8-3-3: Test routing through Nginx against local stack

Description:

## Story

Related to #X (STORY-8-3 issue number)

## Epic

Related to #X (PHASE-8 issue number)

## Description

Test Nginx routing configuration by starting the Docker Compose stack and verifying all routes work correctly, WebSocket connections establish successfully, and error handling functions properly. Document test results and create a routing test checklist.

## Acceptance Criteria

- [ ] Nginx configuration syntax validated (`nginx -t`)
- [ ] All HTTP routes tested and working
- [ ] WebSocket connections tested and working
- [ ] Health check endpoint tested
- [ ] Frontend routing tested
- [ ] Error handling tested
- [ ] CORS headers verified
- [ ] Request logging verified
- [ ] Routing test checklist documented
- [ ] Common issues and solutions documented

## Technical Details

### Testing Commands

```bash
# Validate Nginx configuration
docker-compose exec nginx nginx -t

# Test HTTP routes
curl http://localhost/api/auth/health
curl http://localhost/api/profile/health
curl http://localhost/api/leaderboard/health

# Test WebSocket connection (using wscat or similar)
wscat -c ws://localhost/ws/matchmaking

# Test frontend
curl http://localhost/

# Check Nginx logs
docker-compose logs nginx
```

### Routing Test Checklist

1. Nginx configuration syntax valid
2. Health check endpoint returns "healthy"
3. `/api/auth/*` routes to auth-service
4. `/api/profile/*` routes to profile-service
5. `/api/leaderboard/*` routes to leaderboard-service
6. `/ws/matchmaking` establishes WebSocket connection
7. `/ws/game` establishes WebSocket connection
8. Frontend accessible at `/`
9. SPA routing works (all routes serve index.html)
10. CORS headers present in responses
11. Error pages display correctly
12. Request logging working

## Related Documentation

- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) – Nginx testing
- [Cluster 1 Deployment Guide](https://github.com/Buffden/battle-arena/blob/main/docs/04-CONFIGURATIONS/cluster-1-student/DEPLOYMENT.md) – Testing procedures

## Labels

phase:deployment, infrastructure, task, priority:medium

## Milestone

Phase 8: Deployment

```


```
