package com.company.aneon.f01.repository;

import java.util.UUID;

import com.company.aneon.f01.constant.StoreStatus;
import com.company.aneon.f01.entity.CuaHangSap;
import com.company.aneon.shared.security.AccessScope;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

/**
 * Truy van cua hang/sap co scope qua premise (F01UC02.1).
 */
@Repository
public class CuaHangSapQueryDao {

    private final EntityManager em;
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng CuaHangSapQueryDao và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public CuaHangSapQueryDao(EntityManager em) {
        this.em = em;
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ store filter
     * Phiên bản: Version 1
     */

    public record StoreFilter(UUID premiseId, StoreStatus status, String q, AccessScope scope) {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    public Page<CuaHangSap> search(StoreFilter filter, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<CuaHangSap> cq = cb.createQuery(CuaHangSap.class);
        Root<CuaHangSap> root = cq.from(CuaHangSap.class);
        cq.where(buildPredicates(cb, root, filter));
        cq.orderBy(cb.asc(root.get("code")), cb.asc(root.get("id")));
        TypedQuery<CuaHangSap> query = em.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<CuaHangSap> countRoot = countQuery.from(CuaHangSap.class);
        countQuery.select(cb.count(countRoot)).where(buildPredicates(cb, countRoot, filter));
        Long total = em.createQuery(countQuery).getSingleResult();
        return new PageImpl<>(query.getResultList(), pageable, total == null ? 0 : total);
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ build predicates
     * Phiên bản: Version 1
     */

    private Predicate[] buildPredicates(CriteriaBuilder cb, Root<CuaHangSap> root, StoreFilter filter) {
        var predicates = new java.util.ArrayList<Predicate>();
        Join<CuaHangSap, ?> premise = root.join("premise", jakarta.persistence.criteria.JoinType.LEFT);
        if (filter.premiseId() != null) {
            predicates.add(cb.equal(premise.get("id"), filter.premiseId()));
        }
        if (filter.status() != null) {
            predicates.add(cb.equal(root.get("status"), filter.status()));
        }
        if (filter.q() != null && !filter.q().isBlank()) {
            String like = "%" + filter.q().trim().toLowerCase() + "%";
            predicates.add(cb.or(
                    cb.like(cb.lower(root.get("code")), like),
                    cb.like(cb.lower(root.get("name")), like)));
        }
        predicates.add(cb.isNull(root.get("archivedAt")));
        if (!filter.scope().allZones()) {
            if (filter.scope().zoneIds().isEmpty()) {
                predicates.add(cb.disjunction());
            } else {
                predicates.add(premise.get("zone").get("id").in(filter.scope().zoneIds()));
            }
        }
        return predicates.toArray(Predicate[]::new);
    }
}
