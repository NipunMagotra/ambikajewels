'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ConsentPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CONSENT_STORAGE_KEY = 'ambika_dpdp_consent_v1';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        setShowBanner(true);
      } else {
        const parsed: ConsentPreferences = JSON.parse(stored);
        applyConsent(parsed);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const applyConsent = (prefs: ConsentPreferences) => {
    // If non-essential consent is not granted, block non-essential scripts
    if (typeof window !== 'undefined') {
      (window as any).__AMBIKA_CONSENT__ = prefs;
      if (!prefs.analytics) {
        // Disable third-party tracking cookies/scripts
        (window as any)['ga-disable-analytics'] = true;
      }
    }
  };

  const handleAcceptAll = () => {
    const prefs: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    savePreferences(prefs);
  };

  const handleAcceptEssentialOnly = () => {
    const prefs: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    savePreferences(prefs);
  };

  const handleSaveCustom = () => {
    const prefs: ConsentPreferences = {
      essential: true,
      analytics: analyticsConsent,
      marketing: marketingConsent,
      timestamp: new Date().toISOString()
    };
    savePreferences(prefs);
  };

  const savePreferences = (prefs: ConsentPreferences) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Could not save consent preferences:', e);
    }
    applyConsent(prefs);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div 
      role="region" 
      aria-label="Privacy and Cookie Consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-surface-container-high/95 backdrop-blur-md border-t border-outline-variant/40 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 pr-0 md:pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-primary text-base">shield</span>
              <h3 className="font-label-caps text-xs text-primary font-bold tracking-wider">
                PRIVACY & DATA PROTECTION (DPDP ACT 2023)
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Ambika Jewels uses essential cookies to process jewelry orders securely and maintain your shopping bag. 
              Non-essential analytics and marketing scripts are <strong>blocked by default</strong> until you give explicit consent. 
              Read our <Link href="/privacy-policy" className="text-primary underline font-medium hover:text-primary-container">Privacy Policy</Link> for our full data processor disclosures.
            </p>

            {showDetails && (
              <div className="mt-4 pt-4 border-t border-outline-variant/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-surface-container p-2.5 rounded-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-on-surface text-[11px]">Essential (Orders)</span>
                    <span className="text-[10px] text-primary font-bold uppercase">Always Active</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant">Required for secure checkout, rate-lock protection, and cart state.</p>
                </div>
                <div className="bg-surface-container p-2.5 rounded-xs border border-outline-variant/20">
                  <label className="flex items-center justify-between mb-1 cursor-pointer">
                    <span className="font-semibold text-on-surface text-[11px]">Analytics</span>
                    <input 
                      type="checkbox" 
                      checked={analyticsConsent} 
                      onChange={e => setAnalyticsConsent(e.target.checked)}
                      className="accent-primary w-3.5 h-3.5 cursor-pointer"
                    />
                  </label>
                  <p className="text-[10px] text-on-surface-variant">Helps us measure site performance without profiling individuals.</p>
                </div>
                <div className="bg-surface-container p-2.5 rounded-xs border border-outline-variant/20">
                  <label className="flex items-center justify-between mb-1 cursor-pointer">
                    <span className="font-semibold text-on-surface text-[11px]">Marketing (Opt-in)</span>
                    <input 
                      type="checkbox" 
                      checked={marketingConsent} 
                      onChange={e => setMarketingConsent(e.target.checked)}
                      className="accent-primary w-3.5 h-3.5 cursor-pointer"
                    />
                  </label>
                  <p className="text-[10px] text-on-surface-variant">Optional updates on Dogra heritage collections. Unticked by default.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full md:w-auto">
            {!showDetails ? (
              <>
                <button
                  onClick={() => setShowDetails(true)}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs font-label-caps border border-outline-variant hover:border-primary text-on-surface transition-colors rounded-xs"
                >
                  PREFERENCES
                </button>
                <button
                  onClick={handleAcceptEssentialOnly}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs font-label-caps border border-outline-variant hover:border-primary text-on-surface transition-colors rounded-xs"
                >
                  ESSENTIAL ONLY
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-label-caps bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all rounded-xs shadow-sm"
                >
                  ACCEPT ALL
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-full sm:w-auto px-3 py-2 text-xs font-label-caps border border-outline-variant text-on-surface transition-colors rounded-xs"
                >
                  BACK
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-label-caps bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all rounded-xs"
                >
                  SAVE CHOICES
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
