import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";
import { site } from "./site";

const ADMIN_JWT_SECRET = process.env["ADMIN_SECRET_KEY"] || "vaidh_bharti_secure_admin_session_key_2026";
const DEFAULT_ADMIN_EMAIL = "vaidbharti80@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "VaidhBharti@2026";
const ALTERNATE_ADMIN_EMAIL = "admin@vaidhbharti.com";

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function createSessionToken(email: string): string {
  // 30 days session
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ email, exp, role: "admin" });
  const b64 = Buffer.from(payload).toString("base64url");
  const signature = crypto.createHmac("sha256", ADMIN_JWT_SECRET).update(b64).digest("base64url");
  return `${b64}.${signature}`;
}

export function verifySessionToken(token: string): { valid: boolean; email?: string; name?: string } {
  try {
    const [b64, signature] = token.split(".");
    if (!b64 || !signature) return { valid: false };

    const expectedSignature = crypto.createHmac("sha256", ADMIN_JWT_SECRET).update(b64).digest("base64url");
    if (expectedSignature !== signature) return { valid: false };

    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) return { valid: false };

    return {
      valid: true,
      email: payload.email,
      name: "Vaidh Jitender Bharti",
    };
  } catch (e) {
    return { valid: false };
  }
}

// 1. Admin Login Server Function
export const loginAdminCredentials = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const password = (data.password || "").trim();

    if (!cleanEmail || !password) {
      throw new Error("Please enter both email/username and password.");
    }

    // Check custom password in site_settings if available
    let storedAuth: { password_hash?: string; salt?: string } | null = null;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row } = await supabaseAdmin
        .from("site_settings")
        .select("value")
        .eq("key", "admin_credentials")
        .maybeSingle();
      if (row?.value && typeof row.value === "object") {
        storedAuth = row.value as any;
      }
    } catch {
      // Fallback to default credentials if DB is unseeded
    }

    let isValid = false;

    // Check custom password if set
    if (storedAuth?.password_hash && storedAuth?.salt) {
      const testHash = hashPassword(password, storedAuth.salt);
      if (testHash === storedAuth.password_hash) {
        isValid = true;
      }
    }

    // Check default master password
    if (!isValid) {
      const isRecognizedEmail =
        cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() ||
        cleanEmail === ALTERNATE_ADMIN_EMAIL.toLowerCase() ||
        cleanEmail === "admin" ||
        cleanEmail === "vaidhbharti";

      if (isRecognizedEmail && password === DEFAULT_ADMIN_PASSWORD) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new Error("Incorrect login details. Please verify your email and password.");
    }

    const token = createSessionToken(cleanEmail);

    return {
      success: true,
      token,
      email: cleanEmail,
      name: "Vaidh Jitender Bharti",
    };
  });

// 2. Admin Session Verification Server Function
export const verifyAdminSession = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    if (!data.token) return { valid: false };
    return verifySessionToken(data.token);
  });

// 3. Admin Change Password Server Function
export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { token: string; currentPassword: string; newPassword: string }) => data,
  )
  .handler(async ({ data }) => {
    const verified = verifySessionToken(data.token);
    if (!verified.valid) throw new Error("Unauthorized session. Please sign in again.");

    if (!data.newPassword || data.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long.");
    }

    // Verify current password
    let storedAuth: { password_hash?: string; salt?: string } | null = null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "admin_credentials")
      .maybeSingle();

    if (row?.value && typeof row.value === "object") {
      storedAuth = row.value as any;
    }

    let currentValid = false;
    if (storedAuth?.password_hash && storedAuth?.salt) {
      currentValid = hashPassword(data.currentPassword, storedAuth.salt) === storedAuth.password_hash;
    } else if (data.currentPassword === DEFAULT_ADMIN_PASSWORD) {
      currentValid = true;
    }

    if (!currentValid) {
      throw new Error("Current password is not correct.");
    }

    // Generate new salt and hash
    const newSalt = crypto.randomBytes(16).toString("hex");
    const newHash = hashPassword(data.newPassword, newSalt);

    await supabaseAdmin.from("site_settings").upsert(
      {
        key: "admin_credentials",
        value: {
          password_hash: newHash,
          salt: newSalt,
          updated_at: new Date().toISOString(),
        },
      },
      { onConflict: "key" },
    );

    return { success: true, message: "Password updated successfully." };
  });
