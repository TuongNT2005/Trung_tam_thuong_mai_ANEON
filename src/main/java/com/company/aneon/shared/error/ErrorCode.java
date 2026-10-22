package com.company.aneon.shared.error;

import org.springframework.http.HttpStatus;

/**
 * Ma loi chuan theo D0003 (baseline TK-F01 + chuan hoa bo sung).
 */
public enum ErrorCode {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ validation_ error
     * Phiên bản: Version 1
     */
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST),
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ unauthenticated
     * Phiên bản: Version 1
     */
    UNAUTHENTICATED(HttpStatus.UNAUTHORIZED),
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ access_ denied
     * Phiên bản: Version 1
     */
    ACCESS_DENIED(HttpStatus.FORBIDDEN),
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ resource_ not_ found
     * Phiên bản: Version 1
     */
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND),
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ business_ conflict
     * Phiên bản: Version 1
     */
    BUSINESS_CONFLICT(HttpStatus.CONFLICT),
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ dependency_ unavailable
     * Phiên bản: Version 1
     */
    DEPENDENCY_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE),
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ internal_ error
     * Phiên bản: Version 1
     */
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR);

    private final HttpStatus httpStatus;
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng ErrorCode và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    ErrorCode(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ http status
     * Phiên bản: Version 1
     */

    public HttpStatus httpStatus() {
        return httpStatus;
    }
}
