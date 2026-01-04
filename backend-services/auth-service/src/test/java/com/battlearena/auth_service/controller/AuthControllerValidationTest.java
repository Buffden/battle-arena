package com.battlearena.auth_service.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.battlearena.auth_service.dto.LoginRequest;
import com.battlearena.auth_service.dto.RegisterRequest;
import com.battlearena.auth_service.exception.GlobalExceptionHandler;
import com.battlearena.auth_service.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

/**
 * Integration tests for validation error handling in AuthController.
 *
 * <p>
 * Tests that validation annotations (@Valid, @NotBlank, @Size, @Email) correctly reject invalid
 * requests and return appropriate 400 Bad Request responses with field error details.
 * </p>
 *
 * <p>
 * Security is disabled for these tests since we're testing validation, not security.
 * </p>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Validation Tests")
class AuthControllerValidationTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        AuthController authController = new AuthController(userService);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        
        // Create a message converter with ObjectMapper that has JavaTimeModule
        MappingJackson2HttpMessageConverter messageConverter = new MappingJackson2HttpMessageConverter();
        messageConverter.setObjectMapper(objectMapper);
        
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .setMessageConverters(messageConverter)
                .build();
    }

    // ========================================
    // REGISTER ENDPOINT VALIDATION TESTS
    // ========================================

    @Test
    @DisplayName("Should return 400 when username is missing")
    void register_ShouldReturn400_WhenUsernameMissing() throws Exception {
        String requestBody = objectMapper.writeValueAsString(
                new RegisterRequest(null, "test@example.com", "Password123"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.fieldErrors.username").exists());
    }

    @Test
    @DisplayName("Should return 400 when username is blank")
    void register_ShouldReturn400_WhenUsernameBlank() throws Exception {
        String requestBody = objectMapper
                .writeValueAsString(new RegisterRequest("", "test@example.com", "Password123"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists());
    }

    @Test
    @DisplayName("Should return 400 when username is too short (< 3 characters)")
    void register_ShouldReturn400_WhenUsernameTooShort() throws Exception {
        String requestBody = objectMapper.writeValueAsString(
                new RegisterRequest("ab", "test@example.com", "Password123"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists());
    }

    @Test
    @DisplayName("Should return 400 when username is too long (> 20 characters)")
    void register_ShouldReturn400_WhenUsernameTooLong() throws Exception {
        String longUsername = "a".repeat(21);
        String requestBody = objectMapper.writeValueAsString(
                new RegisterRequest(longUsername, "test@example.com", "Password123"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists());
    }

    @Test
    @DisplayName("Should return 400 when email is missing")
    void register_ShouldReturn400_WhenEmailMissing() throws Exception {
        String requestBody = objectMapper
                .writeValueAsString(new RegisterRequest("testuser", null, "Password123"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    @DisplayName("Should return 400 when email is blank")
    void register_ShouldReturn400_WhenEmailBlank() throws Exception {
        String requestBody = objectMapper
                .writeValueAsString(new RegisterRequest("testuser", "", "Password123"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    @DisplayName("Should return 400 when email format is invalid")
    void register_ShouldReturn400_WhenEmailInvalid() throws Exception {
        String requestBody = objectMapper.writeValueAsString(
                new RegisterRequest("testuser", "notanemail", "Password123"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    @DisplayName("Should return 400 when password is missing")
    void register_ShouldReturn400_WhenPasswordMissing() throws Exception {
        String requestBody = objectMapper
                .writeValueAsString(new RegisterRequest("testuser", "test@example.com", null));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    @DisplayName("Should return 400 when password is blank")
    void register_ShouldReturn400_WhenPasswordBlank() throws Exception {
        String requestBody = objectMapper
                .writeValueAsString(new RegisterRequest("testuser", "test@example.com", ""));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    @DisplayName("Should return 400 when password is too short (< 8 characters)")
    void register_ShouldReturn400_WhenPasswordTooShort() throws Exception {
        String requestBody = objectMapper.writeValueAsString(
                new RegisterRequest("testuser", "test@example.com", "short"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    @DisplayName("Should return 400 when multiple fields are invalid")
    void register_ShouldReturn400_WhenMultipleFieldsInvalid() throws Exception {
        String requestBody = objectMapper
                .writeValueAsString(new RegisterRequest("ab", "invalidemail", "short"));

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    @DisplayName("Should return 400 when request body is empty")
    void register_ShouldReturn400_WhenRequestBodyEmpty() throws Exception {
        mockMvc.perform(
                post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
    }

    // ========================================
    // LOGIN ENDPOINT VALIDATION TESTS
    // ========================================

    @Test
    @DisplayName("Should return 400 when username is missing in login request")
    void login_ShouldReturn400_WhenUsernameMissing() throws Exception {
        String requestBody =
                objectMapper.writeValueAsString(new LoginRequest(null, "Password123"));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists());
    }

    @Test
    @DisplayName("Should return 400 when username is blank in login request")
    void login_ShouldReturn400_WhenUsernameBlank() throws Exception {
        String requestBody =
                objectMapper.writeValueAsString(new LoginRequest("", "Password123"));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists());
    }

    @Test
    @DisplayName("Should return 400 when password is missing in login request")
    void login_ShouldReturn400_WhenPasswordMissing() throws Exception {
        String requestBody = objectMapper.writeValueAsString(new LoginRequest("testuser", null));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    @DisplayName("Should return 400 when password is blank in login request")
    void login_ShouldReturn400_WhenPasswordBlank() throws Exception {
        String requestBody = objectMapper.writeValueAsString(new LoginRequest("testuser", ""));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    @DisplayName("Should return 400 when both username and password are missing in login request")
    void login_ShouldReturn400_WhenBothFieldsMissing() throws Exception {
        String requestBody = objectMapper.writeValueAsString(new LoginRequest(null, null));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    @DisplayName("Should return 400 when login request body is empty")
    void login_ShouldReturn400_WhenRequestBodyEmpty() throws Exception {
        mockMvc.perform(
                post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
    }

}
