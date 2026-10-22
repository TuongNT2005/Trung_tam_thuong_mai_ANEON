package com.company.aneon.f01.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f01.entity.KhuVuc;

import org.springframework.data.jpa.repository.JpaRepository;

public interface KhuVucRepository extends JpaRepository<KhuVuc, UUID> {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn chi tiết by id and active true theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    Optional<KhuVuc> findByIdAndActiveTrue(UUID id);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn chi tiết by floor id and active true order by id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    List<KhuVuc> findByFloorIdAndActiveTrueOrderById(UUID floorId);
}
