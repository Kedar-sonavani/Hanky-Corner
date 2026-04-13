const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');

const authCheck = require('../middleware/authCheck');
const validate = require('../middleware/validate');
const { createPaymentOrderSchema, verifyPaymentSchema } = require('../validators/schemas');

// Task 2.2: Warn at module load time if credentials are missing
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('[payments] WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from environment variables.');
}

// Task 2.2: Initialise Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Task 4.2: computeSignature
 * Returns HMAC-SHA256 hex digest of `${orderId}|${paymentId}` using the secret.
 */
function computeSignature(orderId, paymentId, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

/**
 * Task 3.2: POST /api/payments/create-order
 */
router.post('/create-order', authCheck, validate(createPaymentOrderSchema), async (req, res) => {
  const { total_price } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(total_price * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('[payments] Razorpay create-order error:', err);
    return res.status(502).json({ error: 'Failed to create Razorpay order. Please try again later.' });
  }
});

/**
 * Task 4.4: POST /api/payments/verify
 */
router.post('/verify', authCheck, validate(verifyPaymentSchema), async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    total_price,
    items,
  } = req.body;

  // Verify HMAC-SHA256 signature
  const expectedSignature = computeSignature(
    razorpay_order_id,
    razorpay_payment_id,
    process.env.RAZORPAY_KEY_SECRET
  );

  console.log('[payments/verify] razorpay_order_id:', razorpay_order_id);
  console.log('[payments/verify] razorpay_payment_id:', razorpay_payment_id);
  console.log('[payments/verify] received signature:', razorpay_signature);
  console.log('[payments/verify] expected signature:', expectedSignature);
  console.log('[payments/verify] signature match:', expectedSignature === razorpay_signature);

  if (expectedSignature !== razorpay_signature) {
    console.error('[payments/verify] SIGNATURE MISMATCH — check RAZORPAY_KEY_SECRET in .env');
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  // Signature valid — persist the order directly via Supabase inserts
  try {
    // 1. Insert the order row
    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        total_price: Number(total_price),
        status: 'pending',
        razorpay_payment_id,
        razorpay_order_id,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error(`[payments] ERROR: order insert failed. razorpay_payment_id=${razorpay_payment_id}`, orderError);
      return res.status(500).json({ error: 'Failed to place order. Please contact support with your payment ID.' });
    }

    const order_id = orderRow.id;

    // 2. Insert order items and decrement stock
    for (const item of items) {
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id,
          product_id: item.product_id,
          quantity: Number(item.quantity),
          price_at_purchase: Number(item.price),
          product_title: item.title,
        });

      if (itemError) {
        console.error(`[payments] ERROR: order_items insert failed for product ${item.product_id}`, itemError);
        return res.status(500).json({ error: 'Failed to place order. Please contact support with your payment ID.' });
      }

      // Decrement stock atomically
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: Number(item.quantity),
      });

      if (stockError) {
        console.error(`[payments] ERROR: decrement_stock failed for product ${item.product_id}`, stockError);
      }
    }

    return res.status(201).json({
      message: 'Order placed successfully',
      order_id,
      razorpay_payment_id,
    });
  } catch (err) {
    console.error(`[payments] ERROR: Unexpected error in verify. razorpay_payment_id=${razorpay_payment_id}, razorpay_order_id=${razorpay_order_id}`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { router, computeSignature };
