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

### VS-5-1: Player can select multiple heroes before matchmaking

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

```typescript
export enum HeroType {
  TANK = "tank",
  DAMAGE = "damage",
  SUPPORT = "support",
}

export enum HeroRarity {
  COMMON = "common",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

export interface Hero {
  id: string;
  name: string;
  type: HeroType;
  rarity: HeroRarity;
  tags: string[]; // e.g., ['melee', 'ranged', 'magic']
  compatibilityRules?: {
    incompatibleWith?: string[]; // Hero IDs that cannot be matched together
    preferredWith?: string[]; // Hero IDs that work well together
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class HeroModel implements Hero {
  constructor(
    public id: string,
    public name: string,
    public type: HeroType,
    public rarity: HeroRarity,
    public tags: string[] = [],
    public compatibilityRules?: Hero["compatibilityRules"],
  ) {}

  /**
   * Check if this hero is compatible with another hero
   */
  isCompatibleWith(otherHero: Hero): boolean {
    if (!this.compatibilityRules?.incompatibleWith) {
      return true;
    }
    return !this.compatibilityRules.incompatibleWith.includes(otherHero.id);
  }

  /**
   * Check if this hero is preferred with another hero
   */
  isPreferredWith(otherHero: Hero): boolean {
    if (!this.compatibilityRules?.preferredWith) {
      return false;
    }
    return this.compatibilityRules.preferredWith.includes(otherHero.id);
  }
}
````

**Backend - Hero Selection Types:**
**File:** `backend-services/matchmaking-service/src/types/hero.types.ts`

```typescript
export interface HeroSelection {
  userId: string;
  heroIds: string[];
  priority: number[]; // Priority order (0 = highest priority)
  timestamp: Date;
}

export interface HeroSelectionRequest {
  heroIds: string[];
  priority?: number[]; // Optional, defaults to array order
}
```

**Backend - Hero Selection Service:**
**File:** `backend-services/matchmaking-service/src/services/HeroSelector.ts`

```typescript
import { getRedisClient } from "../config/redis.config";
import { HeroSelection, HeroSelectionRequest } from "../types/hero.types";
import { validateHeroSelection } from "../utils/validators";

export class HeroSelector {
  private readonly SELECTION_KEY_PREFIX = "hero-selection:";

  /**
   * Store hero selection for user
   */
  async selectHeroes(userId: string, request: HeroSelectionRequest): Promise<void> {
    // Validate selection
    const validation = await validateHeroSelection(request);
    if (!validation.valid) {
      throw new Error(`Invalid hero selection: ${validation.errors.join(", ")}`);
    }

    // Create selection object
    const selection: HeroSelection = {
      userId,
      heroIds: request.heroIds,
      priority: request.priority || request.heroIds.map((_, i) => i),
      timestamp: new Date(),
    };

    // Store in Redis
    const redis = getRedisClient();
    const key = `${this.SELECTION_KEY_PREFIX}${userId}`;
    await redis.setex(key, 3600, JSON.stringify(selection)); // 1 hour TTL
  }

  /**
   * Get hero selection for user
   */
  async getHeroSelection(userId: string): Promise<HeroSelection | null> {
    const redis = getRedisClient();
    const key = `${this.SELECTION_KEY_PREFIX}${userId}`;
    const data = await redis.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as HeroSelection;
  }

  /**
   * Check hero compatibility between two selections
   */
  async areCompatible(selection1: HeroSelection, selection2: HeroSelection): Promise<boolean> {
    // Get hero models (from database or cache)
    const heroes1 = await this.getHeroes(selection1.heroIds);
    const heroes2 = await this.getHeroes(selection2.heroIds);

    // Check compatibility
    for (const hero1 of heroes1) {
      for (const hero2 of heroes2) {
        if (!hero1.isCompatibleWith(hero2)) {
          return false;
        }
      }
    }
    return true;
  }

