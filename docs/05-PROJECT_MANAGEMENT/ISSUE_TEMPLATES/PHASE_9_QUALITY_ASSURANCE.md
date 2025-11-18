# Phase 9: Quality Assurance & Testing

**⚠️ NOTE: This is REFERENCE DOCUMENTATION for Quality Assurance & Testing technical details.**

**For implementation planning, see:**

- All epics include testing tasks and may reference QA strategies from this file

**This phase file contains:**

- Testing strategies (unit, integration, E2E)
- Quality assurance processes
- Test coverage requirements
- Performance testing guidelines
- Security testing approaches
- Technical implementation details
- Stories and tasks for Quality Assurance & Testing

**Epics will reference this file for technical specs, but implementation follows epic-based feature development (game studio approach).**

---

**Copy and paste these templates directly into GitHub Issues.**

---

## PHASE-9: Quality Assurance & Testing - Technical Reference

### Issue Template:

```
Title: PHASE-9: Quality Assurance & Testing

Description:
## Overview
Ensure the project meets quality standards via comprehensive API documentation, high test coverage, and end-to-end testing. This phase document provides technical reference for Swagger/OpenAPI docs, unit/integration tests, and end-to-end testing flows.

## Goals
- Complete API documentation for all backend services
- Achieve 80%+ code coverage with unit tests
- Implement integration and end-to-end tests for core flows
- Consolidate developer and user documentation

## Success Criteria
- [ ] Swagger/OpenAPI docs generated and accessible for all services
- [ ] 80%+ unit test coverage across services
- [ ] Key flows covered by integration and E2E tests
- [ ] Documentation updated and consistent with implementation

## Related Documentation
- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md)
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md)

## Labels
phase:quality, documentation, testing, priority:medium

## Milestone
Phase 9: Quality Assurance
```

---

### STORY-9-1: API Documentation

#### Issue Template:

```
Title: STORY-9-1: Create API documentation with Swagger/OpenAPI

Description:
## Epic
Related to #X (PHASE-9 issue number)

## User Story
As a developer, I want comprehensive API documentation for all services so that I can understand and integrate with the APIs easily.

## Description
Create comprehensive API documentation for all backend services using Swagger/OpenAPI, including endpoints, request/response schemas, authentication flows, error responses, and interactive API exploration. The documentation must be automatically generated from code annotations, accessible via Swagger UI, and include detailed descriptions, examples, and validation rules. The implementation must cover all Spring Boot services (Auth, Profile, Leaderboard) and Node.js services (Matchmaking, Game Engine), with consistent documentation standards across all services.

## Acceptance Criteria
- [ ] Swagger/OpenAPI setup for Spring Boot services (Auth, Profile, Leaderboard)
- [ ] OpenAPI documentation for Node.js services (Matchmaking, Game Engine)
- [ ] All REST API endpoints documented with descriptions
- [ ] All WebSocket endpoints documented
- [ ] Request/response models documented with schemas
- [ ] Authentication flows documented (JWT, OAuth)
- [ ] Error responses documented with status codes and examples
- [ ] Request/response examples provided
- [ ] Validation rules documented
- [ ] Swagger UI accessible for all services
- [ ] OpenAPI specification available in JSON/YAML format
- [ ] API versioning documented
- [ ] Rate limiting and security requirements documented

## Technical Details

### Swagger/OpenAPI Configuration
Based on [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) and [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md):

**Spring Boot Services (SpringDoc OpenAPI):**
- Dependency: `springdoc-openapi-starter-webmvc-ui`
- Configuration: `application.properties` with `springdoc.*` properties
- Swagger UI: `/swagger-ui.html`
- OpenAPI JSON: `/api-docs`
- Annotations: `@Operation`, `@ApiResponse`, `@Parameter`, `@Schema`

**Node.js Services (swagger-jsdoc + swagger-ui-express):**
- Dependencies: `swagger-jsdoc`, `swagger-ui-express`
- Configuration: JSDoc comments with OpenAPI 3.0 spec
- Swagger UI: `/api-docs`
- OpenAPI JSON: `/api-docs.json`

### Design Patterns Applied
- **Documentation Pattern**: Code-first API documentation
- **Annotation Pattern**: Use annotations for API metadata
- **Specification Pattern**: OpenAPI specification for API contracts

### API Documentation Standards
- Use descriptive endpoint summaries and descriptions
- Include request/response examples
- Document all status codes
- Include authentication requirements
- Document validation rules
- Include error response schemas
- Version API documentation

## Related Documentation
- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Testing approach
- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Testing tools
- [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) – Auth API endpoints
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Profile API endpoints
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Leaderboard API endpoints

## Labels
phase:quality, documentation, backend, priority:medium

## Milestone
Phase 9: Quality Assurance
```

