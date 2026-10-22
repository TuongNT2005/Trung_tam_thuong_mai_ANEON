package com.company.aneon.shared.error;

import java.util.List;
import java.util.Map;

/**
 * Ngoai le nghiep du co ma loi chuan. Cac loi rieng cua module ke thua lop nay
 * (VD ScheduleConflictException) de giu errorCode cu the theo baseline.
 */
public class ApiException extends RuntimeException {

    private final ErrorCode errorCode;
    private final transient List<Map.Entry<String, String>> fieldErrors;
    private final String specificCode;
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng ApiException và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public ApiException(ErrorCode errorCode, String message) {
        this(errorCode, message, List.of(), null);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng ApiException và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public ApiException(ErrorCode errorCode, String message, List<Map.Entry<String, String>> fieldErrors) {
        this(errorCode, message, fieldErrors, null);
    }

    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Khởi tạo đối tượng ApiException và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */
    public ApiException(ErrorCode errorCode, String message, List<Map.Entry<String, String>> fieldErrors,
                        String specificCode) {
        super(message);
        this.errorCode = errorCode;
        this.fieldErrors = List.copyOf(fieldErrors);
        this.specificCode = specificCode;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ error code
     * Phiên bản: Version 1
     */

    public ErrorCode errorCode() {
        return errorCode;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ specific code
     * Phiên bản: Version 1
     */

    public String specificCode() {
        return specificCode;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ field errors
     * Phiên bản: Version 1
     */

    public List<Map.Entry<String, String>> fieldErrors() {
        return fieldErrors;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ not found
     * Phiên bản: Version 1
     */

    public static ApiException notFound(String resource, Object id) {
        return new ApiException(ErrorCode.RESOURCE_NOT_FOUND, resource + " khong ton tai: " + id);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ conflict
     * Phiên bản: Version 1
     */

    public static ApiException conflict(String message) {
        return new ApiException(ErrorCode.BUSINESS_CONFLICT, message);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ validation
     * Phiên bản: Version 1
     */

    public static ApiException validation(String field, String message) {
        return new ApiException(ErrorCode.VALIDATION_ERROR, message,
                List.of(Map.entry(field, message)));
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ forbidden
     * Phiên bản: Version 1
     */

    public static ApiException forbidden(String message) {
        return new ApiException(ErrorCode.ACCESS_DENIED, message);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ dependency unavailable
     * Phiên bản: Version 1
     */

    public static ApiException dependencyUnavailable(String message) {
        return new ApiException(ErrorCode.DEPENDENCY_UNAVAILABLE, message);
    }
}
