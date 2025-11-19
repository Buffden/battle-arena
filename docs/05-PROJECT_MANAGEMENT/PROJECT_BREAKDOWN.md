# Project Breakdown: Epics, Stories & Subtasks

This document provides a complete breakdown of the Battle Arena project for GitHub Projects Kanban Board.

---

## 📋 How to Use This Document

1. **Epics** = Major features/phases (create as Milestones in GitHub)
2. **User Stories** = Create as Issues in GitHub
3. **Subtasks** = Create as checklist items within Issues OR as separate linked issues

---

## 🎯 Two Breakdown Approaches

This project uses **two complementary breakdown approaches**:

### 1. **Vertical Slice (VS) Breakdown** - Player Experience Focus

**Purpose:** Organize work by complete player experiences (vertical slices)
**Use When:** Planning milestones, tracking player-facing features, game development milestones
**Structure:** VS-1 through VS-7 (Foundation → Authentication → First Match → Progression → Full Features → Content Complete → Gold Master)

**📁 EPIC Files:** See [EPICS directory](./EPICS/) for complete VS-based EPIC documentation:

- [EPIC-VS-1: Foundation](./EPICS/EPIC_VS_1_FOUNDATION.md)
- [EPIC-VS-2: Authentication](./EPICS/EPIC_VS_2_AUTHENTICATION.md)
- [EPIC-VS-3: First Playable Match](./EPICS/EPIC_VS_3_FIRST_PLAYABLE_MATCH.md)
- [EPIC-VS-4: Profile & Progression](./EPICS/EPIC_VS_4_PROFILE_AND_PROGRESSION.md)
- [EPIC-VS-5: Full Game Features](./EPICS/EPIC_VS_5_FULL_GAME_FEATURES.md)
- [EPIC-VS-6: Content Complete](./EPICS/EPIC_VS_6_CONTENT_COMPLETE.md)
- [EPIC-VS-7: Gold Master](./EPICS/EPIC_VS_7_GOLD_MASTER.md)

**📖 Planning Guide:** See [Game Development Planning Guide](./EPICS/CORE_IDEA_GAME_DEVELOPMENT_PLANNING.md) for VS methodology

### 2. **Phase-Based Breakdown** - Technical Implementation Focus

**Purpose:** Organize work by technical services and implementation phases
**Use When:** Implementing specific services, technical task breakdown, service-level planning
**Structure:** Phase 1-9 (Foundation → Auth → Profile → Leaderboard → Matchmaking → Game Engine → Frontend → Deployment → QA)

**📁 Phase Files:** See [ISSUE_TEMPLATES directory](./ISSUE_TEMPLATES/) for Phase documentation:

- [Phase 1: Foundation](./ISSUE_TEMPLATES/PHASE_1_FOUNDATION.md)
- [Phase 2: Authentication](./ISSUE_TEMPLATES/PHASE_2_AUTHENTICATION.md)
- [Phase 3: Profile](./ISSUE_TEMPLATES/PHASE_3_PROFILE.md)
- [Phase 4: Leaderboard](./ISSUE_TEMPLATES/PHASE_4_LEADERBOARD.md)
- [Phase 5: Matchmaking](./ISSUE_TEMPLATES/PHASE_5_MATCHMAKING.md)
- [Phase 6: Game Engine](./ISSUE_TEMPLATES/PHASE_6_GAME_ENGINE.md)
- [Phase 7: Frontend](./ISSUE_TEMPLATES/PHASE_7_FRONTEND.md)
- [Phase 8: Deployment](./ISSUE_TEMPLATES/PHASE_8_DEPLOYMENT.md)
- [Phase 9: Quality Assurance](./ISSUE_TEMPLATES/PHASE_9_QUALITY_ASSURANCE.md)

### Relationship Between VS and Phases

- **VS Epics** = **What** to build and **in what order** (player experience)
- **Phase Documents** = **How** to build it (technical implementation)
- **VS Epics reference Phase Documents** for technical details
- **One VS Epic may span multiple Phases** (e.g., VS-3 uses Phase 5, 6, and 7)

**Example:**

- **EPIC-VS-3** (First Playable Match) = Player can play one match end-to-end
- **Phase 5** (Matchmaking) = Technical specs for matchmaking service
- **Phase 6** (Game Engine) = Technical specs for game engine service
- **Phase 7** (Frontend) = Technical specs for frontend gameplay UI

---

## 🎮 Vertical Slice (VS) Breakdown

**Recommended for game development milestones and player experience tracking.**

### VS-1: Foundation & Infrastructure Setup

**Milestone:** Vertical Slice  
**Priority:** High  
**Labels:** `epic:vertical-slice`, `infrastructure`, `priority:high`

**Complete EPIC:** [EPIC-VS-1: Foundation](./EPICS/EPIC_VS_1_FOUNDATION.md)

**Stories:**

- Story 1: Project structure created
- Story 2: Docker Compose configured
- Story 3: CI/CD pipelines set up

---

### VS-2: Player Authentication & Identity

**Milestone:** Vertical Slice  
**Priority:** High  
**Labels:** `epic:vertical-slice`, `epic:auth`, `priority:high`

**Complete EPIC:** [EPIC-VS-2: Authentication](./EPICS/EPIC_VS_2_AUTHENTICATION.md)

**Stories:**

- Story 1: Player can register
- Story 2: Player can login
- Story 3: Player can logout

**Technical Reference:** Phase 2 (Authentication), Phase 7 (Frontend - Auth UI)

---

### VS-3: First Playable Match

**Milestone:** Vertical Slice  
**Priority:** High  
**Labels:** `epic:vertical-slice`, `epic:gameplay`, `priority:high`

**Complete EPIC:** [EPIC-VS-3: First Playable Match](./EPICS/EPIC_VS_3_FIRST_PLAYABLE_MATCH.md)

**Stories:**

- Story 1: Player can click "Play"
- Story 2: Player gets matched (bot)
- Story 3: Player sees arena
- Story 4: Player can fire shots
- Story 5: Player sees match result

**Technical Reference:** Phase 5 (Matchmaking), Phase 6 (Game Engine), Phase 7 (Frontend - Gameplay)

---

### VS-4: Profile & Progression

**Milestone:** Alpha  
**Priority:** High  
**Labels:** `epic:vertical-slice`, `epic:progression`, `priority:high`

**Complete EPIC:** [EPIC-VS-4: Profile & Progression](./EPICS/EPIC_VS_4_PROFILE_AND_PROGRESSION.md)

**Stories:**

- Story 1: Player can view profile
- Story 2: Player can view leaderboard
- Story 3: Match results update profile

**Technical Reference:** Phase 3 (Profile), Phase 4 (Leaderboard), Phase 7 (Frontend - Profile/Leaderboard UI)

---

### VS-5: Full Game Features

**Milestone:** Beta  
**Priority:** High  
**Labels:** `epic:vertical-slice`, `epic:features`, `priority:high`

**Complete EPIC:** [EPIC-VS-5: Full Game Features](./EPICS/EPIC_VS_5_FULL_GAME_FEATURES.md)

**Stories:**

- Story 1: Player can select heroes
- Story 2: Player can select weapons
- Story 3: Player can vote on arenas
- Story 4: Player can match with real players

