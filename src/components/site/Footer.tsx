import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/site/primitives";
import logo from "@/assets/logo.png";
import { mapsHref, site, telHref, whatsappHref } from "@/lib/site";

type FooterSection = {
  title: string;
  links: { title: string; href: string }[];
};

const footerSections: FooterSection[] = [
  {
    title: "Sitemap",
    links: [
      { title: "Home", href: "/" },
      { title: "About us", href: "/about" },
      { title: "Treatments", href: "/treatments" },
      { title: "Shop Products", href: "/products" },
      { title: "Book Consultation", href: "/book" },
      { title: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms & Conditions", href: "/terms" },
      { title: "Shipping Policy", href: "/shipping-policy" },
      { title: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

const socialLinks = [
  { label: "WhatsApp", href: whatsappHref, Icon: MessageCircle },
  { label: "Call us", href: telHref, Icon: Phone },
  { label: "Email", href: `mailto:${site.email}`, Icon: Mail },
  { label: "Directions", href: mapsHref, Icon: MapPin },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-background pb-28 pt-16 text-foreground md:pb-12">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand block */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="w-fit" aria-label="Vaidh Bharti home">
              <img
                src={logo}
                alt="Vaidh Bharti"
                className="h-16 w-auto object-contain transition-opacity hover:opacity-90"
              />
            </Link>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              Classical Ayurvedic care in Hansi, Haryana — founded and directed by Vaidh Jitender Bharti at
              Panchsheel Aarogya Dhaam. Personalized consultation, Panchakarma and traditional herbal formulations.
            </p>
            <p className="font-display text-lg italic text-primary">“{site.tagline}”</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{title}</h2>
              <ul className="flex flex-col gap-3">
                {links.map(({ title: label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm font-normal text-muted-foreground transition-colors hover:text-primary"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact details card */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-xs">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Contact Details</h2>
            <ul className="mt-6 flex flex-col gap-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {site.address.line1}, {site.address.line2}, {site.address.line3}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${site.email}`}
                  className="break-all text-muted-foreground transition-colors hover:text-primary"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={telHref} className="text-muted-foreground transition-colors hover:text-primary">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{site.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vaidh Bharti. All Rights Reserved.</p>
          <p className="text-muted-foreground/80">{site.centre} · Guided by Vaidh Jitender Bharti · {site.address.line3}</p>
        </div>
        <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-muted-foreground/70">
          The information on this website is for general education about Ayurveda and is not a substitute for
          professional medical advice, diagnosis or treatment. Please consult a qualified practitioner regarding any
          health condition.
        </p>
      </Container>
    </footer>
  );
}
