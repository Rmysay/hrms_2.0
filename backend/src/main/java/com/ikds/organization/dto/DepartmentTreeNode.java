package com.ikds.organization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class DepartmentTreeNode {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String managerName;
    private long employeeCount;

    @Builder.Default
    private List<DepartmentTreeNode> children = new ArrayList<>();
}
