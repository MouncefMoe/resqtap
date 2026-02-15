package com.example.resqtap.mapper;

import com.example.resqtap.dto.EmergencyResponseDto;
import com.example.resqtap.dto.EmergencyStepDto;
import com.example.resqtap.model.Emergency;
import com.example.resqtap.model.Step;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EmergencyMapper {

    public EmergencyResponseDto toDto(Emergency emergency) {
        if (emergency == null) {
            return null;
        }

        EmergencyResponseDto dto = new EmergencyResponseDto();
        dto.setId(slugify(emergency.getName()));
        dto.setName(emergency.getName());
        dto.setCategory(emergency.getCategory());
        dto.setSeverity(emergency.getSeverity().name());
        dto.setDescription(emergency.getShortDescription()); // Mapping shortDescription to description
        dto.setImage(emergency.getImageUrl()); // Mapping imageUrl to image

        List<EmergencyStepDto> stepDtos = emergency.getSteps().stream()
                .map(this::toStepDto)
                .collect(Collectors.toList());
        dto.setSteps(stepDtos);

        return dto;
    }

    public List<EmergencyResponseDto> toDtoList(List<Emergency> emergencies) {
        return emergencies.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private EmergencyStepDto toStepDto(Step step) {
        if (step == null) {
            return null;
        }
        // Mapping Step fields to EmergencyStepDto fields
        return new EmergencyStepDto(step.getStepNumber(), step.getDescription(), step.getImageUrl());
    }

    private String slugify(String text) {
        if (text == null) {
            return "";
        }
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Remove special characters except space and hyphen
                .trim()
                .replaceAll("\\s+", "-"); // Replace spaces with hyphens
    }
}
