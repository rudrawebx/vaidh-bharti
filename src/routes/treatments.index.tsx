import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, Reveal } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { journey, treatmentCards, wellnessAreas } from "@/lib/site";
import nadiImg from "@/assets/nadi.jpg";
import centreImg from "@/assets/centre.jpg";
import panchakarmaImg from "@/assets/panchakarma.jpg";
import herbs from "@/assets/herbs.jpg";

export const Route = createFileRoute("/treatments/")({
  head: () => ({
    meta: [
      { title: "Ayurvedic Treatments — Nadi Pariksha, Panchakarma & More | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Traditional Ayurvedic treatments at Panchsheel Aarogya Dhaam, Hansi — Nadi Pariksha, personalized treatment plans, Panchakarma, lifestyle consultation and herbal formulations.",
      },
      { property: "og:title", content: "Ayurvedic Treatments — Nadi Pariksha, Panchakarma & More" },
      {
        property: "og:description",
        content: "Traditional Ayurvedic therapies and personalized care at Panchsheel Aarogya Dhaam, Hansi, Haryana.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/treatments" },
    ],
    links: [{ rel: "canonical", href: "/treatments" }],
  }),
  component: Treatments,
});

function Treatments() {
  const images = [nadiImg, centreImg, panchakarmaImg, herbs, herbs];
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Traditional Therapies. Personalized Care."
        intro="Every plan begins with an assessment and is shaped around your constitution, strength and daily life."
        crumbs={[{ label: "Treatments" }]}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {treatmentCards.map((t, i) => (
              <Reveal key={t.title} delay={i * 70}>
                <article className="hover-lift group flex h-full flex-col border border-border bg-card">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={images[i] ?? herbs}
                      alt={t.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="text-2xl">{t.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                    <Link
                      to={t.to}
                      className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                    >
                      Learn More
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="surface-sand border-y border-border py-20">
        <Container>
          <h2 className="text-3xl sm:text-4xl">Areas of Wellness Support</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Support is offered across these areas of everyday wellbeing. Care is individual, and no outcome is promised.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {wellnessAreas.map((a) => (
              <li key={a} className="border border-border bg-card px-5 py-3 text-sm">
                {a}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <h2 className="text-3xl sm:text-4xl">How It Works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {journey.map((j) => (
              <li key={j.n}>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold font-display text-sm text-gold">
                  {j.n}
                </span>
                <h3 className="mt-5 text-xl">{j.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{j.body}</p>
              </li>
            ))}
          </ol>
          <Link
            to="/contact"
            className="mt-12 inline-flex rounded-sm bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
          >
            Book a Consultation
          </Link>
        </Container>
      </section>
    </>
  );
}
