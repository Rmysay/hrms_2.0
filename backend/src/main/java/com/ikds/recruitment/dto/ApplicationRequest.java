package com.ikds.recruitment.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {
    @NotNull
    private Long jobPostingId;

    @NotBlank
    private String candidateName;

    @Email @NotBlank
    private String candidateEmail;

    private String candidatePhone;
    private String resumeUrl;
    private String coverLetter;
}
