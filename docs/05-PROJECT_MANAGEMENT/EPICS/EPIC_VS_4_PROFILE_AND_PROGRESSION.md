# EPIC-VS-4: Profile & Progression

**Copy and paste this template directly into GitHub Issues.**

**Note:** All technical implementation details from Phase 3 (Profile), Phase 4 (Leaderboard), and Phase 7 (Frontend - profile/leaderboard parts) have been consolidated into this file. You no longer need to reference multiple Phase documents when creating GitHub issues.

---

## EPIC-VS-4: Profile & Progression

### Issue Template:

```
Title: EPIC-VS-4: Profile & Progression

Description:
## Overview
Implement the fourth vertical slice where a player can view their profile, see their progression (global score, rank tier, statistics), update their profile, and view leaderboards. This epic enables players to track their progress, see how they rank against others, and personalize their profile. This completes the Alpha milestone - players can play matches and see their progression.

**This is the fourth vertical slice** - it enables players to see their progression and compete on leaderboards.

## Vertical Slice Goal
A player can:
1. View their profile with statistics (wins, losses, matches played, global score, rank tier)
2. Update their profile (display name, avatar)
3. View global leaderboard (top players by score)
4. Filter leaderboard (by rank tier, region, etc.)
5. See profile and leaderboard updated after matches

## Success Criteria
- [ ] Player can view their profile with all statistics
- [ ] Player can update their profile (display name, avatar)
- [ ] Global score tracked and updated after each match
- [ ] Rank tier calculated correctly from score ranges (Valorant-style)
- [ ] Statistics tracked (wins, losses, matches played, win percentage)
- [ ] Player can view global leaderboard
- [ ] Leaderboard shows rank tier, wins, losses, win%, matches played
- [ ] Player can filter leaderboard (rank tier, region)
- [ ] Match results update profile and leaderboard automatically
- [ ] End-to-end flow works: Play Match → See Result → Profile Updated → Leaderboard Updated

## MVP Scope (Minimal for Alpha Milestone)

**What's Included:**
- Profile creation after first match
- Basic statistics (wins, losses, matches played, win percentage)
- Global score tracking (infinite, no level cap)
- Rank tier calculation (Valorant-style: Iron, Bronze, Silver, Gold, Platinum, Diamond, Master, Grandmaster)
- Global leaderboard (top players by score)
- Basic filtering (rank tier, region)
- Profile update (display name, avatar)

**What's Deferred:**
- Advanced statistics (accuracy, combos, saves, damage dealt)
- Hero-specific statistics
- Weapon-specific statistics
- Match history (detailed match-by-match history)
- Profile achievements/badges
- Advanced leaderboard filtering (hero type, win%, weapons)
- Pagination (for MVP, show top 100 only)

## Technical References

### Phase Documents (Technical Implementation Details)
This epic references Phase 3 (Profile), Phase 4 (Leaderboard), and Phase 7 (Frontend) for technical specifications.

- **Profile Service:** See Phase 3 (PHASE-3 issue) - STORY-3-1, STORY-3-2, STORY-3-3, STORY-3-4, STORY-3-5, STORY-3-6
- **Leaderboard Service:** See Phase 4 (PHASE-4 issue) - STORY-4-1, STORY-4-2, STORY-4-3, STORY-4-4, STORY-4-5
- **Frontend:** See Phase 7 (PHASE-7 issue) - Profile UI, Leaderboard UI

### Architecture References

**Sequence Diagrams:**
- [Profile View Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/profile-view-flow.puml) - View profile flow
- [Profile Update Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/profile-update-flow.puml) - Update profile flow
- [Leaderboard View Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/leaderboard-view-flow.puml) - View leaderboard flow
- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Profile and leaderboard updates
- [Post-Match Result Screen Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-result-screen-flow.puml) - Result screen with rank changes
- [Sequence Diagrams Index](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/README.md)

**Class Diagrams:**
- [Profile Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/profile-service.puml)
- [Leaderboard Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/leaderboard-service.puml)
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml)
- [Database Schema Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/database-schema.puml)

**ER Diagrams:**
- [Database ER Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/er-diagrams/database-er-diagram.puml) - Profile entity relationships

**Architecture Documents:**
- [System Architecture - Profile Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#22-profile-service)
- [System Architecture - Leaderboard Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#23-leaderboard-service)
- [Profile Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md)
- [Leaderboard Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Profiles collection schema
- [Frontend Components Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md)

## Stories (Player Experience)

### VS-4-1: Player can view their profile with statistics

**User Story:** As a player, I want to view my profile with my statistics so that I can see my progress and how I'm performing.

**Acceptance Criteria:**
- [ ] Profile page visible on frontend
- [ ] Player can navigate to their profile
- [ ] Profile displays: display name, avatar, global score, rank tier, wins, losses, matches played, win percentage
- [ ] Profile data fetched from Profile Service
- [ ] Profile data displayed correctly
- [ ] Profile page shows rank tier badge/icon
- [ ] Statistics formatted correctly (percentages, numbers)

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-4-1-1: Profile Service Foundation Setup (BE)**

**Description:**
Set up the Spring Boot project structure, dependencies, and configuration for the Profile Service. This is a prerequisite for all other profile tasks.

**Related Diagrams & Documents:**
- [Profile Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/profile-service.puml)
- [System Architecture - Profile Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#22-profile-service)
- [Profile Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md)

**Acceptance Criteria:**
- [ ] Spring Boot 3.x project created (Java 17)
- [ ] Maven project structure created
- [ ] Package structure follows clean architecture
- [ ] All Maven dependencies added (Spring Boot, MongoDB, Redis, JWT, Validation, Swagger)
- [ ] application.properties configured (port 8082, MongoDB URI, Redis connection, CORS)
- [ ] Health check endpoint working (`/health`)
- [ ] Redis connection configured and tested
- [ ] Swagger/OpenAPI configured and accessible

**Technical Details:**

**Project Structure:**
```

