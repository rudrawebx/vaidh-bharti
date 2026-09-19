import * as React from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As
      ref={ref as never}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </As>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      <span aria-hidden className="inline-block h-px w-8 bg-gold/60" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")}>
          <span aria-hidden className="inline-block h-px w-8 bg-gold/60" />
          {eyebrow}
          {align === "center" ? <span aria-hidden className="inline-block h-px w-8 bg-gold/60" /> : null}
        </p>
      ) : null}
      <h2 className="mt-5 text-balance text-3xl leading-[1.1] sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-5 text-base leading-relaxed text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[78rem] px-5 sm:px-8", className)}>{children}</div>;
}

export function LotusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6c3.6 4.2 5.2 8.4 5.2 12.6S23.2 27 20 31c-3.2-4-5.2-8.2-5.2-12.4S16.4 10.2 20 6Z" />
        <path d="M20 31c-4.6.4-8.4-1.4-11.2-5.4 3.2-1.6 6.2-2 9-1.2" />
        <path d="M20 31c4.6.4 8.4-1.4 11.2-5.4-3.2-1.6-6.2-2-9-1.2" />
        <path d="M20 31v3.5" />
      </g>
    </svg>
  );
}

export function Signature({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 54" className={className} aria-hidden focusable="false">
      <path
        d="M6 40c10-16 16-26 20-30s5 2 3 10-6 18-2 20 12-8 16-18 5-14 8-14 3 6 1 14-6 16-2 18 11-6 15-16 6-16 9-16 3 7 0 15c-2 6-4 10-2 12 3 3 9-2 14-9M150 30c14-2 30-6 44-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
