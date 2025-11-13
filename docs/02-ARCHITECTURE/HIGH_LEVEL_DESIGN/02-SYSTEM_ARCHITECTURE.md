# System Architecture

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

## 1. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Angular Frontend (Port 4200)                      │  │
│  │  - Dashboard | Hero Selection | Matchmaking | Arena       │  │
│  │    Selection | Weapon Selection | Arena | Profile |       │  │
│  │    Leaderboard                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/WSS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Nginx Reverse Proxy                          │  │
│  │  - Request Routing | Load Balancing | SSL Termination     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   AUTH       │    │   PROFILE    │    │ LEADERBOARD  │
│   SERVICE    │    │   SERVICE    │    │   SERVICE    │
│  (Port 8081) │    │  (Port 8082) │    │  (Port 8083) │
│              │    │              │    │              │
│ Spring Boot  │    │ Spring Boot  │    │ Spring Boot  │
│   + JWT      │    │   + JWT      │    │   + JWT      │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         MATCHMAKING SERVICE              │
        │         (Port 3002)                      │
        │  - Socket.io Server                      │
        │  - Hero Selection Management             │
        │  - Redis Queue Management                │
        │  - Global Score/Rank-based Matching      │
        │  - Arena Selection (Voting/Elimination)  │
        │  - Weapon Selection (Alternating)        │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         GAME ENGINE SERVICE              │
        │         (Port 5002)                      │
        │  - Socket.io Server                      │
        │  - Game Room Management                  │
        │  - Turn Management (15s/turn, 4-5min)   │
        │  - Movement System (4 moves/game)        │
        │  - Physics Engine (Matter.js)            │
        │  - Scoring System (Accuracy, Hits, Saves)│
        │  - Health System (Hero-specific HP)      │
        │  - Weapon Synergies                      │
        │  - Game State Management                 │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MONGODB    │    │    REDIS     │    │    KAFKA     │
│  (Port 27017)│    │  (Port 6379) │    │  (Port 9092) │
│              │    │              │    │              │
│ - Users      │    │ - Matchmaking│    │ - matchmaking│
│ - Profiles   │    │   Queue      │    │   .events    │
│ - Matches    │    │ - Lobby Data │    │ - game.events│
│ - Leaderboard│    │ - Arena/Weapon│   │ - profile.   │
│ - Heroes     │    │   Selection  │    │   updates    │
│ - Weapons    │    │ - Game State │    │ - leaderboard│
│ - Arenas     │    │ - Config Cache│   │   .updates   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                 │                     │
        └─────────────────┼─────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PROMETHEUS  │  │    GRAFANA   │  │     JAEGER   │
│  (Metrics)   │  │  (Dashboards)│  │   (Tracing)  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ELASTICSEARCH│  │   LOGSTASH   │  │    KIBANA    │
│  (Logs)      │  │  (Processing)│  │ (Visualization)│
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 2. Microservices Architecture

The system follows a **microservices architecture** with the following services:

### 2.1 Auth Service
- **Technology:** Spring Boot (Java)
- **Port:** 8081
- **Responsibilities:**
  - User registration and authentication
  - OAuth authentication (Google OAuth 2.0)
  - JWT token generation and validation
  - Password hashing and security
  - Session management
  - Account linking for OAuth users
- **Database:** MongoDB (Users collection)
- **Communication:** REST API (HTTP/HTTPS)

### 2.2 Profile Service
- **Technology:** Spring Boot (Java)
- **Port:** 8082
- **Responsibilities:**
  - User profile management
  - Global score tracking and update (not per-hero, score can be infinite, no level cap)
  - Rank tier calculation (like Valorant, based on score ranges)
  - Player statistics
  - Avatar management
  - Rank change calculation (based on match score, formula to be determined)
- **Database:** MongoDB (Profiles collection)
- **Communication:** REST API (HTTP/HTTPS)

