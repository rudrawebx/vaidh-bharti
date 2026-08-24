import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Star, Truck, ShieldCheck, Leaf } from "lucide-react";
import { PRODUCTS, formatPrice, productBySlug, productSlug } from "@/data/catalog";
import { btn, cx } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/Reveal";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product unavailable | Vaidh Bharti" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} — ${p.weight} | Vaidh Bharti Ayurveda`;
    return {
      meta: [
        { title },
        { name: "description", content: p.shortDesc },
        { property: "og:title", content: title },
        { property: "og:description", content: p.shortDesc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${params.slug}` },
        { property: "og:image", content: p.images[0] },
        { name: "twitter:image", content: p.images[0] },
      ],
      links: [{ rel: "canonical", href: `/products/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            image: p.images,
            description: p.description,
            sku: p.sku,
            brand: { "@type": "Brand", name: "Vaidh Bharti" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: p.rating,
              reviewCount: p.reviews.length,
            },
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "INR",
              availability:
                p.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const sameCategory = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  const others = PRODUCTS.filter(
    (p) => p.category !== product.category && p.id !== product.id,
  ).sort((a, b) => b.rating - a.rating);
  const related = [...sameCategory, ...others].slice(0, 4);

  return (
    <>
      <section className="border-b border-border bg-ivory py-4">
        <nav aria-label="Breadcrumb" className="container-vb text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-vb grid gap-12 lg:grid-cols-2">
          <div>
            <img
              src={product.images[img]}
              alt={`${product.name} — ${product.categoryLabel}`}
              width={940}
              height={705}
              className="aspect-4/3 w-full rounded-lg object-cover"
            />
            {product.images.length > 1 ? (
              <div className="mt-4 flex gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setImg(i)}
                    aria-label={`View image ${i + 1} of ${product.name}`}
                    aria-pressed={img === i}
                    className={cx(
                      "size-20 overflow-hidden rounded-md border-2 transition-colors",
                      img === i ? "border-primary" : "border-transparent",
                    )}
                  >
                    <img src={src} alt="" width={160} height={160} className="size-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
              {product.categoryLabel}
            </p>
            <h1 className="display-2 mt-3">{product.name}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex" aria-label={`Rated ${product.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cx(
                      "size-4",
                      i < Math.round(product.rating)
                        ? "fill-gold text-gold"
                        : "text-border",
                    )}
                    aria-hidden="true"
                  />
                ))}
              </span>
              {product.rating.toFixed(1)} · {product.reviews.length} reviews
            </div>

            <p className="mt-6 text-muted-foreground">{product.description}</p>

            <div className="mt-7 flex items-baseline gap-3">
              <span className="font-display text-4xl text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-muted-foreground line-through">
                {formatPrice(product.mrp)}
              </span>
              <span className="text-sm text-muted-foreground">
                · {product.weight}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              SKU {product.sku} ·{" "}
              {product.stock > 0 ? (
                <span className="text-primary">In stock</span>
              ) : (
                "Currently unavailable"
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-md border border-border">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="min-h-11 w-11 text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  className="min-h-11 w-11 text-lg"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={product.stock === 0}
                onClick={() => {
                  add(product.id, qty);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
                className={cx(btn.base, btn.primary, "disabled:opacity-50")}
              >
                {added ? (
                  <>
                    <Check className="size-4" aria-hidden="true" /> Added to cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <Link to="/cart" className={cx(btn.base, btn.outline)}>
                View Cart
              </Link>
            </div>

            <ul className="mt-8 grid gap-3 border-t border-border pt-8 text-sm text-muted-foreground sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-gold" aria-hidden="true" /> Free shipping over ₹999
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-gold" aria-hidden="true" /> Quality tested
              </li>
              <li className="flex items-center gap-2">
                <Leaf className="size-4 text-gold" aria-hidden="true" /> 100% natural
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="container-vb grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="font-display text-2xl">Key Benefits</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {product.benefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl">Ingredients</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {product.ingredients.map((b) => (
                <li key={b} className="flex gap-2">
                  <Leaf className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl">How to Use</h2>
            <p className="mt-4 text-sm text-muted-foreground">{product.usage}</p>
            <p className="mt-6 text-xs text-muted-foreground">
              This is a traditional Ayurvedic wellness product. Please consult an
              Ayurvedic practitioner or your physician before use alongside
              existing medication.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-vb">
          <h2 className="display-2 rule-gold">Customer Reviews</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {product.reviews.map((r) => (
              <li key={r.author} className="rounded-lg border border-border p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-gold text-gold" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">“{r.text}”</p>
                <p className="mt-4 text-sm font-medium">{r.author}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length ? (
        <section className="bg-ivory py-16 md:py-24">
          <div className="container-vb">
            <SectionHeading eyebrow="You may also like" title="Related Products" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <FAQSection />
    </>
  );
}
