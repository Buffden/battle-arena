# Auth Service

Spring Boot service for user authentication and authorization.

## Description

The Auth Service handles all user authentication and authorization operations for Battle Arena, including local authentication, Google OAuth, and JWT token management.

## Technology Stack

- **Framework:** Spring Boot 3.3.6
- **Language:** Java 17
- **Database:** MongoDB (Users collection)
- **Authentication:** JWT tokens (HS512 algorithm), Google OAuth 2.0 (future)
- **Password Hashing:** BCrypt (12 rounds)
- **API Documentation:** Swagger/OpenAPI 3.0

## Port

**8081** (configurable via `SERVER_PORT` environment variable)

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user (to be implemented in TASK-VS-2-1-2)
- `POST /api/auth/login` - Login user and receive JWT token (to be implemented in TASK-VS-2-2-1)
- `POST /api/auth/logout` - Logout user (to be implemented in TASK-VS-2-3-1)

### Documentation Endpoints

- `GET /swagger-ui.html` - Swagger UI for API documentation
- `GET /api-docs` - OpenAPI specification (JSON)

### Health & Monitoring Endpoints

- `GET /actuator/health` - Health check endpoint
- `GET /actuator/info` - Application information
- `GET /actuator/metrics` - Application metrics
- `GET /actuator/prometheus` - Prometheus metrics

## Environment Variables

### Required Environment Variables

None (all have defaults for local development)

### Optional Environment Variables

| Variable                    | Description                                  | Default Value                          |
| --------------------------- | -------------------------------------------- | -------------------------------------- |
| `SERVER_PORT`               | Server port                                  | `8081`                                 |
| `MONGODB_URI`               | MongoDB connection URI                       | `mongodb://mongodb:27017/battlearena`  |
| `MONGODB_DATABASE`          | MongoDB database name                        | `battlearena`                          |
| `JWT_SECRET`                | Secret key for JWT token signing             | `your-secret-key-change-in-production` |
| `JWT_EXPIRATION`            | JWT token expiration time in milliseconds    | `86400000` (24 hours)                  |
| `CORS_ALLOWED_ORIGINS`      | Comma-separated list of allowed CORS origins | `*` (all origins)                      |
| `LOG_LEVEL_ROOT`            | Root logging level                           | `INFO`                                 |
| `LOG_LEVEL`                 | Service-specific logging level               | `INFO`                                 |
| `LOG_LEVEL_SPRING_WEB`      | Spring Web logging level                     | `INFO`                                 |
| `LOG_LEVEL_SPRING_SECURITY` | Spring Security logging level                | `WARN`                                 |
| `LOG_LEVEL_MONGODB`         | MongoDB logging level                        | `WARN`                                 |
| `SPRING_PROFILES_ACTIVE`    | Active Spring profile                        | `development`                          |

**⚠️ Important:** Change `JWT_SECRET` in production! Never use the default value in production environments.

## Local Development Setup

### Prerequisites

- Java 17 or higher
- Maven 3.6+ or higher
- MongoDB (running locally or via Docker Compose)
- Docker and Docker Compose (optional, for MongoDB)

### Running Locally

1. **Start MongoDB** (if not using Docker Compose):

   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or use Docker Compose from project root
   docker-compose up -d mongodb
   ```

2. **Set Environment Variables** (optional, defaults work for local dev):

   ```bash
   export JWT_SECRET=your-local-secret-key
   export MONGODB_URI=mongodb://localhost:27017/battlearena
   ```

3. **Build the Project**:

   ```bash
   cd backend-services/auth-service
   mvn clean install
   ```

4. **Run the Application**:

   ```bash
   mvn spring-boot:run
   # Or
   java -jar target/auth-service-0.0.1-SNAPSHOT.jar
   ```

5. **Verify the Service**:
   - Health check: http://localhost:8081/actuator/health
   - Swagger UI: http://localhost:8081/swagger-ui.html
   - API Docs: http://localhost:8081/api-docs

### Running Tests

```bash
# Run all tests
mvn test

# Run tests with coverage report
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### Code Quality Checks

```bash
# Run Checkstyle
mvn checkstyle:check

# Run all quality checks
mvn clean verify
```

## Responsibilities

- User registration and authentication
- OAuth authentication (Google OAuth 2.0 - future)
- JWT token generation and validation
- Password hashing and security (BCrypt with 12 rounds)
- Session management
- Account linking for OAuth users (future)

## Project Structure

```
auth-service/
├── src/
│   ├── main/
│   │   ├── java/com/battlearena/auth_service/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST API endpoints
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Exception handlers
│   │   │   ├── model/           # Domain entities
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── security/        # Security components
│   │   │   └── service/         # Business logic layer
│   │   └── resources/
│   │       └── application.yaml # Application configuration
│   └── test/                    # Test classes
├── pom.xml                      # Maven configuration
├── checkstyle.xml               # Code quality rules
└── README.md                    # This file
```

## Status

✅ **Foundation Setup Complete (TASK-VS-2-1-1)**

- Project structure created
- Dependencies configured
- Security configuration implemented
- Swagger/OpenAPI configured
- Exception handling implemented
- Ready for feature implementation (TASK-VS-2-1-2)
