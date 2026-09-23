import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  slug: z.string().min(1),
  variantLabel: z.string().nullable().optional(),
  qty: z.number().int().min(1).max(20),
});

const orderSchema = z.object({
  items: z.array(itemSchema).min(1).max(30),
  couponCode: z.string().trim().max(30).optional().nullable(),
  paymentMethod: z.enum(["cod", "razorpay"]),
  userId: z.string().uuid().nullable().optional(),
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120).optional().or(z.literal("")),
    phone: z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number"),
    address1: z.string().trim().min(4).max(160),
    address2: z.string().trim().max(160).optional().or(z.literal("")),
    city: z.string().trim().min(2).max(60),
    state: z.string().trim().min(2).max(60),
    pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
  }),
});

export type PricedCart = {
  lines: {
    productId: string;
    slug: string;
    name: string;
    sku?: string | null;
    variantLabel: string | null;
    unitPrice: number;
    qty: number;
    image: string | null;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  couponCode: string | null;
  couponError: string | null;
};

// Calculate pricing, stock availability, coupon discount and shipping
async function priceCart(
  supabase: any,
  items: { slug: string; variantLabel?: string | null | undefined; qty: number }[],
  couponCode?: string | null,
): Promise<PricedCart> {
  const slugs = items.map((i) => i.slug);
  const { data: rows } = await supabase
    .from("products")
    .select("id,slug,name,sku,price,images,stock,product_variants(id,label,price,stock)")
    .in("slug", slugs)
    .eq("is_active", true);

  const lines: PricedCart["lines"] = [];
  for (const item of items) {
    let p = (rows ?? []).find((r: any) => r.slug === item.slug);
    if (!p) {
      const { getFallbackProducts } = await import("./catalog.functions");
      const fb = getFallbackProducts().find((x) => x.slug === item.slug);
      if (fb) {
        p = {
          id: fb.id,
          slug: fb.slug,
          name: fb.name,
          sku: fb.sku,
          price: fb.price,
          images: fb.images,
          stock: fb.stock,
          product_variants: fb.variants,
        };
      }
    }
    if (!p) throw new Error(`Product not available: ${item.slug}`);

    let unitPrice: number | null = p.price === null ? null : Number(p.price);
    let label: string | null = null;
    let availableStock: number = p.stock ?? 0;

    if (item.variantLabel) {
      const v = (p.product_variants ?? []).find((x: any) => x.label === item.variantLabel);
      if (!v) throw new Error(`Pack size not available for ${p.name}`);
      unitPrice = Number(v.price);
      label = v.label;
      availableStock = v.stock ?? 0;
    }

    if (unitPrice === null) throw new Error(`${p.name} is not available for online purchase yet`);

    // Verify stock availability
    if (availableStock > 0 && item.qty > availableStock) {
      throw new Error(`Only ${availableStock} units of ${p.name} available in stock.`);
    }

    lines.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      sku: p.sku || null,
      variantLabel: label,
      unitPrice,
      qty: item.qty,
      image: (p.images ?? [])[0] ?? null,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  // Fetch shipping settings
  const { data: shippingSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "shipping")
    .maybeSingle();

  const flat = Number(shippingSetting?.value?.flat_rate ?? 60);
  const freeAbove = Number(shippingSetting?.value?.free_above ?? 999);
  const shipping = subtotal >= freeAbove || subtotal === 0 ? 0 : flat;

  // Check optional tax settings
  const { data: bizSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "business_details")
    .maybeSingle();
  const taxPct = Number(bizSetting?.value?.tax_percentage ?? 0);
  const tax = taxPct > 0 ? Math.round((subtotal * taxPct) / 100) : 0;

  // Apply Coupon
  let discount = 0;
  let appliedCode: string | null = null;
  let couponError: string | null = null;
  const code = couponCode?.trim().toUpperCase();

  if (code) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("code,discount_type,discount_value,min_order_amount,is_active,expires_at,max_uses,used_count")
      .eq("code", code)
      .maybeSingle();

    if (!coupon || !coupon.is_active) {
      couponError = "This coupon code is not valid.";
    } else if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      couponError = "This coupon has expired.";
    } else if (typeof coupon.max_uses === "number" && (coupon.used_count ?? 0) >= coupon.max_uses) {
      couponError = "This coupon has reached its maximum usage limit.";
    } else if (subtotal < Number(coupon.min_order_amount)) {
      couponError = `Coupon valid on orders above ₹${coupon.min_order_amount}.`;
    } else {
      discount =
        coupon.discount_type === "percent"
          ? Math.round((subtotal * Number(coupon.discount_value)) / 100)
          : Number(coupon.discount_value);
      discount = Math.min(discount, subtotal);
      appliedCode = coupon.code;
    }
  }

  return {
    lines,
    subtotal,
    shipping,
    discount,
    tax,
    total: Math.max(0, subtotal + shipping + tax - discount),
    couponCode: appliedCode,
    couponError,
  };
}

