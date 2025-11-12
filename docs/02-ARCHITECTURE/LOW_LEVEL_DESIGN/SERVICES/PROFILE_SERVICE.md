# Profile Service - Low-Level Design (LLD)

**Part of:** [Low-Level Design (LLD)](../README.md)  
**Service:** Profile Service (Spring Boot)  
**Last Updated:** 2024

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**This document and all implementation MUST strictly adhere to the following principles:**

1. **REUSABILITY** - All components, services, and utilities MUST be designed for maximum reusability across the system
2. **GOOD CODE PRACTICES** - Follow SOLID principles, DRY (Don't Repeat Yourself), and industry best practices
3. **CLEAN CODE** - Code must be readable, self-documenting, and maintainable
4. **CLEAN ARCHITECTURE** - Strict separation of concerns with clear boundaries between layers
5. **SECURE PROGRAMMING** - Security-first approach with defense in depth, input validation, and secure communication

**These principles are NON-NEGOTIABLE and must be enforced in every line of code and every architectural decision.**

---

## 1. Service Overview

### 1.1 Responsibilities
- User profile management
- Global score tracking and update (not per-hero, score can be infinite, no level cap)
- Rank tier calculation (like Valorant, based on score ranges)
- Player statistics
- Avatar management
- Rank change calculation (based on match score, formula to be determined)

### 1.2 Key Components
- **ProfileController** - REST API endpoint handler (Facade Pattern)
- **ProfileService** - Business logic for profile management (Strategy Pattern)
- **ProfileRepository** - Data access layer (Repository Pattern)
- **ScoreCalculator** - Score calculation (Strategy Pattern)
- **RankTierCalculator** - Rank tier calculation (Strategy Pattern)
- **RedisCache** - Caching layer (Proxy Pattern)

### 1.3 Design Patterns Applied
- **Facade Pattern** - ProfileController provides simplified interface
- **Strategy Pattern** - Scoring strategies, rank tier calculation strategies
- **Repository Pattern** - ProfileRepository abstracts data access
- **Proxy Pattern** - RedisCache provides caching proxy
- **Factory Pattern** - Profile entity creation (optional)
- **Observer Pattern** - Profile update notifications (optional)

---

## 2. UML Class Diagram

**See:** [Profile Service Class Diagram](../../../03-DIAGRAMS/class-diagrams/profile-service.puml)

### 2.1 Class Relationships

```
ProfileController
    ├── depends on → ProfileService
    └── depends on → JwtTokenManager

ProfileService
    ├── depends on → ProfileRepository
    ├── depends on → ScoreCalculator
    ├── depends on → RankTierCalculator
    └── depends on → RedisCache

ProfileRepository
    └── implements → MongoRepository<Profile, String>

ScoreCalculator
    ├── depends on → ScoringStrategy
    └── uses → ConfigurationManager

RankTierCalculator
    ├── depends on → RankTierStrategy
    └── uses → ConfigurationManager

ScoringStrategy (interface)
    └── implemented by → DefaultScoringStrategy

RankTierStrategy (interface)
    └── implemented by → ValorantStyleRankTierStrategy

Profile
    └── entity → MongoDB document
```

---

## 3. Class Responsibilities (C4 Code Level)

### 3.1 ProfileController
**Role:** Facade for profile operations  
**Responsibilities:**
- Handle HTTP requests for profile operations
- Validate request data
- Delegate business logic to ProfileService
- Format HTTP responses
- Handle exceptions and errors

**Dependencies:**
- ProfileService (business logic)
- JwtTokenManager (token validation)

**Collaborations:**
- Receives requests from clients
- Delegates to ProfileService
- Returns responses to clients

### 3.2 ProfileService
**Role:** Business logic orchestrator  
**Responsibilities:**
- Coordinate profile operations
- Manage profile data
- Calculate global scores
- Calculate rank tiers
- Update player statistics
- Manage avatar uploads

**Dependencies:**
- ProfileRepository (data access)
- ScoreCalculator (score calculation)
- RankTierCalculator (rank tier calculation)
- RedisCache (caching)

**Collaborations:**
- Uses ProfileRepository to access profile data
- Uses ScoreCalculator to calculate scores
- Uses RankTierCalculator to calculate rank tiers
- Uses RedisCache for caching

### 3.3 ProfileRepository
**Role:** Data access abstraction  
**Responsibilities:**
- Abstract database operations
- Provide CRUD operations for Profile entity
- Handle data persistence
- Manage database connections

**Dependencies:**
- MongoDB (database)
- Profile entity (data model)

**Collaborations:**
- Used by ProfileService to access profile data
- Interacts with MongoDB database

### 3.4 ScoreCalculator
**Role:** Score calculation orchestrator  
**Responsibilities:**
- Calculate new global scores
- Calculate match scores
- Apply scoring strategies
- Manage score updates

**Dependencies:**
- ScoringStrategy (scoring algorithm)
- ConfigurationManager (configuration)

**Collaborations:**
- Used by ProfileService to calculate scores
- Uses ScoringStrategy for score calculation

### 3.5 RankTierCalculator
**Role:** Rank tier calculation orchestrator  
**Responsibilities:**
- Calculate rank tiers from global scores
- Apply rank tier strategies
- Manage rank tier ranges
- Calculate rank changes

**Dependencies:**
- RankTierStrategy (rank tier algorithm)
- ConfigurationManager (configuration)

**Collaborations:**
- Used by ProfileService to calculate rank tiers
- Uses RankTierStrategy for rank tier calculation

### 3.6 ScoringStrategy (Interface)
**Role:** Scoring algorithm abstraction  
**Responsibilities:**
- Define scoring algorithm interface
- Allow different scoring strategies
- Provide flexibility in score calculation

**Implementations:**
- DefaultScoringStrategy (default scoring)

**Collaborations:**
- Used by ScoreCalculator for score calculation

### 3.7 RankTierStrategy (Interface)
**Role:** Rank tier algorithm abstraction  
**Responsibilities:**
- Define rank tier algorithm interface
- Allow different rank tier strategies
- Provide flexibility in rank tier calculation

**Implementations:**
- ValorantStyleRankTierStrategy (Valorant-style rank tiers)

**Collaborations:**
- Used by RankTierCalculator for rank tier calculation

### 3.8 Profile
**Role:** Profile entity  
**Responsibilities:**
- Represent profile data
- Provide data structure
- Enforce data constraints

**Dependencies:**
- MongoDB (persistence)
- Validation annotations

**Collaborations:**
- Used by ProfileRepository for data operations
- Used by ProfileService for business logic

---

## 4. Design Pattern Applications

### 4.1 Facade Pattern - ProfileController
**Pattern:** Facade Pattern  
**Intent:** Provide a unified interface to a set of interfaces in a subsystem  
**Participants:**
- **Facade:** ProfileController
- **Subsystem Classes:** ProfileService, ScoreCalculator, RankTierCalculator

**Why:** Simplifies client interaction with profile subsystem  
**Consequences:**
- ✅ Simplifies client interface
- ✅ Decouples clients from subsystem
- ❌ May reduce flexibility

### 4.2 Strategy Pattern - ScoringStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** ScoringStrategy (interface)
- **ConcreteStrategy:** DefaultScoringStrategy
- **Context:** ScoreCalculator

**Why:** Allows different scoring algorithms without changing ScoreCalculator  
**Consequences:**
- ✅ Flexibility in scoring algorithms
- ✅ Easy to add new scoring strategies
- ❌ Increased number of classes

### 4.3 Strategy Pattern - RankTierStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** RankTierStrategy (interface)
- **ConcreteStrategy:** ValorantStyleRankTierStrategy
- **Context:** RankTierCalculator

**Why:** Allows different rank tier algorithms without changing RankTierCalculator  
**Consequences:**
- ✅ Flexibility in rank tier algorithms
- ✅ Easy to add new rank tier strategies
- ❌ Increased number of classes

### 4.4 Repository Pattern - ProfileRepository
**Pattern:** Repository Pattern  
**Intent:** Mediate between domain and data mapping layers  
**Participants:**
- **Repository:** ProfileRepository (interface)
- **ConcreteRepository:** MongoProfileRepository (Spring Data MongoDB)
- **Entity:** Profile

**Why:** Abstracts data access and provides testability  
**Consequences:**
- ✅ Decouples business logic from data access
- ✅ Easier testing with mock repositories
- ✅ Centralized data access logic

### 4.5 Proxy Pattern - RedisCache
**Pattern:** Proxy Pattern  
**Intent:** Provide a surrogate or placeholder for another object to control access to it  
**Participants:**
- **Proxy:** RedisCache
- **RealSubject:** ProfileRepository

**Why:** Provides caching layer without changing ProfileRepository  
**Consequences:**
- ✅ Adds caching functionality
- ✅ Improves performance
- ✅ Transparent to client
- ❌ Increased complexity

---

## 5. Method Signatures (Not Implementations)

### 5.1 ProfileController
```java
// Responsibilities: Handle HTTP requests for profile operations
public class ProfileController {
    // Get user profile
    ResponseEntity<ProfileResponse> getProfile(String token);
    
    // Update user profile
    ResponseEntity<ProfileResponse> updateProfile(String token, UpdateProfileRequest request);
    
    // Get global score
    ResponseEntity<ScoreResponse> getGlobalScore(String token);
    
    // Get rank tier
    ResponseEntity<RankTierResponse> getRankTier(String token);
    
    // Update score after match (called by Game Engine Service)
    ResponseEntity<ScoreUpdateResponse> updateScore(ScoreUpdateRequest request);
    
    // Get player statistics
    ResponseEntity<StatisticsResponse> getStatistics(String token);
}
```

### 5.2 ProfileService
```java
// Responsibilities: Coordinate profile operations
public class ProfileService {
    // Get user profile by user ID
    Profile getProfile(String userId) throws ProfileNotFoundException;
    
    // Update user profile
    Profile updateProfile(String userId, UpdateProfileRequest request);
    
    // Get global score
    long getGlobalScore(String userId);
    
    // Get rank tier
    String getRankTier(String userId);
    
    // Update score after match
    ScoreUpdateResult updateScore(String userId, long matchScore);
    
    // Get player statistics
    PlayerStatistics getStatistics(String userId);
}
```

### 5.3 ProfileRepository
```java
// Responsibilities: Abstract database operations for Profile entity
public interface ProfileRepository extends MongoRepository<Profile, String> {
    // Find profile by user ID
    Optional<Profile> findByUserId(String userId);
    
    // Update global score
    void updateGlobalScore(String userId, long newScore);
    
    // Update rank tier
    void updateRankTier(String userId, String rankTier);
    
    // Increment wins
    void incrementWins(String userId);
    
    // Increment losses
    void incrementLosses(String userId);
    
    // Increment matches played
    void incrementMatchesPlayed(String userId);
}
```

### 5.4 ScoreCalculator
```java
// Responsibilities: Calculate global score based on match performance
public class ScoreCalculator {
    // Calculate new global score
    long calculateNewScore(long currentScore, long matchScore);
    
    // Calculate score from match results
    long calculateMatchScore(MatchResult matchResult);
}
```

### 5.5 RankTierCalculator
```java
// Responsibilities: Calculate rank tier based on global score
public class RankTierCalculator {
    // Calculate rank tier from global score
    String calculateRankTier(long globalScore);
    
    // Get rank tier ranges from configuration
    Map<String, RankTierRange> getRankTierRanges();
}
```

### 5.6 ScoringStrategy (Interface)
```java
// Responsibilities: Define scoring algorithm interface
public interface ScoringStrategy {
    // Calculate new global score
    long calculateNewScore(long currentScore, long matchScore);
}
```

### 5.7 RankTierStrategy (Interface)
```java
// Responsibilities: Define rank tier algorithm interface
public interface RankTierStrategy {
    // Calculate rank tier from global score
    String calculateRankTier(long globalScore, Map<String, RankTierRange> rankTierRanges);
}
```

---

## 6. Class Relationships

### 6.1 Inheritance
- **DefaultScoringStrategy** implements **ScoringStrategy**
- **ValorantStyleRankTierStrategy** implements **RankTierStrategy**

### 6.2 Composition
- **ProfileController** contains **ProfileService**
- **ProfileService** contains **ProfileRepository**, **ScoreCalculator**, **RankTierCalculator**, **RedisCache**
- **ScoreCalculator** contains **ScoringStrategy**
- **RankTierCalculator** contains **RankTierStrategy**

### 6.3 Aggregation
- **ProfileRepository** aggregates **Profile** entities

### 6.4 Dependency
- **ProfileController** depends on **ProfileService** and **JwtTokenManager**
- **ProfileService** depends on **ProfileRepository**, **ScoreCalculator**, **RankTierCalculator**, **RedisCache**
- **ScoreCalculator** depends on **ScoringStrategy** and **ConfigurationManager**
- **RankTierCalculator** depends on **RankTierStrategy** and **ConfigurationManager**

---

## 7. Sequence Diagrams

**See:** [Profile Update Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/profile-update-flow.puml)

### 7.1 Score Update Flow
```
Game Engine Service → ProfileController → ProfileService → ScoreCalculator
                                                          ↓
                                                    ScoringStrategy
                                                          ↓
                                                    ProfileRepository → MongoDB
                                                          ↓
                                                    RankTierCalculator
                                                          ↓
                                                    RankTierStrategy
                                                          ↓
                                                    ProfileService → ProfileController → Game Engine Service
```

---

## 8. Related Documentation

- [High-Level Design - Component Design](../../HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Component specifications
- [High-Level Design - Database Design](../../HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Database schema
- [Error Handling](../COMMON/ERROR_HANDLING.md) - Error handling patterns
- [Testing Strategy](../COMMON/TESTING_STRATEGY.md) - Testing approach
- [Class Diagram](../../../03-DIAGRAMS/class-diagrams/profile-service.puml) - UML class diagram

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** System Architecture Team
- **Reviewer:** Technical Lead
- **Status:** Design-Focused (Restructured)
- **Next Review Date:** After implementation phase

---

**⚠️ REMINDER: This is DESIGN, not IMPLEMENTATION - Focus on Roles, Responsibilities, Relationships, and Patterns**
