# Database Design

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

## 1. MongoDB Collections

### 1.1 Users Collection
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

**Indexes:**
- `username` - Unique index
- `email` - Unique index
- `createdAt` - Ascending index

### 1.2 Profiles Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "displayName": "string",
  "avatar": "string",
  "globalScore": "number",
  "rankTier": "string",
  "wins": "number",
  "losses": "number",
  "matchesPlayed": "number",
  "bio": "string",
  "achievements": ["array"],
  "region": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Indexes:**
- `userId` - Unique index
- `globalScore` - Descending index (for leaderboard)
- `rankTier` - Ascending index
- `region` - Ascending index
- `updatedAt` - Descending index

### 1.3 Matches Collection
```json
{
  "_id": "ObjectId",
  "matchId": "string",
  "player1Id": "ObjectId",
  "player2Id": "ObjectId",
  "player1Hero": "string",
  "player2Hero": "string",
  "player1Weapons": ["array"],
  "player2Weapons": ["array"],
  "arenaId": "string",
  "player1Score": "number",
  "player2Score": "number",
  "player1HP": "number",
  "player2HP": "number",
  "winnerId": "ObjectId",
  "isDraw": "boolean",
  "startTime": "Date",
  "endTime": "Date",
  "duration": "number",
  "replayData": "object",
  "createdAt": "Date"
}
```

**Indexes:**
- `matchId` - Unique index
- `player1Id` - Ascending index
- `player2Id` - Ascending index
- `winnerId` - Ascending index
- `player1Hero` - Ascending index
- `player2Hero` - Ascending index
- `arenaId` - Ascending index
- `startTime` - Descending index
- `createdAt` - Descending index

