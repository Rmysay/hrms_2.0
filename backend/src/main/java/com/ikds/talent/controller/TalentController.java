package com.ikds.talent.controller;

import com.ikds.auth.entity.User;
import com.ikds.talent.dto.*;
import com.ikds.talent.entity.Skill;
import com.ikds.talent.entity.SkillAssessment;
import com.ikds.talent.service.TalentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/talent")
@RequiredArgsConstructor
public class TalentController {

    private final TalentService talentService;

    // ── Skills ──

    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(talentService.getAllSkills());
    }

    @PostMapping("/skills")
    public ResponseEntity<?> createSkill(@Valid @RequestBody SkillRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(talentService.createSkill(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Assessments ──

    @GetMapping("/assessments/employee/{id}")
    public ResponseEntity<List<SkillAssessment>> getAssessments(@PathVariable Long id) {
        return ResponseEntity.ok(talentService.getAssessmentsByEmployee(id));
    }

    @GetMapping("/assessments/weighted-score/{employeeId}")
    public ResponseEntity<Map<String, Object>> getWeightedScore(@PathVariable Long employeeId) {
        return ResponseEntity.ok(Map.of("employeeId", employeeId, "weightedScore", talentService.getWeightedScore(employeeId)));
    }

    @PostMapping("/assessments")
    public ResponseEntity<?> createAssessment(@Valid @RequestBody AssessmentRequest request, @AuthenticationPrincipal User assessor) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(talentService.createAssessment(request, assessor));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── 9-Box Grid ──

    @GetMapping("/nine-box")
    public ResponseEntity<List<NineBoxEntry>> getNineBoxData() {
        return ResponseEntity.ok(talentService.getNineBoxData());
    }

    @PostMapping("/performance-rating")
    public ResponseEntity<?> createRating(@Valid @RequestBody PerformanceRatingRequest request, @AuthenticationPrincipal User rater) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(talentService.createRating(request, rater));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