// Generate atomic sequential order ID (VB-2026-000001) & invoice number (INV-2026-000001)
async function generateOrderAndInvoiceNumber(supabase: any) {
  const currentYear = new Date().getFullYear();
  let nextOrderNum = 1001;
  let nextInvoiceNum = 1001;

  try {
    const { data: seqSetting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "order_sequence")
      .maybeSingle();

    if (seqSetting?.value) {
      const val = seqSetting.value as { next_order_number?: number; next_invoice_number?: number };
      if (typeof val.next_order_number === "number") nextOrderNum = val.next_order_number;
      if (typeof val.next_invoice_number === "number") nextInvoiceNum = val.next_invoice_number;

      await supabase
        .from("site_settings")
        .update({
          value: {
            next_order_number: nextOrderNum + 1,
            next_invoice_number: nextInvoiceNum + 1,
          },
        })
        .eq("key", "order_sequence");
    } else {
      await supabase.from("site_settings").insert({
        key: "order_sequence",
        value: {
          next_order_number: nextOrderNum + 1,
          next_invoice_number: nextInvoiceNum + 1,
        },
      });
    }
  } catch (err) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    nextOrderNum = rand;
    nextInvoiceNum = rand;
  }

  const orderNumber = `VB-${currentYear}-${String(nextOrderNum).padStart(6, "0")}`;
  const invoiceNumber = `INV-${currentYear}-${String(nextInvoiceNum).padStart(6, "0")}`;
  return { orderNumber, invoiceNumber };
}

// Atomic stock deduction upon order confirmation
async function deductStockForOrder(supabase: any, lines: PricedCart["lines"]) {
  for (const line of lines) {
    try {
      if (line.variantLabel) {
        const { data: v } = await supabase
          .from("product_variants")
          .select("id, stock")
          .eq("product_id", line.productId)
          .eq("label", line.variantLabel)
          .maybeSingle();
        if (v && typeof v.stock === "number") {
          const newStock = Math.max(0, v.stock - line.qty);
          await supabase.from("product_variants").update({ stock: newStock }).eq("id", v.id);
        }
      }
      const { data: p } = await supabase
        .from("products")
        .select("id, stock")
        .eq("id", line.productId)
        .maybeSingle();
      if (p && typeof p.stock === "number") {
        const newStock = Math.max(0, p.stock - line.qty);
        await supabase.from("products").update({ stock: newStock }).eq("id", p.id);
      }
    } catch (err) {
      console.warn("Stock deduction warning:", err);
    }
  }
}

// 1. Quote Cart
export const quoteCart = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      items: { slug: string; variantLabel?: string | null | undefined; qty: number }[];
      couponCode?: string | null | undefined;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { publicClient } = await import("./supabase-public.server");
    if (data.items.length === 0)
      return {
        lines: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        tax: 0,
        total: 0,
        couponCode: null,
        couponError: null,
      } as PricedCart;
    return priceCart(publicClient(), data.items, data.couponCode ?? null);
  });

