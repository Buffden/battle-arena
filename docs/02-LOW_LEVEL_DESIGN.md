# 🔧 Low-Level Design (LLD) Document
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

## 1. Introduction

### 1.1 Purpose
This Low-Level Design (LLD) document provides detailed design specifications for each component, class, database schema, and API endpoint in the Battle Arena system.

### 1.2 Scope
This document covers:
- Detailed class diagrams and interfaces
- Database schema design
- API endpoint specifications
- Service layer implementations
- Data flow within components
- Error handling and validation

### 1.3 Design Principles
All implementations must follow:
- **SOLID Principles**
- **Design Patterns** (Factory, Strategy, Observer, Singleton where appropriate)
- **Clean Architecture** layers
- **Security First** approach
- **Testability** and **Maintainability**

---

## 2. Auth Service - Low-Level Design

### 2.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Auth Service Layer                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  AuthController  │──────│   AuthService    │            │
│  │                  │      │                  │            │
│  │ + register()     │      │ + registerUser() │            │
│  │ + login()        │      │ + authenticate() │            │
│  │ + validateToken()│      │ + generateToken()│            │
│  │ + refreshToken() │      │ + validateToken()│            │
│  └──────────────────┘      └──────────────────┘            │
│         │                            │                       │
│         │                            │                       │
│         ▼                            ▼                       │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  AuthRepository  │      │  JWTUtil         │            │
│  │                  │      │                  │            │
│  │ + findByEmail()  │      │ + generate()     │            │
│  │ + findByUsername()│     │ + verify()       │            │
│  │ + save()         │      │ + refresh()      │            │
│  └──────────────────┘      └──────────────────┘            │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────┐                                       │
│  │  User (Entity)   │                                       │
│  │                  │                                       │
│  │ - id: ObjectId   │                                       │
│  │ - username: String│                                      │
│  │ - email: String  │                                       │
│  │ - passwordHash: String│                                  │
│  │ - createdAt: Date│                                       │
│  │ - updatedAt: Date│                                       │
│  └──────────────────┘                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Database Schema

#### 2.2.1 User Collection
```javascript
{
  _id: ObjectId,                    // Primary key
  username: String,                 // Unique, indexed
  email: String,                    // Unique, indexed
  passwordHash: String,             // BCrypt hash
  role: String,                     // Default: "USER"
  isActive: Boolean,                // Default: true
  createdAt: Date,                  // Auto-generated
  updatedAt: Date,                  // Auto-updated
  lastLoginAt: Date,                // Updated on login
  failedLoginAttempts: Number,      // Security tracking
  accountLockedUntil: Date          // Account locking
}

// Indexes:
// - username: unique index
// - email: unique index
// - createdAt: ascending index
```

### 2.3 API Endpoints

#### 2.3.1 POST /api/auth/register
```typescript
Request:
{
  username: string;      // Required, 3-20 chars, alphanumeric
  email: string;         // Required, valid email format
  password: string;      // Required, min 8 chars, complexity rules
}

Response (201):
{
  success: true;
  message: "User registered successfully";
  data: {
    userId: string;
    username: string;
    email: string;
  }
}

Error Responses:
- 400: Validation error
- 409: Username/email already exists
- 500: Internal server error
```

#### 2.3.2 POST /api/auth/login
```typescript
Request:
{
  username: string;      // Or email
  password: string;
}

Response (200):
{
  success: true;
  data: {
    token: string;       // JWT token
    refreshToken: string;
    expiresIn: number;   // Seconds
    user: {
      id: string;
      username: string;
      email: string;
    }
  }
}

Error Responses:
- 401: Invalid credentials
- 403: Account locked
- 429: Too many requests
```

#### 2.3.3 POST /api/auth/validate
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Response (200):
{
  valid: true;
  user: {
    id: string;
    username: string;
    email: string;
  }
}

Error Responses:
- 401: Invalid/expired token
```

### 2.4 Service Implementation

#### 2.4.1 AuthService Interface
```java
public interface AuthService {
    UserRegistrationResponse registerUser(UserRegistrationRequest request);
    AuthResponse authenticateUser(AuthRequest request);
    TokenValidationResponse validateToken(String token);
    AuthResponse refreshToken(String refreshToken);
    void lockAccount(String username);
    void unlockAccount(String username);
}
```

#### 2.4.2 Security Implementation
```java
// Password hashing with BCrypt
@Service
public class PasswordService {
    private static final int BCRYPT_ROUNDS = 12;
    
