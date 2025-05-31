package com.battlearena.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@PropertySource(value = "file:.env", ignoreResourceNotFound = true)
public class EnvConfig {
    
    @Autowired
    private Environment env;

    public String getJwtSecret() {
        return env.getProperty("JWT_SECRET");
    }

    public Long getJwtExpiration() {
        return Long.parseLong(env.getProperty("JWT_EXPIRATION", "86400000"));
    }
} 