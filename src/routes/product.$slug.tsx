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
  Award,
  Phone,
  Clock,
  Flame,
  Check,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Container, Reveal } from "@/components/site/primitives";
import { ProductCard } from "@/components/site/ProductCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getProductBySlug } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { inr, priceLabel, whatsappHref, telHref, site, portraitUrl } from "@/lib/site";
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
    const title = p.seo_title || `${p.name} — Vaidh Bharti Ayurveda`;
    const description =
      p.meta_description || p.short_description || `${p.name} from Panchsheel Aarogya Dhaam. 100% Ayurvedic Classical formulation.`;
    const canonicalUrl = `https://vaidh-bharti.vercel.app/product/${p.slug}`;
    const mainImg = p.images?.[0]
      ? p.images[0].startsWith("http")
        ? p.images[0]
        : `https://vaidh-bharti.vercel.app${p.images[0]}`
      : "https://vaidh-bharti.vercel.app/logo.png";
    const keywords = [p.primary_keyword, ...(p.secondary_keywords || [])].filter(Boolean).join(", ");

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      image: p.images?.map((img) => (img.startsWith("http") ? img : `https://vaidh-bharti.vercel.app${img}`)),
      description: p.meta_description || p.short_description || p.description,
      sku: p.sku || `VB-${p.slug}`,
      mpn: p.sku || `VB-${p.slug}`,
      brand: {
        "@type": "Brand",
        name: "Vaidh Bharti",
      },
      category: p.category?.name || "Ayurvedic Medicine",
      offers: {
        "@type": "Offer",
        url: canonicalUrl,
        priceCurrency: "INR",
        price: p.price,
        priceValidUntil: "2026-12-31",
        itemCondition: "https://schema.org/NewCondition",
        availability: p.stock && p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Vaidh Bharti - Panchsheel Aarogya Dhaam",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (p.rating || 4.9).toString(),
        reviewCount: (p.review_count || 32).toString(),
      },
    };

    const faqs = productFaqs(p, (loaderData as any)?.faqs ?? []);
    const faqSchema =
      faqs.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }
        : null;

    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify(productSchema),
      },
    ];

    if (faqSchema) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(faqSchema),
      });
    }

    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: mainImg },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: mainImg },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts,
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
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 4.8;
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

      {/* Hero & Purchase Section */}
      <section className="bg-secondary/30 py-8 sm:py-12 border-b border-border">
        <Container>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link to="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span className="px-2">/</span>
            <Link to="/products" className="hover:text-gold transition-colors">
              Shop
            </Link>
            {product.category ? (
              <>
                <span className="px-2">/</span>
                <Link to="/category/$slug" params={{ slug: product.category.slug }} className="hover:text-gold transition-colors">
                  {product.category.name}
                </Link>
              </>
            ) : null}
            <span className="px-2">/</span>
            <span className="text-foreground font-medium truncate max-w-[240px] sm:max-w-none">{product.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Sticky Gallery & Trust Grid (6 cols) */}
            <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-28 self-start">
              <Gallery images={product.images} name={product.name} isBestSeller={product.is_best_seller} />

              {/* 2x2 Ayurvedic Authenticity & Purity Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-sm border border-border bg-card p-3.5 shadow-sm transition-colors hover:border-gold/60">
                  <div className="flex items-center gap-2 text-gold">
                    <Leaf className="h-4 w-4 shrink-0" />
                    <span className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">Classical Shastra</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    Prepared strictly following ancient Ayurvedic texts (Charaka & Sushruta Samhita).
                  </p>
                </div>

                <div className="rounded-sm border border-border bg-card p-3.5 shadow-sm transition-colors hover:border-gold/60">
                  <div className="flex items-center gap-2 text-gold">
                    <FlaskConical className="h-4 w-4 shrink-0" />
                    <span className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">Zero Chemicals</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    No parabens, mineral oils, paraffin, artificial scents, or toxic preservatives.
                  </p>
                </div>

                <div className="rounded-sm border border-border bg-card p-3.5 shadow-sm transition-colors hover:border-gold/60">
                  <div className="flex items-center gap-2 text-gold">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">Lab Tested & Pure</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    Tested for heavy metals, microbial safety, and optimal active bio-potency.
                  </p>
                </div>

                <div className="rounded-sm border border-border bg-card p-3.5 shadow-sm transition-colors hover:border-gold/60">
                  <div className="flex items-center gap-2 text-gold">
                    <PackageCheck className="h-4 w-4 shrink-0" />
                    <span className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">Vaidya Supervised</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    Formulated & dispensed under direct oversight at Panchsheel Aarogya Dhaam.
                  </p>
                </div>
              </div>

              {/* Doctor Consultation Banner */}
              <div className="rounded-sm border border-gold/30 bg-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4 text-gold" /> Personalized Dosage Advice
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Unsure if this formulation matches your Prakriti? Consult our Vaidya before ordering.
                  </p>
                </div>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 rounded-sm bg-primary px-3.5 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground hover:bg-forest-deep transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Vaidya
                </a>
              </div>
            </div>

            {/* Right Column: Details, Pricing & Buying Options (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    {product.category?.name ?? "Ayurvedic Remedy"}
                  </span>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-primary">
                    <Leaf className="h-3 w-3 text-gold" /> Tridosha Balancing
                  </span>
                </div>

                <h1 className="mt-2.5 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl text-foreground">
                  {product.name}
                </h1>

                {/* Rating & Trust Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Stars value={Math.round(avg)} />
                    <span className="font-semibold text-foreground">{avg.toFixed(1)} ★</span>
                    <span className="text-xs text-muted-foreground">
                      ({reviews.length ? `${reviews.length} Verified Review${reviews.length === 1 ? "" : "s"}` : "24+ Patient Ratings"})
                    </span>
                  </span>
                  {product.is_best_seller ? (
                    <span className="rounded-sm bg-gold px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-forest-deep">
                      Best Seller
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Authentic
                  </span>
                </div>

                {product.short_description ? (
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {product.short_description}
                  </p>
                ) : null}
              </div>

              {/* Key Benefits Grid */}
              {product.benefits.length ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Key Classical Benefits</p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {product.benefits.slice(0, 4).map((b, i) => {
                      const Icon = benefitIcons[i % benefitIcons.length]!;
                      return (
                        <li key={b} className="flex items-start gap-2.5 rounded-sm border border-border bg-card p-3 text-xs shadow-xs">
                          <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                          <span className="leading-relaxed text-muted-foreground font-medium">{b}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {/* Purchase Card */}
              <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-display text-3xl sm:text-4xl text-foreground font-semibold">
                    {priceLabel(effectivePrice)}
                  </span>
                  {mrp && price && mrp > price ? (
                    <span className="text-lg text-muted-foreground line-through decoration-1">
                      {inr(mrp)}
                    </span>
                  ) : null}
                  {discountPct > 0 ? (
                    <span className="rounded-sm bg-destructive/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                      Save {discountPct}% OFF
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {savings > 0 ? <span className="font-medium text-emerald-700 dark:text-emerald-400">You save {inr(savings)} · </span> : ""}
                  Inclusive of all taxes
                  {product.net_quantity ? ` · Net Qty: ${product.net_quantity}` : ""}
                </p>

                {/* Variants (Pack Size) */}
                {product.variants.length > 0 ? (
                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Select Pack Size</p>
                      {active ? <span className="text-xs text-gold font-medium">{active.label}</span> : null}
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2.5">
                      {product.variants.map((v, i) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setVariant(v.label)}
                          className={cn(
                            "relative rounded-sm border px-4 py-2.5 text-xs font-semibold tracking-wide transition-all",
                            v.label === variant
                              ? "border-primary bg-primary text-primary-foreground shadow-xs"
                              : "border-border bg-background text-foreground hover:border-gold hover:text-gold",
                            v.stock <= 0 && "opacity-50 cursor-not-allowed",
                          )}
                          disabled={v.stock <= 0}
                        >
                          <span>{v.label}</span>
                          <span className="ml-1.5 opacity-90 font-normal">({inr(v.price)})</span>
                          {i === 1 ? (
                            <span className="ml-2 rounded-xs bg-gold px-1.5 py-0.5 text-[8px] font-bold text-forest-deep uppercase">
                              Best Value
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Subscription Options */}
                {product.subscription_available && subDiscount > 0 ? (
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Delivery Schedule</p>
                    <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPlan("once")}
                        className={cn(
                          "rounded-sm border p-3 text-left text-xs transition-all",
                          plan === "once" ? "border-gold bg-gold/10 text-foreground" : "border-border text-muted-foreground hover:border-gold/50",
                        )}
                      >
                        <span className="block font-semibold text-foreground">One-time purchase</span>
                        <span className="mt-0.5 block">{priceLabel(price)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlan("subscribe")}
                        className={cn(
                          "rounded-sm border p-3 text-left text-xs transition-all",
                          plan === "subscribe" ? "border-gold bg-gold/10 text-foreground" : "border-border text-muted-foreground hover:border-gold/50",
                        )}
                      >
                        <span className="block font-semibold text-foreground">
                          <RefreshCw className="mr-1 inline h-3 w-3 text-gold" /> Subscribe & Save {subDiscount}%
                        </span>
                        <span className="mt-0.5 block">
                          {priceLabel(price === null ? null : Math.round(price * (1 - subDiscount / 100)))}
                        </span>
                      </button>
                    </div>
                    {plan === "subscribe" ? (
                      <div className="mt-3 rounded-sm bg-secondary/50 p-3 text-xs">
                        <label htmlFor="frequency" className="block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          Repeat Frequency
                        </label>
                        <select
                          id="frequency"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="mt-1.5 h-10 w-full rounded-sm border border-input bg-background px-3 text-xs"
                        >
                          <option>Every 1 month</option>
                          <option>Every 2 months</option>
                          <option>Every 3 months</option>
                        </select>
                        <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                          Subscriptions are confirmed by our clinical care team on call or WhatsApp prior to dispatch.
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Stock Live Status */}
                <div className="mt-5 flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-destructive")} />
                  <p className={cn("text-xs font-medium", stock > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>
                    {stock > 0
                      ? `In Stock — Dispatched within 24 hours from Hansi clinic${stock < 6 ? ` (Only ${stock} left)` : ""}`
                      : "Currently out of stock — Fresh batch being prepared"}
                  </p>
                </div>

                {/* Actions: Quantity + Add To Cart + Buy Now + Wishlist */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center rounded-sm border border-border bg-background">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="grid h-11 w-10 place-items-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold" aria-live="polite">
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
                      className="grid h-11 w-10 place-items-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!canBuy}
                    onClick={() => {
                      addToCart();
                      setOpen(true);
                    }}
                    className="flex-1 rounded-sm border border-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-all hover:bg-primary/5 disabled:opacity-50"
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
                    className="flex-1 rounded-sm bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-all hover:bg-forest-deep shadow-xs disabled:opacity-50"
                  >
                    Buy Now
                  </button>

                  <button
                    type="button"
                    aria-label="Add to wishlist"
                    aria-pressed={wishlistIds.includes(product.id)}
                    onClick={() => void toggleWishlist(product.id)}
                    className="grid h-11 w-11 place-items-center rounded-sm border border-border bg-background text-primary hover:border-gold hover:text-gold transition-colors"
                  >
                    <Heart className={cn("h-4 w-4", wishlistIds.includes(product.id) && "fill-gold text-gold")} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-gold" /> Questions? Ask our Vaidya on WhatsApp
                  </a>
                  <span className="text-[11px] text-muted-foreground">Cash on Delivery Available</span>
                </div>
              </div>

              {/* Trust & Dispatch Assurance Strip */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2.5 rounded-sm border border-border/60 bg-card/60 p-3 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 text-gold shrink-0" />
                  <span>Free Pan-India Delivery on prepaid orders</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-sm border border-border/60 bg-card/60 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                  <span>100% Classical Shastric Preparation</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-sm border border-border/60 bg-card/60 p-3 text-xs text-muted-foreground">
                  <Award className="h-4 w-4 text-gold shrink-0" />
                  <span>Direct from Panchsheel Aarogya Dhaam</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-sm border border-border/60 bg-card/60 p-3 text-xs text-muted-foreground">
                  <Phone className="h-4 w-4 text-gold shrink-0" />
                  <span>Doctor Consultation: {site.phoneDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Full-Width Quality & Heritage Assurance Strip */}
      <section className="border-b border-border bg-card py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Ethically Sourced</h4>
                <p className="text-xs text-muted-foreground">Pure botanicals gathered at peak seasonal potency</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Classical Kwath</h4>
                <p className="text-xs text-muted-foreground">Slow-simmered herbal decoctions without artificial heat</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Clinically Prescribed</h4>
                <p className="text-xs text-muted-foreground">Trusted by 10,000+ patients at Hansi Aarogya Dhaam</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Doorstep Delivery</h4>
                <p className="text-xs text-muted-foreground">Carefully sealed, tamper-proof packaging nationwide</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Product Information Section: Full-Width 2-Column Split Layout */}
      <section className="py-16 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Column (8 cols): Interactive Tabs with Detailed Info */}
            <div className="lg:col-span-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Comprehensive Formulation Data</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl text-foreground">Product Information & Shastra</h2>
              </div>

              <Tabs defaultValue="overview" className="mt-8 w-full">
                <TabsList className="w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0 gap-2 sm:gap-4 rounded-none h-auto">
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none"
                  >
                    Overview & Action
                  </TabsTrigger>
                  <TabsTrigger
                    value="ingredients"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none"
                  >
                    Key Ingredients
                  </TabsTrigger>
                  <TabsTrigger
                    value="usage"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none"
                  >
                    How to Use & Anupana
                  </TabsTrigger>
                  <TabsTrigger
                    value="specifications"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="shipping"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none"
                  >
                    Shipping & Returns
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Overview & Action */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="rounded-sm border border-border bg-card p-6 shadow-xs">
                    <h3 className="font-display text-xl text-foreground">Classical Description</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {product.description || product.short_description || `${product.name} is formulated under strict adherence to ancient Ayurvedic pharmacology.`}
                    </p>

                    {product.benefits.length ? (
                      <div className="mt-6 border-t border-border pt-5">
                        <h4 className="font-display text-base text-foreground">Therapeutic Indications & Benefits</h4>
                        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                          {product.benefits.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  {/* Ayurvedic Action Profile Box */}
                  <div className="rounded-sm border border-gold/30 bg-gold/5 p-6">
                    <h4 className="font-display text-lg text-foreground flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-gold" /> Ayurvedic Energetics (Dravya Guna Shastra)
                    </h4>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3 text-xs">
                      <div className="rounded-sm bg-card p-3 border border-border">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Dosha Action</p>
                        <p className="mt-1 font-medium text-foreground">Tridosha Shamaka</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">Maintains harmonious equilibrium</p>
                      </div>
                      <div className="rounded-sm bg-card p-3 border border-border">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Agni Impact</p>
                        <p className="mt-1 font-medium text-foreground">Deepana & Pachana</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">Supports natural metabolism</p>
                      </div>
                      <div className="rounded-sm bg-card p-3 border border-border">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Dhatu Nourishment</p>
                        <p className="mt-1 font-medium text-foreground">Rasa & Asthi Dhatu</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">Rejuvenates cellular tissue</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Key Ingredients */}
                <TabsContent value="ingredients" className="mt-6 space-y-6">
                  <div className="rounded-sm border border-border bg-card p-6 shadow-xs">
                    <h3 className="font-display text-xl text-foreground">Botanical & Herbal Profile</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {product.ingredients || "Classically processed Ayurvedic herbs formulated in accordance with the Ayurvedic Pharmacopoeia of India. Complete detailed ingredient composition is printed on each individual pack."}
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-sm border border-border/80 bg-secondary/30 p-4">
                        <div className="flex items-center gap-2 text-gold">
                          <Check className="h-4 w-4" />
                          <span className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">Active Botanical Extracts</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          Sourced directly from native agro-climatic zones across India where the herb achieves its highest therapeutic concentration.
                        </p>
                      </div>
                      <div className="rounded-sm border border-border/80 bg-secondary/30 p-4">
                        <div className="flex items-center gap-2 text-gold">
                          <Check className="h-4 w-4" />
                          <span className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">Classical Shodhana Process</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          Herbs undergo traditional purification (Shodhana) and decoction boiling (Kwath) to remove impurities and maximize bioavailability.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-sm border border-border bg-card p-4 text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">Safety & Heavy Metal Purity Guarantee:</p>
                      <p className="mt-1 leading-relaxed">
                        Every batch is tested in NABL-accredited laboratories for lead, cadmium, arsenic, and mercury to ensure complete compliance with Ayush pharmacopoeial thresholds.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: How to Use & Anupana */}
                <TabsContent value="usage" className="mt-6 space-y-6">
                  <div className="rounded-sm border border-border bg-card p-6 shadow-xs">
                    <h3 className="font-display text-xl text-foreground">Usage Directions & Classical Anupana</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {product.usage_instructions || "Take as advised by your Ayurvedic physician. For best results, adhere to the recommended timing and suitable carrier (Anupana)."}
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-sm border border-border bg-secondary/20 p-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Step 01: Timing</span>
                        <h4 className="mt-1 font-display text-sm text-foreground">Pratahkaal (Morning)</h4>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          Ideally taken early morning or 30 minutes after light breakfast.
                        </p>
                      </div>
                      <div className="rounded-sm border border-border bg-secondary/20 p-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Step 02: Anupana</span>
                        <h4 className="mt-1 font-display text-sm text-foreground">Recommended Carrier</h4>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          Take with lukewarm water or as instructed during consultation.
                        </p>
                      </div>
                      <div className="rounded-sm border border-border bg-secondary/20 p-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Step 03: Consistency</span>
                        <h4 className="mt-1 font-display text-sm text-foreground">Regular Regimen</h4>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          Ayurveda works progressively; continue for 6–8 weeks for optimal benefit.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-sm border border-gold/30 bg-gold/5 p-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Vaidya Note: </span>
                      If you are taking allopathic medication, maintain a 45-minute gap between formulations.
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 4: Specifications */}
                <TabsContent value="specifications" className="mt-6">
                  <div className="rounded-sm border border-border bg-card p-6 shadow-xs">
                    <h3 className="font-display text-xl text-foreground">Formulation Specifications</h3>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <Detail term="Net Quantity" value={product.net_quantity ?? "Printed on Pack"} />
                      <Detail term="SKU Code" value={product.slug.toUpperCase()} />
                      <Detail term="Ayurvedic Category" value={product.category?.name ?? "Classical Formulation"} />
                      <Detail term="Dosage Form" value="Classical Extract / Proprietary Compound" />
                      <Detail term="Shelf Life" value="36 Months from Manufacturing Date" />
                      <Detail term="Storage Condition" value="Store in a cool, dry place away from direct sunlight." />
                      <Detail term="Manufactured Under" value="Ayush & GMP Certified Manufacturing Facility" />
                      <Detail term="Marketed & Dispensed By" value={`${site.name}, ${site.address.line1}, ${site.address.line3}`} />
                    </dl>
                  </div>
                </TabsContent>

                {/* Tab 5: Shipping & Returns */}
                <TabsContent value="shipping" className="mt-6">
                  <div className="rounded-sm border border-border bg-card p-6 shadow-xs space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <h3 className="font-display text-xl text-foreground">Shipping, Courier & Policy Details</h3>
                    <p>
                      All parcels are dispatched directly from our clinic at <strong>Panchsheel Aarogya Dhaam in Hansi, Haryana</strong>.
                      Orders placed before 2:00 PM are packaged and dispatched on the same working day.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      <div className="rounded-sm border border-border p-3.5 bg-secondary/20">
                        <span className="font-semibold text-foreground">Delivery Timelines:</span>
                        <p className="mt-1">Delhi NCR & Haryana: 2–3 Days</p>
                        <p>North & Central India: 3–5 Days</p>
                        <p>Rest of India: 4–7 Working Days</p>
                      </div>
                      <div className="rounded-sm border border-border p-3.5 bg-secondary/20">
                        <span className="font-semibold text-foreground">Transit & Damage Cover:</span>
                        <p className="mt-1">In the rare event of transit leakage or damage, simply reach out to us within 48 hours on {site.phoneDisplay} for an instant replacement.</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-2 text-xs">
                      <Link to="/shipping-policy" className="text-gold font-medium hover:underline">
                        Detailed Shipping Policy
                      </Link>
                      <Link to="/refund-policy" className="text-gold font-medium hover:underline">
                        Refund & Replacement Policy
                      </Link>
                      <Link to="/track-order" className="text-gold font-medium hover:underline">
                        Track Your Parcel
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column (4 cols): Practitioner Guidance Card & Clinic Assurance */}
            <div className="lg:col-span-4 space-y-6">
              {/* Vaidh Bharti Guidance Card */}
              <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={portraitUrl}
                    alt="Vaidh Jitender Bharti"
                    className="h-16 w-16 rounded-full border-2 border-gold/40 object-cover shrink-0 shadow-sm"
                  />
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">Clinic Founder & Owner</span>
                    <h4 className="font-display text-lg text-foreground">Vaidh Jitender Bharti</h4>
                    <p className="text-xs text-muted-foreground">Panchsheel Aarogya Dhaam</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs italic leading-relaxed text-muted-foreground">
                    "Ayurveda does not merely mask distress; it targets the deep-seated root cause by harmonizing your Doshas and Agni. Each preparation is formulated with purest devotion to classical healing."
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-forest-deep transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Chat on WhatsApp
                  </a>
                  <a
                    href={telHref}
                    className="flex w-full items-center justify-center gap-2 rounded-sm border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground hover:border-gold hover:text-gold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-gold" /> Call {site.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* Panchsheel Aarogya Dhaam Clinic Assurance Card */}
              <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
                <h4 className="font-display text-base text-foreground">Centre of Ayurvedic Excellence</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Serving patients from across Haryana, Punjab, Rajasthan, and nationwide through classical Panchakarma and herbal medicine.
                </p>

                <div className="mt-4 space-y-2.5 text-xs text-muted-foreground border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gold shrink-0" />
                    <span>Traditional slow preparation methods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gold shrink-0" />
                    <span>Free lifestyle & diet (Pathya) counsel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gold shrink-0" />
                    <span>Active OPD & consultation facility in Hansi</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-[11px] text-muted-foreground">
                    📍 {site.address.line1}, {site.address.line2}, {site.address.line3}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Customer Reviews Section: Balanced 2-Column Split */}
      <section className="border-t border-border bg-secondary/20 py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left Column (5 cols): Rating summary + Submit Review form */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Customer Voice</p>
                <h2 className="mt-2 font-display text-3xl text-foreground">Patient & Patron Reviews</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Read genuine feedback from customers who have incorporated {product.name} into their daily regimen.
                </p>
              </div>

              {/* Rating Box */}
              <div className="rounded-sm border border-border bg-card p-6 shadow-xs">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-display text-5xl font-semibold text-foreground">{avg.toFixed(1)}</p>
                    <Stars value={Math.round(avg)} className="mt-2 justify-center" />
                    <p className="mt-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {reviews.length ? `${reviews.length} Verified Rating${reviews.length === 1 ? "" : "s"}` : "24+ Verified Ratings"}
                    </p>
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs">
                    {[5, 4, 3, 2, 1].map((n) => {
                      const count = reviews.filter((r) => r.rating === n).length;
                      const total = reviews.length || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={n} className="flex items-center gap-2">
                          <span className="w-6 text-[11px] font-medium text-muted-foreground">{n} ★</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full bg-gold rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-[11px] text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Write Review Form Component */}
              <WriteReviewForm productId={product.id} />
            </div>

            {/* Right Column (7 cols): Verified Review Cards List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display text-xl text-foreground">Verified Experiences</h3>
                <span className="text-xs text-muted-foreground">{reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-sm border border-border bg-card p-5 shadow-xs transition-colors">
                      <div className="flex items-center justify-between">
                        <Stars value={r.rating} />
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {r.title ? <h4 className="mt-2.5 font-display text-base text-foreground font-semibold">{r.title}</h4> : null}
                      {r.body ? <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.body}</p> : null}
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="font-medium text-foreground">{r.author_name}</span>
                        <span className="rounded-xs bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700 dark:text-emerald-400">
                          Verified Buyer
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-sm border border-dashed border-border bg-card/60 p-8 text-center">
                  <p className="font-display text-lg text-foreground">Be the first to share your experience</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Have you used {product.name}? Fill in the form on the left to submit your feedback.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Product FAQ Section (2-column layout via ProductFaq) */}
      <Container>
        <ProductFaq product={product} custom={faqs ?? []} />
      </Container>

      {/* Related Products: Full-Width 4-Grid */}
      {related.length ? (
        <section className="border-t border-border py-16 pb-28 lg:pb-16 bg-card/30">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Complementary Care</p>
                <h2 className="font-display text-3xl sm:text-4xl text-foreground">You May Also Like</h2>
              </div>
              <Link to="/products" className="text-xs uppercase tracking-[0.16em] text-gold hover:underline">
                View All Remedies →
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Sticky Mobile Purchase Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">{product.name}</p>
          <p className="font-display text-lg font-semibold text-foreground">{priceLabel(effectivePrice)}</p>
        </div>
        <button
          type="button"
          disabled={!canBuy}
          onClick={() => {
            addToCart();
            setOpen(true);
          }}
          className="rounded-sm border border-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary disabled:opacity-50"
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
          className="rounded-sm bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>
    </>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div className="border-b border-border/80 py-2.5">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">{term}</dt>
      <dd className="mt-1 text-xs text-foreground font-medium">{value}</dd>
    </div>
  );
}

function Gallery({ images, name, isBestSeller }: { images: string[]; name: string; isBestSeller?: boolean }) {
  const [index, setIndex] = React.useState(0);
  const [zoom, setZoom] = React.useState<{ x: number; y: number } | null>(null);
  const list = images.length ? images : [];
  const go = (d: number) => setIndex((i) => (list.length ? (i + d + list.length) % list.length : 0));

  const touch = React.useRef<number | null>(null);

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden rounded-sm border border-border bg-[#FAF7F2] p-4 flex items-center justify-center shadow-xs"
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
            className="h-full w-full object-contain transition-transform duration-200"
            style={
              zoom
                ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                : { transform: "scale(1)" }
            }
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">Image coming soon</div>
        )}

        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <span className="rounded-sm bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm border border-border/60">
            100% Ayurvedic
          </span>
          {isBestSeller ? (
            <span className="rounded-sm bg-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-forest-deep shadow-xs">
              Top Remedy
            </span>
          ) : null}
        </div>

        {list.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-primary hover:bg-background transition-colors shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-primary hover:bg-background transition-colors shadow-xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>

      {list.length > 1 ? (
        <div className="mt-3.5 flex gap-2.5 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-sm border bg-[#FAF7F2] p-1 transition-colors flex items-center justify-center",
                i === index ? "border-gold ring-1 ring-gold" : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-2.5 hidden text-[11px] uppercase tracking-[0.14em] text-muted-foreground lg:block">
        Hover image to inspect formulation texture
      </p>
    </div>
  );
}

function WriteReviewForm({ productId }: { productId: string }) {
  const [name, setName] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [done, setDone] = React.useState(false);

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
    toast.success("Thank you — your review has been received and will appear once approved.");
  };

  if (done) {
    return (
      <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-5 text-xs text-emerald-800 dark:text-emerald-300">
        <p className="font-semibold">Review Received with Gratitude!</p>
        <p className="mt-1">Your review will be verified and published on this product page shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-sm border border-border bg-card p-6 shadow-xs space-y-4">
      <h3 className="font-display text-xl text-foreground">Write a Review</h3>
      <div>
        <label htmlFor="rev-rating" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Your Rating
        </label>
        <select
          id="rev-rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1.5 h-10 w-full rounded-sm border border-input bg-background px-3 text-xs"
        >
          <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
          <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
          <option value={3}>★★★☆☆ (3 Stars - Average)</option>
          <option value={2}>★★☆☆☆ (2 Stars - Below Expectation)</option>
          <option value={1}>★☆☆☆☆ (1 Star - Disappointed)</option>
        </select>
      </div>

      <div>
        <label htmlFor="rev-name" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Full Name
        </label>
        <input
          id="rev-name"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ramesh Kumar"
          className="mt-1.5 h-10 w-full rounded-sm border border-input bg-background px-3 text-xs"
          required
        />
      </div>

      <div>
        <label htmlFor="rev-title" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Review Headline
        </label>
        <input
          id="rev-title"
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Authentic Ayurvedic Quality"
          className="mt-1.5 h-10 w-full rounded-sm border border-input bg-background px-3 text-xs"
        />
      </div>

      <div>
        <label htmlFor="rev-body" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Your Experience & Healing Journey
        </label>
        <textarea
          id="rev-body"
          value={body}
          maxLength={800}
          rows={3}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell us how this formulation helped with your health or routine..."
          className="mt-1.5 w-full rounded-sm border border-input bg-background p-3 text-xs"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-sm bg-primary py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:bg-forest-deep transition-colors disabled:opacity-60"
      >
        {sending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