// 2. Place Order (COD or Razorpay)
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Phone verification requirement if SMS service is active
    if (process.env["MSG91_AUTH_KEY"] && process.env["MSG91_TEMPLATE_ID"]) {
      const { isPhoneVerified } = await import("./otp.functions");
      const verified = await isPhoneVerified(data.customer.phone);
      if (!verified) throw new Error("Please verify your mobile number with the SMS code first.");
    }

    const priced = await priceCart(supabaseAdmin, data.items, data.couponCode ?? null);
    const c = data.customer;
    const { orderNumber, invoiceNumber } = await generateOrderAndInvoiceNumber(supabaseAdmin);
    const nowIso = new Date().toISOString();

    const isCod = data.paymentMethod === "cod";
    const initialStatus = isCod ? "confirmed" : "pending";
    const initialPaymentStatus = isCod ? "cod_pending" : "pending";

    const initialAudit = [
      {
        action: "order_created",
        timestamp: nowIso,
        status: initialStatus,
        payment_status: initialPaymentStatus,
        payment_method: data.paymentMethod,
        note: isCod ? "Order confirmed for Cash on Delivery" : "Order initiated for online payment",
      },
    ];

    let orderRecord = {
      id: "local-" + orderNumber,
      order_number: orderNumber,
      invoice_number: invoiceNumber,
      total: priced.total,
    };

    try {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber,
          invoice_number: invoiceNumber,
          invoice_date: nowIso,
          user_id: data.userId ?? null,
          customer_name: c.name,
          email: c.email || null,
          phone: c.phone,
          address_line1: c.address1,
          address_line2: c.address2 || null,
          city: c.city,
          state: c.state,
          pincode: c.pincode,
          subtotal: priced.subtotal,
          shipping_amount: priced.shipping,
          discount_amount: priced.discount,
          tax_amount: priced.tax,
          total: priced.total,
          coupon_code: priced.couponCode,
          payment_method: data.paymentMethod,
          payment_status: initialPaymentStatus,
          status: initialStatus,
          notes: c.notes || null,
          audit_log: initialAudit,
        })
        .select("id,order_number,invoice_number,total")
        .single();

      if (!error && order) {
        orderRecord = order;
        await supabaseAdmin.from("order_items").insert(
          priced.lines.map((l) => ({
            order_id: order.id,
            product_id: l.productId,
            product_name: l.name,
            product_slug: l.slug,
            variant_label: l.variantLabel,
            unit_price: l.unitPrice,
            quantity: l.qty,
            image_url: l.image,
          })),
        );

        // If coupon applied, increment usage count
        if (priced.couponCode) {
          try {
            const { data: cp } = await supabaseAdmin
              .from("coupons")
              .select("used_count")
              .eq("code", priced.couponCode)
              .maybeSingle();
            await supabaseAdmin
              .from("coupons")
              .update({ used_count: (cp?.used_count ?? 0) + 1 })
              .eq("code", priced.couponCode);
          } catch {}
        }

        // If COD: deduct stock and dispatch notifications immediately
        if (isCod) {
          await deductStockForOrder(supabaseAdmin, priced.lines);

          const { dispatchAllOrderNotifications } = await import("./notifications.server");
          await dispatchAllOrderNotifications({
            orderId: order.id,
            orderNumber: order.order_number,
            invoiceNumber: order.invoice_number,
            customerName: c.name,
            customerEmail: c.email,
            customerPhone: c.phone,
            address: `${c.address1}${c.address2 ? `, ${c.address2}` : ""}`,
            city: c.city,
            state: c.state,
            pincode: c.pincode,
            items: priced.lines.map((l) => ({
              name: l.name,
              variantLabel: l.variantLabel,
              qty: l.qty,
              unitPrice: l.unitPrice,
            })),
            subtotal: priced.subtotal,
            shipping: priced.shipping,
            discount: priced.discount,
            tax: priced.tax,
            total: priced.total,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Unpaid / Due on Delivery",
            orderStatus: "confirmed",
            notes: c.notes,
          });
        }
      }
    } catch (dbErr) {
      console.warn("Could not save order to database:", dbErr);
    }

    let razorpay: { orderId: string; keyId: string; amount: number } | null = null;
    if (data.paymentMethod === "razorpay") {
      const keyId = process.env["RAZORPAY_KEY_ID"];
      const keySecret = process.env["RAZORPAY_KEY_SECRET"];
      if (!keyId || !keySecret) throw new Error("Online payment is not configured yet. Please choose cash on delivery.");

      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        },
        body: JSON.stringify({
          amount: Math.round(Number(orderRecord.total) * 100),
          currency: "INR",
          receipt: orderRecord.order_number,
        }),
      });

      if (!res.ok) throw new Error("Payment gateway could not initialize payment. Please try again.");
      const rp = (await res.json()) as { id: string; amount: number };

      try {
        await supabaseAdmin
          .from("orders")
          .update({
            razorpay_order_id: rp.id,
            payment_gateway_payload: { razorpay_order_id: rp.id },
          })
          .eq("id", orderRecord.id);
      } catch {}

      razorpay = { orderId: rp.id, keyId, amount: rp.amount };
    }

    return {
      orderNumber: orderRecord.order_number,
      invoiceNumber: orderRecord.invoice_number,
      total: Number(orderRecord.total),
      razorpay,
    };
  });

