import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X, Truck, Leaf, ShieldCheck } from "lucide-react";
import { Container, Reveal } from "@/components/site/primitives";
import { ProductCard } from "@/components/site/ProductCard";
import { listCatalog } from "@/lib/catalog.functions";
import { healthGroups, healthTagsFor } from "@/lib/health";
import { useWishlist } from "@/lib/wishlist";
import { inr } from "@/lib/site";
import { cn } from "@/lib/utils";

type Search = { category?: string | undefined; health?: string | undefined; q?: string | undefined };

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search['category'] === "string" ? search['category'] : undefined,
    health: typeof search['health'] === "string" ? search['health'] : undefined,
    q: typeof search['q'] === "string" ? search['q'] : undefined,
  }),
  loader: () => listCatalog(),
  head: () => ({
    meta: [
      { title: "Shop Ayurvedic Products — Oils, Powders, Shilajit & Capsules | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Buy traditional Ayurvedic preparations from Panchsheel Aarogya Dhaam — herbal oils, churna powders, purified Shilajit, capsules and skin care, delivered across India.",
      },
      { property: "og:title", content: "Shop Ayurvedic Products — Vaidh Bharti" },
      { property: "og:description", content: "Traditional Ayurvedic preparations from Panchsheel Aarogya Dhaam." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Products,
});

type Sort = "featured" | "price-asc" | "price-desc" | "name" | "rating";
const PAGE = 9;

function Products() {
  const { products, categories } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const wishlist = useWishlist();

  const category = search.category ?? "all";
  const health = search.health ?? "all";
  const [query, setQuery] = React.useState(search.q ?? "");
  const [sort, setSort] = React.useState<Sort>("featured");
  const [visible, setVisible] = React.useState(PAGE);
  const [drawer, setDrawer] = React.useState(false);

  const priceOf = React.useCallback(
    (p: (typeof products)[number]) => p.variants[0]?.price ?? p.price ?? 0,
    [],
  );

  const bounds = React.useMemo(() => {
    const values = products.map(priceOf).filter((v) => v > 0);
    return { min: 0, max: values.length ? Math.ceil(Math.max(...values) / 100) * 100 : 5000 };
  }, [products, priceOf]);

  const [range, setRange] = React.useState<[number, number]>([bounds.min, bounds.max]);
  React.useEffect(() => setRange([bounds.min, bounds.max]), [bounds.min, bounds.max]);

  const tagged = React.useMemo(
    () => products.map((p) => ({ product: p, tags: healthTagsFor(p) })),
    [products],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tagged
      .filter(({ product: p, tags }) => {
        if (category !== "all" && p.category?.slug !== category) return false;
        if (health !== "all" && !tags.includes(health)) return false;
        const price = priceOf(p);
        if (price > 0 && (price < range[0] || price > range[1])) return false;
        if (q && !`${p.name} ${p.short_description ?? ""} ${p.category?.name ?? ""}`.toLowerCase().includes(q))
          return false;
        return true;
      })
      .map((t) => t.product)
      .sort((a, b) => {
        if (sort === "price-asc") return priceOf(a) - priceOf(b);
        if (sort === "price-desc") return priceOf(b) - priceOf(a);
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "rating") return b.rating - a.rating;
        return Number(b.is_featured) - Number(a.is_featured);
      });
  }, [tagged, category, health, range, query, sort, priceOf]);

  React.useEffect(() => setVisible(PAGE), [category, health, query, sort, range]);

  const setParam = (patch: Partial<Search>) =>
    void navigate({ search: (prev: Search) => ({ ...prev, ...patch }), replace: true });

  const clearAll = () => {
    setQuery("");
    setRange([bounds.min, bounds.max]);
    void navigate({ search: {}, replace: true });
  };

  const activeCount =
    (category !== "all" ? 1 : 0) +
    (health !== "all" ? 1 : 0) +
    (range[0] !== bounds.min || range[1] !== bounds.max ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const counts = React.useMemo(() => {
    const byCategory = new Map<string, number>();
    const byHealth = new Map<string, number>();
    for (const { product, tags } of tagged) {
      if (product.category) byCategory.set(product.category.slug, (byCategory.get(product.category.slug) ?? 0) + 1);
      for (const t of tags) byHealth.set(t, (byHealth.get(t) ?? 0) + 1);
    }
    return { byCategory, byHealth };
  }, [tagged]);

  const sidebar = (
    <div className="space-y-10">
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Product categories
        </h2>
        <ul className="mt-4 space-y-1">
          {[{ slug: "all", name: "All Categories", n: products.length }, ...categories.map((c) => ({
            slug: c.slug,
            name: c.name,
            n: counts.byCategory.get(c.slug) ?? 0,
          }))].map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => {
                  setParam({ category: c.slug === "all" ? undefined : c.slug });
                  setDrawer(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm transition-colors",
                  category === c.slug ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
                )}
              >
                <span>{c.name}</span>
                <span className="text-xs opacity-70">{c.n}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Price range</h2>
        <div className="mt-4 flex items-center gap-3">
          <label className="sr-only" htmlFor="price-min">
            Minimum price
          </label>
          <input
            id="price-min"
            type="number"
            min={bounds.min}
            max={range[1]}
            value={range[0]}
            onChange={(e) => setRange(([, hi]) => [Math.min(Number(e.target.value) || 0, hi), hi])}
            className="h-11 w-full rounded-sm border border-input bg-card px-3 text-sm"
          />
          <span className="text-muted-foreground">–</span>
          <label className="sr-only" htmlFor="price-max">
            Maximum price
          </label>
          <input
            id="price-max"
            type="number"
            min={range[0]}
            max={bounds.max}
            value={range[1]}
            onChange={(e) => setRange(([lo]) => [lo, Math.max(Number(e.target.value) || 0, lo)])}
            className="h-11 w-full rounded-sm border border-input bg-card px-3 text-sm"
          />
        </div>
        <input
          type="range"
          aria-label="Maximum price"
          min={bounds.min}
          max={bounds.max}
          step={50}
          value={range[1]}
          onChange={(e) => setRange(([lo]) => [Math.min(lo, Number(e.target.value)), Number(e.target.value)])}
          className="mt-4 w-full accent-[hsl(var(--gold))]"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {inr(range[0])} – {inr(range[1])}
        </p>
      </div>

      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Shop by wellness need
        </h2>
        <ul className="mt-4 space-y-1">
          {[{ slug: "all", label: "All Needs" }, ...healthGroups.map((g) => ({ slug: g.slug, label: g.label }))].map(
            (g) => (
              <li key={g.slug}>
                <button
                  type="button"
                  onClick={() => {
                    setParam({ health: g.slug === "all" ? undefined : g.slug });
                    setDrawer(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm transition-colors",
                    health === g.slug ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
                  )}
                >
                  <span>{g.label}</span>
                  {g.slug !== "all" ? (
                    <span className="text-xs opacity-70">{counts.byHealth.get(g.slug) ?? 0}</span>
                  ) : null}
                </button>
              </li>
            ),
          )}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          These groups help you browse by area of traditional use. They are not medical claims.
        </p>
      </div>

      <button
        type="button"
        onClick={clearAll}
        className="w-full rounded-sm border border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold hover:text-gold"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <>
      <section className="border-b border-border bg-secondary/40 pb-14 pt-28 sm:pt-36">
        <Container>
          <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link to="/" className="hover:text-gold">
              Home
            </Link>
            <span className="px-2">/</span>
            <span className="text-foreground">Shop</span>
          </nav>
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-gold">The Store</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
            Ayurvedic Wellness, Rooted in Tradition
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Herbal oils, churna powders, purified Shilajit, capsules and skin care — prepared in the classical manner at
            Panchsheel Aarogya Dhaam and delivered across India.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Leaf, title: "Classically prepared", body: "Traditional formulations, honest ingredients." },
              { icon: Truck, title: "Delivered across India", body: "Dispatch within 2–3 working days." },
              { icon: ShieldCheck, title: "Guided by a Vaidya", body: "Speak to us before you choose." },
            ].map((f) => (
              <li key={f.title} className="flex items-start gap-3 rounded-sm border border-border bg-card p-4">
                <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span>
                  <span className="block text-sm font-semibold">{f.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{f.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">{sidebar}</div>
            </aside>

            <div>
              <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDrawer(true)}
                    className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filters
                    {activeCount ? <span className="rounded-full bg-gold px-2 text-[10px] text-forest-deep">{activeCount}</span> : null}
                  </button>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground" aria-live="polite">
                    {filtered.length} product{filtered.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex w-full gap-3 sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <label htmlFor="product-search" className="sr-only">
                      Search products
                    </label>
                    <Search
                      aria-hidden
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      id="product-search"
                      type="search"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setParam({ q: e.target.value.trim() || undefined });
                      }}
                      placeholder="Search products"
                      className="h-12 w-full rounded-sm border border-input bg-card pl-11 pr-4 text-sm"
                    />
                  </div>
                  <label className="sr-only" htmlFor="product-sort">
                    Sort products
                  </label>
                  <select
                    id="product-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="h-12 rounded-sm border border-input bg-card px-3 text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Top rated</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="mt-16 rounded-sm border border-dashed border-border p-12 text-center">
                  <h2 className="font-display text-2xl">No products match your filters</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Try a different search term, widen the price range, or clear the filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-6 rounded-sm bg-primary px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.slice(0, visible).map((p, i) => (
                      <Reveal key={p.slug} delay={Math.min(i, 5) * 60}>
                        <ProductCard
                          product={p}
                          wishlisted={wishlist.ids.includes(p.id)}
                          onWishlist={wishlist.toggle}
                        />
                      </Reveal>
                    ))}
                  </div>
                  {visible < filtered.length ? (
                    <div className="mt-12 text-center">
                      <button
                        type="button"
                        onClick={() => setVisible((v) => v + PAGE)}
                        className="rounded-sm border border-primary px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-secondary"
                      >
                        Load more products
                      </button>
                    </div>
                  ) : null}
                </>
              )}

              <p className="mt-12 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                These are traditional Ayurvedic preparations. They are not intended to diagnose, treat or cure any
                disease. Please use them under the guidance of a qualified practitioner and read the product label
                before use.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {drawer ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/50"
            role="button"
            tabIndex={-1}
            aria-label="Close filters"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[86vw] max-w-sm overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl">Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setDrawer(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebar}
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="mt-6 w-full rounded-sm bg-primary px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Show {filtered.length} product{filtered.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
