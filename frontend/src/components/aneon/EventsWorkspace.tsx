"use client";


/**
 * ==============================================================================
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Giao diện quản lý sự kiện: tạo nháp, phê duyệt ngân sách, sinh mã QR check-in và thống kê chi phí
 * Phiên bản: Version 1
 * ==============================================================================
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import qrcode from "qrcode-generator";
import { formatDate, type Identity } from "@/lib/aneon-api";
import { ErrorMessage, panel, primary, secondary } from "./Ui";
import { useReferences } from "./ReferenceContext";
import { Action, allowed, Details, Modal, MutationForm, Records, useResource, type Column, type FormField, type Row } from "./WorkspaceUi";
import { EventAttachments } from "./EventAttachments";

const statuses: Record<string, string> = {
  DRAFT: "Bản nháp", PENDING_APPROVAL: "Chờ duyệt", APPROVED: "Đã duyệt", REJECTED: "Đã từ chối",
  ONGOING: "Đang diễn ra", FINISHED: "Đã kết thúc", CANCELLED: "Đã hủy",
};
/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ amount
 * Phiên bản: Version 1
 */
const amount = (value: unknown) => typeof value === "number" ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value) : "—";
/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ date
 * Phiên bản: Version 1
 */
const date = (value: unknown) => formatDate(value as string | undefined);
const eventPath = "f10/events";
const starts: FormField = { name: "startAt", label: "Bắt đầu (giờ Việt Nam)", type: "datetime-local", required: true };
const ends: FormField = { ...starts, name: "endAt", label: "Kết thúc (giờ Việt Nam)" };
const description: FormField = { name: "description", label: "Mô tả", type: "textarea", max: 1000, placeholder: "Mô tả chi tiết..." };
const eventName: FormField = { name: "name", label: "Tên sự kiện", max: 200, required: true, placeholder: "Ví dụ: Hội chợ ẩm thực Mùa Xuân 2026" };
const eventColumns: Column[] = [["code", "Mã"], ["name", "Sự kiện"], ["status", "Trạng thái", (value) => statuses[String(value)] ?? String(value)],
  ["estimatedBudget", "Dự toán", amount], ["createdAt", "Ngày đề xuất", date]];

/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ date input
 * Phiên bản: Version 1
 */
function dateInput(value: unknown) {
  return typeof value === "string" ? new Date(Date.parse(value) + 7 * 60 * 60 * 1000).toISOString().slice(0, 16) : "";
}

/**
 * Người phụ trách code: Kiên | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: nối đề xuất, duyệt, công bố, QR và báo cáo sự kiện trên workspace.
 */
