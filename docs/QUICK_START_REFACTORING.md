# 🚀 Quick Start: Refactoring Guide

## ⚠️ IMPORTANT: Recommended Approach

> **🎯 CLEAN SLATE STRATEGY RECOMMENDED**
> 
> **Building on top of uncommitted changes that don't align with LLD/HLD will be tedious and error-prone.**
> 
> **👉 See: [Clean Slate Strategy](./CLEAN_SLATE_STRATEGY.md)** - Build fresh, reference old code for logic only
> 
> **This approach:**
> - ✅ Builds right from the start (follows LLD/HLD exactly)
> - ✅ No technical debt
> - ✅ Easier to maintain
> - ✅ Faster in the long run
> - ✅ Less tedious
> 
> **Alternative:** [Migration and Refactoring Plan](./MIGRATION_AND_REFACTORING_PLAN.md) - If you prefer incremental refactoring

---

## Current Situation

You started implementing the project **without planning**, and now the structure is **vague** and doesn't match the documented architecture.

## What We Have

✅ **Comprehensive Documentation:**
- Project Description and Scope
- High-Level Design (HLD)
- Low-Level Design (LLD)
- 25 UML Diagrams (Architecture, Class, Sequence, State, ER)
- All verified and production-ready

✅ **Basic Implementation:**
- Auth Service (Spring Boot) - Basic auth
- Profile Service (Spring Boot) - Basic profile
- Leaderboard Service (Spring Boot) - Basic leaderboard
- Matchmaking Service (Node.js) - Basic matchmaking
- Game Engine Service (Node.js) - Basic game logic
- Frontend (Angular) - Basic UI

## The Problem

❌ **Structural Issues:**
- Package naming inconsistencies (`Auth.Service` vs `com.battlearena`)
- Nested folders and duplicate target folders
- User model uses `xp` and `level` instead of `globalScore` and `rankTier`
- Missing Configuration Service
- Missing Hero/Weapon/Arena data models
- Missing game features (hero selection, arena selection, weapon selection, turn management, movement, scoring)
- Code doesn't follow documented design patterns
- Code doesn't follow documented LLD structure

## The Solution

### 🎯 Option 1: Clean Slate Strategy (RECOMMENDED)

**Build fresh, reference old code for logic only.**

👉 **See: [Clean Slate Strategy](./CLEAN_SLATE_STRATEGY.md)**

**Benefits:**
- ✅ Builds right from the start (follows LLD/HLD exactly)
- ✅ No technical debt
- ✅ Easier to maintain
- ✅ Faster in the long run
- ✅ Less tedious

**Steps:**
1. Backup existing code to a branch
2. Create clean implementation branch
3. Build services one by one following LLD exactly
4. Reference old code for business logic only
5. Test as you go
6. Integrate incrementally

### 🔄 Option 2: Incremental Refactoring

**Refactor existing code step by step.**

👉 **See: [Migration and Refactoring Plan](./MIGRATION_AND_REFACTORING_PLAN.md)**

**We have a 6-phase refactoring plan** to align your codebase with the documented architecture:

### 📋 Phase 1: Foundation (Week 1)
**Fix the basics:**
- Fix package names (`Auth.Service` → `com.battlearena`)
- Clean up folder structure (remove nested folders, duplicates)
- Update User model (remove `xp`/`level`, move to Profile)
- Update Profile model (add `globalScore`, `rankTier`, `region`)
- Create base classes (DTOs, utilities)

### 📋 Phase 2: Data Models (Week 2)
**Create all data models:**
- Hero model (MongoDB collection)
- Weapon model (MongoDB collection)
- Arena model (MongoDB collection)
- Update Profile model (add missing fields)
- Update Match model (add missing fields)
- Update Leaderboard model (add filtering fields)
- Create database indexes

### 📋 Phase 3: Configuration Service (Week 3)
**Create Configuration Service:**
- Spring Boot service (port 8084)
- ConfigFile model (rank tiers, scoring formulas, penalties)
- ConfigurationManager with Redis caching
- REST API endpoints
- Docker configuration

### 📋 Phase 4: Service Refactoring (Week 4-5)
**Refactor existing services:**
- Auth Service (follow LLD, implement design patterns)
- Profile Service (score/rank tier system, design patterns)
- Leaderboard Service (filtering system, design patterns)
- Matchmaking Service (hero selection, arena selection, weapon selection, design patterns)
- Game Engine Service (turn management, movement, scoring, design patterns)

### 📋 Phase 5: Game Features (Week 6-8)
**Implement game features:**
- Hero selection system
- Arena selection system (voting/elimination)
- Weapon selection system (alternating, 30s timer)
- Turn management (15s timer, 10 turns per player)
- Movement system (4 moves per game)
- Scoring system (accuracy, back-to-back hits, repositioning saves)
- Win/draw conditions (HP = 0, match timer, turn count)
- Weapon synergies

### 📋 Phase 6: Frontend Integration (Week 9-10)
**Update frontend:**
- Update services to use new APIs
- Create new components (hero selection, arena selection, weapon selection)
- Update game arena component
- Update routes and navigation

## How to Start

### Step 1: Read the Migration Plan
📖 Read: `docs/MIGRATION_AND_REFACTORING_PLAN.md`

