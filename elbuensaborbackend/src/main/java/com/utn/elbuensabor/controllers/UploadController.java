package com.utn.elbuensabor.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

@RestController
public class UploadController {

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    private final Path uploadsBasePath;

    public UploadController(@Value("${app.upload-base-dir:uploads}") String uploadsBaseDir) {
        this.uploadsBasePath = Paths.get(uploadsBaseDir).toAbsolutePath().normalize();
    }

    @GetMapping("/uploads/**")
    public ResponseEntity<Resource> getUpload(HttpServletRequest request) {
        try {
            String pathWithinMapping = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
            String bestMatchingPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
            String relativePath = PATH_MATCHER.extractPathWithinPattern(bestMatchingPattern, pathWithinMapping);

            if (relativePath == null || relativePath.isBlank()) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = uploadsBasePath.resolve(relativePath).normalize();
            if (!filePath.startsWith(uploadsBasePath) || !Files.exists(filePath) || !Files.isReadable(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            MediaType mediaType = (contentType != null) ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM;

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(resource);

        } catch (IOException ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}