# EPIC-VS-5: Full Game Features

**Copy and paste this template directly into GitHub Issues.**

**Note:** All technical implementation details from Phase 5 (Matchmaking - hero/arena/weapon selection, real player matching), Phase 6 (Game Engine - hero/weapon/arena integration), and Phase 7 (Frontend - selection UIs) have been consolidated into this file. You no longer need to reference multiple Phase documents when creating GitHub issues.

---

## EPIC-VS-5: Full Game Features

### Issue Template:

````
Title: EPIC-VS-5: Full Game Features

Description:
## Overview
Implement the fifth vertical slice where players can select heroes, arenas, and weapons before matches, and get matched with real players (not bots). This epic enables the complete pre-game experience - hero selection, real player matchmaking, arena voting/elimination, and weapon drafting. This completes the Beta milestone - players can play full matches with all features enabled.

**This is the fifth vertical slice** - it enables players to customize their match experience and play against real opponents.

## Vertical Slice Goal
A player can:
1. Select multiple heroes before matchmaking (increases match chances)
2. Get matched with real players (not bots) based on score/rank and hero compatibility
3. Vote on arena selection (elimination system)
4. Draft weapons (turn-based selection)
5. Play matches with selected hero, arena, and weapon
6. See all features working together end-to-end

## Success Criteria
- [ ] Player can select multiple heroes (up to 5) before joining queue
- [ ] Hero selection stored and used for matchmaking compatibility
- [ ] Real player matching works (no bots)
- [ ] Matchmaking algorithm uses score/rank and hero compatibility
- [ ] Arena voting/elimination system works (players vote, least popular eliminated)
- [ ] Weapon drafting works (alternating picks, 30-second timer per pick)
- [ ] Selected hero, arena, and weapon used in game
- [ ] Frontend UI for hero selection (multiple selection with visual feedback)
- [ ] Frontend UI for arena voting (vote on available arenas)
- [ ] Frontend UI for weapon drafting (pick weapons in turn order)
- [ ] End-to-end flow works: Select Heroes → Join Queue → Get Matched → Vote Arena → Draft Weapons → Play Match

## MVP Scope (Minimal for Beta Milestone)

**What's Included:**
- Multiple hero selection (up to 5 heroes, priority order)
- Real player matching (score/rank-based with hero compatibility)
- Arena voting system (3-5 arenas, elimination voting)
- Weapon drafting (alternating picks, 30-second timer)
- Hero compatibility checking (incompatible heroes cannot be matched)
- Score band widening (widen matchmaking range after wait time)
- Frontend selection UIs (hero cards, arena voting, weapon picker)

**What's Deferred:**
- Advanced hero selection strategies (preferred hero combinations)
- Complex arena selection (map-specific rules, weather effects)
- Advanced weapon balancing (weapon-specific stats, synergies)
- Matchmaking optimization (skill-based rating, MMR)
- Spectator mode
- Replay system

## Technical References

### Phase Documents (Technical Implementation Details)
This epic references Phase 5 (Matchmaking), Phase 6 (Game Engine), and Phase 7 (Frontend) for technical specifications.

- **Matchmaking Service:** See Phase 5 (PHASE-5 issue) - STORY-5-2, STORY-5-5
- **Game Engine Service:** See Phase 6 (PHASE-6 issue) - Hero/Weapon/Arena integration
- **Frontend:** See Phase 7 (PHASE-7 issue) - STORY-7-4 (Hero Selection UI)

### Architecture References

**Sequence Diagrams:**
- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml) - Complete matchmaking flow with hero selection
- [Hero Selection Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/hero-selection-flow.puml) - Hero selection flow
- [Arena Selection Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/arena-selection-flow.puml) - Arena voting flow
- [Weapon Selection Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/weapon-selection-flow.puml) - Weapon drafting flow
- [Sequence Diagrams Index](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/README.md)

**Class Diagrams:**
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml)
- [Game Engine Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/game-engine-service.puml)
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml)

