# Communication Patterns

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

## 1. Synchronous Communication (REST)

### 1.1 HTTP/REST APIs
- **Protocol:** HTTP/HTTPS
- **Format:** JSON
- **Pattern:** Request-Response
- **Used by:** Auth, Profile, Leaderboard services

### 1.2 REST API Characteristics
- **Stateless** - Each request contains all necessary information
- **Resource-based** - URLs represent resources
- **HTTP Methods** - GET, POST, PUT, DELETE
- **Status Codes** - Standard HTTP status codes
- **Content-Type** - application/json

### 1.3 REST API Examples
- **Authentication:** `POST /api/auth/login`, `POST /api/auth/register`
- **Profile:** `GET /api/profile/me`, `PUT /api/profile/me`, `GET /api/profile/me/score`, `GET /api/profile/me/rank-tier`
- **Leaderboard:** `GET /api/leaderboard/top`, `GET /api/leaderboard/filtered`, `GET /api/leaderboard/player/{playerId}/rank`
- **Heroes:** `GET /api/heroes`, `GET /api/heroes/{heroId}`
- **Weapons:** `GET /api/weapons`, `GET /api/weapons/{heroType}`
- **Arenas:** `GET /api/arenas`, `GET /api/arenas/{heroType}`

---

## 2. Asynchronous Communication (WebSocket)

### 2.1 Socket.io WebSocket
- **Protocol:** WebSocket (WSS in production)
- **Format:** JSON
- **Pattern:** Event-driven
- **Used by:** Matchmaking, Game Engine services

### 2.2 WebSocket Characteristics
- **Bidirectional** - Real-time communication
- **Event-based** - Events and callbacks
- **Persistent Connection** - Long-lived connections
- **Low Latency** - Real-time updates
- **Automatic Reconnection** - Connection recovery

### 2.3 WebSocket Events
- **Hero Selection Events:**
  - `hero-selected` - Hero selection notification
  - `heroes-updated` - Hero selection updated

- **Matchmaking Events:**
  - `join-queue` - Join matchmaking queue (with hero selection)
  - `leave-queue` - Leave matchmaking queue
  - `queue-status` - Queue status update
  - `match-found` - Match found notification
  - `hero-assigned` - Hero assignment notification
  - `match-accepted` - Match acceptance
  - `match-rejected` - Match rejection

- **Arena Selection Events:**
  - `arena-selection-start` - Arena selection started
  - `arena-eliminated` - Arena elimination notification
  - `arena-selected` - Arena selected notification

- **Weapon Selection Events:**
  - `weapon-selection-start` - Weapon selection started
  - `weapon-selected` - Weapon selection notification
  - `weapon-selection-complete` - Weapon selection completed

- **Game Events:**
  - `game-start` - Game start notification
  - `player-move` - Player movement
  - `player-action` - Player action (aim, fire, weapon selection)
  - `game-state-update` - Game state update
  - `turn-update` - Turn update notification
  - `score-update` - Score update notification
  - `game-end` - Game end notification
  - `disconnect` - Player disconnection
  - `reconnect` - Player reconnection

---

## 3. Message Queue (Redis)

### 3.1 Redis Pub/Sub
- **Protocol:** Redis Pub/Sub
- **Format:** JSON
- **Pattern:** Publish-Subscribe
- **Used for:** Inter-service communication

### 3.2 Redis Pub/Sub Characteristics
- **Decoupled** - Services don't need to know about each other
- **Scalable** - Multiple subscribers
- **Real-time** - Near-instantaneous delivery
- **Reliable** - Redis reliability

### 3.3 Redis Pub/Sub Channels
- **Matchmaking Channel:** `matchmaking:events`
- **Game Events Channel:** `game:events`
- **Profile Updates Channel:** `profile:updates`
- **Leaderboard Updates Channel:** `leaderboard:updates`

---

## 4. Redis Data Structures

