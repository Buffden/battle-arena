# Game Engine Service

Node.js service that handles real-time game logic, physics, and turn management for 2D artillery battles.

## Description

The Game Engine Service manages the actual gameplay including turn-based mechanics, physics calculations, movement, scoring, health management, and match result processing.

## Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Real-time:** Socket.io (WebSocket)
- **Physics Engine:** Matter.js
- **Database:** MongoDB (Matches collection)
- **Cache:** Redis (Game state cache)

## Port

**5002**

## Responsibilities

- Game room management
- Real-time game state synchronization
- Turn management (15 seconds per turn, 4-5 minutes total OR 10 turns per player)
- Movement system (4 moves per game, left/right only, movement scoring)
- Physics calculations (Matter.js, gravity varies by arena, no wind)
- Action processing (aim, fire, move)
- Scoring system (accuracy, back-to-back hits, repositioning saves)
- Health system (different HP per hero type, balanced HP when matched)
- Win condition detection (HP = 0 = instant loss, or player with more HP at match end)
- Draw condition detection (same HP AND same score = draw)
- Weapon synergy system (dynamic system, e.g., gasoline + torch)
- Match result processing
- Configuration file support (weapons, penalties, rank tiers, scoring formulas)
- Disconnection handling (1 minute rejoin window, configurable penalties)

## Status

🚧 **Ready for Implementation**
