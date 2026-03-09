package com.ikds.performance.controller;

import com.ikds.auth.entity.User;
import com.ikds.performance.dto.*;
import com.ikds.performance.service.PerformanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;

    // ── Reviews ──

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviews(@RequestParam(required = false) Long employeeId) {
        if (employeeId != null) {
            return ResponseEntity.ok(performanceService.getReviewsByEmployee(employeeId));
        }
        return ResponseEntity.ok(performanceService.getAllReviews());
    }

    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(@Valid @RequestBody ReviewRequest request, @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(performanceService.createReview(request, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Awards ──

    @GetMapping("/awards")
    public ResponseEntity<List<AwardResponse>> getAwards() {
        return ResponseEntity.ok(performanceService.getAllAwards());
    }

    @PostMapping("/awards")
    public ResponseEntity<?> createAward(@Valid @RequestBody AwardRequest request, @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(performanceService.createAward(request, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
