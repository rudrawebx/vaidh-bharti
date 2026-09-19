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
  lines: { name: string; slug: string; variantLabel: string | null; unitPrice: number; qty: number; image: string | null; productId: string }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string | null;
  couponError: string | null;
};

async function priceCart(
  supabase: any,
  items: { slug: string; variantLabel?: string | null | undefined; qty: number }[],
  couponCode?: string | null,
): Promise<PricedCart> {
  const slugs = items.map((i) => i.slug);
  const { data: rows } = await supabase
    .from("products")
    .select("id,slug,name,price,images,stock,product_variants(label,price,stock)")
    .in("slug", slugs)
    .eq("is_active", true);

  const lines: PricedCart["lines"] = [];
  for (const item of items) {
    const p = (rows ?? []).find((r: any) => r.slug === item.slug);
    if (!p) throw new Error(`Product not available: ${item.slug}`);
    let unitPrice: number | null = p.price === null ? null : Number(p.price);
    let label: string | null = null;
    if (item.variantLabel) {
      const v = (p.product_variants ?? []).find((x: any) => x.label === item.variantLabel);
      if (!v) throw new Error(`Pack size not available for ${p.name}`);
      unitPrice = Number(v.price);
      label = v.label;
    }
    if (unitPrice === null) throw new Error(`${p.name} is not available for online purchase yet`);
    lines.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      variantLabel: label,
      unitPrice,
      qty: item.qty,
      image: (p.images ?? [])[0] ?? null,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  const { data: shippingSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "shipping")
    .maybeSingle();
  const flat = Number(shippingSetting?.value?.flat_rate ?? 60);
  const freeAbove = Number(shippingSetting?.value?.free_above ?? 999);
  const shipping = subtotal >= freeAbove || subtotal === 0 ? 0 : flat;

  let discount = 0;
  let appliedCode: string | null = null;
  let couponError: string | null = null;
  const code = couponCode?.trim().toUpperCase();
  if (code) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("code,discount_type,discount_value,min_order_amount,is_active,expires_at")
      .eq("code", code)
      .maybeSingle();
    if (!coupon || !coupon.is_active) couponError = "This coupon code is not valid.";
    else if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) couponError = "This coupon has expired.";
    else if (subtotal < Number(coupon.min_order_amount)) couponError = `Coupon valid on orders above ₹${coupon.min_order_amount}.`;
    else {
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
    total: Math.max(0, subtotal + shipping - discount),
    couponCode: appliedCode,
    couponError,
  };
}

export const quoteCart = createServerFn({ method: "POST" })
  .inputValidator((data: { items: { slug: string; variantLabel?: string | null | undefined; qty: number }[]; couponCode?: string | null | undefined }) => data)
  .handler(async ({ data }) => {
    const { publicClient } = await import("./supabase-public.server");
    if (data.items.length === 0)
      return { lines: [], subtotal: 0, shipping: 0, discount: 0, total: 0, couponCode: null, couponError: null } as PricedCart;
    return priceCart(publicClient(), data.items, data.couponCode ?? null);
  });

function orderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VB-${stamp}-${rand}`;
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Mobile number must be verified by SMS code before an order can be created.
    if (process.env["MSG91_AUTH_KEY"] && process.env["MSG91_TEMPLATE_ID"]) {
      const { isPhoneVerified } = await import("./otp.functions");
      const verified = await isPhoneVerified(data.customer.phone);
      if (!verified) throw new Error("Please verify your mobile number with the SMS code first.");
    }

    const priced = await priceCart(supabaseAdmin, data.items, data.couponCode ?? null);
    const c = data.customer;
    const number = orderNumber();

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: number,
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
        total: priced.total,
        coupon_code: priced.couponCode,
        payment_method: data.paymentMethod,
        payment_status: "pending",
        status: "pending",
        notes: c.notes || null,
      })
      .select("id,order_number,total")
      .single();
    if (error || !order) throw new Error(error?.message ?? "Could not create the order");

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
          amount: Math.round(Number(order.total) * 100),
          currency: "INR",
          receipt: order.order_number,
        }),
      });
      if (!res.ok) throw new Error("Payment gateway could not start this payment. Please try again.");
      const rp = (await res.json()) as { id: string; amount: number };
      await supabaseAdmin.from("orders").update({ razorpay_order_id: rp.id }).eq("id", order.id);
      razorpay = { orderId: rp.id, keyId, amount: rp.amount };
    }

    return { orderNumber: order.order_number, total: Number(order.total), razorpay };
  });

export const confirmPayment = createServerFn({ method: "POST" })
  .inputValidator((data: { orderNumber: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => data)
  .handler(async ({ data }) => {
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keySecret) throw new Error("Online payment is not configured.");
    const { createHmac } = await import("crypto");
    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");
    if (expected !== data.razorpay_signature) throw new Error("Payment could not be verified.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("orders")
      .update({ payment_status: "paid", status: "confirmed", razorpay_payment_id: data.razorpay_payment_id })
      .eq("order_number", data.orderNumber)
      .eq("razorpay_order_id", data.razorpay_order_id);
    return { ok: true };
  });

export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => ({
  razorpayEnabled: Boolean(process.env["RAZORPAY_KEY_ID"] && process.env["RAZORPAY_KEY_SECRET"]),
}));

export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((data: { orderNumber: string; phone: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number,status,payment_status,payment_method,total,subtotal,shipping_amount,discount_amount,customer_name,city,state,tracking_number,courier,created_at,order_items(product_name,variant_label,quantity,unit_price,image_url)",
      )
      .eq("order_number", data.orderNumber.trim().toUpperCase())
      .maybeSingle();
    if (!order) return null;
    const { data: match } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("order_number", data.orderNumber.trim().toUpperCase())
      .eq("phone", data.phone.trim())
      .maybeSingle();
    if (!match) return null;
    return order;
  });
