package com.utn.elbuensabor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class UploadStoragePaths {

    private static final Path RAILWAY_UPLOADS = Path.of("/app/uploads");

    private final String configuredUploadDir;

    public UploadStoragePaths(@Value("${app.upload-dir:./uploads}") String configuredUploadDir) {
        this.configuredUploadDir = configuredUploadDir;
    }

    public Path rootPath() {
        Path configured = Path.of(configuredUploadDir).toAbsolutePath().normalize();
        if (isRelativeUploads(configuredUploadDir) && Files.isDirectory(RAILWAY_UPLOADS)) {
            return RAILWAY_UPLOADS;
        }
        return configured;
    }

    public Path subPath(String folder) {
        return rootPath().resolve(folder).normalize();
    }

    private boolean isRelativeUploads(String pathValue) {
        if (pathValue == null) {
            return true;
        }
        String normalized = pathValue.trim().replace('\\', '/');
        return normalized.isEmpty() || normalized.equals("uploads") || normalized.equals("./uploads");
    }
}
