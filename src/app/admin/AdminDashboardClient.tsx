'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/siteConfig';
import { mockProducts } from '@/data/mockProducts';
import { BillingCalculator } from '@/components/counter/BillingCalculator';
import type { DailyRates } from '@/types/counter';
import { DEFAULT_RATES } from '@/lib/counterStore';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  display_price: string;
  category: string;
  images: string[];
  badges: string[];
  metal_finishes: string[];
  stock_status: 'in_stock' | 'limited' | 'out_of_stock';
  is_featured: boolean;
  collection: string;
  craftsmanship_story?: string;
  created_at: string;
}

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
  payment_status: 'unpaid' | 'paid' | 'refunded';
  bvc_docket_number?: string;
  pan_number?: string;
  notes?: string;
  created_at: string;
}

type TabType = 'overview' | 'products' | 'orders' | 'rates' | 'pos' | 'store';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Products State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('all');

  // Product Modal State (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [modalForm, setModalForm] = useState({
    name: '',
    category: siteConfig.categories[0] || 'Necklaces',
    price: '',
    description: '',
    images: '',
    badges: '22K BIS, DOGRA HERITAGE',
    metal_finishes: 'Gold',
    stock_status: 'in_stock' as 'in_stock' | 'limited' | 'out_of_stock',
    is_featured: false,
    collection: 'Dogra Heritage Collection',
    craftsmanship_story: ''
  });
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSeedingPresets, setIsSeedingPresets] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [editDocketId, setEditDocketId] = useState<string | null>(null);
  const [docketInput, setDocketInput] = useState('');

  // Rates State
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);
  const [isRatesLoading, setIsRatesLoading] = useState(false);
  const [isSavingRates, setIsSavingRates] = useState(false);
  const [rateForm, setRateForm] = useState({
    gold_24k: 7850,
    gold_22k: 7190,
    gold_18k: 5890,
    gold_14k: 4580,
    silver_999: 98,
    silver_925: 85
  });

  // Global Notification Banner
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setBannerMessage({ text, type });
    setTimeout(() => setBannerMessage(null), 4000);
  };

  // 1. Fetch Products
  const fetchProducts = async () => {
    try {
      setIsProductsLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsProductsLoading(false);
    }
  };

  // 2. Fetch Orders
  const fetchOrders = async () => {
    try {
      setIsOrdersLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  // 3. Fetch Rates
  const fetchRates = async () => {
    try {
      setIsRatesLoading(true);
      const res = await fetch('/api/admin/rates');
      const data = await res.json();
      if (res.ok && data.rates) {
        setRates(data.rates);
        setRateForm({
          gold_24k: data.rates.gold_24k || 7850,
          gold_22k: data.rates.gold_22k || 7190,
          gold_18k: data.rates.gold_18k || 5890,
          gold_14k: data.rates.gold_14k || 4580,
          silver_999: data.rates.silver_999 || 98,
          silver_925: data.rates.silver_925 || 85
        });
      }
    } catch (err) {
      console.error('Error fetching rates:', err);
    } finally {
      setIsRatesLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchRates();
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  // Save / Update Product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalForm({
      name: '',
      category: siteConfig.categories[0] || 'Necklaces',
      price: '',
      description: '',
      images: '',
      badges: '22K BIS, DOGRA HERITAGE',
      metal_finishes: 'Gold',
      stock_status: 'in_stock',
      is_featured: false,
      collection: 'Dogra Heritage Collection',
      craftsmanship_story: ''
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setModalForm({
      name: p.name,
      category: p.category,
      price: (p.price / 100).toString(),
      description: p.description || '',
      images: (p.images || []).join('\n'),
      badges: (p.badges || []).join(', '),
      metal_finishes: (p.metal_finishes || []).join(', '),
      stock_status: p.stock_status,
      is_featured: p.is_featured,
      collection: p.collection || 'Heritage',
      craftsmanship_story: p.craftsmanship_story || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.price || !modalForm.category) {
      alert('Please fill in product name, category, and price.');
      return;
    }

    try {
      setIsSavingProduct(true);
      const imageList = modalForm.images
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(Boolean);

      const badgeList = modalForm.badges
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const finishList = modalForm.metal_finishes
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        name: modalForm.name.trim(),
        category: modalForm.category,
        price: parseFloat(modalForm.price),
        isPaise: false,
        description: modalForm.description.trim(),
        images: imageList.length > 0 ? imageList : ['/hero-clean.png'],
        badges: badgeList,
        metal_finishes: finishList.length > 0 ? finishList : ['Gold'],
        stock_status: modalForm.stock_status,
        is_featured: modalForm.is_featured,
        collection: modalForm.collection,
        craftsmanship_story: modalForm.craftsmanship_story.trim()
      };

      if (editingProduct) {
        // PATCH
        const res = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProduct.id, ...payload })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showNotification('Product updated successfully!');
          setIsProductModalOpen(false);
          fetchProducts();
        } else {
          alert(data.message || 'Failed to update product');
        }
      } else {
        // POST
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showNotification('Product created successfully!');
          setIsProductModalOpen(false);
          fetchProducts();
        } else {
          alert(data.message || 'Failed to create product');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Deleted "${name}"`);
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting');
    }
  };

  // Quick Stock Status Toggle
  const handleQuickStockToggle = async (p: ProductItem, nextStatus: 'in_stock' | 'limited' | 'out_of_stock') => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, stock_status: nextStatus })
      });
      if (res.ok) {
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock_status: nextStatus } : item));
        showNotification(`Updated ${p.name} stock to ${nextStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Featured Toggle
  const handleQuickFeaturedToggle = async (p: ProductItem) => {
    const nextFeatured = !p.is_featured;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, is_featured: nextFeatured })
      });
      if (res.ok) {
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_featured: nextFeatured } : item));
        showNotification(`${p.name} is now ${nextFeatured ? 'Featured' : 'Standard'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1-Click Curated Presets Import
  const handleImportPresets = async () => {
    if (!confirm('Import authentic Jammu Dogra heritage collection presets into your store catalog?')) return;
    try {
      setIsSeedingPresets(true);
      let count = 0;
      for (const mock of mockProducts.slice(0, 8)) {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: mock.name,
            category: mock.category,
            price: mock.price,
            isPaise: true,
            description: mock.description,
            images: mock.images,
            badges: mock.badges,
            metal_finishes: mock.metal_finishes,
            stock_status: mock.stock_status,
            is_featured: mock.is_featured,
            collection: mock.collection,
            craftsmanship_story: mock.craftsmanship_story
          })
        });
        count++;
      }
      showNotification(`Imported ${count} heirloom creations to your catalog!`);
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert('Error importing presets');
    } finally {
      setIsSeedingPresets(false);
    }
  };

  // Order Status Update
  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
        showNotification(`Order status updated to ${newStatus}`);
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (e) {
      alert('Error updating order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Save BVC Docket
  const handleSaveDocket = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, bvc_docket_number: docketInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, bvc_docket_number: docketInput.trim() } : o));
        setEditDocketId(null);
        showNotification('BVC Logistics docket updated!');
      } else {
        alert(data.message || 'Failed to save docket number');
      }
    } catch (e) {
      alert('Error saving docket');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Rates Update
  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingRates(true);
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rateForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRates(data.rates);
        showNotification('Today\'s bullion rates updated and broadcast live!');
      } else {
        alert(data.message || 'Failed to update bullion rates');
      }
    } catch (e) {
      alert('Error updating rates');
    } finally {
      setIsSavingRates(false);
    }
  };

  // Computed Metrics for Dashboard
  const totalGrossRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const pendingOrdersCount = orders.filter(
    o => o.status === 'pending_confirmation' || o.status === 'confirmed' || o.status === 'processing'
  ).length;

  const inStockProductsCount = products.filter(p => p.stock_status === 'in_stock').length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = !productSearch || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    const matchesStock = productStockFilter === 'all' || p.stock_status === productStockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = !orderSearch ||
      o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-subtle)] shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-gold)] animate-pulse"></span>
              <span className="font-serif text-lg sm:text-xl tracking-wider font-medium text-[var(--text-primary)]">
                Ambika Jewels <span className="font-sans text-[10px] text-[var(--accent-gold)] font-bold tracking-[0.2em] uppercase ml-1 px-1.5 py-0.5 border border-[var(--border-subtle)] rounded-[2px]">ADMIN CONSOLE</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent-gold)] flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-[2px] border border-[var(--border-subtle)]"
            >
              <span>View Storefront</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-sans text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-[2px] border border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="container mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 sm:gap-2 border-t border-[var(--border-subtle)]/60 text-xs font-sans uppercase tracking-wider font-semibold">
          {[
            { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
            { id: 'products', label: `Products (${products.length})`, icon: 'diamond' },
            { id: 'orders', label: `Orders (${orders.length})`, icon: 'receipt_long' },
            { id: 'rates', label: 'Bullion Rates', icon: 'currency_rupee' },
            { id: 'pos', label: 'Counter POS', icon: 'point_of_sale' },
            { id: 'store', label: 'Store Info', icon: 'storefront' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--bg-surface)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Global Notification Banner */}
      {bannerMessage && (
        <div className={`py-2 px-4 text-center text-xs font-sans font-semibold sticky top-28 z-30 transition-all ${
          bannerMessage.type === 'success'
            ? 'bg-emerald-600 text-white shadow-md'
            : 'bg-rose-600 text-white shadow-md'
        }`}>
          {bannerMessage.text}
        </div>
      )}

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW / DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {/* Revenue */}
              <div className="p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] rounded-[2px]">
                <span className="font-sans text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Gross Sales (Confirmed)
                </span>
                <div className="font-serif text-xl sm:text-3xl text-[var(--accent-gold)] font-medium">
                  ₹{(totalGrossRevenue / 100).toLocaleString('en-IN')}
                </div>
                <span className="font-sans text-[10px] text-[var(--text-secondary)] mt-1 block">
                  {orders.length} total orders recorded
                </span>
              </div>

              {/* Pending Orders */}
              <div className="p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] rounded-[2px]">
                <span className="font-sans text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Fulfillment Queue
                </span>
                <div className="font-serif text-xl sm:text-3xl text-[var(--text-primary)] font-medium">
                  {pendingOrdersCount}
                </div>
                <span className="font-sans text-[10px] text-amber-600 dark:text-amber-400 mt-1 block font-medium">
                  Orders requiring packing / dispatch
                </span>
              </div>

              {/* Inventory Items */}
              <div className="p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] rounded-[2px]">
                <span className="font-sans text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Active Catalog Pieces
                </span>
                <div className="font-serif text-xl sm:text-3xl text-[var(--text-primary)] font-medium">
                  {products.length}
                </div>
                <span className="font-sans text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
                  {inStockProductsCount} items in stock
                </span>
              </div>

              {/* Today's 22K Gold Rate */}
              <div className="p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--accent-gold)]/40 shadow-[var(--card-shadow)] rounded-[2px]">
                <span className="font-sans text-[10px] sm:text-xs text-[var(--accent-gold)] uppercase tracking-wider block mb-1 font-semibold">
                  Today&apos;s 22K Gold Rate
                </span>
                <div className="font-serif text-xl sm:text-3xl text-[var(--accent-gold)] font-medium">
                  ₹{rates.gold_22k.toLocaleString('en-IN')}<span className="text-xs font-sans text-[var(--text-secondary)]">/g</span>
                </div>
                <span className="font-sans text-[10px] text-[var(--text-secondary)] mt-1 block">
                  24K: ₹{rates.gold_24k.toLocaleString('en-IN')}/g &bull; 925: ₹{rates.silver_925}/g
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-[2px] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--accent-gold)]">bolt</span>
                <span className="font-sans text-xs uppercase tracking-wider font-semibold">Quick Actions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleOpenAddModal}
                  className="px-3.5 py-1.5 bg-[var(--accent-gold)] text-white text-xs font-sans font-semibold tracking-wider uppercase rounded-[2px] hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('rates')}
                  className="px-3.5 py-1.5 bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-primary)] text-xs font-sans font-medium tracking-wider uppercase rounded-[2px] hover:border-[var(--accent-gold)] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Update Bullion Rates</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-3.5 py-1.5 bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-primary)] text-xs font-sans font-medium tracking-wider uppercase rounded-[2px] hover:border-[var(--accent-gold)] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                  <span>Dispatch Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('pos')}
                  className="px-3.5 py-1.5 bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-primary)] text-xs font-sans font-medium tracking-wider uppercase rounded-[2px] hover:border-[var(--accent-gold)] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">calculate</span>
                  <span>Counter POS Billing</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] p-5 shadow-[var(--card-shadow)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-subtle)]">
                <h3 className="font-serif text-lg font-normal text-[var(--text-primary)]">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-sans text-[var(--accent-gold)] hover:underline font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Orders</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--text-secondary)] font-sans">
                  No orders placed yet. Live orders from the website will appear here in real time.
                </div>
              ) : (
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                        <th className="pb-2">Order #</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Items</th>
                        <th className="pb-2">Total</th>
                        <th className="pb-2">Payment</th>
                        <th className="pb-2">Fulfillment</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                          <td className="py-3 font-mono font-medium text-[var(--accent-gold)]">{o.order_number}</td>
                          <td className="py-3">
                            <span className="font-medium text-[var(--text-primary)] block">{o.customer_name}</span>
                            <span className="text-[10px] text-[var(--text-secondary)]">{o.customer_phone}</span>
                          </td>
                          <td className="py-3">{o.items?.length || 0} pieces</td>
                          <td className="py-3 font-semibold text-[var(--text-primary)]">
                            ₹{(o.total / 100).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-[2px] text-[10px] uppercase font-semibold ${
                              o.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600'
                            }`}>
                              {o.payment_status}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-[2px] text-[10px] uppercase font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--accent-gold)]">
                              {o.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => { setActiveTab('orders'); setExpandedOrderId(o.id); }}
                              className="text-xs text-[var(--accent-gold)] hover:underline font-semibold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS & INVENTORY */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                  Jewellery Catalog &amp; Inventory
                </h2>
                <p className="font-sans text-xs text-[var(--text-secondary)]">
                  Add new creations, update live prices, toggle in-stock availability, and curate featured heirlooms.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {products.length === 0 && (
                  <button
                    onClick={handleImportPresets}
                    disabled={isSeedingPresets}
                    className="px-3.5 py-2 bg-[var(--bg-surface)] border border-[var(--accent-gold)] text-[var(--accent-gold)] text-xs font-sans font-semibold tracking-wider uppercase rounded-[2px] hover:bg-[var(--accent-gold)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>{isSeedingPresets ? 'Importing...' : 'Load Curated Dogra Presets'}</span>
                  </button>
                )}

                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-[var(--accent-gold)] text-white text-xs font-sans font-semibold tracking-wider uppercase rounded-[2px] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined text-sm absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search products by title or slug..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs pl-9 pr-3 py-2 rounded-[2px] focus:outline-none focus:border-[var(--accent-gold)] font-sans"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full sm:w-auto">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs px-3 py-2 rounded-[2px] focus:outline-none focus:border-[var(--accent-gold)] font-sans"
                >
                  <option value="All">All Categories</option>
                  {siteConfig.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div className="w-full sm:w-auto">
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value)}
                  className="w-full sm:w-auto bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs px-3 py-2 rounded-[2px] focus:outline-none focus:border-[var(--accent-gold)] font-sans"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in_stock">In Stock</option>
                  <option value="limited">Limited Edition</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            {isProductsLoading ? (
              <div className="p-12 text-center text-xs text-[var(--text-secondary)] font-sans">
                Loading products catalog...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] text-center max-w-lg mx-auto">
                <span className="material-symbols-outlined text-4xl text-[var(--accent-gold)] mb-2 block">diamond</span>
                <h3 className="font-serif text-lg text-[var(--text-primary)] mb-1">No products found</h3>
                <p className="font-sans text-xs text-[var(--text-secondary)] mb-4">
                  {products.length === 0
                    ? 'Your online store catalog is currently empty. Click "Add New Product" to create your first jewellery piece, or import curated Dogra heritage items.'
                    : 'No products match your current search and filter criteria.'}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 bg-[var(--accent-gold)] text-white text-xs font-sans font-semibold tracking-wider uppercase rounded-[2px]"
                  >
                    Add Product Now
                  </button>
                  {products.length === 0 && (
                    <button
                      onClick={handleImportPresets}
                      className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-card)] text-xs font-sans font-medium uppercase rounded-[2px]"
                    >
                      Import Dogra Presets
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] overflow-hidden shadow-[var(--card-shadow)]">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-surface)]">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Stock Status</th>
                        <th className="py-3 px-3">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0] || '/hero-clean.png'}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-[2px] border border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero-clean.png'; }}
                              />
                              <div>
                                <Link
                                  href={`/collections/${p.slug || p.id}`}
                                  target="_blank"
                                  className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-gold)] line-clamp-1"
                                >
                                  {p.name}
                                </Link>
                                <span className="font-mono text-[10px] text-[var(--text-secondary)] block">
                                  slug: {p.slug}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[var(--text-secondary)]">{p.category}</td>
                          <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">
                            {p.display_price || `₹${(p.price / 100).toLocaleString('en-IN')}`}
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={p.stock_status}
                              onChange={(e) => handleQuickStockToggle(p, e.target.value as any)}
                              className={`text-[10.5px] font-semibold px-2 py-1 rounded-[2px] border focus:outline-none font-sans uppercase tracking-wider ${
                                p.stock_status === 'in_stock'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : p.stock_status === 'limited'
                                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                              }`}
                            >
                              <option value="in_stock">IN STOCK</option>
                              <option value="limited">LIMITED</option>
                              <option value="out_of_stock">OUT OF STOCK</option>
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleQuickFeaturedToggle(p)}
                              className={`p-1 rounded-[2px] transition-colors cursor-pointer ${
                                p.is_featured
                                  ? 'text-[var(--accent-gold)]'
                                  : 'text-[var(--text-secondary)]/40 hover:text-[var(--text-secondary)]'
                              }`}
                              title={p.is_featured ? 'Featured on storefront' : 'Not featured'}
                            >
                              <span className="material-symbols-outlined text-lg">
                                {p.is_featured ? 'star' : 'star_border'}
                              </span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="px-2.5 py-1 text-xs text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 rounded-[2px] font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-500/10 rounded-[2px] font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDERS HUB */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                  Online Orders &amp; Logistics Hub
                </h2>
                <p className="font-sans text-xs text-[var(--text-secondary)]">
                  Track website purchases, update BVC armored logistics docket numbers, and verify high-value PAN compliance.
                </p>
              </div>

              <button
                onClick={fetchOrders}
                className="px-3.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-card)] text-xs font-sans font-medium uppercase tracking-wider rounded-[2px] hover:border-[var(--accent-gold)] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>Refresh Orders</span>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined text-sm absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by order number (AJ-...), customer name, or phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs pl-9 pr-3 py-2 rounded-[2px] focus:outline-none focus:border-[var(--accent-gold)] font-sans"
                />
              </div>

              <div className="w-full sm:w-auto">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full sm:w-auto bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs px-3 py-2 rounded-[2px] focus:outline-none focus:border-[var(--accent-gold)] font-sans uppercase"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_confirmation">Pending Confirmation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing (Atelier)</option>
                  <option value="shipped">Shipped (BVC Armored)</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            {isOrdersLoading ? (
              <div className="p-12 text-center text-xs text-[var(--text-secondary)] font-sans">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] text-center max-w-lg mx-auto">
                <span className="material-symbols-outlined text-4xl text-[var(--accent-gold)] mb-2 block">receipt_long</span>
                <h3 className="font-serif text-lg text-[var(--text-primary)] mb-1">No orders found</h3>
                <p className="font-sans text-xs text-[var(--text-secondary)]">
                  {orders.length === 0 ? 'No online orders have been placed yet.' : 'No orders match your filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => {
                  const isExpanded = expandedOrderId === order.id;
                  const isHighValue = (order.total || 0) >= 20000000; // >= ₹2,00,000

                  return (
                    <div
                      key={order.id}
                      className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] overflow-hidden shadow-xs"
                    >
                      {/* Summary Row */}
                      <div className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
                          >
                            <span className="material-symbols-outlined text-xl">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[var(--accent-gold)]">
                                {order.order_number}
                              </span>
                              {isHighValue && (
                                <span className={`text-[9px] font-sans font-bold px-1.5 py-0.2 rounded-[1px] uppercase tracking-wider ${
                                  order.pan_number ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                                }`}>
                                  {order.pan_number ? `PAN: ${order.pan_number}` : 'CBDT PAN REQUIRED (>₹2L)'}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[var(--text-secondary)] font-sans">
                              {order.customer_name} &bull; {order.customer_phone} &bull; {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        {/* Amount & Status Dropdown */}
                        <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                          <div className="text-right">
                            <span className="font-serif text-base font-semibold text-[var(--text-primary)]">
                              ₹{(order.total / 100).toLocaleString('en-IN')}
                            </span>
                            <span className={`block text-[10px] uppercase font-bold tracking-wider ${
                              order.payment_status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'
                            }`}>
                              {order.payment_status} ({order.payment_method})
                            </span>
                          </div>

                          <select
                            value={order.status}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                            className="text-xs font-sans font-semibold px-2.5 py-1.5 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--accent-gold)] focus:outline-none uppercase tracking-wider"
                          >
                            <option value="pending_confirmation">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Expandable Order Details */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] space-y-4 text-xs font-sans">
                          {/* Shipping Address & BVC Docket */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[var(--border-subtle)]">
                            <div>
                              <span className="font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                                Delivery Address:
                              </span>
                              <p className="text-[var(--text-primary)] leading-relaxed font-light">
                                {order.shipping_address}
                              </p>
                              {order.customer_email && (
                                <span className="text-[11px] text-[var(--text-secondary)] block mt-1">
                                  Email: {order.customer_email}
                                </span>
                              )}
                            </div>

                            <div>
                              <span className="font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                                Armored Shipping Logistics:
                              </span>
                              {editDocketId === order.id ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="text"
                                    value={docketInput}
                                    onChange={(e) => setDocketInput(e.target.value)}
                                    placeholder="Enter BVC Docket Number"
                                    className="bg-[var(--bg-card)] border border-[var(--border-subtle)] px-2.5 py-1 text-xs rounded-[2px] focus:outline-none focus:border-[var(--accent-gold)] font-mono"
                                  />
                                  <button
                                    onClick={() => handleSaveDocket(order.id)}
                                    className="px-2.5 py-1 bg-[var(--accent-gold)] text-white text-xs font-semibold rounded-[2px]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditDocketId(null)}
                                    className="px-2 py-1 text-xs text-[var(--text-secondary)]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-mono text-xs text-[var(--text-primary)]">
                                    {order.bvc_docket_number ? `BVC Docket: ${order.bvc_docket_number}` : 'No docket number assigned'}
                                  </span>
                                  <button
                                    onClick={() => { setEditDocketId(order.id); setDocketInput(order.bvc_docket_number || ''); }}
                                    className="text-[11px] text-[var(--accent-gold)] hover:underline font-semibold"
                                  >
                                    {order.bvc_docket_number ? 'Edit' : '+ Add Docket'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Line Items */}
                          <div>
                            <span className="font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                              Ordered Pieces ({order.items?.length || 0}):
                            </span>
                            <div className="space-y-2">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2px]">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.image || '/hero-clean.png'}
                                      alt={item.name}
                                      className="w-10 h-10 object-cover rounded-[2px] border border-[var(--border-subtle)]"
                                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero-clean.png'; }}
                                    />
                                    <div>
                                      <span className="font-medium text-[var(--text-primary)] block">{item.name}</span>
                                      <span className="text-[10px] text-[var(--text-secondary)]">
                                        Qty: {item.quantity} {item.metal_finish ? `• Finish: ${item.metal_finish}` : ''} {item.selected_size ? `• Size: ${item.selected_size}` : ''}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="font-semibold text-[var(--text-primary)]">
                                    ₹{(item.price / 100 * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DAILY BULLION RATES */}
        {/* ========================================================================= */}
        {activeTab === 'rates' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <span className="font-sans text-[10px] text-[var(--accent-gold)] tracking-[0.25em] uppercase font-semibold block mb-1">
                JAMMU MARKET RATES CONTROLLER
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal mb-2">
                Daily Bullion Market Rates
              </h2>
              <p className="font-sans text-xs text-[var(--text-secondary)] max-w-lg mx-auto">
                Updating these rates automatically syncs with customer billing calculations, checkout price rate-locks, and store inquiries.
              </p>
            </div>

            <form onSubmit={handleSaveRates} className="p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] shadow-[var(--card-shadow)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 24K Pure Gold */}
                <div>
                  <label className="block text-[11px] font-sans font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    24K Pure Gold (999) &bull; ₹ / gram
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={rateForm.gold_24k}
                    onChange={(e) => setRateForm({ ...rateForm, gold_24k: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 text-sm rounded-[2px] font-mono focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  />
                </div>

                {/* 22K Hallmarked Gold */}
                <div>
                  <label className="block text-[11px] font-sans font-semibold text-[var(--accent-gold)] uppercase tracking-wider mb-1">
                    22K Hallmarked Gold (916) &bull; ₹ / gram
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={rateForm.gold_22k}
                    onChange={(e) => setRateForm({ ...rateForm, gold_22k: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--accent-gold)] px-3 py-2 text-sm rounded-[2px] font-mono focus:outline-none"
                    required
                  />
                </div>

                {/* 18K Diamond Gold */}
                <div>
                  <label className="block text-[11px] font-sans font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    18K Fine Gold (750) &bull; ₹ / gram
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={rateForm.gold_18k}
                    onChange={(e) => setRateForm({ ...rateForm, gold_18k: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 text-sm rounded-[2px] font-mono focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  />
                </div>

                {/* 14K Gold */}
                <div>
                  <label className="block text-[11px] font-sans font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    14K Gold (585) &bull; ₹ / gram
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={rateForm.gold_14k}
                    onChange={(e) => setRateForm({ ...rateForm, gold_14k: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 text-sm rounded-[2px] font-mono focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  />
                </div>

                {/* 999 Fine Silver */}
                <div>
                  <label className="block text-[11px] font-sans font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Fine Silver (999) &bull; ₹ / gram
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={rateForm.silver_999}
                    onChange={(e) => setRateForm({ ...rateForm, silver_999: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 text-sm rounded-[2px] font-mono focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  />
                </div>

                {/* 925 Sterling Silver */}
                <div>
                  <label className="block text-[11px] font-sans font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    925 Sterling Silver &bull; ₹ / gram
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={rateForm.silver_925}
                    onChange={(e) => setRateForm({ ...rateForm, silver_925: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 text-sm rounded-[2px] font-mono focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Last updated: {rates.updated_at ? new Date(rates.updated_at).toLocaleString('en-IN') : 'Default Indicative'}
                </span>

                <button
                  type="submit"
                  disabled={isSavingRates}
                  className="px-5 py-2.5 bg-[var(--accent-gold)] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-[2px] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  {isSavingRates ? 'Saving Rates...' : 'Save & Broadcast Live Rates'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: COUNTER POS & BILLING */}
        {/* ========================================================================= */}
        {activeTab === 'pos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                  Showroom Goldsmith Billing &amp; Counter POS
                </h2>
                <p className="font-sans text-xs text-[var(--text-secondary)]">
                  Instant calculation of gross weight, stone deductions, making charges, mandatory 3% GST, trade-in buyback, and thermal / WhatsApp slips.
                </p>
              </div>

              <Link
                href="/admin/counter"
                target="_blank"
                className="px-3.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-card)] text-xs font-sans font-medium uppercase tracking-wider rounded-[2px] hover:border-[var(--accent-gold)] transition-colors flex items-center gap-1"
              >
                <span>Open Dedicated POS Screen</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </Link>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] p-4 sm:p-6 shadow-[var(--card-shadow)]">
              <BillingCalculator rates={rates} />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: STORE PROFILE & STATUTORY */}
        {/* ========================================================================= */}
        {activeTab === 'store' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                Showroom Profile &amp; Statutory Compliance
              </h2>
              <p className="font-sans text-xs text-[var(--text-secondary)]">
                Statutory registration data verified under Consumer Protection (E-Commerce) Rules, 2020 and Bureau of Indian Standards (BIS).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] space-y-1.5">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Legal Entity</span>
                <h4 className="text-sm font-serif font-medium text-[var(--text-primary)]">{siteConfig.legalBusinessName}</h4>
                <p className="text-xs text-[var(--text-secondary)] font-mono">{siteConfig.businessStructure}</p>
              </div>

              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] space-y-1.5">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Tax &amp; Hallmarking</span>
                <p className="text-xs font-mono text-[var(--text-primary)]">GSTIN: {siteConfig.tax.gstin}</p>
                <p className="text-xs font-mono text-[var(--text-primary)]">PAN: {siteConfig.tax.pan}</p>
                <p className="text-xs font-mono text-[var(--accent-gold)] font-bold">BIS License: {siteConfig.tax.bisLicenseNumber}</p>
              </div>

              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] space-y-1.5">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Grievance Officer</span>
                <p className="text-xs text-[var(--text-primary)] font-medium">{siteConfig.grievanceOfficer.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{siteConfig.grievanceOfficer.phone}</p>
                <p className="text-xs text-[var(--text-secondary)]">{siteConfig.grievanceOfficer.email}</p>
              </div>

              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] space-y-1.5">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Showroom Address</span>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed">{siteConfig.contact.address}</p>
                <p className="text-[11px] text-[var(--accent-gold)] mt-1">{siteConfig.timings}</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2px] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-serif text-lg font-normal text-[var(--text-primary)]">
                {editingProduct ? `Edit Piece: ${editingProduct.name}` : 'Add New Jewellery Creation'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="p-5 overflow-y-auto space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Jewellery Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Dogri Naman Choker in 22K Gold"
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Category *
                  </label>
                  <select
                    value={modalForm.category}
                    onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                  >
                    {siteConfig.categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 145000"
                    value={modalForm.price}
                    onChange={(e) => setModalForm({ ...modalForm, price: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={modalForm.stock_status}
                    onChange={(e) => setModalForm({ ...modalForm, stock_status: e.target.value as any })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="in_stock">In Stock (Ready to dispatch)</option>
                    <option value="limited">Limited Edition (Few pieces left)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                {/* Collection */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Collection Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dogra Heritage Collection"
                    value={modalForm.collection}
                    onChange={(e) => setModalForm({ ...modalForm, collection: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                {/* Badges */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Badges (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="22K BIS, DOGRA HERITAGE, BESTSELLER"
                    value={modalForm.badges}
                    onChange={(e) => setModalForm({ ...modalForm, badges: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                {/* Metal Finishes */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Metal Finishes (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Gold, Antique Gold, Rose Gold"
                    value={modalForm.metal_finishes}
                    onChange={(e) => setModalForm({ ...modalForm, metal_finishes: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                {/* Featured checkbox */}
                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={modalForm.is_featured}
                    onChange={(e) => setModalForm({ ...modalForm, is_featured: e.target.checked })}
                    className="rounded text-[var(--accent-gold)]"
                  />
                  <label htmlFor="is_featured" className="text-xs text-[var(--text-primary)] cursor-pointer">
                    Feature this creation on the storefront homepage
                  </label>
                </div>

                {/* Image URLs */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Image URLs (one URL per line or comma separated)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="https://... or /products/sample.png"
                    value={modalForm.images}
                    onChange={(e) => setModalForm({ ...modalForm, images: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Crafted in 22K hallmarked gold with traditional Dogra filigree..."
                    value={modalForm.description}
                    onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 rounded-[2px] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[var(--border-subtle)] rounded-[2px] text-xs font-sans text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 bg-[var(--accent-gold)] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-[2px] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  {isSavingProduct ? 'Saving Piece...' : (editingProduct ? 'Update Piece' : 'Create Piece')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
