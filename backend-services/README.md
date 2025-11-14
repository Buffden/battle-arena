# Backend Services

This is where all the backend microservices live. We're building 5 services total - 3 in Spring Boot and 2 in Node.js.

## What's Here

Right now we have:
- **auth-service** - Just created, still setting up

Coming soon:
- **profile-service** - User profiles and stats
- **leaderboard-service** - Rankings and leaderboards
- **matchmaking-service** - Finding opponents
- **game-engine** - The actual game logic

## Service Ports

- auth-service: 8081
- profile-service: 8082
- leaderboard-service: 8083
- matchmaking-service: 3002
- game-engine: 5002

## Notes

All services talk to each other using Docker service names (like `auth-service:8081`), not localhost. The Nginx gateway is the only thing that exposes ports to the outside world.

More details coming as we build this out!
