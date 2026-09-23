import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Printer, Package, MapPin, CreditCard, ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/site/primitives";
import { site, telHref, whatsappHref, inr } from "@/lib/site";
import { lookupOrder } from "@/lib/orders.functions";
import { InvoiceBill } from "@/components/site/InvoiceBill";

export const Route = createFileRoute("/order/$number")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.number} Confirmed — Vaidh Bharti Ayurveda` },
      { name: "description", content: "Your Ayurvedic order has been placed successfully." },
      { property: "og:title", content: `Order ${params.number} Confirmed — Vaidh Bharti` },
      { property: "og:description", content: "Your Ayurvedic order has been placed successfully." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const { number } = Route.useParams();
  const [viewInvoice, setViewInvoice] = React.useState(false);

  const orderQuery = useQuery({
    queryKey: ["order-detail", number],
    queryFn: async () => {
      try {
        const res = await lookupOrder({ data: { orderNumber: number } });
        return res;
      } catch (e) {
        console.error("Order lookup error:", e);
        return null;
      }
    },
  });

  const order = orderQuery.data;
  const isPaid = order?.payment_status === "paid";
  const isCOD = order?.payment_method === "cod";

  if (viewInvoice && order) {
    return (
      <div className="py-12">
        <Container>
          <InvoiceBill
            order={{
              order_number: order.order_number,
              invoice_number: order.invoice_number,
              invoice_date: order.invoice_date,
              created_at: order.created_at,
              customer_name: order.customer_name,
              phone: order.phone,
              email: order.email,
              address_line1: order.address_line1,
              address_line2: order.address_line2,
              city: order.city,
              state: order.state,
              pincode: order.pincode,
              payment_method: order.payment_method,
              payment_status: order.payment_status,
              subtotal: Number(order.subtotal),
              shipping_amount: Number(order.shipping_amount),
              discount_amount: Number(order.discount_amount),
              tax_amount: Number(order.tax_amount || 0),
              total: Number(order.total),
              courier: order.courier,
              tracking_number: order.tracking_number,
              notes: order.notes,
              order_items: (order.order_items || []).map((it: any) => ({
                name: it.product_name,
                variant: it.variant_label,
                quantity: it.quantity,
                unit_price: Number(it.unit_price),
              })),
            }}
            onClose={() => setViewInvoice(false)}
          />
        </Container>
      </div>
    );
  }

  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Header Card */}
          <div className="rounded-sm border border-border bg-card p-8 text-center sm:p-12">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-10 w-10 text-emerald-700" />
            </div>

            <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
              Order Confirmed
            </span>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl">Thank You for Your Order</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your Ayurvedic health package has been placed. Our pharmacy team will pack and dispatch your order.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-sm bg-muted/60 px-4 py-2 text-xs">
                <span className="text-muted-foreground uppercase tracking-wider">Order ID: </span>
                <span className="font-mono font-bold text-foreground">{number}</span>
              </div>
              {order?.invoice_number ? (
                <div className="rounded-sm bg-muted/60 px-4 py-2 text-xs">
                  <span className="text-muted-foreground uppercase tracking-wider">Invoice No: </span>
                  <span className="font-mono font-bold text-foreground">{order.invoice_number}</span>
                </div>
              ) : null}
              <div
                className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                  isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {isPaid ? "Paid Online" : "Cash on Delivery"}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {order && (
                <button
                  type="button"
                  onClick={() => setViewInvoice(true)}
                  className="flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-sm hover:opacity-90"
                >
                  <Printer className="h-4 w-4" />
                  View &amp; Print Invoice
                </button>
              )}

              <a
                href={`https://wa.me/${site.phone.replace("+", "")}?text=${encodeURIComponent(
                  `Namaste Vaidh Bharti, I have placed Order ${number} on your website${
                    order ? ` for ${inr(Number(order.total))}` : ""
                  }. Please confirm dispatch.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-sm bg-[#25D366] px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Confirm on WhatsApp
              </a>

              <Link
                to="/track-order"
                className="flex items-center gap-2 rounded-sm border border-border px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary hover:bg-muted/30"
              >
                Track Order
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Detailed Order Breakdown if loaded */}
          {order && (
            <div className="mt-8 grid gap-8 md:grid-cols-[1.5fr_1fr]">
              {/* Order Items */}
              <div className="rounded-sm border border-border bg-card p-6">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Package className="h-4 w-4 text-gold" />
                  <h2 className="font-display text-lg">Ordered Items</h2>
                </div>

                <ul className="mt-4 divide-y divide-border text-sm">
                  {(order.order_items || []).map((it: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-start py-3 gap-3">
                      <div>
                        <p className="font-medium text-foreground">{it.product_name}</p>
                        {it.variant_label ? (
                          <p className="text-xs text-muted-foreground">Pack: {it.variant_label}</p>
                        ) : null}
                        <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
                      </div>
                      <span className="font-medium text-foreground">
                        {inr(Number(it.unit_price) * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Subtotals */}
                <div className="mt-4 border-t border-border pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>{inr(Number(order.subtotal))}</span>
                  </div>
                  {Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span>−{inr(Number(order.discount_amount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping:</span>
                    <span>{Number(order.shipping_amount) === 0 ? "FREE" : inr(Number(order.shipping_amount))}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold text-foreground">
                    <span>Total Amount:</span>
                    <span className="font-display text-base">{inr(Number(order.total))}</span>
                  </div>
                </div>
              </div>

              {/* Delivery & Payment Info */}
              <div className="space-y-6">
                <div className="rounded-sm border border-border bg-card p-6">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <MapPin className="h-4 w-4 text-gold" />
                    <h2 className="font-display text-lg">Delivery Address</h2>
                  </div>
                  <div className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-foreground">{order.customer_name}</p>
                    <p className="mt-1">{order.phone}</p>
                    {order.email ? <p>{order.email}</p> : null}
                    <p className="mt-2 text-foreground">
                      {order.address_line1}
                      {order.address_line2 ? `, ${order.address_line2}` : ""}
                      <br />
                      {order.city}, {order.state} — {order.pincode}
                    </p>
                  </div>
                </div>

                <div className="rounded-sm border border-border bg-card p-6">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <CreditCard className="h-4 w-4 text-gold" />
                    <h2 className="font-display text-lg">Payment Info</h2>
                  </div>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="font-semibold uppercase">{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-semibold uppercase ${isPaid ? "text-emerald-700" : "text-amber-700"}`}>
                        {order.payment_status}
                      </span>
                    </div>
                    {isCOD && (
                      <p className="mt-2 rounded-sm bg-amber-50 p-2 text-[11px] text-amber-800 border border-amber-200">
                        Please keep <strong>{inr(Number(order.total))}</strong> cash ready for our delivery partner.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help & Support Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Need help or have questions regarding your order? Call{" "}
              <a href={telHref} className="text-gold font-medium hover:underline">
                {site.phoneDisplay}
              </a>{" "}
              or message us on{" "}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-gold font-medium hover:underline">
                WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
