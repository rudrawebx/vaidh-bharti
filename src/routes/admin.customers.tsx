import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
      const key = o.phone;
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

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Customers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Built from placed orders — {rows.length} customer{rows.length === 1 ? "" : "s"} so far.
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, city…"
          className="rounded-sm border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-6 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3">Total spend</th>
              <th className="px-5 py-3">Last order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.key} className="border-b border-border/60">
                <td className="px-5 py-3 font-medium">{r.name}</td>
                <td className="px-5 py-3">
                  <a href={`tel:${r.phone}`} className="text-primary hover:text-gold">
                    {r.phone}
                  </a>
                  {r.email ? <div className="text-xs text-muted-foreground">{r.email}</div> : null}
                </td>
                <td className="px-5 py-3">{r.city}</td>
                <td className="px-5 py-3">{r.orders}</td>
                <td className="px-5 py-3">{inr(r.spend)}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(r.last).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  {orders.isLoading ? "Loading…" : "No customers yet."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