**Technical Reference:** Phase 5 (Matchmaking - selection systems), Phase 6 (Game Engine - integration), Phase 7 (Frontend - selection UIs)

---

### VS-6: Content Complete

**Milestone:** Content Complete  
**Priority:** Medium  
**Labels:** `epic:vertical-slice`, `epic:deployment`, `priority:medium`

**Complete EPIC:** [EPIC-VS-6: Content Complete](./EPICS/EPIC_VS_6_CONTENT_COMPLETE.md)

**Stories:**

- Story 1: Application is containerized
- Story 2: Application is comprehensively tested
- Story 3: Application is fully documented

**Technical Reference:** Phase 8 (Deployment), Phase 9 (Quality Assurance)

---

### VS-7: Gold Master

**Milestone:** Gold Master  
**Priority:** High  
**Labels:** `epic:vertical-slice`, `epic:production`, `priority:high`

**Complete EPIC:** [EPIC-VS-7: Gold Master](./EPICS/EPIC_VS_7_GOLD_MASTER.md)

**Stories:**

- Story 1: Application is fully monitored
- Story 2: Application has centralized logging
- Story 3: Application is production-ready

**Technical Reference:** Phase 8 (Deployment Architecture - monitoring/logging)

---

## 🔧 Phase-Based Breakdown (Technical Implementation)

**Recommended for service-level implementation and technical task breakdown.**

---

## 🎯 EPIC 1: Foundation & Infrastructure Setup

**Milestone:** Phase 1: Foundation  
**Priority:** High  
**Labels:** `infrastructure`, `priority:high`

### Story 1.1: Project Structure & Repository Setup

**Issue Title:** `[EPIC-1] Set up project structure and repository`

**Description:**
Set up the complete project structure with all microservices, frontend, and infrastructure directories following clean architecture principles.

**Acceptance Criteria:**

- [ ] Repository structure created
- [ ] All service directories initialized
- [ ] README files created for each service
- [ ] .gitignore configured
- [ ] Basic documentation structure in place

**Subtasks:**

- [ ] Create root project structure
- [ ] Initialize backend-services directory
  - [ ] Create auth-service directory
  - [ ] Create profile-service directory
  - [ ] Create leaderboard-service directory
  - [ ] Create matchmaking-service directory
  - [ ] Create game-engine directory
- [ ] Initialize frontend-service directory
- [ ] Create deployments directory structure
- [ ] Create database directory for init scripts
- [ ] Create scripts directory
- [ ] Add root README.md
- [ ] Configure .gitignore for all services
- [ ] Create service-specific README files

---

### Story 1.2: Development Environment Setup

**Issue Title:** `[EPIC-1] Set up development environment and tooling`

**Description:**
Configure development environment with Docker, Docker Compose, and all necessary development tools.

**Acceptance Criteria:**

- [ ] Docker and Docker Compose installed
- [ ] Local development environment working
- [ ] All services can run locally
- [ ] Development scripts created

**Subtasks:**

- [ ] Install Docker and Docker Compose
- [ ] Create docker-compose.yml for local development
- [ ] Configure MongoDB container
- [ ] Configure Redis container
- [ ] Create development startup scripts
- [ ] Create environment variable templates (.env.example)
- [ ] Document local setup process
- [ ] Test local environment setup

---

### Story 1.3: CI/CD Pipeline Setup

**Issue Title:** `[EPIC-1] Set up CI/CD pipeline with GitHub Actions`

**Description:**
Create GitHub Actions workflows for automated testing, building, and deployment.

**Acceptance Criteria:**

- [ ] CI pipeline runs on PRs
- [ ] Tests run automatically
- [ ] Build verification works
- [ ] Deployment pipeline configured

**Subtasks:**

- [ ] Create GitHub Actions workflow for backend services
- [ ] Create GitHub Actions workflow for frontend
- [ ] Configure automated testing
- [ ] Configure build verification
- [ ] Set up SonarCloud/SonarQube integration (code quality analysis, quality gates)
- [ ] Set up deployment workflows (future)
- [ ] Document CI/CD process

---

## 🔐 EPIC 2: Authentication & User Management

**Milestone:** Phase 2: Authentication  
**Priority:** High  
**Labels:** `backend:auth`, `priority:high`

### Story 2.1: Auth Service - Spring Boot Setup

**Issue Title:** `[EPIC-2] Set up Auth Service with Spring Boot`

**Description:**
Initialize Spring Boot project for Auth Service with all necessary dependencies and configurations.

**Acceptance Criteria:**

- [ ] Spring Boot project created
- [ ] Dependencies configured (Spring Security, MongoDB, JWT)
- [ ] Application properties configured
- [ ] Basic project structure follows clean architecture

**Subtasks:**

- [ ] Create Spring Boot project structure
- [ ] Add Maven dependencies (spring-boot-starter-web, spring-boot-starter-security, spring-boot-starter-data-mongodb, JWT library)
- [ ] Configure application.properties
- [ ] Set up package structure (controller, service, repository, model, config)
- [ ] Create Application.java main class
- [ ] Configure CORS
- [ ] Set up logging configuration
- [ ] Create basic health check endpoint

---

### Story 2.2: User Registration (US-001)

**Issue Title:** `[EPIC-2] Implement user registration endpoint`

**Description:**
As a user, I want to register with username and email so that I can create an account.

**Acceptance Criteria:**

- [ ] POST /api/auth/register endpoint created
- [ ] Username and email validation
- [ ] Duplicate username/email check
- [ ] Password hashing with BCrypt (12 rounds)
- [ ] User saved to MongoDB
- [ ] Success response returned
- [ ] Unit tests with 80%+ coverage

**Subtasks:**

- [ ] Create User model/entity
- [ ] Create UserRepository interface
- [ ] Create UserService with registration logic
- [ ] Create AuthController with /register endpoint
- [ ] Implement input validation
- [ ] Implement duplicate check
- [ ] Implement password hashing
- [ ] Create UserDTO for request/response
- [ ] Write unit tests for UserService
- [ ] Write integration tests for endpoint
- [ ] Update API documentation

---

### Story 2.3: User Login (US-002)

**Issue Title:** `[EPIC-2] Implement user login with JWT token generation`

**Description:**
As a user, I want to login with my credentials so that I can access the game.

**Acceptance Criteria:**

- [ ] POST /api/auth/login endpoint created
- [ ] Credential validation
- [ ] JWT token generation
- [ ] Token returned in response
- [ ] User info returned
- [ ] Unit tests with 80%+ coverage

**Subtasks:**

- [ ] Create JWT utility class
- [ ] Configure JWT secret and expiration
- [ ] Implement credential validation in UserService
- [ ] Create login method in UserService
- [ ] Create /login endpoint in AuthController
- [ ] Create LoginRequest and LoginResponse DTOs
- [ ] Implement error handling
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update API documentation

---

### Story 2.4: Password Security (US-004)

**Issue Title:** `[EPIC-2] Implement secure password hashing`

**Description:**
As a user, I want my password to be securely hashed so that my account is protected.

**Acceptance Criteria:**

- [ ] BCrypt password hashing (12 rounds)
- [ ] Passwords never stored in plain text
- [ ] Password validation on login
- [ ] Security best practices followed

