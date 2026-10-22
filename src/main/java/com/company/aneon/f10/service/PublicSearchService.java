package com.company.aneon.f10.service;

import com.company.aneon.f10.dto.PublicDtos;

public interface PublicSearchService {

    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */
    PublicDtos.PublicSearchResponse search(String q, String category, String availability, String type, int page, int size);
}
