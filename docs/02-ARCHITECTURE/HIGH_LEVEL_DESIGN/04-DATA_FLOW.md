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

**📊 Sequence Diagrams:**

- [`authentication-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/authentication-flow.puml) - Registration, login, logout
- [`session-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/session-timeout-flow.puml) - Session expiration handling

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

### 1.4 Google OAuth Login Flow

```
User → Frontend → Google OAuth → Frontend
                ↓
            Authorization Code
                ↓
            Frontend → Auth Service
                ↓
            Exchange Code for Token
                ↓
            Validate Token & Get User Info
                ↓
            Find or Create User
                ↓
            Generate JWT Token
                ↓
            JWT Token → Frontend Storage
                ↓
            User Logged In
```

### 1.5 User Logout Flow

```
User → Frontend: Click "Logout"
                ↓
            Frontend: Clear JWT token from storage
                ↓
            Frontend: Clear user data from memory
                ↓
        (Optional) Frontend → Auth Service: POST /api/auth/logout
                            ↓
                        Token Validated
                            ↓
                        Token Invalidated (MongoDB)
                            ↓
                        (Optional) Token Added to Blacklist
                            ↓
                        Logout Confirmed
                ↓
            Frontend: Clear all cached data
                ↓
            Frontend: Clear HTTP interceptors
                ↓
            Frontend: Clear WebSocket connections
                ↓
            Frontend: Redirect to login page
                ↓
            User Logged Out
```

### 1.6 Session Timeout Flow

**📊 Sequence Diagram:** [`session-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/session-timeout-flow.puml)

```
User Makes Request → JWT Token Validated
                            ↓
                    Token Expired Detected
                            ↓
                    System Returns 401 Unauthorized
                            ↓
                    Frontend Detects Authentication Failure
                            ↓
                    Frontend Clears Stored Tokens
                            ↓
                    Frontend Redirects to Login Page
                            ↓
                    Session Expired Message Displayed
                            ↓
                    User Re-authenticates
```

---

## 2. Hero Selection Flow

**📊 Sequence Diagram:** [`hero-selection-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/hero-selection-flow.puml)

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

**📊 Sequence Diagram:** [`matchmaking-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml)

**Services Involved:** Matchmaking Service, Profile Service (for global score/rank retrieval), Game Engine Service

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

### 3.3 Match Acceptance Timeout Flow

**📊 Sequence Diagram:** [`match-acceptance-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/match-acceptance-timeout-flow.puml)

```
Match Found → 30-Second Timer Started
                            ↓
                    Player Does Not Accept Within 30s
                            ↓
                    System Automatically Rejects Match
                            ↓
                    Lobby Removed (Redis)
                            ↓
                    Players Returned to Queue
                            ↓
                    Timeout Logged for Analytics
```

### 3.4 Match Rejection Flow

**📊 Sequence Diagram:** [`match-rejection-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/match-rejection-flow.puml)

```
Player Rejects Match → Matchmaking Service
                            ↓
                    Lobby Removed (Redis)
                            ↓
                    Players Returned to Queue
                            ↓
                    Matchmaking Continues
                            ↓
                    Rejection Logged for Analytics
```

### 3.5 Matchmaking Timeout Flow

**📊 Sequence Diagram:** [`matchmaking-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/matchmaking-timeout-flow.puml)

```
Player Joins Queue → Extended Timeout Timer Started
                            ↓
                    System Searches for Match
                            ↓
                    No Match Found After Extended Timeout
                            ↓
                    System Notifies Player
                            ↓
                    Meaningful Message Displayed
                            ↓
                    Player Removed from Queue
                            ↓
                    Player Can Try Again Later
```

## 4. Arena Selection Flow

**📊 Sequence Diagrams:**

- [`arena-selection-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/arena-selection-flow.puml) - Normal arena selection flow
- [`arena-selection-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/arena-selection-timeout-flow.puml) - Timeout/disconnection handling

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

### 4.2 Arena Selection Timeout/Disconnection Flow

