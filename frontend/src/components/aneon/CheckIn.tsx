"use client";

import { useState, type FormEvent } from "react";
import { formatDate, request, UUID_PATTERN, type Identity } from "@/lib/aneon-api";
import { IdentityForm } from "./IdentityForm";
import { ErrorMessage, Field, input, panel, primary, secondary } from "./Ui";

type CheckInResult = { checkInAt: string; duplicate: boolean };

export function CheckIn({ eventId, token }: { eventId: string; token: string }) {
  const [identity, setIdentity] = useState<Identity>();
  const [result, setResult] = useState<CheckInResult>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identity || busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      setResult(await request<CheckInResult>(`f10/events/${encodeURIComponent(String(form.get("eventId")).trim())}/check-ins`, {
        identity, method: "POST", body: { qrToken: String(form.get("qrToken")).trim() },
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`${panel} grid gap-5`}>
      {!identity && <IdentityForm customer onConnect={setIdentity} />}
      {identity && !result && <form className="grid gap-4" onSubmit={submit}>
        {eventId && token ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-emerald-600"></span>
              Đã nhận diện mã QR sự kiện hợp lệ
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              Tài khoản khách: <span className="font-semibold text-plum">{identity.mode === "local" ? identity.actorId : "Token"}</span>
            </p>
            <input type="hidden" name="eventId" value={eventId} />
            <input type="hidden" name="qrToken" value={token} />
          </div>
        ) : (
          <>
            <Field label="UUID sự kiện"><input name="eventId" defaultValue={eventId} required pattern={UUID_PATTERN} className={input} placeholder="Ví dụ: a0000000-0000-4000-8000-000000000001" /></Field>
            <Field label="Mã từ liên kết check-in"><input name="qrToken" type="password" defaultValue={token} required maxLength={200} autoComplete="off" className={input} placeholder="Dán mã token check-in từ mã QR" /></Field>
          </>
        )}
        {error && <ErrorMessage message={error} />}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={primary} disabled={busy}>{busy ? "Đang xác nhận…" : "Xác nhận check-in"}</button>
          <button type="button" className={secondary} disabled={busy} onClick={() => { setIdentity(undefined); setError(""); }}>Đổi tài khoản</button>
        </div>
      </form>}
      {result && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-950">
        <p className="font-semibold">{result.duplicate ? "Bạn đã check-in sự kiện này" : "Check-in thành công"}</p>
        <p className="mt-1 text-sm">{formatDate(result.checkInAt)}</p>
      </div>}
    </div>
  );
}