    public String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(BCRYPT_ROUNDS));
    }
    
    public boolean verifyPassword(String password, String hash) {
        return BCrypt.checkpw(password, hash);
    }
}

// JWT Token generation and validation
@Service
public class JwtService {
    private final String secret;
    private final long expiration;
    
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(user.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS512, secret)
            .compact();
    }
    
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        } catch (JwtException e) {
            throw new InvalidTokenException("Invalid token", e);
        }
    }
}
```

---

## 3. Profile Service - Low-Level Design

### 3.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                 Profile Service Layer                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ ProfileController│──────│  ProfileService  │            │
│  │                  │      │                  │            │
│  │ + getProfile()   │      │ + getProfile()   │            │
│  │ + updateProfile()│      │ + updateProfile()│            │
│  │ + getStats()     │      │ + calculateXP()  │            │
│  │ + updateXP()     │      │ + calculateLevel()│           │
│  └──────────────────┘      └──────────────────┘            │
│         │                            │                       │
│         │                            │                       │
│         ▼                            ▼                       │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ ProfileRepository│      │   XPCalculator   │            │
│  │                  │      │                  │            │
│  │ + findByUserId() │      │ + calculateXP()  │            │
│  │ + save()         │      │ + calculateLevel()│           │
│  │ + updateXP()     │      │ + getXPForLevel()│            │
│  └──────────────────┘      └──────────────────┘            │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────┐                                       │
│  │  Profile (Entity)│                                       │
│  │                  │                                       │
│  │ - id: ObjectId   │                                       │
│  │ - userId: ObjectId│                                      │
│  │ - displayName: String│                                   │
│  │ - avatar: String │                                       │
│  │ - xp: Number     │                                       │
│  │ - level: Number  │                                       │
│  │ - wins: Number   │                                       │
│  │ - losses: Number │                                       │
│  │ - matchesPlayed: Number│                                 │
│  └──────────────────┘                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Database Schema

#### 3.2.1 Profile Collection
```javascript
{
  _id: ObjectId,                    // Primary key
  userId: ObjectId,                 // Foreign key to User, unique, indexed
  displayName: String,              // User's display name
  avatar: String,                   // Avatar URL or ID
  bio: String,                      // User bio (max 500 chars)
  xp: Number,                       // Experience points, default: 0
  level: Number,                    // Current level, default: 1
  wins: Number,                     // Number of wins, default: 0
  losses: Number,                   // Number of losses, default: 0
  matchesPlayed: Number,            // Total matches, default: 0
  winRate: Number,                  // Calculated: wins/matchesPlayed
  achievements: [String],           // Array of achievement IDs
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-updated
}

// Indexes:
// - userId: unique index
// - xp: descending index (for leaderboard)
// - level: descending index
// - winRate: descending index
```

### 3.3 API Endpoints

#### 3.3.1 GET /api/profile/me
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Response (200):
{
  success: true;
  data: {
    userId: string;
    displayName: string;
    avatar: string;
    bio: string;
    xp: number;
    level: number;
    wins: number;
    losses: number;
    matchesPlayed: number;
    winRate: number;
    achievements: string[];
  }
}
```

#### 3.3.2 PUT /api/profile/me
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Request Body:
{
  displayName?: string;    // Optional, 3-30 chars
  avatar?: string;         // Optional, valid avatar ID
  bio?: string;            // Optional, max 500 chars
}

Response (200):
{
  success: true;
  data: {
    // Updated profile data
  }
}
```

#### 3.3.3 POST /api/profile/xp
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Request Body:
{
  userId: string;
  xpGained: number;        // XP to add
  matchId: string;         // Match ID for tracking
  isWinner: boolean;       // Whether user won
}

Response (200):
{
  success: true;
  data: {
    newXP: number;
    newLevel: number;
    levelUp: boolean;      // Whether level increased
  }
}
```

### 3.4 XP Calculation Logic

