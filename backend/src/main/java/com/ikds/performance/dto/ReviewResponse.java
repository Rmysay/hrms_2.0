package com.ikds.performance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeDepartment;
    private String period;
    private String goals;
    private int overallScore;
    private String strengths;
    private String improvements;
    private String managerFeedback;
    private String status;
    private String reviewerName;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
