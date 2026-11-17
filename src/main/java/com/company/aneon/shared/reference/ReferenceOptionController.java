package com.company.aneon.shared.reference;

import com.company.aneon.shared.web.ApiResponse;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shared")
public class ReferenceOptionController {

    private final ReferenceOptionService service;

    public ReferenceOptionController(ReferenceOptionService service) {
        this.service = service;
    }

    @GetMapping("/reference-options")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ReferenceOptionService.ReferenceOptions> getReferenceOptions() {
        return ApiResponse.ok("Lay danh sach tham chieu thanh cong", service.getAllOptions());
    }

    @GetMapping("/public-accounts")
    public ApiResponse<java.util.List<ReferenceOptionService.OptionItem>> getPublicAccounts() {
        return ApiResponse.ok("Lay danh sach tai khoan cong khai thanh cong", service.getAllOptions().staff());
    }
}
