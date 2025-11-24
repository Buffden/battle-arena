package com.battlearena.auth_service.dto;

/**
 * Data Transfer Object for user registration responses.
 *
 * <p>
 * This DTO represents the response payload for successful user registration.
 * It contains user information without sensitive data (no password hash).
 * </p>
 *
 * <p>
 * Design Pattern: DTO (Data Transfer Object) - Separates data transfer from domain model
 * </p>
 */
public class RegisterResponse {

    private String id;
    private String username;
    private String email;
    private String message;

    public RegisterResponse() {
    }

    public RegisterResponse(String id, String username, String email, String message) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "RegisterResponse{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
