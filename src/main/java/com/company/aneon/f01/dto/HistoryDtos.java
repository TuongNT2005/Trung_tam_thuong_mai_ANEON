package com.company.aneon.f01.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO lich su mat bang/cua hang (F01UC04.x). Lich su chi doc.
 * from/to la ngay theo zone nghiep vu; service chuyen thanh Instant.
 */
public final class HistoryDtos {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng HistoryDtos và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private HistoryDtos() {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ history item
     * Phiên bản: Version 1
     */

    public record HistoryItem(UUID id, String targetType, UUID targetId, String action,
                              String oldValueJson, String newValueJson, UUID changedBy,
                              String reason, Instant createdAt) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ history search request
     * Phiên bản: Version 1
     */

    public record HistorySearchRequest(String targetType, UUID targetId, String targetCode,
                                       String action, UUID changedBy, LocalDate from, LocalDate to) {
    }
}
