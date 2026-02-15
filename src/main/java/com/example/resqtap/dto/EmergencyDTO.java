package com.example.resqtap.dto;

import com.example.resqtap.model.Emergency;
import com.example.resqtap.model.Step;
import java.util.List;
import java.util.stream.Collectors;

public class EmergencyDTO {
    private Long id;
    private String title;
    private String slug;
    private String category;
    private String severity;
    private String shortDescription;
    private List<StepDTO> steps;
    private String emergencyContact;
    private String imageUrl;

    public static class StepDTO {
        private Integer stepNumber;
        private String description;
        private String image;

        public StepDTO() {}

        public StepDTO(Step step) {
            this.stepNumber = step.getStepNumber();
            this.description = step.getDescription();
            this.image = step.getImageUrl();
        }

        public Integer getStepNumber() {
            return stepNumber;
        }

        public void setStepNumber(Integer stepNumber) {
            this.stepNumber = stepNumber;
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
    }

    public EmergencyDTO() {}

    public EmergencyDTO(Emergency emergency) {
        this.id = emergency.getId();
        this.title = emergency.getName();
        this.slug = slugify(emergency.getName());
        this.category = emergency.getCategory();
        this.severity = emergency.getSeverity().name();
        this.shortDescription = emergency.getShortDescription();
        this.emergencyContact = emergency.getEmergencyContact();
        this.imageUrl = emergency.getImageUrl();
        this.steps = emergency.getSteps().stream()
                .map(StepDTO::new)
                .collect(Collectors.toList());
    }

    private String slugify(String text) {
        if (text == null || text.isEmpty()) return "";
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
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

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public List<StepDTO> getSteps() {
        return steps;
    }

    public void setSteps(List<StepDTO> steps) {
        this.steps = steps;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
