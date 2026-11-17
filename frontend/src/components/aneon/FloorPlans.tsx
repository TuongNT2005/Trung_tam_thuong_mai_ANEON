"use client";

import Image from "next/image";
import { useState } from "react";
import { panel, secondary } from "./Ui";

export type FloorPlan = { id: string; label: string; image: string; description: string };

export const floorPlans: FloorPlan[] = [
  { id: "b2", label: "Hầm B2", image: "/floor-plans/b2.png", description: "Bãi đỗ xe và kỹ thuật" },
  { id: "b1", label: "Hầm B1", image: "/floor-plans/b1.png", description: "Bãi đỗ xe và siêu thị thương mại" },
  { id: "tang-1", label: "Tầng 1", image: "/floor-plans/tang-1.png", description: "Sảnh chính và khu mua sắm" },
  { id: "tang-2", label: "Tầng 2", image: "/floor-plans/tang-2.png", description: "Thời trang và mua sắm bán lẻ" },
  { id: "tang-3", label: "Tầng 3", image: "/floor-plans/tang-3.png", description: "Ẩm thực và giải trí" },
  { id: "tang-4", label: "Tầng 4", image: "/floor-plans/tang-4.png", description: "Rạp chiếu phim, dịch vụ và văn phòng" },
];

// Dữ liệu demo cũ dùng TRET cho sảnh tầng 1 và đặt khu B1 ở T1.
// Ưu tiên khu vực B1 để tránh hiển thị nhầm bản vẽ tầng 1.
/**
 * Người phụ trách code: Kiên | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: ghép tầng và khu vực F01 với sáu bản vẽ do người dùng cung cấp.
 */
export function planForPremise(floorName?: string, zoneName?: string) {
  const floor = (floorName ?? "").toLocaleLowerCase("vi");
  const zone = (zoneName ?? "").toLocaleLowerCase("vi");
  const id = /\bb2\b/.test(zone) || /\bb2\b/.test(floor) ? "b2"
    : /\bb1\b/.test(zone) || /\bb1\b/.test(floor) ? "b1"
    : floor.includes("tầng 4") ? "tang-4"
    : floor.includes("tầng 3") ? "tang-3"
    : floor.includes("tầng 2") ? "tang-2"
    : floor.includes("tầng 1") || floor.includes("tầng trệt") ? "tang-1" : undefined;
  return floorPlans.find((plan) => plan.id === id);
}

// Chỉ ghim điểm xác định rõ trên bản vẽ. Các vị trí chưa có đối chiếu đáng tin
// cậy vẫn chọn được theo tên, nhưng không bị đặt sai lên ảnh.
export const planPins: Record<string, { planId: string; x: number; y: number }> = {
  "a0000000-0000-4000-8000-000000000004": { planId: "tang-1", x: 49.2, y: 81.5 },
};

export function FloorPlansView() {
  const [selected, setSelected] = useState("tang-1");
  const plan = floorPlans.find((item) => item.id === selected) ?? floorPlans[2];
  return <div className={`${panel} grid gap-5`}>
    <div>
      <h2 className="font-display text-2xl text-plum">Bản vẽ mặt bằng các tầng</h2>
      <p className="mt-2 text-sm text-ink-soft">Chọn tầng để xem bản vẽ gốc. Khi gắn vị trí cho một mặt bằng, mở hồ sơ mặt bằng để xem các điểm vị trí đã được khai báo cho khu vực đó.</p>
    </div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Chọn tầng xem bản vẽ">
      {floorPlans.map((item) => <button type="button" key={item.id} onClick={() => setSelected(item.id)}
        aria-pressed={selected === item.id}
        className={`rounded-xl border px-3 py-2 text-sm font-semibold ${selected === item.id ? "border-plum bg-plum text-white" : "border-cream-line text-plum hover:border-plum"}`}>{item.label}</button>)}
    </div>
    <div>
      <p className="font-semibold text-plum">{plan.label} · {plan.description}</p>
      <div className="mt-3 overflow-hidden rounded-xl border border-cream-line bg-white">
        <Image src={plan.image} alt={`Bản vẽ ${plan.label}: ${plan.description}`} width={1024} height={576}
          unoptimized sizes="(min-width: 1024px) 75vw, 100vw" className="h-auto w-full" />
      </div>
      <a className={`${secondary} mt-3`} href={plan.image} target="_blank" rel="noopener noreferrer">Mở bản vẽ kích thước gốc</a>
    </div>
  </div>;
}
