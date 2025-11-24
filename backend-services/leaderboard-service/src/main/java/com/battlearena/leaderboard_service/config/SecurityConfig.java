package com.battlearena.leaderboard_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration for Leaderboard Service.
 *
 * <p>
 * This configuration sets up security policies and CORS.
 * </p>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures security filter chain.
     *
     * <p>
     * Allows public access to: - /actuator/health (for health checks) - /api/leaderboard/**
     * (leaderboard endpoints - will require auth later) - /swagger-ui/** and /api-docs/** (Swagger
     * documentation)
     * </p>
     *
     * @param http HttpSecurity builder
     * @return SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Enable CSRF protection, but ignore stateless API endpoints
                // CSRF is not needed for stateless JWT-based API authentication
                .csrf(csrf -> csrf.ignoringRequestMatchers("/api/leaderboard/**"))

                // CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Stateless session (JWT-based authentication)
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configure request authorization
                .authorizeHttpRequests(auth -> auth
                        // Allow actuator health check (required for Docker health checks)
                        .requestMatchers("/actuator/health").permitAll()

                        // Allow leaderboard endpoints (will require auth later)
                        .requestMatchers("/api/leaderboard/**").permitAll()

                        // Allow Swagger documentation
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/api-docs/**")
                        .permitAll()

                        // All other requests require authentication (for future implementation)
                        .anyRequest().authenticated());

        return http.build();
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing).
     *
     * <p>
     * Allows requests from any origin (for development). In production, restrict to specific
     * origins.
     * </p>
     *
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow all origins (for development - restrict in production)
        configuration.setAllowedOrigins(List.of("*"));

        // Allowed HTTP methods
        configuration.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Allowed headers
        configuration.setAllowedHeaders(
                Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));

        // Allow credentials
        configuration.setAllowCredentials(true);

        // Cache preflight requests for 24 hours
        configuration.setMaxAge(86400L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

