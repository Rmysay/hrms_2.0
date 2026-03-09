package com.ikds.recruitment.config;

import com.ikds.organization.entity.Department;
import com.ikds.organization.repository.DepartmentRepository;
import com.ikds.recruitment.entity.JobApplication;
import com.ikds.recruitment.entity.JobPosting;
import com.ikds.recruitment.repository.JobApplicationRepository;
import com.ikds.recruitment.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(3)
@RequiredArgsConstructor
public class RecruitmentSeeder implements CommandLineRunner {

    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository applicationRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public void run(String... args) {
        if (jobPostingRepository.count() > 0) return;

        List<Department> depts = departmentRepository.findAll();
        if (depts.isEmpty()) return;

        Department btDept = depts.stream().filter(d -> "BT".equals(d.getCode())).findFirst().orElse(depts.get(0));
        Department ikDept = depts.stream().filter(d -> "IK".equals(d.getCode())).findFirst().orElse(depts.get(0));
        Department fnDept = depts.stream().filter(d -> "FN".equals(d.getCode())).findFirst().orElse(depts.get(0));

        // Active job
        JobPosting job1 = jobPostingRepository.save(JobPosting.builder()
                .title("Kıdemli Java Geliştirici")
                .department(btDept)
                .description("Spring Boot ve mikroservis mimarisi deneyimi olan Java geliştiricisi arıyoruz.")
                .requirements("• 5+ yıl Java deneyimi\n• Spring Boot, JPA, REST API\n• PostgreSQL\n• Git, CI/CD")
                .status(JobPosting.JobStatus.ACTIVE)
                .publishedAt(LocalDateTime.now().minusDays(5))
                .closingDate(LocalDate.now().plusDays(25))
                .build());

        JobPosting job2 = jobPostingRepository.save(JobPosting.builder()
                .title("İK Uzmanı")
                .department(ikDept)
                .description("İşe alım süreçleri ve çalışan ilişkileri yönetimi.")
                .requirements("• 3+ yıl İK deneyimi\n• İşe alım süreçleri\n• İş hukuku bilgisi")
                .status(JobPosting.JobStatus.ACTIVE)
                .publishedAt(LocalDateTime.now().minusDays(3))
                .closingDate(LocalDate.now().plusDays(20))
                .build());

        JobPosting job3 = jobPostingRepository.save(JobPosting.builder()
                .title("React Frontend Geliştirici")
                .department(btDept)
                .description("Modern web uygulamaları geliştirmek üzere React geliştirici arıyoruz.")
                .requirements("• 3+ yıl React deneyimi\n• Redux, TypeScript\n• REST API entegrasyonu")
                .status(JobPosting.JobStatus.ACTIVE)
                .publishedAt(LocalDateTime.now().minusDays(1))
                .closingDate(LocalDate.now().plusDays(30))
                .build());

        // Draft
        jobPostingRepository.save(JobPosting.builder()
                .title("Finans Analisti")
                .department(fnDept)
                .description("Bütçe planlama ve mali analiz.")
                .requirements("• Finans veya iktisat lisans\n• Excel ileri düzey")
                .status(JobPosting.JobStatus.DRAFT)
                .build());

        // Closed
        jobPostingRepository.save(JobPosting.builder()
                .title("DevOps Mühendisi")
                .department(btDept)
                .description("CI/CD pipeline ve bulut altyapısı yönetimi.")
                .requirements("• Docker, Kubernetes\n• AWS/GCP\n• Terraform")
                .status(JobPosting.JobStatus.CLOSED)
                .publishedAt(LocalDateTime.now().minusDays(30))
                .closingDate(LocalDate.now().minusDays(5))
                .build());

        // Applications for job1
        applicationRepository.save(JobApplication.builder()
                .jobPosting(job1).candidateName("Mehmet Demir").candidateEmail("mehmet@email.com")
                .candidatePhone("555-1234").status(JobApplication.ApplicationStatus.INTERVIEW)
                .coverLetter("5 yıllık Java deneyimim var.").build());
        applicationRepository.save(JobApplication.builder()
                .jobPosting(job1).candidateName("Zeynep Kaya").candidateEmail("zeynep@email.com")
                .candidatePhone("555-5678").status(JobApplication.ApplicationStatus.SCREENING)
                .coverLetter("Spring Boot projelerinde çalıştım.").build());
        applicationRepository.save(JobApplication.builder()
                .jobPosting(job1).candidateName("Ali Yıldız").candidateEmail("ali@email.com")
                .candidatePhone("555-9012").status(JobApplication.ApplicationStatus.APPLIED)
                .coverLetter("Yeni mezun, staj deneyimim var.").build());
        applicationRepository.save(JobApplication.builder()
                .jobPosting(job1).candidateName("Fatma Şen").candidateEmail("fatma@email.com")
                .candidatePhone("555-3456").status(JobApplication.ApplicationStatus.OFFERED)
                .coverLetter("8 yıl deneyimli senior geliştirici.").build());

        // Applications for job2
        applicationRepository.save(JobApplication.builder()
                .jobPosting(job2).candidateName("Elif Aksoy").candidateEmail("elif@email.com")
                .candidatePhone("555-7890").status(JobApplication.ApplicationStatus.APPLIED)
                .coverLetter("İK alanında 4 yıl deneyim.").build());
        applicationRepository.save(JobApplication.builder()
                .jobPosting(job2).candidateName("Can Özdemir").candidateEmail("can@email.com")
                .candidatePhone("555-2345").status(JobApplication.ApplicationStatus.REJECTED)
                .notes("Deneyim yetersiz").build());

        // Applications for job3
        applicationRepository.save(JobApplication.builder()
                .jobPosting(job3).candidateName("Selin Toprak").candidateEmail("selin@email.com")
                .candidatePhone("555-6789").status(JobApplication.ApplicationStatus.SCREENING)
                .coverLetter("React ve TypeScript konusunda uzmanlık.").build());

        System.out.println("✅ İşe alım seed verileri oluşturuldu!");
    }
}