// 3. Confirm Payment (Client Return with HMAC SHA-256 verification)
export const confirmPayment = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      orderNumber: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keySecret) throw new Error("Online payment is not configured.");

    const { createHmac } = await import("crypto");
    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expected !== data.razorpay_signature) {
      throw new Error("Payment verification failed. Invalid gateway signature.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch existing order to prevent duplicate processing (idempotency)
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", data.orderNumber)
      .maybeSingle();

    if (!order) throw new Error(`Order ${data.orderNumber} not found.`);

    // If already marked paid, return safely without duplicate stock deduction or notifications
    if (order.payment_status === "paid") {
      return { ok: true, alreadyPaid: true };
    }

    const nowIso = new Date().toISOString();
    const existingAudit = Array.isArray(order.audit_log) ? order.audit_log : [];
    const updatedAudit = [
      ...existingAudit,
      {
        action: "payment_verified",
        timestamp: nowIso,
        status: "confirmed",
        payment_status: "paid",
        gateway: "razorpay",
        razorpay_payment_id: data.razorpay_payment_id,
      },
    ];

    await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        razorpay_payment_id: data.razorpay_payment_id,
        audit_log: updatedAudit,
        payment_gateway_payload: {
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          verified_at: nowIso,
        },
      })
      .eq("id", order.id);

    // Deduct stock for items
    const linesForDeduction = (order.order_items ?? []).map((i: any) => ({
      productId: i.product_id,
      slug: i.product_slug,
      name: i.product_name,
      variantLabel: i.variant_label,
      unitPrice: Number(i.unit_price),
      qty: i.quantity,
      image: i.image_url,
    }));
    await deductStockForOrder(supabaseAdmin, linesForDeduction);

    // Dispatch customer invoice email, admin alert, and WhatsApp
    try {
      const { dispatchAllOrderNotifications } = await import("./notifications.server");
      await dispatchAllOrderNotifications({
        orderId: order.id,
        orderNumber: order.order_number,
        invoiceNumber: order.invoice_number,
        customerName: order.customer_name,
        customerEmail: order.email,
        customerPhone: order.phone,
        address: `${order.address_line1}${order.address_line2 ? `, ${order.address_line2}` : ""}`,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        items: linesForDeduction,
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping_amount),
        discount: Number(order.discount_amount),
        tax: Number(order.tax_amount ?? 0),
        total: Number(order.total),
        paymentMethod: "Razorpay (Online Prepaid)",
        paymentStatus: "paid",
        orderStatus: "confirmed",
        notes: order.notes,
      });
    } catch (notifErr) {
      console.error("Order post-payment notification dispatch error:", notifErr);
    }

    return { ok: true };
  });

// 4. Payment Gateway Config
export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => ({
  razorpayEnabled: Boolean(process.env["RAZORPAY_KEY_ID"] && process.env["RAZORPAY_KEY_SECRET"]),
  keyId: process.env["RAZORPAY_KEY_ID"] || null,
}));

// 5. Customer Order Lookup (for Order Details & Tracking)
export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((data: { orderNumber: string; phone?: string | null }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const cleanNum = data.orderNumber.trim().toUpperCase();

    const query = supabaseAdmin
      .from("orders")
      .select(
        "id,order_number,invoice_number,invoice_date,status,payment_status,payment_method,total,subtotal,shipping_amount,discount_amount,tax_amount,customer_name,email,phone,address_line1,address_line2,city,state,pincode,tracking_number,courier,notes,created_at,order_items(product_name,variant_label,quantity,unit_price,image_url)",
      )
      .eq("order_number", cleanNum);

    if (data.phone) {
      const cleanPhone = data.phone.trim().replace(/[^0-9]/g, "").slice(-10);
      query.ilike("phone", `%${cleanPhone}%`);
    }

    const { data: order } = await query.maybeSingle();
    return order;
  });

