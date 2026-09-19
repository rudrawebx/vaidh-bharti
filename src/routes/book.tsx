import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";
import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import {
  cancelUnpaidBooking,
  confirmBookingPayment,
  createBooking,
  getAvailability,
  getConsultationFee,
} from "@/lib/bookings.functions";
import { useAuth } from "@/hooks/useAuth";
import { inr, site, telHref, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an Ayurvedic Consultation — Vaidh Bharti, Hansi" },
      {
        name: "description",
        content:
          "Choose a date and time for your Ayurvedic consultation, Nadi Pariksha or Panchakarma assessment with Vaidh Bharti at Panchsheel Aarogya Dhaam, Hansi.",
      },
      { property: "og:title", content: "Book an Ayurvedic Consultation — Vaidh Bharti" },
      { property: "og:description", content: "Reserve a time for consultation, Nadi Pariksha or Panchakarma assessment." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

const today = () => new Date().toISOString().slice(0, 10);

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function BookPage() {
  const { user } = useAuth();
  const [date, setDate] = React.useState(today());
  const [slot, setSlot] = React.useState<string | null>(null);
  const [type, setType] = React.useState("Ayurvedic Consultation");
  const [form, setForm] = React.useState({ name: "", phone: "", email: "", message: "" });
  const [busy, setBusy] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState<{
    reference: string;
    booking_date: string;
    slot_time: string;
    amount: number;
    payAtClinic?: boolean;
    whatsappText?: string;
  } | null>(null);

  const availability = useQuery({
    queryKey: ["availability", date],
    queryFn: () => getAvailability({ data: { date } }),
  });

  const fee = useQuery({ queryKey: ["consultation-fee"], queryFn: () => getConsultationFee() });

  React.useEffect(() => setSlot(null), [date]);
  React.useEffect(() => {
    if (user?.email && !form.email) setForm((f) => ({ ...f, email: user.email ?? "" }));
  }, [user, form.email]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) {
      toast.error("Please choose a time slot.");
      return;
    }
    setBusy(true);
    try {
      const res = await createBooking({
        data: {
          consultationType: type,
          date,
          slot,
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          userId: user?.id ?? null,
        },
      });

      if (res.payAtClinic || !res.razorpay) {
        setConfirmed({
          reference: res.reference,
          booking_date: res.booking_date,
          slot_time: res.slot_time,
          amount: res.amount,
          payAtClinic: true,
          whatsappText: res.whatsappText,
        });
        toast.success("Your appointment is reserved!");
        void availability.refetch();
        setBusy(false);
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) {
        await cancelUnpaidBooking({ data: { reference: res.reference } });
        throw new Error("Could not open the payment window. Please try again.");
      }

      const rp = new window.Razorpay!({
        key: res.razorpay.keyId,
        amount: res.razorpay.amount,
        currency: "INR",
        name: "Vaidh Bharti",
        description: `${res.consultation_type} · ${res.booking_date} ${res.slot_time}`,
        order_id: res.razorpay.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#2f4438" },
        modal: {
          ondismiss: () => {
            void cancelUnpaidBooking({ data: { reference: res.reference } }).then(() => availability.refetch());
            toast.error("Payment was not completed, so the slot was released.");
            setBusy(false);
          },
        },
        handler: async (r: Record<string, string>) => {
          try {
            await confirmBookingPayment({
              data: {
                reference: res.reference,
                razorpay_order_id: r["razorpay_order_id"] ?? "",
                razorpay_payment_id: r["razorpay_payment_id"] ?? "",
                razorpay_signature: r["razorpay_signature"] ?? "",
              },
            });
            setConfirmed({
              reference: res.reference,
              booking_date: res.booking_date,
              slot_time: res.slot_time,
              amount: res.amount,
              payAtClinic: false,
              whatsappText: res.whatsappText,
            });
            void availability.refetch();
          } catch {
            toast.error("Payment could not be verified. Please contact us with your reference number.");
          } finally {
            setBusy(false);
          }
        },
      });
      rp.open();
      return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not confirm this booking.");
      setBusy(false);
    }
  };

  if (confirmed) {
    const waUrl = `https://wa.me/${site.phone.replace("+", "")}?text=${
      confirmed.whatsappText ||
      encodeURIComponent(
        `Namaste Vaidh Bharti, I have booked a consultation.\nRef: ${confirmed.reference}\nDate: ${confirmed.booking_date} at ${confirmed.slot_time}`,
      )
    }`;

    return (
      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <CalendarCheck className="mx-auto h-12 w-12 text-gold" />
            <h1 className="mt-6 font-display text-4xl">Your consultation is booked</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Reference <span className="font-semibold text-foreground">{confirmed.reference}</span> ·{" "}
              {new Date(`${confirmed.booking_date}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "full" })} at{" "}
              {confirmed.slot_time}. Our clinic team will call you to confirm.
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {confirmed.payAtClinic ? `Fee ${inr(confirmed.amount)} (Pay at Clinic)` : `Paid ${inr(confirmed.amount)}`}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-sm bg-[#25D366] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm hover:bg-[#20bd5a] transition-colors"
              >
                Confirm on WhatsApp
              </a>
              <a
                href={telHref}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-sm border border-border bg-card px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground hover:border-gold transition-colors"
              >
                Call Clinic ({site.phoneDisplay})
              </a>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              Need to reschedule or have questions? Contact us on WhatsApp or call during clinic hours.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Consultation"
        title="Book Your Consultation"
        intro="Choose a date and time that suits you. Every consultation is unhurried and personal."
        crumbs={[{ label: "Book Consultation" }]}
      />
      <section className="py-16">
        <Container>
          <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-8">
              <div className="border border-border p-6">
                <h2 className="font-display text-2xl">1. Choose your consultation</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(availability.data?.types ?? ["Ayurvedic Consultation"]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={cn(
                        "rounded-sm border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]",
                        t === type ? "border-primary bg-primary text-primary-foreground" : "border-border text-primary",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-border p-6">
                <h2 className="font-display text-2xl">2. Pick a date and time</h2>
                <label htmlFor="bk-date" className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Date
                </label>
                <input
                  id="bk-date"
                  type="date"
                  min={today()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 h-12 w-full max-w-xs rounded-sm border border-input bg-card px-3 text-sm"
                />
                <div className="mt-6">
                  {availability.isLoading ? (
                    <p className="text-sm text-muted-foreground">Checking available times…</p>
                  ) : availability.data?.closed ? (
                    <p className="text-sm text-muted-foreground">The centre is closed on this date. Please choose another day.</p>
                  ) : availability.data?.slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">All times are booked for this date. Please choose another day.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availability.data?.slots.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSlot(s)}
                          className={cn(
                            "rounded-sm border px-4 py-3 text-sm",
                            s === slot ? "border-primary bg-primary text-primary-foreground" : "border-border",
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-border p-6">
                <h2 className="font-display text-2xl">3. Your details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bk-name" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Full name</label>
                    <input id="bk-name" required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="bk-phone" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Phone</label>
                    <input id="bk-phone" required maxLength={15} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-email" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Email (optional)</label>
                    <input id="bk-email" type="email" maxLength={120} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-msg" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">What would you like help with? (optional)</label>
                    <textarea id="bk-msg" rows={4} maxLength={600} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full rounded-sm border border-input bg-card p-3 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <aside className="h-fit border border-border p-6">
              <h2 className="font-display text-2xl">Your appointment</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Consultation</dt><dd className="text-right">{type}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Date</dt><dd>{new Date(`${date}T00:00:00`).toLocaleDateString("en-IN")}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Time</dt><dd>{slot ?? "Not selected"}</dd></div>
              </dl>
              <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Consultation fee</dt>
                  <dd>{inr(fee.data?.fee ?? 300)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">GST ({fee.data?.gstPercent ?? 18}%)</dt>
                  <dd>{inr(fee.data?.gst ?? 54)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-3 font-display text-2xl">
                  <dt>Payable now</dt>
                  <dd>{inr(fee.data?.total ?? 354)}</dd>
                </div>
              </dl>
              <button type="submit" disabled={busy || !slot} className="mt-6 w-full rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60">
                {busy ? "Opening payment…" : `Pay ${inr(fee.data?.total ?? 354)} & Confirm`}
              </button>
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                {site.hours}. Your slot is confirmed once the consultation fee is paid online. For urgent medical
                problems please see your treating doctor.
              </p>
            </aside>
          </form>
        </Container>
      </section>
    </>
  );
}
