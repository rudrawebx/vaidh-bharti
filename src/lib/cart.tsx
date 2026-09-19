import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { listCatalog, type ProductDTO } from "@/lib/catalog.functions";

export type CartLine = { slug: string; variantLabel: string | null; qty: number };

export type CartItem = {
  key: string;
  slug: string;
  variantLabel: string | null;
  qty: number;
  product: ProductDTO;
  unitPrice: number;
  mrp: number | null;
  image: string | null;
};

type CartContextValue = {
  lines: CartLine[];
  items: CartItem[];
  count: number;
  subtotal: number;
  loading: boolean;
  add: (slug: string, variantLabel?: string | null, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "vb-cart-v2";

export const lineKey = (slug: string, variantLabel: string | null) => `${slug}::${variantLabel ?? ""}`;

export function catalogQueryOptions() {
  return { queryKey: ["catalog"], queryFn: () => listCatalog(), staleTime: 60_000 };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [open, setOpen] = React.useState(false);
  const catalog = useQuery(catalogQueryOptions());

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const products = catalog.data?.products ?? [];

  const value = React.useMemo<CartContextValue>(() => {
    const items: CartItem[] = lines
      .map((l) => {
        const product = products.find((p) => p.slug === l.slug);
        if (!product) return null;
        const variant = l.variantLabel ? product.variants.find((v) => v.label === l.variantLabel) : undefined;
        const unitPrice = variant ? variant.price : (product.price ?? 0);
        return {
          key: lineKey(l.slug, l.variantLabel),
          slug: l.slug,
          variantLabel: l.variantLabel,
          qty: l.qty,
          product,
          unitPrice,
          mrp: variant ? variant.mrp : product.mrp,
          image: product.images[0] ?? null,
        } satisfies CartItem;
      })
      .filter((x): x is CartItem => x !== null);

    return {
      lines,
      items,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
      loading: catalog.isLoading,
      add: (slug, variantLabel = null, qty = 1) =>
        setLines((prev) => {
          const found = prev.find((l) => l.slug === slug && (l.variantLabel ?? null) === (variantLabel ?? null));
          if (found)
            return prev.map((l) =>
              l === found ? { ...l, qty: Math.min(20, l.qty + qty) } : l,
            );
          return [...prev, { slug, variantLabel: variantLabel ?? null, qty }];
        }),
      setQty: (key, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => lineKey(l.slug, l.variantLabel) !== key)
            : prev.map((l) => (lineKey(l.slug, l.variantLabel) === key ? { ...l, qty: Math.min(20, qty) } : l)),
        ),
      remove: (key) => setLines((prev) => prev.filter((l) => lineKey(l.slug, l.variantLabel) !== key)),
      clear: () => setLines([]),
      open,
      setOpen,
    };
  }, [lines, open, products, catalog.isLoading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
