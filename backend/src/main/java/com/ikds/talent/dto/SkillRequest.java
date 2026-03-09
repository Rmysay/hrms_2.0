package com.ikds.talent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SkillRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String category;

    private String description;
}
