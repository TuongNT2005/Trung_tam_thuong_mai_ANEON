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
  customers: {},
  customerVouchers: {},
  invoices: {},
  contracts: {},
  staff: {},
};

type ReferenceContextValue = {
  options: ReferenceOptionMaps;
  raw?: ReferenceOptionsData;
  loading: boolean;
  refresh: () => void;
};

const ReferenceContext = createContext<ReferenceContextValue>({
  options: emptyRecords,
  loading: false,
  refresh: () => {},
});

export function ReferenceProvider({ identity, children }: { identity: Identity; children: ReactNode }) {
  const [data, setData] = useState<ReferenceOptionsData>();
  const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    request<ReferenceOptionsData>("shared/reference-options", { identity })
      .then((res) => {
        if (active) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Khong tai duoc danh sach tham chieu:", err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [identity, revision]);

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
    customers: toOptionRecord(data?.customers),
    customerVouchers: toOptionRecord(data?.customerVouchers),
    invoices: toOptionRecord(data?.invoices),
    contracts: toOptionRecord(data?.contracts),
    staff: toOptionRecord(data?.staff),
  };

  return (
    <ReferenceContext.Provider value={{ options, raw: data, loading, refresh: () => setRevision((r) => r + 1) }}>
      {children}
    </ReferenceContext.Provider>
  );
}

export function useReferences() {
  return useContext(ReferenceContext);
}
