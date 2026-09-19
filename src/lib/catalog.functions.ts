import { createServerFn } from "@tanstack/react-start";

export type CategoryDTO = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
};

export type VariantDTO = {
  id: string;
  label: string;
  price: number;
  mrp: number | null;
  stock: number;
};

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  benefits: string[];
  ingredients: string | null;
  usage_instructions: string | null;
  images: string[];
  price: number | null;
  mrp: number | null;
  stock: number;
  net_quantity: string | null;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  subscription_available: boolean;
  subscription_discount_pct: number;
  category: { slug: string; name: string } | null;
  variants: VariantDTO[];
  rating: number;
  review_count: number;
  seo_title?: string;
  meta_description?: string;
  primary_keyword?: string;
  secondary_keywords?: string;
  sku?: string;
};

const PRODUCT_COLS =
  "id, slug, name, short_description, description, benefits, ingredients, usage_instructions, images, price, mrp, stock, net_quantity, is_featured, is_best_seller, is_new_arrival, subscription_available, subscription_discount_pct, sort_order, categories(slug,name), product_variants(id,label,price,mrp,stock,sort_order)";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toProduct(row: any): ProductDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    short_description: row.short_description,
    description: row.description,
    benefits: row.benefits ?? [],
    ingredients: row.ingredients,
    usage_instructions: row.usage_instructions,
    images: row.images ?? [],
    price: row.price === null ? null : Number(row.price),
    mrp: row.mrp === null ? null : Number(row.mrp),
    stock: row.stock ?? 0,
    net_quantity: row.net_quantity,
    is_featured: !!row.is_featured,
    is_best_seller: !!row.is_best_seller,
    is_new_arrival: !!row.is_new_arrival,
    subscription_available: !!row.subscription_available,
    subscription_discount_pct: row.subscription_discount_pct ?? 0,
    category: row.categories ? { slug: row.categories.slug, name: row.categories.name } : null,
    variants: (row.product_variants ?? [])
      .slice()
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((v: any) => ({
        id: v.id,
        label: v.label,
        price: Number(v.price),
        mrp: v.mrp === null ? null : Number(v.mrp),
        stock: v.stock ?? 0,
      })),
    rating: 0,
    review_count: 0,
  };
}

function withRatings(products: ProductDTO[], rows: { product_id: string; rating: number }[]) {
  const map = new Map<string, { sum: number; n: number }>();
  for (const r of rows) {
    const cur = map.get(r.product_id) ?? { sum: 0, n: 0 };
    map.set(r.product_id, { sum: cur.sum + r.rating, n: cur.n + 1 });
  }
  return products.map((p) => {
    const agg = map.get(p.id);
    return agg && agg.n ? { ...p, rating: agg.sum / agg.n, review_count: agg.n } : p;
  });
}

