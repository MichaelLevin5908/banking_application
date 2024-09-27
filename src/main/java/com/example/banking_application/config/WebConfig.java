package com.example.banking_application.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Apply to API endpoints
                .allowedOriginPatterns("http://localhost:3000")  // Use allowedOriginPatterns for flexibility
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Cache-Control", "Content-Type")  // Specify allowed headers
                .exposedHeaders("Authorization")  // Expose headers to the client
                .allowCredentials(true);
    }
}