/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Thành phần giao diện (Component) events workspace hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export function EventsWorkspace({ identity, selected, onSelect }: {
  identity: Identity; selected?: string; onSelect: (id?: string) => void;
}) {
  const { options: refOptions, refresh: refreshRef } = useReferences();
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState<{ id: string; message: string }>();
  const [queue, setQueue] = useState(identity.mode === "local" && identity.role === "DIRECTOR" ? "PENDING_APPROVAL" : "");
  const [copied, setCopied] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const detailPath = selected ? `${eventPath}/${selected}` : undefined;
  const detail = useResource<Row>(detailPath, identity, revision);
  const canMarket = allowed(identity, "MARKETING");
  const canApprove = allowed(identity, "MANAGEMENT", "DIRECTOR");
  const canReport = allowed(identity, "MANAGEMENT", "DIRECTOR", "MARKETING");
  const ownsDraft = detail.data?.status === "DRAFT" && canMarket && (identity.mode === "jwt" || identity.actorId === detail.data.proposedBy);
  const approved = ["APPROVED", "ONGOING"].includes(String(detail.data?.status));
  const currentEvent = approved && Date.parse(String(detail.data?.endAt)) > Date.now();
  const canPublish = canMarket && (identity.mode === "jwt" || identity.actorId === detail.data?.proposedBy);
  const publicUrl = `/kham-pha/su-kien/${selected}`;

  useEffect(() => {
    if (selected) profileRef.current?.focus({ preventScroll: false });
  }, [selected]);

  const locationField: FormField = { name: "locationId", label: "Địa điểm / Vị trí", type: "uuid", options: refOptions.locations, required: true };
  const proposalFields: FormField[] = [
    {
      name: "code",
      label: "Mã sự kiện",
      max: 50,
      required: true,
      pattern: "[A-Za-z0-9._\\-]+",
      placeholder: "Ví dụ: SK-XUAN-2026, EVT-DEMO-01",
      helpText: "Chữ cái, chữ số, dấu chấm (.), gạch nối (-), gạch dưới (_)",
    },
    eventName,
    { name: "type", label: "Loại sự kiện", max: 100, placeholder: "Ví dụ: Ẩm thực, Ca nhạc, Triển lãm" },
    locationField,
    starts,
    ends,
    { name: "estimatedBudget", label: "Ngân sách dự kiến (₫)", type: "number", min: 0, required: true, placeholder: "Ví dụ: 50000000" },
    { name: "targetAttendees", label: "Số khách mục tiêu", type: "number", min: 0, required: true, placeholder: "Ví dụ: 1000" },
    { name: "participatingStoreIds", label: "Gian hàng tham gia", type: "list", options: refOptions.stores },
    { name: "publicVisible", label: "Hiển thị công khai sau khi duyệt", type: "checkbox" },
  ];

  const activityFields: FormField[] = [
    { ...eventName, label: "Tên hoạt động", placeholder: "Ví dụ: Khai mạc và biểu diễn nghệ thuật" },
    locationField,
    starts,
    ends,
    { name: "personInCharge", label: "Người phụ trách", type: "uuid", options: refOptions.staff },
    description,
  ];

  /**
   * Người code: Kiên
   * Ngày code: 31/10/2026
   * Chức năng: Hàm xử lý nghiệp vụ saved
   * Phiên bản: Version 1
   */
  function saved(message: string, id = selected ?? "") {
    setRevision((value) => value + 1);
    setNotice({ id, message });
    refreshRef();
  }

  if (!selected) return <div className="grid gap-5">
    {canMarket && (
      <div className={`${panel} grid gap-3 sm:grid-cols-2`}>
        <Action title="Đề xuất sự kiện">
          <MutationForm
            path={`${eventPath}/proposals`}
            identity={identity}
            fields={proposalFields}
            label="Gửi đề xuất"
            onSaved={(data) => {
              onSelect(String(data.id));
              saved("Đã gửi đề xuất. Giám đốc hoặc Ban quản lý có thể mở hồ sơ để duyệt.", String(data.id));
            }}
          />
        </Action>
        <Action title="Tạo bản nháp">
          <MutationForm
            path={`${eventPath}/drafts`}
            identity={identity}
            fields={proposalFields}
            label="Lưu bản nháp"
            onSaved={(data) => {
              onSelect(String(data.id));
              saved("Đã lưu bản nháp. Kiểm tra thông tin và gửi duyệt khi hoàn tất.", String(data.id));
            }}
          />
        </Action>
      </div>
    )}
    <div className="flex flex-wrap gap-2" aria-label="Danh sách công việc">
      {[["", "Tất cả sự kiện"], ["PENDING_APPROVAL", canApprove ? "Chờ tôi duyệt" : "Chờ duyệt"], ["APPROVED", "Đã duyệt"]].map(([status, label]) => (
        <button key={status} type="button" className={`${secondary} aria-pressed:border-magenta-deep aria-pressed:bg-cream`}
          aria-pressed={queue === status} onClick={() => setQueue(status)}>{label}</button>
      ))}
    </div>
    <Records key={queue} initialFilters={{ status: queue }}
      path={eventPath}
      identity={identity}
      revision={revision}
      columns={eventColumns}
      filters={[
        { name: "q", label: "Tên hoặc mã sự kiện", max: 200, placeholder: "Tìm theo tên hoặc mã sự kiện..." },
        { name: "status", label: "Trạng thái", options: statuses },
      ]}
      onSelect={onSelect}
    />
  </div>;

  return <div ref={profileRef} tabIndex={-1} className="grid gap-5 focus:outline-none">
    <div className="flex flex-wrap items-center gap-3">
      <button className={secondary} onClick={() => { setCopied(false); onSelect(); }}>← Danh sách sự kiện</button>
      <button className={secondary} onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
        } catch { setCopied(false); }
      }}>{copied ? "Đã sao chép" : "Sao chép liên kết bàn giao"}</button>
      <Link className="text-sm font-semibold text-magenta-deep underline" href={`/quan-ly?view=events&event=${selected}`}>Liên kết hồ sơ</Link>
    </div>
    {notice?.id === selected && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-900">{notice.message}</p>}
    {detailPath && (
        <div className="grid gap-5">
          {detail.loading && <p role="status">Đang tải chi tiết…</p>}
          {detail.error && <div className="flex flex-wrap items-center gap-3"><ErrorMessage message={detail.error} />
            <button className={secondary} onClick={() => setRevision((value) => value + 1)}>Tải lại hồ sơ</button></div>}
          {detail.data && (
            <>
              <section className={`${panel} grid gap-4`} aria-labelledby="event-heading">
              <h2 id="event-heading" className="font-display text-3xl text-plum">{String(detail.data.name)}</h2>
              <div className="rounded-xl bg-cream p-4 text-sm" aria-label="Bước tiếp theo">
                <p className="font-semibold text-plum">{statuses[String(detail.data.status)]}
                  {approved && (detail.data.publicVisible ? " · Đã công khai" : " · Chưa công khai")}</p>
                <p className="mt-1 text-ink-soft">{detail.data.status === "DRAFT" ? "Marketing kiểm tra nội dung, đính kèm tài liệu nếu cần và gửi duyệt."
                  : detail.data.status === "PENDING_APPROVAL" ? "Giám đốc hoặc Ban quản lý xem đề xuất và duyệt ngân sách."
                  : currentEvent ? (detail.data.publicVisible ? "Marketing chuẩn bị lịch và QR. Vận hành hỗ trợ khách khi đến giờ check-in."
                    : "Marketing công bố sự kiện để khách tìm được lịch và địa điểm.")
                  : approved ? "Khung giờ sự kiện đã kết thúc. Mở báo cáo để xem kết quả."
                  : "Xem trạng thái và lý do trong thông tin hồ sơ."}</p>
                {currentEvent && detail.data.publicVisible === true && <Link className="mt-2 inline-block font-semibold text-magenta-deep underline" href={publicUrl}>Xem trên cổng khách</Link>}
              </div>
              <Details
                data={detail.data}
                columns={[
                  ...eventColumns.filter(([key]) => key !== "createdAt"),
                  ["locationDescription", "Địa điểm"],
                  ["startAt", "Bắt đầu", date],
                  ["endAt", "Kết thúc", date],
                  ["approvedBudget", "Ngân sách đã duyệt", amount],
                  ["targetAttendees", "Số khách mục tiêu"],
                  ["participatingStoreIds", "Gian hàng tham gia", (value) => Array.isArray(value)
                    ? value.map((id) => refOptions.stores[id]).filter(Boolean).join(", ") || "—" : "—"],
                  ["rejectionReason", "Lý do từ chối"],
                ]}
              />
              </section>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {ownsDraft && (
                  <>
                    <Action title="Chỉnh sửa bản nháp">
                      <MutationForm
                        identity={identity}
                        path={`${detailPath}/draft?version=${detail.data.version}`}
                        method="PUT"
                        fields={proposalFields.filter((field) => field.name !== "code")}
                        label="Lưu chỉnh sửa"
                        defaults={{ ...detail.data, startAt: dateInput(detail.data.startAt), endAt: dateInput(detail.data.endAt) }}
                        build={(body) => ({ ...body, code: detail.data?.code })}
                        onSaved={() => saved("Đã cập nhật bản nháp.")}
                      />
                    </Action>
                    <Action title="Gửi bản nháp để duyệt">
                      <MutationForm
                        identity={identity}
                        path={`${detailPath}/submission?version=${detail.data.version}`}
                        fields={[]}
                        label="Gửi duyệt"
                        onSaved={() => saved("Đã gửi duyệt. Chuyển liên kết hồ sơ cho Giám đốc hoặc Ban quản lý.")}
                      />
                    </Action>
                  </>
                )}
                {(detail.data.status !== "DRAFT" || ownsDraft) && (
                  <EventAttachments key={`${detailPath}-attachments`} path={`${detailPath}/files`} identity={identity} canEdit={ownsDraft} />
                )}
                {canApprove && detail.data.status === "PENDING_APPROVAL" && (
                  <>
                    <Action title="Duyệt đề xuất">
                      <MutationForm
                        identity={identity}
                        path={`${detailPath}/approval`}
                        method="PUT"
                        label="Duyệt sự kiện"
                        fields={[
                          { name: "approvedBudget", label: "Ngân sách duyệt (₫)", type: "number", min: 1, required: true },
                          { name: "note", label: "Ghi chú", max: 500 },
                        ]}
                        build={(body) => ({ ...body, action: "APPROVE", version: detail.data?.version })}
                        onSaved={() => saved("Đã duyệt ngân sách. Marketing có thể tiếp tục công bố, xếp lịch và tạo QR.")}
                      />
                    </Action>
                    <Action title="Từ chối đề xuất">
                      <MutationForm
                        identity={identity}
                        path={`${detailPath}/approval`}
                        method="PUT"
                        label="Từ chối sự kiện"
                        fields={[{ name: "rejectionReason", label: "Lý do từ chối", type: "textarea", max: 500, required: true }]}
                        build={(body) => ({ ...body, action: "REJECT", version: detail.data?.version })}
                        onSaved={() => saved("Đã từ chối đề xuất. Lý do được lưu trong hồ sơ.")}
                      />
                    </Action>
                  </>
                )}
                {canPublish && currentEvent && !detail.data.publicVisible && (
                  <Action title="Công bố sự kiện">
                    <p className="mt-3 text-sm text-ink-soft">Khách sẽ thấy sự kiện, lịch hoạt động và gian hàng công khai trên cổng khách.</p>
                    <MutationForm
                      identity={identity}
                      path={`${detailPath}/publication?version=${detail.data.version}`}
                      method="PUT"
                      label="Công bố trên cổng khách"
                      fields={[]}
                      onSaved={() => saved("Đã công bố. Bấm Xem trên cổng khách để kiểm tra.")}
                    />
                  </Action>
                )}
                {canMarket && (
                  <Action title="Ghi chi phí">
                    <MutationForm
                      identity={identity}
                      path={`${detailPath}/expenses`}
                      label="Ghi chi phí"
                      fields={[
                        { name: "supplierName", label: "Nhà cung cấp", max: 200, placeholder: "Ví dụ: Công ty TNHH Truyền thông ABC" },
                        { name: "invoiceNumber", label: "Số hóa đơn", max: 100, placeholder: "Ví dụ: HD-2026-001" },
                        { name: "amount", label: "Số tiền (₫)", type: "number", required: true, min: 0.01, step: "0.01", placeholder: "Ví dụ: 15000000" },
                        { name: "incurredAt", label: "Thời điểm phát sinh (giờ Việt Nam)", type: "datetime-local" },
                        description,
                      ]}
                      onSaved={() => saved("Đã ghi nhận chi phí. Báo cáo đã được cập nhật.")}
                    />
                  </Action>
                )}
              </div>
              {(approved || detail.data.status === "PENDING_APPROVAL") && <ActivitySchedule
                key={`${detailPath}-activities`} identity={identity} path={`${detailPath}/activities`}
                locationId={detail.data.locationId} activityFields={activityFields}
                canEdit={canMarket && ["PENDING_APPROVAL", "APPROVED"].includes(String(detail.data.status))}
              />}
              {canMarket && currentEvent && <EventQr key={`${detailPath}-qr`} identity={identity} path={`${detailPath}/qr-code`} eventId={selected} event={detail.data} />}
              {approved && canReport && <Report key={`${detailPath}-report`} identity={identity} path={`${detailPath}/report`} />}
            </>
          )}
        </div>
    )}
  </div>;
}