src/main/java/com/battlearena/profile/
├── Application.java
├── controller/
│ └── ProfileController.java
├── service/
│ ├── ProfileService.java
│ ├── ScoreCalculator.java
│ └── RankTierCalculator.java
├── repository/
│ └── ProfileRepository.java
├── model/
│ ├── Profile.java
│ └── RankTier.java
├── dto/
│ ├── ProfileResponse.java
│ ├── UpdateProfileRequest.java
│ └── ScoreUpdateRequest.java
├── config/
│ ├── RedisConfig.java
│ └── SwaggerConfig.java
├── cache/
│ └── RedisCache.java
└── exception/
└── GlobalExceptionHandler.java

````

**Required Dependencies (pom.xml):**
- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- spring-boot-starter-data-redis
- io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson
- spring-boot-starter-validation
- springdoc-openapi-starter-webmvc-ui
- spring-boot-starter-test

**Application Properties:**
```properties
server.port=8082
spring.application.name=profile-service
spring.data.mongodb.uri=${MONGODB_URI:mongodb://mongodb:27017/battlearena}
spring.data.redis.host=${REDIS_HOST:redis}
spring.data.redis.port=${REDIS_PORT:6379}
jwt.secret=${JWT_SECRET:your-secret-key-change-in-production}
````

---

**TASK-VS-4-1-2: View Profile Feature (DB + BE + FE)**

**Description:**
Implement complete view profile feature including database model, backend API, and frontend profile page. This task combines all view profile-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Profile View Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/profile-view-flow.puml) - View profile flow
- [Database Schema Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/database-schema.puml) - Profile entity structure
- [Database ER Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/er-diagrams/database-er-diagram.puml) - Profile entity relationships
- [Profile Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/profile-service.puml) - Service layer structure
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - ProfileService and components
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Profiles collection schema

**Acceptance Criteria:**

- [ ] Profile model/entity created with MongoDB annotations
- [ ] ProfileRepository interface created with query methods
- [ ] ProfileService.getProfileByUserId() method implemented
- [ ] ProfileResponse DTO created
- [ ] GET /api/profile/{userId} endpoint created in ProfileController
- [ ] JWT token validation on endpoint
- [ ] Profile page component created
- [ ] ProfileService.getProfileByUserId() method implemented
- [ ] Profile data displayed (display name, avatar, score, rank tier, stats)
- [ ] Rank tier badge/icon displayed
- [ ] Statistics formatted correctly
- [ ] End-to-end test: Navigate to profile → See profile data → Verify all fields displayed

**Technical Details:**

**Backend - Database & Model:**
**File:** `com.battlearena.profile.model.Profile`

```java
@Document(collection = "profiles")
public class Profile {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId; // Links to Users collection

    private String displayName;
    private String avatarUrl;

    private Integer globalScore = 0; // Infinite, no level cap
    private RankTier rankTier = RankTier.IRON;