### 2.3 Leaderboard Service
- **Technology:** Spring Boot (Java)
- **Port:** 8083
- **Responsibilities:**
  - Top players ranking
  - Leaderboard generation with filtering (region, hero type, winning percentage, weapons)
  - Rank tier calculation (score ranges determine rank tiers like Valorant)
  - Ranking algorithms (global score determines rankings, players with similar ranks can be in top 5)
  - Statistics aggregation
- **Database:** MongoDB (Leaderboard collection)
- **Communication:** REST API (HTTP/HTTPS)

### 2.4 Matchmaking Service
- **Technology:** Node.js (Express, Socket.io)
- **Port:** 3002
- **Responsibilities:**
  - Hero selection management (multiple hero selection, hero matching, hero assignment)
  - Player queue management
  - Global score/rank-based matchmaking algorithm
  - Queue expansion (after 5 minutes, widen XP/score/rank range)
  - Arena selection management (voting/elimination system)
  - Weapon selection management (alternating selection, 30-second timer)
  - Lobby creation and management
  - Match acceptance handling
  - Estimated wait time calculation
  - Reconnection handling
- **Cache:** Redis (Matchmaking queue, Lobby storage, Hero/Weapon/Arena configurations)
- **Communication:** WebSocket (Socket.io)

### 2.5 Game Engine Service
- **Technology:** Node.js (Express, Socket.io)
- **Port:** 5002
- **Responsibilities:**
  - Game room management
  - Real-time game state synchronization
  - Turn management (15 seconds per turn, 4-5 minutes total OR 10 turns per player)
  - Movement system (4 moves per game, left/right only, movement scoring)
  - Physics calculations (Matter.js, gravity varies by arena, no wind)
  - Action processing (aim, fire, move)
  - Scoring system (accuracy, back-to-back hits, repositioning saves)
  - Health system (different HP per hero type, balanced HP when matched)
  - Win condition detection (HP = 0 = instant loss, or player with more HP at match end)
  - Draw condition detection (same HP AND same score = draw)
  - Weapon synergy system (dynamic system, e.g., gasoline + torch)
  - Match result processing
  - Configuration file support (weapons, penalties, rank tiers, scoring formulas)
  - Disconnection handling (1 minute rejoin window, configurable penalties)
- **Database:** MongoDB (Matches collection)
- **Cache:** Redis (Game state cache)
- **Communication:** WebSocket (Socket.io)

---

## 3. Service Communication

### 3.1 Synchronous Communication (REST)
- **HTTP/REST APIs** for standard CRUD operations
- **Request-Response** pattern for stateless operations
- Used by: Auth, Profile, Leaderboard services
- **Protocol:** HTTP/HTTPS
- **Format:** JSON

### 3.2 Asynchronous Communication (WebSocket)
- **Socket.io** for real-time bidirectional communication
- **Event-driven** pattern for game state updates
- Used by: Matchmaking, Game Engine services
- **Protocol:** WebSocket (WSS in production)
- **Format:** JSON

### 3.3 Message Queue (Apache Kafka / Redis Pub/Sub)
- **Apache Kafka** for industrial-grade message queuing (recommended for production, high traffic)
- **Redis Pub/Sub** for simple message queuing (recommended for student projects, low traffic <1,000 users/month)
- **Kafka Topics** for event-driven communication (when using Kafka)
- **Kafka Producers/Consumers** in services for publishing/consuming events (when using Kafka)
- **Redis Pub/Sub Channels** for event-driven communication (when using Redis Pub/Sub)
- **Message Persistence** - Kafka: Messages persisted to disk | Redis Pub/Sub: No persistence (acceptable for low traffic)
- **Message Replay** - Kafka: Can replay messages | Redis Pub/Sub: No replay (acceptable for low traffic)
- **High Scalability** - Kafka: Handles millions of messages per second | Redis Pub/Sub: Sufficient for low traffic
- **Fault Tolerance** - Kafka: Replication for reliability | Redis Pub/Sub: Basic reliability (acceptable for low traffic)
- **Consumer Groups** - Kafka: Multiple consumers with load balancing | Redis Pub/Sub: Multiple subscribers
- **Student Recommendation:** Use Redis Pub/Sub for <1,000 users/month (simpler, free, sufficient), switch to Kafka when traffic exceeds 10,000 users/day

