import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/site";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [orders, bookings, products, reviews] = await Promise.all([
        supabase.from("orders").select("total,status,created_at,order_number,customer_name").order("created_at", { ascending: false }),
        supabase.from("bookings").select("id,status,booking_date,customer_name,slot_time").order("booking_date", { ascending: false }).limit(5),
        supabase.from("products").select("id,stock,name").order("stock"),
        supabase.from("reviews").select("id").eq("status", "pending"),
      ]);
      const all = orders.data ?? [];
      return {
        revenue: all.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0),
        orderCount: all.length,
        pendingOrders: all.filter((o) => o.status === "pending").length,
        recent: all.slice(0, 5),
        bookings: bookings.data ?? [],
        lowStock: (products.data ?? []).filter((p) => p.stock <= 5),
        pendingReviews: (reviews.data ?? []).length,
      };
    },
  });

  const s = stats.data;

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Revenue", value: s ? inr(s.revenue) : "—" },
          { label: "Orders", value: s?.orderCount ?? "—" },
          { label: "Pending orders", value: s?.pendingOrders ?? "—" },
          { label: "Reviews to approve", value: s?.pendingReviews ?? "—" },
        ].map((c) => (
          <div key={c.label} className="border border-border p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-display text-3xl">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="border border-border p-6">
          <h2 className="font-display text-2xl">Recent orders</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {s?.recent.length ? (
              s.recent.map((o) => (
                <li key={o.order_number} className="flex justify-between gap-3">
                  <span>{o.order_number} · {o.customer_name}</span>
                  <span>{inr(Number(o.total))}</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No orders yet.</li>
            )}
          </ul>
          <Link to="/admin/orders" className="mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-gold">
            All orders
          </Link>
        </div>

        <div className="border border-border p-6">
          <h2 className="font-display text-2xl">Upcoming consultations</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {s?.bookings.length ? (
              s.bookings.map((b) => (
                <li key={b.id} className="flex justify-between gap-3">
                  <span>{new Date(`${b.booking_date}T00:00:00`).toLocaleDateString("en-IN")} {b.slot_time}</span>
                  <span>{b.customer_name}</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No bookings yet.</li>
            )}
          </ul>
          <Link to="/admin/bookings" className="mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-gold">
            All bookings
          </Link>
        </div>
      </div>

      {s?.lowStock.length ? (
        <div className="border border-border p-6">
          <h2 className="font-display text-2xl">Low stock</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {s.lowStock.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="text-destructive">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
