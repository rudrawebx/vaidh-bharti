export const BRAND = {
  name: "Vaidh Bharti",
  tagline: "Ayurved Amrit Hai, Ise Apnaaye",
  founder: "Vaidya Bharti Sharma",
  center: "Panchsheel Aarogya Dhaam",
  phone: "+91 9996415501",
  phoneHref: "tel:+919996415501",
  whatsapp: "https://wa.me/919996415501",
  email: "vaidbharti80@gmail.com",
  emailHref: "mailto:vaidbharti80@gmail.com",
  addressLine1: "Barwala Road, Near Shree Ram ITI",
  addressLine2: "Hansi 125033, Haryana, India",
  hours: "Monday – Saturday · 9:00 AM – 6:00 PM",
} as const;

export const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Ayurvedic Products", to: "/products" },
  { label: "Wellness", to: "/wellness" },
  { label: "Panchsheel Aarogya Dhaam", to: "/panchsheel-aarogya-dhaam" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/contact" },
] as const;

export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-md px-6 min-h-11 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-2",
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-deep hover:shadow-soft active:scale-[0.99]",
  gold: "bg-gold text-primary-foreground hover:brightness-95 active:scale-[0.99]",
  outline:
    "border border-primary/30 text-primary hover:border-primary hover:bg-primary/5 active:scale-[0.99]",
  ghostLight:
    "border border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground/10",
};

export const cx = (...parts: (string | false | undefined | null)[]) =>
  parts.filter(Boolean).join(" ");
