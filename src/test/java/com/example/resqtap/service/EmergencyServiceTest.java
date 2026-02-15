package com.example.resqtap.service;

import com.example.resqtap.dto.EmergencyDTO;
import com.example.resqtap.model.Emergency;
import com.example.resqtap.model.Emergency.Severity;
import com.example.resqtap.repository.EmergencyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class EmergencyServiceTest {

    @Autowired
    private EmergencyService emergencyService;

    @Autowired
    private EmergencyRepository emergencyRepository;

    @BeforeEach
    void setUp() {
        emergencyRepository.deleteAll();
    }

    @Test
    void testCreateEmergency() {
        Emergency emergency = createTestEmergency("Nosebleed", "Trauma", Severity.LOW);
        Emergency saved = emergencyService.createEmergency(emergency);

        assertNotNull(saved.getId());
        assertEquals("Nosebleed", saved.getName());
        assertEquals("Trauma", saved.getCategory());
        assertEquals(Severity.LOW, saved.getSeverity());
    }

    @Test
    void testGetEmergencyById() {
        Emergency emergency = createTestEmergency("Burn", "Burns", Severity.MEDIUM);
        Emergency saved = emergencyService.createEmergency(emergency);

        Optional<EmergencyDTO> fetched = emergencyService.getEmergencyById(saved.getId());
        assertTrue(fetched.isPresent());
        assertEquals("Burn", fetched.get().getTitle());
    }

    @Test
    void testGetAllEmergencies() {
        emergencyService.createEmergency(createTestEmergency("Fire", "Safety", Severity.HIGH));
        emergencyService.createEmergency(createTestEmergency("Earthquake", "Natural Disaster", Severity.HIGH));

        List<EmergencyDTO> all = emergencyService.getAllEmergencies();
        assertEquals(2, all.size());
    }

    @Test
    void testDeleteEmergency() {
        Emergency emergency = createTestEmergency("Flood", "Natural Disaster", Severity.HIGH);
        Emergency saved = emergencyService.createEmergency(emergency);

        boolean deleted = emergencyService.deleteEmergency(saved.getId());
        assertTrue(deleted);

        Optional<EmergencyDTO> fetched = emergencyService.getEmergencyById(saved.getId());
        assertTrue(fetched.isEmpty());
    }

    @Test
    void testSearchEmergencies() {
        emergencyService.createEmergency(createTestEmergency("Panic Attack", "Mental Health", Severity.MEDIUM));

        List<EmergencyDTO> result = emergencyService.search("panic");
        assertEquals(1, result.size());
        assertEquals("Panic Attack", result.get(0).getTitle());
    }

    @Test
    void testGetEmergenciesByCategory() {
        emergencyService.createEmergency(createTestEmergency("CPR Adult", "Cardiac", Severity.CRITICAL));
        emergencyService.createEmergency(createTestEmergency("Heart Attack", "Cardiac", Severity.CRITICAL));
        emergencyService.createEmergency(createTestEmergency("Burn", "Burns", Severity.MEDIUM));

        List<EmergencyDTO> cardiacEmergencies = emergencyService.getEmergenciesByCategory("Cardiac");
        assertEquals(2, cardiacEmergencies.size());
    }

    @Test
    void testGetEmergenciesBySeverity() {
        emergencyService.createEmergency(createTestEmergency("CPR", "Cardiac", Severity.CRITICAL));
        emergencyService.createEmergency(createTestEmergency("Minor Cut", "Trauma", Severity.LOW));

        List<EmergencyDTO> criticalEmergencies = emergencyService.getEmergenciesBySeverity(Severity.CRITICAL);
        assertEquals(1, criticalEmergencies.size());
        assertEquals("CPR", criticalEmergencies.get(0).getTitle());
    }

    @Test
    void testGetCriticalEmergencies() {
        emergencyService.createEmergency(createTestEmergency("CPR", "Cardiac", Severity.CRITICAL));
        emergencyService.createEmergency(createTestEmergency("Severe Bleeding", "Trauma", Severity.HIGH));
        emergencyService.createEmergency(createTestEmergency("Minor Cut", "Trauma", Severity.LOW));

        List<EmergencyDTO> criticalAndHigh = emergencyService.getCriticalEmergencies();
        assertEquals(2, criticalAndHigh.size());
    }

    @Test
    void testEmergencyWithSteps() {
        Emergency emergency = createTestEmergency("Test Emergency", "Test", Severity.MEDIUM);
        emergency.addStep(1, "Step 1 description", "/images/step1.png");
        emergency.addStep(2, "Step 2 description", "/images/step2.png");
        emergency.addStep(3, "Step 3 description", "/images/step3.png");

        Emergency saved = emergencyService.createEmergency(emergency);

        Optional<EmergencyDTO> fetched = emergencyService.getEmergencyById(saved.getId());
        assertTrue(fetched.isPresent());
        assertEquals(3, fetched.get().getSteps().size());
        assertEquals("Step 1 description", fetched.get().getSteps().get(0).getDescription());
    }

    @Test
    void testGetEmergencyBySlug() {
        emergencyService.createEmergency(createTestEmergency("CPR Adult", "Cardiac", Severity.CRITICAL));

        Optional<EmergencyDTO> fetched = emergencyService.getEmergencyBySlug("cpr-adult");
        assertTrue(fetched.isPresent());
        assertEquals("CPR Adult", fetched.get().getTitle());
    }

    @Test
    void testUpdateEmergency() {
        Emergency emergency = createTestEmergency("Original Name", "Category", Severity.LOW);
        Emergency saved = emergencyService.createEmergency(emergency);

        Emergency updated = createTestEmergency("Updated Name", "New Category", Severity.HIGH);
        Optional<Emergency> result = emergencyService.updateEmergency(saved.getId(), updated);

        assertTrue(result.isPresent());
        assertEquals("Updated Name", result.get().getName());
        assertEquals("New Category", result.get().getCategory());
        assertEquals(Severity.HIGH, result.get().getSeverity());
    }

    private Emergency createTestEmergency(String name, String category, Severity severity) {
        Emergency emergency = new Emergency();
        emergency.setName(name);
        emergency.setCategory(category);
        emergency.setSeverity(severity);
        emergency.setShortDescription("Test description for " + name);
        emergency.setImageUrl("/images/test/" + name.toLowerCase().replace(" ", "_") + ".png");
        emergency.setEmergencyContact("911");
        return emergency;
    }
}
