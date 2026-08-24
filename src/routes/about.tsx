import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import founder from "@/assets/founder.jpg.asset.json";
import { BRAND, btn, cx } from "@/lib/brand";
import { PageHero } from "@/components/PageHero";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Vaidh Bharti — Our Ayurvedic Story & Founder" },
      {
        name: "description",
        content:
          "The story of Vaidh Bharti, founder Vaidya Bharti Sharma and Panchsheel Aarogya Dhaam — classical Ayurveda practised with care in Hansi, Haryana.",
      },
      { property: "og:title", content: "About Vaidh Bharti — Our Ayurvedic Story" },
      {
        property: "og:description",
        content:
          "Decades of classical Ayurvedic practice, personalised care and honest herbal formulations.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const values = [
  ["Authenticity", "Classical preparation methods, documented sourcing, no shortcuts."],
  ["Purity", "Herbs from trusted growers, free of artificial colours and fillers."],
  ["Compassion", "Every patient is heard before anything is prescribed."],
  ["Knowledge", "Practice grounded in the Charaka and Sushruta Samhitas."],
  ["Sustainability", "Responsible harvesting and minimal, recyclable packaging."],
  ["Service", "Ayurveda kept accessible to every family, not only a few."],
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        crumb="About"
        title="Rooted in Tradition, Practised with Care"
        subtitle={`Vaidh Bharti brings classical Ayurveda to modern life through personalised consultation and honest herbal formulations.`}
      />

      <section className="py-20 md:py-28">
        <div className="container-vb grid items-start gap-14 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <span className="eyebrow">The Journey</span>
            <h2 className="display-2 mt-3 rule-gold">
              A practice built on listening
            </h2>
            <div className="mt-7 space-y-4 text-muted-foreground">
              <p>
                Vaidh Bharti began as a modest practice in Hansi, Haryana, where{" "}
                {BRAND.founder} treated families from the surrounding villages
                using Nadi Pariksha, herbal formulations prepared by hand and
                patient guidance on daily routine.
              </p>
              <p>
                Word travelled. What started with a handful of patients became{" "}
                {BRAND.center} — a dedicated wellness centre offering
                consultation, Panchakarma therapy, diet counselling and an
                in-house herbal pharmacy.
              </p>
              <p>
                Today the same principles hold. Every formulation follows
                classical texts. Every consultation begins with understanding
                the person rather than the symptom. And every product carries a
                batch number, because trust should be verifiable.
              </p>
            </div>
            <blockquote className="mt-9 rounded-lg border-l-2 border-gold bg-cream p-7 font-display text-2xl italic leading-snug">
              “Ayurveda is not merely a system of medicine, but a way of life.”
              <footer className="mt-4 font-sans text-sm not-italic text-muted-foreground">
                — {BRAND.founder}, Founder
              </footer>
            </blockquote>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={founder.url}
              alt={`${BRAND.founder}, founder of ${BRAND.center}`}
              width={768}
              height={1024}
              className="w-full rounded-lg object-cover shadow-card"
            />
            <div className="mt-6 rounded-lg border border-border p-6">
              <p className="font-display text-2xl">{BRAND.founder}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Founder · {BRAND.center}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {[
                  "Classical Ayurvedic training",
                  "Nadi Pariksha specialist",
                  "Panchakarma therapy practitioner",
                ].map((c) => (
                  <li key={c} className="flex gap-2">
                    <Leaf className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-vb">
          <SectionHeading
            eyebrow="What Guides Us"
            title="Our Values"
            subtitle="Six commitments that shape how we prepare, prescribe and care."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(([title, text], i) => (
              <Reveal
                key={title}
                delay={i * 60}
                className="rounded-lg border border-border bg-card p-7"
              >
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-vb text-center">
          <h2 className="display-2 rule-gold-center">Visit us in Hansi</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            {BRAND.addressLine1}, {BRAND.addressLine2}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/consultation" className={cx(btn.base, btn.primary)}>
              Book a Consultation
            </Link>
            <Link
              to="/panchsheel-aarogya-dhaam"
              className={cx(btn.base, btn.outline)}
            >
              About the Centre
            </Link>
          </div>
        </div>
      </section>
      <FAQSection />
    </>
  );
}
