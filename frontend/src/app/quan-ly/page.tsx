import { TopBar } from "@/components/aneon/Ui";
import { Workspace } from "@/components/aneon/Workspace";

export const metadata = { title: "Quản lý ANEON | AEON MALL", robots: { index: false, follow: false } };

export default function WorkspacePage() {
  return <>
    <TopBar />
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-10 md:py-10">
      <Suspense fallback={<p role="status">Đang mở cổng quản lý…</p>}><Workspace /></Suspense>
    </main>
  </>;
}
import { Suspense } from "react";