**📊 Sequence Diagram:** [`arena-selection-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/arena-selection-timeout-flow.puml)

```
Arena Selection Started → 5-Minute TTL Timer Started
                            ↓
                    Timeout OR Player Disconnects
                            ↓
                    System Cancels Match
                            ↓
                    Lobby Removed (Redis)
                            ↓
                    Players Returned to Queue
                            ↓
                    Timeout/Disconnection Logged
```

## 5. Weapon Selection Flow

**📊 Sequence Diagrams:**

- [`weapon-selection-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/weapon-selection-flow.puml) - Normal weapon selection flow
- [`weapon-selection-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/weapon-selection-timeout-flow.puml) - Timeout/disconnection handling

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

### 5.2 Weapon Selection Timeout/Disconnection Flow

**📊 Sequence Diagram:** [`weapon-selection-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/weapon-selection-timeout-flow.puml)

```
Weapon Selection Started → 30s Total Timer + 2min TTL Started
                            ↓
                    If 30s Total Expired → Random Weapons Selected
                            ↓
                    If 2min TTL Expired OR Player Disconnects
                            ↓
                    System Cancels Match
                            ↓
                    Lobby Removed (Redis)
                            ↓
                    Players Returned to Queue
                            ↓
                    Timeout/Disconnection Logged
```

---

## 6. Gameplay Flow

**📊 Sequence Diagrams:**

