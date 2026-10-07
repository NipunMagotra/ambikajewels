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
    if (typeof window !== 'undefined') {
      (window as any).__AMBIKA_CONSENT__ = prefs;
      if (!prefs.analytics) {
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
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5 bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] shadow-2xl transition-all"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 pr-0 md:pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[var(--accent-gold)] text-base">shield</span>
              <h3 className="font-sans text-xs text-[var(--accent-gold)] font-bold tracking-[0.2em] uppercase">
                PRIVACY &amp; DATA PROTECTION (DPDP ACT 2023)
              </h3>
            </div>
            <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed font-light">
              Ambika Jewels uses essential cookies to process jewellery orders securely and maintain your shopping bag. 
              Non-essential analytics and marketing scripts are <strong>blocked by default</strong> until you give explicit consent. 
              Read our <Link href="/privacy-policy" className="text-[var(--accent-gold)] underline font-medium hover:opacity-80">Privacy Policy</Link> for full data processor disclosures.
            </p>

            {showDetails && (
              <div className="mt-3.5 pt-3.5 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <div className="bg-[var(--bg-surface)] p-2.5 rounded-[2px] border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[var(--text-primary)] text-[11px]">Essential (Orders)</span>
                    <span className="text-[9.5px] text-[var(--accent-gold)] font-bold uppercase">Always Active</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)]">Required for secure checkout, rate-lock protection, and cart state.</p>
                </div>
                <div className="bg-[var(--bg-surface)] p-2.5 rounded-[2px] border border-[var(--border-subtle)]">
                  <label className="flex items-center justify-between mb-1 cursor-pointer">
                    <span className="font-medium text-[var(--text-primary)] text-[11px]">Analytics</span>
                    <input 
                      type="checkbox" 
                      checked={analyticsConsent} 
                      onChange={e => setAnalyticsConsent(e.target.checked)}
                      className="accent-[#9E7A23] w-3.5 h-3.5 cursor-pointer"
                    />
                  </label>
                  <p className="text-[10px] text-[var(--text-secondary)]">Helps us measure site performance without profiling individuals.</p>
                </div>
                <div className="bg-[var(--bg-surface)] p-2.5 rounded-[2px] border border-[var(--border-subtle)]">
                  <label className="flex items-center justify-between mb-1 cursor-pointer">
                    <span className="font-medium text-[var(--text-primary)] text-[11px]">Marketing (Opt-in)</span>
                    <input 
                      type="checkbox" 
                      checked={marketingConsent} 
                      onChange={e => setMarketingConsent(e.target.checked)}
                      className="accent-[#9E7A23] w-3.5 h-3.5 cursor-pointer"
                    />
                  </label>
                  <p className="text-[10px] text-[var(--text-secondary)]">Optional updates on Dogra heritage collections. Unticked by default.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full md:w-auto">
            {!showDetails ? (
              <>
                <button
                  onClick={() => setShowDetails(true)}
                  className="btn-gold-secondary text-[10px] py-2 px-3 w-full sm:w-auto"
                >
                  PREFERENCES
                </button>
                <button
                  onClick={handleAcceptEssentialOnly}
                  className="btn-gold-secondary text-[10px] py-2 px-3 w-full sm:w-auto"
                >
                  ESSENTIAL ONLY
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-gold-primary text-[10px] py-2 px-4 w-full sm:w-auto"
                >
                  ACCEPT ALL
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowDetails(false)}
                  className="btn-gold-secondary text-[10px] py-2 px-3 w-full sm:w-auto"
                >
                  BACK
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="btn-gold-primary text-[10px] py-2 px-4 w-full sm:w-auto"
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