    private Integer wins = 0;
    private Integer losses = 0;
    private Integer matchesPlayed = 0;
    private Double winRate = 0.0; // Calculated: wins / matchesPlayed * 100

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**Backend - Rank Tier Enum:**
**File:** `com.battlearena.profile.model.RankTier`

```java
public enum RankTier {
    IRON, BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, MASTER, GRANDMASTER
}
```

**Backend - Repository:**
**File:** `com.battlearena.profile.repository.ProfileRepository`

```java
@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {
    Optional<Profile> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
```

**Backend - Service:**
**File:** `com.battlearena.profile.service.ProfileService`

```java
public ProfileResponse getProfileByUserId(String userId) {
    // 1. Get profile from cache (Redis) or database
    // 2. Calculate win rate if needed
    // 3. Return ProfileResponse DTO
}
```

**Backend - DTO:**
**ProfileResponse:**

```java
public class ProfileResponse {
    private String userId;
    private String displayName;
    private String avatarUrl;
    private Integer globalScore;
    private RankTier rankTier;
    private Integer wins;
    private Integer losses;
    private Integer matchesPlayed;
    private Double winRate;
}
```

**Backend - Controller:**
**File:** `com.battlearena.profile.controller.ProfileController`

```java
@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @GetMapping("/{userId}")
    @Operation(summary = "Get user profile")
    public ResponseEntity<ProfileResponse> getProfileByUserId(
        @PathVariable String userId,
        @RequestHeader("Authorization") String token) {
        ProfileResponse profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }
}
```

**Frontend - Profile Component:**
**File:** `src/app/profile/components/profile-view/profile-view.component.ts`

```typescript
@Component({
  selector: "app-profile-view",
  templateUrl: "./profile-view.component.html",
})
export class ProfileViewComponent implements OnInit {
  profile: Profile | null = null;
  loading = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    const userId = this.authService.getUserId();
    this.profileService.getProfileByUserId(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (error) => {
        console.error("Failed to load profile", error);
        this.loading = false;
      },
    });
  }
}
```

**Frontend - ProfileService:**
**File:** `src/app/services/profile.service.ts`

```typescript
@Injectable()
export class ProfileService {
  getProfileByUserId(userId: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/${userId}`);
  }
}
```

**End-to-End Test Scenario:**

1. Player navigates to profile page
2. Verify API call to GET /api/profile/{userId}
3. Verify profile data received
4. Verify profile displayed (display name, avatar, score, rank tier, stats)
5. Verify rank tier badge displayed
6. Verify statistics formatted correctly

**Definition of Done:**

- Player can view their profile with all statistics
- Profile data displayed correctly
- Rank tier badge displayed
- Statistics formatted correctly

---

### VS-4-2: Player can update their profile

**User Story:** As a player, I want to update my profile (display name, avatar) so that I can personalize my account.

**Acceptance Criteria:**

- [ ] Profile update form visible on profile page
- [ ] Player can edit display name
- [ ] Player can update avatar (upload or URL)
- [ ] Form validation (display name length, avatar URL format)
- [ ] Update request sent to Profile Service
- [ ] Profile Service validates and updates profile
- [ ] Updated profile displayed
- [ ] Success message shown

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-4-2-1: Update Profile Feature (BE + FE)**

**Description:**
Implement complete profile update feature including backend update endpoint and frontend update form. This task combines all update profile-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Profile Update Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/profile-update-flow.puml) - Update profile flow
- [Profile Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/profile-service.puml) - Update methods
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - ProfileService update methods

**Acceptance Criteria:**

- [ ] UpdateProfileRequest DTO created
- [ ] ProfileService.updateProfile() method implemented
- [ ] PUT /api/profile/{userId} endpoint created
- [ ] JWT token validation and authorization (only own profile)
- [ ] Input validation (display name length, avatar URL format)
- [ ] Profile updated in MongoDB
- [ ] Redis cache invalidated
- [ ] Profile update form component created
- [ ] Form validation (client-side)
- [ ] ProfileService.updateProfile() method implemented
- [ ] Success message displayed
- [ ] Updated profile displayed
- [ ] End-to-end test: Update profile → Verify backend update → See updated profile

**Technical Details:**

**Backend - DTO:**
**UpdateProfileRequest:**

```java
public class UpdateProfileRequest {
    @Size(min = 1, max = 50, message = "Display name must be between 1 and 50 characters")
    private String displayName;

