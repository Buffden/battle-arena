# Data Flow

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

## 1. Authentication Flow

### 1.1 User Registration Flow
```
User → Frontend → Auth Service → MongoDB
                ↓
            User Created → JWT Token Generated
                ↓
            JWT Token → Frontend Storage
                ↓
            User Logged In
```

### 1.2 User Login Flow
```
User → Frontend → Auth Service → MongoDB
                ↓
            Credentials Validated
                ↓
            JWT Token Generated
                ↓
            JWT Token → Frontend Storage
                ↓
            User Logged In
```

### 1.3 Token Validation Flow
```
Frontend Request → API Gateway → Auth Service
                                ↓
                            Token Validated
                                ↓
                            Request Authorized
                                ↓
                            Service Response
```

---

## 2. Hero Selection Flow

### 2.1 Hero Selection Flow
```
Player → Frontend → Hero Selection Service
                            ↓
                    Multiple Heroes Selected
                            ↓
                    Hero Selection Stored (Local Storage)
                            ↓
                    Hero Selection Priority Set
                            ↓
                    Ready for Matchmaking
```

## 3. Matchmaking Flow

### 3.1 Queue Joining Flow
```
Player → Frontend → Matchmaking Service → Redis Queue
                                    ↓
                            Player Added to Queue
                            (with hero selection, global score/rank)
                                    ↓
                            Queue Status Updated
                                    ↓
                            Estimated Wait Time Calculated
                                    ↓
                            Player Notified
```

### 3.2 Match Found Flow
```
Player 1 → Matchmaking Service → Redis Queue
Player 2 → Matchmaking Service → Redis Queue
                            ↓
                    Match Found (Global score/rank-based, hero compatibility)
                            ↓
                    Hero Assignment (Random from matched heroes)
                            ↓
                    Lobby Created (Redis)
                            ↓
                    Players Notified (with assigned hero)
                            ↓
                    Players Accept/Reject
                            ↓
                    Both Accept → Arena Selection
```

### 3.3 Match Rejection Flow
```
Player Rejects Match → Matchmaking Service
                            ↓
                    Lobby Removed (Redis)
                            ↓
                    Players Returned to Queue
                            ↓
                    Matchmaking Continues
```

## 4. Arena Selection Flow

### 4.1 Arena Selection Flow
```
Players Accept Match → Matchmaking Service
                            ↓
                    Available Arenas Retrieved (based on hero types)
                            ↓
                    Arena Selection Screen Displayed
                            ↓
                    Players Vote and Eliminate Arenas
                            ↓
                    Arena Elimination Broadcasted (Real-time)
                            ↓
                    One Arena Remains
                            ↓
                    Arena Selected Automatically
                            ↓
                    Proceed to Weapon Selection
```

## 5. Weapon Selection Flow

### 5.1 Weapon Selection Flow
```
Arena Selected → Matchmaking Service
                            ↓
                    Weapon Selection Screen Displayed
                            ↓
                    30-Second Timer Started
                            ↓
                    Players Select Weapons Alternating
                            ↓
                    Weapon Selection Broadcasted (Real-time)
                            ↓
                    Continue Until 10 Weapons Each Selected
                            ↓
                    If Timeout → Random Weapon Selected
                            ↓
                    Weapons Locked
                            ↓
                    Proceed to Game Start
```

---

## 6. Gameplay Flow

### 6.1 Game Start Flow
```
Weapons Selected → Game Engine Service
                            ↓
                    Game Room Created
                            ↓
                    Initial Game State Generated
                            (Heroes, Arena, Weapons, HP, Movement Count)
                            ↓
                    Game State → Redis Cache
                            ↓
                    Game State → Players (WebSocket)
                            ↓
                    Turn Timer Started (15 seconds per turn, 4-5 minutes total)
                            ↓
                    Game Started
```

### 6.2 Player Action Flow
```
Player Action → Frontend → Game Engine Service
                            ↓
                    Action Validated
                            (Move, Aim, Fire, Weapon Selection)
                            ↓
                    Movement Processed (if applicable)
                            ↓
                    Game State Updated
                            ↓
                    Physics Calculations (Matter.js, arena-specific gravity)
                            ↓
                    Damage Calculated (based on accuracy, weapon properties)
                            ↓
                    Score Calculated (accuracy, back-to-back hits, repositioning saves)
                            ↓
                    Game State → Redis Cache
                            ↓
                    Game State → All Players (WebSocket)
                            ↓
                    Win Condition Checked
                            (HP = 0 = instant loss, or player with more HP at match end)
                            ↓
                    Draw Condition Checked
                            (same HP AND same score = draw)
                            ↓
                    Game Continues or Ends
```