**Architecture Documents:**
- [System Architecture - Matchmaking Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#24-matchmaking-service)
- [Matchmaking Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md)
- [Game Engine Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md)
- [Frontend Components Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Heroes, Arenas, Weapons collections

## Stories (Player Experience)

### VS-5-1: Implement multiple hero selection with priority ordering

**User Story:** As a player, I want to select multiple heroes before matchmaking so that I can increase my match chances and play with my preferred heroes.

**Related Diagrams & Documents:**
- [Hero Selection Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/hero-selection-flow.puml) - Hero selection flow
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml) - HeroSelector component
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) - HeroSelector (section 3.5)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Heroes collection schema

**Acceptance Criteria:**
- [ ] Hero selection page displays available heroes
- [ ] Player can select multiple heroes (up to 5)
- [ ] Hero selection stored with priority order
- [ ] Selection persisted in Redis for matchmaking
- [ ] Hero selection validated (valid hero IDs, no duplicates, max 5)
- [ ] Selected heroes used for matchmaking compatibility checking
- [ ] Hero selection can be updated before joining queue
- [ ] Frontend hero selection UI with visual feedback (selected state, hero cards)
- [ ] End-to-end test: Select heroes → Join queue → Heroes used in matchmaking

**Technical Details:**

**Backend - Hero Model:**
**File:** `backend-services/matchmaking-service/src/models/Hero.ts`

**Hero Model Implementation Requirements:**
- Create HeroType enum with values: TANK, DAMAGE, SUPPORT (string values: "tank", "damage", "support")
- Create HeroRarity enum with values: COMMON, RARE, EPIC, LEGENDARY (string values: "common", "rare", "epic", "legendary")
- Create Hero interface with fields:
  - id (string) - Unique hero identifier
  - name (string) - Hero display name
  - type (HeroType) - Hero type classification
  - rarity (HeroRarity) - Hero rarity level
  - tags (string[]) - Hero tags (e.g., ['melee', 'ranged', 'magic'])
  - compatibilityRules (optional object) - Hero compatibility rules:
    - incompatibleWith (string[], optional) - Hero IDs that cannot be matched together
    - preferredWith (string[], optional) - Hero IDs that work well together
  - createdAt (Date, optional) - Hero creation timestamp
  - updatedAt (Date, optional) - Hero last update timestamp
- Create HeroModel class implementing Hero interface:
  - Constructor accepting all Hero interface fields
  - Implement `isCompatibleWith(otherHero)` method:
    - Check if hero has incompatibleWith rules
    - If no rules, return true (compatible by default)
    - If rules exist, check if otherHero.id is in incompatibleWith array
    - Return false if incompatible, true otherwise
  - Implement `isPreferredWith(otherHero)` method:
    - Check if hero has preferredWith rules
    - If no rules, return false (not preferred by default)
    - If rules exist, check if otherHero.id is in preferredWith array
    - Return true if preferred, false otherwise

**Backend - Hero Selection Types:**
**File:** `backend-services/matchmaking-service/src/types/hero.types.ts`

**Hero Selection Types Implementation Requirements:**
- Create HeroSelection interface with fields:
  - userId (string) - User ID who made the selection
  - heroIds (string[]) - Array of selected hero IDs (up to 5)
  - priority (number[]) - Priority order array (0 = highest priority)
  - timestamp (Date) - Selection timestamp
- Create HeroSelectionRequest interface with fields:
  - heroIds (string[]) - Array of hero IDs to select
  - priority (number[], optional) - Priority order array (defaults to array order if not provided)

**Backend - Hero Selection Service:**
**File:** `backend-services/matchmaking-service/src/services/HeroSelector.ts`

**HeroSelector Implementation Requirements:**
- Create HeroSelector class in `src/services/` directory
- Define private constant SELECTION_KEY_PREFIX = "hero-selection:" for Redis key prefix
- Inject Redis client via dependency injection or configuration
- Implement `selectHeroes(userId, request)` method:
  - Validate hero selection using validateHeroSelection() utility function
  - If validation fails, throw error with validation error messages
  - Create HeroSelection object with userId, heroIds, priority (or default to array order), and current timestamp
  - Store selection in Redis with key format "hero-selection:{userId}"
  - Set Redis TTL to 1 hour (3600 seconds)
  - Serialize selection object as JSON before storing
