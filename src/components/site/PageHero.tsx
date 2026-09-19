import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/site/primitives";

export type Crumb = { label: string; to?: string };

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs = [],
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="surface-sand border-b border-border/70 py-16 sm:py-20">
      <Container>
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-gold">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1">
                  <ChevronRight aria-hidden className="h-3 w-3" />
                  {c.to ? (
                    <Link to={c.to as never} className="transition-colors hover:text-gold">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-8 bg-gold/60" />
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl leading-[1.08] sm:text-5xl md:text-6xl">{title}</h1>
        {intro ? <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p> : null}
      </Container>
    </section>
  );
}
