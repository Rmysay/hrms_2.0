package com.ikds.organization.controller;

import com.ikds.organization.dto.DepartmentRequest;
import com.ikds.organization.dto.DepartmentResponse;
import com.ikds.organization.dto.DepartmentTreeNode;
import com.ikds.organization.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAll() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/tree")
    public ResponseEntity<List<DepartmentTreeNode>> getTree() {
        return ResponseEntity.ok(departmentService.getOrgTree());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(departmentService.getDepartmentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody DepartmentRequest request) {
        try {
            DepartmentResponse response = departmentService.createDepartment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
        try {
            return ResponseEntity.ok(departmentService.updateDepartment(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.ok(Map.of("message", "Departman silindi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
