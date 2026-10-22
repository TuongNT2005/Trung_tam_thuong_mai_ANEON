package com.company.aneon.f01.service;

import com.company.aneon.f01.constant.PremiseStatus;
import com.company.aneon.f01.dto.StatusDtos;
import com.company.aneon.shared.web.PageResponse;

import java.util.UUID;

public interface TrangThaiMatBangService {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn thông tin current statuses theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    PageResponse<StatusDtos.StatusItem> getCurrentStatuses(PremiseStatus status, int page, int size);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Cập nhật và đồng bộ thông tin premise status
     * Phiên bản: Version 1
     */

    StatusDtos.StatusChangeResult updatePremiseStatus(UUID id, StatusDtos.ChangeStatusRequest request);
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ sync status from contract
     * Phiên bản: Version 1
     */

    StatusDtos.SyncStatusResult syncStatusFromContract(UUID id, StatusDtos.SyncContractStatusRequest request);
}
