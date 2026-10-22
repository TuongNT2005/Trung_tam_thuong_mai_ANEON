package com.company.aneon.f10.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.entity.ChiPhiThucTe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChiPhiThucTeRepository extends JpaRepository<ChiPhiThucTe, UUID> {

    /** Tong chi phi tu ban ghi thuc te hop le, khong nhan ban (rule f10). */
    @Query("select coalesce(sum(c.amount), 0) from ChiPhiThucTe c "
            + "where c.event.id = :eventId and c.archivedAt is null")
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ sum actual expense
     * Phiên bản: Version 1
     */
    BigDecimal sumActualExpense(@Param("eventId") UUID eventId);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn chi tiết by event id and archived at is null order by incurred at desc theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    List<ChiPhiThucTe> findByEventIdAndArchivedAtIsNullOrderByIncurredAtDesc(UUID eventId);
}
