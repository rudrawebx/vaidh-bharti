import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/brand";

export function Reveal({
  children,
  className,
  delay = 0,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As
      ref={ref as never}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cx("reveal", className)}
    >
      {children}
    </As>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <Reveal
      className={cx(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "",
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2
        className={cx(
          "display-2 mt-3",
          light ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cx(
            "mt-4 text-base",
            light ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
