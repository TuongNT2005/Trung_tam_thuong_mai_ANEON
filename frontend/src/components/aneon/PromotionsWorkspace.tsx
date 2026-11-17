"use client";

import { useState } from "react";
import { formatDate, type Identity } from "@/lib/aneon-api";
import { ErrorMessage, panel, secondary } from "./Ui";
import { useReferences } from "./ReferenceContext";
import { Action, allowed, Control, Details, MutationForm, useResource, type FormField, type Row } from "./WorkspaceUi";

const promotionTypes = { DISCOUNT: "Giảm giá", VOUCHER_GIVEAWAY: "Tặng voucher", POINT_ACCUMULATION: "Tích điểm" };
type PromotionType = keyof typeof promotionTypes;
type VoucherDiscountType = "FIXED_AMOUNT" | "PERCENTAGE";

const name: FormField = { name: "name", label: "Tên", required: true, max: 200, placeholder: "Ví dụ: Giảm giá mùa hè 2026" };
const code: FormField = {
  name: "code",
  label: "Mã",
  required: true,
  max: 50,
  pattern: "[A-Za-z0-9._\\-]+",
  placeholder: "Ví dụ: KM-HE-2026, KM-GOLD-01",
  helpText: "Chỉ gồm chữ cái, số, dấu chấm (.), gạch nối (-), gạch dưới (_)",
};
const starts: FormField = { name: "startAt", label: "Bắt đầu (giờ Việt Nam)", type: "datetime-local", required: true };
const ends: FormField = { ...starts, name: "endAt", label: "Kết thúc (giờ Việt Nam)" };
const minimum: FormField = { name: "minimumInvoiceAmount", label: "Giá trị hóa đơn tối thiểu (₫)", type: "number", min: 0, placeholder: "Ví dụ: 100000 (0 = không giới hạn)" };
const discountLimit: FormField = { name: "maximumDiscount", label: "Mức giảm tối đa (₫)", type: "number", min: 0, placeholder: "Ví dụ: 100000" };

