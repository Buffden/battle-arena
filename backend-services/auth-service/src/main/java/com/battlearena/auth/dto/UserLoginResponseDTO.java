package com.battlearena.auth.dto;

public record UserLoginResponseDTO(
        String token,
        long expiresIn
) {} 