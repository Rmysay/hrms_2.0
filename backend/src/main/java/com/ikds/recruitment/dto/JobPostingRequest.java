package com.ikds.recruitment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobPostingRequest {
    @NotBlank
    private String title;

    @NotNull
    private Long departmentId;

    private String description;
    private String requirements;
    private String status;
    private LocalDate closingDate;
}
