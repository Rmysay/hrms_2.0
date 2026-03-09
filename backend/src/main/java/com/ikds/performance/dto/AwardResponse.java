package com.ikds.performance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class AwardResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String title;
    private String type;
    private String description;
    private LocalDate awardDate;
    private String grantedByName;
    private LocalDateTime createdAt;
}