    @Pattern(regexp = "^https?://.*", message = "Avatar URL must be a valid HTTP/HTTPS URL")
    private String avatarUrl;
}
```

**Backend - Service:**
**File:** `com.battlearena.profile.service.ProfileService`

```java
public ProfileResponse updateProfile(String userId, UpdateProfileRequest request) {
    // 1. Get profile from database
    // 2. Update display name and avatar
    // 3. Save to MongoDB
    // 4. Invalidate Redis cache
    // 5. Return updated ProfileResponse
}
```

**Backend - Controller:**
**File:** `com.battlearena.profile.controller.ProfileController`

```java
@PutMapping("/{userId}")
@Operation(summary = "Update user profile")
public ResponseEntity<ProfileResponse> updateProfile(
    @PathVariable String userId,
    @Valid @RequestBody UpdateProfileRequest request,
    @RequestHeader("Authorization") String token) {
    // 1. Validate JWT token
    // 2. Verify user can only update own profile
    // 3. Update profile via ProfileService
    // 4. Return updated ProfileResponse
}
```

**Frontend - Profile Update Component:**
**File:** `src/app/profile/components/profile-update/profile-update.component.ts`

```typescript
@Component({
  selector: "app-profile-update",
  templateUrl: "./profile-update.component.html",
})
export class ProfileUpdateComponent {
  updateForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
  ) {
    this.updateForm = this.fb.group({
      displayName: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      avatarUrl: ["", [Validators.pattern(/^https?:\/\/.*/)]],
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.loading = true;
      const userId = this.authService.getUserId();
      this.profileService.updateProfile(userId, this.updateForm.value).subscribe({
        next: (updatedProfile) => {
          // Show success message
          // Refresh profile view
          this.loading = false;
        },
        error: (error) => {
          // Show error message
          this.loading = false;
        },
      });
    }
  }
}
```

**End-to-End Test Scenario:**

1. Player navigates to profile page
2. Click "Edit Profile"
3. Update display name and avatar URL
4. Submit form
5. Verify API call to PUT /api/profile/{userId}
6. Verify profile updated in MongoDB
7. Verify updated profile displayed
8. Verify success message shown

**Definition of Done:**

- Player can update their profile
- Profile updated in database
- Updated profile displayed
- Success message shown

---

### VS-4-3: Player can view global leaderboard

**User Story:** As a player, I want to view the global leaderboard so that I can see how I rank against other players.

**Acceptance Criteria:**

- [ ] Leaderboard page visible on frontend
- [ ] Player can navigate to leaderboard
- [ ] Global leaderboard displayed (top players by score)
- [ ] Leaderboard shows: rank, player name, rank tier, global score, wins, losses, win%, matches played
- [ ] Leaderboard data fetched from Leaderboard Service
- [ ] Leaderboard sorted by global score (descending)
- [ ] Top 100 players displayed (for MVP)

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-4-3-1: Leaderboard Service Foundation Setup (BE)**

**Description:**
Set up the Spring Boot project structure, dependencies, and configuration for the Leaderboard Service. This is a prerequisite for all other leaderboard tasks.

**Related Diagrams & Documents:**

- [Leaderboard Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/leaderboard-service.puml)
- [System Architecture - Leaderboard Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#23-leaderboard-service)
- [Leaderboard Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md)

**Acceptance Criteria:**

- [ ] Spring Boot 3.x project created (Java 17)
- [ ] Maven project structure created
- [ ] Package structure follows clean architecture
- [ ] All Maven dependencies added (Spring Boot, MongoDB, JWT, Validation, Swagger)
- [ ] application.properties configured (port 8083, MongoDB URI, CORS)
- [ ] Health check endpoint working (`/health`)
- [ ] Swagger/OpenAPI configured and accessible

**Technical Details:**

**Project Structure:**

```
src/main/java/com/battlearena/leaderboard/
├── Application.java
├── controller/
│   └── LeaderboardController.java
├── service/
│   ├── LeaderboardService.java
│   └── strategy/
│       ├── RankingStrategy.java
│       └── FilterStrategy.java
├── repository/
│   └── LeaderboardRepository.java
├── dto/
│   ├── LeaderboardResponse.java
│   └── FilterCriteria.java
└── config/
    ├── SwaggerConfig.java
    └── SecurityConfig.java
