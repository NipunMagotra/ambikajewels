'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { siteConfig } from '@/config/siteConfig';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'newest';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'All' && key === 'category') {
      params.delete('category');
    } else {
      params.set(key, value);
    }
    router.push(`/collections?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-4 sm:mb-6 gap-3 sm:gap-4 bg-[var(--bg-surface)] p-3 sm:p-3.5 rounded-[2px] border border-[var(--border-subtle)] shadow-[var(--card-shadow)]">
      {/* Category Pills Slider - Horizontally scrollable without text clipping */}
      <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 no-scrollbar touch-pan-x scroll-smooth">
        <button 
          onClick={() => updateFilters('category', 'All')}
          className={`px-3.5 py-1.5 font-sans text-[11px] sm:text-xs rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer uppercase tracking-wider ${
            currentCategory === 'All' 
              ? 'bg-[var(--accent-gold)] text-white font-semibold shadow-xs' 
              : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] border border-[var(--border-subtle)]'
          }`}
        >
          All Collections
        </button>
        {siteConfig.categories.map(cat => {
          const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button 
              key={cat}
              onClick={() => updateFilters('category', cat)}
              className={`px-3.5 py-1.5 font-sans text-[11px] sm:text-xs rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer uppercase tracking-wider ${
                isActive 
                  ? 'bg-[var(--accent-gold)] text-white font-semibold shadow-xs' 
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] border border-[var(--border-subtle)]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
      
      {/* Compact, Aligned Sort Dropdown */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto pt-2.5 lg:pt-0 border-t lg:border-t-0 border-[var(--border-subtle)] shrink-0">
        <span className="font-sans text-[10px] sm:text-xs text-[var(--text-secondary)] flex items-center gap-1 shrink-0 uppercase tracking-wider font-semibold">
          <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">sort</span> SORT BY:
        </span>
        <select 
          value={currentSort}
          onChange={(e) => updateFilters('sort', e.target.value)}
          className="bg-[var(--bg-card)] text-[var(--text-primary)] font-sans text-[11px] sm:text-xs focus:outline-none focus:border-[var(--accent-gold)] border border-[var(--border-card)] px-2.5 py-1.5 rounded-[2px] cursor-pointer"
        >
          <option value="newest" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Newest Arrivals</option>
          <option value="price_asc" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Price: Low to High</option>
          <option value="price_desc" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
