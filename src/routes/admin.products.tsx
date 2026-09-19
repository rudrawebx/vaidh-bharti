import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/site";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

type Variant = { id?: string; label: string; price: string; mrp: string; stock: string };
type Faq = { id?: string; question: string; answer: string };

type Draft = {
  id?: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  benefits: string;
  ingredients: string;
  usage_instructions: string;
  price: string;
  mrp: string;
  stock: string;
  sku: string;
  net_quantity: string;
  category_id: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  subscription_available: boolean;
  subscription_discount_pct: string;
  seo_title: string;
  seo_description: string;
  sort_order: string;
};

const empty: Draft = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  benefits: "",
  ingredients: "",
  usage_instructions: "",
  price: "",
  mrp: "",
  stock: "0",
  sku: "",
  net_quantity: "",
  category_id: "",
  images: [],
  is_active: true,
  is_featured: false,
  is_best_seller: false,
  is_new_arrival: false,
  subscription_available: false,
  subscription_discount_pct: "0",
  seo_title: "",
  seo_description: "",
  sort_order: "0",
};

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
const field = "mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm";
const area = "mt-2 w-full rounded-sm border border-input bg-card p-3 text-sm";
const label = "text-[11px] uppercase tracking-[0.16em] text-muted-foreground";
const btn = "rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60";
const ghost = "rounded-sm border border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]";

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}

