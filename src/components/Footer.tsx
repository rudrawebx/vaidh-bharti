import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logo from "@/assets/logo.png";
import { BRAND, btn, cx } from "@/lib/brand";

const nav = [
  { label: "Home", to: "/" as const },
  { label: "About", to: "/about" as const },
  { label: "Products", to: "/products" as const },
  { label: "Wellness", to: "/wellness" as const },
  { label: "Panchsheel Aarogya Dhaam", to: "/panchsheel-aarogya-dhaam" as const },
  { label: "Journal", to: "/journal" as const },
  { label: "Contact", to: "/contact" as const },
];

const customer = [
  { label: "FAQs", to: "/faq" as const },
  { label: "Book a Consultation", to: "/consultation" as const },
  { label: "Cart", to: "/cart" as const },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ivory">
      <div className="container-vb grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src={logo}
            alt={`${BRAND.name} logo`}
            width={210}
            height={140}
            loading="lazy"
            className="h-16 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Authentic Ayurvedic formulations, personalised consultation and
            traditional Panchakarma care — rooted in classical wisdom, prepared
            for modern life.
          </p>
          <p className="mt-4 font-display text-lg italic text-primary">
            {BRAND.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((i) => (
              <li key={i.to}>
                <Link
                  to={i.to}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Customer
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {customer.map((i) => (
              <li key={i.to}>
                <Link
                  to={i.to}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Visit &amp; Contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>
                {BRAND.center}
                <br />
                {BRAND.addressLine1}
                <br />
                {BRAND.addressLine2}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <a href={BRAND.phoneHref} className="hover:text-primary">
                {BRAND.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <a href={BRAND.emailHref} className="break-all hover:text-primary">
                {BRAND.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>{BRAND.hours}</span>
            </li>
          </ul>
          <Link to="/consultation" className={cx(btn.base, btn.primary, "mt-6 w-full sm:w-auto")}>
            Book a Consultation
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-vb flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Ayurvedic wellness support · Not a substitute for medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
