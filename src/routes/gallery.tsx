import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { portraitUrl } from "@/lib/site";
import herbs from "@/assets/herbs.jpg";
import panchakarmaImg from "@/assets/panchakarma.jpg";
import centreImg from "@/assets/centre.jpg";
import nadiImg from "@/assets/nadi.jpg";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "The Centre",
  "Ayurvedic Therapies",
  "Panchakarma",
  "Herbs & Formulations",
  "Vaidh Bharti",
] as const;

const shots = [
  { src: centreImg, alt: "Courtyard of the wellness centre with medicinal plants", cat: "The Centre", tall: true },
  { src: panchakarmaImg, alt: "Panchakarma therapy room with brass vessels", cat: "Panchakarma", tall: false },
  { src: nadiImg, alt: "Nadi Pariksha pulse assessment", cat: "Ayurvedic Therapies", tall: false },
  { src: herbs, alt: "Ayurvedic herbs, roots and powders", cat: "Herbs & Formulations", tall: true },
  { src: portraitUrl, alt: "Vaidh Bharti at Panchsheel Aarogya Dhaam", cat: "Vaidh Bharti", tall: true },
  { src: centreImg, alt: "Quiet corner of the wellness environment", cat: "The Centre", tall: false },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Inside Panchsheel Aarogya Dhaam | Vaidh Bharti" },
      {
        name: "description",
        content:
          "A visual look inside Panchsheel Aarogya Dhaam in Hansi — the centre, Ayurvedic therapies, Panchakarma rooms, herbs and formulations.",
      },
      { property: "og:title", content: "Gallery — Inside Panchsheel Aarogya Dhaam" },
      { property: "og:description", content: "The centre, therapies, Panchakarma and herbs at Panchsheel Aarogya Dhaam." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const [cat, setCat] = React.useState<string>("All");
  const [active, setActive] = React.useState<(typeof shots)[number] | null>(null);
  const visible = shots.filter((s) => cat === "All" || s.cat === cat);

  return (
    <>
      <PageHero
        eyebrow="Visual Story"
        title="Inside Panchsheel Aarogya Dhaam"
        intro="A calm, nature-led environment where consultation and therapy happen without hurry."
        crumbs={[{ label: "Gallery" }]}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                  className={cn(
                    "rounded-sm border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    cat === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-gold hover:text-gold",
                  )}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 lg:grid-cols-3">
            {visible.map((s, i) => (
              <button
                key={`${s.alt}-${i}`}
                type="button"
                onClick={() => setActive(s)}
                className={cn("group overflow-hidden rounded-sm", s.tall && "row-span-2")}
                aria-label={`Open image: ${s.alt}`}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </Container>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{active?.alt ?? "Image"}</DialogTitle>
          {active ? <img src={active.src} alt={active.alt} className="w-full rounded-sm object-contain" /> : null}
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close image"
            className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-background text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
