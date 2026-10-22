package com.company.aneon.shared.reference;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Tra cuu tep dinh kem chi doc theo storage_key (kiem tra so huu/dinh dang).
 */
public interface TepDinhKemLookupRepository extends JpaRepository<TepDinhKemRef, UUID> {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn thông tin by storage key theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    Optional<TepDinhKemRef> findByStorageKey(String storageKey);
}
