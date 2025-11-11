# Battle Arena - Multiplayer Artillery Battle Game

**Status:** 🚧 Fresh Project - Ready for Implementation  
**Branch:** `feature/clean-up-the-codebase-based-on-new-lld-&-hld`

---

## 📋 Project Overview

Battle Arena is a multiplayer artillery battle game built with a microservices architecture. This project follows clean architecture principles, design patterns, and best practices as documented in the project documentation.

## 🏗️ Architecture

The system is designed as a microservices architecture with the following services:

### Backend Services
- **Auth Service** (Spring Boot) - Port 8081 - Authentication and authorization
- **Profile Service** (Spring Boot) - Port 8082 - User profile and global score tracking
- **Leaderboard Service** (Spring Boot) - Port 8083 - Leaderboard and ranking management
- **Matchmaking Service** (Node.js) - Port 3002 - Player matching, hero selection, arena selection, weapon selection
- **Game Engine Service** (Node.js) - Port 5002 - Game logic, physics, movement, scoring

### Frontend Service
- **Frontend Service** (Angular) - Port 4200 - User interface and game client

### Infrastructure
- **MongoDB** - Port 27017 - Primary database
- **Redis** - Port 6379 - Cache and message queue

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Project Definition](./docs/00-PROJECT_DEFINITION/README.md)** - Project description and scope
- **[High-Level Design (HLD)](./docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md)** - System architecture and component design
- **[Low-Level Design (LLD)](./docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/README.md)** - Detailed component specifications with design patterns
- **[Diagrams](./docs/03-DIAGRAMS/README.md)** - UML diagrams (PlantUML)
- **[Architecture Decision Records](./docs/02-ARCHITECTURE/DECISION_RECORDS/05-ARCHITECTURE_DECISION_RECORDS.md)** - Key architectural decisions

## 🎯 Design Principles

All implementation MUST strictly adhere to the following principles:

1. **REUSABILITY** - All components, services, and utilities MUST be designed for maximum reusability
2. **GOOD CODE PRACTICES** - Follow SOLID principles, DRY (Don't Repeat Yourself), and industry best practices
3. **CLEAN CODE** - Code must be readable, self-documenting, and maintainable
4. **CLEAN ARCHITECTURE** - Strict separation of concerns with clear boundaries between layers
5. **SECURE PROGRAMMING** - Security-first approach with defense in depth, input validation, and secure communication

## 🚀 Getting Started

### Prerequisites
- Java 17+ (for Spring Boot services)
- Node.js 20+ (for Node.js services)
- Docker and Docker Compose (for infrastructure)
- MongoDB 6.0+
- Redis 7.0+

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd battle-arena
   ```

2. **Start infrastructure services**
   ```bash
   docker-compose up -d mongodb redis
   ```

3. **Implement services** (following LLD documentation)
   - Start with Auth Service
   - Then Profile Service
   - Then Leaderboard Service
   - Then Matchmaking Service
   - Then Game Engine Service
   - Finally Frontend Service

4. **Run services**
   - Each service should be run individually during development
   - Use Docker Compose for production deployment

## 📁 Project Structure

```
battle-arena/
├── backend-services/        # Backend microservices
│   ├── auth-service/        # Auth Service (Spring Boot)
│   ├── profile-service/     # Profile Service (Spring Boot)
│   ├── leaderboard-service/ # Leaderboard Service (Spring Boot)
│   ├── matchmaking-service/ # Matchmaking Service (Node.js)
│   └── game-engine/         # Game Engine Service (Node.js)
├── frontend-service/        # Frontend Service (Angular)
├── database/                # Database initialization scripts
├── deployments/             # Deployment configurations
│   ├── docker/              # Dockerfiles
│   └── kubernetes/          # Kubernetes manifests
├── docs/                    # Project documentation
├── scripts/                 # Utility scripts
└── docker-compose.yml       # Docker Compose configuration
```

## 🔧 Development Guidelines

### Implementing Services

1. **Follow LLD Documentation** - Each service has detailed LLD documentation in `docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/`
2. **Apply Design Patterns** - Use the design patterns specified in the LLD documentation
3. **Follow Clean Architecture** - Maintain clear separation of concerns
4. **Write Tests** - Implement unit tests and integration tests
5. **Document Code** - Add comprehensive documentation

### Code Quality

- Follow SOLID principles
- Maintain clean code standards
- Use design patterns appropriately
- Ensure security best practices
- Write comprehensive tests

## 📝 Implementation Status

- [ ] Auth Service - Ready for implementation
- [ ] Profile Service - Ready for implementation
- [ ] Leaderboard Service - Ready for implementation
- [ ] Matchmaking Service - Ready for implementation
- [ ] Game Engine Service - Ready for implementation
- [ ] Frontend Service - Ready for implementation

## 🤝 Contributing

1. Follow the design principles and architecture documented in the `docs/` folder
2. Implement services according to the LLD documentation
3. Ensure all tests pass
4. Update documentation as needed

## 📄 License

[Add license information]

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**
