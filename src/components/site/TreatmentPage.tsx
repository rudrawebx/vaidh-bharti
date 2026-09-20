import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, LotusMark } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { treatments } from "@/lib/site";

export function TreatmentPage({ slug, image, imageAlt }: { slug: string; image: string; imageAlt: string }) {
  const t = treatments.find((x) => x.slug === slug)!;
  const others = treatments.filter((x) => x.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow="Treatment"
        title={t.title}
        intro={t.intro}
        crumbs={[{ label: "Treatments", to: "/treatments" }, { label: t.title }]}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
              {t.detail.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p className="border-l-2 border-gold/60 pl-5 text-sm">
                Ayurvedic care is individual and supportive. We do not promise cures or guaranteed outcomes, and we ask
                that you continue any treatment advised by your physician.
              </p>
              <div className="pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-sm">
              <img src={image} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-card py-20">
        <Container>
          <h2 className="text-3xl">Other Treatments</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={o.slug === "panchakarma" ? "/treatments/panchakarma" : o.slug === "nadi-pariksha" ? "/treatments/nadi-pariksha" : "/treatments/ayurvedic-consultation"}
                className="hover-lift group flex items-start gap-4 border border-border bg-background p-7"
              >
                <LotusMark className="mt-1 h-6 w-6 shrink-0 text-gold" />
                <span>
                  <span className="block font-display text-2xl">{o.title}</span>
                  <span className="mt-2 block text-sm text-muted-foreground">{o.short}</span>
                </span>
                <ArrowRight className="ml-auto mt-2 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="max-w-3xl">
          <h2 className="text-3xl">Enquire About {t.title}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Share a few details and we will get back to you during working hours.
          </p>
          <div className="mt-8">
            <EnquiryForm />
          </div>
        </Container>
      </section>
    </>
  );
}
