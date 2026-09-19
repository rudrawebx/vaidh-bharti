import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Container } from "@/components/site/primitives";
import logoAsset from "@/assets/logo.png.asset.json";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { adminExists, claimAdmin } from "@/lib/bookings.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Manage products, orders, bookings and content." },
      { property: "og:title", content: "Admin — Vaidh Bharti" },
      { property: "og:description", content: "Manage products, orders, bookings and content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/enquiries", label: "Enquiries" },

  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/settings", label: "Settings" },
] as const;

function AdminLayout() {
  const { isAdmin, checking, user } = useIsAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const owner = useQuery({ queryKey: ["admin-exists"], queryFn: () => adminExists(), enabled: Boolean(user) && !isAdmin });

  if (checking) {
    return (
      <Container>
        <p className="py-32 text-center text-sm text-muted-foreground">Checking your access…</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <div className="mx-auto max-w-lg py-32 text-center">
          <h1 className="font-display text-3xl">Admin sign-in</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Sign in with your administrator account to manage products, orders, bookings and delivery settings.
          </p>
          <Link
            to="/auth"
            search={{ redirect: "/admin" }}
            className="mt-6 inline-block rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
          >
            Sign in
          </Link>
        </div>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container>
        <div className="mx-auto max-w-lg py-32 text-center">
          <h1 className="font-display text-3xl">This account does not have admin access</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            You are signed in as {user.email}. Sign out and use your administrator account to continue.
          </p>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate({ to: "/auth", search: { redirect: "/admin" } });
            }}
            className="mt-6 rounded-sm border border-border px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            Sign out
          </button>

          {owner.data && !owner.data.exists ? (
            <div className="mt-10 border-t border-border pt-8">
              <p className="text-sm text-muted-foreground">
                No administrator has been set up for this website yet. If you are the owner, claim it now.
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await claimAdmin();
                    toast.success("You are now the administrator. Reloading…");
                    window.location.reload();
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Could not claim admin access.");
                  }
                }}
                className="mt-4 rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Claim admin access
              </button>
            </div>
          ) : null}
        </div>
      </Container>
    );
  }


  return (
    <section className="py-12">
      <Container>
        <div className="flex items-center gap-4">
          <img src={logoAsset.url} alt="Vaidh Bharti logo" width={48} height={48} className="h-12 w-auto object-contain" />
          <div>
            <h1 className="font-display text-4xl leading-none">Admin</h1>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Vaidh Bharti — Panchsheel Aarogya Dhaam</p>
          </div>
        </div>
        <nav className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: "exact" in l }}
              activeProps={{ className: "border-primary bg-primary text-primary-foreground" }}
              className="rounded-sm border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <Outlet />
        </div>
      </Container>
    </section>
  );
}
