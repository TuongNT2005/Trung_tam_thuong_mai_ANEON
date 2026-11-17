"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDate, request, type Identity } from "@/lib/aneon-api";
import { EventsWorkspace } from "./EventsWorkspace";
import { IdentityForm, staffRoles } from "./IdentityForm";
import { PremisesWorkspace, type PremisesView } from "./PremisesWorkspace";
import { PromotionsWorkspace } from "./PromotionsWorkspace";
import { ReferenceProvider, useReferences } from "./ReferenceContext";
import { ErrorMessage, Field, input, panel, primary, secondary } from "./Ui";
import { allowed, selectOptions } from "./WorkspaceUi";

type View = PremisesView | "events" | "promotions" | "vouchers" | "assist";
const staffReaders = ["MANAGEMENT", "OPERATIONS", "DIRECTOR", "ACCOUNTING", "SYSTEM_ADMIN"];
const views: { id: View; label: string; group: "F01" | "F10"; roles: string[] }[] = [
  { id: "premises", label: "Mặt bằng", group: "F01", roles: staffReaders },
  { id: "stores", label: "Cửa hàng / sạp", group: "F01", roles: staffReaders },
  { id: "utilization", label: "Tình hình khai thác", group: "F01", roles: ["MANAGEMENT", "OPERATIONS", "DIRECTOR"] },
  { id: "histories", label: "Lịch sử thay đổi", group: "F01", roles: ["MANAGEMENT", "OPERATIONS", "DIRECTOR", "SYSTEM_ADMIN"] },
  { id: "events", label: "Sự kiện", group: "F10", roles: ["MANAGEMENT", "DIRECTOR", "MARKETING", "SYSTEM_ADMIN"] },
  { id: "promotions", label: "Khuyến mãi", group: "F10", roles: ["MANAGEMENT", "DIRECTOR", "MARKETING", "OPERATIONS", "SYSTEM_ADMIN"] },
  { id: "vouchers", label: "Voucher", group: "F10", roles: ["MANAGEMENT", "OPERATIONS", "MARKETING"] },
  { id: "assist", label: "Hỗ trợ check-in", group: "F10", roles: ["OPERATIONS", "MARKETING"] },
];
const groups = { F01: "Quản lý mặt bằng", F10: "Sự kiện & khuyến mãi" } as const;
const atriumPhoto = "/aneon/mall-atrium.webp";
const eventPhoto = "/aneon/mall-event.webp";

function AssistCheckIn({ identity }: { identity: Identity }) {
  const { options } = useReferences();
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrStatus, setQrStatus] = useState<"idle" | "ready" | "none">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ checkInAt: string; duplicate: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedEventId) {
      setQrToken("");
      setQrStatus("idle");
      return;
    }
    let active = true;
    setLoadingQr(true);
    setQrStatus("idle");
    setError(null);
    setResult(null);

    request<{ token?: string; checkInUrl?: string; active?: boolean } | null>(
      `f10/events/${encodeURIComponent(selectedEventId)}/qr-code`,
      { identity }
    )
      .then((data) => {
        if (!active) return;
        if (data?.token) {
          setQrToken(data.token);
          setQrStatus("ready");
        } else if (data?.checkInUrl && data.checkInUrl.includes("token=")) {
          const extracted = data.checkInUrl.substring(data.checkInUrl.indexOf("token=") + 6).split("&")[0];
          setQrToken(extracted);
          setQrStatus("ready");
        } else {
          setQrToken("");
          setQrStatus("none");
        }
      })
      .catch(() => {
        if (!active) return;
        setQrToken("");
        setQrStatus("none");
      })
      .finally(() => {
        if (active) setLoadingQr(false);
      });

    return () => {
      active = false;
    };
  }, [selectedEventId, identity]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedEventId || !selectedCustomerId) return;
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const res = await request<{ checkInAt: string; duplicate: boolean }>(
        `f10/events/${encodeURIComponent(selectedEventId)}/check-ins`,
        {
          identity,
          method: "POST",
          body: {
            customerId: selectedCustomerId,
            qrToken: qrToken || "AUTO",
          },
        }
      );
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`${panel} grid max-w-2xl gap-5`}>
      <div>
        <h3 className="font-display text-xl font-semibold text-plum">Xác nhận check-in cho khách</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Hỗ trợ check-in sự kiện cho khách hàng không mang theo điện thoại hoặc gặp trục trặc khi quét mã QR.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="Sự kiện">
          <select
            className={input}
            required
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">— Vui lòng chọn sự kiện —</option>
            {selectOptions(options.events)}
          </select>
        </Field>

        {selectedEventId && (
          <div>
            {loadingQr ? (
              <p className="text-xs text-ink-soft">⏳ Đang tải mã QR hoạt động của sự kiện...</p>
            ) : qrStatus === "ready" ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <p className="font-semibold flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-emerald-600"></span>
                  Đã tự động liên kết mã QR đang hoạt động của sự kiện
                </p>
                <p className="mt-1 truncate font-mono text-[11px] text-emerald-700">
                  Token: {qrToken}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <p className="font-semibold">⚠️ Sự kiện này chưa có mã QR check-in hoạt động</p>
                <p className="mt-0.5 text-ink-soft">
                  Vui lòng tạo mã QR trong chi tiết sự kiện trước khi hỗ trợ check-in.
                </p>
              </div>
            )}
          </div>
        )}

        <Field label="Khách mua sắm">
          <select
            className={input}
            required
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">— Chọn khách hàng mua sắm —</option>
            {selectOptions(options.customers)}
          </select>
        </Field>

        {error && <ErrorMessage message={error} />}

        {result && (
          <div className="rounded-xl border border-cream-line bg-cream p-4 text-sm">
            <p className="font-semibold text-plum">
              {result.duplicate ? "Khách đã check-in trước đó lúc" : "Check-in thành công lúc"} {formatDate(result.checkInAt)}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedEventId || !selectedCustomerId || qrStatus === "none" || loadingQr || submitting}
          className={`${primary} justify-self-start disabled:opacity-50`}
        >
          {submitting ? "Đang xử lý…" : "Xác nhận check-in cho khách"}
        </button>
      </form>
    </div>
  );
}

