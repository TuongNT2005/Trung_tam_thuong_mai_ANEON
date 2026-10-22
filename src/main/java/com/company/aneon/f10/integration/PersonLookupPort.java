package com.company.aneon.f10.integration;

import java.util.Optional;
import java.util.UUID;

/**
 * Port danh nghia nguoi phu trach hoat dong (tai khoan F16).
 */
public interface PersonLookupPort {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ account exists
     * Phiên bản: Version 1
     */

    boolean accountExists(UUID accountId);

    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ customer link of
     * Phiên bản: Version 1
     */
    Optional<UUID> customerLinkOf(UUID accountId);
}
