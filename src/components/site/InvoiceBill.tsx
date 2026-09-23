import * as React from "react";
import { Printer, Download, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { inr, site } from "@/lib/site";

export interface InvoiceItem {
  name: string;
  variant?: string | null;
  sku?: string | null;
  quantity: number;
  unit_price: number;
  subtotal?: number;
}

export interface InvoiceData {
  order_number: string;
  invoice_number?: string | null;
  invoice_date?: string | null;
  created_at: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  coupon_code?: string | null;
  tax_amount?: number;
  total: number;
  courier?: string | null;
  tracking_number?: string | null;
  notes?: string | null;
  order_items: InvoiceItem[];
}

function numberToIndianWords(num: number): string {
  const rounded = Math.round(num);
  if (rounded === 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertSection(n: number): string {
    if (n === 0) return "";
    if (n < 20) return a[n] + " ";
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "") + " ";
    return a[Math.floor(n / 100)] + " Hundred " + (n % 100 !== 0 ? convertSection(n % 100) : "");
  }

  let words = "";
  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const hundred = rounded % 1000;

  if (crore > 0) words += convertSection(crore) + "Crore ";
  if (lakh > 0) words += convertSection(lakh) + "Lakh ";
  if (thousand > 0) words += convertSection(thousand) + "Thousand ";
  if (hundred > 0) words += convertSection(hundred);

  return words.trim() + " Rupees Only";
}

export function InvoiceBill({
  order,
  onClose,
  showActions = true,
}: {
  order: InvoiceData;
  onClose?: () => void;
  showActions?: boolean;
}) {
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = order.invoice_number || `INV-${order.order_number.replace(/^VB-/, "")}`;
  const invoiceDate = order.invoice_date || order.created_at;
  const isPaid = order.payment_status === "paid";
  const isCOD = order.payment_method === "cod";

  return (
    <div className="invoice-container bg-white text-[#1c2b21] print:m-0 print:p-0">
      {/* Action Bar (hidden during browser printing) */}
      {showActions && (
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Official Tax Invoice · {order.order_number}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      )}

      {/* Printable Invoice Sheet */}
      <div
        ref={printRef}
        id="printable-invoice"
        className="mx-auto max-w-[800px] border border-[#e2e8f0] bg-white p-8 font-sans text-sm shadow-sm print:border-none print:p-0 print:shadow-none"
      >
        {/* Header with Vaidh Bharti Identity */}
        <div className="border-b-2 border-[#1c2b21] pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/brand-logo.png"
                  alt="Vaidh Bharti Ayurveda"
                  className="h-14 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text if image not loaded
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1c2b21]">
                    VAIDH BHARTI AYURVEDA
                  </h1>
                  <p className="text-[11px] font-medium tracking-[0.15em] text-[#8c734b] uppercase">
                    Authentic Ayurvedic Pharmacy &amp; Wellness Clinic
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#4a5568]">
                {site.address.line1}, {site.address.line2}, {site.address.line3}
                <br />
                Phone: <span className="font-medium text-[#1c2b21]">{site.phoneDisplay}</span> · Email:{" "}
                <span className="font-medium text-[#1c2b21]">{site.email}</span>
                <br />
                Website: <span className="text-[#8c734b]">https://vaidhbharti.com</span>
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block rounded-sm bg-[#1c2b21] px-3 py-1 font-serif text-xs font-semibold tracking-wider text-white uppercase">
                Tax Invoice / Retail Bill
              </span>
              <table className="mt-3 text-xs text-right ml-auto">
                <tbody>
                  <tr>
                    <td className="pr-2 font-semibold text-[#4a5568]">Invoice No:</td>
                    <td className="font-mono font-bold text-[#1c2b21]">{invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold text-[#4a5568]">Invoice Date:</td>
                    <td className="text-[#1c2b21]">
                      {new Date(invoiceDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold text-[#4a5568]">Order Ref:</td>
                    <td className="font-mono text-[#1c2b21]">{order.order_number}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customer & Payment Badge Row */}
        <div className="mt-6 grid grid-cols-2 gap-6 border-b border-[#e2e8f0] pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c734b]">
              Billed &amp; Shipped To
            </p>
            <p className="mt-1 font-semibold text-[#1c2b21]">{order.customer_name}</p>
            <p className="mt-0.5 text-xs text-[#4a5568]">
              Phone: <span className="font-medium text-[#1c2b21]">{order.phone}</span>
              {order.email ? <><br />Email: <span>{order.email}</span></> : null}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#4a5568]">
              {order.address_line1}
              {order.address_line2 ? `, ${order.address_line2}` : ""}
              <br />
              {order.city}, {order.state} — <span className="font-semibold">{order.pincode}</span>
            </p>
          </div>

          <div className="rounded-sm bg-[#f8faf7] border border-[#e2e8f0] p-4 text-xs">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c734b]">
              Payment &amp; Dispatch Status
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[#4a5568]">Payment Mode:</span>
                <span className="font-semibold text-[#1c2b21]">
                  {isCOD ? "Cash on Delivery (COD)" : "Online Prepaid (Razorpay/UPI)"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4a5568]">Payment Status:</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                    isPaid
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isPaid ? "PAID" : "COLLECT ON DELIVERY (UNPAID)"}
                </span>
              </div>
              {order.courier ? (
                <div className="flex justify-between items-center pt-1 border-t border-[#e2e8f0]">
                  <span className="text-[#4a5568]">Courier Partner:</span>
                  <span className="font-medium text-[#1c2b21]">{order.courier}</span>
                </div>
              ) : null}
              {order.tracking_number ? (
                <div className="flex justify-between items-center">
                  <span className="text-[#4a5568]">AWB / Tracking:</span>
                  <span className="font-mono font-medium text-[#1c2b21]">{order.tracking_number}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Itemized Order Table */}
        <div className="mt-6">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#1c2b21] bg-[#f8faf7]">
                <th className="py-2.5 px-3 font-semibold uppercase tracking-[0.1em] text-[#1c2b21]">#</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-[0.1em] text-[#1c2b21]">Description &amp; Pack Size</th>
                <th className="py-2.5 px-3 text-right font-semibold uppercase tracking-[0.1em] text-[#1c2b21]">Rate</th>
                <th className="py-2.5 px-3 text-center font-semibold uppercase tracking-[0.1em] text-[#1c2b21]">Qty</th>
                <th className="py-2.5 px-3 text-right font-semibold uppercase tracking-[0.1em] text-[#1c2b21]">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {(order.order_items || []).map((item, idx) => {
                const itemTotal = Number(item.unit_price) * item.quantity;
                return (
                  <tr key={idx} className="hover:bg-[#fcfdfa]">
                    <td className="py-3 px-3 text-[#718096]">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-[#1c2b21]">{item.name}</p>
                      {item.variant ? (
                        <p className="text-[11px] text-[#718096]">Pack Size: {item.variant}</p>
                      ) : null}
                      {item.sku ? (
                        <p className="text-[10px] font-mono text-[#a0aec0]">SKU: {item.sku}</p>
                      ) : null}
                    </td>
                    <td className="py-3 px-3 text-right text-[#1c2b21]">{inr(Number(item.unit_price))}</td>
                    <td className="py-3 px-3 text-center text-[#1c2b21]">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-medium text-[#1c2b21]">{inr(itemTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Amount in Words */}
        <div className="mt-6 grid grid-cols-2 gap-6 border-t border-[#e2e8f0] pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8c734b]">
              Amount Chargeable (in words)
            </p>
            <p className="mt-1 text-xs italic font-medium text-[#1c2b21]">
              {numberToIndianWords(Number(order.total))}
            </p>

            {order.notes && (
              <div className="mt-4 rounded-sm bg-[#fafafa] p-2.5 border border-[#edf2f7] text-[11px] text-[#718096]">
                <strong className="text-[#4a5568]">Customer Delivery Note:</strong> {order.notes}
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-right">
            <div className="flex justify-between">
              <span className="text-[#718096]">Subtotal:</span>
              <span className="font-medium text-[#1c2b21]">{inr(Number(order.subtotal))}</span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.coupon_code || "Coupon"}):</span>
                <span>−{inr(Number(order.discount_amount))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#718096]">Shipping &amp; Handling:</span>
              <span className="font-medium text-[#1c2b21]">
                {Number(order.shipping_amount) === 0 ? "FREE" : inr(Number(order.shipping_amount))}
              </span>
            </div>
            {Number(order.tax_amount) > 0 && (
              <div className="flex justify-between">
                <span className="text-[#718096]">Estimated GST / Taxes:</span>
                <span className="font-medium text-[#1c2b21]">{inr(Number(order.tax_amount))}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-[#1c2b21] pt-2 text-sm">
              <span className="font-serif font-bold text-[#1c2b21]">Grand Total:</span>
              <span className="font-serif font-bold text-base text-[#1c2b21]">
                {inr(Number(order.total))}
              </span>
            </div>
          </div>
        </div>

        {/* Terms & Authorized Signatory */}
        <div className="mt-8 border-t border-[#e2e8f0] pt-6">
          <div className="grid grid-cols-2 gap-8 items-end">
            <div className="text-[11px] text-[#718096] space-y-1">
              <p className="font-semibold text-[#4a5568]">Terms &amp; Conditions:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                <li>Ayurvedic medicines are prepared strictly according to classical classical texts.</li>
                <li>Store in a cool, dry place away from direct sunlight.</li>
                <li>Returns accepted within 7 days of delivery for sealed &amp; unopened bottles.</li>
                <li>For dosage or wellness guidance, contact our Ayurvedic doctors.</li>
              </ul>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold text-[#1c2b21]">For Vaidh Bharti Ayurveda</p>
              <div className="mt-8">
                <p className="font-serif font-medium text-xs text-[#1c2b21]">Jitender Bharti</p>
                <p className="text-[10px] text-[#718096]">Founder &amp; Chief Ayurvedic Practitioner</p>
                <p className="text-[9px] text-[#a0aec0]">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Footer Note */}
        <div className="mt-6 border-t border-[#edf2f7] pt-3 text-center text-[10px] text-[#a0aec0]">
          Thank you for choosing authentic Ayurvedic wellness · Vaidh Bharti
        </div>
      </div>
    </div>
  );
}
