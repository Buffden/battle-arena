# 📊 Diagrams Directory

This directory contains all UML diagrams for the Battle Arena - Multiplayer Artillery Battle Game project documentation.

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**All diagrams MUST strictly adhere to the following principles:**

1. **REUSABILITY** - Design components for maximum reusability
2. **GOOD CODE PRACTICES** - Follow SOLID principles and best practices
3. **CLEAN CODE** - Clear, readable diagrams
4. **CLEAN ARCHITECTURE** - Show proper separation of concerns
5. **SECURE PROGRAMMING** - Highlight security considerations

---

## 📁 Directory Structure

```
03-DIAGRAMS/
├── architecture/              # System architecture diagrams
│   ├── system-architecture.puml
│   ├── component-diagram.puml
│   ├── container-diagram.puml
│   └── deployment-diagram.puml
├── class-diagrams/            # Class diagrams for each service
│   ├── auth-service.puml
│   ├── profile-service.puml
│   ├── leaderboard-service.puml
│   ├── matchmaking-service.puml
│   ├── game-engine-service.puml
│   ├── frontend-components.puml
│   └── database-schema.puml
├── sequence-diagrams/         # Sequence diagrams for key flows
│   ├── authentication-flow.puml
│   ├── hero-selection-flow.puml
│   ├── matchmaking-flow.puml
│   ├── arena-selection-flow.puml
│   ├── weapon-selection-flow.puml
│   ├── gameplay-flow.puml
│   ├── movement-flow.puml
│   ├── post-match-flow.puml
│   └── database-access-flow.puml
├── state-diagrams/            # State diagrams for state machines
│   ├── arena-selection-state.puml
│   ├── weapon-selection-state.puml
│   ├── game-state.puml
│   └── turn-state.puml
├── er-diagrams/               # Entity-relationship diagrams
│   └── database-er-diagram.puml
├── exported/                  # Exported PNG files (generated)
│   └── (PNG files)
└── README.md                  # This file
```

---

## 🛠️ Tools Required

### PlantUML (Recommended)

- **Extension:** PlantUML by jebbs
- **Dependencies:** Graphviz
- **Installation:** See [UML_DIAGRAM_SETUP.md](../UML_DIAGRAM_SETUP.md)

### Mermaid (Alternative)

- **Extension:** Mermaid Preview by vstirbu
- **Installation:** See [UML_DIAGRAM_SETUP.md](../UML_DIAGRAM_SETUP.md)

---

## 📝 Diagram Files

### Architecture Diagrams

- **system-architecture.puml** - High-level system architecture
- **component-diagram.puml** - Component diagram
- **container-diagram.puml** - Container diagram
- **deployment-diagram.puml** - Deployment diagram

### Class Diagrams

- **auth-service.puml** ✅ - Auth Service class diagram
- **profile-service.puml** ✅ - Profile Service class diagram
- **leaderboard-service.puml** ✅ - Leaderboard Service class diagram
- **matchmaking-service.puml** ✅ - Matchmaking Service class diagram (includes hero selection, arena selection, weapon selection)
- **game-engine-service.puml** ✅ - Game Engine Service class diagram (includes movement, scoring, physics)
- **frontend-components.puml** ✅ - Frontend Components class diagram
- **database-schema.puml** ✅ - Database Schema class diagram (Repository, DAO patterns)

### Sequence Diagrams (25 total)

**Complete Index:** See [Sequence Diagrams README](./sequence-diagrams/README.md) for detailed documentation.

**Core Flows:**

- **authentication-flow.puml** ✅ - User authentication flow (registration, login, logout)
- **hero-selection-flow.puml** ✅ - Hero selection flow
- **matchmaking-flow.puml** ✅ - Matchmaking flow (includes hero selection, global score/rank-based matching)
- **arena-selection-flow.puml** ✅ - Arena selection flow (voting/elimination)
- **weapon-selection-flow.puml** ✅ - Weapon selection flow (alternating selection, 30s timer)
- **gameplay-flow.puml** ✅ - Gameplay flow (includes movement, scoring, physics)
- **movement-flow.puml** ✅ - Movement flow (4 moves per game, repositioning save scoring)
- **post-match-flow.puml** ✅ - Post-match flow (score and rank updates)
- **post-match-result-screen-flow.puml** ✅ - Post-match result screen display

**Profile & Leaderboard:**

- **profile-view-flow.puml** ✅ - Profile view flow
- **profile-update-flow.puml** ✅ - Profile update flow
- **match-history-view-flow.puml** ✅ - Match history view flow
- **leaderboard-view-flow.puml** ✅ - Leaderboard view flow
- **dashboard-flow.puml** ✅ - Dashboard data aggregation flow

**Timeout & Error Handling:**

- **match-acceptance-timeout-flow.puml** ✅ - Match acceptance timeout (30s)
- **match-rejection-flow.puml** ✅ - Match rejection handling
- **matchmaking-timeout-flow.puml** ✅ - Matchmaking timeout handling
- **arena-selection-timeout-flow.puml** ✅ - Arena selection timeout/disconnection
- **weapon-selection-timeout-flow.puml** ✅ - Weapon selection timeout/disconnection
- **turn-timeout-flow.puml** ✅ - Turn timeout handling (15s)
- **session-timeout-flow.puml** ✅ - Session expiration handling
- **network-error-handling-flow.puml** ✅ - Network error recovery

**Supporting Flows:**

