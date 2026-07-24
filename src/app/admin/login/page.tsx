'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-section-gap flex items-center justify-center bg-surface">
        <div className="bg-surface-container border border-outline-variant p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">admin_panel_settings</span>
            <h1 className="font-headline-sm text-headline-sm text-primary">Owner Portal</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-2">SECURE LOGIN</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {error && (
              <div className="bg-error-container text-on-error-container p-3 text-sm rounded">
                {error}
              </div>
            )}
            
            <div>
              <label className="font-label-caps text-xs text-on-surface-variant block mb-2">EMAIL ADDRESS</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-outline focus:border-primary text-on-surface font-body-md p-3 outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="font-label-caps text-xs text-on-surface-variant block mb-2">PASSWORD</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-outline focus:border-primary text-on-surface font-body-md p-3 outline-none transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 gold-bg-gradient px-4 py-4 font-label-caps text-label-caps text-background font-bold hover:brightness-110 transition-colors disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
