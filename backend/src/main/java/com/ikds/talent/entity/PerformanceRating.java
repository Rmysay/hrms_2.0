package com.ikds.talent.entity;

import com.ikds.auth.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "performance_ratings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User employee;

    private String period;  // e.g. "2026-Q1"

    @Min(1) @Max(5)
    @Column(nullable = false)
    private int performanceScore;

    @Min(1) @Max(5)
    @Column(nullable = false)
    private int potentialScore;

    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rated_by")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User ratedBy;

    @Column(updatable = false)
    private LocalDateTime ratedAt;

    @PrePersist
    protected void onCreate() {
        ratedAt = LocalDateTime.now();
    }
}
