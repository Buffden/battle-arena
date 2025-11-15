# Docker Image Building

## Overview

This document outlines the strategy for building Docker images for all services as part of the CI/CD pipeline. Docker image building enables containerization and deployment to various environments.

## Current Status

**Status**: Planned for future implementation (post-Story 1-3)  
**Related**: Deployment workflows (future enhancement)

## Service Architecture

### Services Requiring Docker Images

1. **Java Services** (Spring Boot)
   - auth-service
   - profile-service
   - leaderboard-service

2. **Node.js Services**
   - matchmaking-service
   - game-engine

3. **Frontend Service** (Angular)
   - frontend-service

## Docker Image Strategy

### Multi-Stage Builds

#### Java Services (Spring Boot)

```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Benefits:**
- Smaller final image (no Maven, no source code)
- Faster builds with layer caching
- Security: Minimal attack surface with Alpine Linux

#### Node.js Services

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Benefits:**
- Production dependencies only
- Smaller image size
- Faster container startup

#### Angular Frontend

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Runtime (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist/frontend-service /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- Static files served by Nginx (lightweight)
- Optimized production build
- CDN-ready static assets

## CI/CD Integration

### Workflow Structure

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main, develop]
    tags:
      - 'v*'
  pull_request:
    branches: [main, develop]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [auth-service, profile-service, leaderboard-service, matchmaking-service, game-engine, frontend-service]
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend-services/${{ matrix.service }}
          # or ./frontend-service for frontend
          push: ${{ github.event_name != 'pull_request' }}
          tags: |
            ghcr.io/${{ github.repository_owner }}/${{ matrix.service }}:latest
            ghcr.io/${{ github.repository_owner }}/${{ matrix.service }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Image Tagging Strategy

### Tags

1. **Latest**: `service:latest`
   - Points to most recent main branch build
   - Used for development/testing

2. **Git SHA**: `service:${{ github.sha }}`
   - Immutable tag for specific commit
   - Used for production deployments

3. **Semantic Version**: `service:v1.0.0`
   - Tagged releases
   - Used for production releases

4. **Branch**: `service:${{ github.ref_name }}`
   - Branch-specific builds
   - Used for feature branches

### Tag Generation

```yaml
- name: Generate tags
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ghcr.io/${{ github.repository_owner }}/${{ matrix.service }}
    tags: |
      type=ref,event=branch
      type=ref,event=pr
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      type=sha,prefix={{branch}}-
```

## Image Optimization

### 1. Layer Caching

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

**Benefits:**
- Reuses unchanged layers
- Faster builds
- Reduces build time by 50-80%

### 2. Image Size Optimization

**Strategies:**
- Use Alpine Linux base images
- Multi-stage builds to exclude build tools
- Remove unnecessary files
- Use `.dockerignore` to exclude files

**Example .dockerignore:**
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
*.md
```

### 3. Security Scanning

```yaml
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ghcr.io/${{ github.repository_owner }}/${{ matrix.service }}:${{ github.sha }}
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
  
  - name: Upload Trivy results
    uses: github/codeql-action/upload-sarif@v3
    with:
      sarif_file: trivy-results.sarif
```

**Benefits:**
- Detects vulnerabilities in base images
- Scans application dependencies
- Integrates with GitHub Security tab

## Container Registry Options

### 1. GitHub Container Registry (ghcr.io)

**Pros:**
- Integrated with GitHub
- Free for public repos
- No additional authentication needed
- Supports package management

**Cons:**
- Limited to GitHub users
- Fewer advanced features

### 2. Docker Hub

**Pros:**
- Widely used
- Good documentation
- Public images free

**Cons:**
- Rate limits for free tier
- Requires separate account

### 3. AWS ECR / Azure ACR / GCP GCR

**Pros:**
- Integrated with cloud provider
- Advanced features
- VPC integration

**Cons:**
- Cloud provider specific
- Additional costs
- More complex setup

**Recommendation**: Start with GitHub Container Registry (ghcr.io)

## Build Context Optimization

### 1. Minimize Build Context

```yaml
context: ./backend-services/${{ matrix.service }}
file: ./backend-services/${{ matrix.service }}/Dockerfile
```

**Benefits:**
- Faster build context upload
- Excludes unrelated files
- Better caching

### 2. Use .dockerignore

Create `.dockerignore` in each service directory:
```
node_modules
target
.git
*.md
.env
coverage
```

## Build Performance

### Estimated Build Times

| Service Type | Build Time | Optimized Time |
|--------------|------------|----------------|
| Java (Spring Boot) | 5-8 min | 2-4 min (with cache) |
| Node.js | 3-5 min | 1-2 min (with cache) |
| Angular | 4-6 min | 2-3 min (with cache) |

### Optimization Impact

- **Layer Caching**: 50-80% time reduction
- **Multi-stage Builds**: 30-40% image size reduction
- **Build Context Optimization**: 20-30% time reduction

## Deployment Integration

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  template:
    spec:
      containers:
      - name: auth-service
        image: ghcr.io/owner/auth-service:${{ github.sha }}
        imagePullPolicy: Always
```

### Docker Compose

```yaml
services:
  auth-service:
    image: ghcr.io/owner/auth-service:latest
    pull_policy: always
```

## Security Best Practices

### 1. **Non-Root User**

```dockerfile
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001
USER appuser
```

### 2. **Minimal Base Images**

- Use Alpine Linux when possible
- Avoid `latest` tags (use specific versions)
- Regularly update base images

### 3. **Secret Management**

```yaml
- name: Build with secrets
  run: |
    docker build \
      --secret id=env,src=.env \
      -t image:tag .
```

### 4. **Image Scanning**

- Scan images before pushing
- Fail build on critical vulnerabilities
- Regular security updates

## Workflow Trigger Strategy

### When to Build Images

```yaml
on:
  push:
    branches: [main, develop]  # Build on merge
    tags: ['v*']  # Build on release
  pull_request:
    branches: [main, develop]  # Build but don't push
  workflow_dispatch:  # Manual trigger
```

**Pull Request Strategy:**
- Build images for testing
- Don't push to registry
- Verify build works

**Main/Develop Strategy:**
- Build and push images
- Tag with SHA and branch
- Available for deployment

## Future Enhancements

### 1. **Multi-Architecture Builds**

```yaml
platforms: linux/amd64,linux/arm64
```

### 2. **Image Signing**

```yaml
- name: Sign image
  uses: cosign-action@v2
  with:
    image: ghcr.io/owner/service:${{ github.sha }}
```

### 3. **Image Promotion**

- Promote images between environments
- Staging → Production workflow
- Blue-Green deployment support

### 4. **Automated Rollback**

- Keep previous image versions
- Automatic rollback on deployment failure
- Health check integration

---

**Related Files:**
- Future: `.github/workflows/docker-build.yml`
- Service Dockerfiles (to be created)
- Deployment configurations

---

**Last Updated:** 2024  
**Status:** Planned

