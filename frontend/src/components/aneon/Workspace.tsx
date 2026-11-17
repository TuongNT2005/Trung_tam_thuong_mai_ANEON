"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkInStatusText, formatDate, localIdentityEnabled, request, toOptionRecord, UUID_PATTERN, type CheckInContext, type Identity, type OptionItem } from "@/lib/aneon-api";
import { CustomerPicker, type CustomerMatch } from "./CustomerPicker";
import { EventsWorkspace } from "./EventsWorkspace";
import { IdentityForm, staffRoles } from "./IdentityForm";
import { FloorPlansView } from "./FloorPlans";
import { PremisesWorkspace, type PremisesView } from "./PremisesWorkspace";
import { PromotionsWorkspace } from "./PromotionsWorkspace";
import { ReferenceProvider, useReferences } from "./ReferenceContext";
import { ErrorMessage, Field, input, panel, primary, secondary } from "./Ui";
import { allowed, selectOptions, useResource } from "./WorkspaceUi";

type View = PremisesView | "floorplans" | "events" | "promotions" | "vouchers" | "assist";
const staffReaders = ["MANAGEMENT", "OPERATIONS", "DIRECTOR", "ACCOUNTING", "SYSTEM_ADMIN"];
const views: { id: View; label: string; group: "F01" | "F10"; roles: string[] }[] = [
  { id: "premises", label: "Mặt bằng", group: "F01", roles: staffReaders },
  { id: "stores", label: "Cửa hàng / sạp", group: "F01", roles: staffReaders },
  { id: "floorplans", label: "Bản vẽ các tầng", group: "F01", roles: staffReaders },
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

function AssistCheckIn({ identity, initialEvent }: { identity: Identity; initialEvent?: string }) {
  const [selectedEventId, setSelectedEventId] = useState(initialEvent ?? "");
  const [customer, setCustomer] = useState<CustomerMatch>();
  const [focusSearch, setFocusSearch] = useState(false);
  const [pickerRevision, setPickerRevision] = useState(0);
  const [eventsRevision, setEventsRevision] = useState(0);
  const [revision, setRevision] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ checkInAt: string; duplicate: boolean }>();
  const [error, setError] = useState("");
  const context = useResource<CheckInContext>(
    selectedEventId ? `f10/events/${selectedEventId}/check-in-status` : undefined, identity, revision
  );
  const events = useResource<OptionItem[]>("shared/check-in-events", identity, eventsRevision);
  const eventOptions = toOptionRecord(events.data);
  const linkedEvent = selectedEventId && !eventOptions[selectedEventId] ? selectedEventId : undefined;

  function nextCustomer(focus = false) {
    setCustomer(undefined);
    setFocusSearch(focus);
    setResult(undefined);
    setError("");
    setPickerRevision((value) => value + 1);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (context.data?.state !== "READY" || !customer || submitting || result) return;
    setSubmitting(true);
    setError("");
    setResult(undefined);
    try {
      setResult(await request(`f10/events/${selectedEventId}/check-ins`, {
        identity, method: "POST", body: { customerId: customer.id },
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return <div className={`${panel} grid max-w-2xl gap-5`}>
    <p className="text-sm text-ink-soft">Chọn sự kiện, hỏi số điện thoại hoặc thẻ thành viên rồi đối chiếu thông tin trước khi xác nhận.</p>
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Sự kiện">
        <select className={input} required disabled={submitting} value={selectedEventId} onChange={(event) => {
          setSelectedEventId(event.target.value);
          nextCustomer();
        }}>
          <option value="">{events.loading ? "Đang tải sự kiện…" : "— Chọn sự kiện —"}</option>
          {linkedEvent && <option value={linkedEvent}>{context.data?.name ?? "Sự kiện được bàn giao"}</option>}
          {selectOptions(eventOptions)}
        </select>
      </Field>
      {events.error && <div className="flex flex-wrap items-center gap-2"><ErrorMessage message={events.error} />
        <button type="button" className={secondary} onClick={() => setEventsRevision((value) => value + 1)}>Tải lại danh sách sự kiện</button></div>}
      {events.data?.length === 0 && !selectedEventId && <p className="text-sm text-ink-soft">Chưa có sự kiện phù hợp để hỗ trợ check-in.</p>}
      {context.loading && <p role="status" className="text-sm text-ink-soft">Đang kiểm tra trạng thái sự kiện…</p>}
      {context.error && <ErrorMessage message={context.error} />}
      {context.data && <p role="status" className="rounded-lg bg-cream p-3 text-sm">{checkInStatusText(context.data)}</p>}
      {selectedEventId && !context.loading && (context.data?.state !== "READY" || error) &&
        <button type="button" className={`${secondary} justify-self-start`} onClick={() => {
          nextCustomer();
          setRevision((value) => value + 1);
        }}>Kiểm tra lại trạng thái sự kiện</button>}
      {context.data?.state === "READY" && !result && <fieldset disabled={submitting} className="grid min-w-0 gap-4">
        <legend className="sr-only">Khách cần hỗ trợ</legend>
        <CustomerPicker key={`${selectedEventId}-${pickerRevision}`} identity={identity}
          path={`f10/events/${selectedEventId}/check-in-customers`} focusSearch={focusSearch}
          onSelect={(match) => { setCustomer(match); setError(""); }} />
        {customer && <button type="submit" disabled={submitting} className={`${primary} justify-self-start`}>
          {submitting ? "Đang xử lý…" : "Xác nhận check-in cho khách"}
        </button>}
      </fieldset>}
      {error && <ErrorMessage message={error} />}
      {result && customer && <>
        <div role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-900">
          <p className="font-semibold">{result.duplicate ? "Khách đã check-in trước đó" : "Check-in thành công"}</p>
          <p className="mt-1">{customer.name} · {formatDate(result.checkInAt)}</p>
        </div>
        <button type="button" className={`${primary} justify-self-start`} onClick={() => nextCustomer(true)}>Check-in khách tiếp theo</button>
      </>}
    </form>
  </div>;
}

const sessionKey = "aneon-local-staff";
const uuid = new RegExp(`^${UUID_PATTERN}$`);

function ReferenceErrors() {
  const { error, refresh } = useReferences();
  return error ? <div className="flex flex-wrap items-center gap-3"><ErrorMessage message={error} />
    <button className={secondary} onClick={refresh}>Tải lại danh mục</button></div> : null;
}

function WorkspaceDashboard({ identity, onDisconnect }: { identity: Identity; onDisconnect: () => void }) {
  const router = useRouter();
  const params = useSearchParams();
  const view = params.get("view") ?? (params.has("event") ? "events" : undefined);
  const eventParam = params.get("event");
  const eventId = eventParam && uuid.test(eventParam) ? eventParam : undefined;
  const available = views.filter(({ roles }) => allowed(identity, ...roles));
  const current = available.find(({ id }) => id === view) ?? available[0];
  const role = identity.mode === "local" ? staffRoles[identity.role as keyof typeof staffRoles] : undefined;
  const premise = params.get("premise");
  const historyCode = params.get("code");
  const historyType = params.get("targetType");
  const recordParam = params.get("record");
  const recordId = (current?.id === "premises" || current?.id === "stores") && recordParam && uuid.test(recordParam)
    ? recordParam : undefined;
  const premiseFilters: Record<string, string> | undefined = current?.id === "stores" && premise && uuid.test(premise) ? { premiseId: premise }
    : current?.id === "histories" && historyCode ? { targetCode: historyCode, targetType: historyType ?? "" } : undefined;

  function openView(nextView: View, nextEvent?: string) {
    const search = new URLSearchParams({ view: nextView });
    if (nextEvent) search.set("event", nextEvent);
    router.push(`/quan-ly?${search}`, { scroll: false });
  }

  return <ReferenceProvider identity={identity} enabled={current?.id !== "assist"}>
    <div className="grid items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className={panel}>
        <div className="mb-5 border-b border-cream-line pb-4">
          <p className="text-sm font-semibold text-plum">{identity.mode === "local" ? identity.label || role : "Phiên dùng token"}</p>
          {role && <p className="text-xs text-ink-soft">{role} · Chế độ demo</p>}
          <button className="mt-2 text-sm font-semibold text-magenta-deep underline underline-offset-4" onClick={onDisconnect}>
            Đổi tài khoản
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
                        onClick={() => openView(id)}
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
        {view && current?.id !== view && <p className="rounded-lg bg-cream p-3 text-sm">Tài khoản hiện tại chưa có quyền mở nghiệp vụ trong liên kết.</p>}
        {current?.id !== "assist" && <ReferenceErrors />}
        {current?.id === "floorplans" && <FloorPlansView />}
        {current?.group === "F01" && current.id !== "floorplans" && <PremisesWorkspace identity={identity} view={current.id as PremisesView}
          initialFilters={premiseFilters} initialRecord={recordId}
          onCloseRecord={recordId ? () => {
            const search = new URLSearchParams(params.toString());
            search.delete("record");
            router.replace(`/quan-ly?${search}`, { scroll: false });
          } : undefined}
          key={`${current.id}-${JSON.stringify(premiseFilters)}-${recordId ?? ""}`} />}
        {current?.id === "events" && <EventsWorkspace identity={identity} selected={eventId} onSelect={(id) => openView("events", id)} />}
        {(current?.id === "promotions" || current?.id === "vouchers") && (
          <PromotionsWorkspace identity={identity} view={current.id} key={current.id} />
        )}
        {current?.id === "assist" && <AssistCheckIn key={eventId ?? "assist"} identity={identity} initialEvent={eventId} />}
      </section>
    </div>
  </ReferenceProvider>;
}

/**
 * Người phụ trách code: Kiên | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: điều hướng các phân hệ F01, F10 theo quyền và liên kết hồ sơ.
 */
export function Workspace() {
  const [identity, setIdentity] = useState<Identity>();
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (localIdentityEnabled) {
      try {
        const stored = JSON.parse(sessionStorage.getItem(sessionKey) ?? "null") as Identity | null;
        if (stored?.mode === "local" && uuid.test(stored.actorId) && Object.hasOwn(staffRoles, stored.role)) {
          setIdentity(stored);
        }
      } catch { /* The connection form is available when storage is unavailable. */ }
    }
    setRestored(true);
  }, []);

  function connect(next?: Identity) {
    try {
      if (next?.mode === "local") sessionStorage.setItem(sessionKey, JSON.stringify(next));
      else sessionStorage.removeItem(sessionKey);
    } catch { /* The current connection still works without storage. */ }
    setIdentity(next);
  }

  if (!restored) return <p role="status">Đang mở cổng quản lý…</p>;

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
            <IdentityForm onConnect={connect} />
          </div>
        </section>
      </div>
    );

  return <WorkspaceDashboard identity={identity} onDisconnect={() => connect()} />;
}
