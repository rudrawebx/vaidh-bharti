import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Ayurveda FAQ — Consultation, Nadi Pariksha & Panchakarma | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Answers to common questions about Ayurveda, Nadi Pariksha, Panchakarma, consultations and Ayurvedic products at Panchsheel Aarogya Dhaam, Hansi.",
      },
      { property: "og:title", content: "Ayurveda FAQ — Consultation, Nadi Pariksha & Panchakarma" },
      { property: "og:description", content: "Common questions about Ayurvedic care at Panchsheel Aarogya Dhaam." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <>
      <PageHero
        eyebrow="Questions"
        title="Frequently Asked Questions"
        intro="Everything you may want to know before your first visit."
        crumbs={[{ label: "FAQ" }]}
      />

      <section className="py-20 sm:py-28">
        <Container className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                <AccordionTrigger className="py-6 text-left font-display text-xl hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12">
            <Link
              to="/contact"
              className="inline-flex rounded-sm bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Still Have a Question? Contact Us
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