/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Thành phần giao diện (Component) activity schedule hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
function ActivitySchedule({ identity, path, locationId, activityFields, canEdit }: {
  identity: Identity; path: string; locationId: unknown; activityFields: FormField[]; canEdit: boolean;
}) {
  const [revision, setRevision] = useState(0);
  const list = useResource<Row[]>(path, identity, revision);
  /**
   * Người code: Kiên
   * Ngày code: 31/10/2026
   * Chức năng: Hàm xử lý nghiệp vụ refresh
   * Phiên bản: Version 1
   */
  const refresh = () => setRevision((value) => value + 1);
  return <section className={panel} aria-label="Lịch hoạt động">
    <h3 className="font-display text-2xl text-plum">Lịch hoạt động</h3>
    <div className="mt-4 grid gap-3">
      {list.loading && <p role="status" className="text-sm">Đang tải lịch hoạt động…</p>}
      {list.error && <ErrorMessage message={list.error} />}
      {list.error && <button type="button" className={`${secondary} justify-self-start`} onClick={refresh}>Tải lại lịch</button>}
      {list.data?.length === 0 && <p className="text-sm">Chưa có hoạt động.</p>}
      {list.data?.map((item) => {
        const editPath = `${path}/${item.id}?version=${item.version}`;
        return <details key={String(item.id)} className="rounded-lg border border-cream-line p-3">
          <summary className="cursor-pointer text-sm font-semibold">{String(item.name)} · {date(item.startAt)} – {date(item.endAt)}</summary>
          <div className="mt-3 grid gap-3">
            <Details data={item} columns={[["locationDescription", "Địa điểm"], ["personInChargeName", "Người phụ trách"], ["description", "Mô tả"]]} />
            {canEdit && <>
              <MutationForm key={editPath} identity={identity} path={editPath} method="PUT" label="Lưu chỉnh sửa"
                fields={activityFields} defaults={{ ...item, startAt: dateInput(item.startAt), endAt: dateInput(item.endAt) }} onSaved={refresh} />
              <Action title="Gỡ hoạt động khỏi lịch"><MutationForm identity={identity} path={editPath} method="DELETE"
                label="Xác nhận gỡ hoạt động" fields={[]} onSaved={refresh} /></Action>
            </>}
          </div>
        </details>;
      })}
      {canEdit && <Action title="Thêm hoạt động"><MutationForm identity={identity} path={path} label="Lưu hoạt động"
        defaults={{ locationId }} fields={activityFields} build={(body) => ({ activities: [body] })} onSaved={refresh} /></Action>}
    </div>
  </section>;
}

