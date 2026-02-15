package com.example.resqtap.service;

import com.example.resqtap.model.CrisisPlan;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CrisisServiceTest {

    private CrisisService crisisService;

    @BeforeEach
    void setUp() {
        crisisService = new CrisisService();
    }

    @Test
    void testCreatePlan() {
        CrisisPlan plan = new CrisisPlan("Nosebleed", "Medical",
                Arrays.asList("Sit down", "Pinch nose"), "911", "https://example.com/nosebleed.png");
        CrisisPlan saved = crisisService.createPlan(plan);

        assertNotNull(saved.getId());
        assertEquals("Nosebleed", saved.getTitle());
    }

    @Test
    void testGetPlanById() {
        CrisisPlan plan = new CrisisPlan("Burn", "Medical",
                Arrays.asList("Cool water", "Cover wound"), "911", "https://example.com/burn.png");
        CrisisPlan saved = crisisService.createPlan(plan);

        CrisisPlan fetched = crisisService.getPlanById(saved.getId());
        assertNotNull(fetched);
        assertEquals("Burn", fetched.getTitle());
    }

    @Test
    void testGetAllPlans() {
        crisisService.createPlan(new CrisisPlan("Fire", "Safety",
                Arrays.asList("Evacuate", "Call 911"), "911", "https://example.com/fire.png"));
        crisisService.createPlan(new CrisisPlan("Earthquake", "Natural Disaster",
                Arrays.asList("Drop", "Cover", "Hold On"), "911", "https://example.com/earthquake.png"));

        List<CrisisPlan> all = crisisService.getAllPlans();
        assertEquals(2, all.size());
    }

    @Test
    void testDeletePlan() {
        CrisisPlan plan = new CrisisPlan("Flood", "Natural Disaster",
                Arrays.asList("Move to high ground", "Call for help"), "911", "https://example.com/flood.png");
        CrisisPlan saved = crisisService.createPlan(plan);
        crisisService.deletePlan(saved.getId());

        assertNull(crisisService.getPlanById(saved.getId()));
    }

    @Test
    void testSearchPlans() {
        crisisService.createPlan(new CrisisPlan("Panic Attack", "Mental Health",
                Arrays.asList("Breathe", "Call friend"), "911", "https://example.com/panic.png"));

        List<CrisisPlan> result = crisisService.search("panic");
        assertEquals(1, result.size());
        assertEquals("Panic Attack", result.get(0).getTitle());
    }
}