### 3.4 Redis Data Structures (Caching & Message Queue)
- **Redis Sorted Sets** for matchmaking queue
- **Redis Hash** for lobby storage
- **Redis Cache** for frequently accessed data
- **Redis Pub/Sub** for inter-service communication (for student projects, low traffic)
- **Note:** Redis Pub/Sub is sufficient for <1,000 users/month. Switch to Kafka when traffic exceeds 10,000 users/day or need message persistence/replay

---

## 4. Data Storage

### 4.1 MongoDB
- **Primary Database** for persistent data storage
- **Collections:**
  - Users - User authentication data
  - Profiles - User profile, global score, rank tiers, statistics
  - Matches - Match history, results, scores
  - Leaderboard - Global rankings with filters
  - Heroes - Hero types, characteristics, configurations
  - Weapons - Weapon properties, synergies, configurations
  - Arenas - Arena properties, terrain, gravity configurations
- **Replication:** MongoDB replica sets for high availability
- **Sharding:** Horizontal scaling capability

### 4.2 Redis
- **Cache** for frequently accessed data
- **Queue** for matchmaking (hero-based queues, player matching)
- **Data Structures:**
  - Sorted Sets - Matchmaking queue (hero-based queues, player matching)
  - Hash - Lobby storage (match lobbies, arena selection, weapon selection), Game state cache (real-time game state, turn management)
  - String - Cache data, Hero/Weapon/Arena configurations (cached configurations)
- **Clustering:** Redis cluster for distributed caching
- **Note:** Redis Pub/Sub replaced by Kafka for inter-service communication

### 4.3 Message Queue (Apache Kafka / Redis Pub/Sub)

#### **Apache Kafka (Recommended for Production, High Traffic)**
- **Message Queue** for industrial-grade event streaming
- **Topics:**
  - `matchmaking.events` - Matchmaking events (match found, hero assigned, etc.)
  - `game.events` - Game events (game start, turn updates, game end, etc.)
  - `profile.updates` - Profile update events (score updates, rank changes, etc.)
  - `leaderboard.updates` - Leaderboard update events (rank changes, new entries, etc.)
- **Characteristics:**
  - Message persistence to disk
  - Message replay capability
  - High scalability (millions of messages per second)
  - Fault tolerance (replication)
  - Consumer groups for load balancing
  - Partitioning for parallel processing
- **Clustering:** Kafka cluster (3+ brokers for production, single broker for development/student projects)
- **Free Options:** Self-hosted Kafka (free, open source), Confluent Cloud free tier (5GB/month, 1 cluster)
- **When to Use:** Production, high traffic (>10,000 users/day), need message persistence/replay

#### **Redis Pub/Sub (Recommended for Student Projects, Low Traffic)**
- **Message Queue** for simple event streaming (sufficient for <1,000 users/month)
- **Channels:**
  - `matchmaking:events` - Matchmaking events
  - `game:events` - Game events
  - `profile:updates` - Profile update events
  - `leaderboard:updates` - Leaderboard update events
- **Characteristics:**
  - No message persistence (acceptable for low traffic)
  - No message replay (acceptable for low traffic)
  - Sufficient for low traffic (<1,000 users/month)
  - Simple setup, no additional infrastructure
  - Free (uses existing Redis instance)
- **Setup:** Single Redis instance (same as caching Redis)
- **Free Options:** Self-hosted Redis (free, open source), Redis Cloud free tier (30MB)
- **Student Recommendation:** Use Redis Pub/Sub for <1,000 users/month (simpler, free, sufficient), switch to Kafka when traffic exceeds 10,000 users/day

---

## 5. API Gateway

