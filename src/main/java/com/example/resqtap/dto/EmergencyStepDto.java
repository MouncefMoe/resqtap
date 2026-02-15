package com.example.resqtap.dto;

// This DTO is created to match the exact frontend JSON schema for a step.
public class EmergencyStepDto {

    private int order;
    private String text;
    private String image;

    public EmergencyStepDto() {
    }

    public EmergencyStepDto(int order, String text, String image) {
        this.order = order;
        this.text = text;
        this.image = image;
    }

    // Getters and Setters
    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
