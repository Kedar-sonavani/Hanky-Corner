import { createClient } from '@supabase/supabase-js';

// These should be in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key missing in client environment');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
