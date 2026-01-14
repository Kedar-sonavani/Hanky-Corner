const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const adminCheck = require('../middleware/adminCheck');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET /api/categories
// Public access. Returns all categories.
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: err.message });
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
    console.error('Error creating category:', err);
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
