'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  metal_finish?: string;
  selected_size?: string;
}

interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending_confirmation' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  bvc_docket_number?: string;
  shiprocket_order_id?: string;
  shiprocket_awb?: string;
  pan_number?: string;
  notes?: string;
  created_at: string;
}

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editDocketId, setEditDocketId] = useState<string | null>(null);
  const [docketInput, setDocketInput] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Network error while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveDocket = async (orderId: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, bvc_docket_number: docketInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, bvc_docket_number: docketInput.trim() } : o));
        setEditDocketId(null);
        setDocketInput('');
      } else {
        alert(data.message || 'Failed to update tracking docket');
      }
    } catch (err) {
      console.error('Docket update failed:', err);
      alert('Error updating tracking docket');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatPrice = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesFilter;

    const matchesSearch =
      order.order_number?.toLowerCase().includes(query) ||
      order.customer_name?.toLowerCase().includes(query) ||
      order.customer_phone?.toLowerCase().includes(query) ||
      order.customer_email?.toLowerCase().includes(query) ||
      order.shipping_address?.toLowerCase().includes(query) ||
      order.pan_number?.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending_confirmation' || o.status === 'confirmed').length;
  const highValueCount = orders.filter(o => o.total > 20000000).length;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 bg-background text-on-surface">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <Link href="/admin" className="hover:underline">Admin Portal</Link>
              <span>/</span>
              <span className="text-on-surface-variant">Online Orders Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl text-primary font-headline-md font-bold">
              Online Order Management
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Live tracking, fulfillment status, and statutory CBDT PAN compliance for Ambika Jewels online showroom.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="px-3.5 py-2 rounded-xs border border-primary/40 bg-surface-container text-xs font-bold text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              <span>Refresh Orders</span>
            </button>

            <Link
              href="/admin/counter"
              className="gold-bg-gradient text-black font-bold px-4 py-2 rounded-xs text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-sm">point_of_sale</span>
              <span>Jammu Counter POS</span>
            </Link>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xs">
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider block font-semibold">TOTAL ONLINE ORDERS</span>
            <div className="text-2xl font-bold font-mono text-on-surface mt-1">{orders.length}</div>
          </div>

          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xs">
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider block font-semibold">TOTAL TRANSACTION VALUE</span>
            <div className="text-2xl font-bold font-mono text-primary mt-1">{formatPrice(totalRevenue)}</div>
          </div>

          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xs">
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider block font-semibold">PENDING DISPATCH</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{pendingCount}</div>
          </div>

          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xs">
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider block font-semibold">HIGH-VALUE ORDERS (&gt; ₹2L)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{highValueCount}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container p-3 sm:p-4 rounded-xs border border-outline-variant/30">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending_confirmation', label: 'Pending' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'processing', label: 'Processing' },
              { id: 'shipped', label: 'Shipped' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-primary text-black font-bold'
                    : 'bg-surface hover:bg-surface-variant text-on-surface-variant'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search by Order #, Name, Phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-outline-variant/50 px-3 py-1.5 pl-8 text-xs rounded-xs text-on-surface focus:outline-none focus:border-primary"
            />
            <span className="material-symbols-outlined text-sm text-on-surface-variant absolute left-2.5 top-2">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-xs text-on-surface-variant hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Orders List / Empty State */}
        {isLoading ? (
          <div className="text-center py-16 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-3xl animate-spin text-primary block mb-2">progress_activity</span>
            Loading online orders from Supabase...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-surface-container border border-outline-variant/20 rounded-xs space-y-3">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/60">receipt_long</span>
            <p className="font-headline-sm text-base text-on-surface">No online orders found</p>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              {searchQuery || selectedFilter !== 'all'
                ? 'No orders match your search criteria. Try resetting filters.'
                : 'When customers place orders on your website via Razorpay, they will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const isOver2Lakh = order.total > 20000000;
              const whatsappCustomerUrl = `https://wa.me/91${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${order.customer_name}! This is Ambika Jewels regarding your order ${order.order_number}.`)}`;

              return (
                <div
                  key={order.id}
                  className="bg-surface-container border border-outline-variant/30 rounded-xs p-4 sm:p-6 transition-all hover:border-primary/50 space-y-4"
                >
                  {/* Top Bar: Order ID, Date, Amount, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-primary text-base sm:text-lg">
                        {order.order_number}
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-mono">
                        {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      {isOver2Lakh && (
                        <span className="bg-amber-950/60 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">policy</span>
                          CBDT PAN: {order.pan_number || 'REQUIRED (>₹2L)'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-bold text-lg text-primary block">
                          {formatPrice(order.total)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          order.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {order.payment_status === 'paid' ? '✓ PAID VIA RAZORPAY' : 'PAYMENT PENDING'}
                        </span>
                      </div>

                      {/* Status Selector Dropdown */}
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusUpdate(order.id, e.target.value)}
                        className="bg-surface border border-primary/40 text-primary text-xs font-bold px-2.5 py-1.5 rounded-xs focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="pending_confirmation">Pending Confirmation</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing (In Vault)</option>
                        <option value="shipped">Shipped (In Armored Transit)</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info & Courier Dispatch Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body-md text-on-surface-variant">
                    <div>
                      <span className="text-[10px] font-label-caps text-on-surface-variant/70 uppercase block font-semibold">CUSTOMER CONTACT</span>
                      <strong className="text-on-surface text-sm block mt-0.5">{order.customer_name}</strong>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-on-surface">+91 {order.customer_phone}</span>
                        <a
                          href={whatsappCustomerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-0.5 font-bold"
                          title="Message on WhatsApp"
                        >
                          <span className="material-symbols-outlined text-xs">chat</span> WhatsApp
                        </a>
                      </div>
                      {order.customer_email && (
                        <span className="text-[11px] text-on-surface-variant/80 block mt-0.5">{order.customer_email}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-label-caps text-on-surface-variant/70 uppercase block font-semibold">DELIVERY DESTINATION</span>
                      <p className="text-on-surface text-xs mt-0.5 leading-snug">
                        {order.shipping_address}
                      </p>
                      {order.notes && (
                        <p className="text-[11px] text-amber-300 italic mt-1">Note: {order.notes}</p>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-label-caps text-on-surface-variant/70 uppercase block font-semibold">LOGISTICS & TRACKING</span>
                      {editDocketId === order.id ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <input
                            type="text"
                            placeholder="Enter BVC / Courier Docket #"
                            value={docketInput}
                            onChange={e => setDocketInput(e.target.value)}
                            className="bg-surface border border-outline-variant px-2 py-1 text-xs rounded-xs text-on-surface w-full focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={() => handleSaveDocket(order.id)}
                            className="bg-primary text-black font-bold px-2 py-1 text-[10px] rounded-xs cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditDocketId(null)}
                            className="text-on-surface-variant hover:text-white px-1 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center justify-between">
                          <span className="font-mono text-xs text-on-surface">
                            {order.bvc_docket_number ? `BVC: ${order.bvc_docket_number}` : order.shiprocket_awb ? `AWB: ${order.shiprocket_awb}` : 'No Tracking Number'}
                          </span>
                          <button
                            onClick={() => {
                              setEditDocketId(order.id);
                              setDocketInput(order.bvc_docket_number || order.shiprocket_awb || '');
                            }}
                            className="text-primary underline text-[10px] font-bold cursor-pointer"
                          >
                            {order.bvc_docket_number || order.shiprocket_awb ? 'Edit Docket' : '+ Add Docket'}
                          </button>
                        </div>
                      )}

                      <div className="mt-2 text-[10px] text-on-surface-variant">
                        Payment Ref: <span className="font-mono">{order.razorpay_payment_id || order.payment_id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items Toggle Button */}
                  <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                      <span>{isExpanded ? 'Hide Items' : `View ${order.items?.length || 0} Purchased Jewellery Item(s)`}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="text-[11px] text-on-surface-variant hover:text-primary flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">print</span>
                      <span>Print Packing Slip</span>
                    </button>
                  </div>

                  {/* Expanded Items Breakdown */}
                  {isExpanded && order.items && (
                    <div className="bg-surface border border-outline-variant/30 rounded-xs p-3.5 space-y-2 mt-2">
                      <div className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider font-semibold border-b border-outline-variant/20 pb-1">
                        JEWELLERY PIECES IN THIS ORDER:
                      </div>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-outline-variant/10 last:border-b-0">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-xs border border-outline-variant/30"
                              />
                            )}
                            <div>
                              <strong className="text-on-surface block">{item.name}</strong>
                              <span className="text-[11px] text-on-surface-variant">
                                Finish: {item.metal_finish || 'Gold'}
                                {item.selected_size && ` • Size: ${item.selected_size}`}
                                {` • Qty: ${item.quantity}`}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-on-surface">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
