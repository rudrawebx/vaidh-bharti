import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Eyebrow, Reveal, Signature } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { panchsheel, portraitUrl, site, whatsappHref } from "@/lib/site";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Panchsheel Aarogya Dhaam | Vaidh Bharti" },
      {
        name: "description",
        content:
          "How Panchsheel Aarogya Dhaam began in Hansi, Haryana — the practice of Vaidh Bharti, the five principles behind the centre and the care offered there today.",
      },
      { property: "og:title", content: "Our Story — Vaidh Bharti" },
      {
        property: "og:description",
        content: "The journey behind Panchsheel Aarogya Dhaam and the Ayurvedic practice of Vaidh Bharti.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/our-story" },
    ],
    links: [{ rel: "canonical", href: "/our-story" }],
  }),
  component: OurStory,
});

function OurStory() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="A practice built on listening"
        intro="Panchsheel Aarogya Dhaam grew out of a simple conviction — that Ayurveda works best when the person in front of you is understood completely, not treated as a symptom."
        crumbs={[{ label: "Our Story" }]}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
            <Reveal>
              <img
                src={portraitUrl}
                alt="Vaidh Bharti, Ayurvedic practitioner at Panchsheel Aarogya Dhaam, Hansi"
                loading="lazy"
                className="w-full border border-border object-cover"
              />
            </Reveal>
            <Reveal delay={80} className="space-y-5 text-sm leading-relaxed text-muted-foreground">
              <Eyebrow>The beginning</Eyebrow>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">From classical study to daily practice</h2>
              <p>
                Vaidh Bharti&apos;s work began with the classical texts and with years of clinical observation — reading
                the pulse, watching how digestion, sleep and routine shape a person&apos;s health long before an illness
                is named.
              </p>
              <p>
                Panchsheel Aarogya Dhaam was established in Hansi, Haryana, as a place where that unhurried way of
                working could be offered to everyone who walks in. Consultations are conversations. Nadi Pariksha, the
                traditional pulse assessment, is where most of them begin.
              </p>
              <p>
                Over the years the centre has grown to include Panchakarma therapies, lifestyle counselling and
                traditional herbal formulations prepared to classical Ayurvedic formulas — but the approach has not
                changed. Understand the person first; then plan the care.
              </p>
              <p>
                Today the centre welcomes people from Hansi and the surrounding districts for consultation, therapy and
                follow-up, {site.hours.toLowerCase()}.
              </p>
              <Signature />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="surface-sand border-y border-border py-16 sm:py-24">
        <Container>
          <Eyebrow>Panchsheel</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl">The five principles the centre is named for</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {panchsheel.map((p, i) => (
              <Reveal key={p.n} delay={i * 60}>
                <article className="h-full border border-border bg-card p-7">
                  <span className="font-display text-3xl text-gold">{p.n}</span>
                  <h3 className="mt-3 font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 border border-border bg-card p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-3xl">Come and meet us</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Book a consultation at Panchsheel Aarogya Dhaam, or message us on WhatsApp with your question.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/book"
                className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-forest-deep"
              >
                Book Consultation
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-border px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold hover:text-gold"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
