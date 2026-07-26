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
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-6 sm:mb-stack-lg gap-3 sm:gap-4 bg-surface-container p-3 sm:p-4 rounded-xs border border-outline-variant/20">
      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-1.5 lg:pb-0 no-scrollbar touch-pan-x">
        <button 
          onClick={() => updateFilters('category', 'All')}
          className={`px-3.5 py-1.5 font-label-caps text-[10px] sm:text-xs rounded-full whitespace-nowrap transition-colors shrink-0 ${
            currentCategory === 'All' 
              ? 'bg-primary text-on-primary font-bold' 
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          All Collections
        </button>
        {siteConfig.categories.map(cat => (
          <button 
            key={cat}
            onClick={() => updateFilters('category', cat)}
            className={`px-3.5 py-1.5 font-label-caps text-[10px] sm:text-xs rounded-full whitespace-nowrap transition-colors shrink-0 ${
              currentCategory === cat 
                ? 'bg-primary text-on-primary font-bold' 
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Sort Dropdown */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-variant/20">
        <span className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant flex items-center gap-1 shrink-0">
          <span className="material-symbols-outlined text-sm">sort</span> SORT BY:
        </span>
        <select 
          value={currentSort}
          onChange={(e) => updateFilters('sort', e.target.value)}
          className="bg-surface-container-high sm:bg-transparent text-on-surface font-label-caps text-[10px] sm:text-xs focus:outline-none border border-outline-variant/30 sm:border-0 sm:border-b sm:border-outline-variant p-1.5 sm:pb-1 rounded-xs"
        >
          <option value="newest" className="bg-surface-container text-on-surface">Newest Arrivals</option>
          <option value="price_asc" className="bg-surface-container text-on-surface">Price: Low to High</option>
          <option value="price_desc" className="bg-surface-container text-on-surface">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
