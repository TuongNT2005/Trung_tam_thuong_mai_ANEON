package com.company.aneon.f01.dto;

import java.util.UUID;

import com.company.aneon.f01.constant.PremiseStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO trang thai mat bang (F01UC03.x).
 */
public final class StatusDtos {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng StatusDtos và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private StatusDtos() {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ change status request
     * Phiên bản: Version 1
     */

    public record ChangeStatusRequest(
            @NotNull PremiseStatus status,
            @Size(max = 500) String reason,
            @NotNull @Min(0) Long version) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ sync contract status request
     * Phiên bản: Version 1
     */

    public record SyncContractStatusRequest(@NotNull UUID contractId) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ status item
     * Phiên bản: Version 1
     */

    public record StatusItem(UUID id, String code, String name, PremiseStatus status) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ status change result
     * Phiên bản: Version 1
     */

    public record StatusChangeResult(UUID id, String code, PremiseStatus previousStatus,
                                     PremiseStatus currentStatus, long version) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ sync status result
     * Phiên bản: Version 1
     */

    public record SyncStatusResult(String premiseCode, PremiseStatus previousStatus,
                                   PremiseStatus currentStatus) {
    }
}
