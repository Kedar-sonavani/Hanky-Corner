const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const adminCheck = require('../middleware/adminCheck');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper: Check if product is within last 30 days (NEW badge)
function isWithinLast30Days(dateString) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(dateString) > thirtyDaysAgo;
}

// GET /api/products
// Public access. Returns all products with computed is_new field.
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories(category_id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Add computed 'is_new' field and flatten categories
    const productsWithFlags = data.map(product => ({
      ...product,
      category_ids: (product.product_categories || []).map(pc => pc.category_id),
      is_new: isWithinLast30Days(product.created_at),
    }));

    res.json(productsWithFlags);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
// Public access. Returns a single product by ID.
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories(category_id)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found' });
      }
      throw error;
    }

    // Add is_new flag and flatten categories
    const productWithFlags = {
      ...data,
      category_ids: (data.product_categories || []).map(pc => pc.category_id),
      is_new: isWithinLast30Days(data.created_at),
    };

    res.json(productWithFlags);
  } catch (err) {
    console.error('Error fetching product detail:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id/related
// Public access. Returns related/suggested products based on categories and keywords.
router.get('/:id/related', async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 4;

  try {
    // 1. Get current product's categories and title to find "keywords"
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('title, product_categories(category_id)')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const categoryIds = (currentProduct.product_categories || []).map(pc => pc.category_id);
    const titleKeywords = currentProduct.title.split(' ').filter(word => word.length > 3);

    // 2. Build Suggestion Query
    // We want products that are in the same categories OR have similar titles
    let relatedQuery = supabase
      .from('products')
      .select(`
        *,
        product_categories(category_id)
      `)
      .neq('id', id);

    // If we have categories, prioritize them
    if (categoryIds.length > 0) {
      // Products in the same categories
      const { data: categoryMatches, error: catError } = await supabase
        .from('product_categories')
        .select('product_id')
        .in('category_id', categoryIds)
        .neq('product_id', id)
        .limit(limit * 2);

      if (!catError && categoryMatches.length > 0) {
        const productIds = categoryMatches.map(m => m.product_id);
        relatedQuery = relatedQuery.in('id', productIds);
      }
    }

    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .neq('id', id)
      .limit(limit * 5); // Get a larger pool to shuffle

    if (relatedError) throw relatedError;

    // 3. Advanced Ranking (Client side shuffle for now, but weighted towards better matches)
    const shuffled = relatedProducts
      .map(p => {
        let score = 0;
        // Boost if title contains keywords
        titleKeywords.forEach(word => {
          if (p.title.toLowerCase().includes(word.toLowerCase())) score += 2;
        });
        return { ...p, score };
      })
      .sort((a, b) => (b.score + Math.random()) - (a.score + Math.random())) // Sort by score + randomness
      .slice(0, limit);

    // Add is_new flags
    const finalProducts = shuffled.map(product => ({
      ...product,
      is_new: isWithinLast30Days(product.created_at),
    }));

    res.json(finalProducts);
  } catch (err) {
    console.error('Related error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products
// Admin only. Create a new product.
router.post('/', adminCheck, async (req, res) => {
  const { title, description, price, discount_price, stock, images, is_featured, category_ids } = req.body;

  // Validation: Price can be 0, so check for undefined/null/empty string
  const isPriceValid = price !== undefined && price !== null && price !== '';
  if (!title || !isPriceValid || !images || !Array.isArray(images) || images.length === 0) {
    console.warn('Product Validation Failed:', { title: !!title, price: isPriceValid, images: !!images, imagesArray: Array.isArray(images), count: images?.length });
    return res.status(400).json({ 
      error: 'Missing required fields: title, price, images (must be a non-empty array)' 
    });
  }

  try {
    // 1. Insert product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([{ title, description, price, discount_price, stock: stock || 0, images, is_featured: is_featured || false }])
      .select();

    if (productError) throw productError;
    const newProduct = productData[0];

    // 2. Insert categories if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      const categoryLinks = category_ids.map(id => ({
        product_id: newProduct.id,
        category_id: id
      }));

      const { error: categoryError } = await supabase
        .from('product_categories')
        .insert(categoryLinks);

      if (categoryError) throw categoryError;
    }

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id
// Admin only. Update an existing product.
router.put('/:id', adminCheck, async (req, res) => {
  const { title, description, price, discount_price, stock, images, is_featured, category_ids } = req.body;
  const { id } = req.params;

  try {
    // 1. Update product basic details
    const { data: productData, error: productError } = await supabase
      .from('products')
      .update({ title, description, price, discount_price, stock, images, is_featured })
      .eq('id', id)
      .select();

    if (productError) throw productError;

    // 2. Update categories (Delete existing and Insert new)
    if (category_ids && Array.isArray(category_ids)) {
      // Clear old associations
      await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', id);

      // Insert new associations
      if (category_ids.length > 0) {
        const categoryLinks = category_ids.map(catId => ({
          product_id: id,
          category_id: catId
        }));
        const { error: categoryError } = await supabase
          .from('product_categories')
          .insert(categoryLinks);
        
        if (categoryError) throw categoryError;
      }
    }

    res.json({ message: 'Product updated successfully', product: productData[0] });
  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/products/:id/stock
// Admin only. Quick stock adjustment.
router.patch('/:id/stock', adminCheck, async (req, res) => {
  const { id } = req.params;
  const { adjustment } = req.body; // Positive to add, negative to subtract

  if (typeof adjustment !== 'number') {
    return res.status(400).json({ error: 'Adjustment must be a number' });
  }

  try {
    // We use RPC for atomic updates to avoid race conditions
    const { data, error } = await supabase.rpc('increment_stock', { 
        product_id: id, 
        quantity: adjustment 
    });

    if (error) {
        // Falling back to simple update if RPC increment_stock doesn't exist yet
        // Let's implement it in SQL or just use update
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', id)
            .single();
        
        if (fetchError) throw fetchError;

        const newStock = (product.stock || 0) + adjustment;
        const { error: updateError } = await supabase
            .from('products')
            .update({ stock: Math.max(0, newStock) })
            .eq('id', id);
        
        if (updateError) throw updateError;
    }

    res.json({ message: 'Stock updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
// Admin only.
router.delete('/:id', adminCheck, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
