import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Video, Phone, MapPin, HeartPulse } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CONSULTATION_TYPES, TIME_SLOTS, formatPrice } from "@/data/catalog";
import { BRAND, btn, cx } from "@/lib/brand";
import { FAQSection } from "@/components/FAQSection";

export const Route = createFileRoute("/consultation")({
  component: Consultation,
  head: () => ({
    meta: [
      { title: "Book an Ayurvedic Consultation — Online or In Person" },
      {
        name: "description",
        content:
          "Book an online, phone or in-person Ayurvedic consultation, or a traditional Nadi Pariksha at Panchsheel Aarogya Dhaam, Hansi.",
      },
      { property: "og:title", content: "Book an Ayurvedic Consultation | Vaidh Bharti" },
      {
        property: "og:description",
        content: "Personalised Ayurvedic guidance from experienced Vaidyas — online or in person.",
      },
      { property: "og:url", content: "/consultation" },
    ],
    links: [{ rel: "canonical", href: "/consultation" }],
  }),
});

const icons: Record<string, typeof Video> = {
  video: Video,
  phone: Phone,
  map: MapPin,
  heart: HeartPulse,
};

const field =
  "mt-2 w-full rounded-md border border-border bg-card px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-primary";

function Consultation() {
  const [typeId, setTypeId] = useState(CONSULTATION_TYPES[0]!.id);
  const [slot, setSlot] = useState(TIME_SLOTS[0]!);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const selected = CONSULTATION_TYPES.find((t) => t.id === typeId)!;

  return (
    <>
      <PageHero
        eyebrow="Consultation"
        crumb="Consultation"
        title="Book an Ayurvedic Consultation"
        subtitle="Speak with an experienced Vaidya online, by phone, or in person at our centre in Hansi."
      />

      <section className="py-16 md:py-24">
        <div className="container-vb grid gap-14 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="display-2 rule-gold">Choose a consultation</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {CONSULTATION_TYPES.map((t) => {
                const Icon = icons[t.icon] ?? Video;
                const active = t.id === typeId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeId(t.id)}
                    aria-pressed={active}
                    className={cx(
                      "rounded-lg border p-6 text-left transition-colors",
                      active
                        ? "border-primary bg-cream"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <Icon className="size-5 text-gold" aria-hidden="true" />
                    <p className="mt-4 font-display text-2xl">{t.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                    <p className="mt-3 text-sm font-medium text-primary">
                      {formatPrice(t.price)}
                    </p>
                  </button>
                );
              })}
            </div>

            {bookingId ? (
              <div
                role="status"
                className="mt-10 rounded-lg border border-primary/25 bg-cream p-7"
              >
                <Check className="size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-display text-2xl">Booking received</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your booking ID is <strong>{bookingId}</strong>. Our team will
                  confirm your {selected.name.toLowerCase()} at {slot} shortly.
                  For any change, call {BRAND.phone}.
                </p>
              </div>
            ) : (
              <form
                className="mt-10 grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setBookingId(
                    "VB-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
                  );
                }}
              >
                <div>
                  <label htmlFor="cname" className="text-sm font-medium">
                    Full name
                  </label>
                  <input id="cname" required className={field} />
                </div>
                <div>
                  <label htmlFor="cphone" className="text-sm font-medium">
                    Phone
                  </label>
                  <input id="cphone" type="tel" required className={field} />
                </div>
                <div>
                  <label htmlFor="cemail" className="text-sm font-medium">
                    Email
                  </label>
                  <input id="cemail" type="email" required className={field} />
                </div>
                <div>
                  <label htmlFor="cdate" className="text-sm font-medium">
                    Preferred date
                  </label>
                  <input id="cdate" type="date" required className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cslot" className="text-sm font-medium">
                    Preferred time
                  </label>
                  <select
                    id="cslot"
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className={field}
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cconcern" className="text-sm font-medium">
                    Health concern
                  </label>
                  <textarea id="cconcern" rows={5} className={field} />
                </div>
                <button type="submit" className={cx(btn.base, btn.primary)}>
                  Confirm Booking · {formatPrice(selected.price)}
                </button>
              </form>
            )}
          </div>

          <aside className="h-max rounded-lg border border-border p-7">
            <h2 className="font-display text-2xl">What to expect</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "A detailed conversation about your history, routine and digestion",
                "Dosha assessment and, in person, Nadi Pariksha",
                "A written plan covering diet, routine and herbal support",
                "Follow-up guidance as your plan progresses",
              ].map((p) => (
                <li key={p} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-7 border-t border-border pt-6 text-sm text-muted-foreground">
              <p>{BRAND.hours}</p>
              <p className="mt-2">
                Prefer to talk first?{" "}
                <a href={BRAND.phoneHref} className="text-primary hover:underline">
                  {BRAND.phone}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
      <FAQSection className="bg-cream" />
    </>
  );
}
