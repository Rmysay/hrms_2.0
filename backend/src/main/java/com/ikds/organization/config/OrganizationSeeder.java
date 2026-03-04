package com.ikds.organization.config;

import com.ikds.organization.entity.Department;
import com.ikds.organization.entity.Position;
import com.ikds.organization.repository.DepartmentRepository;
import com.ikds.organization.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrganizationSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    @Override
    public void run(String... args) {
        if (departmentRepository.count() > 0) return; // Already seeded

        // Root
        Department ceo = departmentRepository.save(Department.builder()
                .name("Genel Müdürlük")
                .code("GM")
                .description("Şirket üst yönetimi")
                .build());

        // Level 1
        Department ik = departmentRepository.save(Department.builder()
                .name("İnsan Kaynakları")
                .code("IK")
                .description("Personel yönetimi, işe alım, eğitim ve gelişim")
                .parentDepartment(ceo)
                .build());

        Department bilgiTeknolojileri = departmentRepository.save(Department.builder()
                .name("Bilgi Teknolojileri")
                .code("BT")
                .description("Yazılım geliştirme, altyapı ve siber güvenlik")
                .parentDepartment(ceo)
                .build());

        Department finans = departmentRepository.save(Department.builder()
                .name("Finans")
                .code("FN")
                .description("Muhasebe, bütçe ve mali raporlama")
                .parentDepartment(ceo)
                .build());

        Department pazarlama = departmentRepository.save(Department.builder()
                .name("Pazarlama")
                .code("PZ")
                .description("Marka yönetimi, dijital pazarlama ve iletişim")
                .parentDepartment(ceo)
                .build());

        Department satis = departmentRepository.save(Department.builder()
                .name("Satış")
                .code("ST")
                .description("Kurumsal satış, müşteri ilişkileri")
                .parentDepartment(ceo)
                .build());

        // Level 2 — IT sub-departments
        Department yazilim = departmentRepository.save(Department.builder()
                .name("Yazılım Geliştirme")
                .code("BT-YG")
                .description("Backend, frontend ve mobil geliştirme")
                .parentDepartment(bilgiTeknolojileri)
                .build());

        Department altyapi = departmentRepository.save(Department.builder()
                .name("Altyapı & DevOps")
                .code("BT-AD")
                .description("Sunucu yönetimi, CI/CD, bulut altyapısı")
                .parentDepartment(bilgiTeknolojileri)
                .build());

        // Level 2 — HR sub-departments
        Department iseAlim = departmentRepository.save(Department.builder()
                .name("İşe Alım")
                .code("IK-IA")
                .description("Aday tarama, mülakat ve onboarding")
                .parentDepartment(ik)
                .build());

        Department egitim = departmentRepository.save(Department.builder()
                .name("Eğitim & Gelişim")
                .code("IK-EG")
                .description("Çalışan eğitimleri ve kariyer gelişimi")
                .parentDepartment(ik)
                .build());

        // Positions
        createPositions(ceo, "Genel Müdür", Position.PositionLevel.DIRECTOR);
        createPositions(ik, "İK Direktörü", Position.PositionLevel.DIRECTOR);
        createPositions(ik, "İK Uzmanı", Position.PositionLevel.MID);
        createPositions(bilgiTeknolojileri, "BT Direktörü", Position.PositionLevel.DIRECTOR);
        createPositions(yazilim, "Yazılım Mühendisi", Position.PositionLevel.MID);
        createPositions(yazilim, "Kıdemli Yazılım Mühendisi", Position.PositionLevel.SENIOR);
        createPositions(yazilim, "Takım Lideri", Position.PositionLevel.LEAD);
        createPositions(altyapi, "DevOps Mühendisi", Position.PositionLevel.MID);
        createPositions(finans, "Finans Direktörü", Position.PositionLevel.DIRECTOR);
        createPositions(finans, "Muhasebe Uzmanı", Position.PositionLevel.MID);
        createPositions(pazarlama, "Pazarlama Direktörü", Position.PositionLevel.DIRECTOR);
        createPositions(pazarlama, "Dijital Pazarlama Uzmanı", Position.PositionLevel.MID);
        createPositions(satis, "Satış Müdürü", Position.PositionLevel.MANAGER);
        createPositions(satis, "Satış Temsilcisi", Position.PositionLevel.JUNIOR);
        createPositions(iseAlim, "İşe Alım Uzmanı", Position.PositionLevel.MID);
        createPositions(egitim, "Eğitim Koordinatörü", Position.PositionLevel.MID);

        System.out.println("✅ Organizasyon seed verileri oluşturuldu!");
    }

    private void createPositions(Department dept, String title, Position.PositionLevel level) {
        positionRepository.save(Position.builder()
                .title(title)
                .department(dept)
                .level(level)
                .isActive(true)
                .build());
    }
}
