/**
 * MongoDB Database Initialization Script
 * 
 * Sets up all collections and indexes for Battle Arena when MongoDB starts.
 * This runs automatically via docker-entrypoint-initdb.d when the container boots up.
 * 
 * Based on: docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md
 */

// Get the battlearena database (creates it if it doesn't exist)
db = db.getSiblingDB('battlearena');

print('========================================');
print('Setting up Battle Arena Database');
print('========================================\n');

// -----------------------------------------------------------------------------
// Users Collection - Where all user accounts live (Auth Service)
// -----------------------------------------------------------------------------
print('Setting up users collection...');
db.createCollection('users');

// Indexes as specified in ER diagram and database design doc
db.users.createIndex({ username: 1 }, { unique: true, name: 'idx_username_unique' });
db.users.createIndex({ email: 1 }, { unique: true, name: 'idx_email_unique' });
// Sparse index means it only indexes docs that have this field (OAuth users)
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true, name: 'idx_googleId_unique' });
db.users.createIndex({ provider: 1 }, { name: 'idx_provider' });
db.users.createIndex({ createdAt: 1 }, { name: 'idx_createdAt' });
// Additional indexes for common query patterns
db.users.createIndex({ firstName: 1 }, { name: 'idx_firstName' });
db.users.createIndex({ lastName: 1 }, { name: 'idx_lastName' });
db.users.createIndex({ providerId: 1 }, { name: 'idx_providerId' });
db.users.createIndex({ updatedAt: 1 }, { name: 'idx_updatedAt' });
db.users.createIndex({ lastLoginAt: 1 }, { name: 'idx_lastLoginAt' });
// Note: passwordHash intentionally NOT indexed (security best practice - never queried)
// Compound index helps with OAuth lookups (email + provider combo)
db.users.createIndex({ email: 1, provider: 1 }, { name: 'idx_email_provider' });

print('✓ Users collection ready\n');

// -----------------------------------------------------------------------------
// Profiles Collection - Player stats and rankings (Profile Service)
// -----------------------------------------------------------------------------
print('Setting up profiles collection...');
db.createCollection('profiles');

// RELATIONSHIP: Profiles.userId -> Users._id (One-to-One)
// Cascade: Delete profile when user is deleted (handled in application code)
// One profile per user (enforced by unique index)
db.profiles.createIndex({ userId: 1 }, { unique: true, name: 'idx_userId_unique' });
// Descending index for leaderboard queries (highest scores first)
db.profiles.createIndex({ globalScore: -1 }, { name: 'idx_globalScore_desc' });
db.profiles.createIndex({ rankTier: 1 }, { name: 'idx_rankTier' });
db.profiles.createIndex({ region: 1 }, { name: 'idx_region' });
db.profiles.createIndex({ updatedAt: -1 }, { name: 'idx_updatedAt_desc' });
// Additional index for querying by creation date (useful for analytics)
db.profiles.createIndex({ createdAt: 1 }, { name: 'idx_createdAt' });

print('✓ Profiles collection ready\n');

// -----------------------------------------------------------------------------
// Leaderboard Collection - Top players rankings (Leaderboard Service)
// -----------------------------------------------------------------------------
print('Setting up leaderboard collection...');
db.createCollection('leaderboard');

// RELATIONSHIP: Leaderboard.userId -> Users._id (One-to-One)
// Cascade: Delete leaderboard entry when user is deleted (handled in application code)
// One entry per user
db.leaderboard.createIndex({ userId: 1 }, { unique: true, name: 'idx_userId_unique' });
db.leaderboard.createIndex({ rank: 1 }, { name: 'idx_rank' });
db.leaderboard.createIndex({ globalScore: -1 }, { name: 'idx_globalScore_desc' });
db.leaderboard.createIndex({ rankTier: 1 }, { name: 'idx_rankTier' });
db.leaderboard.createIndex({ region: 1 }, { name: 'idx_region' });
db.leaderboard.createIndex({ heroType: 1 }, { name: 'idx_heroType' });
db.leaderboard.createIndex({ winRate: -1 }, { name: 'idx_winRate_desc' });
db.leaderboard.createIndex({ updatedAt: -1 }, { name: 'idx_updatedAt_desc' });
// Compound indexes for filtering leaderboards by region/hero type
db.leaderboard.createIndex({ region: 1, heroType: 1, globalScore: -1 }, { name: 'idx_region_heroType_globalScore' });
db.leaderboard.createIndex({ rankTier: 1, globalScore: -1 }, { name: 'idx_rankTier_globalScore' });

print('✓ Leaderboard collection ready\n');

// -----------------------------------------------------------------------------
// Matches Collection - Game history and replays (Game Engine Service)
// -----------------------------------------------------------------------------
print('Setting up matches collection...');
db.createCollection('matches');

// Unique match ID for each game
db.matches.createIndex({ matchId: 1 }, { unique: true, name: 'idx_matchId_unique' });

