# 📊 Cluster 3: Medium Scale - Architecture
## Battle Arena - Medium Scale Architecture for Growing Applications

**Traffic:** 10,000-100,000 users/day  
**Cost:** $110-545/month  
**Target:** Growing applications, production applications  
**Status:** ✅ Ready for Implementation

---

## 🏗️ Architecture Overview

### **Architecture Principles:**
- **Scalability** - Auto-scaling with Kubernetes HPA/VPA
- **Reliability** - High availability with replication and redundancy
- **Observability** - Comprehensive monitoring, logging, and tracing
- **Performance** - Optimized for high traffic and low latency
- **Maintainability** - Easy to maintain and update

### **Architecture Pattern:**
- **Microservices Architecture** - All services as separate containers
- **Kubernetes Orchestration** - Kubernetes for container orchestration (required)
- **Kafka Message Queue** - Kafka for message queuing (required)
- **Service Mesh** - Service Mesh for service-to-service communication (optional)
- **Self-Hosted Monitoring** - Prometheus, Grafana for monitoring
- **Self-Hosted Logging** - ELK Stack or Loki + Grafana for logging
- **Distributed Tracing** - Jaeger for distributed tracing (optional)

---

## 📦 Component Architecture

### **1. Frontend Service**
- **Technology:** Angular (TypeScript, TailwindCSS, Phaser 3)
- **Port:** 4200
- **Deployment:** Kubernetes pods (2-3 replicas)
- **Scaling:** Auto-scaling with Kubernetes HPA
- **Features:**
  - User authentication
  - Hero selection
  - Matchmaking
  - Gameplay
  - Leaderboard

