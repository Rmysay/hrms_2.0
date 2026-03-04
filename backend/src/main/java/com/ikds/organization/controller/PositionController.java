package com.ikds.organization.controller;

import com.ikds.organization.dto.PositionRequest;
import com.ikds.organization.entity.Department;
import com.ikds.organization.entity.Position;
import com.ikds.organization.repository.DepartmentRepository;
import com.ikds.organization.repository.PositionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<Position>> getAll() {
        return ResponseEntity.ok(positionRepository.findAll());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Position>> getByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(positionRepository.findByDepartmentId(departmentId));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody PositionRequest request) {
        try {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departman bulunamadı"));

            Position position = Position.builder()
                    .title(request.getTitle())
                    .department(dept)
                    .level(Position.PositionLevel.valueOf(request.getLevel()))
                    .isActive(true)
                    .build();

            position = positionRepository.save(position);
            return ResponseEntity.status(HttpStatus.CREATED).body(position);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
