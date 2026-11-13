'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import type { CustomerProfile, CustomerAddress } from '@/lib/customerAuth';

export default function CustomerAccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Address edit state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<CustomerAddress, 'id'>>({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: 'Jammu and Kashmir',
    pincode: '',
    isDefault: false
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    async function loadAccountData() {
      try {
        const [meRes, ordersRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/customer/orders')
        ]);

        const meData = await meRes.json();
        const ordersData = await ordersRes.json();

        if (!meRes.ok || !meData.success || !meData.customer) {
          router.replace('/account/login');
          return;
        }

        setProfile(meData.profile);
        if (ordersRes.ok && ordersData.success) {
          setOrders(ordersData.orders || []);
        }
      } catch (err) {
        console.error('Account load error:', err);
        router.replace('/account/login');
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSavingAddress(true);
    try {
      const addressToAdd: CustomerAddress = {
        ...newAddress,
        id: `addr_${Date.now()}`
      };

      const updatedAddresses = newAddress.isDefault
        ? [addressToAdd, ...profile.addresses.map(a => ({ ...a, isDefault: false }))]
        : [...profile.addresses, addressToAdd];

      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setProfile(data.profile);
        setShowAddressModal(false);
        setNewAddress({
          fullName: '',
          phone: '',
          addressLine: '',
          city: '',
          state: 'Jammu and Kashmir',
          pincode: '',
          isDefault: false
        });
      }
    } catch {
      alert('Failed to save address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!profile || !confirm('Remove this saved address?')) return;
    try {
      const filtered = profile.addresses.filter(a => a.id !== id);
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: filtered })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfile(data.profile);
      }
    } catch {
      alert('Error removing address.');
    }
  };

  const formatInr = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(paise / 100);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--bg-surface)] pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">Opening Royal Vault...</p>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </>
    );
  }

  const primaryIdentifier = profile?.email || profile?.phone || 'Customer';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-surface)] pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[4px] p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[var(--accent-gold)] text-xl">verified</span>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--accent-gold)] font-bold">
                PATRON ACCOUNT
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)]">
              Welcome, {profile?.fullName || primaryIdentifier}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
              {profile?.email} {profile?.phone ? `• ${profile.phone}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/collections"
              className="px-4 py-2 bg-[var(--accent-gold)] text-black font-sans text-xs uppercase font-semibold tracking-wider rounded hover:bg-[var(--accent-gold)]/90 transition-all text-center flex-1 sm:flex-initial"
            >
              Browse Catalog
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-red-400 hover:border-red-500/30 font-sans text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded p-5">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs uppercase tracking-wider">Total Orders</span>
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
            </div>
            <div className="font-serif text-3xl text-[var(--text-primary)]">{orders.length}</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">Fine jewelry acquisitions</div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded p-5">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs uppercase tracking-wider">Saved Addresses</span>
              <span className="material-symbols-outlined text-lg">location_on</span>
            </div>
            <div className="font-serif text-3xl text-[var(--text-primary)]">{profile?.addresses.length || 0}</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">Verified delivery destinations</div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded p-5">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs uppercase tracking-wider">Armored Transit</span>
              <span className="material-symbols-outlined text-[var(--accent-gold)] text-lg">shield</span>
            </div>
            <div className="font-serif text-xl text-[var(--accent-gold)] font-medium">BVC Armed Security</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">100% Insured door-step delivery</div>
          </div>
        </div>

        {/* Orders & Addresses 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent Orders (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-[var(--text-primary)] tracking-wide">
                Recent Orders & Dispatches
              </h2>
              {orders.length > 0 && (
                <Link href="/account/orders" className="text-xs text-[var(--accent-gold)] hover:underline uppercase tracking-wider">
                  View All Orders →
                </Link>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-[var(--text-secondary)] mb-2">inventory_2</span>
                <p className="text-sm text-[var(--text-primary)] font-medium">No jewelry orders found yet</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
                  When you place an order with your email ({profile?.email}), your orders and armored waybills will appear here automatically.
                </p>
                <Link
                  href="/collections"
                  className="inline-block mt-4 px-5 py-2.5 bg-[var(--accent-gold)] text-black text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Explore Royal Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded p-5 hover:border-[var(--accent-gold)]/40 transition-colors">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[var(--border-subtle)] pb-3 mb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                          Order #{ord.order_number}
                        </span>
                        <span className="text-[11px] text-[var(--text-secondary)] ml-3">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span className={`text-[11px] font-sans font-semibold uppercase px-2 py-0.5 rounded ${
                        ord.status === 'delivered' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' :
                        ord.status === 'shipped' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/30' :
                        ord.status === 'cancelled' ? 'bg-red-950/20 text-red-400 border border-red-500/30' :
                        'bg-amber-950/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-[var(--text-secondary)]">
                          {Array.isArray(ord.items) ? `${ord.items.length} item(s): ${ord.items.map((i: any) => i.name).join(', ')}` : 'Precious Jewelry Piece'}
                        </div>
                        <div className="font-serif text-lg text-[var(--text-primary)]">
                          {formatInr(ord.total)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/track?order=${ord.order_number}`}
                          className="px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] text-xs rounded transition-colors"
                        >
                          Track Parcel
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Address Book & Showroom Concierge */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-[var(--text-primary)] tracking-wide">
                Saved Addresses
              </h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-xs text-[var(--accent-gold)] hover:underline uppercase tracking-wider cursor-pointer"
              >
                + Add New
              </button>
            </div>

            {(!profile?.addresses || profile.addresses.length === 0) ? (
              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded p-6 text-center text-xs text-[var(--text-secondary)]">
                <span className="material-symbols-outlined text-3xl mb-1 text-[var(--text-secondary)]">home_pin</span>
                <p>No saved delivery addresses yet.</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="mt-3 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--accent-gold)]/40 text-[var(--accent-gold)] rounded text-[11px] uppercase font-semibold cursor-pointer"
                >
                  Save Address for Fast Checkout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.addresses.map((addr) => (
                  <div key={addr.id} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded p-4 relative group">
                    {addr.isDefault && (
                      <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wider bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                    <h4 className="font-sans text-xs font-bold text-[var(--text-primary)]">{addr.fullName}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{addr.phone}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                      {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex justify-end">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-[10px] text-red-400 hover:underline cursor-pointer"
                      >
                        Remove Address
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Showroom Direct Assistance Box */}
            <div className="bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-surface)] border border-[var(--accent-gold)]/30 rounded p-5 space-y-3">
              <div className="flex items-center gap-2 text-[var(--accent-gold)]">
                <span className="material-symbols-outlined text-lg">support_agent</span>
                <h3 className="font-serif text-sm tracking-wide">Direct Showroom Concierge</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Need sizing assistance, bridal consultation, or custom order inquiries? Speak directly with our master karigars in Jammu.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="https://wa.me/919086098457"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold tracking-wider uppercase text-center rounded flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  WhatsApp Showroom
                </a>
                <a
                  href="tel:+919682589725"
                  className="w-full py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-xs font-semibold tracking-wider uppercase text-center rounded"
                >
                  Call +91 96825 89725
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Address */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--bg-card)] border border-[var(--accent-gold)]/40 rounded-[4px] p-6 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-lg text-[var(--text-primary)]">Add Delivery Address</h3>
                <button onClick={() => setShowAddressModal(false)} className="text-[var(--text-secondary)] hover:text-white cursor-pointer">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddress.fullName}
                    onChange={e => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded p-2 text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Mobile Number (For Armored Courier OTP)</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newAddress.phone}
                    onChange={e => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded p-2 text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Street Address / House No.</label>
                  <textarea
                    required
                    rows={2}
                    value={newAddress.addressLine}
                    onChange={e => setNewAddress(prev => ({ ...prev, addressLine: e.target.value }))}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded p-2 text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={e => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded p-2 text-xs text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddress.pincode}
                      onChange={e => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded p-2 text-xs text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={e => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded text-[var(--accent-gold)]"
                  />
                  <span>Set as default shipping address</span>
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="px-4 py-2 bg-[var(--accent-gold)] text-black text-xs font-semibold uppercase rounded"
                  >
                    {savingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

