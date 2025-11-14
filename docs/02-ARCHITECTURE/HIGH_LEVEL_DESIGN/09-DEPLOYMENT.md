# Deployment Architecture

**Part of:** [High-Level Design (HLD)](./README.md)  
**Last Updated:** 2024

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**This document and all implementation MUST strictly adhere to the following principles:**

1. **REUSABILITY** - All components, services, and utilities MUST be designed for maximum reusability across the system
2. **GOOD CODE PRACTICES** - Follow SOLID principles, DRY (Don't Repeat Yourself), and industry best practices
3. **CLEAN CODE** - Code must be readable, self-documenting, and maintainable
4. **CLEAN ARCHITECTURE** - Strict separation of concerns with clear boundaries between layers
5. **SECURE PROGRAMMING** - Security-first approach with defense in depth, input validation, and secure communication

**These principles are NON-NEGOTIABLE and must be enforced in every line of code and every architectural decision.**

---

## 1. Development Environment

### 1.1 Docker Compose (Recommended for Student Projects)
- **Docker Compose** for local development and student projects
- **Service orchestration** - All services orchestrated via Docker Compose
- **Local databases** - MongoDB and Redis running in containers
- **Service networking** - Services communicate via Docker network
- **Single server deployment** - All services on single server/VM (for student projects)
- **Cost:** $0/month (local) or $5-10/month (small cloud VM)
- **Student Recommendation:** Use Docker Compose for <1,000 users/month (simpler, free, easier to manage)

**Implementation Details:**

The Docker Compose configuration is located in the root `docker-compose.yml` file. Key implementation details:

**Configuration File**: `docker-compose.yml` in project root

**Network**: 
- Network name: `battle-arena-network`
- Driver: `bridge`
- Purpose: Enables inter-service communication using Docker DNS service names

**Services**:

1. **Nginx API Gateway** (Container: `battle-arena-nginx`)
   - Image: `nginx:latest`
   - External Ports: `80:80` (HTTP), `443:443` commented for future SSL
   - Internal Access: Only service with external ports exposed
   - Configuration: Mounted from `./deployments/nginx/nginx.conf` (read-only)
   - Health Check: `nginx -t` every 30s
   - Dependencies: Waits for MongoDB and Redis to be healthy

2. **MongoDB** (Container: `battle-arena-mongodb`)
   - Image: `mongo:6.0` (version pinned)
   - External Port: `27017:27017` (development only, remove in production)
   - Internal Access: Services connect via `mongodb:27017`
   - Database: `battlearena` (set via MONGO_INITDB_DATABASE)
   - Volumes:
     - `mongodb_data:/data/db` (persistent data)
     - `./database/init:/docker-entrypoint-initdb.d:ro` (init scripts)
   - Health Check: `mongosh --eval "db.adminCommand('ping')"` every 10s
   - Start Period: 40s grace period before health checks begin

3. **Redis** (Container: `battle-arena-redis`)
   - Image: `redis:7-alpine` (lightweight, version pinned)
   - External Port: `6379:6379` (development only, remove in production)
   - Internal Access: Services connect via `redis:6379`
   - Persistence: AOF enabled (`--appendonly yes`)
   - Volume: `redis_data:/data` (persistent data)
   - Health Check: `redis-cli ping` every 10s

4. **Backend Services** (Commented out, ready for implementation)
   - Auth Service (Spring Boot, port 8081)
   - Profile Service (Spring Boot, port 8082)
   - Leaderboard Service (Spring Boot, port 8083)
   - Matchmaking Service (Node.js, port 3002, WebSocket)
   - Game Engine (Node.js, port 5002, WebSocket)
   - Frontend Service (Angular, port 4200)
   - All backend services have NO host ports - accessed only via Nginx

**Volumes**: 
- `mongodb_data`: Named volume for MongoDB persistent storage
- `redis_data`: Named volume for Redis persistent storage
- Both use `local` driver and persist data across container restarts

**Health Checks**: 
- Implemented for all services (Nginx, MongoDB, Redis)
- Proper intervals (10s for DBs, 30s for Nginx), timeouts (5s), and retries (3-5)
- MongoDB has 40s start period to allow initialization

**Dependencies**: 
- Health-based dependencies using `condition: service_healthy`
- Ensures services start in correct order (databases first, then Nginx)

**Restart Policies**: 
- All services use `restart: unless-stopped`
- Ensures services automatically restart on failure

**Service Discovery**: 
- Services communicate using Docker DNS service names
- Examples: `mongodb:27017`, `redis:6379`, `auth-service:8081`
- Never use `localhost` or `127.0.0.1` - always use service names

**Port Exposure Rules**:
- **Nginx**: ONLY service with external ports (80, 443)
- **Backend Services**: NO host ports exposed - internal only
- **Databases**: Ports exposed ONLY for development convenience (debugging, direct access)
  - In production: Remove port mappings, use internal network only

### 1.2 Hot Reload
- **Hot reload** for development services
- **Code changes** - Automatic code reload on changes
- **Development tools** - Development tools and debuggers
- **Local testing** - Local testing environment

### 1.3 Local Databases
- **MongoDB** - Local MongoDB instance
- **Redis** - Local Redis instance
- **Database seeding** - Database seeding for development
- **Database backups** - Local database backups

---

## 2. Production Environment

### 2.1 Containerized Services

#### **Student Projects (<1,000 users/month) - Minimal Configuration**
- **Containerized services** using Docker
- **Docker images** - Docker images for all services
- **Container registry** - Docker Hub (free for public images) or GitHub Container Registry (free)
- **Container orchestration** - Docker Compose (recommended for student projects)
- **Single server deployment** - All services on single server/VM (2 CPU, 4GB RAM)
- **Service networking** - Services communicate via Docker network
- **Configuration** - Environment variables or Docker Compose environment files
- **Secrets** - Environment variables or Docker Compose secrets
- **Health Checks** - Docker health checks (basic)
- **Manual Updates** - Manual deployment updates (acceptable for student projects)
- **Cost:** $0-10/month (within free tier limits or small cloud VM)
- **Student Recommendation:** Use Docker Compose for <1,000 users/month (simpler, free, easier to manage)

#### **Production (High Traffic >10,000 users/day) - Full Configuration**
- **Containerized services** using Docker
- **Docker images** - Docker images for all services
- **Container registry** - Container registry for images (Docker Hub, AWS ECR, Azure ACR, GCR)
- **Container orchestration** - Kubernetes orchestration for production
- **Kubernetes cluster** - Kubernetes cluster for managing containers
- **Deployment manifests** - Kubernetes deployment manifests for all services
- **Service definitions** - Kubernetes service definitions for service discovery
- **ConfigMaps** - Kubernetes ConfigMaps for configuration management
- **Secrets** - Kubernetes Secrets or HashiCorp Vault for secret management
- **Ingress** - Kubernetes Ingress for external access
- **Network Policies** - Kubernetes Network Policies for security
- **Resource Limits** - CPU and memory limits for containers
- **Health Checks** - Liveness, readiness, and startup probes
- **Rolling Updates** - Zero-downtime deployments
- **Rollback Capability** - Quick rollback on failures
- **Cost:** $110-3,200/month (depending on traffic)

### 2.2 API Gateway and Reverse Proxy

#### **Student Projects (<1,000 users/month) - Minimal Configuration**
- **API Gateway** (Nginx) for simple API management (single instance, free)
- **Request routing** - Route requests to appropriate services
- **Load balancing** - Basic load balancing (round-robin) for multiple service instances
- **SSL termination** - SSL/TLS termination at API gateway (free: Let's Encrypt)
- **Rate limiting** - Basic rate limiting per IP (sufficient for student projects)
- **Authentication** - JWT validation at gateway level (optional, can be done in services)
- **Health checks** - Basic health check endpoints
- **Sticky sessions** - Session affinity for WebSocket connections (basic)
- **Cost:** $0/month (self-hosted, free)
- **Student Recommendation:** Use Nginx (simpler, free, sufficient for student projects)

**Current Implementation:**
- **Configuration File**: `deployments/nginx/nginx.conf`
- **Mount Location**: `/etc/nginx/nginx.conf` (read-only) in container
- **Current Status**: Placeholder configuration with health check endpoint
- **Health Endpoint**: `/health` returns "healthy" status
- **Future Implementation**: Full service routing will be added in TASK-1-2-8
  - `/api/auth/*` → auth-service (port 8081)
  - `/api/profile/*` → profile-service (port 8082)
  - `/api/leaderboard/*` → leaderboard-service (port 8083)
  - `/ws/matchmaking` → matchmaking-service (port 3002, WebSocket)
  - `/ws/game` → game-engine (port 5002, WebSocket)
- **External Ports**: 80 (HTTP), 443 (HTTPS - commented out, ready for SSL configuration)

#### **Production (High Traffic >10,000 users/day) - Full Configuration**
- **API Gateway** (Kong/Apigee/Nginx) for centralized API management
- **Request routing** - Route requests to appropriate services
- **Load balancing** - Load balance across service instances (round-robin, least connections, IP hash)
- **SSL termination** - SSL/TLS termination at API gateway
- **Rate limiting** - Rate limiting per IP, per user, per API
- **Authentication** - JWT validation at gateway level
- **API versioning** - Support for multiple API versions
- **Request/response transformation** - Transform requests and responses
- **API analytics** - Monitor API usage and performance
- **Health checks** - Health check endpoints for service instances
- **Sticky sessions** - Session affinity for WebSocket connections
- **Reverse proxy** (Nginx) as alternative or additional layer
- **Cost:** $0/month (self-hosted) or $100-500/month (managed API Gateway)

### 2.3 SSL/TLS Certificates
- **SSL/TLS certificates** for HTTPS
- **Certificate management** - Certificate management and renewal
- **HTTPS enforcement** - Enforce HTTPS for all communications
- **Certificate validation** - Certificate validation and verification

### 2.4 Environment-Based Configuration
- **Environment-based configuration** via environment variables
- **Kubernetes ConfigMaps** - Configuration management via ConfigMaps
- **Kubernetes Secrets** - Secret management via Kubernetes Secrets
- **HashiCorp Vault** - Enterprise secret management (alternative)
- **Configuration management** - Centralized configuration management system
- **Secret rotation** - Automatic secret rotation
- **Configuration validation** - Configuration validation on startup
- **Configuration versioning** - Version control for configurations

### 2.5 Logging and Monitoring

#### **Student Projects (<1,000 users/month) - Minimal Configuration**
- **Logging infrastructure** - Optional (skip initially) OR Grafana Cloud free tier (50GB logs)
  - **Free Options:** Grafana Cloud free tier (50GB logs), skip logging initially
  - **Student Recommendation:** Skip logging initially or use Grafana Cloud free tier (sufficient for student projects)
- **Monitoring infrastructure** - Optional (skip initially) OR Grafana Cloud free tier (10k metrics)
  - **Free Options:** Grafana Cloud free tier (10k metrics, 50GB logs), skip monitoring initially
  - **Student Recommendation:** Skip monitoring initially or use Grafana Cloud free tier (sufficient for student projects)
- **Distributed tracing** - Optional (skip for student projects)
  - **Student Recommendation:** Skip tracing for <1,000 users/month (adds complexity, not needed for low traffic)
- **Cost:** $0/month (skip monitoring/logging/tracing) OR $0/month (Grafana Cloud free tier)
- **Student Recommendation:** Skip monitoring/logging/tracing initially, add when needed or traffic increases

#### **Production (High Traffic >10,000 users/day) - Full Configuration**
- **Logging infrastructure** - ELK Stack (Elasticsearch, Logstash, Kibana) or Loki + Grafana (lighter alternative)
  - **Free Options:** Self-hosted ELK Stack (free, open source), Loki + Grafana (free, open source, lighter)
  - **Recommendation:** Use Loki + Grafana (lighter, easier to set up) or self-hosted ELK Stack (free)
- **Centralized logging** - Centralized log aggregation from all services
- **Log retention** - Configurable log retention policies
- **Log search** - Advanced log search and filtering
- **Monitoring infrastructure** - Prometheus, Grafana, AlertManager
  - **Free Options:** Self-hosted Prometheus + Grafana (free, open source), Grafana Cloud free tier (10k metrics, 50GB logs, 50GB traces)
  - **Recommendation:** Use self-hosted Prometheus + Grafana (free) or Grafana Cloud free tier
- **Metrics collection** - Application and infrastructure metrics
- **Custom metrics** - Business-specific metrics
- **Dashboards** - Pre-built and custom dashboards
- **Alerting** - Alerting on critical issues
- **Performance monitoring** - Performance monitoring and metrics
- **Distributed tracing** - Jaeger/Zipkin for request tracing
  - **Free Options:** Jaeger (free, open source), Zipkin (free, open source)
  - **Recommendation:** Use Jaeger (free, more features, better UI)
- **Service-level indicators (SLIs)** - Service-level indicators
- **Service-level objectives (SLOs)** - Service-level objectives
- **Cost:** $0/month (self-hosted) or $100-500/month (managed monitoring/logging)

---

## 3. Deployment Strategies

### 3.1 Blue-Green Deployment
- **Blue-Green Deployment** for zero-downtime deployments
- **Service switching** - Switch between blue and green environments
- **Rollback capability** - Rollback to previous version if needed
- **Health checks** - Health checks before switching

### 3.2 Canary Deployment
- **Canary Deployment** for gradual rollouts
- **Gradual rollout** - Gradually roll out new versions
- **Traffic splitting** - Split traffic between old and new versions
- **Monitoring** - Monitor new version performance

### 3.3 Rolling Deployment
- **Rolling Deployment** for gradual updates
- **Service updates** - Update services one by one
- **Health checks** - Health checks after each update
- **Rollback capability** - Rollback if issues occur

---

## 4. Infrastructure as Code

### 4.1 Docker Compose
- **Docker Compose** for local development
- **Service definitions** - Service definitions in docker-compose.yml (located in project root)
- **Network configuration** - `battle-arena-network` (bridge driver) for inter-service communication
- **Volume management** - Named volumes for data persistence (`mongodb_data`, `redis_data`)
- **Health checks** - Implemented for all services (MongoDB, Redis, Nginx)
- **Service discovery** - Services communicate via Docker DNS using service names
- **Dependencies** - Health-based dependencies ensure services start in correct order
- **Restart policies** - `restart: unless-stopped` for all services

**Current Implementation:**
- **Location**: Root `docker-compose.yml`
- **Active Services**: Nginx (API Gateway), MongoDB 6.0, Redis 7-alpine
- **Backend Services**: Templates defined (commented out, ready for implementation)
- **Network**: `battle-arena-network` with bridge driver
- **Volumes**: Persistent storage for MongoDB and Redis data

### 4.2 Container Orchestration (Kubernetes / Docker Compose)

#### **Student Projects (<1,000 users/month) - Docker Compose (Recommended)**
- **Docker Compose** for simple orchestration (recommended for student projects)
- **Single server deployment** - All services on single server/VM (2 CPU, 4GB RAM)
- **Service definitions** - Docker Compose service definitions
- **Configuration** - Environment variables or Docker Compose environment files
- **Secrets** - Environment variables or Docker Compose secrets
- **Networking** - Docker network for service communication
- **Health Checks** - Docker health checks (basic)
- **Manual Scaling** - Manual scaling by adjusting replicas in Docker Compose
- **Manual Updates** - Manual deployment updates (acceptable for student projects)
- **Service Mesh** - Skip Service Mesh (not needed for student projects)
- **Cost:** $0/month (local) or $5-10/month (small cloud VM)
- **Student Recommendation:** Use Docker Compose for <1,000 users/month (simpler, free, easier to manage)

#### **Production (High Traffic >10,000 users/day) - Kubernetes (Recommended)**
- **Kubernetes orchestration** for production
- **Kubernetes cluster** - Managed Kubernetes cluster (EKS, AKS, GKE, or self-hosted)
  - **Free Options:** Minikube (local), Kind (local), K3s (lightweight), cloud free tiers (GKE free tier: 1 cluster, 1 node, 720 hours/month)
  - **Recommendation:** Use Minikube/Kind for local development, cloud free tiers or managed Kubernetes for production
- **Deployment manifests** - Kubernetes deployment manifests for all services
- **Service definitions** - Kubernetes service definitions for service discovery
- **ConfigMaps** - Kubernetes ConfigMaps for configuration management
- **Secrets** - Kubernetes Secrets or HashiCorp Vault Open Source for secret management
  - **Recommendation:** Use Kubernetes Secrets (free, built-in) or Vault Open Source (free)
- **Ingress** - Kubernetes Ingress for external access
- **Network Policies** - Kubernetes Network Policies for security
- **Resource Limits** - CPU and memory limits for containers
- **Health Checks** - Liveness, readiness, and startup probes
- **Auto-scaling** - Horizontal Pod Autoscaler (HPA) and Vertical Pod Autoscaler (VPA) (free, built-in)
- **Rolling Updates** - Zero-downtime deployments
- **Rollback Capability** - Quick rollback on failures
- **Service Mesh** - Istio or Linkerd for service-to-service communication (optional)
  - **Recommendation:** Use Linkerd (free, open source, lighter than Istio) or skip for low traffic
- **Circuit Breakers** - Circuit breakers for resilience (optional)
- **Retry Policies** - Retry policies for failed requests (optional)
- **Timeout Policies** - Timeout policies for request timeouts (optional)
- **Traffic Splitting** - Traffic splitting for canary deployments (optional)
- **mTLS** - Mutual TLS for service-to-service encryption (optional)
- **Cost:** $0/month (local) or $50-1,000/month (cloud, depending on traffic)

---

## 5. CI/CD Pipeline

### 5.1 Continuous Integration
- **CI/CD Pipeline** - GitHub Actions, Jenkins, or GitLab CI
- **Automated testing** - Automated testing on code changes (unit, integration, e2e)
- **Code quality checks** - Code quality and linting checks
- **Security scanning** - Security vulnerability scanning (SAST, DAST)
- **Build automation** - Automated build and packaging
- **Docker image building** - Automated Docker image building
- **Image scanning** - Docker image vulnerability scanning
- **Dependency scanning** - Dependency vulnerability scanning
- **Code coverage** - Code coverage reporting

### 5.2 Continuous Deployment
- **Automated deployment** - Automated deployment to environments (dev, staging, production)
- **Kubernetes deployment** - Automated Kubernetes deployment
- **Environment promotion** - Promote builds through environments
- **Deployment approval** - Deployment approval process for production
- **Rollback automation** - Automated rollback on failure
- **Blue-Green deployment** - Zero-downtime blue-green deployments
- **Canary deployment** - Gradual canary deployments
- **Health checks** - Health checks after deployment
- **Smoke tests** - Automated smoke tests after deployment
- **Performance tests** - Performance tests after deployment

---

## 6. Monitoring and Logging

### 6.1 Application Monitoring
- **Application metrics** - Application performance metrics
- **Error tracking** - Error tracking and alerting
- **Performance monitoring** - Performance monitoring and optimization
- **User analytics** - User analytics and behavior tracking

### 6.2 Infrastructure Monitoring
- **Infrastructure metrics** - Infrastructure performance metrics
- **Resource monitoring** - CPU, memory, and network monitoring
- **Service health** - Service health monitoring
- **Alerting** - Alerting on critical issues

### 6.3 Logging
- **ELK Stack** - Elasticsearch, Logstash, Kibana
- **Centralized logging** - Centralized logging infrastructure
- **Log collection** - Filebeat or Fluentd for log collection
- **Log aggregation** - Log aggregation and analysis
- **Log retention** - Configurable log retention policies
- **Log search** - Advanced log search and filtering in Kibana
- **Log dashboards** - Pre-built and custom log dashboards
- **Log alerting** - Alerting on error patterns
- **Log visualization** - Log visualization and analysis
- **Structured logging** - Structured logging (JSON format)
- **Log correlation** - Log correlation with traces and metrics

---

## 7. Disaster Recovery

### 7.1 Backup Strategy
- **Regular backups** - Regular database and data backups
- **Backup storage** - Offsite backup storage
- **Backup testing** - Regular backup restoration testing
- **Backup retention** - Backup retention policies

### 7.2 Disaster Recovery Plan
- **Disaster recovery plan** - Comprehensive disaster recovery plan
- **Automated backups** - Automated backups of databases and data
- **Backup storage** - Offsite backup storage (S3, Azure Blob, GCS)
- **Backup encryption** - Encrypted backups
- **Backup retention** - Configurable backup retention policies
- **Recovery procedures** - Step-by-step recovery procedures
- **Recovery testing** - Regular disaster recovery testing
- **Recovery time objectives (RTO)** - Target recovery time (e.g., 1 hour)
- **Recovery point objectives (RPO)** - Target data loss tolerance (e.g., 15 minutes)
- **Multi-region deployment** - Multi-region deployment for high availability
- **Failover procedures** - Automated failover procedures
- **Data replication** - Data replication across regions

---

## 8. Implementation Reference

### Docker Compose Configuration

The actual implementation can be found in:
- **Configuration File**: Root `docker-compose.yml`
- **Nginx Configuration**: `deployments/nginx/nginx.conf`
- **MongoDB Init Scripts**: `database/init/init.js`

For detailed setup instructions, see:
- [Docker Compose Setup Guide](../../01-GETTING_STARTED/DOCKER_COMPOSE_SETUP.md)
- [Docker Installation Guide](../../01-GETTING_STARTED/DOCKER_INSTALLATION.md)

### Quick Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop services
docker-compose down
```

---

## 9. Related Documentation

- [System Architecture](./02-SYSTEM_ARCHITECTURE.md) - System architecture overview
- [Scalability Considerations](./08-SCALABILITY.md) - Scalability design
- [Non-Functional Requirements](./10-NON_FUNCTIONAL_REQUIREMENTS.md) - Non-functional requirements
- [Docker Compose Setup Guide](../../01-GETTING_STARTED/DOCKER_COMPOSE_SETUP.md) - Local development setup

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

