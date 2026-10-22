package com.company.aneon.shared.reference;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Tra cuu tai khoan F16 chi doc (tham chieu FK, khong CRUD F16).
 */
public interface TaiKhoanNguoiDungLookupRepository extends JpaRepository<TaiKhoanNguoiDungRef, UUID> {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn chi tiết with customer id by id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    @Query("select t from TaiKhoanNguoiDungRef t where t.id = :id")
    Optional<TaiKhoanNguoiDungRef> findWithCustomerIdById(@Param("id") UUID id);
}
