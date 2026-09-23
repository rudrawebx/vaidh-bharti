// Server-side multi-channel notification engine for Vaidh Bharti
// Supports Customer Invoice Email, Admin Order Alerts, WhatsApp integration, and audit logging.

import { site } from "./site";

export type OrderNotificationPayload = {
  orderId: string;
  orderNumber: string;
  invoiceNumber?: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { name: string; variantLabel?: string | null; qty: number; unitPrice: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  courier?: string | null;
  trackingNumber?: string | null;
  notes?: string | null;
};

// Log notification event in database
export async function logNotification({
  orderId,
  orderNumber,
  channel,
  recipient,
  subject,
  status,
  errorMessage,
  payload,
}: {
  orderId?: string | null;
  orderNumber?: string | null;
  channel: string;
  recipient: string;
  subject?: string | null;
  status: "sent" | "failed" | "pending";
  errorMessage?: string | null;
  payload?: Record<string, unknown>;
}) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("notification_logs").insert({
      order_id: orderId ?? null,
      order_number: orderNumber ?? null,
      channel,
      recipient,
      subject: subject ?? null,
      status,
      error_message: errorMessage ?? null,
      payload: (payload as any) ?? {},
    });
  } catch (err) {
    console.warn("[Notification Logger] Could not log to DB:", err);
  }
}

// 1. Customer Order Confirmation & Invoice Email
export async function sendCustomerInvoiceEmail(data: OrderNotificationPayload) {
  if (!data.customerEmail) return { ok: false, reason: "No customer email provided" };

  const resendKey = process.env["RESEND_API_KEY"];
  const invoiceNum = data.invoiceNumber || `INV-${data.orderNumber}`;
  const subject = `Order Confirmed (${data.orderNumber}) — ${site.name}`;

  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1c2b21;">
          <strong>${item.name}</strong>${item.variantLabel ? ` <span style="color:#6b7280; font-size:12px;">(${item.variantLabel})</span>` : ""}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #1c2b21;">${item.qty}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #1c2b21;">₹${item.unitPrice}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: 600; color: #1c2b21;">₹${item.unitPrice * item.qty}</td>
      </tr>
    `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; color: #1c2b21;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e7dfd5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1F2D25; padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.05em; color: #C5A262;">${site.name}</h1>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.15em;">Panchsheel Aarogya Dhaam · Hansi, Haryana</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 24px;">
          <div style="background-color: #f4efe6; border-left: 4px solid #C5A262; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1F2D25;">Namaste ${data.customerName},</p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
              Thank you for trusting Vaidh Bharti. Your order has been placed and is being prepared under Vaidya supervision.
            </p>
          </div>

          <!-- Order Summary Meta -->
          <table style="width: 100%; margin-bottom: 20px; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Order Number:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #1F2D25;">${data.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Invoice Number:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #1F2D25;">${invoiceNum}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Payment Method:</td>
              <td style="padding: 6px 0; text-align: right; text-transform: uppercase; font-weight: 600; color: ${data.paymentStatus === "paid" ? "#15803d" : "#b45309"};">
                ${data.paymentMethod} (${data.paymentStatus})
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Delivery Address:</td>
              <td style="padding: 6px 0; text-align: right; color: #374151;">
                ${data.address}, ${data.city}, ${data.state} - ${data.pincode}
              </td>
            </tr>
          </table>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 4px;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Product</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Qty</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Rate</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="background-color: #FAF7F2; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <table style="width: 100%; font-size: 13px; line-height: 1.8;">
              <tr>
                <td style="color: #6b7280;">Subtotal:</td>
                <td style="text-align: right; font-weight: 500;">₹${data.subtotal}</td>
              </tr>
              <tr>
                <td style="color: #6b7280;">Shipping Charges:</td>
                <td style="text-align: right; font-weight: 500;">${data.shipping === 0 ? '<span style="color:#15803d">FREE</span>' : `₹${data.shipping}`}</td>
              </tr>
              ${data.discount > 0 ? `
              <tr>
                <td style="color: #15803d;">Coupon Discount:</td>
                <td style="text-align: right; font-weight: 600; color: #15803d;">−₹${data.discount}</td>
              </tr>` : ""}
              <tr style="border-top: 1px solid #e7dfd5;">
                <td style="padding-top: 8px; font-size: 16px; font-weight: 700; color: #1F2D25;">Grand Total:</td>
                <td style="padding-top: 8px; text-align: right; font-size: 18px; font-weight: 700; color: #1F2D25;">₹${data.total}</td>
              </tr>
            </table>
          </div>

          <!-- CTAs -->
          <div style="text-align: center; margin: 28px 0 16px 0;">
            <a href="https://vaidhbharti.com/order/${data.orderNumber}" style="display: inline-block; background-color: #1F2D25; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em;">
              View & Download Official Invoice
            </a>
          </div>

          <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 24px;">
            Need help with your order? Call <a href="tel:+919996415501" style="color: #C5A262; text-decoration: none;">+91 99964 15501</a> or message us on WhatsApp.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px 24px; text-align: center; font-size: 11px; color: #9ca3af;">
          ${site.name} · Panchsheel Aarogya Dhaam · Barwala Road, Hansi, Haryana 125033<br/>
          Guided by Vaidh Jitender Bharti
        </div>
      </div>
    </body>
    </html>
  `.trim();

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Vaidh Bharti Orders <orders@vaidhbharti.com>",
          to: [data.customerEmail],
          subject,
          html,
        }),
      });
      const resData = await res.json();
      if (res.ok) {
        await logNotification({
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          channel: "customer_email",
          recipient: data.customerEmail,
          subject,
          status: "sent",
          payload: resData,
        });
        return { ok: true, id: resData.id };
      } else {
        await logNotification({
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          channel: "customer_email",
          recipient: data.customerEmail,
          subject,
          status: "failed",
          errorMessage: JSON.stringify(resData),
        });
        return { ok: false, error: resData };
      }
    } catch (err) {
      await logNotification({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        channel: "customer_email",
        recipient: data.customerEmail,
        subject,
        status: "failed",
        errorMessage: err instanceof Error ? err.message : String(err),
      });
      return { ok: false, error: err };
    }
  } else {
    console.log(`[Notification Engine] RESEND_API_KEY not configured. Email logged to console:\nTo: ${data.customerEmail}\nSubject: ${subject}`);
    await logNotification({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      channel: "customer_email",
      recipient: data.customerEmail,
      subject,
      status: "pending",
      errorMessage: "RESEND_API_KEY not configured in environment.",
    });
    return { ok: true, simulated: true };
  }
}