- [`gameplay-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/gameplay-flow.puml) - Main gameplay flow
- [`movement-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/movement-flow.puml) - Movement system
- [`turn-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/turn-timeout-flow.puml) - Turn timeout handling
- [`post-match-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Post-match processing (see section 7)

**Services Involved:** Game Engine Service (primary), Profile Service, Leaderboard Service (post-match)

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

### 6.4 Turn Timeout Flow

**📊 Sequence Diagram:** [`turn-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/turn-timeout-flow.puml)

```
Player's Turn Starts → 15-Second Timer Started
                            ↓
                    Player Does Not Act Within 15s
                            ↓
                    System Automatically Skips Turn
                            ↓
                    Default Action Selected (Random Weapon if Not Selected)
                            ↓
                    Turn Switched to Opponent
                            ↓
                    Both Players Notified of Timeout
                            ↓
                    Timeout Logged for Analytics
```

### 6.5 Movement Flow

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

**📊 Sequence Diagrams:**

- [`post-match-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Backend post-match processing (score/rank updates)
- [`post-match-result-screen-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/post-match-result-screen-flow.puml) - Frontend result screen display

**Services Involved:** Game Engine Service (initiates), Profile Service (score/rank updates), Leaderboard Service (ranking updates)

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

### 7.4 Post-Match Result Screen Flow

**📊 Sequence Diagram:** [`post-match-result-screen-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/post-match-result-screen-flow.puml)

```
Match Ends → System Calculates Final Scores and Rank Changes
                            ↓
                    Match Results Sent to Frontend
                            ↓
                    Frontend Displays Post-Match Result Screen:
                            - Match Summary (Winner, Final Scores, HP)
                            - Rank Tier Changes (Before/After)
                            - Score Changes (Points Gained/Lost)
                            - Navigation Options (Play Again, Dashboard, Profile)
                            ↓
                    User Can Navigate to Next Action or View Detailed Results
```

---

## 8. Profile Management Flow

**📊 Sequence Diagrams:**

- [`profile-view-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/profile-view-flow.puml) - View profile
- [`profile-update-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/profile-update-flow.puml) - Update profile
- [`match-history-view-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/match-history-view-flow.puml) - View match history

**Services Involved:** Profile Service, Auth Service (JWT validation), Game Engine Service (match details)

### 8.1 Profile View Flow

```
User → Frontend → Auth Service (JWT Validation)
                            ↓
                    Profile Service
                            ↓
                    Profile Data Retrieved (MongoDB)
                            ↓
                    Statistics Calculated (winRate, etc.)
                            ↓
                    Profile Data → Frontend
                            ↓
                    Profile Displayed
```

### 8.2 Profile Update Flow

```
User → Frontend → Auth Service (JWT Validation)
                            ↓
                    Authorization Check
                            (user can only update own profile)
                            ↓
                    Profile Service
                            ↓
                    Profile Updated (MongoDB)
                            ↓
                    Updated Profile → Frontend
                            ↓
                    Profile Updated
```

### 8.3 Match History View Flow

```
User → Frontend → Profile Service
                            ↓
                    Match History Summary Retrieved
                            (matchIds, results, timestamps)
                            ↓
                    Game Engine Service (for each match)
                            ↓
                    Match Details Retrieved
                            (gameplay, turns, scores, weapons)
                            ↓
                    Match History → Frontend
                            ↓
                    Match History Displayed
```

---

## 9. Leaderboard Flow

**📊 Sequence Diagram:** [`leaderboard-view-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/leaderboard-view-flow.puml)

**Services Involved:** Leaderboard Service (primary), Profile Service (player statistics)

### 9.1 Leaderboard View Flow

```
User → Frontend → Leaderboard Service
                            ↓
                    Leaderboard Entries Retrieved (MongoDB)
                            (with filters: region, heroType, winRate, weapons)
                            ↓
                    Profile Service (batch request)
                            ↓
                    Player Statistics Retrieved
                            (wins, losses, winRate, heroUsage, weaponUsage)
                            ↓
                    Data Aggregated
                            ↓
                    Leaderboard with Statistics → Frontend
                            ↓
                    Leaderboard Displayed
```

---

## 10. Disconnection Handling Flow

**📊 Sequence Diagram:** [`disconnection-handling-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/disconnection-handling-flow.puml)

**Services Involved:** Game Engine Service (detection), Matchmaking Service (rejoin), Profile Service (penalties)

### 10.1 Disconnection Detection and Rejoin Flow

```
Player Disconnects → Game Engine Service
                            ↓
                    Rejoin Token Generated
                            ↓
                    Rejoin State Stored (Redis, 60s expiration)
                            ↓
                    Opponent Notified
                            ↓
                    Player Reconnects (within 60s)
                            ↓
                    Rejoin Token Validated
                            ↓
                    Match State Restored
                            ↓
                    Player Rejoined to Match
```

### 10.2 Disconnection Penalty Flow

```
Rejoin Timeout (60s) → Game Engine Service
                            ↓
                    Profile Service
                            ↓
                    Disconnection Penalty Applied
                            (score reduction, rank impact)
                            ↓
                    Profile Updated (MongoDB)
                            ↓
                    Match Forfeited
                            ↓
                    Opponent Notified (winner)
```

---

## 11. Dashboard Flow

**📊 Sequence Diagram:** [`dashboard-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/dashboard-flow.puml)

## 12. Network Error Handling Flow

**📊 Sequence Diagram:** [`network-error-handling-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/network-error-handling-flow.puml)

**Services Involved:** Frontend, Backend Services, WebSocket Connection

### 12.1 Network Error Detection

```
Network Error Occurs → System Detects Error
                            (Connection Lost, Timeout, Server Error)
                            ↓
                    Error Classified by Type and Severity
                            ↓
                    Clear Error Message Displayed to User
                            ↓
                    Recovery Options Provided
                            (Retry, Reconnect, Exit Match)
```

### 12.2 Error Recovery

```
If In Match:
    System Attempts to Reconnect
                            ↓
    If Reconnection Successful → Resume Normal Operation
                            ↓
    If Reconnection Failed → Handle as Disconnection
                            (See disconnection-handling-flow.puml)

If Not In Match:
    User Can Retry Request
                            ↓
    If Retry Successful → Clear Error Message
                            ↓
    If Retry Failed → Show Error Again
                            ↓
    After Max Retries → Disable Retry Option
```

**Services Involved:** Multiple (Auth Service, Profile Service, Leaderboard Service, Matchmaking Service)

### 11.1 Dashboard Data Aggregation Flow

```
User → Frontend → Auth Service (JWT Validation)
                            ↓
                    Parallel Data Fetching:
                            ↓
        Profile Service → Profile Summary
                            (globalScore, rankTier, wins, losses)
                            ↓
        Leaderboard Service → Rank Position
                            (rank, totalPlayers, percentile)
                            ↓
        Matchmaking Service → Queue Status
                            (inQueue, position, estimatedWaitTime)
                            ↓
                    Data Aggregated
                            ↓
                    Dashboard Displayed
```

---

## 12. Data Flow Patterns

### 12.1 Request-Response Pattern

- **Used for:** REST API calls
- **Flow:** Frontend → Backend → Database → Backend → Frontend
- **Examples:** Authentication, Profile updates, Leaderboard retrieval

### 12.2 Event-Driven Pattern

- **Used for:** Real-time game events
- **Flow:** Frontend → Backend → Redis Pub/Sub → Backend → Frontend
- **Examples:** Matchmaking, Game state updates, Player actions

### 12.3 Cache-Aside Pattern

- **Used for:** Frequently accessed data
- **Flow:** Request → Cache Check → Database (if miss) → Cache Update → Response
- **Examples:** User profiles, Leaderboard data, Game state

---

## 13. Data Flow Security

### 13.1 Authentication Flow Security

- **JWT Token Validation** at API gateway and service level
- **Password Hashing** using BCrypt
- **HTTPS/WSS** for all communications
- **Token Expiration** and refresh mechanisms

### 13.2 Data Flow Validation

- **Input Validation** at all entry points
- **Output Encoding** to prevent XSS
- **SQL Injection Prevention** (MongoDB NoSQL injection prevention)
- **Rate Limiting** to prevent abuse

---

## 14. Related Documentation

### Sequence Diagrams Reference

All sequence diagrams are located in [`docs/03-DIAGRAMS/sequence-diagrams/`](../../../03-DIAGRAMS/sequence-diagrams/):

1. **Authentication:** [`authentication-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/authentication-flow.puml)
2. **Session Timeout:** [`session-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/session-timeout-flow.puml)
3. **Hero Selection:** [`hero-selection-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/hero-selection-flow.puml)
4. **Matchmaking:** [`matchmaking-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml)
5. **Match Acceptance Timeout:** [`match-acceptance-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/match-acceptance-timeout-flow.puml)
6. **Match Rejection:** [`match-rejection-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/match-rejection-flow.puml)
7. **Matchmaking Timeout:** [`matchmaking-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/matchmaking-timeout-flow.puml)
8. **Arena Selection:** [`arena-selection-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/arena-selection-flow.puml)
9. **Arena Selection Timeout:** [`arena-selection-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/arena-selection-timeout-flow.puml)
10. **Weapon Selection:** [`weapon-selection-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/weapon-selection-flow.puml)
11. **Weapon Selection Timeout:** [`weapon-selection-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/weapon-selection-timeout-flow.puml)
12. **Gameplay:** [`gameplay-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/gameplay-flow.puml)
13. **Movement:** [`movement-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/movement-flow.puml)
14. **Turn Timeout:** [`turn-timeout-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/turn-timeout-flow.puml)
15. **Post-Match:** [`post-match-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/post-match-flow.puml)
16. **Post-Match Result Screen:** [`post-match-result-screen-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/post-match-result-screen-flow.puml)
17. **Profile View:** [`profile-view-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/profile-view-flow.puml)
18. **Profile Update:** [`profile-update-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/profile-update-flow.puml)
19. **Match History:** [`match-history-view-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/match-history-view-flow.puml)
20. **Leaderboard View:** [`leaderboard-view-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/leaderboard-view-flow.puml)
21. **Disconnection Handling:** [`disconnection-handling-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/disconnection-handling-flow.puml)
22. **Dashboard:** [`dashboard-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/dashboard-flow.puml)
23. **Network Error Handling:** [`network-error-handling-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/network-error-handling-flow.puml)
24. **Database Access:** [`database-access-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/database-access-flow.puml)
25. **Queue Cancellation:** [`queue-cancellation-flow.puml`](../../../03-DIAGRAMS/sequence-diagrams/queue-cancellation-flow.puml)

### Other Documentation

- [System Architecture](./02-SYSTEM_ARCHITECTURE.md) - System architecture overview
- [Component Design](./03-COMPONENT_DESIGN.md) - Component specifications
- [Communication Patterns](./05-COMMUNICATION_PATTERNS.md) - Communication patterns
- [Database Design](./06-DATABASE_DESIGN.md) - Database schema

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**
