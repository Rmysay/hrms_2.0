package com.ikds.organization.service;

import com.ikds.auth.entity.User;
import com.ikds.auth.repository.UserRepository;
import com.ikds.organization.dto.*;
import com.ikds.organization.entity.Department;
import com.ikds.organization.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Departman bulunamadı: " + id));
        return toResponse(dept);
    }

    public List<DepartmentTreeNode> getOrgTree() {
        List<Department> roots = departmentRepository.findByParentDepartmentIsNull();
        return roots.stream()
                .map(this::toTreeNode)
                .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Department dept = Department.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .build();

        if (request.getParentId() != null) {
            Department parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Üst departman bulunamadı"));
            dept.setParentDepartment(parent);
        }

        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Yönetici bulunamadı"));
            dept.setManager(manager);
        }

        dept = departmentRepository.save(dept);
        return toResponse(dept);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Departman bulunamadı: " + id));

        dept.setName(request.getName());
        dept.setCode(request.getCode());
        dept.setDescription(request.getDescription());

        if (request.getParentId() != null) {
            Department parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Üst departman bulunamadı"));
            dept.setParentDepartment(parent);
        } else {
            dept.setParentDepartment(null);
        }

        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Yönetici bulunamadı"));
            dept.setManager(manager);
        }

        dept = departmentRepository.save(dept);
        return toResponse(dept);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Departman bulunamadı: " + id);
        }
        departmentRepository.deleteById(id);
    }

    // --- Mappers ---

    private DepartmentResponse toResponse(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .parentId(dept.getParentDepartment() != null ? dept.getParentDepartment().getId() : null)
                .parentName(dept.getParentDepartment() != null ? dept.getParentDepartment().getName() : null)
                .managerId(dept.getManager() != null ? dept.getManager().getId() : null)
                .managerName(dept.getManager() != null
                        ? dept.getManager().getFirstName() + " " + dept.getManager().getLastName()
                        : null)
                .employeeCount(departmentRepository.countEmployeesByDepartmentName(dept.getName()))
                .subDepartmentCount(dept.getSubDepartments() != null ? dept.getSubDepartments().size() : 0)
                .build();
    }

    private DepartmentTreeNode toTreeNode(Department dept) {
        return DepartmentTreeNode.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .managerName(dept.getManager() != null
                        ? dept.getManager().getFirstName() + " " + dept.getManager().getLastName()
                        : null)
                .employeeCount(departmentRepository.countEmployeesByDepartmentName(dept.getName()))
                .children(dept.getSubDepartments() != null
                        ? dept.getSubDepartments().stream().map(this::toTreeNode).collect(Collectors.toList())
                        : List.of())
                .build();
    }
}
