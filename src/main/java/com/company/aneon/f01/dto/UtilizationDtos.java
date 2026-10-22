package com.company.aneon.f01.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.company.aneon.f01.constant.PremiseStatus;

/**
 * DTO khai thac mat bang (F01UC05.x). Summary tinh tren toan bo tap da loc.
 */
public final class UtilizationDtos {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng UtilizationDtos và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private UtilizationDtos() {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ utilization summary
     * Phiên bản: Version 1
     */

    public record UtilizationSummary(long total, long occupied, long vacant, long maintenance) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ utilization item
     * Phiên bản: Version 1
     */

    public record UtilizationItem(UUID id, String code, String name, String zoneName, String floorName,
                                  String buildingName, BigDecimal totalArea, BigDecimal allocatedArea,
                                  PremiseStatus status) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ utilization page
     * Phiên bản: Version 1
     */

    public record UtilizationPage(UtilizationSummary summary, List<UtilizationItem> content,
                                  int page, int size, long totalElements) {
    }
}
