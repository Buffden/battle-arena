# Database Schema - Low-Level Design (LLD)

**Part of:** [Low-Level Design (LLD)](./README.md)  
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

## 1. Database Schema Overview

### 1.1 Responsibilities
- Entity-relationship design for MongoDB collections
- Data access layer design (Repository pattern, DAO pattern)
- Schema validation patterns
- Database migration patterns
- Index design and optimization
- Query patterns and optimization
- Data modeling patterns

### 1.2 Key Components
- **Entity Models** - MongoDB document models (Entity Pattern)
- **Repository Interfaces** - Data access abstraction (Repository Pattern)
- **Repository Implementations** - MongoDB repository implementations (Repository Pattern)
- **DAO (Data Access Object)** - Data access objects (DAO Pattern)
- **Schema Validator** - Schema validation (Strategy Pattern)
- **Migration Manager** - Database migration management (Template Method Pattern)
- **Query Builder** - Query construction (Builder Pattern)
- **Index Manager** - Index management (Factory Pattern)

### 1.3 Design Patterns Applied
- **Repository Pattern** - Data access abstraction
- **DAO Pattern** - Data access object pattern
- **Factory Pattern** - Repository factory, Index factory
- **Strategy Pattern** - Query strategies, Validation strategies
- **Builder Pattern** - Query builder
- **Template Method Pattern** - Migration template
- **Adapter Pattern** - MongoDB adapter, Redis adapter
- **Singleton Pattern** - Database connection manager

---

## 2. UML Class Diagram

**See:** [Database Schema Class Diagram](../../../03-DIAGRAMS/class-diagrams/database-schema.puml)  
**See:** [ER Diagram](../../../03-DIAGRAMS/er-diagrams/database-er-diagram.puml)

### 2.1 Class Relationships

```
Repository (interface)
    └── implemented by → MongoRepository

MongoRepository
    ├── depends on → MongoDatabase
    ├── depends on → EntityModel
    └── depends on → QueryBuilder

DAO (interface)
    └── implemented by → MongoDAO

MongoDAO
    ├── depends on → MongoRepository
    └── depends on → EntityModel

SchemaValidator
    ├── depends on → ValidationStrategy
    └── uses → ValidationRules

MigrationManager
    ├── depends on → MigrationTemplate
    └── depends on → MigrationStrategy

QueryBuilder
    ├── depends on → QueryStrategy
    └── builds → MongoDB Query

IndexManager
    ├── depends on → IndexFactory
    └── manages → Indexes

EntityModel
    └── represents → MongoDB Document
```

---

## 3. Entity Models (C4 Code Level)

### 3.1 User Entity
**Role:** User entity model  
**Responsibilities:**
- Represent user data structure
- Enforce user data constraints
- Provide user data validation
- Map to MongoDB Users collection

**Fields:**
- `_id` - ObjectId (primary key)
- `username` - String (unique, required)
- `email` - String (unique, required)
- `passwordHash` - String (nullable for OAuth users)
- `googleId` - String (unique, nullable, sparse index)
- `provider` - String (enum: "local", "google")
- `providerId` - String (OAuth provider user ID)
- `firstName` - String (from OAuth providers)
- `lastName` - String (from OAuth providers)
- `pictureUrl` - String (profile picture from OAuth providers)
- `createdAt` - Date (required)
- `updatedAt` - Date (required)
- `lastLoginAt` - Date (optional)

**Indexes:**
- `username` - Unique index
- `email` - Unique index
- `googleId` - Unique sparse index (for OAuth users)
- `provider` - Ascending index
- `createdAt` - Ascending index
- Compound index: `{email: 1, provider: 1}` (for OAuth lookups)

**OAuth Support:**
- `passwordHash` is nullable for OAuth users (Google login)
- `googleId` stores Google user ID for OAuth authentication
- `provider` indicates authentication method ("local" or "google")
- `providerId` stores provider-specific user ID
- `firstName`, `lastName`, `pictureUrl` store user info from OAuth providers

**Dependencies:**
- MongoDB (persistence)
- Validation annotations

**Collaborations:**
- Used by UserRepository for data operations
- Used by AuthService for authentication

### 3.2 Profile Entity
**Role:** Profile entity model  
**Responsibilities:**
- Represent profile data structure
- Enforce profile data constraints
- Provide profile data validation
- Map to MongoDB Profiles collection

