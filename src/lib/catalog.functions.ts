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
      id: "prod-1",
      slug: "red-onion-hair-oil",
      name: "Red Onion Hair Oil",
      short_description: "Non-sticky, non-greasy hair oil for glossy and strong hair.",
      description:
        "Vaidh Bharti Red Onion Hair Oil is an Ayurvedic proprietary preparation for external use on the hair and scalp, made in a non-sticky, non-greasy base.",
      benefits: [
        "Intended for regular external hair and scalp care",
        "Non-sticky, non-greasy base",
        "Ayurvedic proprietary medicine, for external use only",
      ],
      ingredients: "Herbal hair oil with red onion. Full ingredient list is printed on the product label.",
      usage_instructions: "Apply to scalp and hair, massage gently and leave for the time advised on label. External use only.",
      images: ["/assets/prod-oils.png"],
      price: 499,
      mrp: 699,
      stock: 50,
      net_quantity: "200 ml",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "oils", name: "Oils" },
      variants: [{ id: "var-1", label: "200 ml", price: 499, mrp: 699, stock: 50 }],
      rating: 4.8,
      review_count: 24,
    },
    {
      id: "prod-2",
      slug: "uder-shaant-powder",
      name: "Uder Shaant Powder",
      short_description: "Traditional Ayurvedic churna intended to support digestive comfort.",
      description:
        "Uder Shaant Powder is a traditional Ayurvedic churna prepared from classically processed herbs, intended to be taken as part of a personalized plan.",
      benefits: [
        "Traditional churna preparation",
        "Simple to include in a daily routine",
        "Best used under practitioner guidance",
      ],
      ingredients: "Classically processed Ayurvedic herbs. The full ingredient list is printed on the product label.",
      usage_instructions: "Take as advised by your Ayurvedic practitioner, usually with warm water.",
      images: ["/assets/prod-powder.png"],
      price: 399,
      mrp: 499,
      stock: 40,
      net_quantity: "100 g",
      is_featured: true,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "powders", name: "Powders" },
      variants: [{ id: "var-2", label: "100 g", price: 399, mrp: 499, stock: 40 }],
      rating: 4.9,
      review_count: 18,
    },
    {
      id: "prod-3",
      slug: "himalayan-suryatapi-pure-shilajit",
      name: "Himalayan Suryatapi Pure Shilajit",
      short_description: "Purified Shilajit resin sourced from Himalayan rocks.",
      description:
        "Himalayan Suryatapi Pure Shilajit is a purified and filtered Shilajit resin, a substance long used in Ayurveda as a Rasayana, supplied for traditional use in small quantities.",
      benefits: [
        "Purified and filtered resin",
        "Classical Rasayana substance in Ayurveda",
        "A small quantity is used at a time, as directed",
      ],
      ingredients: "Purified Shilajit resin. Full details are printed on the product label.",
      usage_instructions: "Dissolve a small quantity (pea-sized) in warm water or milk. Use only as directed.",
      images: ["/assets/prod-shilajit.png"],
      price: 999,
      mrp: 1499,
      stock: 35,
      net_quantity: "20 g",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: true,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "shilajit", name: "Shilajit" },
      variants: [{ id: "var-3", label: "20 g resin", price: 999, mrp: 1499, stock: 35 }],
      rating: 5.0,
      review_count: 42,
    },
    {
      id: "prod-4",
      slug: "shakti-panch-gold-extra",
      name: "Shakti Panch Gold Extra",
      short_description: "Ayurvedic medicine in convenient capsule form.",
      description:
        "Shakti Panch Gold Extra is an Ayurvedic preparation presented in capsule form, intended to be used as part of a personalized Ayurvedic plan.",
      benefits: [
        "Convenient capsule format",
        "Measured, consistent quantity",
        "Best used under practitioner guidance",
      ],
      ingredients: "Ayurvedic herbal ingredients. The full ingredient list is printed on the product label.",
      usage_instructions: "Take as advised by your Ayurvedic practitioner.",
      images: ["/assets/prod-capsules.png"],
      price: 699,
      mrp: 899,
      stock: 45,
      net_quantity: "60 Capsules",
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "capsules", name: "Capsules" },
      variants: [{ id: "var-4", label: "60 Capsules", price: 699, mrp: 899, stock: 45 }],
      rating: 4.7,
      review_count: 31,
    },
    {
      id: "prod-5",
      slug: "saffron-herbal-cream",
      name: "Saffron Herbal Cream",
      short_description: "Herbal cream with saffron for daily external skin care.",
      description:
        "Vaidh Bharti Saffron Herbal Cream is a herbal skin care preparation enriched with saffron and herbal ingredients, intended for gentle external use as part of a daily routine.",
      benefits: [
        "Gentle herbal preparation with saffron",
        "For external daily skin care",
        "Made in the Ayurvedic tradition",
      ],
      ingredients:
        "Saffron with a herbal skin-care base including coconut, almond, jojoba and lotus derived ingredients. Full details on product label.",
      usage_instructions: "Apply a small amount to clean skin and massage gently. Discontinue if irritation occurs.",
      images: ["/assets/prod-skin.png"],
      price: 549,
      mrp: 749,
      stock: 30,
      net_quantity: "50 g",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      subscription_available: false,
      subscription_discount_pct: 0,
      category: { slug: "skin-care", name: "Skin Care" },
      variants: [{ id: "var-5", label: "50 g", price: 549, mrp: 749, stock: 30 }],
      rating: 4.9,
      review_count: 15,
    },
  ];
}

export function getFallbackCategories(): CategoryDTO[] {
  return [
    { id: "cat-1", slug: "oils", name: "Oils", description: "Ayurvedic herbal oils", image_url: "/assets/prod-oils.png" },
    { id: "cat-2", slug: "powders", name: "Powders", description: "Classical churnas & powders", image_url: "/assets/prod-powder.png" },
    { id: "cat-3", slug: "shilajit", name: "Shilajit", description: "Pure Himalayan Shilajit resin", image_url: "/assets/prod-shilajit.png" },
    { id: "cat-4", slug: "capsules", name: "Capsules", description: "Ayurvedic herbs in capsules", image_url: "/assets/prod-capsules.png" },
    { id: "cat-5", slug: "skin-care", name: "Skin Care", description: "Herbal skin and beauty care", image_url: "/assets/prod-skin.png" },
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
    const product = all.find((p) => p.slug === data.slug);
    if (!product) return null;

    const related = all.filter((p) => p.slug !== data.slug).slice(0, 4);
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
