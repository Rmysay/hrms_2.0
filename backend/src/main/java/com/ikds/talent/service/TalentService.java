package com.ikds.talent.service;

import com.ikds.auth.entity.User;
import com.ikds.auth.repository.UserRepository;
import com.ikds.talent.dto.*;
import com.ikds.talent.entity.*;
import com.ikds.talent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TalentService {

    private final SkillRepository skillRepository;
    private final SkillAssessmentRepository assessmentRepository;
    private final PerformanceRatingRepository ratingRepository;
    private final UserRepository userRepository;

    // ── Skills ──

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill createSkill(SkillRequest request) {
        return skillRepository.save(Skill.builder()
                .name(request.getName())
                .category(Skill.SkillCategory.valueOf(request.getCategory()))
                .description(request.getDescription())
                .build());
    }

    // ── Assessments ──

    public List<SkillAssessment> getAssessmentsByEmployee(Long employeeId) {
        return assessmentRepository.findByEmployeeId(employeeId);
    }

    @Transactional
    public SkillAssessment createAssessment(AssessmentRequest request, User assessor) {
        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Çalışan bulunamadı"));
        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new RuntimeException("Yetkinlik bulunamadı"));

        return assessmentRepository.save(SkillAssessment.builder()
                .employee(employee)
                .skill(skill)
                .score(request.getScore())
                .weight(request.getWeight())
                .assessedBy(assessor)
                .build());
    }

    public double getWeightedScore(Long employeeId) {
        List<SkillAssessment> assessments = assessmentRepository.findByEmployeeId(employeeId);
        if (assessments.isEmpty()) return 0;

        double totalWeightedScore = assessments.stream()
                .mapToDouble(a -> a.getScore() * a.getWeight())
                .sum();
        double totalWeight = assessments.stream()
                .mapToDouble(SkillAssessment::getWeight)
                .sum();

        return totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100.0) / 100.0 : 0;
    }

    // ── Performance Ratings & 9-Box ──

    @Transactional
    public PerformanceRating createRating(PerformanceRatingRequest request, User rater) {
        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Çalışan bulunamadı"));

        return ratingRepository.save(PerformanceRating.builder()
                .employee(employee)
                .period(request.getPeriod())
                .performanceScore(request.getPerformanceScore())
                .potentialScore(request.getPotentialScore())
                .notes(request.getNotes())
                .ratedBy(rater)
                .build());
    }

    public List<NineBoxEntry> getNineBoxData() {
        return ratingRepository.findAll().stream()
                .collect(Collectors.groupingBy(r -> r.getEmployee().getId()))
                .values().stream()
                .map(ratings -> {
                    PerformanceRating latest = ratings.stream()
                            .max((a, b) -> a.getRatedAt().compareTo(b.getRatedAt()))
                            .orElse(null);
                    if (latest == null) return null;
                    User emp = latest.getEmployee();
                    return NineBoxEntry.builder()
                            .employeeId(emp.getId())
                            .firstName(emp.getFirstName())
                            .lastName(emp.getLastName())
                            .department(emp.getDepartment())
                            .title(emp.getTitle())
                            .performanceScore(latest.getPerformanceScore())
                            .potentialScore(latest.getPotentialScore())
                            .period(latest.getPeriod())
                            .build();
                })
                .filter(e -> e != null)
                .collect(Collectors.toList());
    }
}
