package com.company.aneon.f10.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.service.EventFiles;
import com.company.aneon.shared.security.RolePermissions;
import com.company.aneon.shared.web.ApiResponse;

import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/f10/events/{eventId}/files")
public class EventFileController {
    private final EventFiles files;
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo đối tượng EventFileController và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public EventFileController(EventFiles files) {
        this.files = files;
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    @GetMapping
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_READ + "')")
    public ApiResponse<List<EventFiles.FileInfo>> list(@PathVariable UUID eventId) {
        return ApiResponse.ok("Lay tep de xuat thanh cong", files.list(eventId));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: thực hiện xử lý nghiệp vụ upload
     * Phiên bản: Version 1
     */

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_PROPOSE + "')")
    public ResponseEntity<ApiResponse<EventFiles.FileInfo>> upload(@PathVariable UUID eventId,
            @RequestParam MultipartFile file) throws IOException {
        return ResponseEntity.status(201).body(ApiResponse.created("Da tai tep", files.upload(eventId, file)));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: thực hiện xử lý nghiệp vụ download
     * Phiên bản: Version 1
     */

    @GetMapping("/{fileId}")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_READ + "')")
    public ResponseEntity<byte[]> download(@PathVariable UUID eventId, @PathVariable UUID fileId) {
        var file = files.download(eventId, fileId);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(file.name(), StandardCharsets.UTF_8).build().toString())
                .contentLength(file.bytes().length).body(file.bytes());
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP DELETE: xóa hoặc vô hiệu hóa bản ghi 
     * Phiên bản: Version 1
     */

    @DeleteMapping("/{fileId}")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_PROPOSE + "')")
    public ApiResponse<UUID> remove(@PathVariable UUID eventId, @PathVariable UUID fileId) {
        return ApiResponse.ok("Da go tep khoi ban nhap", files.remove(eventId, fileId));
    }
}
