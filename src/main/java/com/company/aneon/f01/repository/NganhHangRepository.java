package com.company.aneon.f01.repository;

import java.util.UUID;

import com.company.aneon.f01.entity.NganhHang;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NganhHangRepository extends JpaRepository<NganhHang, UUID> {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra sự tồn tại của dữ liệu trong cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    boolean existsByIdAndArchivedAtIsNull(UUID id);
}
