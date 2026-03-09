package com.ikds.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class JobPostingResponse {
    private Long id;
    private String title;
    private Long departmentId;
    private String departmentName;
    private String description;
    private String requirements;
    private String status;
    private LocalDate closingDate;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private long applicationCount;
}
