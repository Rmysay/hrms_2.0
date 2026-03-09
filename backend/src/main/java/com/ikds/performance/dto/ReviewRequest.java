package com.ikds.performance.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull
    private Long employeeId;
    private String period;
    private String goals;
    @Min(1) @Max(5)
    private int overallScore;
    private String strengths;
    private String improvements;
    private String managerFeedback;
    private String status;
}
