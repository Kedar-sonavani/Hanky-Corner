'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            // Supabase client handles the hash fragment automatically in the browser
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Auth callback error:', error.message);
                router.push('/auth?error=' + encodeURIComponent(error.message));
            } else {
                // If we have a session, redirect to the home page or a specific redirect URL
                // Check if there was a redirect parameter stored or just go home
                router.push('/');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Authenticating...</p>
        </div>
    );
}
