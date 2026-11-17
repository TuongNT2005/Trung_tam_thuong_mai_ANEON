"use client";

import { useState } from "react";
import { formatDate, query, request, type Identity } from "@/lib/aneon-api";
import { ErrorMessage, Field, input, panel, primary, secondary } from "./Ui";
import { PremiseMap } from "./PremiseMap";
import { useReferences } from "./ReferenceContext";
import { Action, allowed, Control, Details, Modal, MutationForm, Records, selectOptions, useResource, type Column, type FormField, type Row } from "./WorkspaceUi";

const statuses: Record<string, string> = {
  VACANT: "Còn trống", RESERVED: "Đã giữ chỗ", LEASED: "Đã cho thuê", MAINTENANCE: "Đang bảo trì",
  SUSPENDED: "Tạm ngưng", RETIRED: "Ngừng khai thác",
};
const types = { STORE: "Cửa hàng", KIOSK: "Sạp", ADVERTISING: "Quảng cáo", EVENT_AREA: "Khu sự kiện", SERVICE_AREA: "Khu dịch vụ", OTHER: "Khác" };
const statusColumn: Column = ["status", "Trạng thái", (value) => statuses[String(value)] ?? "—"];
const status: FormField = { name: "status", label: "Trạng thái", options: statuses };
const code: FormField = {
  name: "code",
  label: "Mã",
  required: true,
  max: 50,
  pattern: "[A-Za-z0-9._\\-]+",
  placeholder: "Ví dụ: MB-A01, MB-L1-001",
  helpText: "Chữ cái, chữ số, dấu chấm (.), gạch nối (-), gạch dưới (_)",
};
const name: FormField = { name: "name", label: "Tên", required: true, max: 200, placeholder: "Ví dụ: Gian hàng A01 - Thời trang" };
const reason: FormField = { name: "reason", label: "Lý do", type: "textarea", max: 500, placeholder: "Lý do thay đổi trạng thái..." };
const description: FormField = { name: "description", label: "Mô tả", type: "textarea", max: 1000, placeholder: "Mô tả chi tiết..." };
const search: FormField = { name: "q", label: "Tên hoặc mã", max: 200, placeholder: "Tìm theo tên hoặc mã..." };
const premiseColumns: Column[] = [["code", "Mã"], ["name", "Mặt bằng"], ["zoneName", "Khu vực"], ["floorName", "Tầng"], ["totalArea", "Diện tích (m²)"], statusColumn];
const storeColumns: Column[] = [["code", "Mã"], ["name", "Cửa hàng"], ["premiseCode", "Mã mặt bằng"], ["categoryName", "Ngành hàng"], ["area", "Diện tích (m²)"], statusColumn];
const historyTargets: Record<string, string> = { MAT_BANG: "Mặt bằng", CUA_HANG: "Cửa hàng" };
const historyActions: Record<string, string> = {
  CREATE: "Tạo mới", UPDATE: "Sửa thông tin", UPDATE_LOCATION: "Đổi vị trí",
  UPDATE_STATUS: "Đổi trạng thái", SYNC_STATUS: "Đồng bộ hợp đồng",
};

function historySnapshot(value: unknown) {
  if (typeof value !== "string" || !value) return "—";
  let formatted = value;
  try { formatted = JSON.stringify(JSON.parse(value), null, 2); } catch { /* Dữ liệu lịch sử cũ. */ }
  return <details>
    <summary className="cursor-pointer whitespace-nowrap text-magenta-deep">Xem dữ liệu</summary>
    <pre className="mt-2 max-h-56 max-w-72 overflow-auto rounded bg-cream p-2 text-xs whitespace-pre-wrap wrap-break-word">{formatted}</pre>
  </details>;
}

const historyColumns: Column[] = [
  ["createdAt", "Thời điểm", (value) => formatDate(value as string)],
  ["action", "Thao tác", (value) => historyActions[String(value)] ?? String(value)],
  ["changedBy", "Người thao tác"], ["reason", "Lý do"],
  ["oldValueJson", "Trước thay đổi", historySnapshot], ["newValueJson", "Sau thay đổi", historySnapshot],
];

export type PremisesView = "premises" | "stores" | "utilization" | "histories";

