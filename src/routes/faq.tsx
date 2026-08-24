import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { FAQS } from "@/data/catalog";
import { BRAND, btn, cx } from "@/lib/brand";

export const Route = createFileRoute("/faq")({
  component: Faq,
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | Vaidh Bharti Ayurveda" },
      {
        name: "description",
        content:
          "Answers on Ayurvedic consultations, product safety, storage, shipping, returns and Panchakarma therapy at Vaidh Bharti.",
      },
      { property: "og:title", content: "Frequently Asked Questions | Vaidh Bharti" },
      {
        property: "og:description",
        content: "Consultation, products, shipping and therapy questions answered.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

function Faq() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        crumb="FAQ"
        title="Frequently Asked Questions"
        subtitle="Consultations, products, shipping and therapy — answered."
      />

      <section className="py-16 md:py-24">
        <div className="container-vb max-w-3xl">
          <ul className="divide-y divide-border border-y border-border">
            {FAQS.map((f) => (
              <li key={f.q}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-gold transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-lg bg-cream p-8 text-center">
            <h2 className="font-display text-3xl">Still have a question?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Call {BRAND.phone} or write to {BRAND.email}.
            </p>
            <Link to="/contact" className={cx(btn.base, btn.primary, "mt-6")}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
