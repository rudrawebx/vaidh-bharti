-- Split public read policies so anonymous visitors never need the admin role helper
DROP POLICY IF EXISTS "public read products" ON public.products;
CREATE POLICY "anon read active products" ON public.products FOR SELECT TO anon USING (is_active);
CREATE POLICY "users read active products" ON public.products FOR SELECT TO authenticated
  USING (is_active OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "public read categories" ON public.categories;
CREATE POLICY "anon read active categories" ON public.categories FOR SELECT TO anon USING (is_active);
CREATE POLICY "users read active categories" ON public.categories FOR SELECT TO authenticated
  USING (is_active OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "public read approved reviews" ON public.reviews;
CREATE POLICY "anon read approved reviews" ON public.reviews FOR SELECT TO anon USING (status = 'approved');
CREATE POLICY "users read approved reviews" ON public.reviews FOR SELECT TO authenticated
  USING (status = 'approved' OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "public read testimonials" ON public.testimonials;
CREATE POLICY "anon read testimonials" ON public.testimonials FOR SELECT TO anon USING (is_published);
CREATE POLICY "users read testimonials" ON public.testimonials FOR SELECT TO authenticated
  USING (is_published OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "public read faqs" ON public.faqs;
CREATE POLICY "anon read faqs" ON public.faqs FOR SELECT TO anon USING (is_published);
CREATE POLICY "users read faqs" ON public.faqs FOR SELECT TO authenticated
  USING (is_published OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "public read posts" ON public.blog_posts;
CREATE POLICY "anon read posts" ON public.blog_posts FOR SELECT TO anon USING (is_published);
CREATE POLICY "users read posts" ON public.blog_posts FOR SELECT TO authenticated
  USING (is_published OR public.has_role(auth.uid(), 'admin'));