**Fields:**
- `_id` - ObjectId (primary key)
- `userId` - ObjectId (foreign key, unique, required)
- `displayName` - String (required)
- `avatar` - String (optional)
- `globalScore` - Number (default: 0)
- `rankTier` - String (required)
- `wins` - Number (default: 0)
- `losses` - Number (default: 0)
- `matchesPlayed` - Number (default: 0)
- `bio` - String (optional)
- `achievements` - Array (optional)
- `region` - String (required)
- `createdAt` - Date (required)
- `updatedAt` - Date (required)

**Indexes:**
- `userId` - Unique index
- `globalScore` - Descending index (for leaderboard)
- `rankTier` - Ascending index
- `region` - Ascending index
- `updatedAt` - Descending index

**Dependencies:**
- MongoDB (persistence)
- Validation annotations
- User entity (relationship)

**Collaborations:**
- Used by ProfileRepository for data operations
- Used by ProfileService for profile management

### 3.3 Match Entity
**Role:** Match entity model  
**Responsibilities:**
- Represent match data structure
- Enforce match data constraints
- Provide match data validation
- Map to MongoDB Matches collection

**Fields:**
- `_id` - ObjectId (primary key)
- `matchId` - String (unique, required)
- `player1Id` - ObjectId (foreign key, required)
- `player2Id` - ObjectId (foreign key, required)
- `player1Hero` - String (required)
- `player2Hero` - String (required)
- `player1Weapons` - Array (required)
- `player2Weapons` - Array (required)
- `arenaId` - String (required)
- `player1Score` - Number (default: 0)
- `player2Score` - Number (default: 0)
- `player1HP` - Number (required)
- `player2HP` - Number (required)
- `winnerId` - ObjectId (foreign key, optional)
- `isDraw` - Boolean (default: false)
- `startTime` - Date (required)
- `endTime` - Date (optional)
- `duration` - Number (optional)
- `replayData` - Object (optional)
- `createdAt` - Date (required)

**Indexes:**
- `matchId` - Unique index
- `player1Id` - Ascending index
- `player2Id` - Ascending index
- `winnerId` - Ascending index
- `player1Hero` - Ascending index
- `player2Hero` - Ascending index
- `arenaId` - Ascending index
- `startTime` - Descending index
- `createdAt` - Descending index

**Dependencies:**
- MongoDB (persistence)
- Validation annotations
- User entity (relationships)
- Hero entity (relationships)
- Weapon entity (relationships)
- Arena entity (relationships)

**Collaborations:**
- Used by MatchRepository for data operations
- Used by GameEngineService for match management

### 3.4 Leaderboard Entity
**Role:** Leaderboard entity model  
**Responsibilities:**
- Represent leaderboard data structure
- Enforce leaderboard data constraints
- Provide leaderboard data validation
- Map to MongoDB Leaderboard collection

**Fields:**
- `_id` - ObjectId (primary key)
- `userId` - ObjectId (foreign key, unique, required)
- `rank` - Number (required)
- `globalScore` - Number (required)
- `rankTier` - String (required)
- `winRate` - Number (required)
- `region` - String (required)
- `heroType` - String (optional)
- `weaponUsage` - Object (optional)
- `updatedAt` - Date (required)

**Indexes:**
- `userId` - Unique index
- `rank` - Ascending index
- `globalScore` - Descending index
- `rankTier` - Ascending index
- `region` - Ascending index
- `heroType` - Ascending index
- `winRate` - Descending index
- `updatedAt` - Descending index
- Compound index: `{region: 1, heroType: 1, globalScore: -1}`
- Compound index: `{rankTier: 1, globalScore: -1}`

**Dependencies:**
- MongoDB (persistence)
- Validation annotations
- User entity (relationship)

**Collaborations:**
- Used by LeaderboardRepository for data operations
- Used by LeaderboardService for leaderboard management

### 3.5 Hero Entity
**Role:** Hero entity model  
**Responsibilities:**
- Represent hero data structure
- Enforce hero data constraints
- Provide hero data validation
- Map to MongoDB Heroes collection