- Implement `getHeroSelection(userId)` method:
  - Retrieve selection from Redis using key "hero-selection:{userId}"
  - If not found, return null
  - If found, parse JSON and return HeroSelection object
- Implement `areCompatible(selection1, selection2)` method:
  - Fetch hero models for both selections using getHeroes() method
  - Check compatibility between all heroes in selection1 and selection2
  - For each hero pair, call isCompatibleWith() method
  - Return false if any heroes are incompatible, true if all are compatible
- Implement private `getHeroes(heroIds)` method:
  - Fetch hero data from database or cache based on heroIds
  - Return array of Hero objects
  - Handle errors gracefully

**Backend - Hero Selection Socket.io Event Handler:**
**File:** `backend-services/matchmaking-service/src/controllers/MatchmakingController.ts`

**MatchmakingController.handleHeroSelection() Implementation Requirements:**
- Add `handleHeroSelection(socket, data)` method to MatchmakingController class
- Extract userId from socket.data (set by JWT authentication middleware)
- Call HeroSelector.selectHeroes() with userId and HeroSelectionRequest data
- On success: Emit "hero-selection-success" event to socket with message and heroIds
- On error: Emit "hero-selection-error" event to socket with error message
- Handle errors gracefully and provide meaningful error messages to client
- Use try-catch block to handle exceptions

**Backend - Hero Selection Validation:**
**File:** `backend-services/matchmaking-service/src/utils/validators.ts`

**validateHeroSelection() Implementation Requirements:**
- Create ValidationResult interface with valid (boolean) and errors (string[]) fields
- Create `validateHeroSelection(payload)` async function:
  - Initialize errors array
  - Validate heroIds array exists and is not empty (add error if invalid)
  - Validate maximum hero selection limit (MAX_HEROES = 5, add error if exceeded)
  - Validate no duplicate hero IDs (use Set to check uniqueness, add error if duplicates found)
  - Validate hero IDs exist in allowed hero pool (check against hero database/cache)
  - If priority array is provided:
    - Validate priority array length matches heroIds array length
    - Validate no duplicate priority values
    - Validate priority values are within valid range (0 to heroIds.length - 1)
    - Add appropriate error messages for each validation failure
  - Return ValidationResult object with valid flag (true if no errors) and errors array
- Handle async operations for hero pool validation

**Frontend - Hero Selection Component:**
**File:** `frontend-service/src/app/hero-selection/components/hero-selection/hero-selection.component.ts`

**HeroSelectionComponent Implementation Requirements:**
- Create HeroSelectionComponent class in `src/app/hero-selection/components/hero-selection/` directory
- Add `@Component` decorator with selector "app-hero-selection", template, and styles
- Implement OnInit interface
- Add heroes property (Hero[]) to store available heroes
- Add selectedHeroIds property (string[]) to store selected hero IDs
- Inject MatchmakingService via constructor
- Implement `ngOnInit()` method:
  - Call loadHeroes() method to fetch available heroes
- Implement `loadHeroes()` method:
  - Call MatchmakingService.getAvailableHeroes()
  - Subscribe to Observable response
  - On success: Update heroes property
  - On error: Log error and display error message
- Implement `toggleHeroSelection(heroId)` method:
  - Check if heroId is already in selectedHeroIds array
  - If selected: Remove from array (deselect)
  - If not selected: Add to array if less than 5 heroes selected (max 5)
- Implement `isHeroSelected(heroId)` method:
  - Check if heroId exists in selectedHeroIds array
  - Return boolean indicating selection state
- Implement `submitSelection()` method:
  - Validate at least one hero is selected (show alert if none)
  - Call MatchmakingService.selectHeroes() with selectedHeroIds
  - Subscribe to Observable response
  - On success: Show success message, navigate to matchmaking queue
  - On error: Log error and show error message
- Display hero cards in template with visual feedback for selected state
- Display selection count (X/5 heroes selected)