#### Subtask: TASK-9-1-1: Set up Swagger for Spring Boot services

````
Title: TASK-9-1-1: Set up Swagger for Spring Boot services

Description:
## Story
Related to #X (STORY-9-1 issue number)

## Epic
Related to #X (PHASE-9 issue number)

## Description
Set up SpringDoc OpenAPI for all Spring Boot services (Auth, Profile, Leaderboard) with Swagger UI configuration, OpenAPI specification generation, and API documentation annotations. The setup must include dependency configuration, application properties, and Swagger UI customization.

## Acceptance Criteria
- [ ] SpringDoc OpenAPI dependency added to all Spring Boot services
- [ ] Application properties configured for Swagger UI
- [ ] Swagger UI accessible at /swagger-ui.html for all services
- [ ] OpenAPI specification available at /api-docs
- [ ] API documentation standards documented
- [ ] Swagger UI customized with project information
- [ ] Security configuration for Swagger UI (if needed)

## Technical Details

### Dependency Configuration
**File:** `backend-services/{service}/pom.xml`

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.0</version>
</dependency>
````

### Application Properties

**File:** `backend-services/{service}/src/main/resources/application.properties`

```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true
springdoc.swagger-ui.filter=true
springdoc.default-consumes-media-type=application/json
springdoc.default-produces-media-type=application/json
```

### Swagger Configuration Class

**File:** `backend-services/{service}/src/main/java/com/battlearena/{service}/config/SwaggerConfig.java`

```java
package com.battlearena.{service}.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Battle Arena {Service} API")
                .version("1.0.0")
                .description("API documentation for Battle Arena {Service}")
                .contact(new Contact()
                    .name("Battle Arena Team")
                    .email("team@battlearena.com"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .servers(List.of(
                new Server().url("http://localhost:808{port}").description("Local Development"),
                new Server().url("https://api.battlearena.com").description("Production")
            ));
    }
}
```

### Example Controller Annotation

```java
@RestController
@RequestMapping("/api/{service}")
@Tag(name = "{Service}", description = "{Service} API endpoints")
public class {Service}Controller {

    @Operation(
        summary = "Get resource",
        description = "Retrieves a resource by ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Resource retrieved successfully",
            content = @Content(schema = @Schema(implementation = ResourceResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Resource not found"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResource(
        @Parameter(description = "Resource ID", required = true) @PathVariable String id
    ) {
        // Implementation
    }
}
```

## Related Documentation

- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Testing tools
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Spring Boot structure

## Labels

phase:quality, documentation, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```

#### Subtask: TASK-9-1-2: Set up OpenAPI for Node.js services
```

Title: TASK-9-1-2: Set up OpenAPI for Node.js services

Description:

## Story

Related to #X (STORY-9-1 issue number)

## Epic

Related to #X (PHASE-9 issue number)

## Description

Set up OpenAPI documentation for Node.js services (Matchmaking, Game Engine) using swagger-jsdoc and swagger-ui-express. The setup must include JSDoc comments for API documentation, Swagger UI configuration, and OpenAPI 3.0 specification generation.

## Acceptance Criteria

- [ ] swagger-jsdoc and swagger-ui-express dependencies installed
- [ ] OpenAPI 3.0 specification configured
- [ ] JSDoc comments added to route handlers
- [ ] Swagger UI accessible at /api-docs
- [ ] OpenAPI JSON available at /api-docs.json
- [ ] WebSocket endpoints documented
- [ ] API documentation standards documented

## Technical Details

### Dependency Installation

**File:** `backend-services/{service}/package.json`

```json
{
  "dependencies": {
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  }
}
```

### Swagger Configuration

**File:** `backend-services/{service}/src/config/swagger.ts`

```typescript
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Battle Arena {Service} API",
      version: "1.0.0",
      description: "API documentation for Battle Arena {Service}",
      contact: {
        name: "Battle Arena Team",
        email: "team@battlearena.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:300{port}",
        description: "Local Development",
      },
      {
        url: "https://api.battlearena.com",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
```

### Example Route Documentation

