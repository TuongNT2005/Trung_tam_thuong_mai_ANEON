package com.company.aneon.shared.web;

/**
 * Chuan hoa tham so phan trang: page >= 0, size 1..100 (D0003/D0004).
 */
public final class PageParams {

    public static final int DEFAULT_SIZE = 20;
    public static final int MAX_SIZE = 100;
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng PageParams và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private PageParams() {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ size
     * Phiên bản: Version 1
     */

    public static int size(Integer size) {
        if (size == null) {
            return DEFAULT_SIZE;
        }
        if (size < 1 || size > MAX_SIZE) {
            throw new com.company.aneon.shared.error.ApiException(
                    com.company.aneon.shared.error.ErrorCode.VALIDATION_ERROR,
                    "size phai trong khoang 1.." + MAX_SIZE);
        }
        return size;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ page
     * Phiên bản: Version 1
     */

    public static int page(Integer page) {
        if (page == null) {
            return 0;
        }
        if (page < 0) {
            throw new com.company.aneon.shared.error.ApiException(
                    com.company.aneon.shared.error.ErrorCode.VALIDATION_ERROR,
                    "page phai lon hon hoac bang 0");
        }
        return page;
    }
}
