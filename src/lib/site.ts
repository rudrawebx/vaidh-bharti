import portrait from "@/assets/portrait.jpg";
import oilsImg from "@/assets/prod-oils.png";
import powderImg from "@/assets/prod-powder.png";
import shilajitImg from "@/assets/prod-shilajit.png";
import capsulesImg from "@/assets/prod-capsules.png";
import skinImg from "@/assets/prod-skin.png";

export const site = {
  name: "Vaidh Bharti",
  centre: "Panchsheel Aarogya Dhaam",
  tagline: "Ayurved Amrit Hai, Ise Apnaao",
  phone: "+919996415501",
  phoneDisplay: "+91 99964 15501",
  email: "vaidbharti80@gmail.com",
  address: {
    line1: "Panchsheel Aarogya Dhaam",
    line2: "Barwala Road, Near Shree Ram ITI",
    line3: "Hansi, Haryana 125033",
  },
  hours: "Monday – Saturday, 9:00 AM – 6:00 PM",
  mapQuery: "Panchsheel+Aarogya+Dhaam,+Barwala+Road,+Near+Shree+Ram+ITI,+Hansi,+Haryana+125033",
  whatsappMessage:
    "Hello, I would like to know more about Ayurvedic consultation and treatments at Panchsheel Aarogya Dhaam.",
  googleReviews:
    "https://www.google.com/search?q=vaidh+bharti+panchsheel+aarogya+dhaam+hansi",
};

export const whatsappHref = `https://wa.me/${site.phone.replace("+", "")}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`;
export const telHref = `tel:${site.phone}`;
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${site.mapQuery}`;
export const mapEmbed = `https://www.google.com/maps?q=${site.mapQuery}&output=embed`;

export const portraitUrl = portrait;

export const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Ayurveda", to: "/ayurveda" },
  { label: "Treatments", to: "/treatments" },
  { label: "Panchakarma", to: "/treatments/panchakarma" },
  { label: "Our Story", to: "/our-story" },
  { label: "Shop", to: "/products" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Contact", to: "/contact" },
] as const;

export const panchsheel = [
  {
    n: "01",
    title: "Natural Healing",
    body: "Embracing the body's innate ability to heal, supported by classical Ayurvedic wisdom.",
  },
  {
    n: "02",
    title: "Mind–Body–Spirit Balance",
    body: "Holistic harmony is the foundation of lasting wellbeing, not a single symptom.",
  },
  {
    n: "03",
    title: "Personalized Care",
    body: "Every individual is unique, and so is the approach we design for them.",
  },
  {
    n: "04",
    title: "Preventive Lifestyle",
    body: "Daily routines, diet and rhythm that keep imbalance from taking root.",
  },
  {
    n: "05",
    title: "Sustainable Wellbeing",
    body: "Health that lasts, rooted in nature, discipline and mindfulness.",
  },
];

export type Treatment = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  detail: string[];
  href?: string;
};

export const treatments: Treatment[] = [
  {
    slug: "nadi-pariksha",
    title: "Nadi Pariksha",
    short: "Pulse-based Ayurvedic assessment.",
    intro:
      "Traditional pulse reading used in Ayurveda to understand the constitution (Prakriti) and current imbalances of an individual.",
    detail: [
      "Nadi Pariksha is a classical Ayurvedic method of assessment in which the practitioner reads the pulse at the wrist to understand the qualities of Vata, Pitta and Kapha in the body at that moment.",
      "At Panchsheel Aarogya Dhaam, Nadi Pariksha is the starting point of most consultations. It is combined with a detailed conversation about your history, digestion, sleep, routine and mental state.",
      "The assessment is used to build a personalized plan. It is a traditional Ayurvedic practice and is not a replacement for diagnostic tests advised by your treating physician.",
    ],
  },
  {
    slug: "panchakarma",
    title: "Panchakarma",
    short: "Traditional Ayurvedic cleansing and rejuvenation therapies.",
    intro:
      "A structured, supervised programme of classical cleansing and rejuvenation therapies, planned around your constitution and capacity.",
    detail: [
      "Panchakarma is the classical Ayurvedic approach to deep cleansing and rejuvenation. Rather than a single treatment, it is a sequence: preparation, the main therapies, and a carefully guided recovery phase.",
      "Every programme begins with an assessment. Therapies, duration and diet are then planned around your constitution, strength and daily commitments.",
      "Throughout the programme you receive diet and lifestyle guidance, and a follow-up plan so that the benefits are carried into everyday life.",
    ],
  },
  {
    slug: "ayurvedic-consultation",
    title: "Ayurvedic Consultation",
    short: "Personalized guidance around diet, routine and lifestyle.",
    intro:
      "An unhurried consultation with Vaidh Bharti covering your history, constitution, daily routine, diet and mental wellbeing.",
    detail: [
      "A consultation at Panchsheel Aarogya Dhaam is a conversation, not a queue. Vaidh Bharti listens to your history in full before suggesting anything.",
      "The consultation covers assessment, herbal formulations where appropriate, diet counselling, daily routine (Dinacharya) and guidance for mental calm.",
      "You leave with a written, personalized plan and a clear idea of the follow-up schedule.",
    ],
  },
];

