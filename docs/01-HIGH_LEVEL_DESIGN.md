# 🏗️ High-Level Design (HLD) Document
## Battle Arena - Multiplayer Tank Battle Game

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Draft

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

## 1. Executive Summary

### 1.1 System Overview
Battle Arena is a real-time multiplayer tank battle game system built using microservices architecture. The system enables players to create accounts, queue for matches, engage in turn-based tank battles, earn XP, and compete on leaderboards.

### 1.2 Key Features
- User Authentication & Authorization
- Real-time Matchmaking
- Turn-based Tank Battle Gameplay
- Physics-based Projectile System
- Player Profile & Progression
- Leaderboard System
- Match Replay System

### 1.3 Technology Stack
- **Frontend:** Angular 17+ with TypeScript, TailwindCSS, Phaser 3
- **Backend:** Node.js (Express, Socket.io), Spring Boot (Java)
- **Database:** MongoDB
- **Cache/Queue:** Redis
- **Containerization:** Docker, Docker Compose
- **Physics Engine:** Matter.js

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Angular Frontend (Port 4200)                      │  │
│  │  - Dashboard | Matchmaking | Arena | Profile | Leaderboard│  │
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
        │  - Redis Queue Management                │
        │  - XP-based Matching Algorithm           │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         GAME ENGINE SERVICE              │
        │         (Port 5002)                      │
        │  - Socket.io Server                      │
        │  - Game Room Management                  │
        │  - Physics Engine (Matter.js)            │
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
│ - User Data  │    │ - Queue Data │    │ - Auth APIs  │
│ - Profiles   │    │ - Lobby Data │    │ - Stats APIs │
│ - Matches    │    │ - Cache      │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 2.2 Microservices Architecture

The system follows a **microservices architecture** with the following services:

#### 2.2.1 Auth Service
- **Technology:** Spring Boot (Java)
- **Port:** 8081
- **Responsibilities:**
  - User registration and authentication
  - JWT token generation and validation
  - Password hashing and security
  - Session management

#### 2.2.2 Profile Service
- **Technology:** Spring Boot (Java)
- **Port:** 8082
- **Responsibilities:**
  - User profile management
  - XP and level calculation
  - Player statistics
  - Avatar management

#### 2.2.3 Leaderboard Service
- **Technology:** Spring Boot (Java)
- **Port:** 8083
- **Responsibilities:**
  - Top players ranking
  - Leaderboard generation
  - Ranking algorithms
  - Statistics aggregation

#### 2.2.4 Matchmaking Service
- **Technology:** Node.js (Express, Socket.io)
- **Port:** 3002
- **Responsibilities:**
  - Player queue management
  - XP-based matchmaking algorithm
  - Lobby creation and management
  - Match acceptance handling
  - Reconnection handling

#### 2.2.5 Game Engine Service
- **Technology:** Node.js (Express, Socket.io)
- **Port:** 5002
- **Responsibilities:**
  - Game room management
  - Real-time game state synchronization
  - Physics calculations (Matter.js)
  - Turn management
  - Match result processing
  - Game replay generation

---

## 3. Component Design

### 3.1 Frontend Components

#### 3.1.1 Angular Application Structure
```
frontend-service/
├── src/
│   ├── app/
│   │   ├── auth/              # Authentication module
│   │   ├── dashboard/         # Dashboard module
│   │   ├── matchmaking/       # Matchmaking module
│   │   ├── pages/
│   │   │   └── arena/         # Game arena module
│   │   ├── profile/           # Profile module
│   │   ├── shared/            # Shared components
│   │   ├── services/          # Angular services
│   │   ├── guards/            # Route guards
│   │   └── interceptors/      # HTTP interceptors
│   └── assets/                # Static assets
```

#### 3.1.2 Key Frontend Services
- **AuthService:** Handles authentication and JWT token management
- **GameService:** Manages game state and WebSocket communication
- **MatchmakingService:** Handles queue joining and match notifications
- **ProfileService:** Manages user profile data
- **LeaderboardService:** Fetches leaderboard data

### 3.2 Backend Services Architecture

#### 3.2.1 Spring Boot Services (Auth, Profile, Leaderboard)
```
service-name/
├── src/main/java/
│   ├── controller/            # REST controllers
│   ├── service/               # Business logic
│   ├── repository/            # Data access layer
│   ├── model/                 # Entity models
│   ├── dto/                   # Data transfer objects
│   ├── security/              # Security configuration
│   ├── config/                # Configuration classes
│   └── exception/             # Exception handlers
├── src/main/resources/
│   └── application.properties # Configuration
└── pom.xml                    # Maven dependencies
```

