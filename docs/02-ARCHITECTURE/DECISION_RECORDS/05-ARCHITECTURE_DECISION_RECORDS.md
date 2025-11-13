# 📋 Architecture Decision Records (ADR)
## Battle Arena - Multiplayer Artillery Battle Game

**Document Version:** 2.0  
**Last Updated:** 2024  
**Status:** Draft - Updated with clarified mechanics

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

## 1. Introduction

### 1.1 Purpose
This document records architectural decisions made for the Battle Arena project, including the context, decision, and consequences of each decision.

### 1.2 ADR Format
Each ADR follows this format:
- **Title:** Short descriptive title
- **Status:** Proposed, Accepted, Rejected, Deprecated, Superseded
- **Context:** The issue or problem we're addressing
- **Decision:** The architectural decision we're making
- **Consequences:** The positive and negative consequences of the decision

### 1.3 ADR Template
```markdown
## ADR-XXX: [Title]

**Status:** [Proposed/Accepted/Rejected/Deprecated/Superseded]  
**Date:** [YYYY-MM-DD]  
**Deciders:** [Team/Stakeholders]

### Context
[Describe the issue or problem]

### Decision
[Describe the architectural decision]

### Consequences
**Positive:**
- [Positive consequence 1]
- [Positive consequence 2]

**Negative:**
- [Negative consequence 1]
- [Negative consequence 2]

**Neutral:**
- [Neutral consequence 1]
- [Neutral consequence 2]
```

---

## 2. Architecture Decisions

### ADR-001: Microservices Architecture

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Architecture Team

#### Context
We need to build a scalable, maintainable system that can handle real-time multiplayer gameplay, user authentication, profile management, and leaderboard functionality. The system needs to support independent scaling of different components and allow for technology diversity.

#### Decision
We will use a **microservices architecture** with the following services:
- **Auth Service:** Spring Boot (Java) - User authentication and authorization (JWT, Google OAuth)
- **Profile Service:** Spring Boot (Java) - User profile, global score, and rank tier tracking
- **Leaderboard Service:** Spring Boot (Java) - Leaderboard and rankings with filtering
- **Matchmaking Service:** Node.js (Express, Socket.io) - Hero selection, matchmaking, arena selection, weapon selection
- **Game Engine Service:** Node.js (Express, Socket.io) - Turn-based 2D artillery game logic, movement, scoring, physics
- **Configuration Service:** Configuration file management for weapons, penalties, rank tiers, scoring formulas

#### Consequences
**Positive:**
- **Independent Scaling:** Each service can scale independently based on load
- **Technology Diversity:** Use best technology for each service (Java for business logic, Node.js for real-time)
- **Fault Isolation:** Failures in one service don't affect others
- **Team Autonomy:** Different teams can work on different services
- **Maintainability:** Clear separation of concerns

**Negative:**
- **Increased Complexity:** More services to manage and deploy
- **Inter-service Communication:** Network latency and potential failures
- **Data Consistency:** Challenges with distributed data
- **Operational Overhead:** More services to monitor and maintain

**Neutral:**
- **Learning Curve:** Team needs to understand microservices patterns
- **Infrastructure:** Requires containerization and orchestration

---

### ADR-002: JWT-Based Authentication

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Security Team, Architecture Team

#### Context
We need a stateless authentication mechanism that works across multiple services in a microservices architecture. The authentication should be secure, scalable, and support both REST APIs and WebSocket connections.

#### Decision
We will use **JWT (JSON Web Tokens)** for authentication with the following specifications:
- **Algorithm:** HS512 (HMAC with SHA-512)
- **Token Types:** Access token (24 hours) and refresh token (7 days)
- **Storage:** HTTP-only cookies (preferred) or secure localStorage
- **Validation:** Token validation at API gateway and service level
- **Revocation:** Token blacklisting support (optional)
- **OAuth Support:** Google OAuth 2.0 for third-party authentication (optional, Story-2.7)

#### Consequences
**Positive:**
- **Stateless:** No server-side session storage required
- **Scalable:** Works well with microservices and load balancing
- **Secure:** Cryptographically signed tokens
- **Flexible:** Can include custom claims
- **Cross-domain:** Works across different domains

**Negative:**
- **Token Size:** Larger than session IDs
- **Revocation:** Difficult to revoke tokens before expiration
- **Security:** Tokens must be stored securely on client
- **Expiration:** Requires refresh token mechanism

