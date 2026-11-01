-- Người phụ trách code: Bảo | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
-- Chức năng: bổ sung dữ liệu demo và liên kết đúng bản vẽ tầng B1, B2, T1-T4.
-- Dữ liệu mẫu ANEON. Chạy sau Flyway trên database dành cho demo.
-- Có thể chạy lại để bổ sung bản ghi còn thiếu. Giữ lại thay đổi đã thực hiện trên dữ liệu hiện có.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
START TRANSACTION;

SET @manager = '11111111-1111-1111-1111-111111111111';
SET @marketing = '22222222-2222-2222-2222-222222222222';
SET @director = '00000000-0000-0000-0000-000000000001';
SET @operations = '00000000-0000-0000-0000-000000000004';
SET @customer = 'a0000000-0000-4000-8000-000000000014';
SET @building = 'a0000000-0000-4000-8000-000000000001';
SET @floor = 'a0000000-0000-4000-8000-000000000002';
SET @zone = 'a0000000-0000-4000-8000-000000000003';
SET @entrance = 'a0000000-0000-4000-8000-000000000004';
SET @venue = 'a0000000-0000-4000-8000-000000000005';
SET @tenant = 'a0000000-0000-4000-8000-000000000006';
SET @contract = 'a0000000-0000-4000-8000-000000000007';
SET @policy = 'a0000000-0000-4000-8000-000000000008';
SET @voucher = 'a0000000-0000-4000-8000-000000000009';
SET @now = UTC_TIMESTAMP(6);
SET @today = DATE(DATE_ADD(@now, INTERVAL 7 HOUR));

INSERT INTO vai_tro (id, code, name) VALUES
  ('a0000000-0000-4000-8000-000000000011', 'MANAGEMENT', 'Ban quản lý'),
  ('a0000000-0000-4000-8000-000000000012', 'MARKETING', 'Marketing'),
  ('a0000000-0000-4000-8000-000000000013', 'CUSTOMER', 'Khách mua sắm'),
  ('a0000000-0000-4000-8000-000000000030', 'DIRECTOR', 'Giám đốc'),
  ('a0000000-0000-4000-8000-000000000031', 'OPERATIONS', 'Vận hành')
ON DUPLICATE KEY UPDATE id = vai_tro.id;
INSERT INTO khach_mua_sam (id, full_name) VALUES
  (@customer, 'Khách demo'), ('a0000000-0000-4000-8000-000000000029', 'Khách hỗ trợ tại quầy')
ON DUPLICATE KEY UPDATE id = khach_mua_sam.id;
UPDATE IGNORE khach_mua_sam SET phone = '0900000101' WHERE id = @customer AND (phone IS NULL OR phone = '');
UPDATE IGNORE khach_mua_sam SET phone = '0900000102'
  WHERE id = 'a0000000-0000-4000-8000-000000000029' AND (phone IS NULL OR phone = '');
INSERT INTO tai_khoan_nguoi_dung (id, username, full_name, role_id, status, customer_id) VALUES
  (@manager, 'aneon-demo-management', 'Ban quản lý demo', (SELECT id FROM vai_tro WHERE code = 'MANAGEMENT'), 'ACTIVE', NULL),
  (@marketing, 'aneon-demo-marketing', 'Marketing demo', (SELECT id FROM vai_tro WHERE code = 'MARKETING'), 'ACTIVE', NULL),
  ('33333333-3333-3333-3333-333333333333', 'aneon-demo-customer', 'Khách demo', (SELECT id FROM vai_tro WHERE code = 'CUSTOMER'), 'ACTIVE', @customer),
  (@director, 'giamdoc', 'Giám đốc demo', (SELECT id FROM vai_tro WHERE code = 'DIRECTOR'), 'ACTIVE', NULL),
  (@operations, 'vanhanh', 'Vận hành demo', (SELECT id FROM vai_tro WHERE code = 'OPERATIONS'), 'ACTIVE', NULL)
ON DUPLICATE KEY UPDATE id = tai_khoan_nguoi_dung.id;
SET @manager = (SELECT id FROM tai_khoan_nguoi_dung WHERE username = 'aneon-demo-management');
SET @marketing = (SELECT id FROM tai_khoan_nguoi_dung WHERE username = 'aneon-demo-marketing');
SET @director = (SELECT id FROM tai_khoan_nguoi_dung WHERE username = 'giamdoc');

