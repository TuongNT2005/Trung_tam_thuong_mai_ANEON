"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { checkInStatusText, formatDate, request, UUID_PATTERN, type CheckInContext } from "@/lib/aneon-api";
import { IdentityForm, useCustomerIdentity } from "./IdentityForm";
import { ErrorMessage, panel, primary, secondary } from "./Ui";

type CheckInResult = { checkInAt: string; duplicate: boolean };
const uuid = new RegExp(`^${UUID_PATTERN}$`);

/**
 * Người phụ trách code: Khải | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: để khách mở QR, xác nhận sự kiện và tự check-in.
 */
export function CheckIn({ eventId, token }: { eventId: string; token: string }) {
  const { identity, connect, restored } = useCustomerIdentity();
  const [context, setContext] = useState<CheckInContext>();
  const [result, setResult] = useState<CheckInResult>();
  const [previewError, setPreviewError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [revision, setRevision] = useState(0);
  const hasLink = Boolean(eventId || token);
  const validLink = uuid.test(eventId) && token.length > 0 && token.length <= 200;

  useEffect(() => {
    if (!validLink) return;
    const controller = new AbortController();
    setChecking(true);
    setPreviewError("");
    request<CheckInContext>(`public/events/${eventId}/check-in-preview`, {
      method: "POST", body: { qrToken: token }, signal: controller.signal,
    }).then((data) => { if (!controller.signal.aborted) setContext(data); })
      .catch((err: Error) => {
        if (!controller.signal.aborted) {
          setContext(undefined);
          setPreviewError(err.message);
        }
      }).finally(() => { if (!controller.signal.aborted) setChecking(false); });
    return () => controller.abort();
  }, [eventId, revision, token, validLink]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identity || busy || context?.state !== "READY" || checking) return;
    setBusy(true);
    setError("");
    try {
      setResult(await request<CheckInResult>(`f10/events/${eventId}/check-ins`, {
        identity, method: "POST", body: { qrToken: token },
      }));
    } catch (err) {
      setError((err as Error).message);
      setRevision((value) => value + 1);
    } finally {
      setBusy(false);
    }
  }

  return <div className={`${panel} grid gap-5`}>
    {!validLink && <>
      {hasLink && <ErrorMessage message="Liên kết check-in bị thiếu thông tin. Hãy quét lại mã QR ở lối vào sự kiện." />}
      <h2 className="font-display text-2xl text-plum">Check-in tại lối vào sự kiện</h2>
      <ol className="grid list-decimal gap-2 pl-5 text-sm text-ink">
        <li>Tìm bảng <strong>Quét để check-in</strong> ở lối vào địa điểm tổ chức.</li>
        <li>Mở Camera trên điện thoại, hướng vào QR và chạm vào thông báo hiện ra.</li>
        <li>Kiểm tra tên sự kiện rồi bấm <strong>Xác nhận check-in</strong>.</li>
      </ol>
      <p className="rounded-xl bg-cream p-4 text-sm text-ink-soft">Không quét được hoặc không có điện thoại? Đến quầy đón khách và cung cấp số điện thoại đã đăng ký hoặc thẻ thành viên để nhân viên hỗ trợ. Nếu ban tổ chức đã gửi liên kết, bạn có thể mở trực tiếp.</p>
      <Link className={`${secondary} justify-self-start`} href="/kham-pha?danh-muc=EVENT">Tìm địa điểm sự kiện</Link>
    </>}
    {validLink && !context && !previewError && <p role="status">Đang kiểm tra mã QR…</p>}
    {previewError && <div className="grid gap-3"><ErrorMessage message={previewError} />
      <p className="text-sm text-ink-soft">Quét lại QR đang được trưng bày ở lối vào hoặc nhờ nhân viên tại quầy đón khách.</p>
      <button className={`${secondary} justify-self-start`} onClick={() => setRevision((value) => value + 1)}>Thử lại</button></div>}
    {context && <div className="rounded-xl bg-cream p-4">
      <h2 className="font-display text-2xl text-plum">{context.name}</h2>
      {context.location && <p className="mt-1 text-sm text-ink-soft">{context.location}</p>}
      {!result && <p className="mt-1 text-sm text-ink-soft" role="status">{checking ? "Đang kiểm tra mã…" : checkInStatusText(context)}</p>}
      {!checking && context.state === "UPCOMING" && <button type="button" className={`${secondary} mt-3`} onClick={() => setRevision((value) => value + 1)}>Kiểm tra lại giờ mở</button>}
    </div>}
    {error && validLink && <ErrorMessage message={error} />}
    {context?.state === "READY" && restored && !identity && !checking && <IdentityForm customer onConnect={connect} />}
    {context?.state === "READY" && identity && !result && <form className="grid gap-4" onSubmit={submit}>
      {identity.mode === "local" && identity.label && <p className="text-sm">Tài khoản · {identity.label}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className={primary} disabled={busy || checking}>{busy ? "Đang xác nhận…" : "Xác nhận check-in"}</button>
        <button type="button" className={secondary} disabled={busy} onClick={() => { connect(); setError(""); }}>Đổi tài khoản</button>
      </div>
    </form>}
    {result && <>
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-950">
        <p className="font-semibold">{result.duplicate ? "Bạn đã check-in sự kiện này" : "Check-in thành công"}</p>
        <p className="mt-1 text-sm">{formatDate(result.checkInAt)}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link className={secondary} href="/kham-pha?danh-muc=EVENT">Khám phá sự kiện</Link>
        <Link className={secondary} href="/voucher-cua-toi">Voucher của tôi</Link>
      </div>
    </>}
  </div>;
}
