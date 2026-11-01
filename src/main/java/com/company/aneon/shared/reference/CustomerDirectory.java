package com.company.aneon.shared.reference;


/**
 * ==============================================================================
 * Người code: Bảo
 * Ngày code: 24/10/2026
 * Chức năng: Quản lý danh bạ khách hàng phục vụ tra cứu nhanh tại quầy và xác thực check-in sự kiện
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.List;

import com.company.aneon.shared.error.ApiException;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

/**
 * Người phụ trách code: Bảo | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: tìm khách theo điện thoại, tên hoặc thẻ với giới hạn kết quả cho quầy check-in.
 */
@Service
public class CustomerDirectory {

    private static final int RESULT_LIMIT = 10;
    private static final String CUSTOMER = """
            select c.id, c.full_name as name, right(c.phone_lookup, 4) as phone_last_four,
                (select right(m.card_number, 4) from tai_khoan_thanh_vien m
                 where m.customer_id = c.id and m.archived_at is null and m.status = 'ACTIVE'
                 order by m.created_at desc, m.id limit 1) as card_last_four
            from khach_mua_sam c where c.archived_at is null
            """;

    public enum SearchBy { PHONE, NAME, CARD }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ search
     * Phiên bản: Version 1
     */
    public record Search(@NotNull SearchBy by, @NotBlank @Size(max = 200) String query) {}
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ match
     * Phiên bản: Version 1
     */
    public record Match(String id, String name, String phoneLastFour, String cardLastFour) {}
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ results
     * Phiên bản: Version 1
     */
    public record Results(List<Match> matches, boolean hasMore) {}

    private final JdbcClient jdbc;
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo đối tượng CustomerDirectory và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public CustomerDirectory(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    public Results search(Search search) {
        String value = search.query().strip();
        JdbcClient.StatementSpec statement = switch (search.by()) {
            case PHONE -> jdbc.sql(CUSTOMER + " and c.phone_lookup in (:phones) order by c.full_name, c.id limit :limit")
                    .param("phones", phoneVariants(value));
            case NAME -> {
                if (value.codePointCount(0, value.length()) < 3) {
                    throw ApiException.validation("query", "Nhập ít nhất 3 ký tự đầu của họ tên.");
                }
                String prefix = value.replace("!", "!!").replace("%", "!%").replace("_", "!_");
                yield jdbc.sql(CUSTOMER + " and c.full_name like :prefix escape '!' order by c.full_name, c.id limit :limit")
                        .param("prefix", prefix + "%");
            }
            case CARD -> jdbc.sql("""
                    select c.id, c.full_name as name, right(c.phone_lookup, 4) as phone_last_four,
                           right(m.card_number, 4) as card_last_four
                    from tai_khoan_thanh_vien m join khach_mua_sam c on c.id = m.customer_id
                    where m.card_number = :card and m.status = 'ACTIVE' and m.archived_at is null
                      and c.archived_at is null limit :limit
                    """).param("card", value);
        };
        List<Match> rows = statement.param("limit", RESULT_LIMIT + 1).query(Match.class).list();
        return new Results(rows.stream().limit(RESULT_LIMIT).toList(), rows.size() > RESULT_LIMIT);
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ phone variants
     * Phiên bản: Version 1
     */

    private static List<String> phoneVariants(String value) {
        String phone = value.replaceAll("[+().\\s-]", "");
        if (!phone.matches("[0-9]{7,15}")) {
            throw ApiException.validation("query", "Nhập đầy đủ số điện thoại đã đăng ký.");
        }
        if (phone.startsWith("0") && phone.length() == 10) return List.of(phone, "84" + phone.substring(1));
        if (phone.startsWith("84") && phone.length() == 11) return List.of(phone, "0" + phone.substring(2));
        return List.of(phone);
    }
}
