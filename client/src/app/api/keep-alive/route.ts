import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (not public abuse)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Perform a real database query (required to prevent pausing)
  const { data, error } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1);

  if (error) {
    console.error('[keep-alive] DB ping failed:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    rows: data?.length ?? 0 
  });
}
