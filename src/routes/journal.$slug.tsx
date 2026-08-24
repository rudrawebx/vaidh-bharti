import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BLOG_POSTS, postSlug, postBySlug } from "@/data/catalog";
import { btn, cx } from "@/lib/brand";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article unavailable | Vaidh Bharti" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.post;
    return {
      meta: [
        { title: `${p.title} | Vaidh Bharti Ayurvedic Journal` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/journal/${params.slug}` },
        { property: "og:image", content: p.image },
        { name: "twitter:image", content: p.image },
      ],
      links: [{ rel: "canonical", href: `/journal/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            image: p.image,
            datePublished: p.date,
            articleSection: p.category,
            author: { "@type": "Organization", name: "Vaidh Bharti" },
          }),
        },
      ],
    };
  },
  component: JournalPost,
});

function JournalPost() {
  const { post } = Route.useLoaderData();
  const more = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <article>
        <header className="bg-primary-deep py-16 text-primary-foreground md:py-20">
          <div className="container-vb max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-xs text-primary-foreground/60">
              <Link to="/journal" className="hover:text-primary-foreground">
                Journal
              </Link>
              <span className="mx-2">/</span>
              <span>{post.category}</span>
            </nav>
            <h1 className="display-1 mt-5 text-primary-foreground">{post.title}</h1>
            <p className="mt-5 text-sm text-primary-foreground/70">
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · {post.readTime}
            </p>
          </div>
        </header>

        <div className="container-vb max-w-3xl py-14">
          <img
            src={post.image}
            alt={post.title}
            width={940}
            height={588}
            className="aspect-16/10 w-full rounded-lg object-cover"
          />
          <div className="prose-vb mt-10 space-y-5 text-lg leading-relaxed text-foreground/85">
            {post.body
              .split("\n")
              .filter(Boolean)
              .map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
          </div>
        </div>
      </article>

      <section className="bg-cream py-16">
        <div className="container-vb">
          <h2 className="display-2 rule-gold">Continue Reading</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <Link to="/journal/$slug" params={{ slug: postSlug(p) }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    width={940}
                    height={650}
                    loading="lazy"
                    className="aspect-16/10 w-full object-cover"
                  />
                </Link>
                <div className="p-6">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                    {p.category}
                  </p>
                  <h3 className="mt-3 font-display text-xl leading-tight">
                    <Link to="/journal/$slug" params={{ slug: postSlug(p) }}>
                      {p.title}
                    </Link>
                  </h3>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/consultation" className={cx(btn.base, btn.primary)}>
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