**Fields:**
- `_id` - ObjectId (primary key)
- `heroId` - String (unique, required)
- `heroType` - String (required)
- `name` - String (required)
- `size` - Object (required)
- `hitbox` - Object (required)
- `baseHP` - Number (required)
- `speed` - Number (required)
- `weapons` - Array (optional)
- `animations` - Object (optional)
- `characteristics` - Object (optional)
- `createdAt` - Date (required)
- `updatedAt` - Date (required)

**Indexes:**
- `heroId` - Unique index
- `heroType` - Ascending index
- `name` - Ascending index

**Dependencies:**
- MongoDB (persistence)
- Validation annotations

**Collaborations:**
- Used by HeroRepository for data operations
- Used by MatchmakingService for hero selection

### 3.6 Weapon Entity
**Role:** Weapon entity model  
**Responsibilities:**
- Represent weapon data structure
- Enforce weapon data constraints
- Provide weapon data validation
- Map to MongoDB Weapons collection

**Fields:**
- `_id` - ObjectId (primary key)
- `weaponId` - String (unique, required)
- `heroType` - String (required)
- `name` - String (required)
- `damage` - Number (required)
- `range` - Number (required)
- `trajectory` - Object (required)
- `weight` - Number (required)
- `physics` - Object (required)
- `animations` - Object (optional)
- `synergies` - Array (optional)
- `createdAt` - Date (required)
- `updatedAt` - Date (required)

**Indexes:**
- `weaponId` - Unique index
- `heroType` - Ascending index
- `name` - Ascending index

**Dependencies:**
- MongoDB (persistence)
- Validation annotations
- Hero entity (relationship)

**Collaborations:**
- Used by WeaponRepository for data operations
- Used by MatchmakingService for weapon selection

### 3.7 Arena Entity
**Role:** Arena entity model  
**Responsibilities:**
- Represent arena data structure
- Enforce arena data constraints
- Provide arena data validation
- Map to MongoDB Arenas collection

**Fields:**
- `_id` - ObjectId (primary key)
- `arenaId` - String (unique, required)
- `heroTypes` - Array (required)
- `name` - String (required)
- `terrain` - Object (required)
- `gravity` - Number (required)
- `previewImage` - String (optional)
- `boundaries` - Object (required)
- `createdAt` - Date (required)
- `updatedAt` - Date (required)

**Indexes:**
- `arenaId` - Unique index
- `heroTypes` - Ascending index
- `name` - Ascending index

**Dependencies:**
- MongoDB (persistence)
- Validation annotations

**Collaborations:**
- Used by ArenaRepository for data operations
- Used by MatchmakingService for arena selection

---

## 4. Repository Pattern Design

### 4.1 Repository Interface
**Role:** Data access abstraction  
**Responsibilities:**
- Define data access interface
- Abstract database operations
- Provide CRUD operations
- Support query operations

**Dependencies:**
- Entity models
- Query builder

**Collaborations:**
- Implemented by MongoRepository
- Used by services for data access

### 4.2 MongoRepository Implementation
**Role:** MongoDB repository implementation  
**Responsibilities:**
- Implement repository interface
- Execute MongoDB operations
- Handle database connections
- Manage transactions
- Optimize queries

**Dependencies:**
- MongoDB database
- Entity models
- Query builder

**Collaborations:**
- Implements Repository interface
- Used by services for data access
- Uses MongoDB for persistence

### 4.3 Design Pattern Applications

#### Repository Pattern
**Pattern:** Repository Pattern  
**Intent:** Mediate between domain and data mapping layers  
**Participants:**
- **Repository:** Repository interface
- **ConcreteRepository:** MongoRepository
- **Entity:** Entity models

**Why:** Abstracts data access and provides testability  
**Consequences:**
- ✅ Decouples business logic from data access
- ✅ Easier testing with mock repositories
- ✅ Centralized data access logic
- ✅ Flexible data source switching

---

## 5. DAO Pattern Design

### 5.1 DAO Interface
**Role:** Data access object abstraction  
**Responsibilities:**
- Define data access object interface
- Abstract complex data operations
- Provide data transformation
- Support batch operations

**Dependencies:**
- Repository interface
- Entity models

**Collaborations:**
- Implemented by MongoDAO
- Used by services for complex data operations