```

**Required Dependencies (pom.xml):**

- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- spring-boot-starter-security
- springdoc-openapi-starter-webmvc-ui
- spring-boot-starter-test

**Application Properties:**

```properties
server.port=8083
spring.application.name=leaderboard-service
spring.data.mongodb.uri=${MONGODB_URI:mongodb://mongodb:27017/battlearena}
jwt.secret=${JWT_SECRET:your-secret-key-change-in-production}
```

---

**TASK-VS-4-3-2: Global Leaderboard Feature (BE + FE)**

**Description:**
Implement complete global leaderboard feature including backend leaderboard query and frontend leaderboard page. This task combines all leaderboard-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Leaderboard View Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/leaderboard-view-flow.puml) - View leaderboard flow
- [Leaderboard Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/leaderboard-service.puml) - Service layer structure
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - LeaderboardService and components
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Profiles collection (read model)

**Acceptance Criteria:**

- [ ] LeaderboardRepository.findTopPlayers() method implemented with aggregation pipeline
- [ ] MongoDB query optimized with indexes
- [ ] LeaderboardService.getTopPlayers() method implemented
- [ ] LeaderboardResponse DTO created
- [ ] GET /api/leaderboard endpoint created
- [ ] Leaderboard sorted by global score (descending)
- [ ] Top 100 players returned (for MVP)
- [ ] Player statistics included (wins, losses, win%, matches played)
- [ ] Leaderboard page component created
- [ ] LeaderboardService.getTopPlayers() method implemented
- [ ] Leaderboard displayed in table/list
- [ ] Rank, player name, rank tier, score, stats displayed
- [ ] End-to-end test: Navigate to leaderboard → See top players → Verify data displayed

**Technical Details:**

**Backend - Repository:**
**File:** `com.battlearena.leaderboard.repository.LeaderboardRepository`

```java
@Repository
public interface LeaderboardRepository extends MongoRepository<Profile, String> {
    @Aggregation(pipeline = {
        "{ $sort: { globalScore: -1 } }",
        "{ $skip: ?0 }",
        "{ $limit: ?1 }"
    })
    List<LeaderboardEntry> findTopPlayers(int skip, int limit);
}
```

**Backend - Service:**
**File:** `com.battlearena.leaderboard.service.LeaderboardService`

```java
public LeaderboardResponse getTopPlayers(int page, int size) {
    int offset = (page - 1) * size;
    List<LeaderboardEntry> entries = repository.findTopPlayers(offset, size);
    long totalCount = repository.count();
    int totalPages = (int) Math.ceil((double) totalCount / size);

    return LeaderboardResponse.builder()
        .entries(entries)
        .page(page)
        .size(size)
        .totalPages(totalPages)
        .totalCount(totalCount)
        .build();
}
```

**Backend - DTO:**
**LeaderboardResponse:**

```java
public class LeaderboardResponse {
    private List<LeaderboardEntry> entries;
    private Integer totalPlayers;
}

public class LeaderboardEntry {
    private Integer rank;
    private String playerId;
    private String displayName;
    private RankTier rankTier;
    private Integer globalScore;
    private Integer wins;
    private Integer losses;
    private Integer matchesPlayed;
    private Double winRate;
}
```

**Backend - Controller:**
**File:** `com.battlearena.leaderboard.controller.LeaderboardController`

```java
@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    @GetMapping
    @Operation(summary = "Get global leaderboard")
    public ResponseEntity<LeaderboardResponse> getTopPlayers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        LeaderboardResponse response = leaderboardService.getTopPlayers(page, size);
        return ResponseEntity.ok(response);
    }
}
```

**Frontend - Leaderboard Component:**
**File:** `src/app/leaderboard/components/leaderboard/leaderboard.component.ts`

```typescript
@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  loading = false;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.loading = true;
    this.leaderboardService.getTopPlayers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.leaderboard = response.entries;
        this.loading = false;
      },
      error: (error) => {
        console.error("Failed to load leaderboard", error);
        this.loading = false;
      },
    });
  }
}
```

**Frontend - LeaderboardService:**
**File:** `src/app/services/leaderboard.service.ts`

```typescript
@Injectable()
export class LeaderboardService {
  getTopPlayers(page: number = 0, size: number = 10): Observable<LeaderboardResponse> {
    return this.http.get<LeaderboardResponse>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getFilteredLeaderboard(filters: FilterCriteria, page: number = 0, size: number = 10): Observable<LeaderboardResponse> {
    let params = new HttpParams().set("page", page.toString()).set("size", size.toString());
    if (filters.rankTier) {
      params = params.set("rankTier", filters.rankTier);
    }
    if (filters.region) {
      params = params.set("region", filters.region);
    }
    return this.http.get<LeaderboardResponse>(`${this.apiUrl}`, { params });
  }
}
```

**End-to-End Test Scenario:**

1. Player navigates to leaderboard page
2. Verify API call to GET /api/leaderboard
3. Verify leaderboard data received
4. Verify leaderboard displayed (rank, player name, rank tier, score, stats)
5. Verify top 100 players shown
6. Verify sorted by global score (descending)

**Definition of Done:**

- Player can view global leaderboard
- Leaderboard shows top players by score
- All statistics displayed correctly
- Leaderboard sorted correctly

---

### VS-4-4: Player can filter leaderboard

**User Story:** As a player, I want to filter the leaderboard by rank tier and region so that I can see rankings for specific criteria.

**Acceptance Criteria:**

- [ ] Filter controls visible on leaderboard page
- [ ] Player can filter by rank tier (dropdown)
- [ ] Player can filter by region (dropdown)
- [ ] Filters can be combined
- [ ] Leaderboard updates when filters applied
- [ ] Filtered leaderboard displayed correctly

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-4-4-1: Leaderboard Filtering Feature (BE + FE)**

**Description:**
Implement leaderboard filtering feature including backend filter logic and frontend filter controls. This task combines all filtering-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Leaderboard View Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/leaderboard-view-flow.puml) - Filtering flow
- [Leaderboard Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/leaderboard-service.puml) - FilterStrategy structure

**Acceptance Criteria:**

- [ ] FilterCriteria DTO created
- [ ] LeaderboardRepository.findByFilters() method implemented
- [ ] MongoDB query with filter conditions
- [ ] LeaderboardService.getFilteredLeaderboard() method implemented
- [ ] GET /api/leaderboard?rankTier={tier}&region={region} endpoint supports filters
- [ ] Filter controls component created
- [ ] Rank tier dropdown (all tiers)
- [ ] Region dropdown (all regions)
- [ ] Filters applied when selected
- [ ] Leaderboard updates with filtered results
- [ ] End-to-end test: Apply filters → Verify filtered leaderboard → Verify correct players shown

**Technical Details:**

**Backend - DTO:**
**FilterCriteria:**

```java
public class FilterCriteria {
    private RankTier rankTier;
    private String region;
    // Future: heroType, winRate, weapons
}
```

**Backend - Repository:**
**File:** `com.battlearena.leaderboard.repository.LeaderboardRepository`

```java
@Aggregation(pipeline = {
    "{ $match: { $and: [ { 'rankTier': ?0 }, { 'region': ?1 } ] } }",
    "{ $sort: { globalScore: -1 } }",
    "{ $skip: ?2 }",
    "{ $limit: ?3 }"
})
List<LeaderboardEntry> findByFilters(RankTier rankTier, String region, int skip, int limit);
```

**Backend - Service:**
**File:** `com.battlearena.leaderboard.service.LeaderboardService`

```java
public LeaderboardResponse getFilteredLeaderboard(FilterCriteria filters, int page, int size) {
    int offset = (page - 1) * size;
    List<LeaderboardEntry> entries = repository.findByFilters(
        filters.getRankTier(),
        filters.getRegion(),
        offset,
        size
    );
    long totalCount = repository.count(); // Count with same filters
    int totalPages = (int) Math.ceil((double) totalCount / size);

    return LeaderboardResponse.builder()
        .entries(entries)
        .page(page)
        .size(size)
        .totalPages(totalPages)
        .totalCount(totalCount)
        .build();
}
```

**Frontend - Filter Controls:**
**File:** `src/app/leaderboard/components/leaderboard-filters/leaderboard-filters.component.ts`

```typescript
@Component({
  selector: "app-leaderboard-filters",
  templateUrl: "./leaderboard-filters.component.html",
})
export class LeaderboardFiltersComponent {
  filterForm: FormGroup;
  rankTiers = Object.values(RankTier);
  regions = ["NA", "EU", "ASIA", "GLOBAL"]; // Example regions

