package com.ikds.performance.service;

import com.ikds.auth.entity.User;
import com.ikds.auth.repository.UserRepository;
import com.ikds.performance.dto.*;
import com.ikds.performance.entity.*;
import com.ikds.performance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final PerformanceReviewRepository reviewRepository;
    private final AwardRepository awardRepository;
    private final UserRepository userRepository;

    // ── Reviews ──

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toReviewResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsByEmployee(Long employeeId) {
        return reviewRepository.findByEmployeeId(employeeId).stream()
                .map(this::toReviewResponse).collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, User reviewer) {
        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Çalışan bulunamadı"));

        PerformanceReview.ReviewStatus status = request.getStatus() != null
                ? PerformanceReview.ReviewStatus.valueOf(request.getStatus())
                : PerformanceReview.ReviewStatus.DRAFT;

        PerformanceReview review = reviewRepository.save(PerformanceReview.builder()
                .employee(employee)
                .period(request.getPeriod())
                .goals(request.getGoals())
                .overallScore(request.getOverallScore())
                .strengths(request.getStrengths())
                .improvements(request.getImprovements())
                .managerFeedback(request.getManagerFeedback())
                .status(status)
                .reviewer(reviewer)
                .completedAt(status == PerformanceReview.ReviewStatus.COMPLETED ? LocalDateTime.now() : null)
                .build());

        return toReviewResponse(review);
    }

    // ── Awards ──

    public List<AwardResponse> getAllAwards() {
        return awardRepository.findAllByOrderByAwardDateDesc().stream()
                .map(this::toAwardResponse).collect(Collectors.toList());
    }

    @Transactional
    public AwardResponse createAward(AwardRequest request, User grantor) {
        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Çalışan bulunamadı"));

        Award award = awardRepository.save(Award.builder()
                .employee(employee)
                .title(request.getTitle())
                .type(Award.AwardType.valueOf(request.getType()))
                .description(request.getDescription())
                .awardDate(request.getAwardDate())
                .grantedBy(grantor)
                .build());

        return toAwardResponse(award);
    }

    // ── Mapping ──

    private ReviewResponse toReviewResponse(PerformanceReview r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .employeeId(r.getEmployee().getId())
                .employeeName(r.getEmployee().getFirstName() + " " + r.getEmployee().getLastName())
                .employeeDepartment(r.getEmployee().getDepartment())
                .period(r.getPeriod())
                .goals(r.getGoals())
                .overallScore(r.getOverallScore())
                .strengths(r.getStrengths())
                .improvements(r.getImprovements())
                .managerFeedback(r.getManagerFeedback())
                .status(r.getStatus().name())
                .reviewerName(r.getReviewer() != null ? r.getReviewer().getFirstName() + " " + r.getReviewer().getLastName() : null)
                .createdAt(r.getCreatedAt())
                .completedAt(r.getCompletedAt())
                .build();
    }

    private AwardResponse toAwardResponse(Award a) {
        return AwardResponse.builder()
                .id(a.getId())
                .employeeId(a.getEmployee().getId())
                .employeeName(a.getEmployee().getFirstName() + " " + a.getEmployee().getLastName())
                .title(a.getTitle())
                .type(a.getType().name())
                .description(a.getDescription())
                .awardDate(a.getAwardDate())
                .grantedByName(a.getGrantedBy() != null ? a.getGrantedBy().getFirstName() + " " + a.getGrantedBy().getLastName() : null)
                .createdAt(a.getCreatedAt())
                .build();
    }
}
