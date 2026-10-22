package com.company.aneon.f01.service;


/**
 * ==============================================================================
 * Người code: Minh
 * Ngày code: 26/10/2026
 * Chức năng: Interface dịch vụ nghiệp vụ quản lý Mặt bằng thương mại
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.UUID;

import com.company.aneon.f01.constant.PremiseStatus;
import com.company.aneon.f01.dto.PremiseDtos;
import com.company.aneon.shared.web.PageResponse;

public interface MatBangService {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    PageResponse<PremiseDtos.PremiseListItem> list(String q, UUID zoneId, PremiseStatus status, int page, int size);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ detail
     * Phiên bản: Version 1
     */

    PremiseDtos.PremiseDetail detail(UUID id);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo và lưu mới  vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    PremiseDtos.CreatePremiseResult create(PremiseDtos.CreatePremiseRequest request);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Cập nhật và đồng bộ thông tin 
     * Phiên bản: Version 1
     */

    PremiseDtos.UpdateResult update(UUID id, PremiseDtos.UpdatePremiseRequest request);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra tính khả dụng và duy nhất của mã mặt bằng trước khi tạo mới
     * Phiên bản: Version 1
     */

    PremiseDtos.CodeAvailability checkCodeAvailable(String code, UUID excludeId);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Cập nhật và đồng bộ thông tin cate
     * Phiên bản: Version 1
     */

    PremiseDtos.LocationUpdateResult relocate(UUID id, PremiseDtos.UpdatePremiseLocationRequest request);
}