### 5.2 MongoDAO Implementation
**Role:** MongoDB DAO implementation  
**Responsibilities:**
- Implement DAO interface
- Execute complex data operations
- Transform data between layers
- Handle batch operations
- Optimize data access

**Dependencies:**
- MongoRepository
- Entity models
- Query builder

**Collaborations:**
- Implements DAO interface
- Used by services for complex data operations
- Uses MongoRepository for data access

### 5.3 Design Pattern Applications

#### DAO Pattern
**Pattern:** DAO Pattern  
**Intent:** Separate data access logic from business logic  
**Participants:**
- **DAO:** DAO interface
- **ConcreteDAO:** MongoDAO
- **Repository:** Repository interface

**Why:** Separates data access logic from business logic  
**Consequences:**
- ✅ Separation of concerns
- ✅ Easier testing
- ✅ Flexible data access
- ✅ Centralized data access logic

---

## 6. Schema Validation Patterns

### 6.1 Schema Validator
**Role:** Schema validation orchestrator  
**Responsibilities:**
- Validate entity data
- Apply validation strategies
- Enforce validation rules
- Provide validation results

**Dependencies:**
- ValidationStrategy (validation algorithm)
- ValidationRules (validation rules)

**Collaborations:**
- Used by repositories for data validation
- Uses ValidationStrategy for validation algorithms

### 6.2 Validation Strategy
**Role:** Validation algorithm abstraction  
**Responsibilities:**
- Define validation algorithm interface
- Allow different validation strategies
- Provide flexibility in validation algorithms

**Implementations:**
- FieldValidationStrategy (field-level validation)
- EntityValidationStrategy (entity-level validation)
- RelationshipValidationStrategy (relationship validation)

**Collaborations:**
- Used by SchemaValidator for validation algorithms

### 6.3 Design Pattern Applications

#### Strategy Pattern - ValidationStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** ValidationStrategy (interface)
- **ConcreteStrategy:** FieldValidationStrategy, EntityValidationStrategy, RelationshipValidationStrategy
- **Context:** SchemaValidator

**Why:** Allows different validation strategies without changing SchemaValidator  
**Consequences:**
- ✅ Flexibility in validation algorithms
- ✅ Easy to add new validation strategies
- ❌ Increased number of classes

---

## 7. Database Migration Patterns

### 7.1 Migration Manager
**Role:** Migration management orchestrator  
**Responsibilities:**
- Manage database migrations
- Execute migration scripts
- Track migration history
- Rollback migrations

**Dependencies:**
- MigrationTemplate (migration template)
- MigrationStrategy (migration strategy)

**Collaborations:**
- Used by services for database migrations
- Uses MigrationTemplate for migration structure

### 7.2 Migration Template
**Role:** Migration template  
**Responsibilities:**
- Define migration structure
- Provide migration lifecycle
- Manage migration steps
- Handle migration errors

**Dependencies:**
- Migration scripts
- Database connection

**Collaborations:**
- Used by MigrationManager for migration execution

### 7.3 Design Pattern Applications

#### Template Method Pattern - MigrationTemplate
**Pattern:** Template Method Pattern  
**Intent:** Define the skeleton of an algorithm in an operation, deferring some steps to subclasses  
**Participants:**
- **AbstractClass:** MigrationTemplate
- **ConcreteClass:** MongoMigrationTemplate

**Why:** Defines the algorithm skeleton for database migrations  
**Consequences:**
- ✅ Code reuse
- ✅ Consistent migration structure
- ✅ Easy to extend migration algorithm
- ❌ May limit flexibility

---

## 8. Query Patterns

### 8.1 Query Builder
**Role:** Query construction orchestrator  
**Responsibilities:**
- Build MongoDB queries
- Apply query strategies
- Optimize query construction
- Provide query results

**Dependencies:**
- QueryStrategy (query algorithm)
- MongoDB query API

**Collaborations:**
- Used by repositories for query construction
- Uses QueryStrategy for query algorithms

### 8.2 Query Strategy
**Role:** Query algorithm abstraction  
**Responsibilities:**
- Define query algorithm interface
- Allow different query strategies
- Provide flexibility in query algorithms

**Implementations:**
- SimpleQueryStrategy (simple queries)
- ComplexQueryStrategy (complex queries)
- AggregationQueryStrategy (aggregation queries)

