import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope,
  Activity,
  Sparkles,
  Soup,
  Sun,
  Leaf,
  Check,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { btn, cx, BRAND } from "@/lib/brand";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/wellness")({
  component: Wellness,
  head: () => ({
    meta: [
      { title: "Ayurvedic Wellness Services — Consultation & Panchakarma" },
      {
        name: "description",
        content:
          "Ayurvedic consultation, Nadi Pariksha, Panchakarma therapy, diet counselling and lifestyle guidance at Panchsheel Aarogya Dhaam, Hansi.",
      },
      { property: "og:title", content: "Ayurvedic Wellness Services | Vaidh Bharti" },
      {
        property: "og:description",
        content:
          "Personalised Ayurvedic care: consultation, pulse diagnosis, Panchakarma and lifestyle guidance.",
      },
      { property: "og:url", content: "/wellness" },
    ],
    links: [{ rel: "canonical", href: "/wellness" }],
  }),
});

const services = [
  {
    icon: Stethoscope,
    name: "Ayurvedic Consultation",
    text: "A detailed assessment of your prakriti, digestion, sleep and current imbalances, followed by a written plan.",
    points: ["Dosha assessment", "Written wellness plan", "Follow-up guidance"],
  },
  {
    icon: Activity,
    name: "Nadi Pariksha",
    text: "Traditional pulse diagnosis performed in person by an experienced Vaidya to read subtle imbalances.",
    points: ["In-person only", "Classical technique", "Findings explained clearly"],
  },
  {
    icon: Sparkles,
    name: "Panchakarma Therapy",
    text: "Classical five-fold cleansing and rejuvenation, designed as a personalised multi-day programme.",
    points: ["Abhyanga & Swedana", "Supervised programme", "Post-therapy diet plan"],
  },
  {
    icon: Soup,
    name: "Diet Counselling",
    text: "Seasonal, constitution-aware food guidance built around what you actually eat at home.",
    points: ["Dosha-specific foods", "Seasonal adjustments", "Practical recipes"],
  },
  {
    icon: Sun,
    name: "Lifestyle Guidance",
    text: "Dinacharya and Ritucharya routines — sleep, movement, oils and daily rhythm.",
    points: ["Daily routine", "Sleep & stress support", "Seasonal practices"],
  },
  {
    icon: Leaf,
    name: "Personalised Herbal Wellness",
    text: "Herbal formulations selected for your needs, prepared following classical methods.",
    points: ["Custom selection", "Classical preparation", "Dosage guidance"],
  },
];

const steps = [
  ["Consult", "Share your history, routine and concerns with a Vaidya."],
  ["Assess", "Nadi Pariksha and dosha assessment identify imbalances."],
  ["Plan", "You receive a personalised diet, routine and herbal plan."],
  ["Support", "Follow-up reviews keep the plan aligned with your progress."],
];

function Wellness() {
  return (
    <>
      <PageHero
        eyebrow="Wellness Services"
        crumb="Wellness"
        title="Traditional Care, Personalised for You"
        subtitle="Consultation, pulse diagnosis, Panchakarma and lifestyle guidance delivered by experienced Ayurvedic practitioners."
      >
        <Link to="/consultation" className={cx(btn.base, btn.gold, "mt-8")}>
          Book a Consultation
        </Link>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="container-vb grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 60}
              className="flex h-full flex-col rounded-lg border border-border bg-card p-7"
            >
              <s.icon className="size-6 text-gold" aria-hidden="true" />
              <h2 className="mt-5 font-display text-2xl">{s.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="container-vb">
          <SectionHeading
            eyebrow="How It Works"
            title="Your Journey with Us"
            subtitle="Four simple steps from first conversation to ongoing care."
          />
          <ol className="mt-14 grid gap-6 md:grid-cols-4">
            {steps.map(([title, text], i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 70}
                className="rounded-lg bg-card p-7"
              >
                <span className="font-display text-4xl text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-vb text-center">
          <h2 className="display-2 rule-gold-center">
            Care at {BRAND.center}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            All in-person services are offered at our centre in Hansi, Haryana.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/consultation" className={cx(btn.base, btn.primary)}>
              Book a Consultation
            </Link>
            <Link to="/contact" className={cx(btn.base, btn.outline)}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
