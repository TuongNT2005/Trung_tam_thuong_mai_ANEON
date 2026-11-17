/**
 * Dữ liệu nội dung của website AEON MALL.
 * Ảnh dùng từ Unsplash (giấy phép Unsplash) — curation đồng bộ phong cách
 * cinematic editorial; prompt thay thế bằng ảnh AI riêng nằm ở
 * frontend/docs/image-prompts.md.
 */
export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: u("1481437156560-3205f6a55735", 2200),
  aboutTall: u("1519567241046-7f570eee3ce6", 1400),
  aboutSmall: u("1573855619003-97b4799dcd8b", 900),
  shoppingMain: u("1441986300917-64674bd600d8", 1600),
  shoppingA: u("1555529669-e69e7aa0ba9a", 900),
  shoppingB: u("1441984904996-e0b6ba687e04", 900),
  diningMain: u("1517248135467-4c7edcad34c4", 1600),
  diningA: u("1555396273-367ea4eb4db5", 900),
  diningB: u("1414235077428-338989a2e8c0", 900),
  funA: u("1511882150382-421056c89033", 1000),
  funB: u("1513106580091-1d82408b8cd6", 1000),
  eventA: u("1533174072545-7a4b6ad7a6c3", 1400),
  supermarket: u("1542838132-92c53300491e", 1200),
  giftToast: u("1519671482749-fd09be7ccebf", 900),
};

export const NAV = [
  { label: "Giới thiệu", href: "#gioi-thieu" },
  { label: "Gian hàng", href: "#gian-hang" },
  { label: "Mua sắm & Ẩm thực", href: "#mua-sam-am-thuc" },
  { label: "Ưu đãi", href: "/kham-pha?danh-muc=PROMOTION" },
  { label: "Sự kiện", href: "/kham-pha?danh-muc=EVENT" },
  { label: "Tiện ích", href: "#tien-ich" },
];

export const HERO_STATS = [
  { value: "250+", label: "Gian hàng" },
  { value: "60+", label: "Ẩm thực" },
  { value: "12", label: "Khu giải trí" },
  { value: "2.500", label: "Chỗ đỗ xe" },
];

export const MARQUEE_WORDS = [
  "Mua sắm",
  "Ẩm thực",
  "Giải trí",
  "Sự kiện",
  "Ưа Đãi",
  "Khám phá",
];

export const SHOPPING_TILES = [
  { image: IMAGES.shoppingA, label: "Thời trang cao cấp", tag: "Tầng 1 — 40+ thương hiệu" },
  { image: IMAGES.shoppingB, label: "Boutique & concept store", tag: "Tầng 2 — chọn lọc mỗi mùa" },
  { image: u("1528698827591-e19ccd7bc23d", 900), label: "Quà tặng & lưu niệm", tag: "Tầng 1 — gói quà miễn phí" },
];

export const DINING_TILES = [
  { image: IMAGES.diningA, label: "Cà phê & trà chiều", tag: "Tầng 1 — 12 quán" },
  { image: IMAGES.diningB, label: "Fine dining", tag: "Tầng 2 — nhà hàng sang trọng" },
];

export const FACILITIES = [
  {
    title: "Bãi xe thông minh",
    detail: "2.500 chỗ, dẫn đường tìm chỗ trống theo thời gian thực.",
  },
  {
    title: "Gửi xe điện (EV)",
    detail: "24 trạm sạc nhanh tại tầng B1 và B2.",
  },
  {
    title: "Phòng chăm sóc bé",
    detail: "Không gian yên tĩnh, tiệt trùng, có tủ sức khỏe mẹ.",
  },
  {
    title: "Wi-Fi miễn phí",
    detail: "Sóng phủ toàn trung tâm, tốc độ cao cho khách ghé thăm.",
  },
  {
    title: "Hỗ trợ khách khuyết tật",
    detail: "Lát gạch dẫn đường, thang máy ưu tiên, xe đẩy miễn phí.",
  },
  {
    title: "Y tế & an ninh 24/7",
    detail: "Phòng y tế tầng 1 và đội an ninh luôn túc trực.",
  },
];