**Frontend - Matchmaking Service (Hero Selection):**
**File:** `frontend-service/src/app/services/matchmaking.service.ts`

**MatchmakingService Hero Selection Methods Implementation Requirements:**
- Add `getAvailableHeroes()` method to MatchmakingService:
  - Listen for "available-heroes" event from Socket.io server
  - Return Observable<Hero[]> for components to subscribe
  - Handle connection errors gracefully
- Add `selectHeroes(heroIds)` method to MatchmakingService:
  - Emit "hero-selection" event to Socket.io server with heroIds array
  - Return Observable that completes on success or errors on failure
  - Listen for "hero-selection-success" event to complete Observable
  - Listen for "hero-selection-error" event to error Observable
  - Handle one-time events using socket.once() to avoid memory leaks

---

### VS-5-2: Implement real player matching with score-based algorithm

**User Story:** As a player, I want to be matched with real players of similar skill level and compatible hero selection so that I have fair and fun matches.

**Related Diagrams & Documents:**

- [Matchmaking Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/matchmaking-flow.puml) - Real player matching flow
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml) - MatchmakingEngine component
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) - MatchmakingEngine (section 3.3)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Matchmaking algorithm overview

**Acceptance Criteria:**

- [ ] Matchmaking algorithm uses global score/rank for matching
- [ ] Hero compatibility checks performed during matching
- [ ] Score band widening after wait time (initial ±500, widens by 200 every 30 seconds)
- [ ] Maximum score band width enforced (±2000 points)
- [ ] Rank tier matching (same tier preferred, adjacent tiers acceptable)
- [ ] Region matching (same region preferred)
- [ ] Match quality scoring algorithm implemented
- [ ] Periodic matchmaking loop runs every 5-10 seconds
- [ ] Matched players removed from queue
- [ ] Match creation triggers Game Engine Service
- [ ] End-to-end test: Join queue → Wait → Get matched with real player → Enter game

**Technical Details:**

**Backend - Matchmaking Algorithm Design:**

**Matching Criteria:**

1. **Global Score**: Players within score band (initial ±500, widens over time)
2. **Rank Tier**: Same rank tier preferred, adjacent tiers acceptable
3. **Hero Compatibility**: Heroes must be compatible (no incompatible pairs)
4. **Region**: Same region preferred for latency

**Score Band Widening:**

- **Initial Band**: ±500 points
- **Widen Interval**: Every 30 seconds
- **Widen Amount**: +200 points per interval
- **Maximum Band**: ±2000 points
- **Timeout**: 5 minutes maximum wait

**Match Quality Scoring:**

- **Score Difference**: Lower is better (closer scores = better match)
- **Rank Tier Match**: Same tier = +10, adjacent = +5, far = 0
- **Hero Compatibility**: Compatible = +5, preferred = +10
- **Region Match**: Same region = +5

**Backend - Matchmaking Engine:**
**File:** `backend-services/matchmaking-service/src/services/MatchmakingEngine.ts`

**MatchmakingEngine Implementation Requirements:**
- Create MatchmakingEngine class in `src/services/` directory
- Add private matchmakingInterval property (NodeJS.Timeout | null) to track interval
- Define constant MATCHMAKING_INTERVAL_MS = 5000 (5 seconds) for matchmaking cycle frequency
- Inject dependencies via constructor: QueueManager, HeroSelector, MatchingStrategy, GameEngineService
- Implement `start()` method:
  - Check if matchmaking interval is already running (return if so)
  - Set up interval to call runMatchmakingCycle() every MATCHMAKING_INTERVAL_MS
  - Store interval reference in matchmakingInterval property
- Implement `stop()` method:
  - Clear matchmaking interval if running
  - Set matchmakingInterval to null
