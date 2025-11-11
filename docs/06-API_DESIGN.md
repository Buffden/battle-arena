# 🔌 API Design Document
## Battle Arena - Multiplayer Tank Battle Game

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Draft

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

## 1. Introduction

### 1.1 Purpose
This document provides comprehensive API specifications for all REST APIs and WebSocket events in the Battle Arena system.

### 1.2 API Standards
- **RESTful APIs:** Follow REST principles
- **JSON Format:** JSON for request and response bodies
- **HTTP Methods:** GET, POST, PUT, DELETE
- **Status Codes:** Standard HTTP status codes
- **Authentication:** JWT tokens in Authorization header
- **Versioning:** URL-based versioning (/api/v1/)

### 1.3 Base URLs
- **Auth Service:** `http://localhost:8081/api/v1/auth`
- **Profile Service:** `http://localhost:8082/api/v1/profile`
- **Leaderboard Service:** `http://localhost:8083/api/v1/leaderboard`
- **Matchmaking Service:** `ws://localhost:3002`
- **Game Engine Service:** `ws://localhost:5002`

---

## 2. Authentication Service APIs

### 2.1 POST /api/v1/auth/register

**Description:** Register a new user

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Validation:**
- `username`: Required, 3-20 characters, alphanumeric and underscores
- `email`: Required, valid email format
- `password`: Required, min 8 characters, must contain uppercase, lowercase, digit, and special character

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "string",
    "username": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
- `409 Conflict`: Username/email already exists
- `500 Internal Server Error`: Internal server error

---

### 2.2 POST /api/v1/auth/login

**Description:** Login user and get JWT token

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Validation:**
- `username`: Required
- `password`: Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string",
    "expiresIn": 86400,
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account locked
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Internal server error

---

### 2.3 POST /api/v1/auth/validate

**Description:** Validate JWT token

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid/expired token
- `500 Internal Server Error`: Internal server error

---

### 2.4 POST /api/v1/auth/refresh

**Description:** Refresh JWT token

**Request:**
```json
{
  "refreshToken": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string",
    "expiresIn": 86400
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid/expired refresh token
- `500 Internal Server Error`: Internal server error

---

## 3. Profile Service APIs

### 3.1 GET /api/v1/profile/me

**Description:** Get current user's profile

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "displayName": "string",
    "avatar": "string",
    "bio": "string",
    "xp": 0,
    "level": 1,
    "wins": 0,
    "losses": 0,
    "matchesPlayed": 0,
    "winRate": 0.0,
    "achievements": ["string"]
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid/expired token
- `404 Not Found`: Profile not found
- `500 Internal Server Error`: Internal server error

---

### 3.2 PUT /api/v1/profile/me

**Description:** Update current user's profile

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "displayName": "string",
  "avatar": "string",
  "bio": "string"
}
```

**Validation:**
- `displayName`: Optional, 3-30 characters
- `avatar`: Optional, valid avatar ID
- `bio`: Optional, max 500 characters

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "displayName": "string",
    "avatar": "string",
    "bio": "string",
    "xp": 0,
    "level": 1,
    "wins": 0,
    "losses": 0,
    "matchesPlayed": 0,
    "winRate": 0.0,
    "achievements": ["string"]
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Invalid/expired token
- `500 Internal Server Error`: Internal server error

---

### 3.3 POST /api/v1/profile/xp

**Description:** Update user XP after match

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "userId": "string",
  "xpGained": 100,
  "matchId": "string",
  "isWinner": true
}
```

**Validation:**
- `userId`: Required
- `xpGained`: Required, positive number
- `matchId`: Required
- `isWinner`: Required, boolean

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "newXP": 100,
    "newLevel": 2,
    "levelUp": true,
    "xpGained": 100
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Invalid/expired token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Internal server error

---

## 4. Leaderboard Service APIs

### 4.1 GET /api/v1/leaderboard/top

**Description:** Get top players leaderboard

**Query Parameters:**
- `limit`: Optional, default 100, max 1000
- `offset`: Optional, default 0
- `sortBy`: Optional, "xp" | "winRate" | "level", default "xp"

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "players": [
      {
        "rank": 1,
        "userId": "string",
        "displayName": "string",
        "xp": 10000,
        "level": 10,
        "wins": 100,
        "losses": 50,
        "winRate": 0.67
      }
    ],
    "total": 1000,
    "limit": 100,
    "offset": 0
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Internal server error

---

### 4.2 GET /api/v1/leaderboard/rank/:userId

**Description:** Get player's rank

**Path Parameters:**
- `userId`: User ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "rank": 1,
    "xp": 10000,
    "level": 10,
    "wins": 100,
    "losses": 50,
    "winRate": 0.67
  }
}
```

