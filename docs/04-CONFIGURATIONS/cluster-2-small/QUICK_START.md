# 📈 Cluster 2: Small Scale - Quick Start Guide
## Battle Arena - Small Scale Quick Start for Growing Applications

**Traffic:** 1,000-10,000 users/day  
**Cost:** $10-110/month  
**Target:** Small applications, MVPs, growing applications  
**Status:** ✅ Ready for Implementation

---

## 🚀 Quick Start Overview

### **Prerequisites:**
- Docker and Docker Compose installed
- Kubernetes cluster (optional)
- GitHub account (for CI/CD)
- Cloud account (for deployment)
- MongoDB Atlas account (free tier or paid tier)
- Redis Cloud account (free tier or paid tier)
- Grafana Cloud account (free tier)

### **Time to Deploy:**
- **Docker Compose:** 15-20 minutes
- **Kubernetes:** 20-30 minutes
- **Managed Services Setup:** 10-15 minutes

---

## 📦 Step 1: Clone Repository

```bash
# Clone repository
git clone <repository-url>
cd battle-arena

# Check Docker and Docker Compose
docker --version
docker-compose --version

# Check Kubernetes (optional)
kubectl version --client
```

---

## ⚙️ Step 2: Configure Environment

### **Create .env file:**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### **.env file contents:**
```bash
# Environment
NODE_ENV=production
SPRING_PROFILES_ACTIVE=prod

# MongoDB (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
# OR self-hosted
# MONGODB_URI=mongodb://mongodb:27017/battlearena

# Redis (Redis Cloud recommended)
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
# OR self-hosted
# REDIS_HOST=redis
# REDIS_PORT=6379
# REDIS_PASSWORD=

# Kafka (Optional)
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=battle-arena
KAFKA_GROUP_ID=battle-arena-group

# JWT
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRATION=86400000

# Google OAuth (Optional - for Story-2.7)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback

# Services
AUTH_SERVICE_PORT=8081
PROFILE_SERVICE_PORT=8082
LEADERBOARD_SERVICE_PORT=8083
MATCHMAKING_SERVICE_PORT=3002
GAME_ENGINE_SERVICE_PORT=3003
CONFIGURATION_SERVICE_PORT=8084

# Frontend
FRONTEND_PORT=4200
API_URL=https://your-domain.com
WS_URL=wss://your-domain.com/ws

# Grafana Cloud
GRAFANA_CLOUD_API_KEY=your-api-key
GRAFANA_CLOUD_API_URL=https://your-instance.grafana.net
GRAFANA_CLOUD_METRICS_ENABLED=true
GRAFANA_CLOUD_LOGS_ENABLED=true
```

---

## 🐳 Step 3: Start Services (Docker Compose)

### **Start all services:**
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### **Verify services:**
```bash
# Check MongoDB
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
# OR MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/battlearena"

# Check Redis
docker-compose exec redis redis-cli ping
# OR Redis Cloud
redis-cli -h your-redis-host.redis.cloud -p 12345 -a your-redis-password ping

# Check services
curl http://localhost:80/api/auth/health
curl http://localhost:80/api/profile/health
curl http://localhost:80/api/leaderboard/health
```

---

## ☸️ Step 4: Start Services (Kubernetes, Optional)

### **Deploy to Kubernetes:**
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# View logs
kubectl logs -f deployment/auth-service
```

### **Verify services:**
```bash
# Check pods status
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# Test API endpoints
curl https://your-domain.com/api/auth/health
curl https://your-domain.com/api/profile/health
curl https://your-domain.com/api/leaderboard/health
```

---

## 🌐 Step 5: Access Application

### **Local Development:**
- **Frontend:** http://localhost:4200
- **API Gateway:** http://localhost:80
- **MongoDB:** localhost:27017 (self-hosted) OR MongoDB Atlas
- **Redis:** localhost:6379 (self-hosted) OR Redis Cloud

### **Production:**
- **Frontend:** https://your-domain.com
- **API Gateway:** https://your-domain.com/api
- **MongoDB:** MongoDB Atlas connection string
- **Redis:** Redis Cloud connection string

### **Test API endpoints:**
```bash
# Test auth service
curl https://your-domain.com/api/auth/health

