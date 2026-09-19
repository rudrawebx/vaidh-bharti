import * as React from "react";
import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  Leaf,
  Heart,
  FlaskConical,
  PackageCheck,
  Sparkles,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Container, Reveal } from "@/components/site/primitives";
import { ProductCard } from "@/components/site/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getProductBySlug } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { inr, priceLabel, whatsappHref, site } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ProductFaq, productFaqs } from "@/components/site/ProductFaq";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const data = await getProductBySlug({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — Vaidh Bharti" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    const title = `${p.name} — Vaidh Bharti Ayurveda`;
    const description = p.short_description ?? `${p.name} from Panchsheel Aarogya Dhaam.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/product/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: productFaqs(p, (loaderData as any)?.faqs ?? []).map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <Container>
      <div className="py-32 text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <Link to="/products" className="mt-6 inline-block text-sm uppercase tracking-[0.16em] text-gold">
          Back to all products
        </Link>
      </div>
    </Container>
  ),
});

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex", className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("h-4 w-4", n <= value ? "fill-gold text-gold" : "text-border")} />
      ))}
    </span>
  );
}

const benefitIcons = [Leaf, FlaskConical, Sparkles, PackageCheck, ShieldCheck, Truck];

function ProductDetail() {
  const { product, reviews, related, faqs } = Route.useLoaderData();
  const { add, setOpen } = useCart();
  const navigate = useNavigate();
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();
  const [variant, setVariant] = React.useState<string | null>(product.variants[0]?.label ?? null);
  const [qty, setQty] = React.useState(1);
  const [plan, setPlan] = React.useState<"once" | "subscribe">("once");
  const [frequency, setFrequency] = React.useState("Every 1 month");

  const active = product.variants.find((v) => v.label === variant);
  const price = active ? active.price : product.price;
  const mrp = active ? active.mrp : product.mrp;
  const stock = active ? active.stock : product.stock;
  const maxQty = Math.max(1, Math.min(20, stock || 1));
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const discountPct = mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const savings = mrp && price && mrp > price ? mrp - price : 0;
  const subDiscount = product.subscription_available ? product.subscription_discount_pct : 0;
  const effectivePrice =
    price !== null && plan === "subscribe" && subDiscount ? Math.round(price * (1 - subDiscount / 100)) : price;

  React.useEffect(() => {
    setQty((q) => Math.min(q, maxQty));
  }, [maxQty]);

  const canBuy = stock > 0 && price !== null;

  const addToCart = () => {
    add(product.slug, variant, qty);
    toast.success(`${product.name}${variant ? ` (${variant})` : ""} added to cart`);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    category: product.category?.name,
    brand: { "@type": "Brand", name: "Vaidh Bharti" },
    ...(product.images[0] ? { image: product.images[0] } : {}),
    ...(typeof price === "number"
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "INR",
            availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }
      : {}),
    ...(reviews.length
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: reviews.length } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-secondary/30 py-8 sm:py-12">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link to="/" className="hover:text-gold">
              Home
            </Link>
            <span className="px-2">/</span>
            <Link to="/products" className="hover:text-gold">
              Shop
            </Link>
            {product.category ? (
              <>
                <span className="px-2">/</span>
                <Link to="/category/$slug" params={{ slug: product.category.slug }} className="hover:text-gold">
                  {product.category.name}
                </Link>
              </>
            ) : null}
            <span className="px-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Gallery images={product.images} name={product.name} />

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold">{product.category?.name}</p>
              <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{product.name}</h1>

              <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Stars value={Math.round(avg)} />
                  {reviews.length ? (
                    <span className="text-foreground">
                      {avg.toFixed(1)} ★ | {reviews.length} Review{reviews.length === 1 ? "" : "s"}
                    </span>
                  ) : (
                    <span>Be the first to review</span>
                  )}
                </span>
                {product.is_best_seller ? (
                  <span className="rounded-sm bg-gold px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-forest-deep">
                    Best Seller
                  </span>
                ) : null}
              </p>

              {product.short_description ? (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{product.short_description}</p>
              ) : null}

              {product.benefits.length ? (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {product.benefits.slice(0, 6).map((b, i) => {
                    const Icon = benefitIcons[i % benefitIcons.length]!;
                    return (
                      <li key={b} className="flex items-start gap-3 rounded-sm border border-border bg-card p-3 text-sm">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span className="leading-relaxed text-muted-foreground">{b}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              <div className="mt-8 border border-border bg-card p-6">
                <p className="flex flex-wrap items-baseline gap-3 font-display text-4xl">
                  {priceLabel(effectivePrice)}
                  {mrp && price && mrp > price ? (
                    <span className="text-xl text-muted-foreground line-through">{inr(mrp)}</span>
                  ) : null}
                  {discountPct > 0 ? (
                    <span className="rounded-sm bg-destructive px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                      Save {discountPct}%
                    </span>
                  ) : null}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {savings > 0 ? `You save ${inr(savings)} · ` : ""}
                  Inclusive of all taxes
                  {product.net_quantity ? ` · ${product.net_quantity}` : ""}
                </p>

                {product.variants.length > 0 ? (
                  <div className="mt-6">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Pack size</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.variants.map((v, i) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setVariant(v.label)}
                          className={cn(
                            "relative rounded-sm border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]",
                            v.label === variant
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-primary hover:border-gold hover:text-gold",
                            v.stock <= 0 && "opacity-50",
                          )}
                          disabled={v.stock <= 0}
                        >
                          {v.label} · {inr(v.price)}
                          {i === 1 ? (
                            <span className="ml-2 rounded-sm bg-gold px-1.5 py-0.5 text-[8px] text-forest-deep">
                              Popular
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {product.subscription_available && subDiscount > 0 ? (
                  <div className="mt-6">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Purchase option</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPlan("once")}
                        className={cn(
                          "rounded-sm border p-4 text-left text-sm",
                          plan === "once" ? "border-gold bg-secondary" : "border-border",
                        )}
                      >
                        <span className="block font-semibold">One-time purchase</span>
                        <span className="text-muted-foreground">{priceLabel(price)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlan("subscribe")}
                        className={cn(
                          "rounded-sm border p-4 text-left text-sm",
                          plan === "subscribe" ? "border-gold bg-secondary" : "border-border",
                        )}
                      >
                        <span className="block font-semibold">
                          <RefreshCw className="mr-1 inline h-3 w-3" /> Subscribe & Save {subDiscount}%
                        </span>
                        <span className="text-muted-foreground">
                          {priceLabel(price === null ? null : Math.round(price * (1 - subDiscount / 100)))}
                        </span>
                      </button>
                    </div>
                    {plan === "subscribe" ? (
                      <>
                        <label
                          htmlFor="frequency"
                          className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          Delivery frequency
                        </label>
                        <select
                          id="frequency"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="mt-2 h-12 w-full rounded-sm border border-input bg-background px-3 text-sm"
                        >
                          <option>Every 1 month</option>
                          <option>Every 2 months</option>
                          <option>Every 3 months</option>
                        </select>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Subscriptions are arranged by our team — place the order and we will confirm your {frequency.toLowerCase()} schedule on
                          call or WhatsApp.
                        </p>
                      </>
                    ) : null}
                  </div>
                ) : null}

                <p className={cn("mt-6 text-sm", stock > 0 ? "text-primary" : "text-destructive")}>
                  {stock > 0 ? `In stock${stock < 6 ? ` — only ${stock} left` : ""}` : "Currently out of stock"}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-sm border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="grid h-12 w-12 place-items-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        setQty((q) => {
                          if (q >= maxQty) {
                            toast.info(`Only ${maxQty} available right now.`);
                            return q;
                          }
                          return q + 1;
                        })
                      }
                      className="grid h-12 w-12 place-items-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!canBuy}
                    onClick={() => {
                      addToCart();
                      setOpen(true);
                    }}
                    className="flex-1 rounded-sm border border-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    {canBuy ? "Add to Cart" : "Unavailable"}
                  </button>
                  <button
                    type="button"
                    disabled={!canBuy}
                    onClick={() => {
                      addToCart();
                      void navigate({ to: "/checkout" });
                    }}
                    className="flex-1 rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-forest-deep disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                  <button
                    type="button"
                    aria-label="Add to wishlist"
                    aria-pressed={wishlistIds.includes(product.id)}
                    onClick={() => void toggleWishlist(product.id)}
                    className="grid h-[52px] w-[52px] place-items-center rounded-sm border border-border text-primary hover:border-gold hover:text-gold"
                  >
                    <Heart className={cn("h-5 w-5", wishlistIds.includes(product.id) && "fill-gold text-gold")} />
                  </button>
                </div>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-gold"
                >
                  <MessageCircle className="h-4 w-4" /> Ask about this product on WhatsApp
                </a>
              </div>

              <ul className="mt-6 grid gap-3 text-xs uppercase tracking-[0.12em] text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gold" /> Delivered across India
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-gold" /> Secure checkout
                </li>
                <li className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-gold" /> Traditional Ayurvedic preparation
                </li>
                <li className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-gold" /> Practitioner guidance available
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="font-display text-3xl">Product Information</h2>
          <Accordion type="single" collapsible defaultValue="description" className="mt-6 max-w-3xl">
            {product.description ? (
              <AccordionItem value="description">
                <AccordionTrigger className="font-display text-lg">Description</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
            ) : null}
            {product.benefits.length ? (
              <AccordionItem value="benefits">
                <AccordionTrigger className="font-display text-lg">Benefits</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {product.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ) : null}
            {product.ingredients ? (
              <AccordionItem value="ingredients">
                <AccordionTrigger className="font-display text-lg">Ingredients</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {product.ingredients}
                </AccordionContent>
              </AccordionItem>
            ) : null}
            {product.usage_instructions ? (
              <AccordionItem value="usage">
                <AccordionTrigger className="font-display text-lg">How to Use</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {product.usage_instructions}
                </AccordionContent>
              </AccordionItem>
            ) : null}
            <AccordionItem value="details">
              <AccordionTrigger className="font-display text-lg">Product Details</AccordionTrigger>
              <AccordionContent>
                <dl className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <Detail term="Net quantity" value={product.net_quantity ?? "Printed on the pack"} />
                  <Detail term="SKU" value={product.slug.toUpperCase()} />
                  <Detail term="Category" value={product.category?.name ?? "Ayurveda"} />
                  <Detail term="Storage" value="Store in a cool, dry place away from direct sunlight. Keep the pack tightly closed." />
                  <Detail term="Shelf life" value="As printed on the pack. Please check the expiry date before use." />
                  <Detail term="Marketed by" value={`${site.name}, ${site.address.line1}, ${site.address.line3}`} />
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="font-display text-lg">Shipping & Returns</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Orders are dispatched from Hansi, Haryana and usually reach most parts of India within 3–7 working
                  days. Shipping charges, if any, are shown at checkout before you confirm the order.
                </p>
                <p>
                  Orders can be cancelled by calling us before dispatch. For damaged or incorrect items, contact us
                  within 48 hours of delivery on {site.phoneDisplay}.
                </p>
                <p className="flex flex-wrap gap-4">
                  <Link to="/shipping-policy" className="text-gold underline-offset-4 hover:underline">
                    Shipping Policy
                  </Link>
                  <Link to="/refund-policy" className="text-gold underline-offset-4 hover:underline">
                    Refund Policy
                  </Link>
                  <Link to="/track-order" className="text-gold underline-offset-4 hover:underline">
                    Track Order
                  </Link>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Container>
      </section>

      <section className="border-t border-border py-16">
        <Container>
          <h2 className="font-display text-3xl">Customer Reviews</h2>
          <div className="mt-8 max-w-3xl">
            <Reviews productId={product.id} reviews={reviews} />
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-4">
        <Container>
          <ProductFaq product={product} custom={faqs ?? []} />
          <p className="mt-12 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            This is a traditional Ayurvedic preparation. It is not intended to diagnose, treat or cure any disease.
            Please read the label and use under the guidance of a qualified practitioner.
          </p>
        </Container>
      </section>

      {related.length ? (
        <section className="border-t border-border py-16 pb-28 lg:pb-16">
          <Container>
            <h2 className="font-display text-3xl">You may also like</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Sticky mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">{product.name}</p>
          <p className="font-display text-lg">{priceLabel(effectivePrice)}</p>
        </div>
        <button
          type="button"
          disabled={!canBuy}
          onClick={() => {
            addToCart();
            setOpen(true);
          }}
          className="rounded-sm border border-primary px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          disabled={!canBuy}
          onClick={() => {
            addToCart();
            void navigate({ to: "/checkout" });
          }}
          className="rounded-sm bg-primary px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>
    </>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div className="border-b border-border py-2">
      <dt className="text-[10px] uppercase tracking-[0.16em] text-gold">{term}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = React.useState(0);
  const [zoom, setZoom] = React.useState<{ x: number; y: number } | null>(null);
  const list = images.length ? images : [];
  const go = (d: number) => setIndex((i) => (list.length ? (i + d + list.length) % list.length : 0));

  const touch = React.useRef<number | null>(null);

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden rounded-sm border border-border bg-secondary"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
        onTouchStart={(e) => {
          touch.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          const end = e.changedTouches[0]?.clientX ?? null;
          if (start !== null && end !== null && Math.abs(end - start) > 40) go(end < start ? 1 : -1);
          touch.current = null;
        }}
      >
        {list[index] ? (
          <img
            src={list[index]}
            alt={`${name} — image ${index + 1}`}
            className="h-full w-full object-cover transition-transform duration-200"
            style={
              zoom
                ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                : { transform: "scale(1)" }
            }
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">Image coming soon</div>
        )}

        {list.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>

      {list.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "h-20 w-20 shrink-0 overflow-hidden rounded-sm border",
                i === index ? "border-gold" : "border-border",
              )}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-3 hidden text-[11px] uppercase tracking-[0.14em] text-muted-foreground lg:block">
        Hover the image to zoom
      </p>
    </div>
  );
}

type ReviewRow = {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
};

function Reviews({ productId, reviews }: { productId: string; reviews: ReviewRow[] }) {
  const [name, setName] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const breakdown = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Please enter your name.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      author_name: name.trim().slice(0, 60),
      rating,
      title: title.trim().slice(0, 80) || null,
      body: body.trim().slice(0, 800) || null,
      status: "pending",
    });
    setSending(false);
    if (error) {
      toast.error("Could not send your review. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Thank you — your review will appear once approved.");
  };

  return (
    <div className="space-y-8 text-sm text-muted-foreground">
      {reviews.length ? (
        <div className="grid gap-6 border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="text-center">
            <p className="font-display text-5xl text-foreground">{avg.toFixed(1)}</p>
            <Stars value={Math.round(avg)} className="mt-2 justify-center" />
            <p className="mt-2 text-xs uppercase tracking-[0.14em]">
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
          <ul className="space-y-2">
            {breakdown.map((b) => (
              <li key={b.n} className="flex items-center gap-3 text-xs">
                <span className="w-10">{b.n} ★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full bg-gold"
                    style={{ width: `${reviews.length ? (b.count / reviews.length) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-6 text-right">{b.count}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No reviews yet. Be the first to share your experience.</p>
      )}

      <ul className="space-y-6">
        {reviews.map((r) => (
          <li key={r.id} className="border-b border-border pb-6">
            <Stars value={r.rating} />
            {r.title ? <p className="mt-2 font-display text-lg text-foreground">{r.title}</p> : null}
            {r.body ? <p className="mt-1">{r.body}</p> : null}
            <p className="mt-2 text-xs uppercase tracking-[0.16em]">
              {r.author_name} · {new Date(r.created_at).toLocaleDateString("en-IN")}
            </p>
          </li>
        ))}
      </ul>

      {done ? (
        <p className="text-foreground">Your review has been received and is awaiting approval.</p>
      ) : (
        <form onSubmit={submit} className="max-w-xl space-y-4 border border-border p-6">
          <h3 className="font-display text-2xl text-foreground">Write a review</h3>
          <div>
            <label htmlFor="rev-rating" className="text-[11px] uppercase tracking-[0.16em]">
              Rating
            </label>
            <select
              id="rev-rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rev-name" className="text-[11px] uppercase tracking-[0.16em]">
              Your name
            </label>
            <input
              id="rev-name"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="rev-title" className="text-[11px] uppercase tracking-[0.16em]">
              Title
            </label>
            <input
              id="rev-title"
              value={title}
              maxLength={80}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="rev-body" className="text-[11px] uppercase tracking-[0.16em]">
              Your experience
            </label>
            <textarea
              id="rev-body"
              value={body}
              maxLength={800}
              rows={4}
              onChange={(e) => setBody(e.target.value)}
              className="mt-2 w-full rounded-sm border border-input bg-card p-3 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60"
          >
            {sending ? "Sending…" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
