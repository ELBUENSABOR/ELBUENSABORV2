package com.utn.elbuensabor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String configuredUploads = Path.of(uploadDir).toAbsolutePath().normalize().toUri().toString();
        String backendUploads = Path.of("uploads").toAbsolutePath().normalize().toUri().toString();
        String repoUploads = Path.of("..", "uploads").toAbsolutePath().normalize().toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(configuredUploads, backendUploads, repoUploads);
    }
}
