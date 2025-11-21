package com.battlearena.auth_service.repository;

import com.battlearena.auth_service.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User repository interface for data access operations.
 *
 * <p>
 * This interface abstracts database operations for User entity using Repository Pattern.
 * Spring Data MongoDB automatically provides implementation based on method names.
 * </p>
 *
 * <p>
 * Design Pattern: Repository Pattern - Mediates between domain and data mapping layers
 * </p>
 *
 * <p>
 * SOLID Principles:
 * <ul>
 * <li>SRP: Single responsibility - only handles data access</li>
 * <li>DIP: Depends on abstraction (MongoRepository interface)</li>
 * <li>ISP: Specific interface for User operations only</li>
 * </ul>
 * </p>
 *
 * <p>
 * Benefits:
 * <ul>
 * <li>Decouples business logic from data access</li>
 * <li>Enables easy testing with mock repositories</li>
 * <li>Centralized data access logic</li>
 * <li>Spring Data MongoDB provides implementation automatically</li>
 * </ul>
 * </p>
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find user by username.
     *
     * @param username the username to search for
     * @return Optional containing User if found, empty otherwise
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email.
     *
     * @param email the email to search for
     * @return Optional containing User if found, empty otherwise
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if username exists.
     *
     * @param username the username to check
     * @return true if username exists, false otherwise
     */
    boolean existsByUsername(String username);

    /**
     * Check if email exists.
     *
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);
}
