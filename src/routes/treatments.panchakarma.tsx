import { createFileRoute } from "@tanstack/react-router";
import { TreatmentPage } from "@/components/site/TreatmentPage";
import panchakarmaImg from "@/assets/panchakarma.jpg";

export const Route = createFileRoute("/treatments/panchakarma")({
  head: () => ({
    meta: [
      { title: "Panchakarma in Haryana — Cleansing & Rejuvenation | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Traditional Panchakarma at Panchsheel Aarogya Dhaam, Hansi — a supervised programme of classical Ayurvedic cleansing and rejuvenation therapies planned around you.",
      },
      { property: "og:title", content: "Panchakarma in Haryana — Cleansing & Rejuvenation | Vaidh Bharti" },
      {
        property: "og:description",
        content: "A supervised programme of classical Ayurvedic cleansing and rejuvenation therapies in Hansi, Haryana.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/treatments/panchakarma" },
    ],
    links: [{ rel: "canonical", href: "/treatments/panchakarma" }],
  }),
  component: () => (
    <TreatmentPage
      slug="panchakarma"
      image={panchakarmaImg}
      imageAlt="Panchakarma therapy room with brass vessels and warm herbal oil"
    />
  ),
});
