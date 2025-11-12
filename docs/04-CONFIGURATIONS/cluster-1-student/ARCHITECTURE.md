# 🎓 Cluster 1: Student/Minimal - Architecture
## Battle Arena - Ultra Low-Cost Architecture for Student Projects

**Traffic:** <1,000 users/month  
**Cost:** $0-10/month  
**Target:** Student projects, learning, prototyping  
**Status:** ✅ Ready for Implementation

---

## 🏗️ Architecture Overview

### **Architecture Principles:**
- **Simplicity** - Simple, easy-to-understand architecture
- **Cost-Effective** - Minimize costs using free tiers and self-hosted solutions
- **Scalable** - Easy to scale when traffic increases
- **Maintainable** - Easy to maintain and update

### **Architecture Pattern:**
- **Microservices Architecture** - All services as separate containers
- **Docker Compose** - Simple orchestration (no Kubernetes)
- **Redis Pub/Sub** - Simple message queuing (no Kafka)
- **Self-Hosted** - Self-hosted services (MongoDB, Redis, Nginx)
- **Free Tiers** - Free tiers for all components

---

## 📦 Component Architecture

### **1. Frontend Service**
- **Technology:** Angular (TypeScript, TailwindCSS, Phaser 3)
- **Port:** 4200
- **Deployment:** Docker container
- **Features:**
  - User authentication
  - Hero selection
  - Matchmaking
  - Gameplay
  - Leaderboard

