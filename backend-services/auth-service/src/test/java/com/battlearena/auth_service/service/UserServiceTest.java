package com.battlearena.auth_service.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.battlearena.auth_service.dto.RegisterRequest;
import com.battlearena.auth_service.exception.UserAlreadyExistsException;
import com.battlearena.auth_service.model.User;
import com.battlearena.auth_service.repository.UserRepository;
import com.battlearena.auth_service.util.JwtTokenUtil;

/**
 * Unit tests for UserService.
 *
 * <p>
 * Tests user registration business logic including password hashing, duplicate checks, and user
 * creation.
 * </p>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    // Test data constants (clearly marked as test-only, not real credentials)
    private static final String TEST_VALID_PASSWORD = "TestPassword123"; // Test-only password for
                                                                         // validation testing
    private static final String TEST_VALID_USERNAME = "testuser";
    private static final String TEST_VALID_EMAIL = "test@example.com";
    private static final String TEST_ANOTHER_PASSWORD = "SamePassword123"; // Another test password
                                                                           // for unique hash
                                                                           // testing

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    private PasswordEncoder passwordEncoder;

    private UserService userService;

    private RegisterRequest validRegisterRequest;
    private User savedUser;

    @BeforeEach
    void setUp() {
        // Use real BCrypt encoder to test actual password hashing
        passwordEncoder = new BCryptPasswordEncoder(12);
        // Create UserService with real password encoder for proper testing
        userService = new UserService(userRepository, passwordEncoder, jwtTokenUtil);

        // Setup valid registration request
        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setUsername(TEST_VALID_USERNAME);
        validRegisterRequest.setEmail(TEST_VALID_EMAIL);
        validRegisterRequest.setPassword(TEST_VALID_PASSWORD);

        // Setup saved user (simulating repository save)
        savedUser = new User();
        savedUser.setId("507f1f77bcf86cd799439011");
        savedUser.setUsername(TEST_VALID_USERNAME);
        savedUser.setEmail(TEST_VALID_EMAIL);
        savedUser.setPasswordHash(passwordEncoder.encode(TEST_VALID_PASSWORD));
        savedUser.setCreatedAt(LocalDateTime.now());
        savedUser.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should successfully register a new user with hashed password")
    void testRegisterUser_Success() throws UserAlreadyExistsException {
        // Given: No existing user with same username/email
        when(userRepository.existsByUsername(validRegisterRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(validRegisterRequest.getEmail())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When: Register user
        User result = userService.registerUser(validRegisterRequest);

        // Then: User should be created
        assertNotNull(result);
        assertEquals(TEST_VALID_USERNAME, result.getUsername());
        assertEquals(TEST_VALID_EMAIL, result.getEmail());
        assertNotNull(result.getPasswordHash());
        assertNotEquals(TEST_VALID_PASSWORD, result.getPasswordHash(), "Password should be hashed");
        assertTrue(result.getPasswordHash().startsWith("$2a$"), "Should use BCrypt format");
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());

        // Verify repository interactions
        verify(userRepository, times(1)).existsByUsername("testuser");
        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should hash password with BCrypt (12 rounds)")
    void testRegisterUser_PasswordHashing() throws UserAlreadyExistsException {
        // Given: No existing user
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId("507f1f77bcf86cd799439011");
            return user;
        });

        // When: Register user
        User result = userService.registerUser(validRegisterRequest);

        // Then: Password should be hashed with BCrypt
        assertNotNull(result.getPasswordHash());
        assertTrue(result.getPasswordHash().startsWith("$2a$"), "Should use BCrypt format");
        assertEquals(60, result.getPasswordHash().length(), "BCrypt hash should be 60 characters");
        assertNotEquals("TestPassword123", result.getPasswordHash(), "Should not be plain text");

        // Verify password can be matched (BCrypt verification)
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        assertTrue(encoder.matches(TEST_VALID_PASSWORD, result.getPasswordHash()),
                "Hashed password should match original password");
    }

    @Test
    @DisplayName("Should set createdAt and updatedAt timestamps")
    void testRegisterUser_Timestamps() throws UserAlreadyExistsException {
        // Given: No existing user
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        LocalDateTime beforeRegistration = LocalDateTime.now();

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId("507f1f77bcf86cd799439011");
            return user;
        });

        // When: Register user
        User result = userService.registerUser(validRegisterRequest);
        LocalDateTime afterRegistration = LocalDateTime.now();

        // Then: Timestamps should be set
        assertNotNull(result.getCreatedAt(), "createdAt should be set");
        assertNotNull(result.getUpdatedAt(), "updatedAt should be set");
        assertTrue(result.getCreatedAt().isAfter(beforeRegistration.minusSeconds(1)),
                "createdAt should be set to current time");
        assertTrue(result.getCreatedAt().isBefore(afterRegistration.plusSeconds(1)),
                "createdAt should be set to current time");

        // Timestamps should be very close (within 1 second) - they're set at slightly different
        // times
        long secondsBetween = java.time.Duration
                .between(result.getCreatedAt(), result.getUpdatedAt()).getSeconds();
        assertTrue(Math.abs(secondsBetween) <= 1,
                "createdAt and updatedAt should be within 1 second of each other for new user");
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when username already exists")
    void testRegisterUser_DuplicateUsername() {
        // Given: Username already exists
        when(userRepository.existsByUsername(validRegisterRequest.getUsername())).thenReturn(true);

        // When/Then: Should throw UserAlreadyExistsException
        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class,
                () -> userService.registerUser(validRegisterRequest));

        assertTrue(exception.getMessage().contains("Username already exists"));
        assertTrue(exception.getMessage().contains("testuser"));

        // Verify repository was checked but user was not saved
        verify(userRepository, times(1)).existsByUsername("testuser");
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when email already exists")
    void testRegisterUser_DuplicateEmail() {
        // Given: Username doesn't exist but email does
        when(userRepository.existsByUsername(validRegisterRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(validRegisterRequest.getEmail())).thenReturn(true);

        // When/Then: Should throw UserAlreadyExistsException
        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class,
                () -> userService.registerUser(validRegisterRequest));

        assertTrue(exception.getMessage().contains("Email already exists"));
        assertTrue(exception.getMessage().contains("test@example.com"));

        // Verify repository checks were made but user was not saved
        verify(userRepository, times(1)).existsByUsername("testuser");
        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when both username and email exist")
    void testRegisterUser_BothUsernameAndEmailExist() {
        // Given: Both username and email already exist
        when(userRepository.existsByUsername(validRegisterRequest.getUsername())).thenReturn(true);

        // When/Then: Should throw UserAlreadyExistsException (checked for username first)
        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class,
                () -> userService.registerUser(validRegisterRequest));

        assertTrue(exception.getMessage().contains("Username already exists"));

        // Verify only username was checked (short-circuit behavior)
        verify(userRepository, times(1)).existsByUsername("testuser");
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should create unique password hashes for same password")
    void testRegisterUser_UniquePasswordHashes() throws UserAlreadyExistsException {
        // Given: No existing users, same password for two users
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId("507f1f77bcf86cd799439011");
            return user;
        });

        // When: Register two users with same password
        RegisterRequest request1 =
                new RegisterRequest("user1", "user1@test.com", TEST_ANOTHER_PASSWORD);
        RegisterRequest request2 =
                new RegisterRequest("user2", "user2@test.com", TEST_ANOTHER_PASSWORD);

        User user1 = userService.registerUser(request1);
        User user2 = userService.registerUser(request2);

        // Then: Password hashes should be different (BCrypt uses salt)
        assertNotEquals(user1.getPasswordHash(), user2.getPasswordHash(),
                "Same password should produce different hashes (salt)");
    }
}

