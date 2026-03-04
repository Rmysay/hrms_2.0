package com.ikds.organization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DepartmentResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Long parentId;
    private String parentName;
    private Long managerId;
    private String managerName;
    private long employeeCount;
    private long subDepartmentCount;
}