**Subtasks:**

- [ ] Configure BCrypt with 12 rounds
- [ ] Create PasswordEncoder bean
- [ ] Implement password hashing in registration
- [ ] Implement password verification in login
- [ ] Add password strength validation (optional)
- [ ] Write security tests
- [ ] Document password security practices

---

### Story 2.5: Logout & Session Management (US-003)

**Issue Title:** `[EPIC-2] Implement logout and session management`

**Description:**
As a user, I want to logout so that I can securely end my session.

**Acceptance Criteria:**

- [ ] POST /api/auth/logout endpoint
- [ ] Token invalidation (if using token blacklist)
- [ ] Session cleanup
- [ ] Success response

**Subtasks:**

- [ ] Create logout endpoint
- [ ] Implement token invalidation (optional - depends on JWT strategy)
- [ ] Add session management
- [ ] Write tests
- [ ] Update API documentation

---

### Story 2.6: JWT Token Validation Middleware

**Issue Title:** `[EPIC-2] Create JWT token validation filter/interceptor`

**Description:**
Create middleware to validate JWT tokens on protected endpoints across all services.

**Acceptance Criteria:**

- [ ] JWT validation filter created
- [ ] Token extraction from headers
- [ ] Token validation logic
- [ ] Error handling for invalid tokens
- [ ] Reusable across services

**Subtasks:**

- [ ] Create JwtAuthenticationFilter
- [ ] Create JwtTokenProvider utility
- [ ] Configure Spring Security
- [ ] Add token validation logic
- [ ] Handle expired tokens
- [ ] Handle invalid tokens
- [ ] Write unit tests

---

### Story 2.7: Google OAuth Login (Optional)

**Issue Title:** `[EPIC-2] Implement Google OAuth login`

**Description:**
As a user, I want to login with my Google account so that I can quickly access the game without creating a separate password.

**Acceptance Criteria:**

- [ ] Google OAuth 2.0 client configured
- [ ] POST /api/auth/google endpoint created
- [ ] Google OAuth token validation
- [ ] User creation/authentication via Google account
- [ ] JWT token generation after Google authentication
- [ ] Frontend Google login button integration

**Note:** This is an optional feature. See Phase 2 issue templates (Story-2.7) for detailed implementation guide.

**Subtasks:**

- [ ] Update User model for OAuth support
- [ ] Create Google OAuth Service
- [ ] Implement Google OAuth endpoint
- [ ] Update UserRepository for OAuth queries
- [ ] Add Google OAuth configuration
- [ ] Frontend Google login integration
- [ ] Document JWT usage

---

## 👤 EPIC 3: Profile Service

**Milestone:** Phase 3: Profile Management  
**Priority:** High  
**Labels:** `backend:profile`, `priority:high`

### Story 3.1: Profile Service - Spring Boot Setup

**Issue Title:** `[EPIC-3] Set up Profile Service with Spring Boot`

**Description:**
Initialize Spring Boot project for Profile Service with MongoDB integration.

**Acceptance Criteria:**

- [ ] Spring Boot project created
- [ ] MongoDB connection configured
- [ ] Project structure follows clean architecture
- [ ] Health check endpoint working

**Subtasks:**

- [ ] Create Spring Boot project structure
- [ ] Add Maven dependencies
- [ ] Configure MongoDB connection
- [ ] Set up package structure
- [ ] Create Application.java
- [ ] Configure application.properties
- [ ] Create health check endpoint

---

### Story 3.2: View Profile (US-005)

**Issue Title:** `[EPIC-3] Implement view profile endpoint`

**Description:**
As a user, I want to view my profile so that I can see my statistics.

**Acceptance Criteria:**

- [ ] GET /api/profile/me endpoint
- [ ] Returns user profile with statistics
- [ ] JWT authentication required
- [ ] Profile data from MongoDB
- [ ] Unit tests with 80%+ coverage

**Subtasks:**

- [ ] Create Profile model/entity
- [ ] Create ProfileRepository
- [ ] Create ProfileService
- [ ] Create ProfileController
- [ ] Implement JWT authentication
- [ ] Create ProfileResponse DTO
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update API documentation

---

### Story 3.3: Update Profile (US-006)

**Issue Title:** `[EPIC-3] Implement update profile endpoint`

**Description:**
As a user, I want to update my profile so that I can customize my display name and avatar.

**Acceptance Criteria:**

- [ ] PUT /api/profile/me endpoint
- [ ] Update display name
- [ ] Update avatar (URL or file upload)
- [ ] Validation on input
- [ ] Profile updated in MongoDB

**Subtasks:**

- [ ] Create UpdateProfileRequest DTO
- [ ] Implement update logic in ProfileService
- [ ] Create PUT endpoint in ProfileController
- [ ] Add input validation
- [ ] Handle avatar upload (if file upload)
- [ ] Write tests
- [ ] Update API documentation

---

### Story 3.4: Global Score Tracking (US-007)

**Issue Title:** `[EPIC-3] Implement global score tracking system`

**Description:**
As a user, I want to see my XP and level so that I can track my progression.

**Acceptance Criteria:**

- [ ] Global score stored (infinite, no level cap)
- [ ] Score updates after matches
- [ ] Score displayed in profile
- [ ] Score history tracked (optional)

**Subtasks:**

- [ ] Add globalScore field to Profile model
- [ ] Create score update method
- [ ] Implement score calculation logic
- [ ] Create score update endpoint (or internal service call)
- [ ] Add score to profile response
- [ ] Write tests
- [ ] Document score system

---

### Story 3.5: Rank Tier Calculation

**Issue Title:** `[EPIC-3] Implement rank tier calculation (Valorant-style)`

**Description:**
Calculate and display rank tiers based on global score ranges (like Valorant ranking system).

**Acceptance Criteria:**

- [ ] Rank tiers defined (Iron, Bronze, Silver, Gold, Platinum, Diamond, etc.)
- [ ] Score ranges for each tier
- [ ] Rank calculation based on score
- [ ] Rank displayed in profile
- [ ] Rank change tracking

**Subtasks:**

- [ ] Define rank tier structure
- [ ] Create RankTier enum/class
- [ ] Define score ranges for each tier
- [ ] Implement rank calculation logic
- [ ] Add rankTier field to Profile
- [ ] Create rank update method
- [ ] Add rank to profile response
- [ ] Write tests
- [ ] Document rank system

---

### Story 3.6: Win/Loss Statistics (US-008)

**Issue Title:** `[EPIC-3] Implement win/loss statistics tracking`

**Description:**
As a user, I want to see my win/loss statistics so that I can track my performance.

**Acceptance Criteria:**

- [ ] Wins tracked
- [ ] Losses tracked
- [ ] Matches played tracked
- [ ] Win percentage calculated
- [ ] Statistics displayed in profile

**Subtasks:**

- [ ] Add statistics fields to Profile (wins, losses, matchesPlayed)
- [ ] Create update statistics method
- [ ] Implement win/loss tracking
- [ ] Calculate win percentage
- [ ] Add statistics to profile response
- [ ] Write tests
- [ ] Update API documentation

---

## 🏆 EPIC 4: Leaderboard Service