- Implement private `runMatchmakingCycle()` method:
  - Get list of regions from configuration (e.g., ["NA", "EU", "ASIA"])
  - Process queue for each region sequentially
  - Handle errors gracefully (log but don't throw, continue next cycle)
- Implement private `processRegionQueue(region)` method:
  - Get queue length for region using QueueManager.getQueueLength()
  - If queue length < 2, return early (need at least 2 players)
  - Get all queue entries for region using QueueManager.getQueueEntries()
  - Find matches using MatchingStrategy.findMatches() with entries
  - Process each match by calling createMatch()
- Implement private `createMatch(match)` method:
  - Remove all matched players from queue using QueueManager.dequeuePlayer()
  - Notify Game Engine Service to create game room using GameEngineService.createMatch()
  - Pass match data (playerIds, region, heroSelections) to Game Engine

**Backend - Matching Strategy:**
**File:** `backend-services/matchmaking-service/src/services/strategy/ScoreBasedMatchingStrategy.ts`

**ScoreBasedMatchingStrategy Implementation Requirements:**
- Create ScoreBasedMatchingStrategy class implementing MatchingStrategy interface
- Define constants:
  - INITIAL_SCORE_BAND = 500 (initial score difference allowed)
  - WIDEN_AMOUNT = 200 (score band widening amount per interval)
  - WIDEN_INTERVAL_MS = 30000 (30 seconds between widenings)
  - MAX_SCORE_BAND = 2000 (maximum score band width)
- Inject HeroSelector via constructor
- Implement `findMatches(entries)` method:
  - Initialize empty matches array
  - Iterate through queue entries
  - Skip entries already matched
  - Calculate score band based on player wait time
  - Filter candidates within score band (exclude self and already matched)
  - Select best match from candidates using selectBestMatch()
  - Add match to matches array if found
  - Return matches array
- Implement private `calculateScoreBand(waitTime)` method:
  - Calculate number of widen intervals based on wait time
  - Calculate band width: INITIAL_SCORE_BAND + (intervals * WIDEN_AMOUNT)
  - Return minimum of calculated band and MAX_SCORE_BAND
- Implement private `selectBestMatch(player1, candidates)` method:
  - Initialize bestMatch as null
  - For each candidate:
    - Get hero selections for both players
    - Check hero compatibility using HeroSelector.areCompatible()
    - Skip incompatible candidates
    - Calculate match quality score using calculateMatchQuality()
    - Update bestMatch if score is higher
  - If bestMatch found, return Match object with playerIds, region, and heroSelections
  - Return null if no match found
- Implement private `calculateMatchQuality(player1, player2)` method:
  - Initialize score to 0
  - Calculate score difference (lower is better, invert: 100 - min(scoreDiff, 100), max 100 points)
  - Add 10 points if same rank tier, 5 points if adjacent tiers
  - Add 5 points if same region
  - Return total match quality score
- Implement private `areAdjacentTiers(tier1, tier2)` method:
  - Define tier order array: ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"]
  - Find index of each tier
  - Return true if absolute difference of indices equals 1

---

### VS-5-3: Implement arena voting system with elimination mechanism

**User Story:** As a player, I want to vote on which arena to play in so that the match uses a fair and preferred arena.

**Related Diagrams & Documents:**

- [Arena Selection Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/arena-selection-flow.puml) - Arena voting flow
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml) - ArenaSelector component
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) - ArenaSelector (section 3.6)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Arenas collection schema

**Acceptance Criteria:**

- [ ] Arena voting system implemented (elimination voting)
- [ ] Players can vote on available arenas (3-5 arenas)
- [ ] Least popular arena eliminated after voting phase
- [ ] Voting phase has timer (e.g., 30 seconds)
- [ ] Selected arena passed to Game Engine Service
- [ ] Frontend arena voting UI (arena cards, vote buttons, timer)
- [ ] Real-time vote updates via Socket.io
- [ ] End-to-end test: Get matched → Vote on arena → Arena selected → Enter game

**Technical Details:**

**Backend - Arena Model:**
**File:** `backend-services/matchmaking-service/src/models/Arena.ts`

