package com.example.resqtap;

import com.example.resqtap.repository.EmergencyRepository;
import com.example.resqtap.service.EmergencyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class ResqtapApplicationTests {

	@Autowired
	private EmergencyService emergencyService;

	@Autowired
	private EmergencyRepository emergencyRepository;

	@Test
	void contextLoads() {
		assertNotNull(emergencyService);
		assertNotNull(emergencyRepository);
	}

	@Test
	void dataSeederPopulatesDatabase() {
		// The DataSeeder should have seeded 72 emergencies
		long count = emergencyRepository.count();
		assertTrue(count >= 60, "Expected at least 60 emergencies to be seeded, found: " + count);
	}

	@Test
	void criticalEmergenciesAreSeeded() {
		// Check that critical emergencies like CPR are present
		var criticalEmergencies = emergencyService.getCriticalEmergencies();
		assertFalse(criticalEmergencies.isEmpty(), "Expected critical emergencies to be seeded");
	}
}
