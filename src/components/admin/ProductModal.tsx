'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@/config/siteConfig';
import type { DailyRates } from '@/types/counter';
import { Trash2, Upload, Plus, Image as ImageIcon, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';

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
  pricing_mode?: 'fixed' | 'live_bullion';
  size_variants: string[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
  editingProduct?: any | null;
  rates?: DailyRates;
  isSaving: boolean;
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  isSaving
}: ProductModalProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
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
    pricing_mode: 'fixed',
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
      setShowAdvanced(Boolean(editingProduct.huid || editingProduct.craftsmanship_story));
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
        pricing_mode: 'fixed',
        size_variants: ['Standard']
      });
      setShowAdvanced(false);
    }
    setShowUrlInput(false);
    setUrlInput('');
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
    setShowUrlInput(false);
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
      return;
    }

    const finalPrice = form.price;
    if (!finalPrice || isNaN(Number(finalPrice)) || Number(finalPrice) <= 0) {
      alert('Please enter a valid price in rupees (e.g. 85000).');
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseAttempt();
        }
      }}
    >
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[var(--border-color)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] shrink-0">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[var(--gold-primary)]">
              {editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
            </h2>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Fill in the details below. Once saved, it will immediately appear in your online shop and sync to Supabase.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseAttempt}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors text-base"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          
          {/* SECTION 1: ESSENTIAL DETAILS */}
          <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] space-y-3.5">
            <h3 className="font-semibold text-xs text-[var(--gold-primary)] uppercase tracking-wider">
              1. Basic Information &amp; Price
            </h3>

            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                Jewellery Piece Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Royal Dogri 22K Gold Bridal Jhumkas"
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-xs"
                >
                  {siteConfig.categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Dogra Heritage Collection">Dogra Heritage Collection</option>
                  <option value="Bridal Couture">Bridal Couture</option>
                  <option value="Gold Jewellery">Gold Jewellery</option>
                  <option value="Silver Jewellery">Silver Jewellery</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                  Price in Rupees (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm font-bold text-[var(--gold-primary)] font-mono">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 85000"
                    className="w-full pl-7 pr-3 py-1.5 bg-[var(--bg-surface)] border-2 border-[var(--gold-primary)]/50 focus:border-[var(--gold-primary)] rounded-lg text-[var(--text-primary)] font-mono text-sm font-bold focus:outline-none"
                  />
                </div>
                {editingProduct && (
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-mono">
                    Current Catalog Price: ₹{Math.round(editingProduct.price / 100).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: PHOTOS */}
          <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs text-[var(--gold-primary)] uppercase tracking-wider">
                2. Photographs ({form.images.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-[var(--accent-gold)] hover:underline"
              >
                {showUrlInput ? 'Cancel URL link' : '+ Paste image URL instead'}
              </button>
            </div>

            {/* URL input helper */}
            {showUrlInput && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com/jewellery-photo.jpg"
                  className="flex-1 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="px-3 py-1.5 bg-[var(--gold-primary)] text-black rounded-lg text-xs font-semibold hover:opacity-90"
                >
                  Add Link
                </button>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <label className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--gold-primary)] rounded-xl p-4 text-center cursor-pointer transition-colors block bg-[var(--bg-surface)]/60">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="w-5 h-5 text-[var(--gold-primary)]" />
                <p className="text-xs font-medium text-[var(--text-primary)]">
                  {isUploading ? 'Uploading photo...' : 'Click or drop photos from phone / computer'}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Supports JPEG, PNG, WebP up to 10MB each. First photo will be the main display cover.
                </p>
              </div>
            </label>

            {uploadError && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {uploadError}
              </p>
            )}

            {/* Uploaded Photos Grid */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                {form.images.map((imgUrl, idx) => (
                  <div key={imgUrl + idx} className="relative group rounded-lg overflow-hidden border border-[var(--border-color)] aspect-square bg-black/40">
                    <img
                      src={imgUrl}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-[var(--gold-primary)] text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Cover
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-medium"
                          title="Set as main cover"
                        >
                          Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs flex items-center justify-center"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: QUICK SPECS & STOCK */}
          <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] space-y-3.5">
            <h3 className="font-semibold text-xs text-[var(--gold-primary)] uppercase tracking-wider">
              3. Specifications &amp; Stock Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                  Gold / Metal Purity
                </label>
                <select
                  value={form.purity}
                  onChange={e => setForm({ ...form, purity: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-xs"
                >
                  <option value="22K (916)">22K (916 BIS Hallmarked)</option>
                  <option value="24K (999)">24K (999 Pure Gold)</option>
                  <option value="18K (750)">18K (750 Hallmarked)</option>
                  <option value="14K (585)">14K (585 Everyday Gold)</option>
                  <option value="925 Sterling Silver">925 Sterling Silver</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                  Weight in Grams
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={form.weight_grams}
                  onChange={e => setForm({ ...form, weight_grams: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g. 12.5"
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg font-mono text-[var(--text-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                  Stock Availability
                </label>
                <select
                  value={form.stock_status}
                  onChange={e => setForm({ ...form, stock_status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-xs"
                >
                  <option value="in_stock">In Stock (Ready to Dispatch)</option>
                  <option value="limited">Limited Stock (1-2 pieces)</option>
                  <option value="out_of_stock">Sold Out / Out of Stock</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                Description (Customer Facing)
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Handcrafted Dogra bridal piece crafted with precision, hallmarking, and royal motifs..."
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-xs"
              />
            </div>

            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  Feature this piece in &ldquo;Best Sellers / Highlights&rdquo; on the homepage
                </span>
              </label>
            </div>
          </div>

          {/* SECTION 4: ADVANCED SPECIFICATIONS (COLLAPSIBLE) */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[var(--bg-surface)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {showAdvanced ? 'Hide Additional Details' : 'More Specifications (HUID, Dimensions, Care Instructions)'}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2 py-0.5 rounded border border-[var(--border-color)]">
                  Optional
                </span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />}
            </button>

            {showAdvanced && (
              <div className="p-4 pt-1 border-t border-[var(--border-color)] space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Laser HUID Code (Hallmarking)
                    </label>
                    <input
                      type="text"
                      value={form.huid}
                      onChange={e => setForm({ ...form, huid: e.target.value.toUpperCase() })}
                      placeholder="e.g. DG916A"
                      className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg font-mono text-xs uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Gross Weight (Grams)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.gross_weight_grams}
                      onChange={e => setForm({ ...form, gross_weight_grams: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 13.0"
                      className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Length (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.dimensions.length_cm}
                      onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, length_cm: parseFloat(e.target.value) || 0 } })}
                      className="w-full px-2 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Breadth (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.dimensions.breadth_cm}
                      onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, breadth_cm: parseFloat(e.target.value) || 0 } })}
                      className="w-full px-2 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.dimensions.height_cm}
                      onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, height_cm: parseFloat(e.target.value) || 0 } })}
                      className="w-full px-2 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Display Badges (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.badges.join(', ')}
                    onChange={e => setForm({ ...form, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="22K BIS, DOGRA HERITAGE, BESTSELLER"
                    className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={form.care_instructions}
                    onChange={e => setForm({ ...form, care_instructions: e.target.value })}
                    placeholder="Store in provided velvet pouch away from perfume spray and chemicals."
                    className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sticky Modal Footer Actions */}
          <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="px-4 py-2.5 bg-transparent hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[var(--gold-primary)] text-black rounded-lg text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>Saving to Shop &amp; Supabase...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Publish Piece to Shop'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
