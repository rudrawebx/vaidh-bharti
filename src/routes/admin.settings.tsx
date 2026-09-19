import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function AdminSettings() {
  const settings = useQuery({
    queryKey: ["admin-booking-settings"],
    queryFn: async () => (await supabase.from("booking_settings").select("*").maybeSingle()).data,
  });

  const coupons = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => (await supabase.from("coupons").select("*").order("code")).data ?? [],
  });

  const [start, setStart] = React.useState("09:00");
  const [end, setEnd] = React.useState("18:00");
  const [slot, setSlot] = React.useState("30");
  const [days, setDays] = React.useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [types, setTypes] = React.useState("");
  const [blocked, setBlocked] = React.useState("");

  React.useEffect(() => {
    const s = settings.data;
    if (!s) return;
    setStart(s.start_time.slice(0, 5));
    setEnd(s.end_time.slice(0, 5));
    setSlot(String(s.slot_minutes));
    setDays(s.working_days);
    setTypes(s.consultation_types.join(", "));
    setBlocked(s.blocked_dates.join(", "));
  }, [settings.data]);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("booking_settings")
      .update({
        start_time: start,
        end_time: end,
        slot_minutes: Number(slot) || 30,
        working_days: days,
        consultation_types: types.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 12),
        blocked_dates: blocked.split(",").map((d) => d.trim()).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)),
      })
      .eq("id", true);
    if (error) toast.error("Could not save the schedule.");
    else toast.success("Schedule saved.");
    void settings.refetch();
  };

  const shipping = useQuery({
    queryKey: ["admin-shipping"],
    queryFn: async () => (await supabase.from("site_settings").select("value").eq("key", "shipping").maybeSingle()).data,
  });

  const [flatRate, setFlatRate] = React.useState("60");
  const [freeAbove, setFreeAbove] = React.useState("999");
  const [deliveryNote, setDeliveryNote] = React.useState("");

  React.useEffect(() => {
    const v = shipping.data?.value as { flat_rate?: number; free_above?: number; note?: string } | undefined;
    if (!v) return;
    if (v.flat_rate !== undefined) setFlatRate(String(v.flat_rate));
    if (v.free_above !== undefined) setFreeAbove(String(v.free_above));
    if (v.note) setDeliveryNote(v.note);
  }, [shipping.data]);

  const saveShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "shipping",
        value: {
          flat_rate: Number(flatRate) || 0,
          free_above: Number(freeAbove) || 0,
          note: deliveryNote.trim().slice(0, 200),
        },
      },
      { onConflict: "key" },
    );
    if (error) toast.error("Could not save delivery charges.");
    else toast.success("Delivery charges saved.");
    void shipping.refetch();
  };

  const consult = useQuery({
    queryKey: ["admin-consultation-fee"],
    queryFn: async () => (await supabase.from("site_settings").select("value").eq("key", "consultation").maybeSingle()).data,
  });

  const [fee, setFee] = React.useState("300");
  const [gstPercent, setGstPercent] = React.useState("18");

  React.useEffect(() => {
    const v = consult.data?.value as { fee?: number; gst_percent?: number } | undefined;
    if (!v) return;
    if (v.fee !== undefined) setFee(String(v.fee));
    if (v.gst_percent !== undefined) setGstPercent(String(v.gst_percent));
  }, [consult.data]);

  const saveConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("site_settings").upsert(
      { key: "consultation", value: { fee: Number(fee) || 0, gst_percent: Number(gstPercent) || 0 } },
      { onConflict: "key" },
    );
    if (error) toast.error("Could not save the consultation fee.");
    else toast.success("Consultation fee saved.");
    void consult.refetch();
  };

  const feeTotal = Math.round(Number(fee) || 0) + Math.round(((Number(fee) || 0) * (Number(gstPercent) || 0)) / 100);

  const [code, setCode] = React.useState("");
  const [type, setType] = React.useState("percent");
  const [value, setValue] = React.useState("10");
  const [minAmount, setMinAmount] = React.useState("0");

  const addCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 3) {
      toast.error("Enter a coupon code.");
      return;
    }
    const { error } = await supabase.from("coupons").insert({
      code: code.trim().toUpperCase().slice(0, 24),
      discount_type: type,
      discount_value: Number(value) || 0,
      min_order_amount: Number(minAmount) || 0,
      is_active: true,
    });
    if (error) toast.error("Could not add the coupon.");
    else {
      toast.success("Coupon added.");
      setCode("");
    }
    void coupons.refetch();
  };

  const field = "mt-2 h-12 w-full rounded-sm border border-input bg-card px-3 text-sm";
  const label = "text-[11px] uppercase tracking-[0.16em] text-muted-foreground";

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={saveSettings} className="space-y-4 border border-border p-6">
        <h2 className="font-display text-2xl">Consultation schedule</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={label} htmlFor="s-start">Opens</label>
            <input id="s-start" type="time" className={field} value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="s-end">Closes</label>
            <input id="s-end" type="time" className={field} value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="s-slot">Slot (min)</label>
            <input id="s-slot" type="number" min="10" step="5" className={field} value={slot} onChange={(e) => setSlot(e.target.value)} />
          </div>
        </div>
        <fieldset>
          <legend className={label}>Working days</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {dayNames.map((d, i) => (
              <label key={d} className="flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs">
                <input
                  type="checkbox"
                  checked={days.includes(i)}
                  onChange={(e) => setDays((prev) => (e.target.checked ? [...prev, i].sort() : prev.filter((x) => x !== i)))}
                />
                {d.slice(0, 3)}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className={label} htmlFor="s-types">Consultation types (comma separated)</label>
          <input id="s-types" className={field} value={types} onChange={(e) => setTypes(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="s-blocked">Blocked dates (YYYY-MM-DD, comma separated)</label>
          <input id="s-blocked" className={field} value={blocked} onChange={(e) => setBlocked(e.target.value)} />
        </div>
        <button type="submit" className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
          Save schedule
        </button>
      </form>

      <div className="space-y-6">
        <form onSubmit={saveConsult} className="space-y-4 border border-border p-6">
          <h2 className="font-display text-2xl">Consultation fee</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="cf-fee">Fee (₹)</label>
              <input id="cf-fee" type="number" min="0" className={field} value={fee} onChange={(e) => setFee(e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="cf-gst">GST (%)</label>
              <input id="cf-gst" type="number" min="0" max="28" className={field} value={gstPercent} onChange={(e) => setGstPercent(e.target.value)} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Patients pay ₹{feeTotal} online to confirm a slot.</p>
          <button type="submit" className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            Save consultation fee
          </button>
        </form>

        <form onSubmit={saveShipping} className="space-y-4 border border-border p-6">
          <h2 className="font-display text-2xl">Delivery charges</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="sh-flat">Delivery charge (₹)</label>
              <input id="sh-flat" type="number" min="0" className={field} value={flatRate} onChange={(e) => setFlatRate(e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="sh-free">Free delivery above (₹)</label>
              <input id="sh-free" type="number" min="0" className={field} value={freeAbove} onChange={(e) => setFreeAbove(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label} htmlFor="sh-note">Delivery note shown at checkout</label>
            <input id="sh-note" className={field} maxLength={200} value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} />
          </div>
          <button type="submit" className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            Save delivery charges
          </button>
        </form>

        <form onSubmit={addCoupon} className="space-y-4 border border-border p-6">
          <h2 className="font-display text-2xl">Coupons</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="c-code">Code</label>
              <input id="c-code" className={field} value={code} maxLength={24} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="c-type">Type</label>
              <select id="c-type" className={field} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="percent">Percent off</option>
                <option value="fixed">Fixed ₹ off</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="c-value">Value</label>
              <input id="c-value" type="number" min="0" className={field} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="c-min">Minimum order ₹</label>
              <input id="c-min" type="number" min="0" className={field} value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="rounded-sm bg-primary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            Add coupon
          </button>
        </form>

        <ul className="divide-y divide-border border border-border">
          {coupons.data?.length ? (
            coupons.data.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <span>
                  <strong>{c.code}</strong> · {c.discount_type === "percent" ? `${c.discount_value}%` : `₹${c.discount_value}`} off
                  {c.min_order_amount ? ` · min ₹${c.min_order_amount}` : ""}
                </span>
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-destructive"
                  onClick={async () => {
                    await supabase.from("coupons").update({ is_active: !c.is_active }).eq("id", c.id);
                    void coupons.refetch();
                  }}
                >
                  {c.is_active ? "Disable" : "Enable"}
                </button>
              </li>
            ))
          ) : (
            <li className="p-4 text-sm text-muted-foreground">No coupons yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