INSERT INTO toa_nha (id, code, name) VALUES (@building, 'ANEON-DEMO', 'ANEON Mall') ON DUPLICATE KEY UPDATE id = toa_nha.id;
SET @building = (SELECT id FROM toa_nha WHERE code = 'ANEON-DEMO');
INSERT INTO tang (id, building_id, code, name, level) VALUES
  (@floor, @building, 'TRET', 'Tầng trệt', 0),
  ('b1000000-0000-0000-0000-000000000001', @building, 'B1', 'Hầm B1', -1),
  ('b2000000-0000-0000-0000-000000000002', @building, 'B2', 'Hầm B2', -2),
  ('f1000000-0000-0000-0000-000000000001', @building, 'T1', 'Tầng 1', 1),
  ('f2000000-0000-0000-0000-000000000002', @building, 'T2', 'Tầng 2', 2),
  ('f3000000-0000-0000-0000-000000000003', @building, 'T3', 'Tầng 3', 3),
  ('f4000000-0000-0000-0000-000000000004', @building, 'T4', 'Tầng 4', 4)
ON DUPLICATE KEY UPDATE id = tang.id;
SET @floor = (SELECT id FROM tang WHERE building_id = @building AND code = 'TRET');
SET @floor1 = (SELECT id FROM tang WHERE building_id = @building AND code = 'T1');
SET @floor2 = (SELECT id FROM tang WHERE building_id = @building AND code = 'T2');
SET @floor3 = (SELECT id FROM tang WHERE building_id = @building AND code = 'T3');
SET @floor4 = (SELECT id FROM tang WHERE building_id = @building AND code = 'T4');
SET @floorB1 = (SELECT id FROM tang WHERE building_id = @building AND code = 'B1');
SET @floorB2 = (SELECT id FROM tang WHERE building_id = @building AND code = 'B2');
INSERT INTO khu_vuc (id, floor_id, code, name) VALUES
  (@zone, @floor, 'A', 'Khu A'),
  ('a2000000-0000-0000-0000-000000000002', @floorB1, 'KV-B1', 'Khu B1 - Hàng hiệu quốc tế')
ON DUPLICATE KEY UPDATE id = khu_vuc.id;
-- Chỉ sửa liên kết tầng sai của khu B1 trong dữ liệu demo cũ.
UPDATE khu_vuc SET floor_id = @floorB1
WHERE id = 'a2000000-0000-0000-0000-000000000002' AND floor_id = @floor1;
SET @zone = (SELECT id FROM khu_vuc WHERE floor_id = @floor AND code = 'A');
SET @zoneB1 = (SELECT id FROM khu_vuc WHERE floor_id = @floorB1 AND code = 'KV-B1');
SET @b1Position = 'b1100000-0000-0000-0000-000000000001';
INSERT INTO vi_tri (id, zone_id, x, y, text_description) VALUES
  (@entrance, @zone, 10, 20, 'Sảnh chính'), (@venue, @zone, 70, 60, 'Khu triển lãm'),
  (@b1Position, @zoneB1, 30, 40, 'Hành lang quốc tế B1 - Cửa hàng 01'),
  ('b1100000-0000-0000-0000-000000000002', @zoneB1, 60, 50, 'Khu trưng bày thời trang B1 - Cửa hàng 02')
ON DUPLICATE KEY UPDATE id = vi_tri.id;
INSERT INTO so_do_tang (id, floor_id, name, bounds_min_x, bounds_min_y, bounds_max_x, bounds_max_y, published) VALUES
  ('a0000000-0000-4000-8000-000000000015', @floor, 'Sơ đồ tầng trệt ANEON', 0, 0, 100, 100, TRUE),
  ('b1000000-0000-0000-0000-000000000015', @floorB1, 'Sơ đồ hầm B1 ANEON', 0, 0, 100, 100, TRUE),
  ('b2000000-0000-0000-0000-000000000015', @floorB2, 'Sơ đồ hầm B2 ANEON', 0, 0, 100, 100, TRUE),
  ('f1000000-0000-0000-0000-000000000015', @floor1, 'Sơ đồ Tầng 1 ANEON', 0, 0, 100, 100, TRUE),
  ('f2000000-0000-0000-0000-000000000015', @floor2, 'Sơ đồ Tầng 2 ANEON', 0, 0, 100, 100, TRUE),
  ('f3000000-0000-0000-0000-000000000015', @floor3, 'Sơ đồ Tầng 3 ANEON', 0, 0, 100, 100, TRUE),
  ('f4000000-0000-0000-0000-000000000015', @floor4, 'Sơ đồ Tầng 4 ANEON', 0, 0, 100, 100, TRUE)
