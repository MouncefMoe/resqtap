package com.example.resqtap.controller;

import com.example.resqtap.dto.EmergencyDTO;
import com.example.resqtap.model.Emergency;
import com.example.resqtap.service.EmergencyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping({"/api/crisis-plans", "/api/emergencies"})
@CrossOrigin(origins = "*")
public class CrisisController {


    private final EmergencyService emergencyService;

    public CrisisController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @GetMapping
    public List<EmergencyDTO> getAllPlans() {
        return emergencyService.getAllEmergencies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyDTO> getPlan(@PathVariable Long id) {
        return emergencyService.getEmergencyById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emergency not found"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<EmergencyDTO> getPlanBySlug(@PathVariable String slug) {
        return emergencyService.getEmergencyBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emergency not found"));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<EmergencyDTO> getPlanByName(@PathVariable String name) {
        return emergencyService.getEmergencyByName(name)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emergency not found"));
    }

    @GetMapping("/search")
    public List<EmergencyDTO> searchPlans(@RequestParam String term) {
        return emergencyService.search(term.toLowerCase());
    }

    @GetMapping("/category/{category}")
    public List<EmergencyDTO> getPlansByCategory(@PathVariable String category) {
        return emergencyService.getEmergenciesByCategory(category);
    }

    @GetMapping("/severity/{severity}")
    public List<EmergencyDTO> getPlansBySeverity(@PathVariable String severity) {
        try {
            Emergency.Severity sev = Emergency.Severity.valueOf(severity.toUpperCase());
            return emergencyService.getEmergenciesBySeverity(sev);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid severity: " + severity);
        }
    }

    @GetMapping("/critical")
    public List<EmergencyDTO> getCriticalPlans() {
        return emergencyService.getCriticalEmergencies();
    }

    @PostMapping
    public ResponseEntity<Emergency> createPlan(@RequestBody Emergency emergency,
                                                @RequestParam(required = false) String role) {
        if (!"admin".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can add plans");
        }
        Emergency created = emergencyService.createEmergency(emergency);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Emergency> updatePlan(@PathVariable Long id,
                                                @RequestBody Emergency emergency,
                                                @RequestParam(required = false) String role) {
        if (!"admin".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can update plans");
        }
        return emergencyService.updateEmergency(id, emergency)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emergency not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id,
                                           @RequestParam(required = false) String role) {
        if (!"admin".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can delete plans");
        }
        if (emergencyService.deleteEmergency(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Emergency not found");
    }
}
