package com.company.aneon.f10.service;

import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;

/**
 * Su kien ung dung phat sau commit (AFTER_COMMIT) cho thong bao duyet.
 * Khong giu khoa DB khi goi provider (rule 06).
 */
public record EventApprovalNotification(UUID eventId, UUID recipientId, String decision) {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ of
     * Phiên bản: Version 1
     */

    public static EventApprovalNotification of(UUID eventId, UUID recipientId, String decision) {
        return new EventApprovalNotification(eventId, recipientId, decision);
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ publish with
     * Phiên bản: Version 1
     */

    public void publishWith(ApplicationEventPublisher publisher) {
        publisher.publishEvent(this);
    }
}
