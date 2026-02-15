package com.example.resqtap.model;

import java.util.List;

public class CrisisPlan {
    private Long id;
    private String title;
    private String category;
    private List<String> steps;
    private String emergencyContact;
    private String imageUrl;  // New field

    // Constructor
    public CrisisPlan(String title, String category, List<String> steps, String emergencyContact, String imageUrl) {
        this.title = title;
        this.category = category;
        this.steps = steps;
        this.emergencyContact = emergencyContact;
        this.imageUrl = imageUrl;
    }

    public CrisisPlan() {}  // Default constructor

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
