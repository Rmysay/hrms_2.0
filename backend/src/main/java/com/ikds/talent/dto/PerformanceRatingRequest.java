package com.ikds.talent.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PerformanceRatingRequest {
    @NotNull
    private Long employeeId;

    private String period;

    @Min(1) @Max(5)
    private int performanceScore;

    @Min(1) @Max(5)
    private int potentialScore;

    private String notes;
}
