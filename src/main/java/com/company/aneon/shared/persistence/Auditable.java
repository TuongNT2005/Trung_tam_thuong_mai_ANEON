package com.company.aneon.shared.persistence;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

/**
 * Cot audit chung theo schema: created_at/created_by/updated_at/version/archived_at.
 * Chi ap tren nhung bang co day du cot; bang lich su (khong co version)
 * khong ke thua lop nay (rule 03).
 */
@MappedSuperclass
@EntityListeners(AuditListener.class)
public abstract class Auditable {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /** Schema dung CHAR(36): map UUID dang ky tu, khong BINARY(16). */
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "created_by", length = 36)
    private UUID createdBy;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Version
    @Column(name = "version", nullable = false)
    private long version;

    @Column(name = "archived_at")
    private Instant archivedAt;
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn thông tin created at theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    public Instant getCreatedAt() {
        return createdAt;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn thông tin created by theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    public UUID getCreatedBy() {
        return createdBy;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn thông tin updated at theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    public Instant getUpdatedAt() {
        return updatedAt;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn thông tin version theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    public long getVersion() {
        return version;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Truy vấn thông tin archived at theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    public Instant getArchivedAt() {
        return archivedAt;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ set created by
     * Phiên bản: Version 1
     */

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ set archived at
     * Phiên bản: Version 1
     */

    public void setArchivedAt(Instant archivedAt) {
        this.archivedAt = archivedAt;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ set created at instant
     * Phiên bản: Version 1
     */

    void setCreatedAtInstant(Instant value) {
        this.createdAt = value;
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ set updated at instant
     * Phiên bản: Version 1
     */

    void setUpdatedAtInstant(Instant value) {
        this.updatedAt = value;
    }
}
