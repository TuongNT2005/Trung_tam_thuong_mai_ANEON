"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { query, request, UUID_PATTERN, type Identity, type Page } from "@/lib/aneon-api";
import { ErrorMessage, Field, input, Pagination, panel, primary, secondary } from "./Ui";

export type Row = Record<string, unknown>;
export type Column = [name: string, label: string, format?: (value: unknown) => ReactNode];
export type FormField = {
  name: string; label: string; type?: "uuid" | "number" | "date" | "datetime-local" | "textarea" | "checkbox" | "list";
  options?: Record<string, string>; required?: boolean; min?: number; max?: number; step?: string; pattern?: string;
  placeholder?: string; helpText?: string; autoUpper?: boolean;
};

export function allowed(identity: Identity, ...roles: string[]) {
  return identity.mode === "jwt" || roles.includes(identity.role);
}

export function selectOptions(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => <option key={value} value={value}>{label}</option>);
}

export function display(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (Array.isArray(value)) return value.join(", ") || "—";
  return String(value);
}

export function Details({ data, columns }: { data: Row; columns: Column[] }) {
  return <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
    {columns.map(([key, label, format]) => <div key={key} className="min-w-0 border-b border-cream-line pb-2">
      <dt className="text-xs font-semibold text-ink-soft">{label}</dt>
      <dd className="mt-1 text-sm wrap-break-word">{format ? format(data[key]) : display(data[key])}</dd>
    </div>)}
  </dl>;
}

export function useResource<T>(path: string | undefined, identity: Identity, revision = 0) {
  const [result, setResult] = useState<{ path: string; revision: number; data?: T; error?: string }>();
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    request<T>(path, { identity, signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setResult({ path, revision, data }); })
      .catch((err: Error) => { if (!controller.signal.aborted) setResult({ path, revision, error: err.message }); });
    return () => controller.abort();
  }, [path, identity, revision]);
  const current = result?.path === path && result?.revision === revision ? result : undefined;
  return { data: current?.data, error: current?.error, loading: Boolean(path && !current) };
}

export function Records({ path, identity, revision, columns, filters, onSelect, extra }: {
  path: string; identity: Identity; revision: number; columns: Column[]; filters: FormField[];
  onSelect?: (id: string) => void; extra?: (data: Page<Row> & Row) => ReactNode;
}) {
  const [params, setParams] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [retry, setRetry] = useState(0);
  const { data, error, loading } = useResource<Page<Row> & Row>(`${path}?${query({ ...params, page, size: 10 })}`, identity, revision + retry);
  return <div className={`${panel} grid gap-5`}>
    <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => {
      event.preventDefault();
      setPage(0);
      setParams(Object.fromEntries(Array.from(new FormData(event.currentTarget), ([name, value]) => [name, String(value).trim()])));
      setRetry((value) => value + 1);
    }}>
      {filters.map((field) => <div className="min-w-40 flex-1" key={field.name}><Control field={field} /></div>)}
      <button className={primary} type="submit">Lọc kết quả</button>
    </form>
    {loading && <p role="status" className="text-sm text-ink-soft">Đang tải dữ liệu…</p>}
    {error && <div className="flex flex-wrap items-center gap-3"><ErrorMessage message={error} /><button className={secondary} onClick={() => setRetry((value) => value + 1)}>Thử lại</button></div>}
    {data && <>
      {extra?.(data)}
      <p role="status" className="text-sm text-ink-soft">{data.totalElements} kết quả</p>
      {data.content.length > 0 ? <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-cream text-ink-soft"><tr>{columns.map(([key, label]) => <th key={key} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}{onSelect && <th scope="col" className="px-3 py-3">Thao tác</th>}</tr></thead>
          <tbody>{data.content.map((record, index) => <tr key={String(record.id ?? index)} className="border-b border-cream-line">
            {columns.map(([key, , format]) => <td key={key} className="max-w-72 px-3 py-3 wrap-break-word">{format ? format(record[key]) : display(record[key])}</td>)}
            {onSelect && <td className="px-3 py-3"><button className="whitespace-nowrap font-semibold text-magenta-deep underline-offset-4 hover:underline" onClick={() => onSelect(String(record.id))} aria-label={`Xem chi tiết ${record.name ?? record.code}`}>Chi tiết</button></td>}
          </tr>)}</tbody>
        </table>
      </div> : <p className="text-sm text-ink-soft">Không có bản ghi phù hợp.</p>}
      <Pagination page={data.page} size={data.size} total={data.totalElements} onPage={setPage} />
    </>}
  </div>;
}

