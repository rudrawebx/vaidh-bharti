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
  "id, slug, name, short_description, description, benefits, ingredients, usage_instructions, images, price, mrp, stock, sku, net_quantity, is_featured, is_best_seller, is_new_arrival, subscription_available, subscription_discount_pct, sort_order, seo_title, seo_description, categories(id,slug,name), product_variants(id,label,price,mrp,stock,sort_order)";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toProduct(row: any): ProductDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku ?? undefined,
    seo_title: row.seo_title ?? undefined,
    meta_description: row.seo_description ?? undefined,
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
      price: 959,
      mrp: 1199,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-pit", label: "100 gm", price: 959, mrp: 1199, stock: 50 }],
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
      price: 799,
      mrp: 999,
      stock: 45,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-luko", label: "100 gm", price: 799, mrp: 999, stock: 45 }],
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
      price: 749,
      mrp: 999,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-liv", label: "100 gm", price: 749, mrp: 999, stock: 50 }],
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
      price: 500,
      mrp: 999,
      stock: 60,
      net_quantity: "30 ml",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "oils", name: "Oils" },
      variants: [{ id: "var-nabhi", label: "30 ml", price: 500, mrp: 999, stock: 60 }],
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
      price: 1124,
      mrp: 1499,
      stock: 45,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-vat", label: "100 gm", price: 1124, mrp: 1499, stock: 45 }],
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
      price: 1199,
      mrp: 1499,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-fat", label: "100 gm", price: 1199, mrp: 1499, stock: 50 }],
      rating: 4.8,
      review_count: 29,
    },
    {
      id: "prod-shahi-panch-powder",
      slug: "shahi-panch-powder",
      name: "Shahi Panch Powder",
      sku: "VB-007",
      primary_keyword: "Shahi Panch Powder",
      secondary_keywords: "Shahi Panch Powder online, Ayurvedic Rasayana churna, Swarna Bhasma powder",
      seo_title: "Shahi Panch Powder | Gold & Saffron Vitality Churna | Vaidh Bharti",
      meta_description: "Explore Shahi Panch Powder by Vaidh Bharti. Premium classical Rasayana churna with Swarna Bhasma, Kesar and Makardhwaj for supreme vitality and vigor.",
      short_description: "Classical Ayurvedic Rasayana churna fortified with Kesar, Makardhwaj and Swarna Bhasma for peak vitality and vigor.",
      description: "Shahi Panch Powder is a prestigious classical Ayurvedic Rasayana formulation crafted at Panchsheel Aarogya Dhaam. Infused with Swarna Bhasma (Gold Calx), Kesar (Saffron), Makardhwaj, Ashwagandha and Safed Musli, it delivers supreme cellular nourishment (Rasadi Dhatus), enhances stamina, and revitalizes natural inner strength.",
      benefits: [
        "Fortified with Kesar (Saffron), Makardhwaj and Swarna Bhasma",
        "Deeply nourishes all 7 Dhatus to rebuild stamina and vitality",
        "Combats chronic fatigue, nervous exhaustion and physical burnout",
        "100% authentic Ayurvedic Rasayana medicine",
      ],
      ingredients: "Swarna Bhasma, Kesar (Crocus sativus), Makardhwaj, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Akarkara, Jaiphal, Javitri, Vang Bhasma, Shuddha Shilajit per 100g.",
      usage_instructions: "Take 2 to 3 gm daily with warm milk or as directed by the physician. Best taken before bedtime.",
      images: [
        "/assets/products/shahi-panch-powder-front.png",
        "/assets/products/shahi-panch-powder-back.png",
        "/assets/products/shahi-panch-powder-banner.png",
      ],
      price: 1499,
      mrp: 1999,
      stock: 40,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-shahi-pow", label: "100 gm", price: 1499, mrp: 1999, stock: 40 }],
      rating: 4.9,
      review_count: 38,
    },
    {
      id: "prod-shilajit",
      slug: "shilajit",
      name: "Shilajit",
      sku: "VB-008",
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
      price: 799,
      mrp: 999,
      stock: 40,
      net_quantity: "20 g",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "shilajit", name: "Shilajit" },
      variants: [{ id: "var-shilajit", label: "20 g", price: 799, mrp: 999, stock: 40 }],
      rating: 5.0,
      review_count: 48,
    },
    {
      id: "prod-red-onion",
      slug: "red-onion-hair-oil",
      name: "Red Onion Hair Oil",
      sku: "VB-009",
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
      price: 359,
      mrp: 599,
      stock: 60,
      net_quantity: "200 ml",
      is_featured: true,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "oils", name: "Oils" },
      variants: [{ id: "var-onion", label: "200 ml", price: 359, mrp: 599, stock: 60 }],
      rating: 4.8,
      review_count: 41,
    },
    {
      id: "prod-panch-fresh",
      slug: "panch-fresh-powder",
      name: "Panch Fresh Powder",
      sku: "VB-010",
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
      price: 269,
      mrp: 299,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-fresh", label: "100 gm", price: 269, mrp: 299, stock: 50 }],
      rating: 4.8,
      review_count: 27,
    },
    {
      id: "prod-shahi-panch-24x7",
      slug: "shahi-panch-24x7",
      name: "Shahi Panch 24x7",
      sku: "VB-011",
      primary_keyword: "Shahi Panch 24x7",
      secondary_keywords: "Shahi Panch 24x7 capsules, daily energy Ayurvedic medicine, vitality rasayana",
      seo_title: "Shahi Panch 24x7 Capsules | Daily Vitality & Energy | Vaidh Bharti",
      meta_description: "Explore Shahi Panch 24x7 Capsules by Vaidh Bharti. Daily classical Ayurvedic Rasayana with Ashwagandha & Shilajit for sustained vitality and stamina.",
      short_description: "Daily classical Ayurvedic Rasayana capsules for round-the-clock energy, stamina, and stress resilience.",
      description: "Shahi Panch 24x7 Capsules are scientifically formulated for active lifestyles. Powered by pure Ashwagandha, Shilajit, Safed Musli and essential micro-minerals, it maintains sustained vitality, supports adrenal function, and reduces daily physical and mental exhaustion.",
      benefits: [
        "Provides 24x7 sustained energy and stamina support",
        "Contains purified Shilajit, Ashwagandha and Safed Musli",
        "Supports stress recovery and combats routine mental fatigue",
        "Convenient travel-friendly blister pack (30 capsules)",
      ],
      ingredients: "Shuddha Shilajit, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Shatavari, Vidarikand, Akarkara, Yashad Bhasma.",
      usage_instructions: "Take 1 capsule twice daily with warm water or milk after meals, or as directed by your physician.",
      images: [
        "/assets/products/shahi-panch-gold-front.png",
        "/assets/products/shahi-panch-gold-banner.png",
      ],
      price: 674,
      mrp: 899,
      stock: 40,
      net_quantity: "30 Capsules",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "capsules", name: "Capsules" },
      variants: [{ id: "var-shahi-24x7", label: "30 Capsules", price: 674, mrp: 899, stock: 40 }],
      rating: 4.8,
      review_count: 22,
    },
    {
      id: "prod-vatt-tea",
      slug: "vatt-tea",
      name: "Vatt Tea",
      sku: "VB-012",
      primary_keyword: "Vatt Tea",
      secondary_keywords: "Vatt Tea online, Vata balancing herbal tea, Vaidh Bharti tea",
      seo_title: "Vatt Tea | Ayurvedic Vata Balancing Herbal Tea | Vaidh Bharti",
      meta_description: "Explore Vatt Tea by Vaidh Bharti. Soothing classical Ayurvedic herbal tea with Rasna, Ashwagandha & Shankhpushpi to balance Vata, calm nerves and ease stiffness.",
      short_description: "Classical Ayurvedic Vata-balancing herbal tea for calming nervous restlessness, stiff joints, and erratic digestion.",
      description: "According to Ayurveda, imbalance of Vata dosha is responsible for 80 distinct disorders including constipation, anxiety, restlessness of mind, and joint pains. Vatt Tea is formulated with Rasna, Ashwagandha, Sunthi, Shankhpushpi, Bala, and Elaichi to gently warm the system, ground the nervous energy, and promote peaceful digestion.",
      benefits: [
        "Pacifies aggravated Vata dosha and calms nervous tension",
        "Soothes joint stiffness, body aches and muscular spasms",
        "Promotes smooth digestion and relieves erratic bowel movement",
        "Caffeine-free therapeutic herbal infusion with Rasna & Ashwagandha",
      ],
      ingredients: "Pluchea lanceolata (Rasna), Terminalia arjuna, Piper longum (Pippali), Withania somnifera (Ashwagandha), Zingiber officinale (Sunthi), Sida cordifolia (Bala), Centella asiatica (Brahmi), Convolvulus pluricaulis (Shankhpushpi), Cinnamomum tamala (Tejpatta), Elettaria cardamomum (Elaichi), Syzygium aromaticum (Lavanga).",
      usage_instructions: "Boil 1/2 to 1 teaspoon (approx 3g) in 150-200ml water for 3-5 minutes until reduced. Strain and drink warm. Honey or a splash of warm milk may be added to taste. Take twice daily in morning and evening.",
      images: [
        "/assets/products/vatt-tea-front.png",
        "/assets/products/vatt-tea-back.png",
        "/assets/products/vatt-tea-banner.png",
      ],
      price: 368,
      mrp: 460,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: false,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "teas", name: "Herbal Teas" },
      variants: [{ id: "var-vatt-tea", label: "100 gm", price: 368, mrp: 460, stock: 50 }],
      rating: 4.9,
      review_count: 19,
    },
    {
      id: "prod-uder-shaant",
      slug: "uder-shaant-powder",
      name: "Uder Shaant Powder",
      sku: "VB-013",
      primary_keyword: "Uder Shaant Powder",
      secondary_keywords: "Uder Shaant Powder online, IBS relief churna, frequent toilet powder",
      seo_title: "Uder Shaant Powder | Sangrahani & IBS Relief | Vaidh Bharti",
      meta_description: "Explore Uder Shaant Powder by Vaidh Bharti. Proven classical Ayurvedic remedy for frequent toilet urgency, IBS, loose motions, and abdominal cramping.",
      short_description: "Classical Grahani & IBS churna for soothing hyperactive bowels, frequent loose stools, and abdominal cramps.",
      description: "Uder Shaant Powder is specially formulated for individuals struggling with frequent bowel urgency, loose stool frequency, irritable bowel symptoms (Sangrahani), and lower abdominal cramping. Crafted with potent intestinal astringents and digestive balancers like Bilva, Kutaj, Mustak, Dadim and Mochras, it restores normal stool consistency and calms intestinal inflammation.",
      benefits: [
        "Specially formulated for frequent toilet urgency and chronic loose bowels",
        "Calms intestinal inflammation, bowel cramping and Sangrahani / IBS",
        "Fortified with Kutaj, Bilva, Mustak and Dadim skin",
        "Restores healthy intestinal mucosal barrier and digestive peace",
      ],
      ingredients: "Kutaj Chaal, Bilva Giri (Bael fruit), Mustak (Nagarmotha), Mochras, Dadim Twak, Ativisha, Lodhra, Shunthi, Dhanyak, Jeerak per 100g.",
      usage_instructions: "Take 5 gm powder twice daily with lassi (buttermilk) or fresh curd after meals in morning and evening. Avoid oily, spicy, refined flour and stale foods during use.",
      images: [
        "/assets/products/uder-shaant-powder-front.png",
        "/assets/products/uder-shaant-powder-back.png",
        "/assets/products/uder-shaant-powder-banner.png",
      ],
      price: 1039,
      mrp: 1299,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: false,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-uder", label: "100 gm", price: 1039, mrp: 1299, stock: 50 }],
      rating: 4.9,
      review_count: 24,
    },
    {
      id: "prod-shahi-panch-gold-extra",
      slug: "shahi-panch-gold-extra",
      name: "Shahi Panch Gold Extra",
      sku: "VB-014",
      primary_keyword: "Shahi Panch Gold Extra",
      secondary_keywords: "Shahi Panch Gold capsules, Ayurvedic vitality medicine, Swarna Bhasma capsules",
      seo_title: "Shahi Panch Gold Extra Capsules (60 Caps) | Vaidh Bharti",
      meta_description: "Explore Shahi Panch Gold Extra Capsules by Vaidh Bharti. Premium Ayurvedic Rasayana with Swarna Bhasma, Shilajit & Ashwagandha in a 60-capsule pack.",
      short_description: "Premium Ayurvedic Rasayana & Vajikarana capsules fortified with Swarna Bhasma, Shilajit & Ashwagandha for elite vigor.",
      description: "Shahi Panch Gold Extra is the pinnacle classical Ayurvedic Rasayana and Vajikarana preparation in a premium 60-capsule pack. Formulated with Swarna Bhasma (Gold Calx), Shuddha Shilajit, Kesar, Ashwagandha, Safed Musli and Vang Bhasma, it replenishes depleted Ojas, enhances physical endurance, and restores youthfulness.",
      benefits: [
        "Premium Rasayana & Vajikarana formulation in 60-capsule pack",
        "Enriched with Swarna Bhasma, Shilajit, Ashwagandha and Kesar",
        "Promotes stamina, muscular endurance and rapid post-workout recovery",
        "Supports peak vitality and reproductive wellness",
      ],
      ingredients: "Swarna Bhasma, Shuddha Shilajit, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Akarkara, Jaiphal, Kesar, Vang Bhasma.",
      usage_instructions: "Take 1 capsule twice daily with warm milk or as directed by your Ayurvedic physician.",
      images: [
        "/assets/products/shahi-panch-gold-front.png",
        "/assets/products/shahi-panch-gold-banner.png",
      ],
      price: 1124,
      mrp: 1499,
      stock: 40,
      net_quantity: "60 Capsules",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "capsules", name: "Capsules" },
      variants: [{ id: "var-shahi-gold", label: "60 Capsules", price: 1124, mrp: 1499, stock: 40 }],
      rating: 4.9,
      review_count: 36,
    },
    {
      id: "prod-arshopanch",
      slug: "arshopanch-powder",
      name: "Arshopanch Powder",
      sku: "VB-015",
      primary_keyword: "Arshopanch Powder",
      secondary_keywords: "Arshopanch Powder online, piles churna, fissure fistula Ayurvedic medicine",
      seo_title: "Arshopanch Powder | Piles, Fissure & Fistula Relief | Vaidh Bharti",
      meta_description: "Explore Arshopanch Powder by Vaidh Bharti. Proven Ayurvedic churna for shrinking hemorrhoids, relieving fissure pain, and ending rectal bleeding.",
      short_description: "Targeted classical Ayurvedic Arshohara churna providing soothing relief from piles, fissures, and fistula discomfort.",
      description: "Arshopanch Powder is a specialized Ayurvedic proprietary medicine developed to treat both bleeding and non-bleeding hemorrhoids (Arsha), anal fissures (Parikartika), and fistulae (Bhagandara). Enriched with Suran (Jimikand), Nagkeshar, Neem Beej, Haritaki and Triphala Guggulu, it shrinks swollen venous piles mass, stops bleeding, and softens stools to eliminate straining.",
      benefits: [
        "Relieves pain, swelling, burning and bleeding associated with piles and fissures",
        "Promotes natural shrinkage of hemorrhoidal pile masses",
        "Encourages smooth, strain-free morning bowel evacuation",
        "Contains Suran, Nagkeshar, Neem Beej, Haritaki and Guggulu",
      ],
      ingredients: "Suran Kand (Amorphophallus campanulatus), Nagkeshar, Neem Beej, Bakayan Beej, Haritaki, Nishoth, Shuddha Guggulu, Rasont, Daruharidra, Chitrak.",
      usage_instructions: "Take 5 gm powder twice daily after meals with lassi (buttermilk) or curd in the morning and evening. Avoid garam masala, fried foods, pickles, red chilli, and stale food.",
      images: [
        "/assets/products/arshopanch-powder-front.png",
        "/assets/products/arshopanch-powder-back.png",
        "/assets/products/arshopanch-powder-banner.png",
      ],
      price: 959,
      mrp: 1199,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: false,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-arsho", label: "100 gm", price: 959, mrp: 1199, stock: 50 }],
      rating: 4.8,
      review_count: 28,
    },
    {
      id: "prod-pitt-tea",
      slug: "pitt-tea",
      name: "Pitt Tea",
      sku: "VB-016",
      primary_keyword: "Pitt Tea",
      secondary_keywords: "Pitt Tea online, Pitta balancing tea, cooling Ayurvedic tea, Pitt shanti tea",
      seo_title: "Pitt Tea | Cooling Pitta Balancing Herbal Tea | Vaidh Bharti",
      meta_description: "Explore Pitt Tea by Vaidh Bharti. Soothing herbal blend with Giloy, Saunf, Dhaniya, Amla & Shankhpushpi to cool Pitta heat, acidity, and heartburn.",
      short_description: "Cooling Ayurvedic Pitta-balancing herbal tea for soothing hyperacidity, internal body heat, and fiery skin flare-ups.",
      description: "Pitt Tea (पित्त चाय) is an authentic cooling herbal brew formulated for individuals with aggravated Pitta dosha. Featuring botanical refrigerants like Giloy, Saunf, Dhaniya, Amla, Shankhpushpi, Brahmi, and Gulab, it cools internal thermal excess, eases sour belching and heartburn, and promotes a serene, balanced mind.",
      benefits: [
        "Pacifies aggravated Pitta dosha and reduces internal metabolic heat",
        "Relieves acidity, heartburn, sour throat and hot sensations in palms/soles",
        "Enriched with Giloy, Saunf, Dhaniya, Amla, Shankhpushpi & Gulab",
        "Refreshes and clears the complexion from heat-induced flare-ups",
      ],
      ingredients: "Tinospora cordifolia (Giloy, 15g), Foeniculum vulgare (Saunf, 15g), Emblica officinalis (Amla, 10g), Rosa centifolia (Gulab, 10g), Coriandrum sativum (Dhaniya, 10g), Convolvulus pluricaulis (Shankhpushpi, 10g), Centella asiatica (Brahmi, 10g), Tribulus terrestris (Gokshura, 5g), Adhatoda vasica (Vasa, 5g), Glycyrrhiza glabra (Mulethi, 5g), Elettaria cardamomum (Elaichi, 2.5g), Syzygium aromaticum (Lavanga, 2.5g) per 100g.",
      usage_instructions: "Take 1 spoon of tea and mix with 200ml water. Boil until the quantity reduces to half. Strain and drink lukewarm. Honey or a little warm milk may be added to taste. Take twice daily in morning and evening.",
      images: [
        "/assets/products/pitt-tea-front.png",
        "/assets/products/pitt-tea-back.png",
        "/assets/products/pitt-tea-banner.png",
      ],
      price: 368,
      mrp: 460,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "teas", name: "Herbal Teas" },
      variants: [{ id: "var-pitt-tea", label: "100 gm", price: 368, mrp: 460, stock: 50 }],
      rating: 4.8,
      review_count: 17,
    },
    {
      id: "prod-arogya-tea",
      slug: "arogya-tea",
      name: "Arogya Tea",
      sku: "VB-017",
      primary_keyword: "Arogya Tea",
      secondary_keywords: "Arogya Tea online, daily Ayurvedic tea, immunity rejuvenation herbal tea",
      seo_title: "Arogya Tea | Everyday Ayurvedic Rejuvenation Tea | Vaidh Bharti",
      meta_description: "Explore Arogya Tea by Vaidh Bharti. 19 sacred herbs including Arjuna, Mulethi, Tulsi & Brahmi for daily vitality, cardiovascular wellness and immunity.",
      short_description: "Everyday Ayurvedic wellness & Tridosha rejuvenation herbal tea with Arjuna, Mulethi, Tulsi and Brahmi for vitality.",
      description: "Arogya Tea is a master herbal formulation designed for daily holistic health, hormonal balance, and deep cellular detoxification. Blended with 19 sacred botanicals including Terminalia arjuna (heart tonic), Mulethi, Haldi, Brahmi, Tulsi, and Anantmool, it strengthens natural immunity, aids cardiovascular rhythm, and uplifts daily spirit.",
      benefits: [
        "Tridosha balancing blend for daily vitality and disease prevention",
        "Cardiovascular and micro-circulatory support with Terminalia arjuna (25g)",
        "Balances hormones and supports calm mental clarity with Brahmi & Tulsi",
        "Antioxidant-rich herbal blend with Haldi, Sunthi, Amla & Mulethi",
      ],
      ingredients: "Terminalia arjuna (25g), Glycyrrhiza glabra [Mulethi] (10g), Foeniculum vulgare [Saunf] (8g), Zingiber officinale [Sunthi] (7g), Curcuma longa [Haldi] (6g), Cinnamomum tamala [Tejpatta] (6g), Sida cordifolia [Bala] (5g), Bacopa monnieri [Brahmi] (5g), Cinnamomum zeylanicum [Dalchini] (4g), Hemidesmus indicus [Anantmool] (4g), Emblica officinalis [Amla] (4g), Ocimum sanctum [Tulsi] (3g), Piper nigrum [Kali Mirch] (3g), Rosa centifolia [Gulab] (2g), Piper longum [Pippali] (2g), Alpinia galanga [Kulanjan] (2g), Elettaria cardamomum [Elaichi] (2g), Piper cubeba (1g), Syzygium aromaticum (1g) per 100g.",
      usage_instructions: "Add a pinch (approx 2-3g) of Arogya Tea to boiling water (150-200ml). Let it steep for 5-7 minutes. Strain and enjoy warm twice daily in the morning and evening.",
      images: [
        "/assets/products/arogya-tea-front.png",
        "/assets/products/arogya-tea-back.png",
        "/assets/products/arogya-tea-banner.png",
      ],
      price: 368,
      mrp: 460,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "teas", name: "Herbal Teas" },
      variants: [{ id: "var-arogya-tea", label: "100 gm", price: 368, mrp: 460, stock: 50 }],
      rating: 4.9,
      review_count: 31,
    },
    {
      id: "prod-kapha-tea",
      slug: "kapha-tea",
      name: "Kapha Tea",
      sku: "VB-018",
      primary_keyword: "Kapha Tea",
      secondary_keywords: "Kapha Tea online, Kapha balancing herbal tea, respiratory congestion tea",
      seo_title: "Kapha Tea | Invigorating Ayurvedic Respiratory Tea | Vaidh Bharti",
      meta_description: "Explore Kapha Tea by Vaidh Bharti. Potent Trikatu and herbal blend with Sunthi, Pippali, Baheda & Lavanga to clear congestion and kindle sluggish metabolism.",
      short_description: "Invigorating Ayurvedic Kapha-clearing herbal tea for respiratory clarity, sluggish metabolism, and excess congestion.",
      description: "Kapha Tea (कफ चाय) is an invigorating herbal brew designed to clear deep-seated mucus, stimulate sluggish metabolism, and disperse lethargy. Featuring classical Trikatu herbs (Sunthi, Pippali, Kali Mirch) combined with Baheda, Amla, Mulethi, Dalchini, and Lavanga, it expands the bronchial passages, aids digestion of heavy meals, and warms cold tissues.",
      benefits: [
        "Clears heavy congestion from throat, chest, and nasal passages",
        "Kindles sluggish digestive fire (Manda Agni) and accelerates metabolism",
        "Formulated with Trikatu (Pippali, Sunthi, Kali Mirch), Baheda & Mulethi",
        "Dispels morning lethargy and heaviness without caffeine crashes",
      ],
      ingredients: "Zingiber officinalis [Sunthi] (15g), Piper longum [Pippali] (15g), Terminalia belirica [Baheda] (15g), Emblica officinalis [Amla] (10g), Rosa cordifolia [Manjistha/Gulab] (10g), Syzygium aromaticum [Lavanga] (10g), Piper nigrum [Kali Mirch] (5g), Glycyrrhiza glabra [Mulethi] (5g), Cinnamomum tamala [Tejpatta] (5g), Cinnamomum zeylanicum [Dalchini] (5g), Elettaria cardamomum [Elaichi] (2.5g) per 100g.",
      usage_instructions: "Take 1 spoon of tea and mix with 200ml water. Boil until the quantity reduces to half. Strain and drink lukewarm. Honey or a little warm milk may be added to taste. Take twice daily in morning and evening.",
      images: [
        "/assets/products/kapha-tea-front.png",
        "/assets/products/kapha-tea-back.png",
        "/assets/products/kapha-tea-banner.png",
      ],
      price: 368,
      mrp: 460,
      stock: 50,
      net_quantity: "100 gm",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "teas", name: "Herbal Teas" },
      variants: [{ id: "var-kapha-tea", label: "100 gm", price: 368, mrp: 460, stock: 50 }],
      rating: 4.8,
      review_count: 21,
    },
  ];
}