### 1.4 Leaderboard Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "rank": "number",
  "globalScore": "number",
  "rankTier": "string",
  "winRate": "number",
  "region": "string",
  "heroType": "string",
  "weaponUsage": "object",
  "updatedAt": "Date"
}
```

**Indexes:**
- `userId` - Unique index
- `rank` - Ascending index
- `globalScore` - Descending index
- `rankTier` - Ascending index
- `region` - Ascending index
- `heroType` - Ascending index
- `winRate` - Descending index
- `updatedAt` - Descending index
- Compound index: `{region: 1, heroType: 1, globalScore: -1}`
- Compound index: `{rankTier: 1, globalScore: -1}`

### 1.5 Heroes Collection
```json
{
  "_id": "ObjectId",
  "heroId": "string",
  "heroType": "string",
  "name": "string",
  "size": "object",
  "hitbox": "object",
  "baseHP": "number",
  "speed": "number",
  "weapons": ["array"],
  "animations": "object",
  "characteristics": "object",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Indexes:**
- `heroId` - Unique index
- `heroType` - Ascending index
- `name` - Ascending index

### 1.6 Weapons Collection
```json
{
  "_id": "ObjectId",
  "weaponId": "string",
  "heroType": "string",
  "name": "string",
  "damage": "number",
  "range": "number",
  "trajectory": "object",
  "weight": "number",
  "physics": "object",
  "animations": "object",
  "synergies": ["array"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Indexes:**
- `weaponId` - Unique index
- `heroType` - Ascending index
- `name` - Ascending index

### 1.7 Arenas Collection
```json
{
  "_id": "ObjectId",
  "arenaId": "string",
  "heroTypes": ["array"],
  "name": "string",
  "terrain": "object",
  "gravity": "number",
  "previewImage": "string",
  "boundaries": "object",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Indexes:**
- `arenaId` - Unique index
- `heroTypes` - Ascending index
- `name` - Ascending index

---

## 2. Redis Data Structures

### 2.1 Matchmaking Queue
- **Type:** Sorted Set
- **Key:** `matchmaking:queue:{heroType}` (hero-based queues)
- **Score:** Player global score/rank
- **Value:** Player ID + Socket ID + Hero selection
- **Operations:** Add, Remove, Range queries
- **TTL:** No expiration (managed by service)

### 2.2 Lobby Storage
- **Type:** Hash
- **Key:** `lobby:{matchId}`
- **Fields:**
  - `player1Id` - Player 1 ID
  - `player2Id` - Player 2 ID
  - `player1Heroes` - Player 1 selected heroes (array)
  - `player2Heroes` - Player 2 selected heroes (array)
  - `assignedHero` - Assigned hero (random from matched heroes)
  - `status` - Lobby status (pending, accepted, rejected)
  - `createdAt` - Creation timestamp
  - `timeout` - Timeout timestamp
- **TTL:** 60 seconds (auto-expire if not accepted)

### 2.3 Arena Selection Storage
- **Type:** Hash
- **Key:** `arena-selection:{matchId}`
- **Fields:**
  - `availableArenas` - Available arenas (array)
  - `eliminatedArenas` - Eliminated arenas (array)
  - `selectedArena` - Selected arena (string)
  - `player1Eliminations` - Player 1 eliminations (array)
  - `player2Eliminations` - Player 2 eliminations (array)
  - `status` - Selection status (in-progress, completed)
- **TTL:** 5 minutes (auto-expire if not completed)

### 2.4 Weapon Selection Storage
- **Type:** Hash
- **Key:** `weapon-selection:{matchId}`
- **Fields:**
  - `player1Weapons` - Player 1 selected weapons (array)
  - `player2Weapons` - Player 2 selected weapons (array)
  - `currentPlayer` - Current player selecting (string)
  - `selectionTimer` - Selection timer (number)
  - `status` - Selection status (in-progress, completed)
- **TTL:** 2 minutes (auto-expire if not completed)

### 2.5 Game State Cache
- **Type:** Hash
- **Key:** `game:{matchId}`
- **Fields:**
  - `state` - Game state (JSON)
  - `player1Id` - Player 1 ID
  - `player2Id` - Player 2 ID
  - `player1Hero` - Player 1 hero
  - `player2Hero` - Player 2 hero
  - `player1Health` - Player 1 health
  - `player2Health` - Player 2 health
  - `player1Score` - Player 1 score
  - `player2Score` - Player 2 score
  - `player1Moves` - Player 1 remaining moves
  - `player2Moves` - Player 2 remaining moves
  - `player1Weapons` - Player 1 weapons (array)
  - `player2Weapons` - Player 2 weapons (array)
  - `arenaId` - Arena ID
  - `currentTurn` - Current turn player ID
  - `turnNumber` - Current turn number
  - `matchTimer` - Match timer (number)
  - `turnTimer` - Turn timer (number)
- **TTL:** Match duration + 1 hour (for replay)

### 2.6 Hero/Weapon/Arena Configuration Cache
- **Type:** String
- **Key:** `config:heroes`, `config:weapons`, `config:arenas`, `config:rank-tiers`, `config:scoring`, `config:penalties`
- **Value:** Configuration data (JSON)
- **TTL:** 24 hours (refresh on configuration update)

### 2.4 User Session Cache
- **Type:** String
- **Key:** `session:{userId}`
- **Value:** Session data (JSON)
- **TTL:** 24 hours (JWT token expiration)

---

## 3. Database Relationships

### 3.1 User-Profile Relationship
- **Type:** One-to-One
- **Users Collection:** `_id` → Profiles Collection: `userId`
- **Cascade:** Delete profile when user is deleted

### 3.2 User-Match Relationship
- **Type:** One-to-Many
- **Users Collection:** `_id` → Matches Collection: `player1Id` or `player2Id`
- **Cascade:** Keep matches when user is deleted (for history)

### 3.3 User-Leaderboard Relationship
- **Type:** One-to-One
- **Users Collection:** `_id` → Leaderboard Collection: `userId`
- **Cascade:** Delete leaderboard entry when user is deleted

### 3.4 Hero-Weapon Relationship
- **Type:** One-to-Many
- **Heroes Collection:** `_id` → Weapons Collection: `heroType`
- **Cascade:** Keep weapons when hero is deleted (for history)

### 3.5 Hero-Arena Relationship
- **Type:** Many-to-Many
- **Heroes Collection:** `heroType` → Arenas Collection: `heroTypes`
- **Cascade:** Keep arenas when hero is deleted (for history)

### 3.6 Match-Hero Relationship
- **Type:** Many-to-One
- **Matches Collection:** `player1Hero`, `player2Hero` → Heroes Collection: `heroType`
- **Cascade:** Keep matches when hero is deleted (for history)

### 3.7 Match-Weapon Relationship
- **Type:** Many-to-Many
- **Matches Collection:** `player1Weapons`, `player2Weapons` → Weapons Collection: `weaponId`
- **Cascade:** Keep matches when weapon is deleted (for history)

### 3.8 Match-Arena Relationship
- **Type:** Many-to-One
- **Matches Collection:** `arenaId` → Arenas Collection: `arenaId`
- **Cascade:** Keep matches when arena is deleted (for history)

---

## 4. Database Indexing Strategy

### 4.1 Primary Indexes
- **All Collections:** `_id` - Automatic unique index
- **Users Collection:** `username`, `email` - Unique indexes
- **Profiles Collection:** `userId` - Unique index
- **Matches Collection:** `matchId` - Unique index
- **Leaderboard Collection:** `userId` - Unique index
- **Heroes Collection:** `heroId` - Unique index
- **Weapons Collection:** `weaponId` - Unique index
- **Arenas Collection:** `arenaId` - Unique index

### 4.2 Performance Indexes
- **Profiles Collection:** `globalScore`, `rankTier`, `region` - Descending indexes (for leaderboard queries)
- **Matches Collection:** `startTime`, `createdAt`, `player1Hero`, `player2Hero`, `arenaId` - Descending indexes (for recent matches and filtering)
- **Leaderboard Collection:** `rank`, `globalScore`, `rankTier`, `region`, `heroType`, `winRate` - Descending indexes (for ranking queries and filtering)
- **Heroes Collection:** `heroType`, `name` - Ascending indexes (for hero queries)
- **Weapons Collection:** `heroType`, `name` - Ascending indexes (for weapon queries)
- **Arenas Collection:** `heroTypes`, `name` - Ascending indexes (for arena queries)

### 4.3 Query Optimization
- **Compound Indexes** - For complex queries
- **Covered Queries** - Use indexes to avoid document retrieval
- **Query Profiling** - Monitor slow queries
- **Index Maintenance** - Regular index optimization

---

## 5. Database Security

### 5.1 MongoDB Security
- **Authentication** - MongoDB user authentication
- **Authorization** - Role-based access control
- **Encryption** - Data encryption at rest and in transit
- **Network Isolation** - Isolated MongoDB network
- **Backup and Recovery** - Regular backups and recovery procedures

### 5.2 Redis Security
- **Authentication** - Redis password authentication
- **TLS/SSL** - Encrypted Redis connections
- **Network Isolation** - Isolated Redis network
- **Access Control** - Redis ACL (Access Control List)
- **Data Persistence** - Redis persistence configuration

---

## 6. Database Scalability

### 6.1 MongoDB Scalability
- **Replication** - MongoDB replica sets for high availability
- **Sharding** - Horizontal scaling via sharding
- **Read Scaling** - Read from secondary replicas
- **Write Scaling** - Distributed writes via sharding

### 6.2 Redis Scalability
- **Clustering** - Redis cluster for distributed caching
- **Replication** - Redis replication for high availability
- **Partitioning** - Data partitioning across cluster nodes
- **Load Balancing** - Load balancing across cluster nodes

---

## 7. Database Backup and Recovery

### 7.1 MongoDB Backup
- **Regular Backups** - Daily backups
- **Incremental Backups** - Incremental backup strategy
- **Backup Storage** - Offsite backup storage
- **Backup Testing** - Regular backup restoration testing

### 7.2 Redis Backup
- **RDB Snapshots** - Periodic RDB snapshots
- **AOF Persistence** - Append-only file persistence
- **Backup Storage** - Offsite backup storage
- **Backup Testing** - Regular backup restoration testing

---

## 8. Related Documentation

- [System Architecture](./02-SYSTEM_ARCHITECTURE.md) - System architecture overview
- [Component Design](./03-COMPONENT_DESIGN.md) - Component specifications
- [Data Flow](./04-DATA_FLOW.md) - Data flow diagrams
- [Communication Patterns](./05-COMMUNICATION_PATTERNS.md) - Communication patterns

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

