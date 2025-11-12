# 🎓 Cluster 1: Student/Minimal - Quick Start Guide
## Battle Arena - Ultra Low-Cost Quick Start for Student Projects

**Traffic:** <1,000 users/month  
**Cost:** $0-10/month  
**Target:** Student projects, learning, prototyping  
**Status:** ✅ Ready for Implementation

---

## 🚀 Quick Start Overview

### **Prerequisites:**
- Docker and Docker Compose installed
- Git installed
- Code editor (VS Code, IntelliJ, etc.)
- 8GB RAM (for local development)

### **Time to Deploy:**
- **Local Development:** 10-15 minutes
- **Cloud Deployment:** 20-30 minutes
- **Free Tiers Setup:** 15-20 minutes

---

## 📦 Step 1: Clone Repository

```bash
# Clone repository
git clone <repository-url>
cd battle-arena

# Check Docker and Docker Compose
docker --version
docker-compose --version
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
NODE_ENV=development
SPRING_PROFILES_ACTIVE=dev

# MongoDB (self-hosted or Atlas free tier)
MONGODB_URI=mongodb://mongodb:27017/battlearena
# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena

# Redis (self-hosted or Cloud free tier)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
# OR Redis Cloud
# REDIS_HOST=your-redis-host.redis.cloud
# REDIS_PORT=12345
# REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRATION=86400000

# Services
AUTH_SERVICE_PORT=8081
PROFILE_SERVICE_PORT=8082
LEADERBOARD_SERVICE_PORT=8083
MATCHMAKING_SERVICE_PORT=3002
GAME_ENGINE_SERVICE_PORT=3003
CONFIGURATION_SERVICE_PORT=8084

# Frontend
FRONTEND_PORT=4200
API_URL=http://localhost:80
WS_URL=ws://localhost:80/ws
```

---

## 🐳 Step 3: Start Services

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

# Check Redis
docker-compose exec redis redis-cli ping

# Check services
curl http://localhost:80/api/auth/health
curl http://localhost:80/api/profile/health
curl http://localhost:80/api/leaderboard/health
```

---

## 🌐 Step 4: Access Application

### **Local Development:**
- **Frontend:** http://localhost:4200
- **API Gateway:** http://localhost:80
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

### **Test API endpoints:**
```bash
# Test auth service
curl http://localhost:80/api/auth/health

# Test profile service
curl http://localhost:80/api/profile/health

# Test leaderboard service
curl http://localhost:80/api/leaderboard/health

# Test matchmaking service
curl http://localhost:80/api/matchmaking/health

# Test game engine service
curl http://localhost:80/api/game/health

# Test configuration service
curl http://localhost:80/api/config/health
```

---

## ☁️ Step 5: Cloud Deployment (Optional)

### **5.1 Create Cloud VM:**
```bash
# Create small VM (2 CPU, 4GB RAM)
# DigitalOcean, Linode, Vultr, AWS Lightsail, etc.

# SSH to VM
ssh user@your-vm-ip

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin
```

### **5.2 Deploy to Cloud VM:**
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

### **5.3 Configure SSL (Optional):**
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🆓 Step 6: Free Tiers Setup (Optional)

### **6.1 MongoDB Atlas (Free Tier):**
```bash
# 1. Create MongoDB Atlas account
# 2. Create free tier cluster (512MB)
# 3. Get connection string
# 4. Update .env with connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
```

### **6.2 Redis Cloud (Free Tier):**
```bash
# 1. Create Redis Cloud account
# 2. Create free tier database (30MB)
# 3. Get connection string
# 4. Update .env with connection string
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
```

### **6.3 Grafana Cloud (Free Tier, Optional):**
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

## ✅ Step 7: Verify Deployment

### **7.1 Health Checks:**
```bash
# Check all services
docker-compose ps