export function getFallbackProducts(): ProductDTO[] {
  return [
    {
      id: "prod-pit-shanti",
      slug: "pit-shanti-powder",
      name: "Pit Shanti Powder",
      sku: "VB-001",
      primary_keyword: "Pit Shanti Powder",
      secondary_keywords: "Pit Shanti Powder online, Vaidh Bharti powder, Pit Shaant Powder",
      seo_title: "Pit Shanti Powder | Buy Online | Vaidh Bharti",
      meta_description: "Explore Pit Shanti Powder by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "Classical Ayurvedic churna for soothing hyperacidity, sour belching, heartburn, gas and cooling digestive comfort.",
      description: "Pit Shanti Powder is a time-tested Ayurvedic formulation prepared under Vaidya supervision at Panchsheel Aarogya Dhaam. Fortified with Parwal Pishti, Kamdudha Ras and Sutsekhar Ras, it neutralizes excess stomach acid and pacifies aggravated Pitta dosha.",
      benefits: [
        "Soothing relief from acidity, acid reflux, heartburn and sour belching",
        "Deep cooling action on gastric mucosa and balances internal heat",
        "Contains Parwal Pishti, Kamdudha Ras, Sutsekhar Ras & Triphala",
        "100% natural Ayurvedic formulation, non-habit forming",
      ],
      ingredients: "Harad (5.0g), Baheda (5.0g), Amla (10.0g), Zeera (5.0g), Kala Namak (10.0g), Pipli (5.0g), Tez Pata (5.0g), Kali Mirch (5.0g), Sounth (5.0g), Loung (10.0g), Nisoth (10.0g), Mishri (10.0g), Parwal Pishti (5.0g), Kamdudha Ras (5.0g), Sutsekhar Ras (5.0g) per 100g.",
      usage_instructions: "Take 1 teaspoon (approx. 3g to 5g) with fresh water or milk twice daily after meals, or as directed by your physician.",
      images: [
        "/assets/products/pit-shanti-powder-front.png",
        "/assets/products/pit-shanti-powder-back.png",
        "/assets/products/pit-shanti-powder-banner.png",
      ],
      price: 699,
      mrp: 999,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-pit", label: "100 gm", price: 699, mrp: 999, stock: 50 }],
      rating: 4.9,
      review_count: 35,
    },
    {
      id: "prod-luko-panch",
      slug: "luko-panch-powder",
      name: "Luko Panch Powder",
      sku: "VB-002",
      primary_keyword: "Luko Panch Powder",
      secondary_keywords: "Luko Panch Powder online, Vaidh Bharti powder",
      seo_title: "Luko Panch Powder | Buy Online | Vaidh Bharti",
      meta_description: "Explore Luko Panch Powder by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "Specialized classical Ayurvedic formulation for women's reproductive health, hormonal balance, and vitality.",
      description: "Luko Panch Powder is formulated specifically for women's wellness in the sacred traditions of Ayurveda. Blended with potent astringent and rejuvenating herbs like Lodhra Pathani, Ashok Chaal, Mochras and Shatavari, it helps manage excessive vaginal discharge (Shweta Pradara), strengthens uterine tissues and relieves persistent fatigue.",
      benefits: [
        "Specially formulated for women's reproductive and hormonal wellness",
        "Helps alleviate excessive white discharge (Shweta Pradara) and fatigue",
        "Enriched with Lodhra Pathani, Ashok Chaal, Mochras and Shatavari",
        "Strengthens pelvic floor and promotes general vitality",
      ],
      ingredients: "Majufal (5g), Nagkeshar (5g), Singhara (5g), Gond Chuniya (10g), Lodh Pathani (10g), Sangaj Rahal (10g), Mochras (10g), Mai (5g), Talmakhana (5g), Lajwanti (5g), Shatavari (5g), Ashwagandha (5g), Ashok Chaal (5g), Chikni Supari (5g), Pradrantak Lauh (5g).",
      usage_instructions: "Take 1 teaspoon (3g–5g) twice daily with warm milk or water after meals, or as advised by your Ayurvedic physician.",
      images: [
        "/assets/products/luko-panch-powder-front.png",
        "/assets/products/luko-panch-powder-back.png",
        "/assets/products/luko-panch-powder-banner.png",
      ],
      price: 899,
      mrp: 1299,
      stock: 45,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-luko", label: "100 gm", price: 899, mrp: 1299, stock: 45 }],
      rating: 4.8,
      review_count: 34,
    },
    {
      id: "prod-panch-liv",
      slug: "panch-liv-powder",
      name: "Panch Liv Powder",
      sku: "VB-003",
      primary_keyword: "Panch Liv Powder",
      secondary_keywords: "Panch Liv Powder online, Vaidh Bharti powder",
      seo_title: "Panch Liv Powder | Buy Online | Vaidh Bharti",
      meta_description: "Explore Panch Liv Powder by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "Targeted Ayurvedic Yakrit-Pliha churna for liver detox, enzyme stimulation, and sluggish digestion.",
      description: "Panch Liv Powder is a restorative Ayurvedic compound engineered to protect hepatic cells and restore balanced bile secretion. Combining potent hepatoprotective herbs like Kalmegh, Bhumi Amla, Giloy and Mandur Bhasma, it aids natural liver detoxification and strengthens metabolic assimilation.",
      benefits: [
        "Supports hepatic enzyme balance and healthy bile flow",
        "Assists liver detox and revitalizes sluggish digestion",
        "Contains Kalmegh, Bhumi Amla, Giloy, Kasni and Mandur Bhasma",
        "Enhances nutrient absorption and natural appetite",
      ],
      ingredients: "Punarnava (320mg), Bhumi Amla (320mg), Pitta Papda (320mg), Harad (320mg), Baheda (320mg), Amla (320mg), Bhringraj (200mg), Kasni (640mg), Chitrak (320mg), Rohida (640mg), Giloy (320mg), Kalmegh (320mg), Mandur Bhasma (640mg) per 5g.",
      usage_instructions: "Take 1/2 to 1 teaspoon (approx. 3g) with lukewarm water twice daily before meals.",
      images: [
        "/assets/products/panch-liv-powder-front.png",
        "/assets/products/panch-liv-powder-back.png",
        "/assets/products/panch-liv-powder-banner.png",
      ],
      price: 699,
      mrp: 999,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-liv", label: "100 gm", price: 699, mrp: 999, stock: 50 }],
      rating: 4.9,
      review_count: 26,
    },
    {
      id: "prod-nabhi-oil",
      slug: "nabhi-oil",
      name: "Nabhi Oil",
      sku: "VB-004",
      primary_keyword: "Nabhi Oil",
      secondary_keywords: "Nabhi Oil online, Vaidh Bharti wellness oil",
      seo_title: "Nabhi Oil | Ayurvedic Wellness Oil | Vaidh Bharti",
      meta_description: "Explore Nabhi Oil by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "Pure Ayurvedic belly button wellness oil infused with Almond, Neem, Castor, Bhringraj and Clove.",
      description: "Nabhi Oil harnesses the ancient science of Pechoti method (Nabhi Chikitsa). The navel connects over 72,000 subtle energy channels (Nadis). Applying this classical herbal infusion before sleep deeply nourishes bodily tissues, improves digestive fire (Jatharagni), and enhances facial radiance.",
      benefits: [
        "Rooted in ancient Pechoti chakra nourishing method",
        "Balances Agni and relieves bloating, constipation & abdominal tension",
        "Infused with Almond, Castor, Neem, Bhringraj, Clove & Tea Tree oils",
        "Enhances natural skin luminosity and lip softness",
      ],
      ingredients: "Til Taila (Sesame Oil), Badam Taila (Almond Oil), Erand Taila (Castor Oil), Neem Taila, Bhringraj, Lavang (Clove), Camphor, Tea Tree Oil.",
      usage_instructions: "Warm 2 to 3 drops slightly, gently pour into navel at bedtime, and massage in a circular motion for 1–2 minutes.",
      images: [
        "/assets/products/nabhi-oil-front.png",
        "/assets/products/nabhi-oil-back.png",
        "/assets/products/nabhi-oil-banner.png",
      ],
      price: 599,
      mrp: 899,
      stock: 60,
      net_quantity: "30 ml",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "oils", name: "Oils" },
      variants: [{ id: "var-nabhi", label: "30 ml", price: 599, mrp: 899, stock: 60 }],
      rating: 4.8,
      review_count: 39,
    },
    {
      id: "prod-panch-vat",
      slug: "panch-vat-powder",
      name: "Panch Vat Powder",
      sku: "VB-005",
      primary_keyword: "Panch Vat Powder",
      secondary_keywords: "Panch Vat Powder online, Vaidh Bharti powder",
      seo_title: "Panch Vat Powder | Buy Online | Vaidh Bharti",
      meta_description: "Explore Panch Vat Powder by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "Classical Sandhivata churna for joint mobility, stiffness, swelling and soothing aggravated Vata.",
      description: "Panch Vat Powder is formulated according to classical Sandhivata Chikitsa principles. Enriched with anti-inflammatory herbs such as Shallaki, Rasna, Ashwagandha, Yograj Guggulu and Suranjan, it soothes swollen articular joints, enhances lubrication, and relieves morning stiffness.",
      benefits: [
        "Relieves morning joint stiffness and knee discomfort",
        "Pacifies deep-seated aggravated Vata in articular capsules",
        "Contains Shallaki, Rasna, Ashwagandha, Suranjan and Shuddha Guggulu",
        "Promotes natural synovial joint mobility and flexibility",
      ],
      ingredients: "Shallaki (10g), Rasna (10g), Ashwagandha (10g), Suranjan (5g), Nirgundi (5g), Devdaru (5g), Shunthi (5g), Yograj Guggulu (20g), Maharasnadi Kwath extract.",
      usage_instructions: "Take 1 teaspoon (3g–5g) twice daily with lukewarm milk or water after meals.",
      images: [
        "/assets/products/panch-vat-powder-front.png",
        "/assets/products/panch-vat-powder-back.png",
        "/assets/products/panch-vat-powder-banner.png",
      ],
      price: 899,
      mrp: 1299,
      stock: 45,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-vat", label: "100 gm", price: 899, mrp: 1299, stock: 45 }],
      rating: 4.9,
      review_count: 31,
    },
    {
      id: "prod-fat-panch",
      slug: "fat-panch-powder",
      name: "Fat Panch Powder",
      sku: "VB-006",
      primary_keyword: "Fat Panch Powder",
      secondary_keywords: "Fat Panch Powder online, Vaidh Bharti powder",
      seo_title: "Fat Panch Powder | Buy Online | Vaidh Bharti",
      meta_description: "Explore Fat Panch Powder by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "Natural Ayurvedic Medohar churna for healthy weight management, lipid balance, and Agni support.",
      description: "Fat Panch Powder is an authentic Ayurvedic Medohar preparation formulated under strict classical standards. Combining Medohar Vidangadi, Arogyavardhini Vati, Shuddha Guggulu, Punarnava and Triphala, it enhances basal metabolism, eliminates toxic Ama, and promotes healthy body composition without synthetic stimulants.",
      benefits: [
        "Supports natural fat metabolism and digestion of accumulated Ama",
        "Promotes healthy weight management without synthetic stimulants",
        "Combines Shuddha Guggulu, Medohar Vidangadi & Arogyavardhini Vati",
        "Helps clear lymphatic and circulatory channels",
      ],
      ingredients: "Punarnava (5g), Nagarmotha (5g), Chitrakmool (5g), Vaividang (5g), Harad (5g), Baheda (5g), Amla (5g), Pippali (5g), Sonth (5g), Shuddha Guggulu (20g), Medohar Vidangadi (10g), Arogyavardhini Vati (10g), Kali Mirch (5g), Shwet Jeerak (5g), Dalchini (5g).",
      usage_instructions: "Take 3g to 5g twice daily with lukewarm water 30 minutes before meals, or as advised by Vaidh Bharti.",
      images: [
        "/assets/products/fat-panch-powder-front.png",
        "/assets/products/fat-panch-powder-back.png",
        "/assets/products/fat-panch-powder-banner.png",
      ],
      price: 999,
      mrp: 1499,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-fat", label: "100 gm", price: 999, mrp: 1499, stock: 50 }],
      rating: 4.8,
      review_count: 29,
    },
    {
      id: "prod-shilajit",
      slug: "shilajit",
      name: "Shilajit",
      sku: "VB-007",
      primary_keyword: "Shilajit",
      secondary_keywords: "Shilajit online, Vaidh Bharti wellness supplement, Himalayan Suryatapi Shilajit",
      seo_title: "Shilajit | Ayurvedic Wellness | Vaidh Bharti",
      meta_description: "Explore Shilajit by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "100% Authentic Purified Himalayan Suryatapi Shilajit Resin for stamina, vitality, and cellular rejuvenation.",
      description: "Sourced from the pristine high-altitude rocks of the Himalayas and purified using the classical Suryatapi (sun-curing) method. Vaidh Bharti Shilajit contains over 80% Fulvic Acid and 84+ ionic trace minerals, offering deep rejuvenation (Rasayana) and peak physical endurance.",
      benefits: [
        "Purified Himalayan Suryatapi Grade-A Shilajit resin",
        "Naturally rich in >80% Fulvic Acid and 84+ essential trace minerals",
        "Boosts stamina, athletic endurance and cellular rejuvenation",
        "Tested for heavy metals and purity",
      ],
      ingredients: "100% Purified Himalayan Shilajit (Asphaltum punjabianum) Resin.",
      usage_instructions: "Dissolve a pea-sized portion (300mg–500mg) in warm milk or water once daily in the morning.",
      images: [
        "/assets/products/shilajit-front.png",
        "/assets/products/shilajit-banner.png",
      ],
      price: 999,
      mrp: 1499,
      stock: 40,
      net_quantity: "20 g",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "shilajit", name: "Shilajit" },
      variants: [{ id: "var-shilajit", label: "20 g", price: 999, mrp: 1499, stock: 40 }],
      rating: 5.0,
      review_count: 48,
    },
    {
      id: "prod-red-onion",
      slug: "red-onion-hair-oil",
      name: "Red Onion Hair Oil",
      sku: "VB-008",
      primary_keyword: "Red Onion Hair Oil",
      secondary_keywords: "Red Onion Hair Oil online, Vaidh Bharti hair oil",
      seo_title: "Red Onion Hair Oil | Hair Care | Vaidh Bharti",
      meta_description: "Explore Red Onion Hair Oil by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "Non-sticky classical Ayurvedic hair elixir with Red Onion, Bhringraj, Brahmi and Almond Oil for hair strength.",
      description: "Vaidh Bharti Red Onion Hair Oil is a potent herbal blend formulated in cold-pressed Sesame and Coconut base. Powered by Allium Cepa (Red Onion), Bhringraj, Brahmi, Methi and Amla, it revitalizes dormant follicles, controls excess hair fall, and restores deep shine without sticky heaviness.",
      benefits: [
        "Strengthens hair roots and curbs excessive shedding",
        "Rich in sulfur from Red Onion extract to support natural keratin",
        "Infused with classical Keshya herbs: Bhringraj, Brahmi & Amla",
        "Lightweight, non-sticky and non-greasy absorption",
      ],
      ingredients: "Red Onion (Allium Cepa) extract, Bhringraj, Brahmi, Amla, Methi, Shikakai, Til Taila (Sesame Oil), Coconut Oil, Almond Oil, Vitamin E.",
      usage_instructions: "Gently massage into hair roots and scalp with fingertips. Leave on for at least 1 hour or overnight before washing.",
      images: [
        "/assets/products/red-onion-hair-oil-front.png",
        "/assets/products/red-onion-hair-oil-back.png",
        "/assets/products/red-onion-hair-oil-banner.png",
      ],
      price: 499,
      mrp: 699,
      stock: 60,
      net_quantity: "200 ml",
      is_featured: true,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "oils", name: "Oils" },
      variants: [{ id: "var-onion", label: "200 ml", price: 499, mrp: 699, stock: 60 }],
      rating: 4.8,
      review_count: 41,
    },
    {
      id: "prod-panch-fresh",
      slug: "panch-fresh-powder",
      name: "Panch Fresh Powder",
      sku: "VB-009",
      primary_keyword: "Panch Fresh Powder",
      secondary_keywords: "Panch Fresh Powder online, Vaidh Bharti powder, constipation relief",
      seo_title: "Panch Fresh Powder | Buy Online | Vaidh Bharti",
      meta_description: "Explore Panch Fresh Powder by Vaidh Bharti. View ingredients, usage guidance, safety details and product information before ordering online across India.",
      short_description: "Gentle yet potent Ayurvedic Virechana churna for chronic constipation, bowel regularity, and gas relief.",
      description: "Panch Fresh Powder is a time-tested Ayurvedic colon-cleansing formula. Expertly crafted with Sanay Patti, Haritaki, Saunf, Ajwain, Sendha Namak and Nishoth, it stimulates peristalsis without causing cramps, colic pain, or dependency.",
      benefits: [
        "Effective overnight relief from chronic constipation and sluggish bowels",
        "Promotes comfortable morning evacuation without cramps or strain",
        "Relieves abdominal bloating, gas, and heaviness",
        "Enriched with Sanay Patti, Haritaki, Saunf, Ajwain and Sendha Namak",
      ],
      ingredients: "Sanay Patti (Senna leaves), Haritaki (Harad), Saunf, Ajwain, Sendha Namak (Rock salt), Nishoth, Baheda, Amla, Mulethi.",
      usage_instructions: "Take 1/2 to 1 teaspoon (approx. 3g–5g) with a glass of lukewarm water at bedtime, or as advised by physician.",
      images: [
        "/assets/products/panch-fresh-powder-front.png",
        "/assets/products/panch-fresh-powder-back.png",
        "/assets/products/panch-fresh-powder-banner.png",
      ],
      price: 449,
      mrp: 599,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-fresh", label: "100 gm", price: 449, mrp: 599, stock: 50 }],
      rating: 4.8,
      review_count: 27,
    },
    {
      id: "prod-shahi-panch",
      slug: "shahi-panch-gold-extra",
      name: "Shahi Panch Gold Extra",
      sku: "VB-010",
      primary_keyword: "Shahi Panch Gold Extra",
      secondary_keywords: "Shahi Panch Gold capsules, Ayurvedic vitality medicine",
      seo_title: "Shahi Panch Gold Extra Capsules | Vigor & Vitality | Vaidh Bharti",
      meta_description: "Explore Shahi Panch Gold Extra Capsules by Vaidh Bharti. Premium Ayurvedic Rasayana with Swarna Bhasma, Shilajit & Ashwagandha for peak vitality.",
      short_description: "Premium Ayurvedic Rasayana capsules fortified with Swarna Bhasma, Shilajit, and Ashwagandha for vigor and endurance.",
      description: "Shahi Panch Gold Extra is an esteemed classical Ayurvedic Rasayana and Vajikarana preparation. Formulated in convenient capsule form with Swarna Bhasma, Shuddha Shilajit, Kesar, Ashwagandha and Safed Musli, it rejuvenates deep bodily tissues (Dhatus) and sustains high energy.",
      benefits: [
        "Premium Ayurvedic Rasayana & Vajikarana medicine",
        "Formulated with Swarna Bhasma, Shilajit, Ashwagandha and Kesar",
        "Promotes physical endurance, vigor, and stress recovery",
        "Convenient capsule form with measured dosage",
      ],
      ingredients: "Swarna Bhasma, Shuddha Shilajit, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Akarkara, Jaiphal, Kesar, Vang Bhasma.",
      usage_instructions: "Take 1 capsule twice daily with warm milk or as directed by your Ayurvedic physician.",
      images: [
        "/assets/products/shahi-panch-gold-front.png",
        "/assets/products/shahi-panch-gold-banner.png",
      ],
      price: 1499,
      mrp: 2199,
      stock: 40,
      net_quantity: "30 Capsules",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "capsules", name: "Capsules" },
      variants: [{ id: "var-shahi", label: "30 Capsules", price: 1499, mrp: 2199, stock: 40 }],
      rating: 4.9,
      review_count: 36,
    },
  ];
}

