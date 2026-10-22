package com.company.aneon.f10.integration;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

/**
 * Port hoa don F11 de xac minh du lieu that khi ap dung khuyen mai/redeem;
 * khong tin so tien client khai (rule f10).
 */
public interface InvoiceLookupPort {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ invoice ref
     * Phiên bản: Version 1
     */

    record InvoiceRef(UUID id, UUID customerId, UUID storeId, BigDecimal totalAmount, boolean verified) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn thông tin invoice theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    Optional<InvoiceRef> findInvoice(UUID invoiceId);
}
