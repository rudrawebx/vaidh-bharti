import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Leaf,
  HeartHandshake,
  ShieldCheck,
  Headphones,
  Loader2,
} from "lucide-react";
import { Container, Reveal } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mapEmbed, mapsHref, site, telHref, whatsappHref } from "@/lib/site";
import { enquirySchema, submitEnquiry } from "@/lib/enquiries.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Appointments — Ayurvedic Doctor in Hansi | Vaidh Bharti" },
      {
        name: "description",
        content:
          "Connect with Vaidh Bharti at Panchsheel Aarogya Dhaam, Barwala Road, Hansi, Haryana. Call +91 99964 15501, message on WhatsApp or send an enquiry.",
      },
      { property: "og:title", content: "Connect With Vaidh Bharti — Contact & Appointments" },
      {
        property: "og:description",
        content: "Phone, WhatsApp, email, clinic address and consultation enquiries for Panchsheel Aarogya Dhaam, Hansi.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: `${site.name} — ${site.centre}`,
          telephone: site.phone,
          email: site.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${site.address.line1}, ${site.address.line2}`,
            addressLocality: "Hansi",
            addressRegion: "Haryana",
            postalCode: "125033",
            addressCountry: "IN",
          },
          openingHours: "Mo-Sa 09:00-18:00",
        }),
      },
    ],
  }),
  component: Contact,
});

const enquiryTypes = [
  "General Enquiry",
  "Product Enquiry",
  "Treatment Enquiry",
  "Consultation Enquiry",
  "Order Support",
  "Other",
];

const faqs = [
  {
    q: "How can I book a consultation?",
    a: "You can book online from the Book a Consultation page, or simply call or WhatsApp us on " + site.phoneDisplay + " and we will reserve a time for you.",
  },
  {
    q: "Where is your centre located?",
    a: `${site.address.line1}, ${site.address.line2}, ${site.address.line3}. Use the Get Directions button on this page to open it in Google Maps.`,
  },
  { q: "What are your consultation hours?", a: `We are open ${site.hours}.` },
  {
    q: "How can I track my order?",
    a: "Open the Track Order page and enter your order number. You can also find all your orders under My Account once you are signed in.",
  },
  {
    q: "How can I ask a question about a product?",
    a: "Choose Product Enquiry in the form on this page, or message us on WhatsApp with the product name and we will guide you.",
  },
  {
    q: "How soon will I get a reply?",
    a: "Enquiries are answered during working hours, Monday to Saturday. For anything urgent, please call us directly.",
  },
];

type Errors = Partial<Record<string, string>>;

function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Connect With Vaidh Bharti"
        intro="We are here to help you take the next step toward better wellness through Ayurveda — by phone, WhatsApp, email or in person at Panchsheel Aarogya Dhaam."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="border-b border-border bg-secondary/40 py-14">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              title="Call Us"
              value={site.phoneDisplay}
              ctaLabel="Call Now"
              href={telHref}
            />
            <InfoCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="WhatsApp"
              value={site.phoneDisplay}
              ctaLabel="WhatsApp Us"
              href={whatsappHref}
              external
            />
            <InfoCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              value={site.email}
              ctaLabel="Send Email"
              href={`mailto:${site.email}`}
            />
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              title="Visit the Centre"
              value={`${site.address.line1}, ${site.address.line3}`}
              ctaLabel="Get Directions"
              href={mapsHref}
              external
            />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Send Us an Enquiry</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Share a few details and our team will get back to you during working hours. Your details are stored
                securely and used only to respond to your enquiry.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-border bg-card p-8">
                <h2 className="font-display text-2xl">Clinic Details</h2>
                <ul className="mt-6 space-y-5 text-sm">
                  <li className="flex gap-4">
                    <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <address className="not-italic leading-relaxed text-muted-foreground">
                      <span className="block text-foreground">{site.address.line1}</span>
                      {site.address.line2}
                      <br />
                      {site.address.line3}
                    </address>
                  </li>
                  <li className="flex gap-4">
                    <Phone aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <a href={telHref} className="text-foreground hover:text-gold">
                      {site.phoneDisplay}
                    </a>
                  </li>
                  <li className="flex gap-4">
                    <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <a href={`mailto:${site.email}`} className="break-all text-foreground hover:text-gold">
                      {site.email}
                    </a>
                  </li>
                  <li className="flex gap-4">
                    <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-muted-foreground">
                      <span className="block text-foreground">Business hours</span>
                      {site.hours}
                      <br />
                      Sunday — closed
                    </span>
                  </li>
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={telHref}
                    className="rounded-sm bg-primary px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                  >
                    Call Now
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm border border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-gold hover:text-gold"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm border border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-gold hover:text-gold"
                  >
                    Get Directions
                  </a>
                </div>
              </div>

              <iframe
                title="Map showing Panchsheel Aarogya Dhaam in Hansi, Haryana"
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border border-border"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-forest-deep/95 py-16 text-primary-foreground">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Need Personalised Ayurvedic Guidance?</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed opacity-90">
                Book an unhurried consultation with Vaidh Jitender Bharti at Panchsheel Aarogya Dhaam and receive a plan built
                around your constitution, routine and diet.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/book"
                className="rounded-sm bg-gold px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-forest-deep"
              >
                Book a Consultation
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-primary-foreground/40 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em]"
              >
                Chat With Us on WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="border border-border bg-card p-8">
              <h2 className="font-display text-2xl">Have a question about our products?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Browse our Ayurvedic preparations, read the common questions, or write to our support team about an
                order.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="rounded-sm bg-primary px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                >
                  Shop Products
                </Link>
                <Link
                  to="/faq"
                  className="rounded-sm border border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-gold hover:text-gold"
                >
                  View FAQs
                </Link>
                <Link
                  to="/track-order"
                  className="rounded-sm border border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-gold hover:text-gold"
                >
                  Track an Order
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: <Leaf className="h-5 w-5" />, t: "Authentic Ayurvedic Approach", b: "Classical methods, practised daily at Panchsheel Aarogya Dhaam." },
                { icon: <HeartHandshake className="h-5 w-5" />, t: "Personalised Guidance", b: "Plans written for your constitution, routine and diet." },
                { icon: <ShieldCheck className="h-5 w-5" />, t: "Quality-Assured Products", b: "Traditional preparations, clearly labelled with ingredients." },
                { icon: <Headphones className="h-5 w-5" />, t: "Real Human Support", b: "Speak with our team on call or WhatsApp during working hours." },
              ].map((x) => (
                <div key={x.t} className="border border-border bg-card p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-gold">{x.icon}</span>
                  <h3 className="mt-4 font-display text-lg">{x.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.b}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20">
        <Container>
          <h2 className="font-display text-3xl sm:text-4xl">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="mt-8 max-w-3xl">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`c-faq-${i}`}>
                <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  title,
  value,
  ctaLabel,
  href,
  external,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  ctaLabel: string;
  href: string;
  external?: boolean;
}) {
  return (
    <Reveal>
      <div className="flex h-full flex-col border border-border bg-card p-6">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-gold">{icon}</span>
        <h3 className="mt-4 font-display text-xl">{title}</h3>
        <p className="mt-2 flex-1 break-words text-sm leading-relaxed text-muted-foreground">{value}</p>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-primary hover:text-gold"
        >
          {ctaLabel} →
        </a>
      </div>
    </Reveal>
  );
}

function ContactForm() {
  const [errors, setErrors] = React.useState<Errors>({});
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [waLink, setWaLink] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = enquirySchema.safeParse(raw);

    if (!parsed.success) {
      const next: Errors = {};
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0]);
        if (!next[key]) next[key] = i.message;
      });
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setStatus("loading");
    try {
      const res = await submitEnquiry({ data: parsed.data });
      setStatus("success");
      setWaLink(`https://wa.me/${site.phone.replace("+", "")}?text=${res.whatsappText}`);
      form.reset();
      toast.success("Thank you — your enquiry has been received.");
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please call or WhatsApp us instead.");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" name="name" error={errors["name"]} required autoComplete="name" />
        <Field label="Phone Number" name="phone" type="tel" error={errors["phone"]} required autoComplete="tel" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email Address (optional)" name="email" type="email" error={errors["email"]} autoComplete="email" />
        <div>
          <Label htmlFor="enquiryType">Enquiry Type</Label>
          <select
            id="enquiryType"
            name="enquiryType"
            defaultValue={enquiryTypes[0]}
            className="h-12 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground"
          >
            {enquiryTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <Field label="Subject (optional)" name="subject" error={errors["subject"]} />
      <div>
        <Label htmlFor="message">
          Message<span className="text-gold"> *</span>
        </Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={1500}
          placeholder="Tell us briefly what you would like help with."
          aria-invalid={!!errors["message"]}
          className="w-full rounded-sm border border-input bg-background p-4 text-sm text-foreground"
        />
        {errors["message"] ? <p className="mt-2 text-xs text-destructive">{errors["message"]}</p> : null}
      </div>

      {status === "success" && (
        <div className="rounded-sm border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-900">
          <p className="font-medium text-base">Thank you! Your enquiry has been received.</p>
          <p className="mt-1 text-xs text-emerald-800">
            Our team will contact you during working hours. You can also connect immediately on WhatsApp.
          </p>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Confirm on WhatsApp
            </a>
          )}
        </div>
      )}

      {status !== "success" && (
        <>
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-forest-deep disabled:opacity-60 sm:w-auto"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {status === "loading" ? "Sending…" : "Send Enquiry"}
          </button>

          <p aria-live="polite" className={cn("text-xs", status === "error" ? "text-destructive" : "text-muted-foreground")}>
            {status === "error"
              ? "We could not send your enquiry. Please call or WhatsApp us directly."
              : "We usually respond during working hours, Monday to Saturday."}
          </p>
        </>
      )}
    </form>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
    >
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  error,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  error?: string | undefined;
  type?: string | undefined;
  required?: boolean | undefined;
  autoComplete?: string | undefined;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="h-12 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground"
      />
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
