
-- ============================================================
-- ABANCOOL BILLING - Full Production Schema
-- ============================================================

-- Role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'support', 'customer');
CREATE TYPE public.order_status AS ENUM ('draft', 'pending_payment', 'paid', 'processing', 'active', 'failed', 'cancelled', 'refunded');
CREATE TYPE public.invoice_status AS ENUM ('unpaid', 'pending', 'paid', 'cancelled', 'refunded');
CREATE TYPE public.payment_status AS ENUM ('initiated', 'pending', 'success', 'failed', 'reversed');
CREATE TYPE public.service_status AS ENUM ('pending', 'provisioning', 'active', 'suspended', 'terminated', 'failed');
CREATE TYPE public.domain_status AS ENUM ('pending', 'active', 'transfer_pending', 'expired', 'failed');
CREATE TYPE public.ticket_status AS ENUM ('open', 'customer_reply', 'admin_reply', 'closed');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'quarterly', 'semiannual', 'annual', 'biennial', 'triennial');
CREATE TYPE public.product_type AS ENUM ('shared_hosting', 'reseller_hosting', 'vps_placeholder', 'addon');
CREATE TYPE public.cart_item_type AS ENUM ('hosting', 'domain_register', 'domain_transfer', 'domain_renew', 'addon');
CREATE TYPE public.coupon_discount_type AS ENUM ('fixed', 'percent');

-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  role public.app_role NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'active',
  company_name TEXT DEFAULT '',
  address_line1 TEXT DEFAULT '',
  address_line2 TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  postal_code TEXT DEFAULT '',
  country TEXT DEFAULT 'KE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. USER_ROLES (for RLS helper)
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECURITY DEFINER FUNCTIONS (for RLS without recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin', 'admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin', 'admin', 'support')
  )
$$;

-- ============================================================
-- AUTO-CREATE PROFILE + ROLE ON SIGNUP
-- First user becomes super_admin, rest become customer
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
  _user_count INT;
BEGIN
  SELECT COUNT(*) INTO _user_count FROM public.profiles;
  IF _user_count = 0 THEN
    _role := 'super_admin';
  ELSE
    _role := 'customer';
  END IF;

  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    _role
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PROFILES RLS POLICIES
-- ============================================================
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Staff can view profiles" ON public.profiles FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- USER_ROLES RLS
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.is_admin_or_above(auth.uid()));

-- ============================================================
-- 3. HOSTING CATEGORIES
-- ============================================================
CREATE TABLE public.hosting_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hosting_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active categories" ON public.hosting_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.hosting_categories FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_hosting_categories_updated_at BEFORE UPDATE ON public.hosting_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. HOSTING PRODUCTS
-- ============================================================
CREATE TABLE public.hosting_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.hosting_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  product_type public.product_type NOT NULL DEFAULT 'shared_hosting',
  short_description TEXT DEFAULT '',
  features_json JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  badge_text TEXT DEFAULT '',
  directadmin_package_name TEXT DEFAULT '',
  server_group TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hosting_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active products" ON public.hosting_products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can read all products" ON public.hosting_products FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Admins can manage products" ON public.hosting_products FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_hosting_products_updated_at BEFORE UPDATE ON public.hosting_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. HOSTING PRODUCT PRICING
-- ============================================================
CREATE TABLE public.hosting_product_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.hosting_products(id) ON DELETE CASCADE,
  billing_cycle public.billing_cycle NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  setup_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KES',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hosting_product_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active pricing" ON public.hosting_product_pricing FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage pricing" ON public.hosting_product_pricing FOR ALL USING (public.is_admin_or_above(auth.uid()));

-- ============================================================
-- 6. DOMAIN TLDS
-- ============================================================
CREATE TABLE public.domain_tlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tld TEXT NOT NULL UNIQUE,
  register_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  transfer_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  renew_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  restore_price NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.domain_tlds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active TLDs" ON public.domain_tlds FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can read all TLDs" ON public.domain_tlds FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Admins can manage TLDs" ON public.domain_tlds FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_domain_tlds_updated_at BEFORE UPDATE ON public.domain_tlds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. CART ITEMS
