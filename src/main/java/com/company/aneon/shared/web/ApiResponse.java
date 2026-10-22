package com.company.aneon.shared.web;

/**
 * Envelope thanh cong chuan {code, message, data} theo TK-F01/TK-F10 muc 5.
 */
public record ApiResponse<T>(int code, String message, T data) {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ ok
     * Phiên bản: Version 1
     */

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo và lưu mới d vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(201, message, data);
    }
}
