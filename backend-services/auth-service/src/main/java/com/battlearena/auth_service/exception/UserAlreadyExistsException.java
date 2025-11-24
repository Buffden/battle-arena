package com.battlearena.auth_service.exception;

/**
 * Exception thrown when attempting to register a user with a username or email
 * that already exists in the database.
 *
 * <p>
 * This exception is thrown by UserService when a registration request contains
 * a username or email that is already in use.
 * </p>
 */
public class UserAlreadyExistsException extends Exception {

    /**
     * Constructor with message.
     *
     * @param message the error message
     */
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
