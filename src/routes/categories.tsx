import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Reveal } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { listCatalog } from "@/lib/catalog.functions";

export const Route = createFileRoute("/categories")({
  loader: () => listCatalog(),
  head: () => ({
    meta: [
      { title: "Shop by Category — Ayurvedic Products | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Browse Vaidh Bharti Ayurvedic products by category — herbal oils, churna powders, purified Shilajit, capsules and skin care from Panchsheel Aarogya Dhaam.",
      },
      { property: "og:title", content: "Shop by Category — Vaidh Bharti" },
      { property: "og:description", content: "Browse traditional Ayurvedic preparations by category." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: Categories,
});

function Categories() {
  const { categories, products } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="The Store"
        title="Shop by category"
        intro="Traditional Ayurvedic preparations, grouped so you can find what suits your routine."
        crumbs={[{ label: "Categories" }]}
      />
      <section className="py-16">
        <Container>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Categories will appear here once they are added.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, i) => {
                const count = products.filter((p) => p.category?.slug === c.slug).length;
                const cover = c.image_url ?? products.find((p) => p.category?.slug === c.slug)?.images[0] ?? null;
                return (
                  <Reveal key={c.id} delay={i * 60}>
                    <Link
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      className="hover-lift group flex h-full flex-col border border-border bg-card"
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden bg-secondary">
                        {cover ? (
                          <img
                            src={cover}
                            alt={c.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                          />
                        ) : null}
                      </span>
                      <span className="flex flex-1 flex-col p-6">
                        <span className="font-display text-2xl text-foreground">{c.name}</span>
                        <span className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {c.description ?? "Traditional Ayurvedic preparations."}
                        </span>
                        <span className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                          {count} {count === 1 ? "product" : "products"}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
