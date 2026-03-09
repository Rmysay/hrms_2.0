package com.ikds.talent.repository;

import com.ikds.talent.entity.PerformanceRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformanceRatingRepository extends JpaRepository<PerformanceRating, Long> {
    List<PerformanceRating> findByEmployeeId(Long employeeId);
    Optional<PerformanceRating> findTopByEmployeeIdOrderByRatedAtDesc(Long employeeId);
}