**Collaborations:**
- Used by QueryBuilder for query algorithms

### 8.3 Design Pattern Applications

#### Builder Pattern - QueryBuilder
**Pattern:** Builder Pattern  
**Intent:** Separate the construction of a complex object from its representation  
**Participants:**
- **Builder:** QueryBuilder
- **Product:** MongoDB Query

**Why:** Provides flexible query construction  
**Consequences:**
- ✅ Flexible object construction
- ✅ Easy to add new construction steps
- ✅ Reduces constructor parameters
- ❌ Increased complexity

#### Strategy Pattern - QueryStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** QueryStrategy (interface)
- **ConcreteStrategy:** SimpleQueryStrategy, ComplexQueryStrategy, AggregationQueryStrategy
- **Context:** QueryBuilder

**Why:** Allows different query strategies without changing QueryBuilder  
**Consequences:**
- ✅ Flexibility in query algorithms
- ✅ Easy to add new query strategies
- ❌ Increased number of classes

---

## 9. Index Management Patterns

### 9.1 Index Manager
**Role:** Index management orchestrator  
**Responsibilities:**
- Manage database indexes
- Create indexes
- Drop indexes
- Optimize indexes

**Dependencies:**
- IndexFactory (index factory)
- MongoDB index API

**Collaborations:**
- Used by repositories for index management
- Uses IndexFactory for index creation

### 9.2 Index Factory
**Role:** Index factory  
**Responsibilities:**
- Create indexes
- Provide index configurations
- Manage index definitions
- Optimize index creation

**Dependencies:**
- Index configurations
- MongoDB index API

**Collaborations:**
- Used by IndexManager for index creation

### 9.3 Design Pattern Applications

#### Factory Pattern - IndexFactory
**Pattern:** Factory Pattern  
**Intent:** Define an interface for creating an object, but let subclasses decide which class to instantiate  
**Participants:**
- **Factory:** IndexFactory
- **Product:** Index

**Why:** Encapsulates index creation logic  
**Consequences:**
- ✅ Encapsulates object creation
- ✅ Provides flexibility in object creation
- ✅ Reduces coupling
- ❌ Increased number of classes

---

## 10. Method Signatures (Not Implementations)

### 10.1 Repository Interface
```java
// Responsibilities: Define data access interface
public interface Repository<T, ID> {
    // Save entity
    T save(T entity);
    
    // Find entity by ID
    Optional<T> findById(ID id);
    
    // Find all entities
    List<T> findAll();
    
    // Delete entity by ID
    void deleteById(ID id);
    
    // Delete entity
    void delete(T entity);
    
    // Check if entity exists
    boolean existsById(ID id);
    
    // Count entities
    long count();
}
```

### 10.2 MongoRepository Implementation
```java
// Responsibilities: Implement MongoDB repository
public class MongoRepository<T, ID> implements Repository<T, ID> {
    // Save entity
    T save(T entity);
    
    // Find entity by ID
    Optional<T> findById(ID id);
    
    // Find all entities
    List<T> findAll();
    
    // Delete entity by ID
    void deleteById(ID id);
    
    // Delete entity
    void delete(T entity);
    
    // Check if entity exists
    boolean existsById(ID id);
    
    // Count entities
    long count();
    
    // Find entities by query
    List<T> findByQuery(Query query);
    
    // Update entity
    T update(T entity);
}
```

### 10.3 DAO Interface
```java
// Responsibilities: Define data access object interface
public interface DAO<T, ID> {
    // Save entity
    T save(T entity);
    
    // Find entity by ID
    Optional<T> findById(ID id);
    
    // Find all entities
    List<T> findAll();
    
    // Delete entity by ID
    void deleteById(ID id);
    
    // Batch save entities
    List<T> saveAll(List<T> entities);
    
    // Batch delete entities
    void deleteAll(List<T> entities);
}
```

### 10.4 Schema Validator
```java
// Responsibilities: Validate entity data
public class SchemaValidator {
    // Validate entity
    ValidationResult validate(T entity);
    
    // Validate field
    ValidationResult validateField(String fieldName, Object value);
    
    // Validate relationship
    ValidationResult validateRelationship(String relationshipName, Object value);
}
```

