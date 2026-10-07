'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockProducts } from '@/data/mockProducts';
import { searchCatalog } from '@/lib/catalogSearch';
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults(mockProducts.slice(0, 4)); // Show featured recommendations by default
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
    const matches = searchCatalog(mockProducts, query, 4);
    setResults(matches);
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2px] max-w-2xl w-full shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-subtle)] gap-3 bg-[var(--bg-surface)]">
          <span className="material-symbols-outlined text-[var(--accent-gold)] text-xl">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jewellery by name, purity (22K, 18K), Dogra heritage, diamonds..."
            className="flex-1 bg-transparent text-[var(--text-primary)] font-sans text-sm sm:text-base outline-none placeholder:text-[var(--text-secondary)]/60"
            aria-label="Search catalog"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded text-[var(--text-secondary)]">
            ESC
          </kbd>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-sans text-[var(--accent-gold)] shrink-0 font-semibold mr-1 uppercase tracking-wider">QUICK:</span>
          {['22K Gold', 'Polki Choker', 'Dogra Jhumki', 'Diamond', '925 Silver', 'Bridal'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 text-[11px] rounded-[2px] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors shrink-0 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[var(--border-subtle)] bg-[var(--bg-card)]">
          {results.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-secondary)] space-y-2">
              <span className="material-symbols-outlined text-3xl text-[var(--text-secondary)]/60">search_off</span>
              <p className="text-sm font-serif">No jewellery found matching &quot;{query}&quot;</p>
              <p className="text-xs text-[var(--text-secondary)]/70 font-sans">
                Try searching for <em>&quot;necklace&quot;, &quot;22K&quot;, &quot;jhumka&quot;,</em> or <em>&quot;polki&quot;</em>
              </p>
            </div>
          ) : (
            results.map((product, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <Link
                  key={product.id}
                  href={`/collections/${product.slug || product.id}`}
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-[2px] transition-all ${
                    isSelected ? 'bg-[var(--bg-surface)] border-l-2 border-[var(--accent-gold)]' : 'hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero-clean.png'; }}
                        className="w-12 h-12 object-cover rounded-[2px] border border-[var(--border-subtle)] shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-serif text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] font-normal">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-secondary)] font-sans">
                        <span className="text-[var(--accent-gold)] font-medium">{product.category}</span>
                        <span>&bull;</span>
                        <span>{product.purity || '22K Gold'}</span>
                        {product.badges && product.badges[0] && (
                          <span className="text-[9px] bg-[var(--bg-surface)] text-[var(--accent-gold)] border border-[var(--border-subtle)] px-1.5 py-0.2 rounded-[2px] font-semibold uppercase">
                            {product.badges[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif font-medium text-sm text-[var(--accent-gold)] block">
                      {product.display_price}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]/70 font-sans">
                      Incl. 3% GST
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-sans">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 py-0.5 bg-[var(--bg-card)] rounded border border-[var(--border-subtle)] text-[var(--text-primary)]">↑</kbd> <kbd className="px-1 py-0.5 bg-[var(--bg-card)] rounded border border-[var(--border-subtle)] text-[var(--text-primary)]">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-[var(--bg-card)] rounded border border-[var(--border-subtle)] text-[var(--text-primary)]">↵</kbd> to open</span>
          </div>
          <Link
            href="/collections"
            onClick={onClose}
            className="text-[var(--accent-gold)] hover:opacity-80 font-semibold uppercase tracking-wider transition-colors"
          >
            View All Collections &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
