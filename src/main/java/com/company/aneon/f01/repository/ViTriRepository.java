package com.company.aneon.f01.repository;

import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f01.entity.ViTri;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ViTriRepository extends JpaRepository<ViTri, UUID> {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn chi tiết by id and zone id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    Optional<ViTri> findByIdAndZoneId(UUID id, UUID zoneId);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn chi tiết by id and archived at is null theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    Optional<ViTri> findByIdAndArchivedAtIsNull(UUID id);
}