### 6.3 Turn Management Flow
```
Current Turn → Game Engine Service
                            ↓
                    Turn Timer Started (15 seconds)
                            ↓
                    Player Action Received
                            (Move, Aim, Fire, Weapon Selection)
                            ↓
                    Action Processed
                            ↓
                    Movement Count Updated (if moved)
                            ↓
                    Game State Updated
                            ↓
                    Turn Switched
                            ↓
                    Next Player Notified
                            ↓
                    Turn Countdown Started
                            ↓
                    If 10 Turns Completed OR Timer Expired → Match End
```

### 6.4 Movement Flow
```
Player Moves → Frontend → Game Engine Service
                            ↓
                    Movement Validated
                            (4 moves total per game, left/right only, arena boundaries)
                            ↓
                    Movement Processed
                            ↓
                    Movement Count Decremented
                            ↓
                    Game State Updated
                            ↓
                    Movement → All Players (WebSocket)
                            ↓
                    If Enemy Shot Misses Due to Move → Score Awarded
```

---

## 7. Post-Match Flow

### 7.1 Match End Flow
```
Match End → Game Engine Service
                ↓
        Winner Determined
                ↓
        Match Results Calculated
                ↓
        Match Data → MongoDB
                ↓
        Profile Service (Score and Rank Update)
                ↓
        Leaderboard Service (Ranking Update)
                ↓
        Players Notified
                ↓
        Match Replay Generated
```

### 7.2 Score and Rank Update Flow
```
Match Results → Game Engine Service → Profile Service
                                        ↓
                                Score Calculated
                                        (based on match performance, accuracy, etc.)
                                        ↓
                                Global Score Updated
                                        ↓
                                Rank Tier Calculated
                                        (based on score ranges, like Valorant)
                                        ↓
                                Rank Change Calculated
                                        (based on match score, formula to be determined)
                                        ↓
                                Profile Updated (MongoDB)
                                        ↓
                                Player Notified
```

### 7.3 Leaderboard Update Flow
```
Match Results → Game Engine Service → Leaderboard Service
                                        ↓
                                Ranking Calculated
                                        (global score determines rankings)
                                        ↓
                                Rank Tier Updated
                                        (score ranges determine rank tiers)
                                        ↓
                                Leaderboard Updated (MongoDB)
                                        (with filtering support: region, hero type, winning percentage, weapons)
                                        ↓
                                Rankings Updated
                                        ↓
                                Players Notified
```

---

## 8. Data Flow Patterns

### 8.1 Request-Response Pattern
- **Used for:** REST API calls
- **Flow:** Frontend → Backend → Database → Backend → Frontend
- **Examples:** Authentication, Profile updates, Leaderboard retrieval

### 8.2 Event-Driven Pattern
- **Used for:** Real-time game events
- **Flow:** Frontend → Backend → Redis Pub/Sub → Backend → Frontend
- **Examples:** Matchmaking, Game state updates, Player actions

### 8.3 Cache-Aside Pattern
- **Used for:** Frequently accessed data
- **Flow:** Request → Cache Check → Database (if miss) → Cache Update → Response
- **Examples:** User profiles, Leaderboard data, Game state

---

## 9. Data Flow Security

### 9.1 Authentication Flow Security
- **JWT Token Validation** at API gateway and service level
- **Password Hashing** using BCrypt
- **HTTPS/WSS** for all communications
- **Token Expiration** and refresh mechanisms

### 9.2 Data Flow Validation
- **Input Validation** at all entry points
- **Output Encoding** to prevent XSS
- **SQL Injection Prevention** (MongoDB NoSQL injection prevention)
- **Rate Limiting** to prevent abuse

---

## 10. Related Documentation

- [System Architecture](./02-SYSTEM_ARCHITECTURE.md) - System architecture overview
- [Component Design](./03-COMPONENT_DESIGN.md) - Component specifications
- [Communication Patterns](./05-COMMUNICATION_PATTERNS.md) - Communication patterns
- [Database Design](./06-DATABASE_DESIGN.md) - Database schema

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

