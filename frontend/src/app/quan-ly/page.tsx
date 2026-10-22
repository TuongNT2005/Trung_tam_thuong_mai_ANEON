/**
 * ==============================================================================
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Trang Quản lý tập trung toàn bộ hệ thống ANEON dành cho Ban quản lý và Cán bộ vận hành
 * Phiên bản: Version 1
 * ==============================================================================
 */
import { TopBar } from "@/components/aneon/Ui";
import { Workspace } from "@/components/aneon/Workspace";

export const metadata = { title: "Quản lý ANEON | AEON MALL", robots: { index: false, follow: false } };

/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Thành phần giao diện (Component) workspace page hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export default function WorkspacePage() {
  return <>
    <TopBar />
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-10 md:py-10">
      <Workspace />
    </main>
  </>;
}
