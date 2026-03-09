package com.ikds.recruitment.controller;

import com.ikds.auth.entity.User;
import com.ikds.recruitment.dto.*;
import com.ikds.recruitment.service.RecruitmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruitment")
@RequiredArgsConstructor
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    // ── Jobs ──

    @GetMapping("/jobs")
    public ResponseEntity<List<JobPostingResponse>> getJobs(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(recruitmentService.getJobsByStatus(status));
        }
        return ResponseEntity.ok(recruitmentService.getAllJobs());
    }

    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(@Valid @RequestBody JobPostingRequest request, @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(recruitmentService.createJob(request, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/jobs/{id}/status")
    public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(recruitmentService.updateJobStatus(id, body.get("status")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Applications ──

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(recruitmentService.getAllApplications());
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicationResponse>> getApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(recruitmentService.getApplicationsByJob(jobId));
    }

    @PostMapping("/applications")
    public ResponseEntity<?> createApplication(@Valid @RequestBody ApplicationRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(recruitmentService.createApplication(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateAppStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(recruitmentService.updateApplicationStatus(id, body.get("status"), body.get("notes")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
