package com.company.aneon.f10.repository;


/**
 * ==============================================================================
 * Người code: Tùng
 * Ngày code: 27/10/2026
 * Chức năng: Repository truy vấn dữ liệu phiếu ưu đãi khách hàng và ví voucher cá nhân
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f10.constant.VoucherIssueStatus;
import com.company.aneon.f10.entity.PhieuUuDaiKhachHang;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface PhieuUuDaiKhachHangRepository extends JpaRepository<PhieuUuDaiKhachHang, UUID> {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn chi tiết with lock by id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from PhieuUuDaiKhachHang i where i.id = :id")
    Optional<PhieuUuDaiKhachHang> findWithLockById(@Param("id") UUID id);
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Đếm tổng số lượng bản ghi thỏa mãn điều kiện
     * Phiên bản: Version 1
     */

    long countByVoucherIdAndCustomerIdAndStatusNot(UUID voucherId, UUID customerId, VoucherIssueStatus status);
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn chi tiết by voucher id and issue reference theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    Optional<PhieuUuDaiKhachHang> findByVoucherIdAndIssueReference(UUID voucherId, String issueReference);
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn chi tiết by customer id and status theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    List<PhieuUuDaiKhachHang> findByCustomerIdAndStatus(UUID customerId, VoucherIssueStatus status);
}
