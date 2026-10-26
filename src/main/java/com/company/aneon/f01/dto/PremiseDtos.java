package com.company.aneon.f01.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.company.aneon.f01.constant.PremiseStatus;
import com.company.aneon.f01.constant.PremiseType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO mat bang F01 (F01UC01.x). code chinh sua chi o tao moi.
 */
public final class PremiseDtos {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng PremiseDtos và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private PremiseDtos() {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ create premise request
     * Phiên bản: Version 1
     */

    public record CreatePremiseRequest(
            @NotBlank @Size(max = 50) @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "Ma chi chua chu cai, chu so, dau cham, gach ngang") String code,
            @NotBlank @Size(max = 200) String name,
            @NotNull UUID zoneId,
            @NotNull @DecimalMin(value = "0.01", message = "Tong dien tich phai lon hon 0") BigDecimal totalArea,
            PremiseType type,
            @NotNull PremiseStatus status,
            UUID locationId,
            @Size(max = 1000) String description) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ update premise request
     * Phiên bản: Version 1
     */

    public record UpdatePremiseRequest(
            @NotBlank @Size(max = 200) String name,
            @NotNull UUID zoneId,
            @NotNull @DecimalMin(value = "0.01", message = "Tong dien tich phai lon hon 0") BigDecimal totalArea,
            PremiseType type,
            @Size(max = 1000) String description,
            @NotNull @Min(0) Long version) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ update premise location request
     * Phiên bản: Version 1
     */

    public record UpdatePremiseLocationRequest(
            @NotNull UUID locationId,
            @Size(max = 500) String reason) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ code availability
     * Phiên bản: Version 1
     */

    public record CodeAvailability(String code, boolean available) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ create premise result
     * Phiên bản: Version 1
     */

    public record CreatePremiseResult(UUID id, String code, PremiseStatus status) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ update result
     * Phiên bản: Version 1
     */

    public record UpdateResult(UUID id, long version) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ location update result
     * Phiên bản: Version 1
     */

    public record LocationUpdateResult(UUID premiseId, UUID locationId) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ premise list item
     * Phiên bản: Version 1
     */

    public record PremiseListItem(UUID id, String code, String name, UUID zoneId, String zoneName,
                                  String floorName, BigDecimal totalArea, PremiseType type,
                                  PremiseStatus status) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ premise detail
     * Phiên bản: Version 1
     */

    public record PremiseDetail(UUID id, String code, String name, UUID zoneId, String zoneName,
                                String floorName, String buildingName, BigDecimal totalArea,
                                BigDecimal allocatedArea, PremiseType type, PremiseStatus status,
                                UUID locationId, String description, long version, List<String> allowedStatuses) {
    }
}