export function Control({ field, value, onChange }: { field: FormField; value?: unknown; onChange?: (value: string) => void }) {
  const { name, label, type, options, required, min, max, step, pattern } = field;
  if (type === "checkbox") return <label className="flex items-center gap-2 self-center text-sm font-semibold">
    <input name={name} type="checkbox" defaultChecked={value === true} className="size-4 accent-magenta-deep" />{label}
  </label>;

  if (options && type === "list") {
    return <MultiSelectCheckboxField field={field} value={value} onChange={onChange} />;
  }

  const defaults = {
    name,
    className: input,
    required,
    defaultValue: value === undefined || value === null ? "" : String(value),
    placeholder: field.placeholder || (type === "list" ? "Phân cách bằng dấu phẩy" : undefined),
  };
  return <Field label={label}>
    {options ? <select {...defaults} onChange={(event) => onChange?.(event.target.value)}>
      <option value="" disabled={required}>{required ? "— Vui lòng chọn —" : "Tất cả / Không chọn"}</option>{selectOptions(options)}
    </select> : type === "textarea" ? <textarea {...defaults} maxLength={max} rows={3} /> : <input {...defaults}
      type={type === "uuid" || type === "list" || !type ? "text" : type}
      pattern={type === "uuid" ? UUID_PATTERN : pattern} min={min} max={type === "number" ? max : undefined}
      maxLength={!type || type === "list" ? max : undefined} step={step}
      onInput={field.autoUpper ? (event) => { event.currentTarget.value = event.currentTarget.value.toUpperCase(); } : undefined}
      onChange={(event) => onChange?.(event.target.value)} />}
    {field.helpText && <span className="font-normal text-xs text-ink-soft">{field.helpText}</span>}
  </Field>;
}