// 2. Business Admin Order Notification Email
export async function sendAdminNewOrderAlertEmail(data: OrderNotificationPayload) {
  let recipientEmails = [
    process.env["ADMIN_EMAIL"] || "vaidbharti80@gmail.com",
    "rudrawebx@gmail.com",
  ];

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "notification_settings")
      .maybeSingle();

    const notif = setting?.value as { admin_emails?: string[] } | undefined;
    if (notif?.admin_emails && Array.isArray(notif.admin_emails) && notif.admin_emails.length > 0) {
      recipientEmails = notif.admin_emails;
    }
  } catch {}

  const subject = `[New Order Alert] ${data.orderNumber} — ₹${data.total} by ${data.customerName}`;
  const itemsText = data.items
    .map((i) => `• ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} x ${i.qty} = ₹${i.unitPrice * i.qty}`)
    .join("\n");

  const body = `
NEW ORDER RECEIVED ON VAIDH BHARTI STORE
============================================================
Order ID:       ${data.orderNumber}
Invoice ID:     ${data.invoiceNumber || "Pending"}
Date:           ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
Status:         ${data.orderStatus.toUpperCase()}
Payment Method: ${data.paymentMethod.toUpperCase()} (${data.paymentStatus.toUpperCase()})

CUSTOMER DETAILS:
Name:           ${data.customerName}
Phone:          ${data.customerPhone}
Email:          ${data.customerEmail || "Not provided"}

DELIVERY ADDRESS:
${data.address}
${data.city}, ${data.state} - ${data.pincode}
Customer Notes: ${data.notes || "None"}

ORDER ITEMS:
${itemsText}

FINANCIALS:
Subtotal:       ₹${data.subtotal}
Shipping:       ₹${data.shipping}
Discount:       ₹${data.discount}
Grand Total:    ₹${data.total}

ADMIN ACTION:
View and manage this order in the Admin Panel:
https://vaidhbharti.com/admin/orders
============================================================
  `.trim();

  const resendKey = process.env["RESEND_API_KEY"];
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Vaidh Bharti System <orders@vaidhbharti.com>",
          to: recipientEmails,
          subject,
          text: body,
        }),
      });
      const resData = await res.json();
      await logNotification({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        channel: "admin_email",
        recipient: recipientEmails.join(", "),
        subject,
        status: res.ok ? "sent" : "failed",
        payload: resData,
      });
    } catch (err) {
      await logNotification({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        channel: "admin_email",
        recipient: recipientEmails.join(", "),
        subject,
        status: "failed",
        errorMessage: err instanceof Error ? err.message : String(err),
      });
    }
  } else {
    console.log(`[Admin Notification Alert]\nTo: ${recipientEmails.join(", ")}\nSubject: ${subject}\n${body}`);
    await logNotification({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      channel: "admin_email",
      recipient: recipientEmails.join(", "),
      subject,
      status: "pending",
      errorMessage: "RESEND_API_KEY not set. Logged to server console.",
    });
  }
}

