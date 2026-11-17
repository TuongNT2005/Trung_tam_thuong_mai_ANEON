package com.company.aneon.shared.reference;

import java.util.List;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ReferenceOptionService {

    @com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
    public record OptionItem(String id, String label, String zoneId) {
        public OptionItem(String id, String label) {
            this(id, label, null);
        }
    }

    public record ReferenceOptions(
            List<OptionItem> zones,
            List<OptionItem> locations,
            List<OptionItem> categories,
            List<OptionItem> premises,
            List<OptionItem> stores,
            List<OptionItem> floors,
            List<OptionItem> events,
            List<OptionItem> vouchers,
            List<OptionItem> promotions,
            List<OptionItem> customers,
            List<OptionItem> customerVouchers,
            List<OptionItem> invoices,
            List<OptionItem> contracts,
            List<OptionItem> staff
    ) {}

    private final JdbcClient jdbc;

    public ReferenceOptionService(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public ReferenceOptions getAllOptions() {
        var zones = jdbc.sql("""
                select z.id, concat(z.name, ' (', z.code, ') - ', coalesce(f.name, '')) as label
                from khu_vuc z left join tang f on z.floor_id = f.id
                where z.archived_at is null
                order by coalesce(f.level, 0), z.code
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label").replaceAll(" - $", "").trim())).list();

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
                select id, concat(code, ' — ', name, ' (', total_area, ' m²)') as label
                from mat_bang
                where archived_at is null
                order by code
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

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
                where archived_at is null
                order by created_at desc
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

        var customers = jdbc.sql("""
                select id, concat(full_name, if(phone is not null and phone != '', concat(' (', phone, ')'), '')) as label
                from khach_mua_sam
                where archived_at is null
                order by full_name
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var customerVouchers = jdbc.sql("""
                select i.id, concat(v.code, ' — ', v.name, ' [Khách: ', coalesce(c.full_name, 'N/A'), ']') as label
                from phieu_uu_dai_khach_hang i
                join phieu_uu_dai v on i.voucher_id = v.id
                left join khach_mua_sam c on i.customer_id = c.id
                where i.status = 'ISSUED'
                order by i.issued_at desc
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var invoices = jdbc.sql("""
                select h.id, concat(h.number, ' — ', format(h.total_amount, 0), ' ₫', if(c.full_name is not null, concat(' (', c.full_name, ')'), '')) as label
                from hoa_don_mua_hang h left join khach_mua_sam c on h.customer_id = c.id
                where h.archived_at is null
                order by h.purchased_at desc
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var contracts = jdbc.sql("""
                select h.id, concat(h.number, ' — ', h.status, if(m.code is not null, concat(' (', m.code, ')'), '')) as label
                from hop_dong_thue h left join mat_bang m on h.premise_id = m.id
                where h.archived_at is null
                order by h.number
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        var staff = jdbc.sql("""
                select t.id, concat(coalesce(t.full_name, t.username), ' (', t.username, if(v.name is not null, concat(' - ', v.name), ''), ')') as label
                from tai_khoan_nguoi_dung t left join vai_tro v on t.role_id = v.id
                where t.archived_at is null
                order by t.username
                """).query((rs, i) -> new OptionItem(rs.getString("id"), rs.getString("label"))).list();

        return new ReferenceOptions(zones, locations, categories, premises, stores, floors, events, vouchers, promotions, customers, customerVouchers, invoices, contracts, staff);
    }
}
