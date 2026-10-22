package com.company.aneon.f01.controller;


/**
 * ==============================================================================
 * Người code: Minh
 * Ngày code: 26/10/2026
 * Chức năng: Controller API thống kê và báo cáo tình hình khai thác mặt bằng, diện tích cho thuê và tỷ lệ lấp đầy
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.UUID;

import com.company.aneon.f01.constant.PremiseStatus;
import com.company.aneon.f01.dto.UtilizationDtos;
import com.company.aneon.f01.service.KhaiThacMatBangService;
import com.company.aneon.shared.security.RolePermissions;
import com.company.aneon.shared.web.ApiResponse;
import com.company.aneon.shared.web.PageParams;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * F01UC05.1 - 05.4: mot endpoint /utilization voi bo loc dung chung
 * (zoneId/floorId/status), khong tao ba endpoint rieng (rule 04).
 */
@RestController
@RequestMapping("/api/v1/f01/utilization")
public class KhaiThacMatBangController {

    private final KhaiThacMatBangService khaiThacMatBangService;
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng KhaiThacMatBangController và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public KhaiThacMatBangController(KhaiThacMatBangService khaiThacMatBangService) {
        this.khaiThacMatBangService = khaiThacMatBangService;
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: thực hiện xử lý nghiệp vụ utilization
     * Phiên bản: Version 1
     */

    @GetMapping
    @PreAuthorize("hasAuthority('" + RolePermissions.F01_UTILIZATION_READ + "')")
    public ApiResponse<UtilizationDtos.UtilizationPage> utilization(
            @RequestParam(required = false) UUID zoneId,
            @RequestParam(required = false) UUID floorId,
            @RequestParam(required = false) PremiseStatus status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ApiResponse.ok("Lay thong tin khai thac thanh cong", khaiThacMatBangService
                .getUtilization(zoneId, floorId, status, PageParams.page(page), PageParams.size(size)));
    }
}
