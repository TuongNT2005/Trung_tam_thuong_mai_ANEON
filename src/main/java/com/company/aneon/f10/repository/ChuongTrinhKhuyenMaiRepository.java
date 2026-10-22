package com.company.aneon.f10.repository;

import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f10.entity.ChuongTrinhKhuyenMai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChuongTrinhKhuyenMaiRepository extends JpaRepository<ChuongTrinhKhuyenMai, UUID> {
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Kiểm tra sự tồn tại của dữ liệu trong cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    boolean existsByCodeIgnoreCase(String code);
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Truy vấn chi tiết any by id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    @Query("select p from ChuongTrinhKhuyenMai p where p.id = :id")
    Optional<ChuongTrinhKhuyenMai> findAnyById(@Param("id") UUID id);
}
