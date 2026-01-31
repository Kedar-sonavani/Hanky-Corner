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
        order_items (*)
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
    // 0. Verify stock availability for all items
    for (const item of items) {
      const { data: product, error: stockError } = await supabase
        .from('products')
        .select('stock, title')
        .eq('id', item.product_id)
        .single();

      if (stockError || !product) {
        return res.status(404).json({ error: `Product ${item.title || 'Unknown'} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.title}. Available: ${product.stock}` });
      }
    }

    // 1. Insert into orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
        customer_name, 
        customer_email, 
        customer_phone, 
        shipping_address, 
        total_price 
      }])
      .select();

    if (orderError) throw orderError;
    const newOrder = orderData[0];

    // 2. Insert into order_items table
    const orderItems = items.map(item => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price,
      product_title: item.title
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Decrement stock for all items atomically
    const failedItems = [];
    for (const item of items) {
      const { data: success, error: decError } = await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      });

      if (decError || !success) {
        failedItems.push(item.title || item.product_id);
      }
    }

    if (failedItems.length > 0) {
      // If we failed to decrement some items (likely due to a race condition where stock ran out)
      // Note: In a production app, we would ideally roll back the order insertion here.
      // For now, we notify the user.
      return res.status(400).json({ 
        error: `Order partially failed: Stock for ${failedItems.join(', ')} ran out during checkout. Please contact support.`,
        order_id: newOrder.id 
      });
    }

    res.status(201).json({ message: 'Order placed successfully', order_id: newOrder.id });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: err.message });
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
                order_items (*)
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
