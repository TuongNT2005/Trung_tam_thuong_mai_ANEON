package com.company.aneon.f01.service;

import java.util.UUID;

import com.company.aneon.shared.security.AccessScopePort;
import com.company.aneon.shared.error.ApiException;

import org.springframework.stereotype.Component;

/**
 * Kiem tra pham vi du lieu (scope) cua mat bang theo zone.
 */
@Component
public class PremiseScopeGuard {

    private final AccessScopePort accessScopePort;
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng PremiseScopeGuard và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public PremiseScopeGuard(AccessScopePort accessScopePort) {
        this.accessScopePort = accessScopePort;
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ assert zone in scope
     * Phiên bản: Version 1
     */

    public void assertZoneInScope(UUID zoneId) {
        if (zoneId != null && !accessScopePort.currentScope().allowsZone(zoneId)) {
            throw ApiException.forbidden("Du lieu nam ngoai pham vi duoc cap quyen");
        }
    }
}
