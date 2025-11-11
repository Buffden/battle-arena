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
│   MONGODB    │    │    REDIS     │    │   EXTERNAL   │
│  (Port 27017)│    │  (Port 6379) │    │   SERVICES   │
│              │    │              │    │              │
│ - Users      │    │ - Matchmaking│    │ - Auth APIs  │
│ - Profiles   │    │   Queue      │    │ - Stats APIs │
│ - Matches    │    │ - Lobby Data │    │              │
│ - Leaderboard│    │ - Arena/Weapon│   │              │
│ - Heroes     │    │   Selection  │    │              │
│ - Weapons    │    │ - Game State │    │              │
│ - Arenas     │    │ - Config Cache│   │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 2. Microservices Architecture

The system follows a **microservices architecture** with the following services:

### 2.1 Auth Service
- **Technology:** Spring Boot (Java)
- **Port:** 8081
- **Responsibilities:**
  - User registration and authentication
  - JWT token generation and validation
  - Password hashing and security
  - Session management
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

### 3.3 Message Queue (Redis)
- **Redis Pub/Sub** for inter-service communication
- **Redis Sorted Sets** for matchmaking queue
- **Redis Hash** for lobby storage
- **Redis Cache** for frequently accessed data

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
- **Pub/Sub** for inter-service communication
- **Data Structures:**
  - Sorted Sets - Matchmaking queue (hero-based queues, player matching)
  - Hash - Lobby storage (match lobbies, arena selection, weapon selection), Game state cache (real-time game state, turn management)
  - String - Cache data, Hero/Weapon/Arena configurations (cached configurations)
- **Clustering:** Redis cluster for distributed caching

---

## 5. API Gateway

### 5.1 Nginx Reverse Proxy
- **Request Routing** - Route requests to appropriate services
- **Load Balancing** - Distribute load across service instances
- **SSL Termination** - Handle HTTPS/WSS encryption
- **Rate Limiting** - Prevent abuse and DDoS attacks
- **CORS Configuration** - Manage cross-origin requests

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
- **Redis clustering** for distributed caching
- **MongoDB replica sets** for read scaling

### 7.2 Performance Optimization
- **Redis caching** for frequently accessed data
- **Database indexing** on frequently queried fields
- **Connection pooling** for database connections
- **WebSocket connection management** for efficient real-time communication

For detailed scalability considerations, see [Scalability Considerations](./08-SCALABILITY.md).

---

## 8. Deployment Architecture

### 8.1 Development Environment
- **Docker Compose** for local development
- **Hot reload** for development services
- **Local databases** (MongoDB, Redis)

### 8.2 Production Environment
- **Containerized services** using Docker
- **Reverse proxy** (Nginx) for routing
- **SSL/TLS certificates** for HTTPS
- **Environment-based configuration** via environment variables
- **Logging and monitoring** infrastructure

For detailed deployment architecture, see [Deployment Architecture](./09-DEPLOYMENT.md).

---

## 9. Related Documentation

- [Component Design](./03-COMPONENT_DESIGN.md) - Detailed component specifications
- [Data Flow](./04-DATA_FLOW.md) - Data flow diagrams
- [Communication Patterns](./05-COMMUNICATION_PATTERNS.md) - Communication patterns
- [Database Design](./06-DATABASE_DESIGN.md) - Database schema
- [Security Architecture](./07-SECURITY_ARCHITECTURE.md) - Security design
- [Scalability Considerations](./08-SCALABILITY.md) - Scalability design

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

