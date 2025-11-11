# 📋 Project Description
## Battle Arena - Multiplayer Artillery Battle Game

**Document Version:** 2.0  
**Last Updated:** 2024  
**Status:** Draft - Updated with clarified mechanics

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**This project and all implementation MUST strictly adhere to the following principles:**

1. **REUSABILITY** - All components, services, and utilities MUST be designed for maximum reusability across the system
2. **GOOD CODE PRACTICES** - Follow SOLID principles, DRY (Don't Repeat Yourself), and industry best practices
3. **CLEAN CODE** - Code must be readable, self-documenting, and maintainable
4. **CLEAN ARCHITECTURE** - Strict separation of concerns with clear boundaries between layers
5. **SECURE PROGRAMMING** - Security-first approach with defense in depth, input validation, and secure communication

**These principles are NON-NEGOTIABLE and must be enforced in every line of code and every architectural decision.**

---

## 1. Project Overview

### 1.1 Project Name
**Battle Arena** - Multiplayer Artillery Battle Game

### 1.2 Project Type
Real-time multiplayer online 2D artillery battle game (inspired by Pocket Tank)

### 1.3 Project Vision
To create a scalable, secure, and engaging real-time multiplayer 2D artillery battle game that provides players with a competitive gaming experience, featuring fair matchmaking, multiple hero types, weapon selection, arena selection, player progression, and leaderboard systems.

### 1.4 Project Mission
Build a production-ready multiplayer 2D artillery battle game platform that demonstrates:
- Modern microservices architecture
- Real-time game synchronization with WebSocket
- Physics-based gameplay with Matter.js
- Multiple hero types with unique characteristics
- Weapon selection and synergy systems
- Arena selection with voting/elimination
- Hero movement within arenas
- Scalable infrastructure
- Secure authentication and authorization
- Industry-standard design patterns and practices
- Clean code and clean architecture principles

---

## 2. Problem Statement

### 2.1 Business Problem
There is a need for a scalable multiplayer game platform that can:
- Handle thousands of concurrent players
- Provide fair matchmaking based on skill level
- Track player progression and statistics
- Maintain leaderboards and rankings
- Ensure secure player authentication
- Provide real-time game synchronization

### 2.2 Technical Challenges
- **Real-time Synchronization:** Synchronize game state across multiple clients in real-time
- **Scalability:** Handle increasing number of concurrent players and matches
- **Matchmaking:** Fair and efficient player matching based on skill/XP
- **Performance:** Low latency for real-time gameplay
- **Security:** Secure authentication and prevent cheating
- **Data Consistency:** Maintain consistent game state across distributed services

---

## 3. Project Objectives

### 3.1 Primary Objectives
1. **Real-time Multiplayer Gameplay:** Enable real-time turn-based 2D artillery battles between players with multiple hero types
2. **Hero Selection System:** Implement multiple hero selection (tanks, archers, catapults, witches) with unique characteristics
3. **Weapon Selection System:** Implement weapon selection (10 weapons per match) with weapon synergies and dynamic properties
4. **Arena Selection System:** Implement arena selection with voting/elimination system (like CS2 premium matchmaking)
5. **Movement System:** Implement hero movement within arenas (4 moves per game, left/right only)
6. **Fair Matchmaking:** Implement global score/rank-based matchmaking algorithm with multiple hero support
7. **Player Progression:** Track global score, rank tiers (like Valorant), wins, losses, and statistics
8. **Leaderboard System:** Maintain global leaderboards with filtering (region, hero type, winning percentage, weapons)
9. **Scoring System:** Implement scoring based on accuracy, back-to-back hits, and repositioning saves
10. **Secure Authentication:** Implement JWT-based authentication and authorization
11. **Scalable Architecture:** Build microservices architecture that can scale horizontally

### 3.2 Secondary Objectives
1. **Match Replay System:** Store and replay completed matches
2. **Physics-based Gameplay:** Implement realistic projectile physics
3. **Responsive UI:** Create intuitive and responsive user interface
4. **Mobile Responsive:** Support multiple device sizes
5. **Comprehensive Testing:** Achieve 80%+ code coverage
6. **Documentation:** Complete technical documentation for maintenance and onboarding

---

## 4. Target Audience

### 4.1 Primary Users
- **Gamers:** Players who enjoy competitive multiplayer games
- **Casual Players:** Players looking for quick matches
- **Competitive Players:** Players focused on leaderboard rankings

### 4.2 User Personas
1. **The Competitor:** Wants to climb leaderboards and improve ranking
2. **The Casual Gamer:** Plays occasionally for entertainment
3. **The Social Player:** Enjoys playing with friends and community

---

## 5. Key Features

### 5.1 Core Features (MVP)
1. **User Authentication & Registration**
   - User registration with username and email
   - Secure login with JWT tokens
   - Password hashing with BCrypt
   - Session management

2. **Player Profile Management**
   - User profile with display name and avatar
   - Global score tracking (not per-hero)
   - Rank tier system (like Valorant - Bronze, Silver, Gold, etc.)
   - Win/loss statistics
   - Match history
   - Global progression (score can be infinite, no level cap)

3. **Hero Selection System**
   - Multiple hero types: tanks, archers, catapults, witches
   - Multiple hero selection before matchmaking (using checkboxes)
   - Each hero type has unique characteristics:
     - Different size (hitboxes)
     - Different weapons (each hero has their own weapon set)
     - Different HP (e.g., tanks have more HP than archers)
     - Different speed (movement speed)
     - Visually different (appearance)
     - Functionally different (unique characteristics)
     - Different animations (getting hit, drawing weapons, shooting weapons)
   - All heroes available from start (no unlocking for MVP)
   - Hero selection order determines matchmaking priority

4. **Weapon Selection System**
   - 10 weapons per match (10 turns per player, 20 total turns)
   - Weapons selected one by one, alternating between players (like Pocket Tank)
   - Real-time visibility of opponent's weapon selections
   - Maximum 30 seconds total to choose weapons (approximately 3 seconds per weapon)
   - Random weapon selection if time runs out
   - Once picked, weapon cannot be changed
   - Different weapons have different properties:
     - Damage (how much health they remove)
     - Range (how far they can travel)
     - Trajectory (how they arc through the air)
     - Weight (affects physics and trajectory)
     - Animations (visual effects when fired)
     - Physics (how they behave in the air)
   - Weapon synergies (e.g., gasoline + torch: dynamic system)
   - System supports 2-10 weapons per hero (configurable via configuration file)
   - MVP targets 10 weapons per hero

5. **Arena Selection System**
   - Different arenas based on hero types
   - Voting/elimination system (like CS2 premium matchmaking)
   - Players vote and eliminate arenas one by one until one remains
   - Arena previews shown as thumbnail images
   - Real-time visibility of opponent's arena elimination
   - Each arena has different terrain and gravity
   - Gravity varies by arena (no wind in any arena)
   - Arenas are NOT destructible (only UI damage effects shown)
   - Number and structure of arenas will increase over time

6. **Movement System**
   - Players can move their heroes within the arena (like Pocket Tank)
   - Movement is left/right only (using click-to-move button)
   - Players have 4 moves total per game
   - Players can move only on their turn
   - Players can move multiple times in a single turn (consumes total move allowance)
   - Players can move AND fire in the same turn
   - Players can move after firing (defensive positioning)
   - Movement is limited to arena boundaries
   - Movement-based scoring (if player moves and enemy shot misses, player gets score)

7. **Matchmaking System**
   - Global score/rank-based matchmaking algorithm
   - Players with closer ratings/global rank/global score get matched sooner
   - Multiple hero selection increases matchmaking chances
   - Heroes must be the same to match
   - When multiple heroes match, random hero chosen from matched heroes (equal probability)
   - Hero selection order determines priority
   - Single queue system that matches based on selected heroes
   - After 5 minutes of search time, system widens XP/score/rank range
   - Players can cancel matchmaking and try again
   - Estimated wait time calculated based on number of players online
   - Queue management with Redis
   - Match acceptance/rejection
   - Real-time match notifications

8. **Real-time Gameplay**
   - Turn-based 2D artillery battles
   - Physics-based projectile system (Matter.js)
   - Real-time game state synchronization
   - Turn management and timing (15 seconds per turn, included in 4-5 minute match timer)
   - Turn countdown timer visible to players
   - Win condition detection (HP = 0 = instant loss, or player with more HP at match end)
   - Match duration: 4-5 minutes OR 10 turns per player (whichever comes first)
   - Draw condition: Same HP AND same score = draw

9. **Scoring System**
   - Points (score) earned during match based on:
     - Hitting enemy with good accuracy (accuracy measured by hit area - closer to center = better accuracy = more score)
     - Back-to-back hits give additional score (multiplier or bonus - formula to be determined)
     - Repositioning that saves from hits gives score (if player moves and enemy weapon lands where player was standing)
     - No score for just repositioning - only when repositioning actually saves from a hit
   - Match winner determined by:
     - HP = 0 = Instant Loss (regardless of score)
     - At Match End: Player with more remaining HP wins
     - Score determines global rank changes (formula to be determined)
   - Draw condition: Same HP AND same score = draw (both players get base score of 100 points, no win bonus)
   - Score from matches (even losses) contributes to leaderboard ranking

10. **Health System**
    - Different hero types have different starting HP
    - When players are matched with same hero type, they start with same HP (balanced)
    - Health reduced when hit by weapons
    - Different weapons deal different amounts of damage
    - Accuracy matters (hitting closer to center of target results in more damage)
    - Players can win by reducing opponent's health to zero (instant win)

11. **Leaderboard System**
    - Global leaderboard based on total score across all games (end results, not in-game scores)
    - Score leads to rank tiers based on score ranges (like Valorant game)
    - Rank tiers (e.g., Bronze, Silver, Gold) determined by score ranges
    - Players with similar ranks can be in top 5, then global score determines leaderboard rankings
    - Filter leaderboard by:
      - Region
      - Hero type
      - Winning percentage
      - Weapon usage
    - Player rank display
    - Top players list

12. **Game Engine**
    - Physics engine (Matter.js)
    - Game state management
    - Turn-based gameplay logic
    - Match result processing
    - Weapon synergy system (dynamic)
    - Movement system
    - Arena management
    - Configuration file support (for weapons, penalties, etc.)

### 5.2 Enhanced Features (Future)
1. **Hero Unlocking System:** Heroes can be unlocked based on score ranks players climb
2. **Per-hero Progression:** Per-hero progression and statistics (optional)
3. **Tournament System:** Organize and participate in tournaments
4. **Team Battles:** Team-based matches
5. **Spectator Mode:** Watch ongoing matches
6. **Chat System:** In-game and lobby chat
7. **Achievement System:** Unlock achievements and rewards
8. **In-game Purchases:** Virtual currency and cosmetic items
9. **Replay System:** Watch and share match replays
10. **Friend System:** Add friends and play together
11. **Wind Mechanics:** Wind mechanics for arenas (optional)
12. **Advanced Visual/Audio Feedback:** Comprehensive visual/audio feedback system
13. **Exact Scoring Formulas:** Finalized scoring formulas (currently trial and error)
14. **Exact Rank Tier Ranges:** Finalized rank tier ranges (currently to be determined)
15. **More Hero Types:** Additional hero types with unique characteristics
16. **More Weapons:** Additional weapons with unique properties and synergies
17. **More Arenas:** Additional arenas with unique terrain and gravity

---

## 6. Technology Stack

### 6.1 Frontend
- **Framework:** Angular 17+ (TypeScript)
- **UI Framework:** TailwindCSS
- **Game Engine:** Phaser 3
- **State Management:** RxJS Observables
- **HTTP Client:** Angular HttpClient
- **WebSocket:** Socket.io Client

### 6.2 Backend Services
- **Auth Service:** Spring Boot (Java) - User authentication and authorization
- **Profile Service:** Spring Boot (Java) - User profile and global score/rank tracking
- **Leaderboard Service:** Spring Boot (Java) - Leaderboard and ranking management with filtering
- **Matchmaking Service:** Node.js (Express, Socket.io) - Player matching, hero selection, arena selection, weapon selection, queue management
- **Game Engine Service:** Node.js (Express, Socket.io) - Game logic, physics engine, movement system, scoring system, match result processing
- **Physics Engine:** Matter.js - Projectile physics, gravity, terrain interaction
- **Configuration Service:** Configuration file management for weapons, penalties, rank tiers, etc.

### 6.3 Database & Cache
- **Primary Database:** MongoDB 6.0+ - Users, Profiles, Matches, Leaderboards, Heroes, Weapons, Arenas
- **Cache & Queue:** Redis 7.0+ - Matchmaking queue, Lobby storage, Game state cache, Hero/Weapon/Arena configurations
- **Database Driver:** Spring Data MongoDB, Mongoose
- **Configuration Storage:** Configuration files for weapons (2-10 per hero), penalties, rank tiers, etc.

### 6.4 Infrastructure
- **Containerization:** Docker, Docker Compose
- **Reverse Proxy:** Nginx (for production)
- **API Gateway:** Nginx (for routing)
- **Orchestration:** Docker Compose (development), Kubernetes (production - future)

### 6.5 Security
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** BCrypt (12 rounds)
- **Encryption:** HTTPS/WSS
- **Security Headers:** CORS, CSP, XSS Protection

### 6.6 Development Tools
- **Build Tools:** Maven (Java), NPM (Node.js), Angular CLI
- **Testing:** JUnit (Java), Jest (Node.js), Jasmine (Angular)
- **Code Quality:** ESLint, Prettier, Checkstyle
- **Version Control:** Git
- **CI/CD:** GitHub Actions

---

## 7. System Architecture Overview

### 7.1 Architecture Style
**Microservices Architecture** with the following characteristics:
- **Service Independence:** Each service can be developed, deployed, and scaled independently
- **Technology Diversity:** Use best technology for each service (Java for business logic, Node.js for real-time)
- **API Gateway:** Single entry point for all client requests
- **Service Communication:** REST APIs for synchronous, WebSocket for asynchronous
- **Data Management:** Database per service pattern

### 7.2 Core Services
1. **Auth Service (Spring Boot):** User authentication and authorization
2. **Profile Service (Spring Boot):** User profile and global score/rank tracking
3. **Leaderboard Service (Spring Boot):** Leaderboard and ranking management with filtering (region, hero type, winning percentage, weapons)
4. **Matchmaking Service (Node.js):** Player matching, hero selection, arena selection, weapon selection, queue management
5. **Game Engine Service (Node.js):** Game logic, physics engine, movement system, scoring system, match result processing
6. **Frontend Service (Angular):** User interface, game rendering, real-time game state display
7. **Configuration Service:** Configuration file management for weapons, penalties, rank tiers, etc.

### 7.3 Data Stores
1. **MongoDB:** Primary database for persistent data:
   - Users (authentication, profiles)
   - Profiles (global score, rank tiers, statistics)
   - Matches (match history, results, scores)
   - Leaderboards (global rankings with filters)
   - Heroes (hero types, characteristics, configurations)
   - Weapons (weapon properties, synergies, configurations)
   - Arenas (arena properties, terrain, gravity configurations)
2. **Redis:** Cache and queue management:
   - Matchmaking queue (hero-based queues, player matching)
   - Lobby storage (match lobbies, arena selection, weapon selection)
   - Game state cache (real-time game state, turn management)
   - Hero/Weapon/Arena configurations (cached configurations)
3. **Configuration Files:** Configuration storage for:
   - Weapons (2-10 per hero, configurable)
   - Penalties (disconnection penalties, trial and error)
   - Rank tiers (score ranges for rank tiers)
   - Scoring formulas (to be determined during implementation)

---

## 8. Game Mechanics

### 8.1 Gameplay Overview
- **Game Type:** Turn-based 2D artillery battle game (inspired by Pocket Tank)
- **Players:** 2 players per match
- **Objective:** Score more points than opponent OR reduce opponent's health to zero
- **Turns:** Alternating turns with time limits (15 seconds per turn)
- **Physics:** Realistic projectile physics with gravity (varies by arena, no wind)
- **Hero Types:** Multiple hero types (tanks, archers, catapults, witches) with unique characteristics
- **Weapons:** 10 weapons per match, selected before match begins
- **Arenas:** Different arenas with different terrain and gravity
- **Movement:** Players can move heroes within arenas (4 moves per game, left/right only)

### 8.2 Game Flow
1. **Hero Selection:** Player selects one or more hero types (using checkboxes) before matchmaking
2. **Queue:** Player joins matchmaking queue
3. **Match Found:** System finds matching opponent with compatible hero selection and similar global score/rank
4. **Hero Assignment:** Random hero chosen from matched heroes (equal probability)
5. **Acceptance:** Both players accept the match
6. **Arena Selection:** Players choose arenas using voting/elimination system (like CS2 premium matchmaking)
7. **Weapon Selection:** Players select 10 weapons one by one, alternating between players (like Pocket Tank)
8. **Game Start:** Game room is created and initialized
9. **Gameplay:** Players take turns moving, aiming, and firing projectiles
10. **Game End:** Winner is determined (HP = 0 = instant loss, or player with more HP at match end)
11. **Results:** Match results are saved, scores are calculated, and leaderboard is updated

### 8.3 Game Rules

#### 8.3.1 Match Duration
- **Match Timer:** 4-5 minutes OR 10 turns per player (whichever comes first)
- **Turn Duration:** 15 seconds per turn to initiate or fire weapon (included in match timer)
- **Turn Countdown:** Players can see countdown timer for their turn
- **Total Turns:** 10 turns per player (20 total turns in a match)

#### 8.3.2 Hero System
- **Hero Types:** Tanks, archers, catapults, witches (more coming in future)
- **Hero Selection:** Players can select multiple heroes before matchmaking to increase match chances
- **Hero Characteristics:**
  - Different size (hitboxes)
  - Different weapons (each hero has their own weapon set)
  - Different HP (e.g., tanks have more HP than archers, witches have more HP than archers)
  - Different speed (movement speed)
  - Visually different (appearance)
  - Functionally different (unique characteristics)
  - Different animations (getting hit, drawing weapons, shooting weapons)
- **Hero Matching:** Heroes must be the same to match
- **Hero Assignment:** When multiple heroes match, random hero chosen from matched heroes (equal probability)
- **Hero Priority:** Hero selection order determines matchmaking priority
- **Starting HP:** When players are matched with same hero type, they start with same HP (balanced)

#### 8.3.3 Weapon System
- **Weapons Per Match:** 10 weapons per player (10 turns per player, 20 total turns)
- **Weapon Selection:** Weapons selected one by one, alternating between players (like Pocket Tank)
- **Selection Time:** Maximum 30 seconds total to choose weapons (approximately 3 seconds per weapon)
- **Time Limit:** If time runs out, random weapon automatically selected from available options
- **Weapon Lock:** Once a weapon is picked, it cannot be changed
- **Weapon Visibility:** Players can see each other's weapon selections in real-time
- **Weapon Properties:**
  - Damage (how much health they remove)
  - Range (how far they can travel)
  - Trajectory (how they arc through the air)
  - Weight (affects physics and trajectory)
  - Animations (visual effects when fired)
  - Physics (how they behave in the air)
- **Weapon Synergies:** Dynamic weapon synergies (e.g., gasoline + torch: if player uses gasoline, then uses torch on later turn, torch burns gasoline for increased damage and special effects)
- **Weapon Configuration:** System supports 2-10 weapons per hero (configurable via configuration file, not hardcoded)
- **MVP Target:** 10 weapons per hero (can be adjusted based on asset preparation time)

#### 8.3.4 Arena System
- **Arena Selection:** Voting/elimination system (like CS2 premium matchmaking)
- **Arena Availability:** Different arenas based on hero types players have chosen
- **Selection Process:** Players vote and eliminate arenas one by one until one arena remains (automatically selected)
- **Arena Previews:** Arena previews shown as thumbnail images during selection
- **Real-time Visibility:** Players can see which arenas their opponent is eliminating in real-time
- **Arena Properties:**
  - Different terrain
  - Different gravity (varies by arena, no wind in any arena)
  - NOT destructible (only UI damage effects shown - visual residuals that don't hinder movement or gameplay)
- **Arena Expansion:** Number and structure of arenas will increase over time as development progresses

#### 8.3.5 Movement System
- **Movement Type:** Left/right only (using click-to-move button on screen)
- **Total Moves:** Players have 4 moves total per game
- **Movement Timing:** Players can move only on their turn
- **Multiple Moves:** Players can move multiple times in a single turn (consumes total move allowance)
- **Move and Fire:** Players can move AND fire in the same turn
- **Move After Fire:** Players can move after firing (defensive positioning)
- **Movement Boundaries:** Movement limited to arena boundaries (size of arena only)
- **Movement Scoring:** If player moves and enemy's next shot misses because of the move (lands where player was standing), player gets score for the save
- **Movement Restrictions:** Players cannot move after enemy shot is fired and completed (movement only allowed on their own turn)

#### 8.3.6 Health System
- **Starting HP:** Different hero types have different starting HP
- **Balanced HP:** When players are matched with same hero type, they start with same HP (balanced for that hero type)
- **Health Reduction:** Health reduced when hit by weapons
- **Damage Variation:** Different weapons deal different amounts of damage
- **Accuracy Matters:** Hitting closer to center of target (hit area) results in more damage
- **Instant Win:** Players can win by reducing opponent's health to zero before match ends (instant win)

#### 8.3.7 Scoring System
- **Score Sources:**
  - Hitting enemy with good accuracy (accuracy measured by hit area - closer to center = better accuracy = more score)
  - Back-to-back hits give additional score (multiplier or bonus - formula to be determined during implementation)
  - Repositioning that saves from hits gives score (if player moves and enemy weapon lands where player was standing)
  - No score for just repositioning - only when repositioning actually saves from a hit
- **Winner Determination:**
  - **HP = 0 = Instant Loss:** If player's HP reaches zero, they lose immediately (regardless of score)
  - **At Match End (Timer/Turns):** Player with more remaining HP wins
  - **Score Determines Global Rank Changes:** Score determines how much global score/rank increases or decreases:
    - If player loses but has good score, their rank decreases by a lesser amount
    - If player wins but has low score, their rank increases by a lesser margin
    - Formula for rank changes will be determined during implementation
- **Draw Condition:**
  - If HP is the same at match end, scores from that match are used to determine the winner
  - If HP and scores are both the same, the match is a draw:
    - Both players get equal winning points (base score of 100 points)
    - No win bonus is given (win bonus normally depends on score in match, with base score point of 100)
- **Leaderboard Contribution:** Score from matches (even losses) contributes to leaderboard ranking

#### 8.3.8 Physics System
- **Physics Engine:** Matter.js
- **Projectile Physics:** Projectiles follow realistic physics based on weapon type and arena
- **Gravity:** Gravity varies by arena (no wind in any arena)
- **Weapon Physics:** Different weapons have different physics (some arc more, some travel straighter)
- **Terrain Interaction:** Terrain affects where projectiles can hit and where players can move
- **Physics Calculation:** System calculates projectile trajectories, damage, and terrain interactions based on weapon properties, arena gravity, and player actions

### 8.4 Matchmaking System
- **Matching Algorithm:** Global score/rank-based matchmaking algorithm
- **Matching Priority:** Players with closer ratings/global rank/global score get matched sooner
- **Multiple Hero Selection:** Players can select multiple heroes before matchmaking (using checkboxes) to increase match chances
- **Hero Matching:** Heroes must be the same to match
- **Hero Assignment:** When multiple heroes match, random hero chosen from matched heroes (equal probability)
- **Hero Priority:** Hero selection order determines matchmaking priority
- **Queue System:** Single queue system that matches based on selected heroes (most reliable method considering effort and AWS costs)
- **Queue Expansion:** After 5 minutes of search time, system widens XP/score/rank range for matchmaking
- **Queue Management:** Players can cancel matchmaking and try again
- **Queue Timeout:** If no match is found after timeout, players are prompted with meaningful message and asked to try again later
- **Wait Time Estimation:** Estimated wait time calculated based on number of players online searching for matchmaking
- **Queue Visibility:** Players can see which hero was selected before match starts (e.g., on loading screen)

### 8.5 Progression System
- **Global Progression:** Global progression system (not per-hero)
- **Score System:** Score can be as high as infinite (no level cap)
- **Rank Tiers:** Rank tiers are in ranges of score numbers (like Valorant game)
- **Rank Tier System:** Rank tiers (e.g., Bronze, Silver, Gold) determined by score ranges
- **Leaderboard Ranking:** Players with similar ranks can be in top 5, then their global score determines leaderboard rankings
- **Score Tracking:** Track wins, losses, and overall statistics
- **Leaderboard Filters:** Filter leaderboard by region, hero type, winning percentage, and weapons
- **Hero Availability:** All heroes and weapons available from start (no unlocking system for MVP)
- **Future Unlocking:** Future: Heroes can be unlocked based on score ranks players climb (to be implemented later)
- **Win Bonus:** Win bonus depends on score in match, with base score point of 100
- **Rank Changes:** Score determines how much global score/rank increases or decreases (formula to be determined during implementation)

---

## 9. Non-Functional Requirements

### 9.1 Performance
- **API Response Time:** < 200ms for 95% of requests
- **WebSocket Latency:** < 50ms for game actions
- **Matchmaking Time:** < 5 minutes average (with queue expansion after 5 minutes)
- **Game State Sync:** Real-time (< 100ms)
- **Turn Response Time:** < 15 seconds per turn (included in 4-5 minute match timer)
- **Weapon Selection Time:** < 30 seconds total (approximately 3 seconds per weapon)
- **Arena Selection Time:** Real-time voting/elimination (no specific time limit)
- **Movement Response Time:** Real-time (< 50ms)
- **Physics Calculation:** Real-time (< 100ms for projectile trajectories)

### 9.2 Scalability
- **Concurrent Users:** Support 10,000+ concurrent players
- **Matchmaking Capacity:** 1,000+ simultaneous matches
- **Horizontal Scaling:** All services should scale horizontally
- **Database Scaling:** Support database sharding and replication

### 9.3 Availability
- **System Uptime:** 99.9% (8.76 hours downtime/year)
- **Service Health Checks:** Every 30 seconds
- **Graceful Degradation:** Handle service failures gracefully
- **Automatic Recovery:** Automatic recovery from transient failures

### 9.4 Security
- **Authentication:** 100% of requests authenticated
- **Data Encryption:** All sensitive data encrypted at rest and in transit
- **Vulnerability Scanning:** Regular security audits
- **Compliance:** Follow OWASP Top 10 security practices

### 9.5 Maintainability
- **Code Quality:** High code quality standards
- **Documentation:** Comprehensive documentation
- **Testing:** 80%+ code coverage
- **Code Reviews:** All code must be reviewed

---

## 10. Success Criteria

### 10.1 Functional Success Criteria
- ✅ User can register and login
- ✅ User can select multiple heroes before matchmaking
- ✅ User can join matchmaking queue
- ✅ Matchmaking finds fair matches based on global score/rank and hero compatibility
- ✅ User can see which hero was selected before match starts
- ✅ User can select arenas using voting/elimination system
- ✅ User can select weapons one by one, alternating with opponent
- ✅ User can see opponent's weapon selections in real-time
- ✅ User can move heroes within arenas (4 moves per game, left/right only)
- ✅ User can play real-time turn-based matches (15 seconds per turn, 4-5 minutes total)
- ✅ Game state synchronizes in real-time
- ✅ Scoring system works correctly (accuracy, back-to-back hits, repositioning saves)
- ✅ Win conditions work correctly (HP = 0 = instant loss, or player with more HP at match end)
- ✅ Draw conditions work correctly (same HP AND same score = draw)
- ✅ Global score and rank tiers are calculated correctly
- ✅ User can view profile and statistics
- ✅ User can view leaderboard with filtering (region, hero type, winning percentage, weapons)
- ✅ Rank tiers are displayed correctly (like Valorant)
- ✅ Disconnection handling works correctly (1 minute rejoin window, configurable penalties)

### 10.2 Non-Functional Success Criteria
- ✅ System handles 10,000+ concurrent users
- ✅ API response time < 200ms for 95% of requests
- ✅ WebSocket latency < 50ms for game actions
- ✅ System uptime > 99.9%
- ✅ 100% of requests authenticated
- ✅ 80%+ code coverage
- ✅ All security vulnerabilities addressed

---

## 11. Project Constraints

### 11.1 Technical Constraints
- **Technology Stack:** Must use specified technology stack
- **Architecture:** Must follow microservices architecture
- **Database:** Must use MongoDB and Redis
- **Security:** Must follow security best practices
- **Performance:** Must meet performance requirements

### 11.2 Time Constraints
- **Development Timeline:** 7-10 days for MVP
- **Deployment Timeline:** Within development timeline
- **Testing Timeline:** Integrated with development

### 11.3 Resource Constraints
- **Team Size:** Limited team size
- **Budget:** Limited budget for infrastructure
- **Infrastructure:** Use cost-effective cloud services

---

## 12. Assumptions

### 12.1 Technical Assumptions
- Players have stable internet connection
- Browsers support WebSocket and modern JavaScript
- MongoDB and Redis are available and configured
- Docker and Docker Compose are installed
- Development environment is set up

### 12.2 Business Assumptions
- Players understand turn-based gameplay
- Players have basic gaming experience
- Players are familiar with Pocket Tank or similar artillery games
- Market demand for multiplayer games exists
- Players are willing to create accounts
- Players understand hero selection and weapon selection mechanics
- Players understand arena voting/elimination system (similar to CS2)
- Players understand movement mechanics (left/right only, 4 moves per game)
- Players understand scoring system (accuracy, back-to-back hits, repositioning saves)
- Players understand rank tier system (like Valorant)

---

## 13. Risks and Mitigation

### 13.1 Technical Risks
- **WebSocket Scalability:** Mitigated by horizontal scaling
- **Database Performance:** Mitigated by indexing and caching
- **Real-time Synchronization:** Mitigated by efficient state management
- **Security Vulnerabilities:** Mitigated by security audits and testing
- **Physics Calculation Performance:** Mitigated by efficient physics engine (Matter.js) and optimization
- **Matchmaking Complexity:** Mitigated by efficient queue management and Redis caching
- **Weapon Synergy System:** Mitigated by dynamic system design and configuration file support
- **Movement System Synchronization:** Mitigated by efficient movement tracking and state synchronization
- **Scoring System Complexity:** Mitigated by configuration file support and trial-and-error approach
- **Rank Tier System:** Mitigated by flexible rank tier configuration and score range management
- **Disconnection Handling:** Mitigated by graceful disconnection handling and configurable penalties
- **Arena Selection Complexity:** Mitigated by efficient voting/elimination system and real-time synchronization
- **Weapon Selection Complexity:** Mitigated by efficient weapon selection system and time management
- **Hero Selection Complexity:** Mitigated by efficient hero matching algorithm and queue management

### 13.2 Operational Risks
- **Service Downtime:** Mitigated by health checks and monitoring
- **Data Loss:** Mitigated by database backups and replication
- **Security Breaches:** Mitigated by comprehensive security measures

### 13.3 Business Risks
- **User Experience:** Mitigated by performance optimization
- **Scalability Limitations:** Mitigated by cloud-ready architecture
- **Maintenance Complexity:** Mitigated by clean architecture and documentation

---

## 14. Project Deliverables

### 14.1 Code Deliverables
- ✅ Source code for all services
- ✅ Frontend application
- ✅ Database schemas and migrations
- ✅ Docker configurations
- ✅ CI/CD pipelines

### 14.2 Documentation Deliverables
- ✅ Project Description and Scope (This document)
- ✅ High-Level Design (HLD) Document
- ✅ Low-Level Design (LLD) Document
- ✅ API Documentation
- ✅ Database Schema Documentation
- ✅ Security Design Documentation
- ✅ Deployment Documentation
- ✅ User Guide

### 14.3 Testing Deliverables
- ✅ Unit tests
- ✅ Integration tests
- ✅ End-to-end tests
- ✅ Performance tests
- ✅ Security tests

---

## 15. Project Timeline

### 15.1 Phase 1: Planning and Design (Days 1-3)
- ✅ Project description and scope
- ✅ Requirements gathering
- ✅ Technology stack selection
- ✅ Architecture planning
- ✅ Hero types and weapon systems design
- ✅ Arena system and gravity mechanics design
- ✅ Movement system design
- ✅ Matchmaking and gameplay mechanics design
- ✅ Scoring system design

### 15.2 Phase 2: Core Development (Days 4-7)
- ✅ Backend services implementation
- ✅ Frontend implementation
- ✅ Hero selection system (with multiple hero support)
- ✅ Weapon selection system (10 weapons per match)
- ✅ Arena selection system
- ✅ Movement system
- ✅ Game mechanics implementation
- ✅ Physics system (with arena-specific gravity)
- ✅ Scoring system
- ✅ Timer system (4-5 minutes or 10 turns)
- ✅ Database implementation
- ✅ Integration
- ✅ Testing

### 15.3 Phase 3: Testing and Polish (Days 8-9)
- ✅ Comprehensive testing
- ✅ Hero and weapon balance testing
- ✅ Arena mechanics and gravity testing
- ✅ Movement system testing
- ✅ Matchmaking with multiple hero selections testing
- ✅ Scoring system testing
- ✅ Timer system testing
- ✅ Performance testing
- ✅ Security testing
- ✅ Bug fixes and optimization

### 15.4 Phase 4: Deployment (Day 10)
- ✅ Deployment
- ✅ Monitoring setup
- ✅ Final testing
- ✅ Launch

---

## 16. References

### 16.1 Design Patterns
- **Gang of Four (GoF) Design Patterns:** For Low-Level Design
- **Clean Architecture:** By Robert C. Martin
- **Design Patterns:** Elements of Reusable Object-Oriented Software

### 16.2 Architecture Patterns
- **Microservices Architecture:** For system architecture
- **CQRS Pattern:** For data management (future)
- **Event Sourcing:** For audit trail (future)

### 16.3 Best Practices
- **SOLID Principles:** For object-oriented design
- **DRY Principle:** Don't Repeat Yourself
- **Clean Code:** By Robert C. Martin
- **Secure Coding:** OWASP Top 10

---

## 17. Glossary

### 17.1 Terms
- **MVP:** Minimum Viable Product
- **HLD:** High-Level Design
- **LLD:** Low-Level Design
- **JWT:** JSON Web Token
- **XP:** Experience Points
- **MMO:** Massively Multiplayer Online
- **API:** Application Programming Interface
- **REST:** Representational State Transfer
- **WebSocket:** Web Socket Protocol
- **Microservices:** Architectural style with independent services

### 17.2 Abbreviations
- **Auth:** Authentication
- **API:** Application Programming Interface
- **DB:** Database
- **UI:** User Interface
- **UX:** User Experience
- **HTTP:** Hypertext Transfer Protocol
- **HTTPS:** HTTP Secure
- **WSS:** WebSocket Secure
- **CI/CD:** Continuous Integration/Continuous Deployment

---

## 18. Document Control

### 18.1 Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024 | Documentation Team | Initial version |
| 2.0 | 2024 | Documentation Team | Updated with clarified mechanics from Plain English document: multiple hero types, weapon selection, arena selection, movement system, updated scoring, health, matchmaking, progression, and leaderboard systems |

### 18.2 Approval
- **Author:** Documentation Team
- **Reviewer:** Technical Lead
- **Approval:** CTO
- **Next Review Date:** After LLD completion

---

## 19. Next Steps

### 19.1 Immediate Next Steps
1. **Review and Finalize:** Review this document with stakeholders
2. **Gather Requirements:** Gather detailed requirements for each feature
3. **Create HLD:** Create High-Level Design document
4. **Create LLD:** Create Low-Level Design document using Gang of Four patterns
5. **Start Implementation:** Begin implementation after design approval

### 19.2 Design Phase
1. **High-Level Design:** System architecture and component design
2. **Low-Level Design:** Detailed design using Gang of Four patterns
3. **API Design:** REST API and WebSocket event specifications
4. **Database Design:** Database schema and indexing strategy
5. **Security Design:** Security architecture and implementation

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** Documentation Team
- **Reviewer:** Technical Lead
- **Approval:** CTO
- **Status:** Draft
- **Next Review Date:** After stakeholder review

