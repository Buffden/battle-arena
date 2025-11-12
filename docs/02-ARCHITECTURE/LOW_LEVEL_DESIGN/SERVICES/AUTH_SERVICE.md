# Auth Service - Low-Level Design (LLD)

**Part of:** [Low-Level Design (LLD)](../README.md)  
**Service:** Auth Service (Spring Boot)  
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
- User registration and authentication
- JWT token generation and validation
- Password hashing and security
- Session management

### 1.2 Key Components
- **AuthController** - REST API endpoint handler (Facade Pattern)
- **AuthService** - Business logic for authentication (Strategy Pattern)
- **UserRepository** - Data access layer (Repository Pattern)
- **JwtTokenManager** - JWT token management (Singleton Pattern)
- **PasswordEncoder** - Password hashing (Strategy Pattern)

### 1.3 Design Patterns Applied
- **Facade Pattern** - AuthController provides simplified interface
- **Strategy Pattern** - Authentication strategies, password encoding strategies
- **Repository Pattern** - UserRepository abstracts data access
- **Singleton Pattern** - JwtTokenManager single instance
- **Factory Pattern** - User entity creation (optional)

---

## 2. UML Class Diagram

**See:** [Auth Service Class Diagram](../../../03-DIAGRAMS/class-diagrams/auth-service.puml)

### 2.1 Class Relationships

```
AuthController
    ├── depends on → AuthService
    └── depends on → JwtTokenManager

AuthService
    ├── depends on → UserRepository
    ├── depends on → PasswordEncoder
    ├── depends on → JwtTokenManager
    └── depends on → AuthenticationStrategy

UserRepository
    └── implements → MongoRepository<User, String>

JwtTokenManager
    └── uses → JWT library

PasswordEncoder
    └── uses → BCrypt library

User
    └── entity → MongoDB document
```

---

## 3. Class Responsibilities (C4 Code Level)

### 3.1 AuthController
**Role:** Facade for authentication operations  
**Responsibilities:**
- Handle HTTP requests for authentication
- Validate request data
- Delegate business logic to AuthService
- Format HTTP responses
- Handle exceptions and errors

**Dependencies:**
- AuthService (business logic)
- JwtTokenManager (token validation)

**Collaborations:**
- Receives requests from clients
- Delegates to AuthService
- Returns responses to clients

### 3.2 AuthService
**Role:** Business logic orchestrator  
**Responsibilities:**
- Coordinate authentication operations
- Validate user credentials
- Generate JWT tokens
- Manage user registration
- Enforce business rules

**Dependencies:**
- UserRepository (data access)
- PasswordEncoder (password hashing)
- JwtTokenManager (token generation)
- AuthenticationStrategy (authentication algorithm)

**Collaborations:**
- Uses UserRepository to access user data
- Uses PasswordEncoder to hash/verify passwords
- Uses JwtTokenManager to generate tokens
- Uses AuthenticationStrategy for authentication logic

### 3.3 UserRepository
**Role:** Data access abstraction  
**Responsibilities:**
- Abstract database operations
- Provide CRUD operations for User entity
- Handle data persistence
- Manage database connections

**Dependencies:**
- MongoDB (database)
- User entity (data model)

**Collaborations:**
- Used by AuthService to access user data
- Interacts with MongoDB database

### 3.4 JwtTokenManager
**Role:** JWT token management  
**Responsibilities:**
- Generate JWT tokens
- Validate JWT tokens
- Extract token claims
- Manage token expiration

**Dependencies:**
- JWT library (token operations)
- Configuration (secret key, expiration)

**Collaborations:**
- Used by AuthService to generate tokens
- Used by AuthController to validate tokens

### 3.5 PasswordEncoder
**Role:** Password security  
**Responsibilities:**
- Hash passwords
- Verify password hashes
- Manage password security

**Dependencies:**
- BCrypt library (hashing algorithm)
- Configuration (hashing rounds)

**Collaborations:**
- Used by AuthService to hash/verify passwords

### 3.6 User
**Role:** User entity  
**Responsibilities:**
- Represent user data
- Provide data structure
- Enforce data constraints

**Dependencies:**
- MongoDB (persistence)
- Validation annotations

**Collaborations:**
- Used by UserRepository for data operations
- Used by AuthService for business logic

---

## 4. Design Pattern Applications

### 4.1 Facade Pattern - AuthController
**Pattern:** Facade Pattern  
**Intent:** Provide a unified interface to a set of interfaces in a subsystem  
**Participants:**
- **Facade:** AuthController
- **Subsystem Classes:** AuthService, JwtTokenManager

**Why:** Simplifies client interaction with authentication subsystem  
**Consequences:**
- ✅ Simplifies client interface
- ✅ Decouples clients from subsystem
- ❌ May reduce flexibility

### 4.2 Strategy Pattern - AuthenticationStrategy
**Pattern:** Strategy Pattern  
**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable  
**Participants:**
- **Strategy:** AuthenticationStrategy (interface)
- **ConcreteStrategy:** DefaultAuthenticationStrategy, OAuthAuthenticationStrategy (future)
- **Context:** AuthService

**Why:** Allows different authentication methods without changing AuthService  
**Consequences:**
- ✅ Flexibility in authentication methods
- ✅ Easy to add new authentication strategies
- ❌ Increased number of classes

