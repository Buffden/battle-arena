package com.battlearena.auth.service;

import com.battlearena.auth.dto.UserRegisterRequestDTO;
import com.battlearena.auth.dto.UserLoginRequestDTO;
import com.battlearena.auth.dto.UserLoginResponseDTO;
import com.battlearena.auth.model.User;
import com.battlearena.auth.repository.UserRepository;
import com.battlearena.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expiration}")
    private long expirationMillis;
    
    public void register(UserRegisterRequestDTO request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new ResponseStatusException(CONFLICT, "Username already exists");
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(CONFLICT, "Email already exists");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .authType("standard")
                .xp(0)
                .level(1)
                .avatar("default")
                .skins(new ArrayList<>())
                .build();

        userRepository.save(user);
    }

    public UserLoginResponseDTO login(UserLoginRequestDTO request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new UserLoginResponseDTO(token, expirationMillis / 1000); // expiresIn in seconds
    }
} 