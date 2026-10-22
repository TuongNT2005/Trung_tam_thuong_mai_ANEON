package com.company.aneon.f10.integration;

import java.util.List;
import java.util.UUID;

/**
 * Port khach hang F11 (chi tra cuu ton tai).
 */
public interface CustomerLookupPort {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ customer exists
     * Phiên bản: Version 1
     */

    boolean customerExists(UUID customerId);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ active membership tiers
     * Phiên bản: Version 1
     */

    List<String> activeMembershipTiers(UUID customerId);
}
