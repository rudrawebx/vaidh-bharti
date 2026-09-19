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
    let settings = {
      start_time: "10:00",
      end_time: "18:00",
      slot_minutes: 30,
      working_days: [1, 2, 3, 4, 5, 6],
      blocked_dates: [] as string[],
      blocked_slots: [] as string[],
      consultation_types: [
        "Nadi Pariksha & Pulse Assessment",
        "Personalized Ayurvedic Consultation",
        "Panchakarma Guidance & Detox",
        "Ayurvedic Lifestyle & Diet Consultation",
      ],
    };

    try {
      const { publicClient } = await import("./supabase-public.server");
      const supabase = publicClient();
      const { data: dbSettings } = await supabase.from("booking_settings").select("*").maybeSingle();
      if (dbSettings) {
        settings = { ...settings, ...dbSettings };
      }
    } catch (err) {
      console.warn("Could not query booking_settings, using defaults:", err);
    }

    const day = new Date(`${data.date}T00:00:00`).getDay();
    const workingDays = settings.working_days ?? [1, 2, 3, 4, 5, 6];
    const blockedDates = settings.blocked_dates ?? [];
    const closed = !workingDays.includes(day) || blockedDates.includes(data.date);

    const all = buildSlots(settings.start_time, settings.end_time, settings.slot_minutes);
    try {
      await clearAbandonedHolds();
    } catch {}

    let taken = new Set<string>();
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: booked } = await supabaseAdmin
        .from("bookings")
        .select("slot_time")
        .eq("booking_date", data.date)
        .neq("status", "cancelled");
      taken = new Set((booked ?? []).map((b) => b.slot_time.slice(0, 5)));
    } catch {}

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
    let amount = 354;
    try {
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
      amount = fee + Math.round((fee * gstPercent) / 100);
    } catch {}

    const reference = `VBC-${Math.floor(100000 + Math.random() * 900000)}`;
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    const isRazorpayConfigured = Boolean(keyId && keySecret);

    let row = {
      id: "local-" + reference,
      reference,
      booking_date: data.date,
      slot_time: data.slot,
      consultation_type: data.consultationType,
    };

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: dbRow, error } = await supabaseAdmin
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
          status: isRazorpayConfigured ? "pending" : "confirmed",
          payment_status: isRazorpayConfigured ? "pending" : "pay_at_clinic",
          amount,
        })
        .select("id,reference,booking_date,slot_time,consultation_type")
        .single();
      if (!error && dbRow) {
        row = dbRow;
      }
    } catch (err) {
      console.warn("Could not write booking to Supabase, continuing:", err);
    }

    // Send clinic email notification
    try {
      const { sendClinicEmailNotification } = await import("./notifications.server");
      await sendClinicEmailNotification({
        subject: `New Consultation Booking: ${data.name} (${row.reference})`,
        body: `
New Appointment Booking at Panchsheel Aarogya Dhaam (Vaidh Bharti):
-----------------------------------------------------------
Reference: ${row.reference}
Patient Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || "Not provided"}
Consultation Type: ${data.consultationType}
Appointment Date: ${data.date}
Time Slot: ${data.slot}
Fee: ₹${amount} (${isRazorpayConfigured ? "Payment Online (Pending)" : "Pay at Clinic"})
Notes / Health Concern: ${data.message || "None"}
-----------------------------------------------------------
Booked at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
        `.trim(),
      });
    } catch (err) {
      console.error("Clinic notification email error:", err);
    }

    const whatsappText = encodeURIComponent(
      `Namaste Vaidh Bharti, I have booked a consultation.\nRef: ${row.reference}\nName: ${data.name}\nService: ${data.consultationType}\nDate: ${data.date} at ${data.slot}`,
    );

    if (!isRazorpayConfigured) {
      return {
        reference: row.reference,
        booking_date: row.booking_date,
        slot_time: row.slot_time,
        consultation_type: row.consultation_type,
        amount,
        payAtClinic: true,
        whatsappText,
        razorpay: null,
      };
    }

    // Initiate Razorpay order
    try {
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        },
        body: JSON.stringify({ amount: Math.round(amount * 100), currency: "INR", receipt: reference }),
      });
      if (res.ok) {
        const rp = (await res.json()) as { id: string; amount: number };
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("bookings").update({ razorpay_order_id: rp.id }).eq("id", row.id);
        } catch {}
        return {
          reference: row.reference,
          booking_date: row.booking_date,
          slot_time: row.slot_time,
          consultation_type: row.consultation_type,
          amount,
          payAtClinic: false,
          whatsappText,
          razorpay: { orderId: rp.id, keyId, amount: rp.amount },
        };
      }
    } catch (e) {
      console.warn("Razorpay order creation failed, falling back to pay-at-clinic:", e);
    }

    return {
      reference: row.reference,
      booking_date: row.booking_date,
      slot_time: row.slot_time,
      consultation_type: row.consultation_type,
      amount,
      payAtClinic: true,
      whatsappText,
      razorpay: null,
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
