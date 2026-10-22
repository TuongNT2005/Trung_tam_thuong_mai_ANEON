package com.company.aneon.f10.service;

import com.company.aneon.f10.entity.SuKien;
import com.company.aneon.shared.error.ApiException;
import com.company.aneon.shared.security.AccessScopePort;

final class EventAccess {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo đối tượng EventAccess và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private EventAccess() {
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ require in scope
     * Phiên bản: Version 1
     */

    static void requireInScope(SuKien event, AccessScopePort accessScopePort) {
        if (event.getArchivedAt() != null) {
            throw ApiException.notFound("Su kien", event.getId());
        }
        var location = event.getLocation();
        var zoneId = location == null || location.getZone() == null ? null : location.getZone().getId();
        if (!accessScopePort.currentScope().allowsZone(zoneId)) {
            throw ApiException.forbidden("Su kien nam ngoai pham vi duoc cap quyen");
        }
    }
}
