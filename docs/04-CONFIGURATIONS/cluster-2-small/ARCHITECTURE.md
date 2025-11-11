# 📈 Cluster 2: Small Scale - Architecture
## Battle Arena - Small Scale Architecture for Growing Applications

**Traffic:** 1,000-10,000 users/day  
**Cost:** $10-110/month  
**Target:** Small applications, MVPs, growing applications  
**Status:** ✅ Ready for Implementation

---

## 🏗️ Architecture Overview

### **Architecture Principles:**
- **Scalability** - Easy to scale when traffic increases
- **Cost-Effective** - Optimize costs using free tiers and paid tiers
- **Flexibility** - Support both Docker Compose and Kubernetes
- **Monitoring** - Basic monitoring with Grafana Cloud free tier
- **Maintainability** - Easy to maintain and update

### **Architecture Pattern:**
- **Microservices Architecture** - All services as separate containers
- **Docker Compose** - Simple orchestration (recommended) OR Kubernetes (optional)
- **Redis Pub/Sub** - Simple message queuing (recommended) OR Kafka (optional, for message persistence)
- **Managed Services** - MongoDB Atlas, Redis Cloud (free tier or paid tier)
- **Self-Hosted** - Self-hosted services (MongoDB, Redis, Nginx) OR managed services
- **Monitoring** - Grafana Cloud free tier (10k metrics, 50GB logs)

---

## 📦 Component Architecture

### **1. Frontend Service**
- **Technology:** Angular (TypeScript, TailwindCSS, Phaser 3)
- **Port:** 4200
- **Deployment:** Docker container
- **Scaling:** 1-2 replicas (optional)
- **Features:**
  - User authentication
  - Hero selection
  - Matchmaking
  - Gameplay
  - Leaderboard

