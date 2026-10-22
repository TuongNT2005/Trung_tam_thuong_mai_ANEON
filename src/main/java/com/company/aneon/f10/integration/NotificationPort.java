package com.company.aneon.f10.integration;

import java.util.UUID;

/**
 * Port thong bao F15. Thuc thi sau commit (xu ly su kien AFTER_COMMIT),
 * that bai provider khong duoc anh huong nghiep vu chinh (rule 06).
 */
public interface NotificationPort {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ notify event approval
     * Phiên bản: Version 1
     */

    void notifyEventApproval(UUID eventId, String decision, UUID recipientId);
}
