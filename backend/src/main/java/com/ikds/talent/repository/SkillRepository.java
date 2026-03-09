package com.ikds.talent.repository;

import com.ikds.talent.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByCategory(Skill.SkillCategory category);
    boolean existsByName(String name);
}
