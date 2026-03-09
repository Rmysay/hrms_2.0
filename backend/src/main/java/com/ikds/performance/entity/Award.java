package com.ikds.performance.entity;

import com.ikds.auth.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "awards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Award {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User employee;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AwardType type;

    private String description;

    private LocalDate awardDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "granted_by")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User grantedBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum AwardType {
        EMPLOYEE_OF_MONTH,
        INNOVATION,
        TEAMWORK,
        LEADERSHIP,
        CUSTOMER_FOCUS,
        PERFORMANCE
    }
}
