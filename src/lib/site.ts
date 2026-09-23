import portrait from "@/assets/portrait.jpg";
import oilsImg from "@/assets/prod-oils.png";
import powderImg from "@/assets/prod-powder.png";
import shilajitImg from "@/assets/prod-shilajit.png";
import capsulesImg from "@/assets/prod-capsules.png";
import skinImg from "@/assets/prod-skin.png";

export const site = {
  name: "Vaidh Bharti",
  centre: "Panchsheel Aarogya Dhaam",
  owner: "Jitender Bharti",
  founder: "Vaidh Jitender Bharti",
  tagline: "Ayurved Amrit Hai, Ise Apnaao",
  url: "https://vaidhbharti.com",
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

export const siteUrl = site.url;

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
  category: "Oils" | "Powders" | "Shilajit" | "Capsules" | "Herbal Teas";
  price?: number | undefined;
  short: string;
  description: string;
  benefits: string[];
  ingredients: string;
  usage: string;
  image: string;
};

export const productCategories = ["All", "Oils", "Powders", "Shilajit", "Capsules", "Herbal Teas"] as const;

export const products: Product[] = [
  {
    slug: "pit-shanti-powder",
    name: "Pit Shanti Powder",
    category: "Powders",
    price: 959,
    short: "Soothes severe hyperacidity, acid reflux, peptic ulcers & internal Pitta burning.",
    description:
      "Time-tested classical Ayurvedic churna formulated under Vaidya supervision with Kamdudha, Praval Pishti, Shankh Bhasma, and Mulethi for instant and prolonged relief from acid heartburn and excess Pitta.",
    benefits: [
      "Instantly cools acid heartburn and chest discomfort",
      "Soothes stomach mucosal lining and sour belching",
      "Balances internal thermal excess (Ushna Guna)",
    ],
    ingredients: "Praval Pishti, Mukta Shukti, Shankh Bhasma, Kamdudha Ras, Yashtimadhu, Amla, Shatavari, Elaichi.",
    usage: "Take 1 teaspoon (3-5g) twice daily with cold water or fresh milk after meals.",
    image: "/assets/products/pit-shanti-powder-front.png",
  },
  {
    slug: "luko-panch-powder",
    name: "Luko Panch Powder",
    category: "Powders",
    price: 799,
    short: "Complete Shweta Pradara & hormonal vitality herbal blend for women's wellness.",
    description:
      "Rooted in ancient Stri-Roga Chikitsa, featuring Lodhra, Ashoka, Shatavari, and Pushyanug Churna herbs to maintain natural flora, reduce fatigue, and restore pelvic strength.",
    benefits: [
      "Supports pelvic tonification & feminine comfort",
      "Balances Kapha-Vata imbalance in uterine tract",
      "Combats chronic weakness and lethargy",
    ],
    ingredients: "Lodhra, Ashoka, Shatavari, Nagkesar, Mochras, Dhataki, Daruharidra, Yashtimadhu.",
    usage: "Take 1 teaspoon (3-5g) twice daily with fresh water or milk after meals, or as advised by Vaidya.",
    image: "/assets/products/luko-panch-powder-front.png",
  },
  {
    slug: "panch-liv-powder",
    name: "Panch Liv Powder",
    category: "Powders",
    price: 749,
    short: "Yakrit Rasayana for deep liver detox, sluggish digestion & bile secretion.",
    description:
      "Formulated with Bhumi Amla, Kalmegh, Kutki, and Punarnava to protect hepatocytes, enhance bile flow, and relieve symptoms of fatty liver and poor appetite.",
    benefits: [
      "Deeply cleanses sluggish liver tissue (Yakrit)",
      "Stimulates appetite and digestive bile",
      "Shields cells against oxidative stress",
    ],
    ingredients: "Bhumi Amla, Kalmegh, Kutki, Punarnava, Kasani, Bhringraj, Vidanga, Haritaki.",
    usage: "Take 1/2 to 1 teaspoon twice daily with lukewarm water 30 minutes before meals.",
    image: "/assets/products/panch-liv-powder-front.png",
  },
  {
    slug: "nabhi-oil",
    name: "Nabhi Oil",
    category: "Oils",
    price: 500,
    short: "Traditional belly button Ayurvedic taila for core digestion & cellular glow.",
    description:
      "Handcrafted herbal oil infused with Castor, Mustard, Neem, and Til Taila using classical taila paka vidhi. Nourishes the Nabhi (umbilicus) to balance bodily energies.",
    benefits: [
      "Stimulates internal digestive Agni",
      "Nourishes skin & promotes natural glow",
      "Soothes abdominal tightness & bloating",
    ],
    ingredients: "Sesame (Til) Oil, Castor (Eranda) Oil, Mustard Oil, Almond Oil, Neem, Tea tree, Camphor.",
    usage: "Put 2-3 warm drops into the navel before bedtime. Gently massage clockwise for 2 minutes.",
    image: "/assets/products/nabhi-oil-front.png",
  },
  {
    slug: "panch-vat-powder",
    name: "Panch Vat Powder",
    category: "Powders",
    price: 1124,
    short: "Potent Sandhivata churna for knee flexibility, stiffness relief & joint lubrication.",
    description:
      "Vaidya-supervised classical formulation enriched with Yograj Guggulu, Rasna, Ashwagandha, and Shallaki to pacify aggravated Vata dosha and support healthy articular cartilage.",
    benefits: [
      "Calms deep-seated Vata in bone joints",
      "Relieves morning stiffness & aches",
      "Enhances natural synovial joint mobility",
    ],
    ingredients: "Yograj Guggulu, Rasna, Ashwagandha, Shallaki, Shunthi, Eranda Mool, Devdaru, Nirgundi.",
    usage: "Take 1 teaspoon (3-5g) twice daily with warm milk or lukewarm water after meals, or as directed by Vaidya.",
    image: "/assets/products/panch-vat-powder-front.png",
  },
  {
    slug: "fat-panch-powder",
    name: "Fat Panch Powder",
    category: "Powders",
    price: 1199,
    short: "Medohar Ayurvedic formula for natural metabolism, gut cleansing & lipid balance.",
    description:
      "Classical Ayurvedic formulation combining Triphala, Medohar Guggulu, Nagarmotha, and Agnimantha to stimulate digestive fire (Deepana-Pachana) and support natural weight management.",
    benefits: [
      "Naturally stimulates metabolism & Agni",
      "Assists in clearing toxins (Ama dosha)",
      "Supports active, balanced digestion",
    ],
    ingredients: "Triphala, Medohar Guggulu, Nagarmotha, Agnimantha, Chitrak, Vidanga, Shunthi, Pippali, Maricha.",
    usage: "Take 1 teaspoon (approx 3-5g) twice daily with lukewarm water before meals, or as directed by Vaidya.",
    image: "/assets/products/fat-panch-powder-front.png",
  },
  {
    slug: "shahi-panch-powder",
    name: "Shahi Panch Powder",
    category: "Powders",
    price: 1499,
    short: "Classical Ayurvedic Rasayana churna with Kesar & Swarna Bhasma for peak vitality and vigor.",
    description:
      "Prestigious classical Ayurvedic Rasayana formulation crafted at Panchsheel Aarogya Dhaam. Infused with Swarna Bhasma, Kesar, Makardhwaj and Ashwagandha to rebuild stamina, nourish bodily tissues, and restore inner strength.",
    benefits: [
      "Fortified with Kesar (Saffron), Makardhwaj and Swarna Bhasma",
      "Deeply nourishes all 7 Dhatus to rebuild stamina and vitality",
      "Combats chronic fatigue, nervous exhaustion and physical burnout",
    ],
    ingredients: "Swarna Bhasma, Kesar, Makardhwaj, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Akarkara, Jaiphal, Javitri, Vang Bhasma, Shuddha Shilajit.",
    usage: "Take 2 to 3 gm daily with warm milk or as directed by the physician. Best taken before bedtime.",
    image: "/assets/products/shahi-panch-powder-front.png",
  },
  {
    slug: "shilajit",
    name: "Shilajit",
    category: "Shilajit",
    price: 799,
    short: "100% Sun-dried purified high-altitude Shilajit resin with 75%+ Fulvic Acid.",
    description:
      "Directly sourced from high-altitude Himalayan rock crevices and purified via authentic classical Shodhana (Surya Tapi). Delivers natural bio-available minerals and vitality.",
    benefits: [
      "75%+ natural Fulvic Acid content",
      "Enhances stamina, cellular ATP & vigor",
      "Supports muscle recovery & micro-nutrient absorption",
    ],
    ingredients: "100% Purified High Altitude Himalayan Shilajit Resin (Shuddha Shilajit).",
    usage: "Dissolve a pea-sized quantity (300-500mg) in warm water or milk once or twice daily.",
    image: "/assets/products/shilajit-front.png",
  },
  {
    slug: "red-onion-hair-oil",
    name: "Red Onion Hair Oil",
    category: "Oils",
    price: 359,
    short: "Classical herbal hair elixir with Red Onion, Bhringraj & Brahmi for hair fall control.",
    description:
      "Formulated with cold-pressed botanical oils and ancient Keshya herbs to strengthen hair roots, control dandruff, and promote lustrous density without greasy residue.",
    benefits: [
      "Strengthens follicles against hair fall",
      "Nourishes dry scalp & combats flakes",
      "Non-sticky, lightweight Ayurvedic texture",
    ],
    ingredients: "Red Onion Extract, Bhringraj, Brahmi, Amla, Sesame Oil, Coconut Oil, Almond Oil, Rosemary.",
    usage: "Gently massage into scalp and hair strands. Leave for at least 1 hour or overnight before washing.",
    image: "/assets/products/red-onion-hair-oil-front.png",
  },
  {
    slug: "panch-fresh-powder",
    name: "Panch Fresh Powder",
    category: "Powders",
    price: 269,
    short: "Gentle yet potent Ayurvedic Virechana churna for chronic constipation & bowel regularity.",
    description:
      "Time-tested Ayurvedic colon-cleansing formula crafted with Sanay Patti, Haritaki, Saunf, Ajwain, Sendha Namak and Nishoth to stimulate natural peristalsis without dependency.",
    benefits: [
      "Effective overnight relief from chronic constipation",
      "Promotes comfortable evacuation without cramps",
      "Relieves abdominal bloating and heaviness",
    ],
    ingredients: "Sanay Patti, Haritaki, Saunf, Ajwain, Sendha Namak, Nishoth, Baheda, Amla, Mulethi.",
    usage: "Take 1/2 to 1 teaspoon (3g-5g) with lukewarm water at bedtime, or as advised by Vaidya.",
    image: "/assets/products/panch-fresh-powder-front.png",
  },
  {
    slug: "shahi-panch-24x7",
    name: "Shahi Panch 24x7",
    category: "Capsules",
    price: 674,
    short: "Daily classical Ayurvedic Rasayana capsules for round-the-clock stamina & vitality (30 Caps).",
    description:
      "Formulated for active daily vitality with pure Ashwagandha, Shuddha Shilajit, Safed Musli and essential micro-minerals to sustain energy and combat routine exhaustion.",
    benefits: [
      "Provides 24x7 sustained energy and stamina support",
      "Contains purified Shilajit, Ashwagandha and Safed Musli",
      "Supports stress recovery and combats mental fatigue",
    ],
    ingredients: "Shuddha Shilajit, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Shatavari, Vidarikand, Akarkara, Yashad Bhasma.",
    usage: "Take 1 capsule twice daily with warm water or milk after meals, or as directed by physician.",
    image: "/assets/products/shahi-panch-gold-front.png",
  },
  {
    slug: "vatt-tea",
    name: "Vatt Tea",
    category: "Herbal Teas",
    price: 368,
    short: "Classical Ayurvedic Vata-balancing herbal tea for calming nervous restlessness & stiff joints.",
    description:
      "Therapeutic herbal tea formulated with Rasna, Ashwagandha, Sunthi, Shankhpushpi, Bala, and Elaichi to gently warm the system, ground erratic energy, and relieve stiffness.",
    benefits: [
      "Pacifies aggravated Vata dosha and calms nervous tension",
      "Soothes joint stiffness, body aches and muscular spasms",
      "Promotes smooth digestion and relieves erratic bowel movement",
    ],
    ingredients: "Pluchea lanceolata (Rasna), Terminalia arjuna, Piper longum, Ashwagandha, Sunthi, Bala, Brahmi, Shankhpushpi, Tejpatta, Elaichi, Lavanga.",
    usage: "Boil 1/2 to 1 teaspoon in 150-200ml water for 3-5 minutes. Strain and enjoy warm twice daily.",
    image: "/assets/products/vatt-tea-front.png",
  },
  {
    slug: "uder-shaant-powder",
    name: "Uder Shaant Powder",
    category: "Powders",
    price: 1039,
    short: "Classical Grahani & IBS churna for frequent toilet urgency, loose stools & abdominal cramps.",
    description:
      "Specially formulated for frequent toilet urgency, chronic bowel sensitivity, IBS (Sangrahani), and cramping. Enriched with Kutaj, Bilva, Mustak, and Mochras to restore digestive peace.",
    benefits: [
      "Specially formulated for frequent toilet urgency and chronic loose bowels",
      "Calms intestinal inflammation, bowel cramping and Sangrahani / IBS",
      "Fortified with Kutaj, Bilva, Mustak and Dadim skin",
    ],
    ingredients: "Kutaj Chaal, Bilva Giri (Bael fruit), Mustak (Nagarmotha), Mochras, Dadim Twak, Ativisha, Lodhra, Shunthi, Dhanyak, Jeerak.",
    usage: "Take 5 gm powder twice daily with lassi (buttermilk) or fresh curd after meals in morning and evening.",
    image: "/assets/products/uder-shaant-powder-front.png",
  },
  {
    slug: "shahi-panch-gold-extra",
    name: "Shahi Panch Gold Extra",
    category: "Capsules",
    price: 1124,
    short: "Premium Ayurvedic Rasayana capsules with Swarna Bhasma, Shilajit & Ashwagandha (60 Caps).",
    description:
      "Esteemed classical Ayurvedic Rasayana and Vajikarana preparation in a premium 60-capsule pack. Formulated with Swarna Bhasma, Shuddha Shilajit, Kesar, Ashwagandha and Safed Musli for deep tissue nourishment and endurance.",
    benefits: [
      "Premium Ayurvedic Rasayana & Vajikarana medicine in 60-cap pack",
      "Fortified with Swarna Bhasma, Shilajit, Ashwagandha & Kesar",
      "Promotes physical endurance, vigor, and stress recovery",
    ],
    ingredients: "Swarna Bhasma, Shuddha Shilajit, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Akarkara, Jaiphal, Kesar, Vang Bhasma.",
    usage: "Take 1 capsule twice daily with warm milk or as directed by your Ayurvedic physician.",
    image: "/assets/products/shahi-panch-gold-front.png",
  },
  {
    slug: "arshopanch-powder",
    name: "Arshopanch Powder",
    category: "Powders",
    price: 959,
    short: "Targeted classical Ayurvedic churna providing soothing relief from piles, fissure & fistula.",
    description:
      "Specialized Ayurvedic proprietary medicine formulated with Suran (Jimikand), Nagkeshar, Neem Beej, Haritaki and Guggulu to shrink hemorrhoidal piles mass, relieve pain, and ease evacuation.",
    benefits: [
      "Relieves pain, swelling, burning and bleeding associated with piles and fissures",
      "Promotes natural shrinkage of hemorrhoidal pile masses",
      "Encourages smooth, strain-free morning bowel evacuation",
    ],
    ingredients: "Suran Kand, Nagkeshar, Neem Beej, Bakayan Beej, Haritaki, Nishoth, Shuddha Guggulu, Rasont, Daruharidra, Chitrak.",
    usage: "Take 5 gm powder twice daily after meals with lassi (buttermilk) or curd in morning and evening.",
    image: "/assets/products/arshopanch-powder-front.png",
  },
  {
    slug: "pitt-tea",
    name: "Pitt Tea",
    category: "Herbal Teas",
    price: 368,
    short: "Cooling Ayurvedic Pitta-balancing herbal tea for soothing hyperacidity & internal heat.",
    description:
      "Authentic cooling herbal brew with Giloy, Saunf, Dhaniya, Amla, Shankhpushpi, Brahmi, and Gulab to reduce metabolic heat, soothe sour belching, and promote serene digestion.",
    benefits: [
      "Pacifies aggravated Pitta dosha and reduces internal metabolic heat",
      "Relieves acidity, heartburn, sour throat and hot sensations",
      "Enriched with Giloy, Saunf, Dhaniya, Amla, Shankhpushpi & Gulab",
    ],
    ingredients: "Giloy, Saunf, Amla, Gulab, Dhaniya, Shankhpushpi, Brahmi, Gokshura, Vasa, Mulethi, Elaichi, Lavanga.",
    usage: "Take 1 spoon of tea and mix with 200ml water. Boil until quantity reduces to half. Strain and drink lukewarm twice daily.",
    image: "/assets/products/pitt-tea-front.png",
  },
  {
    slug: "arogya-tea",
    name: "Arogya Tea",
    category: "Herbal Teas",
    price: 368,
    short: "Everyday Ayurvedic wellness & Tridosha rejuvenation herbal tea with Arjuna, Mulethi & Tulsi.",
    description:
      "Master herbal formulation with 19 sacred botanicals including Terminalia arjuna, Mulethi, Haldi, Brahmi, Tulsi, and Anantmool for daily immunity, cardiovascular health, and vital energy.",
    benefits: [
      "Tridosha balancing blend for daily vitality and disease prevention",
      "Cardiovascular and micro-circulatory support with Terminalia arjuna",
      "Balances hormones and supports calm mental clarity with Brahmi & Tulsi",
    ],
    ingredients: "Arjuna Bark, Mulethi, Saunf, Sunthi, Haldi, Tejpatta, Bala, Brahmi, Dalchini, Anantmool, Amla, Tulsi, Kali Mirch, Gulab, Pippali, Kulanjan, Elaichi.",
    usage: "Add a pinch of Arogya Tea to boiling water (150-200ml). Steep for 5-7 minutes. Strain and enjoy warm twice daily.",
    image: "/assets/products/arogya-tea-front.png",
  },
  {
    slug: "kapha-tea",
    name: "Kapha Tea",
    category: "Herbal Teas",
    price: 368,
    short: "Invigorating Ayurvedic Kapha-clearing herbal tea for respiratory clarity & sluggish digestion.",
    description:
      "Invigorating herbal brew with classical Trikatu herbs (Sunthi, Pippali, Kali Mirch), Baheda, Amla, Mulethi, and Lavanga to clear heavy congestion and kindle sluggish metabolism.",
    benefits: [
      "Clears heavy congestion from throat, chest, and nasal passages",
      "Kindles sluggish digestive fire (Manda Agni) and accelerates metabolism",
      "Formulated with Trikatu (Pippali, Sunthi, Kali Mirch), Baheda & Mulethi",
    ],
    ingredients: "Sunthi, Pippali, Kali Mirch, Baheda, Amla, Manjistha, Lavanga, Mulethi, Tejpatta, Dalchini, Elaichi.",
    usage: "Take 1 spoon of tea and mix with 200ml water. Boil until quantity reduces to half. Strain and drink lukewarm twice daily.",
    image: "/assets/products/kapha-tea-front.png",
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
    a: "Yes. Our Ayurvedic oils, powders, Shilajit and capsules can be browsed and ordered from the Products section of this website. For guidance on what suits you, please speak with us first.",
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
