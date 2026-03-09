package com.ikds.talent.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssessmentRequest {
    @NotNull
    private Long employeeId;

    @NotNull
    private Long skillId;

    @Min(1) @Max(5)
    private int score;

    private double weight = 1.0;
}
