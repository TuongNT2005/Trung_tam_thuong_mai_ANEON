package com.company.aneon.f10.integration;

import java.util.Optional;
import java.util.UUID;

import com.company.aneon.shared.reference.TaiKhoanNguoiDungLookupRepository;

import org.springframework.stereotype.Component;

/**
 * Adapter that su doc tai_khoan_nguoi_dung (bang tham chieu trong baseline).
 */
@Component
public class PersonLookupAdapter implements PersonLookupPort {

    private final TaiKhoanNguoiDungLookupRepository accountRepository;
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng PersonLookupAdapter và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public PersonLookupAdapter(TaiKhoanNguoiDungLookupRepository accountRepository) {
        this.accountRepository = accountRepository;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ account exists
     * Phiên bản: Version 1
     */

    @Override
    public boolean accountExists(UUID accountId) {
        return accountId != null && accountRepository.existsById(accountId);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ customer link of
     * Phiên bản: Version 1
     */

    @Override
    public Optional<UUID> customerLinkOf(UUID accountId) {
        return accountRepository.findById(accountId).map(t -> t.getCustomerId());
    }
}
