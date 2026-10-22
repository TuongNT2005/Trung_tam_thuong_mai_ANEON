package com.company.aneon.f10.controller;

import com.company.aneon.f10.dto.PublicDtos;
import com.company.aneon.f10.service.PublicSearchService;
import com.company.aneon.shared.web.ApiResponse;
import com.company.aneon.shared.web.PageParams;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * F10UC03: endpoint cong khai, khong can xac thuc (permitAll o SecurityConfig).
 */
@RestController
@RequestMapping("/api/v1/f10")
public class PublicSearchController {

    private final PublicSearchService publicSearchService;
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng PublicSearchController và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public PublicSearchController(PublicSearchService publicSearchService) {
        this.publicSearchService = publicSearchService;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    @GetMapping("/promotions-events/search")
    public ApiResponse<PublicDtos.PublicSearchResponse> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ApiResponse.ok("Tim kiem thanh cong", publicSearchService
                .search(q, category, availability, type, PageParams.page(page), PageParams.size(size)));
    }
}
