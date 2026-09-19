-- roles
create type public.app_role as enum ('admin','customer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles read" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins read roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  seo_title text,
  seo_description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "public read categories" on public.categories for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admins manage categories" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger categories_touch before update on public.categories for each row execute function public.touch_updated_at();

-- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  short_description text,
  description text,
  benefits text[] not null default '{}',
  ingredients text,
  usage_instructions text,
  images text[] not null default '{}',
  price numeric(10,2),
  mrp numeric(10,2),
  stock int not null default 0,
  sku text,
  net_quantity text,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  subscription_available boolean not null default false,
  subscription_discount_pct int not null default 0,
  is_active boolean not null default true,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public read products" on public.products for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admins manage products" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  price numeric(10,2) not null,
  mrp numeric(10,2),
  stock int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.product_variants to anon, authenticated;
grant insert, update, delete on public.product_variants to authenticated;
grant all on public.product_variants to service_role;
alter table public.product_variants enable row level security;
create policy "public read variants" on public.product_variants for select to anon, authenticated using (true);
create policy "admins manage variants" on public.product_variants for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
grant select, insert on public.reviews to anon, authenticated;
grant update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "public read approved reviews" on public.reviews for select to anon, authenticated using (status = 'approved' or public.has_role(auth.uid(),'admin'));
create policy "anyone submits review" on public.reviews for insert to anon, authenticated with check (status = 'pending');
create policy "admins manage reviews" on public.reviews for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- coupons
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null default 'percent' check (discount_type in ('percent','flat')),
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2) not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.coupons to authenticated;
grant all on public.coupons to service_role;
alter table public.coupons enable row level security;
create policy "admins manage coupons" on public.coupons for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  email text,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  subtotal numeric(10,2) not null default 0,
  shipping_amount numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  coupon_code text,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_method text not null default 'cod' check (payment_method in ('cod','razorpay')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  razorpay_order_id text,
  razorpay_payment_id text,
  tracking_number text,
  courier text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "own orders read" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "admins manage orders" on public.orders for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  variant_label text,
  unit_price numeric(10,2) not null,
  quantity int not null,
  image_url text,
  created_at timestamptz not null default now()
);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "own order items read" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "admins manage order items" on public.order_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  reference text not null unique,
  consultation_type text not null,
  booking_date date not null,
  slot_time text not null,
  customer_name text not null,
  phone text not null,
  email text,
  message text,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_date, slot_time)
);
grant select, update on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "own bookings read" on public.bookings for select to authenticated using (auth.uid() = user_id);
create policy "admins manage bookings" on public.bookings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger bookings_touch before update on public.bookings for each row execute function public.touch_updated_at();

create table public.booking_settings (
  id boolean primary key default true check (id),
  working_days int[] not null default '{1,2,3,4,5,6}',
  start_time text not null default '09:00',
  end_time text not null default '18:00',
  slot_minutes int not null default 30,
  blocked_dates date[] not null default '{}',
  blocked_slots text[] not null default '{}',
  consultation_types text[] not null default '{"Ayurvedic Consultation","Nadi Pariksha","Lifestyle Consultation","Follow-up Consultation","Panchakarma Consultation"}',
  updated_at timestamptz not null default now()
);
grant select on public.booking_settings to anon, authenticated;
grant insert, update on public.booking_settings to authenticated;
grant all on public.booking_settings to service_role;
alter table public.booking_settings enable row level security;
create policy "public read booking settings" on public.booking_settings for select to anon, authenticated using (true);
create policy "admins manage booking settings" on public.booking_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.booking_settings (id) values (true);

-- wishlist
create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
grant select, insert, delete on public.wishlist_items to authenticated;
grant all on public.wishlist_items to service_role;
alter table public.wishlist_items enable row level security;
create policy "own wishlist" on public.wishlist_items for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- content
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  cover_url text,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "public read posts" on public.blog_posts for select to anon, authenticated using (is_published or public.has_role(auth.uid(),'admin'));
create policy "admins manage posts" on public.blog_posts for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  location text,
  quote text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "public read testimonials" on public.testimonials for select to anon, authenticated using (is_published or public.has_role(auth.uid(),'admin'));
create policy "admins manage testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.faqs to anon, authenticated;
grant insert, update, delete on public.faqs to authenticated;
grant all on public.faqs to service_role;
alter table public.faqs enable row level security;
create policy "public read faqs" on public.faqs for select to anon, authenticated using (is_published or public.has_role(auth.uid(),'admin'));
create policy "admins manage faqs" on public.faqs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.site_settings (key, value) values
  ('shipping', '{"flat_rate": 60, "free_above": 999}'),
  ('contact', '{"phone": "+919996415501", "email": "vaidbharti80@gmail.com", "whatsapp": "+919996415501", "address": "Panchsheel Aarogya Dhaam, Barwala Road, Near Shree Ram ITI, Hansi, Haryana 125033", "hours": "Monday - Saturday, 9:00 AM - 6:00 PM"}');

-- seed categories
insert into public.categories (slug, name, description, sort_order) values
  ('oils','Oils','Traditional Ayurvedic herbal oils for external use.',1),
  ('powders','Powders','Classical churna preparations for daily routines.',2),
  ('shilajit','Shilajit','Purified Himalayan Shilajit resin.',3),
  ('capsules','Capsules','Ayurvedic preparations in convenient capsule form.',4),
  ('skin-care','Skin Care','Herbal skin care preparations for gentle external use.',5),
  ('hair-care','Hair Care','Herbal hair and scalp care preparations.',6);

-- seed testimonials
insert into public.testimonials (author_name, location, quote, sort_order) values
  ('Ramesh S.','Delhi','I was suffering from chronic acidity for years. Vaidh Bharti''s treatment gave me relief within weeks. It felt like magic, but it''s just pure Ayurveda!',1),
  ('Neha B.','Jaipur','Panchakarma at Panchsheel Aarogya Dhaam changed my life. I feel lighter, calmer, and more energetic.',2),
  ('Ankita M.','Mumbai','Unlike hospitals, here I felt heard and healed. Thank you, Vaidh Bharti!',3);
