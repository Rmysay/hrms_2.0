package com.ikds.organization.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {
    @NotBlank
    private String name;

    private String code;
    private String description;
    private Long parentId;
    private Long managerId;
}
