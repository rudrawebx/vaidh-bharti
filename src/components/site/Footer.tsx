import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/site/primitives";
import logoAsset from "@/assets/logo.png.asset.json";
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
      { title: "Book Consultation", href: "/booking" },
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
    <footer className="mt-24 bg-forest-deep pb-28 pt-16 text-background/75 md:pb-12">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand block */}
          <div className="flex flex-col gap-6">
            <img
              src={logoAsset.url}
              alt="Vaidh Bharti"
              className="h-20 w-fit rounded-md bg-background/95 object-contain p-2"
            />
            <p className="max-w-sm text-base leading-relaxed text-background/65">
              Classical Ayurvedic care in Hansi, Haryana — personalized consultation, Panchakarma and traditional
              herbal formulations, offered with patience and care.
            </p>
            <p className="font-display text-lg italic text-gold">“{site.tagline}”</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-background/20 text-background/70 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{title}</h2>
              <ul className="flex flex-col gap-3">
                {links.map(({ title: label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm font-normal text-background/65 transition-colors hover:text-gold"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact details card */}
          <div className="rounded-2xl border border-background/15 bg-background/5 p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Contact Details</h2>
            <ul className="mt-6 flex flex-col gap-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/65 transition-colors hover:text-gold"
                >
                  {site.address.line1}, {site.address.line2}, {site.address.line3}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`mailto:${site.email}`}
                  className="break-all text-background/65 transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={telHref} className="text-background/65 transition-colors hover:text-gold">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-background/65">{site.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-background/15 pt-8 text-xs text-background/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vaidh Bharti. All Rights Reserved.</p>
          <p className="text-background/45">{site.centre} · {site.address.line3}</p>
        </div>
        <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-background/40">
          The information on this website is for general education about Ayurveda and is not a substitute for
          professional medical advice, diagnosis or treatment. Please consult a qualified practitioner regarding any
          health condition.
        </p>
      </Container>
    </footer>
  );
}
