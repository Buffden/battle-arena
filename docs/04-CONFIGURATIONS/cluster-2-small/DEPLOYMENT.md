# 📈 Cluster 2: Small Scale - Deployment Guide
## Battle Arena - Small Scale Deployment for Growing Applications

**Traffic:** 1,000-10,000 users/day  
**Cost:** $10-110/month  
**Target:** Small applications, MVPs, growing applications  
**Status:** ✅ Ready for Implementation

---

## 🚀 Deployment Overview

### **Deployment Strategy:**
- **Docker Compose** - Simple orchestration (recommended) OR Kubernetes (optional)
- **Small VMs** - Single server/VM (2-4 CPU, 4-8GB RAM) OR multiple servers/VMs
- **Managed Services** - MongoDB Atlas, Redis Cloud (free tier or paid tier)
- **Self-Hosted** - Self-hosted services (MongoDB, Redis, Nginx) OR managed services
- **Monitoring** - Grafana Cloud free tier (10k metrics, 50GB logs)
- **Updates** - Manual deployment updates OR automated updates (with CI/CD)

### **Deployment Options:**
1. **Docker Compose (Recommended)** - Simple orchestration on small VMs
2. **Kubernetes (Optional)** - Kubernetes cluster for auto-scaling
3. **Hybrid** - Docker Compose with managed services (MongoDB Atlas, Redis Cloud)

---

## 📋 Prerequisites

### **1. Docker Compose Deployment:**
- Docker and Docker Compose installed
- Small VM (2-4 CPU, 4-8GB RAM)
- Git installed
- Domain name (optional, for SSL certificates)

### **2. Kubernetes Deployment:**
- Kubernetes cluster (1-2 nodes, 2-4 CPU, 4-8GB RAM per node)
- kubectl installed
- Docker and Docker Compose installed
- Git installed
- Domain name (optional, for SSL certificates)

### **3. Managed Services:**
- MongoDB Atlas account (free tier or paid tier)
- Redis Cloud account (free tier or paid tier)
- Grafana Cloud account (free tier)
- GitHub account (for CI/CD)

---

## 🏗️ Deployment Architecture

### **Option 1: Docker Compose (Recommended)**

#### **Single VM Deployment:**
```
Small VM (2-4 CPU, 4-8GB RAM)
    ├── Docker Compose
    │   ├── Frontend (Angular) - Port 4200
    │   ├── API Gateway (Nginx) - Port 80, 443
    │   ├── Auth Service (Spring Boot) - Port 8081
    │   ├── Profile Service (Spring Boot) - Port 8082
    │   ├── Leaderboard Service (Spring Boot) - Port 8083
    │   ├── Matchmaking Service (Node.js) - Port 3002
    │   ├── Game Engine Service (Node.js) - Port 3003
    │   ├── Configuration Service (Spring Boot) - Port 8084
    │   ├── MongoDB - Port 27017 (OR MongoDB Atlas)
    │   └── Redis - Port 6379 (OR Redis Cloud)
    └── GitHub Actions (CI/CD)
```

#### **Multiple VM Deployment:**
```
VM 1 (2-4 CPU, 4-8GB RAM)
    ├── Frontend (Angular)
    ├── API Gateway (Nginx)
    └── Backend Services (Spring Boot / Node.js)

VM 2 (2-4 CPU, 4-8GB RAM)
    ├── MongoDB (self-hosted OR MongoDB Atlas)
    └── Redis (self-hosted OR Redis Cloud)
```

### **Option 2: Kubernetes (Optional)**

#### **Kubernetes Cluster Deployment:**
```
Kubernetes Cluster (1-2 nodes, 2-4 CPU, 4-8GB RAM per node)
    ├── Frontend Pods (Angular)
    ├── API Gateway Pods (Nginx)
    ├── Auth Service Pods (Spring Boot)
    ├── Profile Service Pods (Spring Boot)
    ├── Leaderboard Service Pods (Spring Boot)
    ├── Matchmaking Service Pods (Node.js)
    ├── Game Engine Service Pods (Node.js)
    ├── Configuration Service Pods (Spring Boot)
    ├── MongoDB (MongoDB Atlas OR self-hosted)
    └── Redis (Redis Cloud OR self-hosted)
```

---

## 📦 Docker Compose Configuration

