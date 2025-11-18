# Sequence Diagrams - Complete Index

**Last Updated:** 2024
**Total Sequence Diagrams:** 25

---

## Overview

This directory contains all sequence diagrams for the Battle Arena project. Sequence diagrams document service-to-service interactions, data flows, and user flows across the microservices architecture.

---

## Complete Sequence Diagrams List

### Authentication & Session Management (2 diagrams)

1. **`authentication-flow.puml`**
   - **Use Cases:** 2.2.1 (Registration), 2.2.2 (Login), US-003 (Logout)
   - **Services:** Auth Service, MongoDB
   - **Description:** User registration, login, logout flows with JWT token management
   - **Reference:** [HLD Data Flow - Section 1](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#1-authentication-flow)

2. **`session-timeout-flow.puml`**
   - **Use Case:** 2.2.20 (Session Timeout)
   - **User Story:** US-061
   - **Services:** Auth Service, Frontend
   - **Description:** JWT token expiration handling and user re-authentication
   - **Reference:** [HLD Data Flow - Section 1.6](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#16-session-timeout-flow)

---

### Hero & Matchmaking (5 diagrams)

3. **`hero-selection-flow.puml`**
   - **Use Case:** 2.2.3 (Hero Selection)
   - **User Stories:** US-009, US-010, US-011
   - **Services:** Matchmaking Service (Hero Selector component)
   - **Description:** Multiple hero selection before matchmaking with priority ordering
   - **Reference:** [HLD Data Flow - Section 2](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#2-hero-selection-flow)

4. **`matchmaking-flow.puml`**
   - **Use Case:** 2.2.4 (Matchmaking Flow)
   - **User Stories:** US-012, US-014, US-016, US-017
   - **Services:** Matchmaking Service, Profile Service, Game Engine Service
   - **Description:** Global score/rank-based matchmaking with hero compatibility
   - **Reference:** [HLD Data Flow - Section 3](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#3-matchmaking-flow)

5. **`match-acceptance-timeout-flow.puml`**
   - **Use Case:** 2.2.14 (Match Acceptance Timeout)
   - **User Story:** US-051
   - **Services:** Matchmaking Service, Lobby Manager
   - **Description:** 30-second timeout handling for match acceptance
   - **Reference:** [HLD Data Flow - Section 3.3](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#33-match-acceptance-timeout-flow)

6. **`match-rejection-flow.puml`**
   - **Use Case:** 2.2.15 (Match Rejection Flow)
   - **User Story:** US-052
   - **Services:** Matchmaking Service, Lobby Manager, Queue Manager
   - **Description:** Match rejection handling and queue return
   - **Reference:** [HLD Data Flow - Section 3.4](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#34-match-rejection-flow)

7. **`matchmaking-timeout-flow.puml`**
   - **Use Case:** 2.2.19 (Matchmaking Timeout Flow)
   - **User Story:** US-053
   - **Services:** Matchmaking Service, Queue Manager
   - **Description:** Extended timeout handling when no match is found
   - **Reference:** [HLD Data Flow - Section 3.5](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#35-matchmaking-timeout-flow)

8. **`queue-cancellation-flow.puml`**
   - **User Story:** US-013 (Leave Queue)
   - **Services:** Matchmaking Service, Queue Manager
   - **Description:** Player leaving matchmaking queue
   - **Reference:** [HLD Data Flow - Section 3](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#3-matchmaking-flow)

---

### Arena & Weapon Selection (4 diagrams)

9. **`arena-selection-flow.puml`**
   - **Use Case:** 2.2.5 (Arena Selection Flow)
   - **User Stories:** US-018, US-019, US-020
   - **Services:** Matchmaking Service (Arena Selector component)
   - **Description:** Voting/elimination arena selection system
   - **Reference:** [HLD Data Flow - Section 4](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#4-arena-selection-flow)

10. **`arena-selection-timeout-flow.puml`**
    - **Use Case:** 2.2.17 (Arena Selection Timeout Flow)
    - **User Story:** US-054
    - **Services:** Matchmaking Service, Lobby Manager
    - **Description:** Arena selection timeout/disconnection handling (5min TTL)
    - **Reference:** [HLD Data Flow - Section 4.2](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#42-arena-selection-timeoutdisconnection-flow)

11. **`weapon-selection-flow.puml`**
    - **Use Case:** 2.2.6 (Weapon Selection Flow)
    - **User Stories:** US-021, US-022, US-023, US-024
    - **Services:** Matchmaking Service (Weapon Selector component)
    - **Description:** Alternating weapon selection with 30-second timer
    - **Reference:** [HLD Data Flow - Section 5](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#5-weapon-selection-flow)

12. **`weapon-selection-timeout-flow.puml`**
    - **Use Case:** 2.2.18 (Weapon Selection Timeout Flow)
    - **User Story:** US-055
    - **Services:** Matchmaking Service, Lobby Manager
    - **Description:** Weapon selection timeout/disconnection handling (30s total, 2min TTL)
    - **Reference:** [HLD Data Flow - Section 5.2](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#52-weapon-selection-timeoutdisconnection-flow)

---

### Gameplay & Match Execution (4 diagrams)

13. **`gameplay-flow.puml`**
    - **Use Case:** 2.2.7 (Gameplay Flow)
    - **User Stories:** US-025, US-027, US-028, US-029, US-030, US-031, US-033, US-034
    - **Services:** Game Engine Service, Physics Engine, Health System, Scoring System
    - **Description:** Turn-based gameplay with physics calculations and scoring
    - **Reference:** [HLD Data Flow - Section 6](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#6-gameplay-flow)

14. **`movement-flow.puml`**
    - **User Story:** US-026
    - **Services:** Game Engine Service (Movement Manager)
    - **Description:** Hero movement system (4 moves per game, repositioning save scoring)
    - **Reference:** [HLD Data Flow - Section 6.5](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#65-movement-flow)

15. **`turn-timeout-flow.puml`**
    - **Use Case:** 2.2.16 (Turn Timeout Flow)
    - **User Story:** US-058
    - **Services:** Game Engine Service (Turn Manager)
    - **Description:** 15-second turn timeout handling with automatic turn skip
    - **Reference:** [HLD Data Flow - Section 6.4](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#64-turn-timeout-flow)

16. **`disconnection-handling-flow.puml`**
    - **Use Case:** 2.2.8 (Disconnection Handling Flow)
    - **User Stories:** US-044, US-045, US-046
    - **Services:** Game Engine Service, Matchmaking Service, Profile Service
    - **Description:** Player disconnection with 60-second rejoin window and penalties
    - **Reference:** [HLD Data Flow - Section 10](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#10-disconnection-handling-flow)

---

### Post-Match Processing (2 diagrams)

17. **`post-match-flow.puml`**
    - **Use Case:** 2.2.7 (Gameplay Flow - Post-Match Steps)
    - **User Stories:** US-032, US-038
    - **Services:** Game Engine Service, Profile Service, Leaderboard Service
    - **Description:** Backend post-match processing (score/rank updates, leaderboard updates)
    - **Reference:** [HLD Data Flow - Section 7](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#7-post-match-flow)

18. **`post-match-result-screen-flow.puml`**
    - **Use Case:** 2.2.22 (Post-Match Result Screen Flow)
    - **User Stories:** US-057, US-065, US-067, US-068
    - **Services:** Game Engine Service, Profile Service, Frontend
    - **Description:** Frontend post-match result screen with rank changes and navigation
    - **Reference:** [HLD Data Flow - Section 7.4](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#74-post-match-result-screen-flow)

---

### Profile Management (3 diagrams)

19. **`profile-view-flow.puml`**
    - **Use Case:** 2.2.9 (Profile View Flow)
    - **User Stories:** US-005, US-007, US-008
    - **Services:** Profile Service, Auth Service
    - **Description:** View user profile with statistics and progression
    - **Reference:** [HLD Data Flow - Section 8](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#8-profile-management-flow)

20. **`profile-update-flow.puml`**
    - **Use Case:** 2.2.10 (Profile Update Flow)
    - **User Story:** US-006
    - **Services:** Profile Service, Auth Service
    - **Description:** Update user profile (display name, avatar) with authorization
    - **Reference:** [HLD Data Flow - Section 8](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#8-profile-management-flow)

21. **`match-history-view-flow.puml`**
    - **Use Case:** 2.2.12 (Match History View Flow)
    - **User Story:** US-047
    - **Services:** Profile Service, Game Engine Service
    - **Description:** View match history with detailed match data
    - **Reference:** [HLD Data Flow - Section 8](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#8-profile-management-flow)

---

### Leaderboard & Dashboard (2 diagrams)

22. **`leaderboard-view-flow.puml`**
    - **Use Case:** 2.2.11 (Leaderboard View Flow)
    - **User Stories:** US-039, US-040, US-041, US-042
    - **Services:** Leaderboard Service, Profile Service
    - **Description:** View leaderboard with filtering and player statistics
    - **Reference:** [HLD Data Flow - Section 9](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#9-leaderboard-flow)

23. **`dashboard-flow.puml`**
    - **Use Case:** 2.2.13 (Dashboard Flow)
    - **User Story:** US-048
    - **Services:** Auth Service, Profile Service, Leaderboard Service, Matchmaking Service
    - **Description:** Dashboard data aggregation from multiple services
    - **Reference:** [HLD Data Flow - Section 11](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#11-dashboard-flow)

---

### Error Handling (2 diagrams)

24. **`network-error-handling-flow.puml`**
    - **Use Case:** 2.2.21 (Network Error Handling Flow)
    - **User Story:** US-062
    - **Services:** Frontend, Backend Services, WebSocket Connection
    - **Description:** Network error detection, recovery options, and reconnection handling
    - **Reference:** [HLD Data Flow - Section 12](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md#12-network-error-handling-flow)

25. **`database-access-flow.puml`**
    - **Purpose:** Technical pattern documentation
    - **Services:** Generic pattern (Repository pattern)
    - **Description:** Database access pattern using Repository pattern
    - **Reference:** [HLD Data Flow](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md)

---

## Diagram Categories

### By Service Involvement

**Single-Service Diagrams:**

- Authentication Flow (Auth Service)
- Hero Selection (Matchmaking Service component)
- Arena Selection (Matchmaking Service)
- Weapon Selection (Matchmaking Service)
- Movement (Game Engine Service)
- Queue Cancellation (Matchmaking Service)
- Database Access (Generic pattern)

**Multi-Service Diagrams:**

- Matchmaking Flow (Matchmaking + Profile + Game Engine)
- Post-Match Flow (Game Engine + Profile + Leaderboard)
- Leaderboard View (Leaderboard + Profile)
- Disconnection Handling (Game Engine + Matchmaking + Profile)
- Profile View (Profile + Auth)
- Profile Update (Profile + Auth)
- Match History View (Profile + Game Engine)
- Dashboard (Auth + Profile + Leaderboard + Matchmaking)

### By Priority

**Core Flows (Primary User Journeys):**

- Authentication, Hero Selection, Matchmaking, Arena Selection, Weapon Selection, Gameplay, Post-Match

**Supporting Flows:**

- Movement, Profile Management, Leaderboard, Dashboard, Match History

**Error/Edge Case Handling:**

- All timeout flows, Disconnection Handling, Network Error Handling, Session Timeout

---

## Use Case Coverage

| Use Case ID | Use Case Name            | Sequence Diagram                     | Status |
| ----------- | ------------------------ | ------------------------------------ | ------ |
| 2.2.1       | User Registration        | `authentication-flow.puml`           | ✅     |
| 2.2.2       | User Login               | `authentication-flow.puml`           | ✅     |
| 2.2.3       | Hero Selection           | `hero-selection-flow.puml`           | ✅     |
| 2.2.4       | Matchmaking              | `matchmaking-flow.puml`              | ✅     |
| 2.2.5       | Arena Selection          | `arena-selection-flow.puml`          | ✅     |
| 2.2.6       | Weapon Selection         | `weapon-selection-flow.puml`         | ✅     |
| 2.2.7       | Gameplay                 | `gameplay-flow.puml`                 | ✅     |
| 2.2.8       | Disconnection Handling   | `disconnection-handling-flow.puml`   | ✅     |
| 2.2.9       | Profile View             | `profile-view-flow.puml`             | ✅     |
| 2.2.10      | Profile Update           | `profile-update-flow.puml`           | ✅     |
| 2.2.11      | Leaderboard View         | `leaderboard-view-flow.puml`         | ✅     |
| 2.2.12      | Match History View       | `match-history-view-flow.puml`       | ✅     |
| 2.2.13      | Dashboard                | `dashboard-flow.puml`                | ✅     |
| 2.2.14      | Match Acceptance Timeout | `match-acceptance-timeout-flow.puml` | ✅     |
| 2.2.15      | Match Rejection          | `match-rejection-flow.puml`          | ✅     |
| 2.2.16      | Turn Timeout             | `turn-timeout-flow.puml`             | ✅     |
| 2.2.17      | Arena Selection Timeout  | `arena-selection-timeout-flow.puml`  | ✅     |
| 2.2.18      | Weapon Selection Timeout | `weapon-selection-timeout-flow.puml` | ✅     |
| 2.2.19      | Matchmaking Timeout      | `matchmaking-timeout-flow.puml`      | ✅     |
| 2.2.20      | Session Timeout          | `session-timeout-flow.puml`          | ✅     |
| 2.2.21      | Network Error Handling   | `network-error-handling-flow.puml`   | ✅     |
| 2.2.22      | Post-Match Result Screen | `post-match-result-screen-flow.puml` | ✅     |

**Coverage:** ✅ **22/22 Use Cases (100%)**

---

## Related Documentation

### Primary References

- **[HLD Data Flow](../../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/04-DATA_FLOW.md)** - Complete data flow documentation with all sequence diagram references
- **[Use Case Service Mapping](../../../05-PROJECT_MANAGEMENT/USE_CASE_SERVICE_MAPPING.md)** - Service involvement mapping
- **[Project Scope](../../../00-PROJECT_DEFINITION/PROJECT_SCOPE.md)** - All use cases and user stories

### Supporting Documentation

- **[Sequence Diagram Verification](../../../05-PROJECT_MANAGEMENT/SEQUENCE_DIAGRAM_VERIFICATION.md)** - Coverage verification
- **[Missing Sequence Diagrams Analysis](../../../05-PROJECT_MANAGEMENT/MISSING_SEQUENCE_DIAGRAMS_ANALYSIS.md)** - Analysis document
- **[Comprehensive Use Case Verification](../../../05-PROJECT_MANAGEMENT/COMPREHENSIVE_USE_CASE_VERIFICATION.md)** - Use case verification

---

## How to Use Sequence Diagrams

### For Developers

1. **Understanding Service Interactions:** Use sequence diagrams to understand how services communicate
2. **API Design:** Reference diagrams when designing service APIs
3. **Integration Testing:** Use diagrams to plan integration tests
4. **Debugging:** Reference diagrams when troubleshooting service interactions

### For Architects

1. **Service Dependencies:** Identify service dependencies from diagrams
2. **Epic Planning:** Use diagrams to plan epic boundaries
3. **Performance Analysis:** Identify potential bottlenecks in service interactions
4. **Scalability Planning:** Understand data flow for scaling decisions

### For Testers

1. **Test Case Design:** Use diagrams to design test scenarios
2. **Integration Test Planning:** Plan integration tests based on service interactions
3. **Error Scenario Testing:** Reference timeout and error handling diagrams

---

## Maintenance

### When to Update

- When service APIs change
- When new services are added
- When service interactions change
- When error handling flows change
- When timeout values change

### Update Process

1. Update `.puml` file
2. Update this README if diagram purpose changes
3. Update HLD Data Flow document references
4. Update Use Case Service Mapping if services change
5. Commit changes with descriptive message

---

**Document Control:**

- **Author:** System Architecture Team
- **Last Updated:** 2024
- **Status:** ✅ Complete - All 25 sequence diagrams documented
