package com.ikds.performance.repository;

import com.ikds.performance.entity.PerformanceReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {
    List<PerformanceReview> findByEmployeeId(Long employeeId);
    List<PerformanceReview> findByPeriod(String period);
    List<PerformanceReview> findAllByOrderByCreatedAtDesc();
}