**Error Responses:**
- `404 Not Found`: User not found
- `500 Internal Server Error`: Internal server error

---

## 5. Matchmaking Service - WebSocket Events

### 5.1 Client → Server Events

#### 5.1.1 join-queue
**Description:** Join matchmaking queue

**Event:** `join-queue`

**Payload:**
```json
{
  "playerId": "string",
  "xp": 1000
}
```

**Response:** None (server will emit `match-found` when match is found)

---

#### 5.1.2 leave-queue
**Description:** Leave matchmaking queue

**Event:** `leave-queue`

**Payload:** None

**Response:** None

---

#### 5.1.3 accept-match
**Description:** Accept match found

**Event:** `accept-match`

**Payload:**
```json
{
  "matchId": "string"
}
```

**Response:** Server emits `match-accepted` or `match-rejected`

---

#### 5.1.4 reject-match
**Description:** Reject match found

**Event:** `reject-match`

**Payload:**
```json
{
  "matchId": "string"
}
```

**Response:** Server emits `match-rejected`

---

### 5.2 Server → Client Events

#### 5.2.1 match-found
**Description:** Match found notification

**Event:** `match-found`

**Payload:**
```json
{
  "matchId": "string",
  "opponent": {
    "playerId": "string",
    "displayName": "string",
    "xp": 1000,
    "level": 5
  },
  "timeout": 30
}
```

---

#### 5.2.2 match-accepted
**Description:** Match accepted notification

**Event:** `match-accepted`

**Payload:**
```json
{
  "matchId": "string",
  "gameEngineUrl": "ws://localhost:5002"
}
```

---

#### 5.2.3 match-rejected
**Description:** Match rejected notification

**Event:** `match-rejected`

**Payload:**
```json
{
  "matchId": "string",
  "reason": "string"
}
```

---

#### 5.2.4 queue-status
**Description:** Queue status update

**Event:** `queue-status`

**Payload:**
```json
{
  "position": 5,
  "estimatedWaitTime": 15
}
```

---

## 6. Game Engine Service - WebSocket Events

### 6.1 Client → Server Events

#### 6.1.1 join-match
**Description:** Join game match

**Event:** `join-match`

**Payload:**
```json
{
  "matchId": "string",
  "playerId": "string"
}
```

**Response:** Server emits `game-state-update`

---

#### 6.1.2 fire-projectile
**Description:** Fire projectile

**Event:** `fire-projectile`

**Payload:**
```json
{
  "matchId": "string",
  "angle": 45,
  "power": 75
}
```

**Validation:**
- `angle`: Required, 0-90 degrees
- `power`: Required, 0-100

**Response:** Server emits `action-result` and `game-state-update`

---

#### 6.1.3 move-tank
**Description:** Move tank

**Event:** `move-tank`

**Payload:**
```json
{
  "matchId": "string",
  "direction": "left" | "right",
  "distance": 10
}
```

**Validation:**
- `direction`: Required, "left" or "right"
- `distance`: Required, 0-50

**Response:** Server emits `action-result` and `game-state-update`

---

#### 6.1.4 adjust-aim
**Description:** Adjust aim angle and power

**Event:** `adjust-aim`

**Payload:**
```json
{
  "matchId": "string",
  "angle": 45,
  "power": 75
}
```

**Validation:**
- `angle`: Required, 0-90 degrees
- `power`: Required, 0-100

**Response:** Server emits `game-state-update`

---

#### 6.1.5 player-ready
**Description:** Player ready notification

**Event:** `player-ready`

**Payload:**
```json
{
  "matchId": "string"
}
```

**Response:** Server emits `game-state-update`

---

### 6.2 Server → Client Events

#### 6.2.1 game-state-update
**Description:** Game state update

**Event:** `game-state-update`

**Payload:**
```json
{
  "matchId": "string",
  "gameState": {
    "status": "playing",
    "players": [
      {
        "playerId": "string",
        "username": "string",
        "health": 100,
        "maxHealth": 100,
        "position": {
          "x": 100,
          "y": 200
        },
        "angle": 45,
        "power": 75,
        "score": 0,
        "isReady": true
      }
    ],
    "currentTurn": 0,
    "round": 1,
    "maxRounds": 10,
    "roundTimeLimit": 60,
    "turnStartTime": "2024-01-01T00:00:00Z"
  }
}
```

---

#### 6.2.2 turn-started
**Description:** Turn started notification

**Event:** `turn-started`

**Payload:**
```json
{
  "matchId": "string",
  "playerId": "string",
  "timeLimit": 60
}
```

---

#### 6.2.3 action-result
**Description:** Action result notification

**Event:** `action-result`

**Payload:**
```json
{
  "matchId": "string",
  "actionId": "string",
  "success": true,
  "result": {
    "impactPosition": {
      "x": 100,
      "y": 200
    },
    "damage": 20,
    "hit": true
  }
}
```

