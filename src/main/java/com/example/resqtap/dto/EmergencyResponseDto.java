package com.example.resqtap.dto;

import java.util.List;

// This DTO is created to match the exact frontend JSON schema for an emergency.
public class EmergencyResponseDto {

    private String id; // Slugified name
    private String name;
    private String category;
    private String severity;
    private String description;
    private String image;
    private List<EmergencyStepDto> steps;

    public EmergencyResponseDto() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<EmergencyStepDto> getSteps() {
        return steps;
    }

    public void setSteps(List<EmergencyStepDto> steps) {
        this.steps = steps;
    }
}
