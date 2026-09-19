import * as React from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/** Client-side wishlist helper. Rows are protected by row-level security. */
export function useWishlist() {
  const [ids, setIds] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  const load = React.useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setIds([]);
      setReady(true);
      return;
    }
    const { data } = await supabase.from("wishlist_items").select("product_id");
    setIds((data ?? []).map((r) => r.product_id));
    setReady(true);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const toggle = React.useCallback(
    async (productId: string) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        toast.error("Please sign in to save items to your wishlist.");
        return;
      }
      if (ids.includes(productId)) {
        setIds((p) => p.filter((i) => i !== productId));
        await supabase.from("wishlist_items").delete().eq("product_id", productId).eq("user_id", auth.user.id);
        toast.success("Removed from wishlist");
      } else {
        setIds((p) => [...p, productId]);
        const { error } = await supabase
          .from("wishlist_items")
          .insert({ product_id: productId, user_id: auth.user.id });
        if (error) {
          setIds((p) => p.filter((i) => i !== productId));
          toast.error("Could not save to wishlist.");
          return;
        }
        toast.success("Saved to wishlist");
      }
    },
    [ids],
  );

  return { ids, ready, toggle, reload: load };
}
