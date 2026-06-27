const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const adminCheck = require('../middleware/adminCheck');

// Initialize Supabase with basic validation
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ CRITICAL ERROR: Supabase environment variables are missing on the server!');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// GET /api/categories
// Public access. Returns all categories.
router.get('/', async (req, res) => {
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      error: 'Backend configuration error: Supabase keys are missing. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY on the server.' 
    });
  }

  try {

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('[categories] Error fetching categories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/categories
// Admin only. Create a new category.
router.post('/', adminCheck, async (req, res) => {
  const { name, slug, description } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required' });
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, description }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('[categories] Error creating category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/categories/:id
// Admin only. Delete a category.
router.delete('/:id', adminCheck, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('[categories] Error deleting category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/categories/:categoryId/products
// Public access. Returns products in a category.
router.get('/:categoryId/products', async (req, res) => {
  const { categoryId } = req.params;

  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select(`
        products (*)
      `)
      .eq('category_id', categoryId);

    if (error) throw error;
    
    // Flatten result
    const products = data.map(item => item.products);
    res.json(products);
  } catch (err) {
    console.error('[categories] Error fetching category products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