function AdminProducts() {
  const [draft, setDraft] = React.useState<Draft>(empty);
  const [variants, setVariants] = React.useState<Variant[]>([]);
  const [removedVariants, setRemovedVariants] = React.useState<string[]>([]);
  const [faqs, setFaqs] = React.useState<Faq[]>([]);
  const [removedFaqs, setRemovedFaqs] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const categories = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => (await supabase.from("categories").select("id,name").order("name")).data ?? [],
  });

  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () =>
      (
        await supabase
          .from("products")
          .select(
            "id,name,slug,short_description,description,benefits,ingredients,usage_instructions,price,mrp,stock,sku,net_quantity,category_id,images,is_active,is_featured,is_best_seller,is_new_arrival,subscription_available,subscription_discount_pct,seo_title,seo_description,sort_order,product_variants(id,label,price,mrp,stock,sort_order)",
          )
          .order("sort_order")
          .order("name")
      ).data ?? [],
  });

  const reset = () => {
    setDraft(empty);
    setVariants([]);
    setFaqs([]);
    setRemovedVariants([]);
    setRemovedFaqs([]);
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files).slice(0, 6)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5 MB.`);
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type });
      if (error) {
        toast.error(`Could not upload ${file.name}.`);
        continue;
      }
      const { data: signed } = await supabase.storage.from("product-images").createSignedUrl(path, TEN_YEARS);
      if (signed?.signedUrl) urls.push(signed.signedUrl);
    }
    setUploading(false);
    if (urls.length) {
      setDraft((d) => ({ ...d, images: [...d.images, ...urls].slice(0, 8) }));
      toast.success(`${urls.length} photo${urls.length === 1 ? "" : "s"} added.`);
    }
  };

  const editProduct = async (p: any) => {
    setDraft({
      id: p.id,
      name: p.name,
      slug: p.slug,
      short_description: p.short_description ?? "",
      description: p.description ?? "",
      benefits: (p.benefits ?? []).join("\n"),
      ingredients: p.ingredients ?? "",
      usage_instructions: p.usage_instructions ?? "",
      price: p.price === null ? "" : String(p.price),
      mrp: p.mrp === null ? "" : String(p.mrp),
      stock: String(p.stock ?? 0),
      sku: p.sku ?? "",
      net_quantity: p.net_quantity ?? "",
      category_id: p.category_id ?? "",
      images: p.images ?? [],
      is_active: !!p.is_active,
      is_featured: !!p.is_featured,
      is_best_seller: !!p.is_best_seller,
      is_new_arrival: !!p.is_new_arrival,
      subscription_available: !!p.subscription_available,
      subscription_discount_pct: String(p.subscription_discount_pct ?? 0),
      seo_title: p.seo_title ?? "",
      seo_description: p.seo_description ?? "",
      sort_order: String(p.sort_order ?? 0),
    });
    setVariants(
      (p.product_variants ?? [])
        .slice()
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((v: any) => ({ id: v.id, label: v.label, price: String(v.price), mrp: v.mrp === null ? "" : String(v.mrp), stock: String(v.stock ?? 0) })),
    );
    const { data: faqRows } = await supabase
      .from("product_faqs")
      .select("id,question,answer")
      .eq("product_id", p.id)
      .order("sort_order");
    setFaqs((faqRows ?? []).map((f) => ({ id: f.id, question: f.question, answer: f.answer })));
    setRemovedVariants([]);
    setRemovedFaqs([]);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.name.trim().length < 2) {
      toast.error("Please enter a product name.");
      return;
    }
    setSaving(true);
    const row = {
      name: draft.name.trim().slice(0, 120),
      slug: slugify(draft.slug || draft.name),
      short_description: draft.short_description.trim().slice(0, 300) || null,
      description: draft.description.trim().slice(0, 6000) || null,
      benefits: draft.benefits.split("\n").map((b) => b.trim()).filter(Boolean).slice(0, 12),
      ingredients: draft.ingredients.trim().slice(0, 2000) || null,
      usage_instructions: draft.usage_instructions.trim().slice(0, 2000) || null,
      price: draft.price.trim() === "" ? null : Number(draft.price),
      mrp: draft.mrp.trim() === "" ? null : Number(draft.mrp),
      stock: Number(draft.stock) || 0,
      sku: draft.sku.trim() || null,
      net_quantity: draft.net_quantity.trim() || null,
      category_id: draft.category_id || null,
      images: draft.images,
      is_active: draft.is_active,
      is_featured: draft.is_featured,
      is_best_seller: draft.is_best_seller,
      is_new_arrival: draft.is_new_arrival,
      subscription_available: draft.subscription_available,
      subscription_discount_pct: Number(draft.subscription_discount_pct) || 0,
      seo_title: draft.seo_title.trim().slice(0, 70) || null,
      seo_description: draft.seo_description.trim().slice(0, 170) || null,
      sort_order: Number(draft.sort_order) || 0,
    };

    const res = draft.id
      ? await supabase.from("products").update(row).eq("id", draft.id).select("id").single()
      : await supabase.from("products").insert(row).select("id").single();

    if (res.error || !res.data) {
      setSaving(false);
      toast.error(res.error?.message?.includes("duplicate") ? "That web address is already used." : "Could not save the product.");
      return;
    }
    const productId = res.data.id;

    if (removedVariants.length) await supabase.from("product_variants").delete().in("id", removedVariants);
    for (const [i, v] of variants.entries()) {
      if (!v.label.trim()) continue;
      const vRow = {
        product_id: productId,
        label: v.label.trim().slice(0, 60),
        price: Number(v.price) || 0,
        mrp: v.mrp.trim() === "" ? null : Number(v.mrp),
        stock: Number(v.stock) || 0,
        sort_order: i,
      };
      if (v.id) await supabase.from("product_variants").update(vRow).eq("id", v.id);
      else await supabase.from("product_variants").insert(vRow);
    }

    if (removedFaqs.length) await supabase.from("product_faqs").delete().in("id", removedFaqs);
    for (const [i, f] of faqs.entries()) {
      if (!f.question.trim() || !f.answer.trim()) continue;
      const fRow = {
        product_id: productId,
        question: f.question.trim().slice(0, 200),
        answer: f.answer.trim().slice(0, 1200),
        sort_order: i,
        is_published: true,
      };
      if (f.id) await supabase.from("product_faqs").update(fRow).eq("id", f.id);
      else await supabase.from("product_faqs").insert(fRow);
    }

    setSaving(false);
    toast.success(draft.id ? "Product updated." : "Product added.");
    reset();
    void products.refetch();
  };

  const removeProduct = async (id: string, name: string) => {
    if (!window.confirm(`Delete “${name}” permanently? Past orders keep their record.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("This product is linked to existing orders, so it cannot be deleted. Hide it instead.");
    else {
      toast.success("Product deleted.");
      if (draft.id === id) reset();
    }
    void products.refetch();
  };

  const list = (products.data ?? []).filter((p: any) =>
    search.trim() ? `${p.name} ${p.slug} ${p.sku ?? ""}`.toLowerCase().includes(search.trim().toLowerCase()) : true,
  );

  const flag = (key: keyof Draft, text: string) => (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={Boolean(draft[key])} onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.checked }))} />
      {text}
    </label>
  );

  return (
    <div className="grid gap-10 xl:grid-cols-[1fr_1fr]">
      <form ref={formRef} onSubmit={save} className="space-y-5 border border-border p-6">
        <h2 className="font-display text-2xl">{draft.id ? "Edit product" : "Add product"}</h2>

        <div>
          <label className={label} htmlFor="p-name">Name</label>
          <input id="p-name" className={field} value={draft.name} maxLength={120}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value, slug: d.id ? d.slug : slugify(e.target.value) }))} />
        </div>
        <div>
          <label className={label} htmlFor="p-slug">Web address</label>
          <input id="p-slug" className={field} value={draft.slug} maxLength={120} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} />
        </div>
        <div>
          <label className={label} htmlFor="p-short">Short description</label>
          <input id="p-short" className={field} value={draft.short_description} maxLength={300} onChange={(e) => setDraft((d) => ({ ...d, short_description: e.target.value }))} />
        </div>
        <div>
          <label className={label} htmlFor="p-desc">Full description</label>
          <textarea id="p-desc" rows={5} maxLength={6000} className={area} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
        </div>
        <div>
          <label className={label} htmlFor="p-ben">Key benefits (one per line)</label>
          <textarea id="p-ben" rows={4} className={area} value={draft.benefits} onChange={(e) => setDraft((d) => ({ ...d, benefits: e.target.value }))} />
        </div>
        <div>
          <label className={label} htmlFor="p-ing">Ingredients</label>
          <textarea id="p-ing" rows={3} className={area} value={draft.ingredients} onChange={(e) => setDraft((d) => ({ ...d, ingredients: e.target.value }))} />
        </div>
        <div>
          <label className={label} htmlFor="p-use">How to use</label>
          <textarea id="p-use" rows={3} className={area} value={draft.usage_instructions} onChange={(e) => setDraft((d) => ({ ...d, usage_instructions: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="p-price">Selling price (₹)</label>
            <input id="p-price" type="number" min="0" step="1" className={field} value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} />
          </div>
          <div>
            <label className={label} htmlFor="p-mrp">MRP (₹)</label>
            <input id="p-mrp" type="number" min="0" step="1" className={field} value={draft.mrp} onChange={(e) => setDraft((d) => ({ ...d, mrp: e.target.value }))} />
          </div>
          <div>
            <label className={label} htmlFor="p-stock">Stock</label>
            <input id="p-stock" type="number" min="0" className={field} value={draft.stock} onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))} />
          </div>
          <div>
            <label className={label} htmlFor="p-sku">SKU</label>
            <input id="p-sku" className={field} value={draft.sku} maxLength={40} onChange={(e) => setDraft((d) => ({ ...d, sku: e.target.value }))} />
          </div>
          <div>
            <label className={label} htmlFor="p-net">Net quantity</label>
            <input id="p-net" className={field} placeholder="e.g. 100 g" value={draft.net_quantity} maxLength={40} onChange={(e) => setDraft((d) => ({ ...d, net_quantity: e.target.value }))} />
          </div>
          <div>
            <label className={label} htmlFor="p-order">Display order</label>
            <input id="p-order" type="number" className={field} value={draft.sort_order} onChange={(e) => setDraft((d) => ({ ...d, sort_order: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="p-cat">Category</label>
          <select id="p-cat" className={field} value={draft.category_id} onChange={(e) => setDraft((d) => ({ ...d, category_id: e.target.value }))}>
            <option value="">Uncategorised</option>
            {categories.data?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <span className={label}>Photos</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {draft.images.map((src, i) => (
              <div key={src} className="relative h-24 w-24 overflow-hidden rounded-sm border border-border">
                <img src={src} alt={`Product photo ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label={`Remove photo ${i + 1}`}
                  onClick={() => setDraft((d) => ({ ...d, images: d.images.filter((x) => x !== src) }))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-sm border border-dashed border-border text-center text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <span className="flex flex-col items-center gap-1">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : "Upload"}
              </span>
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => void uploadImages(e.target.files)} />
            </label>
          </div>
          <input
            className={field}
            placeholder="Or paste an image link and press Enter"
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              const v = (e.target as HTMLInputElement).value.trim();
              if (!v) return;
              setDraft((d) => ({ ...d, images: [...d.images, v].slice(0, 8) }));
              (e.target as HTMLInputElement).value = "";
            }}
          />
        </div>

        <fieldset className="space-y-2 border border-border p-4">
          <legend className={label}>Pack sizes</legend>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] items-center gap-2">
              <input aria-label="Pack label" placeholder="100 g" className="h-11 rounded-sm border border-input bg-card px-2 text-sm" value={v.label}
                onChange={(e) => setVariants((p) => p.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <input aria-label="Pack price" type="number" placeholder="Price" className="h-11 rounded-sm border border-input bg-card px-2 text-sm" value={v.price}
                onChange={(e) => setVariants((p) => p.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} />
              <input aria-label="Pack MRP" type="number" placeholder="MRP" className="h-11 rounded-sm border border-input bg-card px-2 text-sm" value={v.mrp}
                onChange={(e) => setVariants((p) => p.map((x, j) => (j === i ? { ...x, mrp: e.target.value } : x)))} />
              <input aria-label="Pack stock" type="number" placeholder="Stock" className="h-11 rounded-sm border border-input bg-card px-2 text-sm" value={v.stock}
                onChange={(e) => setVariants((p) => p.map((x, j) => (j === i ? { ...x, stock: e.target.value } : x)))} />
              <button type="button" aria-label="Remove pack size" className="text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (v.id) setRemovedVariants((r) => [...r, v.id as string]);
                  setVariants((p) => p.filter((_, j) => j !== i));
                }}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" className={ghost} onClick={() => setVariants((p) => [...p, { label: "", price: "", mrp: "", stock: "0" }])}>
            Add pack size
          </button>
        </fieldset>

        <fieldset className="space-y-3 border border-border p-4">
          <legend className={label}>Questions &amp; answers</legend>
          {faqs.map((f, i) => (
            <div key={i} className="space-y-2 border-b border-border pb-3 last:border-0">
              <div className="flex items-center gap-2">
                <input aria-label="Question" placeholder="Question" className="h-11 w-full rounded-sm border border-input bg-card px-2 text-sm" value={f.question}
                  onChange={(e) => setFaqs((p) => p.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} />
                <button type="button" aria-label="Remove question" className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    if (f.id) setRemovedFaqs((r) => [...r, f.id as string]);
                    setFaqs((p) => p.filter((_, j) => j !== i));
                  }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea aria-label="Answer" rows={2} placeholder="Answer" className="w-full rounded-sm border border-input bg-card p-2 text-sm" value={f.answer}
                onChange={(e) => setFaqs((p) => p.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} />
            </div>
          ))}
          <button type="button" className={ghost} onClick={() => setFaqs((p) => [...p, { question: "", answer: "" }])}>
            Add question
          </button>
        </fieldset>

        <div className="grid gap-2 sm:grid-cols-2">
          {flag("is_active", "Visible in the shop")}
          {flag("is_featured", "Featured on the home page")}
          {flag("is_best_seller", "Best seller")}
          {flag("is_new_arrival", "New arrival")}
          {flag("subscription_available", "Offer a subscription")}
        </div>
        {draft.subscription_available ? (
          <div>
            <label className={label} htmlFor="p-sub">Subscription discount (%)</label>
            <input id="p-sub" type="number" min="0" max="50" className={field} value={draft.subscription_discount_pct}
              onChange={(e) => setDraft((d) => ({ ...d, subscription_discount_pct: e.target.value }))} />
          </div>
        ) : null}

        <div className="grid gap-4">
          <div>
            <label className={label} htmlFor="p-seot">Search title</label>
            <input id="p-seot" className={field} maxLength={70} value={draft.seo_title} onChange={(e) => setDraft((d) => ({ ...d, seo_title: e.target.value }))} />
          </div>
          <div>
            <label className={label} htmlFor="p-seod">Search description</label>
            <input id="p-seod" className={field} maxLength={170} value={draft.seo_description} onChange={(e) => setDraft((d) => ({ ...d, seo_description: e.target.value }))} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className={btn}>
            {saving ? "Saving…" : draft.id ? "Update product" : "Add product"}
          </button>
          {draft.id ? (
            <button type="button" onClick={reset} className={ghost}>Cancel</button>
          ) : null}
        </div>
      </form>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl">All products</h2>
          <input
            aria-label="Search products"
            placeholder="Search by name or SKU"
            className="h-11 w-56 rounded-sm border border-input bg-card px-3 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ul className="mt-4 divide-y divide-border border border-border">
          {list.length ? (
            list.map((p: any) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="h-12 w-12 rounded-sm object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-sm border border-dashed border-border" />
                  )}
                  <div>
                    <p className="font-display text-lg">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.price ? inr(Number(p.price)) : "Price on request"} · {p.stock} in stock ·{" "}
                      {p.is_active ? "visible" : "hidden"}
                      {p.product_variants?.length ? ` · ${p.product_variants.length} pack sizes` : ""}
                    </p>
                    {p.stock <= 3 ? <p className="text-xs font-semibold text-destructive">Low stock</p> : null}
                  </div>
                </div>
                <div className="flex gap-3 text-[11px] uppercase tracking-[0.14em]">
                  <button type="button" className="text-gold" onClick={() => void editProduct(p)}>Edit</button>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-primary"
                    onClick={async () => {
                      const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
                      if (error) toast.error("Could not update visibility.");
                      void products.refetch();
                    }}
                  >
                    {p.is_active ? "Hide" : "Show"}
                  </button>
                  <button type="button" className="text-muted-foreground hover:text-destructive" onClick={() => void removeProduct(p.id, p.name)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-sm text-muted-foreground">No products match that search.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
