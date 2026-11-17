import { PublicEvent } from "@/components/aneon/PublicEvent";
import { TopBar } from "@/components/aneon/Ui";

export const metadata = { title: "Chi tiết sự kiện | ANEON MALL" };

export default async function PublicEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <>
    <TopBar />
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <PublicEvent id={id} />
    </main>
  </>;
}
