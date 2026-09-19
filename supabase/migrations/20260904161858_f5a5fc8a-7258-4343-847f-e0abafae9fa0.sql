CREATE TABLE public.product_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_faqs TO authenticated;
GRANT ALL ON public.product_faqs TO service_role;

ALTER TABLE public.product_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon read product faqs" ON public.product_faqs FOR SELECT TO anon USING (is_published);
CREATE POLICY "users read product faqs" ON public.product_faqs FOR SELECT TO authenticated USING (is_published OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins manage product faqs" ON public.product_faqs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER product_faqs_touch BEFORE UPDATE ON public.product_faqs FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX product_faqs_product_idx ON public.product_faqs(product_id, sort_order);