package com.battlearena.auth_service.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler for all controllers.
 *
 * <p>
 * This class provides centralized exception handling across all REST controllers, ensuring
 * consistent error response format and proper HTTP status codes.
 * </p>
 *
 * <p>
 * Design Pattern: Global Exception Handler following the Facade Pattern to provide a unified
 * interface for error handling.
 * </p>
 *
 * <p>
 * SOLID Principles:
 * <ul>
 * <li>SRP: Single responsibility - only handles exception mapping to HTTP responses</li>
 * <li>OCP: Open for extension - can add new exception handlers without modifying existing ones</li>
 * </ul>
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles validation errors from @Valid annotations.
     *
     * @param ex the MethodArgumentNotValidException containing validation errors
     * @return ResponseEntity with error details and HTTP 400 Bad Request status
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("error", "Validation Error");
        errorResponse.put("message", "Input validation failed");

        // Extract field-specific validation errors (merge duplicate fields by keeping first occurrence)
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(error -> error.getField(),
                        error -> error.getDefaultMessage() != null ? error.getDefaultMessage()
                                : "Invalid value",
                        (existing, replacement) -> existing));

        errorResponse.put("fieldErrors", fieldErrors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }


    /**
     * Handles UserAlreadyExistsException (409 Conflict).
     *
     * @param ex the UserAlreadyExistsException
     * @return ResponseEntity with error details and HTTP 409 Conflict status
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExistsException(
            UserAlreadyExistsException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.CONFLICT.value());
        errorResponse.put("error", "User Already Exists");
        errorResponse.put("message", ex.getMessage());

        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    /**
     * Handles InvalidCredentialsException (401 Unauthorized).
     *
     * @param ex the InvalidCredentialsException
     * @return ResponseEntity with error details and HTTP 401 Unauthorized status
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentialsException(
            InvalidCredentialsException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.UNAUTHORIZED.value());
        errorResponse.put("error", "Invalid Credentials");
        errorResponse.put("message", ex.getMessage());

        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Generic exception handler for all other unhandled exceptions.
     *
     * <p>
     * This handler catches all exceptions not specifically handled above, logs them for debugging,
     * and returns a generic error response without exposing internal details to the client.
     * </p>
     *
     * @param ex the exception
     * @return ResponseEntity with generic error message and HTTP 500 Internal Server Error status
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        logger.error("An unexpected error occurred", ex);

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", "An unexpected error occurred. Please try again later.");

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

