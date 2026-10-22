package com.company.aneon.f10.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.constant.EventStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO su kien F10 (F10UC01.x). Client khong duoc gan proposedBy/approvedBy/
 * approvedBudget/ngan sach duyet (rule 04).
 */
public final class EventDtos {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng EventDtos và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private EventDtos() {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ create event proposal request
     * Phiên bản: Version 1
     */

    public record CreateEventProposalRequest(
            @NotBlank @Size(max = 50) @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "Ma chi chua chu cai, chu so, dau cham, gach ngang") String code,
            @NotBlank @Size(max = 200) String name,
            @Size(max = 100) String type,
            @NotNull UUID locationId,
            @NotNull Instant startAt,
            @NotNull Instant endAt,
            @NotNull @DecimalMin(value = "0", message = "Ngan sach du kien khong am") BigDecimal estimatedBudget,
            @NotNull @Min(0) Integer targetAttendees,
            Boolean publicVisible,
            List<UUID> participatingStoreIds,
            List<String> proposalFileKeys) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ approve event request
     * Phiên bản: Version 1
     */

    public record ApproveEventRequest(
            @NotBlank String action,
            @DecimalMin(value = "0", message = "Ngan sach duyet khong am") BigDecimal approvedBudget,
            @Size(max = 500) String rejectionReason,
            @Size(max = 500) String note,
            @NotNull @Min(0) Long version) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ create activity request
     * Phiên bản: Version 1
     */

    public record CreateActivityRequest(
            @NotBlank @Size(max = 200) String name,
            @NotNull Instant startAt,
            @NotNull Instant endAt,
            @NotNull UUID locationId,
            UUID personInCharge,
            @Size(max = 1000) String description) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ create activities request
     * Phiên bản: Version 1
     */

    public record CreateActivitiesRequest(@NotNull List<@NotNull @Valid CreateActivityRequest> activities) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ activity item
     * Phiên bản: Version 1
     */

    public record ActivityItem(UUID id, String name, Instant startAt, Instant endAt, UUID locationId,
                               UUID personInCharge, String description, long version) { }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ create expense request
     * Phiên bản: Version 1
     */

    public record CreateExpenseRequest(
            @Size(max = 200) String supplierName,
            @Size(max = 100) String invoiceNumber,
            @NotNull @DecimalMin(value = "0.01", message = "So tien phai lon hon 0") BigDecimal amount,
            Instant incurredAt,
            UUID attachmentId,
            @Size(max = 1000) String description) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ qr code dto
     * Phiên bản: Version 1
     */

    public record QrCodeDto(UUID qrCodeId, String checkInUrl, String imageStorageKey,
                            Instant expiresAt, boolean active, String token) {
        public QrCodeDto(UUID qrCodeId, String checkInUrl, String imageStorageKey,
                         Instant expiresAt, boolean active) {
            this(qrCodeId, checkInUrl, imageStorageKey, expiresAt, active, extractToken(checkInUrl));
        }

        private static String extractToken(String url) {
            if (url == null || !url.contains("token=")) return null;
            String after = url.substring(url.indexOf("token=") + 6);
            int amp = after.indexOf('&');
            return amp >= 0 ? after.substring(0, amp) : after;
        }
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ check in request
     * Phiên bản: Version 1
     */

    public record CheckInRequest(String qrToken,
                                 UUID customerId,
                                 @Size(max = 200) String scanningDevice) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ event summary
     * Phiên bản: Version 1
     */

    public record EventSummary(UUID id, String code, String name, EventStatus status,
                               BigDecimal estimatedBudget, UUID proposedBy, Instant createdAt) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ event detail
     * Phiên bản: Version 1
     */

    public record EventDetail(UUID id, String code, String name, String type, EventStatus status,
                              UUID locationId, String locationDescription, Instant startAt, Instant endAt,
                              BigDecimal estimatedBudget, BigDecimal approvedBudget, Integer targetAttendees,
                              boolean publicVisible, UUID proposedBy, UUID approvedBy, Instant approvedAt,
                              String rejectionReason, List<UUID> participatingStoreIds, long version) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ activity created result
     * Phiên bản: Version 1
     */

    public record ActivityCreatedResult(UUID eventId, int createdCount) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ expense created result
     * Phiên bản: Version 1
     */

    public record ExpenseCreatedResult(UUID id, java.math.BigDecimal amount) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ check in result
     * Phiên bản: Version 1
     */

    public record CheckInResult(UUID checkInId, UUID eventId, UUID customerId, Instant checkInAt,
                                boolean duplicate) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ event report response
     * Phiên bản: Version 1
     */

    public record EventReportResponse(UUID eventId, String eventName, EventStatus status,
                                      BigDecimal approvedBudget, BigDecimal estimatedBudget,
                                      BigDecimal totalActualExpense, BigDecimal budgetVariance,
                                      Integer targetAttendees, long actualAttendees,
                                      BigDecimal attendanceRate, BigDecimal roiPercentage,
                                      String roiStatus) {
    }
}
