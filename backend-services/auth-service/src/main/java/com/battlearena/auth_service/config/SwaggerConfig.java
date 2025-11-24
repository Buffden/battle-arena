package com.battlearena.auth_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger/OpenAPI configuration for API documentation.
 *
 * <p>
 * This configuration provides API documentation accessible at:
 * <ul>
 * <li>Swagger UI: /swagger-ui.html</li>
 * <li>OpenAPI Spec: /api-docs</li>
 * </ul>
 * </p>
 *
 * <p>
 * Design Pattern: Configuration class following Singleton Pattern for single OpenAPI instance
 * management.
 * </p>
 */
@Configuration
public class SwaggerConfig {

    /**
     * Creates OpenAPI configuration bean for API documentation.
     *
     * @return OpenAPI configuration with API information and server URLs
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Battle Arena Auth Service API").version("1.0.0")
                        .description("API documentation for Battle Arena Authentication Service")
                        .contact(new Contact().name("Battle Arena Team")
                                .email("support@battlearena.com"))
                        .license(new License().name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8081")
                                .description("Local Development Server"),
                        new Server().url("https://api.battlearena.com")
                                .description("Production Server")));
    }
}

