import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { formatPrice, productSlug, type Product } from "@/data/catalog";
import { btn, cx } from "@/lib/brand";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link
        to="/products/$slug"
        params={{ slug: productSlug(product) }}
        className="relative block aspect-4/3 overflow-hidden bg-cream"
      >
        <img
          src={product.images[0]}
          alt={`${product.name} — ${product.categoryLabel}`}
          width={940}
          height={650}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestseller ? (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              Best Seller
            </span>
          ) : null}
          {product.new ? (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              New
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {product.categoryLabel}
        </p>
        <h3 className="mt-2 font-display text-xl leading-tight">
          <Link
            to="/products/$slug"
            params={{ slug: productSlug(product) }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {product.shortDesc}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
          <span>
            {product.rating.toFixed(1)} · {product.reviews.length} reviews
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.mrp)}
            </span>
            {off > 0 ? (
              <span className="text-xs font-medium text-gold">{off}% off</span>
            ) : null}
          </p>
        </div>

        <button
          type="button"
          onClick={() => add(product.id)}
          className={cx(btn.base, btn.outline, "mt-4 w-full")}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