**Neutral:**
- **Implementation:** Requires JWT library and secret management
- **Standards:** Follows JWT standard (RFC 7519)

---

### ADR-003: MongoDB for Data Storage

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Architecture Team, Database Team

#### Context
We need a database that can handle user data, profiles, match history, and leaderboard data. The database should support flexible schema, horizontal scaling, and good performance for read-heavy operations.

#### Decision
We will use **MongoDB** as the primary database with the following configuration:
- **Version:** MongoDB 6.0+
- **Deployment:** MongoDB Atlas (managed) or self-hosted
- **Schema Design:** Document-based schema with proper indexing
- **Replication:** Replica set for high availability
- **Sharding:** Sharding for horizontal scaling (future)

#### Consequences
**Positive:**
- **Flexible Schema:** Easy to evolve schema as requirements change
- **Horizontal Scaling:** Sharding support for large datasets
- **Performance:** Good performance for read-heavy operations
- **JSON-like Structure:** Natural fit for Node.js and JavaScript
- **Aggregation Pipeline:** Powerful querying capabilities

**Negative:**
- **No Joins:** Requires careful data modeling
- **Consistency:** Eventual consistency in distributed setups
- **Memory Usage:** In-memory storage can be memory-intensive
- **Learning Curve:** Team needs to understand NoSQL concepts

**Neutral:**
- **Tools:** Requires MongoDB-specific tools and knowledge
- **Migration:** May need data migration tools for schema changes

---

### ADR-004: Redis for Caching and Queue Management

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Architecture Team, Performance Team

#### Context
We need a fast, in-memory data store for matchmaking queue management, lobby storage, and caching frequently accessed data. The solution should support sorted sets for queue management and pub/sub for real-time communication.

#### Decision
We will use **Redis** for caching and queue management with the following use cases:
- **Matchmaking Queue:** Sorted sets for XP-based queue management
- **Lobby Storage:** Hash data structure for lobby information
- **Caching:** Cache frequently accessed data (user profiles, leaderboard)
- **Pub/Sub:** Real-time communication between services
- **Session Storage:** Optional session storage (if needed)

#### Consequences
**Positive:**
- **Performance:** Extremely fast in-memory operations
- **Data Structures:** Rich data structures (sorted sets, hashes, pub/sub)
- **Scalability:** Can be clustered for horizontal scaling
- **Persistence:** Optional persistence with RDB and AOF
- **Simple API:** Easy to use and integrate

**Negative:**
- **Memory Limitations:** Limited by available memory
- **Cost:** Memory can be expensive at scale
- **Persistence:** Requires careful configuration for data durability
- **Single-threaded:** Single-threaded for commands (mitigated by clustering)

**Neutral:**
- **Deployment:** Requires Redis server deployment
- **Monitoring:** Requires Redis-specific monitoring tools

---

### ADR-005: Socket.io for Real-time Communication

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Architecture Team, Real-time Team

#### Context
We need real-time bidirectional communication for matchmaking and game engine services. The solution should handle WebSocket connections, automatic reconnection, and work across different browsers and networks.

#### Decision
We will use **Socket.io** for real-time communication with the following configuration:
- **Transport:** WebSocket with fallback to HTTP long-polling
- **Authentication:** JWT-based authentication in handshake
- **Rooms:** Use Socket.io rooms for game rooms and lobbies
- **Events:** Custom events for game actions and matchmaking
- **Scaling:** Redis adapter for horizontal scaling

#### Consequences
**Positive:**
- **Cross-browser:** Works across different browsers
- **Automatic Fallback:** Falls back to HTTP long-polling if WebSocket unavailable
- **Reconnection:** Automatic reconnection handling
- **Rooms:** Built-in room management
- **Event-based:** Clean event-based API

**Negative:**
- **Overhead:** Larger than raw WebSocket
- **Complexity:** More complex than raw WebSocket
- **Scaling:** Requires Redis adapter for horizontal scaling
- **Performance:** Slightly slower than raw WebSocket

**Neutral:**
- **Learning Curve:** Team needs to understand Socket.io patterns
- **Dependencies:** Requires Socket.io server and client libraries

---

### ADR-006: Matter.js for Physics Engine

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Game Engine Team, Physics Team

#### Context
We need a physics engine for server-side projectile trajectory calculations. The engine should be deterministic, lightweight, and easy to integrate with Node.js.

