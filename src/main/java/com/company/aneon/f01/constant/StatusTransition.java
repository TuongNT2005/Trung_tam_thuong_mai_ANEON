package com.company.aneon.f01.constant;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.company.aneon.shared.error.ApiException;

/**
 * Ma tran chuyen trang thai dung cho ca PremiseStatus va StoreStatus
 * (hai tap trung gia tri) - de xuat baseline trong D0005.
 * LEASED -> VACANT can kiem tra hop dong rieng o service.
 * Người phụ trách code: Minh | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: giữ các chuyển trạng thái F01 hợp lệ và trả về lựa chọn cho giao diện.
 */
public final class StatusTransition {

    private static final Map<PremiseStatus, Set<PremiseStatus>> ALLOWED = Map.of(
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

    private StatusTransition() {
    }

    public static boolean canTransition(Enum<?> from, Enum<?> to) {
        if (from instanceof PremiseStatus premise && to instanceof PremiseStatus target) {
            return ALLOWED.get(premise).contains(target);
        }
        if (from instanceof StoreStatus store && to instanceof StoreStatus target) {
            return canTransition(PremiseStatus.valueOf(store.name()), PremiseStatus.valueOf(target.name()));
        }
        return false;
    }

    public static List<String> allowedTargets(Enum<?> from) {
        PremiseStatus status = switch (from) {
            case PremiseStatus premise -> premise;
            case StoreStatus store -> PremiseStatus.valueOf(store.name());
            case null, default -> null;
        };
        return status == null ? List.of() : ALLOWED.get(status).stream().sorted().map(Enum::name).toList();
    }

    public static void assertCanTransition(Enum<?> from, Enum<?> to, String resource) {
        if (!canTransition(from, to)) {
            throw new ApiException(com.company.aneon.shared.error.ErrorCode.BUSINESS_CONFLICT,
                    "Khong cho phep chuyen trang thai cua " + resource + " tu " + from + " sang " + to);
        }
    }
}
