import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export type NavLeaf = { label: string; to: string; desc?: string };

export const servicesLinks: NavLeaf[] = [
  { label: "Ayurveda", to: "/ayurveda", desc: "The science, doshas and daily rhythm" },
  { label: "Treatments", to: "/treatments", desc: "Consultation, Nadi Pariksha and therapies" },
  { label: "Panchakarma", to: "/treatments/panchakarma", desc: "Classical cleansing and rejuvenation" },
];

export const companyLinks: NavLeaf[] = [
  { label: "About Us", to: "/about", desc: "Vaidh Bharti and Panchsheel Aarogya Dhaam" },
  { label: "Our Story", to: "/our-story", desc: "How the centre came to be" },
  { label: "Testimonials", to: "/testimonials", desc: "Words from those we have cared for" },
];

export function NavDropdown({ label, items }: { label: string; items: NavLeaf[] }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 text-[13px] font-medium tracking-wide transition-colors hover:text-primary",
          open ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4">
          <div className="max-h-[70vh] overflow-y-auto rounded-sm border border-border bg-card shadow-xl">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to as never}
                onClick={() => setOpen(false)}
                className="block border-b border-border/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-secondary"
              >
                <span className="block font-display text-lg text-foreground">{item.label}</span>
                {item.desc ? (
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.desc}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const defaultCategories = [
  { name: "Powders", slug: "powders", description: "Classical Ayurvedic churnas & powders" },
  { name: "Oils", slug: "oils", description: "Herbal hair & Nabhi wellness oils" },
  { name: "Shilajit", slug: "shilajit", description: "Pure Himalayan Suryatapi Shilajit resin" },
  { name: "Capsules", slug: "capsules", description: "Classical Ayurvedic herbs & Rasayana capsules" },
  { name: "Herbal Teas", slug: "teas", description: "Therapeutic Tridosha balancing Ayurvedic herbal teas" },
];

/** Shop menu built from the real product categories in the database. */
export function useShopLinks(): NavLeaf[] {
  const { data } = useQuery({
    queryKey: ["nav-categories"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      try {
        const res = await supabase.from("categories").select("slug,name,description").eq("is_active", true).order("sort_order");
        if (res.data && res.data.length > 0) return res.data;
      } catch {}
      return defaultCategories;
    },
  });
  const catList = data && data.length > 0 ? data : defaultCategories;
  return [
    { label: "Shop All Products", to: "/products", desc: "Every preparation in one place" },
    { label: "All Categories", to: "/categories", desc: "Browse by product family" },
    ...catList.map((c) => ({
      label: c.name,
      to: `/category/${c.slug}`,
      desc: c.description ?? undefined,
    })),
  ].map((l) => ({ label: l.label, to: l.to, ...(l.desc ? { desc: l.desc } : {}) }));
}

export function ShopDropdown() {
  return <NavDropdown label="Shop" items={useShopLinks()} />;
}
