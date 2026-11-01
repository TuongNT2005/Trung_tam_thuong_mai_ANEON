"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { request, toOptionRecord, type Identity, type ReferenceOptionMaps, type ReferenceOptionsData } from "@/lib/aneon-api";

const emptyRecords: ReferenceOptionMaps = {
  zones: {},
  locations: {},
  categories: {},
  premises: {},
  stores: {},
  floors: {},
  events: {},
  vouchers: {},
  promotions: {},
  customerVouchers: {},
  invoices: {},
  contracts: {},
  staff: {},
};

type ReferenceContextValue = {
  options: ReferenceOptionMaps;
  raw?: ReferenceOptionsData;
  loading: boolean;
  error: string;
  refresh: () => void;
};

const ReferenceContext = createContext<ReferenceContextValue>({
  options: emptyRecords,
  loading: false,
  error: "",
  refresh: () => {},
});

/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Thành phần giao diện (Component) reference provider hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export function ReferenceProvider({ identity, children, enabled = true }: { identity: Identity; children: ReactNode; enabled?: boolean }) {
  const [data, setData] = useState<ReferenceOptionsData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    setError("");
    request<ReferenceOptionsData>("shared/reference-options", { identity })
      .then((res) => {
        if (active) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(`Không tải được danh mục dùng trong biểu mẫu. ${(err as Error).message}`);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [enabled, identity, revision]);

  const options: ReferenceOptionMaps = {
    zones: toOptionRecord(data?.zones),
    locations: toOptionRecord(data?.locations),
    categories: toOptionRecord(data?.categories),
    premises: toOptionRecord(data?.premises),
    stores: toOptionRecord(data?.stores),
    floors: toOptionRecord(data?.floors),
    events: toOptionRecord(data?.events),
    vouchers: toOptionRecord(data?.vouchers),
    promotions: toOptionRecord(data?.promotions),
    customerVouchers: toOptionRecord(data?.customerVouchers),
    invoices: toOptionRecord(data?.invoices),
    contracts: toOptionRecord(data?.contracts),
    staff: toOptionRecord(data?.staff),
  };

  return (
    <ReferenceContext.Provider value={{ options, raw: data, error, loading, refresh: () => setRevision((r) => r + 1) }}>
      {children}
    </ReferenceContext.Provider>
  );
}

/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Hook tùy chỉnh quản lý logic và trạng thái references
 * Phiên bản: Version 1
 */
export function useReferences() {
  return useContext(ReferenceContext);
}
