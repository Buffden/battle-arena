package com.battlearena.profile.service;

import com.battlearena.profile.model.Profile;
import com.battlearena.profile.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Profile getProfile(String username) {
        return profileRepository.findByUsername(username)
                .orElseGet(() -> createDefaultProfile(username));
    }

    public Profile updateProfile(String username, Profile updateData) {
        Profile profile = getProfile(username);

        // Update XP if provided
        if (updateData.getXp() > 0) {
            profile.setXp(updateData.getXp());
        }

        // Update level if provided
        if (updateData.getLevel() > 0) {
            profile.setLevel(updateData.getLevel());
        }

        // Update avatar if provided
        if (updateData.getAvatar() != null) {
            profile.setAvatar(updateData.getAvatar());
        }

        // Update skins if provided
        if (updateData.getSkins() != null) {
            profile.setSkins(updateData.getSkins());
        }

        // Update display name if provided
        if (updateData.getDisplayName() != null) {
            profile.setDisplayName(updateData.getDisplayName());
        }

        // Update bio if provided
        if (updateData.getBio() != null) {
            profile.setBio(updateData.getBio());
        }

        return profileRepository.save(profile);
    }

    private Profile createDefaultProfile(String username) {
        Profile profile = Profile.builder()
                .username(username)
                .xp(0)
                .level(1)
                .avatar("default")
                .skins(new ArrayList<>())
                .achievements(new ArrayList<>())
                .totalMatches(0)
                .wins(0)
                .losses(0)
                .winRate(0.0)
                .friends(new ArrayList<>())
                .blockedUsers(new ArrayList<>())
                .isOnline(false)
                .build();
        
        return profileRepository.save(profile);
    }
} 