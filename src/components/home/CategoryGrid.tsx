'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export default function CategoryGrid() {
  // Circular quick-access categories with gold filigree rings
  const quickCategories = [
    {
      name: 'NAMAN & CHOKERS',
      image: '/products/royal-kundan.png',
      link: '/collections?category=Dogra Heritage Collection'
    },
    {
      name: 'DOGRI JHUMKIS',
      image: '/products/kundan-chandbali.png',
      link: '/collections?category=Dogra Heritage Collection'
    },
    {
      name: 'KADAS & BANGLES',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=80',
      link: '/collections?category=Gold Jewellery'
    },
    {
      name: 'SOLITAIRE RINGS',
      image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=400&q=80',
      link: '/collections?category=Diamond Jewellery'
    },
    {
      name: '925 STERLING PAYAL',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
      link: '/collections?category=Silver Jewellery (925)'
    }
  ];

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      {/* 1. Quick Circular Heirloom Silhouettes */}
      <div className="grid grid-cols-5 gap-2 sm:gap-6 max-w-2xl mx-auto mb-10 sm:mb-14">
        {quickCategories.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            className="flex flex-col items-center group text-center"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full p-[1.5px] bg-gradient-to-b from-[var(--accent-gold)]/70 via-[var(--accent-gold)]/20 to-transparent group-hover:from-[var(--accent-gold)] group-hover:scale-105 transition-all duration-300 shadow-xs">
              <div className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-surface)] relative border border-white/20">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-115"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
            </div>
            <span className="font-sans text-[8.5px] sm:text-[10.5px] font-semibold tracking-[0.18em] text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] transition-colors mt-2.5 uppercase leading-tight">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Section Editorial Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.35em] font-semibold uppercase block mb-1.5">
          CURATED HEIRLOOM SELECTION
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
          Discover Dogra Artistry &amp; Haute Joaillerie
        </h2>
        <div className="w-12 h-[1px] bg-[var(--accent-gold)] mx-auto my-3 opacity-60"></div>
        <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
          From royal bridal trousseaus to hallmarked 22-karat daily heirlooms, crafted at our Jammu atelier.
        </p>
      </div>

      {/* Tier 1: Two Grand Showcase Panels (Asymmetrical RHYTHM 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:gap-6">
        {/* Bridal Couture Grand Feature */}
        <Link
          href="/collections?category=Bridal Couture"
          className="lg:col-span-7 group relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-card)] hover:border-[var(--accent-gold)]/70 transition-all duration-500 rounded-[2px] shadow-[var(--card-shadow)] min-h-[300px] sm:min-h-[380px] flex flex-col justify-end p-6 sm:p-8"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
            style={{ backgroundImage: "url('/products/royal-kundan.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-1 bg-[var(--accent-burgundy)] text-white text-[9px] font-sans tracking-[0.25em] uppercase font-semibold rounded-[1px] mb-2 shadow-xs">
              RAJPUT &bull; DOGRA BRIDAL
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal group-hover:text-[#E8CC70] transition-colors leading-tight mb-2">
              Royal Bridal Couture &amp; Kundan Polki
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#EAE0D5] font-light max-w-md mb-4 hidden sm:block">
              Grand bridal chokers, mathapattis, and matching jhumkis cast in solid 22K gold with uncut polki diamonds.
            </p>
            <div className="flex items-center gap-2 text-[#E8CC70] font-sans text-xs tracking-widest uppercase font-semibold">
              <span>EXPLORE BRIDAL TROUSSEAU</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1.5">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* Dogra Heritage Collection Feature */}
        <Link
          href="/collections?category=Dogra Heritage Collection"
          className="lg:col-span-5 group relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-card)] hover:border-[var(--accent-gold)]/70 transition-all duration-500 rounded-[2px] shadow-[var(--card-shadow)] min-h-[300px] sm:min-h-[380px] flex flex-col justify-end p-6 sm:p-8"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
            style={{ backgroundImage: "url('/products/heritage-ruby-haar.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-1 bg-[var(--accent-gold)] text-black text-[9px] font-sans tracking-[0.25em] uppercase font-bold rounded-[1px] mb-2 shadow-xs">
              SIGNATURE 22K GOLD
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-[#E8CC70] transition-colors leading-tight mb-2">
              Authentic Dogra Heirlooms &amp; Naman Sets
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#EAE0D5] font-light max-w-md mb-4 hidden sm:block">
              Traditional Dogri jhumkis and filigree haar passed down through generations of Dogra nobility.
            </p>
            <div className="flex items-center gap-2 text-[#E8CC70] font-sans text-xs tracking-widest uppercase font-semibold">
              <span>VIEW DOGRA HEIRLOOMS</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1.5">arrow_forward</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Tier 2: Three Refined Collection Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 mb-8 sm:mb-10">
        {/* Pillar 1: Certified Natural Diamonds */}
        <Link
          href="/collections?category=Diamond Jewellery"
          className="group relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent-gold)]/70 transition-all duration-300 rounded-[2px] shadow-[var(--card-shadow)] p-5 flex flex-col justify-between"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface)] mb-4 rounded-[1px] relative">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80')" }}
            />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[#E8CC70] text-[8.5px] font-sans tracking-widest uppercase font-semibold rounded-[1px]">
              GIA &bull; IGI CERTIFIED
            </div>
          </div>
          <div>
            <span className="font-sans text-[9px] text-[var(--accent-gold)] tracking-[0.25em] uppercase font-semibold block mb-1">
              NATURAL SOLITAIRES
            </span>
            <h4 className="font-serif text-lg text-[var(--text-primary)] font-normal group-hover:text-[var(--accent-gold)] transition-colors">
              Certified Diamond Jewellery
            </h4>
            <p className="font-sans text-xs text-[var(--text-secondary)] mt-1 font-light">
              Solitaire rings, tennis bracelets, and diamond studs with certificate.
            </p>
          </div>
        </Link>

        {/* Pillar 2: 22K Solid Gold Everyday Classics */}
        <Link
          href="/collections?category=Gold Jewellery"
          className="group relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent-gold)]/70 transition-all duration-300 rounded-[2px] shadow-[var(--card-shadow)] p-5 flex flex-col justify-between"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface)] mb-4 rounded-[1px] relative">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
              style={{ backgroundImage: "url('/products/minimalist-gold-chain.png')" }}
            />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[#E8CC70] text-[8.5px] font-sans tracking-widest uppercase font-semibold rounded-[1px]">
              22K BIS HALLMARKED
            </div>
          </div>
          <div>
            <span className="font-sans text-[9px] text-[var(--accent-gold)] tracking-[0.25em] uppercase font-semibold block mb-1">
              DAILY ELEGANCE
            </span>
            <h4 className="font-serif text-lg text-[var(--text-primary)] font-normal group-hover:text-[var(--accent-gold)] transition-colors">
              Solid Gold Chains &amp; Heirlooms
            </h4>
            <p className="font-sans text-xs text-[var(--text-secondary)] mt-1 font-light">
              22K and 18K solid gold chains, mangalsutras, and lightweight bangles.
            </p>
          </div>
        </Link>

        {/* Pillar 3: 925 Sterling Silver */}
        <Link
          href="/collections?category=Silver Jewellery (925)"
          className="group relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent-gold)]/70 transition-all duration-300 rounded-[2px] shadow-[var(--card-shadow)] p-5 flex flex-col justify-between"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface)] mb-4 rounded-[1px] relative">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80')" }}
            />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[#E8CC70] text-[8.5px] font-sans tracking-widest uppercase font-semibold rounded-[1px]">
              925 PURITY STAMP
            </div>
          </div>
          <div>
            <span className="font-sans text-[9px] text-[var(--accent-gold)] tracking-[0.25em] uppercase font-semibold block mb-1">
              SILVER ARTISANRY
            </span>
            <h4 className="font-serif text-lg text-[var(--text-primary)] font-normal group-hover:text-[var(--accent-gold)] transition-colors">
              925 Sterling Silver Heirlooms
            </h4>
            <p className="font-sans text-xs text-[var(--text-secondary)] mt-1 font-light">
              Traditional silver payals, oxidized chokers, and silver pooja articles.
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Category Explorer Strip */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3.5 sm:p-5 rounded-[2px]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2.5">
          <span className="font-sans text-[10px] text-[var(--accent-gold)] font-semibold tracking-[0.25em] uppercase">
            ALL CATEGORIES &amp; SERVICES
          </span>
          <Link href="/collections" className="font-sans text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] tracking-wider transition-colors flex items-center gap-1 font-semibold">
            <span>VIEW COMPLETE CATALOG</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 touch-pan-x">
          {siteConfig.categories.map((category) => (
            <Link
              key={category}
              href={`/collections?category=${encodeURIComponent(category)}`}
              className="px-3.5 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--accent-gold)] hover:text-white text-[var(--text-secondary)] font-sans text-[10px] sm:text-xs rounded-full transition-all border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] shrink-0 whitespace-nowrap flex items-center gap-1 font-medium"
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
