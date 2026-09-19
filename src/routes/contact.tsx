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
  HelpCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ExternalLink,
  Sparkles,
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
    q: "How can I book an appointment with Vaidh Jitender Bharti?",
    a: `You can reserve an appointment directly through our online booking page, or simply call or WhatsApp us on ${site.phoneDisplay}. We will confirm your preferred date and time slot.`,
  },
  {
    q: "Where is Panchsheel Aarogya Dhaam located?",
    a: `${site.address.line1}, ${site.address.line2}, ${site.address.line3}. You can use the 'Get Directions' button on this page or the interactive map to navigate directly.`,
  },
  {
    q: "What are the clinic hours and consultation days?",
    a: `Our clinic is open ${site.hours}. We remain closed on Sundays. In-person consultations, pulse diagnosis, and herbal dispensations take place during these hours.`,
  },
  {
    q: "Can I consult Vaidh Ji online if I live outside Hansi or Haryana?",
    a: "Yes. For patients living in other states or abroad, we provide telephone and WhatsApp consultations. After an unhurried assessment of your history, prescribed Ayurvedic medicines are securely shipped directly to your doorstep with tracking.",
  },
  {
    q: "What should I keep in mind before coming for Nadi Pariksha (Pulse Diagnosis)?",
    a: "For the most accurate pulse reading, we advise coming in the morning on a relatively empty stomach or at least 2 to 3 hours after a light meal. Avoid tea, coffee, smoking, or heavy exercise immediately before your appointment, and bring along any previous medical records.",
  },
  {
    q: "How can I track my herbal product order?",
    a: "Open the Track Order page from our menu and enter your order number. You can also view active shipments under My Account or contact our team via WhatsApp for instant delivery status updates.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all major credit and debit cards, net banking, and cash for in-clinic visits and herbal purchases.",
  },
  {
    q: "How can I ask questions about a specific herbal formulation?",
    a: "Choose 'Product Enquiry' in our enquiry form on this page, or click the WhatsApp button to message our team with the product name. We'll guide you on proper dosage, benefits, and suitability.",
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

      <section className="border-t border-border bg-secondary/25 py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* Left Column: FAQs */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Clear Guidance & Answers
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Quick answers to common questions about consultations with Vaidh Jitender Bharti, clinic visits in Hansi, outstation guidance, and online order tracking.
              </p>

              <Accordion type="single" collapsible className="mt-8 space-y-3.5">
                {faqs.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`c-faq-${i}`}
                    className="rounded-sm border border-border bg-card px-5 transition-all hover:border-gold/60 data-[state=open]:border-gold data-[state=open]:bg-secondary/40 data-[state=open]:shadow-xs"
                  >
                    <AccordionTrigger className="text-left font-display text-base sm:text-lg hover:text-gold hover:no-underline py-4.5">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pt-1 text-sm leading-relaxed text-muted-foreground border-t border-border/50">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right Column: Dedicated Patient Support & Clinic Visit Assistance */}
            <div className="space-y-6 lg:sticky lg:top-28">
              {/* Card 1: Direct Patient Support */}
              <div className="rounded-sm border border-border bg-card p-7 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-deep">
                    <HelpCircle className="h-3.5 w-3.5 text-gold" />
                    Patient Support
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    Mon – Sat (9AM – 6PM)
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl text-foreground">
                  Still Have Questions?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Our patient care team at Panchsheel Aarogya Dhaam is available to answer any questions about treatments, pulse diagnosis, or herbal products.
                </p>

                <div className="mt-6 space-y-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-sm bg-[#1f8a4c] px-5 py-3.5 text-white shadow-xs transition-all hover:bg-[#186f3d]"
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold">
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp
                    </span>
                    <span className="text-[11px] font-medium opacity-90">Instant Reply →</span>
                  </a>

                  <a
                    href={telHref}
                    className="flex items-center justify-between rounded-sm border border-border bg-background px-5 py-3.5 text-foreground transition-all hover:border-gold hover:text-gold"
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold">
                      <Phone className="h-4 w-4 text-gold" />
                      Call {site.phoneDisplay}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">Direct Line →</span>
                  </a>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground font-medium">Clinic Address:</strong> {site.address.line1}, {site.address.line2}, Hansi (HR).
                  </p>
                </div>
              </div>

              {/* Card 2: Clinic Visit Essentials */}
              <div className="rounded-sm border border-border bg-card p-7 shadow-xs">
                <div className="flex items-center gap-2 text-gold">
                  <Calendar className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                    Visiting Guidelines
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl text-foreground">
                  Preparing for Your Visit
                </h3>

                <ul className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>
                      <strong className="text-foreground">Accurate Nadi Pariksha:</strong> Optimal reading occurs when visiting in the morning or 2–3 hours after a light meal.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>
                      <strong className="text-foreground">Medical Records:</strong> Bring along previous investigation reports or ongoing medication details.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>
                      <strong className="text-foreground">Convenient Location:</strong> Located on Barwala Road near Shree Ram ITI, Hansi, easily accessible via NH-9.
                    </span>
                  </li>
                </ul>

                <div className="mt-6 flex flex-wrap gap-2.5 border-t border-border pt-5">
                  <Link
                    to="/book"
                    className="flex-1 rounded-sm bg-primary px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-xs transition-all hover:bg-forest-deep"
                  >
                    Book Appointment
                  </Link>
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-sm border border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-gold hover:text-gold"
                  >
                    Directions
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Card 3: Quick Treatment & Service Links */}
              <div className="rounded-sm border border-border bg-card/70 p-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Explore Panchsheel Aarogya Dhaam
                </span>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Link
                    to="/treatments/nadi-pariksha"
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    Nadi Pariksha
                  </Link>
                  <Link
                    to="/treatments/panchakarma"
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    Panchakarma
                  </Link>
                  <Link
                    to="/products"
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    Ayurvedic Formulations
                  </Link>
                  <Link
                    to="/gallery"
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    Centre Gallery
                  </Link>
                </div>
              </div>
            </div>
          </div>
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
