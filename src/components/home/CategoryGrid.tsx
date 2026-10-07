'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export default function CategoryGrid() {
  // Mobile circular quick-access categories (from mobile homepage reference)
  const quickCategories = [
    {
      name: 'NECKLACES',
      image: '/products/royal-kundan.png',
      link: '/collections?category=Dogra Heritage Collection'
    },
    {
      name: 'EARRINGS',
      image: '/products/kundan-chandbali.png',
      link: '/collections?category=Dogra Heritage Collection'
    },
    {
      name: 'BANGLES',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=80',
      link: '/collections?category=Gold Jewellery'
    },
    {
      name: 'RINGS',
      image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=400&q=80',
      link: '/collections?category=Diamond Jewellery'
    }
  ];

  const featuredEditorial = [
    {
      name: 'Bridal Couture',
      subtitle: 'Royal Kundan & Polki Sets',
      image: '/products/royal-kundan.png',
      span: 'lg:col-span-7 h-[260px] sm:h-[340px]',
      link: '/collections?category=Bridal Couture'
    },
    {
      name: 'Dogra Heritage Collection',
      subtitle: 'Authentic 22K Dogri Jhumkis & Naman Sets',
      image: '/products/heritage-ruby-haar.png',
      span: 'lg:col-span-5 h-[260px] sm:h-[340px]',
      link: '/collections?category=Dogra Heritage Collection'
    },
    {
      name: 'Certified Diamond Jewellery',
      subtitle: 'Solitaires, Tennis Bracelets & Studs',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      span: 'lg:col-span-4 h-[220px] sm:h-[260px]',
      link: '/collections?category=Diamond Jewellery'
    },
    {
      name: '925 Sterling Silver',
      subtitle: 'Traditional Payals & Oxidized Chokers',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      span: 'lg:col-span-4 h-[220px] sm:h-[260px]',
      link: '/collections?category=Silver Jewellery (925)'
    },
    {
      name: 'Gold Heirlooms',
      subtitle: '22K & 14K Everyday Chains & Kadas',
      image: '/products/minimalist-gold-chain.png',
      span: 'lg:col-span-4 h-[220px] sm:h-[260px]',
      link: '/collections?category=Gold Jewellery'
    }
  ];

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      {/* 1. Quick Circular Icons (Signature Mobile Reference Feature) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-lg mx-auto mb-8 sm:mb-12">
        {quickCategories.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            className="flex flex-col items-center group text-center"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full p-[1.5px] bg-gradient-to-b from-[var(--accent-gold)]/60 via-[var(--accent-gold)]/20 to-transparent group-hover:from-[var(--accent-gold)] transition-all duration-300 shadow-sm">
              <div className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-surface)] relative">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
            </div>
            <span className="font-sans text-[9px] sm:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] transition-colors mt-2 uppercase">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Section Narrative Header */}
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
        <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] font-semibold uppercase block mb-1">
          THE CURATOR&apos;S SELECTION
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal">
          Explore Our Heritage Collections
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-light">
          From grand royal bridal trousseaus to daily modern essentials.
        </p>
      </div>

      {/* Featured Large Categories Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {featuredEditorial.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.link}
            className={`${cat.span} group relative overflow-hidden bg-[var(--bg-surface)] block border border-[var(--border-card)] hover:border-[var(--accent-gold)]/60 transition-all duration-300 rounded-[2px] shadow-[var(--card-shadow)]`}
          >
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${cat.image}')` }}
            />
            {/* Cinematic gradient overlay over photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex justify-between items-end">
              <div>
                <span className="font-sans text-[9px] text-[#E8CC70] tracking-[0.22em] uppercase font-semibold block mb-0.5">
                  {cat.subtitle}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-white font-normal group-hover:text-[#E8CC70] transition-colors">
                  {cat.name}
                </h3>
              </div>
              <span className="material-symbols-outlined text-[#E8CC70] text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Category Explorer Strip */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3.5 sm:p-5 rounded-[2px]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2.5">
          <span className="font-sans text-[10px] text-[var(--accent-gold)] font-semibold tracking-[0.25em] uppercase">
            ALL CATEGORIES &amp; SERVICES
          </span>
          <Link href="/collections" className="font-sans text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] tracking-wider transition-colors flex items-center gap-1">
            <span>VIEW COMPLETE CATALOG</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 touch-pan-x">
          {siteConfig.categories.map((category) => (
            <Link
              key={category}
              href={`/collections?category=${encodeURIComponent(category)}`}
              className="px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--accent-gold)] hover:text-white text-[var(--text-secondary)] font-sans text-[10px] sm:text-xs rounded-full transition-all border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] shrink-0 whitespace-nowrap flex items-center gap-1"
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
