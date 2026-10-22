package com.company.aneon.f10.service;


/**
 * ==============================================================================
 * Người code: Tùng
 * Ngày code: 27/10/2026
 * Chức năng: Interface định nghĩa các nghiệp vụ phát hành, cấp phát và sử dụng voucher ưu đãi
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.UUID;

import com.company.aneon.f10.dto.PromotionDtos;

public interface VoucherService {

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Khởi tạo và lưu mới  vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */
    PromotionDtos.VoucherSummary create(PromotionDtos.CreateVoucherRequest request);

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Kiểm tra trạng thái issue của đối tượng
     * Phiên bản: Version 1
     */
    PromotionDtos.CustomerVoucherResponse issue(UUID voucherId, PromotionDtos.IssueVoucherRequest request);

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Xác thực và thực hiện đổi voucher khi khách hàng thanh toán tại quầy
     * Phiên bản: Version 1
     */
    PromotionDtos.RedeemResult redeem(UUID instanceId, PromotionDtos.RedeemVoucherRequest request);
}
