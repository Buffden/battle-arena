package com.battlearena.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRegisterRequestDTO(
        @NotBlank(message = "Username is required") String username,
        @NotBlank(message = "Password is required") String password,
        @Email(message = "Invalid email format") String email
) {} 