### **docker-compose.yml (Single VM):**
```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build: ./frontend-service
    ports:
      - "4200:4200"
    environment:
      - NODE_ENV=production
      - API_URL=http://localhost:80
      - WS_URL=ws://localhost:80/ws
    replicas: 1-2
    deploy:
      resources:
        limits:
          cpus: '0.2'
          memory: 512M
    depends_on:
      - nginx

  # API Gateway
  nginx:
    image: nginx:latest
    container_name: battle-arena-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployments/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./deployments/nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - battle-arena-network
    replicas: 1-2
    deploy:
      resources:
        limits:
          cpus: '0.2'
          memory: 512M
    depends_on:
      - auth-service
      - profile-service
      - leaderboard-service
      - matchmaking-service
      - game-engine-service
      - configuration-service

  # Auth Service
  auth-service:
    build: ./backend-services/auth-service
    ports:
      - "8081:8081"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    replicas: 1-2
    deploy:
      resources:
        limits:
          cpus: '0.2'
          memory: 512M
    depends_on:
      - mongodb

  # Profile Service
  profile-service:
    build: ./backend-services/user-profile-service
    ports:
      - "8082:8082"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
    replicas: 1-2
    deploy:
      resources:
        limits:
          cpus: '0.2'
          memory: 512M
    depends_on:
      - mongodb
      - redis

  # Leaderboard Service
  leaderboard-service:
    build: ./backend-services/leaderboard-service
    ports:
      - "8083:8083"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
    replicas: 1-2
    deploy:
      resources:
        limits:
          cpus: '0.2'
          memory: 512M
    depends_on:
      - mongodb
      - redis

  # Matchmaking Service
  matchmaking-service:
    build: ./backend-services/matchmaking-service
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
    replicas: 1-2
    deploy:
      resources:
        limits:
          cpus: '0.3'
          memory: 768M
    depends_on:
      - mongodb
      - redis

  # Game Engine Service
  game-engine-service:
    build: ./backend-services/game-engine-service
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
    replicas: 1-2
    deploy:
      resources:
        limits:
          cpus: '0.3'
          memory: 768M
    depends_on:
      - mongodb
      - redis

  # Configuration Service
  configuration-service:
    build: ./backend-services/configuration-service
    ports:
      - "8084:8084"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
    replicas: 1
    deploy:
      resources:
        limits:
          cpus: '0.1'
          memory: 256M
    depends_on:
      - mongodb
      - redis

  # MongoDB (Optional - use MongoDB Atlas instead)
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=battlearena
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 1G

  # Redis (Optional - use Redis Cloud instead)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    deploy:
      resources:
        limits:
          cpus: '0.2'
          memory: 512M

volumes:
  mongodb-data:
  redis-data:
```

---

## ☸️ Kubernetes Configuration (Optional)

### **deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 1-2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: your-registry/auth-service:latest
        ports:
        - containerPort: 8081
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: uri
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 200m
            memory: 512Mi
```

### **service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth-service
  ports:
  - port: 8081
    targetPort: 8081
  type: ClusterIP
```

### **ingress.yaml:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
spec:
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /api/auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 8081
```

---

## 🔧 Nginx Configuration

### **nginx.conf (Advanced):**
```nginx
events {
    worker_connections 1024;
}