export const treatmentCards = [
  {
    title: "Nadi Pariksha",
    body: "Pulse-based Ayurvedic assessment to understand your constitution and current imbalances.",
    to: "/treatments/nadi-pariksha" as const,
  },
  {
    title: "Personalized Ayurvedic Treatment",
    body: "Individualized treatment plans built on classical Ayurvedic principles.",
    to: "/treatments/ayurvedic-consultation" as const,
  },
  {
    title: "Panchakarma",
    body: "Traditional Ayurvedic cleansing and rejuvenation therapies, carefully supervised.",
    to: "/treatments/panchakarma" as const,
  },
  {
    title: "Ayurvedic Lifestyle Consultation",
    body: "Guidance around diet, daily routine and mental wellbeing based on your Prakriti.",
    to: "/treatments/ayurvedic-consultation" as const,
  },
  {
    title: "Herbal Formulations",
    body: "Traditional herbal preparations made using classical Ayurvedic formulas.",
    to: "/products" as const,
  },
];

export const wellnessAreas = [
  "Digestive Wellness",
  "Joint & Mobility Wellness",
  "Skin & Hair Wellness",
  "Lifestyle Disorders",
  "Stress & Sleep Wellness",
  "General Wellness",
  "Detox & Rejuvenation",
];

export const journey = [
  { n: "01", title: "Book a Consultation", body: "Call, message on WhatsApp or send an enquiry to reserve a time." },
  { n: "02", title: "Understand Your Needs", body: "An unhurried assessment including Nadi Pariksha and your history." },
  { n: "03", title: "Receive a Personalized Plan", body: "Therapies, formulations, diet and routine, written for you." },
  { n: "04", title: "Begin Your Wellness Journey", body: "Ongoing follow-up so the plan adapts as you progress." },
];

export type Product = {
  slug: string;
  name: string;
  category: "Oils" | "Powders" | "Shilajit" | "Capsules" | "Skin Care";
  price?: number | undefined;
  short: string;
  description: string;
  benefits: string[];
  ingredients: string;
  usage: string;
  image: string;
};

export const productCategories = ["All", "Oils", "Powders", "Shilajit", "Capsules", "Skin Care"] as const;

export const products: Product[] = [
  {
    slug: "red-onion-hair-oil",
    name: "Red Onion Hair Oil",
    category: "Oils",
    short: "Non-sticky, non-greasy hair oil for glossy and strong hair.",
    description:
      "Vaidh Bharti Red Onion Hair Oil is an Ayurvedic proprietary preparation for external use on the hair and scalp, made in a non-sticky, non-greasy base.",
    benefits: [
      "Intended for regular external hair and scalp care",
      "Non-sticky, non-greasy base",
      "Ayurvedic proprietary medicine, for external use only",
    ],
    ingredients: "Herbal hair oil with red onion. The full ingredient list is printed on the product label.",
    usage: "Apply to the scalp and hair, massage gently and leave for the time advised on the label. External use only.",
    image: oilsImg,
  },
  {
    slug: "uder-shaant-powder",
    name: "Uder Shaant Powder",
    category: "Powders",
    short: "Traditional Ayurvedic churna intended to support digestive comfort.",
    description:
      "Uder Shaant Powder is a traditional Ayurvedic churna prepared from classically processed herbs, intended to be taken as part of a personalized plan.",
    benefits: [
      "Traditional churna preparation",
      "Simple to include in a daily routine",
      "Best used under practitioner guidance",
    ],
    ingredients: "Classically processed Ayurvedic herbs. The full ingredient list is printed on the product label.",
    usage: "Take as advised by your Ayurvedic practitioner, usually with warm water.",
    image: powderImg,
  },
  {
    slug: "himalayan-suryatapi-pure-shilajit",
    name: "Himalayan Suryatapi Pure Shilajit",
    category: "Shilajit",
    short: "Purified Shilajit resin sourced from Himalayan rocks.",
    description:
      "Himalayan Suryatapi Pure Shilajit is a purified and filtered Shilajit resin, a substance long used in Ayurveda as a Rasayana, supplied for traditional use in small quantities.",
    benefits: [
      "Purified and filtered resin",
      "Classical Rasayana substance in Ayurveda",
      "A small quantity is used at a time, as directed",
    ],
    ingredients: "Purified Shilajit resin. Full details are printed on the product label.",
    usage: "Dissolve a small quantity (as advised) in warm water or milk. Use only as directed.",
    image: shilajitImg,
  },
  {
    slug: "shakti-panch-gold-extra",
    name: "Shakti Panch Gold Extra",
    category: "Capsules",
    short: "Ayurvedic medicine in convenient capsule form.",
    description:
      "Shakti Panch Gold Extra is an Ayurvedic preparation presented in capsule form, intended to be used as part of a personalized Ayurvedic plan.",
    benefits: [
      "Convenient capsule format",
      "Measured, consistent quantity",
      "Best used under practitioner guidance",
    ],
    ingredients: "Ayurvedic herbal ingredients. The full ingredient list is printed on the product label.",
    usage: "Take as advised by your Ayurvedic practitioner.",
    image: capsulesImg,
  },
  {
    slug: "saffron-herbal-cream",
    name: "Saffron Herbal Cream",
    category: "Skin Care",
    short: "Herbal cream with saffron for daily external skin care.",
    description:
      "Vaidh Bharti Saffron Herbal Cream is a herbal skin care preparation enriched with saffron and herbal ingredients, intended for gentle external use as part of a daily routine.",
    benefits: [
      "Gentle herbal preparation with saffron",
      "For external daily skin care",
      "Made in the Ayurvedic tradition",
    ],
    ingredients:
      "Saffron with a herbal skin-care base including coconut, almond, jojoba and lotus derived ingredients. The full ingredient list is printed on the product label.",
    usage: "Apply a small amount to clean skin and massage gently. Discontinue if irritation occurs.",
    image: skinImg,
  },
];


