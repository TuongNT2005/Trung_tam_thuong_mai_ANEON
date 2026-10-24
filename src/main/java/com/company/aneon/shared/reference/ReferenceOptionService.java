package com.company.aneon.shared.reference;


/**
 * ==============================================================================
 * Người code: Bảo
 * Ngày code: 24/10/2026
 * Chức năng: Truy vấn danh mục dùng chung từ CSDL phục vụ hiển thị các dropdown và bộ lọc trên giao diện
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.List;
import java.util.UUID;

import com.company.aneon.shared.security.AccessScopePort;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ReferenceOptionService {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ option item
     * Phiên bản: Version 1
     */

    @com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
    public record OptionItem(String id, String label, String zoneId) {
        public OptionItem(String id, String label) {
            this(id, label, null);
        }
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ contract option
     * Phiên bản: Version 1
     */

    public record ContractOption(String id, String label, String premiseId) {}
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ zone option
     * Phiên bản: Version 1
     */
    public record ZoneOption(String id, String label, String floorId) {}
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ premise option
     * Phiên bản: Version 1
     */
    public record PremiseOption(String id, String label, String zoneId, java.math.BigDecimal remainingArea) {}
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ customer option
     * Phiên bản: Version 1
     */
    public record CustomerOption(String id, String label, String customerId) {}
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ invoice option
     * Phiên bản: Version 1
     */
    public record InvoiceOption(String id, String label, String customerId, boolean verified) {}
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ reference options
     * Phiên bản: Version 1
     */

    public record ReferenceOptions(
            List<ZoneOption> zones,
            List<OptionItem> locations,
            List<OptionItem> categories,
            List<PremiseOption> premises,
            List<OptionItem> stores,
            List<OptionItem> floors,
            List<OptionItem> events,
            List<OptionItem> vouchers,
            List<OptionItem> promotions,
            List<CustomerOption> customerVouchers,
            List<InvoiceOption> invoices,
            List<ContractOption> contracts,
            List<OptionItem> staff
    ) {}
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ demo account
     * Phiên bản: Version 1
     */

    public record DemoAccount(String id, String label, String role) {}

    private final JdbcClient jdbc;
    private final AccessScopePort access;
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo đối tượng ReferenceOptionService và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public ReferenceOptionService(JdbcClient jdbc, AccessScopePort access) {
        this.jdbc = jdbc;
        this.access = access;
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn thông tin demo accounts theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    public List<DemoAccount> getDemoAccounts() {
        return jdbc.sql("""
                select t.id, concat(coalesce(t.full_name, t.username), ' (', t.username, ')') as label, r.code
                from tai_khoan_nguoi_dung t join vai_tro r on r.id = t.role_id
                where t.archived_at is null and t.status = 'ACTIVE'
                  and (r.code <> 'CUSTOMER' or t.username = 'aneon-demo-customer')
                order by t.username
                """).query((rs, index) -> new DemoAccount(rs.getString("id"), rs.getString("label"), rs.getString("code"))).list();
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn thông tin check in events theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    public List<OptionItem> getCheckInEvents() {
        var scope = access.currentScope();
        if (!scope.allZones() && scope.zoneIds().isEmpty()) return List.of();
        String sql = """
                select e.id, concat(e.code, ' — ', e.name) as label
                from su_kien e left join vi_tri v on v.id = e.location_id
                where e.archived_at is null and e.status in ('APPROVED', 'ONGOING') and e.end_at > utc_timestamp(6)
                """;
        String sort = " order by e.start_at <= utc_timestamp(6) desc, e.start_at, e.id";
        var statement = scope.allZones() ? jdbc.sql(sql + sort)
                : jdbc.sql(sql + " and v.zone_id in (:zones)" + sort)
                        .param("zones", scope.zoneIds().stream().map(UUID::toString).toList());
        return statement.query((rs, index) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Truy vấn danh sách all options từ hệ thống cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    public ReferenceOptions getAllOptions() {
        var zones = jdbc.sql("""
                select z.id, z.floor_id, concat(z.name, ' (', z.code, ') - ', coalesce(f.name, '')) as label
                from khu_vuc z left join tang f on z.floor_id = f.id
                where z.archived_at is null
                order by coalesce(f.level, 0), z.code
                """).query((rs, i) -> new ZoneOption(rs.getString("id"), rs.getString("label").replaceAll(" - $", "").trim(), rs.getString("floor_id"))).list();

        var locations = jdbc.sql("""
                select v.id, concat(coalesce(v.text_description, 'Vị trí'), ' (', coalesce(z.name, 'Khu vực'), ')') as label, v.zone_id as zoneId
                from vi_tri v left join khu_vuc z on v.zone_id = z.id
                where v.archived_at is null
                order by v.text_description
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label").trim(), rs.getString("zoneId"))).list();

        var categories = jdbc.sql("""
                select id, concat(name, ' (', code, ')') as label
                from nganh_hang
                where archived_at is null
                order by name
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var premises = jdbc.sql("""
                select m.id, m.zone_id, concat(m.code, ' — ', m.name, ' (', m.total_area, ' m²)') as label,
                       m.total_area - coalesce((select sum(s.area) from cua_hang s
                           where s.premise_id = m.id and s.archived_at is null), 0) as remaining_area
                from mat_bang m where m.archived_at is null order by m.code
                """).query((rs, i) -> new PremiseOption(rs.getString("id"), rs.getString("label"),
                        rs.getString("zone_id"), rs.getBigDecimal("remaining_area"))).list();

        var stores = jdbc.sql("""
                select id, concat(code, ' — ', name) as label
                from cua_hang
                where archived_at is null
                order by code
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var floors = jdbc.sql("""
                select id, concat(name, ' (', code, ')') as label
                from tang
                where archived_at is null
                order by level, code
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var events = jdbc.sql("""
                select id, concat(code, ' — ', name) as label
                from su_kien
                where archived_at is null and status in ('APPROVED', 'ONGOING') and end_at > utc_timestamp(6)
                order by start_at <= utc_timestamp(6) desc, start_at
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var vouchers = jdbc.sql("""
                select id, concat(code, ' — ', name) as label
                from phieu_uu_dai
                where archived_at is null
                order by code
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var promotions = jdbc.sql("""
                select id, concat(code, ' — ', name) as label
                from chuong_trinh_khuyen_mai
                where archived_at is null
                order by start_at desc
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var customerVouchers = jdbc.sql("""
                select i.id, i.customer_id, concat(v.code, ' — ', v.name, ' [Khách: ', coalesce(c.full_name, 'N/A'), ']') as label
                from phieu_uu_dai_khach_hang i
                join phieu_uu_dai v on i.voucher_id = v.id
                left join khach_mua_sam c on i.customer_id = c.id
                where i.status = 'ISSUED'
                order by i.issued_at desc
                """).query((rs, i) -> new CustomerOption(rs.getString("id"), rs.getString("label"), rs.getString("customer_id"))).list();

        var invoices = jdbc.sql("""
                select h.id, h.customer_id, h.verified, concat(h.number, ' — ', format(h.total_amount, 0), ' ₫', if(c.full_name is not null, concat(' (', c.full_name, ')'), '')) as label
                from hoa_don_mua_hang h left join khach_mua_sam c on h.customer_id = c.id
                where h.archived_at is null
                order by h.purchased_at desc
                """).query((rs, i) -> new InvoiceOption(rs.getString("id"), rs.getString("label"), rs.getString("customer_id"), rs.getBoolean("verified"))).list();

        var contracts = jdbc.sql("""
                select h.id, h.premise_id, concat(h.number, ' — ', h.status, if(m.code is not null, concat(' (', m.code, ')'), '')) as label
                from hop_dong_thue h left join mat_bang m on h.premise_id = m.id
                where h.archived_at is null
                order by h.number
                """).query((rs, i) -> new ContractOption(rs.getString("id"), rs.getString("label"), rs.getString("premise_id"))).list();

        var staff = jdbc.sql("""
                select t.id, concat(coalesce(t.full_name, t.username), ' (', t.username, if(v.name is not null, concat(' - ', v.name), ''), ')') as label
                from tai_khoan_nguoi_dung t left join vai_tro v on t.role_id = v.id
                where t.archived_at is null and t.customer_id is null and (v.code is null or v.code <> 'CUSTOMER')
                order by t.username
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        return new ReferenceOptions(zones, locations, categories, premises, stores, floors, events, vouchers, promotions, customerVouchers, invoices, contracts, staff);
    }
}