  private async getHeroes(heroIds: string[]): Promise<Hero[]> {
    // Fetch heroes from database or cache
    // Implementation depends on hero storage
    return [];
  }
}
```

**Backend - Hero Selection Socket.io Event Handler:**
**File:** `backend-services/matchmaking-service/src/controllers/MatchmakingController.ts`

```typescript
import { Socket } from "socket.io";
import { HeroSelector } from "../services/HeroSelector";

export class MatchmakingController {
  constructor(private heroSelector: HeroSelector) {}

  /**
   * Handle hero selection event
   */
  async handleHeroSelection(socket: Socket, data: HeroSelectionRequest): Promise<void> {
    try {
      const userId = socket.data.userId; // From JWT authentication middleware

      // Store hero selection
      await this.heroSelector.selectHeroes(userId, data);

      // Emit success
      socket.emit("hero-selection-success", {
        message: "Hero selection saved",
        heroIds: data.heroIds,
      });
    } catch (error) {
      socket.emit("hero-selection-error", {
        message: "Failed to save hero selection",
        error: error.message,
      });
    }
  }
}
```

**Backend - Hero Selection Validation:**
**File:** `backend-services/matchmaking-service/src/utils/validators.ts`

```typescript
import { HeroSelectionRequest } from "../types/hero.types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export async function validateHeroSelection(payload: HeroSelectionRequest): Promise<ValidationResult> {
  const errors: string[] = [];

  // Validate heroIds array exists and is not empty
  if (!payload.heroIds || payload.heroIds.length === 0) {
    errors.push("At least one hero must be selected");
  }

  // Validate maximum hero selection limit
  const MAX_HEROES = 5;
  if (payload.heroIds.length > MAX_HEROES) {
    errors.push(`Maximum ${MAX_HEROES} heroes allowed`);
  }

  // Validate no duplicate hero IDs
  const uniqueHeroIds = new Set(payload.heroIds);
  if (uniqueHeroIds.size !== payload.heroIds.length) {
    errors.push("Duplicate hero IDs are not allowed");
  }

  // Validate hero IDs exist in allowed pool
  // Implementation: Check against hero database/cache

  // Validate priority array if provided
  if (payload.priority) {
    if (payload.priority.length !== payload.heroIds.length) {
      errors.push("Priority array length must match heroIds array length");
    }

    const uniquePriorities = new Set(payload.priority);
    if (uniquePriorities.size !== payload.priority.length) {
      errors.push("Duplicate priority values are not allowed");
    }

    const validRange = Array.from({ length: payload.heroIds.length }, (_, i) => i);
    for (const priority of payload.priority) {
      if (!validRange.includes(priority)) {
        errors.push(`Invalid priority value: ${priority}. Must be between 0 and ${payload.heroIds.length - 1}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

**Frontend - Hero Selection Component:**
**File:** `frontend-service/src/app/hero-selection/components/hero-selection/hero-selection.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";
import { MatchmakingService } from "../../../services/matchmaking.service";
import { Hero } from "../../../models/hero.model";

@Component({
  selector: "app-hero-selection",
  templateUrl: "./hero-selection.component.html",
  styleUrls: ["./hero-selection.component.scss"],
})
export class HeroSelectionComponent implements OnInit {
  heroes: Hero[] = [];
  selectedHeroIds: string[] = [];

  constructor(private matchmakingService: MatchmakingService) {}

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(): void {
    this.matchmakingService.getAvailableHeroes().subscribe({
      next: (heroes) => {
        this.heroes = heroes;
      },
      error: (error) => {
        console.error("Failed to load heroes:", error);
      },
    });
  }

  toggleHeroSelection(heroId: string): void {
    const index = this.selectedHeroIds.indexOf(heroId);
    if (index > -1) {
      // Deselect
      this.selectedHeroIds.splice(index, 1);
    } else {
      // Select (max 5)
      if (this.selectedHeroIds.length < 5) {
        this.selectedHeroIds.push(heroId);
      }
    }
  }

  isHeroSelected(heroId: string): boolean {
    return this.selectedHeroIds.includes(heroId);
  }

  submitSelection(): void {
    if (this.selectedHeroIds.length === 0) {
      alert("Please select at least one hero");
      return;
    }

    this.matchmakingService.selectHeroes(this.selectedHeroIds).subscribe({
      next: () => {
        alert("Hero selection saved!");
        // Navigate to matchmaking queue
      },
      error: (error) => {
        console.error("Failed to save hero selection:", error);
        alert("Failed to save hero selection");
      },
    });
  }
}
```

**Frontend - Matchmaking Service (Hero Selection):**
**File:** `frontend-service/src/app/services/matchmaking.service.ts`

```typescript
import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
import { Hero } from "../models/hero.model";

@Injectable({
  providedIn: "root",
})
export class MatchmakingService {
  constructor(private socket: Socket) {}

  getAvailableHeroes(): Observable<Hero[]> {
    // Fetch from REST API or WebSocket
    return this.socket.fromEvent<Hero[]>("available-heroes");
  }

  selectHeroes(heroIds: string[]): Observable<void> {
    return new Observable((observer) => {
      this.socket.emit("hero-selection", { heroIds });

      this.socket.once("hero-selection-success", () => {
        observer.next();
        observer.complete();
      });

      this.socket.once("hero-selection-error", (error: any) => {
        observer.error(error);
      });
    });
  }
}
```

---

### VS-5-2: Player can get matched with real players (not bots)

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

```typescript
import { QueueManager } from "./QueueManager";
import { HeroSelector } from "./HeroSelector";
import { MatchingStrategy } from "./strategy/MatchingStrategy";
import { GameEngineService } from "./GameEngineService";
import { QueueEntry } from "../models/QueueEntry";

export class MatchmakingEngine {
  private matchmakingInterval: NodeJS.Timeout | null = null;
  private readonly MATCHMAKING_INTERVAL_MS = 5000; // 5 seconds

  constructor(
    private queueManager: QueueManager,
    private heroSelector: HeroSelector,
    private matchingStrategy: MatchingStrategy,
    private gameEngineService: GameEngineService,
  ) {}

  /**
   * Start matchmaking loop
   */
  start(): void {
    if (this.matchmakingInterval) {
      return; // Already running
    }

    this.matchmakingInterval = setInterval(async () => {
      await this.runMatchmakingCycle();
    }, this.MATCHMAKING_INTERVAL_MS);
  }

  /**
   * Stop matchmaking loop
   */
  stop(): void {
    if (this.matchmakingInterval) {
      clearInterval(this.matchmakingInterval);
      this.matchmakingInterval = null;
    }
  }

  /**
   * Run one matchmaking cycle
   */
  private async runMatchmakingCycle(): Promise<void> {
    try {
      const regions = ["NA", "EU", "ASIA"]; // Get from config

      for (const region of regions) {
        await this.processRegionQueue(region);
      }
    } catch (error) {
      console.error("Matchmaking cycle error:", error);
      // Don't throw - continue next cycle
    }
  }

  /**
   * Process queue for a specific region
   */
  private async processRegionQueue(region: string): Promise<void> {
    const queueLength = await this.queueManager.getQueueLength(region);
    if (queueLength < 2) {
      return; // Need at least 2 players
    }

    // Get queue entries
    const entries = await this.queueManager.getQueueEntries(region, 0, Infinity);

    // Find matches using strategy
    const matches = await this.matchingStrategy.findMatches(entries);

    // Process each match
    for (const match of matches) {
      await this.createMatch(match);
    }
  }

  /**
   * Create match and notify Game Engine
   */
  private async createMatch(match: Match): Promise<void> {
    // Remove players from queue
    for (const playerId of match.playerIds) {
      await this.queueManager.dequeuePlayer(playerId, match.region);
    }

    // Notify Game Engine to create game room
    await this.gameEngineService.createMatch(match);
  }
}
```

**Backend - Matching Strategy:**
**File:** `backend-services/matchmaking-service/src/services/strategy/ScoreBasedMatchingStrategy.ts`

```typescript
import { MatchingStrategy } from "./MatchingStrategy";
import { QueueEntry } from "../../models/QueueEntry";
import { HeroSelector } from "../HeroSelector";

export class ScoreBasedMatchingStrategy implements MatchingStrategy {
  private readonly INITIAL_SCORE_BAND = 500;
  private readonly WIDEN_AMOUNT = 200;
  private readonly WIDEN_INTERVAL_MS = 30000; // 30 seconds
  private readonly MAX_SCORE_BAND = 2000;

  constructor(private heroSelector: HeroSelector) {}

  async findMatches(entries: QueueEntry[]): Promise<Match[]> {
    const matches: Match[] = [];

    for (let i = 0; i < entries.length; i++) {
      const player1 = entries[i];
      if (matches.some((m) => m.playerIds.includes(player1.userId))) {
        continue; // Already matched
      }

      // Calculate score band based on wait time
      const waitTime = Date.now() - player1.joinedAt.getTime();
      const scoreBand = this.calculateScoreBand(waitTime);

      // Find potential matches
      const candidates = entries.filter((entry) => {
        if (entry.userId === player1.userId) {
          return false; // Don't match with self
        }
        if (matches.some((m) => m.playerIds.includes(entry.userId))) {
          return false; // Already matched
        }

        // Check score band
        const scoreDiff = Math.abs(entry.globalScore - player1.globalScore);
        return scoreDiff <= scoreBand;
      });

      // Score and select best match
      const bestMatch = await this.selectBestMatch(player1, candidates);
      if (bestMatch) {
        matches.push(bestMatch);
      }
    }

    return matches;
  }

  private calculateScoreBand(waitTime: number): number {
    const intervals = Math.floor(waitTime / this.WIDEN_INTERVAL_MS);
    const band = this.INITIAL_SCORE_BAND + intervals * this.WIDEN_AMOUNT;
    return Math.min(band, this.MAX_SCORE_BAND);
  }

  private async selectBestMatch(player1: QueueEntry, candidates: QueueEntry[]): Promise<Match | null> {
    let bestMatch: { entry: QueueEntry; score: number } | null = null;

    for (const candidate of candidates) {
      // Check hero compatibility
      const player1Selection = await this.heroSelector.getHeroSelection(player1.userId);
      const candidateSelection = await this.heroSelector.getHeroSelection(candidate.userId);

      if (player1Selection && candidateSelection) {
        const compatible = await this.heroSelector.areCompatible(player1Selection, candidateSelection);
        if (!compatible) {
          continue; // Skip incompatible heroes
        }
      }

      // Calculate match quality score
      const score = this.calculateMatchQuality(player1, candidate);

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { entry: candidate, score };
      }
    }

    if (!bestMatch) {
      return null;
    }

    return {
      playerIds: [player1.userId, bestMatch.entry.userId],
      region: player1.region,
      heroSelections: {
        [player1.userId]: await this.heroSelector.getHeroSelection(player1.userId),
        [bestMatch.entry.userId]: await this.heroSelector.getHeroSelection(bestMatch.entry.userId),
      },
    };
  }

  private calculateMatchQuality(player1: QueueEntry, player2: QueueEntry): number {
    let score = 0;

    // Score difference (lower is better, so invert)
    const scoreDiff = Math.abs(player1.globalScore - player2.globalScore);
    score += 100 - Math.min(scoreDiff, 100); // Max 100 points

    // Rank tier match
    if (player1.rankTier === player2.rankTier) {
      score += 10; // Same tier
    } else if (this.areAdjacentTiers(player1.rankTier, player2.rankTier)) {
      score += 5; // Adjacent tiers
    }

    // Region match
    if (player1.region === player2.region) {
      score += 5; // Same region
    }

    return score;
  }

  private areAdjacentTiers(tier1: string, tier2: string): boolean {
    const tiers = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"];
    const index1 = tiers.indexOf(tier1);
    const index2 = tiers.indexOf(tier2);
    return Math.abs(index1 - index2) === 1;
  }
}
```

---

### VS-5-3: Player can vote on arena selection

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

```typescript
export interface Arena {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  terrainType: string; // e.g., 'desert', 'forest', 'snow'
  difficulty: number; // 1-5
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Backend - Arena Selection Service:**
**File:** `backend-services/matchmaking-service/src/services/ArenaSelector.ts`

```typescript
import { getRedisClient } from "../config/redis.config";
import { Arena } from "../models/Arena";

export interface ArenaVote {
  userId: string;
  arenaId: string;
  timestamp: Date;
}

export class ArenaSelector {
  private readonly VOTE_KEY_PREFIX = "arena-vote:";
  private readonly VOTING_PHASE_DURATION_MS = 30000; // 30 seconds

  /**
   * Start arena voting phase
   */
  async startVotingPhase(matchId: string, availableArenas: Arena[]): Promise<void> {
    const redis = getRedisClient();
    const key = `${this.VOTE_KEY_PREFIX}${matchId}`;

    // Store available arenas and voting state
    const votingState = {
      matchId,
      availableArenas: availableArenas.map((a) => a.id),
      votes: {},
      startTime: Date.now(),
      endTime: Date.now() + this.VOTING_PHASE_DURATION_MS,
    };

    await redis.setex(key, 60, JSON.stringify(votingState)); // 1 minute TTL
  }

  /**
   * Submit arena vote
   */
  async submitVote(matchId: string, userId: string, arenaId: string): Promise<void> {
    const redis = getRedisClient();
    const key = `${this.VOTE_KEY_PREFIX}${matchId}`;

    // Get voting state
    const data = await redis.get(key);
    if (!data) {
      throw new Error("Voting phase not found");
    }

    const votingState = JSON.parse(data);

    // Check if voting phase is still active
    if (Date.now() > votingState.endTime) {
      throw new Error("Voting phase has ended");
    }

    // Check if arena is available
    if (!votingState.availableArenas.includes(arenaId)) {
      throw new Error("Arena not available for voting");
    }

    // Store vote
    votingState.votes[userId] = arenaId;

    // Update Redis
    await redis.setex(key, 60, JSON.stringify(votingState));
  }

  /**
   * Get voting results and select arena
   */
  async getSelectedArena(matchId: string): Promise<string | null> {
    const redis = getRedisClient();
    const key = `${this.VOTE_KEY_PREFIX}${matchId}`;

    const data = await redis.get(key);
    if (!data) {
      return null;
    }

    const votingState = JSON.parse(data);

    // Count votes
    const voteCounts: { [arenaId: string]: number } = {};
    for (const arenaId of votingState.availableArenas) {
      voteCounts[arenaId] = 0;
    }

    for (const userId in votingState.votes) {
      const arenaId = votingState.votes[userId];
      voteCounts[arenaId] = (voteCounts[arenaId] || 0) + 1;
    }

    // Find least popular arena (elimination voting)
    let leastVotes = Infinity;
    let leastPopularArena: string | null = null;

    for (const arenaId of votingState.availableArenas) {
      if (voteCounts[arenaId] < leastVotes) {
        leastVotes = voteCounts[arenaId];
        leastPopularArena = arenaId;
      }
    }

    // Remove least popular arena
    const remainingArenas = votingState.availableArenas.filter((id) => id !== leastPopularArena);

    // If only one arena left, select it
    if (remainingArenas.length === 1) {
      return remainingArenas[0];
    }

    // Otherwise, continue voting (recursive elimination)
    // For MVP, select most popular arena
    let mostVotes = 0;
    let mostPopularArena: string | null = null;

    for (const arenaId of remainingArenas) {
      if (voteCounts[arenaId] > mostVotes) {
        mostVotes = voteCounts[arenaId];
        mostPopularArena = arenaId;
      }
    }

    return mostPopularArena;
  }

  /**
   * Get current voting state
   */
  async getVotingState(matchId: string): Promise<any> {
    const redis = getRedisClient();
    const key = `${this.VOTE_KEY_PREFIX}${matchId}`;

    const data = await redis.get(key);
    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }
}
```

**Frontend - Arena Selection Component:**
**File:** `frontend-service/src/app/arena-selection/components/arena-selection/arena-selection.component.ts`

```typescript
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatchmakingService } from "../../../services/matchmaking.service";
import { Arena } from "../../../models/arena.model";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-arena-selection",
  templateUrl: "./arena-selection.component.html",
  styleUrls: ["./arena-selection.component.scss"],
})
export class ArenaSelectionComponent implements OnInit, OnDestroy {
  arenas: Arena[] = [];
  selectedArenaId: string | null = null;
  votes: { [arenaId: string]: number } = {};
  timeRemaining: number = 30;
  private timerSubscription?: Subscription;

  constructor(private matchmakingService: MatchmakingService) {}

  ngOnInit(): void {
    this.loadArenas();
    this.startTimer();
    this.subscribeToVoteUpdates();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadArenas(): void {
    this.matchmakingService.getAvailableArenas().subscribe({
      next: (arenas) => {
        this.arenas = arenas;
      },
      error: (error) => {
        console.error("Failed to load arenas:", error);
      },
    });
  }

  voteForArena(arenaId: string): void {
    this.selectedArenaId = arenaId;
    this.matchmakingService.voteForArena(arenaId).subscribe({
      next: () => {
        console.log("Vote submitted");
      },
      error: (error) => {
        console.error("Failed to submit vote:", error);
      },
    });
  }

  subscribeToVoteUpdates(): void {
    this.matchmakingService.onVoteUpdate().subscribe({
      next: (votes) => {
        this.votes = votes;
      },
    });
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        // Voting phase ended
        this.matchmakingService.getSelectedArena().subscribe({
          next: (arenaId) => {
            // Navigate to weapon selection or game
          },
        });
      }
    });
  }
}
```

---

### VS-5-4: Player can draft weapons (turn-based selection)

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

```typescript
export interface Weapon {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  damage: number;
  range: number;
  projectileType: string; // e.g., 'explosive', 'piercing', 'magic'
  rarity: string; // e.g., 'common', 'rare', 'epic', 'legendary'
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Backend - Weapon Selection Service:**
**File:** `backend-services/matchmaking-service/src/services/WeaponSelector.ts`

```typescript
import { getRedisClient } from "../config/redis.config";
import { Weapon } from "../models/Weapon";

export interface WeaponSelectionState {
  matchId: string;
  playerIds: string[];
  currentTurn: number; // Index in playerIds array
  turnStartTime: number;
  pickTimeLimit: number; // 30 seconds
  selectedWeapons: { [playerId: string]: string };
  availableWeapons: string[];
}

export class WeaponSelector {
  private readonly SELECTION_KEY_PREFIX = "weapon-selection:";

  /**
   * Start weapon drafting phase
   */
  async startDraftingPhase(matchId: string, playerIds: string[], availableWeapons: Weapon[]): Promise<void> {
    const redis = getRedisClient();
    const key = `${this.SELECTION_KEY_PREFIX}${matchId}`;

    // Randomize turn order
    const shuffledPlayerIds = [...playerIds].sort(() => Math.random() - 0.5);

    const state: WeaponSelectionState = {
      matchId,
      playerIds: shuffledPlayerIds,
      currentTurn: 0,
      turnStartTime: Date.now(),
      pickTimeLimit: 30000, // 30 seconds
      selectedWeapons: {},
      availableWeapons: availableWeapons.map((w) => w.id),
    };

    await redis.setex(key, 300, JSON.stringify(state)); // 5 minutes TTL
  }

  /**
   * Submit weapon pick
   */
  async pickWeapon(matchId: string, userId: string, weaponId: string): Promise<void> {
    const redis = getRedisClient();
    const key = `${this.SELECTION_KEY_PREFIX}${matchId}`;

    const data = await redis.get(key);
    if (!data) {
      throw new Error("Drafting phase not found");
    }

    const state: WeaponSelectionState = JSON.parse(data);

    // Check if it's player's turn
    const currentPlayerId = state.playerIds[state.currentTurn];
    if (currentPlayerId !== userId) {
      throw new Error("Not your turn");
    }

    // Check if weapon is available
    if (!state.availableWeapons.includes(weaponId)) {
      throw new Error("Weapon not available");
    }

    // Check if weapon already selected
    if (Object.values(state.selectedWeapons).includes(weaponId)) {
      throw new Error("Weapon already selected");
    }

    // Select weapon
    state.selectedWeapons[userId] = weaponId;

    // Remove from available weapons
    state.availableWeapons = state.availableWeapons.filter((id) => id !== weaponId);

    // Move to next turn
    state.currentTurn++;
    state.turnStartTime = Date.now();

    // Check if drafting is complete
    if (state.currentTurn >= state.playerIds.length) {
      // All players have picked, start next round if needed
      if (Object.keys(state.selectedWeapons).length < state.playerIds.length) {
        // Reset turn for next round
        state.currentTurn = 0;
      }
    }

    // Update Redis
    await redis.setex(key, 300, JSON.stringify(state));
  }

  /**
   * Get current drafting state
   */
  async getDraftingState(matchId: string): Promise<WeaponSelectionState | null> {
    const redis = getRedisClient();
    const key = `${this.SELECTION_KEY_PREFIX}${matchId}`;

    const data = await redis.get(key);
    if (!data) {
      return null;
    }

    return JSON.parse(data) as WeaponSelectionState;
  }

  /**
   * Check if drafting is complete
   */
  async isDraftingComplete(matchId: string): Promise<boolean> {
    const state = await this.getDraftingState(matchId);
    if (!state) {
      return false;
    }

    return Object.keys(state.selectedWeapons).length === state.playerIds.length;
  }

  /**
   * Get selected weapons
   */
  async getSelectedWeapons(matchId: string): Promise<{ [playerId: string]: string }> {
    const state = await this.getDraftingState(matchId);
    if (!state) {
      return {};
    }

    return state.selectedWeapons;
  }
}
```

**Frontend - Weapon Selection Component:**
**File:** `frontend-service/src/app/weapon-selection/components/weapon-selection/weapon-selection.component.ts`

```typescript
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatchmakingService } from "../../../services/matchmaking.service";
import { Weapon } from "../../../models/weapon.model";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-weapon-selection",
  templateUrl: "./weapon-selection.component.html",
  styleUrls: ["./weapon-selection.component.scss"],
})
export class WeaponSelectionComponent implements OnInit, OnDestroy {
  weapons: Weapon[] = [];
  availableWeapons: Weapon[] = [];
  selectedWeapons: { [playerId: string]: string } = {};
  currentTurn: number = 0;
  isMyTurn: boolean = false;
  timeRemaining: number = 30;
  private timerSubscription?: Subscription;

  constructor(private matchmakingService: MatchmakingService) {}

  ngOnInit(): void {
    this.loadWeapons();
    this.subscribeToDraftingUpdates();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadWeapons(): void {
    this.matchmakingService.getAvailableWeapons().subscribe({
      next: (weapons) => {
        this.weapons = weapons;
        this.updateAvailableWeapons();
      },
      error: (error) => {
        console.error("Failed to load weapons:", error);
      },
    });
  }

  pickWeapon(weaponId: string): void {
    if (!this.isMyTurn) {
      return;
    }

    this.matchmakingService.pickWeapon(weaponId).subscribe({
      next: () => {
        console.log("Weapon picked");
      },
      error: (error) => {
        console.error("Failed to pick weapon:", error);
      },
    });
  }

  subscribeToDraftingUpdates(): void {
    this.matchmakingService.onDraftingUpdate().subscribe({
      next: (state) => {
        this.currentTurn = state.currentTurn;
        this.selectedWeapons = state.selectedWeapons;
        this.updateAvailableWeapons();
        this.checkIfMyTurn(state);
      },
    });
  }

  updateAvailableWeapons(): void {
    const selectedWeaponIds = Object.values(this.selectedWeapons);
    this.availableWeapons = this.weapons.filter((w) => !selectedWeaponIds.includes(w.id));
  }

  checkIfMyTurn(state: any): void {
    const myUserId = this.matchmakingService.getCurrentUserId();
    const currentPlayerId = state.playerIds[state.currentTurn];
    this.isMyTurn = currentPlayerId === myUserId;
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        // Turn timeout - auto-pick or skip
        this.timeRemaining = 30; // Reset for next turn
      }
    });
  }
}
```

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
