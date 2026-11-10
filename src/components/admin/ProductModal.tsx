'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@/config/siteConfig';
import type { DailyRates } from '@/types/counter';

export interface ProductFormData {
  id?: string;
  name: string;
  category: string;
  price: string; // in rupees
  description: string;
  images: string[];
  badges: string[];
  metal_finishes: string[];
  stock_status: 'in_stock' | 'limited' | 'out_of_stock';
  is_featured: boolean;
  collection: string;
  craftsmanship_story: string;
  material: string;
  purity: string;
  bis_hallmark: string;
  is_hallmarked: boolean;
  huid: string;
  weight_grams: number;
  gross_weight_grams: number;
  dimensions: {
    length_cm: number;
    breadth_cm: number;
    height_cm: number;
  };
  hsn_code: string;
  care_instructions: string;
  making_charge_type: 'percent' | 'flat';
  making_charge_rate: number;
  stone_weight_grams: number;
  stone_value_rupees: number;
  pricing_mode: 'live_bullion' | 'fixed';
  size_variants: string[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
  editingProduct?: any | null;
  rates: DailyRates;
  isSaving: boolean;
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  rates,
  isSaving
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'images' | 'pricing'>('basic');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const [form, setFormRaw] = useState<ProductFormData>({
    name: '',
    category: siteConfig.categories[0] || 'Necklaces',
    price: '',
    description: '',
    images: [],
    badges: ['22K BIS', 'DOGRA HERITAGE'],
    metal_finishes: ['Gold'],
    stock_status: 'in_stock',
    is_featured: false,
    collection: 'Dogra Heritage Collection',
    craftsmanship_story: '',
    material: '22K Solid Gold (BIS Hallmarked)',
    purity: '22K (916)',
    bis_hallmark: 'BIS Hallmarked with unique 6-character HUID',
    is_hallmarked: true,
    huid: '',
    weight_grams: 12.5,
    gross_weight_grams: 13.0,
    dimensions: { length_cm: 3.5, breadth_cm: 2.0, height_cm: 1.0 },
    hsn_code: '7113',
    care_instructions: 'Store in provided velvet pouch away from perfume spray and chemicals.',
    making_charge_type: 'percent',
    making_charge_rate: 8,
    stone_weight_grams: 0.5,
    stone_value_rupees: 0,
    pricing_mode: 'live_bullion',
    size_variants: ['Standard']
  });

  const setForm = (action: React.SetStateAction<ProductFormData>) => {
    setIsDirty(true);
    setFormRaw(action);
  };

  useEffect(() => {
    if (editingProduct) {
      const priceRupees = (editingProduct.price / 100).toString();
      setFormRaw({
        id: editingProduct.id,
        name: editingProduct.name || '',
        category: editingProduct.category || siteConfig.categories[0] || 'Necklaces',
        price: priceRupees,
        description: editingProduct.description || '',
        images: Array.isArray(editingProduct.images) ? editingProduct.images : [],
        badges: Array.isArray(editingProduct.badges) ? editingProduct.badges : ['22K BIS'],
        metal_finishes: Array.isArray(editingProduct.metal_finishes) ? editingProduct.metal_finishes : ['Gold'],
        stock_status: editingProduct.stock_status || 'in_stock',
        is_featured: Boolean(editingProduct.is_featured),
        collection: editingProduct.collection || 'Dogra Heritage Collection',
        craftsmanship_story: editingProduct.craftsmanship_story || '',
        material: editingProduct.material || '22K Solid Gold (BIS Hallmarked)',
        purity: editingProduct.purity || '22K (916)',
        bis_hallmark: editingProduct.bis_hallmark || 'BIS Hallmarked with HUID',
        is_hallmarked: editingProduct.is_hallmarked !== false,
        huid: editingProduct.huid || '',
        weight_grams: editingProduct.weight_grams ? Number(editingProduct.weight_grams) : 10.0,
        gross_weight_grams: editingProduct.gross_weight_grams ? Number(editingProduct.gross_weight_grams) : 10.5,
        dimensions: editingProduct.dimensions || { length_cm: 3, breadth_cm: 2, height_cm: 1 },
        hsn_code: editingProduct.hsn_code || '7113',
        care_instructions: editingProduct.care_instructions || 'Store in provided velvet box.',
        making_charge_type: editingProduct.making_charge_type || 'percent',
        making_charge_rate: editingProduct.making_charge_rate !== undefined ? Number(editingProduct.making_charge_rate) : 8,
        stone_weight_grams: editingProduct.stone_weight_grams ? Number(editingProduct.stone_weight_grams) : 0,
        stone_value_rupees: editingProduct.stone_value_paise ? Math.round(Number(editingProduct.stone_value_paise) / 100) : 0,
        pricing_mode: editingProduct.pricing_mode || 'fixed',
        size_variants: Array.isArray(editingProduct.size_variants) ? editingProduct.size_variants : ['Standard']
      });
    } else {
      setFormRaw({
        name: '',
        category: siteConfig.categories[0] || 'Necklaces',
        price: '',
        description: '',
        images: [],
        badges: ['22K BIS', 'DOGRA HERITAGE'],
        metal_finishes: ['Gold'],
        stock_status: 'in_stock',
        is_featured: false,
        collection: 'Dogra Heritage Collection',
        craftsmanship_story: '',
        material: '22K Solid Gold (BIS Hallmarked)',
        purity: '22K (916)',
        bis_hallmark: 'BIS Hallmarked with unique 6-character HUID',
        is_hallmarked: true,
        huid: '',
        weight_grams: 12.5,
        gross_weight_grams: 13.0,
        dimensions: { length_cm: 3.5, breadth_cm: 2.0, height_cm: 1.0 },
        hsn_code: '7113',
        care_instructions: 'Store in provided velvet pouch away from perfume spray and chemicals.',
        making_charge_type: 'percent',
        making_charge_rate: 8,
        stone_weight_grams: 0.5,
        stone_value_rupees: 0,
        pricing_mode: 'live_bullion',
        size_variants: ['Standard']
      });
    }
    setActiveTab('basic');
    setIsDirty(false);
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleCloseAttempt = () => {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    onClose();
  };

  // Bullion Live Formula Calculation
  const activeRatePerGram = form.purity.includes('24K')
    ? rates.gold_24k
    : form.purity.includes('18K')
    ? rates.gold_18k
    : form.purity.includes('14K')
    ? rates.gold_14k
    : form.purity.includes('Silver')
    ? rates.silver_925
    : rates.gold_22k; // Default 22K

  const metalValue = Math.round(form.weight_grams * activeRatePerGram);
  const makingCharges = form.making_charge_type === 'percent'
    ? Math.round((metalValue * form.making_charge_rate) / 100)
    : Math.round(form.weight_grams * form.making_charge_rate);
  const stoneCharges = form.stone_value_rupees || 0;
  const preTaxTotal = metalValue + makingCharges + stoneCharges;
  const gstAmount = Math.round(preTaxTotal * 0.03);
  const calculatedGrandTotal = preTaxTotal + gstAmount;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: data
        });

        const json = await res.json();
        if (res.ok && json.success && json.url) {
          setForm(prev => ({
            ...prev,
            images: [...prev.images, json.url]
          }));
        } else {
          setUploadError(json.message || 'Image upload failed.');
        }
      }
    } catch {
      setUploadError('Network error uploading image.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setForm(prev => ({
      ...prev,
      images: [...prev.images, urlInput.trim()]
    }));
    setUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleSetPrimary = (index: number) => {
    setForm(prev => {
      const copy = [...prev.images];
      const [item] = copy.splice(index, 1);
      return {
        ...prev,
        images: [item, ...copy]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter a name for this jewellery piece.');
      setActiveTab('basic');
      return;
    }

    // Determine price
    const finalPrice = form.pricing_mode === 'live_bullion'
      ? calculatedGrandTotal.toString()
      : form.price;

    if (!finalPrice || isNaN(Number(finalPrice)) || Number(finalPrice) <= 0) {
      alert('Please enter a valid price in rupees.');
      setActiveTab('pricing');
      return;
    }

    if (editingProduct) {
      const oldRupees = Math.round(editingProduct.price / 100);
      const newRupees = Math.round(Number(finalPrice));
      if (oldRupees !== newRupees) {
        const confirmed = confirm(
          `Confirm Price Revision:\nAre you sure you want to change the price of "${form.name}" from ₹${oldRupees.toLocaleString('en-IN')} to ₹${newRupees.toLocaleString('en-IN')}?`
        );
        if (!confirmed) return;
      }
    }

    setIsDirty(false);
    await onSave({
      ...form,
      price: finalPrice
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseAttempt();
        }
      }}
    >
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[var(--border-color)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          <div>
            <h2 className="font-serif text-xl font-bold text-[var(--gold-primary)]">
              {editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Manage product details, bullion purity specifications, images, and live pricing.
            </p>
          </div>
          <button
            onClick={handleCloseAttempt}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'basic'
                ? 'border-[var(--gold-primary)] text-[var(--gold-primary)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            1. Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-[var(--gold-primary)] text-[var(--gold-primary)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            2. Gold &amp; Purity Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'images'
                ? 'border-[var(--gold-primary)] text-[var(--gold-primary)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            3. Photos ({form.images.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'pricing'
                ? 'border-[var(--gold-primary)] text-[var(--gold-primary)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            4. Pricing &amp; Stock
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Royal Dogri 22K Gold Bridal Naman"
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                  >
                    {siteConfig.categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Dogra Heritage Collection">Dogra Heritage Collection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Collection Group
                  </label>
                  <input
                    type="text"
                    value={form.collection}
                    onChange={e => setForm({ ...form, collection: e.target.value })}
                    placeholder="e.g. Bridal, Heritage, Daily Wear"
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed description of craftsmanship, motifs, and heritage value..."
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Display Badges (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.badges.join(', ')}
                    onChange={e => setForm({ ...form, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="22K BIS, DOGRA HERITAGE, BESTSELLER"
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Available Finishes
                  </label>
                  <input
                    type="text"
                    value={form.metal_finishes.join(', ')}
                    onChange={e => setForm({ ...form, metal_finishes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Yellow Gold, Antique Gold, Rose Gold"
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  Dogra Craftsmanship Story (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.craftsmanship_story}
                  onChange={e => setForm({ ...form, craftsmanship_story: e.target.value })}
                  placeholder="Heritage narrative behind the Jammu goldsmith technique..."
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 2: JEWELLERY SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Precious Metal &amp; Purity
                  </label>
                  <select
                    value={form.purity}
                    onChange={e => setForm({ ...form, purity: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                  >
                    <option value="24K (999)">24K Solid Gold (999 Fineness)</option>
                    <option value="22K (916)">22K Solid Gold (916 Hallmarked)</option>
                    <option value="18K (750)">18K Fine Gold (750 Hallmarked)</option>
                    <option value="14K (585)">14K Everyday Gold (585)</option>
                    <option value="925 Sterling Silver">925 Sterling Silver (Chandi)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    BIS Hallmark 6-Character HUID
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={form.huid}
                    onChange={e => setForm({ ...form, huid: e.target.value.toUpperCase() })}
                    placeholder="e.g. AB12CD"
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm uppercase"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Mandatory 6-character laser inscription identifier issued by BIS Assaying Centre.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Net Metal Weight (Grams) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.1"
                    required
                    value={form.weight_grams}
                    onChange={e => setForm({ ...form, weight_grams: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 14.500"
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm font-mono"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Actual gold/silver weight (excluding stones, lac, and enamel).
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Gross Weight (Grams)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.1"
                    value={form.gross_weight_grams}
                    onChange={e => setForm({ ...form, gross_weight_grams: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 15.200"
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm font-mono"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Total piece weight on electronic scale including findings and gems.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-[var(--text-primary)]">BIS Hallmarked Piece</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">Shows BIS triangle emblem and purity stamp on product page.</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.is_hallmarked}
                  onChange={e => setForm({ ...form, is_hallmarked: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.dimensions.length_cm}
                    onChange={e => setForm({
                      ...form,
                      dimensions: { ...form.dimensions, length_cm: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-xs text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Breadth (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.dimensions.breadth_cm}
                    onChange={e => setForm({
                      ...form,
                      dimensions: { ...form.dimensions, breadth_cm: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-xs text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.dimensions.height_cm}
                    onChange={e => setForm({
                      ...form,
                      dimensions: { ...form.dimensions, height_cm: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  Sizing Variants (e.g. Ring / Bangle Sizes)
                </label>
                <input
                  type="text"
                  value={form.size_variants.join(', ')}
                  onChange={e => setForm({
                    ...form,
                    size_variants: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="10, 12, 14, 16 or 2.4, 2.6, 2.8"
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOS */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center bg-[var(--bg-primary)] hover:border-[var(--gold-primary)] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="admin-product-file-upload"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="admin-product-file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <svg className="w-10 h-10 text-[var(--gold-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium text-sm text-[var(--text-primary)]">
                    {isUploading ? 'Uploading photo to secure storage...' : 'Click to Upload Jewellery Photos'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Supports high-resolution JPG, PNG, and WebP up to 10MB
                  </p>
                </label>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-900/20 border border-red-500 text-red-300 text-xs rounded-lg">
                  {uploadError}
                </div>
              )}

              {/* URL fallback */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste an image URL directly..."
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)]"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold rounded-lg"
                >
                  Add URL
                </button>
              </div>

              {/* Gallery Grid */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Uploaded Gallery ({form.images.length} photos)
                </p>
                {form.images.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] italic">
                    No images added yet. Upload at least 1 image to show on the website.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {form.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] aspect-square flex flex-col"
                      >
                        <img
                          src={img}
                          alt={`Product thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            PRIMARY COVER
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              title="Make Primary Cover"
                              className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs"
                            >
                              ★ Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove Photo"
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PRICING & STOCK */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Select Pricing Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, pricing_mode: 'live_bullion' })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      form.pricing_mode === 'live_bullion'
                        ? 'border-[var(--gold-primary)] bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] font-semibold'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <p className="text-xs font-bold">✨ Live Bullion Formula</p>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      Auto-syncs with Jammu gold &amp; silver rates daily.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, pricing_mode: 'fixed' })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      form.pricing_mode === 'fixed'
                        ? 'border-[var(--gold-primary)] bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] font-semibold'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <p className="text-xs font-bold">🏷️ Fixed Catalog Price</p>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      Specify an exact fixed price in ₹ rupees.
                    </p>
                  </button>
                </div>
              </div>

              {editingProduct && (
                <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] flex justify-between items-center text-xs">
                  <span className="text-[var(--text-secondary)] font-medium">Current Saved Price in Catalog:</span>
                  <span className="font-mono font-bold text-sm text-[var(--gold-primary)]">
                    ₹{Math.round(editingProduct.price / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {form.pricing_mode === 'live_bullion' ? (
                <div className="space-y-4 bg-zinc-900/40 p-4 rounded-xl border border-amber-500/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                        Making Charge Type
                      </label>
                      <select
                        value={form.making_charge_type}
                        onChange={e => setForm({ ...form, making_charge_type: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm"
                      >
                        <option value="percent">Percentage (%) of Gold Value</option>
                        <option value="flat">Flat ₹ per Gram</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                        Making Charge Rate ({form.making_charge_type === 'percent' ? '%' : '₹/g'})
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={form.making_charge_rate}
                        onChange={e => setForm({ ...form, making_charge_rate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-[var(--text-primary)] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                      Gemstone / Studded Pearl Value (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.stone_value_rupees}
                      onChange={e => setForm({ ...form, stone_value_rupees: parseFloat(e.target.value) || 0 })}
                      placeholder="0 for plain gold"
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-[var(--text-primary)] text-sm"
                    />
                  </div>

                  {/* Live Formula Preview Breakdown */}
                  <div className="p-3 bg-amber-950/20 border border-amber-600/30 rounded-lg text-xs space-y-1.5 font-sans">
                    <p className="font-bold text-[var(--gold-primary)] uppercase tracking-wider">
                      Live Customer Pricing Breakdown:
                    </p>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Gold Value ({form.weight_grams}g @ ₹{activeRatePerGram.toLocaleString('en-IN')}/g):</span>
                      <span className="font-mono text-[var(--text-primary)]">₹{metalValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Making Charges ({form.making_charge_type === 'percent' ? `${form.making_charge_rate}%` : `₹${form.making_charge_rate}/g`}):</span>
                      <span className="font-mono text-[var(--text-primary)]">₹{makingCharges.toLocaleString('en-IN')}</span>
                    </div>
                    {stoneCharges > 0 && (
                      <div className="flex justify-between text-[var(--text-secondary)]">
                        <span>Stone Value:</span>
                        <span className="font-mono text-[var(--text-primary)]">₹{stoneCharges.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>3% Statutory GST (HSN 7113):</span>
                      <span className="font-mono text-[var(--text-primary)]">₹{gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-amber-500/30 font-bold text-sm text-[var(--gold-primary)]">
                      <span>Computed Customer Payable:</span>
                      <span className="font-mono text-base">₹{calculatedGrandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Fixed Price in Rupees (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 95000"
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-mono text-base"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Enter the total price inclusive of 3% GST.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    Stock Availability Status
                  </label>
                  <select
                    value={form.stock_status}
                    onChange={e => setForm({ ...form, stock_status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm"
                  >
                    <option value="in_stock">🟢 In Stock (Ready to Dispatch)</option>
                    <option value="limited">🟡 Limited Stock (1-2 pieces remaining)</option>
                    <option value="out_of_stock">🔴 Sold Out / Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-amber-600 rounded"
                    />
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Feature on Homepage Highlights
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="px-4 py-2 bg-transparent hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'pricing') setActiveTab('images');
                    else if (activeTab === 'images') setActiveTab('specs');
                    else if (activeTab === 'specs') setActiveTab('basic');
                  }}
                  className="px-3 py-2 border border-[var(--border-color)] text-xs rounded-lg hover:bg-[var(--bg-primary)]"
                >
                  ← Back
                </button>
              )}
              {activeTab !== 'pricing' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basic') setActiveTab('specs');
                    else if (activeTab === 'specs') setActiveTab('images');
                    else if (activeTab === 'images') setActiveTab('pricing');
                  }}
                  className="px-4 py-2 bg-[var(--bg-primary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold rounded-lg"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[var(--gold-primary)] hover:opacity-90 text-black font-bold rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
                >
                  {isSaving ? 'Saving Piece...' : editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