#### Decision
We will use **Matter.js** for physics calculations with the following approach:
- **Server-side Authority:** All physics calculations on server
- **Deterministic:** Ensure deterministic physics for consistency
- **Simplified Physics:** Use simplified physics models for performance
- **Trajectory Calculation:** Calculate projectile trajectory server-side
- **Damage Calculation:** Calculate damage based on impact position

#### Consequences
**Positive:**
- **Lightweight:** Lightweight physics engine
- **Deterministic:** Deterministic physics for server-side authority
- **Easy Integration:** Easy to integrate with Node.js
- **Good Documentation:** Good documentation and examples
- **Performance:** Good performance for simple physics

**Negative:**
- **Limited Features:** Limited compared to full physics engines
- **Customization:** May need customization for game-specific physics
- **Accuracy:** Simplified physics may not be as accurate
- **Learning Curve:** Team needs to understand physics engine

**Neutral:**
- **Maintenance:** Requires maintenance and updates
- **Testing:** Requires testing for physics accuracy

---

### ADR-007: Docker Containerization

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** DevOps Team, Architecture Team

#### Context
We need a consistent deployment environment across development, staging, and production. The solution should support easy scaling, isolation, and version control.

#### Decision
We will use **Docker** for containerization with the following approach:
- **Multi-stage Builds:** Use multi-stage builds for smaller images
- **Docker Compose:** Use Docker Compose for local development
- **Health Checks:** Implement health checks for all services
- **Resource Limits:** Set resource limits for containers
- **Image Tagging:** Use semantic versioning for image tags

#### Consequences
**Positive:**
- **Consistency:** Consistent environments across all stages
- **Isolation:** Service isolation and dependency management
- **Scalability:** Easy to scale services horizontally
- **Version Control:** Version control for deployments
- **Portability:** Works across different platforms

**Negative:**
- **Learning Curve:** Team needs to understand Docker
- **Complexity:** More complex than traditional deployment
- **Resource Usage:** Containers consume resources
- **Debugging:** Can be more difficult to debug

**Neutral:**
- **Tooling:** Requires Docker tooling and knowledge
- **CI/CD:** Requires Docker-aware CI/CD pipelines

---

### ADR-008: Angular for Frontend Framework

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Frontend Team, Architecture Team

#### Context
We need a modern, TypeScript-based frontend framework that supports component-based architecture, routing, and real-time communication. The framework should be maintainable and scalable.

#### Decision
We will use **Angular** for the frontend with the following configuration:
- **Version:** Angular 17+
- **TypeScript:** TypeScript for type safety
- **RxJS:** RxJS for reactive programming
- **TailwindCSS:** TailwindCSS for styling
- **Phaser 3:** Phaser 3 for game rendering

#### Consequences
**Positive:**
- **Type Safety:** TypeScript provides type safety
- **Component-based:** Component-based architecture for reusability
- **Tooling:** Excellent tooling and CLI
- **Community:** Large community and ecosystem
- **Maintainability:** Good for large applications

**Negative:**
- **Learning Curve:** Steeper learning curve than React/Vue
- **Bundle Size:** Larger bundle size (mitigated by lazy loading)
- **Complexity:** More complex than lighter frameworks
- **Performance:** Can be slower than lighter frameworks

**Neutral:**
- **Framework:** Opinionated framework with specific patterns
- **Updates:** Regular updates and breaking changes

---

### ADR-009: REST APIs for Synchronous Communication

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** API Team, Architecture Team

#### Context
We need a standard communication protocol for synchronous operations like user registration, login, profile updates, and leaderboard queries. The protocol should be stateless, cacheable, and follow industry standards.

#### Decision
We will use **REST APIs** for synchronous communication with the following specifications:
- **HTTP Methods:** GET, POST, PUT, DELETE for CRUD operations
- **Status Codes:** Standard HTTP status codes
- **JSON Format:** JSON for request and response bodies
- **Versioning:** URL-based versioning (/api/v1/)
- **Authentication:** JWT tokens in Authorization header

#### Consequences
**Positive:**
- **Standard:** Industry-standard protocol
- **Stateless:** Stateless and cacheable
- **Simple:** Simple to understand and implement
- **Tools:** Wide range of tools and libraries
- **Testing:** Easy to test with standard tools

**Negative:**
- **Overhead:** HTTP overhead compared to binary protocols
- **Limited Real-time:** Not suitable for real-time communication
- **Verbose:** Can be verbose for complex operations
- **Caching:** Requires careful cache management

**Neutral:**
- **Standards:** Follows REST principles and HTTP standards
- **Documentation:** Requires API documentation

