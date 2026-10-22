package com.company.aneon.f01.repository;

import java.util.List;
import java.util.UUID;

import com.company.aneon.f01.entity.Tang;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TangRepository extends JpaRepository<Tang, UUID> {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn chi tiết by building id and active true order by id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    List<Tang> findByBuildingIdAndActiveTrueOrderById(UUID buildingId);
}
