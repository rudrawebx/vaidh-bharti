import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, HeartHandshake, Sparkles, Star, Users } from "lucide-react";
import { Container, Eyebrow, LotusMark, Reveal, SectionHeading, Signature } from "@/components/site/primitives";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Shlok } from "@/components/site/Shlok";
import {
  faqs,
  priceLabel,
  journey,
  mapEmbed,
  mapsHref,
  panchsheel,
  portraitUrl,
  products,
  site,
  telHref,
  testimonials,
  treatmentCards,
  wellnessAreas,
  whatsappHref,
  whyUs,
} from "@/lib/site";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import herbs from "@/assets/herbs.jpg";
import panchakarmaImg from "@/assets/panchakarma.jpg";
import centreImg from "@/assets/centre.jpg";
import nadiImg from "@/assets/nadi.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vaidh Bharti | Ayurvedic Treatment & Panchakarma in Hansi, Haryana" },
      {
        name: "description",
        content:
          "Authentic Ayurvedic care with Vaidh Bharti at Panchsheel Aarogya Dhaam, Hansi — personalized consultation, Nadi Pariksha, Panchakarma therapies and traditional herbal formulations.",
      },
      { property: "og:title", content: "Vaidh Bharti | Ayurvedic Treatment & Panchakarma in Hansi, Haryana" },
      {
        property: "og:description",
        content:
          "Personalized Ayurvedic consultation, Nadi Pariksha, Panchakarma and herbal formulations at Panchsheel Aarogya Dhaam.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.slice(0, 5).map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <About />
      <Shlok />
      <Philosophy />
      <AyurvedaEducation />
      <Treatments />
      <WellnessSupport />
      <PanchakarmaFeature />
      <HowItWorks />
      <ProductsPreview />
      <Testimonials />
      <WhyUs />
      <Gallery />
      <Faq />
      <Appointment />
    </>
  );
}

