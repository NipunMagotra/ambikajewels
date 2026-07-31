'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PGoldSettings, PGoldFAQ, PGoldPriceHistory, PGoldTransaction } from '@/types/pgold';

export default function AdminPGoldPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'rates' | 'rules' | 'content' | 'faqs' | 'terms' | 'transactions'>('rates');

  const [settings, setSettings] = useState<PGoldSettings | null>(null);
  const [faqs, setFaqs] = useState<PGoldFAQ[]>([]);
  const [priceHistory, setPriceHistory] = useState<PGoldPriceHistory[]>([]);
  const [transactions, setTransactions] = useState<PGoldTransaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // FAQ Modal / Form State
  const [editingFaq, setEditingFaq] = useState<Partial<PGoldFAQ> | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch('/api/admin/check-auth');
      const authData = await authRes.json();

      if (!authData.authenticated) {
        setAuthenticated(false);
        router.push('/admin/login');
        return;
      }

      setAuthenticated(true);
      await loadAllData();
    } catch (err) {
      console.error('Failed auth check:', err);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [settingsRes, faqsRes] = await Promise.all([
        fetch('/api/pgold/settings'),
        fetch('/api/pgold/faqs?admin=true')
      ]);

      const sData = await settingsRes.json();
      const fData = await faqsRes.json();

      if (sData.success) setSettings(sData.data);
      if (fData.success) setFaqs(fData.data);
    } catch (err) {
      showToast('Failed to load initial administrative data', 'error');
    }
  };

  const handleSaveSettings = async (overrideSettings?: Partial<PGoldSettings>) => {
    if (!settings) return;
    setSaving(true);

    const payload = overrideSettings ? { ...settings, ...overrideSettings } : settings;

    try {
      const res = await fetch('/api/pgold/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        showToast(data.message || 'Settings saved successfully!');
      } else {
        showToast(data.message || 'Validation error saving settings', 'error');
      }
    } catch (err) {
      showToast('Server error while saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq?.question?.trim() || !editingFaq?.answer?.trim()) {
      showToast('Question and answer are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/pgold/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq)
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setIsFaqModalOpen(false);
        setEditingFaq(null);
        // Refresh FAQs
        const refreshRes = await fetch('/api/pgold/faqs?admin=true');
        const rData = await refreshRes.json();
        if (rData.success) setFaqs(rData.data);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to save FAQ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/pgold/faqs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('FAQ deleted successfully');
        setFaqs(faqs.filter(f => f.id !== id));
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error deleting FAQ', 'error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (loading || authenticated === null || !settings) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center gap-4 pt-28">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
        <div className="font-label-caps text-xs tracking-widest text-primary font-bold">
          LOADING ADMIN CONTROL PANEL...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background pt-24 pb-20 px-4 sm:px-8">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xs shadow-2xl flex items-center gap-3 text-xs font-semibold border ${
          toast.type === 'success'
            ? 'bg-secondary-container text-on-secondary-container border-secondary/50'
            : 'bg-error-container text-on-error-container border-error/50'
        }`}>
          <span className="material-symbols-outlined text-base">
            {toast.type === 'success' ? 'check_circle' : 'warning'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-xs border border-primary/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">admin_panel_settings</span>
              <h1 className="font-headline-md text-xl sm:text-2xl text-on-surface font-bold">
                P-Gold Control & Settings
              </h1>
              <span className="bg-primary/20 text-primary text-[10px] font-label-caps px-2 py-0.5 rounded-xs font-bold border border-primary/30">
                LIVE ADMIN
              </span>
            </div>
            <p className="text-xs text-on-surface-variant/80 mt-1">
              Manage daily gold rates, rules, FAQs, T&Cs, banner imagery, and live API fetch modes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pgold"
              target="_blank"
              className="px-4 py-2 bg-surface-container hover:bg-surface-variant border border-outline-variant/40 text-on-surface text-xs font-label-caps tracking-wider rounded-xs transition-colors flex items-center gap-1.5 font-bold"
            >
              <span>VIEW CUSTOMER PAGE</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-error-container/20 hover:bg-error-container/40 text-error border border-error/40 text-xs font-label-caps tracking-wider rounded-xs transition-colors flex items-center gap-1.5 font-bold"
            >
              <span className="material-symbols-outlined text-xs">logout</span>
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-outline-variant/30 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'rates', label: 'GOLD RATES & API', icon: 'payments' },
            { id: 'rules', label: 'PURCHASE RULES', icon: 'tune' },
            { id: 'content', label: 'BANNER & TEXT', icon: 'article' },
            { id: 'faqs', label: 'FAQ MANAGER', icon: 'quiz' },
            { id: 'terms', label: 'TERMS & CONDITIONS', icon: 'gavel' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-label-caps tracking-wider font-bold transition-all flex items-center gap-2 rounded-t-xs border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Gold Rates & Pricing Mode */}
        {activeTab === 'rates' && (
          <div className="glass-panel p-6 sm:p-8 rounded-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">payments</span>
                Daily Gold Rate & Pricing Mode
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Configure current 24K and 22K market prices per gram or connect to an automated live bullion API.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Pricing Mode Toggle */}
              <div className="col-span-full bg-surface-container/80 p-5 rounded-xs border border-outline-variant/30 space-y-3">
                <label className="block text-xs font-label-caps text-primary tracking-widest font-bold">
                  PRICING UPDATE MODE
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                    <input
                      type="radio"
                      name="pricing_mode"
                      value="manual"
                      checked={settings.pricing_mode === 'manual'}
                      onChange={() => setSettings({ ...settings, pricing_mode: 'manual' })}
                      className="accent-primary w-4 h-4"
                    />
                    <span>Manual Admin Input</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                    <input
                      type="radio"
                      name="pricing_mode"
                      value="api"
                      checked={settings.pricing_mode === 'api'}
                      onChange={() => setSettings({ ...settings, pricing_mode: 'api' })}
                      className="accent-primary w-4 h-4"
                    />
                    <span>External Live API (Future / Automated)</span>
                  </label>
                </div>
              </div>

              {settings.pricing_mode === 'api' && (
                <div className="col-span-full bg-surface-container/40 p-4 rounded-xs border border-primary/30 space-y-2">
                  <label className="block text-xs font-label-caps text-on-surface-variant font-bold">
                    LIVE GOLD API PROVIDER URL
                  </label>
                  <input
                    type="url"
                    value={settings.api_provider_url || ''}
                    onChange={(e) => setSettings({ ...settings, api_provider_url: e.target.value })}
                    placeholder="https://api.metals.dev/v1/latest or custom gold rate URL..."
                    className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-4 py-2.5 text-xs text-on-surface rounded-xs focus:outline-none"
                  />
                  <p className="text-[11px] text-on-surface-variant/70">
                    If live API fetch fails or times out, the manual price per gram below will automatically serve as the fallback rate.
                  </p>
                </div>
              )}

              {/* 24K Gold Rate */}
              <div className="bg-surface-container/60 p-5 rounded-xs border border-outline-variant/30 space-y-2">
                <label className="block text-xs font-label-caps text-primary tracking-widest font-bold">
                  24K (999 PURE) GOLD RATE PER GRAM (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-primary text-sm font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={settings.price_per_gram_24k}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSettings({
                        ...settings,
                        price_per_gram_24k: val,
                        // Auto calculate 22K rate as 91.7% if desired
                        price_per_gram_22k: Math.round(val * 0.917)
                      });
                    }}
                    className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary pl-8 pr-4 py-2.5 text-lg font-bold text-on-surface rounded-xs focus:outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Current rate for 10 grams: <strong className="text-primary font-mono">₹{(settings.price_per_gram_24k * 10).toLocaleString('en-IN')}</strong>
                </p>
              </div>

              {/* 22K Gold Rate */}
              <div className="bg-surface-container/60 p-5 rounded-xs border border-outline-variant/30 space-y-2">
                <label className="block text-xs font-label-caps text-primary tracking-widest font-bold">
                  22K (916 HALLMARK) GOLD RATE PER GRAM (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-primary text-sm font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={settings.price_per_gram_22k}
                    onChange={(e) => setSettings({ ...settings, price_per_gram_22k: Number(e.target.value) })}
                    className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary pl-8 pr-4 py-2.5 text-lg font-bold text-on-surface rounded-xs focus:outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Current rate for 10 grams: <strong className="text-primary font-mono">₹{(settings.price_per_gram_22k * 10).toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
              <button
                onClick={() => handleSaveSettings()}
                disabled={saving}
                className="gold-bg-gradient px-6 py-3 text-xs font-label-caps tracking-widest font-bold rounded-xs hover:opacity-90 transition-all flex items-center gap-2"
              >
                {saving && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
                <span>SAVE GOLD RATES & PRICING</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Purchase Rules & Limits */}
        {activeTab === 'rules' && (
          <div className="glass-panel p-6 sm:p-8 rounded-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">tune</span>
                Purchase Availability & Transaction Boundaries
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Enable or pause P-Gold transactions online and set minimum/maximum purchase amounts.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Enable / Disable Purchase Status */}
              <div className="bg-surface-container/80 p-5 rounded-xs border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-on-surface">P-Gold Purchases Enabled</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">
                    When disabled, customers can view live rates and information but cannot initiate new purchases.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, is_enabled: !settings.is_enabled })}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                    settings.is_enabled ? 'bg-primary' : 'bg-outline-variant/50'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                      settings.is_enabled ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Min Purchase */}
                <div className="bg-surface-container/60 p-5 rounded-xs border border-outline-variant/30 space-y-2">
                  <label className="block text-xs font-label-caps text-primary tracking-widest font-bold">
                    MINIMUM PURCHASE AMOUNT (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-primary text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={settings.min_purchase_amount}
                      onChange={(e) => setSettings({ ...settings, min_purchase_amount: Number(e.target.value) })}
                      className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary pl-8 pr-4 py-2.5 text-base font-bold text-on-surface rounded-xs focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Minimum gold weight at current rate: ~<strong className="text-primary font-mono">{((settings.min_purchase_amount / settings.price_per_gram_24k)).toFixed(4)}g</strong>
                  </p>
                </div>

                {/* Max Purchase */}
                <div className="bg-surface-container/60 p-5 rounded-xs border border-outline-variant/30 space-y-2">
                  <label className="block text-xs font-label-caps text-primary tracking-widest font-bold">
                    MAXIMUM PURCHASE AMOUNT (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-primary text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="100"
                      value={settings.max_purchase_amount}
                      onChange={(e) => setSettings({ ...settings, max_purchase_amount: Number(e.target.value) })}
                      className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary pl-8 pr-4 py-2.5 text-base font-bold text-on-surface rounded-xs focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Maximum gold weight at current rate: ~<strong className="text-primary font-mono">{((settings.max_purchase_amount / settings.price_per_gram_24k)).toFixed(2)}g</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
              <button
                onClick={() => handleSaveSettings()}
                disabled={saving}
                className="gold-bg-gradient px-6 py-3 text-xs font-label-caps tracking-widest font-bold rounded-xs hover:opacity-90 transition-all flex items-center gap-2"
              >
                {saving && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
                <span>SAVE PURCHASE RULES</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Banner & Page Content */}
        {activeTab === 'content' && (
          <div className="glass-panel p-6 sm:p-8 rounded-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">article</span>
                Page Titles, Banner & Descriptive Content
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Customize headlines, subtitle, hero image, and feature explanation for the customer P-Gold page.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {/* Page Title */}
              <div>
                <label className="block text-xs font-label-caps text-primary tracking-widest font-bold mb-2">
                  PAGE TITLE / HERO HEADLINE
                </label>
                <input
                  type="text"
                  value={settings.page_title}
                  onChange={(e) => setSettings({ ...settings, page_title: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-4 py-2.5 text-sm font-semibold text-on-surface rounded-xs focus:outline-none"
                />
              </div>

              {/* Page Subtitle */}
              <div>
                <label className="block text-xs font-label-caps text-primary tracking-widest font-bold mb-2">
                  PAGE SUBTITLE / BANNER DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={settings.page_subtitle}
                  onChange={(e) => setSettings({ ...settings, page_subtitle: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-4 py-2.5 text-xs text-on-surface rounded-xs focus:outline-none"
                />
              </div>

              {/* Hero Banner Image URL */}
              <div>
                <label className="block text-xs font-label-caps text-primary tracking-widest font-bold mb-2">
                  HERO BANNER IMAGE URL
                </label>
                <input
                  type="text"
                  value={settings.banner_image}
                  onChange={(e) => setSettings({ ...settings, banner_image: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-4 py-2.5 text-xs text-on-surface rounded-xs focus:outline-none mb-2"
                />
                {settings.banner_image && (
                  <div className="relative h-36 w-full rounded-xs overflow-hidden border border-outline-variant/30 bg-surface-container/50">
                    <img
                      src={settings.banner_image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611591474238-005fa9194218?q=80&w=1600&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                      <span className="text-[10px] font-label-caps text-primary font-bold">IMAGE PREVIEW</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content Description */}
              <div>
                <label className="block text-xs font-label-caps text-primary tracking-widest font-bold mb-2">
                  HOW IT WORKS & PROGRAM DESCRIPTION
                </label>
                <textarea
                  rows={4}
                  value={settings.content_description}
                  onChange={(e) => setSettings({ ...settings, content_description: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-4 py-2.5 text-xs text-on-surface rounded-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
              <button
                onClick={() => handleSaveSettings()}
                disabled={saving}
                className="gold-bg-gradient px-6 py-3 text-xs font-label-caps tracking-widest font-bold rounded-xs hover:opacity-90 transition-all flex items-center gap-2"
              >
                {saving && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
                <span>SAVE BANNER & CONTENT</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: FAQ Manager */}
        {activeTab === 'faqs' && (
          <div className="glass-panel p-6 sm:p-8 rounded-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">quiz</span>
                  P-Gold Frequently Asked Questions Manager
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Add, edit, reorder, or toggle questions displayed on the customer P-Gold page.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingFaq({ question: '', answer: '', category: 'general', sort_order: faqs.length + 1, is_active: true });
                  setIsFaqModalOpen(true);
                }}
                className="gold-bg-gradient px-4 py-2.5 text-xs font-label-caps tracking-wider font-bold rounded-xs hover:opacity-90 transition-all flex items-center gap-1.5 self-start"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>ADD NEW FAQ</span>
              </button>
            </div>

            {/* FAQs List Table / Cards */}
            <div className="space-y-3 pt-2">
              {faqs.length === 0 ? (
                <div className="text-center py-10 bg-surface-container/40 rounded-xs text-on-surface-variant text-xs">
                  No FAQs found. Click "Add New FAQ" above to create one.
                </div>
              ) : (
                faqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="bg-surface-container/60 border border-outline-variant/30 p-4 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/20 text-primary text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold">
                          #{faq.sort_order || index + 1}
                        </span>
                        <span className="text-sm font-bold text-on-surface">{faq.question}</span>
                        {!faq.is_active && (
                          <span className="bg-error/20 text-error text-[9px] font-label-caps px-2 py-0.5 rounded-xs">
                            HIDDEN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant/80 line-clamp-2">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => {
                          setEditingFaq(faq);
                          setIsFaqModalOpen(true);
                        }}
                        className="p-2 bg-surface-variant/50 hover:bg-primary/20 text-primary rounded-xs transition-colors"
                        title="Edit FAQ"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="p-2 bg-error-container/20 hover:bg-error-container/40 text-error rounded-xs transition-colors"
                        title="Delete FAQ"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Terms & Conditions */}
        {activeTab === 'terms' && (
          <div className="glass-panel p-6 sm:p-8 rounded-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">gavel</span>
                Legal Terms & Conditions
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Edit the full legal guidelines, redemption rules, and vault storage agreements for Ambika P-Gold.
              </p>
            </div>

            <div>
              <textarea
                rows={12}
                value={settings.terms_and_conditions}
                onChange={(e) => setSettings({ ...settings, terms_and_conditions: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-4 py-3 text-xs font-mono text-on-surface rounded-xs focus:outline-none leading-relaxed"
                placeholder="Enter Terms and Conditions text..."
              />
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
              <button
                onClick={() => handleSaveSettings()}
                disabled={saving}
                className="gold-bg-gradient px-6 py-3 text-xs font-label-caps tracking-widest font-bold rounded-xs hover:opacity-90 transition-all flex items-center gap-2"
              >
                {saving && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
                <span>SAVE TERMS & CONDITIONS</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      {isFaqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-xs border border-primary/40 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-headline-md text-base text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">quiz</span>
                {editingFaq.id ? 'Edit FAQ Item' : 'Add New FAQ Item'}
              </h3>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="text-on-surface-variant hover:text-primary text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveFAQ} className="space-y-4">
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant font-bold mb-1">
                  QUESTION
                </label>
                <input
                  type="text"
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. How do I redeem my digital gold?"
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-3 py-2 text-xs text-on-surface rounded-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant font-bold mb-1">
                  ANSWER
                </label>
                <textarea
                  rows={4}
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Detailed answer explaining the process..."
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-3 py-2 text-xs text-on-surface rounded-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant font-bold mb-1">
                    SORT ORDER
                  </label>
                  <input
                    type="number"
                    value={editingFaq.sort_order || 1}
                    onChange={(e) => setEditingFaq({ ...editingFaq, sort_order: Number(e.target.value) })}
                    className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-3 py-2 text-xs font-mono text-on-surface rounded-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                    <input
                      type="checkbox"
                      checked={editingFaq.is_active !== false}
                      onChange={(e) => setEditingFaq({ ...editingFaq, is_active: e.target.checked })}
                      className="accent-primary w-4 h-4"
                    />
                    <span>Active / Visible</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface text-xs font-label-caps rounded-xs font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="gold-bg-gradient px-5 py-2 text-xs font-label-caps tracking-wider font-bold rounded-xs flex items-center gap-1.5"
                >
                  {saving && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
                  <span>SAVE FAQ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
