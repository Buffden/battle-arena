package com.battlearena.auth.service;

import com.battlearena.auth.dto.UpdateProfileRequestDTO;
import com.battlearena.auth.model.User;
import com.battlearena.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public User updateProfile(String username, UpdateProfileRequestDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (dto.xp() != null) {
            if (dto.xp() < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "XP must be ≥ 0");
            user.setXp(dto.xp());
        }

        if (dto.level() != null) {
            if (dto.level() < 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Level must be ≥ 1");
            user.setLevel(dto.level());
        }

        if (dto.avatar() != null) {
            user.setAvatar(dto.avatar());
        }

        if (dto.skins() != null) {
            user.setSkins(dto.skins());
        }

        return userRepository.save(user);
    }
} 