// 6. Admin: Update Order Status & Shipping
export const updateAdminOrderStatus = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      orderId: string;
      status?: string;
      paymentStatus?: string;
      courier?: string | null;
      trackingNumber?: string | null;
      staffNote?: string | null;
      cancelledReason?: string | null;
      refundReference?: string | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .maybeSingle();

    if (!order) throw new Error("Order not found.");

    const nowIso = new Date().toISOString();
    const existingAudit = Array.isArray(order.audit_log) ? order.audit_log : [];
    const auditEntry: Record<string, unknown> = {
      timestamp: nowIso,
      action: "admin_update",
    };

    const patch: Record<string, unknown> = {};

    if (data.status && data.status !== order.status) {
      patch.status = data.status;
      auditEntry.old_status = order.status;
      auditEntry.new_status = data.status;
    }

    if (data.paymentStatus && data.paymentStatus !== order.payment_status) {
      patch.payment_status = data.paymentStatus;
      auditEntry.old_payment_status = order.payment_status;
      auditEntry.new_payment_status = data.paymentStatus;
    }

    if (data.courier !== undefined) patch.courier = data.courier;
    if (data.trackingNumber !== undefined) patch.tracking_number = data.trackingNumber;
    if (data.cancelledReason) patch.cancelled_reason = data.cancelledReason;
    if (data.refundReference) patch.refund_reference = data.refundReference;

    if (data.staffNote) {
      auditEntry.note = data.staffNote;
    }

    patch.audit_log = [...existingAudit, auditEntry];

    const { error } = await supabaseAdmin.from("orders").update(patch).eq("id", data.orderId);
    if (error) throw new Error("Could not update order: " + error.message);

    // If order was just marked 'shipped' with tracking, dispatch shipping update notification
    if (data.status === "shipped" && data.trackingNumber && order.email) {
      try {
        const { sendCustomerInvoiceEmail } = await import("./notifications.server");
        await sendCustomerInvoiceEmail({
          orderId: order.id,
          orderNumber: order.order_number,
          invoiceNumber: order.invoice_number,
          customerName: order.customer_name,
          customerEmail: order.email,
          customerPhone: order.phone,
          address: `${order.address_line1}, ${order.city}`,
          city: order.city,
          state: order.state,
          pincode: order.pincode,
          items: (order.order_items ?? []).map((i: any) => ({
            name: i.product_name,
            variantLabel: i.variant_label,
            qty: i.quantity,
            unitPrice: Number(i.unit_price),
          })),
          subtotal: Number(order.subtotal),
          shipping: Number(order.shipping_amount),
          discount: Number(order.discount_amount),
          total: Number(order.total),
          paymentMethod: order.payment_method,
          paymentStatus: patch.payment_status ? String(patch.payment_status) : order.payment_status,
          orderStatus: "shipped",
          courier: data.courier || order.courier,
          trackingNumber: data.trackingNumber,
        });
      } catch (err) {
        console.warn("Shipping notification alert error:", err);
      }
    }

    return { success: true };
  });

// 7. Admin: Resend Order Notification (Email or WhatsApp)
export const resendOrderNotification = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { orderId: string; channel: "customer_email" | "admin_email" | "whatsapp" }) => data,
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .maybeSingle();

    if (!order) throw new Error("Order not found.");

    const notifPayload = {
      orderId: order.id,
      orderNumber: order.order_number,
      invoiceNumber: order.invoice_number,
      customerName: order.customer_name,
      customerEmail: order.email,
      customerPhone: order.phone,
      address: `${order.address_line1}${order.address_line2 ? `, ${order.address_line2}` : ""}`,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      items: (order.order_items ?? []).map((i: any) => ({
        name: i.product_name,
        variantLabel: i.variant_label,
        qty: i.quantity,
        unitPrice: Number(i.unit_price),
      })),
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping_amount),
      discount: Number(order.discount_amount),
      tax: Number(order.tax_amount ?? 0),
      total: Number(order.total),
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.status,
      courier: order.courier,
      trackingNumber: order.tracking_number,
      notes: order.notes,
    };

    const {
      sendCustomerInvoiceEmail,
      sendAdminNewOrderAlertEmail,
      sendCustomerWhatsAppNotification,
    } = await import("./notifications.server");

    if (data.channel === "customer_email") {
      const res = await sendCustomerInvoiceEmail(notifPayload);
      return { success: res.ok, channel: "customer_email" };
    } else if (data.channel === "admin_email") {
      await sendAdminNewOrderAlertEmail(notifPayload);
      return { success: true, channel: "admin_email" };
    } else if (data.channel === "whatsapp") {
      const res = await sendCustomerWhatsAppNotification(notifPayload);
      return { success: res.ok, channel: "whatsapp", whatsappUrl: res.whatsappUrl };
    }

    return { success: false };
  });

// 8. Admin: Get Full Order Details & Audit Logs
export const getAdminOrderDetails = createServerFn({ method: "POST" })
  .inputValidator((data: { orderId: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [orderRes, notifRes] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", data.orderId)
        .maybeSingle(),
      supabaseAdmin
        .from("notification_logs")
        .select("*")
        .eq("order_id", data.orderId)
        .order("created_at", { ascending: false }),
    ]);

    if (!orderRes.data) throw new Error("Order not found");

    return {
      order: orderRes.data,
      notifications: notifRes.data ?? [],
    };
  });