```java
@Service
public class XPCalculator {
    private static final int BASE_XP_PER_WIN = 100;
    private static final int BASE_XP_PER_LOSS = 25;
    private static final int XP_MULTIPLIER_PER_LEVEL = 10;
    
    public XPCalculationResult calculateXP(int currentLevel, boolean isWinner, int opponentLevel) {
        int baseXP = isWinner ? BASE_XP_PER_WIN : BASE_XP_PER_LOSS;
        int levelDifference = opponentLevel - currentLevel;
        int levelBonus = levelDifference * XP_MULTIPLIER_PER_LEVEL;
        int totalXP = Math.max(1, baseXP + levelBonus);
        
        return new XPCalculationResult(totalXP, calculateNewLevel(currentLevel, totalXP));
    }
    
    private int calculateNewLevel(int currentLevel, int xpGained) {
        int xpForNextLevel = getXPRequiredForLevel(currentLevel + 1);
        // Level calculation logic
        return currentLevel; // Simplified
    }
    
    private int getXPRequiredForLevel(int level) {
        return (int) (100 * Math.pow(1.5, level - 1));
    }
}
```

---

## 4. Leaderboard Service - Low-Level Design

### 4.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│               Leaderboard Service Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │LeaderboardController│───│LeaderboardService│            │
│  │                  │      │                  │            │
│  │ + getTopPlayers()│      │ + getTopPlayers()│            │
│  │ + getPlayerRank()│      │ + getPlayerRank()│            │
│  │ + updateRanking()│      │ + updateRanking()│            │
│  └──────────────────┘      └──────────────────┘            │
│         │                            │                       │
│         │                            │                       │
│         ▼                            ▼                       │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │LeaderboardRepository│    │  RankingAlgorithm│            │
│  │                  │      │                  │            │
│  │ + findTopPlayers()│     │ + calculateRank()│            │
│  │ + findPlayerRank()│     │ + updateRankings()│           │
│  │ + updateRanking() │     └──────────────────┘            │
│  └──────────────────┘                                       │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────┐                                       │
│  │ LeaderboardEntry │                                       │
│  │                  │                                       │
│  │ - userId: ObjectId│                                      │
│  │ - rank: Number   │                                       │
│  │ - xp: Number     │                                       │
│  │ - winRate: Number│                                       │
│  └──────────────────┘                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Database Schema

#### 4.2.1 Leaderboard Collection
```javascript
{
  _id: ObjectId,                    // Primary key
  userId: ObjectId,                 // Foreign key to User, indexed
  rank: Number,                     // Current rank, indexed
  xp: Number,                       // Total XP, indexed (descending)
  level: Number,                    // Current level
  wins: Number,                     // Total wins
  losses: Number,                   // Total losses
  winRate: Number,                  // Calculated win rate
  updatedAt: Date,                  // Last update timestamp
  lastMatchAt: Date                 // Last match timestamp
}

// Indexes:
// - rank: ascending index
// - xp: descending index (primary sorting)
// - winRate: descending index (secondary sorting)
// - userId: unique index
```

### 4.3 API Endpoints

#### 4.3.1 GET /api/leaderboard/top
```typescript
Query Parameters:
{
  limit?: number;      // Default: 100, max: 1000
  offset?: number;     // Default: 0
  sortBy?: string;     // "xp" | "winRate" | "level", default: "xp"
}

Response (200):
{
  success: true;
  data: {
    players: [
      {
        rank: number;
        userId: string;
        displayName: string;
        xp: number;
        level: number;
        wins: number;
        losses: number;
        winRate: number;
      }
    ];
    total: number;
    limit: number;
    offset: number;
  }
}
```

#### 4.3.2 GET /api/leaderboard/rank/:userId
```typescript
Response (200):
{
  success: true;
  data: {
    userId: string;
    rank: number;
    xp: number;
    level: number;
    wins: number;
    losses: number;
    winRate: number;
  }
}
```

---

## 5. Matchmaking Service - Low-Level Design

