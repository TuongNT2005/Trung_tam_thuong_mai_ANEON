package com.company.aneon.shared.persistence;

import java.time.Clock;
import java.time.Instant;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

/**
 * Ghi timestamp tu Clock he thong da cau hinh (instant UTC).
 */
public class AuditListener {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ pre persist
     * Phiên bản: Version 1
     */

    @PrePersist
    public void prePersist(Object entity) {
        if (entity instanceof Auditable auditable && auditable.getCreatedAt() == null) {
            auditable.setCreatedAtInstant(Instant.now(TimeHolder.clock()));
        }
        touchUpdate(entity);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ pre update
     * Phiên bản: Version 1
     */

    @PreUpdate
    public void preUpdate(Object entity) {
        touchUpdate(entity);
    }
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ touch update
     * Phiên bản: Version 1
     */

    private void touchUpdate(Object entity) {
        if (entity instanceof Auditable auditable) {
            auditable.setUpdatedAtInstant(Instant.now(TimeHolder.clock()));
        }
    }

    /** Holder Clock tao mot lan khi khoi dong (TimeConfig). */
    public static final class TimeHolder {
        private static volatile Clock clock = Clock.systemUTC();

        private TimeHolder() {
        }

        public static Clock clock() {
            return clock;
        }

        public static void setClock(Clock newClock) {
            clock = newClock;
        }
    }
}
