package com.company.aneon.f10.service;

import java.util.UUID;

import com.company.aneon.f10.dto.EventDtos;

public interface EventReportService {

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ report
     * Phiên bản: Version 1
     */
    EventDtos.EventReportResponse report(UUID eventId);
}
