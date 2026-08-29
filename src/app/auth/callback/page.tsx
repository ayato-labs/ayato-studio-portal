'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/api';

/**
 * Auth Callback Page (Client-Side)
 *
 * Handles authentication callbacks for:
 * - Email confirmation links (tokens in URL hash)
 * - OAuth redirects (future use)
 *
 * Compatible with `output: "export"` (static HTML / GitHub Pages).
 * Supabase JS client automatically detects tokens in the URL hash
 * and establishes the session via onAuthStateChange.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      setTimeout(() => {
        if (isMounted) setError('Supabase client not initialized.');
      }, 0);
      return () => {
        isMounted = false;
      };
    }

    // The Supabase JS client automatically picks up tokens
    // from the URL hash (#access_token=...) and establishes
    // the session. We just need to listen for the event.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Session established, redirect to LogicHive
        router.replace('/logichive');
      }
    });

    // Fallback: if already signed in, redirect immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && isMounted) {
        router.replace('/logichive');
      }
    });

    // Timeout: if nothing happens in 5 seconds, show error
    const timeout = setTimeout(() => {
      if (isMounted) setError('Authentication timed out. Please try signing in again.');
    }, 5000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#fff',
          fontFamily: 'monospace',
        }}
      >
        <h2 style={{ color: '#f87171' }}>Authentication Error</h2>
        <p style={{ color: '#ffffff80' }}>{error}</p>
        <a href="/logichive" style={{ color: '#22d3ee', marginTop: '1rem' }}>
          Back to LogicHive
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          border: '2px solid #22d3ee',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ marginTop: '1rem', color: '#ffffff60' }}>Authenticating...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