**File:** `backend-services/{service}/src/routes/example.routes.ts`

```typescript
/**
 * @swagger
 * /api/example/{id}:
 *   get:
 *     summary: Get resource
 *     description: Retrieves a resource by ID
 *     tags: [Example]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceResponse'
 *       404:
 *         description: Resource not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", exampleController.getResource);
```

## Related Documentation

- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Testing tools
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Node.js structure

## Labels

phase:quality, documentation, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```

#### Subtask: TASK-9-1-3: Document Auth, Profile, Leaderboard, Matchmaking, Game Engine endpoints
```

Title: TASK-9-1-3: Document Auth, Profile, Leaderboard, Matchmaking, Game Engine endpoints

Description:

## Story

Related to #X (STORY-9-1 issue number)

## Epic

Related to #X (PHASE-9 issue number)

## Description

Document all API endpoints for Auth, Profile, Leaderboard, Matchmaking, and Game Engine services with comprehensive descriptions, request/response schemas, examples, authentication requirements, and error responses. Ensure consistency across all services and include WebSocket endpoint documentation.

## Acceptance Criteria

- [ ] All Auth Service endpoints documented
- [ ] All Profile Service endpoints documented
- [ ] All Leaderboard Service endpoints documented
- [ ] All Matchmaking Service endpoints documented (REST and WebSocket)
- [ ] All Game Engine Service endpoints documented (REST and WebSocket)
- [ ] Request/response schemas documented
- [ ] Request/response examples provided
- [ ] Authentication requirements documented
- [ ] Error responses documented with status codes
- [ ] Validation rules documented
- [ ] API versioning documented
- [ ] Documentation reviewed and consistent

## Technical Details

### Documentation Checklist per Service

**Auth Service:**

- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/google - Google OAuth login
- POST /api/auth/refresh - Token refresh
- POST /api/auth/logout - User logout
- GET /api/auth/validate - Token validation

**Profile Service:**

- GET /api/profile - Get user profile
- PUT /api/profile - Update profile
- POST /api/profile/score - Update score
- GET /api/profile/rank - Get rank tier
- PUT /api/profile/avatar - Update avatar

**Leaderboard Service:**

- GET /api/leaderboard/global - Global leaderboard
- GET /api/leaderboard/global?filter=rank - Filtered leaderboard
- GET /api/leaderboard/player/{playerId} - Player position

**Matchmaking Service:**

- WebSocket: /ws/matchmaking - Matchmaking queue
  - Events: join-queue, leave-queue, queue-status, match-found
- REST: GET /api/matchmaking/status - Queue status

**Game Engine Service:**

- WebSocket: /ws/game - Game communication
  - Events: game-started, turn-started, movement, projectile, game-ended
- REST: GET /api/game/status/{gameId} - Game status

### Documentation Standards

- Use descriptive summaries (50-100 characters)
- Include detailed descriptions (100-200 words)
- Document all parameters with types and constraints
- Include request/response examples
- Document all possible status codes
- Include authentication requirements
- Document error response schemas
- Include validation rules

## Related Documentation

- [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) – Auth API endpoints
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Profile API endpoints
- [Leaderboard Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/LEADERBOARD_SERVICE.md) – Leaderboard API endpoints
- [Matchmaking Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/MATCHMAKING_SERVICE.md) – Matchmaking API endpoints
- [Game Engine Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/GAME_ENGINE_SERVICE.md) – Game Engine API endpoints

## Labels

phase:quality, documentation, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```

---

### STORY-9-2: Unit Testing Coverage

#### Issue Template:

```

Title: STORY-9-2: Achieve 80%+ code coverage with unit tests

Description:

## Epic

Related to #X (PHASE-9 issue number)

## User Story

As a developer, I want comprehensive unit tests with 80%+ code coverage so that I can ensure code quality and catch bugs early.

## Description

Write comprehensive unit tests for all services (backend and frontend) to reach and maintain 80%+ code coverage as per testing strategy. The unit tests must cover all critical paths, edge cases, error handling, and business logic. The implementation must include test data factories, mocking strategies, test builders, and coverage reporting in CI/CD pipelines. Tests must follow AAA pattern (Arrange, Act, Assert), be fast and independent, and use appropriate design patterns for test data creation.

## Acceptance Criteria

