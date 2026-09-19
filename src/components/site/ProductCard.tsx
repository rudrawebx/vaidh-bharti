import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import type { ProductDTO } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { inr, priceLabel } from "@/lib/site";
import { cn } from "@/lib/utils";

export function RatingStars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex", className)} aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("h-3.5 w-3.5", n <= Math.round(value) ? "fill-gold text-gold" : "text-border")} />
      ))}
    </span>
  );
}

export function ProductCard({
  product,
  wishlisted,
  onWishlist,
}: {
  product: ProductDTO;
  wishlisted?: boolean;
  onWishlist?: (productId: string) => void;
}) {
  const { add, setOpen } = useCart();
  const navigate = useNavigate();
  const variant = product.variants[0];
  const base = variant?.price ?? product.price;
  const mrp = variant?.mrp ?? product.mrp;
  const outOfStock = product.variants.length ? product.variants.every((v) => v.stock <= 0) : product.stock <= 0;
  const discount = mrp && base && mrp > base ? Math.round(((mrp - base) / mrp) * 100) : 0;

  const addToCart = () => {
    add(product.slug, variant?.label ?? null);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="hover-lift group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card">
      <div className="relative">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="relative block aspect-[4/5] overflow-hidden bg-secondary"
        >
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            />
          ) : null}
        </Link>
        <span className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1">
          {discount > 0 ? (
            <span className="rounded-sm bg-destructive px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
              {discount}% off
            </span>
          ) : null}
          {product.is_best_seller ? (
            <span className="rounded-sm bg-gold px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
              Best Seller
            </span>
          ) : null}
          {product.is_new_arrival ? (
            <span className="rounded-sm bg-primary px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
              New
            </span>
          ) : null}
        </span>
        {onWishlist ? (
          <button
            type="button"
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={!!wishlisted}
            onClick={() => onWishlist(product.id)}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-border bg-background/90 text-primary transition-colors hover:border-gold hover:text-gold"
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-gold text-gold")} />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold">{product.category?.name ?? "Ayurveda"}</p>
        <h3 className="mt-2 font-display text-xl leading-tight sm:text-2xl">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.short_description}
        </p>

        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <RatingStars value={product.review_count ? product.rating : 0} />
          {product.review_count ? (
            <span>
              {product.rating.toFixed(1)} · {product.review_count} review{product.review_count === 1 ? "" : "s"}
            </span>
          ) : (
            <span>No reviews yet</span>
          )}
        </p>

        <p className="mt-3 flex items-baseline gap-2 font-display text-2xl">
          {priceLabel(base)}
          {mrp && base && mrp > base ? (
            <span className="text-sm text-muted-foreground line-through">{inr(mrp)}</span>
          ) : null}
        </p>
        <p className={cn("mt-1 text-[11px] uppercase tracking-[0.14em]", outOfStock ? "text-destructive" : "text-primary")}>
          {outOfStock ? "Out of stock" : "In stock"}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={outOfStock || base === null}
            onClick={() => {
              addToCart();
              setOpen(true);
            }}
            className="rounded-sm border border-primary px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-secondary disabled:opacity-50"
          >
            {outOfStock ? "Unavailable" : "Add to Cart"}
          </button>
          <button
            type="button"
            disabled={outOfStock || base === null}
            onClick={() => {
              addToCart();
              void navigate({ to: "/checkout" });
            }}
            className="rounded-sm bg-primary px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-forest-deep disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="mt-3 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
