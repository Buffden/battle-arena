# 🏆 Battle Arena Jira Epic & Story Tracker

---

Github Project Link: [https://github.com/users/Buffden/projects/3](https://github.com/users/Buffden/projects/3)

## Epic: Frontend Foundation & Dashboard

* **FE-1: Initialize Angular project with routing** ✅

  * Description: Create a new Angular app named `frontend-service` with routing enabled.
  * Acceptance Criteria: App runs locally, default route is dashboard.
  * Story Points: 2
  * Priority: High

* **FE-2: Theme & Global Styling** ✅

  * Description: Set up SCSS or TailwindCSS for global design consistency.
  * Acceptance Criteria: Theme applied on nav, buttons, and containers.
  * Story Points: 3
  * Priority: Medium

* **FE-3: Navbar & Route Guards** ✅

  * Description: Create a top navbar and protect routes using AuthGuard.
  * Acceptance Criteria: `/dashboard`, `/arena` require login; `/login` and `/register` do not.
  * Story Points: 5
  * Priority: High

* **FE-4: Dashboard Page** ✅

  * Description: Central gameplay hub showing player progress and quick access.
  * Story Points: 10
  * Priority: High

    * **FE-4.1: Dashboard API Integration** ✅

      * Description: Fetch `/me` data and bind in dashboard.
      * Acceptance Criteria: Dashboard displays user info from backend.
      * Story Points: 2
      * Priority: High
    * **FE-4.2: XP & Level Stat Cards** ✅

      * Description: Show gamified progress visually.
      * Acceptance Criteria: Stat cards update with XP/level.
      * Story Points: 3
      * Priority: High
    * **FE-4.3: Avatar & Welcome Block** ✅

      * Description: Personalized welcome with avatar.
      * Acceptance Criteria: Avatar and welcome message shown.
      * Story Points: 2
      * Priority: Medium
    * **FE-4.4: Quick Match Button (Stub)** ✅

      * Description: CTA for gameplay entry.
      * Acceptance Criteria: Button present, triggers stub action.
      * Story Points: 1
      * Priority: Medium
    * **FE-4.5: Navigation Buttons** ✅

      * Description: To profile, leaderboard, etc.
      * Acceptance Criteria: Buttons navigate to correct routes.
      * Story Points: 2
      * Priority: Medium

* **FE-5: Leaderboard Page** ⏳

  * Description: Show top players using data from leaderboard-service.
  * Acceptance Criteria: Paginated table view with XP, win rate, username.
  * Story Points: 3
  * Priority: Medium

* **FE-6: Profile Page** ⏳

  * Description: Player identity and customization area.
  * Story Points: 15
  * Priority: Medium

    * **FE-6.1: Load Profile into Reactive Form** ⏳

      * Description: Bind editable fields like displayName, bio.
      * Acceptance Criteria: Profile loads into form.
      * Story Points: 3
      * Priority: Medium
    * **FE-6.2: Avatar Picker Component** ⏳

      * Description: Choose from preset avatars.
      * Acceptance Criteria: Avatar picker works and updates avatar.
      * Story Points: 3
      * Priority: Medium
    * **FE-6.3: Display Name & Bio Inputs** ⏳

      * Description: Editable fields with validation.
      * Acceptance Criteria: Inputs validate and update state.
      * Story Points: 2
      * Priority: Medium
    * **FE-6.4: Read-only Stats Summary** ⏳

      * Description: XP, Level, future: match count.
      * Acceptance Criteria: Stats summary is visible and accurate.
      * Story Points: 2
      * Priority: Medium
    * **FE-6.5: Save Button + PUT Integration** ⏳

      * Description: Persist edits to `/me`.
      * Acceptance Criteria: Save triggers backend update.
      * Story Points: 3
      * Priority: Medium
    * **FE-6.6: Achievements Placeholder** ⏳

      * Description: Dummy icons for future badges.
      * Acceptance Criteria: Placeholder icons visible.
      * Story Points: 2
      * Priority: Low

* **FE-7: Matchmaking Screen** ✅

  * Description: Add queue animation and response from socket.io server.
  * Acceptance Criteria: Emits join-queue, receives matchFound and redirects.
  * Story Points: 3
  * Priority: High

* **FE-8: Integrate Phaser Game in Arena** ⏳

  * Description: Render Phaser 3 game inside Angular on `/arena` route.
  * Acceptance Criteria: Phaser loads tank game, syncs state with backend.
  * Story Points: 13
  * Priority: High

* **FE-9: Post-Match Summary** ⏳

  * Description: Show winner, earned XP, and next steps after match ends.
  * Acceptance Criteria: Data pulled from backend after game completion.
  * Story Points: 3
  * Priority: Medium

---

## Epic: Backend Auth, Matchmaking, Game Logic

* **BE-AUTH-1 to BE-UPRO-2** ✅

  * Description: (Already reviewed)

* **BE-LB-1: Leaderboard API** ⏳

  * Description: GET `/top` for top 100 players by XP.
  * Acceptance Criteria: Returns sorted leaderboard data.
  * Story Points: 5
  * Priority: Medium

* **BE-MM-1: Matchmaking via Socket.io** ✅

  * Description: Queue server with `matchFound` emit.
  * Acceptance Criteria: Players matched and notified via socket.io.
  * Story Points: 5
  * Priority: High

    * **BE-MM-1.1: Implement XP-based matchmaking with dynamic range**
      * Description: Players are matched based on XP difference with configurable thresholds.
      * Acceptance Criteria: Match only players within acceptable XP delta.
      * Story Points: 3

    * **BE-MM-1.2: Add queue handling logic with join/leave socket events**
      * Description: Socket.io listeners for join-queue, leave-queue.
      * Story Points: 2

    * **BE-MM-1.3: Add match acceptance and timeout mechanism**
      * Description: Both players must confirm to proceed or lobby dissolves.
      * Story Points: 3

    * **BE-MM-1.4: Create lobby structure and persistence in memory or Redis**
      * Description: After match is found, create a temp lobby and assign both players.
      * Story Points: 2

    * **BE-MM-1.5: Add reconnection handling logic**
      * Description: Players who refresh or disconnect can rejoin their lobby using playerId/matchId.
      * Story Points: 2

    * **BE-MM-1.6: Add middleware for JWT validation on socket connection**
      * Description: Reject unauthenticated users at socket layer.
      * Story Points: 2

    * **BE-MM-1.7: Add test scripts and utils for matchmaking logic**
      * Description: Unit or functional tests for matchmaking and queue behavior.
      * Story Points: 2

    * **BE-MM-1.8: Frontend integration with socket.io matchmaking service**
      * Description: Add /matchmaking route and connect to socket events.
      * Story Points: 3

* **BE-GAME-1: Redis Queue & Lobby in Matchmaking** ✅

  * Description: Replace in-memory matchmaking queue/lobby with Redis keys. Implement `join-queue`, `create-lobby`, `join-lobby/:code`.
  * Acceptance Criteria: Redis keys exist for queue and lobbies; users are matched successfully and handed over to game-engine.
  * Story Points: 8
  * Priority: High

    * **BE-GAME-1.1: Integrate Redis client with retry + logging**
      * Description: Add Redis connection with robust reconnect and log strategy.
      * Story Points: 2

    * **BE-GAME-1.2: Store XP-based queue using Redis sorted sets**
      * Description: Allow O(log N) matchmaking lookup by XP.
      * Story Points: 3

    * **BE-GAME-1.3: Store lobby details using Redis hash**
      * Description: MatchId → metadata like player1, player2, timeout, etc.
      * Story Points: 3

    * **BE-GAME-1.4: Add Redis flush-on-deploy and clean-up script (optional)**
      * Description: Clear old lobbies/queues at startup.
      * Story Points: 1

    * **BE-GAME-1.5: Add Redis to docker-compose stack**
      * Description: Add Redis service with health check in docker-compose.yml.
      * Story Points: 1

* **BE-GAME-2: GameEngine match lifecycle via Socket.IO** ⏳

  * Description: On `joinMatch`, game-engine service initializes room, validates player, sets up turn order, and listens to game events.
  * Acceptance Criteria: Turn-based gameplay works; player actions processed and turns switch properly.
  * Story Points: 8
  * Priority: High

* **BE-GAME-3: Projectile physics with Matter.js** ⏳

  * Description: Use Matter.js to simulate projectile trajectory based on angle, power, unit type.
  * Acceptance Criteria: Physics matches gameplay expectations; output includes impact point and damage value.
  * Story Points: 5
  * Priority: Medium

* **BE-GAME-4: Emit matchOver + update XP/leaderboard** ⏳

  * Description: On player health <= 0, emit `matchOver`, then call profile-service to update XP, and leaderboard-service for match stats.
  * Acceptance Criteria: XP awarded to winner, match logged in leaderboard, matchOver UI shown on frontend.
  * Story Points: 5
  * Priority: High

* **BE-GAME-5: WebSocket JWT verification middleware** ✅

  * Description: Add auth middleware to Socket.IO connection to verify token before joining match.
  * Acceptance Criteria: Only authenticated users can emit game events; unauthorized connections are rejected.
  * Story Points: 3
  * Priority: High

* **BE-GAME-6: Log match actions for replay** ⏳

  * Description: Store match-level logs in DB or Redis for potential replay in future (optional enhancement).
  * Acceptance Criteria: Each shot's angle, power, impact, and timestamp stored per matchId.
  * Story Points: 3
  * Priority: Low

---

## Epic: Deployment, DevOps & Hosting

* **DEV-1: Dockerfile per Microservice** ✅

  * Description: Write Dockerfile for each backend and frontend service.
  * Acceptance Criteria: Each service builds and runs in Docker locally.
  * Story Points: 5
  * Priority: High

* **DEV-2: Unified docker-compose.yml** ✅

  * Description: Compose file to run all services and dependencies (Redis, DB) together.
  * Acceptance Criteria: `docker-compose up` brings up full stack.
  * Story Points: 5
  * Priority: High

* **DEV-3: MongoDB Init Script** ⏳

  * Description: Script to seed MongoDB with initial data (if used).
  * Acceptance Criteria: DB is seeded on first run.
  * Story Points: 3
  * Priority: Medium

* **DEV-4: AWS EC2 Deployment Guide** ⏳

  * Description: Step-by-step guide for deploying all services to AWS EC2 (or ECS), including S3/CloudFront for frontend.
  * Acceptance Criteria: All services are live and accessible in AWS environment.
  * Story Points: 8
  * Priority: Medium

---

# 📌 Add new stories or subtasks under the relevant Epic or Story as needed!
