# EPIC-VS-2: Player Authentication & Identity

**Copy and paste this template directly into GitHub Issues.**

**Note:** All technical implementation details from Phase 2 (Authentication) and Phase 7 (Frontend) have been consolidated into this file. You no longer need to reference multiple Phase documents when creating GitHub issues.

---

## EPIC-VS-2: Player Authentication & Identity

### Issue Template:

```
Title: EPIC-VS-2: Player Authentication & Identity

Description:
## Overview
Implement the second vertical slice where a player can register, login, and logout. This epic establishes player identity and authentication, which is the foundation for all future gameplay features. Players must be able to create accounts and securely access the game.

**This is the second vertical slice** - it enables all future features by establishing player identity.

## Vertical Slice Goal
A player can:
1. Register a new account with username, email, and password
2. Login with their credentials and receive a JWT token
3. Logout and securely end their session

## Success Criteria
- [ ] Player can register with username, email, and password
- [ ] Player can login with credentials and receive JWT token
- [ ] Player can logout and session is terminated
- [ ] Passwords are securely hashed (BCrypt, never stored in plain text)
- [ ] JWT tokens are generated with proper claims and expiration
- [ ] Frontend can store and use JWT tokens for authenticated requests
- [ ] End-to-end flow works: Register → Login → Access protected route → Logout

## Technical References

### Phase Documents (Technical Implementation Details)
This epic references Phase 2 (Authentication) for technical specifications.

- **Auth Service:** See Phase 2 (PHASE-2 issue) - STORY-2-1, STORY-2-2, STORY-2-3
- **Frontend:** See Phase 7 (PHASE-7 issue) - STORY-7-2 (Authentication UI)

### Architecture References

**Sequence Diagrams:**
- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/authentication-flow.puml)
- [Session Timeout Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/session-timeout-flow.puml)
- [Sequence Diagrams Index](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/README.md)

**Class Diagrams:**
- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/auth-service.puml)
- [Database Schema Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/database-schema.puml)
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml)

**ER Diagrams:**
- [Database ER Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/er-diagrams/database-er-diagram.puml) - Entity relationships

**Architecture Documents:**
- [System Architecture - Auth Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#21-auth-service)
- [Auth Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md)
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)
- [Frontend Components Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md)
- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md)

## Stories (Player Experience)

### VS-2-1: Player can register
**User Story:** As a player, I want to register with username, email, and password so that I can create an account and play the game.

**Acceptance Criteria:**
- [ ] Registration form visible on frontend
- [ ] Player can enter username, email, and password
- [ ] Form validates input (username length, email format, password strength)
- [ ] Registration request sent to Auth Service
- [ ] Auth Service validates username/email uniqueness
- [ ] Password is hashed with BCrypt (12 rounds) before storing
- [ ] User account created in MongoDB
- [ ] Success message displayed to player
- [ ] Player redirected to login page after successful registration

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-2-1-1: Auth Service Foundation Setup**

**Description:**
Set up the Spring Boot project structure, dependencies, and configuration for the Auth Service. This is a prerequisite for all other tasks.

**Related Diagrams & Documents:**
- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/auth-service.puml)
- [System Architecture - Auth Service](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md#21-auth-service)
- [Auth Service Low-Level Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md)

**Acceptance Criteria:**
- [ ] Maven project structure created
- [ ] Package structure follows clean architecture
- [ ] Main Application class created
- [ ] All Maven dependencies added (Spring Boot, Security, MongoDB, JWT, Validation, Swagger)
- [ ] application.properties configured (port 8081, MongoDB URI, JWT secret/expiration, CORS)
- [ ] Health check endpoint working (/health)
- [ ] Swagger/OpenAPI configured and accessible

**Technical Details:**

**Project Structure:**
```

src/main/java/com/battlearena/auth/

- Application.java
- config/
- controller/
- service/
- repository/
- model/
- dto/
- security/
- exception/
  src/main/resources/
- application.properties
  pom.xml

````

