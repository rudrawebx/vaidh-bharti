import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { formatPrice, productById, productSlug } from "@/data/catalog";
import { btn, cx, BRAND } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Your Cart | Vaidh Bharti Ayurveda" },
      {
        name: "description",
        content:
          "Review the Ayurvedic products in your cart and place your order with Vaidh Bharti.",
      },
      { property: "og:title", content: "Your Cart | Vaidh Bharti" },
      { property: "og:description", content: "Review and place your Ayurvedic order." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
});

function CartPage() {
  const { lines, subtotal, setQty, remove, clear, hydrated } = useCart();
  const [placed, setPlaced] = useState<string | null>(null);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;

  return (
    <>
      <PageHero
        eyebrow="Your Order"
        crumb="Cart"
        title="Shopping Cart"
        subtitle="Review your Ayurvedic selections before placing the order."
      />

      <section className="py-16 md:py-24">
        <div className="container-vb">
          {placed ? (
            <div className="mx-auto max-w-xl rounded-lg border border-primary/25 bg-cream p-8 text-center">
              <Check className="mx-auto size-7 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-3xl">Order placed</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Your order ID is <strong>{placed}</strong>. Our team will call
                you on {BRAND.phone} to confirm delivery details.
              </p>
              <Link to="/products" className={cx(btn.base, btn.primary, "mt-7")}>
                Continue shopping
              </Link>
            </div>
          ) : !hydrated ? (
            <p className="text-sm text-muted-foreground">Loading your cart…</p>
          ) : lines.length === 0 ? (
            <div className="mx-auto max-w-lg text-center">
              <h2 className="display-2">Your cart is empty</h2>
              <p className="mt-4 text-muted-foreground">
                Explore our Ayurvedic oils, churnas and rasayanas.
              </p>
              <Link to="/products" className={cx(btn.base, btn.primary, "mt-8")}>
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_0.6fr]">
              <ul className="divide-y divide-border border-y border-border">
                {lines.map((line) => {
                  const p = productById(line.id);
                  if (!p) return null;
                  return (
                    <li key={line.id} className="flex gap-5 py-6">
                      <Link to="/products/$slug" params={{ slug: productSlug(p) }}>
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          width={160}
                          height={160}
                          className="size-24 rounded-md object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <h2 className="font-display text-xl">
                          <Link to="/products/$slug" params={{ slug: productSlug(p) }}>
                            {p.name}
                          </Link>
                        </h2>
                        <p className="text-sm text-muted-foreground">{p.weight}</p>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center rounded-md border border-border">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${p.name}`}
                              onClick={() => setQty(p.id, line.qty - 1)}
                              className="min-h-11 w-10"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm">{line.qty}</span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${p.name}`}
                              onClick={() => setQty(p.id, line.qty + 1)}
                              className="min-h-11 w-10"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(p.id)}
                            aria-label={`Remove ${p.name} from cart`}
                            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" aria-hidden="true" /> Remove
                          </button>
                        </div>
                      </div>
                      <p className="font-display text-xl text-primary">
                        {formatPrice(p.price * line.qty)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <aside className="h-max rounded-lg border border-border p-7">
                <h2 className="font-display text-2xl">Order Summary</h2>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-base">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-display text-2xl text-primary">
                      {formatPrice(subtotal + shipping)}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setPlaced(
                      "VB-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
                    );
                    clear();
                  }}
                  className={cx(btn.base, btn.primary, "mt-7 w-full")}
                >
                  Place Order
                </button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Free shipping on orders above ₹999. Our team confirms every
                  order by phone before dispatch.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