- [ ] 80%+ code coverage achieved for all services
- [ ] Unit tests written for all Spring Boot services (Auth, Profile, Leaderboard)
- [ ] Unit tests written for all Node.js services (Matchmaking, Game Engine)
- [ ] Unit tests written for key frontend components and services
- [ ] Critical paths and business logic covered
- [ ] Edge cases and error scenarios covered
- [ ] Test data factories implemented (Factory Pattern)
- [ ] Test builders implemented (Builder Pattern)
- [ ] Mocking strategies implemented (Mock Pattern)
- [ ] Coverage reports generated in CI/CD
- [ ] Coverage thresholds enforced in CI/CD
- [ ] Test execution fast and independent
- [ ] Tests follow AAA pattern

## Technical Details

### Unit Testing Framework

Based on [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) and [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md):

**Java Services (JUnit 5 + Mockito):**

- Framework: JUnit 5 via `spring-boot-starter-test`
- Mocking: Mockito
- Assertions: AssertJ, Hamcrest
- Test Directory: `src/test/java/com/battlearena/{service}/unit/`
- Test Naming: `*Tests.java`
- Coverage Tool: JaCoCo

**Node.js Services (Jest):**

- Framework: Jest
- Mocking: Jest mocks
- Assertions: Jest expect
- Test Directory: `src/__tests__/`
- Test Naming: `*.test.js`, `*.spec.js`
- Coverage Tool: Jest/Istanbul

**Angular Frontend (Jasmine + Karma):**

- Framework: Jasmine
- Test Runner: Karma
- Mocking: Angular Testing Utilities
- Test Directory: `src/app/`
- Test Naming: `*.spec.ts`
- Coverage Tool: Karma/Istanbul

### Design Patterns Applied

- **Factory Pattern**: TestDataFactory for test data creation
- **Builder Pattern**: TestBuilder for complex test data construction
- **Mock Pattern**: MockRepository for mock data access
- **Strategy Pattern**: TestRunner for different test execution strategies

### Testing Best Practices

- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests fast and independent
- Use mocks for external dependencies
- Test one thing per test
- Use descriptive test names
- Cover edge cases and error scenarios
- Maintain 80%+ code coverage

## Related Documentation

- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Testing approach and patterns
- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Testing tools and configuration
- [Design Principles](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) – Code quality principles

## Labels

phase:quality, testing, backend, priority:medium

## Milestone

Phase 9: Quality Assurance

```

#### Subtask: TASK-9-2-1: Configure coverage reporting in CI (JaCoCo, Jest, Karma)
```

Title: TASK-9-2-1: Configure coverage reporting in CI (JaCoCo, Jest, Karma)

Description:

## Story

Related to #X (STORY-9-2 issue number)

## Epic

Related to #X (PHASE-9 issue number)

## Description

Configure code coverage reporting tools (JaCoCo for Java, Jest/Istanbul for Node.js, Karma/Istanbul for Angular) in CI/CD pipelines with coverage thresholds, report generation, and integration with SonarCloud. The configuration must enforce 80%+ coverage thresholds, generate coverage reports in standard formats, and upload reports to SonarCloud for analysis.

## Acceptance Criteria

- [ ] JaCoCo configured for Spring Boot services
- [ ] Jest coverage configured for Node.js services
- [ ] Karma coverage configured for Angular frontend
- [ ] Coverage thresholds set to 80%+
- [ ] Coverage reports generated in CI/CD
- [ ] Coverage reports uploaded to SonarCloud
- [ ] Coverage reports in standard formats (XML, LCOV)
- [ ] CI/CD pipeline fails if coverage below threshold
- [ ] Coverage badges generated (optional)

## Technical Details

### JaCoCo Configuration (Java Services)

**File:** `backend-services/{service}/pom.xml`

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.14</version>
    <executions>
        <execution>
            <id>prepare-agent</id>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>PACKAGE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.80</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

### Jest Configuration (Node.js Services)

**File:** `backend-services/{service}/jest.config.js`

```javascript
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
};
```

### Karma Configuration (Angular Frontend)

**File:** `frontend-service/karma.conf.js`

```javascript
module.exports = function (config) {
  config.set({
    coverageReporter: {
      type: "lcov",
      dir: "coverage/",
      subdir: ".",
    },
    coverageIstanbulReporter: {
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 80,
        functions: 80,
      },
    },
  });
};
```

### CI/CD Integration

**File:** `.github/workflows/test.yml`

