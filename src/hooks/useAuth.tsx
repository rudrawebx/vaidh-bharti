import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { verifyAdminSession } from "@/lib/admin-auth.functions";

export function useAuth() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        setSession(s);
        setLoading(false);
      });
      supabase.auth.getSession().then(({ data }) => {
        setSession(data?.session ?? null);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
      return () => sub.subscription.unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const user: User | null = session?.user ?? null;
  return {
    session,
    user,
    loading,
    signOut: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("vb_admin_token");
      }
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore supabase signout errors
      }
    },
  };
}

export type AdminUser = {
  id?: string;
  email: string;
  name: string;
};

export function useIsAdmin() {
  const { user: sbUser, loading: sbLoading } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [adminUser, setAdminUser] = React.useState<AdminUser | null>(null);
  const [checking, setChecking] = React.useState(true);

  const checkAdmin = React.useCallback(async () => {
    let active = true;

    // 1. Check local secure admin token first
    const token = typeof window !== "undefined" ? localStorage.getItem("vb_admin_token") : null;
    if (token) {
      try {
        const res = await verifyAdminSession({ data: { token } });
        if (res?.valid) {
          setIsAdmin(true);
          setAdminUser({
            email: res.email || "vaidbharti80@gmail.com",
            name: res.name || "Vaidh Jitender Bharti",
          });
          setChecking(false);
          return;
        }
        localStorage.removeItem("vb_admin_token");
      } catch (err) {
        console.warn("Admin token verification check failed:", err);
      }
    }

    // 2. Fall back to Supabase role check if token not found
    if (sbUser) {
      try {
        const { data } = await supabase.rpc("has_role", { _user_id: sbUser.id, _role: "admin" });
        if (Boolean(data)) {
          setIsAdmin(true);
          setAdminUser({
            id: sbUser.id,
            email: sbUser.email || "Admin",
            name: (sbUser.user_metadata as any)?.full_name || "Administrator",
          });
          setChecking(false);
          return;
        }
      } catch {
        // Fallback
      }
    }

    setIsAdmin(false);
    setAdminUser(null);
    setChecking(false);
  }, [sbUser]);

  React.useEffect(() => {
    void checkAdmin();
  }, [checkAdmin]);

  const signOutAdmin = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vb_admin_token");
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    setIsAdmin(false);
    setAdminUser(null);
  };

  return {
    isAdmin,
    checking,
    user: adminUser || (sbUser ? { email: sbUser.email ?? "", name: "User" } : null),
    signOutAdmin,
  };
}
