package com.company.aneon.f01.service;


/**
 * ==============================================================================
 * Người code: Minh
 * Ngày code: 26/10/2026
 * Chức năng: Interface dịch vụ nghiệp vụ quản lý Cửa hàng/Sạp thương mại
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.UUID;

import com.company.aneon.f01.dto.StoreDtos;
import com.company.aneon.f01.constant.StoreStatus;
import com.company.aneon.shared.web.PageResponse;

public interface CuaHangSapService {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    PageResponse<StoreDtos.StoreListItem> list(UUID premiseId, StoreStatus status, String q, int page, int size);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ detail
     * Phiên bản: Version 1
     */

    StoreDtos.StoreDetail detail(UUID id);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo và lưu mới  vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    StoreDtos.StoreListItem create(StoreDtos.CreateStoreRequest request);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Cập nhật và đồng bộ thông tin 
     * Phiên bản: Version 1
     */

    StoreDtos.StoreDetail update(UUID id, StoreDtos.UpdateStoreRequest request);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ change status
     * Phiên bản: Version 1
     */

    StoreDtos.StoreDetail changeStatus(UUID id, StoreDtos.ChangeStoreStatusRequest request);
}
