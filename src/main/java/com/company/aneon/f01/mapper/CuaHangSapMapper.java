package com.company.aneon.f01.mapper;

import java.math.BigDecimal;

import com.company.aneon.f01.dto.StoreDtos;
import com.company.aneon.f01.entity.CuaHangSap;

import org.springframework.stereotype.Component;

/**
 * Mapper cua hang/sap: chi chuyen du lieu.
 */
@Component
public class CuaHangSapMapper {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ snapshot
     * Phiên bản: Version 1
     */

    public record Snapshot(String code, String name, java.util.UUID premiseId, BigDecimal area,
                           java.util.UUID categoryId, String status, java.util.UUID locationId,
                           boolean publicVisible) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ to list item
     * Phiên bản: Version 1
     */

    public StoreDtos.StoreListItem toListItem(CuaHangSap store) {
        return new StoreDtos.StoreListItem(
                store.getId(), store.getCode(), store.getName(),
                store.getPremise() == null ? null : store.getPremise().getId(),
                store.getPremise() == null ? null : store.getPremise().getCode(),
                store.getArea(),
                store.getCategory() == null ? null : store.getCategory().getId(),
                store.getCategory() == null ? null : store.getCategory().getName(),
                store.getStatus(), store.isPublicVisible());
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ to detail
     * Phiên bản: Version 1
     */

    public StoreDtos.StoreDetail toDetail(CuaHangSap store) {
        return new StoreDtos.StoreDetail(
                store.getId(), store.getCode(), store.getName(),
                store.getPremise() == null ? null : store.getPremise().getId(),
                store.getPremise() == null ? null : store.getPremise().getCode(),
                store.getArea(),
                store.getCategory() == null ? null : store.getCategory().getId(),
                store.getCategory() == null ? null : store.getCategory().getName(),
                store.getLocation() == null ? null : store.getLocation().getId(),
                store.getStatus(), store.getOperatingHours(), store.getDescription(),
                store.isPublicVisible(), store.getVersion());
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ to snapshot
     * Phiên bản: Version 1
     */

    public Snapshot toSnapshot(CuaHangSap store) {
        return new Snapshot(store.getCode(), store.getName(),
                store.getPremise() == null ? null : store.getPremise().getId(),
                store.getArea(),
                store.getCategory() == null ? null : store.getCategory().getId(),
                store.getStatus().name(),
                store.getLocation() == null ? null : store.getLocation().getId(),
                store.isPublicVisible());
    }
}
