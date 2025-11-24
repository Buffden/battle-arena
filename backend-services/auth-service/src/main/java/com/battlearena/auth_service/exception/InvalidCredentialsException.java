package com.battlearena.auth_service.exception;

/**
 * Exception thrown when authentication fails due to invalid credentials
 * (username not found or password mismatch).
 *
 * <p>This exception is used to indicate that login attempt failed because
 * the provided credentials are incorrect.</p>
 *
 * <p>Design Pattern: Custom exception following the Domain-Driven Design
 * principle for explicit business rule violations.</p>
 */
public class InvalidCredentialsException extends Exception {

    /**
     * Constructs a new InvalidCredentialsException with the specified detail message.
     *
     * @param message the detail message explaining why the credentials are invalid
     */
    public InvalidCredentialsException(String message) {
        super(message);
    }
}

