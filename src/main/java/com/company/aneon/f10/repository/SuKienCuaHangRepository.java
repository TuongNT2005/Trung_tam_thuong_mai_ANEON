package com.company.aneon.f10.repository;

import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.entity.SuKienCuaHang;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * ==============================================================================
 * Người code: Bảo
 * Ngày code: 24/10/2026
 * Chức năng: Repository truy vấn mối quan hệ giữa sự kiện và các cửa hàng tham gia
 * Phiên bản: Version 1
 * ==============================================================================
 */
public interface SuKienCuaHangRepository extends JpaRepository<SuKienCuaHang, UUID> {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn chi tiết by event id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    List<SuKienCuaHang> findByEventId(UUID eventId);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Kiểm tra sự tồn tại của dữ liệu trong cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    boolean existsByEventIdAndStoreId(UUID eventId, UUID storeId);
}