export const testimonials = [
  {
    quote:
      "I was suffering from chronic acidity for years. Vaidh Bharti's treatment gave me relief within weeks. It felt like magic, but it's just pure Ayurveda!",
    name: "Ramesh S.",
    location: "Delhi",
  },
  {
    quote:
      "Panchakarma at Panchsheel Aarogya Dhaam changed my life. I feel lighter, calmer, and more energetic.",
    name: "Neha B.",
    location: "Jaipur",
  },
  {
    quote: "Unlike hospitals, here I felt heard and healed. Thank you, Vaidh Bharti!",
    name: "Ankita M.",
    location: "Mumbai",
  },
];

export const whyUs = [
  "Authentic Ayurvedic Approach",
  "Personalized Attention",
  "Traditional Therapies",
  "Holistic Lifestyle Guidance",
  "Peaceful Healing Environment",
  "Experienced Ayurvedic Expertise",
];

export const faqs = [
  {
    q: "What is Ayurveda?",
    a: "Ayurveda is a traditional Indian system of health that looks at the whole person — constitution, digestion, routine, sleep and state of mind — rather than a single symptom. Its aim is to restore balance and support wellbeing over the long term.",
  },
  {
    q: "What is Nadi Pariksha?",
    a: "Nadi Pariksha is a classical Ayurvedic pulse assessment. The practitioner reads the pulse at the wrist to understand your constitution and current imbalances. It is used alongside a detailed conversation about your health and routine.",
  },
  {
    q: "What is Panchakarma?",
    a: "Panchakarma is a structured programme of traditional Ayurvedic cleansing and rejuvenation therapies. It includes a preparation phase, the main therapies and a guided recovery phase with diet and lifestyle support.",
  },
  {
    q: "How does an Ayurvedic consultation work?",
    a: "The consultation begins with an unhurried conversation about your history, followed by assessment including Nadi Pariksha. You then receive a personalized plan covering therapies, herbal formulations where appropriate, diet and daily routine.",
  },
  {
    q: "How should I prepare for my consultation?",
    a: "Bring any recent medical reports and a list of medicines you are currently taking. It helps to note down your typical daily routine, diet, sleep and digestion before you arrive.",
  },
  {
    q: "Can I purchase Ayurvedic products online?",
    a: "Yes. Our Ayurvedic oils, powders, Shilajit, capsules and skin care preparations can be browsed and ordered from the Products section of this website. For guidance on what suits you, please speak with us first.",
  },
  {
    q: "Do I need an appointment?",
    a: "An appointment is recommended so that you receive an unhurried consultation. You can book by phone or WhatsApp, or send an enquiry through the contact form.",
  },
  {
    q: "Is online consultation available?",
    a: "Please contact us on WhatsApp or by phone to confirm current availability for remote consultation before travelling.",
  },
  {
    q: "How can I contact Panchsheel Aarogya Dhaam?",
    a: `You can call ${site.phoneDisplay}, message us on WhatsApp, email ${site.email}, or visit us at Barwala Road, Near Shree Ram ITI, Hansi, Haryana 125033, Monday to Saturday between 9:00 AM and 6:00 PM.`,
  },
];

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const priceLabel = (n?: number | null) => (typeof n === "number" ? inr(n) : "Price on request");