/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Thành phần giao diện (Component) event qr hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
function EventQr({ identity, path, eventId, event }: { identity: Identity; path: string; eventId: string; event: Row }) {
  const [revision, setRevision] = useState(0);
  const qr = useResource<Row | null>(path, identity, revision, true);
  /**
   * Người code: Kiên
   * Ngày code: 31/10/2026
   * Chức năng: Hàm xử lý nghiệp vụ refresh
   * Phiên bản: Version 1
   */
  const refresh = () => setRevision((value) => value + 1);
  return <section className={`${panel} grid gap-4`} aria-label="Mã QR check-in">
    <h3 className="font-display text-2xl text-plum">Mã QR check-in</h3>
    {qr.loading && <p role="status" className="text-sm">Đang tải mã QR…</p>}
    {qr.error && <div className="flex flex-wrap items-center gap-2"><ErrorMessage message={qr.error} />
      <button className={secondary} onClick={refresh}>Tải lại mã QR</button></div>}
    {qr.data === null && <div>
      <p className="text-sm text-ink-soft">Tạo QR rồi in hoặc trình chiếu bảng tại lối vào sự kiện trong giờ đón khách.</p>
      <MutationForm identity={identity} path={path} fields={[]} label="Tạo mã QR" onSaved={refresh} />
    </div>}
    {qr.data && <>
      <QrResult key={String(qr.data.qrCodeId)} data={qr.data} event={event} />
      <div className="flex flex-wrap items-center gap-4">
        <Link className={secondary} href={`/quan-ly?view=assist&event=${eventId}`}>Mở hỗ trợ check-in</Link>
        <Action title="Thay mã QR">
          <p className="text-sm text-ink-soft">Mã cũ sẽ ngừng hoạt động. Hãy thay mã tại các điểm đón khách sau khi tạo mã mới.</p>
          <MutationForm identity={identity} path={path} fields={[]} label="Xác nhận thay mã" onSaved={refresh} />
        </Action>
      </div>
    </>}
  </section>;
}

