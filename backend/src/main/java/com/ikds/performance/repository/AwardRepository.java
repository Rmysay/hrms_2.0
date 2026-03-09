package com.ikds.performance.repository;

import com.ikds.performance.entity.Award;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AwardRepository extends JpaRepository<Award, Long> {
    List<Award> findByEmployeeId(Long employeeId);
    List<Award> findAllByOrderByAwardDateDesc();
}
