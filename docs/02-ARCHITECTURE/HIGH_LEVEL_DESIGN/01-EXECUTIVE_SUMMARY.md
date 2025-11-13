# Executive Summary

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

## 1. System Overview

Battle Arena is a real-time multiplayer 2D artillery battle game system (inspired by Pocket Tank) built using microservices architecture. The system enables players to create accounts, select multiple heroes, queue for matches, select arenas and weapons, engage in turn-based 2D artillery battles with movement, earn global score and rank tiers, and compete on filtered leaderboards.

---

## 2. Key Features

- **User Authentication & Authorization** - Secure user registration, login, and Google OAuth login
- **Hero Selection System** - Multiple hero types (tanks, archers, catapults, witches) with unique characteristics
- **Multiple Hero Selection** - Players can select multiple heroes before matchmaking to increase match chances
- **Real-time Matchmaking** - Global score/rank-based matching algorithm with multiple hero support
- **Arena Selection System** - Voting/elimination system (like CS2 premium matchmaking) for arena selection
- **Weapon Selection System** - 10 weapons per match, alternating selection, weapon synergies
- **Turn-based 2D Artillery Battle Gameplay** - Strategic turn-based combat (15 seconds per turn, 4-5 minutes total)
- **Movement System** - Players can move heroes within arenas (4 moves per game, left/right only)
- **Physics-based Projectile System** - Realistic physics using Matter.js (gravity varies by arena, no wind)
- **Scoring System** - Accuracy-based scoring, back-to-back hits, repositioning saves
- **Health System** - Different HP per hero type, balanced HP when matched
- **Player Profile & Progression** - Global score tracking, rank tier system (like Valorant), statistics tracking
- **Leaderboard System** - Global leaderboards with filtering (region, hero type, winning percentage, weapons)
- **Configuration File Support** - Configurable weapons, penalties, rank tiers, scoring formulas
- **Disconnection Handling** - 1 minute rejoin window, configurable penalties

---

## 3. Technology Stack

### Frontend
- **Angular 17+** - Modern frontend framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Phaser 3** - Game development framework

### Backend
- **Node.js** - Runtime for real-time services
- **Express** - Web framework
- **Socket.io** - Real-time WebSocket communication
- **Spring Boot (Java)** - Enterprise backend services
- **JWT** - Authentication and authorization

### Database & Cache
- **MongoDB** - NoSQL database for flexible data storage
- **Redis** - In-memory cache and queue management

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development orchestration
- **Nginx** - Reverse proxy and load balancing

### Game Engine
- **Matter.js** - Physics engine for game mechanics

---

## 4. System Architecture Overview

The system follows a **microservices architecture** with the following components:

1. **Auth Service** - User authentication and authorization (Spring Boot)
2. **Profile Service** - User profile and global score/rank tracking (Spring Boot)
3. **Leaderboard Service** - Ranking and leaderboard management with filtering (Spring Boot)
4. **Matchmaking Service** - Player matching, hero selection, arena selection, weapon selection, queue management (Node.js)
5. **Game Engine Service** - Game logic, physics, movement, scoring, match result processing (Node.js)
6. **Frontend Service** - User interface, game rendering, real-time game state display (Angular)
7. **Configuration Service** - Configuration file management for weapons, penalties, rank tiers, etc.
8. **MongoDB** - Primary database (Users, Profiles, Matches, Leaderboards, Heroes, Weapons, Arenas)
9. **Redis** - Cache and queue management (Matchmaking queue, Lobby storage, Game state cache, Hero/Weapon/Arena configurations)

For detailed architecture, see [System Architecture](./02-SYSTEM_ARCHITECTURE.md).

---

## 5. Key Design Decisions

### Architecture
- **Microservices** - Independent, scalable services
- **JWT Authentication** - Stateless, scalable authentication
- **MongoDB** - Flexible, scalable database
- **Redis** - Fast caching and queue management
- **Socket.io** - Real-time WebSocket communication
- **Docker** - Containerized deployment

### Security
- **JWT Tokens** - HS512 algorithm, 24-hour expiration
- **Password Hashing** - BCrypt with 12 rounds
- **Input Validation** - Comprehensive validation at all layers
- **Output Encoding** - XSS prevention
- **Encryption** - HTTPS/WSS for all communication
- **Rate Limiting** - Prevent abuse and DDoS

### Code Quality
- **Clean Architecture** - Separation of concerns
- **SOLID Principles** - Follow SOLID principles
- **DRY Principle** - Don't Repeat Yourself
- **Comprehensive Testing** - 80%+ code coverage
- **Security First** - Security built into architecture

---

## 6. Implementation Timeline

### Phase 1: Setup (Day 1-2)
- Set up development environment
- Configure Docker Compose
- Set up MongoDB and Redis
- Initialize project structure

### Phase 2: Backend Core (Day 3-4)
- Implement Auth Service (Spring Boot)
- Implement Profile Service (Spring Boot)
- Implement Leaderboard Service (Spring Boot)
- Set up API Gateway
- Implement JWT authentication

### Phase 3: Real-time Services (Day 5-6)
- Implement Matchmaking Service (Node.js)
- Implement Game Engine Service (Node.js)
- Set up WebSocket communication
- Implement matchmaking algorithm
- Implement game logic and physics

### Phase 4: Frontend (Day 7-8)
- Set up Angular application
- Implement authentication UI
- Implement dashboard
- Implement matchmaking UI
- Integrate Phaser game
- Implement game arena UI

### Phase 5: Testing & Deployment (Day 9-10)
- Write unit tests
- Write integration tests
- Write end-to-end tests
- Security testing
- Performance testing
- Deploy to cloud infrastructure

---

## 7. Success Criteria

### Functional Requirements
- ✅ User registration and authentication
- ✅ Hero selection system (multiple hero selection before matchmaking)
- ✅ Real-time matchmaking (global score/rank-based with multiple hero support)
- ✅ Arena selection system (voting/elimination)
- ✅ Weapon selection system (10 weapons, alternating selection)
- ✅ Turn-based 2D artillery battles (15 seconds per turn, 4-5 minutes total)
- ✅ Movement system (4 moves per game, left/right only)
- ✅ Scoring system (accuracy, back-to-back hits, repositioning saves)
- ✅ Health system (different HP per hero type, balanced HP when matched)
- ✅ Player progression (global score, rank tiers like Valorant)
- ✅ Leaderboard system (with filtering: region, hero type, winning percentage, weapons)
- ✅ Configuration file support (weapons, penalties, rank tiers, scoring formulas)
- ✅ Disconnection handling (1 minute rejoin window, configurable penalties)

### Non-Functional Requirements
- ✅ API response time: < 200ms for 95% of requests
- ✅ WebSocket latency: < 50ms for game actions
- ✅ System uptime: 99.9%
- ✅ Support 10,000+ concurrent players
- ✅ 100% of requests authenticated
- ✅ All sensitive data encrypted

---

## 8. Next Steps

1. **Review Architecture** - Review [System Architecture](./02-SYSTEM_ARCHITECTURE.md)
2. **Understand Components** - Review [Component Design](./03-COMPONENT_DESIGN.md)
3. **Study Data Flow** - Review [Data Flow](./04-DATA_FLOW.md)
4. **Plan Implementation** - Reference [Low-Level Design (LLD)](../LOW_LEVEL_DESIGN/README.md) (To be created)
5. **Start Development** - Begin with Auth Service implementation after LLD is complete

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

