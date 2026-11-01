"use client";


/**
 * ==============================================================================
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Hiển thị chi tiết nội dung sự kiện, địa điểm, lịch trình hoạt động và hướng dẫn check-in nhận quà
 * Phiên bản: Version 1
 * ==============================================================================
 */
import Link from "next/link";
import { useState } from "react";
import { formatDate, UUID_PATTERN, type PublicStore } from "@/lib/aneon-api";
import { ErrorMessage, panel, secondary } from "./Ui";
import { useResource } from "./WorkspaceUi";

type ScheduleItem = { name: string; startAt?: string; endAt?: string; location?: string };
type PublicEventDetails = {
  event: { title: string; startAt: string; endAt: string; location?: string };
  activities: ScheduleItem[];
  stores: PublicStore[];
};

const uuid = new RegExp(`^${UUID_PATTERN}$`);

/**
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Thành phần giao diện (Component) public event hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export function PublicEvent({ id }: { id: string }) {
  const [revision, setRevision] = useState(0);
  const validId = uuid.test(id);
  const { data, error, loading } = useResource<PublicEventDetails>(validId ? `public/events/${id}` : undefined, undefined, revision);

  return <div className="grid gap-6">
    <Link className="text-sm font-semibold text-magenta-deep underline" href="/kham-pha?danh-muc=EVENT">← Tất cả sự kiện</Link>
    {loading && <p role="status">Đang tải sự kiện…</p>}
    {!validId && <ErrorMessage message="Đường dẫn sự kiện không hợp lệ." />}
    {error && <div className="flex flex-wrap items-center gap-3"><ErrorMessage message={error} />
      <button className={secondary} onClick={() => setRevision((value) => value + 1)}>Tải lại sự kiện</button></div>}
    {data && <>
      <section className="rounded-3xl bg-plum p-6 text-white sm:p-10" aria-labelledby="public-event-heading">
        <p className="text-sm font-semibold text-cream/85">{Date.parse(data.event.startAt) > Date.now() ? "Sắp diễn ra" : "Đang diễn ra"}</p>
        <h1 id="public-event-heading" className="mt-3 font-display text-4xl sm:text-5xl">{data.event.title}</h1>
        <p className="mt-4 text-cream/90">{formatDate(data.event.startAt)} – {formatDate(data.event.endAt)}</p>
        {data.event.location && <p className="mt-2 text-cream/90">Địa điểm · {data.event.location}</p>}
        <div className="mt-6 max-w-2xl rounded-xl bg-white/10 p-4 text-sm">
          <h2 className="font-semibold">Check-in khi đến nơi</h2>
          <p className="mt-1">Tìm bảng <strong>Quét để check-in</strong> ở lối vào {data.event.location || "địa điểm tổ chức"} trong giờ diễn ra sự kiện. Nếu không quét được, hãy đến quầy đón khách.</p>
          <Link className="mt-2 inline-block font-semibold underline underline-offset-4" href="/check-in">Cách quét QR và nhận hỗ trợ</Link>
        </div>
      </section>
      <section className={`${panel} grid gap-3`} aria-label="Lịch hoạt động">
        <h2 className="font-display text-2xl text-plum">Lịch hoạt động</h2>
        {data.activities.length === 0 ? <p className="text-sm text-ink-soft">Lịch chi tiết sẽ được cập nhật tại đây.</p> :
          <ul className="divide-y divide-cream-line">
            {data.activities.map((activity, index) => <li key={`${activity.name}-${index}`} className="py-3">
              <h3 className="font-semibold text-plum">{activity.name}</h3>
              <p className="text-sm text-ink-soft">{formatDate(activity.startAt)} – {formatDate(activity.endAt)}</p>
              {activity.location && <p className="text-sm text-ink-soft">{activity.location}</p>}
            </li>)}
          </ul>}
      </section>
      {data.stores.length > 0 && <section className={`${panel} grid gap-3`} aria-label="Gian hàng tham gia">
        <h2 className="font-display text-2xl text-plum">Gian hàng tham gia</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.stores.map((store) => <li key={store.code} className="rounded-lg bg-cream p-3">
            <Link className="font-semibold text-magenta-deep underline" href={`/#gian-hang-${encodeURIComponent(store.code)}`}>{store.name}</Link>
            <p className="text-sm text-ink-soft">{[store.floor, store.location || store.zone].filter(Boolean).join(" · ")}</p>
          </li>)}
        </ul>
      </section>}
    </>}
  </div>;
}