export function PremisesWorkspace({ view, identity }: { view: PremisesView; identity: Identity }) {
  const { options: refOptions, refresh: refreshRef } = useReferences();
  const [selected, setSelected] = useState<string>();
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState("");
  const path = `f01/${view}`;
  const isStore = view === "stores";
  const columns = isStore ? storeColumns : premiseColumns;
  const detailPath = selected ? `${path}/${selected}` : undefined;
  const detail = useResource<Row>(detailPath, identity, revision);
  const tenants = useResource<{ id: string; code: string; name: string }[]>(isStore && detailPath ? `${detailPath}/tenants` : undefined, identity, revision);
  const canWrite = allowed(identity, "MANAGEMENT");
  const canChangeStatus = isStore ? canWrite : allowed(identity, "MANAGEMENT", "OPERATIONS");

  const zoneField: FormField = { name: "zoneId", label: "Khu vực", type: "uuid", options: refOptions.zones };
  const locationField: FormField = { name: "locationId", label: "Vị trí", type: "uuid", options: refOptions.locations };
  const premiseField: FormField = { name: "premiseId", label: "Mặt bằng", type: "uuid", options: refOptions.premises };
  const categoryField: FormField = { name: "categoryId", label: "Ngành hàng", type: "uuid", options: refOptions.categories };

  const premiseFields: FormField[] = [
    { ...name, placeholder: "Ví dụ: Gian hàng góc A01 - Tầng 1" },
    { ...zoneField, required: true },
    { name: "totalArea", label: "Tổng diện tích (m²)", type: "number", min: 0.01, step: "0.01", required: true, placeholder: "Ví dụ: 45.5" },
    { name: "type", label: "Loại mặt bằng", options: types },
    description,
  ];

  const storeFields: FormField[] = [
    { ...name, placeholder: "Ví dụ: Highlands Coffee ANEON" },
    { ...premiseField, required: true },
    { name: "area", label: "Diện tích (m²)", type: "number", min: 0.01, step: "0.01", required: true, placeholder: "Ví dụ: 45.5" },
    categoryField,
    locationField,
    { name: "operatingHours", label: "Giờ hoạt động", max: 200, placeholder: "Ví dụ: 08:00 - 22:00 hàng ngày" },
    description,
    { name: "publicVisible", label: "Cho phép hiển thị công khai", type: "checkbox" },
  ];

  function saved() {
    setNotice("Đã lưu thay đổi.");
    setRevision((value) => value + 1);
    refreshRef();
  }

  if (view === "utilization") return <Records identity={identity} path={path} revision={0}
    filters={[zoneField, { name: "floorId", label: "Tầng", type: "uuid", options: refOptions.floors }, status]}
    columns={[...premiseColumns, ["allocatedArea", "Đã phân bổ (m²)"]]}
    extra={(page) => page.summary ? <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Object.entries({ total: "Tổng mặt bằng", occupied: "Đã cho thuê", vacant: "Còn trống", maintenance: "Đang bảo trì" }).map(([key, label]) => (
        <div key={key} className="rounded-xl bg-cream px-4 py-3"><p className="text-xs font-semibold text-ink-soft">{label}</p><p className="mt-1 font-display text-3xl text-plum">{String((page.summary as Row)[key])}</p></div>
      ))}
    </div> : null} />;

  if (view === "histories") return <Records identity={identity} path={path} revision={0}
    filters={[{ name: "targetCode", label: "Mã mặt bằng / cửa hàng", max: 50, placeholder: "Ví dụ: MB-A01, CH-001" }, { name: "targetType", label: "Đối tượng", options: historyTargets },
      { name: "action", label: "Loại thay đổi", options: historyActions }, { name: "changedBy", label: "Người thao tác", type: "uuid", options: refOptions.staff },
      { name: "from", label: "Từ ngày", type: "date" }, { name: "to", label: "Đến ngày", type: "date" }]}
    columns={[["targetType", "Đối tượng", (value) => historyTargets[String(value)] ?? String(value)], ["targetId", "Mã đối tượng"], ...historyColumns]} />;

  return <div className="grid gap-5">
    {notice && <p role="status" className="text-sm font-semibold text-green-800">{notice}</p>}
    {canWrite && <div className={panel}>
      <Action title={isStore ? "Thêm cửa hàng / sạp" : "Thêm mặt bằng"}>
        {!isStore && <CodeCheck identity={identity} />}
        {isStore ? (
          <MutationForm path={path} identity={identity} label="Tạo cửa hàng"
            fields={[
              { ...code, label: "Mã cửa hàng / sạp", placeholder: "Ví dụ: CH-A01, CH-HIGHLANDS" },
              ...storeFields,
              { ...status, required: true }
            ]}
            defaults={{ status: "VACANT" }} onSaved={saved} />
        ) : (
          <CreatePremiseForm identity={identity} onSaved={saved} />
        )}
      </Action>
    </div>}
    <Records path={path} identity={identity} revision={revision} columns={columns}
      filters={[search, isStore ? premiseField : zoneField, status]}
      onSelect={(id) => { setSelected(id); setNotice(""); }} />
    {detailPath && (
      <Modal
        open={!!detailPath}
        onClose={() => setSelected(undefined)}
        title={String(detail.data?.name ?? "Chi tiết bản ghi")}
        maxWidth="max-w-4xl"
      >
        <div className="grid gap-5">
          {detail.loading && <p role="status">Đang tải chi tiết…</p>}
          {detail.error && (
            <>
              <ErrorMessage message={detail.error} />
              <button className={`${secondary} justify-self-start`} onClick={() => setRevision((value) => value + 1)}>
                Tải lại
              </button>
            </>
          )}
          {detail.data && (
            <>
              <Details
                data={detail.data}
                columns={[
                  ["id", "Mã hệ thống (ID)"],
                  ...columns,
                  ["locationDescription", "Vị trí"],
                  ["description", "Mô tả"],
                  ...(isStore
                    ? ([["operatingHours", "Giờ hoạt động"], ["publicVisible", "Công khai"]] as Column[])
                    : ([["allocatedArea", "Đã phân bổ (m²)"]] as Column[])),
                ]}
              />
              {isStore && (
                <div className="grid gap-2 text-sm">
                  <h4 className="font-semibold text-plum">Khách thuê hiện tại</h4>
                  {tenants.loading && <p role="status">Đang tải khách thuê…</p>}
                  {tenants.error && <ErrorMessage message={tenants.error} />}
                  {tenants.data?.length === 0 && <p className="text-ink-soft">Chưa có khách thuê đang liên kết.</p>}
                  {tenants.data && tenants.data.length > 0 && (
                    <ul className="list-disc pl-5">
                      {tenants.data.map((tenant) => (
                        <li key={tenant.id}>
                          {tenant.name} ({tenant.code})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <button className={secondary} onClick={() => setRevision((value) => value + 1)}>
                  Tải lại chi tiết
                </button>
              </div>

              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {canWrite && (
                  <Action title="Chỉnh sửa thông tin">
                    <MutationForm
                      key={`${detailPath}-${revision}`}
                      path={detailPath}
                      method="PUT"
                      identity={identity}
                      label="Lưu chỉnh sửa"
                      fields={isStore ? storeFields : premiseFields}
                      defaults={detail.data}
                      build={(body) => ({ ...body, version: detail.data?.version })}
                      onSaved={saved}
                    />
                  </Action>
                )}
                {canChangeStatus && detail.data.status !== "RETIRED" && (
                  <Action title="Đổi trạng thái">
                    <MutationForm
                      path={`${detailPath}/status`}
                      method="PATCH"
                      identity={identity}
                      label="Cập nhật trạng thái"
                      fields={[
                        {
                          ...status,
                          required: true,
                          options: Object.fromEntries(
                            Object.entries(statuses).filter(([key]) => key !== detail.data?.status)
                          ),
                        },
                        reason,
                      ]}
                      build={(body) => ({ ...body, version: detail.data?.version })}
                      onSaved={saved}
                    />
                  </Action>
                )}
                {canWrite && !isStore && (
                  <Action title="Gắn vị trí mặt bằng">
                    <PremiseMap
                      key={`${detailPath}-premise-map`}
                      path={detailPath}
                      identity={identity}
                      currentId={detail.data.locationId}
                      onSaved={saved}
                    />
                  </Action>
                )}
                {canChangeStatus && !isStore && (
                  <Action title="Đồng bộ trạng thái theo hợp đồng">
                    <MutationForm
                      path={`${detailPath}/sync-contract-status`}
                      identity={identity}
                      label="Đồng bộ hợp đồng"
                      fields={[
                        {
                          name: "contractId",
                          label: "Mã/Số hợp đồng",
                          type: "uuid",
                          required: true,
                          options: refOptions.contracts,
                        },
                      ]}
                      onSaved={saved}
                    />
                  </Action>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    )}
  </div>;
}

function CodeCheck({ identity }: { identity: Identity }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return <form className="mt-4 grid gap-2 rounded-xl bg-cream p-3" onSubmit={async (event) => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("code")).trim();
    setBusy(true); setError(""); setMessage("");
    try {
      const data = await request<{ available: boolean; code: string }>(`f01/premises/code-availability?${query({ code: value })}`, { identity });
      setMessage(data.available ? `Có thể dùng mã ${data.code}.` : `Mã ${data.code} đã được sử dụng.`);
    } catch (err) {
      setError((err as Error).message);
    } finally { setBusy(false); }
  }}>
    <Control field={{ ...code, label: "Kiểm tra mã mặt bằng" }} />
    <button className={`${secondary} justify-self-start`} disabled={busy} type="submit">Kiểm tra mã</button>
    {message && <p role="status" className="text-sm">{message}</p>}{error && <ErrorMessage message={error} />}
  </form>;
}

function CreatePremiseForm({ identity, onSaved }: { identity: Identity; onSaved: () => void }) {
  const { options: refOptions, raw } = useReferences();
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [codeValue, setCodeValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [totalAreaValue, setTotalAreaValue] = useState("");
  const [typeValue, setTypeValue] = useState("STORE");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [statusValue, setStatusValue] = useState("VACANT");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Row>();

  // Filter locations by selectedZoneId
  const availableLocations = (raw?.locations ?? []).filter((loc) => loc.zoneId === selectedZoneId);

  const handleZoneChange = (newZoneId: string) => {
    setSelectedZoneId(newZoneId);
    const locs = (raw?.locations ?? []).filter((loc) => loc.zoneId === newZoneId);
    if (locs.length > 0) {
      setSelectedLocationId(locs[0].id);
    } else {
      setSelectedLocationId("");
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setResult(undefined);
    try {
      if (!codeValue.trim() || !nameValue.trim() || !selectedZoneId || !totalAreaValue) {
        throw new Error("Vui lòng điền đủ các trường bắt buộc.");
      }
      const numArea = Number(totalAreaValue);
      if (isNaN(numArea) || numArea <= 0) {
        throw new Error("Tổng diện tích phải là số lớn hơn 0.");
      }
      const body = {
        code: codeValue.trim(),
        name: nameValue.trim(),
        zoneId: selectedZoneId,
        totalArea: numArea,
        type: typeValue || undefined,
        description: descriptionValue.trim() || undefined,
        locationId: selectedLocationId || undefined,
        status: statusValue,
      };
      const saved = await request<Row>("f01/premises", { identity, method: "POST", body });
      setResult(saved);
      setCodeValue("");
      setNameValue("");
      setTotalAreaValue("");
      setDescriptionValue("");
      setSelectedZoneId("");
      setSelectedLocationId("");
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={handleSubmit} aria-busy={busy}>
      <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
        <Field label="Mã mặt bằng">
          <input
            name="code"
            required
            className={input}
            pattern="[A-Za-z0-9._\-]+"
            maxLength={50}
            placeholder="Ví dụ: MB-A01, MB-L1-001"
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
          />
          <span className="font-normal text-xs text-ink-soft">Chữ cái, chữ số, dấu chấm (.), gạch nối (-), gạch dưới (_)</span>
        </Field>

        <Field label="Tên">
          <input
            name="name"
            required
            className={input}
            maxLength={200}
            placeholder="Ví dụ: Gian hàng góc A01 - Tầng 1"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </Field>

        <Field label="Khu vực">
          <select
            name="zoneId"
            required
            className={input}
            value={selectedZoneId}
            onChange={(e) => handleZoneChange(e.target.value)}
          >
            <option value="" disabled>— Vui lòng chọn khu vực —</option>
            {selectOptions(refOptions.zones)}
          </select>
        </Field>

        <Field label="Tổng diện tích (m²)">
          <input
            name="totalArea"
            type="number"
            min={0.01}
            step="0.01"
            required
            className={input}
            placeholder="Ví dụ: 45.5"
            value={totalAreaValue}
            onChange={(e) => setTotalAreaValue(e.target.value)}
          />
        </Field>

        <Field label="Loại mặt bằng">
          <select
            name="type"
            className={input}
            value={typeValue}
            onChange={(e) => setTypeValue(e.target.value)}
          >
            {selectOptions(types)}
          </select>
        </Field>

        <Field label="Mô tả">
          <textarea
            name="description"
            className={input}
            maxLength={1000}
            rows={3}
            placeholder="Mô tả chi tiết..."
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
          />
        </Field>

        <Field label="Vị trí">
          <select
            name="locationId"
            className={input}
            value={selectedLocationId}
            disabled={!selectedZoneId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
          >
            {!selectedZoneId ? (
              <option value="">— Vui lòng chọn khu vực trước —</option>
            ) : availableLocations.length === 0 ? (
              <option value="">(Khu vực này chưa có vị trí — để trống)</option>
            ) : (
              <>
                <option value="">— Không chọn vị trí —</option>
                {availableLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label}
                  </option>
                ))}
              </>
            )}
          </select>
          {selectedZoneId && availableLocations.length > 0 && (
            <span className="font-normal text-xs text-ink-soft">
              Đã tự động lọc vị trí theo khu vực và chọn vị trí tương ứng.
            </span>
          )}
        </Field>

        <Field label="Trạng thái">
          <select
            name="status"
            required
            className={input}
            value={statusValue}
            onChange={(e) => setStatusValue(e.target.value)}
          >
            {selectOptions(statuses)}
          </select>
        </Field>
      </fieldset>

      <button type="submit" disabled={busy} className={`${primary} justify-self-start`}>
        {busy ? "Đang xử lý…" : "Tạo mặt bằng"}
      </button>

      {error && <ErrorMessage message={error} />}
      {result && (
        <div role="status" className="grid gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Đã tạo mặt bằng {String(result.code ?? "")} thành công.</p>
        </div>
      )}
    </form>
  );
}
