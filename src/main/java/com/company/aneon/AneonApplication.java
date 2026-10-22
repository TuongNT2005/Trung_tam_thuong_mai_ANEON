package com.company.aneon;


/**
 * ==============================================================================
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Điểm khởi chạy chính của ứng dụng Spring Boot ANEON, kích hoạt cấu hình tự động và quét thành phần hệ thống
 * Phiên bản: Version 1
 * ==============================================================================
 */
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AneonApplication {
    /**
     * Người code: Tường
     * Ngày code: 22/10/2026
     * Chức năng: Điểm khởi chạy bootstrap ứng dụng Spring Boot và nạp ngữ cảnh hệ thống
     * Phiên bản: Version 1
     */

    public static void main(String[] args) {
        SpringApplication.run(AneonApplication.class, args);
    }
}
