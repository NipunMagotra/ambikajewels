'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/siteConfig';
import { BillingCalculator } from '@/components/counter/BillingCalculator';
import type { DailyRates } from '@/types/counter';
import { DEFAULT_RATES } from '@/lib/counterStore';

// Admin Sub-components
import { InvoiceModal } from '@/components/admin/InvoiceModal';
import { PackingSlipModal } from '@/components/admin/PackingSlipModal';
import { ProductModal, ProductFormData } from '@/components/admin/ProductModal';
import { BulkActionModal } from '@/components/admin/BulkActionModal';
import { CsvImportModal, exportProductsToCsv } from '@/components/admin/CsvModals';
import { CouponModal } from '@/components/admin/CouponModal';
import type { CouponRule } from '@/lib/couponEngine';
import type { AuditLogEntry } from '@/lib/auditLog';
import type { StoreContentConfig } from '@/lib/storeContent';

export interface ProductItem {
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
  material?: string;
  purity?: string;
  bis_hallmark?: string;
  is_hallmarked?: boolean;
  huid?: string;
  weight_grams?: number;
  gross_weight_grams?: number;
  dimensions?: {
    length_cm: number;
    breadth_cm: number;
    height_cm: number;
  };
  hsn_code?: string;
  care_instructions?: string;
  making_charge_type?: 'percent' | 'flat';
  making_charge_rate?: number;
  stone_weight_grams?: number;
  stone_value_paise?: number;
  pricing_mode?: 'live_bullion' | 'fixed';
  size_variants?: string[];
  created_at: string;
}

export interface OrderItem {
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  metal_finish?: string;
  selected_size?: string;
  weight_grams?: number;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  pincode?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending_confirmation' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  razorpay_payment_id?: string;
  bvc_docket_number?: string;
  pan_number?: string;
  notes?: string;
  created_at: string;
}

