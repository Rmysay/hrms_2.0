package com.ikds.recruitment.repository;

import com.ikds.recruitment.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByStatus(JobPosting.JobStatus status);
    List<JobPosting> findByDepartmentId(Long departmentId);
    List<JobPosting> findAllByOrderByCreatedAtDesc();
}