This document contains:
- Detailed analysis of current state
- Complete refactoring checklist for each phase
- Design patterns to implement
- Testing strategy
- Timeline and milestones

### Step 2: Create Feature Branches
```bash
# Create branch for Phase 1
git checkout -b refactor/phase-1-foundation

# Create branch for Phase 2
git checkout -b refactor/phase-2-data-models

# etc.
```

### Step 3: Start with Phase 1
**Priority:** Fix package names and folder structure

**Tasks:**
1. Update `pom.xml` files (change `groupId` from `Auth.Service` to `com.battlearena`)
2. Remove nested folders (`auth-service/backend-services/`)
3. Remove duplicate target folders
4. Update User model (remove `xp`/`level`)
5. Update Profile model (add `globalScore`, `rankTier`, `region`)

### Step 4: Follow the Checklist
Each phase has a detailed checklist in the migration plan. Follow it step-by-step.

### Step 5: Test and Review
- Write tests before refactoring
- Test after each change
- Code review before merging
- Update documentation as you go

## Key Principles

### 1. Incremental Changes
✅ **Do:** Small, testable changes
❌ **Don't:** Big bang refactoring

### 2. Backward Compatibility
✅ **Do:** Maintain existing functionality
❌ **Don't:** Break existing features

### 3. Test Coverage
✅ **Do:** Write tests before refactoring
❌ **Don't:** Refactor without tests

### 4. Documentation
✅ **Do:** Update documentation as you refactor
❌ **Don't:** Leave documentation outdated

### 5. Design Patterns
✅ **Do:** Follow documented design patterns (Strategy, Factory, State, Command, etc.)
❌ **Don't:** Implement without patterns

## Common Issues and Solutions

### Issue 1: Package Name Conflicts
**Problem:** `Auth.Service` vs `com.battlearena.auth`
**Solution:** Update `pom.xml` and all Java files to use `com.battlearena.*`

### Issue 2: Nested Folders
**Problem:** `auth-service/backend-services/game-engine/`
**Solution:** Remove nested folders, use standardized structure

### Issue 3: Missing Data Models
**Problem:** No Hero/Weapon/Arena models
**Solution:** Create models following database design document

### Issue 4: Missing Design Patterns
**Problem:** Code doesn't follow LLD patterns
**Solution:** Refactor to implement Strategy, Factory, State, Command patterns

### Issue 5: Missing Features
**Problem:** No hero selection, arena selection, weapon selection
**Solution:** Implement features following sequence diagrams and LLD

## Resources

### Documentation
- 📖 **Migration Plan:** `docs/MIGRATION_AND_REFACTORING_PLAN.md`
- 📖 **Project Description:** `docs/00-PROJECT_DEFINITION/PROJECT_DESCRIPTION.md`
- 📖 **Project Scope:** `docs/00-PROJECT_DEFINITION/PROJECT_SCOPE.md`
- 📖 **HLD:** `docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md`
- 📖 **LLD:** `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/README.md`
- 📖 **Diagrams:** `docs/03-DIAGRAMS/README.md`

### Reference Documents
- 📋 **Auth Service LLD:** `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md`
- 📋 **Profile Service LLD:** `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md`
- 📋 **Leaderboard Service LLD:** `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md`
- 📋 **Matchmaking Service LLD:** `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md`
- 📋 **Game Engine Service LLD:** `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md`
- 📋 **Database Schema LLD:** `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/DATABASE_SCHEMA.md`

### Diagrams
- 🎨 **Class Diagrams:** `docs/03-DIAGRAMS/class-diagrams/`
- 🎨 **Sequence Diagrams:** `docs/03-DIAGRAMS/sequence-diagrams/`
- 🎨 **State Diagrams:** `docs/03-DIAGRAMS/state-diagrams/`
- 🎨 **Architecture Diagrams:** `docs/03-DIAGRAMS/architecture/`
- 🎨 **ER Diagram:** `docs/03-DIAGRAMS/er-diagrams/`

## Timeline

- **Week 1:** Phase 1 - Foundation
- **Week 2:** Phase 2 - Data Models
- **Week 3:** Phase 3 - Configuration Service
- **Week 4-5:** Phase 4 - Service Refactoring
- **Week 6-8:** Phase 5 - Game Features
- **Week 9-10:** Phase 6 - Frontend Integration
- **Week 11:** Testing and Documentation
- **Week 12:** Deployment and Review

## Next Steps

1. ✅ **Read the Migration Plan** - `docs/MIGRATION_AND_REFACTORING_PLAN.md`
2. ✅ **Review Current State** - Understand what exists and what's missing
3. ✅ **Create Feature Branches** - One branch per phase
4. ✅ **Start Phase 1** - Fix package names and folder structure
5. ✅ **Follow the Checklist** - Step-by-step refactoring
6. ✅ **Test and Review** - Test after each change, review before merging

## Support

If you have questions or need help:
1. Review the migration plan document
2. Check the LLD documents for your service
3. Check the sequence diagrams for flows
4. Check the class diagrams for structure
5. Review the database schema for data models

---

**Remember:** This is a **phased approach**. Don't try to do everything at once. Follow the plan step-by-step, and you'll successfully align your codebase with the documented architecture.

**Good luck! 🚀**

