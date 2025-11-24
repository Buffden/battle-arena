package com.battlearena.auth_service.exception;

/**
 * Exception thrown when attempting to register a user that already exists
 * (username or email already in use).
 *
 * <p>This exception is used to indicate a conflict in user registration,
 * specifically when the username or email is already taken.</p>
 *
 * <p>Design Pattern: Custom exception following the Domain-Driven Design
 * principle for explicit business rule violations.</p>
 */
public class UserAlreadyExistsException extends Exception {

    /**
     * Constructs a new UserAlreadyExistsException with the specified detail message.
     *
     * @param message the detail message explaining why the user already exists
     */
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}

