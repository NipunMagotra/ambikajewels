'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProducts } from '@/data/mockProducts';
import { searchCatalog } from '@/lib/catalogSearch';
import { siteConfig } from '@/config/siteConfig';
import type { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [catalog, setCatalog] = useState<Product[]>(mockProducts);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus input and load catalog when opened
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 60);
    setQuery('');
    if (isSupabaseConfigured) {
      supabase.from('products').select('*').then(({ data }) => {
        if (data && data.length > 0) {
          setCatalog(data as Product[]);
        } else {
          setCatalog(mockProducts);
        }
      });
    } else {
      setCatalog(mockProducts);
    }
  }, [isOpen]);

  // Global keydown: ESC to close, Up/Down to navigate, Enter to select
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        const selected = results[selectedIndex];
        router.push(`/collections/${selected.slug || selected.id}`);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  // Real-time search filter
  useEffect(() => {
    setResults(searchCatalog(catalog, query, 6));
    setSelectedIndex(0);
  }, [query, catalog]);

  if (!isOpen) return null;

  const quickPicks = ['Dogri Jhumki', '22K Gold', 'Bridal Choker', 'Solitaire', 'Silver Payal'];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[1px] max-w-2xl w-full shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-4 border-b border-[var(--border-subtle)] gap-3 bg-[var(--bg-surface)]">
          <span className="material-symbols-outlined text-[var(--text-tertiary)] text-xl">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jewellery by silhouette, 22K gold, Dogra heritage, diamonds..."
            className="flex-1 bg-transparent text-[var(--text-primary)] font-sans text-sm sm:text-base outline-none placeholder:text-[var(--text-tertiary)]"
            aria-label="Search catalog"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 text-xs uppercase tracking-wider"
            >
              CLEAR
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9.5px] font-mono text-[var(--text-tertiary)] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[1px]">
              ESC
            </kbd>
          )}
        </div>

        {/* Quick Suggestion Chips (When query is empty) */}
        {!query && (
          <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)]">
            <span className="text-[9.5px] font-sans tracking-[0.24em] uppercase text-[var(--text-tertiary)] block mb-2 font-medium">
              CURATED SEARCHES
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPicks.map((pick) => (
                <button
                  key={pick}
                  onClick={() => setQuery(pick)}
                  className="px-3 py-1 bg-[var(--bg-surface)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-main)] text-[var(--text-secondary)] text-[11px] font-sans tracking-wider uppercase rounded-[1px] transition-colors cursor-pointer"
                >
                  {pick}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--border-subtle)]">
          {results.length > 0 ? (
            results.map((product, idx) => (
              <Link
                key={product.id}
                href={`/collections/${product.slug || product.id}`}
                onClick={onClose}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-4 transition-colors ${
                  selectedIndex === idx
                    ? 'bg-[var(--bg-surface)]'
                    : 'hover:bg-[var(--bg-surface)]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-14 shrink-0 overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <img
                      src={product.images?.[0] || '/hero-clean.png'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-sans uppercase tracking-widest text-[var(--accent-gold)] block">
                      {product.category}
                    </span>
                    <h4 className="font-serif text-sm sm:text-base text-[var(--text-primary)] line-clamp-1 font-normal">
                      {product.name}
                    </h4>
                    <span className="text-[10px] font-sans text-[var(--text-tertiary)]">
                      {product.purity || '22K Gold'} &bull; {product.weight_grams}g
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-sans text-xs sm:text-sm font-medium text-[var(--text-primary)] block">
                    {product.display_price || `₹${Math.round(product.price / 100).toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-[9px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider">
                    INSPECT &rarr;
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-sans text-[var(--text-secondary)]">
              No matching jewellery found for &ldquo;{query}&rdquo;.
              <div className="mt-2">
                <Link
                  href="/collections"
                  onClick={onClose}
                  className="text-[var(--accent-gold)] underline underline-offset-4"
                >
                  Browse all collections &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-sans text-[var(--text-tertiary)]">
          <span>Use ↑↓ arrows to navigate, Enter to select</span>
          <Link href="/collections" onClick={onClose} className="hover:text-[var(--text-primary)] uppercase tracking-wider">
            VIEW COMPLETE ATELIER ARCHIVE &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