-- ============================================================
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type public.cart_item_type NOT NULL,
  product_id UUID REFERENCES public.hosting_products(id) ON DELETE SET NULL,
  domain_name TEXT,
  tld TEXT,
  billing_cycle public.billing_cycle,
  quantity INT NOT NULL DEFAULT 1,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SEQUENCE FOR ORDER AND INVOICE NUMBERS
-- ============================================================
CREATE SEQUENCE public.order_number_seq START 10001;
CREATE SEQUENCE public.invoice_number_seq START 10001;

-- ============================================================
-- 8. ORDERS
-- ============================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE DEFAULT 'ORD-' || nextval('public.order_number_seq')::TEXT,
  status public.order_status NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KES',
  coupon_id UUID,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 9. ORDER ITEMS
-- ============================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_type public.cart_item_type NOT NULL,
  product_id UUID REFERENCES public.hosting_products(id) ON DELETE SET NULL,
  description TEXT NOT NULL DEFAULT '',
  domain_name TEXT,
  billing_cycle public.billing_cycle,
  qty INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins view all order items" ON public.order_items FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (public.is_admin_or_above(auth.uid()));

-- ============================================================
-- 10. INVOICES
-- ============================================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE DEFAULT 'INV-' || nextval('public.invoice_number_seq')::TEXT,
  status public.invoice_status NOT NULL DEFAULT 'unpaid',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KES',
  due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all invoices" ON public.invoices FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 11. INVOICE ITEMS
-- ============================================================
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL DEFAULT '',
  qty INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own invoice items" ON public.invoice_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
);
CREATE POLICY "Admins view all invoice items" ON public.invoice_items FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Admins can manage invoice items" ON public.invoice_items FOR ALL USING (public.is_admin_or_above(auth.uid()));

-- ============================================================
-- 12. PAYMENTS
-- ============================================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL DEFAULT 'intersend_mpesa',
  method TEXT NOT NULL DEFAULT 'mpesa_stk_push',
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KES',
  status public.payment_status NOT NULL DEFAULT 'initiated',
  provider_reference TEXT,
  merchant_reference TEXT,
  checkout_request_id TEXT,
  phone_number TEXT,
  raw_request_json JSONB DEFAULT '{}'::jsonb,
  raw_response_json JSONB DEFAULT '{}'::jsonb,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all payments" ON public.payments FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 13. DOMAINS
-- ============================================================
CREATE TABLE public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL UNIQUE,
  tld TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'register',
  registrar TEXT DEFAULT '',
  status public.domain_status NOT NULL DEFAULT 'pending',
  expiry_date DATE,
  nameservers_json JSONB DEFAULT '[]'::jsonb,
  epp_code TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own domains" ON public.domains FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all domains" ON public.domains FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Admins can manage domains" ON public.domains FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 14. HOSTING SERVICES
-- ============================================================
CREATE TABLE public.hosting_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.hosting_products(id) ON DELETE SET NULL,
  domain_name TEXT NOT NULL DEFAULT '',
  username TEXT DEFAULT '',
  server_hostname TEXT DEFAULT '',
  server_ip TEXT DEFAULT '',
  status public.service_status NOT NULL DEFAULT 'pending',
  billing_cycle public.billing_cycle,
  next_due_date DATE,
  directadmin_user TEXT DEFAULT '',
  directadmin_domain TEXT DEFAULT '',
  package_name TEXT DEFAULT '',
  da_response_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hosting_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own services" ON public.hosting_services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all services" ON public.hosting_services FOR SELECT USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Admins can manage services" ON public.hosting_services FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_hosting_services_updated_at BEFORE UPDATE ON public.hosting_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 15. SERVICE CREDENTIALS (sensitive - no direct customer access)
-- ============================================================
CREATE TABLE public.service_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hosting_service_id UUID NOT NULL REFERENCES public.hosting_services(id) ON DELETE CASCADE,
  encrypted_password TEXT DEFAULT '',
  encrypted_login_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage credentials" ON public.service_credentials FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_service_credentials_updated_at BEFORE UPDATE ON public.service_credentials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 16. SUPPORT DEPARTMENTS
