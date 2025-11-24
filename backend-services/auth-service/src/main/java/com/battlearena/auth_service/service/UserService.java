package com.battlearena.auth_service.service;

import com.battlearena.auth_service.dto.LoginRequest;
import com.battlearena.auth_service.dto.RegisterRequest;
import com.battlearena.auth_service.exception.InvalidCredentialsException;
import com.battlearena.auth_service.exception.UserAlreadyExistsException;
import com.battlearena.auth_service.model.User;
import com.battlearena.auth_service.repository.UserRepository;
import com.battlearena.auth_service.util.JwtTokenUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * User service for business logic related to user operations.
 *
 * <p>
 * This service orchestrates user operations including registration and authentication. It
 * coordinates between repository, password encoder, and other components.
 * </p>
 *
 * <p>
 * Design Pattern: Service layer with Strategy Pattern for authentication
 * </p>
 *
 * <p>
 * SOLID Principles:
 * <ul>
 * <li>SRP: Single responsibility - only handles user business logic</li>
 * <li>DIP: Depends on abstractions (interfaces), not concrete implementations</li>
 * <li>OCP: Open for extension (can add new authentication strategies)</li>
 * </ul>
 * </p>
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * Constructor for dependency injection.
     *
     * @param userRepository the user repository for data access
     * @param passwordEncoder the password encoder for hashing passwords
     * @param jwtTokenUtil the JWT token utility for token generation
     */
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    /**
     * Register a new user.
     *
     * <p>
     * This method:
     * <ol>
     * <li>Validates username and email uniqueness</li>
     * <li>Hashes the password securely</li>
     * <li>Creates and saves the user to the database</li>
     * </ol>
     * </p>
     *
     * @param request the registration request containing username, email, and password
     * @return the created User entity
     * @throws UserAlreadyExistsException if username or email already exists
     */
    public User registerUser(RegisterRequest request) throws UserAlreadyExistsException {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Username already exists: " + request.getUsername());
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        // Hash the password securely (BCrypt with 12 rounds)
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // Create new user entity
        User user = new User(request.getUsername(), request.getEmail(), passwordHash);

        // Save user to MongoDB
        User savedUser = userRepository.save(user);

        return savedUser;
    }

    /**
     * Authenticate a user and generate JWT token.
     *
     * <p>
     * This method:
     * <ol>
     * <li>Finds user by username</li>
     * <li>Verifies password matches the stored hash</li>
     * <li>Updates lastLoginAt timestamp</li>
     * <li>Generates JWT token</li>
     * </ol>
     * </p>
     *
     * @param request the login request containing username and password
     * @return User entity with updated lastLoginAt
     * @throws InvalidCredentialsException if username not found or password doesn't match
     */
    public User loginUser(LoginRequest request) throws InvalidCredentialsException {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        // Update last login timestamp
        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return user;
    }

    /**
     * Generate JWT token for a user.
     *
     * @param user the user entity
     * @return JWT token string
     */
    public String generateTokenForUser(User user) {
        return jwtTokenUtil.generateToken(user.getUsername(), user.getId());
    }
}