### 4.1 Matchmaking Queue
- **Type:** Sorted Set
- **Key:** `matchmaking:queue:{heroType}`
- **Score:** Player global score/rank
- **Value:** Player ID + Socket ID + Hero selection
- **Operations:** Add, Remove, Range queries

### 4.2 Lobby Storage
- **Type:** Hash
- **Key:** `lobby:{matchId}`
- **Fields:** `player1Id`, `player2Id`, `player1Heroes`, `player2Heroes`, `assignedHero`, `status`, `createdAt`, `timeout`
- **Operations:** Get, Set, Delete

### 4.3 Arena Selection Storage
- **Type:** Hash
- **Key:** `arena-selection:{matchId}`
- **Fields:** `availableArenas`, `eliminatedArenas`, `selectedArena`, `player1Eliminations`, `player2Eliminations`, `status`
- **Operations:** Get, Set, Update

### 4.4 Weapon Selection Storage
- **Type:** Hash
- **Key:** `weapon-selection:{matchId}`
- **Fields:** `player1Weapons`, `player2Weapons`, `currentPlayer`, `selectionTimer`, `status`
- **Operations:** Get, Set, Update

### 4.5 Game State Cache
- **Type:** Hash
- **Key:** `game:{matchId}`
- **Fields:** `state`, `player1Id`, `player2Id`, `player1Hero`, `player2Hero`, `player1Health`, `player2Health`, `player1Score`, `player2Score`, `player1Moves`, `player2Moves`, `player1Weapons`, `player2Weapons`, `arenaId`, `currentTurn`, `turnNumber`, `matchTimer`, `turnTimer`
- **Operations:** Get, Set, Update

### 4.6 Configuration Cache
- **Type:** String
- **Key:** `config:heroes`, `config:weapons`, `config:arenas`, `config:rank-tiers`, `config:scoring`, `config:penalties`
- **Value:** Configuration data (JSON)
- **Operations:** Get, Set

---

## 5. Communication Security

### 5.1 REST API Security
- **HTTPS** - Encrypted communication
- **JWT Authentication** - Token-based authentication
- **Rate Limiting** - Prevent abuse
- **CORS Configuration** - Cross-origin resource sharing
- **Input Validation** - Request validation

### 5.2 WebSocket Security
- **WSS** - Encrypted WebSocket communication
- **JWT Authentication** - Token in handshake
- **Origin Validation** - Validate WebSocket origin
- **Message Validation** - Validate WebSocket messages
- **Connection Limits** - Limit concurrent connections

### 5.3 Redis Security
- **Authentication** - Redis password authentication
- **TLS/SSL** - Encrypted Redis connections
- **Network Isolation** - Isolated Redis network
- **Access Control** - Redis ACL (Access Control List)

---

## 6. Communication Patterns Best Practices

### 6.1 REST API Best Practices
- **Use appropriate HTTP methods** - GET, POST, PUT, DELETE
- **Use meaningful URLs** - Resource-based URLs
- **Return appropriate status codes** - Standard HTTP status codes
- **Validate input** - Validate all input data
- **Handle errors gracefully** - Proper error handling

### 6.2 WebSocket Best Practices
- **Use events appropriately** - Event-driven communication
- **Handle reconnection** - Automatic reconnection
- **Validate messages** - Validate all WebSocket messages
- **Manage connections** - Proper connection management
- **Handle errors** - Proper error handling

### 6.3 Redis Best Practices
- **Use appropriate data structures** - Choose the right data structure
- **Set TTL** - Set expiration times for cached data
- **Monitor performance** - Monitor Redis performance
- **Handle failures** - Proper failure handling
- **Use pipelines** - Use Redis pipelines for batch operations

---

## 7. Related Documentation

- [System Architecture](./02-SYSTEM_ARCHITECTURE.md) - System architecture overview
- [Component Design](./03-COMPONENT_DESIGN.md) - Component specifications
- [Data Flow](./04-DATA_FLOW.md) - Data flow diagrams
- [Database Design](./06-DATABASE_DESIGN.md) - Database schema

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

