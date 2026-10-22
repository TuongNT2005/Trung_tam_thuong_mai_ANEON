package com.company.aneon.shared.security;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Port danh tinh/scope theo rule 06: F16 la phu thuoc, module F01/F10 khong
 * truy van repository F16 truc tiep. Impl gan Authentication hien tai.
 */
public interface AccessScopePort {

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ current actor id
     * Phiên bản: Version 1
     */
    Optional<UUID> currentActorId();

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ current roles
     * Phiên bản: Version 1
     */
    Set<String> currentRoles();

    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ current scope
     * Phiên bản: Version 1
     */
    AccessScope currentScope();
}
