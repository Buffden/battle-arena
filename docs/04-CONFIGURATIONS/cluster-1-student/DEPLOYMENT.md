# 🎓 Cluster 1: Student/Minimal - Deployment Guide
## Battle Arena - Ultra Low-Cost Deployment for Student Projects

**Traffic:** <1,000 users/month  
**Cost:** $0-10/month  
**Target:** Student projects, learning, prototyping  
**Status:** ✅ Ready for Implementation

---

## 🚀 Deployment Overview

### **Deployment Strategy:**
- **Docker Compose** - Simple orchestration (no Kubernetes)
- **Single Server/VM** - All services on single server/VM (2 CPU, 4GB RAM)
- **Self-Hosted** - Self-hosted services (MongoDB, Redis, Nginx)
- **Free Tiers** - Free tiers for all components
- **Manual Updates** - Manual deployment updates (acceptable for student projects)

### **Deployment Options:**
1. **Local Development** - Docker Compose on local machine ($0/month)
2. **Cloud VM** - Small cloud VM ($5-10/month)
3. **Free Tiers** - All free tiers ($0/month)

---

## 📋 Prerequisites

### **1. Local Development:**
- Docker and Docker Compose installed
- Git installed
- Code editor (VS Code, IntelliJ, etc.)
- 8GB RAM (for local development)

### **2. Cloud Deployment:**
- Cloud account (AWS, GCP, Azure, DigitalOcean, etc.)
- Small VM (2 CPU, 4GB RAM)
- Docker and Docker Compose installed on VM
- Domain name (optional, for SSL certificates)

### **3. Free Tiers:**
- MongoDB Atlas account (free tier: 512MB)
- Redis Cloud account (free tier: 30MB)
- GitHub account (for CI/CD)
- Grafana Cloud account (optional, free tier: 10k metrics, 50GB logs)

---

## 🏗️ Deployment Architecture

### **Local Development:**
```
Local Machine
    ├── Docker Compose
    │   ├── Frontend (Angular) - Port 4200
    │   ├── API Gateway (Nginx) - Port 80
    │   ├── Auth Service (Spring Boot) - Port 8081
    │   ├── Profile Service (Spring Boot) - Port 8082
    │   ├── Leaderboard Service (Spring Boot) - Port 8083
    │   ├── Matchmaking Service (Node.js) - Port 3002
    │   ├── Game Engine Service (Node.js) - Port 3003
    │   ├── Configuration Service (Spring Boot) - Port 8084
    │   ├── MongoDB - Port 27017
    │   └── Redis - Port 6379
    └── GitHub Actions (CI/CD)
```

### **Cloud Deployment:**
```
Cloud VM (2 CPU, 4GB RAM)
    ├── Docker Compose
    │   ├── Frontend (Angular) - Port 4200
    │   ├── API Gateway (Nginx) - Port 80, 443
    │   ├── Auth Service (Spring Boot) - Port 8081
    │   ├── Profile Service (Spring Boot) - Port 8082
    │   ├── Leaderboard Service (Spring Boot) - Port 8083
    │   ├── Matchmaking Service (Node.js) - Port 3002
    │   ├── Game Engine Service (Node.js) - Port 3003
    │   ├── Configuration Service (Spring Boot) - Port 8084
    │   ├── MongoDB - Port 27017 (OR MongoDB Atlas free tier)
    │   └── Redis - Port 6379 (OR Redis Cloud free tier)
    └── GitHub Actions (CI/CD)
```

---

## 📦 Docker Compose Configuration

### **docker-compose.yml:**

**Note:** See the actual implementation in the root `docker-compose.yml` file for the current configuration. The example below shows a simplified structure.

Key changes from the actual implementation:
- Image versions: `mongo:6.0` (not `:latest`), `redis:7-alpine` (not `:latest`)
- Nginx config path: `./deployments/nginx/nginx.conf` (not `./nginx/nginx.conf`)
- Network: `battle-arena-network` for service communication
- Services use service names for communication (e.g., `mongodb:27017`, not `localhost:27017`)

```yaml
services:
  # API Gateway
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployments/nginx/nginx.conf:/etc/nginx/nginx.conf
    networks:
      - battle-arena-network
    depends_on:
      - mongodb
      - redis

  # MongoDB
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=battlearena
    networks:
      - battle-arena-network

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - battle-arena-network

  # Backend services (commented out, enabled as implemented)
  # auth-service, profile-service, leaderboard-service, etc.

volumes:
  mongodb-data:
  redis-data:

networks:
  battle-arena-network:
    driver: bridge
```

---

## 🔧 Nginx Configuration

