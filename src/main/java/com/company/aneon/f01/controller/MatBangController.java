package com.company.aneon.f01.controller;


/**
 * ==============================================================================
 * Người code: Minh
 * Ngày code: 26/10/2026
 * Chức năng: Controller tiếp nhận các yêu cầu API quản lý mặt bằng: tra cứu, kiểm tra mã, thêm mới, sửa và gắn tọa độ
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.UUID;

import com.company.aneon.f01.constant.PremiseStatus;
import com.company.aneon.f01.dto.PremiseDtos;
import com.company.aneon.f01.service.MatBangService;
import com.company.aneon.shared.error.ErrorCode;
import com.company.aneon.shared.error.ApiException;
import com.company.aneon.shared.security.RolePermissions;
import com.company.aneon.shared.web.ApiResponse;
import com.company.aneon.shared.web.PageParams;
import com.company.aneon.shared.web.PageResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

/**
 * F01UC01.1 - 01.5 (TK-F01 muc 5.2-5.6).
 */
@RestController
@RequestMapping("/api/v1/f01/premises")
public class MatBangController {

    private final MatBangService matBangService;
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng MatBangController và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public MatBangController(MatBangService matBangService) {
        this.matBangService = matBangService;
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    @GetMapping
    @PreAuthorize("hasAuthority('" + RolePermissions.F01_PREMISE_READ + "')")
    public ApiResponse<PageResponse<PremiseDtos.PremiseListItem>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) UUID zoneId,
            @RequestParam(required = false) PremiseStatus status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ApiResponse.ok("Tra cuu mat bang thanh cong",
                matBangService.list(q, zoneId, status, PageParams.page(page), PageParams.size(size)));
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra tính khả dụng và duy nhất của mã mặt bằng trước khi tạo mới
     * Phiên bản: Version 1
     */

    @GetMapping("/code-availability")
    @PreAuthorize("hasAuthority('" + RolePermissions.F01_PREMISE_READ + "')")
    public ApiResponse<PremiseDtos.CodeAvailability> checkCode(
            @RequestParam String code,
            @RequestParam(required = false) UUID excludeId) {
        return ApiResponse.ok("Kiem tra ma thanh cong",
                matBangService.checkCodeAvailable(code, excludeId));
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: thực hiện xử lý nghiệp vụ detail
     * Phiên bản: Version 1
     */

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('" + RolePermissions.F01_PREMISE_READ + "')")
    public ApiResponse<PremiseDtos.PremiseDetail> detail(@PathVariable UUID id) {
        return ApiResponse.ok("Tra cuu mat bang thanh cong", matBangService.detail(id));
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: khởi tạo và lưu mới  vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    @PostMapping
    @PreAuthorize("hasAuthority('" + RolePermissions.F01_PREMISE_WRITE + "')")
    public ResponseEntity<ApiResponse<PremiseDtos.CreatePremiseResult>> create(
            @Valid @RequestBody PremiseDtos.CreatePremiseRequest request) {
        PremiseDtos.CreatePremiseResult result = matBangService.create(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Them mat bang thanh cong", result));
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP PUT: cập nhật và đồng bộ thông tin 
     * Phiên bản: Version 1
     */

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + RolePermissions.F01_PREMISE_WRITE + "')")
    public ApiResponse<PremiseDtos.UpdateResult> update(@PathVariable UUID id,
                                                        @Valid @RequestBody PremiseDtos.UpdatePremiseRequest request) {
        return ApiResponse.ok("Cap nhat mat bang thanh cong", matBangService.update(id, request));
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP PUT: cập nhật và đồng bộ thông tin cate
     * Phiên bản: Version 1
     */

    @PutMapping("/{id}/location")
    @PreAuthorize("hasAuthority('" + RolePermissions.F01_PREMISE_WRITE + "')")
    public ApiResponse<PremiseDtos.LocationUpdateResult> relocate(
            @PathVariable UUID id,
            @Valid @RequestBody PremiseDtos.UpdatePremiseLocationRequest request) {
        return ApiResponse.ok("Cap nhat vi tri thanh cong", matBangService.relocate(id, request));
    }
}