  constructor(
    private fb: FormBuilder,
    private leaderboardService: LeaderboardService,
  ) {
    this.filterForm = this.fb.group({
      rankTier: [null],
      region: [null],
    });

    this.filterForm.valueChanges.subscribe((filters) => {
      this.applyFilters(filters);
    });
  }

  applyFilters(filters: FilterCriteria): void {
    this.leaderboardService.getFilteredLeaderboard(filters, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        // Update leaderboard display
      },
    });
  }
}
```

**End-to-End Test Scenario:**

1. Player navigates to leaderboard
2. Select rank tier filter (e.g., "Gold")
3. Select region filter (e.g., "NA")
4. Verify API call with filters
5. Verify filtered leaderboard displayed
6. Verify only players matching filters shown

**Definition of Done:**

- Player can filter leaderboard by rank tier
- Player can filter leaderboard by region
- Filters can be combined
- Filtered leaderboard displayed correctly

---

### VS-4-5: Match results update profile and leaderboard

**User Story:** As a player, I want my match results to automatically update my profile and leaderboard position so that my progress is tracked accurately.

**Acceptance Criteria:**

- [ ] Match result sent to Profile Service after match ends
- [ ] Global score updated based on match result
- [ ] Win/loss statistics updated
- [ ] Rank tier recalculated if score changed tier
- [ ] Profile updated in MongoDB
- [ ] Leaderboard updated automatically (read from Profiles collection)
- [ ] Player sees updated profile after match
- [ ] Player sees rank tier change if applicable

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-4-5-1: Score Tracking & Rank Tier Calculation (BE)**

**Description:**
Implement global score tracking and rank tier calculation system. This includes score updates after matches and automatic rank tier recalculation.

**Related Diagrams & Documents:**

- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Score update flow
- [Profile Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/profile-service.puml) - ScoreCalculator and RankTierCalculator

**Acceptance Criteria:**

- [ ] ScoreCalculator.calculateScore() method implemented
- [ ] Score update logic (win = +X points, loss = -Y points)
- [ ] ProfileService.updateScore() method implemented
- [ ] Score update is atomic and thread-safe
- [ ] RankTierCalculator.calculateRankTier() method implemented
- [ ] Rank tier calculated from score ranges
- [ ] Rank tier updated if score changed tier
- [ ] Statistics updated (wins, losses, matches played, win rate)
- [ ] Profile updated in MongoDB
- [ ] Redis cache invalidated
- [ ] Unit tests for score calculation
- [ ] Unit tests for rank tier calculation

**Technical Details:**

**Backend - Score Calculator:**
**File:** `com.battlearena.profile.service.ScoreCalculator`

```java
public class ScoreCalculator {
    public int calculateScoreUpdate(MatchResult matchResult, boolean isWinner) {
        // MVP: Simple scoring
        // Win = +25 points
        // Loss = -10 points
        // Future: Complex scoring based on performance
        return isWinner ? 25 : -10;
    }
}
```

**Backend - Rank Tier Calculator:**
**File:** `com.battlearena.profile.service.RankTierCalculator`

```java
public class RankTierCalculator {
    public RankTier calculateRankTier(int globalScore) {
        // Valorant-style rank tiers
        if (globalScore < 100) return RankTier.IRON;
        if (globalScore < 300) return RankTier.BRONZE;
        if (globalScore < 600) return RankTier.SILVER;
        if (globalScore < 1000) return RankTier.GOLD;
        if (globalScore < 1500) return RankTier.PLATINUM;
        if (globalScore < 2000) return RankTier.DIAMOND;
        if (globalScore < 3000) return RankTier.MASTER;
        return RankTier.GRANDMASTER;
    }
}
```

**Backend - Service:**
**File:** `com.battlearena.profile.service.ProfileService`

```java
@Transactional
public ProfileResponse updateScore(String userId, MatchResult matchResult) {
    // 1. Get profile from database
    // 2. Calculate score update via ScoreCalculator
    // 3. Update global score
    // 4. Update wins/losses/matches played
    // 5. Calculate win rate
    // 6. Calculate new rank tier via RankTierCalculator
    // 7. Update rank tier if changed
    // 8. Save to MongoDB (atomic)
    // 9. Invalidate Redis cache
    // 10. Return updated ProfileResponse
}
```

**End-to-End Test Scenario:**

1. Match ends with result
2. Game Engine sends match result to Profile Service
3. Score calculated and updated
4. Statistics updated
5. Rank tier recalculated
6. Profile updated in MongoDB
7. Leaderboard automatically reflects changes (read from Profiles)

**Definition of Done:**

- Score updated after each match
- Statistics updated correctly
- Rank tier recalculated when score changes tier
- Profile updated atomically
- Leaderboard reflects changes

---

**TASK-VS-4-5-2: Post-Match Integration (BE + FE)**

**Description:**
Implement post-match integration between Game Engine Service and Profile Service, and update frontend to show rank changes after match.

**Related Diagrams & Documents:**

- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Complete post-match flow
- [Post-Match Result Screen Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-result-screen-flow.puml) - Result screen with rank changes

**Acceptance Criteria:**

- [ ] Game Engine sends match result to Profile Service
- [ ] Profile Service updates score and statistics
- [ ] Profile Service returns updated profile
- [ ] Game Engine stores match result in MongoDB
- [ ] Frontend receives match result
- [ ] Match result screen shows updated score
- [ ] Match result screen shows rank tier change (if applicable)
- [ ] Player can navigate to profile to see full stats
- [ ] End-to-end test: Match ends → Profile updated → Result screen shows changes

**Technical Details:**

**Backend - Game Engine Integration:**
**File:** `src/service/MatchResultProcessor.ts` (Game Engine Service)

```typescript
export class MatchResultProcessor {
  async processMatchResult(matchId: string, matchResult: MatchResult): Promise<void> {
    // 1. Store match result in MongoDB
    // 2. Send match result to Profile Service for both players
    // 3. Update player 1 profile
    // 4. Update player 2 profile
    // 5. Return updated profiles
  }