function Hero() {
  return (
    <section className="relative -mt-20 flex min-h-[92svh] items-end overflow-hidden pt-28">
      <img
        src={herbs}
        alt="Traditional Ayurvedic herbs, roots and brass vessels arranged on dark wood"
        width={1600}
        height={1104}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/85 to-forest-deep/45" />
      <Container className="relative pb-16 pt-16 sm:pb-24">
        <div className="max-w-3xl">
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span aria-hidden className="inline-block h-px w-10 bg-gold/70" />
            Traditional Ayurvedic Healing
          </p>
          <h1 className="mt-6 text-balance font-display text-4xl leading-[1.05] text-background sm:text-6xl md:text-7xl">
            Ancient Wisdom.
            <br />
            Personalized Healing.
            <br />
            <span className="italic text-gold-soft">A Healthier You.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-background/75">
            Experience authentic Ayurveda through personalized consultations, traditional therapies, Panchakarma and
            holistic lifestyle guidance at Panchsheel Aarogya Dhaam.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-forest-deep transition-transform hover:-translate-y-0.5"
            >
              Book a Consultation
            </Link>
            <Link
              to="/treatments"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-background/35 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-background transition-colors hover:border-gold hover:text-gold"
            >
              Explore Our Treatments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="mt-14 grid gap-x-8 gap-y-4 border-t border-background/20 pt-8 text-[13px] text-background/70 sm:grid-cols-2 lg:grid-cols-4">
            {["20+ Years of Experience", "Personalized Ayurvedic Care", "Traditional Therapies", "Holistic Wellness"].map(
              (t) => (
                <li key={t} className="flex items-center gap-2">
                  <LotusMark className="h-4 w-4 shrink-0 text-gold" />
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: Leaf, label: "Authentic Ayurveda" },
    { icon: HeartHandshake, label: "Personalized Care" },
    { icon: Sparkles, label: "Traditional Therapies" },
    { icon: LotusMark, label: "Holistic Wellness" },
    { icon: Users, label: "Patient-Centric Approach" },
  ];
  return (
    <section aria-label="Why patients trust us" className="border-b border-border bg-card">
      <Container>
        <ul className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x lg:grid-cols-5 lg:divide-y-0">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-3 px-4 py-6 text-center">
              <Icon className="h-4 w-4 shrink-0 text-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative">
            <div aria-hidden className="absolute -left-4 -top-4 h-28 w-28 border-l border-t border-gold/50" />
            <img
              src={portraitUrl}
              alt="Vaidh Bharti, founder of Panchsheel Aarogya Dhaam"
              loading="lazy"
              width={768}
              height={1024}
              className="relative w-full rounded-sm object-cover shadow-[0_40px_90px_-50px_rgba(31,45,37,0.75)]"
            />
            <div aria-hidden className="absolute -bottom-4 -right-4 h-28 w-28 border-b border-r border-gold/50" />
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>The Person Behind the Healing</Eyebrow>
            <h2 className="mt-5 text-balance text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
              A Life Dedicated to the Wisdom of Ayurveda
            </h2>
            <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                Vaidh Bharti is an Ayurvedic expert with over 20 years of experience and the founder of Panchsheel
                Aarogya Dhaam, a holistic Ayurvedic wellness centre guided by a single belief —{" "}
                <em className="text-foreground">“Ayurveda is not just treatment, it's a lifestyle.”</em>
              </p>
              <p>
                For him, healing is not a business but a sacred mission. Each person who walks in is met with an
                unhurried conversation, careful assessment and a plan shaped around their constitution, routine and
                circumstances.
              </p>
              <p>
                At the centre, classical therapies, personalized herbal formulations, Panchakarma, diet counselling and
                lifestyle guidance come together in a calm, nature-led environment — care that addresses the whole
                person, not a single symptom.
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between gap-6">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
              >
                Discover Vaidh Bharti's Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="hidden text-right sm:block">
                <Signature className="ml-auto h-10 w-40 text-gold" />
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Vaidh Bharti</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="surface-sand border-y border-border py-24 sm:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Our Philosophy"
          title="The Panchsheel Approach"
          subtitle="Five principles. One complete approach to wellbeing."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {panchsheel.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <article className="hover-lift h-full border border-border bg-card p-8">
                <div className="flex items-start justify-between">
                  <span className="font-display text-4xl text-gold/70">{p.n}</span>
                  <LotusMark className="h-7 w-7 text-primary/40" />
                </div>
                <h3 className="mt-8 text-2xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            </Reveal>
          ))}
          <Reveal delay={400}>
            <blockquote className="flex h-full items-center border border-gold/30 bg-primary p-8 font-display text-2xl leading-snug text-background">
              “We don't just treat diseases — we restore harmony in your life.”
            </blockquote>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function AyurvedaEducation() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>Understanding Ayurveda</Eyebrow>
            <h2 className="mt-5 text-balance text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
              Ayurveda Is More Than Treatment
            </h2>
            <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                Ayurveda begins with the individual rather than the illness. Two people with the same complaint may
                need two different approaches, because their constitution, digestion, sleep, work and temperament
                differ.
              </p>
              <p>
                That is why an Ayurvedic plan looks at daily routine, food, rest and state of mind alongside herbal
                support and therapy. The aim is balance that holds — not relief that fades.
              </p>
            </div>
            <Link
              to="/ayurveda"
              className="group mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
            >
              Discover Your Ayurvedic Path
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-sm">
              <img
                src={centreImg}
                alt="Courtyard of the Ayurvedic wellness centre with medicinal plants in terracotta pots"
                loading="lazy"
                width={1600}
                height={1104}
                className="w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Treatments() {
  return (
    <section className="border-y border-border bg-card py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Traditional Therapies. Personalized Care."
          subtitle="Every plan begins with an assessment, and is shaped around your constitution and daily life."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatmentCards.map((t, i) => {
            const img = [nadiImg, centreImg, panchakarmaImg, herbs, herbs][i] ?? herbs;
            return (
              <Reveal key={t.title} delay={i * 70}>
                <article className="hover-lift group flex h-full flex-col border border-border bg-background">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={img}
                      alt={t.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-2xl">{t.title}</h3>
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
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function WellnessSupport() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Where We Help"
          title="Areas of Wellness Support"
          subtitle="Ayurvedic support is offered across these areas of everyday wellbeing. Care is always individual, and no outcome is promised."
        />
        <ul className="mt-12 flex flex-wrap gap-3">
          {wellnessAreas.map((a, i) => (
            <Reveal as="li" key={a} delay={i * 50}>
              <span className="inline-flex items-center gap-2 border border-border bg-card px-5 py-3 text-sm text-foreground transition-colors hover:border-gold/60">
                <Leaf className="h-3.5 w-3.5 text-gold" />
                {a}
              </span>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Ayurvedic care at Panchsheel Aarogya Dhaam is supportive and individual. Please continue any treatment advised
          by your physician and share your medical history with us during consultation.
        </p>
      </Container>
    </section>
  );
}

function PanchakarmaFeature() {
  const steps = ["Assessment", "Personalized Plan", "Traditional Therapies", "Diet & Lifestyle Guidance", "Follow-up"];
  return (
    <section className="relative overflow-hidden bg-forest-deep py-24 text-background sm:py-32">
      <img
        src={panchakarmaImg}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/90 to-forest-deep/40" />
      <Container className="relative">
        <div className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-gold/60" />
            Panchakarma
          </p>
          <h2 className="mt-5 text-balance text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
            Reconnect With Your Natural Balance
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-background/75">
            Panchakarma is the classical Ayurvedic approach to cleansing and rejuvenation. It is not one treatment but a
            carefully sequenced programme — preparation, the main therapies, and a guided recovery — planned around your
            constitution, strength and daily commitments.
          </p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-4 border-b border-background/15 pb-3">
                <span className="font-display text-xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-background/85">{s}</span>
              </li>
            ))}
          </ol>
          <Link
            to="/treatments/panchakarma"
            className="group mt-10 inline-flex items-center gap-2 rounded-sm bg-gold px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-forest-deep"
          >
            Explore Panchakarma
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading align="center" eyebrow="How It Works" title="Your Journey With Us" />
        <ol className="mt-16 grid gap-10 md:grid-cols-4">
          {journey.map((j, i) => (
            <Reveal as="li" key={j.n} delay={i * 90} className="relative">
              <span aria-hidden className="absolute right-0 top-4 hidden h-px w-full bg-border md:block" />
              <div className="relative flex items-center gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold bg-background font-display text-sm text-gold">
                  {j.n}
                </span>
              </div>
              <h3 className="mt-6 text-xl">{j.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{j.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function ProductsPreview() {
  const { add, setOpen } = useCart();
  return (
    <section className="surface-sand border-y border-border py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The Store"
            title="Ayurvedic Wellness, Rooted in Tradition"
            subtitle="Oils, powders, Shilajit, capsules and skin care prepared in the classical Ayurvedic manner."
          />
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <article className="hover-lift group flex h-full flex-col border border-border bg-card">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="block aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold">{p.category}</p>
                  <h3 className="mt-2 text-xl">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.short}</p>
                  <p className="mt-4 font-display text-2xl">{priceLabel(p.price)}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        add(p.slug);
                        setOpen(true);
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="flex-1 rounded-sm bg-primary px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-forest-deep"
                    >
                      Add to Cart
                    </button>
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="rounded-sm border border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold hover:text-gold"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading align="center" eyebrow="Patient Voices" title="Stories From Our Patients" />
        <Carousel opts={{ align: "start", loop: true }} className="mt-14">
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                <figure className="flex h-full flex-col border border-border bg-card p-8">
                  <div className="flex gap-1 text-gold" aria-label="Five out of five stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="mt-6 flex-1 font-display text-xl leading-snug text-foreground">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.name} — {t.location}
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex justify-center gap-3">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
        <div className="mt-10 text-center">
          <a
            href={site.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            View More Reviews on Google
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </Container>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="border-y border-border bg-card py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeading
            eyebrow="Why Us"
            title="Why Choose Panchsheel Aarogya Dhaam?"
            subtitle="A quiet place to be heard, assessed properly, and guided over time."
          />
          <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {whyUs.map((w, i) => (
              <Reveal as="li" key={w} delay={i * 60} className="flex items-center gap-4 bg-background px-6 py-7">
                <LotusMark className="h-6 w-6 shrink-0 text-gold" />
                <span className="text-[15px] text-foreground">{w}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function Gallery() {
  const shots = [
    { src: centreImg, alt: "The centre courtyard with medicinal plants", span: "lg:col-span-2 lg:row-span-2" },
    { src: panchakarmaImg, alt: "Panchakarma therapy room with brass vessels", span: "" },
    { src: herbs, alt: "Ayurvedic herbs and formulations", span: "" },
    { src: nadiImg, alt: "Nadi Pariksha pulse assessment", span: "lg:col-span-2" },
  ];
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Visual Story" title="Inside Panchsheel Aarogya Dhaam" />
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            View Full Gallery
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid auto-rows-[190px] grid-cols-2 gap-4 lg:grid-cols-4">
          {shots.map((s) => (
            <div key={s.alt} className={`overflow-hidden rounded-sm ${s.span}`}>
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Faq() {
  return (
    <section className="surface-sand border-y border-border py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading eyebrow="Questions" title="Frequently Asked" subtitle="Everything you may want to know before your first visit." />
          <Accordion type="single" collapsible className="w-full">
            {faqs.slice(0, 6).map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                <AccordionTrigger className="py-6 text-left font-display text-xl hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-10">
          <Link to="/faq" className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">
            Read All Questions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function Appointment() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              eyebrow="Appointments"
              title="Begin Your Ayurvedic Wellness Journey"
              subtitle="Send an enquiry and we will get back to you during working hours, or reach us directly by phone or WhatsApp."
            />
            <div className="mt-10">
              <EnquiryForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-border bg-card p-8">
              <h3 className="text-2xl">Visit Us</h3>
              <address className="mt-5 space-y-1 not-italic text-sm leading-relaxed text-muted-foreground">
                <p className="text-foreground">{site.address.line1}</p>
                <p>{site.address.line2}</p>
                <p>{site.address.line3}</p>
              </address>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={telHref} className="text-foreground hover:text-gold">
                      {site.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${site.email}`} className="break-all text-foreground hover:text-gold">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-muted-foreground">Timings</dt>
                  <dd className="text-foreground">{site.hours}</dd>
                </div>
              </dl>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={telHref} className="rounded-sm bg-primary px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                  Call Now
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-gold hover:text-gold"
                >
                  WhatsApp
                </a>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-gold hover:text-gold"
                >
                  Get Directions
                </a>
              </div>
            </div>

            <iframe
              title="Map showing Panchsheel Aarogya Dhaam in Hansi, Haryana"
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border border-border"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
