package com.company.aneon.f01.integration;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port kiem tra vi tri tren ban do so F18. F01 giu location_id; F18 chi
 * xac minh kha anh xa (rule f01: khong thay location_id cua F01).
 */
public interface DigitalMapPort {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ map point
     * Phiên bản: Version 1
     */

    record MapPoint(UUID id, BigDecimal x, BigDecimal y, String label) { }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ floor map
     * Phiên bản: Version 1
     */

    record FloorMap(UUID id, String name, BigDecimal minX, BigDecimal minY,
                    BigDecimal maxX, BigDecimal maxY, List<MapPoint> points) { }

    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra trạng thái is available của đối tượng
     * Phiên bản: Version 1
     */
    boolean isAvailable();
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra trạng thái is location mappable của đối tượng
     * Phiên bản: Version 1
     */

    boolean isLocationMappable(UUID locationId);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn thông tin for zone theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    Optional<FloorMap> findForZone(UUID zoneId);
}
