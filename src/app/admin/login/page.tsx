'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

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
      <main className="min-h-screen pt-24 pb-24 lg:pb-section-gap flex items-center justify-center bg-surface px-4">
        <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-8 max-w-md w-full rounded-xs">
          <div className="text-center mb-6 sm:mb-8">
            <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl mb-3">admin_panel_settings</span>
            <h1 className="font-headline-md text-xl sm:text-2xl text-primary font-semibold">Owner Portal</h1>
            <p className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant mt-1.5 font-semibold tracking-wider">SECURE STORE LOGIN</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-6">
            {error && (
              <div className="bg-error-container text-on-error-container p-3 text-xs sm:text-sm rounded-xs border border-error/30">
                {error}
              </div>
            )}
            
            <div>
              <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">EMAIL ADDRESS</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm p-3 outline-none transition-colors rounded-xs"
                placeholder="owner@ambikajewels.com"
              />
            </div>
            
            <div>
              <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">PASSWORD</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm p-3 outline-none transition-colors rounded-xs"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 gold-bg-gradient px-4 py-3.5 font-label-caps text-xs text-background font-bold hover:brightness-110 transition-all disabled:opacity-50 tracking-wider shadow-md"
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
