package com.company.aneon.f10.repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f10.entity.LanApDungKhuyenMai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LanApDungKhuyenMaiRepository extends JpaRepository<LanApDungKhuyenMai, UUID> {
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Truy vấn chi tiết by idempotency key theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    Optional<LanApDungKhuyenMai> findByIdempotencyKey(String idempotencyKey);
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Truy vấn chi tiết by customer voucher id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    Optional<LanApDungKhuyenMai> findByCustomerVoucherId(UUID customerVoucherId);

    interface PromotionAggregate {
        long getApplyCount();
        BigDecimal getTotalDiscount();
        long getTotalPoints();
    }

    /** Tong hop lan ap dung trong mot truy van, khong JOIN nhan ban. */
    @Query("""
            select count(a) as applyCount, coalesce(sum(a.discountAmount), 0) as totalDiscount,
                   coalesce(sum(a.pointsGranted), 0) as totalPoints
            from LanApDungKhuyenMai a where a.promotionId = :promotionId
            """)
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Tổng hợp số lần áp dụng, tổng chiết khấu và điểm tích lũy theo chương trình khuyến mãi
     * Phiên bản: Version 1
     */
    PromotionAggregate aggregateByPromotion(@Param("promotionId") UUID promotionId);
}
