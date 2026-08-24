import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BLOG_POSTS, postSlug } from "@/data/catalog";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/journal/")({
  component: JournalIndex,
  head: () => ({
    meta: [
      { title: "Ayurvedic Journal — Wisdom & Wellness Guides | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Practical Ayurvedic guidance on daily routine, seasonal living, herbs, digestion and sleep from the Vaidyas of Vaidh Bharti.",
      },
      { property: "og:title", content: "Ayurvedic Journal | Vaidh Bharti" },
      {
        property: "og:description",
        content: "Ayurvedic wisdom on routine, herbs, digestion and seasonal living.",
      },
      { property: "og:url", content: "/journal" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
});

function JournalIndex() {
  const [lead, ...rest] = BLOG_POSTS;

  return (
    <>
      <PageHero
        eyebrow="Ayurvedic Journal"
        crumb="Journal"
        title="Wisdom from Our Vaidyas"
        subtitle="Guides on daily routine, seasonal living, herbs and everyday Ayurvedic care."
      />

      <section className="py-16 md:py-24">
        <div className="container-vb">
          {lead ? (
            <Reveal className="grid items-center gap-10 rounded-lg bg-cream p-6 md:grid-cols-2 md:p-10">
              <img
                src={lead.image}
                alt={lead.title}
                width={940}
                height={650}
                className="aspect-16/10 w-full rounded-lg object-cover"
              />
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                  {lead.category} · {lead.readTime}
                </p>
                <h2 className="display-2 mt-3">
                  <Link to="/journal/$slug" params={{ slug: postSlug(lead) }}>
                    {lead.title}
                  </Link>
                </h2>
                <p className="mt-4 text-muted-foreground">{lead.excerpt}</p>
                <Link
                  to="/journal/$slug"
                  params={{ slug: postSlug(lead) }}
                  className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Read article
                </Link>
              </div>
            </Reveal>
          ) : null}

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <article className="group h-full overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <Link to="/journal/$slug" params={{ slug: postSlug(p) }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      width={940}
                      height={650}
                      loading="lazy"
                      className="aspect-16/10 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-6">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                      {p.category} · {p.readTime}
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-tight">
                      <Link to="/journal/$slug" params={{ slug: postSlug(p) }}>
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
