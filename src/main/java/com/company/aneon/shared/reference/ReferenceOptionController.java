package com.company.aneon.shared.reference;


/**
 * ==============================================================================
 * Người code: Bảo
 * Ngày code: 24/10/2026
 * Chức năng: Controller cung cấp danh mục dữ liệu tham chiếu dùng chung: khu vực, tầng, ngành hàng và tài khoản demo
 * Phiên bản: Version 1
 * ==============================================================================
 */
import com.company.aneon.shared.web.ApiResponse;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shared")
public class ReferenceOptionController {

    private final ReferenceOptionService service;
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo đối tượng ReferenceOptionController và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public ReferenceOptionController(ReferenceOptionService service) {
        this.service = service;
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: truy vấn thông tin reference options theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    @GetMapping("/reference-options")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ReferenceOptionService.ReferenceOptions> getReferenceOptions() {
        return ApiResponse.ok("Lay danh sach tham chieu thanh cong", service.getAllOptions());
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: truy vấn thông tin public accounts theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    @GetMapping("/public-accounts")
    public ApiResponse<java.util.List<ReferenceOptionService.OptionItem>> getPublicAccounts() {
        return ApiResponse.ok("Lay danh sach tai khoan cong khai thanh cong", service.getAllOptions().staff());
    }
}
