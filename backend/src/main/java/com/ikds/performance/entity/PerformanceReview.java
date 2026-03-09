package com.ikds.performance.entity;

import com.ikds.auth.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "performance_reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User employee;

    private String period;  // "2026-Q1"

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Min(1) @Max(5)
    private int overallScore;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String improvements;

    @Column(columnDefinition = "TEXT")
    private String managerFeedback;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReviewStatus status = ReviewStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User reviewer;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ReviewStatus {
        DRAFT, IN_PROGRESS, COMPLETED
    }
}
