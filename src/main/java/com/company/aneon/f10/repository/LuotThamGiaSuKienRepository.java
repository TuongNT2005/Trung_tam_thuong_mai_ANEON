package com.company.aneon.f10.repository;

import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f10.entity.LuotThamGiaSuKien;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LuotThamGiaSuKienRepository extends JpaRepository<LuotThamGiaSuKien, UUID> {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn chi tiết by event id and customer id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    Optional<LuotThamGiaSuKien> findByEventIdAndCustomerId(UUID eventId, UUID customerId);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Đếm tổng số lượng bản ghi thỏa mãn điều kiện
     * Phiên bản: Version 1
     */

    long countByEventId(UUID eventId);
}
