'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeroSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  titleItalic: string;
  description: string;
  label: string;
  spec: string;
  link: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'naman',
    image: '/products/royal-dogri-naman-hd.jpg',
    tag: 'SIGNATURE HEIRLOOM • ARCHIVE 01',
    title: 'The Dogra',
    titleItalic: 'Heirloom Suite',
    description: 'Sculpted in pure 22-karat hallmarked gold with temple repousse medallions, untreated Burmese cabochon rubies, and cascading Basra seed pearls.',
    label: 'ROYAL DOGRI NAMAN',
    spec: '22K SOLID GOLD • 74.20G',
    link: '/collections/royal-dogri-naman-set',
  },
  {
    id: 'jhumki',
    image: '/products/dogri-jhumki-hd.jpg',
    tag: 'HERITAGE SILHOUETTE • ARCHIVE 02',
    title: 'The Iconic',
    titleItalic: 'Dogri Jhumki',
    description: 'The architectural umbrella silhouette of the Jammu court. Intricate openwork filigree and micro-granulation beads finished with delicate seed pearl droplets.',
    label: '22K DOGRI JHUMKI',
    spec: '22K SOLID GOLD • 15.20G',
    link: '/collections/authentic-22k-dogri-jhumki',
  },
  {
    id: 'atelier',
    image: '/craft-karigar-macro-hd.jpg',
    tag: 'HEREDITARY BENCHCRAFT • SINCE 1998',
    title: 'Generations of',
    titleItalic: 'Jammu Goldsmithing',
    description: 'At our Lower Roop Nagar atelier, master karigars shape raw 22K gold wire with precision tweezers and miniature blowpipes, preserving centuries-old Dogra techniques.',
    label: 'THE KARIGAR BENCH',
    spec: 'HAND-DRAWN WIRE FILIGREE',
    link: '/about',
  },
];

export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSlide = HERO_SLIDES[activeIdx];

  return (
    <section className="relative w-full bg-[var(--bg-main)] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Asymmetrical Salon Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Canvas: Curated Narrative & Architectural Typography (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4 lg:pt-0">
            
            {/* Salon Coordinates */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]"></span>
              <span className="font-sans text-[9px] sm:text-[9.5px] tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium">
                {activeSlide.tag}
              </span>
            </div>

            {/* Timeless Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-5.5xl text-[var(--text-primary)] font-normal leading-[1.12] tracking-tight mb-5">
              {activeSlide.title} <br />
              <span className="italic font-light text-[var(--text-secondary)]">
                {activeSlide.titleItalic}
              </span>
            </h1>

            {/* Restrained Prose (Zero Buzzwords) */}
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-md mb-8 sm:mb-10">
              {activeSlide.description}
            </p>

            {/* Architectural Underline CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mb-10 sm:mb-14">
              <Link 
                href={activeSlide.link}
                className="inline-flex items-center gap-3 text-xs font-sans tracking-[0.22em] uppercase font-medium text-[var(--text-primary)] hover:text-[var(--accent-gold)] border-b border-[var(--text-primary)] hover:border-[var(--accent-gold)] pb-1 transition-all duration-300 w-fit cursor-pointer"
              >
                <span>EXPLORE PIECE</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>

              <Link 
                href="/collections"
                className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors w-fit"
              >
                <span>VIEW COMPLETE ARCHIVE &rarr;</span>
              </Link>
            </div>

            {/* Provenance Stat Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)] text-[9.5px] font-sans">
              <div>
                <span className="text-[var(--accent-gold)] font-medium block tracking-wider">01 / BIS 916</span>
                <span className="text-[var(--text-tertiary)]">6-Digit Laser HUID</span>
              </div>
              <div>
                <span className="text-[var(--accent-gold)] font-medium block tracking-wider">02 / HERITAGE</span>
                <span className="text-[var(--text-tertiary)]">Dogra Master Karigari</span>
              </div>
              <div>
                <span className="text-[var(--accent-gold)] font-medium block tracking-wider">03 / ARMORED</span>
                <span className="text-[var(--text-tertiary)]">Pan-India BVC Transit</span>
              </div>
            </div>

          </div>

          {/* Right Canvas: Haute Joaillerie Masterpiece Showcase (7 Cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] xl:aspect-[5/4] w-full overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              
              {/* Main Crisp Jewellery Visual */}
              <img
                src={activeSlide.image}
                alt={activeSlide.label}
                key={activeSlide.id}
                className="w-full h-full object-cover transition-opacity duration-700 ease-out"
                style={{ imageRendering: 'auto' }}
              />

              {/* Museum Provenance Plaque (Bottom Left) */}
              <div className="absolute bottom-4 left-4 bg-[var(--bg-card)]/95 backdrop-blur-xs px-3.5 py-2 border border-[var(--border-subtle)]">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-primary)] block font-medium">
                  {activeSlide.label}
                </span>
                <span className="font-sans text-[8.5px] uppercase tracking-wider text-[var(--text-tertiary)] block">
                  {activeSlide.spec}
                </span>
              </div>

              {/* Interactive Exhibition Switcher (Bottom Right) */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[var(--bg-card)]/95 backdrop-blur-xs p-1.5 border border-[var(--border-subtle)]">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`View ${slide.label}`}
                    className={`px-2.5 py-1 text-[9px] font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      activeIdx === idx
                        ? 'bg-[var(--accent-gold)] text-white font-medium'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