```yaml
- name: Run tests with coverage
  run: |
    # Java services
    mvn test jacoco:report

    # Node.js services
    npm test -- --coverage

    # Angular frontend
    npm run test:coverage

- name: Upload coverage to SonarCloud
  uses: sonarsource/sonarcloud-github-action@master
  with:
    projectBaseDir: .
```

## Related Documentation

- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Coverage configuration
- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Coverage targets

## Labels

phase:quality, testing, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```

#### Subtask: TASK-9-2-2: Write unit tests for backend services (Auth, Profile, Leaderboard, Matchmaking, Game Engine)
```

Title: TASK-9-2-2: Write unit tests for backend services (Auth, Profile, Leaderboard, Matchmaking, Game Engine)

Description:

## Story

Related to #X (STORY-9-2 issue number)

## Epic

Related to #X (PHASE-9 issue number)

## Description

Write comprehensive unit tests for all backend services (Auth, Profile, Leaderboard, Matchmaking, Game Engine) covering all controllers, services, repositories, and business logic. Tests must use TestDataFactory and TestBuilder patterns, mock external dependencies, cover edge cases and error scenarios, and achieve 80%+ code coverage.

## Acceptance Criteria

- [ ] Unit tests written for Auth Service (controllers, services, repositories)
- [ ] Unit tests written for Profile Service (controllers, services, repositories)
- [ ] Unit tests written for Leaderboard Service (controllers, services, repositories)
- [ ] Unit tests written for Matchmaking Service (services, managers, handlers)
- [ ] Unit tests written for Game Engine Service (services, managers, handlers)
- [ ] TestDataFactory implemented for test data creation
- [ ] TestBuilder implemented for complex test data
- [ ] All critical paths covered
- [ ] Edge cases and error scenarios covered
- [ ] 80%+ code coverage achieved per service
- [ ] Tests follow AAA pattern
- [ ] Tests are fast and independent

## Technical Details

### Test Structure (Java Services)

**File:** `backend-services/{service}/src/test/java/com/battlearena/{service}/unit/ServiceTests.java`

```java
package com.battlearena.{service}.unit;

import com.battlearena.{service}.service.{Service};
import com.battlearena.{service}.repository.{Repository};
import com.battlearena.{service}.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class {Service}Tests {
    @Mock
    private {Repository} repository;

    @InjectMocks
    private {Service} service;

    private TestDataFactory testDataFactory;

    @BeforeEach
    void setUp() {
        testDataFactory = new TestDataFactory();
    }

    @Test
    void shouldCreateResource() {
        // Arrange
        var request = testDataFactory.createRequest();
        var expected = testDataFactory.createResponse();
        when(repository.save(any())).thenReturn(expected);

        // Act
        var result = service.create(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(expected.getId());
    }
}
```

### Test Structure (Node.js Services)

**File:** `backend-services/{service}/src/__tests__/service.test.js`

```javascript
const { Service } = require("../services/service");
const TestDataFactory = require("../factories/TestDataFactory");

describe("Service", () => {
  let service;
  let testDataFactory;
  let mockRepository;

  beforeEach(() => {
    testDataFactory = new TestDataFactory();
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    service = new Service(mockRepository);
  });

  test("should create resource", () => {
    // Arrange
    const request = testDataFactory.createRequest();
    const expected = testDataFactory.createResponse();
    mockRepository.save.mockResolvedValue(expected);

    // Act
    return service.create(request).then((result) => {
      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(expected.id);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
```

### TestDataFactory Example

**File:** `backend-services/{service}/src/test/java/com/battlearena/{service}/factory/TestDataFactory.java`

```java
public class TestDataFactory {
    public User createUser() {
        return User.builder()
            .id(UUID.randomUUID().toString())
            .username("testuser")
            .email("test@example.com")
            .build();
    }

    public RegisterRequest createRegisterRequest() {
        return RegisterRequest.builder()
            .username("testuser")
            .email("test@example.com")
            .password("password123")
            .build();
    }
}
```

## Related Documentation

- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Testing patterns
- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Test structure

## Labels

phase:quality, testing, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```

#### Subtask: TASK-9-2-3: Write unit tests for key frontend components/services
```

Title: TASK-9-2-3: Write unit tests for key frontend components/services

Description:

## Story

Related to #X (STORY-9-2 issue number)

## Epic

Related to #X (PHASE-9 issue number)

## Description

Write comprehensive unit tests for key frontend components and services (AuthService, ProfileService, DashboardComponent, etc.) using Jasmine and Angular Testing Utilities. Tests must cover component logic, service methods, HTTP interactions, form validation, and user interactions, achieving 80%+ code coverage.

