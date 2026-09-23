import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, Bell, Truck, Tag, Calendar, CreditCard, ShieldCheck, Lock, Database, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { changeAdminPassword } from "@/lib/admin-auth.functions";
import { checkHostingerDbConnection, initializeHostingerDbTables } from "@/lib/database.functions";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function AdminSettings() {
  // 1. Business & Clinic Details
  const businessQuery = useQuery({
    queryKey: ["admin-business-settings"],
    queryFn: async () => (await supabase.from("site_settings").select("value").eq("key", "business_details").maybeSingle()).data,
  });

  const [legalName, setLegalName] = React.useState("Vaidh Bharti - Panchsheel Aarogya Dhaam");
  const [ownerName, setOwnerName] = React.useState("Vaidh Jitender Bharti");
  const [address, setAddress] = React.useState("Barwala Road, Near Shree Ram ITI, Hansi, Haryana 125033");
  const [bizPhone, setBizPhone] = React.useState("+91 99964 15501");
  const [bizEmail, setBizEmail] = React.useState("vaidbharti80@gmail.com");
  const [gstin, setGstin] = React.useState("");

  React.useEffect(() => {
    const v = businessQuery.data?.value as any;
    if (!v) return;
    if (v.legal_name) setLegalName(v.legal_name);
    if (v.owner_name) setOwnerName(v.owner_name);
    if (v.address) setAddress(v.address);
    if (v.phone) setBizPhone(v.phone);
    if (v.email) setBizEmail(v.email);
    if (v.gstin !== undefined) setGstin(v.gstin || "");
  }, [businessQuery.data]);

  const saveBusinessDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "business_details",
        value: {
          legal_name: legalName.trim(),
          owner_name: ownerName.trim(),
          address: address.trim(),
          phone: bizPhone.trim(),
          email: bizEmail.trim(),
          gstin: gstin.trim() || null,
        },
      },
      { onConflict: "key" },
    );
    if (error) toast.error("Could not save clinic & business details.");
    else toast.success("Business details updated successfully.");
    void businessQuery.refetch();
  };

  // 2. Notification & Payment Settings
  const notifQuery = useQuery({
    queryKey: ["admin-notification-settings"],
    queryFn: async () => (await supabase.from("site_settings").select("value").eq("key", "notification_settings").maybeSingle()).data,
  });

  const [adminEmails, setAdminEmails] = React.useState("info@vaidhbharti.com");
  const [whatsappPhone, setWhatsappPhone] = React.useState("+91 99960 99946");
  const [codEnabled, setCodEnabled] = React.useState(true);
  const [onlineEnabled, setOnlineEnabled] = React.useState(true);

  React.useEffect(() => {
    const v = notifQuery.data?.value as any;
    if (!v) return;
    if (v.admin_emails) setAdminEmails(Array.isArray(v.admin_emails) ? v.admin_emails.join(", ") : v.admin_emails);
    if (v.whatsapp_phone) setWhatsappPhone(v.whatsapp_phone);
    if (v.cod_enabled !== undefined) setCodEnabled(Boolean(v.cod_enabled));
    if (v.online_enabled !== undefined) setOnlineEnabled(Boolean(v.online_enabled));
  }, [notifQuery.data]);

  const saveNotificationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailsList = adminEmails.split(",").map((x) => x.trim()).filter(Boolean);
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "notification_settings",
        value: {
          admin_emails: emailsList,
          whatsapp_phone: whatsappPhone.trim(),
          cod_enabled: codEnabled,
          online_enabled: onlineEnabled,
        },
      },
      { onConflict: "key" },
    );
    if (error) toast.error("Could not save notification & payment settings.");
    else toast.success("Settings saved successfully.");
    void notifQuery.refetch();
  };

  // 3. Consultation Schedule Settings
  const settings = useQuery({
    queryKey: ["admin-booking-settings"],
    queryFn: async () => (await supabase.from("booking_settings").select("*").maybeSingle()).data,
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

  const saveSchedule = async (e: React.FormEvent) => {
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

  // 4. Shipping Delivery Charges
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

  // 5. Consultation Fee
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
    if (error) toast.error("Could not save consultation fee.");
    else toast.success("Consultation fee saved.");
    void consult.refetch();
  };

  // 6. Coupons
  const coupons = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => (await supabase.from("coupons").select("*").order("code")).data ?? [],
  });

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

  const [currPass, setCurrPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [updatingPass, setUpdatingPass] = React.useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("vb_admin_token") || "" : "";
    if (!token) {
      toast.error("Please sign in with administrator credentials first.");
      return;
    }
    setUpdatingPass(true);
    try {
      const res = await changeAdminPassword({
        data: {
          token,
          currentPassword: currPass,
          newPassword: newPass,
        },
      });
      toast.success(res.message || "Password updated successfully!");
      setCurrPass("");
      setNewPass("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setUpdatingPass(false);
    }
  };

  const [testingDb, setTestingDb] = React.useState(false);
  const [initializingDb, setInitializingDb] = React.useState(false);

  const handleTestDb = async () => {
    setTestingDb(true);
    try {
      const res = await checkHostingerDbConnection();
      if (res?.ok) {
        toast.success(res.message);
      } else {
        toast.error(res?.message || "Could not connect to Hostinger database.");
      }
    } catch (err: any) {
      toast.error(err.message || "Database connection test failed.");
    } finally {
      setTestingDb(false);
    }
  };

  const handleInitTables = async () => {
    if (!window.confirm("Initialize or update all tables in Hostinger MySQL database?")) return;
    setInitializingDb(true);
    try {
      const res = await initializeHostingerDbTables();
      if (res?.success) {
        toast.success(`Hostinger MySQL schema initialized! ${res.executed} tables created/verified.`);
      } else {
        toast.error(res?.error || "Failed to create tables.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize tables.");
    } finally {
      setInitializingDb(false);
    }
  };

  const field = "mt-2 h-11 w-full rounded-sm border border-input bg-card px-3 text-sm focus:ring-1 focus:ring-primary";
  const label = "text-[11px] uppercase tracking-[0.16em] text-muted-foreground";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl">Store &amp; Clinic Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage business credentials, GST invoices, automated notification dispatch, delivery rates, and consultation fees.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Business Credentials & Shipping */}
        <div className="space-y-8">
          {/* Business Details */}
          <form onSubmit={saveBusinessDetails} className="space-y-4 rounded-sm border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Building2 className="h-4 w-4 text-gold" />
              <h2 className="font-display text-xl">Business &amp; Tax Invoice Details</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              These details are printed on customer invoices and official receipts.
            </p>

            <div>
              <label className={label} htmlFor="biz-legal">Legal Entity / Brand Name</label>
              <input id="biz-legal" className={field} value={legalName} onChange={(e) => setLegalName(e.target.value)} required />
            </div>

            <div>
              <label className={label} htmlFor="biz-owner">Founder &amp; Chief Practitioner</label>
              <input id="biz-owner" className={field} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
            </div>

            <div>
              <label className={label} htmlFor="biz-addr">Clinic Physical Address</label>
              <textarea
                id="biz-addr"
                rows={2}
                className="mt-2 w-full rounded-sm border border-input bg-card p-3 text-sm focus:ring-1 focus:ring-primary"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label} htmlFor="biz-phone">Clinic Support Phone</label>
                <input id="biz-phone" className={field} value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} required />
              </div>
              <div>
                <label className={label} htmlFor="biz-email">Official Support Email</label>
                <input id="biz-email" type="email" className={field} value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className={label} htmlFor="biz-gst">GSTIN (Optional — Only if GST Registered)</label>
              <input
                id="biz-gst"
                className={field}
                placeholder="e.g. 06AAAAA0000A1Z5 (Leave blank if unverified)"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Invoices only display a GSTIN if provided here. No placeholder GSTIN is ever shown.
              </p>
            </div>

            <button type="submit" className="rounded-sm bg-primary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90">
              Save Business Details
            </button>
          </form>

          {/* Hostinger MySQL Database Status & Actions */}
          <div className="space-y-4 rounded-sm border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Database className="h-4 w-4 text-gold" />
              <h2 className="font-display text-xl">Hostinger MySQL Database</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Production database configured with Hostinger MySQL credentials.
            </p>

            <div className="rounded-sm bg-muted/40 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database Name:</span>
                <span className="font-mono font-bold text-foreground">u931854669_vaidbharti</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database User:</span>
                <span className="font-mono font-bold text-foreground">u931854669_vaidbharti</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Host:</span>
                <span className="font-mono text-foreground">localhost (Port 3306)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password Status:</span>
                <span className="font-mono font-bold text-emerald-700">Configured (VaidhBharti@2026)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={handleTestDb}
                disabled={testingDb}
                className="flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testingDb ? "animate-spin" : ""}`} />
                {testingDb ? "Testing Connection..." : "Test Connection"}
              </button>

              <button
                type="button"
                onClick={handleInitTables}
                disabled={initializingDb}
                className="flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground hover:bg-muted disabled:opacity-50"
              >
                <Database className="h-3.5 w-3.5 text-gold" />
                {initializingDb ? "Creating Tables..." : "Create / Sync Tables"}
              </button>
            </div>
          </div>

          {/* Shipping Rates */}
          <form onSubmit={saveShipping} className="space-y-4 rounded-sm border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Truck className="h-4 w-4 text-gold" />
              <h2 className="font-display text-xl">Shipping &amp; Delivery Rates</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label} htmlFor="sh-flat">Standard Delivery (₹)</label>
                <input id="sh-flat" type="number" min="0" className={field} value={flatRate} onChange={(e) => setFlatRate(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="sh-free">Free Delivery Above (₹)</label>
                <input id="sh-free" type="number" min="0" className={field} value={freeAbove} onChange={(e) => setFreeAbove(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="sh-note">Delivery Note Shown at Checkout</label>
              <input id="sh-note" className={field} maxLength={200} value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} />
            </div>
            <button type="submit" className="rounded-sm bg-primary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90">
              Save Delivery Charges
            </button>
          </form>

          {/* Admin Password Change */}
          <form onSubmit={handlePasswordChange} className="space-y-4 rounded-sm border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Lock className="h-4 w-4 text-gold" />
              <h2 className="font-display text-xl">Admin Security &amp; Password</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Update the master administrator login password for Vaidh Bharti.
            </p>

            <div>
              <label className={label} htmlFor="cur-pass">Current Password</label>
              <input
                id="cur-pass"
                type="password"
                required
                className={field}
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className={label} htmlFor="new-pass">New Password</label>
              <input
                id="new-pass"
                type="password"
                required
                minLength={6}
                className={field}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPass}
              className="rounded-sm bg-primary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {updatingPass ? "Updating Password..." : "Update Admin Password"}
            </button>
          </form>
        </div>

        {/* Right Column: Notifications, Payments & Coupons */}
        <div className="space-y-8">
          {/* Notification & Payment Settings */}
          <form onSubmit={saveNotificationSettings} className="space-y-4 rounded-sm border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Bell className="h-4 w-4 text-gold" />
              <h2 className="font-display text-xl">Order Alerts &amp; Payment Toggles</h2>
            </div>

            <div>
              <label className={label} htmlFor="n-emails">Admin Dispatch Alert Emails</label>
              <input
                id="n-emails"
                className={field}
                placeholder="info@vaidhbharti.com, orders@vaidhbharti.com"
                value={adminEmails}
                onChange={(e) => setAdminEmails(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Receives automated notifications when new orders are placed. Comma separated.
              </p>
            </div>

            <div>
              <label className={label} htmlFor="n-phone">WhatsApp Business Number</label>
              <input
                id="n-phone"
                className={field}
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Pre-populated for customer WhatsApp confirmation buttons.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={(e) => setCodEnabled(e.target.checked)}
                  className="rounded-xs"
                />
                <span>Enable Cash on Delivery (COD) at checkout</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlineEnabled}
                  onChange={(e) => setOnlineEnabled(e.target.checked)}
                  className="rounded-xs"
                />
                <span>Enable Razorpay Online (UPI, Cards, NetBanking)</span>
              </label>
            </div>

            <button type="submit" className="rounded-sm bg-primary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90">
              Save Notification Settings
            </button>
          </form>

          {/* Consultation Fee & GST */}
          <form onSubmit={saveConsult} className="space-y-4 rounded-sm border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Calendar className="h-4 w-4 text-gold" />
              <h2 className="font-display text-xl">Consultation Fee &amp; Tax</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label} htmlFor="cf-fee">Base Fee (₹)</label>
                <input id="cf-fee" type="number" min="0" className={field} value={fee} onChange={(e) => setFee(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="cf-gst">GST (%)</label>
                <input id="cf-gst" type="number" min="0" max="28" className={field} value={gstPercent} onChange={(e) => setGstPercent(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="rounded-sm bg-primary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90">
              Save Consultation Fee
            </button>
          </form>

          {/* Coupons */}
          <div className="rounded-sm border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Tag className="h-4 w-4 text-gold" />
              <h2 className="font-display text-xl">Discount Coupons</h2>
            </div>

            <form onSubmit={addCoupon} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label} htmlFor="c-code">Coupon Code</label>
                  <input id="c-code" className={field} value={code} maxLength={24} placeholder="e.g. AYURVEDA10" onChange={(e) => setCode(e.target.value)} />
                </div>
                <div>
                  <label className={label} htmlFor="c-type">Type</label>
                  <select id="c-type" className={field} value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="percent">Percentage Off (%)</option>
                    <option value="fixed">Fixed Amount Off (₹)</option>
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="c-value">Value</label>
                  <input id="c-value" type="number" min="0" className={field} value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
                <div>
                  <label className={label} htmlFor="c-min">Min Order (₹)</label>
                  <input id="c-min" type="number" min="0" className={field} value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="rounded-sm bg-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90">
                Create Coupon
              </button>
            </form>

            <ul className="divide-y divide-border border border-border text-xs">
              {coupons.data?.length ? (
                coupons.data.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 p-3">
                    <span>
                      <strong className="font-mono text-sm">{c.code}</strong> ·{" "}
                      {c.discount_type === "percent" ? `${c.discount_value}%` : `₹${c.discount_value}`} off
                      {c.min_order_amount ? ` (min ₹${c.min_order_amount})` : ""}
                    </span>
                    <button
                      type="button"
                      className="text-[10px] uppercase tracking-[0.14em] font-semibold text-muted-foreground hover:text-foreground"
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
                <li className="p-3 text-muted-foreground">No coupons created yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
