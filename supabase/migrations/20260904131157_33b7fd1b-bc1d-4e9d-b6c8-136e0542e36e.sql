GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.booking_settings TO anon;

CREATE OR REPLACE FUNCTION public.booked_slots(_from date, _to date)
RETURNS TABLE (booking_date date, slot_time text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.booking_date, b.slot_time::text
  FROM public.bookings b
  WHERE b.booking_date BETWEEN _from AND _to
    AND b.status <> 'cancelled'
$$;

REVOKE ALL ON FUNCTION public.booked_slots(date, date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.booked_slots(date, date) TO anon, authenticated, service_role;