/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Thành phần giao diện (Component) qr result hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
function QrResult({ data, event }: { data: Row; event: Row }) {
  const [copyMessage, setCopyMessage] = useState("");
  const [posterOpen, setPosterOpen] = useState(false);
  const url = String(data.checkInUrl ?? "");
  const eventName = String(event.name);
  const location = String(event.locationDescription ?? "Lối vào sự kiện");
  let image: string | undefined;
  try {
    const qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    image = qr.createDataURL(5, 20);
  } catch {
    // Liên kết vẫn dùng được nếu dài hơn dung lượng của mã QR.
  }
  const poster = image && <div className="mx-auto grid max-w-lg justify-items-center gap-3 bg-white p-4 text-center text-black">
    <p className="text-lg font-semibold">{eventName}</p>
    <p className="text-sm">{location} · {date(event.startAt)} – {date(event.endAt)}</p>
    <h3 className="text-3xl font-bold sm:text-4xl">Quét để check-in</h3>
    <img src={image} alt={`QR check-in sự kiện ${eventName}`} className="aspect-square w-full max-w-84" />
    <p className="text-base font-semibold">Mở Camera, quét QR và chạm vào liên kết hiện ra.</p>
    <p className="text-sm">Cần hỗ trợ? Mời bạn đến quầy đón khách ở lối vào.</p>
  </div>;

  return <>
    <p className="text-sm text-ink-soft">Đặt bảng QR ở lối vào {location}. Mã có hiệu lực đến {date(data.expiresAt)}.</p>
    {!image && <ErrorMessage message="Chưa thể tạo hình QR từ liên kết. Kiểm tra cấu hình URL check-in." />}
    <div className="flex flex-wrap items-center gap-3">
      {image && <button type="button" className={primary} onClick={() => setPosterOpen(true)}>Trình chiếu hoặc in QR</button>}
      <a className={secondary} href={url} target="_blank" rel="noreferrer">Mở bản thử với tư cách khách</a>
      <button type="button" className={secondary} onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopyMessage("Đã sao chép. Chia sẻ liên kết cho khách tại điểm đón khách khi cần.");
        } catch { setCopyMessage("Nhấp chuột phải vào “Mở bản thử với tư cách khách” rồi chọn Sao chép địa chỉ liên kết."); }
      }}>Sao chép đường dẫn cho khách</button>
      {copyMessage && <span role="status" className="text-sm">{copyMessage}</span>}
    </div>
    {posterOpen && poster && <>
      <Modal open onClose={() => setPosterOpen(false)} title="Bảng QR tại lối vào"
        footer={<div className="flex flex-wrap justify-end gap-3">
          <button type="button" className={secondary} onClick={() => setPosterOpen(false)}>Đóng bảng QR</button>
          <button type="button" className={primary} onClick={() => window.print()}>In bảng QR</button>
        </div>}>{poster}</Modal>
      {createPortal(<div id="check-in-print">{poster}</div>, document.body)}
    </>}
  </>;
}

