package com.ikds.recruitment.repository;

import com.ikds.recruitment.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobPostingId(Long jobPostingId);
    List<JobApplication> findByStatus(JobApplication.ApplicationStatus status);
    long countByJobPostingId(Long jobPostingId);
}