### 10.5 Migration Manager
```java
// Responsibilities: Manage database migrations
public class MigrationManager {
    // Execute migration
    void executeMigration(String migrationScript);
    
    // Rollback migration
    void rollbackMigration(String migrationId);
    
    // Get migration history
    List<Migration> getMigrationHistory();
    
    // Check if migration is applied
    boolean isMigrationApplied(String migrationId);
}
```

### 10.6 Query Builder
```java
// Responsibilities: Build MongoDB queries
public class QueryBuilder {
    // Build query
    Query buildQuery(QueryCriteria criteria);
    
    // Build aggregation query
    AggregationPipeline buildAggregationQuery(AggregationCriteria criteria);
    
    // Build update query
    UpdateQuery buildUpdateQuery(UpdateCriteria criteria);
}
```

### 10.7 Index Manager
```java
// Responsibilities: Manage database indexes
public class IndexManager {
    // Create index
    void createIndex(String collectionName, IndexDefinition indexDefinition);
    
    // Drop index
    void dropIndex(String collectionName, String indexName);
    
    // Get indexes
    List<Index> getIndexes(String collectionName);
    
    // Optimize indexes
    void optimizeIndexes(String collectionName);
}
```

---

## 11. Entity Relationships

### 11.1 User-Profile Relationship
**Type:** One-to-One  
**Users Collection:** `_id` → Profiles Collection: `userId`  
**Cascade:** Delete profile when user is deleted

### 11.2 User-Match Relationship
**Type:** One-to-Many  
**Users Collection:** `_id` → Matches Collection: `player1Id` or `player2Id`  
**Cascade:** Keep matches when user is deleted (for history)

### 11.3 User-Leaderboard Relationship
**Type:** One-to-One  
**Users Collection:** `_id` → Leaderboard Collection: `userId`  
**Cascade:** Delete leaderboard entry when user is deleted

### 11.4 Hero-Weapon Relationship
**Type:** One-to-Many  
**Heroes Collection:** `_id` → Weapons Collection: `heroType`  
**Cascade:** Keep weapons when hero is deleted (for history)

### 11.5 Hero-Arena Relationship
**Type:** Many-to-Many  
**Heroes Collection:** `heroType` → Arenas Collection: `heroTypes`  
**Cascade:** Keep arenas when hero is deleted (for history)

### 11.6 Match-Hero Relationship
**Type:** Many-to-One  
**Matches Collection:** `player1Hero`, `player2Hero` → Heroes Collection: `heroType`  
**Cascade:** Keep matches when hero is deleted (for history)

### 11.7 Match-Weapon Relationship
**Type:** Many-to-Many  
**Matches Collection:** `player1Weapons`, `player2Weapons` → Weapons Collection: `weaponId`  
**Cascade:** Keep matches when weapon is deleted (for history)

### 11.8 Match-Arena Relationship
**Type:** Many-to-One  
**Matches Collection:** `arenaId` → Arenas Collection: `arenaId`  
**Cascade:** Keep matches when arena is deleted (for history)

---

## 12. ER Diagram

**See:** [Database ER Diagram](../../../03-DIAGRAMS/er-diagrams/database-er-diagram.puml)

### 12.1 Entity Relationships Diagram
```
Users (1) ──< (0..*) Matches
Users (1) ──< (1) Profiles
Users (1) ──< (1) Leaderboard

Heroes (1) ──< (0..*) Weapons
Heroes (*) ──< (*) Arenas
Heroes (1) ──< (0..*) Matches

Weapons (*) ──< (*) Matches
Arenas (1) ──< (0..*) Matches
```

---

## 13. Redis Data Structures

### 13.1 Matchmaking Queue
**Type:** Sorted Set  
**Key:** `matchmaking:queue:{heroType}`  
**Score:** Player global score/rank  
**Value:** Player ID + Socket ID + Hero selection

### 13.2 Lobby Storage
**Type:** Hash  
**Key:** `lobby:{matchId}`  
**Fields:** player1Id, player2Id, player1Heroes, player2Heroes, assignedHero, status, createdAt, timeout

### 13.3 Arena Selection Storage
**Type:** Hash  
**Key:** `arena-selection:{matchId}`  
**Fields:** availableArenas, eliminatedArenas, selectedArena, player1Eliminations, player2Eliminations, status

