-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Only admins can update categories" ON public.categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Only admins can delete categories" ON public.categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true OR EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Only admins can insert products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Only admins can update products" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Only admins can delete products" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Cart items policies
CREATE POLICY "Users can manage their own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Admin users policies
CREATE POLICY "Only admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Only admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );
