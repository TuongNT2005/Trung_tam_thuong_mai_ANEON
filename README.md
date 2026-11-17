# ANEON — quản lý trung tâm thương mại

Ứng dụng gồm backend Spring Boot cho mặt bằng, cửa hàng, sự kiện, khuyến mãi và voucher; frontend Next.js cho nhân viên và khách mua sắm.

## Yêu cầu

- JDK 21 trở lên, MySQL 8.0, Node.js và npm.
- Backend dùng Flyway để tạo và cập nhật schema. Frontend gọi backend qua proxy `/aneon-api`.

## Chạy backend

Tạo database MySQL:

```sql
CREATE DATABASE qldapm_aneon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'aneon'@'localhost' IDENTIFIED BY 'aneon';
GRANT ALL PRIVILEGES ON qldapm_aneon.* TO 'aneon'@'localhost';
```

Từ thư mục gốc repo, đặt `JAVA_HOME` nếu Maven Wrapper chưa tìm thấy JDK, rồi chạy:

```powershell
$env:ANEON_DB_URL = 'jdbc:mysql://127.0.0.1:3306/qldapm_aneon?connectionTimeZone=UTC&forceConnectionTimeZoneToSession=true'
$env:ANEON_DB_USERNAME = 'aneon'
$env:ANEON_DB_PASSWORD = 'aneon'
$env:ANEON_PUBLIC_CHECKIN_BASE_URL = 'http://localhost:3000/check-in'
.\mvnw.cmd spring-boot:run '-Dspring-boot.run.profiles=local'
```

Sau khi Flyway hoàn tất, có thể nạp dữ liệu mẫu trên database demo bằng MySQL client từ thư mục gốc repo:

```sql
USE qldapm_aneon;
SOURCE scripts/seed-local.sql;
```

## Chạy frontend

Trong một cửa sổ PowerShell khác:

```powershell
cd frontend
npm ci
$env:NEXT_PUBLIC_ANEON_LOCAL_IDENTITY = 'true'
npm run dev
```

Mở `http://localhost:3000`. Next.js mặc định chuyển `/aneon-api/*` đến `http://127.0.0.1:8080/api/v1/*`; dùng `ANEON_API_ORIGIN` nếu backend ở địa chỉ khác. Chế độ danh tính local chỉ dùng cùng backend profile `local`.

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Danh bạ gian hàng và nội dung công khai |
| `/kham-pha` | Tìm sự kiện và ưu đãi |
| `/kham-pha/su-kien/[id]` | Lịch và địa điểm sự kiện |
| `/check-in` | Check-in qua QR tại sự kiện |
| `/voucher-cua-toi` | Voucher của khách |
| `/quan-ly` | Mặt bằng, cửa hàng, sự kiện và khuyến mãi |

Để build frontend, chạy `npm run build` trong thư mục `frontend`. Để đóng gói backend, chạy `.\mvnw.cmd package` từ thư mục gốc.
