package com.company.aneon.f01.repository;

import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f01.entity.MatBang;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface MatBangRepository extends JpaRepository<MatBang, UUID> {

    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn chi tiết with lock by id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from MatBang m where m.id = :id")
    Optional<MatBang> findWithLockById(@Param("id") UUID id);

    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra sự tồn tại của dữ liệu trong cơ sở dữ liệu
     * Phiên bản: Version 1
     */
    boolean existsByCodeIgnoreCase(String code);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn thông tin by code ignore case theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    java.util.Optional<MatBang> findByCodeIgnoreCase(String code);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra sự tồn tại của dữ liệu trong cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    boolean existsByCodeIgnoreCaseAndIdNot(String code, UUID id);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn chi tiết with zone floor by id theo mã định danh hoặc khóa chính
     * Phiên bản: Version 1
     */

    @Query("select m from MatBang m left join fetch m.zone z left join fetch z.floor where m.id = :id")
    Optional<MatBang> findWithZoneFloorById(@Param("id") UUID id);
}
