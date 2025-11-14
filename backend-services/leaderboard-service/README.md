# Leaderboard Service

Spring Boot service for rankings and leaderboards with filtering capabilities.

## Description

The Leaderboard Service generates and maintains global leaderboards with advanced filtering options including region, hero type, winning percentage, and weapon usage.

## Technology Stack

- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** MongoDB (Leaderboard collection)

## Port

**8083**

## Responsibilities

- Top players ranking
- Leaderboard generation with filtering (region, hero type, winning percentage, weapons)
- Rank tier calculation (score ranges determine rank tiers like Valorant)
- Ranking algorithms (global score determines rankings, players with similar ranks can be in top 5)
- Statistics aggregation

## Status

🚧 **Ready for Implementation**
