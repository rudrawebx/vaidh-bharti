-- Migration: Production Ecommerce System & Professional Admin Panel
-- Description: Adds invoice sequence, tax, payment payload, audit log, and notification log tables.

-- 1. Extend orders table
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS invoice_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS invoice_date timestamptz,
  ADD COLUMN IF NOT EXISTS tax_amount numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_gateway_payload jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS audit_log jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cancelled_reason text,
  ADD COLUMN IF NOT EXISTS refund_reference text;

CREATE INDEX IF NOT EXISTS idx_orders_invoice_number ON public.orders(invoice_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 2. Extend coupons table if not already present
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS max_uses int DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS used_count int DEFAULT 0;

-- 3. Create notification_logs table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number text,
  channel text NOT NULL, -- 'customer_email' | 'admin_email' | 'whatsapp'
  recipient text NOT NULL,
  subject text,
  status text NOT NULL DEFAULT 'pending', -- 'sent' | 'failed' | 'pending'
  error_message text,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_order_id ON public.notification_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON public.notification_logs(created_at DESC);

GRANT SELECT, INSERT ON public.notification_logs TO authenticated;
GRANT ALL ON public.notification_logs TO service_role;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view notification logs" 
  ON public.notification_logs FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Initial Site Settings for Business, Shipping, Tax and Notifications
INSERT INTO public.site_settings (key, value)
VALUES
  ('business_details', '{
    "legal_name": "Vaidh Bharti - Panchsheel Aarogya Dhaam",
    "founder_name": "Vaidh Jitender Bharti",
    "address": "Barwala Road, Near Shree Ram ITI, Hansi, Haryana 125033",
    "phone": "+91 99964 15501",
    "email": "vaidbharti80@gmail.com",
    "gstin": "",
    "pan": "",
    "invoice_prefix": "INV",
    "order_prefix": "VB"
  }'::jsonb),
  ('notification_settings', '{
    "admin_emails": ["vaidbharti80@gmail.com", "rudrawebx@gmail.com"],
    "sender_name": "Vaidh Bharti Ayurveda",
    "sender_email": "orders@vaidhbharti.com",
    "whatsapp_enabled": false,
    "whatsapp_phone_number_id": "",
    "whatsapp_template_name": "order_confirmation_v1"
  }'::jsonb),
  ('order_sequence', '{
    "next_order_number": 1001,
    "next_invoice_number": 1001
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;
