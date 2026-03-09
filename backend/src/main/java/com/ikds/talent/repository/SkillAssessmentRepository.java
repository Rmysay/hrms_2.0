package com.ikds.talent.repository;

import com.ikds.talent.entity.SkillAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillAssessmentRepository extends JpaRepository<SkillAssessment, Long> {
    List<SkillAssessment> findByEmployeeId(Long employeeId);
    List<SkillAssessment> findBySkillId(Long skillId);
}