  private async updatePlayerProfile(playerId: string, matchResult: MatchResult, isWinner: boolean): Promise<void> {
    // Call Profile Service API
    await this.profileServiceClient.updateScore(playerId, {
      matchResult,
      isWinner,
    });
  }
}
```

**Backend - Profile Service Endpoint:**
**File:** `com.battlearena.profile.controller.ProfileController`

```java
@PostMapping("/{userId}/score")
@Operation(summary = "Update player score after match")
public ResponseEntity<ProfileResponse> updateScore(
    @PathVariable String userId,
    @RequestBody ScoreUpdateRequest request) {
    // 1. Update score via ProfileService
    // 2. Return updated ProfileResponse
}
```

**Frontend - Match Result Component:**
**File:** `src/app/arena/components/match-result/match-result.component.ts`

```typescript
@Component({
  selector: "app-match-result",
  templateUrl: "./match-result.component.html",
})
export class MatchResultComponent implements OnInit {
  matchResult: MatchResult | null = null;
  updatedProfile: Profile | null = null;
  rankTierChanged = false;

  constructor(
    private gameService: GameService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.gameService.getMatchResult().subscribe((result) => {
      this.matchResult = result;
      this.loadUpdatedProfile();
    });
  }

  loadUpdatedProfile(): void {
    this.profileService.getProfileByUserId(this.playerId).subscribe((profile) => {
      this.updatedProfile = profile;
      // Check if rank tier changed
      // Show rank tier change animation if applicable
    });
  }
}
```

**End-to-End Test Scenario:**

1. Match ends
2. Game Engine processes match result
3. Profile Service updates both players' profiles
4. Match result screen displayed
5. Updated score shown
6. Rank tier change shown (if applicable)
7. Player can navigate to profile

**Definition of Done:**

- Match results update profiles automatically
- Score and statistics updated correctly
- Rank tier changes displayed
- Player can see updated profile after match

---

## Integration Testing

**Related Diagrams:**

- [Post-Match Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/post-match-flow.puml) - Complete post-match flow
- [Profile View Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/profile-view-flow.puml) - Profile view flow
- [Leaderboard View Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/leaderboard-view-flow.puml) - Leaderboard view flow

### End-to-End Test Scenario

```
1. Player plays a match (VS-3)
2. Match ends with result
3. Profile Service receives match result
4. Score updated (win = +25, loss = -10)
5. Statistics updated (wins, losses, matches played, win rate)
6. Rank tier recalculated
7. Profile updated in MongoDB
8. Player views their profile
9. Profile shows updated score, rank tier, statistics
10. Player views leaderboard
11. Leaderboard shows updated rankings
12. Player filters leaderboard by rank tier
13. Filtered leaderboard displayed
14. Player updates profile (display name, avatar)
15. Profile updated and displayed
```

**Test should pass:** ✅ All steps complete without errors

---

## Security Requirements

**Related Documents:**

- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Complete security implementation guide

### Profile Security

- JWT token validation on all profile endpoints
- Users can only update their own profile (authorization check)
- Input validation (display name length, avatar URL format)
- SQL injection prevention (MongoDB parameterized queries)

### Leaderboard Security

- JWT token validation on leaderboard endpoints
- Rate limiting on leaderboard queries
- Query optimization to prevent DoS

---

## Dependencies

### Prerequisites

- ✅ EPIC-VS-1 (Foundation) must be completed
  - [EPIC-VS-1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/EPICS/EPIC_VS_1_FOUNDATION.md)
- ✅ EPIC-VS-2 (Authentication) must be completed
  - [EPIC-VS-2 Authentication Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/EPICS/EPIC_VS_2_AUTHENTICATION.md)
- ✅ EPIC-VS-3 (First Playable Match) must be completed
  - [EPIC-VS-3 First Playable Match Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/EPICS/EPIC_VS_3_FIRST_PLAYABLE_MATCH.md)
- ✅ MongoDB running (via Docker Compose)
  - [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)
- ✅ Redis running (via Docker Compose)
  - [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)

### Blocking Issues

- EPIC-VS-1 (Foundation) must be completed first
- EPIC-VS-2 (Authentication) must be completed first
- EPIC-VS-3 (First Playable Match) must be completed first

---

## Technical Debt & Future Enhancements

### Not in Scope (For Future Epics)

- Advanced statistics (accuracy, combos, saves, damage dealt)
- Hero-specific statistics
- Weapon-specific statistics
- Match history (detailed match-by-match history)
- Profile achievements/badges
- Advanced leaderboard filtering (hero type, win%, weapons)
- Pagination (for MVP, show top 100 only)
- Leaderboard caching (Redis caching for leaderboard queries)

### Marked for Future

- [ ] Advanced statistics tracking
- [ ] Hero-specific and weapon-specific statistics
- [ ] Detailed match history
- [ ] Profile achievements/badges system
- [ ] Advanced leaderboard filtering
- [ ] Leaderboard pagination
- [ ] Leaderboard caching for performance

---

## Labels

epic:vertical-slice, epic:progression, priority:high, milestone:VS-4

## Milestone

VS-4: Profile & Progression

## Related Epics

- EPIC-VS-1: Foundation & Infrastructure Setup (prerequisite)
- EPIC-VS-2: Player Authentication & Identity (prerequisite)
- EPIC-VS-3: First Playable Match (prerequisite)
- EPIC-VS-5: Full Game Features (depends on VS-4)

```

---

## How to Use This Template

1. **Create Epic Issue:**
   - Copy the EPIC-VS-4 template above
   - Create issue in GitHub
   - Assign to milestone "VS-4: Profile & Progression"

2. **Create Story Issues:**
   - For each VS-4-X story, create a separate issue
   - Link to EPIC-VS-4 as parent
   - Copy tasks from Phase 3, 4, and 7 documents
   - Link to Phase documents for technical reference

3. **Create Task Issues:**
   - For each task, create subtask or separate issue
   - Link to story as parent
   - Reference Phase 3, 4, and 7 documents for technical details

4. **Track Progress:**
   - Use GitHub Projects Kanban board
   - Move stories through: Backlog → To Do → In Progress → Review → Done
   - Update epic when all stories complete

---

**This template demonstrates how to:**
1. Structure vertical slice epics with player focus
2. Reference Phase documents for technical details
3. Break down into player-focused stories
4. Pull tasks from Phase documents
5. Define clear acceptance criteria and definitions of done
6. Consolidate BE + FE tasks for end-to-end testing

```
