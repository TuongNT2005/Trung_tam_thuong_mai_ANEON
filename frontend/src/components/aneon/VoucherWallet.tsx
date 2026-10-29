"use client";


/**
 * ==============================================================================
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Giao diện ví voucher: hiển thị danh sách phiếu giảm giá, điều kiện áp dụng và trạng thái sử dụng
 * Phiên bản: Version 1
 * ==============================================================================
 */
import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/aneon-api";
import { IdentityForm, useCustomerIdentity } from "./IdentityForm";
import { ErrorMessage, panel, secondary } from "./Ui";
import { useResource } from "./WorkspaceUi";

type Voucher = {
  id: string;
  code: string;
  name: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  maximumDiscount?: number;
  minimumInvoiceAmount?: number;
  validFrom?: string;
  expiresAt?: string;
  status: string;
  storeCodes: string[];
};

const labels: Record<string, string> = {
  AVAILABLE: "Có thể sử dụng", UPCOMING: "Chưa đến ngày sử dụng", USED: "Đã sử dụng",
  EXPIRED: "Đã hết hạn", REVOKED: "Đã thu hồi",
};
const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

/**
 * Người code: Tùng
 * Ngày code: 27/10/2026
 * Chức năng: Thành phần giao diện (Component) voucher wallet hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export function VoucherWallet() {
  const { identity, connect, restored } = useCustomerIdentity();
  const [revision, setRevision] = useState(0);
  const { data, loading, error } = useResource<Voucher[]>(identity ? "f10/voucher-instances/mine" : undefined, identity, revision);

  if (!restored) return <p role="status">Đang mở ví voucher…</p>;
  if (!identity) return <section className={`${panel} grid max-w-md gap-4`}>
    <p className="text-sm text-ink-soft">Kết nối tài khoản khách để xem phiếu đã nhận và điều kiện sử dụng.</p>
    <IdentityForm customer onConnect={connect} />
  </section>;

  return <div className="grid gap-5">
    <div className="flex flex-wrap items-center gap-3">
      {identity.mode === "local" && identity.label && <p className="mr-auto font-semibold text-plum">{identity.label}</p>}
      <button className={secondary} disabled={loading} onClick={() => setRevision((value) => value + 1)}>Cập nhật voucher</button>
      <button className={secondary} onClick={() => connect()}>Đổi tài khoản</button>
    </div>
    {loading && <p role="status">Đang tải voucher…</p>}
    {error && <ErrorMessage message={error} />}
    {data?.length === 0 && <section className={`${panel} grid gap-3`}>
      <p>Bạn chưa có voucher.</p>
      <Link className="text-sm font-semibold text-magenta-deep underline" href="/kham-pha?danh-muc=PROMOTION">Xem ưu đãi đang diễn ra</Link>
    </section>}
    {data && <ul className="grid gap-4 sm:grid-cols-2">
      {data.map((voucher) => <li key={voucher.id} className={`${panel} grid content-start gap-2`}>
        <p className="text-xs font-semibold text-magenta-deep">{voucher.code} · {labels[voucher.status] ?? "Chưa xác định"}</p>
        <h2 className="font-display text-2xl text-plum">{voucher.name}</h2>
        <p className="font-semibold">Giảm {voucher.discountType === "PERCENTAGE" ? `${voucher.value}%` : money.format(voucher.value)}</p>
        {Boolean(voucher.maximumDiscount) && <p className="text-sm">Giảm tối đa {money.format(voucher.maximumDiscount!)}</p>}
        {Boolean(voucher.minimumInvoiceAmount) && <p className="text-sm">Hóa đơn từ {money.format(voucher.minimumInvoiceAmount!)}</p>}
        <p className="text-sm">{voucher.storeCodes.length > 0 ? `Gian hàng áp dụng · ${voucher.storeCodes.join(", ")}` : "Áp dụng tại tất cả gian hàng đủ điều kiện"}</p>
        <p className="text-sm text-ink-soft">Hiệu lực {formatDate(voucher.validFrom)} – {formatDate(voucher.expiresAt)}</p>
        {voucher.status === "AVAILABLE" && <p className="text-sm text-ink-soft">Cho nhân viên tại quầy xem voucher khi thanh toán.</p>}
      </li>)}
    </ul>}
  </div>;
}