### **2. API Gateway (Nginx)**
- **Technology:** Nginx
- **Port:** 80 (HTTP), 443 (HTTPS)
- **Deployment:** Docker container
- **Features:**
  - Request routing
  - Load balancing (basic)
  - SSL termination (Let's Encrypt)
  - Rate limiting (basic)
  - Health checks

### **3. Backend Services**

#### **3.1 Auth Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8081
- **Deployment:** Docker container
- **Features:**
  - User registration
  - User login
  - JWT token generation
  - Password encryption

#### **3.2 Profile Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8082
- **Deployment:** Docker container
- **Features:**
  - Profile management
  - Score tracking
  - Rank tier calculation
  - Statistics

#### **3.3 Leaderboard Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8083
- **Deployment:** Docker container
- **Features:**
  - Leaderboard generation
  - Ranking calculation
  - Filtering (region, hero, weapon)
  - Top players

#### **3.4 Matchmaking Service**
- **Technology:** Node.js (Express, Socket.io)
- **Port:** 3002
- **Deployment:** Docker container
- **Features:**
  - Matchmaking queue
  - Hero selection
  - Arena selection
  - Weapon selection
  - Match creation

#### **3.5 Game Engine Service**
- **Technology:** Node.js (Express, Socket.io, Matter.js)
- **Port:** 3003
- **Deployment:** Docker container
- **Features:**
  - Game state management
  - Turn management
  - Physics engine
  - Scoring system
  - Win/draw conditions

#### **3.6 Configuration Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8084
- **Deployment:** Docker container
- **Features:**
  - Config file management
  - Rank tier ranges
  - Scoring formulas
  - Game parameters
  - Penalties

---

## 🗄️ Data Storage Architecture

### **1. MongoDB**
- **Technology:** MongoDB 6.0+
- **Port:** 27017
- **Deployment:** Docker container OR MongoDB Atlas free tier (512MB)
- **Collections:**
  - Users
  - Profiles
  - Matches
  - Leaderboard
  - Heroes
  - Weapons
  - Arenas
  - ConfigFiles
- **Storage:** 512MB (free tier) or self-hosted
- **Replication:** Single instance (no replication for student projects)

### **2. Redis**
- **Technology:** Redis 7.0+
- **Port:** 6379
- **Deployment:** Docker container OR Redis Cloud free tier (30MB)
- **Data Structures:**
  - Sorted Sets - Matchmaking queue (hero-based)
  - Hash - Lobby storage, Arena/Weapon selection, Game state cache
  - String - Cache data, Hero/Weapon/Arena configurations
  - Pub/Sub - Message queuing (inter-service communication)
- **Storage:** 30MB (free tier) or self-hosted
- **Replication:** Single instance (no replication for student projects)

---

## 🔄 Message Queue Architecture

### **Redis Pub/Sub**
- **Technology:** Redis Pub/Sub
- **Purpose:** Inter-service communication, event streaming
- **Channels:**
  - `matchmaking:events` - Matchmaking events (match found, hero assigned, etc.)
  - `game:events` - Game events (game start, turn updates, game end, etc.)
  - `profile:updates` - Profile update events (score updates, rank changes, etc.)
  - `leaderboard:updates` - Leaderboard update events (rank changes, new entries, etc.)
- **Characteristics:**
  - No message persistence (acceptable for low traffic)
  - No message replay (acceptable for low traffic)
  - Sufficient for low traffic (<1,000 users/month)
  - Simple setup, no additional infrastructure
  - Free (uses existing Redis instance)

---

## 🌐 Communication Patterns

### **1. Synchronous Communication (REST)**
- **Protocol:** HTTP/HTTPS
- **Format:** JSON
- **Used for:** API calls, service-to-service communication
- **Services:** All backend services

### **2. Asynchronous Communication (WebSocket)**
- **Protocol:** WebSocket (WSS in production)
- **Format:** JSON
- **Used for:** Real-time game updates, matchmaking events
- **Services:** Matchmaking Service, Game Engine Service

### **3. Message Queue (Redis Pub/Sub)**
- **Protocol:** Redis Pub/Sub
- **Format:** JSON
- **Used for:** Inter-service communication, event streaming
- **Services:** All backend services

---

## 🚀 Deployment Architecture

### **Docker Compose**
- **Orchestration:** Docker Compose
- **Deployment:** Single server/VM (2 CPU, 4GB RAM)
- **Services:** All services in Docker Compose
- **Networking:** Docker network for service communication
- **Scaling:** Manual scaling (adjust replicas in Docker Compose)
- **Updates:** Manual deployment updates (acceptable for student projects)

### **Infrastructure:**
- **Compute:** Single server/VM (2 CPU, 4GB RAM)
- **Database:** MongoDB (self-hosted or Atlas free tier)
- **Cache:** Redis (self-hosted or Redis Cloud free tier)
- **API Gateway:** Nginx (single instance)
- **CI/CD:** GitHub Actions free tier (2,000 minutes/month)

---

## 🔐 Security Architecture

### **1. Authentication & Authorization**
- **JWT Tokens** - JWT tokens for authentication
- **Password Encryption** - BCrypt for password encryption
- **API Gateway** - JWT validation at gateway level (optional)

### **2. Data Protection**
- **HTTPS** - SSL/TLS certificates (Let's Encrypt)
- **Input Validation** - Input validation in all services
- **SQL Injection Protection** - MongoDB driver protection
- **XSS Protection** - Angular XSS protection

### **3. API Security**
- **Rate Limiting** - Basic rate limiting per IP (Nginx)
- **CORS** - CORS configuration for frontend
- **API Keys** - API keys for external services (optional)

---

## 📊 Monitoring & Logging Architecture

### **Monitoring (Optional)**
- **Grafana Cloud Free Tier** - 10k metrics, 50GB logs
- **Self-Hosted** - Skip monitoring initially (acceptable for student projects)
- **Metrics:** Basic application metrics (optional)

### **Logging (Optional)**
- **Grafana Cloud Free Tier** - 50GB logs
- **Self-Hosted** - Skip logging initially (acceptable for student projects)
- **Logs:** Application logs (optional)

### **Tracing (Optional)**
- **Skip Tracing** - Skip distributed tracing (not needed for low traffic)

---

## 🎯 Resource Allocation

### **Service Resource Limits:**
- **Auth Service:** 0.1 CPU, 256MB RAM
- **Profile Service:** 0.1 CPU, 256MB RAM
- **Leaderboard Service:** 0.1 CPU, 256MB RAM
- **Matchmaking Service:** 0.2 CPU, 512MB RAM
- **Game Engine Service:** 0.2 CPU, 512MB RAM
- **Configuration Service:** 0.1 CPU, 256MB RAM
- **MongoDB:** 0.5 CPU, 1GB RAM
- **Redis:** 0.2 CPU, 512MB RAM
- **Nginx:** 0.1 CPU, 256MB RAM
- **Frontend:** 0.1 CPU, 256MB RAM
- **Total:** 1.8 CPU, 4.5GB RAM (fits in 2 CPU, 4GB RAM with overhead)

---

## 🔄 Scalability Considerations

### **Horizontal Scaling:**
- **Manual Scaling** - Adjust replicas in Docker Compose
- **Load Balancing** - Basic load balancing (Nginx)
- **Service Discovery** - Docker network service discovery

### **Vertical Scaling:**
- **Resource Limits** - Adjust resource limits in Docker Compose
- **Instance Size** - Upgrade VM instance size if needed

### **When to Scale:**
- **Traffic Exceeds 1,000 users/month** - Scale to Cluster 2
- **Need Auto-Scaling** - Scale to Cluster 2 (Kubernetes)
- **Need Message Persistence** - Scale to Cluster 2 (Kafka)
- **Need Better Monitoring** - Scale to Cluster 2 (Grafana Cloud)

---

## 📋 Architecture Diagram

### **Component Diagram:**
```
Frontend (Angular)
    ↓
API Gateway (Nginx)
    ↓
Backend Services (Spring Boot / Node.js)
    ↓
Data Storage (MongoDB, Redis)
    ↓
Message Queue (Redis Pub/Sub)
```

### **Deployment Diagram:**
```
Single Server/VM (2 CPU, 4GB RAM)
    ├── Docker Compose
    │   ├── Frontend (Angular)
    │   ├── API Gateway (Nginx)
    │   ├── Auth Service (Spring Boot)
    │   ├── Profile Service (Spring Boot)
    │   ├── Leaderboard Service (Spring Boot)
    │   ├── Matchmaking Service (Node.js)
    │   ├── Game Engine Service (Node.js)
    │   ├── Configuration Service (Spring Boot)
    │   ├── MongoDB
    │   └── Redis
    └── GitHub Actions (CI/CD)
```

---

## ✅ Key Takeaways

### **Architecture Characteristics:**
1. **Simple** - Docker Compose orchestration
2. **Cost-Effective** - Free tiers and self-hosted solutions
3. **Scalable** - Easy to scale when traffic increases
4. **Maintainable** - Easy to maintain and update

### **Component Choices:**
1. **Docker Compose** - Simpler than Kubernetes
2. **Redis Pub/Sub** - Simpler than Kafka
3. **Self-Hosted** - MongoDB, Redis, Nginx
4. **Free Tiers** - MongoDB Atlas, Redis Cloud, Grafana Cloud

### **Resource Requirements:**
1. **Compute:** 2 CPU, 4GB RAM (single server/VM)
2. **Database:** 512MB storage (MongoDB Atlas free tier)
3. **Cache:** 30MB memory (Redis Cloud free tier)
4. **Cost:** $0-10/month

---

## 📚 Related Documentation

- **[Cluster 1: Student/Minimal README](./README.md)** - Cluster overview
- **[Cluster 1: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 1: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 1: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 1: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 2
- **[Cluster 1: Quick Start](./QUICK_START.md)** - Quick start guide
- **[High-Level Design (HLD)](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md)** - System architecture reference

---

**Status:** ✅ Cluster 1 Architecture Documentation Ready

**Last Updated:** 2024

