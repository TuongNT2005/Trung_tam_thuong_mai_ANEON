import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import StoreDirectory from "@/components/StoreDirectory";
import ShoppingDining from "@/components/ShoppingDining";
import { DiscoveryPreview } from "@/components/aneon/Discovery";
import Facilities from "@/components/Facilities";
import Footer from "@/components/Footer";

/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Thành phần giao diện (Component) home hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <StoreDirectory />
        <ShoppingDining />
        <DiscoveryPreview category="PROMOTION" id="uu-dai" />
        <DiscoveryPreview category="EVENT" id="su-kien" />
        <Facilities />
      </main>
      <Footer />
    </>
  );
}
