package com.company.aneon.shared.reference;

import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.dto.EventDtos;
import com.company.aneon.f10.service.QrCodeService;
import com.company.aneon.shared.error.ApiException;
import com.company.aneon.shared.web.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public")
@Transactional(readOnly = true)
public class PublicMallController {

    private static final String STORES = """
            select s.code, s.name, c.name as category, f.name as floor, z.name as zone,
                   coalesce(v.text_description, pv.text_description) as location, s.operating_hours, s.description
            from cua_hang s join mat_bang m on m.id = s.premise_id and m.archived_at is null
            join khu_vuc z on z.id = m.zone_id and z.archived_at is null
            join tang f on f.id = z.floor_id and f.archived_at is null
            left join nganh_hang c on c.id = s.category_id and c.archived_at is null
            left join vi_tri v on v.id = s.location_id and v.archived_at is null
            left join vi_tri pv on pv.id = m.location_id and pv.archived_at is null
            where s.public_visible = true and s.archived_at is null
              and s.status <> 'RETIRED'
            """;

    public record Store(String code, String name, String category, String floor, String zone,
                        String location, String operatingHours, String description) {}
    public record Activity(String name, Instant startAt, Instant endAt, String location) {}
    public record EventSummary(String title, Instant startAt, Instant endAt, String location) {}
    public record EventDetails(EventSummary event, List<Activity> activities, List<Store> stores) {}

    private final JdbcClient jdbc;
    private final Clock clock;
    private final QrCodeService qrCodes;

    public PublicMallController(JdbcClient jdbc, Clock clock, QrCodeService qrCodes) {
        this.jdbc = jdbc;
        this.clock = clock;
        this.qrCodes = qrCodes;
    }

    @GetMapping("/stores")
    public ApiResponse<List<Store>> stores() {
        return ApiResponse.ok("Danh bạ gian hàng", jdbc.sql(STORES + " order by f.level, s.name, s.code")
                .query(Store.class).list());
    }

    @GetMapping("/events/{id}")
    public ApiResponse<EventDetails> event(@PathVariable UUID id) {
        String eventId = id.toString();
        EventSummary event = jdbc.sql("""
                select e.name as title, e.start_at, e.end_at, v.text_description as location
                from su_kien e left join vi_tri v on v.id = e.location_id and v.archived_at is null
                where e.id = :id and e.archived_at is null and e.public_visible = true
                  and e.status in ('APPROVED', 'ONGOING') and e.start_at is not null and e.end_at > :now
                """).param("id", eventId).param("now", java.sql.Timestamp.from(clock.instant()))
                .query((rs, index) -> new EventSummary(rs.getString("title"), time(rs, "start_at"), time(rs, "end_at"), rs.getString("location")))
                .optional().orElseThrow(() -> ApiException.notFound("Sự kiện", id));
        List<Activity> activities = jdbc.sql("""
                select a.name, a.start_at, a.end_at, v.text_description as location
                from hoat_dong_su_kien a left join vi_tri v on v.id = a.location_id and v.archived_at is null
                where a.event_id = :id and a.archived_at is null order by a.start_at, a.name
                """).param("id", eventId)
                .query((rs, index) -> new Activity(rs.getString("name"), time(rs, "start_at"), time(rs, "end_at"), rs.getString("location"))).list();
        List<Store> stores = jdbc.sql(STORES + """
                and exists (select 1 from su_kien_cua_hang link where link.event_id = :id and link.store_id = s.id)
                order by s.name, s.code
                """).param("id", eventId).query(Store.class).list();
        return ApiResponse.ok("Chi tiết sự kiện", new EventDetails(event, activities, stores));
    }

    @PostMapping("/events/{id}/check-in-preview")
    public ApiResponse<EventDtos.CheckInContext> checkInPreview(@PathVariable UUID id,
            @Valid @RequestBody EventDtos.CheckInPreviewRequest request) {
        return ApiResponse.ok("Thông tin check-in", qrCodes.preview(id, request.qrToken()));
    }

    private static Instant time(ResultSet row, String column) throws SQLException {
        OffsetDateTime value = row.getObject(column, OffsetDateTime.class);
        return value == null ? null : value.toInstant();
    }
}
