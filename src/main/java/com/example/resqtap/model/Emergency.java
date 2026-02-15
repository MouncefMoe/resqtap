package com.example.resqtap.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "emergencies")
public class Emergency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(length = 500)
    private String shortDescription;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "emergency_contact")
    private String emergencyContact = "911";

    @OneToMany(mappedBy = "emergency", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("stepNumber ASC")
    private List<Step> steps = new ArrayList<>();

    public enum Severity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    // Constructors
    public Emergency() {}

    public Emergency(String name, String category, Severity severity, String shortDescription, String imageUrl) {
        this.name = name;
        this.category = category;
        this.severity = severity;
        this.shortDescription = shortDescription;
        this.imageUrl = imageUrl;
    }

    // Helper method to add steps
    public void addStep(Step step) {
        steps.add(step);
        step.setEmergency(this);
    }

    public void addStep(int stepNumber, String description, String imageUrl) {
        Step step = new Step(stepNumber, description, imageUrl);
        addStep(step);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }
}
