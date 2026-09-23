import * as React from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, LogOut, ExternalLink } from "lucide-react";
import { Container } from "@/components/site/primitives";
import logo from "@/assets/logo.png";
import { useIsAdmin } from "@/hooks/useAuth";
import { loginAdminCredentials } from "@/lib/admin-auth.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Portal — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Manage orders, catalog products, bookings, and clinic settings." },
      { property: "og:title", content: "Admin Portal — Vaidh Bharti" },
      { property: "og:description", content: "Manage orders, catalog products, bookings, and clinic settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/enquiries", label: "Enquiries" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/settings", label: "Settings" },
] as const;

function AdminLayout() {
  const { isAdmin, checking, user, signOutAdmin } = useIsAdmin();
  const navigate = useNavigate();

  // Inline Admin Login form states
  const [email, setEmail] = React.useState("vaidbharti80@gmail.com");
  const [password, setPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [loggingIn, setLoggingIn] = React.useState(false);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoggingIn(true);
    try {
      const res = await loginAdminCredentials({
        data: {
          email: email.trim(),
          password: password.trim(),
        },
      });

      if (res?.success && res.token) {
        localStorage.setItem("vb_admin_token", res.token);
        toast.success(`Welcome back, ${res.name || "Vaidh Jitender Bharti"}!`);
        window.location.reload();
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoggingIn(false);
    }
  };

  if (checking) {
    return (
      <Container>
        <div className="py-32 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">Verifying administrative access…</p>
        </div>
      </Container>
    );
  }

  // If not authenticated as admin, show direct master login form right here
  if (!isAdmin) {
    return (
      <Container>
        <div className="mx-auto max-w-md py-20">
          <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
            <div className="text-center mb-6">
              <img src={logo} alt="Vaidh Bharti" className="mx-auto h-12 w-auto object-contain mb-3" />
              <h1 className="font-display text-2xl">Admin Sign In</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Panchsheel Aarogya Dhaam — Management Portal
              </p>
            </div>

            <form onSubmit={handleInlineLogin} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground" htmlFor="admin-email">
                  Admin Email / Username
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="admin-email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vaidbharti80@gmail.com"
                    className="h-12 w-full rounded-sm border border-input bg-background pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground" htmlFor="admin-pass">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="admin-pass"
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="h-12 w-full rounded-sm border border-input bg-background pl-10 pr-10 text-sm focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {loggingIn ? "Verifying..." : "Sign In to Admin Panel"}
              </button>
            </form>

            <div className="mt-6 rounded-sm bg-muted/40 p-3 text-[11px] text-muted-foreground border border-border/50">
              <span className="font-semibold text-foreground">Clinic Admin Access:</span> Use email <code>vaidbharti80@gmail.com</code> with your master administrator password.
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-xs text-muted-foreground hover:text-gold">
                &larr; Back to Public Website
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Authenticated Admin view
  return (
    <section className="py-10">
      <Container>
        {/* Top Admin Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Vaidh Bharti logo" width={48} height={48} className="h-12 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold leading-none">Vaidh Bharti Admin</h1>
                <span className="rounded-sm bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Live
                </span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Panchsheel Aarogya Dhaam · {user?.email || "Master Administrator"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-sm border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
            >
              <span>View Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={async () => {
                await signOutAdmin();
                toast.success("Signed out of admin panel.");
                window.location.reload();
              }}
              className="flex items-center gap-1.5 rounded-sm border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: "exact" in l }}
              activeProps={{ className: "border-primary bg-primary text-primary-foreground font-bold shadow-xs" }}
              className="rounded-sm border border-border bg-card px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground hover:bg-muted/40 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Page Content Outlet */}
        <div className="mt-8">
          <Outlet />
        </div>
      </Container>
    </section>
  );
}
