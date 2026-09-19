import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const bookingSchema = z.object({
  consultationType: z.string().trim().min(2).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(600).optional().or(z.literal("")),
  userId: z.string().uuid().nullable().optional(),
});

function buildSlots(start: string, end: string, minutes: number) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
  };
  const out: string[] = [];
  for (let t = toMin(start); t + minutes <= toMin(end); t += minutes) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return out;
}

const HOLD_MINUTES = 15;

async function clearAbandonedHolds() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const cutoff = new Date(Date.now() - HOLD_MINUTES * 60 * 1000).toISOString();
  await supabaseAdmin
    .from("bookings")
    .delete()
    .eq("payment_status", "pending")
    .lt("created_at", cutoff);
}

export const getConsultationFee = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./supabase-public.server");
  const { data } = await publicClient().from("site_settings").select("value").eq("key", "consultation").maybeSingle();
  const v = (data?.value ?? {}) as { fee?: number; gst_percent?: number };
  const fee = Number(v.fee ?? 300);
  const gstPercent = Number(v.gst_percent ?? 18);
  const gst = Math.round((fee * gstPercent) / 100);
  return {
    fee,
    gstPercent,
    gst,
    total: fee + gst,
    razorpayEnabled: Boolean(process.env["RAZORPAY_KEY_ID"] && process.env["RAZORPAY_KEY_SECRET"]),
  };
});

export const getAvailability = createServerFn({ method: "GET" })
  .inputValidator((data: { date: string }) => data)
  .handler(async ({ data }) => {
    const { publicClient } = await import("./supabase-public.server");
    const supabase = publicClient();
    const { data: settings } = await supabase.from("booking_settings").select("*").maybeSingle();
    if (!settings) return { slots: [], types: [], closed: true };

    const day = new Date(`${data.date}T00:00:00`).getDay();
    const workingDays = settings.working_days ?? [1, 2, 3, 4, 5, 6];
    const blockedDates = settings.blocked_dates ?? [];
    const closed = !workingDays.includes(day) || blockedDates.includes(data.date);

    const all = buildSlots(settings.start_time, settings.end_time, settings.slot_minutes);
    await clearAbandonedHolds();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booked } = await supabaseAdmin
      .from("bookings")
      .select("slot_time")
      .eq("booking_date", data.date)
      .neq("status", "cancelled");
    const taken = new Set((booked ?? []).map((b) => b.slot_time.slice(0, 5)));
    const blockedSlots = new Set(settings.blocked_slots ?? []);
    const now = new Date();
    const isToday = data.date === now.toISOString().slice(0, 10);

    const slots = closed
      ? []
      : all
          .filter((s) => !taken.has(s) && !blockedSlots.has(`${data.date} ${s}`))
          .filter((s) => {
            if (!isToday) return true;
            const [h, m] = s.split(":").map(Number);
            const slotDate = new Date();
            slotDate.setHours(h ?? 0, m ?? 0, 0, 0);
            return slotDate.getTime() > now.getTime() + 60 * 60 * 1000;
          });

    return { slots, types: settings.consultation_types ?? [], closed };
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await clearAbandonedHolds();

    const { data: feeRow } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "consultation")
      .maybeSingle();
    const v = (feeRow?.value ?? {}) as { fee?: number; gst_percent?: number };
    const fee = Number(v.fee ?? 300);
    const gstPercent = Number(v.gst_percent ?? 18);
    const amount = fee + Math.round((fee * gstPercent) / 100);

    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keyId || !keySecret) {
      throw new Error("Online payment is not available right now. Please call us to book your consultation.");
    }

    const reference = `VBC-${Math.floor(100000 + Math.random() * 900000)}`;
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        user_id: data.userId ?? null,
        reference,
        consultation_type: data.consultationType,
        booking_date: data.date,
        slot_time: data.slot,
        customer_name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
        status: "pending",
        payment_status: "pending",
        amount,
      })
      .select("id,reference,booking_date,slot_time,consultation_type")
      .single();
    if (error || !row) {
      if (error?.code === "23505") throw new Error("That time was just taken. Please choose another slot.");
      throw new Error(error?.message ?? "Could not start this booking.");
    }

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({ amount: Math.round(amount * 100), currency: "INR", receipt: reference }),
    });
    if (!res.ok) {
      await supabaseAdmin.from("bookings").delete().eq("id", row.id);
      throw new Error("Payment could not be started. Please try again.");
    }
    const rp = (await res.json()) as { id: string; amount: number };
    await supabaseAdmin.from("bookings").update({ razorpay_order_id: rp.id }).eq("id", row.id);

    return {
      reference: row.reference,
      booking_date: row.booking_date,
      slot_time: row.slot_time,
      consultation_type: row.consultation_type,
      amount,
      razorpay: { orderId: rp.id, keyId, amount: rp.amount },
    };
  });

export const confirmBookingPayment = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { reference: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
      data,
  )
  .handler(async ({ data }) => {
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keySecret) throw new Error("Online payment is not configured.");
    const { createHmac } = await import("crypto");
    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");
    if (expected !== data.razorpay_signature) throw new Error("Payment could not be verified.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ payment_status: "paid", status: "confirmed", razorpay_payment_id: data.razorpay_payment_id })
      .eq("reference", data.reference)
      .eq("razorpay_order_id", data.razorpay_order_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const cancelUnpaidBooking = createServerFn({ method: "POST" })
  .inputValidator((data: { reference: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("bookings").delete().eq("reference", data.reference).eq("payment_status", "pending");
    return { ok: true };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("An administrator already exists for this site.");
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminExists = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  return { exists: (count ?? 0) > 0 };
});