---

### ADR-010: Server-Side Game Authority

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Game Engine Team, Security Team

#### Context
We need to prevent cheating and ensure fair gameplay. All game logic and physics calculations must be authoritative on the server to prevent client-side manipulation.

#### Decision
We will implement **server-side game authority** with the following approach:
- **Server Authority:** All game logic and physics calculations on server
- **Client Prediction:** Client can predict actions for responsiveness
- **State Reconciliation:** Server reconciles client predictions
- **Validation:** Server validates all client actions
- **Anti-cheat:** Server-side validation prevents cheating

#### Consequences
**Positive:**
- **Security:** Prevents client-side cheating
- **Fairness:** Ensures fair gameplay
- **Consistency:** Consistent game state across all clients
- **Authority:** Single source of truth for game state
- **Trust:** Players can trust the game is fair

**Negative:**
- **Latency:** Network latency affects gameplay
- **Server Load:** Increased server load for calculations
- **Complexity:** More complex than client-side authority
- **Synchronization:** Requires state synchronization

**Neutral:**
- **Implementation:** Requires careful implementation of client prediction
- **Testing:** Requires testing for latency and synchronization

---

### ADR-011: XP-Based Matchmaking

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Matchmaking Team, Game Design Team

#### Context
We need a fair matchmaking system that matches players of similar skill levels. The system should be efficient, scalable, and provide good match quality.

#### Decision
We will use **XP-based matchmaking** with the following algorithm:
- **XP Threshold:** Initial threshold of 100 XP difference
- **Dynamic Expansion:** Expand threshold over time (20% every 5 seconds)
- **Best Match:** Select player with closest XP
- **Queue Management:** Redis sorted sets for efficient queue management
- **Timeout:** Maximum wait time of 30 seconds

#### Consequences
**Positive:**
- **Fairness:** Matches players of similar skill levels
- **Efficiency:** Efficient matching algorithm
- **Scalability:** Scales well with Redis sorted sets
- **Flexibility:** Can adjust thresholds based on queue size
- **User Experience:** Good match quality for players

**Negative:**
- **Simplicity:** May not account for other factors (win rate, recent performance)
- **Wait Time:** May increase wait time for high/low XP players
- **Abuse:** Players may try to manipulate XP
- **Accuracy:** XP may not perfectly reflect skill level

**Neutral:**
- **Algorithm:** Can be improved with machine learning (future)
- **Metrics:** Requires metrics to measure match quality

---

### ADR-012: Clean Architecture Layers

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Architecture Team, Development Team

#### Context
We need a clean, maintainable architecture that separates concerns and allows for easy testing and maintenance. The architecture should follow industry best practices and design patterns.

#### Decision
We will implement **Clean Architecture** with the following layers:
- **Presentation Layer:** Controllers, DTOs, and request/response handling
- **Application Layer:** Services, business logic, and use cases
- **Domain Layer:** Entities, value objects, and domain logic
- **Infrastructure Layer:** Repositories, database, and external services
- **Dependency Rule:** Dependencies point inward (presentation → application → domain ← infrastructure)

#### Consequences
**Positive:**
- **Separation of Concerns:** Clear separation of concerns
- **Testability:** Easy to test with dependency injection
- **Maintainability:** Easy to maintain and modify
- **Flexibility:** Easy to change implementations
- **Reusability:** Reusable components and services

**Negative:**
- **Complexity:** More complex than simple architectures
- **Learning Curve:** Team needs to understand Clean Architecture
- **Overhead:** More layers and abstractions
- **Time:** Takes more time to implement

**Neutral:**
- **Patterns:** Requires understanding of design patterns
- **Documentation:** Requires good documentation

---

### ADR-013: Comprehensive Security Measures

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** Security Team, Architecture Team

#### Context
We need comprehensive security measures to protect user data, prevent attacks, and ensure system security. Security must be built into the architecture from the start.

#### Decision
We will implement **comprehensive security measures** including:
- **Authentication:** JWT-based authentication with strong passwords
- **Authorization:** RBAC and resource-based authorization
- **Input Validation:** Comprehensive input validation and sanitization
- **Output Encoding:** Output encoding to prevent XSS
- **Encryption:** Encryption at rest and in transit
- **Rate Limiting:** Rate limiting to prevent abuse
- **Security Headers:** Security headers for HTTP responses
- **Logging:** Security logging and monitoring
- **Auditing:** Regular security audits and penetration testing

