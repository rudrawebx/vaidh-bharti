import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { inr, site } from "@/lib/site";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const statuses = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;
const paymentStatuses = ["pending", "paid", "refunded", "failed"] as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
function printInvoice(o: any) {
  const rows = (o.order_items ?? [])
    .map(
      (i: any) =>
        `<tr><td>${i.product_name}${i.variant_label ? ` (${i.variant_label})` : ""}</td><td style="text-align:center">${i.quantity}</td><td style="text-align:right">${inr(
          Number(i.unit_price),
        )}</td><td style="text-align:right">${inr(Number(i.unit_price) * i.quantity)}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${o.order_number}</title>
<style>body{font-family:Georgia,serif;color:#1c2b21;padding:32px;max-width:760px;margin:auto}
h1{font-size:22px;margin:0}table{width:100%;border-collapse:collapse;margin-top:20px;font-size:14px}
th,td{border-bottom:1px solid #ddd;padding:8px}th{text-align:left;font-size:11px;letter-spacing:.12em;text-transform:uppercase}
.tot{margin-top:16px;font-size:14px;text-align:right}small{color:#666}</style></head><body>
<h1>${site.name}</h1><small>${site.address}<br/>${site.phoneDisplay} · ${site.email}</small>
<h2 style="font-size:16px;margin-top:24px">Invoice ${o.order_number}</h2>
<small>${new Date(o.created_at).toLocaleString("en-IN")} · ${o.payment_method.toUpperCase()} · payment ${o.payment_status}</small>
<p style="font-size:14px;margin-top:16px"><strong>${o.customer_name}</strong><br/>${o.phone}${o.email ? `<br/>${o.email}` : ""}<br/>
${o.address_line1}${o.address_line2 ? `, ${o.address_line2}` : ""}<br/>${o.city}, ${o.state} ${o.pincode}</p>
<table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<div class="tot">Subtotal: ${inr(Number(o.subtotal))}<br/>Shipping: ${inr(Number(o.shipping_amount))}<br/>Discount: −${inr(
    Number(o.discount_amount),
  )}<br/><strong style="font-size:18px">Total: ${inr(Number(o.total))}</strong></div>
<p style="margin-top:28px;font-size:11px;color:#666">Thank you for shopping with ${site.name}.</p>
</body></html>`;
  const w = window.open("", "_blank");
  if (!w) {
    toast.error("Please allow pop-ups to print the invoice.");
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

function AdminOrders() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");

  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () =>
      (
        await supabase
          .from("orders")
          .select(
            "id,order_number,status,payment_status,payment_method,total,subtotal,shipping_amount,discount_amount,coupon_code,tracking_number,courier,created_at,customer_name,phone,email,address_line1,address_line2,city,state,pincode,notes,order_items(product_name,variant_label,quantity,unit_price)",
          )
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const update = async (id: string, patch: Partial<{ status: string; payment_status: string; courier: string | null; tracking_number: string | null }>) => {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) toast.error("Could not update the order.");
    else toast.success("Order updated.");
    void orders.refetch();
  };

  const list = (orders.data ?? []).filter((o: any) => {
    if (filter !== "all" && o.status !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${o.order_number} ${o.customer_name} ${o.phone} ${o.email ?? ""} ${o.city}`.toLowerCase().includes(q);
  });

  const revenue = list.filter((o: any) => o.status !== "cancelled").reduce((s: number, o: any) => s + Number(o.total), 0);
  const select = "h-11 rounded-sm border border-input bg-card px-3 text-sm";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          aria-label="Search orders"
          placeholder="Search order number, name, phone"
          className="h-11 w-64 rounded-sm border border-input bg-card px-3 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select aria-label="Filter by status" className={select} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {list.length} orders · {inr(revenue)}
        </p>
      </div>

      <ul className="mt-6 space-y-4">
        {list.length ? (
          list.map((o: any) => (
            <li key={o.id} className="border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl">{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("en-IN")} · {o.payment_method}
                    {o.coupon_code ? ` · coupon ${o.coupon_code}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-xl">{inr(Number(o.total))}</span>
                  <select
                    aria-label={`Order status for ${o.order_number}`}
                    value={o.status}
                    onChange={(e) => void update(o.id, { status: e.target.value })}
                    className={select}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    aria-label={`Payment status for ${o.order_number}`}
                    value={o.payment_status}
                    onChange={(e) => void update(o.id, { payment_status: e.target.value })}
                    className={select}
                  >
                    {paymentStatuses.map((s) => (
                      <option key={s} value={s}>payment {s}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => printInvoice(o)}
                    className="rounded-sm border border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
                  >
                    Invoice
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                <div>
                  <p className="text-primary">{o.customer_name}</p>
                  <p>{o.phone}</p>
                  {o.email ? <p>{o.email}</p> : null}
                  <p className="mt-2">
                    {o.address_line1}
                    {o.address_line2 ? `, ${o.address_line2}` : ""}, {o.city}, {o.state} {o.pincode}
                  </p>
                  {o.notes ? <p className="mt-2 italic">“{o.notes}”</p> : null}
                </div>
                <ul>
                  {(o.order_items ?? []).map((i: any, idx: number) => (
                    <li key={idx}>
                      {i.product_name}
                      {i.variant_label ? ` · ${i.variant_label}` : ""} × {i.quantity} — {inr(Number(i.unit_price) * i.quantity)}
                    </li>
                  ))}
                  <li className="mt-2 text-xs">
                    Subtotal {inr(Number(o.subtotal))} · Shipping {inr(Number(o.shipping_amount))} · Discount −{inr(Number(o.discount_amount))}
                  </li>
                </ul>
              </div>

              <form
                className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const courier = (form.elements.namedItem("courier") as HTMLInputElement).value.trim();
                  const tracking = (form.elements.namedItem("tracking") as HTMLInputElement).value.trim();
                  void update(o.id, { courier: courier || null, tracking_number: tracking || null });
                }}
              >
                <div>
                  <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground" htmlFor={`c-${o.id}`}>Courier</label>
                  <input id={`c-${o.id}`} name="courier" defaultValue={o.courier ?? ""} className="mt-2 h-11 w-44 rounded-sm border border-input bg-card px-3 text-sm" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground" htmlFor={`t-${o.id}`}>Tracking number</label>
                  <input id={`t-${o.id}`} name="tracking" defaultValue={o.tracking_number ?? ""} className="mt-2 h-11 w-56 rounded-sm border border-input bg-card px-3 text-sm" />
                </div>
                <button type="submit" className="rounded-sm border border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                  Save shipping
                </button>
              </form>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground">No orders match this view.</li>
        )}
      </ul>
    </div>
  );
}
