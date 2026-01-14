-- Antigravity Rulebook v3.0 Database Schema
-- CLEAN VERSION (Copy and Run this in Supabase SQL Editor)

-- 1. Site Settings (The Master Switch)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  is_ecommerce_active BOOLEAN DEFAULT false NOT NULL,
  whatsapp_number TEXT DEFAULT '917822832788' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial value (only if empty)
INSERT INTO public.site_settings (is_ecommerce_active, whatsapp_number)
SELECT false, '917822832788'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read
CREATE POLICY "Public can read site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Policy: Admin Update (Authenticated users)
CREATE POLICY "Admins can update site settings"
  ON public.site_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');


-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC, -- Optional discount price
  images TEXT[] NOT NULL DEFAULT '{}', -- Array of image URLs
  is_featured BOOLEAN DEFAULT false, -- Admin can mark as featured
  stock INTEGER DEFAULT 0, -- Inventory levels
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for performance (sorting by newest)
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read
CREATE POLICY "Public can read products"
  ON public.products
  FOR SELECT
  USING (true);

-- Policy: Admin Full Access
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');


CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read
CREATE POLICY "Public can read categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Policy: Admin Full Access
CREATE POLICY "Admins can insert categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update categories"
  ON public.categories
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete categories"
  ON public.categories
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- 4. Product Categories Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read
CREATE POLICY "Public can read product categories"
  ON public.product_categories
  FOR SELECT
  USING (true);

-- Policy: Admin Full Access
CREATE POLICY "Admins can manage product categories"
  ON public.product_categories
  FOR ALL
  USING (auth.role() = 'authenticated');



-- 3. Storage Bucket Policy (CORRECTED SYNTAX)
-- Ensure you have created a bucket named 'product-assets' and set it to Public.

-- A. Public Read Access
CREATE POLICY "Public Access" 
  ON storage.objects 
  FOR SELECT 
  USING ( bucket_id = 'product-assets' );

-- B. Upload Access (Relaxed for MVP - Allows uploads without Login)
-- If you implement a Login page later, change this to auth.role() = 'authenticated'
CREATE POLICY "Public Upload MVP" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK ( bucket_id = 'product-assets' );

-- C. Update Access
CREATE POLICY "Admin Update" 
  ON storage.objects 
  FOR UPDATE 
  USING ( bucket_id = 'product-assets' );

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, processing, shipped, delivered, cancelled
  admin_notes TEXT, -- Internal admin notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Order Items Table (Line items)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC NOT NULL,
  product_title TEXT NOT NULL -- Snapshot in case product is deleted/renamed
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert (place orders)
CREATE POLICY "Public can place orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can insert order items" 
  ON public.order_items 
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Admin Full Access
CREATE POLICY "Admins can view orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can view order items" 
  ON public.order_items 
  FOR SELECT 
  USING (auth.role() = 'authenticated');
-- Function to decrement stock atomically
CREATE OR REPLACE FUNCTION public.decrement_stock(product_id UUID, quantity INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - quantity
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment stock atomically
CREATE OR REPLACE FUNCTION public.increment_stock(product_id UUID, quantity INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET stock = stock + quantity
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