### 5.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Matchmaking Service Layer                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ MatchmakingSocket│──────│ MatchmakingService│            │
│  │    Handler       │      │                  │            │
│  │                  │      │ + joinQueue()    │            │
│  │ + handleJoin()   │      │ + leaveQueue()   │            │
│  │ + handleLeave()  │      │ + findMatch()    │            │
│  │ + handleAccept() │      │ + createLobby()  │            │
│  └──────────────────┘      └──────────────────┘            │
│         │                            │                       │
│         │                            │                       │
│         ▼                            ▼                       │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  RedisService    │      │ MatchingAlgorithm│            │
│  │                  │      │                  │            │
│  │ + addToQueue()   │      │ + findMatch()    │            │
│  │ + removeFromQueue()│    │ + calculateXPDelta()│         │
│  │ + getQueue()     │      │ + isMatchValid() │            │
│  │ + createLobby()  │      └──────────────────┘            │
│  │ + getLobby()     │                                       │
│  └──────────────────┘                                       │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────┐                                       │
│  │   Redis Client   │                                       │
│  │                  │                                       │
│  │ - Queue (Sorted Set)│                                    │
│  │ - Lobby (Hash)   │                                       │
│  └──────────────────┘                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Redis Data Structures

#### 5.2.1 Matchmaking Queue (Sorted Set)
```
Key: matchmaking:queue
Score: Player XP
Value: JSON string {
  playerId: string,
  socketId: string,
  joinedAt: timestamp,
  xp: number
}

Operations:
- ZADD: Add player to queue
- ZREM: Remove player from queue
- ZRANGEBYSCORE: Find players in XP range
- ZCARD: Get queue size
```

#### 5.2.2 Lobby Storage (Hash)
```
Key: lobby:{matchId}
Fields:
- matchId: string
- player1Id: string
- player2Id: string
- player1SocketId: string
- player2SocketId: string
- status: string (pending, accepted, rejected, expired)
- createdAt: timestamp
- expiresAt: timestamp
- xpDelta: number

Operations:
- HSET: Create/update lobby
- HGETALL: Get lobby details
- DEL: Delete lobby
- EXPIRE: Set expiration
```

### 5.3 Socket.io Events

#### 5.3.1 Client → Server Events
```typescript
// Join matchmaking queue
socket.emit('join-queue', {
  playerId: string;
  xp: number;
});

// Leave matchmaking queue
socket.emit('leave-queue');

// Accept match
socket.emit('accept-match', {
  matchId: string;
});

// Reject match
socket.emit('reject-match', {
  matchId: string;
});
```

#### 5.3.2 Server → Client Events
```typescript
// Match found
socket.emit('match-found', {
  matchId: string;
  opponent: {
    playerId: string;
    displayName: string;
    xp: number;
    level: number;
  };
  timeout: number; // Seconds to accept
});

// Match accepted
socket.emit('match-accepted', {
  matchId: string;
  gameEngineUrl: string;
});

// Match rejected
socket.emit('match-rejected', {
  matchId: string;
  reason: string;
});

// Queue status
socket.emit('queue-status', {
  position: number;
  estimatedWaitTime: number;
});
```

### 5.4 Matchmaking Algorithm

```javascript
class MatchmakingAlgorithm {
    constructor(redisService, config) {
        this.redisService = redisService;
        this.config = config;
        this.xpThreshold = config.xpThreshold || 100; // Default XP difference threshold
        this.maxWaitTime = config.maxWaitTime || 30000; // 30 seconds
        this.expansionRate = config.expansionRate || 1.2; // Expand threshold by 20% every 5 seconds
    }
    
    async findMatch(playerId, playerXP) {
        let currentThreshold = this.xpThreshold;
        const startTime = Date.now();
        
        while (Date.now() - startTime < this.maxWaitTime) {
            // Find players within XP range
            const minXP = playerXP - currentThreshold;
            const maxXP = playerXP + currentThreshold;
            
            const candidates = await this.redisService.getPlayersInRange(minXP, maxXP);
            
            // Filter out self and already matched players
            const validCandidates = candidates.filter(candidate => 
                candidate.playerId !== playerId && 
                !candidate.matched
            );
            
            if (validCandidates.length > 0) {
                // Select best match (closest XP)
                const match = this.selectBestMatch(playerXP, validCandidates);
                return match;
            }
            
            // Expand search range
            currentThreshold *= this.expansionRate;
            
            // Wait before next attempt
            await this.sleep(5000);
        }
        
        return null; // No match found
    }
    
    selectBestMatch(playerXP, candidates) {
        return candidates.reduce((best, candidate) => {
            const bestDelta = Math.abs(best.xp - playerXP);
            const candidateDelta = Math.abs(candidate.xp - playerXP);
            return candidateDelta < bestDelta ? candidate : best;
        });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```

---

## 6. Game Engine Service - Low-Level Design

### 6.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│               Game Engine Service Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ GameSocketHandler│──────│  GameRoomManager │            │
│  │                  │      │                  │            │
│  │ + handleJoin()   │      │ + createRoom()   │            │
│  │ + handleAction() │      │ + getRoom()      │            │
│  │ + handleDisconnect()│   │ + removeRoom()   │            │
│  └──────────────────┘      └──────────────────┘            │
│         │                            │                       │
│         │                            ▼                       │
│         │                  ┌──────────────────┐            │
│         │                  │    GameRoom      │            │
│         │                  │                  │            │
│         │                  │ + startGame()    │            │
│         │                  │ + processAction()│            │
│         │                  │ + switchTurn()   │            │
│         │                  │ + checkWin()     │            │
│         │                  │ + endGame()      │            │
│         │                  └──────────────────┘            │
│         │                            │                       │
│         │                            ▼                       │
│         │                  ┌──────────────────┐            │
│         │                  │   GameState      │            │
│         │                  │                  │            │
│         │                  │ - players: Array │            │
│         │                  │ - currentTurn: Number│        │
│         │                  │ - round: Number  │            │
│         │                  │ - status: String │            │
│         │                  └──────────────────┘            │
│         │                            │                       │
│         ▼                            ▼                       │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  ActionHandler   │      │  PhysicsEngine   │            │
│  │                  │      │                  │            │
│  │ + validateAction()│     │ + calculateTrajectory()│      │
│  │ + processFire()   │     │ + calculateDamage()│          │
│  │ + processMove()   │     │ + applyPhysics() │            │
│  └──────────────────┘      └──────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Game State Structure

```typescript
interface GameState {
    matchId: string;
    status: 'waiting' | 'starting' | 'playing' | 'paused' | 'finished';
    players: Player[];
    currentTurn: number;        // Index of current player
    round: number;              // Current round number
    maxRounds: number;          // Maximum rounds
    roundTimeLimit: number;     // Seconds per round
    turnStartTime: Date;        // When current turn started
    gameSettings: GameSettings;
    terrain: Terrain;
    weather: Weather;
    replayData: ReplayAction[];
    winnerId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface Player {
    playerId: string;
    socketId: string;
    username: string;
    health: number;
    maxHealth: number;
    position: Position;
    angle: number;              // Tank angle (0-90 degrees)
    power: number;              // Shot power (0-100)
    score: number;
    isReady: boolean;
}

interface Position {
    x: number;
    y: number;
}

interface GameSettings {
    maxRounds: number;
    roundTimeLimit: number;
    gravity: number;
    windEnabled: boolean;
    terrainComplexity: 'low' | 'medium' | 'high';
}

interface ReplayAction {
    actionId: string;
    playerId: string;
    actionType: 'fire' | 'move' | 'adjust';
    timestamp: Date;
    data: any;
    result: any;
}
```

### 6.3 Socket.io Events

#### 6.3.1 Client → Server Events
```typescript
// Join match
socket.emit('join-match', {
    matchId: string;
    playerId: string;
});

// Fire projectile
socket.emit('fire-projectile', {
    matchId: string;
    angle: number;      // 0-90 degrees
    power: number;      // 0-100
});

// Move tank
socket.emit('move-tank', {
    matchId: string;
    direction: 'left' | 'right';
    distance: number;
});

// Adjust angle/power
socket.emit('adjust-aim', {
    matchId: string;
    angle: number;
    power: number;
});

// Player ready
socket.emit('player-ready', {
    matchId: string;
});
```

#### 6.3.2 Server → Client Events
```typescript
// Game state update
socket.emit('game-state-update', {
    matchId: string;
    gameState: GameState;
});

// Turn started
socket.emit('turn-started', {
    matchId: string;
    playerId: string;
    timeLimit: number;
});

// Action result
socket.emit('action-result', {
    matchId: string;
    actionId: string;
    success: boolean;
    result: {
        impactPosition: Position;
        damage: number;
        hit: boolean;
    };
});

// Match ended
socket.emit('match-ended', {
    matchId: string;
    winnerId: string;
    results: {
        player1: PlayerResult;
        player2: PlayerResult;
    };
    xpGained: number;
});

// Error
socket.emit('game-error', {
    matchId: string;
    error: string;
    code: string;
});
```