**Milestone:** Phase 4: Leaderboard  
**Priority:** Medium  
**Labels:** `backend:leaderboard`, `priority:medium`

### Story 4.1: Leaderboard Service - Spring Boot Setup

**Issue Title:** `[EPIC-4] Set up Leaderboard Service with Spring Boot`

**Description:**
Initialize Spring Boot project for Leaderboard Service.

**Subtasks:**

- [ ] Create Spring Boot project structure
- [ ] Add Maven dependencies
- [ ] Configure MongoDB connection
- [ ] Set up package structure
- [ ] Create Application.java
- [ ] Configure application.properties

---

### Story 4.2: Global Leaderboard (US-039)

**Issue Title:** `[EPIC-4] Implement global leaderboard endpoint`

**Description:**
As a user, I want to view the global leaderboard so that I can see top players.

**Acceptance Criteria:**

- [ ] GET /api/leaderboard endpoint
- [ ] Returns top players by global score
- [ ] Pagination support
- [ ] Sorted by score (descending)
- [ ] Unit tests with 80%+ coverage

**Subtasks:**

- [ ] Create LeaderboardService
- [ ] Create LeaderboardController
- [ ] Implement leaderboard query (MongoDB aggregation)
- [ ] Add pagination
- [ ] Create LeaderboardResponse DTO
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update API documentation

---

### Story 4.3: Leaderboard Filtering (US-041)

**Issue Title:** `[EPIC-4] Implement leaderboard filtering (region, hero, win%, weapons)`

**Description:**
As a user, I want to filter leaderboard by region, hero type, winning percentage, and weapons so that I can see rankings in different categories.

**Acceptance Criteria:**

- [ ] Filter by region
- [ ] Filter by hero type
- [ ] Filter by winning percentage range
- [ ] Filter by weapons used
- [ ] Multiple filters can be combined
- [ ] Pagination works with filters

**Subtasks:**

- [ ] Create FilterCriteria DTO
- [ ] Implement region filtering
- [ ] Implement hero type filtering
- [ ] Implement win percentage filtering
- [ ] Implement weapons filtering
- [ ] Combine multiple filters
- [ ] Update leaderboard query
- [ ] Write tests
- [ ] Update API documentation

---

### Story 4.4: Rank Tier Display (US-040)

**Issue Title:** `[EPIC-4] Display rank tiers on leaderboard`

**Description:**
As a user, I want to see my rank tier (like Valorant) so that I know my position.

**Acceptance Criteria:**

- [ ] Rank tier displayed for each player
- [ ] Rank tier icons/badges (optional)
- [ ] Rank tier in leaderboard response

**Subtasks:**

- [ ] Add rank tier to leaderboard query
- [ ] Include rank tier in response
- [ ] Create rank tier display component (frontend - later)
- [ ] Write tests
- [ ] Update API documentation

---

### Story 4.5: Player Statistics on Leaderboard (US-042)

**Issue Title:** `[EPIC-4] Display player statistics on leaderboard`

**Description:**
As a user, I want to see player statistics on the leaderboard so that I can compare performance.

**Acceptance Criteria:**

- [ ] Wins displayed
- [ ] Losses displayed
- [ ] Win percentage displayed
- [ ] Matches played displayed
- [ ] Statistics in leaderboard response

**Subtasks:**

- [ ] Add statistics to leaderboard query
- [ ] Include statistics in response
- [ ] Calculate win percentage
- [ ] Write tests
- [ ] Update API documentation

---

## 🎮 EPIC 5: Matchmaking Service

**Milestone:** Phase 5: Matchmaking  
**Priority:** High  
**Labels:** `backend:matchmaking`, `priority:high`

### Story 5.1: Matchmaking Service - Node.js Setup

**Issue Title:** `[EPIC-5] Set up Matchmaking Service with Node.js and Socket.io`

**Description:**
Initialize Node.js project for Matchmaking Service with Express and Socket.io.

**Acceptance Criteria:**

- [ ] Node.js project created
- [ ] Express server configured
- [ ] Socket.io server configured
- [ ] Redis connection configured
- [ ] Project structure follows clean architecture

**Subtasks:**

- [ ] Create Node.js project structure
- [ ] Initialize package.json
- [ ] Install dependencies (express, socket.io, ioredis, jsonwebtoken)
- [ ] Create server.js/index.js
- [ ] Configure Express
- [ ] Configure Socket.io
- [ ] Configure Redis connection
- [ ] Set up package structure (routes, services, models, middleware)
- [ ] Create environment configuration
- [ ] Add health check endpoint

---

### Story 5.2: Hero Selection System (US-009, US-010, US-011)

**Issue Title:** `[EPIC-5] Implement multiple hero selection before matchmaking`

**Description:**
As a user, I want to select multiple heroes before matchmaking so that I can increase my match chances.

**Acceptance Criteria:**

- [ ] Users can select multiple heroes (checkboxes)
- [ ] Hero selection stored with priority order
- [ ] Hero selection used for matchmaking
- [ ] Selected hero displayed before match starts
- [ ] Random hero selection from matched heroes

**Subtasks:**

- [ ] Create Hero model
- [ ] Create hero selection endpoint/event
- [ ] Store hero selection in Redis
- [ ] Implement hero selection validation
- [ ] Create hero selection UI (frontend - later)
- [ ] Write tests
- [ ] Document hero selection flow

---

### Story 5.3: Join Matchmaking Queue (US-012)

**Issue Title:** `[EPIC-5] Implement join matchmaking queue`

**Description:**
As a user, I want to join the matchmaking queue so that I can find a match.

**Acceptance Criteria:**

- [ ] Socket.io event: join-queue
- [ ] User added to Redis queue
- [ ] Queue status returned
- [ ] JWT authentication required

**Subtasks:**

- [ ] Create matchmaking queue service
- [ ] Implement Redis queue management
- [ ] Create join-queue Socket.io event handler
- [ ] Add user to queue with metadata (score, rank, heroes)
- [ ] Return queue status
- [ ] Write tests
- [ ] Document queue system

---

### Story 5.4: Leave Matchmaking Queue (US-013)

**Issue Title:** `[EPIC-5] Implement leave matchmaking queue`

**Description:**
As a user, I want to leave the matchmaking queue so that I can cancel my search.

**Acceptance Criteria:**

- [ ] Socket.io event: leave-queue
- [ ] User removed from queue
- [ ] Success response

**Subtasks:**

- [ ] Create leave-queue Socket.io event handler
- [ ] Remove user from Redis queue
- [ ] Clean up user data
- [ ] Write tests
- [ ] Update documentation

---

### Story 5.5: Matchmaking Algorithm (US-014, US-017)

**Issue Title:** `[EPIC-5] Implement matchmaking algorithm (score/rank-based with hero compatibility)`

**Description:**
As a user, I want to be matched with players of similar global score/rank and compatible hero selection so that I have fair matches.

**Acceptance Criteria:**

- [ ] Matchmaking based on global score/rank
- [ ] Hero compatibility check
- [ ] Range widening after 5 minutes
- [ ] Fair match creation

**Subtasks:**

- [ ] Design matchmaking algorithm
- [ ] Implement score/rank matching logic
- [ ] Implement hero compatibility check
- [ ] Implement range widening logic
- [ ] Create match creation service
- [ ] Write matchmaking tests
- [ ] Document algorithm

