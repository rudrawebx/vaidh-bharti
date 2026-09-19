import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number");

export function normalisePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

async function hashCode(phone: string, code: string) {
  const { createHash } = await import("crypto");
  return createHash("sha256").update(`${phone}:${code}`).digest("hex");
}

export const getOtpConfig = createServerFn({ method: "GET" }).handler(async () => ({
  otpEnabled: Boolean(process.env["MSG91_AUTH_KEY"] && process.env["MSG91_TEMPLATE_ID"]),
}));

export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ phone: phoneSchema }).parse(data))
  .handler(async ({ data }) => {
    const authKey = process.env["MSG91_AUTH_KEY"];
    const templateId = process.env["MSG91_TEMPLATE_ID"];
    if (!authKey || !templateId) {
      throw new Error("SMS verification is not configured yet. Please contact us to place this order.");
    }

    const phone = normalisePhone(data.phone);
    if (phone.length !== 10) throw new Error("Enter a valid 10-digit mobile number.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("otp_verifications")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", hourAgo);
    if ((count ?? 0) >= 5) throw new Error("Too many codes requested. Please try again after an hour.");

    const { data: last } = await supabaseAdmin
      .from("otp_verifications")
      .select("created_at")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (last && Date.now() - new Date(last.created_at).getTime() < 30_000) {
      throw new Error("Please wait 30 seconds before asking for a new code.");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const params = new URLSearchParams({
      template_id: templateId,
      mobile: `91${phone}`,
      otp: code,
      authkey: authKey,
    });
    const senderId = process.env["MSG91_SENDER_ID"];
    if (senderId) params.set("sender", senderId);

    const res = await fetch(`https://control.msg91.com/api/v5/otp?${params.toString()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const body = (await res.json().catch(() => ({}))) as { type?: string; message?: string };
    if (!res.ok || body.type === "error") {
      console.error("[MSG91] send failed", body);
      throw new Error("The code could not be sent right now. Please try again in a moment.");
    }

    const { error } = await supabaseAdmin.from("otp_verifications").insert({
      phone,
      code_hash: await hashCode(phone, code),
      purpose: "checkout",
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });
    if (error) throw new Error("Could not start verification. Please try again.");

    return { sent: true, phone };
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ phone: phoneSchema, code: z.string().trim().regex(/^\d{4,8}$/, "Enter the code") }).parse(data),
  )
  .handler(async ({ data }) => {
    const phone = normalisePhone(data.phone);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row } = await supabaseAdmin
      .from("otp_verifications")
      .select("id,code_hash,attempts,expires_at,verified_at")
      .eq("phone", phone)
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) throw new Error("Please request a new code.");
    if (new Date(row.expires_at) < new Date()) throw new Error("That code has expired. Please request a new one.");
    if (row.attempts >= 5) throw new Error("Too many wrong attempts. Please request a new code.");

    const expected = await hashCode(phone, data.code);
    if (expected !== row.code_hash) {
      await supabaseAdmin.from("otp_verifications").update({ attempts: row.attempts + 1 }).eq("id", row.id);
      throw new Error("That code is not correct.");
    }

    await supabaseAdmin
      .from("otp_verifications")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", row.id);

    return { verified: true };
  });

export async function isPhoneVerified(phoneRaw: string) {
  const phone = normalisePhone(phoneRaw);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("otp_verifications")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .gte("verified_at", since);
  return (count ?? 0) > 0;
}