function MultiSelectCheckboxField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value?: unknown;
  onChange?: (value: string) => void;
}) {
  const { name, label, options = {}, required } = field;
  const initialSelected = Array.isArray(value)
    ? value.map(String)
    : typeof value === "string" && value.trim()
    ? value.split(",").map((s) => s.trim())
    : [];

  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [filter, setFilter] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = Array.isArray(value)
      ? value.map(String)
      : typeof value === "string" && value.trim()
      ? value.split(",").map((s) => s.trim())
      : [];
    setSelected(next);
  }, [value]);

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;
    const handleReset = () => {
      setSelected(initialSelected);
      onChange?.(initialSelected.join(","));
    };
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [initialSelected, onChange]);

  const optionEntries = Object.entries(options);
  const filteredEntries = optionEntries.filter(([val, lbl]) =>
    lbl.toLowerCase().includes(filter.toLowerCase()) || val.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleOption = (optValue: string) => {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    setSelected(next);
    onChange?.(next.join(","));
  };

  const selectAll = () => {
    const next = optionEntries.map(([val]) => val);
    setSelected(next);
    onChange?.(next.join(","));
  };

  const clearAll = () => {
    setSelected([]);
    onChange?.("");
  };

  return (
    <Field label={label}>
      <div ref={containerRef} className="rounded-xl border border-cream-line bg-white p-3 shadow-2xs">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-cream-line pb-2">
          {optionEntries.length > 5 ? (
            <input
              type="text"
              placeholder="Tìm nhanh mục..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-44 sm:w-56 rounded-lg border border-cream-line bg-cream/40 px-2.5 py-1 text-xs text-ink outline-none focus:border-magenta focus:bg-white transition"
            />
          ) : (
            <span className="text-xs font-semibold text-plum">Danh sách lựa chọn</span>
          )}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-medium text-ink-soft">
              Đã chọn: <strong className="text-magenta-deep font-bold">{selected.length}</strong>/{optionEntries.length}
            </span>
            <button
              type="button"
              onClick={selectAll}
              className="text-magenta-deep hover:underline cursor-pointer font-semibold"
            >
              Chọn hết
            </button>
            <span className="text-cream-line font-bold">|</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-ink-soft hover:underline cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          {filteredEntries.length === 0 ? (
            <p className="py-3 text-center text-xs text-ink-soft">Không tìm thấy mục nào phù hợp.</p>
          ) : (
            filteredEntries.map(([optValue, optLabel]) => {
              const isChecked = selected.includes(optValue);
              return (
                <label
                  key={optValue}
                  className={`flex items-start gap-2.5 rounded-lg p-2 text-xs sm:text-sm cursor-pointer transition select-none ${
                    isChecked
                      ? "bg-magenta/10 text-plum font-semibold border border-magenta/20"
                      : "hover:bg-cream text-ink border border-transparent"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={name}
                    value={optValue}
                    checked={isChecked}
                    onChange={() => toggleOption(optValue)}
                    className="mt-0.5 size-4 rounded border-cream-line text-magenta accent-magenta-deep cursor-pointer"
                  />
                  <span className="flex-1 leading-snug">{optLabel}</span>
                </label>
              );
            })
          )}
        </div>

        {required && selected.length === 0 && (
          <p className="mt-2 text-xs text-red-600 font-medium">* Vui lòng tích chọn ít nhất một mục.</p>
        )}
      </div>
      <p className="mt-1 text-xs text-ink-soft">
        Tích chọn các ô áp dụng (dễ dàng chọn/bỏ chọn từng mục, không cần giữ phím Ctrl).
      </p>
    </Field>
  );
}

export function MutationForm({ identity, path, method = "POST", fields, defaults, label, build, onSaved, resultView, resetAfterSave = true }: {
  identity: Identity; path: string | ((data: Row) => string); method?: string; fields: FormField[]; defaults?: Row; label: string;
  build?: (data: Row) => unknown; onSaved?: (data: Row) => void; resultView?: (data: Row) => ReactNode;
  resetAfterSave?: boolean;
}) {
  const [result, setResult] = useState<Row>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true);
    setError("");
    setResult(undefined);
    try {
      const data: Row = {};
      for (const field of fields) {
        const { name, type, required, autoUpper } = field;
        const rawValues = values.getAll(name).map((v) => String(v).trim()).filter(Boolean);
        let value = rawValues.length > 0 ? rawValues[0] : "";
        if (autoUpper) value = value.toUpperCase();
        if (required && !value && type !== "checkbox") throw new Error("Vui lòng điền đủ các trường bắt buộc.");
        if (type === "checkbox") data[name] = values.has(name);
        else if (type === "list") {
          data[name] = rawValues.length > 1 ? rawValues : (value ? value.split(",").map((item) => item.trim()).filter(Boolean) : []);
        } else if (value !== "") {
          data[name] = type === "number" ? Number(value)
            : type === "datetime-local" ? new Date(`${value}+07:00`).toISOString()
            : value;
        }
      }
      const endpoint = typeof path === "function" ? path(data) : path;
      const saved = await request<Row>(endpoint, { identity, method, body: build ? build(data) : data });
      if (resetAfterSave) form.reset();
      setResult(saved);
      onSaved?.(saved);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return <form className="mt-4 grid gap-4" onSubmit={submit} aria-busy={busy}>
    {fields.length > 0 && <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => <Control key={field.name} field={field} value={defaults?.[field.name]} />)}
    </fieldset>}
    <button type="submit" disabled={busy} className={`${primary} justify-self-start`}>{busy ? "Đang xử lý…" : label}</button>
    {error && <ErrorMessage message={error} />}
    {result && <div role="status" className="grid gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
      <p className="font-semibold">Đã thực hiện thành công.</p>{resultView?.(result)}
    </div>}
  </form>;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
  zIndex = "z-50",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  maxWidth?: string;
  zIndex?: string;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-3 sm:p-5 bg-ink/60 backdrop-blur-xs`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative flex max-h-[92vh] w-full ${maxWidth} flex-col rounded-2xl bg-white border border-cream-line shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cream-line bg-cream/50 px-5 py-4">
          <div className="font-display text-lg sm:text-xl font-bold text-plum flex items-center gap-2">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream hover:text-plum transition cursor-pointer"
            aria-label="Đóng popup"
            title="Đóng (Esc)"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-cream-line bg-cream/20 px-5 py-3">
          {footer ? footer : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-cream-line bg-white px-4 py-2 text-sm font-semibold text-plum hover:bg-cream transition shadow-2xs cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Action({
  title,
  children,
  defaultOpen = false,
  maxWidth = "max-w-2xl",
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  maxWidth?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const titleLower = title.toLowerCase();
  const isCreate = titleLower.includes("tạo") || titleLower.includes("thêm") || titleLower.includes("đề xuất");
  const isView = titleLower.includes("theo dõi") || titleLower.includes("báo cáo") || titleLower.includes("lịch") || titleLower.includes("xem") || titleLower.includes("tra cứu");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-between rounded-xl border border-cream-line bg-white/90 px-4 py-3 text-left text-sm font-semibold text-plum transition hover:border-magenta hover:bg-magenta/5 hover:shadow-xs active:scale-[0.99] cursor-pointer"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className={`flex size-7 items-center justify-center rounded-lg transition ${
            isCreate ? "bg-magenta/10 text-magenta group-hover:bg-magenta group-hover:text-white" :
            isView ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" :
            "bg-cream text-plum group-hover:bg-plum group-hover:text-white"
          }`}>
            {isCreate ? (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            ) : isView ? (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ) : (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </span>
          <span className="font-semibold text-plum">{title}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-lg bg-cream px-2.5 py-1 text-xs font-medium text-ink-soft group-hover:bg-magenta group-hover:text-white transition">
          <span>{isView ? "Mở xem" : "Mở nhập biểu mẫu"}</span>
          <svg className="size-3 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={title} maxWidth={maxWidth} zIndex="z-[60]">
        {children}
      </Modal>
    </>
  );
}
