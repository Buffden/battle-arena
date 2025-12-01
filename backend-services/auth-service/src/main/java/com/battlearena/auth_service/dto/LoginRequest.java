package com.battlearena.auth_service.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for user login requests.
 *
 * <p>
 * This DTO represents the request payload for user login endpoint.
 * It includes validation annotations to ensure data integrity.
 * </p>
 *
 * <p>
 * Design Pattern: DTO (Data Transfer Object) - Separates data transfer from domain model
 * </p>
 */
public class LoginRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "username='" + username + '\'' +
                '}'; // Never include password in toString()
    }
}

