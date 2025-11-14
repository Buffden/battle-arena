# Database Init Scripts

MongoDB initialization scripts for setting up the Battle Arena database.

## What's Here

- `init.js` - Main initialization script that creates all collections and indexes

## What It Does

The `init.js` script automatically runs when MongoDB container starts (via `docker-entrypoint-initdb.d`). It:

1. **Creates Collections:**
   - `users` - User accounts (Auth Service)
   - `profiles` - User profiles (Profile Service)
   - `leaderboard` - Leaderboard data (Leaderboard Service)
   - `matches` - Match history (Game Engine Service)
   - `heroes` - Hero configurations (static data)
   - `weapons` - Weapon configurations (static data)
   - `arenas` - Arena configurations (static data)

2. **Creates Indexes:**
   - Unique indexes for primary keys (username, email, userId, matchId, etc.)
   - Performance indexes for queries (globalScore, rankTier, region, etc.)
   - Compound indexes for complex queries

## Usage

The script runs automatically when MongoDB starts via Docker Compose. The script is mounted to `/docker-entrypoint-initdb.d/` in the MongoDB container.

For manual execution:
```bash
mongosh < init.js
```

## Documentation

See the [Database Design](../../docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) document for detailed schema information.
