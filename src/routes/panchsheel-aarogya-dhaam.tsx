import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, MapPin, Clock, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { BRAND, btn, cx } from "@/lib/brand";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/panchsheel-aarogya-dhaam")({
  component: Centre,
  head: () => ({
    meta: [
      { title: "Panchsheel Aarogya Dhaam — Ayurvedic Wellness Centre, Hansi" },
      {
        name: "description",
        content:
          "Panchsheel Aarogya Dhaam in Hansi, Haryana offers Ayurvedic consultation, Nadi Pariksha, Panchakarma therapy and an in-house herbal pharmacy.",
      },
      {
        property: "og:title",
        content: "Panchsheel Aarogya Dhaam — Ayurvedic Wellness Centre",
      },
      {
        property: "og:description",
        content:
          "A sanctuary of authentic Ayurvedic care in Hansi, Haryana — consultation, Panchakarma and herbal pharmacy.",
      },
      { property: "og:url", content: "/panchsheel-aarogya-dhaam" },
    ],
    links: [{ rel: "canonical", href: "/panchsheel-aarogya-dhaam" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          name: BRAND.center,
          telephone: BRAND.phone,
          email: BRAND.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: BRAND.addressLine1,
            addressLocality: "Hansi",
            postalCode: "125033",
            addressRegion: "Haryana",
            addressCountry: "IN",
          },
          openingHours: "Mo-Sa 09:00-18:00",
        }),
      },
    ],
  }),
});

const facilities = [
  ["Consultation Rooms", "Quiet, private spaces for unhurried assessment."],
  ["Panchakarma Suite", "Dedicated therapy rooms for Abhyanga, Swedana and Basti."],
  ["Herbal Pharmacy", "In-house dispensary of classical formulations."],
  ["Diet & Kitchen Guidance", "Practical, seasonal food planning support."],
  ["Yoga & Meditation Space", "Guided practice to support therapy."],
  ["Follow-up Care", "Scheduled reviews to keep your plan on track."],
];

function Centre() {
  return (
    <>
      <PageHero
        eyebrow="Our Wellness Centre"
        crumb="Panchsheel Aarogya Dhaam"
        title={BRAND.center}
        subtitle="A sanctuary of authentic Ayurvedic care on Barwala Road, Hansi — where diagnosis, therapy and herbal preparation come together."
      >
        <Link to="/consultation" className={cx(btn.base, btn.gold, "mt-8")}>
          Book a Visit
        </Link>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="container-vb grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">The Centre</span>
            <h2 className="display-2 mt-3 rule-gold">
              Where classical Ayurveda is practised daily
            </h2>
            <p className="mt-6 text-muted-foreground">
              Founded by {BRAND.founder}, the centre was built to offer complete
              Ayurvedic care under one roof — assessment through Nadi Pariksha,
              Panchakarma therapy, diet counselling and herbal formulations
              prepared on site.
            </p>
            <p className="mt-4 text-muted-foreground">
              The space is deliberately calm: natural light, herbal aromas and
              unhurried appointments. Care here is measured in attention, not
              minutes.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <img
              src="https://images.pexels.com/photos/3865676/pexels-photo-3865676.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt={`Treatment room at ${BRAND.center}`}
              width={940}
              height={650}
              loading="lazy"
              className="w-full rounded-lg object-cover shadow-card"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="container-vb">
          <SectionHeading
            eyebrow="Facilities"
            title="What You'll Find Here"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map(([title, text], i) => (
              <Reveal
                key={title}
                delay={i * 60}
                className="rounded-lg bg-card p-7"
              >
                <Leaf className="size-5 text-gold" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-vb grid gap-6 sm:grid-cols-3">
          {[
            { icon: MapPin, title: "Address", body: `${BRAND.addressLine1}, ${BRAND.addressLine2}` },
            { icon: Clock, title: "Timings", body: BRAND.hours },
            { icon: Phone, title: "Phone", body: BRAND.phone },
          ].map((c) => (
            <div key={c.title} className="rounded-lg border border-border p-7">
              <c.icon className="size-5 text-gold" aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
        <div className="container-vb mt-12 flex flex-col gap-3 sm:flex-row">
          <Link to="/consultation" className={cx(btn.base, btn.primary)}>
            Book a Consultation
          </Link>
          <Link to="/contact" className={cx(btn.base, btn.outline)}>
            Get Directions
          </Link>
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