### 6.4 Physics Engine Implementation

```javascript
const Matter = require('matter-js');

class PhysicsEngine {
    constructor() {
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.gravity = 9.8;
        this.windSpeed = 0;
        this.windDirection = 0;
    }
    
    calculateTrajectory(startPosition, angle, power, settings) {
        const { gravity, windEnabled, windSpeed, windDirection } = settings;
        
        // Convert angle to radians
        const angleRad = (angle * Math.PI) / 180;
        
        // Initial velocity components
        const velocity = power * 0.1; // Scale power to velocity
        const vx = velocity * Math.cos(angleRad);
        const vy = -velocity * Math.sin(angleRad); // Negative for upward
        
        // Calculate trajectory with physics
        const trajectory = [];
        let x = startPosition.x;
        let y = startPosition.y;
        let vxCurrent = vx;
        let vyCurrent = vy;
        const timeStep = 0.1;
        const maxSteps = 1000;
        
        for (let i = 0; i < maxSteps; i++) {
            trajectory.push({ x, y });
            
            // Apply gravity
            vyCurrent += gravity * timeStep;
            
            // Apply wind if enabled
            if (windEnabled) {
                vxCurrent += windSpeed * Math.cos(windDirection) * timeStep;
            }
            
            // Update position
            x += vxCurrent * timeStep;
            y += vyCurrent * timeStep;
            
            // Check if hit ground or out of bounds
            if (y >= this.getGroundHeight(x) || x < 0 || x > 1000) {
                break;
            }
        }
        
        return {
            trajectory,
            impactPosition: { x, y },
            impactTime: trajectory.length * timeStep
        };
    }
    
    calculateDamage(impactPosition, targetPosition, power, settings) {
        const distance = this.calculateDistance(impactPosition, targetPosition);
        const maxDamage = settings.weapons.defaultDamage;
        const splashRadius = settings.weapons.splashRadius;
        
        if (distance > splashRadius) {
            return 0; // No damage outside splash radius
        }
        
        // Calculate damage with falloff
        const damageRatio = 1 - (distance / splashRadius);
        const baseDamage = maxDamage * damageRatio;
        
        // Apply critical hit chance
        const isCritical = Math.random() < 0.1; // 10% critical chance
        const damage = isCritical ? baseDamage * settings.weapons.criticalHitMultiplier : baseDamage;
        
        return Math.floor(damage);
    }
    
    getGroundHeight(x) {
        // Simplified terrain height calculation
        // In production, use actual terrain data
        return 400 + 50 * Math.sin(x / 100);
    }
    
    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
```

### 6.5 Game Room Implementation

