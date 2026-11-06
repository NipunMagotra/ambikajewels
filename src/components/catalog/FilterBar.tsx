'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { siteConfig } from '@/config/siteConfig';

interface FilterBarProps {
  gridCols?: number;
  onGridColsChange?: (cols: number) => void;
}

export default function FilterBar({ gridCols = 4, onGridColsChange }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPurity = searchParams.get('purity') || 'all';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if ((value === 'All' && key === 'category') || (value === 'all' && key === 'purity')) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/collections?${params.toString()}`);
  };

  const purities = [
    { label: 'All Purities', value: 'all' },
    { label: '22K Gold (916)', value: '22K' },
    { label: '18K Gold (750)', value: '18K' },
    { label: '14K Gold (585)', value: '14K' },
    { label: 'Certified Diamonds', value: 'Diamond' },
    { label: '925 Sterling Silver', value: '925' },
  ];

  return (
    <div className="flex flex-col gap-4 mb-8 sm:mb-10 pb-6 border-b border-[var(--border-subtle)]">
      
      {/* Categories Horizontal Track */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x scroll-smooth flex-1">
          <button
            onClick={() => updateFilters('category', 'All')}
            className={`px-3 py-1.5 text-[10.5px] font-sans tracking-[0.16em] uppercase whitespace-nowrap transition-colors cursor-pointer rounded-[1px] ${
              currentCategory === 'All'
                ? 'bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            ALL HEIRLOOMS
          </button>
          {siteConfig.categories.map((cat) => {
            const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => updateFilters('category', cat)}
                className={`px-3 py-1.5 text-[10.5px] font-sans tracking-[0.16em] uppercase whitespace-nowrap transition-colors cursor-pointer rounded-[1px] ${
                  isActive
                    ? 'bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls: Purity, Sort & Layout Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
        
        {/* Purity Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[9.5px] font-sans tracking-widest text-[var(--text-tertiary)] uppercase font-medium mr-1">
            PURITY:
          </span>
          {purities.map((p) => {
            const isActive = currentPurity.toLowerCase() === p.value.toLowerCase();
            return (
              <button
                key={p.value}
                onClick={() => updateFilters('purity', p.value)}
                className={`px-2.5 py-1 text-[10px] font-sans tracking-wider uppercase rounded-[1px] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent-gold)] text-white font-medium'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Sort & Desktop Grid View Switch */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Grid Layout Toggle (Desktop) */}
          {onGridColsChange && (
            <div className="hidden lg:flex items-center gap-1 border border-[var(--border-subtle)] p-0.5 rounded-[1px]">
              <button
                onClick={() => onGridColsChange(3)}
                className={`w-6 h-6 flex items-center justify-center transition-colors cursor-pointer ${
                  gridCols === 3 ? 'bg-[var(--text-primary)] text-[var(--bg-main)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
                title="3-Column Editorial View"
                aria-label="3-Column Editorial View"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
              </button>
              <button
                onClick={() => onGridColsChange(4)}
                className={`w-6 h-6 flex items-center justify-center transition-colors cursor-pointer ${
                  gridCols === 4 ? 'bg-[var(--text-primary)] text-[var(--bg-main)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
                title="4-Column Grid View"
                aria-label="4-Column Grid View"
              >
                <span className="material-symbols-outlined text-[16px]">apps</span>
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] font-sans tracking-widest text-[var(--text-tertiary)] uppercase font-medium">
              SORT:
            </span>
            <select
              value={currentSort}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="bg-transparent text-[var(--text-primary)] font-sans text-xs focus:outline-none cursor-pointer py-1 px-1 border-b border-[var(--border-subtle)]"
            >
              <option value="newest" className="bg-[var(--bg-card)]">Newest Arrivals</option>
              <option value="price_asc" className="bg-[var(--bg-card)]">Price: Low to High</option>
              <option value="price_desc" className="bg-[var(--bg-card)]">Price: High to Low</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
