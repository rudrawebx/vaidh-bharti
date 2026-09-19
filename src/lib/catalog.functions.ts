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

export const listCatalog = createServerFn({ method: "GET" }).handler(async () => {
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
  return {
    categories: (cats.data ?? []) as CategoryDTO[],
    products: withRatings((prods.data ?? []).map(toProduct), (reviewRows ?? []) as { product_id: string; rating: number }[]),
  };
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { publicClient } = await import("./supabase-public.server");
    const supabase = publicClient();
    const { data: row } = await supabase
      .from("products")
      .select(PRODUCT_COLS)
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (!row) return null;
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
