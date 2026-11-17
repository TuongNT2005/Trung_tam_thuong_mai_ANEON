package com.company.aneon.shared.reference;

import com.company.aneon.shared.web.ApiResponse;
import com.company.aneon.shared.error.ApiException;
import com.company.aneon.shared.security.RolePermissions;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shared")
public class ReferenceOptionController {

    private final ReferenceOptionService service;
    private final boolean localIdentityEnabled;
    private final CustomerDirectory customers;

    public ReferenceOptionController(ReferenceOptionService service,
            @Value("${aneon.security.local-identity-enabled:false}") boolean localIdentityEnabled, CustomerDirectory customers) {
        this.service = service;
        this.localIdentityEnabled = localIdentityEnabled;
        this.customers = customers;
    }

    @GetMapping("/reference-options")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ReferenceOptionService.ReferenceOptions> getReferenceOptions() {
        return ApiResponse.ok("Lay danh sach tham chieu thanh cong", service.getAllOptions());
    }

    @GetMapping("/check-in-events")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_CHECKIN_ASSIST + "')")
    public ApiResponse<java.util.List<ReferenceOptionService.OptionItem>> checkInEvents() {
        return ApiResponse.ok("Sự kiện check-in", service.getCheckInEvents());
    }

    @PostMapping("/customers/search")
    @PreAuthorize("hasAuthority('" + RolePermissions.F10_VOUCHER_ISSUE + "')")
    public ApiResponse<CustomerDirectory.Results> searchCustomers(@Valid @RequestBody CustomerDirectory.Search search) {
        return ApiResponse.ok("Kết quả tìm khách", customers.search(search));
    }

    @GetMapping("/public-accounts")
    public ApiResponse<java.util.List<ReferenceOptionService.DemoAccount>> getPublicAccounts() {
        if (!localIdentityEnabled) {
            throw ApiException.forbidden("Danh sách tài khoản thử nghiệm chỉ dùng ở chế độ local.");
        }
        return ApiResponse.ok("Tài khoản thử nghiệm", service.getDemoAccounts());
    }
}
