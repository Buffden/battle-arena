# 🎓 Cluster 1: Student/Minimal - Configuration Guide
## Battle Arena - Ultra Low-Cost Configuration for Student Projects

**Traffic:** <1,000 users/month  
**Cost:** $0-10/month  
**Target:** Student projects, learning, prototyping  
**Status:** ✅ Ready for Implementation

---

## ⚙️ Configuration Overview

### **Configuration Strategy:**
- **Environment Variables** - Use environment variables for configuration
- **Docker Compose** - Configuration in Docker Compose file
- **Free Tiers** - Use free tiers for all components
- **Self-Hosted** - Self-hosted services (MongoDB, Redis, Nginx)
- **Simple** - Keep configuration simple and easy to understand

---

## 🔧 Service Configurations

### **1. Frontend Service Configuration**

#### **Environment Variables:**
```bash
# Frontend Environment
NODE_ENV=development
API_URL=http://localhost:80
WS_URL=ws://localhost:80/ws
```

#### **Angular Configuration:**
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrls: {
    auth: '/api/auth',
    profile: '/api/profile',
    leaderboard: '/api/leaderboard',
    matchmaking: '/api/matchmaking',
    gameEngine: '/api/game'
  }
};
```

### **2. API Gateway (Nginx) Configuration**

#### **nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    # Upstream services
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

        # Rate limiting (basic)
        limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

        # Auth Service
        location /api/auth {
            limit_req zone=api_limit burst=20;
            proxy_pass http://auth-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Profile Service
        location /api/profile {
            limit_req zone=api_limit burst=20;
            proxy_pass http://profile-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Leaderboard Service
        location /api/leaderboard {
            limit_req zone=api_limit burst=20;
            proxy_pass http://leaderboard-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Matchmaking Service
        location /api/matchmaking {
            limit_req zone=api_limit burst=20;
            proxy_pass http://matchmaking-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Game Engine Service
        location /api/game {
            limit_req zone=api_limit burst=20;
            proxy_pass http://game-engine-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Configuration Service
        location /api/config {
            limit_req zone=api_limit burst=20;
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

### **3. Auth Service Configuration**

#### **Environment Variables:**
```bash
# Auth Service Environment
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8081
MONGODB_URI=mongodb://mongodb:27017/battlearena
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRATION=86400000
BCRYPT_ROUNDS=10
```

#### **application.yml:**
```yaml
spring:
  application:
    name: auth-service
  data:
    mongodb:
      uri: ${MONGODB_URI}
      database: battlearena
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

server:
  port: ${SERVER_PORT:8081}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}

bcrypt:
  rounds: ${BCRYPT_ROUNDS:10}
```

### **4. Profile Service Configuration**

#### **Environment Variables:**
```bash
# Profile Service Environment
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8082
MONGODB_URI=mongodb://mongodb:27017/battlearena
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### **application.yml:**
```yaml
spring:
  application:
    name: profile-service
  data:
    mongodb:
      uri: ${MONGODB_URI}
      database: battlearena
  redis:
    host: ${REDIS_HOST:redis}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

server:
  port: ${SERVER_PORT:8082}
```

### **5. Leaderboard Service Configuration**

#### **Environment Variables:**
```bash
# Leaderboard Service Environment
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8083
MONGODB_URI=mongodb://mongodb:27017/battlearena
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### **application.yml:**
```yaml
spring:
  application:
    name: leaderboard-service
  data:
    mongodb:
      uri: ${MONGODB_URI}
      database: battlearena
  redis:
    host: ${REDIS_HOST:redis}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

server:
  port: ${SERVER_PORT:8083}
```

### **6. Matchmaking Service Configuration**

#### **Environment Variables:**
```bash
# Matchmaking Service Environment
NODE_ENV=development
PORT=3002
MONGODB_URI=mongodb://mongodb:27017/battlearena
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### **config.js:**
```javascript
module.exports = {
  port: process.env.PORT || 3002,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/battlearena'
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  },
  matchmaking: {
    queueTimeout: 300000, // 5 minutes
    scoreRange: 100, // Initial score range
    scoreRangeIncrease: 50, // Score range increase per minute
    maxScoreRange: 500 // Maximum score range
  }
};
```

### **7. Game Engine Service Configuration**

#### **Environment Variables:**
```bash
# Game Engine Service Environment
NODE_ENV=development
PORT=3003
MONGODB_URI=mongodb://mongodb:27017/battlearena
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### **config.js:**
```javascript
module.exports = {
  port: process.env.PORT || 3003,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/battlearena'
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  },
  game: {
    turnTimer: 15000, // 15 seconds per turn
    matchTimer: 300000, // 5 minutes per match
    maxTurns: 10, // 10 turns per player
    movesPerGame: 4 // 4 moves per game
  }
};
```

### **8. Configuration Service Configuration**

#### **Environment Variables:**
```bash
# Configuration Service Environment
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8084
MONGODB_URI=mongodb://mongodb:27017/battlearena
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### **application.yml:**
```yaml
spring:
  application:
    name: configuration-service
  data:
    mongodb:
      uri: ${MONGODB_URI}
      database: battlearena
  redis:
    host: ${REDIS_HOST:redis}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

server:
  port: ${SERVER_PORT:8084}
```

