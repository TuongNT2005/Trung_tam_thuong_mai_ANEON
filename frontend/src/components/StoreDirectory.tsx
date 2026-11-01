"use client";


/**
 * ==============================================================================
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Danh mục tra cứu cửa hàng theo tầng và ngành hàng kinh doanh tại ANEON MALL
 * Phiên bản: Version 1
 * ==============================================================================
 */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { PublicStore } from "@/lib/aneon-api";
import { useResource } from "./aneon/WorkspaceUi";
import { Reveal } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ normalize
 * Phiên bản: Version 1
 */
function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll("đ", "d");
}

/**
 * Người phụ trách code: Khải | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: tra cứu gian hàng công khai theo tên, ngành hàng và tầng.
 */
/**
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Thành phần giao diện (Component) store directory hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export default function StoreDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [floor, setFloor] = useState("Tất cả");
  const [revision, setRevision] = useState(0);
  const { data, loading, error } = useResource<PublicStore[]>("public/stores", undefined, revision);
  const categories = ["Tất cả", ...new Set((data ?? []).flatMap((store) => store.category ? [store.category] : []))];
  const floors = ["Tất cả", ...new Set((data ?? []).map((store) => store.floor))];

  useEffect(() => {
    if (!data || !window.location.hash.startsWith("#gian-hang-")) return;
    const store = data.find(({ code }) => window.location.hash === `#gian-hang-${encodeURIComponent(code)}`);
    if (!store) return;
    const card = document.getElementById(`gian-hang-${store.code}`);
    const details = card?.querySelector("details");
    if (details) details.open = true;
    card?.scrollIntoView();
  }, [data]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return (data ?? []).filter((s) => {
      const matchQuery = [s.name, s.code, s.category, s.zone, s.description].some((value) => value && normalize(value).includes(q));
      const matchCategory = category === "Tất cả" || s.category === category;
      const matchFloor = floor === "Tất cả" || s.floor === floor;
      return matchQuery && matchCategory && matchFloor;
    });
  }, [data, query, category, floor]);

  return (
    <section id="gian-hang" className="scroll-mt-20 bg-plum py-24 text-cream md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="text-xs font-semibold text-cream/80">Danh bạ gian hàng</p>
            </Reveal>
            <h2 className="mt-8 font-display text-4xl font-light leading-[1.08] tracking-[-0.02em] sm:text-5xl md:text-[56px]">
              <span className="block">Tìm ra cửa hàng</span>
              <span className="block">
                bạn <em className="font-display italic text-gold">đang nhớ.</em>
              </span>
            </h2>
          </div>
          <Reveal delay={0.15} className="w-full max-w-md">
            <label htmlFor="store-search" className="sr-only">
              Tìm gian hàng
            </label>
            <div className="relative">
              <input
                id="store-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm tên, mã hoặc ngành hàng…"
                className="h-[52px] w-full rounded-full border border-cream/20 bg-cream/5 pl-12 pr-5 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-magenta"
              />
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="9" cy="9" r="6" />
                <path d="m13.5 13.5 4 4" strokeLinecap="round" />
              </svg>
            </div>
          </Reveal>
        </div>

        {/* Bộ lọc */}
        <Reveal delay={0.1} className="mt-10 space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo danh mục">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-2 text-[12px] font-medium transition-all duration-300 ${
                  category === c
                    ? "border-magenta bg-magenta text-white"
                    : "border-cream/20 text-cream/75 hover:border-cream/60 hover:text-cream"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Lọc theo tầng">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/50">
              Tầng
            </span>
            {floors.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFloor(f)}
                aria-pressed={floor === f}
                className={`rounded-full border px-4 py-2 font-mono text-[12px] transition-all duration-300 ${
                  floor === f
                    ? "border-gold bg-gold text-ink"
                    : "border-cream/20 text-cream/75 hover:border-cream/60 hover:text-cream"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Kết quả */}
        <div className="mt-10 border-t border-cream/10">
          {loading && <p className="py-4 text-sm" role="status">Đang tải gian hàng…</p>}
          {error && <div className="flex flex-wrap items-center gap-3 py-4 text-sm">
            <p role="alert">Không tải được danh bạ gian hàng.</p>
            <button className="rounded-full border border-cream/50 px-4 py-2" onClick={() => setRevision((value) => value + 1)}>Thử lại</button>
          </div>}
          {data && <p className="py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-cream/75" role="status">
            {results.length} gian hàng {query || category !== "Tất cả" || floor !== "Tất cả" ? "phù hợp" : ""}
          </p>}
          <ul className="grid gap-0 md:grid-cols-2">
            {results.map((store, i) => (
              <motion.li
                key={store.code}
                id={`gian-hang-${store.code}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.25), ease: EASE }}
                className="group scroll-mt-28 border-b border-cream/10 md:odd:border-r"
              >
                <div
                  className="flex items-baseline gap-5 px-1 py-6 transition-colors md:px-5"
                >
                  <span className="font-mono text-[11px] text-cream/40 transition-colors group-hover:text-magenta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-display text-xl text-cream transition-transform duration-300 group-hover:translate-x-1 md:text-2xl">
                        {store.name}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/90">
                        {store.floor}
                      </span>
                    </span>
                    <span className="mt-1 block text-[13px] text-cream/80">{store.location || store.zone}</span>
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40 md:block">
                    {store.category}
                  </span>
                </div>
                <details className="px-1 pb-5 text-sm text-cream/85 md:px-5">
                  <summary className="cursor-pointer font-semibold text-gold">Vị trí và thông tin gian hàng</summary>
                  <p className="mt-2">{[store.floor, store.zone, store.location].filter(Boolean).join(" · ")}</p>
                  <p className="mt-1">Mã gian hàng · {store.code}</p>
                  {store.operatingHours && <p className="mt-1">Giờ mở cửa · {store.operatingHours}</p>}
                  {store.description && <p className="mt-1">{store.description}</p>}
                </details>
              </motion.li>
            ))}
          </ul>
          {data && results.length === 0 && (
            <p className="py-14 text-center text-sm text-cream/60">
              {data.length ? "Không tìm thấy gian hàng phù hợp. Hãy bỏ bớt bộ lọc hoặc đổi từ khóa." : "Hiện chưa có gian hàng được công khai."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
