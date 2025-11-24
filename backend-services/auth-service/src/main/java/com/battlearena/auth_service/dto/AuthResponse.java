package com.battlearena.auth_service.dto;

/**
 * Data Transfer Object for authentication responses (login).
 *
 * <p>
 * This DTO represents the response payload for successful user login.
 * It contains the JWT token and user information.
 * </p>
 *
 * <p>
 * Design Pattern: DTO (Data Transfer Object) - Separates data transfer from domain model
 * </p>
 */
public class AuthResponse {

    private String token;
    private String id;
    private String username;
    private String email;
    private String message;

    // Default constructor
    public AuthResponse() {
    }

    // Constructor with fields
    public AuthResponse(String token, String id, String username, String email, String message) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.message = message;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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
        return "AuthResponse{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", message='" + message + '\'' +
                '}'; // Never include token in toString()
    }
}

