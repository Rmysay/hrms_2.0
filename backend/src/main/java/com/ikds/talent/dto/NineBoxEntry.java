package com.ikds.talent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class NineBoxEntry {
    private Long employeeId;
    private String firstName;
    private String lastName;
    private String department;
    private String title;
    private int performanceScore;
    private int potentialScore;
    private String period;
}
