package com.ikds.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long jobPostingId;
    private String jobTitle;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String resumeUrl;
    private String coverLetter;
    private String status;
    private String notes;
    private LocalDateTime appliedAt;
}