-- ============================================================
CREATE TABLE public.support_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.support_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active departments" ON public.support_departments FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage departments" ON public.support_departments FOR ALL USING (public.is_admin_or_above(auth.uid()));

-- ============================================================
-- 17. SUPPORT TICKETS
-- ============================================================
CREATE SEQUENCE public.ticket_number_seq START 1001;
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE DEFAULT 'TKT-' || nextval('public.ticket_number_seq')::TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.support_departments(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  status public.ticket_status NOT NULL DEFAULT 'open',
  service_id UUID REFERENCES public.hosting_services(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Staff view all tickets" ON public.support_tickets FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update tickets" ON public.support_tickets FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 18. SUPPORT TICKET MESSAGES
-- ============================================================
CREATE TABLE public.support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_role public.app_role NOT NULL DEFAULT 'customer',
  message TEXT NOT NULL DEFAULT '',
  attachments_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own ticket messages" ON public.support_ticket_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.support_tickets WHERE support_tickets.id = support_ticket_messages.ticket_id AND support_tickets.user_id = auth.uid())
);
CREATE POLICY "Users create messages on own tickets" ON public.support_ticket_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_user_id AND EXISTS (SELECT 1 FROM public.support_tickets WHERE support_tickets.id = support_ticket_messages.ticket_id AND support_tickets.user_id = auth.uid())
);
CREATE POLICY "Staff view all messages" ON public.support_ticket_messages FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff create messages" ON public.support_ticket_messages FOR INSERT WITH CHECK (public.is_staff(auth.uid()));

-- ============================================================
-- 19. COUPONS
-- ============================================================
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type public.coupon_discount_type NOT NULL DEFAULT 'percent',
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  applies_to_json JSONB DEFAULT '{}'::jsonb,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  max_uses INT,
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 20. ADMIN SETTINGS
-- ============================================================
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value_json JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage settings" ON public.admin_settings FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 21. AUTOMATION LOGS
-- ============================================================
CREATE TABLE public.automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL DEFAULT '',
  entity_id TEXT DEFAULT '',
  action TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '',
  request_json JSONB DEFAULT '{}'::jsonb,
  response_json JSONB DEFAULT '{}'::jsonb,
  error_message TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view logs" ON public.automation_logs FOR SELECT USING (public.is_admin_or_above(auth.uid()));

-- ============================================================
-- 22. WEBHOOK EVENTS
-- ============================================================
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT '',
  event_type TEXT NOT NULL DEFAULT '',
  event_id TEXT DEFAULT '',
  payload_json JSONB DEFAULT '{}'::jsonb,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view webhooks" ON public.webhook_events FOR SELECT USING (public.is_admin_or_above(auth.uid()));

-- ============================================================
-- 23. ANNOUNCEMENTS
-- ============================================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published announcements" ON public.announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (public.is_admin_or_above(auth.uid()));
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('ticket-attachments', 'ticket-attachments', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Users can upload payment proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own payment proofs" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins can view all payment proofs" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs' AND public.is_admin_or_above(auth.uid()));

CREATE POLICY "Users can upload ticket attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ticket-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own attachments" ON storage.objects FOR SELECT USING (bucket_id = 'ticket-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Staff can view all attachments" ON storage.objects FOR SELECT USING (bucket_id = 'ticket-attachments' AND public.is_staff(auth.uid()));

CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Avatars are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_checkout_request ON public.payments(checkout_request_id);
CREATE INDEX idx_hosting_services_user_id ON public.hosting_services(user_id);
CREATE INDEX idx_hosting_services_status ON public.hosting_services(status);
CREATE INDEX idx_domains_user_id ON public.domains(user_id);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_automation_logs_entity ON public.automation_logs(entity_type, entity_id);
CREATE INDEX idx_webhook_events_processed ON public.webhook_events(processed);
CREATE INDEX idx_webhook_events_event_id ON public.webhook_events(event_id);

-- ============================================================
-- SEED SUPPORT DEPARTMENTS
-- ============================================================
INSERT INTO public.support_departments (name) VALUES ('Technical Support'), ('Billing'), ('Sales'), ('General Inquiry');
