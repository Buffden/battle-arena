# Profile Service

**Technology:** Spring Boot (Java)  
**Port:** 8082  
**Status:** 🚧 Ready for Implementation

## Overview

User profile management service. Handles user profile data, global score tracking, and rank tier calculation.

## Responsibilities

- User profile management
- Global score tracking and update (not per-hero, score can be infinite, no level cap)
- Rank tier calculation (like Valorant, based on score ranges)
- Player statistics
- Avatar management
- Rank change calculation (based on match score, formula to be determined)

## Design Documentation

See: [Profile Service LLD](../../docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md)

## Implementation Guidelines

1. Follow the LLD documentation for class structure and design patterns
2. Implement classes according to the UML class diagram
3. Apply design patterns specified in the LLD
4. Follow clean architecture principles
5. Ensure security best practices

## Structure

```
profile-service/
├── src/main/java/com/battlearena/profile/
│   ├── controller/     # REST controllers
│   ├── service/        # Business logic
│   ├── repository/     # Data access layer
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
- JWT libraries (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) - JWT token validation
- Redis client (e.g., `spring-boot-starter-data-redis`) - Caching
- `lombok` (optional) - Reducing boilerplate code

## Getting Started

1. Review the LLD documentation
2. Add required dependencies to `pom.xml`
3. Configure `application.properties`
4. Implement classes according to the design
5. Write unit tests
6. Run the service on port 8082

