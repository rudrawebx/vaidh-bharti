import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf,
  HeartHandshake,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Activity,
  Soup,
  Sun,
  Star,
  ArrowRight,
} from "lucide-react";
import hero from "@/assets/hero-ayurveda.jpg";
import founder from "@/assets/founder.jpg.asset.json";
import { BRAND, btn, cx } from "@/lib/brand";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { BLOG_POSTS, CATEGORIES, PRODUCTS, TESTIMONIALS, postSlug } from "@/data/catalog";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Vaidh Bharti — Authentic Ayurvedic Wellness & Products" },
      {
        name: "description",
        content:
          "Ancient Ayurvedic wisdom, personalised consultation and natural formulations from Vaidh Bharti and Panchsheel Aarogya Dhaam, Hansi, Haryana.",
      },
      {
        property: "og:title",
        content: "Vaidh Bharti — Authentic Ayurvedic Wellness & Products",
      },
      {
        property: "og:description",
        content:
          "Ayurvedic products, Nadi Pariksha, Panchakarma and personalised wellness care rooted in classical tradition.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const usps = [
  { icon: Leaf, title: "Authentic Ayurvedic Wisdom", text: "Formulations prepared following classical Ayurvedic texts." },
  { icon: HeartHandshake, title: "Personalised Care", text: "Guidance shaped around your constitution and daily life." },
  { icon: FlaskConical, title: "Natural Ingredients", text: "Herbs sourced from trusted growers, no artificial additives." },
  { icon: ShieldCheck, title: "Experienced Vaidyas", text: "Decades of practice in Nadi Pariksha and Panchakarma." },
];

const services = [
  { icon: Stethoscope, name: "Ayurvedic Consultation", text: "A detailed assessment of your constitution, routine and concerns." },
  { icon: Activity, name: "Nadi Pariksha", text: "Traditional pulse reading by an experienced Vaidya." },
  { icon: Sparkles, name: "Panchakarma", text: "Classical cleansing and rejuvenation therapy programmes." },
  { icon: Soup, name: "Diet Counselling", text: "Seasonal, dosha-aware food guidance you can actually follow." },
  { icon: Sun, name: "Lifestyle Guidance", text: "Dinacharya and Ritucharya routines for everyday balance." },
  { icon: Leaf, name: "Personalised Herbal Wellness", text: "Herbal support selected for your needs and lifestyle." },
];

