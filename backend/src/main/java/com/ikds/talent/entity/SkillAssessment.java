package com.ikds.talent.entity;

import com.ikds.auth.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "skill_assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Skill skill;

    @Min(1) @Max(5)
    @Column(nullable = false)
    private int score;

    @Builder.Default
    private double weight = 1.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessed_by")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User assessedBy;

    @Column(updatable = false)
    private LocalDateTime assessedAt;

    @PrePersist
    protected void onCreate() {
        assessedAt = LocalDateTime.now();
    }
}
