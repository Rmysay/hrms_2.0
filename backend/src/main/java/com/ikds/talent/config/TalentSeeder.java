package com.ikds.talent.config;

import com.ikds.auth.entity.User;
import com.ikds.auth.repository.UserRepository;
import com.ikds.talent.entity.*;
import com.ikds.talent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
public class TalentSeeder implements CommandLineRunner {

    private final SkillRepository skillRepository;
    private final PerformanceRatingRepository ratingRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (skillRepository.count() > 0) return;

        // ── Skills ──
        List<Skill> skills = List.of(
            Skill.builder().name("Java").category(Skill.SkillCategory.TECHNICAL).description("Java programlama dili").build(),
            Skill.builder().name("Spring Boot").category(Skill.SkillCategory.TECHNICAL).description("Spring Boot framework").build(),
            Skill.builder().name("React").category(Skill.SkillCategory.TECHNICAL).description("React.js frontend framework").build(),
            Skill.builder().name("SQL").category(Skill.SkillCategory.TECHNICAL).description("Veritabanı sorgulama").build(),
            Skill.builder().name("Python").category(Skill.SkillCategory.TECHNICAL).description("Python programlama").build(),
            Skill.builder().name("İletişim").category(Skill.SkillCategory.SOFT_SKILL).description("Etkili iletişim becerileri").build(),
            Skill.builder().name("Takım Çalışması").category(Skill.SkillCategory.SOFT_SKILL).description("Takım içi uyum ve işbirliği").build(),
            Skill.builder().name("Problem Çözme").category(Skill.SkillCategory.SOFT_SKILL).description("Analitik düşünme ve çözüm üretme").build(),
            Skill.builder().name("Liderlik").category(Skill.SkillCategory.LEADERSHIP).description("Ekip yönetimi ve yönlendirme").build(),
            Skill.builder().name("Stratejik Düşünme").category(Skill.SkillCategory.LEADERSHIP).description("Uzun vadeli planlama").build(),
            Skill.builder().name("Proje Yönetimi").category(Skill.SkillCategory.DOMAIN).description("Agile/Scrum metodolojileri").build(),
            Skill.builder().name("Veri Analizi").category(Skill.SkillCategory.DOMAIN).description("Veri işleme ve raporlama").build()
        );
        skillRepository.saveAll(skills);

        // ── Demo Performance Ratings (for 9-Box) ──
        List<User> users = userRepository.findAll();
        int[][] ratings = {
            {4, 5}, {3, 4}, {5, 3}, {2, 5}, {4, 2},
            {1, 3}, {5, 5}, {3, 2}, {2, 1}, {4, 4}
        };

        for (int i = 0; i < Math.min(users.size(), ratings.length); i++) {
            ratingRepository.save(PerformanceRating.builder()
                .employee(users.get(i))
                .period("2026-Q1")
                .performanceScore(ratings[i][0])
                .potentialScore(ratings[i][1])
                .notes("Otomatik seed verisi")
                .ratedBy(users.get(0))
                .build());
        }

        System.out.println("✅ Yetenek yönetimi seed verileri oluşturuldu!");
    }
}
