import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/site";

export function CartDrawer() {
  const { open, setOpen, items, subtotal, setQty, remove } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-[92vw] max-w-md flex-col bg-background p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="font-display text-2xl font-medium">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="rounded-sm border border-border px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold hover:text-gold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product.name}
                      loading="lazy"
                      className="h-24 w-20 shrink-0 rounded-sm bg-secondary object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg">{item.product.name}</p>
                    {item.variantLabel ? (
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.variantLabel}</p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">{inr(item.unitPrice)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-sm border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          onClick={() => setQty(item.key, item.qty - 1)}
                          className="grid h-9 w-9 place-items-center text-primary"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.product.name}`}
                          onClick={() => setQty(item.key, item.qty + 1)}
                          className="grid h-9 w-9 place-items-center text-primary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.product.name} from cart`}
                        onClick={() => remove(item.key)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-border px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl">{inr(subtotal)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Shipping and any discount are calculated at checkout.</p>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="block w-full rounded-sm bg-primary px-5 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-forest-deep"
              >
                Checkout
              </Link>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="block w-full rounded-sm border border-border px-5 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold hover:text-gold"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
