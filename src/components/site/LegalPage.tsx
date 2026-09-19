import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { site } from "@/lib/site";

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero eyebrow="Policies" title={title} intro={intro} crumbs={[{ label: title }]} />
      <section className="py-20 sm:py-28">
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-2xl">{s.heading}</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  {s.body.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h2 className="text-2xl">Questions About This Policy</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Write to{" "}
                <a href={`mailto:${site.email}`} className="text-primary underline">
                  {site.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${site.phone}`} className="text-primary underline">
                  {site.phoneDisplay}
                </a>
                , Monday to Saturday, 9:00 AM – 6:00 PM.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
