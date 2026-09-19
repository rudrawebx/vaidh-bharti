import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy | Vaidh Bharti — Panchsheel Aarogya Dhaam" },
      { name: "description", content: "Returns and refunds for Ayurvedic products ordered from Panchsheel Aarogya Dhaam." },
      { property: "og:title", content: "Refund Policy | Vaidh Bharti" },
      { property: "og:description", content: "Returns and refunds for products ordered from Panchsheel Aarogya Dhaam." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/refund-policy" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: () => (
    <LegalPage
      title="Refund Policy"
      intro="Returns and refunds for products ordered from Panchsheel Aarogya Dhaam."
      sections={[
        {
          heading: "Damaged or Incorrect Items",
          body: [
            "If a product arrives damaged, or is not what you ordered, please contact us within 48 hours of delivery with photographs of the item and packaging. We will arrange a replacement or a refund.",
          ],
        },
        {
          heading: "Opened or Used Products",
          body: [
            "For reasons of hygiene and safety, herbal preparations that have been opened or used cannot be returned unless there is a fault with the product.",
          ],
        },
        {
          heading: "How Refunds Are Made",
          body: [
            "Approved refunds are made through the same method used for payment. Once approved, refunds are usually processed within 7 working days.",
          ],
        },
        {
          heading: "Cancellations",
          body: ["An order can be cancelled at no cost any time before it has been dispatched."],
        },
      ]}
    />
  ),
});
