package com.example.resqtap.repository;

import com.example.resqtap.model.Emergency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyRepository extends JpaRepository<Emergency, Long> {

    // Find by name (case-insensitive)
    Optional<Emergency> findByNameIgnoreCase(String name);

    // Find by category
    List<Emergency> findByCategory(String category);

    // Find by severity
    List<Emergency> findBySeverity(Emergency.Severity severity);

    // Find critical emergencies (for priority caching)
    List<Emergency> findBySeverityIn(List<Emergency.Severity> severities);

    // Search by name, category, or description
    @Query("SELECT e FROM Emergency e WHERE " +
           "LOWER(e.name) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(e.category) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(e.shortDescription) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Emergency> search(@Param("term") String term);

    // Find by slug-friendly name (for URL routing)
    @Query("SELECT e FROM Emergency e WHERE LOWER(REPLACE(e.name, ' ', '-')) = LOWER(:slug)")
    Optional<Emergency> findBySlug(@Param("slug") String slug);

    // Check if emergency exists by name
    boolean existsByNameIgnoreCase(String name);
}
