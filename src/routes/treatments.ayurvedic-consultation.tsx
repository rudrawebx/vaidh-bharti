import { createFileRoute } from "@tanstack/react-router";
import { TreatmentPage } from "@/components/site/TreatmentPage";
import centreImg from "@/assets/centre.jpg";

export const Route = createFileRoute("/treatments/ayurvedic-consultation")({
  head: () => ({
    meta: [
      { title: "Ayurvedic Consultation in Hansi | Vaidh Bharti" },
      {
        name: "description",
        content:
          "An unhurried Ayurvedic consultation with Vaidh Bharti covering assessment, herbal formulations, diet counselling and daily routine at Panchsheel Aarogya Dhaam, Hansi.",
      },
      { property: "og:title", content: "Ayurvedic Consultation in Hansi | Vaidh Bharti" },
      { property: "og:description", content: "Personalized Ayurvedic consultation and lifestyle guidance in Hansi, Haryana." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/treatments/ayurvedic-consultation" },
    ],
    links: [{ rel: "canonical", href: "/treatments/ayurvedic-consultation" }],
  }),
  component: () => (
    <TreatmentPage
      slug="ayurvedic-consultation"
      image={centreImg}
      imageAlt="The calm courtyard of Panchsheel Aarogya Dhaam"
    />
  ),
});