---

### Story 5.6: Queue Status Display (US-016)

**Issue Title:** `[EPIC-5] Implement queue status with position and estimated wait time`

**Description:**
As a user, I want to see my queue status so that I know my position and estimated wait time.

**Acceptance Criteria:**

- [ ] Queue position returned
- [ ] Estimated wait time calculated
- [ ] Real-time updates via Socket.io

**Subtasks:**

- [ ] Calculate queue position
- [ ] Calculate estimated wait time
- [ ] Create queue-status Socket.io event
- [ ] Send periodic updates
- [ ] Write tests
- [ ] Update documentation

---

### Story 5.7: Match Acceptance (US-015)

**Issue Title:** `[EPIC-5] Implement match acceptance/rejection system`

**Description:**
As a user, I want to accept or reject a match so that I can control when I play.

**Acceptance Criteria:**

- [ ] Match found notification
- [ ] Accept match event
- [ ] Reject match event
- [ ] Timeout handling (auto-reject after timeout)
- [ ] Both players must accept

**Subtasks:**

- [ ] Create match-found Socket.io event
- [ ] Create accept-match event handler
- [ ] Create reject-match event handler
- [ ] Implement timeout logic
- [ ] Implement both-players-accept logic
- [ ] Write tests
- [ ] Document match acceptance flow

---

### Story 5.8: Arena Selection System (US-018, US-019, US-020)

**Issue Title:** `[EPIC-5] Implement arena selection with voting/elimination (CS2-style)`

**Description:**
As a player, I want to select arenas using voting/elimination system so that I can choose my preferred arena.

**Acceptance Criteria:**

- [ ] Voting/elimination system
- [ ] Arena previews displayed
- [ ] Real-time opponent elimination visibility
- [ ] Final arena selected

**Subtasks:**

- [ ] Create Arena model
- [ ] Create arena selection service
- [ ] Implement voting/elimination logic
- [ ] Create eliminate-arena Socket.io event
- [ ] Store arena selection in Redis
- [ ] Create arena preview system
- [ ] Write tests
- [ ] Document arena selection flow

---

### Story 5.9: Weapon Selection System (US-021, US-022, US-023, US-024)

**Issue Title:** `[EPIC-5] Implement alternating weapon selection (10 weapons, 30s timer)`

**Description:**
As a player, I want to select 10 weapons one by one, alternating with my opponent so that I can plan my strategy.

**Acceptance Criteria:**

- [ ] 10 weapons selected per match
- [ ] Alternating selection (Player 1, Player 2, Player 1, ...)
- [ ] 30-second timer per selection
- [ ] Real-time opponent selection visibility
- [ ] Random selection if timeout

**Subtasks:**

- [ ] Create Weapon model
- [ ] Create weapon selection service
- [ ] Implement alternating selection logic
- [ ] Create select-weapon Socket.io event
- [ ] Implement 30-second timer
- [ ] Implement timeout random selection
- [ ] Store weapon selection in Redis
- [ ] Write tests
- [ ] Document weapon selection flow

---

## 🎯 EPIC 6: Game Engine Service

**Milestone:** Phase 6: Game Engine  
**Priority:** High  
**Labels:** `backend:game-engine`, `priority:high`

### Story 6.1: Game Engine Service - Node.js Setup

**Issue Title:** `[EPIC-6] Set up Game Engine Service with Node.js, Socket.io, and Matter.js`

**Description:**
Initialize Node.js project for Game Engine Service with Express, Socket.io, and Matter.js physics engine.

**Acceptance Criteria:**

- [ ] Node.js project created
- [ ] Express server configured
- [ ] Socket.io server configured
- [ ] Matter.js integrated
- [ ] Redis connection configured

**Subtasks:**

- [ ] Create Node.js project structure
- [ ] Initialize package.json
- [ ] Install dependencies (express, socket.io, matter-js, ioredis)
- [ ] Create server.js/index.js
- [ ] Configure Express
- [ ] Configure Socket.io
- [ ] Configure Matter.js
- [ ] Configure Redis connection
- [ ] Set up package structure
- [ ] Create environment configuration

---

### Story 6.2: Game Room Management

**Issue Title:** `[EPIC-6] Implement game room creation and management`

**Description:**
Create and manage game rooms for matches with proper state management.

**Acceptance Criteria:**

- [ ] Game room creation
- [ ] Room state management
- [ ] Player assignment to rooms
- [ ] Room cleanup after match

**Subtasks:**

- [ ] Create GameRoom model
- [ ] Create room management service
- [ ] Implement room creation
- [ ] Implement room state storage (Redis)
- [ ] Implement player assignment
- [ ] Implement room cleanup
- [ ] Write tests
- [ ] Document room system

---

### Story 6.3: Turn Management System (US-030, US-031, US-033)

**Issue Title:** `[EPIC-6] Implement turn-based system (15s per turn, 4-5min total)`

**Description:**
As a player, I want to know when it's my turn (15 seconds per turn) so that I can take my action.

**Acceptance Criteria:**

- [ ] Turn-based gameplay
- [ ] 15 seconds per turn
- [ ] Turn timer countdown
- [ ] Turn switching logic
- [ ] Match ends after 4-5 minutes OR 10 turns per player

**Subtasks:**

- [ ] Create turn management service
- [ ] Implement turn timer (15 seconds)
- [ ] Implement turn switching
- [ ] Implement match duration tracking
- [ ] Implement turn limit (10 per player)
- [ ] Create turn-start Socket.io event
- [ ] Create turn-end Socket.io event
- [ ] Write tests
- [ ] Document turn system

---

### Story 6.4: Movement System (US-026)

**Issue Title:** `[EPIC-6] Implement hero movement (4 moves per game, left/right only)`

**Description:**
As a player, I want to move my hero within the arena (4 moves per game, left/right only) so that I can position strategically.

**Acceptance Criteria:**

- [ ] Hero movement left/right
- [ ] 4 moves per game limit
- [ ] Movement validation
- [ ] Real-time position sync

**Subtasks:**

- [ ] Create movement service
- [ ] Implement left/right movement logic
- [ ] Implement move counter (4 per game)
- [ ] Implement movement validation
- [ ] Create move-hero Socket.io event
- [ ] Update game state on movement
- [ ] Broadcast position to opponent
- [ ] Write tests
- [ ] Document movement system

---

### Story 6.5: Physics Engine Integration (US-025, US-027, US-028)

**Issue Title:** `[EPIC-6] Integrate Matter.js physics engine for projectile system`

**Description:**
As a player, I want to aim and fire projectiles so that I can attack my opponent.

**Acceptance Criteria:**

- [ ] Matter.js physics engine integrated
- [ ] Projectile physics working
- [ ] Gravity varies by arena
- [ ] Collision detection
- [ ] Real-time physics sync

**Subtasks:**

- [ ] Set up Matter.js engine
- [ ] Create physics world per arena
- [ ] Implement projectile creation
- [ ] Implement gravity system (arena-specific)
- [ ] Implement collision detection
- [ ] Implement hit detection
- [ ] Create fire-projectile Socket.io event
- [ ] Broadcast projectile state
- [ ] Write tests
- [ ] Document physics system