ON DUPLICATE KEY UPDATE id = so_do_tang.id;
INSERT INTO mat_bang (id, code, name, zone_id, total_area, type, status, location_id, created_by) VALUES
  ('a0000000-0000-4000-8000-000000000016', 'MB-A01', 'Mặt bằng A01', @zone, 120, 'STORE', 'LEASED', @entrance, @manager),
  ('a0000000-0000-4000-8000-000000000032', 'MB-B101', 'Mặt bằng B1-01', @zoneB1, 90, 'STORE', 'LEASED', @b1Position, @manager)
ON DUPLICATE KEY UPDATE id = mat_bang.id;
SET @premise = (SELECT id FROM mat_bang WHERE code = 'MB-A01');
INSERT INTO nganh_hang (id, code, name) VALUES
  ('a0000000-0000-4000-8000-000000000033', 'ANEON-FOOD', 'Ẩm thực')
ON DUPLICATE KEY UPDATE id = nganh_hang.id;
SET @foodCategory = (SELECT id FROM nganh_hang WHERE code = 'ANEON-FOOD');
INSERT INTO cua_hang (id, code, name, premise_id, category_id, area, location_id, status, public_visible, created_by) VALUES
  ('a0000000-0000-4000-8000-000000000017', 'CH-A01', 'Cửa hàng ANEON Demo', @premise, @foodCategory, 65, @entrance, 'LEASED', TRUE, @manager),
  ('a0000000-0000-4000-8000-000000000034', 'CH-HIGHLANDS', 'Highlands Coffee', (SELECT id FROM mat_bang WHERE code = 'MB-B101'), @foodCategory, 45, @b1Position, 'LEASED', TRUE, @manager)
ON DUPLICATE KEY UPDATE id = cua_hang.id;
SET @store = (SELECT id FROM cua_hang WHERE code = 'CH-A01');
INSERT INTO khach_thue (id, code, name, status) VALUES (@tenant, 'KT-DEMO', 'Công ty ANEON Demo', 'ACTIVE') ON DUPLICATE KEY UPDATE id = khach_thue.id;
INSERT INTO hop_dong_thue (id, number, tenant_id, premise_id, store_id, leased_area, range_start, range_end, status) VALUES
  (@contract, 'HD-THUE-DEMO', @tenant, @premise, @store, 65, DATE_SUB(@today, INTERVAL 7 DAY), DATE_ADD(@today, INTERVAL 1 YEAR), 'ACTIVE')
ON DUPLICATE KEY UPDATE id = hop_dong_thue.id;
INSERT INTO lien_ket_khai_thac (id, tenant_id, premise_id, store_id, contract_id, range_start, status, linked_at) VALUES
  ('a0000000-0000-4000-8000-000000000018', @tenant, @premise, @store, @contract, DATE_SUB(@today, INTERVAL 7 DAY), 'ACTIVE', @now)
ON DUPLICATE KEY UPDATE id = lien_ket_khai_thac.id;

INSERT INTO chinh_sach_thanh_vien (id, active) VALUES (@policy, TRUE) ON DUPLICATE KEY UPDATE id = chinh_sach_thanh_vien.id;
INSERT INTO tai_khoan_thanh_vien (id, customer_id, card_number, tier, status, policy_id) VALUES
  ('a0000000-0000-4000-8000-000000000019', @customer, 'TV-DEMO', 'GOLD', 'ACTIVE', @policy)
ON DUPLICATE KEY UPDATE id = tai_khoan_thanh_vien.id;
INSERT INTO hoa_don_mua_hang (id, number, customer_id, store_id, purchased_at, total_amount, verified) VALUES
  ('a0000000-0000-4000-8000-000000000020', 'HD-MUA-DEMO', @customer, @store, @now, 500000, TRUE)
ON DUPLICATE KEY UPDATE id = hoa_don_mua_hang.id;
INSERT INTO su_kien (id, code, name, type, location_id, start_at, end_at, estimated_budget, approved_budget, target_attendees,
                     status, proposed_by, approved_by, approved_at, public_visible) VALUES
  ('a0000000-0000-4000-8000-000000000021', 'SK-DEMO-01', 'Ngày hội trải nghiệm ANEON', 'Trải nghiệm', @entrance,
   DATE_SUB(@now, INTERVAL 1 HOUR), DATE_ADD(@now, INTERVAL 30 DAY), 5000000, 4500000, 80, 'APPROVED', @marketing, @director, @now, TRUE)
