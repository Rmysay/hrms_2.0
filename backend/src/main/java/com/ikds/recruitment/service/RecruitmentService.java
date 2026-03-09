package com.ikds.recruitment.service;

import com.ikds.auth.entity.User;
import com.ikds.organization.entity.Department;
import com.ikds.organization.repository.DepartmentRepository;
import com.ikds.recruitment.dto.*;
import com.ikds.recruitment.entity.*;
import com.ikds.recruitment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruitmentService {

    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository applicationRepository;
    private final DepartmentRepository departmentRepository;

    // ── Job Postings ──

    public List<JobPostingResponse> getAllJobs() {
        return jobPostingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<JobPostingResponse> getJobsByStatus(String status) {
        return jobPostingRepository.findByStatus(JobPosting.JobStatus.valueOf(status)).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public JobPostingResponse createJob(JobPostingRequest request, User creator) {
        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Departman bulunamadı"));

        JobPosting.JobStatus status = request.getStatus() != null
                ? JobPosting.JobStatus.valueOf(request.getStatus()) : JobPosting.JobStatus.DRAFT;

        JobPosting job = jobPostingRepository.save(JobPosting.builder()
                .title(request.getTitle())
                .department(dept)
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .status(status)
                .closingDate(request.getClosingDate())
                .createdBy(creator)
                .publishedAt(status == JobPosting.JobStatus.ACTIVE ? LocalDateTime.now() : null)
                .build());

        return toResponse(job);
    }

    @Transactional
    public JobPostingResponse updateJobStatus(Long id, String status) {
        JobPosting job = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("İlan bulunamadı"));
        JobPosting.JobStatus newStatus = JobPosting.JobStatus.valueOf(status);
        job.setStatus(newStatus);
        if (newStatus == JobPosting.JobStatus.ACTIVE && job.getPublishedAt() == null) {
            job.setPublishedAt(LocalDateTime.now());
        }
        return toResponse(jobPostingRepository.save(job));
    }

    // ── Applications ──

    public List<ApplicationResponse> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobPostingId(jobId).stream()
                .map(this::toAppResponse).collect(Collectors.toList());
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::toAppResponse).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request) {
        JobPosting job = jobPostingRepository.findById(request.getJobPostingId())
                .orElseThrow(() -> new RuntimeException("İlan bulunamadı"));

        JobApplication app = applicationRepository.save(JobApplication.builder()
                .jobPosting(job)
                .candidateName(request.getCandidateName())
                .candidateEmail(request.getCandidateEmail())
                .candidatePhone(request.getCandidatePhone())
                .resumeUrl(request.getResumeUrl())
                .coverLetter(request.getCoverLetter())
                .build());
        return toAppResponse(app);
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long id, String status, String notes) {
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı"));
        app.setStatus(JobApplication.ApplicationStatus.valueOf(status));
        if (notes != null) app.setNotes(notes);
        return toAppResponse(applicationRepository.save(app));
    }

    // ── Mapping ──

    private JobPostingResponse toResponse(JobPosting job) {
        return JobPostingResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .departmentId(job.getDepartment() != null ? job.getDepartment().getId() : null)
                .departmentName(job.getDepartment() != null ? job.getDepartment().getName() : null)
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .status(job.getStatus().name())
                .closingDate(job.getClosingDate())
                .createdAt(job.getCreatedAt())
                .publishedAt(job.getPublishedAt())
                .applicationCount(applicationRepository.countByJobPostingId(job.getId()))
                .build();
    }

    private ApplicationResponse toAppResponse(JobApplication app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .jobPostingId(app.getJobPosting().getId())
                .jobTitle(app.getJobPosting().getTitle())
                .candidateName(app.getCandidateName())
                .candidateEmail(app.getCandidateEmail())
                .candidatePhone(app.getCandidatePhone())
                .resumeUrl(app.getResumeUrl())
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus().name())
                .notes(app.getNotes())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
