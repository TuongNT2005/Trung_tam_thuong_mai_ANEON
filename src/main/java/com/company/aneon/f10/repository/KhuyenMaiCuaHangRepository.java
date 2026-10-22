package com.company.aneon.f10.repository;

import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.entity.KhuyenMaiCuaHang;

import org.springframework.data.jpa.repository.JpaRepository;

public interface KhuyenMaiCuaHangRepository extends JpaRepository<KhuyenMaiCuaHang, UUID> {
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Truy vấn chi tiết by promotion id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    List<KhuyenMaiCuaHang> findByPromotionId(UUID promotionId);
}