### **2. API Gateway (Nginx or Kong)**
- **Technology:** Nginx or Kong
- **Port:** 80 (HTTP), 443 (HTTPS)
- **Deployment:** Kubernetes pods (2-3 replicas)
- **Scaling:** Auto-scaling with Kubernetes HPA
- **Features:**
  - Request routing
  - Load balancing (advanced)
  - SSL termination (Let's Encrypt)
  - Rate limiting (advanced)
  - Health checks
  - Sticky sessions (for WebSocket)
  - API versioning
  - Request/response transformation

### **3. Backend Services**

#### **3.1 Auth Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8081
- **Deployment:** Kubernetes pods (2-3 replicas)
- **Scaling:** Auto-scaling with Kubernetes HPA
- **Features:**
  - User registration
  - User login
  - JWT token generation
  - Password encryption
- **Resources:** 0.3 CPU, 512MB RAM (per replica)

#### **3.2 Profile Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8082
- **Deployment:** Kubernetes pods (2-3 replicas)
- **Scaling:** Auto-scaling with Kubernetes HPA
- **Features:**
  - Profile management
  - Score tracking
  - Rank tier calculation
  - Statistics
- **Resources:** 0.3 CPU, 512MB RAM (per replica)

#### **3.3 Leaderboard Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8083
- **Deployment:** Kubernetes pods (2-3 replicas)
- **Scaling:** Auto-scaling with Kubernetes HPA
- **Features:**
  - Leaderboard generation
  - Ranking calculation
  - Filtering (region, hero, weapon)
  - Top players
- **Resources:** 0.3 CPU, 512MB RAM (per replica)

#### **3.4 Matchmaking Service**
- **Technology:** Node.js (Express, Socket.io)
- **Port:** 3002
- **Deployment:** Kubernetes pods (3-5 replicas)
- **Scaling:** Auto-scaling with Kubernetes HPA
- **Features:**
  - Matchmaking queue
  - Hero selection
  - Arena selection
  - Weapon selection
  - Match creation
- **Resources:** 0.5 CPU, 1GB RAM (per replica)

#### **3.5 Game Engine Service**
- **Technology:** Node.js (Express, Socket.io, Matter.js)
- **Port:** 3003
- **Deployment:** Kubernetes pods (3-5 replicas)
- **Scaling:** Auto-scaling with Kubernetes HPA
- **Features:**
  - Game state management
  - Turn management
  - Physics engine
  - Scoring system
  - Win/draw conditions
- **Resources:** 0.5 CPU, 1GB RAM (per replica)

#### **3.6 Configuration Service**
- **Technology:** Spring Boot (Java)
- **Port:** 8084
- **Deployment:** Kubernetes pods (2 replicas)
- **Scaling:** Auto-scaling with Kubernetes HPA
- **Features:**
  - Config file management
  - Rank tier ranges
  - Scoring formulas
  - Game parameters
  - Penalties
- **Resources:** 0.2 CPU, 256MB RAM (per replica)

---

## 🗄️ Data Storage Architecture

### **1. MongoDB**
- **Technology:** MongoDB 6.0+
- **Port:** 27017
- **Deployment:** MongoDB Atlas paid tier (2GB-10GB) OR self-hosted with replication
- **Collections:**
  - Users
  - Profiles
  - Matches
  - Leaderboard
  - Heroes
  - Weapons
  - Arenas
  - ConfigFiles
- **Storage:** 2GB-10GB (paid tier)
- **Replication:** Replica set (3+ nodes) for high availability

### **2. Redis**
- **Technology:** Redis 7.0+
- **Port:** 6379
- **Deployment:** Redis Cloud paid tier (100MB-500MB) OR self-hosted with replication
- **Data Structures:**
  - Sorted Sets - Matchmaking queue (hero-based)
  - Hash - Lobby storage, Arena/Weapon selection, Game state cache
  - String - Cache data, Hero/Weapon/Arena configurations
- **Storage:** 100MB-500MB (paid tier)
- **Replication:** Replica set (3+ nodes) for high availability

---

## 🔄 Message Queue Architecture

### **Apache Kafka (Required)**
- **Technology:** Apache Kafka
- **Purpose:** Inter-service communication, event streaming (with message persistence)
- **Topics:**
  - `matchmaking.events` - Matchmaking events (match found, hero assigned, etc.)
  - `game.events` - Game events (game start, turn updates, game end, etc.)
  - `profile.updates` - Profile update events (score updates, rank changes, etc.)
  - `leaderboard.updates` - Leaderboard update events (rank changes, new entries, etc.)
- **Characteristics:**
  - Message persistence to disk
  - Message replay capability
  - High scalability (millions of messages per second)
  - Fault tolerance (replication)
  - Consumer groups for load balancing
  - Partitioning for parallel processing
- **Clustering:** Kafka cluster (3+ brokers) for high availability
- **Deployment:** Self-hosted (Kubernetes) OR Confluent Cloud paid tier
- **Partitions:** 10-20 partitions per topic (production)
- **Replication:** 3 replicas per partition (production)
- **Retention:** 7-30 days (configurable)

---

## 🌐 Communication Patterns

### **1. Synchronous Communication (REST)**
- **Protocol:** HTTP/HTTPS
- **Format:** JSON
- **Used for:** API calls, service-to-service communication
- **Services:** All backend services
- **Load Balancing:** Kubernetes service load balancing (round-robin, least connections)

### **2. Asynchronous Communication (WebSocket)**
- **Protocol:** WebSocket (WSS in production)
- **Format:** JSON
- **Used for:** Real-time game updates, matchmaking events
- **Services:** Matchmaking Service, Game Engine Service
- **Sticky Sessions:** Kubernetes service sticky sessions (for WebSocket)

### **3. Message Queue (Apache Kafka)**
- **Protocol:** Apache Kafka
- **Format:** JSON
- **Used for:** Inter-service communication, event streaming
- **Services:** All backend services
- **Consumer Groups:** Multiple consumer groups for load balancing
- **Partitioning:** Topic partitioning for parallel processing

---

## 🚀 Deployment Architecture

### **Kubernetes Orchestration (Required)**
- **Orchestration:** Kubernetes
- **Deployment:** Kubernetes cluster (3-5 nodes, 2-4 CPU, 4-8GB RAM per node)
- **Services:** All services as Kubernetes pods
- **Networking:** Kubernetes service discovery and load balancing
- **Scaling:** Auto-scaling (Kubernetes HPA/VPA)
- **Updates:** Rolling updates (zero-downtime deployments)
- **Health Checks:** Liveness, readiness, and startup probes
- **Resource Management:** CPU and memory resource limits and requests

### **Service Mesh (Optional)**
- **Technology:** Istio or Linkerd
- **Purpose:** Service-to-service communication management
- **Features:**
  - Circuit breakers
  - Retry policies
  - Timeout policies
  - Traffic splitting
  - mTLS encryption
  - Observability
- **Deployment:** Kubernetes service mesh
- **When to Use:** Need advanced traffic management, circuit breakers, or mTLS

---

## 🔐 Security Architecture

### **1. Authentication & Authorization**
- **JWT Tokens** - JWT tokens for authentication
- **Password Encryption** - BCrypt for password encryption
- **API Gateway** - JWT validation at gateway level
- **Rate Limiting** - Rate limiting per IP, per user, per API
- **mTLS** - Mutual TLS for service-to-service encryption (with Service Mesh)

### **2. Data Protection**
- **HTTPS** - SSL/TLS certificates (Let's Encrypt)
- **Input Validation** - Input validation in all services
- **SQL Injection Protection** - MongoDB driver protection
- **XSS Protection** - Angular XSS protection
- **CORS** - CORS configuration for frontend
- **Network Policies** - Kubernetes network policies for security

### **3. API Security**
- **Rate Limiting** - Rate limiting per IP, per user, per API
- **CORS** - CORS configuration for frontend
- **API Keys** - API keys for external services
- **Firewall** - Firewall rules for network security
- **Network Policies** - Kubernetes network policies

---

## 📊 Monitoring & Logging Architecture

### **Monitoring (Self-Hosted)**
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **AlertManager** - Alerting on critical issues
- **Metrics:** Application metrics, infrastructure metrics, custom metrics
- **Dashboards:** Pre-built and custom dashboards
- **Alerting:** Alerting on critical issues
- **Cost:** $0/month (self-hosted)

### **Logging (Self-Hosted)**
- **ELK Stack** - Elasticsearch, Logstash, Kibana OR Loki + Grafana
- **Centralized Logging** - Centralized log aggregation from all services
- **Log Retention** - Configurable log retention policies
- **Log Search** - Advanced log search and filtering
- **Log Analytics** - Log analytics and insights
- **Cost:** $0/month (self-hosted)

### **Tracing (Optional)**
- **Jaeger** - Distributed tracing
- **Request Tracing** - Request tracing across services
- **Performance Analysis** - Performance analysis and optimization
- **Service Dependency Mapping** - Service dependency mapping
- **Error Tracking** - Error tracking and debugging
- **Cost:** $0/month (self-hosted)

---

## 🎯 Resource Allocation

### **Service Resource Limits (Per Replica):**
- **Auth Service:** 0.3 CPU, 512MB RAM (2-3 replicas)
- **Profile Service:** 0.3 CPU, 512MB RAM (2-3 replicas)
- **Leaderboard Service:** 0.3 CPU, 512MB RAM (2-3 replicas)
- **Matchmaking Service:** 0.5 CPU, 1GB RAM (3-5 replicas)
- **Game Engine Service:** 0.5 CPU, 1GB RAM (3-5 replicas)
- **Configuration Service:** 0.2 CPU, 256MB RAM (2 replicas)
- **MongoDB:** Managed (MongoDB Atlas) OR self-hosted (1-2 CPU, 2-4GB RAM)
- **Redis:** Managed (Redis Cloud) OR self-hosted (0.5-1 CPU, 1-2GB RAM)
- **Kafka:** Self-hosted (1-2 CPU, 2-4GB RAM per broker, 3+ brokers)
- **Nginx/Kong:** 0.3 CPU, 512MB RAM (2-3 replicas)
- **Frontend:** 0.3 CPU, 512MB RAM (2-3 replicas)
- **Total:** 5-10 CPU, 10-20GB RAM (with 2-5 replicas, fits in 3-5 node Kubernetes cluster)

---

## 🔄 Scalability Considerations

### **Horizontal Scaling:**
- **Auto-Scaling** - Kubernetes HPA/VPA for automatic scaling
- **Load Balancing** - Kubernetes service load balancing
- **Service Discovery** - Kubernetes service discovery
- **Partitioning** - Kafka topic partitioning for parallel processing
- **Consumer Groups** - Kafka consumer groups for load balancing

### **Vertical Scaling:**
- **Resource Limits** - Adjust resource limits in Kubernetes
- **Instance Size** - Upgrade Kubernetes node instance size
- **Database Scaling** - Upgrade MongoDB Atlas or Redis Cloud tier
- **Kafka Scaling** - Add more Kafka brokers to cluster

### **When to Scale:**
- **Traffic Exceeds 100,000 users/day** - Scale to Cluster 4
- **Need Service Mesh** - Scale to Cluster 4 (Service Mesh required)
- **Need Advanced Sharding** - Scale to Cluster 4 (advanced sharding)
- **Need Distributed Tracing** - Scale to Cluster 4 (distributed tracing)
- **Budget Allows** - Scale to Cluster 4 ($545-3,200/month)

---

## 📋 Architecture Diagram

### **Component Diagram:**
```
Frontend (Angular)
    ↓
API Gateway (Nginx/Kong)
    ↓
Service Mesh (Istio/Linkerd, Optional)
    ↓
Backend Services (Spring Boot / Node.js)
    ↓
Data Storage (MongoDB, Redis)
    ↓
Message Queue (Kafka)
    ↓
Monitoring (Prometheus, Grafana)
    ↓
Logging (ELK Stack or Loki + Grafana)
    ↓
Tracing (Jaeger, Optional)
```

### **Deployment Diagram:**
```
Kubernetes Cluster (3-5 nodes, 2-4 CPU, 4-8GB RAM per node)
    ├── Frontend Pods (Angular)
    ├── API Gateway Pods (Nginx/Kong)
    ├── Service Mesh (Istio/Linkerd, Optional)
    ├── Auth Service Pods (Spring Boot)
    ├── Profile Service Pods (Spring Boot)
    ├── Leaderboard Service Pods (Spring Boot)
    ├── Matchmaking Service Pods (Node.js)
    ├── Game Engine Service Pods (Node.js)
    ├── Configuration Service Pods (Spring Boot)
    ├── Kafka Pods (3+ brokers)
    ├── Prometheus (Metrics)
    ├── Grafana (Dashboards)
    ├── ELK Stack or Loki + Grafana (Logging)
    └── Jaeger (Tracing, Optional)
        └── MongoDB (MongoDB Atlas OR self-hosted)
        └── Redis (Redis Cloud OR self-hosted)
```

---

## ✅ Key Takeaways

### **Architecture Characteristics:**
1. **Scalable** - Auto-scaling with Kubernetes HPA/VPA
2. **Reliable** - High availability with replication and redundancy
3. **Observable** - Comprehensive monitoring, logging, and tracing
4. **Performant** - Optimized for high traffic and low latency
5. **Maintainable** - Easy to maintain and update

### **Component Choices:**
1. **Kubernetes** - Required for auto-scaling
2. **Kafka** - Required for message persistence
3. **MongoDB Atlas** - Paid tier (2GB-10GB storage)
4. **Redis Cloud** - Paid tier (100MB-500MB memory)
5. **Prometheus + Grafana** - Self-hosted monitoring
6. **ELK Stack or Loki + Grafana** - Self-hosted logging
7. **Jaeger** - Self-hosted tracing (optional)
8. **Service Mesh** - Istio/Linkerd (optional)

### **Resource Requirements:**
1. **Compute:** 3-5 node Kubernetes cluster (2-4 CPU, 4-8GB RAM per node)
2. **Database:** 2GB-10GB storage (MongoDB Atlas paid tier)
3. **Cache:** 100MB-500MB memory (Redis Cloud paid tier)
4. **Message Queue:** Kafka cluster (3+ brokers)
5. **Cost:** $110-545/month

---

## 📚 Related Documentation

- **[Cluster 3: Medium Scale README](./README.md)** - Cluster overview
- **[Cluster 3: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 3: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 3: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 3: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 4
- **[Cluster 3: Quick Start](./QUICK_START.md)** - Quick start guide
- **[High-Level Design (HLD)](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md)** - System architecture reference

---

**Status:** ✅ Cluster 3 Architecture Documentation Ready

**Last Updated:** 2024