```javascript
class GameRoom {
    constructor(roomId, io, gameSettings) {
        this.roomId = roomId;
        this.io = io;
        this.gameSettings = gameSettings;
        this.gameState = null;
        this.players = new Map();
        this.physicsEngine = new PhysicsEngine();
        this.actionHandler = new ActionHandler(this.physicsEngine);
        this.turnTimer = null;
    }
    
    async addPlayer(playerId, socketId, playerData) {
        if (this.players.size >= this.gameSettings.maxPlayers) {
            throw new Error('Room is full');
        }
        
        this.players.set(playerId, {
            playerId,
            socketId,
            username: playerData.username,
            health: this.gameSettings.player.startingHealth,
            maxHealth: this.gameSettings.player.maxHealth,
            position: this.getStartingPosition(this.players.size),
            angle: 45,
            power: 50,
            score: 0,
            isReady: false
        });
        
        // Notify all players
        this.broadcast('player-joined', {
            playerId,
            username: playerData.username,
            totalPlayers: this.players.size
        });
        
        // If both players joined, start game
        if (this.players.size === this.gameSettings.maxPlayers) {
            await this.startGame();
        }
    }
    
    async startGame() {
        this.gameState = {
            matchId: this.roomId,
            status: 'starting',
            players: Array.from(this.players.values()),
            currentTurn: Math.floor(Math.random() * this.players.size), // Random first turn
            round: 1,
            maxRounds: this.gameSettings.game.maxRounds,
            roundTimeLimit: this.gameSettings.game.roundTimeLimit,
            turnStartTime: new Date(),
            gameSettings: this.gameSettings,
            terrain: this.generateTerrain(),
            weather: this.generateWeather(),
            replayData: [],
            winnerId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.gameState.status = 'playing';
        
        // Broadcast game start
        this.broadcast('game-started', {
            gameState: this.gameState
        });
        
        // Start first turn
        this.startTurn();
    }
    
    async processAction(playerId, actionType, actionData) {
        // Validate it's player's turn
        if (this.gameState.currentTurn !== this.getPlayerIndex(playerId)) {
            throw new Error('Not your turn');
        }
        
        // Validate action
        const validation = this.actionHandler.validateAction(
            this.gameState,
            playerId,
            actionType,
            actionData
        );
        
        if (!validation.valid) {
            throw new Error(validation.error);
        }
        
        // Process action
        const result = await this.actionHandler.processAction(
            this.gameState,
            playerId,
            actionType,
            actionData
        );
        
        // Update game state
        this.updateGameState(result);
        
        // Broadcast action result
        this.broadcast('action-result', {
            actionId: result.actionId,
            playerId,
            actionType,
            result: result.result
        });
        
        // Check win condition
        if (this.checkWinCondition()) {
            await this.endGame();
        } else {
            // Switch turn
            this.switchTurn();
        }
    }
    
    switchTurn() {
        this.gameState.currentTurn = (this.gameState.currentTurn + 1) % this.gameState.players.length;
        this.gameState.turnStartTime = new Date();
        
        // Check if round is complete
        if (this.gameState.currentTurn === 0) {
            this.gameState.round++;
            
            // Check if max rounds reached
            if (this.gameState.round > this.gameState.maxRounds) {
                this.endGame();
                return;
            }
        }
        
        this.startTurn();
    }
    
    startTurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentTurn];
        
        // Broadcast turn started
        this.broadcast('turn-started', {
            playerId: currentPlayer.playerId,
            timeLimit: this.gameState.roundTimeLimit
        });
        
        // Start turn timer
        this.turnTimer = setTimeout(() => {
            // Timeout - skip turn
            this.switchTurn();
        }, this.gameState.roundTimeLimit * 1000);
    }
    
    checkWinCondition() {
        for (const player of this.gameState.players) {
            if (player.health <= 0) {
                return true;
            }
        }
        return false;
    }
    
    async endGame() {
        this.gameState.status = 'finished';
        
        // Determine winner
        const winner = this.gameState.players.find(p => p.health > 0);
        this.gameState.winnerId = winner ? winner.playerId : null;
        
        // Calculate XP and update profiles
        await this.updatePlayerStats();
        
        // Broadcast match ended
        this.broadcast('match-ended', {
            winnerId: this.gameState.winnerId,
            results: this.gameState.players.map(p => ({
                playerId: p.playerId,
                health: p.health,
                score: p.score,
                isWinner: p.playerId === this.gameState.winnerId
            })),
            replayData: this.gameState.replayData
        });
        
        // Cleanup
        this.cleanup();
    }
    
    broadcast(event, data) {
        this.io.to(this.roomId).emit(event, data);
    }
    
    cleanup() {
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
        }
        // Remove room from manager
        // Save replay data to database
    }
}
```

---

## 7. Frontend - Low-Level Design

### 7.1 Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Angular Frontend Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │   Components     │──────│    Services      │            │
│  │                  │      │                  │            │
│  │ - Dashboard      │      │ - AuthService    │            │
│  │ - Matchmaking    │      │ - GameService    │            │
│  │ - Arena          │      │ - ProfileService │            │
│  │ - Profile        │      │ - LeaderboardService│         │
│  │ - Leaderboard    │      └──────────────────┘            │
│  └──────────────────┘              │                       │
│         │                          │                       │
│         │                          ▼                       │
│         │                  ┌──────────────────┐            │
│         │                  │   HTTP Client    │            │
│         │                  │   WebSocket      │            │
│         │                  │   Interceptors   │            │
│         │                  └──────────────────┘            │
│         │                          │                       │
│         ▼                          ▼                       │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │    Guards        │      │   State Management│           │
│  │                  │      │                  │            │
│  │ - AuthGuard      │      │ - RxJS Subjects  │            │
│  │ - RoleGuard      │      │ - Store (NgRx)   │            │
│  └──────────────────┘      └──────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Service Implementations