# Check service health
curl http://localhost:80/api/auth/health
curl http://localhost:80/api/profile/health
curl http://localhost:80/api/leaderboard/health
curl http://localhost:80/api/matchmaking/health
curl http://localhost:80/api/game/health
curl http://localhost:80/api/config/health
```

### **7.2 Test Authentication:**
```bash
# Register user
curl -X POST http://localhost:80/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login user
curl -X POST http://localhost:80/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### **7.3 Test Frontend:**
```bash
# Open frontend in browser
open http://localhost:4200

# Test authentication
# Test matchmaking
# Test gameplay
# Test leaderboard
```

---

## 🔧 Step 8: Configuration

### **8.1 Update Configurations:**
```bash
# Edit service configurations
nano backend-services/auth-service/src/main/resources/application.yml
nano backend-services/user-profile-service/src/main/resources/application.yml
nano backend-services/leaderboard-service/src/main/resources/application.yml
nano backend-services/matchmaking-service/config.js
nano backend-services/game-engine-service/config.js
nano backend-services/configuration-service/src/main/resources/application.yml
```

### **8.2 Update Nginx Configuration:**
```bash
# Edit Nginx configuration
nano nginx/nginx.conf

# Restart Nginx
docker-compose restart nginx
```

---

## 🐛 Troubleshooting

### **Common Issues:**
1. **Services not starting:**
   ```bash
   # Check logs
   docker-compose logs -f
   
   # Check service status
   docker-compose ps
   
   # Restart services
   docker-compose restart
   ```

2. **Database connection issues:**
   ```bash
   # Check MongoDB
   docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
   
   # Check Redis
   docker-compose exec redis redis-cli ping
   
   # Check connection strings
   echo $MONGODB_URI
   echo $REDIS_HOST
   ```

3. **Port conflicts:**
   ```bash
   # Check port usage
   netstat -tulpn | grep :80
   netstat -tulpn | grep :4200
   
   # Change ports in .env
   nano .env
   ```

4. **Memory issues:**
   ```bash
   # Check memory usage
   docker stats
   
   # Increase Docker memory limit
   # Docker Desktop -> Settings -> Resources -> Memory
   ```

---

## 📊 Monitoring

### **Basic Monitoring:**
```bash
# Check service status
docker-compose ps

# Check resource usage
docker stats

# Check logs
docker-compose logs -f

# Check service health
curl http://localhost:80/api/auth/health
```

### **Advanced Monitoring (Optional):**
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

# Restart services
docker-compose up -d

# Verify services
docker-compose ps
```

---

## ✅ Quick Start Checklist

### **Pre-Deployment:**
- [ ] Docker and Docker Compose installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] .env file created
- [ ] Environment variables configured

### **Deployment:**
- [ ] Services started with Docker Compose
- [ ] Services verified (docker-compose ps)
- [ ] Health checks passing
- [ ] API endpoints tested
- [ ] Frontend accessible

### **Post-Deployment:**
- [ ] Authentication tested
- [ ] Matchmaking tested
- [ ] Gameplay tested
- [ ] Leaderboard tested
- [ ] Monitoring configured (optional)

---

## 📚 Next Steps

### **1. Review Documentation:**
- **[Cluster 1: Architecture Guide](./ARCHITECTURE.md)** - Architecture details
- **[Cluster 1: Deployment Guide](./DEPLOYMENT.md)** - Deployment details
- **[Cluster 1: Configuration Guide](./CONFIGURATION.md)** - Configuration details
- **[Cluster 1: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost analysis
- **[Cluster 1: Scaling Guide](./SCALING_GUIDE.md)** - When to scale

### **2. Configure Services:**
- Update service configurations
- Update Nginx configuration
- Configure SSL certificates (optional)
- Configure monitoring (optional)

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

- **[Cluster 1: Student/Minimal README](./README.md)** - Cluster overview
- **[Cluster 1: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 1: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 1: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 1: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 1: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 2

---

**Status:** ✅ Cluster 1 Quick Start Documentation Ready

**Last Updated:** 2024

