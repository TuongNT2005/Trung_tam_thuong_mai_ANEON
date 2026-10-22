package com.company.aneon.f10.integration;

import java.util.List;
import java.util.UUID;

/**
 * Port kiem tra tep dinh kem cua de xuat su kien: key phai thuoc tep da tai
 * boi cung actor, dung dinh dang (PDF/DOCX/PNG/JPG) va dung luong
 * (<= 25 MiB/file, toi da 10 tep) theo rule f10/D0004.
 */
public interface FileAttachmentPort {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ attachment info
     * Phiên bản: Version 1
     */

    record AttachmentInfo(String storageKey, String originalName, long sizeBytes) {
    }

    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Kiểm tra tính hợp lệ và điều kiện ràng buộc của keys
     * Phiên bản: Version 1
     */
    List<AttachmentInfo> validateKeys(List<String> storageKeys, UUID actorId,
                                      long maxFileBytes, List<String> allowedExtensions, int maxFiles);
}
