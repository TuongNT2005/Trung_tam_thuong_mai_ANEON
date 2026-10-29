/**
 * ==============================================================================
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Trang chi tiết thông tin sự kiện công khai dành cho khách hàng tham khảo
 * Phiên bản: Version 1
 * ==============================================================================
 */
import { PublicEvent } from "@/components/aneon/PublicEvent";
import { TopBar } from "@/components/aneon/Ui";

export const metadata = { title: "Chi tiết sự kiện | ANEON MALL" };

/**
 * Người code: Khải
 * Ngày code: 29/10/2026
 * Chức năng: Thành phần giao diện (Component) public event page hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export default async function PublicEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <>
    <TopBar />
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <PublicEvent id={id} />
    </main>
  </>;
}
