-- Người phụ trách code: Bảo | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
-- Chức năng: tạo khóa tra cứu số điện thoại và chỉ mục hỗ trợ tìm khách check-in.
ALTER TABLE khach_mua_sam
  ADD COLUMN phone_lookup VARCHAR(30) GENERATED ALWAYS AS (
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '.', ''), '(', ''), ')', ''), '+', '')
  ) STORED,
  ADD INDEX ix_khach_mua_sam_phone_lookup (phone_lookup),
  ADD INDEX ix_khach_mua_sam_name_lookup (full_name, archived_at, id);