### **2. API Gateway (Nginx)**
- **Technology:** Nginx
- **Port:** 80 (HTTP), 443 (HTTPS)
- **Deployment:** Docker container (1-2 replicas)
- **Features:**
  - Request routing
  - Load balancing (basic to advanced)
  - SSL termination (Let's Encrypt)
  - Rate limiting (basic to advanced)
  - Health checks
  - Sticky sessions (for WebSocket)

### **3. Backend Services**

#### **3.1 Auth Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8081
- **Deployment:** Docker container (1-2 replicas)
- **Features:**
  - User registration
  - User login
  - JWT token generation
  - Password encryption
- **Resources:** 0.2 CPU, 512MB RAM (per replica)

#### **3.2 Profile Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8082
- **Deployment:** Docker container (1-2 replicas)
- **Features:**
  - Profile management
  - Score tracking
  - Rank tier calculation
  - Statistics
- **Resources:** 0.2 CPU, 512MB RAM (per replica)

#### **3.3 Leaderboard Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8083
- **Deployment:** Docker container (1-2 replicas)
- **Features:**
  - Leaderboard generation
  - Ranking calculation
  - Filtering (region, hero, weapon)
  - Top players
- **Resources:** 0.2 CPU, 512MB RAM (per replica)

#### **3.4 Matchmaking Service**
- **Technology:** Node.js (Express, Socket.io)
- **Port:** 3002
- **Deployment:** Docker container (1-2 replicas)
- **Features:**
  - Matchmaking queue
  - Hero selection
  - Arena selection
  - Weapon selection
  - Match creation
- **Resources:** 0.3 CPU, 768MB RAM (per replica)

#### **3.5 Game Engine Service**
- **Technology:** Node.js (Express, Socket.io, Matter.js)
- **Port:** 3003
- **Deployment:** Docker container (1-2 replicas)
- **Features:**
  - Game state management
  - Turn management
  - Physics engine
  - Scoring system
  - Win/draw conditions
- **Resources:** 0.3 CPU, 768MB RAM (per replica)

#### **3.6 Configuration Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8084
- **Deployment:** Docker container (1 replica)
- **Features:**
  - Config file management
  - Rank tier ranges
  - Scoring formulas
  - Game parameters
  - Penalties
- **Resources:** 0.1 CPU, 256MB RAM

---

## 🗄️ Data Storage Architecture

### **1. MongoDB**
- **Technology:** MongoDB 6.0+
- **Port:** 27017
- **Deployment:** MongoDB Atlas free tier (512MB) OR paid tier (up to 2GB) OR self-hosted
- **Collections:**
  - Users
  - Profiles
  - Matches
  - Leaderboard
  - Heroes
  - Weapons
  - Arenas
  - ConfigFiles
- **Storage:** 512MB-2GB (free tier or paid tier)
- **Replication:** Single instance (free tier) OR replica set (paid tier, optional)

### **2. Redis**
- **Technology:** Redis 7.0+
- **Port:** 6379
- **Deployment:** Redis Cloud free tier (30MB) OR paid tier (up to 100MB) OR self-hosted
- **Data Structures:**
  - Sorted Sets - Matchmaking queue (hero-based)
  - Hash - Lobby storage, Arena/Weapon selection, Game state cache
  - String - Cache data, Hero/Weapon/Arena configurations
  - Pub/Sub - Message queuing (inter-service communication, if using Redis Pub/Sub)
- **Storage:** 30MB-100MB (free tier or paid tier)
- **Replication:** Single instance (free tier) OR replica set (paid tier, optional)

---

## 🔄 Message Queue Architecture

### **Option 1: Redis Pub/Sub (Recommended)**
- **Technology:** Redis Pub/Sub
- **Purpose:** Inter-service communication, event streaming
- **Channels:**
  - `matchmaking:events` - Matchmaking events (match found, hero assigned, etc.)
  - `game:events` - Game events (game start, turn updates, game end, etc.)
  - `profile:updates` - Profile update events (score updates, rank changes, etc.)
  - `leaderboard:updates` - Leaderboard update events (rank changes, new entries, etc.)
- **Characteristics:**
  - No message persistence (acceptable for small scale)
  - No message replay (acceptable for small scale)
  - Sufficient for 1,000-10,000 users/day
  - Simple setup, no additional infrastructure
  - Free (uses existing Redis instance)

### **Option 2: Apache Kafka (Optional)**
- **Technology:** Apache Kafka
- **Purpose:** Inter-service communication, event streaming (with message persistence)
- **Topics:**
  - `matchmaking.events` - Matchmaking events
  - `game.events` - Game events
  - `profile.updates` - Profile update events
  - `leaderboard.updates` - Leaderboard update events
- **Characteristics:**
  - Message persistence to disk
  - Message replay capability
  - High scalability
  - Fault tolerance (replication)
  - Consumer groups for load balancing
- **Deployment:** Self-hosted (single broker) OR Confluent Cloud free tier (5GB/month)
- **When to Use:** Need message persistence, message replay, or preparing for higher traffic

---

## 🌐 Communication Patterns

### **1. Synchronous Communication (REST)**
- **Protocol:** HTTP/HTTPS
- **Format:** JSON
- **Used for:** API calls, service-to-service communication
- **Services:** All backend services
- **Load Balancing:** Nginx load balancing (round-robin, least connections)

### **2. Asynchronous Communication (WebSocket)**
- **Protocol:** WebSocket (WSS in production)
- **Format:** JSON
- **Used for:** Real-time game updates, matchmaking events
- **Services:** Matchmaking Service, Game Engine Service
- **Sticky Sessions:** Nginx sticky sessions (for WebSocket)

### **3. Message Queue (Redis Pub/Sub or Kafka)**
- **Protocol:** Redis Pub/Sub OR Apache Kafka
- **Format:** JSON
- **Used for:** Inter-service communication, event streaming
- **Services:** All backend services
- **Choice:** Redis Pub/Sub (recommended) OR Kafka (optional, for message persistence)

---

## 🚀 Deployment Architecture

### **Option 1: Docker Compose (Recommended)**
- **Orchestration:** Docker Compose
- **Deployment:** Single server/VM (2-4 CPU, 4-8GB RAM) OR multiple servers/VMs
- **Services:** All services in Docker Compose
- **Networking:** Docker network for service communication
- **Scaling:** Manual scaling (adjust replicas in Docker Compose) OR automatic scaling (with external tools)
- **Updates:** Manual deployment updates OR automated updates (with CI/CD)

### **Option 2: Kubernetes (Optional)**
- **Orchestration:** Kubernetes
- **Deployment:** Kubernetes cluster (1-2 nodes, 2-4 CPU, 4-8GB RAM per node)
- **Services:** All services as Kubernetes pods
- **Networking:** Kubernetes service discovery and load balancing
- **Scaling:** Manual scaling (adjust replicas) OR auto-scaling (HPA, optional)
- **Updates:** Rolling updates (zero-downtime deployments)

---

## 🔐 Security Architecture

### **1. Authentication & Authorization**
- **JWT Tokens** - JWT tokens for authentication
- **Password Encryption** - BCrypt for password encryption
- **API Gateway** - JWT validation at gateway level (optional)
- **Rate Limiting** - Rate limiting per IP, per user (Nginx)

### **2. Data Protection**
- **HTTPS** - SSL/TLS certificates (Let's Encrypt)
- **Input Validation** - Input validation in all services
- **SQL Injection Protection** - MongoDB driver protection
- **XSS Protection** - Angular XSS protection
- **CORS** - CORS configuration for frontend

### **3. API Security**
- **Rate Limiting** - Rate limiting per IP, per user, per API (Nginx)
- **CORS** - CORS configuration for frontend
- **API Keys** - API keys for external services (optional)
- **Firewall** - Firewall rules for network security

---

## 📊 Monitoring & Logging Architecture

### **Monitoring (Grafana Cloud Free Tier)**
- **Grafana Cloud Free Tier** - 10k metrics, 50GB logs
- **Metrics:** Application metrics, infrastructure metrics, custom metrics
- **Dashboards:** Pre-built and custom dashboards
- **Alerting:** Basic alerting (optional)
- **Cost:** $0/month (free tier)

### **Logging (Grafana Cloud Free Tier)**
- **Grafana Cloud Free Tier** - 50GB logs
- **Logs:** Application logs, infrastructure logs
- **Log Search:** Basic log search and filtering
- **Log Retention:** Configurable log retention
- **Cost:** $0/month (free tier)

### **Tracing (Optional)**
- **Skip Tracing** - Skip distributed tracing (not needed for small scale)
- **When to Add:** When traffic increases or need performance analysis

---

## 🎯 Resource Allocation

### **Service Resource Limits (Per Replica):**
- **Auth Service:** 0.2 CPU, 512MB RAM (1-2 replicas)
- **Profile Service:** 0.2 CPU, 512MB RAM (1-2 replicas)
- **Leaderboard Service:** 0.2 CPU, 512MB RAM (1-2 replicas)
- **Matchmaking Service:** 0.3 CPU, 768MB RAM (1-2 replicas)
- **Game Engine Service:** 0.3 CPU, 768MB RAM (1-2 replicas)
- **Configuration Service:** 0.1 CPU, 256MB RAM (1 replica)
- **MongoDB:** 0.5-1 CPU, 1-2GB RAM (self-hosted) OR managed (MongoDB Atlas)
- **Redis:** 0.2-0.5 CPU, 512MB-1GB RAM (self-hosted) OR managed (Redis Cloud)
- **Nginx:** 0.2 CPU, 512MB RAM (1-2 replicas)
- **Frontend:** 0.2 CPU, 512MB RAM (1-2 replicas)
- **Total:** 2.2-4.4 CPU, 5.5-11GB RAM (with 1-2 replicas, fits in 2-4 CPU, 4-8GB RAM VMs)

---

## 🔄 Scalability Considerations

### **Horizontal Scaling:**
- **Manual Scaling** - Adjust replicas in Docker Compose or Kubernetes
- **Load Balancing** - Nginx load balancing (round-robin, least connections)
- **Service Discovery** - Docker network service discovery OR Kubernetes service discovery
- **Auto-Scaling** - Kubernetes HPA (optional, for auto-scaling)

### **Vertical Scaling:**
- **Resource Limits** - Adjust resource limits in Docker Compose or Kubernetes
- **Instance Size** - Upgrade VM instance size if needed
- **Database Scaling** - Upgrade MongoDB Atlas or Redis Cloud tier if needed

### **When to Scale:**
- **Traffic Exceeds 10,000 users/day** - Scale to Cluster 3
- **Need Advanced Features** - Scale to Cluster 3 (Kubernetes required, Kafka required)
- **Need Better Monitoring** - Scale to Cluster 3 (self-hosted monitoring)
- **Budget Allows** - Scale to Cluster 3 ($110-545/month)

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
Message Queue (Redis Pub/Sub OR Kafka)
    ↓
Monitoring (Grafana Cloud)
```

### **Deployment Diagram:**
```
Small VMs (2-4 CPU, 4-8GB RAM)
    ├── Docker Compose OR Kubernetes
    │   ├── Frontend (Angular)
    │   ├── API Gateway (Nginx)
    │   ├── Auth Service (Spring Boot)
    │   ├── Profile Service (Spring Boot)
    │   ├── Leaderboard Service (Spring Boot)
    │   ├── Matchmaking Service (Node.js)
    │   ├── Game Engine Service (Node.js)
    │   ├── Configuration Service (Spring Boot)
    │   ├── MongoDB (self-hosted OR MongoDB Atlas)
    │   └── Redis (self-hosted OR Redis Cloud)
    └── GitHub Actions (CI/CD)
        └── Grafana Cloud (Monitoring)
```

---

## ✅ Key Takeaways

### **Architecture Characteristics:**
1. **Scalable** - Easy to scale when traffic increases
2. **Cost-Effective** - Optimize costs using free tiers and paid tiers
3. **Flexible** - Support both Docker Compose and Kubernetes
4. **Monitored** - Basic monitoring with Grafana Cloud free tier

### **Component Choices:**
1. **Docker Compose** - Recommended (simpler) OR Kubernetes (optional, for auto-scaling)
2. **Redis Pub/Sub** - Recommended (simpler) OR Kafka (optional, for message persistence)
3. **MongoDB Atlas** - Free tier (512MB) OR paid tier (up to 2GB)
4. **Redis Cloud** - Free tier (30MB) OR paid tier (up to 100MB)
5. **Grafana Cloud** - Free tier (10k metrics, 50GB logs)

### **Resource Requirements:**
1. **Compute:** 2-4 CPU, 4-8GB RAM (small VMs)
2. **Database:** 512MB-2GB storage (MongoDB Atlas free tier or paid tier)
3. **Cache:** 30MB-100MB memory (Redis Cloud free tier or paid tier)
4. **Cost:** $10-110/month

---

## 📚 Related Documentation

- **[Cluster 2: Small Scale README](./README.md)** - Cluster overview
- **[Cluster 2: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 2: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 2: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 2: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 3
- **[Cluster 2: Quick Start](./QUICK_START.md)** - Quick start guide
- **[High-Level Design (HLD)](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md)** - System architecture reference

---

**Status:** ✅ Cluster 2 Architecture Documentation Ready

**Last Updated:** 2024

