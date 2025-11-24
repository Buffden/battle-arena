package com.battlearena.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for logout responses.
 *
 * <p>
 * This DTO represents the response payload for user logout endpoint. It contains a success message
 * indicating that the logout was successful.
 * </p>
 *
 * <p>
 * Design Pattern: DTO (Data Transfer Object) - Separates data transfer from domain model
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogoutResponse {
    private String message;
}

