package com.company.aneon.shared.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * STUB CO NHAN - chi chay o profile local/test (docs/decisions/0008):
 * danh tinh doc tu header X-Actor-Id/X-Actor-Roles thay vi JWT khi chua co
 * identity provider. Khong bao gio bat o production.
 */
public class LocalIdentityFilter implements Filter {

    public static final String ACTOR_HEADER = "X-Actor-Id";
    public static final String ROLES_HEADER = "X-Actor-Roles";

    private final boolean enabled;
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Khởi tạo đối tượng LocalIdentityFilter và cấu hình các thành phần phụ thuộc cần thiết
     * Phiên bản: Version 1
     */

    public LocalIdentityFilter(boolean enabled) {
        this.enabled = enabled;
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ do filter
     * Phiên bản: Version 1
     */

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        if (!enabled) {
            chain.doFilter(request, response);
            return;
        }
        String actorId = req.getHeader(ACTOR_HEADER);
        if (actorId != null && !actorId.isBlank()) {
            try {
                UUID accountId = UUID.fromString(actorId.trim());
                Set<String> roles = readRoles(req.getHeader(ROLES_HEADER));
                LocalAuthenticationToken auth = new LocalAuthenticationToken(
                        new AneonPrincipal(accountId, "local-" + accountId, roles),
                        RolePermissions.authoritiesForRoles(roles));
                String zones = req.getHeader("X-Actor-Zones");
                if (zones != null && !zones.isBlank()) {
                    auth.setDetails(Arrays.stream(zones.split(",")).map(String::trim)
                            .filter(s -> !s.isEmpty()).toList());
                }
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (IllegalArgumentException ex) {
                ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED,
                        "X-Actor-Id khong la UUID hop le");
                return;
            }
        }
        chain.doFilter(request, response);
    }
    /**
     * Người code: Tùng
     * Ngày code: 27/10/2026
     * Chức năng: Thực hiện xử lý nghiệp vụ read roles
     * Phiên bản: Version 1
     */

    private Set<String> readRoles(String raw) {
        if (raw == null || raw.isBlank()) {
            return Collections.emptySet();
        }
        return new HashSet<>(Arrays.stream(raw.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
    }

    /** Token xac thuc da duoc tin cua o profile local (stub). */
    public static class LocalAuthenticationToken extends AbstractAuthenticationToken {
        private final AneonPrincipal principal;

        public LocalAuthenticationToken(AneonPrincipal principal, java.util.List<org.springframework.security.core.GrantedAuthority> authorities) {
            super(authorities);
            this.principal = principal;
            setAuthenticated(true);
        }

        @Override
        public Object getCredentials() {
            return "local-stub";
        }

        @Override
        public Object getPrincipal() {
            return principal;
        }
    }
}
