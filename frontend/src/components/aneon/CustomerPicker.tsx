"use client";

/**
 * Người phụ trách code: Kiên | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: tra cứu khách tại quầy bằng số điện thoại, thẻ hoặc họ tên.
 */
import { useEffect, useId, useRef, useState } from "react";
import { request, type Identity } from "@/lib/aneon-api";
import { ErrorMessage, input, secondary } from "./Ui";

export type CustomerMatch = { id: string; name: string; phoneLastFour?: string; cardLastFour?: string };
type Results = { matches: CustomerMatch[]; hasMore: boolean };

const searchModes = {
  PHONE: { label: "Số điện thoại", help: "Nhập đầy đủ số điện thoại đã đăng ký.", placeholder: "Ví dụ: 0900000101", inputMode: "tel" },
  CARD: { label: "Số thẻ thành viên", help: "Nhập số in trên thẻ thành viên của khách.", placeholder: "Ví dụ: TV-DEMO", inputMode: "text" },
  NAME: { label: "Họ tên", help: "Nhập ít nhất 3 ký tự đầu của họ tên, có dấu hoặc không dấu.", placeholder: "Ví dụ: Nguyễn Văn", inputMode: "text" },
} as const;
type SearchBy = keyof typeof searchModes;

function CustomerIdentifiers({ customer }: { customer: CustomerMatch }) {
  const identifiers = [customer.phoneLastFour && `SĐT •••• ${customer.phoneLastFour}`,
    customer.cardLastFour && `Thẻ •••• ${customer.cardLastFour}`].filter(Boolean);
  return <span className="block text-sm text-ink-soft">{identifiers.join(" · ") || "Chưa có số điện thoại hoặc thẻ thành viên"}</span>;
}

export function CustomerPicker({ identity, path = "shared/customers/search", name, label = "Tìm khách mua sắm", onSelect, focusSearch = false }: {
  identity: Identity;
  path?: string;
  name?: string;
  label?: string;
  onSelect?: (customer?: CustomerMatch) => void;
  focusSearch?: boolean;
}) {
  const uid = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const [by, setBy] = useState<SearchBy>("PHONE");
  const [value, setValue] = useState("");
  const [search, setSearch] = useState<{ by: SearchBy; query: string }>();
  const [results, setResults] = useState<Results>();
  const [selected, setSelected] = useState<CustomerMatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mode = searchModes[by];

  useEffect(() => {
    if (!search) return;
    const controller = new AbortController();
    request<Results>(path, { identity, method: "POST", body: search, signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setResults(data); })
      .catch((err: Error) => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [identity, path, search]);

  useEffect(() => {
    if (!name) return;
    const form = containerRef.current?.closest("form");
    if (!form) return;
    function clear() {
      setSelected(undefined);
      setValue("");
      clearResults();
    }
    form.addEventListener("reset", clear);
    return () => form.removeEventListener("reset", clear);
  }, [name]);

  useEffect(() => {
    if (selected) selectedRef.current?.focus();
  }, [selected]);

  useEffect(() => {
    if (focusSearch) searchRef.current?.focus();
  }, [focusSearch]);

  function clearResults() {
    setSearch(undefined);
    setResults(undefined);
    setLoading(false);
    setError("");
  }

  function submitSearch() {
    const query = value.trim();
    if (!query || loading) return;
    if (by === "NAME" && Array.from(query).length < 3) {
      setError(mode.help);
      return;
    }
    setLoading(true);
    setResults(undefined);
    setError("");
    setSearch({ by, query });
  }

  function choose(customer?: CustomerMatch) {
    setSelected(customer);
    onSelect?.(customer);
    if (!customer) requestAnimationFrame(() => searchRef.current?.focus());
  }

  return <div ref={containerRef} className="grid min-w-0 gap-3" aria-label={label}>
    {name && <input type="hidden" name={name} value={selected?.id ?? ""} />}
    <p className="text-sm font-semibold text-plum">{label}</p>
    {selected ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream-line bg-cream px-4 py-3">
      <div>
        <p className="text-xs font-semibold text-ink-soft">Khách đã chọn</p>
        <p className="font-semibold text-plum">{selected.name}</p>
        <CustomerIdentifiers customer={selected} />
      </div>
      <button ref={selectedRef} type="button" className={secondary} onClick={() => choose()}>Đổi khách</button>
    </div> : <>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Cách tìm khách</legend>
        {Object.entries(searchModes).map(([key, option]) => <button key={key} type="button"
          className={`${secondary} aria-pressed:border-magenta-deep aria-pressed:bg-cream aria-pressed:text-magenta-deep`}
          aria-pressed={by === key} onClick={() => {
            if (by === key) return;
            setBy(key as SearchBy);
            setValue("");
            clearResults();
            searchRef.current?.focus();
          }}>{option.label}</button>)}
      </fieldset>
      <div className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
        <label htmlFor={uid} className="grid min-w-0 flex-1 gap-1.5 text-sm font-semibold">
          <span className="sr-only">Nhập {mode.label.toLowerCase()} để tìm khách</span>
          <input ref={searchRef} id={uid} className={input} type="search" inputMode={mode.inputMode}
            aria-describedby={`${uid}-help`} autoComplete="off" maxLength={by === "NAME" ? 200 : 50}
            placeholder={mode.placeholder} value={value} onChange={(event) => { setValue(event.target.value); clearResults(); }}
            onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submitSearch();
            } }} />
        </label>
        <button type="button" className={secondary} disabled={!value.trim() || loading} onClick={submitSearch}>Tìm khách</button>
      </div>
      <p id={`${uid}-help`} className="text-sm text-ink-soft">{mode.help}</p>
      {loading && <p role="status" className="text-sm text-ink-soft">Đang tìm khách…</p>}
      {error && <ErrorMessage message={error} />}
      {results && <>
        <p role="status" className="text-sm text-ink-soft">{results.hasMore
          ? "Hiện 10 kết quả đầu tiên. Nhập họ tên cụ thể hơn hoặc tìm bằng số điện thoại hay thẻ thành viên."
          : results.matches.length ? `${results.matches.length} kết quả. Đối chiếu thông tin trước khi chọn.`
            : "Không tìm thấy khách. Kiểm tra lại thông tin hoặc đổi cách tìm."}</p>
        <ul className="grid gap-2">
          {results.matches.map((customer) => <li key={customer.id}>
            <button type="button" className="flex w-full items-center justify-between gap-3 rounded-xl border border-cream-line p-3 text-left hover:border-magenta-deep"
              onClick={() => choose(customer)}>
              <span className="min-w-0 break-words"><strong className="block text-plum">{customer.name}</strong><CustomerIdentifiers customer={customer} /></span>
              <span className="shrink-0 text-sm font-semibold text-magenta-deep">Chọn</span>
            </button>
          </li>)}
        </ul>
      </>}
    </>}
  </div>;
}
