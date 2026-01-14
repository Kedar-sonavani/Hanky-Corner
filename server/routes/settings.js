const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const adminCheck = require('../middleware/adminCheck');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET /api/config
router.get('/config', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('is_ecommerce_active, whatsapp_number')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"

    res.json({ 
      is_ecommerce_active: data ? data.is_ecommerce_active : false,
      whatsapp_number: data ? data.whatsapp_number : '917822832788'
    });
  } catch (err) {
    console.error('Error fetching config:', err);
    res.status(500).json({ error: 'Failed to fetch site configuration' });
  }
});

// PUT /api/settings
router.put('/', adminCheck, async (req, res) => {
  const { is_ecommerce_active, whatsapp_number } = req.body;

  try {
    // 1. Check if a row exists
    const { data: existingData } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .single();
    
    let result;
    const updateData = { updated_at: new Date() };
    if (typeof is_ecommerce_active === 'boolean') updateData.is_ecommerce_active = is_ecommerce_active;
    if (whatsapp_number) updateData.whatsapp_number = whatsapp_number;

    if (!existingData) {
        // 2. Create if doesn't exist
        result = await supabase
            .from('site_settings')
            .insert([updateData])
            .select();
    } else {
        // 3. Update existing
        result = await supabase
            .from('site_settings')
            .update(updateData)
            .eq('id', existingData.id) 
            .select();
    }

    if (result.error) throw result.error;

    res.json({ 
        message: 'Site settings updated', 
        settings: result.data ? result.data[0] : null 
    });

  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
