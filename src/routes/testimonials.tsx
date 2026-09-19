import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Container, Reveal } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { site, testimonials } from "@/lib/site";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Patient Stories — Vaidh Bharti, Panchsheel Aarogya Dhaam" },
      {
        name: "description",
        content:
          "Read what patients say about Ayurvedic consultation and Panchakarma with Vaidh Jitender Bharti at Panchsheel Aarogya Dhaam, Hansi, Haryana.",
      },
      { property: "og:title", content: "Patient Stories — Vaidh Bharti, Panchsheel Aarogya Dhaam" },
      { property: "og:description", content: "Experiences shared by patients of Panchsheel Aarogya Dhaam." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: Testimonials,
});

function Testimonials() {
  return (
    <>
      <PageHero
        eyebrow="Patient Voices"
        title="Stories From Our Patients"
        intro="Experiences shared by people who have visited Panchsheel Aarogya Dhaam. Individual results vary."
        crumbs={[{ label: "Testimonials" }]}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <figure className="flex h-full flex-col border border-border bg-card p-8">
                  <div className="flex gap-1 text-gold" aria-label="Five out of five stars">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="mt-6 flex-1 font-display text-xl leading-snug">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.name} — {t.location}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <a
              href={site.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-border px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-gold hover:text-gold"
            >
              View More Reviews on Google
            </a>
            <Link
              to="/contact"
              className="rounded-sm bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Book a Consultation
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
