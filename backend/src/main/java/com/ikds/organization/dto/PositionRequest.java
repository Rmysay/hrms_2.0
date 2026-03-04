package com.ikds.organization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PositionRequest {
    @NotBlank
    private String title;

    @NotNull
    private Long departmentId;

    @NotBlank
    private String level;
}