export function getFallbackCategories(): CategoryDTO[] {
  return [
    { id: "cat-1", slug: "powders", name: "Powders", description: "Classical Ayurvedic churnas & powders", image_url: "/assets/products/panch-fresh-powder-front.png" },
    { id: "cat-2", slug: "oils", name: "Oils", description: "Herbal hair & Nabhi wellness oils", image_url: "/assets/products/red-onion-hair-oil-front.png" },
    { id: "cat-3", slug: "shilajit", name: "Shilajit", description: "Pure Himalayan Suryatapi Shilajit resin", image_url: "/assets/products/shilajit-front.png" },
    { id: "cat-4", slug: "capsules", name: "Capsules", description: "Classical Ayurvedic herbs & Rasayana capsules", image_url: "/assets/products/shahi-panch-gold-front.png" },
    { id: "cat-5", slug: "teas", name: "Herbal Teas", description: "Therapeutic Tridosha balancing Ayurvedic herbal teas", image_url: "/assets/products/arogya-tea-front.png" },
  ];
}

export const listCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const fallbackProducts = getFallbackProducts();
  const fallbackCategories = getFallbackCategories();

  try {
    const { publicClient } = await import("./supabase-public.server");
    const supabase = publicClient();

    const [catRes, prodRes, reviewRowsRes] = await Promise.all([
      supabase.from("categories").select("id,slug,name,description,image_url").eq("is_active", true).order("sort_order"),
      supabase.from("products").select(PRODUCT_COLS).eq("is_active", true).order("sort_order"),
      supabase.from("reviews").select("product_id,rating").eq("status", "approved"),
    ]);

    const dbProducts = (prodRes.data ?? []).map(toProduct);
    const dbCategories: CategoryDTO[] = (catRes.data ?? []).map((c: any) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      image_url: c.image_url,
    }));

    const activeProducts = dbProducts.length > 0 ? dbProducts : fallbackProducts;
    const activeCategories = dbCategories.length > 0 ? dbCategories : fallbackCategories;

    const reviewRows = reviewRowsRes.data ?? [];
    const productsWithRatings =
      reviewRows && reviewRows.length > 0
        ? withRatings(activeProducts, reviewRows as { product_id: string; rating: number }[])
        : activeProducts;

    return {
      categories: activeCategories,
      products: productsWithRatings,
    };
  } catch (err) {
    console.warn("Catalog fetch failed, using fallback:", err);
    return {
      categories: fallbackCategories,
      products: fallbackProducts,
    };
  }
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const slugAliases: Record<string, string> = {
      "pit-shanti-powder-2": "pit-shanti-powder",
      "himalayan-suryatapi-pure-shilajit": "shilajit",
      "shakti-panch-gold-extra": "shahi-panch-gold-extra",
      "shahi-panch-gold": "shahi-panch-gold-extra",
      "shahi-punch-powder": "shahi-panch-powder",
      "shahi-punch": "shahi-panch-24x7",
      "pit-tea": "pitt-tea",
      "vata-tea": "vatt-tea",
    };
    const targetSlug = slugAliases[data.slug] ?? data.slug;
    const allFallback = getFallbackProducts();
    let product: ProductDTO | null = null;
    let related: ProductDTO[] = [];

    try {
      const { publicClient } = await import("./supabase-public.server");
      const supabase = publicClient();

      const { data: dbProductRow } = await supabase
        .from("products")
        .select(PRODUCT_COLS)
        .eq("slug", targetSlug)
        .eq("is_active", true)
        .maybeSingle();

      if (dbProductRow) {
        product = toProduct(dbProductRow);
        const { data: relatedRows } = await supabase
          .from("products")
          .select(PRODUCT_COLS)
          .neq("slug", targetSlug)
          .eq("is_active", true)
          .limit(4);
        if (relatedRows && relatedRows.length > 0) {
          related = relatedRows.map(toProduct);
        }
      }
    } catch (err) {
      console.warn("Could not query product from DB:", err);
    }

    if (!product) {
      product = allFallback.find((p) => p.slug === targetSlug) ?? null;
      if (!product) return null;
      if (related.length === 0) {
        related = allFallback.filter((p) => p.slug !== product!.slug).slice(0, 4);
      }
    }

    try {
      const { publicClient } = await import("./supabase-public.server");
      const supabase = publicClient();
      const [reviewsRes, faqRes] = await Promise.all([
        supabase
          .from("reviews")
          .select("id,author_name,rating,title,body,created_at")
          .eq("product_id", product.id)
          .eq("status", "approved")
          .order("created_at", { ascending: false }),
        supabase
          .from("product_faqs")
          .select("id,question,answer")
          .eq("product_id", product.id)
          .eq("is_published", true)
          .order("sort_order"),
      ]);
      const dbReviews = (reviewsRes.data ?? []) as any[];
      const dbFaqs = (faqRes.data ?? []) as any[];

      const reviews = dbReviews.length
        ? dbReviews
        : [
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
          ];

      const faqs = dbFaqs.length
        ? dbFaqs
        : [
            {
              id: "faq-1",
              question: "How should I use this preparation?",
              answer: product.usage_instructions || "Use as directed on the packaging or consult Vaidh Bharti.",
            },
            {
              id: "faq-2",
              question: "Is this 100% natural and Ayurvedic?",
              answer:
                "Yes, all our formulations are prepared strictly adhering to classical Ayurvedic references without harsh synthetic additives.",
            },
          ];

      const rated = reviews.length
        ? {
            ...product,
            rating: reviews.reduce((a, r) => a + r.rating, 0) / reviews.length,
            review_count: reviews.length,
          }
        : product;

      return {
        product: rated,
        reviews,
        related,
        faqs,
      };
    } catch (err) {
      return {
        product,
        reviews: [],
        related,
        faqs: [],
      };
    }
  });

