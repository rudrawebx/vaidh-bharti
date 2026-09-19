import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/site/primitives";
import { site, telHref, whatsappHref } from "@/lib/site";

export const Route = createFileRoute("/order/$number")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Your Ayurvedic order has been received." },
      { property: "og:title", content: "Order Confirmed — Vaidh Bharti Ayurveda" },
      { property: "og:description", content: "Your Ayurvedic order has been received." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const { number } = Route.useParams();
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
          <h1 className="mt-6 font-display text-4xl">Thank you — your order is placed</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Your order number is <span className="font-semibold text-foreground">{number}</span>. Please save it. We
            will call you on the number you provided to confirm dispatch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/track-order"
              className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Track Order
            </Link>
            <Link
              to="/products"
              className="rounded-sm border border-border px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
            >
              Continue Shopping
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Questions? Call{" "}
            <a href={telHref} className="text-gold">
              {site.phoneDisplay}
            </a>{" "}
            or{" "}
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-gold">
              message us on WhatsApp
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