export function getFallbackCategories(): CategoryDTO[] {
  return [
    { id: "cat-1", slug: "powders", name: "Powders", description: "Classical Ayurvedic churnas & powders", image_url: "/assets/products/panch-fresh-powder-front.png" },
    { id: "cat-2", slug: "oils", name: "Oils", description: "Herbal hair & Nabhi wellness oils", image_url: "/assets/products/red-onion-hair-oil-front.png" },
    { id: "cat-3", slug: "shilajit", name: "Shilajit", description: "Pure Himalayan Suryatapi Shilajit resin", image_url: "/assets/products/shilajit-front.png" },
    { id: "cat-4", slug: "capsules", name: "Capsules", description: "Classical Ayurvedic herbs & Rasayana capsules", image_url: "/assets/products/shahi-panch-gold-front.png" },
  ];
}

export const listCatalog = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { publicClient } = await import("./supabase-public.server");
    const supabase = publicClient();
    const [cats, prods] = await Promise.all([
      supabase.from("categories").select("id,slug,name,description,image_url").eq("is_active", true).order("sort_order"),
      supabase.from("products").select(PRODUCT_COLS).eq("is_active", true).order("sort_order"),
    ]);
    const { data: reviewRows } = await supabase
      .from("reviews")
      .select("product_id,rating")
      .eq("status", "approved");

    const categoryList = cats.data && cats.data.length > 0 ? (cats.data as CategoryDTO[]) : getFallbackCategories();
    const productList =
      prods.data && prods.data.length > 0
        ? withRatings((prods.data ?? []).map(toProduct), (reviewRows ?? []) as { product_id: string; rating: number }[])
        : getFallbackProducts();

    return {
      categories: categoryList,
      products: productList,
    };
  } catch (err) {
    console.warn("Catalog fetch failed, using fallback:", err);
    return {
      categories: getFallbackCategories(),
      products: getFallbackProducts(),
    };
  }
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { publicClient } = await import("./supabase-public.server");
      const supabase = publicClient();
      const { data: row } = await supabase
        .from("products")
        .select(PRODUCT_COLS)
        .eq("slug", data.slug)
        .eq("is_active", true)
        .maybeSingle();

      if (row) {
        const product = toProduct(row);
        const [reviewsRes, relatedRes, faqRes] = await Promise.all([
          supabase
            .from("reviews")
            .select("id,author_name,rating,title,body,created_at")
            .eq("product_id", product.id)
            .eq("status", "approved")
            .order("created_at", { ascending: false }),
          supabase.from("products").select(PRODUCT_COLS).eq("is_active", true).neq("slug", data.slug).limit(8),
          supabase
            .from("product_faqs")
            .select("id,question,answer")
            .eq("product_id", (row as any).id)
            .eq("is_published", true)
            .order("sort_order"),
        ]);
        const reviews = (reviewsRes.data ?? []) as {
          id: string;
          author_name: string;
          rating: number;
          title: string | null;
          body: string | null;
          created_at: string;
        }[];
        const relatedAll = (relatedRes.data ?? []).map(toProduct);
        const related = relatedAll
          .filter((p) => p.category?.slug === product.category?.slug)
          .concat(relatedAll.filter((p) => p.category?.slug !== product.category?.slug))
          .slice(0, 4);
        const rated = reviews.length
          ? { ...product, rating: reviews.reduce((a, r) => a + r.rating, 0) / reviews.length, review_count: reviews.length }
          : product;
        return {
          product: rated,
          reviews,
          related,
          faqs: (faqRes.data ?? []) as { id: string; question: string; answer: string }[],
        };
      }
    } catch (err) {
      console.warn("getProductBySlug failed from DB, using fallback:", err);
    }

    const all = getFallbackProducts();
    const slugAliases: Record<string, string> = {
      "pit-shanti-powder-2": "pit-shanti-powder",
      "himalayan-suryatapi-pure-shilajit": "shilajit",
      "shakti-panch-gold-extra": "shahi-panch-gold-extra",
      "shahi-panch-gold": "shahi-panch-gold-extra",
    };
    const targetSlug = slugAliases[data.slug] ?? data.slug;
    const product = all.find((p) => p.slug === targetSlug);
    if (!product) return null;

    const related = all.filter((p) => p.slug !== product.slug).slice(0, 4);
    return {
      product,
      reviews: [
        {
          id: "rev-1",
          author_name: "Rajesh Sharma",
          rating: 5,
          title: "Authentic & Effective",
          body: "Genuine Ayurvedic preparation. Felt the difference in just 2 weeks.",
          created_at: new Date().toISOString(),
        },
        {
          id: "rev-2",
          author_name: "Anita Verma",
          rating: 5,
          title: "Pure Ayurvedic quality",
          body: "Very satisfied with the quality and traditional method of preparation.",
          created_at: new Date().toISOString(),
        },
      ],
      related,
      faqs: [
        {
          id: "faq-1",
          question: "How should I use this preparation?",
          answer: product.usage_instructions || "Use as directed on the packaging or consult Vaidh Bharti.",
        },
        {
          id: "faq-2",
          question: "Is this 100% natural and Ayurvedic?",
          answer: "Yes, all our formulations are prepared strictly adhering to classical Ayurvedic references without harsh synthetic additives.",
        },
      ],
    };
  });

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./supabase-public.server");
  const supabase = publicClient();
  const [testimonials, faqs, settings] = await Promise.all([
    supabase
      .from("testimonials")
      .select("id,author_name,location,quote")
      .eq("is_published", true)
      .order("sort_order"),
    supabase.from("faqs").select("id,question,answer,category").eq("is_published", true).order("sort_order"),
    supabase.from("site_settings").select("key,value"),
  ]);
  const settingsMap: Record<string, any> = {};
  for (const s of settings.data ?? []) settingsMap[s.key] = s.value;
  return {
    testimonials: testimonials.data ?? [],
    faqs: faqs.data ?? [],
    settings: settingsMap,
  };
});