- **disconnection-handling-flow.puml** ✅ - Disconnection handling with rejoin window
- **queue-cancellation-flow.puml** ✅ - Leave matchmaking queue
- **database-access-flow.puml** ✅ - Database access flow (Repository pattern)

### State Diagrams

- **arena-selection-state.puml** ✅ - Arena selection state machine
- **weapon-selection-state.puml** ✅ - Weapon selection state machine
- **game-state.puml** ✅ - Game state machine
- **turn-state.puml** ✅ - Turn state machine (15 seconds per turn)

### ER Diagrams

- **database-er-diagram.puml** ✅ - Database entity-relationship diagram (7 entities, 8 relationships)

---

## 🚀 How to Use

### Viewing Diagrams

1. Install PlantUML extension in Cursor/VS Code
2. Install Graphviz (required for PlantUML)
3. Open `.puml` file
4. Press `Alt+D` to preview

### Exporting to PNG

1. Open `.puml` file
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "PlantUML: Export Current Diagram"
4. Select PNG format
5. Save to `exported/` directory

### Using in Documentation

1. Export diagram to PNG
2. Save PNG to `exported/` directory
3. Reference in markdown:
   ```markdown
   ![System Architecture](./diagrams/exported/system-architecture.png)
   ```

---

## 📚 Diagram Guidelines

### Naming Conventions

- Use kebab-case for file names: `auth-service.puml`
- Use descriptive names: `authentication-flow.puml`
- Group related diagrams in subdirectories

### Diagram Standards

- Use consistent colors and styles
- Add notes for complex concepts
- Keep diagrams readable and simple
- Update diagrams when architecture changes

### Version Control

- Commit `.puml` source files to Git
- Commit exported PNG files to Git (via GitHub Actions)
- Keep diagrams in sync with code
- Document diagram changes in commits

---

## 🔄 Maintaining Diagrams

### When to Update

- When architecture changes
- When new services are added
- When API contracts change
- When security requirements change
- When design patterns change

### Update Process

1. Update `.puml` source file
2. Export to PNG (or let GitHub Actions handle it)
3. Update documentation references
4. Commit changes to Git
5. Document changes in commit message

---

## 📖 Additional Resources

- [PlantUML Documentation](https://plantuml.com/)
- [Mermaid Documentation](https://mermaid.js.org/)
- [LLD Documents](../02-ARCHITECTURE/LOW_LEVEL_DESIGN/README.md) - Low-level design documents
- [HLD Documents](../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md) - High-level design documents

---

## ✅ Checklist

### Setup

- [x] Install PlantUML extension
- [x] Install Graphviz
- [x] Create diagrams directory structure
- [x] Create first diagram
- [x] Test export to PNG
- [x] GitHub Actions workflow for auto-generation

### Diagram Creation

- [x] ER diagram (database schema)
- [x] Class diagrams for all services (7 diagrams)
- [x] Sequence diagrams for all flows (25 diagrams) ✅ **COMPLETE**
- [x] State diagrams for state machines (4 diagrams)
- [ ] Export all diagrams to PNG (via GitHub Actions)
- [x] Update documentation with diagram references

---

## 📊 Diagram Status

### ER Diagrams

- [x] Database ER Diagram (7 entities, 8 relationships)

### Class Diagrams

- [x] Auth Service
- [x] Profile Service
- [x] Leaderboard Service
- [x] Matchmaking Service
- [x] Game Engine Service
- [x] Frontend Components
- [x] Database Schema

### Sequence Diagrams (25 total) ✅ **COMPLETE**

- [x] Authentication Flow
- [x] Session Timeout Flow
- [x] Hero Selection Flow
- [x] Matchmaking Flow
- [x] Match Acceptance Timeout Flow
- [x] Match Rejection Flow
- [x] Matchmaking Timeout Flow
- [x] Queue Cancellation Flow
- [x] Arena Selection Flow
- [x] Arena Selection Timeout Flow
- [x] Weapon Selection Flow
- [x] Weapon Selection Timeout Flow
- [x] Gameplay Flow
- [x] Movement Flow
- [x] Turn Timeout Flow
- [x] Disconnection Handling Flow
- [x] Post-Match Flow
- [x] Post-Match Result Screen Flow
- [x] Profile View Flow
- [x] Profile Update Flow
- [x] Match History View Flow
- [x] Leaderboard View Flow
- [x] Dashboard Flow
- [x] Network Error Handling Flow
- [x] Database Access Flow

**See [Sequence Diagrams README](./sequence-diagrams/README.md) for complete index and details.**

### State Diagrams

- [x] Arena Selection State
- [x] Weapon Selection State
- [x] Game State
- [x] Turn State

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**

- **Author:** Documentation Team
- **Last Updated:** 2024
- **Status:** Active - All mandatory diagrams created

---

## 🔗 Related Documentation

- [Low-Level Design (LLD)](../02-ARCHITECTURE/LOW_LEVEL_DESIGN/README.md) - Service designs and patterns
- [High-Level Design (HLD)](../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md) - System architecture
- [Project Definition](../00-PROJECT_DEFINITION/README.md) - Project requirements and scope

---

**Total Diagrams: 41 PlantUML files**

- **ER Diagrams:** 1
- **Class Diagrams:** 7
- **Sequence Diagrams:** 25 ✅ **COMPLETE**
- **State Diagrams:** 4
- **Architecture Diagrams:** 4
