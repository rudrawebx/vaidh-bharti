import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Container, Reveal } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { listCatalog } from "@/lib/catalog.functions";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const { categories, products } = await listCatalog();
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category, products: products.filter((p) => p.category?.slug === category.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category not found — Vaidh Bharti" }, { name: "robots", content: "noindex" }] };
    }
    const { category } = loaderData;
    const title = `${category.name} — Ayurvedic Products | Vaidh Bharti`;
    const description =
      category.description ??
      `Browse ${category.name} from Panchsheel Aarogya Dhaam — traditional Ayurvedic preparations delivered across India.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${category.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${category.slug}` }],
    };
  },
  notFoundComponent: CategoryNotFound,
  errorComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryNotFound() {
  return (
    <Container>
      <div className="py-32 text-center">
        <h1 className="font-display text-4xl">Category not found</h1>
        <Link
          to="/categories"
          className="mt-6 inline-block rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
        >
          All categories
        </Link>
      </div>
    </Container>
  );
}

function CategoryPage() {
  const { category, products } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="Category"
        title={category.name}
        intro={category.description ?? "Traditional Ayurvedic preparations from Panchsheel Aarogya Dhaam."}
        crumbs={[{ label: "Categories", to: "/categories" }, { label: category.name }]}
      />
      <section className="py-16">
        <Container>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products in this category yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={i * 50}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-12">
            <Link
              to="/products"
              className="inline-block rounded-sm border border-border px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold hover:text-gold"
            >
              View all products
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
