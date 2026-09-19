import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{10,20}$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email address").max(160).or(z.literal("")),
  enquiryType: z.string().trim().min(2).max(60),
  subject: z.string().trim().max(120).or(z.literal("")),
  message: z.string().trim().min(5, "Please tell us a little more").max(1500),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: EnquiryInput) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Save to Supabase if configured
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("enquiries").insert({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        enquiry_type: data.enquiryType,
        subject: data.subject || null,
        message: data.message,
      });
    } catch (e) {
      console.warn("[Enquiry] Database save error, continuing with email notification:", e);
    }

    // 2. Dispatch email notification
    try {
      const { sendClinicEmailNotification } = await import("./notifications.server");
      const emailSubject = `New Patient Enquiry: ${data.name} (${data.enquiryType})`;
      const emailBody = `
New Enquiry from Vaidh Bharti Website:
----------------------------------------
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || "Not provided"}
Consultation / Service: ${data.enquiryType}
Subject: ${data.subject || "General Enquiry"}
Message:
${data.message}
----------------------------------------
Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
      `.trim();
      await sendClinicEmailNotification({ subject: emailSubject, body: emailBody });
    } catch (err) {
      console.error("[Enquiry] Email notification dispatch failed:", err);
    }

    return {
      ok: true as const,
      whatsappText: encodeURIComponent(
        `Namaste Vaidh Bharti, I have submitted an enquiry:\nName: ${data.name}\nPhone: ${data.phone}\nService: ${data.enquiryType}\nMessage: ${data.message}`,
      ),
    };
  });
