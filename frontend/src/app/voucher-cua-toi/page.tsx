import { TopBar } from "@/components/aneon/Ui";
import { VoucherWallet } from "@/components/aneon/VoucherWallet";

export const metadata = { title: "Voucher của tôi | ANEON MALL", robots: { index: false, follow: false } };

export default function WalletPage() {
  return <>
    <TopBar />
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <h1 className="mb-6 font-display text-4xl text-plum sm:text-5xl">Voucher của tôi</h1>
      <VoucherWallet />
    </main>
  </>;
}