function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const posts = BLOG_POSTS.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory">
        <div className="container-vb grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div>
            <span className="eyebrow">{BRAND.tagline}</span>
            <h1 className="display-1 mt-5 max-w-xl">
              Authentic Ayurvedic Wellness for Modern Life
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Ancient Ayurvedic wisdom, personalised care and natural
              formulations designed to bring your body, mind and lifestyle back
              into balance.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className={cx(btn.base, btn.primary)}>
                Explore Ayurvedic Products
              </Link>
              <Link to="/consultation" className={cx(btn.base, btn.outline)}>
                Book Consultation
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["25+", "Years of practice"],
                ["12", "Ayurvedic formulations"],
                ["1", "Wellness centre in Hansi"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-primary">{n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Brass mortar and pestle with fresh tulsi, ashwagandha root and Ayurvedic herbal powder"
              width={1600}
              height={1200}
              fetchPriority="high"
              className="w-full rounded-lg object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      {/* Trust / USP */}
      <section className="border-y border-border bg-background py-14">
        <div className="container-vb grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((u, i) => (
            <Reveal key={u.title} delay={i * 80} className="flex gap-4">
              <u.icon className="mt-1 size-6 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <h3 className="text-base font-semibold">{u.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{u.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-28">
        <div className="container-vb grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Our Philosophy</span>
            <h2 className="display-2 mt-3 rule-gold">
              Ayurveda is not only medicine — it is a way of living
            </h2>
            <p className="mt-6 text-muted-foreground">
              At Vaidh Bharti we believe wellness begins with understanding the
              individual. Every consultation starts with listening: to your
              pulse, your routine, your digestion, your sleep and your season of
              life.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our formulations follow classical methods described in the Charaka
              Samhita and Sushruta Samhita, using herbs from trusted growers —
              no shortcuts, no artificial additives.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              Read our story <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="grid grid-cols-2 gap-4">
            {CATEGORIES.slice(0, 4).map((c) => (
              <img
                key={c.id}
                src={c.image}
                alt={c.name}
                width={940}
                height={650}
                loading="lazy"
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-vb">
          <SectionHeading
            eyebrow="Shop by Need"
            title="Ayurvedic Categories"
            subtitle="Traditional formulations grouped by the way you'll use them."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <Link
                  to="/products"
                  search={{ category: c.id }}
                  className="group block overflow-hidden rounded-lg bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="aspect-16/10 overflow-hidden">
                    <img
                      src={c.image}
                      alt={`${c.name} — ${c.desc}`}
                      width={940}
                      height={650}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl">{c.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 md:py-28">
        <div className="container-vb">
          <SectionHeading
            eyebrow="Bestsellers"
            title="Explore Our Ayurvedic Collection"
            subtitle="Traditional Ayurvedic formulations crafted with authentic ingredients for everyday wellness."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 60} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/products" className={cx(btn.base, btn.outline)}>
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-primary-deep py-20 text-primary-foreground md:py-28">
        <div className="container-vb grid items-center gap-14 lg:grid-cols-[0.85fr_1fr]">
          <Reveal>
            <img
              src={founder.url}
              alt={`${BRAND.founder}, founder of ${BRAND.center}`}
              width={768}
              height={1024}
              loading="lazy"
              className="w-full rounded-lg object-cover shadow-card"
            />
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow">The Founder</span>
            <h2 className="display-2 mt-3 text-primary-foreground">
              Meet Vaidh Bharti
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-primary-foreground/60">
              Founder of {BRAND.center}
            </p>
            <p className="mt-6 text-primary-foreground/80">
              Trained in classical Ayurveda, Nadi Pariksha and Panchakarma
              therapy, {BRAND.founder} has spent decades guiding families toward
              balanced living. What began as a small practice in Hansi, Haryana
              grew into {BRAND.center} — a place where traditional diagnosis,
              herbal preparation and personal attention meet.
            </p>
            <blockquote className="mt-8 border-l-2 border-gold pl-6 font-display text-2xl italic leading-snug text-primary-foreground">
              “Ayurveda is not merely a system of medicine, but a way of life.”
            </blockquote>
            <p className="mt-8 text-primary-foreground/80">
              His mission remains service: to keep authentic Ayurveda accessible,
              honest and rooted in care for the person in front of him.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/about" className={cx(btn.base, btn.gold)}>
                Read the full story
              </Link>
              <Link to="/consultation" className={cx(btn.base, btn.ghostLight)}>
                Book a Consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Panchsheel */}
      <section className="py-20 md:py-28">
        <div className="container-vb grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <span className="eyebrow">Our Wellness Centre</span>
            <h2 className="display-2 mt-3 rule-gold">{BRAND.center}</h2>
            <p className="mt-6 text-muted-foreground">
              A sanctuary of authentic Ayurvedic care on Barwala Road, near Shree
              Ram ITI in Hansi. The centre offers consultation, Nadi Pariksha,
              Panchakarma, diet counselling and lifestyle guidance in a calm,
              restorative setting — supported by an in-house herbal pharmacy.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Panchakarma therapy rooms",
                "Traditional Nadi Pariksha",
                "In-house herbal pharmacy",
                "Multi-day wellness programmes",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Leaf className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/panchsheel-aarogya-dhaam"
              className={cx(btn.base, btn.primary, "mt-9")}
            >
              Explore {BRAND.center}
            </Link>
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <img
              src="https://images.pexels.com/photos/38494113/pexels-photo-38494113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt={`Therapy space at ${BRAND.center}, Hansi`}
              width={940}
              height={650}
              loading="lazy"
              className="w-full rounded-lg object-cover shadow-card"
            />
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-vb">
          <SectionHeading
            eyebrow="Wellness Services"
            title="Traditional Care, Personalised for You"
            subtitle="Wellness-oriented Ayurvedic services delivered by experienced practitioners."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal
                key={s.name}
                delay={i * 60}
                className="rounded-lg border border-border bg-card p-7 transition-shadow duration-300 hover:shadow-card"
              >
                <s.icon className="size-6 text-gold" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/wellness" className={cx(btn.base, btn.outline)}>
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container-vb">
          <SectionHeading
            eyebrow="Stories of Wellness"
            title="What Our Patients Say"
          />
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <Reveal
                as="li"
                key={t.name}
                delay={i * 70}
                className="rounded-lg border border-border bg-card p-7"
              >
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }).map((_, n) => (
                    <Star key={n} className="size-4 fill-gold text-gold" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-foreground/85">
                  “{t.text}”
                </p>
                <p className="mt-6 text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Journal */}
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-vb">
          <SectionHeading
            eyebrow="Ayurvedic Journal"
            title="Wisdom from Our Vaidyas"
            subtitle="Practical Ayurvedic guidance on food, routine, herbs and seasonal living."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <article className="group h-full overflow-hidden rounded-lg bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <Link to="/journal/$slug" params={{ slug: postSlug(p) }}>
                    <div className="aspect-16/10 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        width={940}
                        height={650}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                      {p.category} · {p.readTime}
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-tight">
                      <Link
                        to="/journal/$slug"
                        params={{ slug: postSlug(p) }}
                        className="transition-colors hover:text-primary"
                      >
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {p.excerpt}
                    </p>
                    <p className="mt-5 text-xs text-muted-foreground">
                      {new Date(p.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="container-vb">
          <Reveal className="rounded-lg bg-primary px-6 py-16 text-center text-primary-foreground md:px-16">
            <span className="eyebrow justify-center">Begin Your Journey</span>
            <h2 className="display-2 mx-auto mt-4 max-w-2xl text-primary-foreground">
              Speak with an Ayurvedic Vaidya
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-primary-foreground/80">
              Online, by phone, or in person at {BRAND.center} in Hansi.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/consultation" className={cx(btn.base, btn.gold)}>
                Book a Consultation
              </Link>
              <Link to="/products" className={cx(btn.base, btn.ghostLight)}>
                Explore Ayurvedic Products
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
