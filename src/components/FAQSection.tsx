import { Link } from "@tanstack/react-router";
import { FAQS } from "@/data/catalog";
import { btn, cx } from "@/lib/brand";

export function FAQSection({
  items = FAQS.slice(0, 6),
  title = "Frequently Asked Questions",
  eyebrow = "Good to know",
  className,
}: {
  items?: { q: string; a: string }[];
  title?: string;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <section className={cx("py-16 md:py-24", className)}>
      <div className="container-vb max-w-3xl">
        <p className="text-center text-[11px] uppercase tracking-[0.16em] text-gold">
          {eyebrow}
        </p>
        <h2 className="display-2 rule-gold-center mt-3 text-center">{title}</h2>

        <ul className="mt-10 divide-y divide-border border-y border-border">
          {items.map((f) => (
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

        <div className="mt-10 text-center">
          <Link to="/faq" className={cx(btn.base, btn.outline)}>
            View all FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}
