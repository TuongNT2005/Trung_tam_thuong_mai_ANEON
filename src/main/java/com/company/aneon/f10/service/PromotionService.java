package com.company.aneon.f10.service;


/**
 * ==============================================================================
 * Người code: Tùng
 * Ngày code: 27/10/2026
 * Chức năng: Interface định nghĩa nghiệp vụ tính toán chương trình khuyến mãi và chiết khấu
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.UUID;

import com.company.aneon.f10.dto.PromotionDtos;

public interface PromotionService {

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Khởi tạo và lưu mới  vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */
    PromotionDtos.PromotionSummary create(PromotionDtos.CreatePromotionRequest request);

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ realtime
     * Phiên bản: Version 1
     */
    PromotionDtos.PromotionRealtimeResponse realtime(UUID promotionId);

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Xử lý áp dụng ưu đãi khuyến mãi hoặc quy tắc nghiệp vụ
     * Phiên bản: Version 1
     */
    PromotionDtos.ApplyPromotionResult apply(UUID promotionId, PromotionDtos.ApplyPromotionRequest request);
}
