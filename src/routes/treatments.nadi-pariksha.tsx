import { createFileRoute } from "@tanstack/react-router";
import { TreatmentPage } from "@/components/site/TreatmentPage";
import nadiImg from "@/assets/nadi.jpg";

export const Route = createFileRoute("/treatments/nadi-pariksha")({
  head: () => ({
    meta: [
      { title: "Nadi Pariksha — Ayurvedic Pulse Assessment | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Nadi Pariksha at Panchsheel Aarogya Dhaam, Hansi — traditional Ayurvedic pulse assessment used to understand your constitution and current imbalances.",
      },
      { property: "og:title", content: "Nadi Pariksha — Ayurvedic Pulse Assessment | Vaidh Bharti" },
      { property: "og:description", content: "Traditional Ayurvedic pulse assessment with Vaidh Jitender Bharti in Hansi, Haryana." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/treatments/nadi-pariksha" },
    ],
    links: [{ rel: "canonical", href: "/treatments/nadi-pariksha" }],
  }),
  component: () => (
    <TreatmentPage slug="nadi-pariksha" image={nadiImg} imageAlt="Ayurvedic pulse assessment at the wrist" />
  ),
});
