import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Container } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/site";
import { confirmPayment, getPaymentConfig, placeOrder, quoteCart } from "@/lib/orders.functions";
import { getOtpConfig, sendOtp, verifyOtp } from "@/lib/otp.functions";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Vaidh Bharti Ayurveda" },
      { name: "description", content: "Complete your Ayurvedic product order securely." },
      { property: "og:title", content: "Checkout — Vaidh Bharti Ayurveda" },
      { property: "og:description", content: "Complete your Ayurvedic product order securely." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

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

const field = "mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm";

function Checkout() {
  const { items, lines, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [payment, setPayment] = React.useState<"cod" | "razorpay">("cod");
  const [placing, setPlacing] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "Haryana",
    pincode: "",
    notes: "",
  });

  const [otpSent, setOtpSent] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [phoneVerified, setPhoneVerified] = React.useState(false);
  const [otpBusy, setOtpBusy] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  const payConfig = useQuery({ queryKey: ["payment-config"], queryFn: () => getPaymentConfig() });
  const otpConfig = useQuery({ queryKey: ["otp-config"], queryFn: () => getOtpConfig() });
  const otpRequired = otpConfig.data?.otpEnabled ?? false;

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const requestCode = async () => {
    setOtpBusy(true);
    try {
      await sendOtp({ data: { phone: form.phone } });
      setOtpSent(true);
      setCooldown(30);
      toast.success("We sent a 6-digit code to your mobile.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send the code.");
    } finally {
      setOtpBusy(false);
    }
  };

  const submitCode = async () => {
    setOtpBusy(true);
    try {
      await verifyOtp({ data: { phone: form.phone, code: otpCode } });
      setPhoneVerified(true);
      toast.success("Mobile number verified.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "That code is not correct.");
    } finally {
      setOtpBusy(false);
    }
  };
  const quote = useQuery({
    queryKey: ["quote", lines, appliedCoupon],
    queryFn: () =>
      quoteCart({
        data: {
          items: lines.map((l) => ({ slug: l.slug, variantLabel: l.variantLabel, qty: l.qty })),
          couponCode: appliedCoupon,
        },
      }),
    enabled: lines.length > 0,
  });

  React.useEffect(() => {
    if (user?.email && !form.email) setForm((f) => ({ ...f, email: user.email ?? "" }));
  }, [user, form.email]);

  React.useEffect(() => {
    if (quote.data?.couponError) toast.error(quote.data.couponError);
  }, [quote.data?.couponError]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (k === "phone") {
      setPhoneVerified(false);
      setOtpSent(false);
      setOtpCode("");
    }
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setPlacing(true);
    try {
      const result = await placeOrder({
        data: {
          items: lines.map((l) => ({ slug: l.slug, variantLabel: l.variantLabel, qty: l.qty })),
          couponCode: appliedCoupon,
          paymentMethod: payment,
          userId: user?.id ?? null,
          customer: form,
        },
      });

      if (result.razorpay) {
        const ok = await loadRazorpay();
        if (!ok) throw new Error("Could not load the payment window. Please try again.");
        const rp = new window.Razorpay!({
          key: result.razorpay.keyId,
          amount: result.razorpay.amount,
          currency: "INR",
          name: "Vaidh Bharti",
          description: `Order ${result.orderNumber}`,
          order_id: result.razorpay.orderId,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#2f4438" },
          handler: async (res: Record<string, string>) => {
            try {
              await confirmPayment({
                data: {
                  orderNumber: result.orderNumber,
                  razorpay_order_id: res["razorpay_order_id"] ?? "",
                  razorpay_payment_id: res["razorpay_payment_id"] ?? "",
                  razorpay_signature: res["razorpay_signature"] ?? "",
                },
              });
              clear();
              navigate({ to: "/order/$number", params: { number: result.orderNumber } });
            } catch {
              toast.error("Payment could not be verified. Please contact us with your order number.");
            }
          },
        });
        rp.open();
        setPlacing(false);
        return;
      }

      clear();
      navigate({ to: "/order/$number", params: { number: result.orderNumber } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place the order.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <PageHero eyebrow="Checkout" title="Your cart is empty" intro="Add a product before checking out." crumbs={[{ label: "Checkout" }]} />
        <Container>
          <div className="py-16 text-center">
            <Link to="/products" className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              Browse Products
            </Link>
          </div>
        </Container>
      </>
    );
  }

  const q = quote.data;

  return (
    <>
      <PageHero eyebrow="Checkout" title="Complete Your Order" intro="Delivery details and payment." crumbs={[{ label: "Checkout" }]} />
      <section className="py-16">
        <Container>
          <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-8">
              <div className="border border-border p-6">
                <h2 className="font-display text-2xl">Delivery details</h2>
                {!user ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Checking out as a guest.{" "}
                    <Link to="/auth" search={{ redirect: undefined }} className="text-gold">
                      Sign in
                    </Link>{" "}
                    to save your orders.
                  </p>
                ) : null}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="co-name" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Full name</label>
                    <input id="co-name" required maxLength={80} value={form.name} onChange={set("name")} className={field} />
                  </div>
                  <div>
                    <label htmlFor="co-phone" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Mobile number</label>
                    <div className="flex gap-2">
                      <input id="co-phone" required maxLength={15} value={form.phone} onChange={set("phone")} className={field} />
                      {otpRequired && !phoneVerified ? (
                        <button
                          type="button"
                          onClick={requestCode}
                          disabled={otpBusy || cooldown > 0 || form.phone.replace(/\D/g, "").length < 10}
                          className="mt-2 shrink-0 rounded-sm border border-border px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary disabled:opacity-50"
                        >
                          {cooldown > 0 ? `${cooldown}s` : otpSent ? "Resend" : "Verify"}
                        </button>
                      ) : null}
                    </div>
                    {otpRequired && phoneVerified ? (
                      <p className="mt-2 text-xs font-semibold text-gold">Mobile number verified</p>
                    ) : null}
                    {otpRequired && otpSent && !phoneVerified ? (
                      <div className="mt-2 flex gap-2">
                        <label htmlFor="co-otp" className="sr-only">SMS code</label>
                        <input
                          id="co-otp"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="6-digit code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          className="h-12 flex-1 rounded-sm border border-input bg-card px-3 text-sm"
                        />
                        <button
                          type="button"
                          onClick={submitCode}
                          disabled={otpBusy || otpCode.length < 4}
                          className="shrink-0 rounded-sm bg-primary px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-50"
                        >
                          Confirm code
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="co-email" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Email (optional)</label>
                    <input id="co-email" type="email" maxLength={120} value={form.email} onChange={set("email")} className={field} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="co-a1" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Address</label>
                    <input id="co-a1" required maxLength={160} value={form.address1} onChange={set("address1")} className={field} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="co-a2" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Landmark (optional)</label>
                    <input id="co-a2" maxLength={160} value={form.address2} onChange={set("address2")} className={field} />
                  </div>
                  <div>
                    <label htmlFor="co-city" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">City</label>
                    <input id="co-city" required maxLength={60} value={form.city} onChange={set("city")} className={field} />
                  </div>
                  <div>
                    <label htmlFor="co-state" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">State</label>
                    <input id="co-state" required maxLength={60} value={form.state} onChange={set("state")} className={field} />
                  </div>
                  <div>
                    <label htmlFor="co-pin" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Pincode</label>
                    <input id="co-pin" required maxLength={6} value={form.pincode} onChange={set("pincode")} className={field} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="co-notes" className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Order notes (optional)</label>
                    <textarea id="co-notes" maxLength={500} rows={3} value={form.notes} onChange={set("notes")} className="mt-2 w-full rounded-sm border border-input bg-card p-3 text-sm" />
                  </div>
                </div>
              </div>

              <div className="border border-border p-6">
                <h2 className="font-display text-2xl">Payment</h2>
                <div className="mt-4 space-y-3">
                  <label className={cn("flex cursor-pointer items-start gap-3 rounded-sm border p-4", payment === "cod" ? "border-gold" : "border-border")}>
                    <input type="radio" name="payment" checked={payment === "cod"} onChange={() => setPayment("cod")} className="mt-1" />
                    <span>
                      <span className="block text-sm font-semibold">Cash on delivery</span>
                      <span className="block text-xs text-muted-foreground">Pay the courier when your order arrives.</span>
                    </span>
                  </label>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-sm border p-4",
                      payment === "razorpay" ? "border-gold" : "border-border",
                      !payConfig.data?.razorpayEnabled && "opacity-60",
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      disabled={!payConfig.data?.razorpayEnabled}
                      checked={payment === "razorpay"}
                      onChange={() => setPayment("razorpay")}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-semibold">Pay online (UPI, cards, netbanking)</span>
                      <span className="block text-xs text-muted-foreground">
                        {payConfig.data?.razorpayEnabled
                          ? "Secure payment through Razorpay."
                          : "Online payment becomes available as soon as the Razorpay keys are added."}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <aside className="h-fit border border-border p-6">
              <h2 className="font-display text-2xl">Order summary</h2>
              <ul className="mt-5 space-y-4 text-sm">
                {items.map((i) => (
                  <li key={i.key} className="flex justify-between gap-4">
                    <span>
                      {i.product.name}
                      {i.variantLabel ? ` · ${i.variantLabel}` : ""} × {i.qty}
                    </span>
                    <span>{inr(i.unitPrice * i.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex gap-2">
                <label htmlFor="co-coupon" className="sr-only">Coupon code</label>
                <input
                  id="co-coupon"
                  value={coupon}
                  maxLength={30}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="h-12 flex-1 rounded-sm border border-input bg-card px-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(coupon.trim() ? coupon.trim().toUpperCase() : null)}
                  className="rounded-sm border border-border px-4 text-[11px] font-semibold uppercase tracking-[0.14em]"
                >
                  Apply
                </button>
              </div>

              <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{inr(q?.subtotal ?? 0)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{q && q.shipping === 0 ? "Free" : inr(q?.shipping ?? 0)}</dd>
                </div>
                {q?.discount ? (
                  <div className="flex justify-between text-gold">
                    <dt>Discount ({q.couponCode})</dt>
                    <dd>−{inr(q.discount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-border pt-3 font-display text-2xl">
                  <dt>Total</dt>
                  <dd>{inr(q?.total ?? 0)}</dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={placing || quote.isLoading || (otpRequired && !phoneVerified)}
                className="mt-6 w-full rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60"
              >
                {placing ? "Placing order…" : payment === "cod" ? "Place Order" : "Pay Now"}
              </button>
              {otpRequired && !phoneVerified ? (
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Verify your mobile number above to place this order.
                </p>
              ) : null}
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                By placing this order you agree to our{" "}
                <Link to="/terms" className="text-gold">terms</Link>,{" "}
                <Link to="/shipping-policy" className="text-gold">shipping</Link> and{" "}
                <Link to="/refund-policy" className="text-gold">refund</Link> policies.
              </p>
            </aside>
          </form>
        </Container>
      </section>
    </>
  );
}
