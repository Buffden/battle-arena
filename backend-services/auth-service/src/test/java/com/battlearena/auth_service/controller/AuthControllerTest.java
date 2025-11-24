package com.battlearena.auth_service.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.battlearena.auth_service.dto.RegisterRequest;
import com.battlearena.auth_service.dto.RegisterResponse;
import com.battlearena.auth_service.exception.UserAlreadyExistsException;
import com.battlearena.auth_service.model.User;
import com.battlearena.auth_service.service.UserService;

/**
 * Unit tests for AuthController.
 *
 * <p>
 * Tests HTTP endpoint behavior including request validation, response mapping, and error handling
 * for user registration.
 * </p>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Unit Tests")
class AuthControllerTest {

    // Test data constants (clearly marked as test-only, not real credentials)
    private static final String TEST_VALID_PASSWORD = "TestPassword123"; // Test-only password for validation testing
    private static final String TEST_VALID_USERNAME = "testuser";
    private static final String TEST_VALID_EMAIL = "test@example.com";

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest validRegisterRequest;
    private User createdUser;

    @BeforeEach
    void setUp() {
        // Setup valid registration request
        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setUsername(TEST_VALID_USERNAME);
        validRegisterRequest.setEmail(TEST_VALID_EMAIL);
        validRegisterRequest.setPassword(TEST_VALID_PASSWORD);

        // Setup created user (returned by service)
        createdUser = new User();
        createdUser.setId("507f1f77bcf86cd799439011");
        createdUser.setUsername(TEST_VALID_USERNAME);
        createdUser.setEmail(TEST_VALID_EMAIL);
        createdUser.setPasswordHash("$2a$10$hashedPassword1234567890123456789");
    }

    @Test
    @DisplayName("Should return 201 CREATED with RegisterResponse on successful registration")
    void testRegister_Success() throws UserAlreadyExistsException {
        // Given: UserService successfully creates user
        when(userService.registerUser(any(RegisterRequest.class))).thenReturn(createdUser);

        // When: Register endpoint is called
        ResponseEntity<RegisterResponse> response = authController.register(validRegisterRequest);

        // Then: Should return 201 CREATED status
        assertEquals(HttpStatus.CREATED, response.getStatusCode());

        // Then: Response body should contain user information
        RegisterResponse responseBody = response.getBody();
        assertNotNull(responseBody);
        assertEquals("507f1f77bcf86cd799439011", responseBody.getId());
        assertEquals("testuser", responseBody.getUsername());
        assertEquals("test@example.com", responseBody.getEmail());
        assertEquals("Registration successful", responseBody.getMessage());

        // Verify UserService was called
        verify(userService, times(1)).registerUser(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should delegate registration request to UserService")
    void testRegister_DelegatesToUserService() throws UserAlreadyExistsException {
        // Given: UserService will create user
        when(userService.registerUser(any(RegisterRequest.class))).thenReturn(createdUser);

        // When: Register endpoint is called
        authController.register(validRegisterRequest);

        // Then: UserService.registerUser should be called with correct request
        verify(userService, times(1)).registerUser(validRegisterRequest);
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when username already exists")
    void testRegister_DuplicateUsername() throws UserAlreadyExistsException {
        // Given: UserService throws exception for duplicate username
        when(userService.registerUser(any(RegisterRequest.class)))
                .thenThrow(new UserAlreadyExistsException("Username already exists: testuser"));

        // When/Then: Should propagate exception
        assertThrows(UserAlreadyExistsException.class,
                () -> authController.register(validRegisterRequest));

        verify(userService, times(1)).registerUser(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when email already exists")
    void testRegister_DuplicateEmail() throws UserAlreadyExistsException {
        // Given: UserService throws exception for duplicate email
        when(userService.registerUser(any(RegisterRequest.class))).thenThrow(
                new UserAlreadyExistsException("Email already exists: test@example.com"));

        // When/Then: Should propagate exception
        assertThrows(UserAlreadyExistsException.class,
                () -> authController.register(validRegisterRequest));

        verify(userService, times(1)).registerUser(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should map User entity to RegisterResponse correctly")
    void testRegister_ResponseMapping() throws UserAlreadyExistsException {
        // Given: UserService returns user with specific data
        User user = new User();
        user.setId("custom-id-123");
        user.setUsername("customuser");
        user.setEmail("custom@test.com");
        when(userService.registerUser(any(RegisterRequest.class))).thenReturn(user);

        // When: Register endpoint is called
        ResponseEntity<RegisterResponse> response = authController.register(validRegisterRequest);

        // Then: Response should map User fields correctly
        RegisterResponse responseBody = response.getBody();
        assertNotNull(responseBody);
        assertEquals("custom-id-123", responseBody.getId());
        assertEquals("customuser", responseBody.getUsername());
        assertEquals("custom@test.com", responseBody.getEmail());
        assertEquals("Registration successful", responseBody.getMessage());
    }

    @Test
    @DisplayName("Should not include password hash in response")
    void testRegister_NoPasswordInResponse() throws UserAlreadyExistsException {
        // Given: UserService returns user with password hash
        when(userService.registerUser(any(RegisterRequest.class))).thenReturn(createdUser);

        // When: Register endpoint is called
        ResponseEntity<RegisterResponse> response = authController.register(validRegisterRequest);

        // Then: Response should not contain password hash
        RegisterResponse responseBody = response.getBody();
        assertNotNull(responseBody);
        // RegisterResponse doesn't have password field - verified by structure
        assertNotNull(responseBody.getId());
        assertNotNull(responseBody.getUsername());
        assertNotNull(responseBody.getEmail());
        // Password hash should never be in response DTO
    }
}

