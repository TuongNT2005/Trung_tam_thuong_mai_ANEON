package com.company.aneon.f01.integration;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port truy van hop dong F03. F01 khong doc repository F03 truc tiep (rule 06).
 * Trang thai tra ve la chuoi ma F03 so huu (DRAFT/SIGNED/ACTIVE/EXPIRED/
 * TERMINATED/CANCELLED theo mo hinh); F01 map thanh trang thai mat bang.
 */
public interface ContractQueryPort {
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ contract summary
     * Phiên bản: Version 1
     */

    record ContractSummary(UUID id, String status, UUID premiseId, UUID storeId,
                           Instant startAt, Instant endAt) {
    }

    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra trạng thái is available của đối tượng
     * Phiên bản: Version 1
     */
    boolean isAvailable();
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn thông tin contract theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    Optional<ContractSummary> findContract(UUID contractId);

    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn thông tin active contracts for premise theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */
    List<ContractSummary> findActiveContractsForPremise(UUID premiseId);

    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Truy vấn thông tin active contracts for premise excluding theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */
    List<ContractSummary> findActiveContractsForPremiseExcluding(UUID premiseId, UUID excludingContractId);
}
