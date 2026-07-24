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
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-stack-lg gap-4 bg-surface-container p-4">
      <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 custom-scrollbar">
        <button 
          onClick={() => updateFilters('category', 'All')}
          className={`px-4 py-2 font-label-caps text-label-caps rounded-full whitespace-nowrap transition-colors ${currentCategory === 'All' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'}`}
        >
          All Collections
        </button>
        {siteConfig.categories.map(cat => (
          <button 
            key={cat}
            onClick={() => updateFilters('category', cat)}
            className={`px-4 py-2 font-label-caps text-label-caps rounded-full whitespace-nowrap transition-colors ${currentCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <span className="material-symbols-outlined text-on-surface-variant">sort</span>
        <select 
          value={currentSort}
          onChange={(e) => updateFilters('sort', e.target.value)}
          className="bg-transparent text-on-surface font-label-caps text-label-caps focus:outline-none border-b border-outline-variant pb-1"
        >
          <option value="newest" className="bg-surface-container text-on-surface">Newest Arrivals</option>
          <option value="price_asc" className="bg-surface-container text-on-surface">Price: Low to High</option>
          <option value="price_desc" className="bg-surface-container text-on-surface">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
