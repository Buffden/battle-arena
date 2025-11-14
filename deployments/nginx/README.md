# Nginx API Gateway

Nginx configuration for routing requests to our backend services.

## What It Does

Nginx sits in front of everything and routes requests:
- `/api/auth` → auth-service
- `/api/profile` → profile-service
- `/api/leaderboard` → leaderboard-service
- `/ws/matchmaking` → matchmaking-service (WebSocket)
- `/ws/game` → game-engine (WebSocket)

## Important Note

Nginx is the ONLY service that exposes ports to the outside (80, 443). Everything else talks internally using Docker service names.

The actual `nginx.conf` file will go here when we set it up.
