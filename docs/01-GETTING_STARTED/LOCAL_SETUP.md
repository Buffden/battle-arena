# Local Development Setup Guide

**Task:** TASK-1-2-9  
**Status:** Complete  
**Last Updated:** 2024

This guide provides step-by-step instructions for setting up and running the Battle Arena project locally on your development machine.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Quick Start](#2-quick-start)
3. [Detailed Setup](#3-detailed-setup)
4. [Running Services](#4-running-services)
5. [Environment Variables](#5-environment-variables)
6. [Troubleshooting](#6-troubleshooting)
7. [Development Workflow](#7-development-workflow)

---

## 1. Prerequisites

Before setting up the local development environment, ensure you have the following installed:

### 1.1 Docker & Docker Compose

**Docker Desktop** (Recommended for macOS and Windows):
- Download from: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Includes Docker Engine, CLI, and Docker Compose V2

**Docker Engine & Docker Compose** (Linux):
- Install Docker Engine: [Docker Engine Installation](https://docs.docker.com/engine/install/)
- Install Docker Compose: [Docker Compose Installation](https://docs.docker.com/compose/install/)

**Verify Installation:**
```bash
docker --version
# Should show: Docker version 24.0+ (or similar)

docker compose version
# Should show: Docker Compose version v2.20+ (or similar)
```

**Test Docker:**
```bash
docker run --rm hello-world
# Should successfully run hello-world container
```

**Detailed Installation:** See [DOCKER_INSTALLATION.md](./DOCKER_INSTALLATION.md) for platform-specific instructions.

### 1.2 System Requirements

- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** At least 5GB free space
- **Operating System:**
  - macOS 10.15+ (Catalina or later)
  - Windows 10/11 (64-bit)
  - Linux (Ubuntu 20.04+, Debian 11+, or similar)

### 1.3 Optional Tools

These are not required for basic setup but useful for development:

- **Git** - Version control (usually pre-installed)
- **Code Editor** - VS Code, IntelliJ IDEA, or your preferred editor
- **MongoDB Compass** - MongoDB GUI client (optional)
- **Redis CLI** - Redis command-line interface (optional)

---

## 2. Quick Start

Get the project running in under 5 minutes:

### 2.1 Clone Repository

```bash
git clone https://github.com/Buffden/battle-arena.git
cd battle-arena
```

### 2.2 Configure Environment Variables

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

**Note:** For now, you can use the default values. We'll configure these in detail in [Section 5](#5-environment-variables).

### 2.3 Start Services

Use the provided startup script (recommended):

```bash
./scripts/start-dev.sh
```

Or use Docker Compose directly:

```bash
docker compose up -d
```

### 2.4 Verify Services

Check that all services are running:

```bash
docker compose ps
```

**Expected Output:**
- `battle-arena-nginx` (API Gateway) - Running
- `battle-arena-mongodb` (Database) - Running
- `battle-arena-redis` (Cache) - Running

### 2.5 Access Services

Once services are running, you can access:

- **API Gateway:** http://localhost
- **Health Check:** http://localhost/health
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

---

## 3. Detailed Setup

This section provides detailed information about the setup process.

### 3.1 Project Structure

```
battle-arena/
├── backend-services/          # Microservices (to be implemented)
│   ├── auth-service/
│   ├── profile-service/
│   ├── leaderboard-service/
│   ├── matchmaking-service/
│   └── game-engine/
├── frontend-service/          # Angular frontend (to be implemented)
├── deployments/
│   └── nginx/                 # Nginx API Gateway configuration
├── database/
│   └── init/                  # MongoDB initialization scripts
├── scripts/                   # Development utility scripts
│   ├── start-dev.sh           # Start all services
│   ├── stop-dev.sh            # Stop all services
│   └── restart-dev.sh         # Restart all services
├── docker-compose.yml         # Local development configuration
├── .env.example               # Environment variables template
└── .env                       # Your local environment variables (create this)
```

### 3.2 Docker Compose Configuration

The project uses `docker-compose.yml` for local development. This file defines:

- **Nginx API Gateway** - Routes requests to backend services
- **MongoDB** - Database for persistent data
- **Redis** - Cache and queues

**Backend services** are currently commented out and will be added as they are implemented.

### 3.3 Database Initialization

MongoDB is automatically initialized on first startup using scripts in `database/init/`:

- Creates collections (Users, Profiles, Matches, Leaderboard, Heroes, Weapons, Arenas)
- Sets up indexes for performance
- Configures relationships (documented in code)

**Note:** Database data persists in Docker volumes. To reset the database:

```bash
docker compose down -v
docker compose up -d
```

**Warning:** This will delete all data!

---

## 4. Running Services

### 4.1 Starting Services

**Using Script (Recommended):**
```bash
./scripts/start-dev.sh
```

**Using Docker Compose:**
```bash
docker compose up -d
```

**What happens:**
1. Docker Compose reads `docker-compose.yml`
2. Creates Docker network (`battle-arena-network`)
3. Pulls required images (if not already present)
4. Creates containers for each service
5. Starts services in dependency order
6. Waits for health checks to pass

### 4.2 Stopping Services

**Using Script (Recommended):**
```bash
./scripts/stop-dev.sh
```

**Using Docker Compose:**
```bash
docker compose down
```

**To Remove Volumes (deletes data):**
```bash
docker compose down -v
```

### 4.3 Restarting Services

**Using Script (Recommended):**
```bash
./scripts/restart-dev.sh
```

**Using Docker Compose:**
```bash
docker compose restart
```

### 4.4 Viewing Logs

**All Services:**
```bash
docker compose logs -f
```

**Specific Service:**
```bash
docker compose logs -f nginx
docker compose logs -f mongodb
docker compose logs -f redis
```

**Last 100 Lines:**
```bash
docker compose logs --tail=100 nginx
```

### 4.5 Service Status

**Check Running Services:**
```bash
docker compose ps
```

**Service Health:**
```bash
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

**Inspect Specific Service:**
```bash
docker inspect battle-arena-nginx
```

### 4.6 Accessing Services

**From Host Machine:**
- API Gateway: http://localhost
- Health Check: http://localhost/health
- MongoDB: `mongodb://localhost:27017/battlearena`
- Redis: `redis://localhost:6379`

**From Docker Containers:**
- Services use Docker service names:
  - MongoDB: `mongodb:27017`
  - Redis: `redis:6379`
  - Auth Service: `auth-service:8081` (when implemented)

**Note:** Backend services have NO host ports exposed. They are accessed only via the Nginx API Gateway.

---

## 5. Environment Variables

### 5.1 Root Environment Variables

The root `.env.example` file contains shared configuration:

```bash
# Application Environment
NODE_ENV=development
SPRING_PROFILES_ACTIVE=dev

# Database Configuration
MONGODB_URI=mongodb://mongodb:27017/battlearena
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=86400000

# Google OAuth (when implemented)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8081/api/auth/google/callback

# Service Ports
AUTH_SERVICE_PORT=8081
PROFILE_SERVICE_PORT=8082
LEADERBOARD_SERVICE_PORT=8083
MATCHMAKING_SERVICE_PORT=3002
GAME_ENGINE_PORT=5002
FRONTEND_PORT=4200

# API URLs
API_URL=http://localhost/api
WS_URL=ws://localhost/ws
```

**Setup:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 5.2 Service-Specific Environment Variables

Each service has its own `.env.example` file:

- `backend-services/auth-service/.env.example`
- `backend-services/profile-service/.env.example`
- `backend-services/leaderboard-service/.env.example`
- `backend-services/matchmaking-service/.env.example`
- `backend-services/game-engine/.env.example`
- `frontend-service/.env.example`

**When a service is implemented:**
```bash
cd backend-services/auth-service
cp .env.example .env
# Edit .env with service-specific configuration
```

### 5.3 Environment Variable Priority

1. **Service `.env` file** (highest priority)
2. **Root `.env` file**
3. **Environment variables** (system/CI)
4. **Default values** (hardcoded in code)

**Note:** Never commit `.env` files to version control. Only commit `.env.example` templates.

---

## 6. Troubleshooting

### 6.1 Common Issues

#### Issue: Docker is not running

**Symptoms:**
```
Error: Docker is not running. Please start Docker and try again.
```

**Solution:**
1. Start Docker Desktop (macOS/Windows)
2. Or start Docker daemon (Linux): `sudo systemctl start docker`
3. Verify: `docker ps`

#### Issue: Port already in use

**Symptoms:**
```
Error: bind: address already in use
```

**Solution:**

**Option 1: Stop conflicting service**
```bash
# Find process using port 80
lsof -i :80  # macOS/Linux
netstat -ano | findstr :80  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Option 2: Change port in docker-compose.yml**
```yaml
nginx:
  ports:
    - "8080:80"  # Changed from 80 to 8080
```

**Option 3: Stop all containers**
```bash
docker compose down
```

#### Issue: MongoDB connection failed

**Symptoms:**
```
MongoNetworkError: failed to connect
```

**Solution:**

1. **Check MongoDB is running:**
   ```bash
   docker compose ps mongodb
   ```

2. **Check MongoDB logs:**
   ```bash
   docker compose logs mongodb
   ```

3. **Verify MongoDB URI:**
   - Use `mongodb://mongodb:27017/battlearena` (Docker service name)
   - NOT `mongodb://localhost:27017` (inside containers)

4. **Restart MongoDB:**
   ```bash
   docker compose restart mongodb
   ```

5. **Reset MongoDB (if corrupted):**
   ```bash
   docker compose down -v
   docker compose up -d
   ```

#### Issue: Redis connection failed

**Symptoms:**
```
Error: connect ECONNREFUSED
```

**Solution:**

1. **Check Redis is running:**
   ```bash
   docker compose ps redis
   ```

2. **Check Redis logs:**
   ```bash
   docker compose logs redis
   ```

3. **Test Redis connection:**
   ```bash
   docker exec -it battle-arena-redis redis-cli ping
   # Should return: PONG
   ```

4. **Verify Redis host:**
   - Use `redis` (Docker service name)
   - NOT `localhost` (inside containers)

5. **Restart Redis:**
   ```bash
   docker compose restart redis
   ```

#### Issue: Nginx configuration error

**Symptoms:**
```
nginx: [emerg] host not found in upstream
```

**Solution:**

This error occurs when Nginx starts before backend services. The configuration includes a DNS resolver to handle this:

```nginx
resolver 127.0.0.11 valid=30s;
```

**If error persists:**

1. **Check Nginx logs:**
   ```bash
   docker compose logs nginx
   ```

2. **Test Nginx configuration:**
   ```bash
   docker exec battle-arena-nginx nginx -t
   ```

3. **Restart Nginx:**
   ```bash
   docker compose restart nginx
   ```

4. **Wait for backend services:**
   ```bash
   docker compose up -d
   # Wait 10-15 seconds for services to start
   ```

#### Issue: Services won't start

**Symptoms:**
```
Service repeatedly restarts or exits with error
```

**Solution:**

1. **Check service logs:**
   ```bash
   docker compose logs <service-name>
   ```

2. **Check service health:**
   ```bash
   docker compose ps
   ```

3. **Inspect service:**
   ```bash
   docker inspect <container-name>
   ```

4. **Check Docker resources:**
   ```bash
   docker system df  # Check disk space
   docker stats      # Check resource usage
   ```

5. **Restart Docker Desktop/daemon** (if necessary)

6. **Reset everything:**
   ```bash
   docker compose down -v
   docker system prune -f
   docker compose up -d
   ```

### 6.2 Service-Specific Troubleshooting

#### MongoDB Issues

**Problem: Database not initializing**
```bash
# Check init scripts are mounted
docker exec battle-arena-mongodb ls -la /docker-entrypoint-initdb.d/

# Check MongoDB logs for init errors
docker compose logs mongodb | grep -i init
```

**Problem: Cannot connect to MongoDB from host**
- MongoDB port 27017 is exposed for development
- Use: `mongodb://localhost:27017/battlearena`
- Or use MongoDB Compass: `mongodb://localhost:27017`

#### Redis Issues

**Problem: Redis data not persisting**
- Redis uses `appendonly yes` for persistence
- Data is stored in Docker volume: `redis_data`
- To reset: `docker compose down -v`

**Problem: Redis memory issues**
- Redis default memory limit is unlimited
- Monitor: `docker stats battle-arena-redis`
- Adjust in docker-compose.yml if needed

#### Nginx Issues

**Problem: Routes not working**
- Check Nginx configuration: `deployments/nginx/nginx.conf`
- Verify service names match Docker Compose service names
- Check upstream blocks are configured correctly

**Problem: CORS errors**
- CORS is configured in Nginx for development
- Check CORS headers in `nginx.conf`
- Verify `Access-Control-Allow-Origin` is set correctly

---

## 7. Development Workflow

### 7.1 Making Changes

**To modify Nginx configuration:**
1. Edit `deployments/nginx/nginx.conf`
2. Restart Nginx: `docker compose restart nginx`
3. Test: `docker exec battle-arena-nginx nginx -t`

**To modify database initialization:**
1. Edit scripts in `database/init/`
2. Reset database: `docker compose down -v && docker compose up -d`

**To modify Docker Compose configuration:**
1. Edit `docker-compose.yml`
2. Apply changes: `docker compose up -d`

### 7.2 Testing Changes

**Test API Gateway:**
```bash
curl http://localhost/health
# Expected: healthy
```

**Test MongoDB:**
```bash
docker exec -it battle-arena-mongodb mongosh battlearena
# Then run: db.getCollectionNames()
```

**Test Redis:**
```bash
docker exec -it battle-arena-redis redis-cli
# Then run: PING
```

### 7.3 Debugging

**View all logs:**
```bash
docker compose logs -f
```

**View specific service logs:**
```bash
docker compose logs -f nginx
```

**Enter a container:**
```bash
docker exec -it battle-arena-nginx sh
docker exec -it battle-arena-mongodb bash
docker exec -it battle-arena-redis sh
```

**Check network connectivity:**
```bash
# From inside a container
docker exec -it battle-arena-nginx ping mongodb
docker exec -it battle-arena-nginx ping redis
```

### 7.4 Cleaning Up

**Stop services:**
```bash
docker compose down
```

**Stop and remove volumes (deletes data):**
```bash
docker compose down -v
```

**Remove all containers, networks, and volumes:**
```bash
docker compose down -v --remove-orphans
```

**Clean up Docker system (removes unused resources):**
```bash
docker system prune -a
```

**⚠️ Warning:** `docker system prune -a` removes all unused Docker resources system-wide!

---

## 8. Next Steps

Once your local environment is set up:

1. **Review Architecture:** Read [High-Level Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md)
2. **Explore Services:** Check service-specific README files
3. **Read API Documentation:** Review API endpoints (when implemented)
4. **Start Development:** Follow service-specific development guides

---

## 9. Additional Resources

- **Docker Installation:** [DOCKER_INSTALLATION.md](./DOCKER_INSTALLATION.md)
- **Architecture Overview:** [High-Level Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md)
- **Deployment Guide:** [Deployment Architecture](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md)
- **Project README:** [../../README.md](../../README.md)

---

## 10. Getting Help

If you encounter issues not covered in this guide:

1. **Check Logs:** Review service logs for error messages
2. **Check Issues:** Search [GitHub Issues](https://github.com/Buffden/battle-arena/issues)
3. **Create Issue:** Open a new issue with:
   - Error messages
   - Steps to reproduce
   - System information
   - Relevant logs

---

**Last Updated:** 2024  
**Status:** Active