export const seedCatalogToDatabase = createServerFn({ method: "POST" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const categories = getFallbackCategories();
    const products = getFallbackProducts();

    const categoryMap = new Map<string, string>();
    for (const c of categories) {
      const { data: existing } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", c.slug)
        .maybeSingle();

      if (existing) {
        categoryMap.set(c.slug, existing.id);
      } else {
        const { data: inserted } = await supabaseAdmin
          .from("categories")
          .insert({
            slug: c.slug,
            name: c.name,
            description: c.description,
            image_url: c.image_url,
            is_active: true,
          })
          .select("id")
          .single();
        if (inserted) categoryMap.set(c.slug, inserted.id);
      }
    }

    let seededCount = 0;
    for (const p of products) {
      const catId = p.category ? categoryMap.get(p.category.slug) ?? null : null;
      const { data: existing } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("slug", p.slug)
        .maybeSingle();

      let prodId: string;
      if (existing) {
        prodId = existing.id;
        await supabaseAdmin
          .from("products")
          .update({
            name: p.name,
            sku: p.sku ?? null,
            short_description: p.short_description,
            description: p.description,
            benefits: p.benefits,
            ingredients: p.ingredients,
            usage_instructions: p.usage_instructions,
            images: p.images,
            price: p.price,
            mrp: p.mrp,
            stock: p.stock,
            net_quantity: p.net_quantity,
            is_featured: p.is_featured,
            is_best_seller: p.is_best_seller,
            is_new_arrival: p.is_new_arrival,
            category_id: catId,
            seo_title: p.seo_title ?? null,
            seo_description: p.meta_description ?? null,
            is_active: true,
          })
          .eq("id", prodId);
      } else {
        const { data: inserted } = await supabaseAdmin
          .from("products")
          .insert({
            slug: p.slug,
            name: p.name,
            sku: p.sku ?? null,
            short_description: p.short_description,
            description: p.description,
            benefits: p.benefits,
            ingredients: p.ingredients,
            usage_instructions: p.usage_instructions,
            images: p.images,
            price: p.price,
            mrp: p.mrp,
            stock: p.stock,
            net_quantity: p.net_quantity,
            is_featured: p.is_featured,
            is_best_seller: p.is_best_seller,
            is_new_arrival: p.is_new_arrival,
            category_id: catId,
            seo_title: p.seo_title ?? null,
            seo_description: p.meta_description ?? null,
            is_active: true,
          })
          .select("id")
          .single();
        if (inserted) prodId = inserted.id;
        else continue;
      }

      // Upsert variants
      for (const v of p.variants) {
        const { data: existVar } = await supabaseAdmin
          .from("product_variants")
          .select("id")
          .eq("product_id", prodId)
          .eq("label", v.label)
          .maybeSingle();

        if (!existVar) {
          await supabaseAdmin.from("product_variants").insert({
            product_id: prodId,
            label: v.label,
            price: v.price,
            mrp: v.mrp,
            stock: v.stock,
          });
        }
      }
      seededCount++;
    }

    return { success: true, count: seededCount };
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