#### 7.2.1 GameService
```typescript
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: Socket;
  private gameState$ = new BehaviorSubject<GameState | null>(null);
  
  constructor(private http: HttpClient) {
    this.initializeSocket();
  }
  
  private initializeSocket() {
    const token = localStorage.getItem('token');
    this.socket = io(environment.gameEngineUrl, {
      auth: { token },
      transports: ['websocket']
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to game engine');
    });
    
    this.socket.on('game-state-update', (data: GameState) => {
      this.gameState$.next(data);
    });
    
    this.socket.on('match-ended', (data: MatchResult) => {
      this.handleMatchEnd(data);
    });
  }
  
  joinMatch(matchId: string): Observable<GameState> {
    this.socket.emit('join-match', { matchId });
    return this.gameState$.asObservable();
  }
  
  fireProjectile(matchId: string, angle: number, power: number): void {
    this.socket.emit('fire-projectile', {
      matchId,
      angle,
      power
    });
  }
  
  moveTank(matchId: string, direction: 'left' | 'right', distance: number): void {
    this.socket.emit('move-tank', {
      matchId,
      direction,
      distance
    });
  }
  
  getGameState(): Observable<GameState | null> {
    return this.gameState$.asObservable();
  }
}
```

#### 7.2.2 MatchmakingService
```typescript
@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private socket: Socket;
  private matchFound$ = new Subject<MatchFoundEvent>();
  
  constructor() {
    this.initializeSocket();
  }
  
  private initializeSocket() {
    const token = localStorage.getItem('token');
    this.socket = io(environment.matchmakingUrl, {
      auth: { token },
      transports: ['websocket']
    });
    
    this.socket.on('match-found', (data: MatchFoundEvent) => {
      this.matchFound$.next(data);
    });
  }
  
  joinQueue(): Observable<MatchFoundEvent> {
    this.socket.emit('join-queue');
    return this.matchFound$.asObservable();
  }
  
  leaveQueue(): void {
    this.socket.emit('leave-queue');
  }
  
  acceptMatch(matchId: string): void {
    this.socket.emit('accept-match', { matchId });
  }
  
  rejectMatch(matchId: string): void {
    this.socket.emit('reject-match', { matchId });
  }
}
```

---

## 8. Error Handling

### 8.1 Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
  };
}
```

### 8.2 Error Codes
```typescript
enum ErrorCode {
  // Authentication errors
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Game errors
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  GAME_FULL = 'GAME_FULL',
  NOT_YOUR_TURN = 'NOT_YOUR_TURN',
  INVALID_ACTION = 'INVALID_ACTION',
  
  // Matchmaking errors
  ALREADY_IN_QUEUE = 'ALREADY_IN_QUEUE',
  MATCH_NOT_FOUND = 'MATCH_NOT_FOUND',
  
  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}
```

### 8.3 Error Handling Implementation
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(
                false,
                new ErrorDetail(
                    ErrorCode.VALIDATION_ERROR,
                    e.getMessage(),
                    e.getDetails()
                )
            ));
    }
    
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse(
                false,
                new ErrorDetail(
                    ErrorCode.AUTH_INVALID,
                    e.getMessage()
                )
            ));
    }
}
```

---

## 9. Testing Strategy

### 9.1 Unit Testing
- **Service Layer:** Test business logic with mocked dependencies
- **Repository Layer:** Test database operations with test database
- **Utility Functions:** Test all utility functions with edge cases

### 9.2 Integration Testing
- **API Endpoints:** Test API endpoints with test client
- **Database Operations:** Test database operations with test database
- **WebSocket Events:** Test WebSocket events with test client

### 9.3 End-to-End Testing
- **User Flows:** Test complete user flows from registration to game completion
- **Multi-player Scenarios:** Test multi-player scenarios with multiple clients
- **Error Scenarios:** Test error handling and recovery

---

## 10. Conclusion

This Low-Level Design document provides detailed specifications for all components, classes, databases, and APIs in the Battle Arena system. All implementations must strictly adhere to the principles of **reusability, clean code, clean architecture, and secure programming**.

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming - These are MANDATORY for all implementations.**

