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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("enquiries").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      enquiry_type: data.enquiryType,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) throw new Error("Could not save your enquiry. Please try again or call us.");
    return { ok: true as const };
  });
