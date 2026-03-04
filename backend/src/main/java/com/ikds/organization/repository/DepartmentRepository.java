package com.ikds.organization.repository;

import com.ikds.organization.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    List<Department> findByParentDepartmentIsNull();

    List<Department> findByParentDepartmentId(Long parentId);

    Optional<Department> findByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT COUNT(u) FROM User u WHERE u.department = :departmentName")
    long countEmployeesByDepartmentName(String departmentName);
}