/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Thành phần giao diện (Component) report hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
function Report({ identity, path }: { identity: Identity; path: string }) {
  const [load, setLoad] = useState(0);
  const report = useResource<Row>(path, identity, load);
  return <section className={`${panel} grid gap-4`} aria-label="Báo cáo sự kiện">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="font-display text-2xl text-plum">Báo cáo sự kiện</h3>
      <button className={secondary} disabled={report.loading} onClick={() => setLoad((value) => value + 1)}>{report.loading ? "Đang tải…" : "Cập nhật báo cáo"}</button>
    </div>
    {report.error && <ErrorMessage message={report.error} />}
    {report.data && <Details data={report.data} columns={[["approvedBudget", "Ngân sách đã duyệt", amount], ["estimatedBudget", "Ngân sách dự kiến", amount],
      ["totalActualExpense", "Tổng chi thực tế", amount], ["budgetVariance", "Chênh lệch ngân sách", amount], ["targetAttendees", "Số khách mục tiêu"],
      ["actualAttendees", "Số khách đã check-in"], ["attendanceRate", "Tỷ lệ tham gia (%)"], ["roiPercentage", "ROI (%)"],
      ["roiStatus", "Trạng thái ROI", (value) => value === "PENDING_REVENUE" ? "Chưa có doanh thu để tính ROI" : "Chưa đủ dữ liệu"]]} />}
  </section>;
}
