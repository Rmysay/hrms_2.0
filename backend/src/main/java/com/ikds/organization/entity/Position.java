package com.ikds.organization.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "positions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PositionLevel level;

    @Builder.Default
    private boolean isActive = true;

    public enum PositionLevel {
        INTERN,
        JUNIOR,
        MID,
        SENIOR,
        LEAD,
        MANAGER,
        DIRECTOR
    }
}