### **nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream auth-service {
        server auth-service:8081;
    }

    upstream profile-service {
        server profile-service:8082;
    }

    upstream leaderboard-service {
        server leaderboard-service:8083;
    }

    upstream matchmaking-service {
        server matchmaking-service:3002;
    }

    upstream game-engine-service {
        server game-engine-service:3003;
    }

    upstream configuration-service {
        server configuration-service:8084;
    }

    server {
        listen 80;
        server_name localhost;

        # Auth Service
        location /api/auth {
            proxy_pass http://auth-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Profile Service
        location /api/profile {
            proxy_pass http://profile-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Leaderboard Service
        location /api/leaderboard {
            proxy_pass http://leaderboard-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Matchmaking Service
        location /api/matchmaking {
            proxy_pass http://matchmaking-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Game Engine Service
        location /api/game {
            proxy_pass http://game-engine-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Configuration Service
        location /api/config {
            proxy_pass http://configuration-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # WebSocket Support
        location /ws {
            proxy_pass http://matchmaking-service;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

---

## 🚀 Deployment Steps

### **Step 1: Local Development Setup**

1. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd battle-arena
   ```

2. **Create Environment Files:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Services:**
   ```bash
   docker-compose up -d
   ```

4. **Verify Services:**
   ```bash
   docker-compose ps
   ```

5. **Access Application:**
   - Frontend: http://localhost:4200
   - API Gateway: http://localhost:80
   - MongoDB: localhost:27017
   - Redis: localhost:6379

### **Step 2: Cloud Deployment Setup**

1. **Create Cloud VM:**
   - Create small VM (2 CPU, 4GB RAM)
   - Install Docker and Docker Compose
   - Configure firewall rules

2. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd battle-arena
   ```

3. **Create Environment Files:**
   ```bash
   cp .env.example .env
   # Edit .env with your cloud configuration
   ```

4. **Start Services:**
   ```bash
   docker-compose up -d
   ```

5. **Configure SSL (Optional):**
   ```bash
   # Install Certbot
   sudo apt-get install certbot
   
   # Generate SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

6. **Verify Services:**
   ```bash
   docker-compose ps
   ```

### **Step 3: Free Tiers Setup**

1. **MongoDB Atlas:**
   - Create MongoDB Atlas account
   - Create free tier cluster (512MB)
   - Get connection string
   - Update `.env` with connection string

2. **Redis Cloud:**
   - Create Redis Cloud account
   - Create free tier database (30MB)
   - Get connection string
   - Update `.env` with connection string

3. **Grafana Cloud (Optional):**
   - Create Grafana Cloud account
   - Get API keys
   - Update `.env` with API keys

---

## 🔄 Deployment Updates

### **Manual Updates:**
1. **Pull Latest Code:**
   ```bash
   git pull origin main
   ```

2. **Rebuild Services:**
   ```bash
   docker-compose build
   ```

3. **Restart Services:**
   ```bash
   docker-compose up -d
   ```

4. **Verify Services:**
   ```bash
   docker-compose ps
   ```

### **CI/CD (GitHub Actions):**
1. **Create GitHub Actions Workflow:**
   ```yaml
   name: Deploy to Cluster 1
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to VM
           run: |
             # SSH to VM and deploy
             ssh user@vm "cd battle-arena && git pull && docker-compose up -d"
   ```

---

## 🔐 Security Configuration

### **1. SSL/TLS Certificates:**
- **Let's Encrypt** - Free SSL certificates
- **Certbot** - Automatic certificate renewal
- **Nginx** - SSL termination

### **2. Firewall Rules:**
- **Port 80** - HTTP (redirect to HTTPS)
- **Port 443** - HTTPS
- **Port 22** - SSH (restrict to specific IPs)
- **Block all other ports**

### **3. Environment Variables:**
- **Secrets** - Store secrets in environment variables
- **.env file** - Don't commit .env file to Git
- **Secrets Management** - Use Docker secrets or environment variables

---

## 📊 Monitoring & Logging

### **Monitoring (Optional):**
- **Grafana Cloud Free Tier** - 10k metrics, 50GB logs
- **Self-Hosted** - Skip monitoring initially (acceptable for student projects)

### **Logging (Optional):**
- **Grafana Cloud Free Tier** - 50GB logs
- **Self-Hosted** - Skip logging initially (acceptable for student projects)
- **Docker Logs** - Use `docker-compose logs` for basic logging

### **Health Checks:**
- **Docker Health Checks** - Basic health checks in Docker Compose
- **Nginx Health Checks** - Health check endpoints in Nginx
- **Service Health Checks** - Health check endpoints in services

---

## 🔄 Scaling Strategy

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

---

## ✅ Deployment Checklist

### **Pre-Deployment:**
- [ ] Docker and Docker Compose installed
- [ ] Environment files created
- [ ] SSL certificates configured (optional)
- [ ] Firewall rules configured
- [ ] MongoDB/Redis configured (free tiers or self-hosted)
- [ ] GitHub Actions configured (optional)

### **Deployment:**
- [ ] Services started with Docker Compose
- [ ] Services verified (docker-compose ps)
- [ ] Health checks passing
- [ ] SSL certificates working (optional)
- [ ] API Gateway routing correctly
- [ ] Frontend accessible

### **Post-Deployment:**
- [ ] Monitor services for errors
- [ ] Check logs for issues
- [ ] Verify all endpoints working
- [ ] Test authentication
- [ ] Test matchmaking
- [ ] Test gameplay
- [ ] Document deployment

---

## 📚 Related Documentation

- **[Cluster 1: Student/Minimal README](./README.md)** - Cluster overview
- **[Cluster 1: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 1: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 1: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 1: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 2
- **[Cluster 1: Quick Start](./QUICK_START.md)** - Quick start guide

---

**Status:** ✅ Cluster 1 Deployment Documentation Ready

**Last Updated:** 2024