#### 3.2.2 Node.js Services (Matchmaking, Game Engine)
```
service-name/
├── src/
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   ├── routes/                # Route definitions
│   ├── utils/                 # Utility functions
│   └── types/                 # Type definitions
├── server.js                  # Application entry point
└── package.json               # NPM dependencies
```

---

## 4. Data Flow

### 4.1 Authentication Flow
```
User → Frontend → Auth Service → MongoDB
                ↓
            JWT Token → Frontend Storage
```

### 4.2 Matchmaking Flow
```
Player 1 → Matchmaking Service → Redis Queue
Player 2 → Matchmaking Service → Redis Queue
                ↓
        Match Found → Create Lobby → Notify Players
                ↓
        Players Accept → Game Engine Service
```

### 4.3 Gameplay Flow
```
Player Action → Frontend → Game Engine Service
                            ↓
                    Validate Action
                            ↓
                    Update Game State
                            ↓
                    Broadcast to Players
                            ↓
                    Check Win Condition
                            ↓
                    Update Profile/Leaderboard
```

### 4.4 Post-Match Flow
```
Match End → Game Engine Service
                ↓
        Calculate Results
                ↓
        Update Profile Service (XP)
                ↓
        Update Leaderboard Service
                ↓
        Notify Frontend
```

---

## 5. Communication Patterns

### 5.1 Synchronous Communication (REST)
- **HTTP/REST APIs** for standard CRUD operations
- **Request-Response** pattern for stateless operations
- Used by: Auth, Profile, Leaderboard services

### 5.2 Asynchronous Communication (WebSocket)
- **Socket.io** for real-time bidirectional communication
- **Event-driven** pattern for game state updates
- Used by: Matchmaking, Game Engine services

### 5.3 Message Queue (Redis)
- **Redis Pub/Sub** for inter-service communication
- **Redis Sorted Sets** for matchmaking queue
- **Redis Hash** for lobby storage

---

## 6. Database Design

### 6.1 MongoDB Collections