---

### Story 6.6: Game State Synchronization (US-029)

**Issue Title:** `[EPIC-6] Implement real-time game state synchronization`

**Description:**
As a player, I want to see the game state in real-time so that I can make informed decisions.

**Acceptance Criteria:**

- [ ] Game state stored in Redis
- [ ] Real-time state updates via Socket.io
- [ ] State synchronization between players
- [ ] State persistence

**Subtasks:**

- [ ] Create GameState model
- [ ] Implement state storage (Redis)
- [ ] Create state update service
- [ ] Create game-state Socket.io event
- [ ] Broadcast state updates
- [ ] Implement state persistence
- [ ] Write tests
- [ ] Document state sync

---

### Story 6.7: Health System

**Issue Title:** `[EPIC-6] Implement hero-specific health system`

**Description:**
Implement health system with different HP per hero type, balanced when matched.

**Acceptance Criteria:**

- [ ] Hero-specific HP values
- [ ] HP reduction on hit
- [ ] HP display in game
- [ ] HP sync between players

**Subtasks:**

- [ ] Define HP values per hero type
- [ ] Create health management service
- [ ] Implement HP reduction on hit
- [ ] Implement HP display
- [ ] Broadcast HP updates
- [ ] Write tests
- [ ] Document health system

---

### Story 6.8: Scoring System (US-035, US-036, US-037, US-038)

**Issue Title:** `[EPIC-6] Implement scoring system (accuracy, back-to-back hits, repositioning saves)`

**Description:**
As a player, I want to earn score based on accuracy (closer to center = more score) so that I'm rewarded for skill.

**Acceptance Criteria:**

- [ ] Accuracy-based scoring
- [ ] Back-to-back hit bonus
- [ ] Repositioning save bonus
- [ ] Score calculation per turn
- [ ] Score displayed in game

**Subtasks:**

- [ ] Design scoring formulas
- [ ] Implement accuracy calculation
- [ ] Implement back-to-back hit detection
- [ ] Implement repositioning save detection
- [ ] Create scoring service
- [ ] Calculate score per turn
- [ ] Broadcast score updates
- [ ] Write tests
- [ ] Document scoring system

---

### Story 6.9: Win Condition Detection (US-032, US-034)

**Issue Title:** `[EPIC-6] Implement win condition detection (HP=0 instant win, or more HP at end)`

**Description:**
As a player, I want to see the match results so that I know if I won or lost.

**Acceptance Criteria:**

- [ ] Instant win on HP = 0
- [ ] Win by more HP at match end
- [ ] Draw condition (same HP AND same score)
- [ ] Match result calculation
- [ ] Result broadcast to players

**Subtasks:**

- [ ] Implement HP = 0 check (instant win)
- [ ] Implement end-of-match HP comparison
- [ ] Implement draw condition
- [ ] Create match result service
- [ ] Calculate final scores
- [ ] Create match-end Socket.io event
- [ ] Broadcast match results
- [ ] Update player profiles (call Profile Service)
- [ ] Write tests
- [ ] Document win conditions

---

### Story 6.10: Disconnection Handling

**Issue Title:** `[EPIC-6] Implement disconnection handling (1 minute rejoin window)`

**Description:**
Handle player disconnections with rejoin window and configurable penalties.

**Acceptance Criteria:**

- [ ] Disconnection detection
- [ ] 1-minute rejoin window
- [ ] Rejoin functionality
- [ ] Configurable penalties
- [ ] Match continuation/forfeit logic

**Subtasks:**

- [ ] Implement disconnection detection
- [ ] Create rejoin window timer
- [ ] Implement rejoin functionality
- [ ] Create penalty configuration
- [ ] Implement match forfeit logic
- [ ] Create disconnect Socket.io event
- [ ] Create rejoin Socket.io event
- [ ] Write tests
- [ ] Document disconnection handling

---

## 🎨 EPIC 7: Frontend Development

**Milestone:** Phase 7: Frontend  
**Priority:** High  
**Labels:** `frontend`, `priority:high`

### Story 7.1: Angular Project Setup

**Issue Title:** `[EPIC-7] Set up Angular project with TailwindCSS and Phaser 3`

**Description:**
Initialize Angular 17+ project with TailwindCSS for styling and Phaser 3 for game rendering.

**Acceptance Criteria:**

- [ ] Angular 17+ project created
- [ ] TailwindCSS configured
- [ ] Phaser 3 integrated
- [ ] Project structure follows best practices
- [ ] Routing configured

**Subtasks:**

- [ ] Create Angular project
- [ ] Install Angular dependencies
- [ ] Configure TailwindCSS
- [ ] Install and configure Phaser 3
- [ ] Set up project structure (components, services, models, guards)
- [ ] Configure routing
- [ ] Create environment files
- [ ] Set up HTTP client
- [ ] Create base components
- [ ] Document frontend structure

---

### Story 7.2: Authentication UI (US-001, US-002, US-003)

**Issue Title:** `[EPIC-7] Create authentication UI (login, register, logout)`

**Description:**
Create user interface for registration, login, and logout functionality.

**Acceptance Criteria:**

- [ ] Registration page
- [ ] Login page
- [ ] Logout functionality
- [ ] Form validation
- [ ] Error handling
- [ ] JWT token management

**Subtasks:**

- [ ] Create registration component
- [ ] Create login component
- [ ] Create auth service
- [ ] Implement JWT token storage
- [ ] Implement form validation
- [ ] Implement error handling
- [ ] Create auth guard
- [ ] Implement logout
- [ ] Style with TailwindCSS
- [ ] Write component tests
- [ ] Update documentation

---

### Story 7.3: Dashboard

**Issue Title:** `[EPIC-7] Create main dashboard`

**Description:**
Create main dashboard page with navigation to all game features.

**Acceptance Criteria:**

- [ ] Dashboard component
- [ ] Navigation menu
- [ ] User info display
- [ ] Quick access to features

**Subtasks:**

- [ ] Create dashboard component
- [ ] Create navigation component
- [ ] Create layout component
- [ ] Implement routing
- [ ] Style with TailwindCSS
- [ ] Write tests
- [ ] Update documentation

---

### Story 7.4: Hero Selection UI (US-009, US-010)

**Issue Title:** `[EPIC-7] Create hero selection UI with multiple selection`

**Description:**
As a user, I want to select multiple heroes before matchmaking so that I can increase my match chances.

**Acceptance Criteria:**

- [ ] Hero selection page
- [ ] Multiple hero selection (checkboxes)
- [ ] Hero previews
- [ ] Selection validation
- [ ] Selection submission

**Subtasks:**

- [ ] Create hero selection component
- [ ] Create hero card component
- [ ] Implement multiple selection
- [ ] Create hero service
- [ ] Integrate with Matchmaking Service (Socket.io)
- [ ] Style with TailwindCSS
- [ ] Write tests
- [ ] Update documentation

---

### Story 7.5: Matchmaking UI (US-012, US-013, US-016)

**Issue Title:** `[EPIC-7] Create matchmaking queue UI with status display`

**Description:**
As a user, I want to join the matchmaking queue so that I can find a match.

**Acceptance Criteria:**

