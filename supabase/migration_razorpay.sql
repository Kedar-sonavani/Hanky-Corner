-- Migration: Razorpay Payment Integration
-- Run this in the Supabase SQL Editor.

-- 1. Add Razorpay columns to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- 2. Create (or replace) the place_order RPC
--    New parameters default to NULL so the existing POST /api/orders route
--    continues to work without any changes.
CREATE OR REPLACE FUNCTION public.place_order(
  p_customer_name       TEXT,
  p_customer_email      TEXT,
  p_customer_phone      TEXT,
  p_shipping_address    TEXT,
  p_total_price         NUMERIC,
  p_items               JSONB,
  p_razorpay_payment_id TEXT DEFAULT NULL,
  p_razorpay_order_id   TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_order_id      UUID;
  v_item          JSONB;
  v_rows_updated  INTEGER;
BEGIN
  -- Insert the order row
  INSERT INTO public.orders (
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    total_price,
    status,
    razorpay_payment_id,
    razorpay_order_id
  ) VALUES (
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_shipping_address,
    p_total_price,
    'pending',
    p_razorpay_payment_id,
    p_razorpay_order_id
  )
  RETURNING id INTO v_order_id;

  -- Insert each line item and decrement stock atomically
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      price_at_purchase,
      product_title
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      (v_item->>'quantity')::INTEGER,
      (v_item->>'price')::NUMERIC,
      v_item->>'title'
    );

    SELECT public.decrement_stock(
      (v_item->>'product_id')::UUID,
      (v_item->>'quantity')::INTEGER
    ) INTO v_rows_updated;

    IF v_rows_updated = 0 THEN
      RAISE EXCEPTION 'Insufficient stock for product %', v_item->>'product_id';
    END IF;
  END LOOP;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;
