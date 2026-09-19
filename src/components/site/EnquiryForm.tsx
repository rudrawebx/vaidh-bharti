import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { submitEnquiry } from "@/lib/enquiries.functions";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+0-9 ()-]+$/, "Phone number can only contain digits and + ( ) -"),
  email: z.string().trim().email("Please enter a valid email address").max(160).or(z.literal("")),
  topic: z.string().trim().max(80),
  message: z.string().trim().max(1000, "Message must be under 1000 characters"),
});

const topics = [
  "Ayurvedic Consultation",
  "Nadi Pariksha",
  "Panchakarma",
  "Lifestyle Guidance",
  "Ayurvedic Products",
  "Other",
];

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [errors, setErrors] = React.useState<Errors>({});
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle");
  const [waLink, setWaLink] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const next: Errors = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as keyof Errors;
        if (!next[key]) next[key] = i.message;
      });
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setStatus("loading");
    try {
      const res = await submitEnquiry({
        data: {
          name: parsed.data.name,
          phone: parsed.data.phone,
          email: parsed.data.email || "",
          enquiryType: parsed.data.topic || "General Consultation",
          subject: `Website Enquiry: ${parsed.data.topic || "Consultation"}`,
          message: parsed.data.message,
        },
      });
      setStatus("success");
      setWaLink(`https://wa.me/${site.phone.replace("+", "")}?text=${res.whatsappText}`);
      form.reset();
      toast.success("Thank you! Your enquiry has been received.", {
        description: "Our doctors will review your details and contact you promptly.",
      });
    } catch {
      setStatus("idle");
      toast.error("Could not send enquiry right now. Please message on WhatsApp or call directly.");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className={compact ? "space-y-5" : "grid gap-5 sm:grid-cols-2"}>
        <Field label="Name" name="name" error={errors.name} required autoComplete="name" />
        <Field label="Phone" name="phone" type="tel" error={errors.phone} required autoComplete="tel" />
      </div>
      <div className={compact ? "space-y-5" : "grid gap-5 sm:grid-cols-2"}>
        <Field label="Email (optional)" name="email" type="email" error={errors.email} autoComplete="email" />
        <div>
          <label htmlFor="topic" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Preferred Consultation
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue={topics[0]}
            className="h-12 w-full rounded-sm border border-input bg-card px-4 text-sm text-foreground"
          >
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="Tell us briefly what you would like help with."
          className="w-full rounded-sm border border-input bg-card p-4 text-sm text-foreground"
          aria-invalid={!!errors.message}
        />
        {errors.message ? <p className="mt-2 text-xs text-destructive">{errors.message}</p> : null}
      </div>

      {status === "success" && (
        <div className="rounded-sm border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="space-y-2">
              <p className="font-medium text-sm">Thank you! Your enquiry has been received.</p>
              <p className="text-xs text-emerald-800">
                Our clinic team will review your enquiry and contact you promptly. You can also connect directly on WhatsApp for instant confirmation.
              </p>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Confirm on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {status !== "success" && (
        <>
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-forest-deep disabled:opacity-60 sm:w-auto"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {status === "loading" ? "Sending…" : "Request a Consultation"}
          </button>

          <p aria-live="polite" className="text-xs text-muted-foreground">
            We usually respond during working hours, Monday to Saturday.
          </p>
        </>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  error,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  error?: string | undefined;
  type?: string | undefined;
  required?: boolean | undefined;
  autoComplete?: string | undefined;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="h-12 w-full rounded-sm border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground"
      />
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
