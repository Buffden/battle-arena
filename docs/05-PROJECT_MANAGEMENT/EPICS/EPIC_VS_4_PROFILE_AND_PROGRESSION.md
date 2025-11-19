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

### VS-4-1: Implement player profile view with statistics and rank tier display

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

**Reference Documentation:**
- [Profile Service Low-Level Design](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) - Complete service architecture and component design
- [System Architecture - Profile Service](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#22-profile-service) - Service integration and communication patterns
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Backend service structure and dependencies

**Project Structure Setup:**
- Create Maven project structure in `backend-services/profile-service/` directory
- Set up standard Maven directory layout (src/main/java, src/main/resources, src/test/java)
- Create package structure following clean architecture principles:
  - `com.battlearena.profile` - Main package
  - `com.battlearena.profile.controller` - REST API endpoints
  - `com.battlearena.profile.service` - Business logic layer (ProfileService, ScoreCalculator, RankTierCalculator)
  - `com.battlearena.profile.repository` - Data access layer
  - `com.battlearena.profile.model` - Domain entities (Profile, RankTier)
  - `com.battlearena.profile.dto` - Data Transfer Objects (ProfileResponse, UpdateProfileRequest, ScoreUpdateRequest)
  - `com.battlearena.profile.config` - Configuration classes (RedisConfig, SwaggerConfig)
  - `com.battlearena.profile.cache` - Caching layer (RedisCache)
  - `com.battlearena.profile.exception` - Exception handlers
- Create test package structure mirroring main package structure
- Add `checkstyle.xml` configuration file for code quality checks
- Create `README.md` file documenting service overview, technology stack, endpoints, and environment variables

**Maven Dependencies (pom.xml):**
- Configure Spring Boot parent POM version 3.3.6
- Set Java version to 17 in properties section
- Add Spring Boot starter dependencies:
  - spring-boot-starter-web (REST API support)
  - spring-boot-starter-data-mongodb (MongoDB integration)
  - spring-boot-starter-data-redis (Redis integration)
  - spring-boot-starter-actuator (Health checks and monitoring)
  - spring-boot-starter-validation (Input validation)
- Add JWT libraries (io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson version 0.12.3)
- Add SpringDoc OpenAPI dependency (springdoc-openapi-starter-webmvc-ui version 2.3.0) for Swagger documentation
- Add Lombok dependency (optional, for reducing boilerplate code)
- Add testing dependencies (spring-boot-starter-test)
- Configure Maven compiler plugin for Java 17 source and target
- Configure Spring Boot Maven plugin with Lombok exclusion
- Add JaCoCo Maven plugin for code coverage with 80% minimum requirement
- Add Maven Checkstyle plugin for code quality enforcement

**Application Configuration (application.yaml):**
- Configure server port (default 8082, configurable via SERVER_PORT environment variable)
- Set Spring application name to "profile-service"
- Configure MongoDB connection URI (default mongodb://mongodb:27017/battlearena, configurable via MONGODB_URI)
- Configure Redis connection:
  - Redis host (default redis, configurable via REDIS_HOST environment variable)
  - Redis port (default 6379, configurable via REDIS_PORT environment variable)
- Set JWT secret key (configurable via JWT_SECRET environment variable, with production warning)
- Configure SpringDoc OpenAPI settings for Swagger documentation
- Configure Spring Boot Actuator for health checks
- Configure logging levels with environment variable support

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

**Profile Entity Implementation Requirements:**
- Create Profile class in `com.battlearena.profile.model` package
- Add `@Document(collection = "profiles")` annotation to map to MongoDB collection
- Add `@Id` annotation to id field (String type for MongoDB ObjectId)
- Add `@Indexed(unique = true)` to userId field for database uniqueness and performance
- Add userId field (String) - Links to Users collection in Auth Service
- Add displayName field (String) - Player's display name
- Add avatarUrl field (String) - URL to player's avatar image
- Add globalScore field (Integer, default 0) - Infinite score, no level cap
- Add rankTier field (RankTier enum, default IRON) - Player's current rank tier
- Add wins field (Integer, default 0) - Number of matches won
- Add losses field (Integer, default 0) - Number of matches lost
- Add matchesPlayed field (Integer, default 0) - Total matches played
- Add winRate field (Double, default 0.0) - Calculated as wins / matchesPlayed * 100
- Add createdAt field (LocalDateTime) - Profile creation timestamp
- Add updatedAt field (LocalDateTime) - Profile last update timestamp
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Rank Tier Enum:**
**File:** `com.battlearena.profile.model.RankTier`

**RankTier Enum Implementation Requirements:**
- Create RankTier enum in `com.battlearena.profile.model` package
- Define enum values in order: IRON, BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, MASTER, GRANDMASTER
- Enum represents Valorant-style rank tier system
- Used for rank tier calculation based on global score ranges

**Backend - Repository:**
**File:** `com.battlearena.profile.repository.ProfileRepository`

**ProfileRepository Implementation Requirements:**
- Create ProfileRepository interface in `com.battlearena.profile.repository` package
- Extend MongoRepository interface with Profile entity and String ID type
- Add `@Repository` annotation for Spring component scanning
- Define custom query methods that Spring Data MongoDB will auto-implement:
  - `findByUserId(String userId)` - Returns Optional<Profile>, empty if not found
  - `existsByUserId(String userId)` - Returns boolean indicating if profile exists for user
- Spring Data MongoDB will automatically generate implementation based on method names
- Use Optional return type for find method to handle null cases safely

**Backend - Service:**
**File:** `com.battlearena.profile.service.ProfileService`

**ProfileService.getProfileByUserId() Implementation Requirements:**
- Create ProfileService class in `com.battlearena.profile.service` package
- Add `@Service` annotation for Spring service component
- Use constructor injection for dependencies (ProfileRepository, RedisCache)
- Implement `getProfileByUserId(String userId)` method:
  - Check Redis cache first for profile data (key: "profile:{userId}")
  - If found in cache, return cached ProfileResponse
  - If not in cache, retrieve profile from database using ProfileRepository.findByUserId()
  - If profile not found, create new profile with default values (or throw exception)
  - Calculate win rate if matchesPlayed > 0 (wins / matchesPlayed * 100)
  - Map Profile entity to ProfileResponse DTO
  - Cache ProfileResponse in Redis for future requests
  - Return ProfileResponse DTO
- Handle errors gracefully and throw appropriate exceptions

**Backend - DTO:**
**ProfileResponse Implementation Requirements:**
- Create ProfileResponse class in `com.battlearena.profile.dto` package
- Add userId field (String) - User ID from Auth Service
- Add displayName field (String) - Player's display name
- Add avatarUrl field (String) - URL to player's avatar image
- Add globalScore field (Integer) - Player's global score
- Add rankTier field (RankTier) - Player's current rank tier
- Add wins field (Integer) - Number of matches won
- Add losses field (Integer) - Number of matches lost
- Add matchesPlayed field (Integer) - Total matches played
- Add winRate field (Double) - Win percentage (calculated)
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Controller:**
**File:** `com.battlearena.profile.controller.ProfileController`

**ProfileController.getProfileByUserId() Implementation Requirements:**
- Create ProfileController class in `com.battlearena.profile.controller` package
- Add `@RestController` annotation for REST API controller
- Add `@RequestMapping("/api/profile")` annotation to set base path for all endpoints
- Use constructor injection for ProfileService dependency (Dependency Inversion Principle)
- Implement `getProfileByUserId(@PathVariable String userId, @RequestHeader("Authorization") String token)` endpoint:
  - Add `@GetMapping("/{userId}")` annotation
  - Add `@Operation` annotation for Swagger documentation (summary: "Get user profile")
  - Extract JWT token from Authorization header
  - Validate JWT token (optional: verify user can access this profile)
  - Call ProfileService.getProfileByUserId() to get profile data
  - Return ResponseEntity with HTTP 200 OK status and ProfileResponse body
  - Exception handling delegated to GlobalExceptionHandler

**Frontend - Profile Component:**
**File:** `src/app/profile/components/profile-view/profile-view.component.ts`

**ProfileViewComponent Implementation Requirements:**
- Create ProfileViewComponent class in `src/app/profile/components/profile-view/` directory
- Add `@Component` decorator with selector "app-profile-view" and template URL
- Implement OnInit interface
- Add profile property (Profile | null) to store profile data
- Add loading property (boolean) for showing loading state during API call
- Inject ProfileService and AuthService via constructor
- Implement `ngOnInit()` method:
  - Call loadProfile() method to fetch profile data
- Implement `loadProfile()` method:
  - Set loading to true
  - Get userId from AuthService.getUserId()
  - Call ProfileService.getProfileByUserId() with userId
  - Subscribe to Observable response
  - On success: Update profile property and set loading to false
  - On error: Log error, set loading to false, display error message
- Display profile data in template (display name, avatar, score, rank tier, statistics)
- Display rank tier badge/icon
- Format statistics correctly (percentages, numbers)

**Frontend - ProfileService:**
**File:** `src/app/services/profile.service.ts`

**ProfileService.getProfileByUserId() Implementation Requirements:**
- Create ProfileService class in `src/app/services/` directory
- Add `@Injectable()` decorator for Angular dependency injection
- Inject HttpClient for making HTTP requests
- Implement `getProfileByUserId(userId)` method:
  - Make HTTP GET request to `${apiUrl}/profile/${userId}` endpoint
  - Include JWT token in Authorization header
  - Return Observable<ProfileResponse>
  - Handle errors in component subscription

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

### VS-4-2: Implement player profile update with display name and avatar

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
**UpdateProfileRequest Implementation Requirements:**
- Create UpdateProfileRequest class in `com.battlearena.profile.dto` package
- Add displayName field (String) with validation:
  - `@Size(min = 1, max = 50)` annotation with message "Display name must be between 1 and 50 characters"
- Add avatarUrl field (String) with validation:
  - `@Pattern(regexp = "^https?://.*")` annotation with message "Avatar URL must be a valid HTTP/HTTPS URL"
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Service:**
**File:** `com.battlearena.profile.service.ProfileService`

**ProfileService.updateProfile() Implementation Requirements:**
- Add `updateProfile(String userId, UpdateProfileRequest request)` method to ProfileService
- Retrieve profile from database using ProfileRepository.findByUserId()
- If profile not found, throw appropriate exception
- Update displayName from request if provided
- Update avatarUrl from request if provided
- Set updatedAt timestamp to current time
- Save updated profile to MongoDB using ProfileRepository.save()
- Invalidate Redis cache for this profile (delete key "profile:{userId}")
- Map updated Profile entity to ProfileResponse DTO
- Return ProfileResponse DTO
- Handle errors gracefully and throw appropriate exceptions

**Backend - Controller:**
**File:** `com.battlearena.profile.controller.ProfileController`

**ProfileController.updateProfile() Implementation Requirements:**
- Add `updateProfile(@PathVariable String userId, @Valid @RequestBody UpdateProfileRequest request, @RequestHeader("Authorization") String token)` method to ProfileController
- Add `@PutMapping("/{userId}")` annotation
- Add `@Operation` annotation for Swagger documentation (summary: "Update user profile")
- Add `@Valid` annotation to request parameter for automatic validation
- Extract JWT token from Authorization header
- Validate JWT token and extract user ID
- Verify user can only update their own profile (compare token userId with path userId)
- If authorization fails, return HTTP 403 Forbidden
- Call ProfileService.updateProfile() to update profile
- Return ResponseEntity with HTTP 200 OK status and updated ProfileResponse body
- Exception handling delegated to GlobalExceptionHandler

**Frontend - Profile Update Component:**
**File:** `src/app/profile/components/profile-update/profile-update.component.ts`

**ProfileUpdateComponent Implementation Requirements:**
- Create ProfileUpdateComponent class in `src/app/profile/components/profile-update/` directory
- Add `@Component` decorator with selector "app-profile-update" and template URL
- Create reactive form using FormBuilder with two form controls:
  - displayName: Required, minimum length 1, maximum length 50
  - avatarUrl: Optional, must match HTTP/HTTPS URL pattern
- Add loading property (boolean) for showing loading state during API call
- Inject FormBuilder, ProfileService, and AuthService via constructor
- Implement `onSubmit()` method:
  - Check if form is valid
  - Set loading to true
  - Get userId from AuthService.getUserId()
  - Call ProfileService.updateProfile() with userId and form values
  - Subscribe to Observable response
  - On success: Display success message, refresh profile view, set loading to false
  - On error: Display error message, set loading to false
- Display form in template with validation error messages

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

### VS-4-3: Implement global leaderboard view with top players ranking

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

**Reference Documentation:**
- [Leaderboard Service Low-Level Design](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) - Complete service architecture and component design
- [System Architecture - Leaderboard Service](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#23-leaderboard-service) - Service integration and communication patterns
- [Component Design](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Backend service structure and dependencies

**Project Structure Setup:**
- Create Maven project structure in `backend-services/leaderboard-service/` directory
- Set up standard Maven directory layout (src/main/java, src/main/resources, src/test/java)
- Create package structure following clean architecture principles:
  - `com.battlearena.leaderboard` - Main package
  - `com.battlearena.leaderboard.controller` - REST API endpoints
  - `com.battlearena.leaderboard.service` - Business logic layer (LeaderboardService)
  - `com.battlearena.leaderboard.service.strategy` - Strategy pattern implementations (RankingStrategy, FilterStrategy)
  - `com.battlearena.leaderboard.repository` - Data access layer
  - `com.battlearena.leaderboard.dto` - Data Transfer Objects (LeaderboardResponse, FilterCriteria)
  - `com.battlearena.leaderboard.config` - Configuration classes (SwaggerConfig, SecurityConfig)
  - `com.battlearena.leaderboard.exception` - Exception handlers
- Create test package structure mirroring main package structure
- Add `checkstyle.xml` configuration file for code quality checks
- Create `README.md` file documenting service overview, technology stack, endpoints, and environment variables

**Maven Dependencies (pom.xml):**
- Configure Spring Boot parent POM version 3.3.6
- Set Java version to 17 in properties section
- Add Spring Boot starter dependencies:
  - spring-boot-starter-web (REST API support)
  - spring-boot-starter-data-mongodb (MongoDB integration)
  - spring-boot-starter-security (Security framework)
  - spring-boot-starter-actuator (Health checks and monitoring)
  - spring-boot-starter-validation (Input validation)
- Add JWT libraries (io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson version 0.12.3)
- Add SpringDoc OpenAPI dependency (springdoc-openapi-starter-webmvc-ui version 2.3.0) for Swagger documentation
- Add Lombok dependency (optional, for reducing boilerplate code)
- Add testing dependencies (spring-boot-starter-test)
- Configure Maven compiler plugin for Java 17 source and target
- Configure Spring Boot Maven plugin with Lombok exclusion
- Add JaCoCo Maven plugin for code coverage with 80% minimum requirement
- Add Maven Checkstyle plugin for code quality enforcement

**Application Configuration (application.yaml):**
- Configure server port (default 8083, configurable via SERVER_PORT environment variable)
- Set Spring application name to "leaderboard-service"
- Configure MongoDB connection URI (default mongodb://mongodb:27017/battlearena, configurable via MONGODB_URI)
- Set JWT secret key (configurable via JWT_SECRET environment variable, with production warning)
- Configure SpringDoc OpenAPI settings for Swagger documentation
- Configure Spring Boot Actuator for health checks
- Configure logging levels with environment variable support

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

**LeaderboardRepository Implementation Requirements:**
- Create LeaderboardRepository interface in `com.battlearena.leaderboard.repository` package
- Extend MongoRepository interface with Profile entity and String ID type
- Add `@Repository` annotation for Spring component scanning
- Implement `findTopPlayers(int skip, int limit)` method using MongoDB aggregation:
  - Use `@Aggregation` annotation with pipeline stages
  - Sort by globalScore in descending order (-1)
  - Skip records based on offset (skip parameter)
  - Limit results based on size (limit parameter)
  - Return List<LeaderboardEntry> with ranked players
- Ensure MongoDB collection has index on globalScore for optimal query performance

**Backend - Service:**
**File:** `com.battlearena.leaderboard.service.LeaderboardService`

**LeaderboardService.getTopPlayers() Implementation Requirements:**
- Create LeaderboardService class in `com.battlearena.leaderboard.service` package
- Add `@Service` annotation for Spring service component
- Use constructor injection for LeaderboardRepository dependency
- Implement `getTopPlayers(int page, int size)` method:
  - Calculate offset based on page and size: (page - 1) * size
  - Call repository.findTopPlayers() with offset and size
  - Get total count of players using repository.count()
  - Calculate total pages: Math.ceil(totalCount / size)
  - Build LeaderboardResponse with entries, page, size, totalPages, and totalCount
  - Return LeaderboardResponse DTO
- Handle errors gracefully and throw appropriate exceptions

**Backend - DTO:**
**LeaderboardResponse Implementation Requirements:**
- Create LeaderboardResponse class in `com.battlearena.leaderboard.dto` package
- Add entries field (List<LeaderboardEntry>) - List of leaderboard entries
- Add totalPlayers field (Integer) - Total number of players in leaderboard
- Implement getters and setters (or use Lombok @Data annotation)

**LeaderboardEntry Implementation Requirements:**
- Create LeaderboardEntry class in `com.battlearena.leaderboard.dto` package
- Add rank field (Integer) - Player's rank position
- Add playerId field (String) - User ID from Auth Service
- Add displayName field (String) - Player's display name
- Add rankTier field (RankTier) - Player's rank tier
- Add globalScore field (Integer) - Player's global score
- Add wins field (Integer) - Number of matches won
- Add losses field (Integer) - Number of matches lost
- Add matchesPlayed field (Integer) - Total matches played
- Add winRate field (Double) - Win percentage
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Controller:**
**File:** `com.battlearena.leaderboard.controller.LeaderboardController`

**LeaderboardController.getTopPlayers() Implementation Requirements:**
- Create LeaderboardController class in `com.battlearena.leaderboard.controller` package
- Add `@RestController` annotation for REST API controller
- Add `@RequestMapping("/api/leaderboard")` annotation to set base path
- Use constructor injection for LeaderboardService dependency
- Implement `getTopPlayers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size)` endpoint:
  - Add `@GetMapping` annotation
  - Add `@Operation` annotation for Swagger documentation (summary: "Get global leaderboard")
  - Set default values: page = 0, size = 10
  - Call LeaderboardService.getTopPlayers() with page and size
  - Return ResponseEntity with HTTP 200 OK status and LeaderboardResponse body
  - Exception handling delegated to GlobalExceptionHandler

**Frontend - Leaderboard Component:**
**File:** `src/app/leaderboard/components/leaderboard/leaderboard.component.ts`

**LeaderboardComponent Implementation Requirements:**
- Create LeaderboardComponent class in `src/app/leaderboard/components/leaderboard/` directory
- Add `@Component` decorator with selector "app-leaderboard" and template URL
- Implement OnInit interface
- Add leaderboard property (LeaderboardEntry[]) to store leaderboard entries
- Add loading property (boolean) for showing loading state during API call
- Add currentPage and pageSize properties for pagination
- Inject LeaderboardService via constructor
- Implement `ngOnInit()` method:
  - Call loadLeaderboard() method to fetch leaderboard data
- Implement `loadLeaderboard()` method:
  - Set loading to true
  - Call LeaderboardService.getTopPlayers() with currentPage and pageSize
  - Subscribe to Observable response
  - On success: Update leaderboard property and set loading to false
  - On error: Log error, set loading to false, display error message
- Display leaderboard in template (table or list format)
- Display rank, player name, rank tier badge, global score, wins, losses, win percentage, matches played
- Format statistics correctly (percentages, numbers)

**Frontend - LeaderboardService:**
**File:** `src/app/services/leaderboard.service.ts`

**LeaderboardService Implementation Requirements:**
- Create LeaderboardService class in `src/app/services/` directory
- Add `@Injectable()` decorator for Angular dependency injection
- Inject HttpClient for making HTTP requests
- Implement `getTopPlayers(page, size)` method:
  - Make HTTP GET request to `${apiUrl}/leaderboard?page=${page}&size=${size}` endpoint
  - Include JWT token in Authorization header
  - Return Observable<LeaderboardResponse>
  - Handle errors in component subscription
- Implement `getFilteredLeaderboard(filters, page, size)` method:
  - Create HttpParams with page and size parameters
  - Add rankTier to params if provided in filters
  - Add region to params if provided in filters
  - Make HTTP GET request with query parameters
  - Include JWT token in Authorization header
  - Return Observable<LeaderboardResponse>
  - Handle errors in component subscription

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

### VS-4-4: Implement leaderboard filtering by rank tier and region

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
**FilterCriteria Implementation Requirements:**
- Create FilterCriteria class in `com.battlearena.leaderboard.dto` package
- Add rankTier field (RankTier, nullable) - Filter by rank tier
- Add region field (String, nullable) - Filter by region
- Add comments indicating future filter options (heroType, winRate, weapons)
- Implement getters and setters (or use Lombok @Data annotation)

**Backend - Repository:**
**File:** `com.battlearena.leaderboard.repository.LeaderboardRepository`

**LeaderboardRepository.findByFilters() Implementation Requirements:**
- Add `findByFilters(RankTier rankTier, String region, int skip, int limit)` method to LeaderboardRepository
- Use `@Aggregation` annotation with MongoDB aggregation pipeline:
  - Match stage: Filter documents where rankTier and region match criteria (use $and operator)
  - Sort stage: Sort by globalScore in descending order (-1)
  - Skip stage: Skip records based on offset (skip parameter)
  - Limit stage: Limit results based on size (limit parameter)
- Return List<LeaderboardEntry> with filtered and ranked players
- Handle null filter values (apply filter only if not null)

**Backend - Service:**
**File:** `com.battlearena.leaderboard.service.LeaderboardService`

**LeaderboardService.getFilteredLeaderboard() Implementation Requirements:**
- Add `getFilteredLeaderboard(FilterCriteria filters, int page, int size)` method to LeaderboardService
- Calculate offset based on page and size: (page - 1) * size
- Call repository.findByFilters() with rankTier, region, offset, and size from FilterCriteria
- Get total count of players matching filters (implement count method with same filter criteria)
- Calculate total pages: Math.ceil(totalCount / size)
- Build LeaderboardResponse with entries, page, size, totalPages, and totalCount
- Return LeaderboardResponse DTO
- Handle errors gracefully and throw appropriate exceptions

**Frontend - Filter Controls:**
**File:** `src/app/leaderboard/components/leaderboard-filters/leaderboard-filters.component.ts`

**LeaderboardFiltersComponent Implementation Requirements:**
- Create LeaderboardFiltersComponent class in `src/app/leaderboard/components/leaderboard-filters/` directory
- Add `@Component` decorator with selector "app-leaderboard-filters" and template URL
- Create reactive form using FormBuilder with two form controls:
  - rankTier: Optional dropdown (null by default)
  - region: Optional dropdown (null by default)
- Add rankTiers property with all RankTier enum values for dropdown options
- Add regions property with available regions (e.g., ["NA", "EU", "ASIA", "GLOBAL"])
- Inject FormBuilder and LeaderboardService via constructor
- Subscribe to form valueChanges to automatically apply filters when changed
- Implement `applyFilters(filters)` method:
  - Call LeaderboardService.getFilteredLeaderboard() with filters, currentPage, and pageSize
  - Subscribe to Observable response
  - On success: Emit event or update parent component with filtered leaderboard data
  - Handle errors and display error messages
- Display filter controls in template (rank tier dropdown, region dropdown)
- Allow clearing filters (reset to null values)

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

### VS-4-5: Implement post-match score tracking and rank tier calculation

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

**ScoreCalculator Implementation Requirements:**
- Create ScoreCalculator class in `com.battlearena.profile.service` package
- Add `@Component` or `@Service` annotation for Spring dependency injection
- Implement `calculateScoreUpdate(MatchResult matchResult, boolean isWinner)` method:
  - For MVP: Use simple scoring system
  - If player is winner: Return +25 points
  - If player is loser: Return -10 points
  - Future enhancement: Complex scoring based on match performance (damage dealt, accuracy, etc.)
  - Return integer score change (positive for win, negative for loss)
- Design for extensibility (Strategy Pattern) to support future complex scoring algorithms

**Backend - Rank Tier Calculator:**
**File:** `com.battlearena.profile.service.RankTierCalculator`

**RankTierCalculator Implementation Requirements:**
- Create RankTierCalculator class in `com.battlearena.profile.service` package
- Add `@Component` or `@Service` annotation for Spring dependency injection
- Implement `calculateRankTier(int globalScore)` method with Valorant-style rank tiers:
  - If globalScore < 100: Return RankTier.IRON
  - If globalScore < 300: Return RankTier.BRONZE
  - If globalScore < 600: Return RankTier.SILVER
  - If globalScore < 1000: Return RankTier.GOLD
  - If globalScore < 1500: Return RankTier.PLATINUM
  - If globalScore < 2000: Return RankTier.DIAMOND
  - If globalScore < 3000: Return RankTier.MASTER
  - Otherwise: Return RankTier.GRANDMASTER
- Make score ranges configurable (via application.yaml) for future adjustments
- Return RankTier enum value based on score range

**Backend - Service:**
**File:** `com.battlearena.profile.service.ProfileService`

**ProfileService.updateScore() Implementation Requirements:**
- Add `updateScore(String userId, MatchResult matchResult)` method to ProfileService
- Add `@Transactional` annotation to ensure atomic database operations
- Retrieve profile from database using ProfileRepository.findByUserId()
- If profile not found, create new profile with default values
- Calculate score update using ScoreCalculator.calculateScoreUpdate() with matchResult and winner status
- Update global score: Add score change to current globalScore
- Update match statistics:
  - Increment matchesPlayed by 1
  - If winner: Increment wins by 1
  - If loser: Increment losses by 1
  - Calculate win rate: (wins / matchesPlayed) * 100
- Calculate new rank tier using RankTierCalculator.calculateRankTier() with updated globalScore
- Update rankTier if it changed from previous value
- Set updatedAt timestamp to current time
- Save updated profile to MongoDB using ProfileRepository.save() (atomic operation)
- Invalidate Redis cache for this profile (delete key "profile:{userId}")
- Map updated Profile entity to ProfileResponse DTO
- Return ProfileResponse DTO
- Handle errors gracefully and throw appropriate exceptions

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

**MatchResultProcessor Implementation Requirements:**
- Create MatchResultProcessor class in `src/service/` directory (Game Engine Service)
- Implement `processMatchResult(matchId, matchResult)` method:
  - Store match result in MongoDB (match history collection)
  - Determine winner and loser from matchResult
  - Call updatePlayerProfile() for player 1 with matchResult and winner status
  - Call updatePlayerProfile() for player 2 with matchResult and winner status
  - Wait for both profile updates to complete
  - Return updated profiles or confirmation
- Implement private `updatePlayerProfile(playerId, matchResult, isWinner)` method:
  - Create ScoreUpdateRequest object with matchResult and isWinner flag
  - Call Profile Service API endpoint POST /api/profile/{userId}/score
  - Send ScoreUpdateRequest in request body
  - Handle HTTP errors and retry logic if needed
  - Return updated profile or confirmation
- Use HTTP client or service client to communicate with Profile Service
- Handle service communication errors gracefully

**Backend - Profile Service Endpoint:**
**File:** `com.battlearena.profile.controller.ProfileController`

**ProfileController.updateScore() Implementation Requirements:**
- Add `updateScore(@PathVariable String userId, @RequestBody ScoreUpdateRequest request)` method to ProfileController
- Add `@PostMapping("/{userId}/score")` annotation
- Add `@Operation` annotation for Swagger documentation (summary: "Update player score after match")
- Extract userId from path variable
- Extract ScoreUpdateRequest from request body
- Call ProfileService.updateScore() with userId and matchResult from request
- Return ResponseEntity with HTTP 200 OK status and updated ProfileResponse body
- Exception handling delegated to GlobalExceptionHandler

**Frontend - Match Result Component:**
**File:** `src/app/arena/components/match-result/match-result.component.ts`

**MatchResultComponent Implementation Requirements:**
- Create MatchResultComponent class in `src/app/arena/components/match-result/` directory
- Add `@Component` decorator with selector "app-match-result" and template URL
- Implement OnInit interface
- Add matchResult property (MatchResult | null) to store match result data
- Add updatedProfile property (Profile | null) to store updated profile after match
- Add rankTierChanged property (boolean) to track if rank tier changed
- Add previousRankTier property to compare with new rank tier
- Inject GameService and ProfileService via constructor
- Implement `ngOnInit()` method:
  - Subscribe to GameService.getMatchResult() Observable
  - On result received: Update matchResult and call loadUpdatedProfile()
- Implement `loadUpdatedProfile()` method:
  - Get playerId from AuthService
  - Call ProfileService.getProfileByUserId() with playerId
  - Subscribe to Observable response
  - On success: Update updatedProfile, compare rankTier with previousRankTier, set rankTierChanged flag if changed
  - Display rank tier change animation if rankTierChanged is true
  - Handle errors and display error messages
- Display match result in template with updated score and rank tier change indicator

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

```
