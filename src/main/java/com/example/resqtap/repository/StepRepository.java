package com.example.resqtap.repository;

import com.example.resqtap.model.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {

    // Find all steps for a specific emergency
    List<Step> findByEmergencyIdOrderByStepNumberAsc(Long emergencyId);

    // Delete all steps for an emergency
    void deleteByEmergencyId(Long emergencyId);
}