### 5.1 API Gateway (Kong/Nginx/Apigee)
- **Request Routing** - Route requests to appropriate services
- **Load Balancing** - Distribute load across service instances (round-robin, least connections, IP hash for WebSocket)
- **SSL Termination** - Handle HTTPS/WSS encryption
- **Rate Limiting** - Prevent abuse and DDoS attacks (per IP, per user, per API)
- **CORS Configuration** - Manage cross-origin requests
- **Authentication** - JWT validation at gateway level
- **API Versioning** - Support for multiple API versions
- **Request/Response Transformation** - Transform requests and responses
- **API Analytics** - Monitor API usage and performance
- **Plugin System** - Extensible plugin system for additional functionality
- **Free Options:** Kong Community Edition (free, open source), Nginx (free, open source), Traefik (free, open source)
- **Student Recommendation:** Use Kong Community Edition or Nginx (both free and industrial-grade)

### 5.2 Nginx Reverse Proxy (Alternative/Additional)
- **Load Balancing** - Advanced load balancing algorithms
- **Health Checks** - Health check endpoints for service instances
- **Sticky Sessions** - Session affinity for WebSocket connections
- **SSL/TLS** - Certificate management and renewal
- **Rate Limiting** - Advanced rate limiting rules
- **Caching** - Static asset caching

---

## 6. Security Architecture

### 6.1 Authentication & Authorization
- **JWT-based authentication** for all services
- **Token validation** at API gateway and service level
- **Role-based access control** (RBAC) for future enhancements
- **WebSocket authentication** via JWT in handshake

### 6.2 Data Protection
- **Password hashing** using BCrypt with salt
- **HTTPS/WSS** for all communication
- **Input validation** at all entry points
- **XSS prevention** through input sanitization

For detailed security architecture, see [Security Architecture](./07-SECURITY_ARCHITECTURE.md).

---

## 7. Scalability Considerations

### 7.1 Horizontal Scaling
- **Stateless services** for easy scaling
- **Load balancing** at API gateway level
- **Kubernetes orchestration** for container orchestration and auto-scaling
- **Horizontal Pod Autoscaler (HPA)** for automatic scaling based on CPU/memory/custom metrics
- **Vertical Pod Autoscaler (VPA)** for resource optimization
- **Redis clustering** for distributed caching
- **MongoDB replica sets** for read scaling
- **Kafka clustering** for distributed message queuing

### 7.2 Performance Optimization
- **Redis caching** for frequently accessed data
- **Kafka message queuing** for high-throughput event streaming
- **Database indexing** on frequently queried fields
- **Connection pooling** for database connections
- **WebSocket connection management** for efficient real-time communication
- **Service Mesh** for optimized service-to-service communication

### 7.3 Container Orchestration (Kubernetes / Docker Compose)
- **Kubernetes** for container orchestration (recommended for production, high traffic)
- **Docker Compose** for simple orchestration (recommended for student projects, low traffic <1,000 users/month)
- **Deployment Manifests** for all services (when using Kubernetes)
- **Service Definitions** for service discovery (when using Kubernetes)
- **ConfigMaps** for configuration management (when using Kubernetes)
- **Secrets** for sensitive data management (when using Kubernetes)
- **Ingress** for external access (when using Kubernetes)
- **Network Policies** for security (when using Kubernetes)
- **Resource Limits** for resource management (when using Kubernetes)
- **Health Checks** (liveness, readiness, startup probes) (when using Kubernetes)
- **Rolling Updates** for zero-downtime deployments (when using Kubernetes)
- **Rollback Capability** for quick recovery (when using Kubernetes)
- **Student Recommendation:** Use Docker Compose for <1,000 users/month (simpler, free, easier to manage), switch to Kubernetes when traffic exceeds 10,000 users/day or need auto-scaling

### 7.4 Service Mesh (Istio/Linkerd) - Optional
- **Service Mesh** for service-to-service communication management (optional for student projects)
- **Circuit Breakers** for resilience (optional)
- **Retry Policies** for failed requests (optional)
- **Timeout Policies** for request timeouts (optional)
- **Traffic Splitting** for canary deployments (optional)
- **mTLS** for service-to-service encryption (optional)
- **Observability** (metrics, tracing, logging) (optional)
- **Traffic Management** for advanced routing (optional)
- **Student Recommendation:** Skip Service Mesh for <1,000 users/month (adds complexity, not needed for low traffic), add when traffic exceeds 10,000 users/day or need advanced features

