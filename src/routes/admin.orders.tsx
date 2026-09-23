import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Printer,
  Download,
  Eye,
  X,
  FileSpreadsheet,
  Send,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { updateAdminOrderStatus, resendOrderNotification, listAdminOrders } from "@/lib/orders.functions";
import { InvoiceBill } from "@/components/site/InvoiceBill";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const orderStatuses = ["all", "pending", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;
const paymentStatuses = ["all", "pending", "paid", "refunded", "failed"] as const;
const paymentMethods = ["all", "cod", "online"] as const;

function exportToCsv(orders: any[]) {
  if (!orders.length) {
    toast.error("No orders to export.");
    return;
  }

  const headers = [
    "Order Number",
    "Invoice Number",
    "Date",
    "Customer Name",
    "Phone",
    "Email",
    "Address Line 1",
    "Address Line 2",
    "City",
    "State",
    "Pincode",
    "Status",
    "Payment Method",
    "Payment Status",
    "Courier",
    "Tracking Number",
    "Subtotal (INR)",
    "Discount (INR)",
    "Coupon",
    "Shipping (INR)",
    "Tax (INR)",
    "Grand Total (INR)",
    "Items Summary",
  ];

  const rows = orders.map((o) => {
    const itemsSummary = (o.order_items || [])
      .map((i: any) => `${i.product_name} (${i.variant_label || "Std"}) x${i.quantity}`)
      .join(" | ");

    return [
      `"${o.order_number}"`,
      `"${o.invoice_number || ""}"`,
      `"${new Date(o.created_at).toLocaleString("en-IN")}"`,
      `"${(o.customer_name || "").replace(/"/g, '""')}"`,
      `"${o.phone || ""}"`,
      `"${o.email || ""}"`,
      `"${(o.address_line1 || "").replace(/"/g, '""')}"`,
      `"${(o.address_line2 || "").replace(/"/g, '""')}"`,
      `"${o.city || ""}"`,
      `"${o.state || ""}"`,
      `"${o.pincode || ""}"`,
      `"${o.status}"`,
      `"${o.payment_method}"`,
      `"${o.payment_status}"`,
      `"${o.courier || ""}"`,
      `"${o.tracking_number || ""}"`,
      Number(o.subtotal || 0),
      Number(o.discount_amount || 0),
      `"${o.coupon_code || ""}"`,
      Number(o.shipping_amount || 0),
      Number(o.tax_amount || 0),
      Number(o.total || 0),
      `"${itemsSummary.replace(/"/g, '""')}"`,
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `vaidh-bharti-orders-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`Exported ${orders.length} orders to CSV.`);
}

function AdminOrders() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [paymentFilter, setPaymentFilter] = React.useState<string>("all");
  const [methodFilter, setMethodFilter] = React.useState<string>("all");

  const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);
  const [viewInvoiceModal, setViewInvoiceModal] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [resendingType, setResendingType] = React.useState<string | null>(null);

  const [cancelModalOrder, setCancelModalOrder] = React.useState<any | null>(null);
  const [cancelReason, setCancelReason] = React.useState("");

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      try {
        const data = await listAdminOrders();
        return data ?? [];
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast.error("Could not load orders.");
        return [];
      }
    },
  });

  const orders = ordersQuery.data ?? [];

  // Filtering
  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (paymentFilter !== "all" && o.payment_status !== paymentFilter) return false;
    if (methodFilter !== "all" && o.payment_method !== methodFilter) return false;

    const q = search.trim().toLowerCase();
    if (!q) return true;
    const matchStr = `${o.order_number} ${o.invoice_number ?? ""} ${o.customer_name} ${o.phone} ${o.email ?? ""} ${o.city} ${o.state} ${o.tracking_number ?? ""}`.toLowerCase();
    return matchStr.includes(q);
  });

  // Calculate totals for active filter
  const totalAmount = filtered.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
  const paidAmount = filtered.filter((o) => o.payment_status === "paid" && o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
  const codDueAmount = filtered.filter((o) => o.payment_method === "cod" && o.payment_status !== "paid" && o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);

  // Status update handler
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus === "cancelled") {
      const target = orders.find((o) => o.id === orderId);
      setCancelModalOrder(target);
      return;
    }

    try {
      setIsUpdating(true);
      await updateAdminOrderStatus({
        data: {
          orderId,
          status: newStatus,
          staffNote: `Status changed to ${newStatus} via admin panel`,
        },
      });
      toast.success(`Order status updated to ${newStatus}.`);
      void ordersQuery.refetch();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Payment status update handler
  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: string) => {
    try {
      setIsUpdating(true);
      await updateAdminOrderStatus({
        data: {
          orderId,
          paymentStatus: newPaymentStatus,
          staffNote: `Payment status changed to ${newPaymentStatus} via admin panel`,
        },
      });
      toast.success(`Payment status marked as ${newPaymentStatus}.`);
      void ordersQuery.refetch();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, payment_status: newPaymentStatus }));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Shipping details update
  const handleShippingSubmit = async (e: React.FormEvent<HTMLFormElement>, orderId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courier = (formData.get("courier") as string)?.trim() || null;
    const trackingNumber = (formData.get("tracking") as string)?.trim() || null;

    try {
      setIsUpdating(true);
      await updateAdminOrderStatus({
        data: {
          orderId,
          courier,
          trackingNumber,
          // Auto-advance to shipped if tracking added
          status: trackingNumber ? "shipped" : undefined,
          staffNote: `Updated courier to ${courier || "N/A"} and tracking AWB to ${trackingNumber || "N/A"}`,
        },
      });
      toast.success("Shipping details saved and dispatched notice prepared.");
      void ordersQuery.refetch();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => ({
          ...prev,
          courier,
          tracking_number: trackingNumber,
          status: trackingNumber ? "shipped" : prev.status,
        }));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save shipping info.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm cancellation
  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    try {
      setIsUpdating(true);
      await updateAdminOrderStatus({
        data: {
          orderId: cancelModalOrder.id,
          status: "cancelled",
          cancelledReason: cancelReason || "Cancelled by admin",
          staffNote: `Order cancelled. Reason: ${cancelReason || "No reason specified"}`,
        },
      });
      toast.success("Order cancelled.");
      setCancelModalOrder(null);
      setCancelReason("");
      void ordersQuery.refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel order.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Resend notification
  const handleResend = async (orderId: string, channel: "customer_email" | "admin_email") => {
    setResendingType(channel);
    try {
      await resendOrderNotification({
        data: {
          orderId,
          channel,
        },
      });
      toast.success(`Notification (${channel}) resent successfully.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend notification.");
    } finally {
      setResendingType(null);
    }
  };

  const selectCls = "h-11 rounded-sm border border-input bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-6">
      {/* Top Bar with KPI Metrics & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl">Order Management</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Monitor verified online purchases, Cash on Delivery fulfillment, and courier tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => exportToCsv(filtered)}
            className="flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:bg-muted/40 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-border bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Filtered Orders</p>
          <p className="mt-1 font-display text-2xl">{filtered.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Total: {orders.length} orders in system</p>
        </div>

        <div className="rounded-sm border border-border bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Gross Sales</p>
          <p className="mt-1 font-display text-2xl">{inr(totalAmount)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Active orders excluding cancellations</p>
        </div>

        <div className="rounded-sm border border-border bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Prepaid Collected</p>
          <p className="mt-1 font-display text-2xl text-emerald-800">{inr(paidAmount)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Verified Razorpay / Online</p>
        </div>

        <div className="rounded-sm border border-border bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">COD Due on Delivery</p>
          <p className="mt-1 font-display text-2xl text-amber-800">{inr(codDueAmount)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Cash payable by recipient</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border bg-card p-4">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            aria-label="Search orders"
            placeholder="Search Order #, Invoice #, Name, Phone, City..."
            className="h-11 w-full rounded-sm border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <select
            aria-label="Order status"
            className={selectCls}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {orderStatuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Fulfillment" : `Status: ${s}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            aria-label="Payment status"
            className={selectCls}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            {paymentStatuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Payments" : `Payment: ${s}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            aria-label="Payment method"
            className={selectCls}
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All Methods" : m === "cod" ? "Cash on Delivery" : "Online Prepaid"}
              </option>
            ))}
          </select>
        </div>

        {(search || statusFilter !== "all" || paymentFilter !== "all" || methodFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setPaymentFilter("all");
              setMethodFilter("all");
            }}
            className="h-11 rounded-sm border border-border px-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>

      {/* Orders List Table */}
      <div className="space-y-4">
        {filtered.length ? (
          filtered.map((o) => {
            const isPaid = o.payment_status === "paid";
            const isCOD = o.payment_method === "cod";

            return (
              <div
                key={o.id}
                className="rounded-sm border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold text-foreground">{o.order_number}</span>
                        {o.invoice_number && (
                          <span className="rounded-sm bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                            {o.invoice_number}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pl-2">
                      <span
                        className={`rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isPaid ? "PAID" : isCOD ? "COD UNPAID" : `PAYMENT: ${o.payment_status}`}
                      </span>

                      <span
                        className={`rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          o.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdowns */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl mr-2">{inr(Number(o.total))}</span>

                    <select
                      aria-label="Update fulfillment"
                      value={o.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={selectCls}
                    >
                      {orderStatuses
                        .filter((s) => s !== "all")
                        .map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>

                    <select
                      aria-label="Update payment"
                      value={o.payment_status}
                      disabled={isUpdating}
                      onChange={(e) => handlePaymentStatusChange(o.id, e.target.value)}
                      className={selectCls}
                    >
                      {paymentStatuses
                        .filter((s) => s !== "all")
                        .map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(o);
                        setViewInvoiceModal(true);
                      }}
                      className="flex items-center gap-1.5 rounded-sm border border-border bg-card px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-muted/50"
                      title="Print Official Tax Invoice"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Invoice
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(o)}
                      className="flex items-center gap-1.5 rounded-sm bg-primary px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:opacity-90"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </button>
                  </div>
                </div>

                {/* Body Row: Customer, Address & Items */}
                <div className="mt-4 grid gap-6 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{o.customer_name}</p>
                    <p className="mt-0.5 text-foreground">{o.phone}</p>
                    {o.email && <p className="mt-0.5">{o.email}</p>}
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {o.address_line1}
                      {o.address_line2 ? `, ${o.address_line2}` : ""}
                      <br />
                      {o.city}, {o.state} — {o.pincode}
                    </p>
                    {o.notes && (
                      <p className="mt-2 rounded-sm bg-muted/40 p-2 italic text-[11px]">
                        Note: &ldquo;{o.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-1 uppercase tracking-wider text-[10px]">
                      Items Purchased ({(o.order_items || []).length})
                    </p>
                    <ul className="space-y-1.5">
                      {(o.order_items || []).map((it: any, idx: number) => (
                        <li key={idx} className="flex justify-between gap-2 border-b border-border/40 pb-1">
                          <span className="text-foreground">
                            {it.product_name}
                            {it.variant_label ? ` (${it.variant_label})` : ""} × {it.quantity}
                          </span>
                          <span>{inr(Number(it.unit_price) * it.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex justify-between text-[11px]">
                      <span>Subtotal: {inr(Number(o.subtotal))}</span>
                      <span>Delivery: {Number(o.shipping_amount) === 0 ? "FREE" : inr(Number(o.shipping_amount))}</span>
                    </div>
                  </div>

                  {/* Shipping Courier & Quick Tracking Form */}
                  <div className="rounded-sm border border-border/80 bg-background/50 p-3">
                    <p className="font-semibold text-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <Truck className="h-3.5 w-3.5 text-gold" />
                      Fulfillment &amp; Courier Tracking
                    </p>
                    <form
                      onSubmit={(e) => handleShippingSubmit(e, o.id)}
                      className="space-y-2"
                    >
                      <input
                        name="courier"
                        defaultValue={o.courier ?? ""}
                        placeholder="Courier (e.g. Delhivery, Bluedart, DTDC)"
                        className="h-9 w-full rounded-sm border border-input bg-card px-2.5 text-xs focus:ring-1 focus:ring-primary"
                      />
                      <input
                        name="tracking"
                        defaultValue={o.tracking_number ?? ""}
                        placeholder="AWB / Tracking Number"
                        className="h-9 w-full rounded-sm border border-input bg-card px-2.5 text-xs font-mono focus:ring-1 focus:ring-primary"
                      />
                      <div className="flex justify-between items-center pt-1">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="rounded-sm bg-primary px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:opacity-90 disabled:opacity-50"
                        >
                          Save Tracking
                        </button>
                        {o.tracking_number && (
                          <span className="font-mono text-[10px] text-emerald-700 font-semibold">
                            Dispatched
                          </span>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-sm border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">No orders match your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Detail Drawer / Modal */}
      {selectedOrder && !viewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold">{selectedOrder.order_number}</h2>
                <p className="text-xs text-muted-foreground">
                  Invoice: {selectedOrder.invoice_number || "Not assigned"} · Placed on{" "}
                  {new Date(selectedOrder.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-sm">
              {/* Customer Info */}
              <div className="rounded-sm bg-muted/30 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold">Recipient Details</h3>
                <p className="mt-1 font-semibold text-foreground">{selectedOrder.customer_name}</p>
                <p className="text-xs text-muted-foreground">
                  Phone: {selectedOrder.phone} · Email: {selectedOrder.email || "—"}
                </p>
                <p className="mt-2 text-xs text-foreground leading-relaxed">
                  {selectedOrder.address_line1}
                  {selectedOrder.address_line2 ? `, ${selectedOrder.address_line2}` : ""}
                  <br />
                  {selectedOrder.city}, {selectedOrder.state} — {selectedOrder.pincode}
                </p>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold mb-2">Order Items</h3>
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2">Item</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {(selectedOrder.order_items || []).map((it: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2 font-medium">
                          {it.product_name}
                          {it.variant_label ? ` (${it.variant_label})` : ""}
                        </td>
                        <td className="py-2 text-center">{it.quantity}</td>
                        <td className="py-2 text-right">{inr(Number(it.unit_price))}</td>
                        <td className="py-2 text-right">{inr(Number(it.unit_price) * it.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="rounded-sm border border-border p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{inr(Number(selectedOrder.subtotal))}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({selectedOrder.coupon_code || "Coupon"}):</span>
                    <span>−{inr(Number(selectedOrder.discount_amount))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>{Number(selectedOrder.shipping_amount) === 0 ? "FREE" : inr(Number(selectedOrder.shipping_amount))}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
                  <span>Grand Total:</span>
                  <span className="font-display text-base">{inr(Number(selectedOrder.total))}</span>
                </div>
              </div>

              {/* Notification Resend Actions */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Resend Notifications &amp; Customer Link
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={resendingType === "customer_email"}
                    onClick={() => handleResend(selectedOrder.id, "customer_email")}
                    className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] hover:bg-muted"
                  >
                    <Send className="h-3.5 w-3.5 text-blue-600" />
                    Resend Customer Email
                  </button>

                  <button
                    type="button"
                    disabled={resendingType === "admin_email"}
                    onClick={() => handleResend(selectedOrder.id, "admin_email")}
                    className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] hover:bg-muted"
                  >
                    <Send className="h-3.5 w-3.5 text-purple-600" />
                    Resend Admin Alert
                  </button>

                  <a
                    href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Namaste ${selectedOrder.customer_name}, greetings from Vaidh Bharti Ayurveda. Regarding your Order #${
                        selectedOrder.order_number
                      } of ${inr(Number(selectedOrder.total))}: ${
                        selectedOrder.status === "shipped" && selectedOrder.tracking_number
                          ? `Your order has been dispatched via ${selectedOrder.courier || "courier"}. Tracking AWB: ${
                              selectedOrder.tracking_number
                            }.`
                          : "We are preparing your authentic Ayurvedic formulations for dispatch."
                      }`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-sm bg-[#25D366] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#20bd5a]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp Customer
                  </a>
                </div>
              </div>

              {/* Audit Log Timeline */}
              {Array.isArray(selectedOrder.audit_log) && selectedOrder.audit_log.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Audit Log &amp; Event History
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.audit_log.map((log: any, i: number) => (
                      <div key={i} className="rounded-sm bg-muted/40 p-2.5 text-xs">
                        <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                          <span>{log.action || log.event || "Update"}</span>
                          <span>{log.timestamp ? new Date(log.timestamp).toLocaleString("en-IN") : ""}</span>
                        </div>
                        {log.note && <p className="mt-1 text-foreground">{log.note}</p>}
                        {log.reason && <p className="mt-1 text-destructive">Reason: {log.reason}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setViewInvoiceModal(true)}
                className="rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground"
              >
                View Full Invoice
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-sm border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrder && viewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-sm bg-white p-6 shadow-2xl">
            <InvoiceBill
              order={{
                order_number: selectedOrder.order_number,
                invoice_number: selectedOrder.invoice_number,
                invoice_date: selectedOrder.invoice_date,
                created_at: selectedOrder.created_at,
                customer_name: selectedOrder.customer_name,
                phone: selectedOrder.phone,
                email: selectedOrder.email,
                address_line1: selectedOrder.address_line1,
                address_line2: selectedOrder.address_line2,
                city: selectedOrder.city,
                state: selectedOrder.state,
                pincode: selectedOrder.pincode,
                payment_method: selectedOrder.payment_method,
                payment_status: selectedOrder.payment_status,
                subtotal: Number(selectedOrder.subtotal),
                shipping_amount: Number(selectedOrder.shipping_amount),
                discount_amount: Number(selectedOrder.discount_amount),
                tax_amount: Number(selectedOrder.tax_amount || 0),
                total: Number(selectedOrder.total),
                courier: selectedOrder.courier,
                tracking_number: selectedOrder.tracking_number,
                notes: selectedOrder.notes,
                order_items: (selectedOrder.order_items || []).map((it: any) => ({
                  name: it.product_name,
                  variant: it.variant_label,
                  quantity: it.quantity,
                  unit_price: Number(it.unit_price),
                })),
              }}
              onClose={() => setViewInvoiceModal(false)}
            />
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-xl">
            <h2 className="font-display text-xl text-destructive font-bold">Cancel Order {cancelModalOrder.order_number}</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Cancelling will update the order status, log the cancellation reason, and restore item stock.
            </p>
            <div className="mt-4">
              <label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground" htmlFor="cancel-reason">
                Reason for cancellation
              </label>
              <textarea
                id="cancel-reason"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Customer requested cancellation, unable to deliver to pincode, out of stock"
                className="mt-2 w-full rounded-sm border border-input bg-background p-2.5 text-xs focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCancelModalOrder(null);
                  setCancelReason("");
                }}
                className="rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-wider font-semibold"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isUpdating}
                className="rounded-sm bg-destructive px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