#### Consequences
**Positive:**
- **Security:** Comprehensive security protection
- **Compliance:** Compliance with security standards
- **Trust:** Users can trust the system
- **Protection:** Protection against common attacks
- **Monitoring:** Security monitoring and alerting

**Negative:**
- **Complexity:** More complex implementation
- **Performance:** Slight performance overhead
- **Cost:** Additional infrastructure and tools
- **Maintenance:** Requires ongoing security maintenance

**Neutral:**
- **Standards:** Follows security standards (OWASP, etc.)
- **Updates:** Requires regular security updates

---

### ADR-014: Comprehensive Testing Strategy

**Status:** Accepted  
**Date:** 2024-01-01  
**Deciders:** QA Team, Development Team

#### Context
We need a comprehensive testing strategy to ensure code quality, reliability, and maintainability. Testing should cover unit tests, integration tests, and end-to-end tests.

#### Decision
We will implement **comprehensive testing** with the following approach:
- **Unit Tests:** Test individual components and functions
- **Integration Tests:** Test service integration and API endpoints
- **End-to-End Tests:** Test complete user flows
- **Performance Tests:** Test performance under load
- **Security Tests:** Test security vulnerabilities
- **Test Coverage:** Aim for 80%+ code coverage
- **CI/CD Integration:** Integrate tests into CI/CD pipeline

#### Consequences
**Positive:**
- **Quality:** Higher code quality
- **Reliability:** More reliable system
- **Maintainability:** Easier to maintain and refactor
- **Confidence:** Confidence in deployments
- **Documentation:** Tests serve as documentation

**Negative:**
- **Time:** Takes time to write and maintain tests
- **Cost:** Additional development time and resources
- **Complexity:** More complex test setup
- **False Positives:** May have false positives in tests

**Neutral:**
- **Tools:** Requires testing tools and frameworks
- **Culture:** Requires testing culture in team

---

## 3. Decision Log

### 3.1 Accepted Decisions
- ADR-001: Microservices Architecture
- ADR-002: JWT-Based Authentication
- ADR-003: MongoDB for Data Storage
- ADR-004: Redis for Caching and Queue Management
- ADR-005: Socket.io for Real-time Communication
- ADR-006: Matter.js for Physics Engine
- ADR-007: Docker Containerization
- ADR-008: Angular for Frontend Framework
- ADR-009: REST APIs for Synchronous Communication
- ADR-010: Server-Side Game Authority
- ADR-011: XP-Based Matchmaking
- ADR-012: Clean Architecture Layers
- ADR-013: Comprehensive Security Measures
- ADR-014: Comprehensive Testing Strategy

### 3.2 Proposed Decisions
- None currently

### 3.3 Rejected Decisions
- None currently

### 3.4 Deprecated Decisions
- None currently

### 3.5 Superseded Decisions
- None currently

---

## 4. Decision Process

### 4.1 Decision Making Process
1. **Identify Need:** Identify the need for an architectural decision
2. **Propose Solution:** Propose one or more solutions
3. **Evaluate Options:** Evaluate pros and cons of each option
4. **Make Decision:** Make decision based on evaluation
5. **Document Decision:** Document decision in ADR
6. **Communicate Decision:** Communicate decision to team
7. **Implement Decision:** Implement decision in code
8. **Review Decision:** Review decision periodically

### 4.2 Decision Criteria
- **Technical Feasibility:** Is the solution technically feasible?
- **Performance:** Does the solution meet performance requirements?
- **Security:** Does the solution meet security requirements?
- **Maintainability:** Is the solution maintainable?
- **Scalability:** Does the solution scale well?
- **Cost:** Is the solution cost-effective?
- **Time:** Can the solution be implemented in time?
- **Risk:** What are the risks of the solution?

---

## 5. Conclusion

### 5.1 Summary
This document records all architectural decisions made for the Battle Arena project. Each decision is documented with context, decision, and consequences.

### 5.2 Maintenance
This document should be updated whenever a new architectural decision is made or an existing decision is changed. All team members should be aware of these decisions and their implications.

### 5.3 Review
This document should be reviewed periodically to ensure decisions are still valid and appropriate. Decisions may need to be updated or superseded as the project evolves.

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming - These are MANDATORY for all implementations.**

---

**Document Control:**
- **Author:** Architecture Team
- **Reviewer:** Technical Lead
- **Approval:** CTO
- **Next Review Date:** Quarterly