For detailed scalability considerations, see [Scalability Considerations](./08-SCALABILITY.md).

---

## 8. Deployment Architecture

### 8.1 Development Environment
- **Docker Compose** for local development
- **Hot reload** for development services
- **Local databases** (MongoDB, Redis)

### 8.2 Production Environment

#### **Student Projects (<1,000 users/month) - Minimal Configuration**
- **Containerized services** using Docker
- **Docker Compose** for simple orchestration (recommended for student projects)
- **API Gateway** (Nginx) for request routing (single instance, free)
- **Reverse proxy** (Nginx) for load balancing and SSL termination (single instance, free)
- **SSL/TLS certificates** for HTTPS (free: Let's Encrypt)
- **Environment-based configuration** via environment variables or Docker Compose
- **Monitoring infrastructure** (Grafana Cloud free tier) OR skip monitoring initially
- **Logging infrastructure** (Grafana Cloud free tier) OR skip logging initially
- **Distributed tracing** (Optional - skip for student projects)
- **Secret management** (Kubernetes Secrets or environment variables)
- **CI/CD pipeline** (GitHub Actions free tier: 2,000 minutes/month)
- **Auto-scaling** (Manual scaling with Docker Compose) OR skip auto-scaling
- **Disaster recovery** (Self-hosted backups or cloud storage free tiers: 5GB free)
- **Cost:** $0-10/month (within free tier limits or small cloud VM)

#### **Production (High Traffic >10,000 users/day) - Full Configuration**
- **Containerized services** using Docker
- **Kubernetes orchestration** for container orchestration
- **API Gateway** (Kong/Nginx/Apigee) for request routing and load balancing
- **Service Mesh** (Istio/Linkerd) for service-to-service communication (optional)
- **Reverse proxy** (Nginx) for load balancing and SSL termination
- **SSL/TLS certificates** for HTTPS
- **Environment-based configuration** via ConfigMaps and Secrets
- **Monitoring infrastructure** (Prometheus, Grafana, AlertManager)
- **Logging infrastructure** (ELK Stack: Elasticsearch, Logstash, Kibana)
- **Distributed tracing** (Jaeger/Zipkin)
- **Secret management** (HashiCorp Vault/Kubernetes Secrets)
- **CI/CD pipeline** (GitHub Actions/Jenkins/GitLab CI)
- **Auto-scaling** (Kubernetes HPA/VPA)
- **Disaster recovery** (automated backups, recovery procedures)
- **Cost:** $110-3,200/month (depending on traffic)

For detailed deployment architecture, see [Deployment Architecture](./09-DEPLOYMENT.md).

---

## 9. Related Documentation

- [Component Design](./03-COMPONENT_DESIGN.md) - Detailed component specifications
- [Data Flow](./04-DATA_FLOW.md) - Data flow diagrams
- [Communication Patterns](./05-COMMUNICATION_PATTERNS.md) - Communication patterns
- [Database Design](./06-DATABASE_DESIGN.md) - Database schema
- [Security Architecture](./07-SECURITY_ARCHITECTURE.md) - Security design
- [Scalability Considerations](./08-SCALABILITY.md) - Scalability design
- [Cost Optimization](./14-COST_OPTIMIZATION.md) - Cost optimization strategies
- [Traffic Scaling & Cost Management](./15-TRAFFIC_SCALING_AND_COST_MANAGEMENT.md) - Cost scaling guide
- [Student Minimal Configuration](../STUDENT_MINIMAL_CONFIGURATION.md) 🎓 - Student project configuration guide
- [Cost Scaling & Traffic Management](../COST_SCALING_AND_TRAFFIC_MANAGEMENT.md) 💰 - Detailed cost scaling guide

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