function WorkspaceDashboard({ identity, onDisconnect }: { identity: Identity; onDisconnect: () => void }) {
  const [view, setView] = useState<View>();
  const available = views.filter(({ roles }) => allowed(identity, ...roles));
  const current = available.find(({ id }) => id === view) ?? available[0];
  const role = identity.mode === "local" ? staffRoles[identity.role as keyof typeof staffRoles] : undefined;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className={panel}>
        <div className="mb-5 border-b border-cream-line pb-4">
          <p className="text-sm font-semibold text-plum">{role ? `${role} · Local` : "Phiên dùng token"}</p>
          <button className="mt-2 text-sm font-semibold text-magenta-deep underline underline-offset-4" onClick={onDisconnect}>
            Kết thúc phiên
          </button>
        </div>
        <nav aria-label="Nghiệp vụ" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {(Object.keys(groups) as (keyof typeof groups)[]).map((group) => {
            const items = available.filter((item) => item.group === group);
            return (
              items.length > 0 && (
                <div key={group}>
                  <p className="mb-2 text-xs font-bold text-ink-soft">
                    {group} · {groups[group]}
                  </p>
                  <div className="grid gap-1">
                    {items.map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setView(id)}
                        aria-current={current?.id === id ? "page" : undefined}
                        className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
                          current?.id === id ? "bg-plum text-white" : "hover:bg-cream"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            );
          })}
        </nav>
      </aside>
      <section className="grid min-w-0 gap-4" aria-labelledby="view-heading">
        <header className="relative isolate flex min-h-32 items-center overflow-hidden rounded-2xl bg-plum px-5 py-6 text-white sm:px-8">
          <div className="absolute inset-y-0 right-0 -z-20 w-2/3">
            <Image
              src={current?.group === "F10" ? eventPhoto : atriumPhoto}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 67vw"
              className="object-cover object-[70%_55%]"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#3d122f_30%,#3d122fe6_49%,#3d122f29_100%)]" />
          <div>
            <p className="mb-1 text-xs font-semibold text-[#f5d9eb]">Quản lý ANEON</p>
            <h1 id="view-heading" className="font-display text-3xl leading-tight sm:text-4xl">
              {current?.label ?? "Nghiệp vụ"}
            </h1>
          </div>
        </header>
        {!current && <p className={panel}>Vai trò này chưa có quyền trên màn hình quản lý.</p>}
        {current?.group === "F01" && <PremisesWorkspace identity={identity} view={current.id as PremisesView} key={current.id} />}
        {current?.id === "events" && <EventsWorkspace identity={identity} />}
        {(current?.id === "promotions" || current?.id === "vouchers") && (
          <PromotionsWorkspace identity={identity} view={current.id} key={current.id} />
        )}
        {current?.id === "assist" && <AssistCheckIn identity={identity} />}
      </section>
    </div>
  );
}

export function Workspace() {
  const [identity, setIdentity] = useState<Identity>();

  if (!identity)
    return (
      <div className="grid overflow-hidden rounded-[1.75rem] border border-cream-line bg-white shadow-sm md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="relative isolate flex min-h-52 items-end overflow-hidden bg-plum p-6 text-white sm:min-h-64 sm:p-8 md:min-h-[33rem] lg:p-11">
          <Image
            src={atriumPhoto}
            alt=""
            fill
            priority
            unoptimized
            sizes="(min-width: 768px) 58vw, 100vw"
            className="-z-20 object-cover object-[60%_54%]"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#21111de8] via-[#35172e33] to-transparent" />
          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">Quản lý ANEON</h1>
        </div>
        <section aria-labelledby="identity-heading" className="flex items-center p-6 sm:p-8 lg:p-11">
          <div className="mx-auto w-full max-w-md">
            <h2 id="identity-heading" className="mb-2 font-display text-2xl text-plum sm:text-3xl">
              Kết nối tài khoản nhân viên
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-ink-soft">
              Dùng tài khoản được cấp quyền cho nghiệp vụ bạn phụ trách.
            </p>
            <IdentityForm onConnect={(next) => setIdentity(next)} />
          </div>
        </section>
      </div>
    );

  return (
    <ReferenceProvider identity={identity}>
      <WorkspaceDashboard identity={identity} onDisconnect={() => setIdentity(undefined)} />
    </ReferenceProvider>
  );
}
