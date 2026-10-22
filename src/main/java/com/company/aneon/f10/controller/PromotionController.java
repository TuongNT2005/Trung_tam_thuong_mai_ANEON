package com.company.aneon.f10.controller;


/**
 * ==============================================================================
 * Người code: Tùng
 * Ngày code: 27/10/2026
 * Chức năng: Controller API tạo chương trình khuyến mãi, tính toán chiết khấu hóa đơn và thống kê ngân sách realtime
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.UUID;

import com.company.aneon.f10.dto.PromotionDtos;
import com.company.aneon.f10.service.PromotionService;
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
 * F10UC02.1/02.3 (TK-F10 bang tong hop) + apply bo tro (D0004).
 */
@RestController
@RequestMapping("/api/v1/f10/promotions")
public class PromotionController {

    private final PromotionService promotionService;
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Khởi tạo đối tượng PromotionController và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: khởi tạo và lưu mới  vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    @PostMapping
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_PROMOTION_WRITE + "')")
    public ResponseEntity<ApiResponse<PromotionDtos.PromotionSummary>> create(
            @Valid @RequestBody PromotionDtos.CreatePromotionRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Tao chuong trinh khuyen mai thanh cong",
                        promotionService.create(request)));
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: thực hiện xử lý nghiệp vụ realtime
     * Phiên bản: Version 1
     */

    @GetMapping("/{id}/realtime")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_PROMOTION_READ + "')")
    public ApiResponse<PromotionDtos.PromotionRealtimeResponse> realtime(@PathVariable UUID id) {
        return ApiResponse.ok("Lay so lieu thoi gian thuc thanh cong",
                promotionService.realtime(id));
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: xử lý áp dụng ưu đãi khuyến mãi hoặc quy tắc nghiệp vụ
     * Phiên bản: Version 1
     */

    @PostMapping("/{id}/applications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PromotionDtos.ApplyPromotionResult>> apply(
            @PathVariable UUID id,
            @Valid @RequestBody PromotionDtos.ApplyPromotionRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Ap dung khuyen mai thanh cong",
                        promotionService.apply(id, request)));
    }
}
