package com.battlearena.auth.dto;

import jakarta.validation.constraints.Min;
import java.util.List;

public record UpdateProfileRequestDTO(
    @Min(value = 0, message = "XP must be >= 0")
    Integer xp,
    @Min(value = 1, message = "Level must be >= 1")
    Integer level,
    String avatar,
    List<String> skins
) {} 