http {
    # Upstream services
    upstream auth-service {
        least_conn;
        server auth-service:8081;
        server auth-service:8081 backup;
    }

    upstream profile-service {
        least_conn;
        server profile-service:8082;
        server profile-service:8082 backup;
    }

    upstream leaderboard-service {
        least_conn;
        server leaderboard-service:8083;
        server leaderboard-service:8083 backup;
    }

    upstream matchmaking-service {
        ip_hash; # Sticky sessions for WebSocket
        server matchmaking-service:3002;
        server matchmaking-service:3002 backup;
    }

    upstream game-engine-service {
        ip_hash; # Sticky sessions for WebSocket
        server game-engine-service:3003;
        server game-engine-service:3003 backup;
    }

    upstream configuration-service {
        server configuration-service:8084;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/s;

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Auth Service
        location /api/auth {
            limit_req zone=auth_limit burst=10;
            proxy_pass http://auth-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Profile Service
        location /api/profile {
            limit_req zone=api_limit burst=20;
            proxy_pass http://profile-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Leaderboard Service
        location /api/leaderboard {
            limit_req zone=api_limit burst=20;
            proxy_pass http://leaderboard-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Matchmaking Service
        location /api/matchmaking {
            limit_req zone=api_limit burst=20;
            proxy_pass http://matchmaking-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Game Engine Service
        location /api/game {
            limit_req zone=api_limit burst=20;
            proxy_pass http://game-engine-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Configuration Service
        location /api/config {
            limit_req zone=api_limit burst=20;
            proxy_pass http://configuration-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket Support
        location /ws {
            proxy_pass http://matchmaking-service;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 86400;
        }

        # Health checks
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

## 🚀 Deployment Steps

### **Step 1: Docker Compose Deployment**

1. **Create Cloud VM:**
   ```bash
   # Create small VM (2-4 CPU, 4-8GB RAM)
   # DigitalOcean, Linode, Vultr, AWS Lightsail, etc.
   ```

2. **SSH to VM:**
   ```bash
   ssh user@your-vm-ip
   ```

3. **Install Docker and Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo apt-get install docker-compose-plugin
   ```

4. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd battle-arena
   ```

5. **Create Environment Files:**
   ```bash
   cp .env.example .env
   nano .env
   ```

6. **Start Services:**
   ```bash
   docker-compose up -d
   ```

7. **Verify Services:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### **Step 2: Kubernetes Deployment (Optional)**

1. **Create Kubernetes Cluster:**
   ```bash
   # Create Kubernetes cluster (1-2 nodes, 2-4 CPU, 4-8GB RAM per node)
   # GKE, EKS, AKS, DigitalOcean Kubernetes, etc.
   ```

2. **Install kubectl:**
   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

3. **Configure kubectl:**
   ```bash
   kubectl config set-cluster your-cluster
   kubectl config set-credentials your-user
   kubectl config set-context your-context
   kubectl config use-context your-context
   ```

4. **Deploy Services:**
   ```bash
   kubectl apply -f k8s/
   ```

5. **Verify Services:**
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

---

## 🔐 Security Configuration

### **1. SSL/TLS Certificates:**
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
sudo systemctl enable certbot.timer
```

### **2. Firewall Rules:**
```bash
# Allow HTTP, HTTPS, SSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### **3. Environment Variables:**
```bash
# Store secrets in environment variables
export JWT_SECRET=your-jwt-secret-key
export MONGODB_URI=your-mongodb-connection-string
export REDIS_HOST=your-redis-host
export REDIS_PASSWORD=your-redis-password
```

---

## 📊 Monitoring & Logging

### **Grafana Cloud Configuration:**

1. **Create Grafana Cloud Account:**
   - Sign up at https://grafana.com/auth/sign-up

2. **Get API Keys:**
   - Navigate to API Keys section
   - Create new API key
   - Copy API key and URL

3. **Configure Services:**
   ```bash
   # Update .env with Grafana Cloud credentials
   GRAFANA_CLOUD_API_KEY=your-api-key
   GRAFANA_CLOUD_API_URL=https://your-instance.grafana.net
   GRAFANA_CLOUD_METRICS_ENABLED=true
   GRAFANA_CLOUD_LOGS_ENABLED=true
   ```

4. **View Metrics:**
   - Navigate to Grafana Cloud dashboard
   - View application metrics
   - View infrastructure metrics
   - Set up alerts (optional)

---

## 🔄 Deployment Updates

### **Manual Updates:**
```bash
# Pull latest code
git pull origin main

# Rebuild services
docker-compose build

# Restart services
docker-compose up -d

# Verify services
docker-compose ps
docker-compose logs -f
```

### **Automated Updates (CI/CD):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cluster 2

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
          ssh user@your-vm-ip "cd battle-arena && git pull && docker-compose up -d"
```

---

## ✅ Deployment Checklist

### **Pre-Deployment:**
- [ ] Cloud VM created (2-4 CPU, 4-8GB RAM)
- [ ] Docker and Docker Compose installed
- [ ] Environment files created
- [ ] MongoDB Atlas/Redis Cloud configured (optional)
- [ ] SSL certificates configured (optional)
- [ ] Firewall rules configured
- [ ] GitHub Actions configured (optional)

### **Deployment:**
- [ ] Services started with Docker Compose or Kubernetes
- [ ] Services verified (docker-compose ps or kubectl get pods)
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
- [ ] Configure Grafana Cloud monitoring
- [ ] Document deployment

---

## 📚 Related Documentation

- **[Cluster 2: Small Scale README](./README.md)** - Cluster overview
- **[Cluster 2: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 2: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 2: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 2: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 3
- **[Cluster 2: Quick Start](./QUICK_START.md)** - Quick start guide

---

**Status:** ✅ Cluster 2 Deployment Documentation Ready

**Last Updated:** 2024