**Arena Model Implementation Requirements:**
- Create Arena interface with fields:
  - id (string) - Unique arena identifier
  - name (string) - Arena display name
  - description (string) - Arena description
  - imageUrl (string) - URL to arena image
  - terrainType (string) - Terrain type (e.g., 'desert', 'forest', 'snow')
  - difficulty (number) - Difficulty level (1-5)
  - createdAt (Date, optional) - Arena creation timestamp
  - updatedAt (Date, optional) - Arena last update timestamp

**Backend - Arena Selection Service:**
**File:** `backend-services/matchmaking-service/src/services/ArenaSelector.ts`

**ArenaSelector Implementation Requirements:**
- Create ArenaVote interface with userId (string), arenaId (string), and timestamp (Date) fields
- Create ArenaSelector class in `src/services/` directory
- Define private constant VOTE_KEY_PREFIX = "arena-vote:" for Redis key prefix
- Define private constant VOTING_PHASE_DURATION_MS = 30000 (30 seconds) for voting phase duration
- Inject Redis client via dependency injection or configuration
- Implement `startVotingPhase(matchId, availableArenas)` method:
  - Create voting state object with matchId, availableArenas (map to IDs), votes (empty object), startTime, and endTime
  - Store voting state in Redis with key "arena-vote:{matchId}"
  - Set Redis TTL to 60 seconds (1 minute)
  - Serialize voting state as JSON before storing
- Implement `submitVote(matchId, userId, arenaId)` method:
  - Retrieve voting state from Redis
  - Validate voting phase exists (throw error if not found)
  - Check if voting phase is still active (throw error if ended)
  - Check if arena is available for voting (throw error if not)
  - Store vote in votingState.votes object with userId as key
  - Update Redis with updated voting state
- Implement `getSelectedArena(matchId)` method:
  - Retrieve voting state from Redis
  - Count votes for each arena
  - Find least popular arena (elimination voting)
  - Remove least popular arena from available arenas
  - If only one arena remains, return it
  - Otherwise, select most popular arena from remaining arenas (MVP approach)
  - Return selected arena ID or null if not found
- Implement `getVotingState(matchId)` method:
  - Retrieve voting state from Redis
  - Parse JSON and return voting state object
  - Return null if not found

**Frontend - Arena Selection Component:**
**File:** `frontend-service/src/app/arena-selection/components/arena-selection/arena-selection.component.ts`

**ArenaSelectionComponent Implementation Requirements:**
- Create ArenaSelectionComponent class in `src/app/arena-selection/components/arena-selection/` directory
- Add `@Component` decorator with selector "app-arena-selection", template, and styles
- Implement OnInit and OnDestroy interfaces
- Add arenas property (Arena[]) to store available arenas
- Add selectedArenaId property (string | null) to track user's vote
- Add votes property (object with arenaId keys and number values) to store vote counts
- Add timeRemaining property (number, default 30) for voting timer
- Add private timerSubscription property (Subscription) for timer cleanup
- Inject MatchmakingService via constructor
- Implement `ngOnInit()` method:
  - Call loadArenas() to fetch available arenas
  - Call startTimer() to start countdown
  - Call subscribeToVoteUpdates() to listen for real-time vote updates
- Implement `ngOnDestroy()` method:
  - Unsubscribe from timerSubscription if exists
- Implement `loadArenas()` method:
  - Call MatchmakingService.getAvailableArenas()
  - Subscribe to Observable response
  - On success: Update arenas property
  - On error: Log error and display error message
- Implement `voteForArena(arenaId)` method:
  - Set selectedArenaId to arenaId
  - Call MatchmakingService.voteForArena() with arenaId
  - Subscribe to Observable response
  - On success: Log success message
  - On error: Log error and display error message
- Implement `subscribeToVoteUpdates()` method:
  - Subscribe to MatchmakingService.onVoteUpdate() Observable
  - On update: Update votes property with new vote counts
- Implement `startTimer()` method:
  - Create interval subscription that fires every 1 second
  - Decrement timeRemaining each second
  - When timeRemaining reaches 0:
    - Call MatchmakingService.getSelectedArena()
    - On success: Navigate to weapon selection or game
- Display arena cards in template with vote buttons and vote counts
- Display timer countdown
- Highlight selected arena

