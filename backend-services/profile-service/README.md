# Profile Service

Spring Boot service for managing user profiles, scores, and player statistics.

## Description

The Profile Service manages player profiles, tracks global scores (infinite with no level cap), calculates rank tiers (Valorant-style), and maintains player statistics.

## Technology Stack

- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** MongoDB (Profiles collection)
- **Cache:** Redis (optional caching)

## Port

**8082**

## Responsibilities

- User profile management
- Global score tracking and update (not per-hero, score can be infinite, no level cap)
- Rank tier calculation (like Valorant, based on score ranges)
- Player statistics (wins, losses, matches played)
- Avatar management
- Rank change calculation (based on match score)

## Status

🚧 **Ready for Implementation**
