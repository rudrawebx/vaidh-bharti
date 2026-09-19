import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Review the Ayurvedic products in your cart before checkout." },
      { property: "og:title", content: "Your Cart — Vaidh Bharti Ayurveda" },
      { property: "og:description", content: "Review your Ayurvedic order before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  return (
    <>
      <PageHero eyebrow="Shopping" title="Your Cart" intro="Review your selection before checkout." crumbs={[{ label: "Cart" }]} />
      <section className="py-16">
        <Container>
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Link
                to="/products"
                className="mt-6 inline-block rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
              <ul className="divide-y divide-border border-y border-border">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-5 py-6">
                    {item.image ? (
                      <img src={item.image} alt={item.product.name} className="h-28 w-24 rounded-sm bg-secondary object-cover" />
                    ) : null}
                    <div className="flex-1">
                      <Link to="/product/$slug" params={{ slug: item.slug }} className="font-display text-xl">
                        {item.product.name}
                      </Link>
                      {item.variantLabel ? (
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.variantLabel}</p>
                      ) : null}
                      <p className="mt-1 text-sm text-muted-foreground">{inr(item.unitPrice)} each</p>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center rounded-sm border border-border">
                          <button type="button" aria-label="Decrease" onClick={() => setQty(item.key, item.qty - 1)} className="grid h-10 w-10 place-items-center">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.qty}</span>
                          <button type="button" aria-label="Increase" onClick={() => setQty(item.key, item.qty + 1)} className="grid h-10 w-10 place-items-center">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button type="button" onClick={() => remove(item.key)} aria-label="Remove item" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="font-display text-xl">{inr(item.unitPrice * item.qty)}</p>
                  </li>
                ))}
              </ul>

              <aside className="h-fit border border-border p-6">
                <h2 className="font-display text-2xl">Order Summary</h2>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{inr(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd>Calculated at checkout</dd>
                  </div>
                </dl>
                <Link
                  to="/checkout"
                  className="mt-6 block rounded-sm bg-primary px-6 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                >
                  Proceed to Checkout
                </Link>
                <Link to="/products" className="mt-3 block text-center text-[12px] uppercase tracking-[0.14em] text-gold">
                  Continue shopping
                </Link>
              </aside>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
