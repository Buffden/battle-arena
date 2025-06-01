package com.battlearena.profile.controller;

import com.battlearena.profile.model.Profile;
import com.battlearena.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/test")
    public String test() {
        return "Profile service is working!";
    }

    @GetMapping("/me")
    public ResponseEntity<Profile> getMyProfile(Principal principal) {
        Profile profile = profileService.getProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<Profile> updateMyProfile(
            Principal principal,
            @RequestBody Profile updateData) {
        Profile updated = profileService.updateProfile(principal.getName(), updateData);
        return ResponseEntity.ok(updated);
    }
} 