## Acceptance Criteria

- [ ] Unit tests written for AuthService
- [ ] Unit tests written for ProfileService
- [ ] Unit tests written for DashboardComponent
- [ ] Unit tests written for key components (Login, Register, Profile, Leaderboard)
- [ ] HTTP interactions mocked
- [ ] Form validation tested
- [ ] User interactions tested
- [ ] 80%+ code coverage achieved
- [ ] Tests follow AAA pattern
- [ ] Tests are fast and independent

## Technical Details

### Component Test Example

**File:** `frontend-service/src/app/auth/components/login/login.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { of, throwError } from "rxjs";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj("AuthService", ["login"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [FormBuilder, { provide: AuthService, useValue: authServiceSpy }, { provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it("should login successfully", () => {
    // Arrange
    const response = { token: "token", user: { id: "1", username: "test" } };
    authService.login.and.returnValue(of(response));
    component.loginForm.patchValue({ username: "test", password: "password" });

    // Act
    component.onSubmit();

    // Assert
    expect(authService.login).toHaveBeenCalledWith("test", "password");
    expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
  });
});
```

### Service Test Example

**File:** `frontend-service/src/app/services/auth.service.spec.ts`

```typescript
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should login user", () => {
    // Arrange
    const username = "test";
    const password = "password";
    const response = { token: "token", user: { id: "1", username: "test" } };

    // Act
    service.login(username, password).subscribe((result) => {
      // Assert
      expect(result.token).toBe("token");
      expect(result.user.username).toBe("test");
    });

    const req = httpMock.expectOne(`${environment.authServiceUrl}/login`);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });
});
```

## Related Documentation

- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Angular testing
- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Testing patterns

## Labels

phase:quality, testing, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```

---

### STORY-9-3: Integration & End-to-End Testing

#### Issue Template:

```

Title: STORY-9-3: Implement integration and end-to-end tests for core flows

Description:

## Epic

Related to #X (PHASE-9 issue number)

## User Story

As a developer, I want integration and end-to-end tests for critical flows so that I can ensure the system works correctly end-to-end.

## Description

Implement comprehensive integration tests for backend APIs and end-to-end tests for critical user journeys. Integration tests must test component interactions, database operations, API endpoints, and service-to-service communication. E2E tests must cover complete user workflows from login through matchmaking, gameplay, and results display. Tests must be stable, run in CI/CD pipelines, use Testcontainers for database testing, and follow best practices for integration and E2E testing.

## Acceptance Criteria

- [ ] Integration tests for Auth Service APIs
- [ ] Integration tests for Profile Service APIs
- [ ] Integration tests for Leaderboard Service APIs
- [ ] Integration tests for Matchmaking Service (WebSocket)
- [ ] Integration tests for Game Engine Service (WebSocket)
- [ ] E2E framework set up (Cypress or Playwright)
- [ ] E2E tests for authentication flow (login → dashboard)
- [ ] E2E tests for matchmaking flow (join queue → match found)
- [ ] E2E tests for gameplay flow (game start → turn → movement → game end)
- [ ] E2E tests for profile/leaderboard flow (view profile → view leaderboard)
- [ ] Tests run in CI/CD pipelines
- [ ] Tests are stable and reliable
- [ ] Test data cleanup implemented
- [ ] Test reports generated

## Technical Details

### Integration Testing Framework

Based on [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) and [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md):

**Java Services (Spring Boot Test + Testcontainers):**

- Framework: Spring Boot Test with `@SpringBootTest`
- Database: Testcontainers for MongoDB
- Test Directory: `src/test/java/com/battlearena/{service}/integration/`
- Test Naming: `*IntegrationTests.java`
- Coverage Target: 60%+ code coverage

**Node.js Services (Jest + Supertest):**

- Framework: Jest with Supertest for HTTP testing
- Database: Testcontainers or in-memory MongoDB
- Test Directory: `src/__tests__/integration/`
- Test Naming: `*.integration.test.js`

### E2E Testing Framework

**Angular Frontend (Cypress or Playwright):**

- Framework: Cypress (recommended) or Playwright
- Test Directory: `frontend-service/e2e/` or `frontend-service/tests/e2e/`
- Test Naming: `*.e2e.spec.ts` or `*.spec.ts`
- Coverage: Critical user flows

