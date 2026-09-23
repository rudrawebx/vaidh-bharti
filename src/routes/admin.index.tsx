import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Calendar,
  Truck,
  ArrowRight,
  Database,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/site";
import { seedCatalogToDatabase } from "@/lib/catalog.functions";
import { getAdminDashboardStats } from "@/lib/orders.functions";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const [seeding, setSeeding] = React.useState(false);

  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const data = await getAdminDashboardStats();
      const allOrders = data.orders ?? [];
      const activeOrders = allOrders.filter((o) => o.status !== "cancelled");
      const totalRevenue = activeOrders.reduce((s, o) => s + Number(o.total), 0);
      const paidRevenue = activeOrders
        .filter((o) => o.payment_status === "paid")
        .reduce((s, o) => s + Number(o.total), 0);
      const codPendingRevenue = activeOrders
        .filter((o) => o.payment_method === "cod" && o.payment_status !== "paid")
        .reduce((s, o) => s + Number(o.total), 0);

      const aov = activeOrders.length > 0 ? Math.round(totalRevenue / activeOrders.length) : 0;
      const pendingFulfillment = allOrders.filter(
        (o) => o.status === "pending" || o.status === "confirmed" || o.status === "packed",
      ).length;
      const inTransit = allOrders.filter((o) => o.status === "shipped").length;

      return {
        totalRevenue,
        paidRevenue,
        codPendingRevenue,
        orderCount: allOrders.length,
        activeOrderCount: activeOrders.length,
        aov,
        pendingFulfillment,
        inTransit,
        recentOrders: allOrders.slice(0, 6),
        bookings: data.bookings ?? [],
        lowStock: (data.products ?? []).filter((p: any) => (p.stock ?? 0) <= 5),
        totalProducts: (data.products ?? []).length,
        pendingReviews: data.pendingReviewsCount ?? 0,
      };
    },
  });

  const handleSeedCatalog = async () => {
    if (!window.confirm("Seed/Sync the 18 master Ayurvedic packaging SKUs and variants into your Supabase database?")) {
      return;
    }
    setSeeding(true);
    try {
      const res = await seedCatalogToDatabase();
      toast.success(`Catalog synchronization complete! ${res.seededCount} master products verified.`);
      void stats.refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to seed catalog.");
    } finally {
      setSeeding(false);
    }
  };

  const s = stats.data;

  return (
    <div className="space-y-8">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl">Executive Store Dashboard</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Real-time financial overview, fulfillment metrics, and store operations for Vaidh Bharti Ayurveda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={seeding}
            onClick={handleSeedCatalog}
            className="flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50"
            title="Populates all 18 packaged products with MRPs, ingredients, and dosages to Supabase"
          >
            <Database className="h-4 w-4 text-gold" />
            {seeding ? "Syncing..." : "Sync 18 Master SKUs to DB"}
          </button>

          <Link
            to="/admin/orders"
            className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            Process Orders
          </Link>
        </div>
      </div>

      {/* Financial KPIs */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold mb-3">Revenue &amp; Payments</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-sm border border-border bg-card p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Gross Sales</p>
            <p className="mt-2 font-display text-3xl">{s ? inr(s.totalRevenue) : "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across {s?.activeOrderCount ?? 0} active orders</p>
          </div>

          <div className="rounded-sm border border-border bg-card p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Prepaid Settled</p>
            <p className="mt-2 font-display text-3xl text-emerald-800">{s ? inr(s.paidRevenue) : "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Verified Razorpay / UPI</p>
          </div>

          <div className="rounded-sm border border-border bg-card p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">COD Due on Delivery</p>
            <p className="mt-2 font-display text-3xl text-amber-800">{s ? inr(s.codPendingRevenue) : "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Cash payable upon courier handover</p>
          </div>

          <div className="rounded-sm border border-border bg-card p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Avg Order Value (AOV)</p>
            <p className="mt-2 font-display text-3xl">{s ? inr(s.aov) : "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Average customer basket size</p>
          </div>
        </div>
      </div>

      {/* Operational KPIs */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold mb-3">Fulfillment &amp; Inventory</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-sm border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Pending Dispatch</p>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 font-display text-3xl">{s?.pendingFulfillment ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Orders awaiting packing/shipment</p>
          </div>

          <div className="rounded-sm border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">In Transit</p>
              <Truck className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 font-display text-3xl">{s?.inTransit ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Active courier shipments</p>
          </div>

          <div className="rounded-sm border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Products in DB</p>
              <Package className="h-4 w-4 text-gold" />
            </div>
            <p className="mt-2 font-display text-3xl">{s?.totalProducts ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Active Ayurvedic formulations</p>
          </div>

          <div className="rounded-sm border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Low Stock Alerts</p>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="mt-2 font-display text-3xl text-destructive">{s?.lowStock.length ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">SKUs with &le; 5 units left</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Consultations */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-sm border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl">Recent Orders</h2>
              <p className="text-xs text-muted-foreground">Latest transactions from customer storefront</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-gold hover:underline"
            >
              View All ({s?.orderCount ?? 0})
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-border text-sm">
            {s?.recentOrders.length ? (
              s.recentOrders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground">{o.order_number}</span>
                      <span
                        className={`rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          o.payment_status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {o.payment_method === "cod" ? "COD" : "Prepaid"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {o.customer_name} · {new Date(o.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-base font-semibold">{inr(Number(o.total))}</p>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{o.status}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-6 text-center text-sm text-muted-foreground">No orders placed yet.</li>
            )}
          </ul>
        </div>

        {/* Upcoming Consultations */}
        <div className="rounded-sm border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl">Upcoming Consultations</h2>
              <p className="text-xs text-muted-foreground">Nadi Pariksha and Ayurvedic doctor appointments</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-gold hover:underline"
            >
              All Bookings
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-border text-sm">
            {s?.bookings.length ? (
              s.bookings.map((b) => (
                <li key={b.id} className="flex justify-between items-center py-3 gap-3">
                  <div>
                    <p className="font-medium text-foreground">{b.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(`${b.booking_date}T00:00:00`).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      at {b.slot_time}
                    </p>
                  </div>
                  <span className="rounded-sm bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                    {b.status}
                  </span>
                </li>
              ))
            ) : (
              <li className="py-6 text-center text-sm text-muted-foreground">No upcoming bookings scheduled.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Low Stock Warning Section */}
      {s && s.lowStock.length > 0 && (
        <div className="rounded-sm border border-destructive/40 bg-destructive/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="font-display text-lg font-bold text-destructive">Inventory Reorder Needed</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            The following herbal formulations are low in stock (&le; 5 units). Please update packaging inventory:
          </p>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {s.lowStock.map((p) => (
              <div key={p.id} className="rounded-sm border border-border bg-card p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-xs text-foreground">{p.name}</p>
                  {p.sku && <p className="font-mono text-[10px] text-muted-foreground">SKU: {p.sku}</p>}
                </div>
                <span className="rounded-sm bg-destructive/15 px-2 py-1 font-mono text-xs font-bold text-destructive">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold hover:underline"
            >
              Update inventory quantities in Products
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
