# Nginx API Gateway

Nginx configuration for routing requests to backend microservices.

## Status

**Status:** Full configuration implemented (TASK-1-2-8)

**File Location:** `deployments/nginx/nginx.conf`  
**Container Mount:** `/etc/nginx/nginx.conf` (read-only)

## Configuration Overview

The Nginx configuration includes:

### 1. Upstream Services
All backend microservices are configured as upstream servers for load balancing:
- `auth-service:8081` - Authentication service
- `profile-service:8082` - Profile management service
- `leaderboard-service:8083` - Leaderboard service
- `matchmaking-service:3002` - Matchmaking service (WebSocket)
- `game-engine:5002` - Game engine service (WebSocket)

### 2. Request Routing

**REST API Routes:**
- `/api/auth/*` → Auth Service (port 8081)
- `/api/profile/*` → Profile Service (port 8082)
- `/api/leaderboard/*` → Leaderboard Service (port 8083)

**WebSocket Routes:**
- `/ws/matchmaking` → Matchmaking Service (port 3002)
- `/ws/game` → Game Engine Service (port 5002)

**Health Check:**
- `/health` → Returns "healthy" status

### 3. Features

✅ **Load Balancing:** Round-robin (default)  
✅ **WebSocket Support:** Upgrade headers configured for real-time communication  
✅ **CORS Configuration:** Enabled for development (allows all origins)  
✅ **Health Checks:** `/health` endpoint for gateway status  
✅ **Rate Limiting:** Zones configured (disabled by default, can be enabled)  
✅ **SSL/TLS:** Placeholder configuration for HTTPS (commented out)  
✅ **Timeouts:** Configured for REST APIs and WebSocket connections  

### 4. CORS Configuration

For development, CORS is configured to allow all origins. In production, restrict this:
- `Access-Control-Allow-Origin: *` (development)
- Allow methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Allow headers: Authorization, Content-Type, X-Requested-With

### 5. WebSocket Configuration

WebSocket routes include:
- HTTP/1.1 upgrade headers
- Connection upgrade handling
- Extended timeouts (7 days for persistent connections)
- Standard proxy headers (Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto)

## Important Notes

### Service Dependencies

⚠️ **Nginx requires backend services to be running** for the configuration to validate. Nginx resolves upstream blocks at startup time. If services are not running, Nginx will fail to start with an error like:

```
host not found in upstream "auth-service:8081"
```

**This is expected behavior.** Once backend services are uncommented in `docker-compose.yml` and running, Nginx will start successfully.

### Service Discovery

- **All services communicate internally** using Docker service names
- Services connect via Docker network: `http://auth-service:8081`, not `localhost:8081`
- **Nginx is the ONLY service that exposes ports** to the outside (80, 443)
- Backend services have NO host ports - accessed only via Nginx

### Load Balancing

- Default: Round-robin
- Future: Can add more instances per service for load distribution
- WebSocket: Consider using `ip_hash` for sticky sessions (commented in config)

## Testing

### Verify Nginx Configuration

```bash
# Test configuration syntax (requires services to be running)
docker exec battle-arena-nginx nginx -t

# Or test outside container (may fail if services not running)
docker run --rm -v "$(pwd)/deployments/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:latest nginx -t
```

### Check Container Status

```bash
# Check if Nginx container is running
docker-compose ps nginx

# View Nginx logs
docker-compose logs nginx

# Follow logs in real-time
docker-compose logs -f nginx
```

### Test Endpoints

```bash
# Health check endpoint
curl http://localhost/health
# Expected output: healthy

# API Gateway info (when services not running)
curl http://localhost/
# Shows available routes

# Test service routes (requires services to be running)
curl http://localhost/api/auth/health
curl http://localhost/api/profile/health
curl http://localhost/api/leaderboard/health
```

## Configuration File Details

**Location:** `deployments/nginx/nginx.conf`  
**Mounted in container:** `/etc/nginx/nginx.conf` (read-only)  
**Syntax:** Nginx configuration format

### Key Sections

1. **Events Block:** Worker connections (1024)
2. **HTTP Block:** 
   - DNS resolver (127.0.0.11 - Docker's internal DNS)
   - Rate limiting zones (configured but disabled)
   - Upstream service definitions
   - Server blocks (HTTP on port 80)
3. **HTTPS Server Block:** Commented placeholder for production SSL/TLS

## Future Enhancements

- [ ] Enable rate limiting (currently configured but disabled)
- [ ] Configure SSL/TLS certificates for HTTPS
- [ ] Add more upstream instances for load balancing
- [ ] Implement IP hash for WebSocket sticky sessions
- [ ] Add request logging and monitoring
- [ ] Configure frontend service routing (when containerized)
- [ ] Add authentication middleware at gateway level

## Troubleshooting

### Nginx won't start

**Error:** `host not found in upstream "auth-service:8081"`

**Solution:** Backend services must be running before Nginx can start. Uncomment services in `docker-compose.yml` and start them first:

```bash
docker-compose up -d auth-service profile-service leaderboard-service matchmaking-service game-engine
docker-compose up -d nginx
```

### Service not reachable

**Check:**
1. Is the service running? `docker-compose ps`
2. Is the service in the same Docker network? `docker network inspect battle-arena-network`
3. Check Nginx logs: `docker-compose logs nginx`
4. Check service logs: `docker-compose logs auth-service`

### WebSocket connection fails

**Check:**
1. Verify WebSocket route: `/ws/matchmaking` or `/ws/game`
2. Check upgrade headers are being sent from client
3. Verify service is running and listening on WebSocket port
4. Check proxy_set_header Upgrade and Connection headers in config
