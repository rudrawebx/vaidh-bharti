import * as React from "react";
import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ShieldCheck, User, Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Container } from "@/components/site/primitives";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { cn } from "@/lib/utils";
import { loginAdminCredentials } from "@/lib/admin-auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Sign in to manage store orders or track your Ayurvedic consultations." },
      { property: "og:title", content: "Sign In — Vaidh Bharti Ayurveda" },
      { property: "og:description", content: "Sign in to track your orders and consultations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
  }),
  component: AuthPage,
});

function safePath(p?: string): string {
  return p && p.startsWith("/") && !p.startsWith("//") ? p : "/admin";
}

function AuthPage() {
  const search = useSearch({ strict: false }) as { redirect?: string };
  const navigate = useNavigate();

  // If redirected from /admin, default to admin tab
  const isFromAdmin = search.redirect?.includes("/admin") ?? true;
  const [activeTab, setActiveTab] = React.useState<"admin" | "customer">(isFromAdmin ? "admin" : "customer");

  // Admin form state
  const [adminEmail, setAdminEmail] = React.useState("vaidbharti80@gmail.com");
  const [adminPassword, setAdminPassword] = React.useState("");
  const [showAdminPass, setShowAdminPass] = React.useState(false);
  const [adminBusy, setAdminBusy] = React.useState(false);

  // Customer form state
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  // If already logged in as admin via token
  React.useEffect(() => {
    const existingToken = typeof window !== "undefined" ? localStorage.getItem("vb_admin_token") : null;
    if (existingToken && isFromAdmin) {
      navigate({ to: "/admin" });
    }
  }, [navigate, isFromAdmin]);

  // Admin login handler
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      toast.error("Please enter your admin email and password.");
      return;
    }

    setAdminBusy(true);
    try {
      const res = await loginAdminCredentials({
        data: {
          email: adminEmail.trim(),
          password: adminPassword.trim(),
        },
      });

      if (res?.success && res.token) {
        localStorage.setItem("vb_admin_token", res.token);
        toast.success(`Welcome back, ${res.name || "Vaidh Jitender Bharti"}!`);
        navigate({ to: (safePath(search.redirect) as any) || "/admin" });
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not sign in to admin panel.");
    } finally {
      setAdminBusy(false);
    }
  };

  // Customer auth handler (Supabase fallback)
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}${safePath(search.redirect)}`,
          },
        });
        if (error) throw error;
        toast.success("Account created. You are signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in successfully.");
      }
      navigate({ to: (safePath(search.redirect) as any) || "/admin" });
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Could not sign you in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-md">
          {/* Brand header */}
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
              Vaidh Bharti Ayurveda
            </span>
            <h1 className="mt-1 font-display text-3xl">Panchsheel Aarogya Dhaam</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Sign in to manage pharmacy orders, consultation bookings, or track customer requests.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 rounded-sm border border-border bg-muted/40 p-1 mb-6 text-xs font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 rounded-xs transition-colors",
                activeTab === "admin"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ShieldCheck className="h-4 w-4 text-gold" />
              Admin Portal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("customer")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 rounded-xs transition-colors",
                activeTab === "customer"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <User className="h-4 w-4" />
              Customer Login
            </button>
          </div>

          {/* 1. ADMIN LOGIN PANEL */}
          {activeTab === "admin" && (
            <div className="rounded-sm border border-border bg-card p-8 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <h2 className="font-display text-xl">Administrator Access</h2>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ad-email" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Admin Email / Username
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id="ad-email"
                      type="text"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="vaidbharti80@gmail.com"
                      className="h-12 w-full rounded-sm border border-input bg-background pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="ad-pass" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Password
                    </label>
                  </div>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id="ad-pass"
                      type={showAdminPass ? "text" : "password"}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="h-12 w-full rounded-sm border border-input bg-background pl-10 pr-10 text-sm focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                    >
                      {showAdminPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adminBusy}
                  className="mt-2 w-full rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {adminBusy ? "Signing in..." : "Sign In to Admin Panel"}
                </button>
              </form>

              <div className="mt-6 rounded-sm bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground border border-border/50">
                <strong className="text-foreground font-semibold">Master Admin Note:</strong> Log in using your clinic email (<code>vaidbharti80@gmail.com</code>) or <code>admin</code> and your designated password.
              </div>
            </div>
          )}

          {/* 2. CUSTOMER ACCOUNT PANEL */}
          {activeTab === "customer" && (
            <div className="rounded-sm border border-border bg-card p-8 shadow-xs">
              <h2 className="font-display text-xl mb-1">
                {mode === "signin" ? "Customer Sign In" : "Create Patient Account"}
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                View previous Ayurvedic orders and consultation history.
              </p>

              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label htmlFor="cu-name" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      id="cu-name"
                      required
                      value={name}
                      maxLength={80}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 h-12 w-full rounded-sm border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="cu-email" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    id="cu-email"
                    type="email"
                    required
                    value={email}
                    maxLength={120}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 h-12 w-full rounded-sm border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="cu-pass" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Password
                  </label>
                  <input
                    id="cu-pass"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 h-12 w-full rounded-sm border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60"
                >
                  {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-6 border-t border-border pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="text-xs uppercase tracking-[0.12em] font-semibold text-gold hover:underline"
                >
                  {mode === "signin" ? "New patient? Create an account" : "Already have an account? Sign in"}
                </button>
              </div>

              {/* Order Tracking without login */}
              <div className="mt-6 border-t border-border pt-4 text-center">
                <Link
                  to="/track-order"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <span>Track an order without signing in</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