### Design Patterns Applied

- **Testcontainers Pattern**: Use Testcontainers for database testing
- **Page Object Pattern**: Use Page Object Model for E2E tests
- **Test Data Pattern**: Use test data factories for integration tests

### Testing Best Practices

- Use real dependencies where possible in integration tests
- Test database interactions
- Test API endpoints
- Test service-to-service communication
- Use Testcontainers for database isolation
- Clean up test data after tests
- Keep E2E tests focused on critical flows
- Use Page Object Model for E2E tests

## Related Documentation

- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Integration and E2E testing
- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Testing tools
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Service interactions

## Labels

phase:quality, testing, priority:medium

## Milestone

Phase 9: Quality Assurance

```

#### Subtask: TASK-9-3-1: Create integration tests for backend APIs
```

Title: TASK-9-3-1: Create integration tests for backend APIs

Description:

## Story

Related to #X (STORY-9-3 issue number)

## Epic

Related to #X (PHASE-9 issue number)

## Description

Create comprehensive integration tests for all backend service APIs (Auth, Profile, Leaderboard, Matchmaking, Game Engine) using Spring Boot Test and Jest with Supertest. Tests must use Testcontainers for database isolation, test real database interactions, API endpoints, and service-to-service communication, achieving 60%+ code coverage.

## Acceptance Criteria

- [ ] Integration tests for Auth Service APIs
- [ ] Integration tests for Profile Service APIs
- [ ] Integration tests for Leaderboard Service APIs
- [ ] Integration tests for Matchmaking Service (WebSocket)
- [ ] Integration tests for Game Engine Service (WebSocket)
- [ ] Testcontainers configured for MongoDB
- [ ] Testcontainers configured for Redis (if needed)
- [ ] Real database interactions tested
- [ ] API endpoints tested end-to-end
- [ ] Service-to-service communication tested
- [ ] 60%+ code coverage achieved
- [ ] Test data cleanup implemented
- [ ] Tests are stable and reliable

## Technical Details

### Integration Test Structure (Java Services)

**File:** `backend-services/{service}/src/test/java/com/battlearena/{service}/integration/ControllerIntegrationTests.java`

```java
package com.battlearena.{service}.integration;

import com.battlearena.{service}.Application;
import com.battlearena.{service}.model.{Model};
import com.battlearena.{service}.repository.{Repository};
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = Application.class)
@AutoConfigureWebMvc
@Testcontainers
class ControllerIntegrationTests {
    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private {Repository} repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void shouldCreateResource() throws Exception {
        // Arrange
        String requestBody = """
            {
                "field1": "value1",
                "field2": "value2"
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/{service}")
                .contentType("application/json")
                .content(requestBody))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.field1").value("value1"));
    }
}
```

### Integration Test Structure (Node.js Services)

**File:** `backend-services/{service}/src/__tests__/integration/api.integration.test.js`

```javascript
const request = require("supertest");
const { app } = require("../../app");
const { setupTestDatabase, teardownTestDatabase } = require("../helpers/database");

describe("API Integration Tests", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  test("should create resource", async () => {
    // Arrange
    const requestBody = {
      field1: "value1",
      field2: "value2",
    };

    // Act
    const response = await request(app).post("/api/resource").send(requestBody).expect(201);

    // Assert
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.field1).toBe("value1");
  });
});
```

### Testcontainers Configuration

**File:** `backend-services/{service}/pom.xml` (Java)

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.19.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>mongodb</artifactId>
    <version>1.19.0</version>
    <scope>test</scope>
</dependency>
```

## Related Documentation

- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – Integration testing
- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Testing tools

## Labels

phase:quality, testing, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```

#### Subtask: TASK-9-3-2: Set up frontend E2E framework (e.g. Cypress/Playwright)
```

Title: TASK-9-3-2: Set up frontend E2E framework (e.g. Cypress/Playwright)

Description:

## Story

Related to #X (STORY-9-3 issue number)

## Epic

Related to #X (PHASE-9 issue number)

## Description

Set up end-to-end testing framework (Cypress or Playwright) for Angular frontend with configuration, test directory structure, Page Object Model pattern, and CI/CD integration. The framework must support testing of complete user workflows, WebSocket interactions, and real browser testing.

## Acceptance Criteria

- [ ] E2E framework installed (Cypress or Playwright)
- [ ] E2E configuration file created
- [ ] Test directory structure created
- [ ] Page Object Model pattern implemented
- [ ] CI/CD integration configured
- [ ] Test scripts added to package.json
- [ ] E2E test examples created
- [ ] Documentation for E2E testing

## Technical Details

### Cypress Setup

**File:** `frontend-service/cypress.config.ts`

```typescript
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
  },
  video: true,
  screenshotOnRunFailure: true,
});
```

### Playwright Setup

**File:** `frontend-service/playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4200",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:4200",
    reuseExistingServer: !process.env.CI,
  },
});
```

### Page Object Example

**File:** `frontend-service/cypress/support/pages/LoginPage.ts`

```typescript
export class LoginPage {
  visit() {
    cy.visit("/auth/login");
  }

