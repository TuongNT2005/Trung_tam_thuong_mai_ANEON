"use client";


/**
 * ==============================================================================
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Bộ chuyển đổi vai trò nhân sự (BQL, Giám đốc, QLSK, Nhân viên quầy) trong chế độ thử nghiệm
 * Phiên bản: Version 1
 * ==============================================================================
 */
import { useEffect, useState, type FormEvent } from "react";
import { localIdentityEnabled, request, UUID_PATTERN, type Identity } from "@/lib/aneon-api";
import { ErrorMessage, Field, input, primary, secondary } from "./Ui";

export const staffRoles = {
  MANAGEMENT: "Ban quản lý", OPERATIONS: "Vận hành", DIRECTOR: "Giám đốc",
  MARKETING: "Marketing", ACCOUNTING: "Kế toán", SYSTEM_ADMIN: "Quản trị hệ thống",
};

type PresetAccount = { id: string; label: string; role: string };
const customerSessionKey = "aneon-local-customer";

/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Hook tùy chỉnh quản lý logic và trạng thái customer identity
 * Phiên bản: Version 1
 */
export function useCustomerIdentity() {
  const [identity, setIdentity] = useState<Identity>();
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (localIdentityEnabled) {
      try {
        const stored = JSON.parse(sessionStorage.getItem(customerSessionKey) ?? "null") as Identity | null;
        if (stored?.mode === "local" && stored.role === "CUSTOMER" && new RegExp(`^${UUID_PATTERN}$`).test(stored.actorId)) {
          setIdentity(stored);
        }
      } catch { /* The connection form is available when storage is unavailable. */ }
    }
    setRestored(true);
  }, []);

  /**
   * Người code: Kiên
   * Ngày code: 31/10/2026
   * Chức năng: Hàm xử lý nghiệp vụ connect
   * Phiên bản: Version 1
   */
  function connect(next?: Identity) {
    try {
      if (next?.mode === "local") sessionStorage.setItem(customerSessionKey, JSON.stringify(next));
      else sessionStorage.removeItem(customerSessionKey);
    } catch { /* The current connection still works without storage. */ }
    setIdentity(next);
  }

  return { identity, connect, restored };
}

/**
 * Người code: Kiên
 * Ngày code: 31/10/2026
 * Chức năng: Thành phần giao diện (Component) identity form hiển thị và xử lý tương tác người dùng
 * Phiên bản: Version 1
 */
export function IdentityForm({ onConnect, customer = false }: { onConnect: (identity: Identity) => void; customer?: boolean }) {
  const [mode, setMode] = useState<Identity["mode"]>(localIdentityEnabled ? "local" : "jwt");
  const [accounts, setAccounts] = useState<PresetAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [customActorId, setCustomActorId] = useState("");
  const [role, setRole] = useState("MANAGEMENT");
  const [loading, setLoading] = useState(localIdentityEnabled);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const selectedAccount = accounts.find((item) => item.id === selectedAccountId);

  useEffect(() => {
    if (mode !== "local") return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    request<PresetAccount[]>("shared/public-accounts", { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        const matching = data.filter((item) => customer ? item.role === "CUSTOMER" : Object.hasOwn(staffRoles, item.role));
        setAccounts(matching);
        const defaultRole = customer ? "CUSTOMER" : "MANAGEMENT";
        setSelectedAccountId((previous) => previous === "custom" || matching.some(({ id }) => id === previous)
          ? previous : matching.find((item) => item.role === defaultRole)?.id ?? matching[0]?.id ?? "");
      })
      .catch((err: Error) => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt, customer, mode]);

  /**
   * Người code: Kiên
   * Ngày code: 31/10/2026
   * Chức năng: Hàm xử lý nghiệp vụ connect
   * Phiên bản: Version 1
   */
  function connect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (mode === "jwt") {
      const token = String(form.get("token")).trim();
      if (token) onConnect({ mode, token });
      return;
    }
    const finalActorId = selectedAccountId === "custom" ? customActorId.trim() : selectedAccountId;
    if (!finalActorId) return;
    onConnect({
      mode,
      actorId: finalActorId,
      role: customer ? "CUSTOMER" : selectedAccount?.role ?? role,
      label: selectedAccount?.label,
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
            <select className={input} required value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)}>
              <option value="" disabled>{loading ? "Đang tải tài khoản…" : "— Chọn tài khoản —"}</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.label}
                </option>
              ))}
              <option value="custom">— Nhập UUID khác thủ công —</option>
            </select>
          </Field>
          {error && <div className="flex flex-wrap items-center gap-2"><ErrorMessage message={error} />
            <button type="button" className={secondary} onClick={() => setAttempt((value) => value + 1)}>Thử lại</button></div>}
          {!loading && !error && accounts.length === 0 && <p className="text-sm text-ink-soft">Chưa có tài khoản phù hợp. Hãy nạp dữ liệu demo rồi tải lại trang.</p>}
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
          {!customer && selectedAccount && <p className="text-sm text-ink-soft">Vai trò · {staffRoles[selectedAccount.role as keyof typeof staffRoles]}</p>}
          {!customer && selectedAccountId === "custom" && (
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
      <button type="submit" disabled={mode === "local" && !selectedAccountId} className={`${primary} justify-self-start disabled:opacity-50`}>Tiếp tục</button>
    </form>
  );
}