**Package Organization:**
- **controller/** - REST API endpoints (AuthController)
- **service/** - Business logic (AuthService, UserService)
- **repository/** - Data access layer (UserRepository)
- **model/** - Entity classes (User)
- **dto/** - Data Transfer Objects (Request/Response DTOs)
- **config/** - Configuration classes (SecurityConfig, SwaggerConfig)
- **security/** - Security components (JwtTokenManager, JwtAuthenticationFilter)
- **exception/** - Exception handlers (GlobalExceptionHandler)

**Required Dependencies (pom.xml):**
- spring-boot-starter-web
- spring-boot-starter-security
- spring-boot-starter-data-mongodb
- io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson
- spring-boot-starter-validation
- lombok (optional)
- spring-boot-starter-test
- springdoc-openapi-starter-webmvc-ui (Swagger/OpenAPI)

**Application Properties:**
```properties
# Server Configuration
server.port=8081
spring.application.name=auth-service

# MongoDB Configuration
spring.data.mongodb.uri=${MONGODB_URI:mongodb://mongodb:27017/battlearena}
spring.data.mongodb.database=battlearena

# JWT Configuration
jwt.secret=${JWT_SECRET:your-secret-key-change-in-production}
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=*

# Logging
logging.level.com.battlearena.auth=INFO
````

---

**TASK-VS-2-1-2: User Registration Feature (DB + BE + FE)**

**Description:**
Implement complete user registration feature including database model, backend API, password hashing, and frontend registration form. This task combines all registration-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/authentication-flow.puml) - Registration flow
- [Database Schema Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/database-schema.puml) - User entity structure
- [Database ER Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/er-diagrams/database-er-diagram.puml) - User entity relationships
- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/auth-service.puml) - Service layer structure
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - AuthService and components
- [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md) - User collection schema

**Acceptance Criteria:**

- [ ] User model/entity created with MongoDB annotations and validation
- [ ] UserRepository interface created with query methods
- [ ] Password hashing with BCrypt (12 rounds) configured
- [ ] UserService with registration business logic implemented
- [ ] RegisterRequest and RegisterResponse DTOs created
- [ ] POST /api/auth/register endpoint created in AuthController
- [ ] Registration component created with reactive form
- [ ] Form validation (username, email, password)
- [ ] UserService.registerUser() method implemented
- [ ] Error handling for duplicate username/email
- [ ] Success message and redirect to login page
- [ ] End-to-end test: Fill form → Submit → User created in DB → Success message

**Technical Details:**

**Backend - Database & Model:**
**File:** `com.battlearena.auth.model.User`

```java
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String passwordHash; // Hashed with BCrypt

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
}
```

**Backend - Repository:**
**File:** `com.battlearena.auth.repository.UserRepository`

```java
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
```

**Backend - Password Hashing:**
**File:** `com.battlearena.auth.config.SecurityConfig`

```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // 12 rounds for high security
    }
}
```

**Backend - Service:**
**File:** `com.battlearena.auth.service.UserService`

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenManager jwtTokenManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenManager jwtTokenManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenManager = jwtTokenManager;
    }

    public User registerUser(RegisterRequest request) throws UserAlreadyExistsException {
        // 1. Validate input (username, email format)
        // 2. Check if username exists (UserRepository.existsByUsername)
        // 3. Check if email exists (UserRepository.existsByEmail)
        // 4. Hash password (PasswordEncoder.encode)
        // 5. Create User entity
        // 6. Save to MongoDB (UserRepository.save)
        // 7. Return created user
    }

    public AuthResponse loginUser(LoginRequest request) throws InvalidCredentialsException {
        // 1. Find user by username (UserRepository.findByUsername)
        // 2. Verify password (PasswordEncoder.matches)
        // 3. Generate JWT token (JwtTokenManager.generateToken)
        // 4. Return AuthResponse with token and user info
    }
}
```

**Backend - DTOs:**
**RegisterRequest:**

```java
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
```

**RegisterResponse:**

```java
public class RegisterResponse {
    private String id;
    private String username;
    private String email;
    private String message;
}
```

**Backend - Controller:**
**File:** `com.battlearena.auth.controller.AuthController`

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<RegisterResponse> register(
        @Valid @RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);
        RegisterResponse response = new RegisterResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setMessage("Registration successful");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

**Frontend - Registration Component:**
**File:** `src/app/auth/components/register/register.component.ts`

```typescript
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(["/auth/login"]);
        },
        error: (error) => {
          this.errorMessage = error.error.message || "Registration failed";
          this.loading = false;
        },
      });
    }
  }
}
```

**Frontend - AuthService.register() method:**
**File:** `src/app/services/auth.service.ts`

```typescript
register(userData: RegisterRequest): Observable<RegisterResponse> {
  return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
}
```

**End-to-End Test Scenario:**

1. Navigate to registration page
2. Fill form with username, email, password
3. Submit form
4. Verify API call to POST /api/auth/register
5. Verify user created in MongoDB with hashed password
6. Verify success message displayed
7. Verify redirect to login page
8. Test duplicate username/email shows error

**Definition of Done:**

- Player can fill registration form → submit → see success message
- User account exists in MongoDB with hashed password
- Duplicate username/email shows error message

---

### VS-2-2: Player can login

**User Story:** As a player, I want to login with my username and password so that I can access the game.

**Acceptance Criteria:**

- [ ] Login form visible on frontend
- [ ] Player can enter username and password
- [ ] Login request sent to Auth Service
- [ ] Auth Service validates credentials
- [ ] JWT token generated with proper claims (username, expiration)
- [ ] JWT token returned to frontend
- [ ] Frontend stores JWT token (HTTP-only cookie or secure storage)
- [ ] Player redirected to dashboard after successful login
- [ ] Invalid credentials show error message

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-2-2-1: User Login Feature (BE + FE)**

**Description:**
Implement complete user login feature including JWT token generation, backend login endpoint, and frontend login form. This task combines all login-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/authentication-flow.puml) - Login flow
- [Session Timeout Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/session-timeout-flow.puml) - Token expiration handling
- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/auth-service.puml) - JWT service structure
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - AuthService login methods
- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - JWT implementation details

**Acceptance Criteria:**

- [ ] JWT utility class (JwtTokenManager) created with token generation and validation
- [ ] JWT secret and expiration configured in application.properties
- [ ] UserService.loginUser() method implemented with credential validation
- [ ] LoginRequest and LoginResponse DTOs created
- [ ] POST /api/auth/login endpoint created in AuthController
- [ ] Login component created with reactive form
- [ ] Form validation (username, password required)
- [ ] UserService.loginUser() method implemented
- [ ] JWT token stored in localStorage
- [ ] Error handling for invalid credentials
- [ ] Success redirect to dashboard
- [ ] End-to-end test: Fill form → Submit → JWT received → Redirect to dashboard

**Technical Details:**

**Backend - JWT Utility:**
**File:** `com.battlearena.auth.security.JwtTokenManager`

```java
public class JwtTokenManager {
    String generateToken(User user);
    Claims validateToken(String token) throws JwtException;
    String extractUsername(String token);
    boolean isTokenExpired(String token);
}
```

**JWT Configuration:**

- Algorithm: HS512 (HMAC with SHA-512)
- Expiration: 24 hours (86400000 milliseconds)
- Secret Key: Read from environment variable (JWT_SECRET)
- Claims: username, expiration, issuedAt

**Backend - Internal DTO:**
**AuthResponse (used internally by UserService):**

```java
public class AuthResponse {
    private String token;
    private String username;
    private String email;
}
```

**Backend - DTOs:**
**LoginRequest:**

```java
public class LoginRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
```

**LoginResponse:**

```java
public class LoginResponse {
    private String token;
    private String username;
    private String email;
    private String message;
}
```

**Backend - Controller:**
**File:** `com.battlearena.auth.controller.AuthController`

```java
@PostMapping("/login")
@Operation(summary = "Login user")
public ResponseEntity<LoginResponse> login(
    @Valid @RequestBody LoginRequest request) {
    AuthResponse authResponse = userService.loginUser(request);
    LoginResponse response = new LoginResponse();
    response.setToken(authResponse.getToken());
    response.setUsername(authResponse.getUsername());
    response.setEmail(authResponse.getEmail());
    response.setMessage("Login successful");
    return ResponseEntity.ok(response);
}
```

**Frontend - Login Component:**
**File:** `src/app/auth/components/login/login.component.ts`

```typescript
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: () => {
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.errorMessage = error.error.message || "Login failed";
          this.loading = false;
        },
      });
    }
  }
}
```

**Frontend - AuthService.login() method:**
**File:** `src/app/services/auth.service.ts`

```typescript
login(username: string, password: string): Observable<LoginResponse> {
  return this.http
    .post<LoginResponse>(`${this.apiUrl}/login`, {
      username,
      password,
    })
    .pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setUser(response.user);
      }),
    );
}
```

**End-to-End Test Scenario:**

1. Navigate to login page
2. Fill form with username and password
3. Submit form
4. Verify API call to POST /api/auth/login
5. Verify JWT token received and stored
6. Verify redirect to dashboard
7. Test invalid credentials show error message

**Definition of Done:**

- Player can enter credentials → login → receive JWT token
- JWT token stored securely in frontend
- Player can access protected routes with JWT token
- Invalid credentials show error message

---

**TASK-VS-2-2-2: Auth Infrastructure (JWT Storage, Guards, Interceptors)**

**Description:**
Implement shared authentication infrastructure including JWT storage, HTTP interceptor, and route guards. This is shared infrastructure used by both login and logout features.

**Related Diagrams & Documents:**

- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - AuthService, Guards, Interceptors
- [Session Timeout Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/session-timeout-flow.puml) - Token validation flow
- [Frontend Components Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) - Component architecture

**Acceptance Criteria:**

- [ ] HTTP interceptor created for JWT injection
- [ ] Interceptor adds Authorization header to requests
- [ ] Interceptor handles 401 errors and redirects to login
- [ ] AuthGuard created for route protection
- [ ] Guard checks authentication state
- [ ] Guard redirects unauthenticated users to login
- [ ] JWT storage mechanism implemented securely
- [ ] Token expiration handling
- [ ] Unit tests for interceptor
- [ ] Unit tests for guard

**Technical Details:**

**HTTP Interceptor:**
**File:** `src/app/interceptors/auth.interceptor.ts`

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(["/auth/login"]);
        }
        return throwError(() => error);
      }),
    );
  }
}
```

**AuthGuard:**
**File:** `src/app/guards/auth.guard.ts`

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(["/auth/login"]);
      return false;
    }
  }
}
```

---

### VS-2-3: Player can logout

**User Story:** As a player, I want to logout so that I can securely end my session.

**Acceptance Criteria:**

- [ ] Logout button visible when player is logged in
- [ ] Clicking logout removes JWT token from storage
- [ ] Player redirected to login page
- [ ] Player cannot access protected routes after logout
- [ ] Session is terminated on client side

**Related Tasks (Detailed Technical Implementation):**

**TASK-VS-2-3-1: User Logout Feature (BE + FE)**

**Description:**
Implement complete user logout feature including optional backend logout endpoint and frontend logout functionality. This task combines all logout-related work for end-to-end testing.

**Related Diagrams & Documents:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/authentication-flow.puml) - Logout flow
- [Frontend Components Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml) - AuthService logout method
- [Auth Service Class Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/auth-service.puml) - Logout endpoint

**Acceptance Criteria:**

- [ ] POST /api/auth/logout endpoint created (optional - JWT logout is typically client-side)
- [ ] Logout method in AuthService clears token
- [ ] Logout method clears user state
- [ ] Logout button in navigation component
- [ ] Redirect to login after logout
- [ ] Player cannot access protected routes after logout
- [ ] End-to-end test: Click logout → Token removed → Redirect to login → Cannot access protected routes

**Technical Details:**

**Backend - Logout Response DTO:**
**LogoutResponse:**

```java
public class LogoutResponse {
    private String message;

    public LogoutResponse(String message) {
        this.message = message;
    }

    // Getters and setters
}
```

**Backend - Logout Endpoint (Optional):**
**File:** `com.battlearena.auth.controller.AuthController`

```java
@PostMapping("/logout")
@Operation(summary = "Logout user")
public ResponseEntity<LogoutResponse> logout() {
    // Optionally invalidate token (if using blacklist)
    // Return success response
    return ResponseEntity.ok(new LogoutResponse("Logout successful"));
}
```

**Note:** For JWT-based authentication, logout is typically handled client-side by removing the token. Server-side logout is optional and may require a token blacklist.

**Frontend - Logout in AuthService:**
**File:** `src/app/services/auth.service.ts`

```typescript
logout(): void {
  localStorage.removeItem("token");
  this.currentUserSubject.next(null);
  this.router.navigate(["/auth/login"]);
}
```

**Frontend - Logout Button Component:**
**File:** `src/app/components/navigation/navigation.component.ts`

```typescript
import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
})
export class NavigationComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
```

**End-to-End Test Scenario:**

1. Player is logged in
2. Click logout button
3. Verify JWT token removed from localStorage
4. Verify user state cleared
5. Verify redirect to login page
6. Verify cannot access protected routes
7. Verify new login required to access game

**Definition of Done:**

- Player clicks logout → token removed → redirected to login
- Player cannot access protected routes after logout
- New login required to access game

---

## Integration Testing

**Related Diagrams:**

- [Authentication Flow Sequence Diagram](https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/sequence-diagrams/authentication-flow.puml) - Complete authentication flow

### End-to-End Test Scenario

```
1. Navigate to registration page
2. Fill registration form (username, email, password)
3. Submit registration
4. See success message
5. Navigate to login page
6. Enter credentials
7. Submit login
8. Receive JWT token
9. Access protected route (dashboard)
10. Click logout
11. Verify redirected to login
12. Verify cannot access protected route

```

**Test should pass:** ✅ All steps complete without errors

---

## Security Requirements

**Related Documents:**

- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Complete security implementation guide

### Password Security

- Passwords must be hashed with BCrypt (12 rounds minimum)
- Passwords never stored in plain text
- Password validation (minimum length, complexity if required)

### JWT Token Security

- JWT algorithm: HS512 (HMAC with SHA-512)
- Token expiration: 24 hours
- Secret key stored in environment variables (never in code)
- Token stored securely (HTTP-only cookies preferred, or secure localStorage)

### Input Validation

- Username validation (length, characters)
- Email validation (format)
- Password validation (strength requirements)
- Server-side validation (never trust client)

---

## Dependencies

### Prerequisites

- ✅ Phase 1 (Foundation) must be completed
  - [Phase 1 Foundation Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_1_FOUNDATION.md)
- ✅ MongoDB running (via Docker Compose)
  - [Database Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/06-DATABASE_DESIGN.md)
- ✅ Nginx API Gateway configured
  - [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md)

### Blocking Issues

- EPIC-VS-1 (Foundation) must be completed first

---

## Technical Debt & Future Enhancements

### Not in Scope (For Future Epics)

- Google OAuth login (can be added in VS-4 or later)
- Password reset functionality
- Email verification
- Refresh tokens (if needed for longer sessions)
- Two-factor authentication

### Marked for Future

- [ ] Google OAuth integration (optional feature)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Session refresh mechanism

---

## Labels

epic:vertical-slice, epic:authentication, priority:high, milestone:VS-2

## Milestone

VS-2: Player Authentication & Identity

## Related Epics

- EPIC-VS-1: Foundation & Infrastructure Setup (prerequisite)
- EPIC-VS-3: First Playable Match (depends on VS-2)
- EPIC-VS-4: Profile & Progression (depends on VS-2)

```

---

## How to Use This Template

1. **Create Epic Issue:**

   - Copy the EPIC-VS-2 template above
   - Create issue in GitHub
   - Assign to milestone "VS-2: Player Authentication & Identity"

2. **Create Story Issues:**

   - For each VS-2-X story, create a separate issue
   - Link to EPIC-VS-2 as parent
   - Copy tasks from Phase 2 documents
   - Link to Phase 2 issues for technical reference

3. **Create Task Issues:**

   - For each task, create subtask or separate issue
   - Link to story as parent
   - Reference Phase 2 document for technical details

4. **Track Progress:**
   - Use GitHub Projects Kanban board
   - Move stories through: Backlog → To Do → In Progress → Review → Done
   - Update epic when all stories complete

---

## Example Story Issue (VS-2-1)

```

Title: VS-2-1: Player can register

Description:

## Epic

Related to #X (EPIC-VS-2 issue number)

## User Story

As a player, I want to register with username, email, and password so that I can create an account and play the game.

## Acceptance Criteria

[Copy from EPIC-VS-2 above]

## Technical Reference

- **Auth Service:** See Phase 2, STORY-2-2
  - [Phase 2 Authentication Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_2_AUTHENTICATION.md)
- **Frontend:** See Phase 7, STORY-7-2
  - [Phase 7 Frontend Document](https://github.com/Buffden/battle-arena/blob/main/docs/05-PROJECT_MANAGEMENT/ISSUE_TEMPLATES/PHASE_7_FRONTEND.md) (if exists)

## Tasks

- TASK-VS-2-1-2: User Registration Feature (DB + BE + FE)
  - Implementation: Complete registration feature with database, backend, and frontend

- TASK-VS-2-2-1: User Login Feature (BE + FE)
  - Implementation: Complete login feature with JWT token generation

- TASK-VS-2-2-2: Auth Infrastructure (JWT Storage, Guards, Interceptors)
  - Implementation: Shared authentication infrastructure

- TASK-VS-2-3-1: User Logout Feature (BE + FE)
  - Implementation: Complete logout feature

## Labels

story:vertical-slice, backend:auth, frontend, priority:high

## Milestone

VS-2: Player Authentication & Identity

```

---

**This template demonstrates how to:**

1. Structure vertical slice epics with player focus
2. Reference Phase documents for technical details
3. Break down into player-focused stories
4. Pull tasks from Phase documents
5. Define clear acceptance criteria and definitions of done
```
