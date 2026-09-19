import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Vaidh Bharti — Panchsheel Aarogya Dhaam" },
      {
        name: "description",
        content: "How Panchsheel Aarogya Dhaam collects, uses and protects the information you share with us.",
      },
      { property: "og:title", content: "Privacy Policy | Vaidh Bharti" },
      { property: "og:description", content: "How we handle the information you share with us." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy-policy" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      intro="How we handle the information you share with Panchsheel Aarogya Dhaam."
      sections={[
        {
          heading: "Information We Collect",
          body: [
            "When you send an enquiry or place an order request, we collect the name, phone number, email address and message you provide. During a consultation we also record health information you choose to share with us.",
            "We do not collect payment card details through this website.",
          ],
        },
        {
          heading: "How We Use It",
          body: [
            "Your details are used only to respond to your enquiry, arrange appointments, confirm orders and provide continuity of care.",
            "Health information shared during consultation is treated as confidential and is used to plan and review your care.",
          ],
        },
        {
          heading: "Sharing",
          body: [
            "We do not sell your information. We share it only where necessary to fulfil an order, such as with a courier, or where required by law.",
          ],
        },
        {
          heading: "Retention and Your Choices",
          body: [
            "We keep enquiry and order records for as long as needed for care continuity and legal obligations.",
            "You may ask us to correct or delete your information by contacting us using the details below.",
          ],
        },
      ]}
    />
  ),
});