  fillUsername(username: string) {
    cy.get("[data-cy=username]").type(username);
  }

  fillPassword(password: string) {
    cy.get("[data-cy=password]").type(password);
  }

  submit() {
    cy.get("[data-cy=login-button]").click();
  }

  shouldShowError(message: string) {
    cy.get("[data-cy=error-message]").should("contain", message);
  }
}
```

## Related Documentation

- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – E2E testing
- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Testing tools

## Labels

phase:quality, testing, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```

#### Subtask: TASK-9-3-3: Implement E2E scenarios for main user flows
```

Title: TASK-9-3-3: Implement E2E scenarios for main user flows

Description:

## Story

Related to #X (STORY-9-3 issue number)

## Epic

Related to #X (PHASE-9 issue number)

## Description

Implement end-to-end test scenarios for critical user flows: authentication (login → dashboard), matchmaking (join queue → match found), gameplay (game start → turn → movement → game end), and profile/leaderboard (view profile → view leaderboard). Tests must use Page Object Model, be stable and reliable, and run in CI/CD pipelines.

## Acceptance Criteria

- [ ] E2E test for authentication flow (login → dashboard)
- [ ] E2E test for matchmaking flow (join queue → match found)
- [ ] E2E test for gameplay flow (game start → turn → movement → game end)
- [ ] E2E test for profile/leaderboard flow (view profile → view leaderboard)
- [ ] Page Object Model implemented for all pages
- [ ] Tests are stable and reliable
- [ ] Tests run in CI/CD pipelines
- [ ] Test data setup and cleanup implemented
- [ ] Test reports generated

## Technical Details

### E2E Test Example (Cypress)

**File:** `frontend-service/cypress/e2e/auth.cy.ts`

```typescript
import { LoginPage } from "../support/pages/LoginPage";
import { DashboardPage } from "../support/pages/DashboardPage";

describe("Authentication Flow", () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  it("should login and navigate to dashboard", () => {
    // Arrange
    loginPage.visit();

    // Act
    loginPage.fillUsername("testuser");
    loginPage.fillPassword("password123");
    loginPage.submit();

    // Assert
    dashboardPage.shouldBeVisible();
    dashboardPage.shouldShowUserProfile("testuser");
  });
});
```

### E2E Test Example (Playwright)

**File:** `frontend-service/tests/e2e/matchmaking.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MatchmakingPage } from "../pages/MatchmakingPage";

test.describe("Matchmaking Flow", () => {
  test("should join queue and find match", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const matchmakingPage = new MatchmakingPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login("testuser", "password123");
    await matchmakingPage.goto();
    await matchmakingPage.joinQueue();

    // Assert
    await expect(matchmakingPage.queueStatus).toBeVisible();
    await matchmakingPage.waitForMatch();
    await expect(matchmakingPage.matchFoundMessage).toBeVisible();
  });
});
```

### Test Scenarios Checklist

1. **Authentication Flow:**
   - Login with valid credentials
   - Login with invalid credentials
   - Logout
   - Registration

2. **Matchmaking Flow:**
   - Join queue
   - Leave queue
   - Match found
   - Queue status display

3. **Gameplay Flow:**
   - Game start
   - Turn management
   - Movement
   - Projectile
   - Game end

4. **Profile/Leaderboard Flow:**
   - View profile
   - Update profile
   - View leaderboard
   - Filter leaderboard

## Related Documentation

- [Testing Strategy](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) – E2E testing
- [Testing Framework Setup](https://github.com/Buffden/battle-arena/blob/main/docs/TESTING_FRAMEWORK_SETUP.md) – Testing tools
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – User flows

## Labels

phase:quality, testing, task, priority:medium

## Milestone

Phase 9: Quality Assurance

```


```
