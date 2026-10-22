package com.company.aneon.f01.constant;


/**
 * ==============================================================================
 * Người code: Minh
 * Ngày code: 26/10/2026
 * Chức năng: Ma trận chuyển đổi trạng thái hợp lệ StatusTransition cho Mặt bằng và Cửa hàng sạp
 * Phiên bản: Version 1
 * ==============================================================================
 */
import java.util.Map;
import java.util.Set;

import com.company.aneon.shared.error.ApiException;

/**
 * Ma tran chuyen trang thai dung cho ca PremiseStatus va StoreStatus
 * (hai tap trung gia tri) - de xuat baseline trong D0005.
 * LEASED -> VACANT can kiem tra hop dong rieng o service.
 */
public final class StatusTransition {

    private static final Map<Enum<?>, Set<Enum<?>>> ALLOWED = Map.of(
            PremiseStatus.VACANT, Set.of(PremiseStatus.RESERVED, PremiseStatus.LEASED,
                    PremiseStatus.MAINTENANCE, PremiseStatus.SUSPENDED, PremiseStatus.RETIRED),
            PremiseStatus.RESERVED, Set.of(PremiseStatus.VACANT, PremiseStatus.LEASED,
                    PremiseStatus.MAINTENANCE, PremiseStatus.SUSPENDED),
            PremiseStatus.LEASED, Set.of(PremiseStatus.RESERVED, PremiseStatus.VACANT,
                    PremiseStatus.MAINTENANCE, PremiseStatus.SUSPENDED, PremiseStatus.RETIRED),
            PremiseStatus.MAINTENANCE, Set.of(PremiseStatus.VACANT, PremiseStatus.RESERVED,
                    PremiseStatus.LEASED, PremiseStatus.SUSPENDED, PremiseStatus.RETIRED),
            PremiseStatus.SUSPENDED, Set.of(PremiseStatus.VACANT, PremiseStatus.RESERVED,
                    PremiseStatus.LEASED, PremiseStatus.MAINTENANCE, PremiseStatus.RETIRED),
            PremiseStatus.RETIRED, Set.of());
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Khởi tạo đối tượng StatusTransition và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    private StatusTransition() {
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Kiểm tra tính hợp lệ của việc chuyển đổi trạng thái giữa hai trạng thái bất kỳ
     * Phiên bản: Version 1
     */

    public static boolean canTransition(Enum<?> from, Enum<?> to) {
        if (from == to) {
            return false;
        }
        Set<Enum<?>> targets = ALLOWED.get(from);
        return targets != null && targets.contains(to);
    }
    /**
     * Người code: Minh
     * Ngày code: 26/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ assert can transition
     * Phiên bản: Version 1
     */

    public static void assertCanTransition(Enum<?> from, Enum<?> to, String resource) {
        if (!canTransition(from, to)) {
            throw new ApiException(com.company.aneon.shared.error.ErrorCode.BUSINESS_CONFLICT,
                    "Khong cho phep chuyen trang thai cua " + resource + " tu " + from + " sang " + to);
        }
    }
}
