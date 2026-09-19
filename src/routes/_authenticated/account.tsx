import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { inr } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Your orders, consultations, wishlist and profile details." },
      { property: "og:title", content: "My Account — Vaidh Bharti Ayurveda" },
      { property: "og:description", content: "Your orders, consultations and profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Account,
});

type Tab = "orders" | "bookings" | "wishlist" | "profile";

function Account() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<Tab>("orders");

  const orders = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("order_number,status,payment_status,total,created_at,order_items(product_name,variant_label,quantity,unit_price)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const bookings = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("reference,consultation_type,booking_date,slot_time,status")
        .order("booking_date", { ascending: false });
      return data ?? [];
    },
  });

  const wishlist = useQuery({
    queryKey: ["my-wishlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("wishlist_items")
        .select("id, products(slug,name,price,images)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const profile = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("full_name,phone,email").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  React.useEffect(() => {
    if (profile.data) {
      setName(profile.data.full_name ?? "");
      setPhone(profile.data.phone ?? "");
    }
  }, [profile.data]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user!.id, full_name: name.slice(0, 80), phone: phone.slice(0, 15), email: user!.email ?? null });
    if (error) toast.error("Could not save your details.");
    else toast.success("Details saved.");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "orders", label: "Orders" },
    { id: "bookings", label: "Consultations" },
    { id: "wishlist", label: "Wishlist" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <>
      <PageHero eyebrow="Your Account" title="My Account" intro={user?.email ?? ""} crumbs={[{ label: "Account" }]} />
      <section className="py-16">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "rounded-sm border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]",
                    tab === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-primary",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              {isAdmin ? (
                <Link to="/admin" className="rounded-sm border border-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                  Admin
                </Link>
              ) : null}
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
                className="rounded-sm border border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="mt-10">
            {tab === "orders" ? (
              orders.data?.length ? (
                <ul className="space-y-4">
                  {orders.data.map((o) => (
                    <li key={o.order_number} className="border border-border p-6">
                      <div className="flex flex-wrap justify-between gap-3">
                        <span className="font-display text-xl">{o.order_number}</span>
                        <span className="text-[11px] uppercase tracking-[0.16em] text-gold">{o.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(o.created_at).toLocaleDateString("en-IN")} · {inr(Number(o.total))} · payment {o.payment_status}
                      </p>
                      <ul className="mt-3 text-sm text-muted-foreground">
                        {o.order_items.map((i, idx) => (
                          <li key={idx}>
                            {i.product_name}
                            {i.variant_label ? ` · ${i.variant_label}` : ""} × {i.quantity}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">You have no orders yet.</p>
              )
            ) : null}

            {tab === "bookings" ? (
              bookings.data?.length ? (
                <ul className="space-y-4">
                  {bookings.data.map((b) => (
                    <li key={b.reference} className="border border-border p-6">
                      <div className="flex flex-wrap justify-between gap-3">
                        <span className="font-display text-xl">{b.consultation_type}</span>
                        <span className="text-[11px] uppercase tracking-[0.16em] text-gold">{b.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(`${b.booking_date}T00:00:00`).toLocaleDateString("en-IN")} at {b.slot_time} · {b.reference}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No consultations yet.{" "}
                  <Link to="/book" className="text-gold">
                    Book one
                  </Link>
                  .
                </p>
              )
            ) : null}

            {tab === "wishlist" ? (
              wishlist.data?.length ? (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlist.data.map((w) => {
                    const p = w.products;
                    if (!p) return null;
                    return (
                      <li key={w.id} className="border border-border p-6">
                        <Link to="/product/$slug" params={{ slug: p.slug }} className="font-display text-xl">
                          {p.name}
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground">{p.price ? inr(Number(p.price)) : "Price on request"}</p>
                        <button
                          type="button"
                          onClick={async () => {
                            await supabase.from("wishlist_items").delete().eq("id", w.id);
                            void wishlist.refetch();
                          }}
                          className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
              )
            ) : null}

            {tab === "profile" ? (
              <form onSubmit={saveProfile} className="max-w-md space-y-4">
                <div>
                  <label htmlFor="pf-name" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Full name</label>
                  <input id="pf-name" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
                </div>
                <div>
                  <label htmlFor="pf-phone" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Phone</label>
                  <input id="pf-phone" value={phone} maxLength={15} onChange={(e) => setPhone(e.target.value)} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
                </div>
                <button type="submit" className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                  Save details
                </button>
              </form>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
}
