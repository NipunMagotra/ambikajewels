'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useWishlist } from '@/context/WishlistContext';
import { siteConfig } from '@/config/siteConfig';

export default function AccountPage() {
  const { wishlistCount } = useWishlist();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'concierge'>('orders');
  const [orderQuery, setOrderQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleOrderLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setSearched(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl">
          
          {/* Header */}
          <div className="mb-10 sm:mb-12 pb-6 border-b border-[var(--border-subtle)]">
            <span className="font-sans text-[9.5px] text-[var(--accent-gold)] tracking-[0.32em] uppercase block mb-1.5 font-medium">
              CLIENT PORTAL
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
              My Atelier Account
            </h1>
            <p className="font-sans text-xs text-[var(--text-secondary)] mt-1 font-light">
              Track active armored shipments, review past invoices, and manage private styling appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="md:col-span-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 rounded-[1px]">
              <nav className="flex flex-col gap-1 font-sans text-xs">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-3 py-2.5 rounded-[1px] tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-between ${
                    activeTab === 'orders'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    ORDERS &amp; SHIPMENTS
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3 py-2.5 rounded-[1px] tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-between ${
                    activeTab === 'profile'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">person</span>
                    PATRON PROFILE
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-3 py-2.5 rounded-[1px] tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-between ${
                    activeTab === 'addresses'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">pin_drop</span>
                    DELIVERY ADDRESSES
                  </span>
                </button>

                <Link
                  href="/wishlist"
                  className="w-full text-left px-3 py-2.5 rounded-[1px] tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">favorite</span>
                    SAVED HEIRLOOMS
                  </span>
                  <span className="text-[10px] text-[var(--accent-gold)] font-mono font-bold">
                    {wishlistCount}
                  </span>
                </Link>

                <button
                  onClick={() => setActiveTab('concierge')}
                  className={`w-full text-left px-3 py-2.5 rounded-[1px] tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-between ${
                    activeTab === 'concierge'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">support_agent</span>
                    PRIVATE CONCIERGE
                  </span>
                </button>
              </nav>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[10px] font-sans text-[var(--text-tertiary)]">
                <p>Ambika Jewels Jammu Patron ID: AJ-GUEST</p>
              </div>
            </div>

            {/* Tab Content (Right 8 Cols) */}
            <div className="md:col-span-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 rounded-[1px]">
              
              {/* TAB: Orders & Tracking */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] mb-2 font-normal">
                    Order Lookup &amp; Tracking
                  </h2>
                  <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 font-light leading-relaxed">
                    Look up past order invoices or live armored transit status with your Order Reference Number or 10-digit phone number.
                  </p>

                  <form onSubmit={handleOrderLookup} className="flex flex-col sm:flex-row gap-2 mb-8">
                    <input
                      type="text"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="e.g. AJ-2026-XXXX or Phone Number"
                      className="flex-1 px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-sans text-xs outline-none focus:border-[var(--text-primary)] rounded-[1px]"
                    />
                    <button type="submit" className="btn-gold-primary py-3 px-6 text-[10.5px] tracking-wider">
                      SEARCH ORDER
                    </button>
                  </form>

                  {searched && (
                    <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[1px] text-xs font-sans space-y-3 mb-6">
                      <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                        <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                          ORDER RESULT FOR &ldquo;{orderQuery}&rdquo;
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[1px] text-[10px] font-semibold">
                          BVC ARMORED IN TRANSIT
                        </span>
                      </div>
                      <p className="text-[var(--text-secondary)] font-light">
                        Shipment dispatched from Jammu Flagship Showroom in BVC Armored security bag. Expected doorstep delivery within 2–4 business days.
                      </p>
                      <div className="pt-2 flex gap-3">
                        <Link
                          href={`/track?orderId=${encodeURIComponent(orderQuery)}`}
                          className="btn-gold-primary py-2 px-4 text-[10px] tracking-wider"
                        >
                          OPEN FULL TRACKING TIMELINE
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-light space-y-1">
                    <p><strong>Note on Guest Orders:</strong> All orders placed on ambikajewelsonline.com receive real-time SMS &amp; WhatsApp updates with BVC docket tracking numbers.</p>
                  </div>
                </div>
              )}

              {/* TAB: Patron Profile */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] mb-2 font-normal">
                    Patron Profile
                  </h2>
                  <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 font-light">
                    Manage your contact details and preferences for exclusive collection launches.
                  </p>

                  <div className="space-y-4 text-xs font-sans max-w-md">
                    <div>
                      <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
                        PATRON TYPE
                      </span>
                      <span className="font-medium text-[var(--text-primary)]">Verified Showroom Patron</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
                        COMMUNICATION CHANNELS
                      </span>
                      <span className="text-[var(--text-secondary)]">WhatsApp Concierge Updates &bull; SMS Delivery OTPs</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
                        STATUTORY COMPLIANCE
                      </span>
                      <span className="text-[var(--text-secondary)]">DPDP Act 2023 Compliant &bull; 256-Bit Encrypted Records</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Addresses */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] mb-2 font-normal">
                    Delivery Addresses
                  </h2>
                  <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 font-light">
                    Addresses are verified with BVC Logistics pincode serviceability network before armored transit dispatch.
                  </p>

                  <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[1px] text-xs font-sans space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--text-primary)]">FLAGSHIP SHOWROOM &bull; PICKUP AT COUNTER</span>
                      <span className="text-[10px] text-[var(--accent-gold)] font-mono">PRIMARY</span>
                    </div>
                    <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                      Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&amp;K 180013, India
                    </p>
                    <p className="text-[11px] text-[var(--text-tertiary)]">Contact: {siteConfig.contact.phone}</p>
                  </div>
                </div>
              )}

              {/* TAB: Concierge */}
              {activeTab === 'concierge' && (
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] mb-2 font-normal">
                    Private Showroom Concierge
                  </h2>
                  <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 font-light leading-relaxed">
                    Direct communication with owner Shivani Anand and representative Lakesh Kumar for bespoke bridal designs, gold melting, or private appointments.
                  </p>

                  <div className="space-y-4">
                    <a
                      href="https://wa.me/919086098457?text=Namaste!%20I%20am%20contacting%20the%20Ambika%20Jewels%20concierge%20from%20my%20account."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold-primary py-3.5 px-6 text-xs tracking-wider inline-flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      OPEN CONCIERGE WHATSAPP (+91 9086098457)
                    </a>

                    <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[1px] text-xs font-sans space-y-1">
                      <p className="font-medium text-[var(--text-primary)]">Showroom Counter Hours:</p>
                      <p className="text-[var(--text-secondary)] font-light">Monday &ndash; Saturday: 10:00 AM &ndash; 8:00 PM</p>
                      <p className="text-[var(--text-secondary)] font-light">Sunday: Open for Festive &amp; Wedding Consultations</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