---

#### 6.2.4 match-ended
**Description:** Match ended notification

**Event:** `match-ended`

**Payload:**
```json
{
  "matchId": "string",
  "winnerId": "string",
  "results": {
    "player1": {
      "playerId": "string",
      "health": 0,
      "score": 100,
      "isWinner": false
    },
    "player2": {
      "playerId": "string",
      "health": 50,
      "score": 200,
      "isWinner": true
    }
  },
  "xpGained": 100,
  "replayData": []
}
```

---

#### 6.2.5 game-error
**Description:** Game error notification

**Event:** `game-error`

**Payload:**
```json
{
  "matchId": "string",
  "error": "string",
  "code": "string"
}
```

---

## 7. Error Handling

### 7.1 Error Response Format

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": {},
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### 7.2 Error Codes

#### 7.2.1 Authentication Errors
- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid authentication token
- `AUTH_EXPIRED`: Authentication token expired
- `AUTH_FAILED`: Authentication failed

#### 7.2.2 Validation Errors
- `VALIDATION_ERROR`: Validation error
- `INVALID_INPUT`: Invalid input
- `MISSING_REQUIRED_FIELD`: Missing required field
- `INVALID_FORMAT`: Invalid format

#### 7.2.3 Game Errors
- `GAME_NOT_FOUND`: Game not found
- `GAME_FULL`: Game is full
- `NOT_YOUR_TURN`: Not your turn
- `INVALID_ACTION`: Invalid action
- `GAME_ENDED`: Game has ended

#### 7.2.4 Matchmaking Errors
- `ALREADY_IN_QUEUE`: Already in queue
- `MATCH_NOT_FOUND`: Match not found
- `MATCH_EXPIRED`: Match expired
- `QUEUE_FULL`: Queue is full

#### 7.2.5 Server Errors
- `INTERNAL_ERROR`: Internal server error
- `SERVICE_UNAVAILABLE`: Service unavailable
- `DATABASE_ERROR`: Database error
- `NETWORK_ERROR`: Network error

---

## 8. Rate Limiting

### 8.1 Rate Limit Headers

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

### 8.2 Rate Limit Policies

- **Authentication Endpoints:** 10 requests per minute
- **Profile Endpoints:** 100 requests per minute
- **Leaderboard Endpoints:** 100 requests per minute
- **WebSocket Events:** 60 events per minute per connection

### 8.3 Rate Limit Response

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```

---

## 9. API Versioning

### 9.1 Versioning Strategy

- **URL-based Versioning:** `/api/v1/auth/login`
- **Header-based Versioning:** `Accept: application/vnd.battlearena.v1+json`
- **Default Version:** v1

### 9.2 Version Deprecation

- **Deprecation Notice:** Include `Deprecation` header in responses
- **Sunset Date:** Include `Sunset` header with sunset date
- **Migration Guide:** Provide migration guide for deprecated versions

---

## 10. API Documentation

### 10.1 OpenAPI Specification

- **OpenAPI 3.0:** Use OpenAPI 3.0 for API documentation
- **Swagger UI:** Provide Swagger UI for API exploration
- **Postman Collection:** Provide Postman collection for testing

### 10.2 API Examples

- **Request Examples:** Provide request examples for all endpoints
- **Response Examples:** Provide response examples for all endpoints
- **Error Examples:** Provide error response examples

---

## 11. Testing

### 11.1 API Testing

- **Unit Tests:** Test individual API endpoints
- **Integration Tests:** Test API integration with services
- **End-to-End Tests:** Test complete API workflows
- **Performance Tests:** Test API performance under load

### 11.2 Test Coverage

- **Coverage Target:** 80%+ code coverage
- **Test Automation:** Automated tests in CI/CD pipeline
- **Test Documentation:** Document test cases and scenarios

---

## 12. Conclusion

### 12.1 Summary

This document provides comprehensive API specifications for all REST APIs and WebSocket events in the Battle Arena system. All APIs follow RESTful principles and industry best practices.

### 12.2 Maintenance

This document should be updated whenever APIs are added, modified, or deprecated. All API changes should be documented and communicated to the team.

### 12.3 Next Steps

1. **Implement APIs:** Implement all APIs according to specifications
2. **API Testing:** Test all APIs thoroughly
3. **API Documentation:** Generate OpenAPI documentation
4. **API Monitoring:** Monitor API performance and usage
5. **API Versioning:** Plan for API versioning and deprecation

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming - These are MANDATORY for all implementations.**

---

**Document Control:**
- **Author:** API Team
- **Reviewer:** Technical Lead
- **Approval:** CTO
- **Next Review Date:** After implementation phase

