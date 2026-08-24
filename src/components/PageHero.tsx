import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  crumb,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-deep">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/40 blur-3xl"
      />
      <div className="container-vb relative py-16 text-center md:py-24">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-xs text-primary-foreground/60"
        >
          <Link to="/" className="hover:text-primary-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary-foreground/85">{crumb}</span>
        </nav>
        <span className="eyebrow justify-center">{eyebrow}</span>
        <h1 className="display-1 mx-auto mt-4 max-w-4xl text-primary-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/75">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