#### 6.1.1 Users Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "passwordHash": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### 6.1.2 Profiles Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "displayName": "string",
  "avatar": "string",
  "xp": "number",
  "level": "number",
  "wins": "number",
  "losses": "number",
  "matchesPlayed": "number",
  "bio": "string",
  "achievements": ["array"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### 6.1.3 Matches Collection
```json
{
  "_id": "ObjectId",
  "matchId": "string",
  "player1Id": "ObjectId",
  "player2Id": "ObjectId",
  "winnerId": "ObjectId",
  "startTime": "Date",
  "endTime": "Date",
  "duration": "number",
  "replayData": "object",
  "createdAt": "Date"
}
```

#### 6.1.4 Leaderboard Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "rank": "number",
  "xp": "number",
  "winRate": "number",
  "updatedAt": "Date"
}
```

### 6.2 Redis Data Structures

#### 6.2.1 Matchmaking Queue
- **Type:** Sorted Set
- **Key:** `matchmaking:queue`
- **Score:** Player XP
- **Value:** Player ID + Socket ID

#### 6.2.2 Lobby Storage
- **Type:** Hash
- **Key:** `lobby:{matchId}`
- **Fields:** `player1Id`, `player2Id`, `status`, `createdAt`, `timeout`

#### 6.2.3 Game State Cache
- **Type:** Hash
- **Key:** `game:{matchId}`
- **Fields:** `state`, `player1Health`, `player2Health`, `currentTurn`, `round`

---

## 7. Security Architecture

### 7.1 Authentication & Authorization
- **JWT-based authentication** for all services
- **Token validation** at API gateway and service level
- **Role-based access control** (RBAC) for future enhancements
- **WebSocket authentication** via JWT in handshake

### 7.2 Data Protection
- **Password hashing** using BCrypt with salt
- **HTTPS/WSS** for all communication
- **Input validation** at all entry points
- **SQL injection prevention** (MongoDB NoSQL injection prevention)
- **XSS prevention** through input sanitization

### 7.3 API Security
- **Rate limiting** to prevent abuse
- **CORS configuration** for allowed origins
- **Request validation** and sanitization
- **Error handling** without exposing internal details

---

## 8. Scalability Considerations

### 8.1 Horizontal Scaling
- **Stateless services** for easy scaling
- **Load balancing** at API gateway level
- **Redis clustering** for distributed caching
- **MongoDB replica sets** for read scaling

### 8.2 Performance Optimization
- **Redis caching** for frequently accessed data
- **Database indexing** on frequently queried fields
- **Connection pooling** for database connections
- **WebSocket connection management** for efficient real-time communication

### 8.3 Resource Management
- **Container orchestration** ready (Docker Compose → Kubernetes)
- **Health checks** for all services
- **Graceful shutdown** handling
- **Resource limits** in container configuration

---

## 9. Deployment Architecture

### 9.1 Development Environment
- **Docker Compose** for local development
- **Hot reload** for development services
- **Local databases** (MongoDB, Redis)

### 9.2 Production Environment
- **Containerized services** using Docker
- **Reverse proxy** (Nginx) for routing
- **SSL/TLS certificates** for HTTPS
- **Environment-based configuration** via environment variables
- **Logging and monitoring** infrastructure

---

## 10. Non-Functional Requirements

### 10.1 Performance
- **API response time:** < 200ms for 95% of requests
- **WebSocket latency:** < 50ms for game actions
- **Matchmaking time:** < 30 seconds average
- **Game state sync:** Real-time (< 100ms)

### 10.2 Availability
- **System uptime:** 99.9% (8.76 hours downtime/year)
- **Service health checks:** Every 30 seconds
- **Graceful degradation** for non-critical services
- **Automatic recovery** from transient failures

### 10.3 Scalability
- **Concurrent users:** Support 10,000+ concurrent players
- **Matchmaking capacity:** 1,000+ simultaneous matches
- **Horizontal scaling** capability for all services
- **Database scaling** via sharding and replication

### 10.4 Security
- **Authentication:** 100% of requests authenticated
- **Data encryption:** All sensitive data encrypted at rest and in transit
- **Vulnerability scanning:** Regular security audits
- **Compliance:** Follow OWASP Top 10 security practices

---

## 11. Design Principles Compliance

### 11.1 Reusability
- **Shared utilities** across services
- **Common DTOs** for data transfer
- **Reusable middleware** for authentication and validation
- **Component-based architecture** in frontend

### 11.2 Clean Code
- **Meaningful naming** conventions
- **Single responsibility** principle
- **DRY (Don't Repeat Yourself)** principle
- **Comprehensive documentation** and comments

### 11.3 Clean Architecture
- **Separation of concerns** across layers
- **Dependency inversion** principle
- **Interface-based design** for flexibility
- **Testable components** with dependency injection

### 11.4 Secure Programming
- **Input validation** at all layers
- **Output encoding** to prevent XSS
- **Secure defaults** for all configurations
- **Regular security updates** and patches

---

## 12. Risk Assessment

### 12.1 Technical Risks
- **WebSocket scalability** - Mitigated by horizontal scaling
- **Database performance** - Mitigated by indexing and caching
- **Real-time synchronization** - Mitigated by efficient state management

### 12.2 Operational Risks
- **Service downtime** - Mitigated by health checks and monitoring
- **Data loss** - Mitigated by database backups and replication
- **Security breaches** - Mitigated by comprehensive security measures

### 12.3 Business Risks
- **User experience** - Mitigated by performance optimization
- **Scalability limitations** - Mitigated by cloud-ready architecture
- **Maintenance complexity** - Mitigated by clean architecture and documentation

---

## 13. Future Enhancements

### 13.1 Planned Features
- Tournament system
- Team-based matches
- Spectator mode
- Chat system
- Achievement system
- In-game purchases

### 13.2 Infrastructure Improvements
- Kubernetes orchestration
- Service mesh (Istio)
- Advanced monitoring (Prometheus, Grafana)
- Distributed tracing (Jaeger)
- CI/CD pipeline automation

---

## 14. Conclusion

This High-Level Design document provides a comprehensive overview of the Battle Arena system architecture. The design emphasizes **reusability, clean code, clean architecture, and secure programming** principles throughout all components and interactions.

All implementation must strictly adhere to these principles to ensure a maintainable, scalable, and secure system.

---

**Document Control:**
- **Author:** System Architecture Team
- **Reviewer:** Technical Lead
- **Approval:** CTO
- **Next Review Date:** After implementation phase

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming - These are MANDATORY for all implementations.**

