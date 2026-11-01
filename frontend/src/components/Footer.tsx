/**
 * ==============================================================================
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Chân trang hiển thị thông tin liên hệ, sơ đồ tầng và liên kết tiện ích trung tâm thương mại
 * Phiên bản: Version 1
 * ==============================================================================
 */
import Link from "next/link";
import { NAV } from "@/lib/site";
import { Reveal } from "./motion";

/**
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Thành phần giao diện (Component) footer hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export default function Footer() {

  return (
    <footer className="relative overflow-hidden bg-plum pt-20 text-cream md:pt-28">
      <div aria-hidden className="aeon-gradient absolute inset-x-0 top-0 h-1" />

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-3xl font-light leading-[1.12] sm:text-4xl">Sự kiện và ưu đãi</h2>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href="/kham-pha" className="underline underline-offset-4 hover:text-gold">Xem lịch và ưu đãi</Link>
              <Link href="/voucher-cua-toi" className="underline underline-offset-4 hover:text-gold">Voucher của tôi</Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <Reveal delay={0.08}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/50">
                Khám phá
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="text-cream/80 transition-colors hover:text-gold">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.14}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/50">
                Giờ mở cửa
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-cream/80">
                <li>Thứ Hai — Chủ Nhật</li>
                <li className="font-display text-lg text-cream">09:00 — 22:00</li>
                <li>Siêu thị: 08:00 — 22:30</li>
                <li>Rạp chiếu phim: đến 24:00</li>
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/50">
                Liên hệ
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-cream/80">
                <li>Số 8 Đại Lộ TTTM</li>
                <li>Khu đô thị mới, TP. Hồ Chí Minh</li>
                <li>
                  <a href="tel:+842836221111" className="transition-colors hover:text-gold">
                    (028) 3622 1111
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@aeonmall.vn" className="transition-colors hover:text-gold">
                    hello@aeonmall.vn
                  </a>
                </li>
              </ul>
              <div className="mt-5 flex gap-2">
                {["Facebook", "TikTok", "Instagram"].map((s) => (
                  <a
                    key={s}
                    href="#top"
                    aria-label={s}
                    className="rounded-full border border-cream/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-cream/70 transition-colors hover:border-gold hover:text-gold"
                  >
                    {s.slice(0, 2)}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Wordmark lớn */}
        <p
          aria-hidden
          className="mt-20 select-none text-center font-display text-[16.5vw] font-light leading-[0.85] tracking-[-0.02em] text-cream/10 md:mt-28"
        >
          AEON MALL
        </p>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream/10 py-7 text-xs text-cream/50 md:flex-row">
          <p>© {new Date().getFullYear()} AEON MALL — Demo dựng cho mục đích học tập.</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em]">
            Mua sắm · Ẩm thực · Giải trí
          </p>
        </div>
      </div>
    </footer>
  );
}
