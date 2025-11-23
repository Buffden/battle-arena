package com.battlearena.auth_service.controller;

import com.battlearena.auth_service.dto.AuthResponse;
import com.battlearena.auth_service.dto.LoginRequest;
import com.battlearena.auth_service.dto.RegisterRequest;
import com.battlearena.auth_service.dto.RegisterResponse;
import com.battlearena.auth_service.exception.InvalidCredentialsException;
import com.battlearena.auth_service.exception.UserAlreadyExistsException;
import com.battlearena.auth_service.model.User;
import com.battlearena.auth_service.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for authentication operations.
 *
 * <p>
 * This controller handles HTTP requests for authentication endpoints. It validates request data and
 * delegates business logic to UserService.
 * </p>
 *
 * <p>
 * Design Pattern: Facade Pattern - Provides simplified interface to authentication subsystem
 * </p>
 *
 * <p>
 * SOLID Principles:
 * <ul>
 * <li>SRP: Single responsibility - only handles HTTP request/response</li>
 * <li>DIP: Depends on UserService abstraction (interface), not implementation</li>
 * <li>OCP: Open for extension (can add new endpoints), closed for modification</li>
 * </ul>
 * </p>
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication API endpoints")
public class AuthController {

    private final UserService userService;

    /**
     * Constructor for dependency injection.
     *
     * @param userService the user service for business logic
     */
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user.
     *
     * <p>
     * This endpoint:
     * <ol>
     * <li>Validates the registration request using @Valid annotation</li>
     * <li>Delegates business logic to UserService.registerUser()</li>
     * <li>Maps User entity to RegisterResponse DTO</li>
     * <li>Returns HTTP 201 Created status code</li>
     * </ol>
     * </p>
     *
     * @param request the registration request containing username, email, and password
     * @return ResponseEntity with RegisterResponse containing user information and success message
     * @throws UserAlreadyExistsException if username or email already exists (handled by
     *         GlobalExceptionHandler)
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new user",
            description = "Creates a new user account with username, email, and password")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request)
            throws UserAlreadyExistsException {
        // Delegate business logic to UserService (Facade Pattern)
        User user = userService.registerUser(request);

        // Map User entity to RegisterResponse DTO (separation of concerns)
        RegisterResponse response = new RegisterResponse(user.getId(), user.getUsername(),
                user.getEmail(), "Registration successful");

        // Return HTTP 201 Created status code (REST API standard)
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login a user and return JWT token.
     *
     * <p>
     * This endpoint:
     * <ol>
     * <li>Validates the login request using @Valid annotation</li>
     * <li>Delegates authentication to UserService.loginUser()</li>
     * <li>Generates JWT token</li>
     * <li>Maps User entity to AuthResponse DTO</li>
     * <li>Returns HTTP 200 OK status code with token</li>
     * </ol>
     * </p>
     *
     * @param request the login request containing username and password
     * @return ResponseEntity with AuthResponse containing JWT token and user information
     * @throws InvalidCredentialsException if username or password is invalid (handled by
     *         GlobalExceptionHandler)
     */
    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user and returns JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request)
            throws InvalidCredentialsException {
        // Authenticate user (Facade Pattern)
        User user = userService.loginUser(request);

        // Generate JWT token
        String token = userService.generateTokenForUser(user);

        // Map User entity to AuthResponse DTO (separation of concerns)
        AuthResponse response = new AuthResponse(token, user.getId(), user.getUsername(),
                user.getEmail(), "Login successful");

        // Return HTTP 200 OK status code (REST API standard)
        return ResponseEntity.ok(response);
    }
}