# Test profile service
curl https://your-domain.com/api/profile/health

# Test leaderboard service
curl https://your-domain.com/api/leaderboard/health

# Test matchmaking service
curl https://your-domain.com/api/matchmaking/health

# Test game engine service
curl https://your-domain.com/api/game/health

# Test configuration service
curl https://your-domain.com/api/config/health
```

---

## ☁️ Step 6: Cloud Deployment

### **6.1 Create Cloud VM:**
```bash
# Create small VM (2-4 CPU, 4-8GB RAM)
# DigitalOcean, Linode, Vultr, AWS Lightsail, etc.

# SSH to VM
ssh user@your-vm-ip

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin
```

### **6.2 Deploy to Cloud VM:**
```bash
# Clone repository on VM
git clone <repository-url>
cd battle-arena

# Create .env file
cp .env.example .env
nano .env

# Start services
docker-compose up -d

# Check service status
docker-compose ps
```

### **6.3 Configure SSL:**
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

---

## 🆓 Step 7: Managed Services Setup

### **7.1 MongoDB Atlas (Free Tier or Paid Tier):**
```bash
# 1. Create MongoDB Atlas account
# 2. Create free tier cluster (512MB) OR paid tier cluster (2GB)
# 3. Get connection string
# 4. Update .env with connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
```

### **7.2 Redis Cloud (Free Tier or Paid Tier):**
```bash
# 1. Create Redis Cloud account
# 2. Create free tier database (30MB) OR paid tier database (100MB)
# 3. Get connection string
# 4. Update .env with connection string
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
```

### **7.3 Grafana Cloud (Free Tier):**
```bash
# 1. Create Grafana Cloud account
# 2. Get API keys
# 3. Update .env with API keys
GRAFANA_CLOUD_API_KEY=your-api-key
GRAFANA_CLOUD_API_URL=https://your-instance.grafana.net
GRAFANA_CLOUD_METRICS_ENABLED=true
GRAFANA_CLOUD_LOGS_ENABLED=true
```

---

## ✅ Step 8: Verify Deployment

### **8.1 Health Checks:**
```bash
# Check all services
docker-compose ps
# OR
kubectl get pods

# Check service health
curl https://your-domain.com/api/auth/health
curl https://your-domain.com/api/profile/health
curl https://your-domain.com/api/leaderboard/health
curl https://your-domain.com/api/matchmaking/health
curl https://your-domain.com/api/game/health
curl https://your-domain.com/api/config/health
```

### **8.2 Test Authentication:**
```bash
# Register user
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login user
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### **8.3 Test Frontend:**
```bash
# Open frontend in browser
open https://your-domain.com

# Test authentication
# Test matchmaking
# Test gameplay
# Test leaderboard
```

---

## 🔧 Step 9: Configuration

### **9.1 Update Configurations:**
```bash
# Edit service configurations
nano backend-services/auth-service/src/main/resources/application.yml
nano backend-services/user-profile-service/src/main/resources/application.yml
nano backend-services/leaderboard-service/src/main/resources/application.yml
nano backend-services/matchmaking-service/config.js
nano backend-services/game-engine-service/config.js
nano backend-services/configuration-service/src/main/resources/application.yml
```

### **9.2 Update Nginx Configuration:**
```bash
# Edit Nginx configuration
nano deployments/nginx/nginx.conf

# Restart Nginx
docker-compose restart nginx
# OR
kubectl rollout restart deployment/nginx
```

---

## 🐛 Troubleshooting

### **Common Issues:**
1. **Services not starting:**
   ```bash
   # Check logs
   docker-compose logs -f
   # OR
   kubectl logs -f deployment/auth-service
   
   # Check service status
   docker-compose ps
   # OR
   kubectl get pods
   
   # Restart services
   docker-compose restart
   # OR
   kubectl rollout restart deployment/auth-service
   ```