- [ ] Matchmaking queue page
- [ ] Join queue button
- [ ] Leave queue button
- [ ] Queue status display
- [ ] Position and wait time display
- [ ] Real-time updates

**Subtasks:**

- [ ] Create matchmaking component
- [ ] Integrate with Matchmaking Service (Socket.io)
- [ ] Implement join queue
- [ ] Implement leave queue
- [ ] Display queue status
- [ ] Display position and wait time
- [ ] Real-time updates via Socket.io
- [ ] Style with TailwindCSS
- [ ] Write tests
- [ ] Update documentation

---

### Story 7.6: Arena Selection UI (US-018, US-019, US-020)

**Issue Title:** `[EPIC-7] Create arena selection UI with voting/elimination`

**Description:**
As a player, I want to select arenas using voting/elimination system so that I can choose my preferred arena.

**Acceptance Criteria:**

- [ ] Arena selection page
- [ ] Arena previews
- [ ] Elimination buttons
- [ ] Real-time opponent elimination visibility
- [ ] Final arena display

**Subtasks:**

- [ ] Create arena selection component
- [ ] Create arena card component
- [ ] Integrate with Matchmaking Service (Socket.io)
- [ ] Implement elimination logic
- [ ] Display arena previews
- [ ] Real-time updates
- [ ] Style with TailwindCSS
- [ ] Write tests
- [ ] Update documentation

---

### Story 7.7: Weapon Selection UI (US-021, US-022, US-023, US-024)

**Issue Title:** `[EPIC-7] Create weapon selection UI with alternating selection and timer`

**Description:**
As a player, I want to select 10 weapons one by one, alternating with my opponent so that I can plan my strategy.

**Acceptance Criteria:**

- [ ] Weapon selection page
- [ ] Weapon cards
- [ ] Alternating selection display
- [ ] 30-second timer
- [ ] Real-time opponent selection visibility
- [ ] Random selection on timeout

**Subtasks:**

- [ ] Create weapon selection component
- [ ] Create weapon card component
- [ ] Integrate with Matchmaking Service (Socket.io)
- [ ] Implement alternating selection logic
- [ ] Implement 30-second timer
- [ ] Display opponent selections
- [ ] Handle timeout
- [ ] Style with TailwindCSS
- [ ] Write tests
- [ ] Update documentation

---

### Story 7.8: Game Arena UI (US-025, US-026, US-027, US-028, US-030, US-031)

**Issue Title:** `[EPIC-7] Create game arena with Phaser 3 (turn-based gameplay, movement, projectiles)`

**Description:**
As a player, I want to play turn-based 2D artillery battles so that I can compete with other players.

**Acceptance Criteria:**

- [ ] Game arena component
- [ ] Phaser 3 game scene
- [ ] Hero rendering
- [ ] Turn timer display
- [ ] Movement controls
- [ ] Aim and fire controls
- [ ] Projectile rendering
- [ ] Real-time game state display

**Subtasks:**

- [ ] Create game arena component
- [ ] Set up Phaser 3 game scene
- [ ] Create game service
- [ ] Integrate with Game Engine Service (Socket.io)
- [ ] Implement hero rendering
- [ ] Implement movement controls
- [ ] Implement aim and fire controls
- [ ] Implement projectile rendering
- [ ] Implement turn timer display
- [ ] Implement game state display
- [ ] Real-time updates via Socket.io
- [ ] Style with TailwindCSS
- [ ] Write tests
- [ ] Update documentation

---

### Story 7.9: Profile UI (US-005, US-006, US-007, US-008)

**Issue Title:** `[EPIC-7] Create profile page with statistics and rank display`

**Description:**
As a user, I want to view my profile so that I can see my statistics.

**Acceptance Criteria:**

- [ ] Profile page
- [ ] Profile information display
- [ ] Statistics display
- [ ] Rank tier display
- [ ] Profile update functionality

**Subtasks:**

- [ ] Create profile component
- [ ] Create profile service
- [ ] Integrate with Profile Service API
- [ ] Display profile information
- [ ] Display statistics
- [ ] Display rank tier
- [ ] Implement profile update
- [ ] Style with TailwindCSS
- [ ] Write tests
- [ ] Update documentation

---

### Story 7.10: Leaderboard UI (US-039, US-040, US-041, US-042)

**Issue Title:** `[EPIC-7] Create leaderboard page with filtering`

**Description:**
As a user, I want to view the global leaderboard so that I can see top players.

**Acceptance Criteria:**

- [ ] Leaderboard page
- [ ] Top players display
- [ ] Filtering options (region, hero, win%, weapons)
- [ ] Rank tier display
- [ ] Player statistics display
- [ ] Pagination

**Subtasks:**

- [ ] Create leaderboard component
- [ ] Create leaderboard service
- [ ] Integrate with Leaderboard Service API
- [ ] Implement filtering UI
- [ ] Display rank tiers
- [ ] Display player statistics
- [ ] Implement pagination
- [ ] Style with TailwindCSS
- [ ] Write tests
- [ ] Update documentation

---

## 🐳 EPIC 8: Infrastructure & Deployment

**Milestone:** Phase 8: Deployment  
**Priority:** Medium  
**Labels:** `infrastructure`, `priority:medium`

### Story 8.1: Docker Configuration

**Issue Title:** `[EPIC-8] Create Dockerfiles for all services`

**Description:**
Create Dockerfiles for all backend services and frontend for containerization.

**Acceptance Criteria:**

- [ ] Dockerfile for Auth Service
- [ ] Dockerfile for Profile Service
- [ ] Dockerfile for Leaderboard Service
- [ ] Dockerfile for Matchmaking Service
- [ ] Dockerfile for Game Engine Service
- [ ] Dockerfile for Frontend
- [ ] Multi-stage builds
- [ ] Health checks

**Subtasks:**

- [ ] Create Dockerfile for Auth Service (Spring Boot)
- [ ] Create Dockerfile for Profile Service (Spring Boot)
- [ ] Create Dockerfile for Leaderboard Service (Spring Boot)
- [ ] Create Dockerfile for Matchmaking Service (Node.js)
- [ ] Create Dockerfile for Game Engine Service (Node.js)
- [ ] Create Dockerfile for Frontend (Angular)
- [ ] Configure multi-stage builds
- [ ] Add health checks
- [ ] Test Docker builds
- [ ] Document Docker setup

---

### Story 8.2: Docker Compose Configuration

**Issue Title:** `[EPIC-8] Create docker-compose.yml for local development`

**Description:**
Create Docker Compose configuration for running all services locally.

**Acceptance Criteria:**

- [ ] docker-compose.yml created
- [ ] All services defined
- [ ] MongoDB container
- [ ] Redis container
- [ ] Network configuration
- [ ] Volume configuration
- [ ] Environment variables

**Subtasks:**

- [ ] Create docker-compose.yml
- [ ] Define all service containers
- [ ] Configure MongoDB container
- [ ] Configure Redis container
- [ ] Configure Nginx container (optional)
- [ ] Set up networking
- [ ] Configure volumes
- [ ] Set up environment variables
- [ ] Test docker-compose up
- [ ] Document docker-compose usage

---

### Story 8.3: Nginx API Gateway Configuration

**Issue Title:** `[EPIC-8] Configure Nginx as API Gateway`

