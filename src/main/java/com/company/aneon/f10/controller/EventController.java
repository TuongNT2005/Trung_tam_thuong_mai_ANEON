package com.company.aneon.f10.controller;


/**
 * ==============================================================================
 * Người code: Bảo
 * Ngày code: 24/10/2026
 * Chức năng: Controller tiếp nhận các yêu cầu API quản lý vòng đời sự kiện, tạo nháp, phê duyệt ngân sách và chi phí
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.constant.EventStatus;
import com.company.aneon.f10.dto.EventDtos;
import com.company.aneon.f10.service.EventService;
import com.company.aneon.f10.service.QrCodeService;
import com.company.aneon.shared.security.RolePermissions;
import com.company.aneon.shared.web.ApiResponse;
import com.company.aneon.shared.web.PageParams;
import com.company.aneon.shared.web.PageResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

/**
 * F10UC01.1/01.2/01.4/01.5 + endpoint bo tro (D0004).
 * Baseline: /proposals, /approval, /activities, /qr-code, /report.
 */
@RestController
@RequestMapping("/api/v1/f10/events")
public class EventController {

    private final EventService eventService;
    private final QrCodeService qrCodeService;
    private final com.company.aneon.f10.service.EventReportService eventReportService;
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo đối tượng EventController và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public EventController(EventService eventService, QrCodeService qrCodeService,
                           com.company.aneon.f10.service.EventReportService eventReportService) {
        this.eventService = eventService;
        this.qrCodeService = qrCodeService;
        this.eventReportService = eventReportService;
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: khởi tạo và lưu mới proposal vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    @PostMapping("/proposals")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_PROPOSE + "')")
    public ResponseEntity<ApiResponse<EventDtos.EventSummary>> createProposal(
            @Valid @RequestBody EventDtos.CreateEventProposalRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Tao de xuat su kien thanh cong",
                        eventService.createProposal(request)));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo bản nháp sự kiện thương mại ở trạng thái DRAFT
     * Phiên bản: Version 1
     */

    @PostMapping("/drafts")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_PROPOSE + "')")
    public ResponseEntity<ApiResponse<EventDtos.EventSummary>> createDraft(
            @Valid @RequestBody EventDtos.CreateEventProposalRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created("Da luu ban nhap", eventService.createDraft(request)));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP PUT: cập nhật và đồng bộ thông tin draft
     * Phiên bản: Version 1
     */

    @PutMapping("/{id}/draft")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_PROPOSE + "')")
    public ApiResponse<EventDtos.EventDetail> updateDraft(@PathVariable UUID id, @RequestParam long version,
            @Valid @RequestBody EventDtos.CreateEventProposalRequest request) {
        return ApiResponse.ok("Da luu ban nhap", eventService.updateDraft(id, version, request));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: thực hiện xử lý nghiệp vụ submit draft
     * Phiên bản: Version 1
     */

    @PostMapping("/{id}/submission")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_PROPOSE + "')")
    public ApiResponse<EventDtos.EventDetail> submitDraft(@PathVariable UUID id, @RequestParam long version) {
        return ApiResponse.ok("Da gui de xuat", eventService.submitDraft(id, version));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Phê duyệt sự kiện và phân bổ hạn mức ngân sách tổ chức
     * Phiên bản: Version 1
     */

    @PutMapping("/{id}/approval")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_APPROVE + "')")
    public ApiResponse<EventDtos.EventDetail> approve(
            @PathVariable UUID id,
            @Valid @RequestBody EventDtos.ApproveEventRequest request) {
        return ApiResponse.ok("Xu ly duyet su kien thanh cong", eventService.approve(id, request));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: khởi tạo và lưu mới activities vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */

    @PostMapping("/{id}/activities")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_SCHEDULE + "')")
    public ResponseEntity<ApiResponse<EventDtos.ActivityCreatedResult>> addActivities(
            @PathVariable UUID id,
            @Valid @RequestBody EventDtos.CreateActivitiesRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Xep lich hoat dong thanh cong",
                        eventService.addActivities(id, request)));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: thực hiện xử lý nghiệp vụ activities
     * Phiên bản: Version 1
     */

    @GetMapping("/{id}/activities")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_READ + "')")
    public ApiResponse<List<EventDtos.ActivityItem>> activities(@PathVariable UUID id) {
        return ApiResponse.ok("Lay lich hoat dong thanh cong", eventService.activities(id));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP PUT: cập nhật và đồng bộ thông tin activity
     * Phiên bản: Version 1
     */

    @PutMapping("/{id}/activities/{activityId}")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_SCHEDULE + "')")
    public ApiResponse<EventDtos.ActivityItem> updateActivity(@PathVariable UUID id, @PathVariable UUID activityId,
            @RequestParam long version, @Valid @RequestBody EventDtos.CreateActivityRequest request) {
        return ApiResponse.ok("Da cap nhat hoat dong", eventService.updateActivity(id, activityId, version, request));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP DELETE: thực hiện xử lý nghiệp vụ archive activity
     * Phiên bản: Version 1
     */

    @DeleteMapping("/{id}/activities/{activityId}")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_SCHEDULE + "')")
    public ApiResponse<UUID> archiveActivity(@PathVariable UUID id, @PathVariable UUID activityId, @RequestParam long version) {
        return ApiResponse.ok("Da go hoat dong khoi lich", eventService.archiveActivity(id, activityId, version));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: truy vấn thông tin active qr theo tiêu chí nghiệp vụ
     * Phiên bản: Version 1
     */

    @GetMapping("/{id}/qr-code")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_READ + "') or hasAuthority('" + RolePermissions.F10_CHECKIN_ASSIST + "') or hasAuthority('" + RolePermissions.F10_EVENT_QR + "')")
    public ApiResponse<EventDtos.QrCodeDto> getActiveQr(@PathVariable UUID id) {
        return ApiResponse.ok("Lay ma QR check-in thanh cong", qrCodeService.getActiveQr(id).orElse(null));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP POST: thực hiện xử lý nghiệp vụ generate qr
     * Phiên bản: Version 1
     */

    @PostMapping("/{id}/qr-code")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_QR + "')")
    public ApiResponse<EventDtos.QrCodeDto> generateQr(@PathVariable UUID id) {
        return ApiResponse.ok("Sinh ma QR check-in thanh cong", qrCodeService.generate(id));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Xác thực mã QR và xử lý ghi nhận lượt check-in của khách hàng
     * Phiên bản: Version 1
     */

    @PostMapping("/{id}/check-ins")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EventDtos.CheckInResult>> checkIn(
            @PathVariable UUID id,
            @Valid @RequestBody EventDtos.CheckInRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Check-in thanh cong", qrCodeService.checkIn(id, request)));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Ghi nhận chi phí thực tế phát sinh trong quá trình tổ chức sự kiện
     * Phiên bản: Version 1
     */

    @PostMapping("/{id}/expenses")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EXPENSE_WRITE + "')")
    public ResponseEntity<ApiResponse<EventDtos.ExpenseCreatedResult>> recordExpense(
            @PathVariable UUID id,
            @Valid @RequestBody EventDtos.CreateExpenseRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("Ghi chi phi thanh cong",
                        eventService.recordExpense(id, request)));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    @GetMapping
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_READ + "')")
    public ApiResponse<PageResponse<EventDtos.EventSummary>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ApiResponse.ok("Tra cuu su kien thanh cong",
                eventService.search(q, status, PageParams.page(page), PageParams.size(size)));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: thực hiện xử lý nghiệp vụ detail
     * Phiên bản: Version 1
     */

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_READ + "')")
    public ApiResponse<EventDtos.EventDetail> detail(@PathVariable UUID id) {
        return ApiResponse.ok("Tra cuu su kien thanh cong", eventService.detail(id));
    }
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tiếp nhận yêu cầu HTTP GET: thực hiện xử lý nghiệp vụ report
     * Phiên bản: Version 1
     */

    @GetMapping("/{id}/report")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_EVENT_REPORT + "')")
    public ApiResponse<EventDtos.EventReportResponse> report(@PathVariable UUID id) {
        return ApiResponse.ok("Lay du lieu bao cao thanh cong", eventReportService.report(id));
    }
}