2. **Database connection issues:**
   ```bash
   # Check MongoDB
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/battlearena"
   # OR
   docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
   
   # Check Redis
   redis-cli -h your-redis-host.redis.cloud -p 12345 -a your-redis-password ping
   # OR
   docker-compose exec redis redis-cli ping
   
   # Check connection strings
   echo $MONGODB_URI
   echo $REDIS_HOST
   ```

3. **Port conflicts:**
   ```bash
   # Check port usage
   netstat -tulpn | grep :80
   netstat -tulpn | grep :443
   
   # Change ports in .env
   nano .env
   ```

4. **Memory issues:**
   ```bash
   # Check memory usage
   docker stats
   # OR
   kubectl top nodes
   kubectl top pods
   
   # Increase Docker memory limit
   # Docker Desktop -> Settings -> Resources -> Memory
   ```

---

## 📊 Monitoring

### **Basic Monitoring:**
```bash
# Check service status
docker-compose ps
# OR
kubectl get pods

# Check resource usage
docker stats
# OR
kubectl top nodes
kubectl top pods

# Check logs
docker-compose logs -f
# OR
kubectl logs -f deployment/auth-service
```

### **Advanced Monitoring (Grafana Cloud):**
```bash
# Grafana Cloud (free tier)
# 1. Create Grafana Cloud account
# 2. Get API keys
# 3. Update .env with API keys
# 4. View metrics in Grafana Cloud dashboard
```

---

## 🔄 Updates

### **Update Services:**
```bash
# Pull latest code
git pull origin main

# Rebuild services
docker-compose build
# OR
kubectl set image deployment/auth-service auth-service=your-registry/auth-service:latest

# Restart services
docker-compose up -d
# OR
kubectl rollout restart deployment/auth-service

# Verify services
docker-compose ps
# OR
kubectl get pods
```

---

## ✅ Quick Start Checklist

### **Pre-Deployment:**
- [ ] Docker and Docker Compose installed
- [ ] Kubernetes cluster created (optional)
- [ ] Git installed
- [ ] Repository cloned
- [ ] .env file created
- [ ] Environment variables configured
- [ ] MongoDB Atlas/Redis Cloud configured
- [ ] Grafana Cloud configured

### **Deployment:**
- [ ] Services started with Docker Compose or Kubernetes
- [ ] Services verified (docker-compose ps or kubectl get pods)
- [ ] Health checks passing
- [ ] SSL certificates configured (optional)
- [ ] API endpoints tested
- [ ] Frontend accessible

### **Post-Deployment:**
- [ ] Authentication tested
- [ ] Matchmaking tested
- [ ] Gameplay tested
- [ ] Leaderboard tested
- [ ] Monitoring configured (Grafana Cloud)
- [ ] Logging configured (Grafana Cloud)

---

## 📚 Next Steps

### **1. Review Documentation:**
- **[Cluster 2: Architecture Guide](./ARCHITECTURE.md)** - Architecture details
- **[Cluster 2: Deployment Guide](./DEPLOYMENT.md)** - Deployment details
- **[Cluster 2: Configuration Guide](./CONFIGURATION.md)** - Configuration details
- **[Cluster 2: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost analysis
- **[Cluster 2: Scaling Guide](./SCALING_GUIDE.md)** - When to scale

### **2. Configure Services:**
- Update service configurations
- Update Nginx configuration
- Configure SSL certificates
- Configure monitoring (Grafana Cloud)
- Configure logging (Grafana Cloud)

### **3. Test Application:**
- Test authentication
- Test matchmaking
- Test gameplay
- Test leaderboard

### **4. Deploy to Production:**
- Deploy to cloud VM
- Configure SSL certificates
- Configure monitoring
- Configure backups

---

## 📚 Related Documentation

- **[Cluster 2: Small Scale README](./README.md)** - Cluster overview
- **[Cluster 2: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 2: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 2: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 2: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 2: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 3

---

**Status:** ✅ Cluster 2 Quick Start Documentation Ready

**Last Updated:** 2024

