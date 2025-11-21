package com.battlearena.auth_service.exception;

/**
 * Exception thrown when login credentials are invalid.
 *
 * <p>
 * This exception is thrown by UserService when:
 * <ul>
 * <li>Username is not found in database</li>
 * <li>Password doesn't match the stored password hash</li>
 * </ul>
 * </p>
 */
public class InvalidCredentialsException extends Exception {

    /**
     * Constructor with message.
     *
     * @param message the error message
     */
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