---

## 🗄️ Database Configurations

### **1. MongoDB Configuration**

#### **Self-Hosted (Docker):**
```yaml
# docker-compose.yml
mongodb:
  image: mongo:6.0
  ports:
    - "27017:27017"
  volumes:
    - mongodb-data:/data/db
  environment:
    - MONGO_INITDB_DATABASE=battlearena
```

#### **MongoDB Atlas (Free Tier):**
```bash
# Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena?retryWrites=true&w=majority
```

### **2. Redis Configuration**

#### **Self-Hosted (Docker):**
```yaml
# docker-compose.yml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis-data:/data
```

#### **Redis Cloud (Free Tier):**
```bash
# Connection String
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
```

---

## 🔄 Message Queue Configuration

### **Redis Pub/Sub Configuration**

#### **Channels:**
```javascript
// Matchmaking Events Channel
const MATCHMAKING_EVENTS_CHANNEL = 'matchmaking:events';

// Game Events Channel
const GAME_EVENTS_CHANNEL = 'game:events';

// Profile Updates Channel
const PROFILE_UPDATES_CHANNEL = 'profile:updates';

// Leaderboard Updates Channel
const LEADERBOARD_UPDATES_CHANNEL = 'leaderboard:updates';
```

#### **Publisher Example:**
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || ''
});

// Publish event
client.publish('matchmaking:events', JSON.stringify({
  type: 'MATCH_FOUND',
  matchId: 'match-123',
  players: ['player-1', 'player-2']
}));
```

#### **Subscriber Example:**
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || ''
});

// Subscribe to channel
client.subscribe('matchmaking:events');

// Handle messages
client.on('message', (channel, message) => {
  const event = JSON.parse(message);
  console.log('Received event:', event);
});
```

---

## 🔐 Security Configuration

### **1. JWT Configuration**

#### **JWT Secret:**
```bash
# Generate JWT secret
openssl rand -base64 32
```

#### **JWT Configuration:**
```yaml
jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000} # 24 hours
  algorithm: HS256
```

### **2. SSL/TLS Configuration**

#### **Let's Encrypt:**
```bash
# Install Certbot
sudo apt-get install certbot

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

#### **Nginx SSL Configuration:**
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}
```

### **3. Rate Limiting Configuration**

#### **Nginx Rate Limiting:**
```nginx
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# Apply rate limiting
location /api {
    limit_req zone=api_limit burst=20;
    proxy_pass http://backend;
}
```

---

## 📊 Monitoring Configuration (Optional)

### **Grafana Cloud Configuration**

#### **Environment Variables:**
```bash
# Grafana Cloud Configuration
GRAFANA_CLOUD_API_KEY=your-api-key
GRAFANA_CLOUD_API_URL=https://your-instance.grafana.net
GRAFANA_CLOUD_METRICS_ENABLED=true
GRAFANA_CLOUD_LOGS_ENABLED=true
```

#### **Metrics Configuration:**
```javascript
// Prometheus metrics (optional)
const prometheus = require('prom-client');

const register = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  registers: [register]
});
```

---

## 🔄 Environment Variables

### **.env file:**
```bash
# Environment
NODE_ENV=development
SPRING_PROFILES_ACTIVE=dev

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/battlearena
# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena

# Redis
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

# Grafana Cloud (Optional)
GRAFANA_CLOUD_API_KEY=
GRAFANA_CLOUD_API_URL=
GRAFANA_CLOUD_METRICS_ENABLED=false
GRAFANA_CLOUD_LOGS_ENABLED=false
```

---

## ✅ Configuration Checklist

### **Pre-Configuration:**
- [ ] Environment variables created
- [ ] Docker Compose file configured
- [ ] Nginx configuration created
- [ ] MongoDB/Redis configured (free tiers or self-hosted)
- [ ] JWT secret generated
- [ ] SSL certificates configured (optional)

### **Configuration:**
- [ ] All services configured
- [ ] Environment variables set
- [ ] Database connections tested
- [ ] Redis connections tested
- [ ] Message queue channels configured
- [ ] Security configurations applied

### **Post-Configuration:**
- [ ] All services started
- [ ] Health checks passing
- [ ] API endpoints tested
- [ ] WebSocket connections tested
- [ ] Message queue tested
- [ ] Security tested

---

## 📚 Related Documentation

- **[Cluster 1: Student/Minimal README](./README.md)** - Cluster overview
- **[Cluster 1: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 1: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 1: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 1: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 2
- **[Cluster 1: Quick Start](./QUICK_START.md)** - Quick start guide

---

**Status:** ✅ Cluster 1 Configuration Documentation Ready

**Last Updated:** 2024

