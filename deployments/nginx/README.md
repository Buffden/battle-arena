# Nginx API Gateway

Nginx configuration for routing requests to our backend services.

## Current Implementation

**Status:** Placeholder configuration (full routing will be implemented in TASK-1-2-8)

**File Location:** `deployments/nginx/nginx.conf`  
**Container Mount:** `/etc/nginx/nginx.conf` (read-only)

The `nginx.conf` file is currently a placeholder with basic setup:

### Current Configuration

1. **Events Block:**
   - `worker_connections 1024` - Maximum concurrent connections per worker

2. **HTTP Block:**
   - MIME types included
   - Default type: `application/octet-stream`

3. **Server Block:**
   - **Listen:** Port 80 (HTTP)
   - **Server Name:** localhost
   - **Health Endpoint:** `/health` - Returns "healthy" status (access_log disabled)
   - **Placeholder Endpoint:** `/` - Returns message indicating routing configuration is pending

### Health Check

```bash
curl http://localhost/health
# Expected output: healthy
```

### Testing

Verify Nginx is working:
```bash
# Check if container is running
docker-compose ps nginx

# Check Nginx configuration
docker exec battle-arena-nginx nginx -t

# View Nginx logs
docker-compose logs nginx

# Test health endpoint
curl http://localhost/health
```

## What It Will Do (Future Implementation)

Nginx will sit in front of everything and route requests:
- `/api/auth/*` → auth-service (port 8081)
- `/api/profile/*` → profile-service (port 8082)
- `/api/leaderboard/*` → leaderboard-service (port 8083)
- `/ws/matchmaking` → matchmaking-service (port 3002, WebSocket)
- `/ws/game` → game-engine (port 5002, WebSocket)

## Important Notes

- **Nginx is the ONLY service that exposes ports to the outside** (80, 443)
- All backend services communicate internally using Docker service names
- Services connect via Docker network: `http://auth-service:8081`, not `localhost:8081`
- Full routing configuration will be added in TASK-1-2-8

## Configuration File Location

- **File**: `deployments/nginx/nginx.conf`
- **Mounted in container**: `/etc/nginx/nginx.conf` (read-only)
- **Mounted from**: `./deployments/nginx/nginx.conf` (relative to docker-compose.yml location)

## Testing

Check if Nginx is running:
```bash
curl http://localhost/health
# Should return: healthy
```
