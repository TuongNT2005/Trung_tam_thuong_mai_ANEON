package com.company.aneon.f10.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.constant.PromotionStatus;
import com.company.aneon.f10.constant.PromotionType;
import com.company.aneon.f10.constant.VoucherDiscountType;
import com.company.aneon.f10.constant.VoucherIssueStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO khuyen mai/voucher F10 (F10UC02.x). Phan tram theo thang 0..100
 * (D0004); issuedLimit/perCustomerLimit = 0 nghia khong gioi han.
 */
public final class PromotionDtos {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng PromotionDtos và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private PromotionDtos() {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ discount spec
     * Phiên bản: Version 1
     */

    public record DiscountSpec(
            @NotNull
            @jakarta.validation.constraints.DecimalMin(value = "0", inclusive = false, message = "Ty le giam phai lon hon 0")
            @jakarta.validation.constraints.DecimalMax(value = "100", inclusive = true, message = "Ty le giam phai <= 100") BigDecimal discountRatePercent,
            @DecimalMin(value = "0") BigDecimal maximumDiscount) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ giveaway spec
     * Phiên bản: Version 1
     */

    public record GiveawaySpec(@NotNull UUID voucherId, @NotNull @Min(0) Integer totalToIssue) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ points spec
     * Phiên bản: Version 1
     */

    public record PointsSpec(@NotNull @Min(0) Long rewardPoints,
                             @DecimalMin(value = "0", inclusive = false) BigDecimal conversionAmount,
                             @Min(0) Integer pointsPerConversion) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ create promotion request
     * Phiên bản: Version 1
     */

    public record CreatePromotionRequest(
            @NotBlank @Size(max = 50) @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "Ma chi chua chu cai, chu so, dau cham, gach ngang") String code,
            @NotBlank @Size(max = 200) String name,
            @NotNull PromotionType type,
            @NotNull Instant startAt,
            @NotNull Instant endAt,
            @DecimalMin(value = "0") BigDecimal minimumInvoiceAmount,
            List<String> targetTiers,
            @Size(max = 4000) String terms,
            Boolean publicVisible,
            List<UUID> participatingStoreIds,
            DiscountSpec discount,
            GiveawaySpec giveaway,
            PointsSpec points) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ promotion summary
     * Phiên bản: Version 1
     */

    public record PromotionSummary(UUID id, String code, String name, PromotionType type,
                                   PromotionStatus status, Instant startAt, Instant endAt,
                                   boolean publicVisible) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ promotion realtime response
     * Phiên bản: Version 1
     */

    public record PromotionRealtimeResponse(UUID promotionId, PromotionType type, Integer totalLimit,
                                            Integer issuedCount, Integer remainingStock, Integer usedCount,
                                            BigDecimal totalDiscountGranted, long totalPointsGranted,
                                            Instant lastUpdated) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ apply promotion request
     * Phiên bản: Version 1
     */

    public record ApplyPromotionRequest(
            @NotNull UUID invoiceId,
            @NotNull UUID customerId,
            UUID customerVoucherId,
            @NotBlank @Size(max = 120) String idempotencyKey) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ apply promotion result
     * Phiên bản: Version 1
     */

    public record ApplyPromotionResult(UUID applicationId, BigDecimal discountAmount, Long pointsGranted,
                                       boolean duplicate) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ create voucher request
     * Phiên bản: Version 1
     */

    public record CreateVoucherRequest(
            @NotBlank @Size(max = 50) @Pattern(regexp = "^[A-Z0-9]+$", message = "Ma voucher phai viet hoa, chi chu cai va chu so") String code,
            @NotBlank @Size(max = 200) String name,
            @NotNull VoucherDiscountType discountType,
            @NotNull @DecimalMin(value = "0", inclusive = false, message = "Gia tri giam phai lon hon 0") BigDecimal value,
            @DecimalMin(value = "0") BigDecimal maximumDiscount,
            @DecimalMin(value = "0") BigDecimal minimumInvoiceAmount,
            @Min(0) Integer issuedLimit,
            @Min(0) Integer perCustomerLimit,
            @NotNull Instant validFrom,
            @NotNull Instant expiresAt,
            List<UUID> participatingStoreIds) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ voucher summary
     * Phiên bản: Version 1
     */

    public record VoucherSummary(UUID id, String code, String name, VoucherDiscountType discountType,
                                 BigDecimal value, Integer issuedLimit, int issuedCount, int usedCount,
                                 Instant validFrom, Instant expiresAt, boolean active) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ issue voucher request
     * Phiên bản: Version 1
     */

    public record IssueVoucherRequest(@NotNull UUID customerId,
                                      @Size(max = 200) String issueReference) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ customer voucher response
     * Phiên bản: Version 1
     */

    public record CustomerVoucherResponse(UUID id, UUID voucherId, String voucherCode, UUID customerId,
                                          VoucherIssueStatus status, Instant issuedAt,
                                          String issueReference, boolean duplicate) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ redeem voucher request
     * Phiên bản: Version 1
     */

    public record RedeemVoucherRequest(@NotNull UUID invoiceId,
                                       @Size(max = 120) String idempotencyKey) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ redeem result
     * Phiên bản: Version 1
     */

    public record RedeemResult(UUID instanceId, VoucherIssueStatus status, Instant redeemedAt,
                               UUID purchaseInvoiceId) {
    }
}