ON DUPLICATE KEY UPDATE id = su_kien.id;
SET @event = (SELECT id FROM su_kien WHERE code = 'SK-DEMO-01');
INSERT INTO su_kien_cua_hang (id, event_id, store_id) VALUES ('a0000000-0000-4000-8000-000000000022', @event, @store)
ON DUPLICATE KEY UPDATE id = su_kien_cua_hang.id;
INSERT INTO chi_phi_thuc_te (id, event_id, supplier_name, invoice_number, amount, incurred_at) VALUES
  ('a0000000-0000-4000-8000-000000000023', @event, 'Nhà cung cấp demo', 'CP-DEMO-01', 1200000, @now)
ON DUPLICATE KEY UPDATE id = chi_phi_thuc_te.id;
INSERT INTO phieu_uu_dai (id, code, name, discount_type, value, minimum_invoice_amount, issued_limit, per_customer_limit, valid_from, expires_at) VALUES
  (@voucher, 'VCDEMO50', 'Voucher demo 50.000 đồng', 'FIXED_AMOUNT', 50000, 200000, 50, 1,
   DATE_SUB(@now, INTERVAL 1 HOUR), DATE_ADD(@now, INTERVAL 30 DAY))
ON DUPLICATE KEY UPDATE id = phieu_uu_dai.id;
INSERT INTO chuong_trinh_khuyen_mai (id, code, name, type, start_at, end_at, minimum_invoice_amount, target_tiers, status, terms, public_visible) VALUES
  ('a0000000-0000-4000-8000-000000000024', 'KM-DEMO-GOLD', 'Giảm 15% cho thành viên Vàng', 'DISCOUNT',
   DATE_SUB(@now, INTERVAL 1 HOUR), DATE_ADD(@now, INTERVAL 30 DAY), 200000, JSON_ARRAY('GOLD'), 'ACTIVE',
   'Áp dụng cho thành viên Vàng tại Cửa hàng ANEON Demo, hóa đơn từ 200.000 đồng.', TRUE),
  ('a0000000-0000-4000-8000-000000000025', 'KM-DEMO-VC', 'Tặng voucher trải nghiệm', 'VOUCHER_GIVEAWAY',
   DATE_SUB(@now, INTERVAL 1 HOUR), DATE_ADD(@now, INTERVAL 30 DAY), 200000, NULL, 'ACTIVE', 'Voucher giảm 50.000 đồng.', TRUE),
  ('a0000000-0000-4000-8000-000000000026', 'KM-DEMO-DIEM', 'Tặng điểm cuối tuần', 'POINT_ACCUMULATION',
   DATE_ADD(@now, INTERVAL 1 DAY), DATE_ADD(@now, INTERVAL 30 DAY), 200000, NULL, 'SCHEDULED', 'Tặng 20 điểm cho hóa đơn hợp lệ.', TRUE)
ON DUPLICATE KEY UPDATE id = chuong_trinh_khuyen_mai.id;
INSERT INTO chuong_trinh_giam_gia (id, discount_rate, maximum_discount) VALUES ('a0000000-0000-4000-8000-000000000024', 15, 100000)
ON DUPLICATE KEY UPDATE id = chuong_trinh_giam_gia.id;
INSERT INTO chuong_trinh_tang_phieu (id, voucher_id, total_to_issue) VALUES ('a0000000-0000-4000-8000-000000000025', @voucher, 50)
ON DUPLICATE KEY UPDATE id = chuong_trinh_tang_phieu.id;
INSERT INTO chuong_trinh_tich_diem (id, reward_points, conversion_amount, points_per_conversion) VALUES ('a0000000-0000-4000-8000-000000000026', 20, 10000, 1)
ON DUPLICATE KEY UPDATE id = chuong_trinh_tich_diem.id;
INSERT INTO khuyen_mai_cua_hang (id, promotion_id, store_id) VALUES
  ('a0000000-0000-4000-8000-000000000027', 'a0000000-0000-4000-8000-000000000024', @store)
ON DUPLICATE KEY UPDATE id = khuyen_mai_cua_hang.id;
COMMIT;
