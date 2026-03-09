package com.ikds.performance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AwardRequest {
    @NotNull
    private Long employeeId;
    @NotBlank
    private String title;
    @NotBlank
    private String type;
    private String description;
    private LocalDate awardDate;
}