// 3. Customer WhatsApp Notification & Deep-Link Generator
export async function sendCustomerWhatsAppNotification(data: OrderNotificationPayload) {
  const cleanPhone = data.customerPhone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.startsWith("91") && cleanPhone.length === 12 ? cleanPhone : `91${cleanPhone.slice(-10)}`;
  
  const textMessage = `Namaste ${data.customerName}! 🙏\n\nYour order *${data.orderNumber}* for ₹${data.total} has been placed at *${site.name}*.\n\nPayment: ${data.paymentMethod.toUpperCase()} (${data.paymentStatus})\nDelivery to: ${data.city}, ${data.state}\n\nView official invoice & track order:\nhttps://vaidhbharti.com/order/${data.orderNumber}\n\nPanchsheel Aarogya Dhaam, Hansi, Haryana`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(textMessage)}`;

  const whatsappToken = process.env["WHATSAPP_TOKEN"];
  const whatsappPhoneId = process.env["WHATSAPP_PHONE_ID"];

  if (whatsappToken && whatsappPhoneId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${whatsappPhoneId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${whatsappToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "text",
          text: { body: textMessage },
        }),
      });
      const resData = await res.json();
      await logNotification({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        channel: "whatsapp",
        recipient: formattedPhone,
        subject: "Order Confirmation WhatsApp",
        status: res.ok ? "sent" : "failed",
        payload: resData,
      });
      return { ok: res.ok, resData, whatsappUrl };
    } catch (err) {
      await logNotification({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        channel: "whatsapp",
        recipient: formattedPhone,
        subject: "Order Confirmation WhatsApp",
        status: "failed",
        errorMessage: err instanceof Error ? err.message : String(err),
      });
      return { ok: false, whatsappUrl };
    }
  } else {
    // Log formatted WhatsApp payload so staff can trigger or click directly
    await logNotification({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      channel: "whatsapp",
      recipient: formattedPhone,
      subject: "Order Confirmation WhatsApp (Ready)",
      status: "pending",
      payload: { whatsappUrl, textMessage },
    });
    return { ok: true, whatsappUrl, simulated: true };
  }
}

// 4. Combined Notification Dispatcher
export async function dispatchAllOrderNotifications(data: OrderNotificationPayload) {
  return Promise.allSettled([
    sendCustomerInvoiceEmail(data),
    sendAdminNewOrderAlertEmail(data),
    sendCustomerWhatsAppNotification(data),
  ]);
}
