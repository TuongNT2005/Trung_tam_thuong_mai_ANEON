package com.company.aneon.f10.controller;


/**
 * ==============================================================================
 * Người code: Tùng
 * Ngày code: 27/10/2026
 * Chức năng: Controller API phát hành voucher, cấp phát cho khách hàng, xác thực đổi voucher và tra cứu ví cá nhân
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.dto.PromotionDtos;
import com.company.aneon.f10.service.VoucherService;
import com.company.aneon.shared.security.RolePermissions;
import com.company.aneon.shared.web.ApiResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

/**
 * F10UC02.2 + issue/redeem bo tro (D0004).
 */
@RestController
@RequestMapping("/api/v1/f10")
public class VoucherController {

    private final VoucherService voucherService;
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Khởi tạo đối tượng VoucherController và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: thực hiện xử lý nghiệp vụ wallet
     * Phiên bản: Version 1
     */

    @GetMapping("/voucher-instances/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<List<PromotionDtos.WalletVoucher>> wallet() {
        return ApiResponse.ok("Voucher của tôi", voucherService.wallet());
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: khởi tạo và lưu mới  vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    @PostMapping("/vouchers")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_VOUCHER_WRITE + "')")
    public ResponseEntity<ApiResponse<PromotionDtos.VoucherSummary>> create(
            @Valid @RequestBody PromotionDtos.CreateVoucherRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Khoi tao voucher thanh cong", voucherService.create(request)));
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: kiểm tra trạng thái issue của đối tượng
     * Phiên bản: Version 1
     */

    @PostMapping("/vouchers/{id}/issues")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_VOUCHER_ISSUE + "')")
    public ResponseEntity<ApiResponse<PromotionDtos.CustomerVoucherResponse>> issue(
            @PathVariable UUID id,
            @Valid @RequestBody PromotionDtos.IssueVoucherRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Phat voucher thanh cong", voucherService.issue(id, request)));
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Xác thực và thực hiện đổi voucher khi khách hàng thanh toán tại quầy
     * Phiên bản: Version 1
     */

    @PostMapping("/voucher-instances/{id}/redemptions")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<PromotionDtos.RedeemResult> redeem(
            @PathVariable UUID id,
            @Valid @RequestBody PromotionDtos.RedeemVoucherRequest request) {
        return ApiResponse.ok("Dung voucher thanh cong", voucherService.redeem(id, request));
    }
}
