# Testing Framework Setup

This document describes the testing framework configuration for all services in the Battle Arena project.

## Overview

The project uses different testing frameworks for different service types:
- **Java Services**: JUnit 5 with Spring Boot Test
- **Node.js Services**: Jest with Supertest
- **Angular Frontend**: Jasmine with Karma

## Java Services (Spring Boot)

### Framework
- **JUnit 5**: Unit and integration testing
- **Spring Boot Test**: Integration testing with Spring context
- **Mockito**: Mocking (included in spring-boot-starter-test)

### Dependencies
All Java services include `spring-boot-starter-test` which provides:
- JUnit 5 (junit-jupiter)
- Mockito
- AssertJ
- Hamcrest
- Spring Test & Spring Boot Test

### Test Directory Structure
```
src/test/java/com/battlearena/{service}/
  ├── unit/              # Unit tests
  │   └── *Tests.java
  └── integration/       # Integration tests
      └── *IntegrationTests.java
```

### Services
- `auth-service`
- `profile-service`
- `leaderboard-service`

### Running Tests
```bash
# From service directory
mvn test                    # Run all tests
mvn test -Dtest=*UnitTest   # Run unit tests only
mvn test -Dtest=*IntegrationTest  # Run integration tests only
```

## Node.js Services

### Framework
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library for API testing

### Configuration
Each Node.js service has a `jest.config.js` file with:
- Test environment: `node`
- Coverage configuration
- Test file patterns: `**/__tests__/**/*.js`, `**/?(*.)+(spec|test).js`

### Test Directory Structure
```
src/
  ├── __tests__/         # Test files
  │   └── *.test.js
  └── __mocks__/         # Mock files (optional)
      └── *.js
```

### Services
- `matchmaking-service`
- `game-engine`

### Running Tests
```bash
# From service directory
npm test                  # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
```

## Angular Frontend

### Framework
- **Jasmine**: Testing framework
- **Karma**: Test runner
- **Angular Testing Utilities**: Component testing utilities

### Configuration
- `karma.conf.js`: Karma configuration with ChromeHeadlessCI for CI/CD
- Coverage configured with 80% thresholds
- LCOV reports for SonarCloud integration

### Test Directory Structure
```
src/app/
  └── *.spec.ts          # Component/service tests
```

### Running Tests
```bash
# From frontend-service directory
npm test                  # Run tests in watch mode
npm run test:ci          # Run tests once (CI mode)
npm run test:coverage    # Run tests with coverage
```

## Test Coverage

### Coverage Targets
- **Java Services**: 80%+ line coverage (JaCoCo)
- **Node.js Services**: 80%+ coverage (Jest/Istanbul)
- **Frontend**: 80%+ coverage (Karma)

### Coverage Reports
- **Java**: `target/site/jacoco/jacoco.xml` (JaCoCo XML format)
- **Node.js/Frontend**: `coverage/lcov.info` (LCOV format)

### Coverage Integration
- Coverage reports are generated in CI/CD
- Reports are uploaded to SonarCloud for analysis
- Coverage thresholds are enforced in CI/CD pipelines

## Best Practices

### Unit Tests
- Test individual components in isolation
- Use mocks for external dependencies
- Keep tests fast and independent
- Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests
- Test component interactions
- Use real dependencies where possible
- Test database interactions
- Test API endpoints

### Test Naming
- **Java**: `*Tests.java` for unit tests, `*IntegrationTests.java` for integration tests
- **Node.js**: `*.test.js` or `*.spec.js`
- **Angular**: `*.spec.ts`

## Related Documentation

- [Testing Strategy](../../docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md)
- [CI/CD Workflows](../../.github/workflows/README.md)
- [SonarCloud Integration](../../.github/workflows/sonarcloud.yml)

