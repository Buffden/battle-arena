package com.battlearena.auth_service.exception;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Unit tests for GlobalExceptionHandler.
 *
 * <p>
 * Tests that all exception handlers return correct HTTP status codes and error response formats.
 * </p>
 */
@DisplayName("GlobalExceptionHandler Tests")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException and return 400 with field errors")
    void handleValidationExceptions_ShouldReturn400_WithFieldErrors() {
        // Mock MethodArgumentNotValidException with field errors
        BindingResult bindingResult = org.mockito.Mockito.mock(BindingResult.class);
        FieldError usernameError =
                new FieldError("registerRequest", "username", "Username is required");
        FieldError emailError = new FieldError("registerRequest", "email", "Email must be valid");
        org.mockito.Mockito.when(bindingResult.getFieldErrors())
                .thenReturn(List.of(usernameError, emailError));

        // Create a dummy MethodParameter for the exception constructor
        @SuppressWarnings("null")
        MethodArgumentNotValidException exception =
                new MethodArgumentNotValidException(null, bindingResult);

        // When: Exception is handled
        ResponseEntity<Map<String, Object>> response =
                exceptionHandler.handleValidationExceptions(exception);

        // Then: Should return 400 Bad Request
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        // Then: Response body should contain error details
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(400, body.get("status"));
        assertEquals("Validation Error", body.get("error"));
        assertEquals("Input validation failed", body.get("message"));
        assertNotNull(body.get("timestamp"));

        // Then: Should contain field errors
        @SuppressWarnings("unchecked")
        Map<String, String> fieldErrors = (Map<String, String>) body.get("fieldErrors");
        assertNotNull(fieldErrors);
        assertTrue(fieldErrors.containsKey("username"));
        assertTrue(fieldErrors.containsKey("email"));
        assertEquals("Username is required", fieldErrors.get("username"));
        assertEquals("Email must be valid", fieldErrors.get("email"));
    }

    @Test
    @DisplayName("Should handle UserAlreadyExistsException and return 409")
    void handleUserAlreadyExistsException_ShouldReturn409() {
        // Given: UserAlreadyExistsException with message
        String errorMessage = "Username already exists: testuser";
        UserAlreadyExistsException exception = new UserAlreadyExistsException(errorMessage);

        // When: Exception is handled
        ResponseEntity<Map<String, Object>> response =
                exceptionHandler.handleUserAlreadyExistsException(exception);

        // Then: Should return 409 Conflict
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());

        // Then: Response body should contain error details
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(409, body.get("status"));
        assertEquals("User Already Exists", body.get("error"));
        assertEquals(errorMessage, body.get("message"));
        assertNotNull(body.get("timestamp"));
    }

    @Test
    @DisplayName("Should handle InvalidCredentialsException and return 401")
    void handleInvalidCredentialsException_ShouldReturn401() {
        // Given: InvalidCredentialsException with message
        String errorMessage = "Invalid username or password";
        InvalidCredentialsException exception = new InvalidCredentialsException(errorMessage);

        // When: Exception is handled
        ResponseEntity<Map<String, Object>> response =
                exceptionHandler.handleInvalidCredentialsException(exception);

        // Then: Should return 401 Unauthorized
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());

        // Then: Response body should contain error details
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(401, body.get("status"));
        assertEquals("Invalid Credentials", body.get("error"));
        assertEquals(errorMessage, body.get("message"));
        assertNotNull(body.get("timestamp"));
    }

    @Test
    @DisplayName("Should handle generic Exception and return 500")
    void handleGenericException_ShouldReturn500() {
        // Given: Generic exception
        RuntimeException exception = new RuntimeException("Unexpected error occurred");

        // When: Exception is handled
        ResponseEntity<Map<String, Object>> response =
                exceptionHandler.handleGenericException(exception);

        // Then: Should return 500 Internal Server Error
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

        // Then: Response body should contain generic error message (not exposing internal details)
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(500, body.get("status"));
        assertEquals("Internal Server Error", body.get("error"));
        assertEquals("An unexpected error occurred. Please try again later.", body.get("message"));
        assertNotNull(body.get("timestamp"));
    }

    @Test
    @DisplayName("Should include timestamp in all error responses")
    void allErrorResponses_ShouldIncludeTimestamp() {
        BindingResult bindingResult = org.mockito.Mockito.mock(BindingResult.class);
        org.mockito.Mockito.when(bindingResult.getFieldErrors()).thenReturn(List.of());
        @SuppressWarnings("null")
        MethodArgumentNotValidException validationException =
                new MethodArgumentNotValidException(null, bindingResult);
        ResponseEntity<Map<String, Object>> validationResponse =
                exceptionHandler.handleValidationExceptions(validationException);
        Map<String, Object> validationBody = validationResponse.getBody();
        assertNotNull(validationBody);
        assertNotNull(validationBody.get("timestamp"));
        assertInstanceOf(LocalDateTime.class, validationBody.get("timestamp"));

        UserAlreadyExistsException userExistsException = new UserAlreadyExistsException("Test");
        ResponseEntity<Map<String, Object>> conflictResponse =
                exceptionHandler.handleUserAlreadyExistsException(userExistsException);
        Map<String, Object> conflictBody = conflictResponse.getBody();
        assertNotNull(conflictBody);
        assertNotNull(conflictBody.get("timestamp"));

        InvalidCredentialsException invalidCredsException = new InvalidCredentialsException("Test");
        ResponseEntity<Map<String, Object>> unauthorizedResponse =
                exceptionHandler.handleInvalidCredentialsException(invalidCredsException);
        Map<String, Object> unauthorizedBody = unauthorizedResponse.getBody();
        assertNotNull(unauthorizedBody);
        assertNotNull(unauthorizedBody.get("timestamp"));

        RuntimeException genericException = new RuntimeException("Test");
        ResponseEntity<Map<String, Object>> genericResponse =
                exceptionHandler.handleGenericException(genericException);
        Map<String, Object> genericBody = genericResponse.getBody();
        assertNotNull(genericBody);
        assertNotNull(genericBody.get("timestamp"));
    }

    @Test
    @DisplayName("Should handle validation exception with null error messages gracefully")
    void handleValidationExceptions_ShouldHandleNullMessages() {
        // Given: Field error with null message
        BindingResult bindingResult = org.mockito.Mockito.mock(BindingResult.class);
        FieldError nullMessageError =
                new FieldError("registerRequest", "username", null, false, null, null, null);
        org.mockito.Mockito.when(bindingResult.getFieldErrors())
                .thenReturn(List.of(nullMessageError));

        @SuppressWarnings("null")
        MethodArgumentNotValidException exception =
                new MethodArgumentNotValidException(null, bindingResult);

        // When: Exception is handled
        ResponseEntity<Map<String, Object>> response =
                exceptionHandler.handleValidationExceptions(exception);

        // Then: Should return 400 and use default message for null error messages
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, Object> responseBody = response.getBody();
        assertNotNull(responseBody);
        @SuppressWarnings("unchecked")
        Map<String, String> fieldErrors = (Map<String, String>) responseBody.get("fieldErrors");
        assertNotNull(fieldErrors);
        assertEquals("Invalid value", fieldErrors.get("username"));
    }
}

