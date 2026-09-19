import * as React from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Container } from "@/components/site/primitives";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Create an Account — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Sign in to track your Ayurvedic orders and consultations with Vaidh Bharti." },
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

function safePath(p?: string): "/account" {
  return (p && p.startsWith("/") && !p.startsWith("//") ? p : "/account") as "/account";
}

async function destination(fallback?: string) {
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (uid) {
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
    if (isAdmin) return "/admin" as "/account";
  }
  return safePath(fallback);
}

function AuthPage() {
  const search = useSearch({ strict: false }) as { redirect?: string };
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void destination(search.redirect).then((to) => navigate({ to }));
    });
  }, [navigate, search.redirect]);

  const submit = async (e: React.FormEvent) => {
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
      }
      navigate({ to: await destination(search.redirect) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign you in.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${safePath(search.redirect)}`,
    });
    if (result.error) {
      toast.error("Google sign-in did not work. Please try email instead.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: await destination(search.redirect) });
  };

  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-md border border-border p-8">
          <h1 className="font-display text-3xl">{mode === "signin" ? "Sign in" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your orders and consultations in one place.
          </p>

          <button
            type="button"
            onClick={google}
            className="mt-6 w-full rounded-sm border border-border px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold hover:text-gold"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" ? (
              <div>
                <label htmlFor="au-name" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Full name</label>
                <input id="au-name" required value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
              </div>
            ) : null}
            <div>
              <label htmlFor="au-email" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Email</label>
              <input id="au-email" type="email" required value={email} maxLength={120} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
            </div>
            <div>
              <label htmlFor="au-pass" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Password</label>
              <input id="au-pass" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
            </div>
            <button type="submit" disabled={busy} className="w-full rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60">
              {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className={cn("mt-6 w-full text-center text-[12px] uppercase tracking-[0.14em] text-gold")}
          >
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </Container>
    </section>
  );
}
