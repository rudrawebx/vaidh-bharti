import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { lookupOrder } from "@/lib/orders.functions";
import { inr } from "@/lib/site";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Check the status of your Vaidh Bharti Ayurvedic product order using your order number and phone number." },
      { property: "og:title", content: "Track Your Order — Vaidh Bharti Ayurveda" },
      { property: "og:description", content: "Check the status of your Ayurvedic product order." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/track-order" }],
  }),
  component: TrackOrder,
});

type Result = Awaited<ReturnType<typeof lookupOrder>>;

const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];

function TrackOrder() {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Result>(null);
  const [searched, setSearched] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await lookupOrder({ data: { orderNumber, phone } });
      setResult(res);
      setSearched(true);
    } catch {
      toast.error("Could not look up that order.");
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = result ? steps.indexOf(result.status) : -1;

  return (
    <>
      <PageHero eyebrow="Orders" title="Track Your Order" intro="Enter your order number and the phone number used at checkout." crumbs={[{ label: "Track Order" }]} />
      <section className="py-16">
        <Container>
          <form onSubmit={submit} className="grid max-w-2xl gap-4 sm:grid-cols-[1fr_1fr_auto]">
            <div>
              <label htmlFor="to-number" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Order number</label>
              <input id="to-number" required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="VB-20260101-1234" className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
            </div>
            <div>
              <label htmlFor="to-phone" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Phone number</label>
              <input id="to-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="mt-auto h-12 rounded-sm bg-primary px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60">
              {loading ? "Checking…" : "Track"}
            </button>
          </form>

          {searched && !result ? (
            <p className="mt-10 text-sm text-muted-foreground">
              We could not find an order with those details. Please check the order number and phone number.
            </p>
          ) : null}

          {result ? (
            <div className="mt-12 max-w-3xl border border-border p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl">{result.order_number}</h2>
                <span className="text-[11px] uppercase tracking-[0.16em] text-gold">{result.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Placed on {new Date(result.created_at).toLocaleDateString("en-IN")} · Payment: {result.payment_method === "cod" ? "Cash on delivery" : "Online"} ({result.payment_status})
              </p>

              <ol className="mt-6 flex flex-wrap gap-2">
                {steps.map((s, i) => (
                  <li key={s} className={`rounded-sm border px-3 py-2 text-[10px] uppercase tracking-[0.14em] ${i <= stepIndex ? "border-gold text-gold" : "border-border text-muted-foreground"}`}>
                    {s}
                  </li>
                ))}
              </ol>

              {result.tracking_number ? (
                <p className="mt-4 text-sm">
                  Courier: {result.courier ?? "—"} · Tracking number: <span className="font-semibold">{result.tracking_number}</span>
                </p>
              ) : null}

              <ul className="mt-6 divide-y divide-border border-t border-border">
                {result.order_items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4 py-3 text-sm">
                    <span>
                      {it.product_name}
                      {it.variant_label ? ` · ${it.variant_label}` : ""} × {it.quantity}
                    </span>
                    <span>{inr(Number(it.unit_price) * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex justify-between font-display text-xl">
                <span>Total</span>
                <span>{inr(Number(result.total))}</span>
              </p>
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
}
