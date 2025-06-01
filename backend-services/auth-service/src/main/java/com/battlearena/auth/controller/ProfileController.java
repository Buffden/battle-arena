package com.battlearena.auth.controller;

import com.battlearena.auth.dto.UpdateProfileRequestDTO;
import com.battlearena.auth.model.User;
import com.battlearena.auth.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(Principal principal,
                                           @Valid @RequestBody UpdateProfileRequestDTO request) {
        User updated = profileService.updateProfile(principal.getName(), request);

        return ResponseEntity.ok(Map.of(
            "xp", updated.getXp(),
            "level", updated.getLevel(),
            "avatar", updated.getAvatar(),
            "skins", updated.getSkins()
        ));
    }
} 