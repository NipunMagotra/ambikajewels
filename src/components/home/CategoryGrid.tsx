'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export default function CategoryGrid() {
  const featuredCategories = [
    {
      name: 'Bridal Couture',
      subtitle: 'Royal Kundan & Polki Sets',
      image: '/products/royal-kundan.png',
      span: 'lg:col-span-8 lg:row-span-2 h-[240px] sm:h-[320px] lg:h-full',
      link: '/collections?category=Bridal Couture'
    },
    {
      name: 'Necklaces & Chokers',
      subtitle: 'Filigree & Vintage Gold',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
      span: 'lg:col-span-4 h-[200px] sm:h-[240px]',
      link: '/collections?category=Necklaces %26 Chokers'
    },
    {
      name: 'Earrings & Jhumkas',
      subtitle: 'Chandbalis & Temple Studs',
      image: '/products/kundan-chandbali.png',
      span: 'lg:col-span-4 h-[200px] sm:h-[240px]',
      link: '/collections?category=Earrings %26 Jhumkas'
    },
    {
      name: 'Temple & Antique Gold',
      subtitle: 'Nakshi Carvings & Divine Idols',
      image: '/products/temple-lakshmi.png',
      span: 'lg:col-span-6 h-[200px] sm:h-[240px]',
      link: '/collections?category=Temple %26 Antique Gold'
    },
    {
      name: 'Bangles & Kadas',
      subtitle: 'Meenakari & Solid Gold Kadas',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      span: 'lg:col-span-6 h-[200px] sm:h-[240px]',
      link: '/collections?category=Bangles %26 Kadas'
    }
  ];

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <span className="font-label-caps text-[9px] sm:text-[10px] text-primary tracking-[0.3em] font-semibold block mb-1">
          CURATED HERITAGE SELECTIONS
        </span>
        <h3 className="font-headline-md text-2xl sm:text-3xl lg:text-4xl text-on-surface">
          Explore Our 13+ Collections
        </h3>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2">
          From grand royal bridal sets to everyday gold chains & solitaire rings.
        </p>
      </div>

      {/* Featured Large Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-5 mb-8">
        {featuredCategories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.link}
            className={`${cat.span} group relative overflow-hidden bg-surface-container block border border-outline-variant/20 hover:border-primary/50 transition-all duration-300 rounded-xs`}
          >
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${cat.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-end">
              <div>
                <span className="font-label-caps text-[9px] text-primary tracking-widest block mb-0.5">
                  {cat.subtitle}
                </span>
                <h4 className="font-headline-sm text-lg sm:text-xl text-on-surface font-semibold group-hover:text-primary transition-colors">
                  {cat.name}
                </h4>
              </div>
              <span className="material-symbols-outlined text-primary text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* All 13 Categories Quick Explorer Pills */}
      <div className="bg-surface-container/60 border border-outline-variant/20 p-4 sm:p-6 rounded-xs">
        <h4 className="font-label-caps text-xs text-primary font-semibold tracking-widest mb-3 text-center sm:text-left">
          ALL JEWELRY CATEGORIES & DESIGNS
        </h4>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {siteConfig.categories.map((category) => (
            <Link
              key={category}
              href={`/collections?category=${encodeURIComponent(category)}`}
              className="px-3.5 py-2 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface-variant font-label-caps text-[10px] sm:text-xs rounded-full transition-all border border-outline-variant/20 hover:border-primary shrink-0 flex items-center gap-1.5"
            >
              <span>{category}</span>
              <span className="material-symbols-outlined text-[10px] opacity-70">arrow_outward</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
