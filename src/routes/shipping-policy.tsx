import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy | Vaidh Bharti — Panchsheel Aarogya Dhaam" },
      { name: "description", content: "How Ayurvedic product orders from Panchsheel Aarogya Dhaam are packed and dispatched." },
      { property: "og:title", content: "Shipping Policy | Vaidh Bharti" },
      { property: "og:description", content: "How product orders are packed and dispatched." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/shipping-policy" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/shipping-policy" }],
  }),
  component: () => (
    <LegalPage
      title="Shipping Policy"
      intro="How product orders from Panchsheel Aarogya Dhaam are confirmed and dispatched."
      sections={[
        {
          heading: "Order Confirmation",
          body: [
            "Orders placed through this website are order requests. We contact you by phone or WhatsApp to confirm the items, delivery address, charges and payment before dispatch.",
          ],
        },
        {
          heading: "Dispatch and Delivery",
          body: [
            "Orders are packed and dispatched from Hansi, Haryana. The exact dispatch time and expected delivery date are confirmed with you at the time of order confirmation.",
            "Delivery charges depend on the destination and order weight and are shared with you before you pay.",
          ],
        },
        {
          heading: "Tracking and Delays",
          body: [
            "Where a tracking reference is available from the courier, we share it with you.",
            "Deliveries may be delayed by courier or weather conditions outside our control. Please contact us if your order has not arrived within the expected window.",
          ],
        },
      ]}
    />
  ),
});