---

### VS-5-4: Implement weapon drafting system with turn-based selection

**User Story:** As a player, I want to draft weapons in a turn-based system so that I can select my preferred weapon for the match.

**Related Diagrams & Documents:**

- [Weapon Selection Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/weapon-selection-flow.puml) - Weapon drafting flow
- [Matchmaking Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/matchmaking-service.puml) - WeaponSelector component
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) - WeaponSelector (section 3.7)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Weapons collection schema

**Acceptance Criteria:**

- [ ] Weapon drafting system implemented (alternating picks)
- [ ] Turn order determined (random or based on matchmaking order)
- [ ] 30-second timer per pick
- [ ] Players cannot pick same weapon
- [ ] Selected weapons passed to Game Engine Service
- [ ] Frontend weapon drafting UI (weapon cards, pick buttons, timer, turn indicator)
- [ ] Real-time turn updates via Socket.io
- [ ] End-to-end test: Arena selected → Draft weapons → Weapons selected → Enter game

**Technical Details:**

**Backend - Weapon Model:**
**File:** `backend-services/matchmaking-service/src/models/Weapon.ts`

**Weapon Model Implementation Requirements:**
- Create Weapon interface with fields:
  - id (string) - Unique weapon identifier
  - name (string) - Weapon display name
  - description (string) - Weapon description
  - imageUrl (string) - URL to weapon image
  - damage (number) - Weapon damage value
  - range (number) - Weapon range value
  - projectileType (string) - Projectile type (e.g., 'explosive', 'piercing', 'magic')
  - rarity (string) - Weapon rarity (e.g., 'common', 'rare', 'epic', 'legendary')
  - createdAt (Date, optional) - Weapon creation timestamp
  - updatedAt (Date, optional) - Weapon last update timestamp

**Backend - Weapon Selection Service:**
**File:** `backend-services/matchmaking-service/src/services/WeaponSelector.ts`

**WeaponSelector Implementation Requirements:**
- Create WeaponSelectionState interface with fields:
  - matchId (string) - Match identifier
  - playerIds (string[]) - Array of player IDs in turn order
  - currentTurn (number) - Index in playerIds array for current turn
  - turnStartTime (number) - Timestamp when current turn started
  - pickTimeLimit (number) - Time limit per pick (30000ms = 30 seconds)
  - selectedWeapons (object) - Map of playerId to weaponId
  - availableWeapons (string[]) - Array of available weapon IDs
- Create WeaponSelector class in `src/services/` directory
- Define private constant SELECTION_KEY_PREFIX = "weapon-selection:" for Redis key prefix
- Inject Redis client via dependency injection or configuration
- Implement `startDraftingPhase(matchId, playerIds, availableWeapons)` method:
  - Randomize turn order by shuffling playerIds array
  - Create WeaponSelectionState object with matchId, shuffled playerIds, currentTurn (0), turnStartTime (now), pickTimeLimit (30000), empty selectedWeapons, and availableWeapons (map to IDs)
  - Store state in Redis with key "weapon-selection:{matchId}"
  - Set Redis TTL to 300 seconds (5 minutes)
  - Serialize state as JSON before storing
- Implement `pickWeapon(matchId, userId, weaponId)` method:
  - Retrieve drafting state from Redis
  - Validate drafting phase exists (throw error if not found)
  - Check if it's player's turn (throw error if not)
  - Check if weapon is available (throw error if not)
  - Check if weapon already selected (throw error if selected)
  - Store weapon selection in state.selectedWeapons with userId as key
  - Remove weapon from availableWeapons array
  - Move to next turn (increment currentTurn, update turnStartTime)
  - Check if drafting is complete (all players picked)
  - If complete but not all players have weapons, reset turn for next round
  - Update Redis with updated state
- Implement `getDraftingState(matchId)` method:
  - Retrieve state from Redis
  - Parse JSON and return WeaponSelectionState object
  - Return null if not found
- Implement `isDraftingComplete(matchId)` method:
  - Get drafting state
  - Return true if number of selected weapons equals number of players
  - Return false otherwise
