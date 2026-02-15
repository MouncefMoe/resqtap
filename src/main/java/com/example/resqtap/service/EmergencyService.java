package com.example.resqtap.service;

import com.example.resqtap.dto.EmergencyDTO;
import com.example.resqtap.model.Emergency;
import com.example.resqtap.model.Step;
import com.example.resqtap.repository.EmergencyRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;

    public EmergencyService(EmergencyRepository emergencyRepository) {
        this.emergencyRepository = emergencyRepository;
    }

    @Cacheable(value = "emergencies")
    public List<EmergencyDTO> getAllEmergencies() {
        return emergencyRepository.findAll().stream()
                .map(EmergencyDTO::new)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "emergency", key = "#id")
    public Optional<EmergencyDTO> getEmergencyById(Long id) {
        return emergencyRepository.findById(id)
                .map(EmergencyDTO::new);
    }

    @Cacheable(value = "emergencyBySlug", key = "#slug")
    public Optional<EmergencyDTO> getEmergencyBySlug(String slug) {
        return emergencyRepository.findBySlug(slug)
                .map(EmergencyDTO::new);
    }

    @Cacheable(value = "emergencyByName", key = "#name")
    public Optional<EmergencyDTO> getEmergencyByName(String name) {
        return emergencyRepository.findByNameIgnoreCase(name)
                .map(EmergencyDTO::new);
    }

    @Cacheable(value = "emergenciesByCategory", key = "#category")
    public List<EmergencyDTO> getEmergenciesByCategory(String category) {
        return emergencyRepository.findByCategory(category).stream()
                .map(EmergencyDTO::new)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "emergenciesBySeverity", key = "#severity")
    public List<EmergencyDTO> getEmergenciesBySeverity(Emergency.Severity severity) {
        return emergencyRepository.findBySeverity(severity).stream()
                .map(EmergencyDTO::new)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "criticalEmergencies")
    public List<EmergencyDTO> getCriticalEmergencies() {
        return emergencyRepository.findBySeverityIn(
                List.of(Emergency.Severity.CRITICAL, Emergency.Severity.HIGH)
        ).stream()
                .map(EmergencyDTO::new)
                .collect(Collectors.toList());
    }

    public List<EmergencyDTO> search(String term) {
        return emergencyRepository.search(term).stream()
                .map(EmergencyDTO::new)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = {"emergencies", "emergency", "emergencyBySlug", "emergencyByName",
                         "emergenciesByCategory", "emergenciesBySeverity", "criticalEmergencies"},
                allEntries = true)
    public Emergency createEmergency(Emergency emergency) {
        return emergencyRepository.save(emergency);
    }

    @CacheEvict(value = {"emergencies", "emergency", "emergencyBySlug", "emergencyByName",
                         "emergenciesByCategory", "emergenciesBySeverity", "criticalEmergencies"},
                allEntries = true)
    public Optional<Emergency> updateEmergency(Long id, Emergency updatedEmergency) {
        return emergencyRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedEmergency.getName());
                    existing.setCategory(updatedEmergency.getCategory());
                    existing.setSeverity(updatedEmergency.getSeverity());
                    existing.setShortDescription(updatedEmergency.getShortDescription());
                    existing.setImageUrl(updatedEmergency.getImageUrl());
                    existing.setEmergencyContact(updatedEmergency.getEmergencyContact());

                    // Update steps
                    existing.getSteps().clear();
                    for (Step step : updatedEmergency.getSteps()) {
                        existing.addStep(step);
                    }

                    return emergencyRepository.save(existing);
                });
    }

    @CacheEvict(value = {"emergencies", "emergency", "emergencyBySlug", "emergencyByName",
                         "emergenciesByCategory", "emergenciesBySeverity", "criticalEmergencies"},
                allEntries = true)
    public boolean deleteEmergency(Long id) {
        if (emergencyRepository.existsById(id)) {
            emergencyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean existsByName(String name) {
        return emergencyRepository.existsByNameIgnoreCase(name);
    }

    // Backward compatibility: Convert to old CrisisPlan-like format
    public List<EmergencyDTO> getAllPlans() {
        return getAllEmergencies();
    }
}
