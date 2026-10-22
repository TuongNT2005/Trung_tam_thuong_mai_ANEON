package com.company.aneon.f01.service;

import java.util.UUID;

import com.company.aneon.f01.dto.UtilizationDtos;
import com.company.aneon.f01.constant.PremiseStatus;

public interface KhaiThacMatBangService {

    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn thông tin utilization theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */
    UtilizationDtos.UtilizationPage getUtilization(UUID zoneId, UUID floorId,
                                                   PremiseStatus status, int page, int size);
}
