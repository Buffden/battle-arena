package com.battlearena.auth_service.config;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Unit tests for SecurityConfig.
 *
 * <p>
 * Tests that SecurityConfig properly configures:
 * <ul>
 * <li>PasswordEncoder bean (BCrypt with 12 rounds)</li>
 * <li>SecurityFilterChain bean</li>
 * <li>CorsConfigurationSource bean</li>
 * </ul>
 * </p>
 */
@SpringJUnitConfig(SecurityConfig.class)
@TestPropertySource(properties = {"cors.allowed-origins=*"})
class SecurityConfigTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Test
    void passwordEncoderBeanExists() {
        assertNotNull(passwordEncoder, "PasswordEncoder bean should be configured");
    }

    @Test
    void passwordEncoderIsBCrypt() {
        @SuppressWarnings("squid:S2068") // Test-only data
        final String TEST_PASSWORD = "testPassword123";
        String encoded = passwordEncoder.encode(TEST_PASSWORD);

        assertNotNull(encoded, "Encoded password should not be null");
        assertTrue(encoded.startsWith("$2a$"),
                "Password should be BCrypt encoded (starts with $2a$)");

        // Verify password matches
        assertTrue(passwordEncoder.matches(TEST_PASSWORD, encoded),
                "Password encoder should correctly match passwords");
    }

    @Test
    void securityFilterChainBeanExists() {
        assertNotNull(securityFilterChain, "SecurityFilterChain bean should be configured");
    }

    @Test
    void corsConfigurationSourceBeanExists() {
        assertNotNull(corsConfigurationSource, "CorsConfigurationSource bean should be configured");
    }
}

