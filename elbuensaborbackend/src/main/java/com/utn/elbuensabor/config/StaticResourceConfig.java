package com.utn.elbuensabor.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    private final UploadStoragePaths uploadStoragePaths;

    public StaticResourceConfig(UploadStoragePaths uploadStoragePaths) {
        this.uploadStoragePaths = uploadStoragePaths;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String configuredUploads = uploadStoragePaths.rootPath().toUri().toString();
        String backendUploads = Path.of("uploads").toAbsolutePath().normalize().toUri().toString();
        String repoUploads = Path.of("..", "uploads").toAbsolutePath().normalize().toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(configuredUploads, backendUploads, repoUploads);

        registry.addResourceHandler("/api/uploads/**")
                .addResourceLocations(configuredUploads, backendUploads, repoUploads);
    }
}
