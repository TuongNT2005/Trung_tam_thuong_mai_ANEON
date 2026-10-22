package com.company.aneon.f10.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f10.entity.MaQrThamGia;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface MaQrThamGiaRepository extends JpaRepository<MaQrThamGia, UUID> {

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn chi tiết active with lock by event id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select q from MaQrThamGia q where q.event.id = :eventId and q.active = true")
    List<MaQrThamGia> findActiveWithLockByEventId(@Param("eventId") UUID eventId);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn thông tin by token hash and active true theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    Optional<MaQrThamGia> findByTokenHashAndActiveTrue(String tokenHash);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn chi tiết first by event id and active true order by created at desc theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    Optional<MaQrThamGia> findFirstByEventIdAndActiveTrueOrderByCreatedAtDesc(UUID eventId);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn chi tiết by event id order by created at desc theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    List<MaQrThamGia> findByEventIdOrderByCreatedAtDesc(UUID eventId);
}
