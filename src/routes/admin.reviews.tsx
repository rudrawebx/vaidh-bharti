import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/reviews")({ component: AdminReviews });

function AdminReviews() {
  const reviews = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () =>
      (
        await supabase
          .from("reviews")
          .select("id,author_name,rating,title,body,status,created_at,products(name)")
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) toast.error("Could not update the review.");
    else toast.success(status === "approved" ? "Review published." : "Review hidden.");
    void reviews.refetch();
  };

  return (
    <ul className="space-y-4">
      {reviews.data?.length ? (
        reviews.data.map((r) => (
          <li key={r.id} className="border border-border p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-xl">
                {r.author_name} · {"★".repeat(r.rating)}
              </p>
              <span className="text-[11px] uppercase tracking-[0.16em] text-gold">{r.status}</span>
            </div>
            <p className="text-xs text-muted-foreground">{r.products?.name}</p>
            {r.title ? <p className="mt-2 text-sm text-primary">{r.title}</p> : null}
            {r.body ? <p className="mt-1 text-sm text-muted-foreground">{r.body}</p> : null}
            <div className="mt-4 flex gap-4 text-[11px] uppercase tracking-[0.14em]">
              <button type="button" className="text-gold" onClick={() => setStatus(r.id, "approved")}>
                Approve
              </button>
              <button type="button" className="text-muted-foreground hover:text-destructive" onClick={() => setStatus(r.id, "rejected")}>
                Hide
              </button>
            </div>
          </li>
        ))
      ) : (
        <li className="text-sm text-muted-foreground">No reviews yet.</li>
      )}
    </ul>
  );
}
