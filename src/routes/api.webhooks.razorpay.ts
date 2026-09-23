import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { dispatchAllOrderNotifications } from "@/lib/notifications.server";
import { site } from "@/lib/site";

export const Route = createFileRoute("/api/webhooks/razorpay")({
  server: {
    handlers: {
      GET: () => {
        return new Response(
          JSON.stringify({ status: "online", endpoint: "/api/webhooks/razorpay", message: "Razorpay Webhook listener active" }),
          { headers: { "Content-Type": "application/json" } }
        );
      },
      POST: async ({ request }) => {
        try {
          const rawBody = await request.text();
          const signature = request.headers.get("x-razorpay-signature") || "";
          const webhookSecret = process.env["RAZORPAY_WEBHOOK_SECRET"] || process.env["RAZORPAY_KEY_SECRET"] || "";

          // Verify signature if secret is configured
          if (webhookSecret) {
            const expectedSignature = crypto
              .createHmac("sha256", webhookSecret)
              .update(rawBody)
              .digest("hex");

            if (expectedSignature !== signature) {
              console.error("[Razorpay Webhook] Invalid signature mismatch.");
              return new Response(JSON.stringify({ error: "Invalid signature" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
          } else if (process.env.NODE_ENV === "production") {
            console.warn("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set in production!");
          }

          let payload: any;
          try {
            payload = JSON.parse(rawBody);
          } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid JSON" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const event = payload.event;
          const paymentEntity = payload.payload?.payment?.entity;
          const orderEntity = payload.payload?.order?.entity;

          const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
          const rzpPaymentId = paymentEntity?.id;
          const orderReceipt = orderEntity?.receipt || paymentEntity?.notes?.order_number;

          console.log(`[Razorpay Webhook] Received event: ${event} for order: ${rzpOrderId || orderReceipt}`);

          // Find corresponding order in database
          let query = supabaseAdmin.from("orders").select("*, order_items(*)");
          if (rzpOrderId) {
            query = query.eq("payment_gateway_order_id", rzpOrderId);
          } else if (orderReceipt) {
            query = query.eq("order_number", orderReceipt);
          } else {
            return new Response(JSON.stringify({ received: true, ignored: "Missing order identifier" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { data: order, error: orderErr } = await query.maybeSingle();

          if (orderErr || !order) {
            console.warn(`[Razorpay Webhook] Order not found for identifier: ${rzpOrderId || orderReceipt}`);
            return new Response(JSON.stringify({ received: true, note: "Order not found" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const nowIso = new Date().toISOString();
          const existingAudit = Array.isArray(order.audit_log) ? order.audit_log : [];

          // Handle successful capture or order paid
          if (event === "payment.captured" || event === "order.paid") {
            // Check idempotency: If already marked paid, avoid duplicate notification/stock deductions
            if (order.payment_status === "paid") {
              console.log(`[Razorpay Webhook] Order ${order.order_number} is already marked paid. Skipping.`);
              return new Response(JSON.stringify({ received: true, already_processed: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            const updatedAudit = [
              ...existingAudit,
              {
                timestamp: nowIso,
                action: "razorpay_webhook_payment_captured",
                actor: "razorpay_webhook",
                payment_id: rzpPaymentId,
                amount: paymentEntity?.amount ? paymentEntity.amount / 100 : order.total,
                status: "confirmed",
              },
            ];

            const nextStatus = order.status === "pending" || order.status === "awaiting_payment" ? "confirmed" : order.status;

            // Update order status and gateway payload
            await supabaseAdmin
              .from("orders")
              .update({
                payment_status: "paid",
                status: nextStatus,
                payment_gateway_payload: paymentEntity || orderEntity,
                audit_log: updatedAudit,
              })
              .eq("id", order.id);

            // Deduct stock for items
            if (Array.isArray(order.order_items)) {
              for (const item of order.order_items) {
                if (item.product_id) {
                  try {
                    const { data: prod } = await supabaseAdmin
                      .from("products")
                      .select("stock")
                      .eq("id", item.product_id)
                      .single();
                    if (prod) {
                      await supabaseAdmin
                        .from("products")
                        .update({ stock: Math.max(0, (prod.stock ?? 0) - item.quantity) })
                        .eq("id", item.product_id);
                    }
                  } catch (stockErr) {
                    console.error("[Razorpay Webhook] Stock deduction error:", stockErr);
                  }
                }
              }
            }

            // Trigger customer and admin notifications
            try {
              const fullAddress = [order.address_line1, order.address_line2, `${order.city}, ${order.state} ${order.pincode}`]
                .filter(Boolean)
                .join(", ");

              await dispatchAllOrderNotifications({
                orderId: order.id,
                orderNumber: order.order_number,
                invoiceNumber: order.invoice_number || `INV-${order.order_number.replace(/^VB-/, "")}`,
                customerName: order.customer_name,
                customerEmail: order.email,
                customerPhone: order.phone,
                shippingAddress: fullAddress,
                items: (order.order_items || []).map((it: any) => ({
                  name: it.product_name,
                  variant: it.variant_label,
                  quantity: it.quantity,
                  price: Number(it.unit_price),
                  subtotal: Number(it.unit_price) * it.quantity,
                })),
                subtotal: Number(order.subtotal),
                shipping: Number(order.shipping_amount),
                discount: Number(order.discount_amount),
                tax: Number(order.tax_amount || 0),
                total: Number(order.total),
                paymentMethod: "online",
                paymentStatus: "paid",
              });
            } catch (notifErr) {
              console.error("[Razorpay Webhook] Notification dispatch error:", notifErr);
            }

            return new Response(JSON.stringify({ received: true, status: "confirmed" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Handle payment failure
          if (event === "payment.failed") {
            const updatedAudit = [
              ...existingAudit,
              {
                timestamp: nowIso,
                action: "razorpay_webhook_payment_failed",
                actor: "razorpay_webhook",
                payment_id: rzpPaymentId,
                reason: paymentEntity?.error_description || "Payment failed",
              },
            ];

            await supabaseAdmin
              .from("orders")
              .update({
                payment_status: "failed",
                audit_log: updatedAudit,
              })
              .eq("id", order.id);

            return new Response(JSON.stringify({ received: true, status: "failed" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ received: true, status: "unhandled_event" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("[Razorpay Webhook] Server error:", err);
          return new Response(JSON.stringify({ error: err.message || "Internal error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
