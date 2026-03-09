package com.ikds.performance.config;

import com.ikds.auth.entity.User;
import com.ikds.auth.repository.UserRepository;
import com.ikds.performance.entity.Award;
import com.ikds.performance.entity.PerformanceReview;
import com.ikds.performance.repository.AwardRepository;
import com.ikds.performance.repository.PerformanceReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@Order(4)
@RequiredArgsConstructor
public class PerformanceSeeder implements CommandLineRunner {

    private final PerformanceReviewRepository reviewRepository;
    private final AwardRepository awardRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (reviewRepository.count() > 0) return;

        List<User> users = userRepository.findAll();
        if (users.size() < 2) return;
        User reviewer = users.get(0);

        // Reviews
        for (int i = 0; i < Math.min(users.size(), 4); i++) {
            User emp = users.get(i);
            int score = 3 + (i % 3); // 3, 4, 5, 3
            reviewRepository.save(PerformanceReview.builder()
                .employee(emp)
                .period("2026-Q1")
                .goals("• Proje hedeflerini tamamla\n• Yeni teknolojileri öğren\n• Takım iletişimini güçlendir")
                .overallScore(Math.min(score, 5))
                .strengths(i % 2 == 0 ? "Teknik beceriler güçlü, problem çözme kabiliyeti yüksek" : "Takım çalışmasında başarılı, iletişim güçlü")
                .improvements(i % 2 == 0 ? "Zaman yönetimi geliştirilebilir" : "Teknik derinlik artırılabilir")
                .managerFeedback("Genel olarak iyi performans gösteriyor. " + (score >= 4 ? "Terfi için değerlendirilebilir." : "Belirli alanlarda gelişim planı önerilir."))
                .status(PerformanceReview.ReviewStatus.COMPLETED)
                .reviewer(reviewer)
                .build());
        }

        // Awards
        awardRepository.save(Award.builder()
            .employee(users.get(0)).title("Ayın Çalışanı - Ocak 2026")
            .type(Award.AwardType.EMPLOYEE_OF_MONTH).description("Mükemmel proje yönetimi ve liderlik")
            .awardDate(LocalDate.of(2026, 1, 31)).grantedBy(reviewer).build());
        awardRepository.save(Award.builder()
            .employee(users.get(1 % users.size())).title("İnovasyon Ödülü")
            .type(Award.AwardType.INNOVATION).description("Yeni otomasyon sistemi geliştirme")
            .awardDate(LocalDate.of(2026, 2, 15)).grantedBy(reviewer).build());
        awardRepository.save(Award.builder()
            .employee(users.get(0)).title("Takım Ruhu Ödülü")
            .type(Award.AwardType.TEAMWORK).description("Departmanlar arası işbirliğinde öncülük")
            .awardDate(LocalDate.of(2026, 3, 1)).grantedBy(reviewer).build());

        System.out.println("✅ Performans & Ödül seed verileri oluşturuldu!");
    }
}