// RELATIONSHIPS:
// - Matches.player1Id -> Users._id (One-to-Many) - Cascade: Keep matches for history
// - Matches.player2Id -> Users._id (One-to-Many) - Cascade: Keep matches for history
// - Matches.winnerId -> Users._id (One-to-Many) - Cascade: Keep matches for history
// - Matches.arenaId -> Arenas.arenaId (Many-to-One) - Cascade: Keep matches for history
// - Matches.player1Hero -> Heroes.heroType (Many-to-One) - Cascade: Keep matches for history
// - Matches.player2Hero -> Heroes.heroType (Many-to-One) - Cascade: Keep matches for history
// - Matches.player1Weapons -> Weapons.weaponId (Many-to-Many) - Cascade: Keep matches for history
// - Matches.player2Weapons -> Weapons.weaponId (Many-to-Many) - Cascade: Keep matches for history

// Indexes for finding a player's match history (foreign key fields)
db.matches.createIndex({ player1Id: 1 }, { name: 'idx_player1Id' });
db.matches.createIndex({ player2Id: 1 }, { name: 'idx_player2Id' });
db.matches.createIndex({ winnerId: 1 }, { name: 'idx_winnerId' });
// Indexes for filtering by hero/arena (foreign key fields)
db.matches.createIndex({ player1Hero: 1 }, { name: 'idx_player1Hero' });
db.matches.createIndex({ player2Hero: 1 }, { name: 'idx_player2Hero' });
db.matches.createIndex({ arenaId: 1 }, { name: 'idx_arenaId' });
// Descending indexes for recent matches queries
db.matches.createIndex({ startTime: -1 }, { name: 'idx_startTime_desc' });
db.matches.createIndex({ createdAt: -1 }, { name: 'idx_createdAt_desc' });

print('✓ Matches collection ready\n');

// -----------------------------------------------------------------------------
// Heroes Collection - Hero configurations (static game data)
// -----------------------------------------------------------------------------
print('Setting up heroes collection...');
db.createCollection('heroes');

// RELATIONSHIPS:
// - Heroes._id -> Weapons.heroType (One-to-Many) - Cascade: Keep weapons for history
// - Heroes.heroType -> Arenas.heroTypes (Many-to-Many) - Cascade: Keep arenas for history

// Each hero has a unique ID
db.heroes.createIndex({ heroId: 1 }, { unique: true, name: 'idx_heroId_unique' });
db.heroes.createIndex({ heroType: 1 }, { name: 'idx_heroType' });
db.heroes.createIndex({ name: 1 }, { name: 'idx_name' });

print('✓ Heroes collection ready\n');

// -----------------------------------------------------------------------------
// Weapons Collection - Weapon configurations (static game data)
// -----------------------------------------------------------------------------
print('Setting up weapons collection...');
db.createCollection('weapons');

// RELATIONSHIP: Weapons.heroType -> Heroes.heroType (Many-to-One)
// Cascade: Keep weapons when hero is deleted (for history - handled in application code)

// Each weapon has a unique ID
db.weapons.createIndex({ weaponId: 1 }, { unique: true, name: 'idx_weaponId_unique' });
// Index on foreign key field for hero relationship
db.weapons.createIndex({ heroType: 1 }, { name: 'idx_heroType' });
db.weapons.createIndex({ name: 1 }, { name: 'idx_name' });

print('✓ Weapons collection ready\n');

// -----------------------------------------------------------------------------
// Arenas Collection - Arena configurations (static game data)
// -----------------------------------------------------------------------------
print('Setting up arenas collection...');
db.createCollection('arenas');

// RELATIONSHIP: Arenas.heroTypes -> Heroes.heroType (Many-to-Many via array)
// Cascade: Keep arenas when hero is deleted (for history - handled in application code)

// Each arena has a unique ID
db.arenas.createIndex({ arenaId: 1 }, { unique: true, name: 'idx_arenaId_unique' });
// Index on heroTypes array for hero relationship queries
db.arenas.createIndex({ heroTypes: 1 }, { name: 'idx_heroTypes' });
db.arenas.createIndex({ name: 1 }, { name: 'idx_name' });

print('✓ Arenas collection ready\n');

// -----------------------------------------------------------------------------
// All done!
// -----------------------------------------------------------------------------
print('========================================');
print('Database setup complete!');
print('========================================\n');

print('Collections created:');
print('  ✓ users');
print('  ✓ profiles');
print('  ✓ leaderboard');
print('  ✓ matches');
print('  ✓ heroes');
print('  ✓ weapons');
print('  ✓ arenas\n');

print('All indexes are in place. Database is ready to go!\n');

// -----------------------------------------------------------------------------
// NOTE: Database Relationships
// -----------------------------------------------------------------------------
// MongoDB does not enforce foreign key constraints at the database level.
// Relationships are logical and documented above in comments.
// 
// All foreign key fields have been indexed for query performance.
// Cascade behaviors (delete, update) are handled in application code, not here.
//
// Relationship Summary (as per ER diagram):
// - Users <-> Profiles (One-to-One) via userId
// - Users <-> Leaderboard (One-to-One) via userId  
// - Users <-> Matches (One-to-Many) via player1Id, player2Id, winnerId
// - Heroes <-> Weapons (One-to-Many) via heroType
// - Heroes <-> Arenas (Many-to-Many) via heroTypes array
// - Matches -> Heroes (Many-to-One) via player1Hero, player2Hero
// - Matches -> Weapons (Many-to-Many) via player1Weapons, player2Weapons arrays
// - Matches -> Arenas (Many-to-One) via arenaId
//
// See: docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md (Section 3)
// See: docs/03-DIAGRAMS/er-diagrams/database-er-diagram.puml