### 4.3 Repository Pattern - UserRepository
**Pattern:** Repository Pattern  
**Intent:** Mediate between domain and data mapping layers  
**Participants:**
- **Repository:** UserRepository (interface)
- **ConcreteRepository:** MongoUserRepository (Spring Data MongoDB)
- **Entity:** User

**Why:** Abstracts data access and provides testability  
**Consequences:**
- ✅ Decouples business logic from data access
- ✅ Easier testing with mock repositories
- ✅ Centralized data access logic

### 4.4 Singleton Pattern - JwtTokenManager
**Pattern:** Singleton Pattern  
**Intent:** Ensure a class has only one instance and provide global access  
**Participants:**
- **Singleton:** JwtTokenManager

**Why:** Single instance manages JWT configuration and operations  
**Consequences:**
- ✅ Controlled access to single instance
- ✅ Reduced memory footprint
- ❌ Global state (potential testing issues)

---

## 5. Method Signatures (Not Implementations)

### 5.1 AuthController
```java
// Responsibilities: Handle HTTP requests for authentication
public class AuthController {
    // Register a new user
    ResponseEntity<AuthResponse> register(RegisterRequest request);
    
    // Authenticate user and return JWT token
    ResponseEntity<AuthResponse> login(LoginRequest request);
    
    // Validate JWT token
    ResponseEntity<TokenValidationResponse> validateToken(TokenRequest request);
    
    // Logout user (future enhancement)
    ResponseEntity<LogoutResponse> logout(LogoutRequest request);
}
```

### 5.2 AuthService
```java
// Responsibilities: Coordinate authentication operations
public class AuthService {
    // Register a new user
    AuthResponse register(RegisterRequest request) throws UserAlreadyExistsException;
    
    // Authenticate user and generate JWT token
    AuthResponse login(LoginRequest request) throws InvalidCredentialsException;
    
    // Validate JWT token
    TokenValidationResponse validateToken(String token) throws InvalidTokenException;
}
```

### 5.3 UserRepository
```java
// Responsibilities: Abstract database operations for User entity
public interface UserRepository extends MongoRepository<User, String> {
    // Find user by username
    Optional<User> findByUsername(String username);
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Check if user exists by username
    boolean existsByUsername(String username);
    
    // Check if user exists by email
    boolean existsByEmail(String email);
}
```

### 5.4 JwtTokenManager
```java
// Responsibilities: Manage JWT token generation and validation
public class JwtTokenManager {
    // Generate JWT token for user
    String generateToken(User user);
    
    // Validate JWT token
    Claims validateToken(String token) throws JwtException;
    
    // Extract username from token
    String extractUsername(String token);
    
    // Check if token is expired
    boolean isTokenExpired(String token);
}
```

### 5.5 PasswordEncoder
```java
// Responsibilities: Hash and verify passwords
public class PasswordEncoder {
    // Hash password
    String encode(String password);
    
    // Verify password
    boolean matches(String password, String hashedPassword);
}
```

---

## 6. Class Relationships

### 6.1 Inheritance
- None (uses composition and dependency injection)

### 6.2 Composition
- **AuthController** contains **AuthService** and **JwtTokenManager**
- **AuthService** contains **UserRepository**, **PasswordEncoder**, **JwtTokenManager**, **AuthenticationStrategy**

### 6.3 Aggregation
- **UserRepository** aggregates **User** entities

### 6.4 Dependency
- **AuthController** depends on **AuthService** and **JwtTokenManager**
- **AuthService** depends on **UserRepository**, **PasswordEncoder**, **JwtTokenManager**, **AuthenticationStrategy**
- **UserRepository** depends on **User** entity and **MongoDB**

---

## 7. Sequence Diagrams

**See:** [Authentication Flow Sequence Diagram](../../../03-DIAGRAMS/sequence-diagrams/authentication-flow.puml)

### 7.1 User Registration Flow
```
Client → AuthController → AuthService → UserRepository → MongoDB
                          ↓
                    PasswordEncoder
                          ↓
                    JwtTokenManager
                          ↓
                    AuthController → Client
```

### 7.2 User Login Flow
```
Client → AuthController → AuthService → UserRepository → MongoDB
                          ↓
                    PasswordEncoder (verify)
                          ↓
                    JwtTokenManager (generate)
                          ↓
                    AuthController → Client
```

---

## 8. Related Documentation

- [High-Level Design - Component Design](../../HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) - Component specifications
- [High-Level Design - Security Architecture](../../HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Security design
- [High-Level Design - Database Design](../../HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - Database schema
- [Error Handling](../COMMON/ERROR_HANDLING.md) - Error handling patterns
- [Testing Strategy](../COMMON/TESTING_STRATEGY.md) - Testing approach
- [Class Diagram](../../../03-DIAGRAMS/class-diagrams/auth-service.puml) - UML class diagram

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** System Architecture Team
- **Reviewer:** Technical Lead
- **Status:** Design-Focused (Corrected)
- **Next Review Date:** After implementation phase

---

**⚠️ REMINDER: This is DESIGN, not IMPLEMENTATION - Focus on Roles, Responsibilities, Relationships, and Patterns**

