package com.example.resqtap.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        // Default cache configuration
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .maximumSize(500)
                .recordStats());

        // Register cache names
        cacheManager.setCacheNames(java.util.List.of(
                "emergencies",
                "emergency",
                "emergencyBySlug",
                "emergencyByName",
                "emergenciesByCategory",
                "emergenciesBySeverity",
                "criticalEmergencies"
        ));

        return cacheManager;
    }

    // Critical emergencies cache with longer TTL for faster mobile access
    @Bean
    public Caffeine<Object, Object> criticalCacheConfig() {
        return Caffeine.newBuilder()
                .expireAfterWrite(60, TimeUnit.MINUTES)
                .maximumSize(100)
                .recordStats();
    }
}
