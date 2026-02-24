package com.utn.elbuensabor.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

public class DatasourceUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String normalized = resolveNormalizedUrl(environment);
        if (normalized == null) {
            return;
        }

        Map<String, Object> properties = new HashMap<>();
        properties.put("spring.datasource.url", normalized);
        environment.getPropertySources().addFirst(new MapPropertySource("normalizedDatasourceUrl", properties));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private String resolveNormalizedUrl(ConfigurableEnvironment environment) {
        String[] candidates = new String[] {
                environment.getProperty("MYSQL_JDBC_URL"),
                environment.getProperty("SPRING_DATASOURCE_URL"),
                environment.getProperty("DATABASE_URL"),
                environment.getProperty("MYSQL_URL")
        };

        for (String candidate : candidates) {
            String normalized = normalize(candidate);
            if (normalized != null) {
                return normalized;
            }
        }

        return null;
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        if (trimmed.isEmpty() || "jdbc:".equalsIgnoreCase(trimmed)) {
            return null;
        }

        String lower = trimmed.toLowerCase();
        if (lower.startsWith("mysql://")) {
            return "jdbc:" + trimmed;
        }

        if (lower.startsWith("jdbc:mysql://")) {
            return trimmed;
        }

        return null;
    }
}