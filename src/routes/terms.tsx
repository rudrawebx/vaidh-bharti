import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Vaidh Bharti — Panchsheel Aarogya Dhaam" },
      { name: "description", content: "The terms that apply to the use of this website and to orders placed through it." },
      { property: "og:title", content: "Terms & Conditions | Vaidh Bharti" },
      { property: "og:description", content: "Terms that apply to this website and to orders placed through it." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      intro="The terms that apply to the use of this website and to orders placed through it."
      sections={[
        {
          heading: "Health Information",
          body: [
            "Content on this website is provided for general education about Ayurveda. It is not medical advice and is not a substitute for consultation with a qualified practitioner.",
            "Nothing here should be read as a promise of cure or a guaranteed outcome. Please continue any treatment advised by your physician and tell us about it during consultation.",
          ],
        },
        {
          heading: "Appointments and Enquiries",
          body: [
            "Enquiries sent through this website are requests, not confirmed appointments. An appointment is confirmed only when we respond by phone, WhatsApp or email.",
          ],
        },
        {
          heading: "Orders",
          body: [
            "Online payment is not yet connected on this website. Orders placed here are treated as order requests and are confirmed with you by phone or WhatsApp before dispatch.",
            "Prices are shown in Indian Rupees and may change without notice.",
          ],
        },
        {
          heading: "Use of the Website",
          body: [
            "Content, images and text on this website belong to Vaidh Bharti and Panchsheel Aarogya Dhaam and may not be reproduced without permission.",
          ],
        },
      ]}
    />
  ),
});
