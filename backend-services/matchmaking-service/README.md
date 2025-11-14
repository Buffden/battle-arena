# Matchmaking Service

Node.js service for hero selection, matchmaking, and pre-match setup (arena/weapon selection).

## Description

The Matchmaking Service handles the complete matchmaking flow including hero selection, skill-based player matching, arena voting, and weapon selection before starting a game.

## Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Real-time:** Socket.io (WebSocket)
- **Cache:** Redis (Matchmaking queue, Lobby storage, Configuration cache)

## Port

**3002**

## Responsibilities

- Hero selection management (multiple hero selection, hero matching, hero assignment)
- Player queue management
- Global score/rank-based matchmaking algorithm
- Queue expansion (after 5 minutes, widen XP/score/rank range)
- Arena selection management (voting/elimination system)
- Weapon selection management (alternating selection, 30-second timer)
- Lobby creation and management
- Match acceptance handling
- Estimated wait time calculation
- Reconnection handling

## Status

🚧 **Ready for Implementation**