export function PromotionsWorkspace({ identity, view }: { identity: Identity; view: "promotions" | "vouchers" }) {
  const { options: refOptions, refresh: refreshRef } = useReferences();
  const [type, setType] = useState<PromotionType>("DISCOUNT");
  const [voucherDiscountType, setVoucherDiscountType] = useState<VoucherDiscountType>("PERCENTAGE");
  const [promotionId, setPromotionId] = useState("");
  const [realtime, setRealtime] = useState({ id: "", revision: 0 });
  const realtimeData = useResource<Row>(realtime.id ? `f10/promotions/${encodeURIComponent(realtime.id)}/realtime` : undefined, identity, realtime.revision);
  const canCreatePromotion = allowed(identity, "MANAGEMENT", "MARKETING");
  const canApply = allowed(identity, "MARKETING", "OPERATIONS");

  const stores: FormField = { name: "participatingStoreIds", label: "Gian hàng áp dụng", type: "list", options: refOptions.stores };
  const voucher: FormField = { name: "voucherId", label: "Mẫu voucher", type: "uuid", required: true, options: refOptions.vouchers };
  const customer: FormField = { name: "customerId", label: "Khách mua sắm", type: "uuid", required: true, options: refOptions.customers };
  const invoice: FormField = { name: "invoiceId", label: "Hóa đơn mua hàng", type: "uuid", required: true, options: refOptions.invoices };
  const promotion: FormField = { name: "promotionId", label: "Chương trình khuyến mãi", type: "uuid", required: true, options: refOptions.promotions };

  const hasCustomerVouchers = Object.keys(refOptions.customerVouchers).length > 0;
  const voucherInstanceField: FormField = hasCustomerVouchers
    ? { name: "customerVoucherId", label: "Phiếu ưu đãi của khách", type: "uuid", options: refOptions.customerVouchers }
    : { name: "customerVoucherId", label: "Mã voucher của khách (UUID)", type: "uuid", placeholder: "Ví dụ: c0000000-0000-4000-8000-000000000001" };

  const typeFields: Record<PromotionType, FormField[]> = {
    DISCOUNT: [
      {
        name: "discountRatePercent",
        label: "Tỷ lệ giảm (%)",
        type: "number",
        min: 0.01,
        max: 100,
        step: "0.01",
        required: true,
        placeholder: "Ví dụ: 10, 15, 20 (tối đa 100%)",
        helpText: "Tỷ lệ giảm từ 0.01% đến 100%",
      },
      discountLimit,
    ],
    VOUCHER_GIVEAWAY: [voucher, { name: "totalToIssue", label: "Tổng số voucher phát hành", type: "number", min: 1, required: true, placeholder: "Ví dụ: 500" }],
    POINT_ACCUMULATION: [
      { name: "rewardPoints", label: "Điểm thưởng cố định", type: "number", min: 0, required: true, placeholder: "Ví dụ: 100" },
      { name: "conversionAmount", label: "Mức tiền quy đổi (₫)", type: "number", min: 1, required: true, placeholder: "Ví dụ: 100000" },
      { name: "pointsPerConversion", label: "Điểm trên mỗi mức quy đổi", type: "number", min: 1, required: true, placeholder: "Ví dụ: 10" },
    ],
  };

  if (view === "vouchers") {
    const isPercentage = voucherDiscountType === "PERCENTAGE";
    const voucherFields: FormField[] = [
      {
        name: "code",
        label: "Mã voucher",
        required: true,
        max: 50,
        pattern: "[A-Z0-9]+",
        autoUpper: true,
        placeholder: "Ví dụ: VCDEMO50, VOUCHER100K",
        helpText: "Chỉ gồm CHỮ IN HOA và SỐ (không dấu, không khoảng trắng, không gạch ngang)",
      },
      { ...name, label: "Tên voucher", placeholder: "Ví dụ: Giảm 20% tối đa 100K cho đơn từ 200K" },
      isPercentage
        ? {
            name: "value",
            label: "Tỷ lệ giảm (%)",
            type: "number",
            min: 0.01,
            max: 100,
            step: "0.01",
            required: true,
            placeholder: "Ví dụ: 10, 15, 20 (tối đa 100%)",
            helpText: "Giá trị tỷ lệ giảm từ 0.01% đến 100%",
          }
        : {
            name: "value",
            label: "Số tiền giảm (₫)",
            type: "number",
            min: 1000,
            step: "1000",
            required: true,
            placeholder: "Ví dụ: 20000, 50000, 100000",
            helpText: "Nhập số tiền giảm cố định (VNĐ)",
          },
      isPercentage
        ? {
            name: "maximumDiscount",
            label: "Mức giảm tối đa (₫) *",
            type: "number",
            min: 1,
            required: true,
            placeholder: "Ví dụ: 50000, 100000 (bắt buộc khi giảm %)",
            helpText: "Bắt buộc có mức giảm trần khi giảm theo %",
          }
        : {
            name: "maximumDiscount",
            label: "Mức giảm tối đa (₫)",
            type: "number",
            min: 0,
            required: false,
            placeholder: "Không áp dụng cho số tiền cố định (để trống)",
          },
      minimum,
      { name: "issuedLimit", label: "Giới hạn tổng phát hành (0 = không giới hạn)", type: "number", min: 0, placeholder: "Ví dụ: 1000 (0 = không giới hạn)" },
      { name: "perCustomerLimit", label: "Giới hạn mỗi khách (0 = không giới hạn)", type: "number", min: 0, placeholder: "Ví dụ: 1 (0 = không giới hạn)" },
      { ...starts, name: "validFrom" },
      { ...ends, name: "expiresAt", label: "Hết hạn (giờ Việt Nam)" },
      stores,
    ];

    return (
      <div className={`${panel} grid gap-3 sm:grid-cols-2 lg:grid-cols-3`}>
        {allowed(identity, "MANAGEMENT") && (
          <Action title="Tạo mẫu voucher">
            <div className="mt-4 max-w-sm">
              <Control
                field={{
                  name: "discountTypeSelector",
                  label: "Loại giảm giá",
                  options: { PERCENTAGE: "Phần trăm (%) — Giới hạn tối đa 100%", FIXED_AMOUNT: "Số tiền cố định (₫)" },
                  required: true,
                }}
                value={voucherDiscountType}
                onChange={(value) => {
                  if (value === "PERCENTAGE" || value === "FIXED_AMOUNT") setVoucherDiscountType(value);
                }}
              />
            </div>
            <MutationForm
              key={voucherDiscountType}
              identity={identity}
              path="f10/vouchers"
              label="Tạo mẫu voucher"
              fields={voucherFields}
              build={(data) => ({
                ...data,
                discountType: voucherDiscountType,
                maximumDiscount: isPercentage ? data.maximumDiscount : (data.maximumDiscount || null),
              })}
              onSaved={() => refreshRef()}
              resultView={(data) => (
                <Details
                  data={data}
                  columns={[
                    ["id", "Mã hệ thống (ID)"],
                    ["code", "Mã voucher"],
                    ["name", "Tên voucher"],
                  ]}
                />
              )}
            />
          </Action>
        )}
        {allowed(identity, "MARKETING", "OPERATIONS") && (
          <>
            <Action title="Phát voucher cho khách">
              <MutationForm
                identity={identity}
                path={(data) => `f10/vouchers/${encodeURIComponent(String(data.voucherId))}/issues`}
                label="Phát voucher"
                fields={[
                  voucher,
                  customer,
                  {
                    name: "issueReference",
                    label: "Mã tham chiếu lần phát (tùy chọn)",
                    max: 200,
                    placeholder: "Ví dụ: REF-202611-001 (để trống nếu không có)",
                  },
                ]}
                build={({ voucherId: _voucher, ...body }) => body}
                onSaved={() => refreshRef()}
                resultView={(data) => (
                  <Details
                    data={data}
                    columns={[
                      ["id", "UUID voucher của khách"],
                      ["voucherCode", "Mã voucher"],
                      ["duplicate", "Đã phát trước đó"],
                    ]}
                  />
                )}
              />
            </Action>
            <Action title="Sử dụng voucher">
              <MutationForm
                identity={identity}
                path={(data) => `f10/voucher-instances/${encodeURIComponent(String(data.customerVoucherId))}/redemptions`}
                label="Xác nhận sử dụng"
                fields={[{ ...voucherInstanceField, required: true }, invoice]}
                build={({ customerVoucherId: _voucher, ...body }) => ({
                  ...body,
                  idempotencyKey: `RED-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                })}
                onSaved={() => refreshRef()}
                resultView={(data) => (
                  <Details
                    data={data}
                    columns={[
                      ["status", "Trạng thái"],
                      ["redeemedAt", "Thời gian sử dụng", (value) => formatDate(value as string)],
                    ]}
                  />
                )}
              />
            </Action>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`${panel} grid gap-3 sm:grid-cols-2 lg:grid-cols-3`}>
      {canCreatePromotion && (
        <Action title="Tạo chương trình khuyến mãi">
          <div className="mt-4 max-w-sm">
            <Control
              field={{ name: "type", label: "Loại khuyến mãi", options: promotionTypes, required: true }}
              value={type}
              onChange={(value) => {
                if (value) setType(value as PromotionType);
              }}
            />
          </div>
          <MutationForm
            key={type}
            identity={identity}
            path="f10/promotions"
            label="Tạo chương trình"
            fields={[
              { ...code, label: "Mã chương trình", placeholder: "Ví dụ: KM-TET-2026, KM-GOLD-01" },
              { ...name, label: "Tên chương trình", placeholder: "Ví dụ: Khuyến mãi Mùa Mua Sắm Cuối Năm" },
              starts,
              ends,
              minimum,
              stores,
              { name: "targetTiers", label: "Hạng thành viên áp dụng", type: "list" },
              { name: "terms", label: "Điều kiện áp dụng", type: "textarea", max: 4000, placeholder: "Mô tả chi tiết thể lệ, điều kiện áp dụng khuyến mãi..." },
              { name: "publicVisible", label: "Hiển thị công khai", type: "checkbox" },
              ...typeFields[type],
            ]}
            build={(data) => {
              const { discountRatePercent, maximumDiscount, voucherId, totalToIssue, rewardPoints, conversionAmount, pointsPerConversion, ...body } = data;
              return {
                ...body,
                type,
                discount: type === "DISCOUNT" ? { discountRatePercent, maximumDiscount } : undefined,
                giveaway: type === "VOUCHER_GIVEAWAY" ? { voucherId, totalToIssue } : undefined,
                points: type === "POINT_ACCUMULATION" ? { rewardPoints, conversionAmount, pointsPerConversion } : undefined,
              };
            }}
            onSaved={(data) => {
              setPromotionId(String(data.id));
              refreshRef();
            }}
            resultView={(data) => (
              <Details
                data={data}
                columns={[
                  ["id", "Mã hệ thống (ID)"],
                  ["name", "Tên chương trình"],
                  ["status", "Trạng thái"],
                ]}
              />
            )}
          />
        </Action>
      )}
      {allowed(identity, "MANAGEMENT", "DIRECTOR", "MARKETING", "SYSTEM_ADMIN") && (
        <Action title="Theo dõi số liệu khuyến mãi">
          <form
            className="my-4 flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const id = String(new FormData(event.currentTarget).get("promotionId")).trim();
              setRealtime({ id, revision: realtime.revision + 1 });
            }}
          >
            <div className="min-w-56 flex-1">
              <Control key={promotionId} field={promotion} value={promotionId} />
            </div>
            <button type="submit" className={secondary} disabled={realtimeData.loading}>
              {realtimeData.loading ? "Đang tải…" : "Tra cứu số liệu"}
            </button>
          </form>
          {realtimeData.error && <ErrorMessage message={realtimeData.error} />}
          {realtimeData.data && (
            <Details
              data={realtimeData.data}
              columns={[
                ["promotionId", "Mã chương trình"],
                ["totalLimit", "Hạn mức"],
                ["issuedCount", "Đã phát"],
                ["remainingStock", "Tồn kho"],
                ["usedCount", "Đã sử dụng"],
                ["totalDiscountGranted", "Tổng tiền giảm (₫)"],
                ["totalPointsGranted", "Tổng điểm đã cấp"],
                ["lastUpdated", "Cập nhật", (value) => formatDate(value as string)],
              ]}
            />
          )}
        </Action>
      )}
      {canApply && (
        <Action title="Áp dụng khuyến mãi vào hóa đơn">
          <MutationForm
            identity={identity}
            path={(data) => `f10/promotions/${encodeURIComponent(String(data.promotionId))}/applications`}
            label="Áp dụng khuyến mãi"
            fields={[promotion, invoice, customer, voucherInstanceField]}
            build={({ promotionId: _promotion, ...body }) => ({
              ...body,
              idempotencyKey: `APP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            })}
            resultView={(data) => (
              <Details
                data={data}
                columns={[
                  ["discountAmount", "Số tiền giảm (₫)"],
                  ["pointsGranted", "Điểm được cấp"],
                  ["duplicate", "Đã áp dụng trước đó"],
                ]}
              />
            )}
          />
        </Action>
      )}
    </div>
  );
}
