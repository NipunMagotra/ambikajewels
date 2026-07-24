'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import type { Order, Product } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // Load Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ordersData) setOrders(ordersData as Order[]);

      // Load Products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (productsData) setProducts(productsData as Product[]);

      setLoading(false);
    };

    checkAuthAndLoadData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    }
  };

  const formatPrice = (paise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);
  };

  if (loading) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-section-gap bg-background">
        <div className="container mx-auto px-margin-mobile lg:px-margin-desktop">
          
          <div className="flex justify-between items-end border-b border-outline-variant pb-4 mb-stack-lg">
            <div>
              <h1 className="font-headline-sm text-headline-sm text-primary mb-2">Owner Dashboard</h1>
              <p className="font-label-caps text-label-caps text-on-surface-variant">MANAGE YOUR STORE</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-error hover:text-error-container font-label-caps flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span> LOGOUT
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-stack-lg">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-label-caps text-label-caps border ${activeTab === 'orders' ? 'bg-primary-container border-primary text-primary' : 'bg-surface-container border-outline-variant text-on-surface'}`}
            >
              ORDERS ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-label-caps text-label-caps border ${activeTab === 'products' ? 'bg-primary-container border-primary text-primary' : 'bg-surface-container border-outline-variant text-on-surface'}`}
            >
              PRODUCTS ({products.length})
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-surface-container border border-outline-variant overflow-x-auto">
              <table className="w-full text-left font-body-md text-on-surface">
                <thead className="bg-surface-container-high border-b border-outline-variant font-label-caps text-xs text-on-surface-variant">
                  <tr>
                    <th className="p-4">ORDER NO</th>
                    <th className="p-4">DATE</th>
                    <th className="p-4">CUSTOMER</th>
                    <th className="p-4">TOTAL</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-surface-container-high/50">
                      <td className="p-4 font-label-caps text-primary">{order.order_number}</td>
                      <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div>{order.customer_name}</div>
                        <div className="text-xs text-on-surface-variant">{order.customer_phone}</div>
                      </td>
                      <td className="p-4">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-label-caps ${
                          order.status === 'confirmed' ? 'bg-[#0b513d] text-[#b0f0d6]' :
                          order.status === 'pending_confirmation' ? 'bg-[#4a0404] text-[#ffdad5]' :
                          'bg-surface-variant text-on-surface'
                        }`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-background border border-outline p-1 text-xs outline-none"
                        >
                          <option value="pending_confirmation">Pending Confirmation</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-surface-container border border-outline-variant overflow-x-auto">
              <div className="p-4 border-b border-outline-variant flex justify-end">
                <button className="bg-primary text-on-primary px-4 py-2 font-label-caps text-xs flex items-center gap-2 hover:bg-primary-container hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span> ADD NEW PRODUCT
                </button>
              </div>
              <table className="w-full text-left font-body-md text-on-surface">
                <thead className="bg-surface-container-high border-b border-outline-variant font-label-caps text-xs text-on-surface-variant">
                  <tr>
                    <th className="p-4 w-16">IMAGE</th>
                    <th className="p-4">NAME</th>
                    <th className="p-4">CATEGORY</th>
                    <th className="p-4">PRICE</th>
                    <th className="p-4">STOCK</th>
                    <th className="p-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-surface-container-high/50">
                      <td className="p-4">
                        <div className="w-12 h-12 bg-surface-container-low overflow-hidden">
                          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${product.images[0]}')` }} />
                        </div>
                      </td>
                      <td className="p-4 font-headline-sm text-sm">{product.name}</td>
                      <td className="p-4 text-sm">{product.category}</td>
                      <td className="p-4 text-primary">{product.display_price}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-label-caps ${
                          product.stock_status === 'in_stock' ? 'bg-[#0b513d] text-[#b0f0d6]' :
                          'bg-[#4a0404] text-[#ffdad5]'
                        }`}>
                          {product.stock_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-primary hover:text-secondary p-1">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
