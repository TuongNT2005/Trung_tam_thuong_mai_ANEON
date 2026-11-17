"use client";

import { useEffect, useState, type FormEvent } from "react";
import { localIdentityEnabled, UUID_PATTERN, type Identity } from "@/lib/aneon-api";
import { Field, input, primary } from "./Ui";

export const staffRoles = {
  MANAGEMENT: "Ban quản lý", OPERATIONS: "Vận hành", DIRECTOR: "Giám đốc",
  MARKETING: "Marketing", ACCOUNTING: "Kế toán", SYSTEM_ADMIN: "Quản trị hệ thống",
};

type PresetAccount = { id: string; label: string; role: string };

const defaultPresets: PresetAccount[] = [
  { id: "11111111-1111-1111-1111-111111111111", label: "Ban quản lý demo (aneon-demo-management)", role: "MANAGEMENT" },
  { id: "22222222-2222-2222-2222-222222222222", label: "Marketing demo (aneon-demo-marketing)", role: "MARKETING" },
  { id: "00000000-0000-0000-0000-000000000001", label: "Ban Giám Đốc (giamdoc)", role: "DIRECTOR" },
  { id: "00000000-0000-0000-0000-000000000004", label: "Ban Vận Hành (vanhanh)", role: "OPERATIONS" },
  { id: "00000000-0000-0000-0000-000000000002", label: "Ban Quản Lý Mặt Bằng (quanly)", role: "MANAGEMENT" },
  { id: "33333333-3333-3333-3333-333333333333", label: "Khách demo (aneon-demo-customer)", role: "CUSTOMER" },
];

export function IdentityForm({ onConnect, customer = false }: { onConnect: (identity: Identity) => void; customer?: boolean }) {
  const [mode, setMode] = useState<Identity["mode"]>(localIdentityEnabled ? "local" : "jwt");
  const [accounts, setAccounts] = useState<PresetAccount[]>(defaultPresets);
  const [selectedAccountId, setSelectedAccountId] = useState(customer ? "33333333-3333-3333-3333-333333333333" : "11111111-1111-1111-1111-111111111111");
  const [customActorId, setCustomActorId] = useState("");
  const [role, setRole] = useState(customer ? "CUSTOMER" : "MANAGEMENT");

  useEffect(() => {
    fetch("/aneon-api/shared/public-accounts")
      .then((r) => r.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          const list: PresetAccount[] = json.data.map((item: { id: string; label: string }) => {
            let detectedRole = "MANAGEMENT";
            const upper = item.label.toUpperCase();
            if (upper.includes("MARKETING")) detectedRole = "MARKETING";
            else if (upper.includes("GIAM DOC") || upper.includes("DIRECTOR")) detectedRole = "DIRECTOR";
            else if (upper.includes("VAN HANH") || upper.includes("OPERATIONS")) detectedRole = "OPERATIONS";
            else if (upper.includes("KHACH") || upper.includes("CUSTOMER")) detectedRole = "CUSTOMER";
            else if (upper.includes("KE TOAN") || upper.includes("ACCOUNTING")) detectedRole = "ACCOUNTING";
            return { id: item.id, label: item.label, role: detectedRole };
          });
          setAccounts(list);
        }
      })
      .catch(() => {});
  }, []);

  function handleAccountSelect(id: string) {
    setSelectedAccountId(id);
    if (id !== "custom") {
      const match = accounts.find((a) => a.id === id);
      if (match && !customer) {
        setRole(match.role);
      }
    }
  }

  function connect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (mode === "jwt") {
      const token = String(form.get("token")).trim();
      if (token) onConnect({ mode, token });
      return;
    }
    const finalActorId = selectedAccountId === "custom" ? customActorId.trim() : selectedAccountId;
    onConnect({
      mode,
      actorId: finalActorId,
      role: customer ? "CUSTOMER" : role,
      zones: String(form.get("zones") ?? "").trim(),
    });
  }

  return (
    <form onSubmit={connect} className="grid gap-4">
      {localIdentityEnabled && (
        <Field label="Cách kết nối">
          <select className={input} value={mode} onChange={(event) => setMode(event.target.value as Identity["mode"])}>
            <option value="local">Tài khoản thử nghiệm (local)</option>
            <option value="jwt">Token truy cập</option>
          </select>
        </Field>
      )}
      {mode === "jwt" ? (
        <Field label="Token truy cập">
          <input name="token" className={input} type="password" required autoComplete="off" spellCheck={false} placeholder="Token do hệ thống định danh cấp" />
        </Field>
      ) : (
        <>
          <Field label="Chọn tài khoản có sẵn">
            <select className={input} value={selectedAccountId} onChange={(e) => handleAccountSelect(e.target.value)}>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.label}
                </option>
              ))}
              <option value="custom">— Nhập UUID khác thủ công —</option>
            </select>
          </Field>
          {selectedAccountId === "custom" && (
            <Field label="UUID tài khoản">
              <input
                name="actorId"
                required
                pattern={UUID_PATTERN}
                className={input}
                autoComplete="off"
                placeholder="00000000-0000-0000-0000-000000000000"
                value={customActorId}
                onChange={(e) => setCustomActorId(e.target.value)}
              />
            </Field>
          )}
          {!customer && (
            <>
              <Field label="Vai trò">
                <select name="role" className={input} value={role} onChange={(e) => setRole(e.target.value)}>
                  {Object.entries(staffRoles).map(([val, lbl]) => (
                    <option key={val} value={val}>
                      {lbl}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Phạm vi khu vực (tùy chọn)">
                <input name="zones" placeholder="Các UUID cách nhau bằng dấu phẩy" className={input} />
              </Field>
            </>
          )}
        </>
      )}
      <button type="submit" className={`${primary} justify-self-start`}>Tiếp tục</button>
    </form>
  );
}
