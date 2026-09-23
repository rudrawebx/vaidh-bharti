import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X, ZoomIn } from "lucide-react";
import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import panchakarmaImg from "@/assets/panchakarma.jpg";
import nadiImg from "@/assets/nadi.jpg";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "The Centre",
  "Ayurvedic Therapies",
  "Panchakarma",
  "Herbs & Formulations",
  "Vaidh Jitender Bharti",
] as const;

const shots = [
  { src: "/assets/real/vaidh-jitender-bharti.png", alt: "Vaidh Jitender Bharti, Founder & Owner of Panchsheel Aarogya Dhaam", cat: "Vaidh Jitender Bharti" },
  { src: "/assets/real/clinic-cottage.jpeg", alt: "Traditional bamboo cottage therapy suites at Panchsheel Aarogya Dhaam", cat: "The Centre" },
  { src: "/assets/real/clinic-lawn.jpeg", alt: "Lush botanical gardens and green healing lawns", cat: "The Centre" },
  { src: "/assets/real/vaidh-meditation.png", alt: "Vaidh Jitender Bharti in morning meditation at the ashram", cat: "Vaidh Jitender Bharti" },
  { src: "/assets/real/dispensary-patients.jpeg", alt: "Ayurvedic consultation and dispensary at Panchsheel Aarogya Dhaam", cat: "Ayurvedic Therapies" },
  { src: "/assets/real/herbal-spices.jpg", alt: "Authentic whole Ayurvedic herbs, roots and raw spices", cat: "Herbs & Formulations" },
  { src: "/assets/real/stage-assembly.jpeg", alt: "Community health assembly and Ayurvedic guidance by Vaidh Jitender Bharti", cat: "Vaidh Jitender Bharti" },
  { src: "/assets/real/cinnamon-mortar.jpg", alt: "Traditional stone pestle and mortar processing classical churnas", cat: "Herbs & Formulations" },
  { src: "/assets/real/clinic-gardener.jpeg", alt: "Nurturing medicinal plants at the herbal garden", cat: "The Centre" },
  { src: "/assets/real/herbal-tea-ceremony.jpg", alt: "Traditional preparation of restorative Ayurvedic herbal teas and kwath", cat: "Herbs & Formulations" },
  { src: "/assets/real/vaidh-portrait-ashram.jpeg", alt: "Vaidh Jitender Bharti in consultation at the ashram", cat: "Vaidh Jitender Bharti" },
  { src: "/assets/real/stage-ceremony.jpeg", alt: "Health seminar and felicitation ceremony at the centre", cat: "The Centre" },
  { src: "/assets/real/stage-gathering.jpeg", alt: "Patients and wellness seekers gathered at Panchsheel Aarogya Dhaam", cat: "The Centre" },
  { src: panchakarmaImg, alt: "Classical Panchakarma therapy setup with brass vessels", cat: "Panchakarma" },
  { src: nadiImg, alt: "Classical Nadi Pariksha pulse assessment", cat: "Ayurvedic Therapies" },
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

          {/* Uncropped Responsive Masonry Gallery */}
          <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {visible.map((s, i) => (
              <div key={`${s.alt}-${i}`} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setActive(s)}
                  className="group block w-full overflow-hidden rounded-md border border-border/80 bg-card p-2.5 text-left shadow-sm transition-all duration-300 hover:border-gold hover:shadow-md"
                  aria-label={`Open full image: ${s.alt}`}
                >
                  <div className="relative overflow-hidden rounded bg-[#FAF7F2] flex items-center justify-center">
                    <img
                      src={s.src}
                      alt={s.alt}
                      loading="lazy"
                      className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 flex items-center justify-center">
                      <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full bg-background/90 p-2.5 text-foreground shadow-lg">
                        <ZoomIn className="h-5 w-5 text-gold" />
                      </span>
                    </div>
                  </div>
                  <div className="px-2 pt-3 pb-1">
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                      {s.cat}
                    </span>
                    <p className="mt-1 text-xs font-medium leading-snug text-foreground/90">
                      {s.alt}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-5xl border-none bg-black/95 p-4 sm:p-6 shadow-2xl backdrop-blur-md rounded-lg">
          <DialogTitle className="sr-only">{active?.alt ?? "Image"}</DialogTitle>
          {active ? (
            <div className="flex flex-col items-center">
              <div className="relative flex max-h-[82vh] w-full items-center justify-center">
                <img
                  src={active.src}
                  alt={active.alt}
                  className="max-h-[82vh] max-w-full rounded object-contain shadow-2xl"
                />
              </div>
              <div className="mt-3 w-full text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                  {active.cat}
                </span>
                <p className="mt-0.5 text-sm text-white/90">{active.alt}</p>
              </div>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close image"
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
