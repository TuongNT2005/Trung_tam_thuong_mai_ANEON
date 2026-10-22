package com.company.aneon.f10.integration;

import java.util.Optional;
import java.util.UUID;

/**
 * Port doc du lieu F01 can cho F10 (vi tri, cua hang). F10 khong sua du lieu
 * F01 qua port nay (rule 06). lockLocation dung khi kiem tra trung lich sanh:
 * khoa dong hang vi_tri truoc khi kiem tra/luu hoat dong (rule 03).
 */
public interface F01LookupPort {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ location ref
     * Phiên bản: Version 1
     */

    record LocationRef(UUID id, UUID zoneId, String textDescription, boolean archived) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ store ref
     * Phiên bản: Version 1
     */

    record StoreRef(UUID id, String code, UUID zoneId, boolean archived) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn thông tin location theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    Optional<LocationRef> findLocation(UUID locationId);
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn thông tin store theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    Optional<StoreRef> findStore(UUID storeId);

    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ lock location
     * Phiên bản: Version 1
     */
    boolean lockLocation(UUID locationId);
}
