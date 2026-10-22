package com.company.aneon.f10.service;


/**
 * ==============================================================================
 * Người code: Bảo
 * Ngày code: 24/10/2026
 * Chức năng: Interface định nghĩa dịch vụ sinh và xác thực mã QR check-in sự kiện
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.Optional;
import java.util.UUID;

import com.company.aneon.f10.dto.EventDtos;

public interface QrCodeService {

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Sinh mã QR token bảo mật và đường dẫn check-in sự kiện
     * Phiên bản: Version 1
     */
    com.company.aneon.f10.dto.EventDtos.QrCodeDto generate(UUID eventId);

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn thông tin active qr theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */
    Optional<EventDtos.QrCodeDto> getActiveQr(UUID eventId);

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Xác thực mã QR và xử lý ghi nhận lượt check-in của khách hàng
     * Phiên bản: Version 1
     */
    EventDtos.CheckInResult checkIn(UUID eventId, EventDtos.CheckInRequest request);
}