export type TabType =
  | 'overview'
  | 'products'
  | 'pricing'
  | 'inventory'
  | 'orders'
  | 'coupons'
  | 'content'
  | 'pos'
  | 'audit'
  | 'rates' // alias for pricing
  | 'store'; // alias for content

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Products State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [isImportingCsv, setIsImportingCsv] = useState(false);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);

  const [invoiceOrder, setInvoiceOrder] = useState<OrderRecord | null>(null);
  const [packingSlipOrder, setPackingSlipOrder] = useState<OrderRecord | null>(null);

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [docketInputs, setDocketInputs] = useState<Record<string, string>>({});

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

  // Coupons State
  const [coupons, setCoupons] = useState<CouponRule[]>([]);
  const [isCouponsLoading, setIsCouponsLoading] = useState(false);

  // Store Content State
  const [storeContent, setStoreContent] = useState<StoreContentConfig | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Global Notification Banner
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setBannerMessage({ text, type });
    setTimeout(() => setBannerMessage(null), 4000);
  };

  // ── Fetch Operations ──────────────────────────────────────────────
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

  const fetchCoupons = async () => {
    try {
      setIsCouponsLoading(true);
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (res.ok && data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setIsCouponsLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      setIsContentLoading(true);
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (res.ok && data.success && data.content) {
        setStoreContent(data.content);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setIsContentLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setIsAuditLoading(true);
      const res = await fetch('/api/admin/audit?limit=100');
      const data = await res.json();
      if (res.ok && data.success) {
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setIsAuditLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchRates();
    fetchCoupons();
    fetchContent();
    fetchAuditLogs();
  }, []);

  // ── Logout ────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  // ── Product CRUD Handlers ─────────────────────────────────────────
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (data: ProductFormData) => {
    try {
      setIsSavingProduct(true);
      const isEdit = Boolean(editingProduct);
      const url = '/api/admin/products';
      const method = isEdit ? 'PATCH' : 'POST';

      const payload = {
        ...(isEdit ? { id: editingProduct?.id } : {}),
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        isPaise: false,
        description: data.description,
        images: data.images.length > 0 ? data.images : ['/hero-clean.png'],
        badges: data.badges,
        metal_finishes: data.metal_finishes,
        stock_status: data.stock_status,
        is_featured: data.is_featured,
        collection: data.collection,
        craftsmanship_story: data.craftsmanship_story,
        material: data.material,
        purity: data.purity,
        bis_hallmark: data.bis_hallmark,
        is_hallmarked: data.is_hallmarked,
        huid: data.huid,
        weight_grams: data.weight_grams,
        gross_weight_grams: data.gross_weight_grams,
        dimensions: data.dimensions,
        hsn_code: data.hsn_code,
        care_instructions: data.care_instructions,
        making_charge_type: data.making_charge_type,
        making_charge_rate: data.making_charge_rate,
        stone_weight_grams: data.stone_weight_grams,
        stone_value_paise: Math.round(data.stone_value_rupees * 100),
        pricing_mode: data.pricing_mode,
        size_variants: data.size_variants
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        showNotification(isEdit ? 'Jewellery piece updated!' : 'Jewellery piece published!');
        setIsProductModalOpen(false);
        fetchProducts();
        fetchAuditLogs();
      } else {
        alert(resJson.message || 'Failed to save product.');
      }
    } catch {
      alert('Error communicating with server.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDuplicateProduct = async (p: ProductItem) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', id: p.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Duplicated "${p.name}"`);
        fetchProducts();
        fetchAuditLogs();
      } else {
        alert(data.message || 'Failed to duplicate product.');
      }
    } catch {
      alert('Error duplicating product.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Deleted "${name}"`);
        setProducts(prev => prev.filter(p => p.id !== id));
        setSelectedProductIds(prev => prev.filter(x => x !== id));
        fetchAuditLogs();
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch {
      alert('Error deleting product.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    if (!confirm(`Are you sure you want to permanently delete the ${count} selected jewellery piece${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsProcessingBulk(true);
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedProductIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Successfully deleted ${count} selected piece${count > 1 ? 's' : ''}!`);
        setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.id)));
        setSelectedProductIds([]);
        fetchAuditLogs();
      } else {
        alert(data.message || 'Failed to delete selected products.');
      }
    } catch {
      alert('Error deleting selected products.');
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleDeleteAll = async () => {
    if (products.length === 0) {
      alert('No jewellery pieces available to delete.');
      return;
    }

    const count = products.length;
    const confirmation = prompt(`⚠️ CRITICAL WARNING: You are about to permanently delete ALL ${count} jewellery items from the entire catalog!\n\nThis cannot be undone.\n\nType DELETE to confirm:`);
    if (confirmation !== 'DELETE') {
      if (confirmation !== null) {
        alert('Action cancelled: Confirmation phrase did not match.');
      }
      return;
    }

    try {
      setIsProcessingBulk(true);
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`All ${count} jewellery items have been deleted!`);
        setProducts([]);
        setSelectedProductIds([]);
        fetchAuditLogs();
      } else {
        alert(data.message || 'Failed to delete all products.');
      }
    } catch {
      alert('Error deleting all products.');
    } finally {
      setIsProcessingBulk(false);
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
        showNotification(`Updated ${p.name} stock status`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Bulk Actions ──────────────────────────────────────────────────
  const handleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const visibleIds = filteredProducts.map(p => p.id);
    if (selectedProductIds.length === visibleIds.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(visibleIds);
    }
  };

  const handleApplyBulkUpdates = async (updates: any) => {
    try {
      setIsProcessingBulk(true);
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_update',
          product_ids: selectedProductIds,
          updates
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Applied bulk updates to ${data.updatedCount} products!`);
        setIsBulkModalOpen(false);
        setSelectedProductIds([]);
        fetchProducts();
        fetchAuditLogs();
      } else {
        alert(data.message || 'Bulk update failed.');
      }
    } catch {
      alert('Network error applying bulk update.');
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // ── CSV Import ────────────────────────────────────────────────────
  const handleImportCsvItems = async (items: any[]) => {
    try {
      setIsImportingCsv(true);
      let count = 0;
      for (const item of items) {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (res.ok) count++;
      }
      showNotification(`Imported ${count} of ${items.length} products successfully!`);
      setIsCsvImportOpen(false);
      fetchProducts();
      fetchAuditLogs();
    } catch {
      alert('Error importing products.');
    } finally {
      setIsImportingCsv(false);
    }
  };

  // ── Rates Submit ──────────────────────────────────────────────────
  const handleSaveRatesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prev22k = rates.gold_22k;
    const prev24k = rates.gold_24k;
    
    // Extreme deviation guard (e.g. typing 82500 instead of 8250)
    const deviation22k = prev22k > 0 ? Math.abs((rateForm.gold_22k - prev22k) / prev22k) * 100 : 0;
    const deviation24k = prev24k > 0 ? Math.abs((rateForm.gold_24k - prev24k) / prev24k) * 100 : 0;
    const maxDev = Math.max(deviation22k, deviation24k);

    if (maxDev > 15) {
      const proceed = confirm(
        `⚠️ EXTREME RATE CHANGE WARNING:\n\nYou entered ₹${rateForm.gold_22k}/g for 22K (was ₹${prev22k}/g) and ₹${rateForm.gold_24k}/g for 24K (was ₹${prev24k}/g).\nThis is a ${maxDev.toFixed(1)}% deviation.\n\nDid you make a typing mistake (e.g., extra zero)? Click OK only if you are certain this rate is accurate.`
      );
      if (!proceed) return;
    } else {
      const confirmUpdate = confirm(
        `Confirm Bullion Rate Update:\n\n22K Gold: ₹${prev22k}/g → ₹${rateForm.gold_22k}/g\n24K Gold: ₹${prev24k}/g → ₹${rateForm.gold_24k}/g\n\nImpact: This will immediately recalculate live pricing for all formula-priced jewellery and update the gold ticker in the header. Proceed?`
      );
      if (!confirmUpdate) return;
    }

    try {
      setIsSavingRates(true);
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rateForm,
          updated_by: 'Owner Desk',
          confirm_large_change: maxDev > 15
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Daily bullion rates updated and locked across the store!');
        fetchRates();
        fetchAuditLogs();
      } else {
        alert(data.error || 'Failed to update bullion rates.');
      }
    } catch {
      alert('Network error saving bullion rates.');
    } finally {
      setIsSavingRates(false);
    }
  };

  // ── Orders Operations ─────────────────────────────────────────────
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
        showNotification(`Order status changed to ${newStatus}`);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
        fetchAuditLogs();
      } else {
        alert(data.message || 'Failed to update order status.');
      }
    } catch {
      alert('Error updating order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSaveDocket = async (orderId: string) => {
    const docket = docketInputs[orderId];
    if (docket === undefined) return;

    try {
      setUpdatingOrderId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, bvc_docket_number: docket.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('BVC Docket Number updated!');
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, bvc_docket_number: docket.trim() } : o));
        fetchAuditLogs();
      }
    } catch {
      alert('Error updating docket number.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── Coupons Operations ────────────────────────────────────────────
  const handleSaveCoupon = async (c: CouponRule) => {
    try {
      setIsSavingCoupon(true);
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Coupon ${c.code} created!`);
        setIsCouponModalOpen(false);
        fetchCoupons();
        fetchAuditLogs();
      } else {
        alert(data.message || 'Failed to save coupon.');
      }
    } catch {
      alert('Error saving coupon.');
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleToggleCouponActive = async (code: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, isActive: !currentActive })
      });
      if (res.ok) {
        setCoupons(prev => prev.map(c => c.code === code ? { ...c, isActive: !currentActive } : c));
        showNotification(`Coupon ${code} ${!currentActive ? 'activated' : 'deactivated'}`);
      }
    } catch {
      alert('Error toggling coupon.');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons?code=${code}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification(`Coupon ${code} deleted`);
        setCoupons(prev => prev.filter(c => c.code !== code));
      }
    } catch {
      alert('Error deleting coupon.');
    }
  };

  // ── Store Content Save ────────────────────────────────────────────
  const handleSaveContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeContent) return;
    try {
      setIsSavingContent(true);
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeContent)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Website announcement & showroom content saved!');
        fetchAuditLogs();
      } else {
        alert(data.message || 'Failed to save content.');
      }
    } catch {
      alert('Error saving website content.');
    } finally {
      setIsSavingContent(false);
    }
  };

  // ── Filtered Collections ──────────────────────────────────────────
  const filteredProducts = products.filter(p => {
    const matchesSearch = productSearch.trim() === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.huid && p.huid.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;

    const matchesStock = productStockFilter === 'all' || p.stock_status === productStockFilter;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = orderSearch.trim() === '' ||
      o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_phone.includes(orderSearch.trim()) ||
      (o.bvc_docket_number && o.bvc_docket_number.toLowerCase().includes(orderSearch.toLowerCase()));

    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalSalesRupees = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (o.total / 100), 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending_confirmation' || o.status === 'processing').length;
  const inStockCount = products.filter(p => p.stock_status === 'in_stock').length;
  const lowStockCount = products.filter(p => p.stock_status === 'limited').length;
  const outOfStockCount = products.filter(p => p.stock_status === 'out_of_stock').length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans">
      {/* ── Top Bar / Header ────────────────────────────────────────────── */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 group">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--gold-primary)] group-hover:opacity-90">
                AMBIKA JEWELS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">
                Store Console
              </span>
            </Link>
            <span className="hidden md:inline-block text-xs text-[var(--text-secondary)] border-l border-[var(--border-color)] pl-3">
              Jammu Showroom Hub
            </span>
          </div>

          {/* Bullion Ticker */}
          <div className="hidden lg:flex items-center gap-3 text-xs bg-[var(--bg-primary)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-[var(--text-secondary)]">Live Jammu Rates:</span>
            <span className="font-mono font-semibold text-[var(--gold-primary)]">24K: ₹{rates.gold_24k}/g</span>
            <span className="text-zinc-600">|</span>
            <span className="font-mono font-semibold text-[var(--text-primary)]">22K: ₹{rates.gold_22k}/g</span>
            <span className="text-zinc-600">|</span>
            <span className="font-mono font-semibold text-zinc-300">Silver: ₹{rates.silver_925}/g</span>
          </div>

          {/* User profile & external links */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded border border-[var(--border-color)]"
            >
              <span>View Storefront</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[var(--text-primary)]">Shivani Anand</p>
              <p className="text-[10px] text-amber-500 font-medium">Owner &amp; Founder</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/30 rounded text-xs font-medium transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Notification Banner ────────────────────────────────────────── */}
      {bannerMessage && (
        <div
          className={`fixed top-16 right-6 z-50 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
            bannerMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-500'
              : 'bg-red-950 text-red-200 border-red-500'
          }`}
        >
          <span>{bannerMessage.type === 'success' ? '✓' : '⚠'}</span>
          <span>{bannerMessage.text}</span>
        </div>
      )}

      {/* ── Navigation Tabs ────────────────────────────────────────────── */}
      <nav className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-1 py-1">
          {[
            { id: 'overview', label: '📊 Dashboard' },
            { id: 'products', label: `💎 Jewellery Pieces (${products.length})` },
            { id: 'pricing', label: '📈 Bullion & Pricing' },
            { id: 'inventory', label: `📦 Inventory (${inStockCount})` },
            { id: 'orders', label: `🛍️ Orders (${orders.length})` },
            { id: 'coupons', label: `🎟️ Coupons (${coupons.length})` },
            { id: 'content', label: '🎨 Website Content' },
            { id: 'pos', label: '⚖️ Counter POS' },
            { id: 'audit', label: '📋 Audit Log' }
          ].map(tab => {
            const isTabActive = activeTab === tab.id || (tab.id === 'pricing' && activeTab === 'rates') || (tab.id === 'content' && activeTab === 'store');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isTabActive
                    ? 'bg-[var(--gold-primary)] text-black font-bold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Main Content Area ──────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-color)]">
                <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium">
                  Verified Online Sales
                </p>
                <p className="font-serif text-2xl font-bold text-[var(--gold-primary)] mt-1 font-mono">
                  ₹{Math.round(totalSalesRupees).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span>✓ 100% Razorpay Captured</span>
                </p>
              </div>

              <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-color)]">
                <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium">
                  Pending Dispatch
                </p>
                <p className="font-serif text-2xl font-bold text-amber-500 mt-1 font-mono">
                  {pendingOrdersCount} <span className="text-sm font-sans font-normal text-[var(--text-secondary)]">Orders</span>
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  Require packaging or BVC airway bill
                </p>
              </div>

              <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-color)]">
                <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium">
                  Catalog Inventory
                </p>
                <p className="font-serif text-2xl font-bold text-[var(--text-primary)] mt-1 font-mono">
                  {products.length} <span className="text-sm font-sans font-normal text-[var(--text-secondary)]">Pieces</span>
                </p>
                <p className="text-[11px] text-emerald-400 mt-1">
                  {inStockCount} Ready | {lowStockCount} Low | {outOfStockCount} Sold
                </p>
              </div>

              <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-color)]">
                <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium">
                  Active Bullion Rate
                </p>
                <p className="font-serif text-2xl font-bold text-[var(--gold-primary)] mt-1 font-mono">
                  ₹{rates.gold_24k}/g
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  22K: ₹{rates.gold_22k}/g | Silver: ₹{rates.silver_925}/g
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Quick Store Operations</h3>
                <p className="text-xs text-[var(--text-secondary)]">Common daily workflows for shopkeeper and staff.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-2 bg-[var(--gold-primary)] text-black rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow"
                >
                  <span>+</span> Add New Jewellery Piece
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:border-[var(--gold-primary)] transition-all"
                >
                  Check Pending Orders ({pendingOrdersCount})
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:border-[var(--gold-primary)] transition-all"
                >
                  Update Gold Rates
                </button>
                <button
                  onClick={() => {
                    setActiveTab('coupons');
                    setIsCouponModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:border-[var(--gold-primary)] transition-all"
                >
                  Create Promo Coupon
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[var(--gold-primary)] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-[var(--text-secondary)] italic py-4 text-center">
                  No online orders placed yet. Orders will appear here in real-time as customers checkout.
                </p>
              ) : (
                <div className="divide-y divide-[var(--border-color)] text-xs">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                          <span>{o.order_number}</span>
                          <span className="font-normal text-[var(--text-secondary)]">— {o.customer_name}</span>
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                          {o.items.length} items | Placed on {new Date(o.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[var(--gold-primary)] text-sm">
                          ₹{Math.round(o.total / 100).toLocaleString('en-IN')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.status === 'delivered' ? 'bg-emerald-950 text-emerald-300' :
                          o.status === 'shipped' ? 'bg-blue-950 text-blue-300' :
                          'bg-amber-950 text-amber-300'
                        }`}>
                          {o.status.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('orders');
                            setExpandedOrderId(o.id);
                          }}
                          className="px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] rounded text-[11px]"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS CATALOG */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search & Bulk Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)]">
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by name, category, or BIS HUID..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full sm:max-w-xs px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
                />
                <select
                  value={productCategoryFilter}
                  onChange={e => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)]"
                >
                  <option value="All">All Categories</option>
                  {siteConfig.categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Dogra Heritage Collection">Dogra Heritage Collection</option>
                </select>
                <select
                  value={productStockFilter}
                  onChange={e => setProductStockFilter(e.target.value)}
                  className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)]"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="in_stock">In Stock</option>
                  <option value="limited">Limited</option>
                  <option value="out_of_stock">Sold Out</option>
                </select>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={handleSelectAllFiltered}
                  className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5"
                  title="Toggle select all visible items"
                >
                  <span>{selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length ? '☒ Deselect All' : `☑ Select All (${filteredProducts.length})`}</span>
                </button>
                {selectedProductIds.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    disabled={isProcessingBulk}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-bold transition-colors flex items-center gap-1.5 shadow disabled:opacity-50"
                  >
                    <span>🗑️</span> Delete Selected ({selectedProductIds.length})
                  </button>
                )}
                {products.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    disabled={isProcessingBulk}
                    className="px-3 py-2 bg-red-950/40 border border-red-800/60 hover:bg-red-900/60 text-red-300 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    title="Permanently remove all products from catalog"
                  >
                    <span>⚠️</span> Delete All Items
                  </button>
                )}
                <button
                  onClick={() => exportProductsToCsv(products)}
                  className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>⬇</span> Export CSV
                </button>
                <button
                  onClick={() => setIsCsvImportOpen(true)}
                  className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>⬆</span> Import CSV
                </button>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[var(--gold-primary)] text-black rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1 shadow"
                >
                  <span>+</span> Add Jewellery Piece
                </button>
              </div>
            </div>

            {/* Floating Bulk Action Bar */}
            {selectedProductIds.length > 0 && (
              <div className="bg-amber-950/60 border border-amber-500/50 p-3 rounded-lg flex items-center justify-between text-xs shadow-lg animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--gold-primary)] text-sm">{selectedProductIds.length}</span>
                  <span>pieces selected</span>
                  <button
                    onClick={() => setSelectedProductIds([])}
                    className="underline text-[var(--text-secondary)] hover:text-[var(--text-primary)] ml-2"
                  >
                    Clear selection
                  </button>
                  <button
                    onClick={handleSelectAllFiltered}
                    className="text-[var(--gold-primary)] hover:underline ml-2"
                  >
                    {selectedProductIds.length === filteredProducts.length ? 'Deselect all' : `Select all ${filteredProducts.length}`}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBulkModalOpen(true)}
                    className="px-3 py-1.5 bg-[var(--gold-primary)] text-black font-bold rounded text-xs hover:opacity-90 flex items-center gap-1"
                  >
                    ⚡ Bulk Update Prices / Stock
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={isProcessingBulk}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    🗑️ Delete Selected ({selectedProductIds.length})
                  </button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              {isProductsLoading ? (
                <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
                  Loading jewellery catalog...
                </div>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length}
                          onChange={handleSelectAllFiltered}
                          className="w-3.5 h-3.5 accent-amber-600 rounded"
                        />
                      </th>
                      <th className="py-3 px-3">Jewellery Piece</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Purity &amp; Weight</th>
                      <th className="py-3 px-3 text-right">Price</th>
                      <th className="py-3 px-3 text-center">Stock</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredProducts.map(p => {
                      const isSelected = selectedProductIds.includes(p.id);
                      return (
                        <tr key={p.id} className={`hover:bg-[var(--bg-primary)] transition-colors ${isSelected ? 'bg-amber-950/10' : ''}`}>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectProduct(p.id)}
                              className="w-3.5 h-3.5 accent-amber-600 rounded"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={(p.images && p.images[0]) || '/hero-clean.png'}
                                alt={p.name}
                                className="w-10 h-10 rounded object-cover border border-[var(--border-color)] bg-[var(--bg-primary)]"
                              />
                              <div>
                                <p className="font-bold text-[var(--text-primary)]">{p.name}</p>
                                <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                                  HUID: {p.huid || 'Standard BIS'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[var(--text-secondary)]">{p.category}</td>
                          <td className="py-3 px-3">
                            <p className="font-medium text-[var(--text-primary)]">{p.purity || '22K (916)'}</p>
                            <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                              {p.weight_grams ? `${p.weight_grams}g Net` : '10g'}
                            </p>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-[var(--gold-primary)] text-sm">
                            ₹{Math.round(p.price / 100).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <select
                              value={p.stock_status}
                              onChange={e => handleQuickStockToggle(p, e.target.value as any)}
                              className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                                p.stock_status === 'in_stock'
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                                  : p.stock_status === 'limited'
                                  ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950 border-amber-600 font-extrabold'
                                  : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700'
                              }`}
                            >
                              <option value="in_stock" className="bg-white text-emerald-800 font-bold dark:bg-zinc-900 dark:text-emerald-400">
                                In Stock
                              </option>
                              <option value="limited" className="bg-white text-amber-800 font-bold dark:bg-zinc-900 dark:text-amber-400">
                                Limited
                              </option>
                              <option value="out_of_stock" className="bg-white text-red-800 font-bold dark:bg-zinc-900 dark:text-red-400">
                                Sold Out
                              </option>
                            </select>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] rounded text-[11px]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                title="Duplicate this piece"
                                className="px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] rounded text-[11px]"
                              >
                                📋 Copy
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                title="Delete"
                                className="px-2 py-1 bg-red-950/20 text-red-400 border border-red-500/30 hover:bg-red-900/30 rounded text-[11px]"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BULLION & PRICING */}
        {/* ========================================================================= */}
        {(activeTab === 'pricing' || activeTab === 'rates') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Bullion Rates Editor */}
            <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-color)] space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--gold-primary)]">
                  Jammu Bullion Market Rates (₹/Gram)
                </h3>
                {isRatesLoading && <p className="text-[11px] text-amber-400 animate-pulse">Syncing market rates...</p>}
                <p className="text-xs text-[var(--text-secondary)]">
                  Updating these rates automatically locks and recalculates real-time pricing for live formula products across the entire website.
                </p>
              </div>

              <form onSubmit={handleSaveRatesSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                      Gold 24K (999 Fineness) *
                    </label>
                    <input
                      type="number"
                      required
                      value={rateForm.gold_24k}
                      onChange={e => setRateForm({ ...rateForm, gold_24k: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm text-[var(--gold-primary)] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                      Gold 22K (916 Hallmarked) *
                    </label>
                    <input
                      type="number"
                      required
                      value={rateForm.gold_22k}
                      onChange={e => setRateForm({ ...rateForm, gold_22k: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm text-[var(--text-primary)] font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                      Gold 18K (750 Hallmarked)
                    </label>
                    <input
                      type="number"
                      value={rateForm.gold_18k}
                      onChange={e => setRateForm({ ...rateForm, gold_18k: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                      Gold 14K (585 Everyday)
                    </label>
                    <input
                      type="number"
                      value={rateForm.gold_14k}
                      onChange={e => setRateForm({ ...rateForm, gold_14k: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                      Silver 999 Fine (Chandi) *
                    </label>
                    <input
                      type="number"
                      required
                      value={rateForm.silver_999}
                      onChange={e => setRateForm({ ...rateForm, silver_999: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                      Silver 925 Sterling
                    </label>
                    <input
                      type="number"
                      value={rateForm.silver_925}
                      onChange={e => setRateForm({ ...rateForm, silver_925: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] space-y-1">
                  <p><strong>Last Updated:</strong> {new Date(rates.updated_at || Date.now()).toLocaleString('en-IN')}</p>
                  <p><strong>Updated By:</strong> {rates.updated_by || 'Store Manager'}</p>
                </div>

                <button
                  type="submit"
                  disabled={isSavingRates}
                  className="w-full py-2.5 bg-[var(--gold-primary)] text-black font-bold rounded-lg text-xs hover:opacity-90 transition-all shadow"
                >
                  {isSavingRates ? 'Saving Bullion Rates...' : 'Publish & Lock Daily Bullion Rates'}
                </button>
              </form>
            </div>

            {/* Live Pricing Breakdown Calculator */}
            <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-color)] space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                  Live Price Breakup Simulator
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Formula used by customer cart and checkout: Metal Value + Making Charges + Stones + 3% GST.
                </p>
              </div>

              <div className="space-y-3 bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Sample Net Weight (Grams)
                    </label>
                    <input
                      type="number"
                      defaultValue={15}
                      id="calc-sample-weight"
                      className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Making Charge (%)
                    </label>
                    <input
                      type="number"
                      defaultValue={8}
                      id="calc-sample-making"
                      className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
                  <p className="font-bold text-[var(--gold-primary)]">Formula Reference:</p>
                  <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                    Gold Value = Weight (g) × Today&apos;s 22K Rate (₹{rates.gold_22k})<br />
                    Making = Gold Value × Making%<br />
                    GST = 3% on (Gold Value + Making + Stones)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INVENTORY MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Inventory Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-secondary)]">Total Catalog Items</p>
                <p className="text-2xl font-bold font-mono text-[var(--text-primary)]">{products.length}</p>
              </div>
              <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-emerald-500/30">
                <p className="text-xs text-emerald-400">Ready in Showroom</p>
                <p className="text-2xl font-bold font-mono text-emerald-400">{inStockCount}</p>
              </div>
              <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-amber-500/30">
                <p className="text-xs text-amber-400">Low Stock (≤2 units)</p>
                <p className="text-2xl font-bold font-mono text-amber-400">{lowStockCount}</p>
              </div>
              <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-red-500/30">
                <p className="text-xs text-red-400">Sold Out / Hidden</p>
                <p className="text-2xl font-bold font-mono text-red-400">{outOfStockCount}</p>
              </div>
            </div>

            {/* Inventory Items List */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase">
                  <tr>
                    <th className="py-3 px-4">Jewellery Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Quick Stock Switch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-[var(--bg-primary)]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={(p.images && p.images[0]) || '/hero-clean.png'}
                            alt={p.name}
                            className="w-9 h-9 rounded object-cover border border-[var(--border-color)]"
                          />
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">{p.name}</p>
                            <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                              Weight: {p.weight_grams ? `${p.weight_grams}g` : '10g'} | HUID: {p.huid || 'BIS 916'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{p.category}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase shadow-xs ${
                          p.stock_status === 'in_stock' ? 'bg-emerald-600 text-white' :
                          p.stock_status === 'limited' ? 'bg-amber-500 text-zinc-950 font-extrabold' :
                          'bg-rose-600 text-white'
                        }`}>
                          {p.stock_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex rounded-lg border border-[var(--border-color)] p-0.5 bg-[var(--bg-primary)] shadow-xs">
                          <button
                            onClick={() => handleQuickStockToggle(p, 'in_stock')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                              p.stock_status === 'in_stock' ? 'bg-emerald-600 text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            In Stock
                          </button>
                          <button
                            onClick={() => handleQuickStockToggle(p, 'limited')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                              p.stock_status === 'limited' ? 'bg-amber-500 text-zinc-950 shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            Low
                          </button>
                          <button
                            onClick={() => handleQuickStockToggle(p, 'out_of_stock')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                              p.stock_status === 'out_of_stock' ? 'bg-rose-600 text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            Sold Out
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

        {/* ========================================================================= */}
        {/* TAB 5: ORDERS & SHIPMENTS */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)]">
              <input
                type="text"
                placeholder="Search by order number, customer name, phone, or BVC docket..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full sm:max-w-md px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)]"
              />

              <div className="flex items-center gap-2">
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)]"
                >
                  <option value="all">All Order Statuses</option>
                  <option value="pending_confirmation">Pending Confirmation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing (Making)</option>
                  <option value="shipped">Shipped (In Transit)</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            {isOrdersLoading ? (
              <div className="bg-[var(--bg-surface)] p-8 rounded-xl border border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
                Loading customer orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-[var(--bg-surface)] p-8 rounded-xl border border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)] italic">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => {
                  const isExpanded = expandedOrderId === order.id;
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] overflow-hidden transition-all shadow-sm"
                    >
                      {/* Summary Row */}
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[var(--gold-primary)]">
                              {order.order_number}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              order.payment_status === 'paid' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                            }`}>
                              {order.payment_status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-primary)] font-medium">
                            {order.customer_name} • {order.customer_phone}
                          </p>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            Placed on {new Date(order.created_at).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-right">
                            <p className="text-[10px] text-[var(--text-secondary)] uppercase">Grand Total</p>
                            <p className="font-mono font-bold text-base text-[var(--gold-primary)]">
                              ₹{Math.round(order.total / 100).toLocaleString('en-IN')}
                            </p>
                          </div>

                          {/* Quick Print Actions */}
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                          >
                            <span>🧾</span> Print GST Bill
                          </button>
                          <button
                            onClick={() => setPackingSlipOrder(order)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                          >
                            <span>📦</span> Packing Slip
                          </button>

                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] rounded text-xs font-medium"
                          >
                            {isExpanded ? 'Collapse ▲' : 'Details ▼'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Order Drawer */}
                      {isExpanded && (
                        <div className="p-6 bg-[var(--bg-primary)] space-y-6 text-xs">
                          {/* 1. Status & BVC Logistics Controls */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)]">
                            <div>
                              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                                Update Order Lifecycle Status
                              </label>
                              <select
                                value={order.status}
                                disabled={isUpdating}
                                onChange={e => handleOrderStatusUpdate(order.id, e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs font-semibold"
                              >
                                <option value="pending_confirmation">Pending Confirmation</option>
                                <option value="confirmed">Confirmed (Order Accepted)</option>
                                <option value="processing">Processing (In Goldsmith Workshop)</option>
                                <option value="shipped">Shipped (Dispatched with BVC)</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                                BVC Logistics Airway Bill / Docket Number
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter BVC Docket..."
                                  value={docketInputs[order.id] !== undefined ? docketInputs[order.id] : (order.bvc_docket_number || '')}
                                  onChange={e => setDocketInputs({ ...docketInputs, [order.id]: e.target.value })}
                                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-xs"
                                />
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleSaveDocket(order.id)}
                                  className="px-3 py-2 bg-[var(--gold-primary)] text-black font-bold rounded-lg text-xs hover:opacity-90"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Customer & Shipping Destination */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <p className="font-bold text-[var(--text-secondary)] uppercase">Shipping Address:</p>
                              <p className="text-[var(--text-primary)] leading-relaxed">{order.shipping_address}</p>
                              {order.pincode && <p className="text-[var(--text-secondary)]">Pincode: {order.pincode}</p>}
                              {order.pan_number && (
                                <p className="font-mono text-amber-400 pt-1">
                                  <strong>Rule 114B PAN:</strong> {order.pan_number}
                                </p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-[var(--text-secondary)] uppercase">Payment Details:</p>
                              <p>Method: {order.payment_method}</p>
                              {order.razorpay_payment_id && (
                                <p className="font-mono text-[var(--text-secondary)]">
                                  Razorpay Txn: {order.razorpay_payment_id}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* 3. Items Table */}
                          <div>
                            <p className="font-bold text-[var(--text-secondary)] uppercase mb-2">Order Items:</p>
                            <table className="w-full text-left border border-[var(--border-color)]">
                              <thead className="bg-[var(--bg-surface)] text-[var(--text-secondary)]">
                                <tr>
                                  <th className="py-2 px-3">Item</th>
                                  <th className="py-2 px-3 text-center">Finish / Size</th>
                                  <th className="py-2 px-3 text-center">Qty</th>
                                  <th className="py-2 px-3 text-right">Unit Price</th>
                                  <th className="py-2 px-3 text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border-color)]">
                                {order.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="py-2 px-3 font-semibold text-[var(--text-primary)]">{item.name}</td>
                                    <td className="py-2 px-3 text-center text-[var(--text-secondary)]">
                                      {item.metal_finish || 'Gold'} {item.selected_size ? `(${item.selected_size})` : ''}
                                    </td>
                                    <td className="py-2 px-3 text-center font-mono">{item.quantity}</td>
                                    <td className="py-2 px-3 text-right font-mono">₹{Math.round(item.price / 100).toLocaleString('en-IN')}</td>
                                    <td className="py-2 px-3 text-right font-mono font-bold text-[var(--gold-primary)]">
                                      ₹{Math.round((item.price * item.quantity) / 100).toLocaleString('en-IN')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
        {/* TAB 6: COUPONS & PROMOTIONAL OFFERS */}
        {/* ========================================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--gold-primary)]">
                  Promotional Coupons &amp; Discount Offers
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  All discount rules are validated server-side to guarantee secure payments.
                </p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-4 py-2 bg-[var(--gold-primary)] text-black rounded-lg text-xs font-bold hover:opacity-90 shadow"
              >
                + Create Promo Code
              </button>
            </div>

            {/* Coupons Table */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              {isCouponsLoading ? (
                <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
                  Loading discount coupons...
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase">
                  <tr>
                    <th className="py-3 px-4">Coupon Code</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Min. Order</th>
                    <th className="py-3 px-4">Valid Until</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Usage</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {coupons.map(coupon => (
                    <tr key={coupon.code} className="hover:bg-[var(--bg-primary)]">
                      <td className="py-3 px-4 font-mono font-bold text-[var(--gold-primary)] text-sm">
                        {coupon.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">
                        {coupon.type === 'flat'
                          ? `₹${Math.round(coupon.value / 100).toLocaleString('en-IN')} Flat Off`
                          : `${coupon.value}% Off`}
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">
                        ₹{Math.round(coupon.minOrderPaise / 100).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">
                        {coupon.validUntil}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleCouponActive(coupon.code, coupon.isActive)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                            coupon.isActive
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {coupon.usageCount || 0} times
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteCoupon(coupon.code)}
                          className="px-2 py-1 bg-red-950/20 text-red-400 border border-red-500/30 rounded text-[11px] hover:bg-red-900/30"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: WEBSITE CONTENT MANAGER */}
        {/* ========================================================================= */}
        {(activeTab === 'content' || activeTab === 'store') && (
          <div className="space-y-6">
            <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-color)]">
              <h3 className="font-serif text-xl font-bold text-[var(--gold-primary)] mb-1">
                Visual Website Content Editor
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-6">
                Update the homepage banner, promotional announcement, and showroom hours without touching code.
              </p>

              {storeContent ? (
                <form onSubmit={handleSaveContentSubmit} className="space-y-6 text-xs">
                  {/* Announcement Bar */}
                  <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        1. Announcement Bar Banner
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={storeContent.announcement?.isEnabled}
                          onChange={e => setStoreContent({
                            ...storeContent,
                            announcement: { ...storeContent.announcement, isEnabled: e.target.checked }
                          })}
                          className="w-4 h-4 accent-amber-600 rounded"
                        />
                        <span className="text-xs font-semibold">Enable Announcement</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                        Announcement Text
                      </label>
                      <input
                        type="text"
                        value={storeContent.announcement?.text || ''}
                        onChange={e => setStoreContent({
                          ...storeContent,
                          announcement: { ...storeContent.announcement, text: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  {/* Hero Banner */}
                  <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] space-y-3">
                    <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      2. Homepage Hero Banner
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                          Hero Heading Title
                        </label>
                        <input
                          type="text"
                          value={storeContent.hero?.title || ''}
                          onChange={e => setStoreContent({
                            ...storeContent,
                            hero: { ...storeContent.hero, title: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                          Hero Badge / Eyebrow
                        </label>
                        <input
                          type="text"
                          value={storeContent.hero?.badge || ''}
                          onChange={e => setStoreContent({
                            ...storeContent,
                            hero: { ...storeContent.hero, badge: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                        Hero Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={storeContent.hero?.subtitle || ''}
                        onChange={e => setStoreContent({
                          ...storeContent,
                          hero: { ...storeContent.hero, subtitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                          Primary Button Text
                        </label>
                        <input
                          type="text"
                          value={storeContent.hero?.primaryButtonText || ''}
                          onChange={e => setStoreContent({
                            ...storeContent,
                            hero: { ...storeContent.hero, primaryButtonText: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                          Primary Button Link
                        </label>
                        <input
                          type="text"
                          value={storeContent.hero?.primaryButtonLink || ''}
                          onChange={e => setStoreContent({
                            ...storeContent,
                            hero: { ...storeContent.hero, primaryButtonLink: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Showroom Contact & Timings */}
                  <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] space-y-3">
                    <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      3. Jammu Showroom Timings &amp; Contact
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={storeContent.showroom?.phone || ''}
                          onChange={e => setStoreContent({
                            ...storeContent,
                            showroom: { ...storeContent.showroom, phone: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                          WhatsApp Desk
                        </label>
                        <input
                          type="text"
                          value={storeContent.showroom?.whatsapp || ''}
                          onChange={e => setStoreContent({
                            ...storeContent,
                            showroom: { ...storeContent.showroom, whatsapp: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                        Showroom Operating Hours
                      </label>
                      <input
                        type="text"
                        value={storeContent.showroom?.openingHours || ''}
                        onChange={e => setStoreContent({
                          ...storeContent,
                          showroom: { ...storeContent.showroom, openingHours: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingContent}
                      className="px-6 py-2.5 bg-[var(--gold-primary)] text-black font-bold rounded-lg text-xs hover:opacity-90 shadow"
                    >
                      {isSavingContent ? 'Saving Website Settings...' : 'Save & Publish Store Settings'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-[var(--text-secondary)]">{isContentLoading ? 'Loading website content...' : 'Loading website content...'}</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: COUNTER POS & BILLING */}
        {/* ========================================================================= */}
        {activeTab === 'pos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                  Showroom Goldsmith Billing &amp; Counter POS
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Counter estimating and instant receipt generation calibrated to today&apos;s bullion rate.
                </p>
              </div>
            </div>
            <BillingCalculator rates={rates} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: AUDIT LOG */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--gold-primary)]">
                  Store Management Audit Ledger
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Tamper-evident log of all catalog updates, bullion rate revisions, order status changes, and coupon modifications.
                </p>
              </div>
              <button
                onClick={fetchAuditLogs}
                className="px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] text-xs rounded font-medium"
              >
                🔄 Refresh Logs
              </button>
            </div>

            {/* Audit Table */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              {isAuditLoading ? (
                <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
                  Loading audit records...
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Staff Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[var(--bg-primary)]">
                      <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">
                        {new Date(log.created_at).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-medium text-[var(--text-primary)]">
                        {log.staff_name} ({log.staff_email})
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/40 text-amber-300 border border-amber-500/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">
                        {log.entity_type} {log.entity_id ? `(${log.entity_id})` : ''}
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">
                        {log.ip_address || '127.0.0.1'}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-500 italic">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Sub-component Modals ────────────────────────────────────────── */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        rates={rates}
        isSaving={isSavingProduct}
      />

      <BulkActionModal
        isOpen={isBulkModalOpen}
        selectedCount={selectedProductIds.length}
        onClose={() => setIsBulkModalOpen(false)}
        onApply={handleApplyBulkUpdates}
        isProcessing={isProcessingBulk}
      />

      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
        onImport={handleImportCsvItems}
        isImporting={isImportingCsv}
      />

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSave={handleSaveCoupon}
        isSaving={isSavingCoupon}
      />

      <InvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />

      <PackingSlipModal
        order={packingSlipOrder}
        onClose={() => setPackingSlipOrder(null)}
      />
    </div>
  );
}