**Description:**
Configure Nginx as reverse proxy and API gateway for routing requests.

**Acceptance Criteria:**

- [ ] Nginx configuration file
- [ ] Request routing to services
- [ ] Load balancing (basic)
- [ ] SSL termination (future)
- [ ] Health check endpoints

**Subtasks:**

- [ ] Create nginx.conf
- [ ] Configure routing rules
- [ ] Configure load balancing
- [ ] Set up health check endpoints
- [ ] Configure CORS
- [ ] Test routing
- [ ] Document Nginx configuration

---

## 📚 EPIC 9: Documentation & Testing

**Milestone:** Phase 9: Quality Assurance  
**Priority:** Medium  
**Labels:** `documentation`, `testing`, `priority:medium`

### Story 9.1: API Documentation

**Issue Title:** `[EPIC-9] Create API documentation with Swagger/OpenAPI`

**Description:**
Create comprehensive API documentation for all backend services.

**Acceptance Criteria:**

- [ ] Swagger/OpenAPI setup
- [ ] All endpoints documented
- [ ] Request/response schemas
- [ ] Authentication documentation
- [ ] Examples provided

**Subtasks:**

- [ ] Set up Swagger for Spring Boot services
- [ ] Set up OpenAPI for Node.js services
- [ ] Document Auth Service endpoints
- [ ] Document Profile Service endpoints
- [ ] Document Leaderboard Service endpoints
- [ ] Document Matchmaking Service endpoints
- [ ] Document Game Engine Service endpoints
- [ ] Add request/response examples
- [ ] Document authentication flow
- [ ] Publish API documentation

---

### Story 9.2: Unit Testing

**Issue Title:** `[EPIC-9] Achieve 80%+ code coverage with unit tests`

**Description:**
Write comprehensive unit tests for all services to achieve 80%+ code coverage.

**Acceptance Criteria:**

- [ ] 80%+ code coverage
- [ ] All services tested
- [ ] Critical paths covered
- [ ] Test reports generated

**Subtasks:**

- [ ] Set up testing frameworks (JUnit, Jest)
- [ ] Write unit tests for Auth Service
- [ ] Write unit tests for Profile Service
- [ ] Write unit tests for Leaderboard Service
- [ ] Write unit tests for Matchmaking Service
- [ ] Write unit tests for Game Engine Service
- [ ] Write unit tests for Frontend components
- [ ] Generate coverage reports
- [ ] Document testing strategy

---

### Story 9.3: Integration Testing

**Issue Title:** `[EPIC-9] Create integration tests for service communication`

**Description:**
Write integration tests to verify service-to-service communication and end-to-end flows.

**Acceptance Criteria:**

- [ ] Integration tests for API endpoints
- [ ] Integration tests for WebSocket communication
- [ ] Database integration tests
- [ ] End-to-end flow tests

**Subtasks:**

- [ ] Set up integration testing framework
- [ ] Write API integration tests
- [ ] Write WebSocket integration tests
- [ ] Write database integration tests
- [ ] Write end-to-end flow tests
- [ ] Set up test database
- [ ] Document integration testing

---

## 📊 GitHub Projects Setup Instructions

### Step 1: Create Milestones

#### Option A: Vertical Slice (VS) Milestones (Recommended for Game Development)

Create these VS milestones in GitHub for player experience tracking:

1. VS-1: Foundation & Infrastructure Setup
2. VS-2: Player Authentication & Identity
3. VS-3: First Playable Match
4. VS-4: Profile & Progression
5. VS-5: Full Game Features
6. VS-6: Content Complete
7. VS-7: Gold Master

**Game Development Milestones:**

- **Vertical Slice** = VS-1 + VS-2 + VS-3
- **Alpha** = VS-1 + VS-2 + VS-3 + VS-4
- **Beta** = VS-1 + VS-2 + VS-3 + VS-4 + VS-5
- **Content Complete** = Beta + VS-6
- **Gold Master** = Content Complete + VS-7

#### Option B: Phase Milestones (For Technical Implementation)

Create these Phase milestones in GitHub for technical service tracking:

1. Phase 1: Foundation
2. Phase 2: Authentication
3. Phase 3: Profile Management
4. Phase 4: Leaderboard
5. Phase 5: Matchmaking
6. Phase 6: Game Engine
7. Phase 7: Frontend
8. Phase 8: Deployment
9. Phase 9: Quality Assurance

**Note:** You can use both milestone sets simultaneously. VS milestones track player experience, Phase milestones track technical implementation.

### Step 2: Create Labels

Create these labels:

- **VS Labels:** `epic:vertical-slice`, `epic:foundation`, `epic:auth`, `epic:gameplay`, `epic:progression`, `epic:features`, `epic:deployment`, `epic:production`
- **Phase Labels:** `epic:foundation`, `epic:auth`, `epic:profile`, `epic:leaderboard`, `epic:matchmaking`, `epic:game-engine`, `epic:frontend`, `epic:infrastructure`, `epic:documentation`
- **Service Labels:** `backend:auth`, `backend:profile`, `backend:leaderboard`, `backend:matchmaking`, `backend:game-engine`, `frontend`
- **Category Labels:** `infrastructure`, `documentation`, `testing`
- **Priority Labels:** `priority:high`, `priority:medium`, `priority:low`
- **Type Labels:** `feature`, `bug`, `chore`, `refactor`

### Step 3: Create Issues

#### For VS-Based Epics (Recommended):

1. Use the [EPIC files](./EPICS/) as templates
2. Create an epic issue for each VS (VS-1 through VS-7)
3. Create story issues for each story within the VS epic
4. Reference Phase documents for technical implementation details
5. Assign to VS milestone (e.g., "VS-2: Player Authentication")
6. Add `epic:vertical-slice` label

#### For Phase-Based Epics:

1. Use the Phase breakdown above as templates
2. Create an epic issue for each Phase (Phase 1-9)
3. Create story issues for each story within the Phase epic
4. Assign to Phase milestone (e.g., "Phase 2: Authentication")
5. Add appropriate Phase label

**For each Story:**

1. Create an issue with the Story title
2. Copy the Description and Acceptance Criteria
3. Add Subtasks as checklist items in the issue
4. Assign appropriate labels
5. Assign to the correct milestone (VS or Phase)
6. Link to parent Epic issue
7. Add to your GitHub Project board

### Step 4: Organize in Kanban Board

Organize issues in columns:

- **Backlog** - All new issues
- **To Do** - Ready to start
- **In Progress** - Currently working
- **Review** - Code review/self-review
- **Done** - Completed

**Pro Tip:** Create separate project boards for VS tracking and Phase tracking, or use filters to view by milestone type.

---

**Total Breakdown:**

- **7 VS Epics** (Player experience - Vertical Slices)
- **9 Phase Epics** (Technical implementation - Service phases)
- **60+ User Stories** (Features)
- **300+ Subtasks** (Implementation tasks)

**Recommended Approach:**

- **Use VS Epics** for game development milestones and player experience tracking
- **Use Phase Epics** for technical service implementation and detailed task breakdown
- **VS Epics reference Phase Documents** for technical implementation details

This structure provides a complete roadmap for your Battle Arena project! 🚀
