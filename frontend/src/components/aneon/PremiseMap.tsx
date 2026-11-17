"use client";

import { useState } from "react";
import Image from "next/image";
import { type Identity } from "@/lib/aneon-api";
import { planForPremise, planPins } from "./FloorPlans";
import { ErrorMessage } from "./Ui";
import { MutationForm, useResource } from "./WorkspaceUi";

type Point = { id: string; x: number; y: number; label?: string };
type FloorMap = { name: string; minX: number; minY: number; maxX: number; maxY: number; points: Point[] };

function coordinate(value: number, min: number, max: number) {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 50;
  return Math.max(7, Math.min(93, 100 * (value - min) / (max - min)));
}

/**
 * Người phụ trách code: Kiên | Ngày cập nhật local: 2026-11-17 | Phiên bản: v1.1.
 * Chức năng: gắn vị trí F01 trên bản vẽ và chọn theo tên khi chưa có tọa độ ghim.
 */
export function PremiseMap({ path, identity, currentId, premiseCode, floorName, zoneName, onSaved }: {
  path: string; identity: Identity; currentId: unknown; premiseCode: string;
  floorName?: string; zoneName?: string; onSaved: () => void;
}) {
  const map = useResource<FloorMap>(`${path}/map`, identity);
  const [selected, setSelected] = useState<string>();
  const [search, setSearch] = useState("");
  if (map.loading) return <p role="status" className="mt-3 text-sm">Đang tải vị trí…</p>;
  if (map.error) {
    const isNotFound = map.error.toLowerCase().includes("khong ton tai") || map.error.toLowerCase().includes("không tồn tại") || map.error.includes("404");
    if (isNotFound) return <div className="mt-3 rounded-xl border border-cream-line bg-cream p-4 text-sm text-ink-soft">
      <p className="font-semibold text-plum">Chưa có bản đồ vị trí</p>
      <p className="mt-1">Khu vực của mặt bằng này chưa có dữ liệu bản đồ được phát hành.</p>
    </div>;
    return <div className="mt-3"><ErrorMessage message={map.error} /></div>;
  }
  if (!map.data) return <p className="mt-3 text-sm text-ink-soft">Chưa có dữ liệu bản đồ cho khu vực này.</p>;

  const { name, minX, minY, maxX, maxY, points } = map.data;
  const plan = planForPremise(floorName, zoneName);
  const pinnedCount = plan ? points.filter((point) => planPins[point.id]?.planId === plan.id).length : 0;
  const currentPoint = points.find((point) => point.id === currentId);
  const selectedPoint = points.find((point) => point.id === selected);
  const pointName = (point: Point, index: number) => point.label?.trim() || `Vị trí ${index + 1}`;
  const filtered = points.filter((point, index) => pointName(point, index).toLocaleLowerCase("vi").includes(search.trim().toLocaleLowerCase("vi")));

  return <div className="mt-4 grid gap-5 text-sm">
    <div>
      <p className="text-base font-semibold text-plum">{premiseCode}</p>
      <p className="text-ink-soft">{[floorName, zoneName].filter(Boolean).join(" · ") || name}</p>
      <p className="mt-2">Vị trí hiện tại: <strong className="text-plum">{currentPoint ? pointName(currentPoint, points.indexOf(currentPoint)) : currentId ? "Không nằm trong danh sách vị trí của khu vực" : "Chưa gắn vị trí"}</strong></p>
    </div>
    {points.length === 0 && !plan ? <p>Chưa có vị trí trong khu vực của mặt bằng.</p> : <>
      <div className={`grid gap-4 ${plan ? "" : "md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.9fr)]"}`}>
        <div className="min-w-0">
          <p className="font-semibold text-plum">{plan ? `Bản vẽ ${plan.label}` : "Vị trí theo tọa độ"}</p>
          <p className="mt-1 text-xs text-ink-soft">{plan
            ? `${pinnedCount}/${points.length} vị trí trong khu vực đã được căn trên bản vẽ. Các vị trí khác vẫn chọn được theo tên bên dưới.`
            : "Khu vực này chưa có bản vẽ được liên kết; hình chỉ thể hiện các điểm tọa độ."}</p>
          <div className="relative mt-3 overflow-hidden rounded-xl border border-cream-line bg-cream" aria-label={plan ? `Bản vẽ ${plan.label} với các vị trí đã căn` : "Các vị trí theo tọa độ"}
            style={plan ? undefined : {
              minHeight: 256,
              backgroundImage: "linear-gradient(#e7dcc9 1px, transparent 1px), linear-gradient(90deg, #e7dcc9 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}>
            {plan && <Image src={plan.image} alt={`Bản vẽ ${plan.label}: ${plan.description}`}
              width={1024} height={576} unoptimized sizes="(min-width: 1024px) 70vw, 100vw"
              className="h-auto w-full" />}
            {points.map((point, index) => {
              const pin = plan ? planPins[point.id] : undefined;
              if (plan && pin?.planId !== plan.id) return null;
              const isCurrent = point.id === currentId;
              const isSelected = point.id === selected;
              return <button type="button" key={point.id} onClick={() => setSelected(point.id)}
                title={pointName(point, index)} aria-pressed={isSelected}
                aria-label={`${pointName(point, index)}${isCurrent ? ", vị trí hiện tại" : ""}${isSelected ? ", đang chọn" : ""}`}
                style={{ left: `${pin ? pin.x : coordinate(point.x, minX, maxX)}%`, top: `${pin ? pin.y : coordinate(point.y, minY, maxY)}%` }}
                className={`absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 font-bold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta-deep ${isSelected ? "z-20 border-magenta-deep bg-magenta-deep text-white" : isCurrent ? "z-10 border-plum bg-plum text-white" : "border-plum bg-white text-plum"}`}>
                {index + 1}
              </button>;
            })}
          </div>
          {plan && <a href={plan.image} target="_blank" rel="noopener noreferrer"
            className="mt-2 inline-block font-semibold text-magenta-deep underline">Mở bản vẽ kích thước gốc</a>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
            <span><span className="mr-1 inline-block size-3 rounded-full bg-plum align-middle" />Đang gắn</span>
            <span><span className="mr-1 inline-block size-3 rounded-full bg-magenta-deep align-middle" />Đang chọn</span>
            <span><span className="mr-1 inline-block size-3 rounded-full border border-plum bg-white align-middle" />Vị trí khác</span>
          </div>
        </div>
        <div className="min-w-0">
          <label htmlFor="premise-map-search" className="font-semibold text-plum">Chọn theo tên vị trí</label>
          <input id="premise-map-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm tên vị trí…" className="mt-2 w-full rounded-xl border border-cream-line px-3 py-2.5 focus:border-magenta-deep focus:outline-2 focus:outline-magenta-deep" />
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1" role="group" aria-label="Danh sách vị trí trong khu vực">
            {filtered.map((point) => {
              const index = points.indexOf(point);
              const isCurrent = point.id === currentId;
              const isSelected = point.id === selected;
              return <button type="button" key={point.id} onClick={() => setSelected(point.id)} aria-pressed={isSelected}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-magenta-deep ${isSelected ? "border-magenta-deep bg-magenta-deep/5" : "border-cream-line hover:border-plum"}`}>
                <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${isSelected ? "bg-magenta-deep text-white" : isCurrent ? "bg-plum text-white" : "bg-cream text-plum"}`}>{index + 1}</span>
                <span className="min-w-0 flex-1 font-medium text-plum">{pointName(point, index)}</span>
                {isCurrent && <span className="shrink-0 text-xs font-semibold text-plum">Hiện tại</span>}
              </button>;
            })}
            {filtered.length === 0 && <p className="py-3 text-ink-soft">{points.length === 0 ? "Khu vực này chưa có vị trí được khai báo." : "Không tìm thấy vị trí trong khu vực này."}</p>}
          </div>
        </div>
      </div>
      <div className="border-t border-cream-line pt-4">
        <p>Vị trí sẽ gắn: <strong className="text-magenta-deep">{selectedPoint ? pointName(selectedPoint, points.indexOf(selectedPoint)) : "Chưa chọn"}</strong></p>
        {plan && selectedPoint && planPins[selectedPoint.id]?.planId !== plan.id &&
          <p className="mt-1 text-ink-soft">Vị trí này chưa được xác định chính xác trên bản vẽ. Bạn vẫn có thể gắn theo tên vị trí.</p>}
        {selectedPoint?.id === currentId && <p className="mt-1 text-ink-soft">Vị trí này đang gắn với mặt bằng.</p>}
        {selectedPoint && <MutationForm key={selectedPoint.id} path={`${path}/location`} identity={identity} method="PUT"
          label="Lưu vị trí" fields={[{ name: "reason", label: "Lý do", type: "textarea", max: 500 }]}
          build={(body) => ({ ...body, locationId: selectedPoint.id })} onSaved={onSaved} />}
      </div>
    </>}
  </div>;
}
