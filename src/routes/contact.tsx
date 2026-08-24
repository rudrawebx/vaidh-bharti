import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BRAND, btn, cx } from "@/lib/brand";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Vaidh Bharti — Ayurvedic Centre in Hansi, Haryana" },
      {
        name: "description",
        content:
          "Call, WhatsApp or email Vaidh Bharti, or visit Panchsheel Aarogya Dhaam on Barwala Road, Hansi 125033, Haryana.",
      },
      { property: "og:title", content: "Contact Vaidh Bharti" },
      {
        property: "og:description",
        content: "Reach our Ayurvedic team in Hansi, Haryana by phone, WhatsApp or email.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const field =
  "mt-2 w-full rounded-md border border-border bg-card px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-primary";

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        crumb="Contact"
        title="We're Here to Help"
        subtitle="Questions about products, consultations or therapy programmes — reach us any way you prefer."
      />

      <section className="py-16 md:py-24">
        <div className="container-vb grid gap-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="display-2 rule-gold">Send us a message</h2>
            {sent ? (
              <div
                role="status"
                className="mt-8 flex items-start gap-3 rounded-lg border border-primary/25 bg-cream p-6"
              >
                <Check className="mt-0.5 size-5 text-primary" aria-hidden="true" />
                <p className="text-sm">
                  Thank you — your message has been noted. Our team will respond
                  within one working day. For urgent queries please call{" "}
                  {BRAND.phone}.
                </p>
              </div>
            ) : (
              <form
                className="mt-8 grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </label>
                  <input id="name" name="name" required className={field} />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className={field}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={field}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <input id="subject" name="subject" className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className={field}
                  />
                </div>
                <button type="submit" className={cx(btn.base, btn.primary)}>
                  Send Message
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            {[
              {
                icon: MapPin,
                title: "Visit the centre",
                body: `${BRAND.center}, ${BRAND.addressLine1}, ${BRAND.addressLine2}`,
              },
              { icon: Phone, title: "Call us", body: BRAND.phone, href: BRAND.phoneHref },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                body: "Chat with our team",
                href: BRAND.whatsapp,
              },
              { icon: Mail, title: "Email", body: BRAND.email, href: BRAND.emailHref },
              { icon: Clock, title: "Opening hours", body: BRAND.hours },
            ].map((c) => (
              <div key={c.title} className="rounded-lg border border-border p-6">
                <c.icon className="size-5 text-gold" aria-hidden="true" />
                <h3 className="mt-3 font-medium">{c.title}</h3>
                {c.href ? (
                  <a
                    href={c.href}
                    className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                  >
                    {c.body}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                )}
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-vb overflow-hidden rounded-lg border border-border">
          <iframe
            title={`Map showing ${BRAND.center} in Hansi, Haryana`}
            src="https://www.google.com/maps?q=Barwala%20Road%20Hansi%20Haryana%20125033&output=embed"
            loading="lazy"
            className="h-96 w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