- Implement `getSelectedWeapons(matchId)` method:
  - Get drafting state
  - Return selectedWeapons object from state
  - Return empty object if state not found

**Frontend - Weapon Selection Component:**
**File:** `frontend-service/src/app/weapon-selection/components/weapon-selection/weapon-selection.component.ts`

**WeaponSelectionComponent Implementation Requirements:**
- Create WeaponSelectionComponent class in `src/app/weapon-selection/components/weapon-selection/` directory
- Add `@Component` decorator with selector "app-weapon-selection", template, and styles
- Implement OnInit and OnDestroy interfaces
- Add weapons property (Weapon[]) to store all available weapons
- Add availableWeapons property (Weapon[]) to store weapons not yet selected
- Add selectedWeapons property (object with playerId keys and weaponId values) to store selections
- Add currentTurn property (number) to track current turn index
- Add isMyTurn property (boolean) to track if it's current user's turn
- Add timeRemaining property (number, default 30) for turn timer
- Add private timerSubscription property (Subscription) for timer cleanup
- Inject MatchmakingService via constructor
- Implement `ngOnInit()` method:
  - Call loadWeapons() to fetch available weapons
  - Call subscribeToDraftingUpdates() to listen for real-time updates
  - Call startTimer() to start countdown
- Implement `ngOnDestroy()` method:
  - Unsubscribe from timerSubscription if exists
- Implement `loadWeapons()` method:
  - Call MatchmakingService.getAvailableWeapons()
  - Subscribe to Observable response
  - On success: Update weapons property and call updateAvailableWeapons()
  - On error: Log error and display error message
- Implement `pickWeapon(weaponId)` method:
  - Check if it's user's turn (return early if not)
  - Call MatchmakingService.pickWeapon() with weaponId
  - Subscribe to Observable response
  - On success: Log success message
  - On error: Log error and display error message
- Implement `subscribeToDraftingUpdates()` method:
  - Subscribe to MatchmakingService.onDraftingUpdate() Observable
  - On update: Update currentTurn, selectedWeapons, call updateAvailableWeapons(), and checkIfMyTurn()
- Implement `updateAvailableWeapons()` method:
  - Get selected weapon IDs from selectedWeapons object
  - Filter weapons array to exclude selected weapons
  - Update availableWeapons property
- Implement `checkIfMyTurn(state)` method:
  - Get current user ID from MatchmakingService.getCurrentUserId()
  - Get current player ID from state.playerIds[state.currentTurn]
  - Set isMyTurn to true if current player ID matches user ID
- Implement `startTimer()` method:
  - Create interval subscription that fires every 1 second
  - Decrement timeRemaining each second
  - When timeRemaining reaches 0: Reset to 30 for next turn (or handle timeout)
- Display weapon cards in template with pick buttons
- Display turn indicator showing whose turn it is
- Display timer countdown
- Disable pick buttons when not user's turn
- Highlight selected weapons

---

## Related Epics

- **EPIC-VS-1:** Foundation & Infrastructure Setup (prerequisite)
- **EPIC-VS-2:** Authentication (prerequisite)
- **EPIC-VS-3:** First Playable Match (prerequisite - basic matchmaking and gameplay)
- **EPIC-VS-4:** Profile & Progression (prerequisite - score/rank for matchmaking)

## Dependencies

- VS-1: Foundation must be complete (services, infrastructure)
- VS-2: Authentication must be complete (JWT, user identity)
- VS-3: Basic matchmaking and gameplay must work (queue, game engine)
- VS-4: Profile and scoring must work (global score, rank tier for matchmaking)

## Labels

epic:full-game-features, vertical-slice:5, milestone:beta, priority:high

## Milestone

Beta: Full Game Features

```

---

**Note:** This epic consolidates all technical details from Phase 5 (Matchmaking - hero/arena/weapon selection, real player matching), Phase 6 (Game Engine - integration), and Phase 7 (Frontend - selection UIs). All code snippets, folder structures, class names, and method signatures match the Phase documents exactly for consistency.

```
````
