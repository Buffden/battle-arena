# Auth Service

**Technology:** Spring Boot (Java)  
**Port:** 8081  
**Status:** 🚧 Ready for Implementation

## Overview

Authentication and authorization service for Battle Arena. Handles user registration, authentication, JWT token generation and validation.

## Responsibilities

- User registration and authentication
- JWT token generation and validation
- Password hashing and security
- Session management

## Design Documentation

See: [Auth Service LLD](../../docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md)

## Implementation Guidelines

1. Follow the LLD documentation for class structure and design patterns
2. Implement classes according to the UML class diagram
3. Apply design patterns: Facade, Strategy, Repository, Singleton
4. Follow clean architecture principles
5. Ensure security best practices

## Structure

```
auth-service/
├── src/main/java/com/battlearena/auth/
│   ├── controller/     # REST controllers (Facade Pattern)
│   ├── service/        # Business logic (Strategy Pattern)
│   ├── repository/     # Data access layer (Repository Pattern)
│   ├── model/          # Entity models
│   ├── dto/            # Data transfer objects
│   ├── security/       # Security configuration
│   ├── config/         # Configuration classes
│   └── exception/      # Exception handlers
└── src/main/resources/
    └── application.properties
```

## Dependencies

### Required Dependencies (to be added during implementation)
- `spring-boot-starter-security` - Authentication and authorization
- `spring-boot-starter-data-mongodb` - MongoDB data access
- `spring-boot-starter-validation` - Input validation
- JWT libraries (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) - JWT token generation/validation
- `lombok` (optional) - Reducing boilerplate code

## Getting Started

1. Review the LLD documentation
2. Add required dependencies to `pom.xml`
3. Configure `application.properties`
4. Implement classes according to the design
5. Write unit tests
6. Run the service on port 8081

