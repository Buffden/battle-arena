# 🎮 Battle Arena

[![Status](https://img.shields.io/badge/status-active_development-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Java](https://img.shields.io/badge/java-17-orange)]()
[![Node](https://img.shields.io/badge/node-18+-green)]()
[![Angular](https://img.shields.io/badge/angular-17+-red)]()

> *Where strategy meets nostalgia, and every shot counts.*

**Battle Arena** is a modern multiplayer 2D artillery battle game that brings the classic Pocket Tank experience into the 21st century. Think of it as your favorite retro artillery game, but now you can battle real players from around the world, climb leaderboards, and prove you're the ultimate artillery master.

---

## 🎯 What's This All About?

Remember those classic artillery games where you'd aim, adjust power, and hope your shot lands? **Battle Arena** is that, but better. It's a turn-based multiplayer game where you:

- 🎭 **Choose your hero** - Tanks, archers, catapults, witches, and more
- ⚔️ **Select your arsenal** - Pick 10 weapons before each match
- 🗺️ **Battle in unique arenas** - Each with different terrain and gravity
- 🎯 **Aim and fire** - Master the physics, outsmart your opponent
- 🏆 **Climb the ranks** - Compete on global leaderboards

Matches are quick (4-5 minutes), fair (skill-based matchmaking), and endlessly fun. Whether you're a casual player looking for a quick game or a competitive strategist aiming for the top, Battle Arena has something for you.

### Why I Built This

I wanted to create a game that's:
- **Easy to learn, hard to master** - Jump in quickly, but there's always room to improve
- **Fair and competitive** - Smart matchmaking ensures you're always playing against similarly skilled opponents
- **Fast-paced** - Perfect for those "just one more game" moments
- **Nostalgic yet modern** - Classic gameplay meets modern multiplayer features

---

## 🛠️ Built With

I've chosen my tech stack carefully to ensure the game is fast, scalable, and maintainable:

### Frontend
- **Angular 17+** with TypeScript - Modern, type-safe frontend
- **TailwindCSS** - Beautiful, responsive UI
- **Phaser 3** - Smooth 2D game rendering
- **Socket.io** - Real-time game synchronization

### Backend
- **Spring Boot (Java)** - Rock-solid authentication, profiles, and leaderboards
- **Node.js** - Lightning-fast matchmaking and game engine
- **Matter.js** - Realistic physics for those satisfying projectile trajectories

### Data & Infrastructure
- **MongoDB** - Flexible database for users, matches, and game data
- **Redis** - Blazing-fast matchmaking queues and game state caching
- **Docker** - Containerized services for easy deployment
- **Nginx** - Smart routing and load balancing

### Security
- **JWT** - Secure authentication
- **OAuth 2.0 (Google)** - Quick sign-in with Google account
- **BCrypt** - Your passwords are safe
- **HTTPS/WSS** - Encrypted communication

---

## 🏗️ Architecture

Battle Arena follows a **microservices architecture**, which means each part of the system does one thing really well:

```
┌─────────────────────────────────────────────────────────┐
│                    Angular Frontend                     │
│         (Hero Selection, Gameplay, Leaderboard)         │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │   Nginx API Gateway   │
         └───────────┬───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼───┐      ┌─────▼─────┐    ┌────▼────┐
│ Auth  │      │  Profile  │    │Leaderbd │
│Service│      │  Service  │    │ Service │
└───────┘      └───────────┘    └─────────┘
    │                │                │
    └────────────────┼────────────────┘
                     │
         ┌───────────▼───────────┐
         │   Matchmaking Service │
         │   (Finds your opponent)│
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │    Game Engine Service │
         │  (The fun happens here)│
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   MongoDB + Redis     │
         │  (Data & Caching)     │
         └───────────────────────┘
```

### Core Services

This project follows a **microservices architecture** with the following services:

| Service | Technology | Port | Description |
|---------|-----------|------|-------------|
| **Auth Service** | Spring Boot (Java) | 8081 | User registration, login, Google OAuth, JWT tokens |
| **Profile Service** | Spring Boot (Java) | 8082 | Player profiles, scores, rank progression |
| **Leaderboard Service** | Spring Boot (Java) | 8083 | Rankings and leaderboards with filtering |
| **Matchmaking Service** | Node.js (Express, Socket.io) | 3002 | Hero selection, matchmaking, arena/weapon selection |
| **Game Engine Service** | Node.js (Express, Socket.io) | 5002 | Game logic, physics, turns, scoring |
| **Frontend Service** | Angular 17+ | 4200 | User interface and game client |

**Data Stores:**
- **MongoDB** - Persistent data storage (Users, Profiles, Matches, Leaderboard, Heroes, Weapons, Arenas)
- **Redis** - Caching and queues (matchmaking queue, game state cache, configuration cache)

**API Gateway:**
- **Nginx** - Reverse proxy, load balancing, SSL termination

---

## 🚀 Getting Started

### Prerequisites

- **Docker & Docker Compose** - For containerized services and easy local setup
- **Java 17+** - For Spring Boot services (Auth, Profile, Leaderboard)
- **Node.js 18+** - For Node.js services (Matchmaking, Game Engine)
- **Git** - For version control
- **MongoDB** - Database (or use Docker container)
- **Redis** - Cache and queues (or use Docker container)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Buffden/battle-arena.git
   cd battle-arena
   ```

2. **Start everything with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the game**
   - Frontend: `http://localhost:4200`
   - API Gateway: `http://localhost:80` (routes to backend services)
   - Auth Service: `http://localhost:8081`
   - Profile Service: `http://localhost:8082`
   - Leaderboard Service: `http://localhost:8083`
   - Matchmaking Service: `http://localhost:3002` (WebSocket)
   - Game Engine Service: `http://localhost:5002` (WebSocket)

4. **Create an account and start playing!** 🎮

> 💡 **Tip:** Check out the [detailed setup guide](./docs/01-GETTING_STARTED/README.md) for more information.

> 🔧 **Environment Setup:** Create `.env` files for each service based on `.env.example` templates (if available).

---

## 📁 Project Structure

```
battle-arena/
├── backend-services/          # 5 microservices (3 Spring Boot, 2 Node.js)
│   ├── auth-service/          # Spring Boot - Authentication (Port 8081)
│   ├── profile-service/        # Spring Boot - User profiles (Port 8082)
│   ├── leaderboard-service/    # Spring Boot - Rankings (Port 8083)
│   ├── matchmaking-service/    # Node.js - Matchmaking logic (Port 3002)
│   └── game-engine/            # Node.js - Game physics & logic (Port 5002)
├── frontend-service/           # Angular - The game UI (Port 4200)
├── deployments/                # Docker & Kubernetes configurations
│   ├── docker/                 # Docker Compose for local development
│   ├── kubernetes/             # Kubernetes manifests for production
│   └── nginx/                  # Nginx API Gateway configuration
├── database/                   # MongoDB initialization scripts
│   └── init/                   # Database initialization scripts
├── scripts/                     # Utility scripts (setup, deployment, etc.)
└── docs/                       # Comprehensive documentation
    ├── 00-PROJECT_DEFINITION/  # What I'm building
    ├── 02-ARCHITECTURE/        # How it all fits together
    ├── 03-DIAGRAMS/            # Visual architecture
    └── 05-PROJECT_MANAGEMENT/  # Development phases
```

### Directory Purposes

- **backend-services/**: Contains all 5 microservices following clean architecture principles
- **frontend-service/**: Angular application with modular structure (auth, dashboard, hero-selection, matchmaking, arena-selection, weapon-selection, arena, profile, leaderboard)
- **deployments/**: Docker Compose for local development, Kubernetes manifests for production
- **database/**: MongoDB initialization scripts for collections (Users, Profiles, Matches, Leaderboard, Heroes, Weapons, Arenas)
- **scripts/**: Setup, deployment, and utility scripts
- **docs/**: Comprehensive project documentation

---

## 🎮 Game Features

- ✅ **Multiple Hero Types** - Tanks, archers, catapults, witches, and more
- ✅ **Smart Matchmaking** - Find opponents of similar skill in seconds
- ✅ **Weapon Selection** - Choose your 10-weapon arsenal before each match
- ✅ **Arena Selection** - Vote on which battlefield to fight on
- ✅ **Realistic Physics** - Matter.js-powered projectile physics
- ✅ **Turn-Based Combat** - 15 seconds per turn, 4-5 minutes per match
- ✅ **Global Leaderboards** - Compete and climb the ranks
- ✅ **Player Progression** - Track your stats and improve over time
- ✅ **Fair Play** - Skill-based matchmaking ensures competitive matches
- 🚧 **Google OAuth Login** - Quick sign-in with your Google account (coming soon)

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

### Architecture & Design
- **[Architecture Overview](./docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md)** - System architecture and component design
- **[Project Description](./docs/00-PROJECT_DEFINITION/PROJECT_DESCRIPTION.md)** - Complete project specification
- **[System Architecture](./docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md)** - Detailed architecture documentation
- **[Component Design](./docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md)** - Service structure and responsibilities
- **[Database Design](./docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)** - Database schema and relationships

### Getting Started
- **[Getting Started Guide](./docs/01-GETTING_STARTED/README.md)** - Detailed setup and installation instructions
- **[Project Management](./docs/05-PROJECT_MANAGEMENT/PROJECT_BREAKDOWN.md)** - Development phases and roadmap

### Visual Documentation
- **[Architecture Diagrams](./docs/03-DIAGRAMS/README.md)** - Visual architecture diagrams and flow charts
- **[ER Diagrams](./docs/03-DIAGRAMS/er-diagrams/)** - Database entity relationships
- **[Sequence Diagrams](./docs/03-DIAGRAMS/sequence-diagrams/)** - Service interaction flows

For complete documentation index, see [docs/README.md](./docs/README.md)

---

## 🎯 Design Principles

Code quality is a top priority. Every line of code follows these principles:

- **🔄 Reusability** - All components, services, and utilities designed for maximum reusability
- **✨ Clean Code** - Readable, maintainable, self-documenting code
- **🏗️ Clean Architecture** - Strict separation of concerns with clear boundaries between layers
- **🔒 Security First** - Defense in depth, input validation, secure by default
- **📐 SOLID Principles** - Industry best practices (DRY, SOLID, design patterns)

## 💻 Development

### Development Workflow

1. **Setup Development Environment**
   ```bash
   # Install dependencies for each service
   cd backend-services/auth-service && ./mvnw clean install
   cd ../matchmaking-service && npm install
   # ... repeat for other services
   ```

2. **Run Services Locally**
   - Use Docker Compose for full stack: `docker-compose up`
   - Or run services individually for development
   - Services communicate via Docker network (use service names) or localhost

3. **Testing**
   - Unit tests: Run tests for each service independently
   - Integration tests: Test service interactions
   - End-to-end tests: Test complete user flows

4. **Code Quality**
   - Follow SOLID principles
   - Maintain clean architecture layers
   - Write reusable components
   - Document complex logic
   - Security-first approach

### Testing Instructions

- **Spring Boot Services:** `./mvnw test`
- **Node.js Services:** `npm test`
- **Angular Frontend:** `ng test` or `npm test`

See individual service README files for service-specific testing instructions.

---

## 🤝 Contributing

I'm always looking for contributors! Whether you're fixing bugs, adding features, or improving documentation, your help is welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📊 Project Status

**Current Phase:** Foundation & Core Services  
**Status:** 🚧 In Active Development

I'm building this step by step:
- ✅ **Phase 1:** Project foundation and setup
- 🚧 **Phase 2:** Authentication and user management
- 📋 **Phase 3:** Profile management and progression
- 📋 **Phase 4:** Matchmaking and game engine
- 📋 **Phase 5:** Frontend and gameplay

Check out my [issue templates](./docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/) to see what I'm working on.

---

## 🐛 Known Issues & Roadmap

I'm constantly improving! Check my [GitHub Issues](https://github.com/Buffden/battle-arena/issues) for known bugs and feature requests.

**Coming Soon:**
- More hero types and weapons
- Custom arenas
- Tournament mode
- Spectator mode
- Replay system

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by the classic **Pocket Tank** game
- Built with modern web technologies and best practices
- Designed with scalability and maintainability in mind

---

## 💬 Questions?

Have questions? Found a bug? Want to contribute? 

- 📧 Open an [issue](https://github.com/Buffden/battle-arena/issues)
- 💬 Start a [discussion](https://github.com/Buffden/battle-arena/discussions)
- 📖 Check my [documentation](./docs/README.md)

---

**Ready to dominate the arena?** 🎯 Let's battle!

---

