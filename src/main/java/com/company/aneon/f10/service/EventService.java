package com.company.aneon.f10.service;


/**
 * ==============================================================================
 * Người code: Bảo
 * Ngày code: 24/10/2026
 * Chức năng: Interface định nghĩa các nghiệp vụ cốt lõi quản lý sự kiện thương mại và quy trình phê duyệt
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.List;
import java.util.UUID;

import com.company.aneon.f10.constant.EventStatus;
import com.company.aneon.f10.dto.EventDtos;
import com.company.aneon.shared.web.PageResponse;

public interface EventService {
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Tra cứu, tìm kiếm và phân trang dữ liệu theo các bộ lọc điều kiện
     * Phiên bản: Version 1
     */

    PageResponse<EventDtos.EventSummary> search(String q, EventStatus status, int page, int size);

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo và lưu mới proposal vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */
    EventDtos.EventSummary createProposal(EventDtos.CreateEventProposalRequest request);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo bản nháp sự kiện thương mại ở trạng thái DRAFT
     * Phiên bản: Version 1
     */

    EventDtos.EventSummary createDraft(EventDtos.CreateEventProposalRequest request);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Cập nhật và đồng bộ thông tin draft
     * Phiên bản: Version 1
     */

    EventDtos.EventDetail updateDraft(UUID id, long version, EventDtos.CreateEventProposalRequest request);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ submit draft
     * Phiên bản: Version 1
     */

    EventDtos.EventDetail submitDraft(UUID id, long version);

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Phê duyệt sự kiện và phân bổ hạn mức ngân sách tổ chức
     * Phiên bản: Version 1
     */
    EventDtos.EventDetail approve(UUID eventId, EventDtos.ApproveEventRequest request);

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Khởi tạo và lưu mới activities vào cơ sở dữ liệu
     * Phiên bản: Version 1
     */
    EventDtos.ActivityCreatedResult addActivities(UUID eventId, EventDtos.CreateActivitiesRequest request);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ activities
     * Phiên bản: Version 1
     */

    List<EventDtos.ActivityItem> activities(UUID eventId);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Cập nhật và đồng bộ thông tin activity
     * Phiên bản: Version 1
     */

    EventDtos.ActivityItem updateActivity(UUID eventId, UUID activityId, long version, EventDtos.CreateActivityRequest request);
    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ archive activity
     * Phiên bản: Version 1
     */

    UUID archiveActivity(UUID eventId, UUID activityId, long version);

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ detail
     * Phiên bản: Version 1
     */
    EventDtos.EventDetail detail(UUID eventId);

    /**
     * Người code: Bảo
     * Ngày code: 24/10/2026
     * Chức năng: Ghi nhận chi phí thực tế phát sinh trong quá trình tổ chức sự kiện
     * Phiên bản: Version 1
     */
    EventDtos.ExpenseCreatedResult recordExpense(UUID eventId, EventDtos.CreateExpenseRequest request);
}
