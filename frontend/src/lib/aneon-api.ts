/**
 * ==============================================================================
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Thư viện API Client kết nối toàn bộ REST API giữa Next.js và Spring Boot, đồng bộ danh tính và xử lý lỗi
 * Phiên bản: Version 1
 * ==============================================================================
 */
export type Identity =
  | { mode: "jwt"; token: string }
  | { mode: "local"; actorId: string; role: string; zones: string; label?: string };

export type CheckInContext = {
  name: string;
  location?: string;
  startAt?: string;
  endAt?: string;
  state: "READY" | "UPCOMING" | "ENDED" | "INACTIVE" | "NO_QR" | "EXPIRED";
};

export type PublicStore = {
  code: string;
  name: string;
  category?: string;
  floor: string;
  zone: string;
  location?: string;
  operatingHours?: string;
  description?: string;
};

export type Page<T> = { content: T[]; page: number; size: number; totalElements: number };
export type OptionItem = { id: string; label: string; zoneId?: string };
export type ReferenceOptionsData = {
  zones: (OptionItem & { floorId: string })[];
  locations: OptionItem[];
  categories: OptionItem[];
  premises: (OptionItem & { remainingArea?: number })[];
  stores: OptionItem[];
  floors: OptionItem[];
  events: OptionItem[];
  vouchers: OptionItem[];
  promotions: OptionItem[];
  customerVouchers: (OptionItem & { customerId: string })[];
  invoices: (OptionItem & { customerId: string; verified: boolean })[];
  contracts: (OptionItem & { premiseId?: string })[];
  staff: OptionItem[];
};
export type ReferenceOptionMaps = {
  zones: Record<string, string>;
  locations: Record<string, string>;
  categories: Record<string, string>;
  premises: Record<string, string>;
  stores: Record<string, string>;
  floors: Record<string, string>;
  events: Record<string, string>;
  vouchers: Record<string, string>;
  promotions: Record<string, string>;
  customerVouchers: Record<string, string>;
  invoices: Record<string, string>;
  contracts: Record<string, string>;
  staff: Record<string, string>;
};

/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ to option record
 * Phiên bản: Version 1
 */
export function toOptionRecord(items?: OptionItem[]): Record<string, string> {
  const map: Record<string, string> = {};
  if (!items) return map;
  for (const item of items) {
    map[item.id] = item.label;
  }
  return map;
}
type Envelope<T> = {
  code?: number;
  data?: T;
  message?: string;
  errors?: { field: string; message: string }[];
};

export const UUID_PATTERN = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
export const localIdentityEnabled = process.env.NEXT_PUBLIC_ANEON_LOCAL_IDENTITY !== "false";

/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ identity headers
 * Phiên bản: Version 1
 */
function identityHeaders(identity?: Identity) {
  const headers = new Headers();
  if (identity?.mode === "jwt") headers.set("Authorization", `Bearer ${identity.token}`);
  if (identity?.mode === "local") {
    headers.set("X-Actor-Id", identity.actorId);
    headers.set("X-Actor-Roles", identity.role);
    if (identity.zones) headers.set("X-Actor-Zones", identity.zones);
  }
  return headers;
}

export async function request<T>(path: string, options: {
  identity?: Identity;
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
  nullable?: boolean;
} = {}): Promise<T> {
  const { identity, method, body, signal } = options;
  const headers = identityHeaders(identity);
  headers.set("Accept", "application/json");
  const multipart = body instanceof FormData;
  if (body !== undefined && !multipart) headers.set("Content-Type", "application/json");
  const response = await fetch(`/aneon-api/${path}`, {
    method, headers, signal, cache: "no-store",
    body: multipart ? body : body === undefined ? undefined : JSON.stringify(body),
  });
  const envelope: Envelope<T> | null = await response.json().catch(() => null);
  if (options.nullable && response.ok && envelope?.code === 200 && envelope.data === undefined) {
    return null as T;
  }
  if (!response.ok || envelope?.data === undefined) {
    const fields = envelope?.errors?.map(({ field, message }) => `${field} — ${message}`).join(". ");
    const message = {
      401: "Phiên truy cập không hợp lệ hoặc đã hết hạn.",
      403: "Tài khoản không có quyền thực hiện thao tác này.",
    }[response.status];
    throw new Error(message || fields || envelope?.message || "Không thể kết nối máy chủ ANEON. Vui lòng thử lại.");
  }
  return envelope.data;
}

/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ download attachment
 * Phiên bản: Version 1
 */
export async function downloadAttachment(path: string, identity: Identity, name: string) {
  const response = await fetch(`/aneon-api/${path}`, { headers: identityHeaders(identity), cache: "no-store" });
  if (!response.ok) throw new Error("Không tải được tệp đính kèm.");
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ query
 * Phiên bản: Version 1
 */
export function query(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return search.toString();
}

const dateFormat = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh",
});
/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Hàm tiện ích định dạng dữ liệu date
 * Phiên bản: Version 1
 */
export function formatDate(value?: string) {
  return value ? dateFormat.format(new Date(value)) : "—";
}

/**
 * Người code: Tường
 * Ngày code: 22/10/2026
 * Chức năng: Hàm xử lý nghiệp vụ check in status text
 * Phiên bản: Version 1
 */
export function checkInStatusText(context: CheckInContext) {
  switch (context.state) {
    case "UPCOMING": return `Check-in mở lúc ${formatDate(context.startAt)}.`;
    case "ENDED": return "Sự kiện đã kết thúc.";
    case "INACTIVE": return "Sự kiện chưa mở check-in.";
    case "NO_QR": return "Chưa có mã QR. Liên hệ Marketing để chuẩn bị mã check-in.";
    case "EXPIRED": return "Mã QR đã hết hạn. Vui lòng liên hệ quầy hỗ trợ.";
    case "READY": return `Đang nhận check-in đến ${formatDate(context.endAt)}.`;
  }
}
