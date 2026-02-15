package com.example.resqtap.service;

import com.example.resqtap.model.CrisisPlan;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

import java.util.*;

@Service
public class CrisisService {



    private final Map<Long, CrisisPlan> crisisStore = new HashMap<>();
    private long currentId = 1;

    public CrisisPlan createPlan(CrisisPlan plan) {
        plan.setId(currentId++);
        crisisStore.put(plan.getId(), plan);
        return plan;
    }

    public CrisisPlan getPlanById(Long id) {
        return crisisStore.get(id);
    }

    public List<CrisisPlan> getAllPlans() {
        return new ArrayList<>(crisisStore.values());
    }

    public void deletePlan(Long id) {
        crisisStore.remove(id);
    }
    public List<CrisisPlan> search(String term) {
        return crisisStore.values().stream()
                .filter(plan ->
                        plan.getTitle().toLowerCase().contains(term) ||
                                plan.getCategory().toLowerCase().contains(term) ||
                                plan.getSteps().stream().anyMatch(step -> step.toLowerCase().contains(term))
                )
                .collect(Collectors.toList());
    }


}

