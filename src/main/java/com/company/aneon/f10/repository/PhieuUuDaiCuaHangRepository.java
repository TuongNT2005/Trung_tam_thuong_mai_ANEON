package com.company.aneon.f10.repository;

import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.entity.PhieuUuDaiCuaHang;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PhieuUuDaiCuaHangRepository extends JpaRepository<PhieuUuDaiCuaHang, UUID> {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn chi tiết by voucher id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    List<PhieuUuDaiCuaHang> findByVoucherId(UUID voucherId);
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Kiểm tra sự tồn tại của dữ liệu trong cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    boolean existsByVoucherIdAndStoreId(UUID voucherId, UUID storeId);
}
