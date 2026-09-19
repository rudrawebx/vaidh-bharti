import { Container, Reveal } from "@/components/site/primitives";

export function Shlok() {
  return (
    <section className="border-y border-border bg-forest-deep py-16 text-background sm:py-20">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center text-gold">From the Sushruta Samhita</p>
          <blockquote className="mt-6">
            <p lang="sa" className="font-display text-2xl leading-relaxed text-background sm:text-3xl">
              समदोषः समाग्निश्च समधातुमलक्रियः।
              <br />
              प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते॥
            </p>
            <p className="mt-6 text-sm italic leading-relaxed text-background/75">
              “One whose doshas are in balance, whose digestive fire is steady, whose tissues and eliminations function
              well, and whose self, senses and mind are at peace — that person is called healthy.”
            </p>
            <footer className="mt-5 text-[11px] uppercase tracking-[0.18em] text-gold-soft">
              Sushruta Samhita, Sutrasthana 15.48
            </footer>
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}
