# 🏗️ Architecture Documentation

**Part of:** [Documentation Index](../README.md)  
**Last Updated:** 2024  
**Version:** 2.0

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**This documentation and all implementation MUST strictly adhere to the following principles:**

1. **REUSABILITY** - All components, services, and utilities MUST be designed for maximum reusability across the system
2. **GOOD CODE PRACTICES** - Follow SOLID principles, DRY (Don't Repeat Yourself), and industry best practices
3. **CLEAN CODE** - Code must be readable, self-documenting, and maintainable
4. **CLEAN ARCHITECTURE** - Strict separation of concerns with clear boundaries between layers
5. **SECURE PROGRAMMING** - Security-first approach with defense in depth, input validation, and secure communication

**These principles are NON-NEGOTIABLE and must be enforced in every line of code and every architectural decision.**

---

## 📑 Documentation Structure

### 1. [High-Level Design (HLD)](./HIGH_LEVEL_DESIGN/README.md)
**Purpose:** System architecture, component design, data flow, communication patterns, database design, security, scalability, deployment, and non-functional requirements.

**Status:** ✅ Updated (Version 2.0) - Aligned with clarified mechanics

**Contents:**
- Executive Summary
- System Architecture
- Component Design
- Data Flow
- Communication Patterns
- Database Design
- Security Architecture
- Scalability Considerations
- Deployment Architecture
- Non-Functional Requirements
- Design Principles
- Risk Assessment
- Future Enhancements

---

### 2. [Low-Level Design (LLD)](./LOW_LEVEL_DESIGN/README.md)
**Purpose:** Detailed component specifications, class diagrams, design patterns (Gang of Four), service implementations, error handling, and testing strategies.

**Status:** ⏳ To be updated - Will use Gang of Four Design Patterns

**Contents:**
- Service-specific LLD documents (Auth, Profile, Leaderboard, Matchmaking, Game Engine)
- Frontend Components
- Common patterns (Error Handling, Testing Strategy)

**Reference Book:** "Design Patterns: Elements of Reusable Object-Oriented Software" (Gang of Four)

---

### 3. [Architecture Decision Records (ADR)](./DECISION_RECORDS/05-ARCHITECTURE_DECISION_RECORDS.md)
**Purpose:** Document key architectural decisions, their context, and consequences.

**Status:** ✅ Updated (Version 2.0) - Aligned with clarified mechanics

**Contents:**
- Microservices Architecture
- JWT-Based Authentication
- MongoDB for Data Storage
- Redis for Caching and Queues
- Node.js for Real-time Services
- Spring Boot for Business Services
- And more...

---

## 🎯 Reading Order

### For Architects
1. Start with [High-Level Design](./HIGH_LEVEL_DESIGN/README.md)
2. Review [Architecture Decision Records](./DECISION_RECORDS/05-ARCHITECTURE_DECISION_RECORDS.md)
3. Review [Low-Level Design](./LOW_LEVEL_DESIGN/README.md) (when available)

### For Developers
1. Review [High-Level Design](./HIGH_LEVEL_DESIGN/README.md) - System Architecture and Component Design
2. Review [Low-Level Design](./LOW_LEVEL_DESIGN/README.md) - Service-specific implementations
3. Reference [Architecture Decision Records](./DECISION_RECORDS/05-ARCHITECTURE_DECISION_RECORDS.md) for context

### For DevOps
1. Review [High-Level Design - Deployment](./HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md)
2. Review [High-Level Design - Scalability](./HIGH_LEVEL_DESIGN/08-SCALABILITY.md)
3. Review [High-Level Design - Non-Functional Requirements](./HIGH_LEVEL_DESIGN/10-NON_FUNCTIONAL_REQUIREMENTS.md)

---

## 🔗 Related Documentation

- [Project Definition](../00-PROJECT_DEFINITION/README.md) - Project description and scope
- [API Design](../02-DESIGN/API/06-API_DESIGN.md) - API specifications (if exists)
- [Security Design](../02-DESIGN/SECURITY/04-SECURITY_DESIGN.md) - Security design (if exists)
- [Feasibility Analysis](../03-ANALYSIS/FEASIBILITY/03-FEASIBILITY_ANALYSIS.md) - Feasibility analysis (if exists)
- [Diagrams](../03-DIAGRAMS/README.md) - UML diagrams

---

## 📊 Document Status

| Document | Status | Version | Last Updated |
|----------|--------|---------|--------------|
| High-Level Design | ✅ Updated | 2.0 | 2024 |
| Low-Level Design | ⏳ To be updated | 1.0 | 2024 |
| Architecture Decision Records | ✅ Updated | 2.0 | 2024 |

---

## 🎯 Key Updates (Version 2.0)

### Changed from "Tank Battle Game" to "Artillery Battle Game"
- Updated all references to reflect 2D artillery battle game (inspired by Pocket Tank)

### New Features Added
- ✅ Hero Selection System (multiple hero types, multiple selection)
- ✅ Weapon Selection System (10 weapons, alternating selection)
- ✅ Arena Selection System (voting/elimination)
- ✅ Movement System (4 moves per game)
- ✅ Updated Matchmaking (global score/rank-based, hero matching)
- ✅ Updated Scoring System (accuracy, back-to-back hits, repositioning saves)
- ✅ Updated Health System (hero-specific HP, balanced HP when matched)
- ✅ Updated Progression (global score, rank tiers like Valorant)
- ✅ Updated Leaderboard (filtering: region, hero type, winning percentage, weapons)
- ✅ Configuration File Support
- ✅ Disconnection Handling

### Database Updates
- ✅ Added Heroes Collection
- ✅ Added Weapons Collection
- ✅ Added Arenas Collection
- ✅ Updated Profiles Collection (globalScore, rankTier)
- ✅ Updated Matches Collection (hero, weapon, arena, score fields)
- ✅ Updated Leaderboard Collection (filtering fields)

### Redis Updates
- ✅ Added Arena Selection Storage
- ✅ Added Weapon Selection Storage
- ✅ Added Configuration Cache
- ✅ Updated Matchmaking Queue (hero-based queues)

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