### 13.4 Weapon Selection Storage
**Type:** Hash  
**Key:** `weapon-selection:{matchId}`  
**Fields:** player1Weapons, player2Weapons, currentPlayer, selectionTimer, status

### 13.5 Game State Cache
**Type:** Hash  
**Key:** `game:{matchId}`  
**Fields:** state, player1Id, player2Id, player1Hero, player2Hero, player1Health, player2Health, player1Score, player2Score, player1Moves, player2Moves, player1Weapons, player2Weapons, arenaId, currentTurn, turnNumber, matchTimer, turnTimer

### 13.6 Configuration Cache
**Type:** String  
**Key:** `config:heroes`, `config:weapons`, `config:arenas`, `config:rank-tiers`, `config:scoring`, `config:penalties`  
**Value:** Configuration data (JSON)

### 13.7 User Session Cache
**Type:** String  
**Key:** `session:{userId}`  
**Value:** Session data (JSON)

---

## 14. Class Relationships

### 14.1 Inheritance
- **MongoRepository** implements **Repository**
- **MongoDAO** implements **DAO**
- **FieldValidationStrategy**, **EntityValidationStrategy**, **RelationshipValidationStrategy** implement **ValidationStrategy**
- **SimpleQueryStrategy**, **ComplexQueryStrategy**, **AggregationQueryStrategy** implement **QueryStrategy**

### 14.2 Composition
- **MongoRepository** contains **MongoDatabase**, **EntityModel**, **QueryBuilder**
- **MongoDAO** contains **MongoRepository**, **EntityModel**
- **SchemaValidator** contains **ValidationStrategy**, **ValidationRules**
- **MigrationManager** contains **MigrationTemplate**, **MigrationStrategy**
- **QueryBuilder** contains **QueryStrategy**
- **IndexManager** contains **IndexFactory**

### 14.3 Aggregation
- **Repository** aggregates **Entity** entities
- **DAO** aggregates **Entity** entities

### 14.4 Dependency
- **Repository** depends on **Entity** models
- **MongoRepository** depends on **MongoDatabase**, **EntityModel**, **QueryBuilder**
- **MongoDAO** depends on **MongoRepository**, **EntityModel**
- **SchemaValidator** depends on **ValidationStrategy**, **ValidationRules**
- **MigrationManager** depends on **MigrationTemplate**, **MigrationStrategy**
- **QueryBuilder** depends on **QueryStrategy**
- **IndexManager** depends on **IndexFactory**

---

## 15. Sequence Diagrams

**See:** [Database Access Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/database-access-flow.puml)

### 15.1 Database Access Flow
```
Service → Repository → MongoRepository → MongoDB
                              ↓
                        QueryBuilder
                              ↓
                        MongoDB Query
                              ↓
                        MongoRepository → Service
```

### 15.2 Migration Flow
```
MigrationManager → MigrationTemplate → MongoDB
                                    ↓
                              Migration Script
                                    ↓
                              MongoDB → MigrationManager
```

---

## 16. Related Documentation

- [High-Level Design - Database Design](../HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Database schema and design
- [Auth Service](./SERVICES/AUTH_SERVICE.md) - Auth service design
- [Profile Service](./SERVICES/PROFILE_SERVICE.md) - Profile service design
- [Leaderboard Service](./SERVICES/LEADERBOARD_SERVICE.md) - Leaderboard service design
- [Matchmaking Service](./SERVICES/MATCHMAKING_SERVICE.md) - Matchmaking service design
- [Game Engine Service](./SERVICES/GAME_ENGINE_SERVICE.md) - Game engine service design
- [Error Handling](./COMMON/ERROR_HANDLING.md) - Error handling patterns
- [Testing Strategy](./COMMON/TESTING_STRATEGY.md) - Testing approach
- [ER Diagram](../../../03-DIAGRAMS/er-diagrams/database-er-diagram.puml) - Entity-relationship diagram
- [Class Diagram](../../../03-DIAGRAMS/class-diagrams/database-schema.puml) - UML class diagram

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** System Architecture Team
- **Reviewer:** Technical Lead
- **Status:** Design-Focused (Complete)
- **Next Review Date:** After implementation phase

---

**⚠️ REMINDER: This is DESIGN, not IMPLEMENTATION - Focus on Roles, Responsibilities, Relationships, and Patterns**

