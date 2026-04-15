const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const adminCheck = require('../middleware/adminCheck');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);  

const validate = require('../middleware/validate');
const authCheck = require('../middleware/authCheck');
const { orderSchema } = require('../validators/schemas');

/**
 * GET /api/orders/mine
 * User access to view their own orders based on JWT email
 */
router.get('/mine', authCheck, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products ( images )
        )
      `)
      .eq('customer_email', req.user.email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * POST /api/orders
 * Public access to place an order
 */
router.post('/', validate(orderSchema), async (req, res) => {
  const { customer_name, customer_email, customer_phone, shipping_address, total_price, items } = req.body;

  try {
    const { data: orderId, error } = await supabase.rpc('place_order', {
      p_customer_name: customer_name,
      p_customer_email: customer_email,
      p_customer_phone: customer_phone,
      p_shipping_address: shipping_address,
      p_total_price: total_price,
      p_items: items
    });

    if (error) {
      // Postgres automatically rolls back EVERYTHING if an error/exception is raised
      console.error('RPC Error placing order:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * GET /api/orders
 * Admin access to view all orders
 */
router.get('/', adminCheck, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                  *,
                  products ( images )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/orders/:id/items
 * Admin access to view items of a specific order
 */
router.get('/:id/items', adminCheck, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', req.params.id);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching order items:', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * PUT /api/orders/:id
 * Admin access to update order status or notes
 */
router.put('/:id', adminCheck, async (req, res) => {
    const { status, admin_notes } = req.body;
    try {
        const updateData = {};
        if (status) updateData.status = status;
        if (admin_notes !== undefined) updateData.admin_notes = admin_notes;

        const { data, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
