'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { InvoiceModal } from '@/components/admin/InvoiceModal';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/customer/orders');
        const data = await res.json();
        if (res.status === 401) {
          router.replace('/account/login?redirect=/account/orders');
          return;
        }
        if (res.ok && data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  const formatInr = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(paise / 100);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-surface)] pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/account" className="text-xs text-[var(--accent-gold)] hover:underline flex items-center gap-1">
                ← Back to Account
              </Link>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)]">
              Your Jewelry Orders & Invoices
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Official records of your hallmarked precious jewelry acquisitions
            </p>
          </div>

          <Link
            href="/collections"
            className="px-4 py-2 bg-[var(--accent-gold)] text-black text-xs font-semibold uppercase tracking-wider rounded hover:bg-[var(--accent-gold)]/90 transition-all"
          >
            Explore Catalog
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[var(--text-secondary)]">Retrieving purchase history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-[var(--text-secondary)] mb-3">inventory_2</span>
            <h2 className="font-serif text-lg text-[var(--text-primary)] mb-1">No Orders Found</h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto mb-6">
              You haven&apos;t placed any jewelry orders with this account yet. When you complete checkout, your order receipt, live armored tracking, and GST invoice will appear here.
            </p>
            <Link
              href="/collections"
              className="px-6 py-3 bg-[var(--accent-gold)] text-black font-sans font-semibold text-xs uppercase tracking-widest rounded"
            >
              Browse Royal Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[4px] p-6 shadow-xs hover:border-[var(--accent-gold)]/40 transition-colors"
              >
                {/* Header Row */}
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[var(--border-subtle)] pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                        Order #{order.order_number}
                      </span>
                      <span className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded ${
                        order.status === 'delivered' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' :
                        order.status === 'shipped' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/30' :
                        order.status === 'cancelled' ? 'bg-red-950/20 text-red-400 border border-red-500/30' :
                        'bg-amber-950/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-serif text-xl text-[var(--text-primary)] font-medium">
                      {formatInr(order.total)}
                    </div>
                    <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                      <span className="material-symbols-outlined text-xs">lock</span>
                      {order.payment_status === 'paid' ? 'Paid via Razorpay' : 'Pending Payment'}
                    </div>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-3 mb-6">
                  {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-[var(--border-subtle)]/40 last:border-none">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-10 h-10 rounded border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-surface)] flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{item.name}</div>
                          <div className="text-[10px] text-[var(--text-secondary)]">
                            Qty: {item.quantity} {item.metal_finish ? `• Finish: ${item.metal_finish}` : ''} {item.weight_grams ? `• ${item.weight_grams}g` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono text-[var(--text-primary)]">
                        {formatInr(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Action Row */}
                <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
                  <div className="text-[var(--text-secondary)]">
                    {order.bvc_docket_number ? (
                      <span className="flex items-center gap-1.5 text-blue-400 font-mono">
                        <span className="material-symbols-outlined text-sm">local_shipping</span>
                        BVC Armored Docket: {order.bvc_docket_number}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">shield</span>
                        Armored Transit: {order.shipping_address ? `${order.shipping_address.slice(0, 45)}...` : 'Primary Address'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] rounded flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">receipt_long</span>
                      View GST Invoice
                    </button>

                    <Link
                      href={`/track?order=${order.order_number}`}
                      className="px-3 py-1.5 bg-[var(--accent-gold)] text-black font-semibold rounded flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">location_searching</span>
                      Live Tracking
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invoice Modal Preview */}
        {selectedInvoiceOrder && (
          <InvoiceModal
            order={selectedInvoiceOrder}
            onClose={() => setSelectedInvoiceOrder(null)}
          />
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

