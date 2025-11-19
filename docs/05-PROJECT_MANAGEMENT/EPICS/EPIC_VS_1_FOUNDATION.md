# EPIC-VS-1: Foundation & Infrastructure Setup

**Copy and paste this template directly into GitHub Issues.**

**⚠️ IMPORTANT NOTE:** This epic is implemented exactly like the Phase 1 document in order. All tasks, stories, and technical details follow the Phase 1 Foundation document structure. Refer to [Phase 1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_1_FOUNDATION.md) for complete implementation details.

---

## EPIC-VS-1: Foundation & Infrastructure Setup

### Issue Template:

```
Title: EPIC-VS-1: Foundation & Infrastructure Setup

Description:
## Overview
Set up the complete foundation for the Battle Arena multiplayer artillery battle game project. This epic establishes the microservices architecture foundation with 5 backend services (3 Spring Boot, 2 Node.js), Angular frontend, and infrastructure tooling following clean architecture principles.

**This is the foundation epic** - it must be completed before any gameplay features can be implemented.

## Goals
- Establish project structure following clean architecture with strict separation of concerns
- Set up local development environment using Docker Compose (recommended for <1,000 users/month)
- Configure CI/CD pipelines with GitHub Actions (testing, building, code quality checks)
- Set up development tooling and code quality infrastructure (linters, formatters, pre-commit hooks, testing frameworks)
- Prepare infrastructure for all services following the system architecture

## Success Criteria
- [ ] All service directories created (Auth:8081, Profile:8082, Leaderboard:8083, Matchmaking:3002, Game Engine:5002 - **internal ports only**)
- [ ] Docker Compose working locally with MongoDB (27017) and Redis (6379 - **internal ports, host ports only for dev convenience**)
- [ ] Nginx API Gateway configured (ONLY service with external ports 80/443)
- [ ] Services communicate internally via Docker network (service names, not localhost)
- [ ] CI/CD pipelines configured with GitHub Actions (testing, building, code quality, security scanning)
- [ ] Testing frameworks configured (JUnit, Jest, Jasmine) with 80%+ coverage targets
- [ ] Code quality tools configured (ESLint, Prettier, Checkstyle) and enforced
- [ ] Pre-commit hooks configured (Husky, lint-staged) for automatic code quality checks
- [ ] Development tooling infrastructure complete (API docs, editor configs, dependency management)
- [ ] Development environment documented with service ports and responsibilities

## ⚠️ Critical Architecture Note: Port Management

**Services run in Docker/Kubernetes and communicate internally:**

- **Nginx API Gateway**: ONLY service with external ports (80, 443)
- **Backend Services**: NO host ports - internal ports only (8081, 8082, 8083, 3002, 5002)
- **Databases**: Internal ports only - host ports exposed ONLY for development convenience
- **Service Communication**: Use service names (`auth-service:8081`) NOT `localhost:8081`
- **Production**: Remove all database host port mappings, use internal network only

## ⏭️ Deferred to Later Phases

**This foundation epic focuses on infrastructure only.** The following will be implemented in later vertical slice epics:

### EPIC-VS-2+ (Service Implementation)
- **API Documentation (Swagger/OpenAPI)** - Configured when first REST API service is implemented (EPIC-VS-2: Authentication)
- **Service-specific Dockerfiles** - Created when implementing each service (EPIC-VS-8: Deployment)
- **Service configurations** - Added as services are built (application.properties, package.json, etc.)
- **Service-specific logging** - Added during service implementation when needed

### EPIC-VS-8 (Deployment & Production)
- **Dockerfiles for all services** - Multi-stage builds, health checks, optimization
- **Production Docker Compose** - Full service orchestration for production
- **Kubernetes deployment** - Production orchestration (if needed for >10,000 users/day)
- **Logging infrastructure** - ELK Stack or Grafana Cloud (when services need observability)
- **Monitoring infrastructure** - Prometheus, Grafana (when services are running)
- **Distributed tracing** - Jaeger/Zipkin (optional, for production)

**Rationale:**
- This foundation epic establishes the foundation (structure, dev environment basics, CI/CD, development tooling)
- API documentation is added in EPIC-VS-2 when first REST APIs are implemented
- Service-specific implementations (Dockerfiles, logging, monitoring) are added when services are built and need them
- This follows an incremental approach: build foundation → implement services → add production infrastructure

## Related Documentation
- [Phase 1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_1_FOUNDATION.md) - Complete implementation guide (follow this document in order)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Microservices architecture overview
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Service structure and responsibilities
- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Development and production deployment strategies
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Critical design principles (REUSABILITY, SOLID, DRY, Clean Code, Secure Programming)

## Architecture Diagrams
- [System Architecture Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/architecture/System%20Architecture.png)
- [Container Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/architecture/Container%20Diagram.png)
- [Component Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/exported/architecture/Component%20Diagram%20-%20Game%20Engine%20Service.png)

## Implementation Order

**This epic follows the Phase 1 document structure exactly:**

1. **STORY-VS-1-1:** Set up project structure and repository
2. **STORY-VS-1-2:** Set up development environment and tooling
3. **STORY-VS-1-3:** Set up CI/CD pipeline with GitHub Actions
4. **STORY-VS-1-4:** Set up development tooling and code quality infrastructure

**For detailed task breakdown, refer to [Phase 1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_1_FOUNDATION.md) which contains all stories and tasks in order.**

## Labels
epic:foundation, epic:vertical-slice, infrastructure, priority:high

## Milestone
VS-1: Foundation & Infrastructure Setup

## Related Epics
- EPIC-VS-2: Player Authentication & Identity (depends on VS-1)
- EPIC-VS-3: First Playable Match (depends on VS-1, VS-2)
```

---

## How to Use This Template

1. **Create Epic Issue:**
   - Copy the EPIC-VS-1 template above
   - Create issue in GitHub
   - Assign to milestone "VS-1: Foundation & Infrastructure Setup"

2. **Create Story Issues:**
   - Refer to [Phase 1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_1_FOUNDATION.md)
   - For each STORY-1-X, create STORY-VS-1-X with same content
   - Link to EPIC-VS-1 as parent
   - Follow Phase 1 document structure exactly

3. **Create Task Issues:**
   - Refer to [Phase 1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_1_FOUNDATION.md)
   - For each TASK-1-X-Y, create TASK-VS-1-X-Y with same content
   - Link to story as parent
   - Follow Phase 1 document structure exactly

4. **Track Progress:**
   - Use GitHub Projects Kanban board
   - Move stories through: Backlog → To Do → In Progress → Review → Done
   - Update epic when all stories complete

---

**Note:** This epic is a direct mapping of Phase 1 to the vertical slice structure. All implementation details, tasks, and technical specifications are identical to Phase 1. The only difference is the numbering scheme (VS-1 instead of Phase 1) to align with the vertical slice planning approach.
