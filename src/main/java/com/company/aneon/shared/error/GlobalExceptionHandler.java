package com.company.aneon.shared.error;


/**
 * ==============================================================================
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Xử lý ngoại lệ tập trung toàn hệ thống, bắt lỗi ApiException và trả về cấu trúc phản hồi chuẩn
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Chuan hoa loi {code, message, errorCode, errors, traceId}.
 * Khong lo SQL/stack trace/secret trong response.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ field error item
     * Phiên bản: Version 1
     */

    public record FieldErrorItem(String field, String message) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ api error body
     * Phiên bản: Version 1
     */

    public record ApiErrorBody(int code, String message, String errorCode,
                               List<FieldErrorItem> errors, String traceId) {
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorBody> handleApi(ApiException ex, HttpServletRequest request) {
        String code = ex.specificCode() != null ? ex.specificCode() : ex.errorCode().name();
        ResponseEntity<ApiErrorBody> response = build(ex.errorCode(), ex.getMessage(), ex.fieldErrors());
        ApiErrorBody body = response.getBody();
        ApiErrorBody adjusted = body == null ? null
                : new ApiErrorBody(body.code(), body.message(), code, body.errors(), body.traceId());
        return ResponseEntity.status(response.getStatusCode()).body(adjusted);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorBody> handleValidation(MethodArgumentNotValidException ex) {
        List<FieldErrorItem> fields = new ArrayList<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fields.add(new FieldErrorItem(fe.getField(), fe.getDefaultMessage()));
        }
        return build(ErrorCode.VALIDATION_ERROR, "Du lieu khong hop le", fields.stream()
                .map(f -> Map.entry(f.field(), f.message())).toList());
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class,
            jakarta.validation.ConstraintViolationException.class, MissingServletRequestPartException.class})
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */
    public ResponseEntity<ApiErrorBody> handleUnreadable(Exception ex) {
        return build(ErrorCode.VALIDATION_ERROR, "Du lieu khong doc duoc hoac sai dinh dang", List.of());
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiErrorBody> handleUploadSize(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(413).body(new ApiErrorBody(413, "Tep vuot gioi han dung luong",
                "UPLOAD_TOO_LARGE", null, MDC.get("traceId")));
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorBody> handleDenied(AccessDeniedException ex) {
        return build(ErrorCode.ACCESS_DENIED, "Khong co quyen truy cap", List.of());
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorBody> handleUnauthenticated(AuthenticationException ex) {
        return build(ErrorCode.UNAUTHENTICATED, "Chua xac thuc", List.of());
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ApiErrorBody> handleOptimistic(OptimisticLockingFailureException ex) {
        return build(ErrorCode.BUSINESS_CONFLICT, "Du lieu da bi thay doi boi nguoi khac, tai lai truoc khi luu", List.of());
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorBody> handleIntegrity(DataIntegrityViolationException ex) {
        // Rang buoc DB (unique/FK): tra 409 theo baseline, khong lo chi tiet SQL
        return build(ErrorCode.BUSINESS_CONFLICT, "Xung dot du lieu voi rang buoc hien co", List.of());
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiErrorBody> handleNoResource(NoResourceFoundException ex) {
        return build(ErrorCode.RESOURCE_NOT_FOUND, "Khong tim thay tai nguyen", List.of());
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Bắt và xử lý ngoại lệ nghiệp vụ trong quá trình thực thi
     * Phiên bản: Version 1
     */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorBody> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Loi khong xac dinh tren {}", request.getRequestURI(), ex);
        return build(ErrorCode.INTERNAL_ERROR, "Loi he thong, thu lai sau", List.of());
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ build
     * Phiên bản: Version 1
     */

    private ResponseEntity<ApiErrorBody> build(ErrorCode errorCode, String message, List<Map.Entry<String, String>> fields) {
        List<FieldErrorItem> items = fields == null ? List.of()
                : fields.stream().map(f -> new FieldErrorItem(f.getKey(), f.getValue())).toList();
        ApiErrorBody body = new ApiErrorBody(errorCode.httpStatus().value(), message, errorCode.name(),
                items.isEmpty() ? null : items, MDC.get("traceId"));
        return ResponseEntity.status(errorCode.httpStatus()).body(body);
    }
}
