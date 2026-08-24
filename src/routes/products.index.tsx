import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { cx } from "@/lib/brand";
import { FAQSection } from "@/components/FAQSection";

type Search = { category?: string | undefined };

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category:
      typeof search["category"] === "string" ? search["category"] : undefined,
  }),
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Ayurvedic Products — Oils, Churnas & Rasayanas | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Shop authentic Ayurvedic products: herbal oils, churnas, rasayanas, immunity and skincare formulations prepared following classical methods.",
      },
      { property: "og:title", content: "Ayurvedic Products | Vaidh Bharti" },
      {
        property: "og:description",
        content:
          "Traditional Ayurvedic oils, churnas and rasayanas made with authentic ingredients.",
      },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
});

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
] as const;

function ProductsPage() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sort, setSort] = useState<(typeof sorts)[number]["id"]>("featured");

  const list = useMemo(() => {
    const filtered = category
      ? PRODUCTS.filter((p) => p.category === category)
      : PRODUCTS.slice();
    switch (sort) {
      case "price-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered.sort(
          (a, b) => Number(b.featured) - Number(a.featured),
        );
    }
  }, [category, sort]);

  const setCategory = (id?: string) =>
    navigate({ search: { category: id }, replace: true });

  return (
    <>
      <PageHero
        eyebrow="The Collection"
        crumb="Ayurvedic Products"
        title="Ayurvedic Products"
        subtitle="Traditional formulations prepared with authentic herbs — oils, churnas, rasayanas and daily wellness essentials."
      />

      <section className="py-14 md:py-20">
        <div className="container-vb">
          <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => setCategory(undefined)}
                aria-pressed={!category}
                className={cx(
                  "min-h-11 rounded-full border px-5 text-sm transition-colors",
                  !category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/40",
                )}
              >
                All products
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={cx(
                    "min-h-11 rounded-full border px-5 text-sm transition-colors",
                    category === c.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="min-h-11 rounded-md border border-border bg-card px-3 text-sm"
              >
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
            Showing {list.length} {list.length === 1 ? "product" : "products"}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 60} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
