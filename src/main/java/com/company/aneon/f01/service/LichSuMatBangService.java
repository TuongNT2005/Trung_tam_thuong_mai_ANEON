package com.company.aneon.f01.service;

import java.util.UUID;

import com.company.aneon.f01.dto.HistoryDtos;
import com.company.aneon.shared.web.PageResponse;

public interface LichSuMatBangService {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn thông tin premise history theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    PageResponse<HistoryDtos.HistoryItem> getPremiseHistory(UUID premiseId, int page, int size);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    PageResponse<HistoryDtos.HistoryItem> searchHistory(HistoryDtos.HistorySearchRequest request, int page, int size);
}
