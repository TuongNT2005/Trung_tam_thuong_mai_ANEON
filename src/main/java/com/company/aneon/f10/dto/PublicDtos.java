package com.company.aneon.f10.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * DTO cong khai F10UC03. Chi chua du lieu public: khong co ngan sach, chi
 * phi, nguoi duyet, QR, redis key hay du lieu khach (rule 05).
 */
public final class PublicDtos {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng PublicDtos và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private PublicDtos() {
    }

    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ public row
     * Phiên bản: Version 1
     */
    public record PublicRow(UUID id, String title, String category, String type,
                            Instant startAt, Instant endAt, String location, String terms) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ public item
     * Phiên bản: Version 1
     */

    public record PublicItem(UUID id, String title, String category, String type,
                             Instant startAt, Instant endAt, String location, String terms, String availability) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ public search response
     * Phiên bản: Version 1
     */

    public record PublicSearchResponse(List<PublicItem> content, int page, int size, long totalElements) {
    }
}
