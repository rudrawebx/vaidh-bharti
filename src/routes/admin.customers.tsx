import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileSpreadsheet, MessageCircle, Phone, Mail, Search, Users, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/site";

export const Route = createFileRoute("/admin/customers")({ component: AdminCustomers });

type Row = {
  key: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  orders: number;
  spend: number;
  last: string;
};

function exportCustomersCsv(rows: Row[]) {
  if (!rows.length) {
    toast.error("No customers to export.");
    return;
  }

  const headers = ["Customer Name", "Phone", "Email", "City", "Orders Count", "Total Spend (INR)", "Last Order Date"];
  const csvRows = rows.map((r) => [
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.phone}"`,
    `"${r.email || ""}"`,
    `"${r.city || ""}"`,
    r.orders,
    r.spend,
    `"${new Date(r.last).toLocaleDateString("en-IN")}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `vaidh-bharti-customers-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`Exported ${rows.length} customers to CSV.`);
}

function AdminCustomers() {
  const [query, setQuery] = React.useState("");

  const orders = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () =>
      (
        await supabase
          .from("orders")
          .select("customer_name, phone, email, city, total, created_at, status")
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const rows: Row[] = React.useMemo(() => {
    const map = new Map<string, Row>();
    for (const o of orders.data ?? []) {
      if (o.status === "cancelled") continue;
      const key = (o.phone || "").trim();
      if (!key) continue;
      const existing = map.get(key);
      if (existing) {
        existing.orders += 1;
        existing.spend += Number(o.total);
        if (!existing.email && o.email) existing.email = o.email;
      } else {
        map.set(key, {
          key,
          name: o.customer_name,
          phone: o.phone,
          email: o.email,
          city: o.city,
          orders: 1,
          spend: Number(o.total),
          last: o.created_at,
        });
      }
    }
    return [...map.values()].sort((a, b) => b.spend - a.spend);
  }, [orders.data]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          (r.email ?? "").toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q),
      )
    : rows;

  const totalLTV = rows.reduce((s, r) => s + r.spend, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl">Customer Directory</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Aggregate customer profiles, order history, lifetime value, and direct WhatsApp contact.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => exportCustomersCsv(filtered)}
            className="flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-muted"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-border bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Total Customers</p>
          <p className="mt-1 font-display text-2xl">{rows.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Placed at least 1 verified order</p>
        </div>
        <div className="rounded-sm border border-border bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Customer Lifetime Value (LTV)</p>
          <p className="mt-1 font-display text-2xl text-emerald-800">{inr(totalLTV)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Cumulative customer purchases</p>
        </div>
        <div className="rounded-sm border border-border bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Average Spend per Patient</p>
          <p className="mt-1 font-display text-2xl">
            {rows.length > 0 ? inr(Math.round(totalLTV / rows.length)) : inr(0)}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Repeat customer retention index</p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border bg-card p-4">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer name, phone, email, or city…"
            className="h-11 w-full rounded-sm border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3 text-center">Orders</th>
              <th className="px-5 py-3 text-right">Lifetime Spend</th>
              <th className="px-5 py-3">Last Order</th>
              <th className="px-5 py-3 text-right">Quick Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((r) => {
              const cleanPhone = r.phone.replace(/[^0-9]/g, "");
              return (
                <tr key={r.key} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-semibold text-foreground">{r.name}</td>
                  <td className="px-5 py-3">
                    <a href={`tel:${r.phone}`} className="text-foreground hover:text-gold">
                      {r.phone}
                    </a>
                    {r.email ? <div className="text-xs text-muted-foreground">{r.email}</div> : null}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.city}</td>
                  <td className="px-5 py-3 text-center font-mono font-medium">{r.orders}</td>
                  <td className="px-5 py-3 text-right font-display font-semibold text-foreground">{inr(r.spend)}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">
                    {new Date(r.last).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Namaste ${r.name}, greetings from Vaidh Bharti Ayurveda! How is your health and wellness journey going? Let us know if you need refilling of your Ayurvedic formulations.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-sm bg-[#25D366] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#20bd5a]"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="h-3 w-3" />
                        WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  {orders.isLoading ? "Loading customer directory…" : "No customer records match your search."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
