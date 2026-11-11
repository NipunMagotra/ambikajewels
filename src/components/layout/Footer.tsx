import Link from 'next/link';
import { siteConfig } from "@/config/siteConfig";
import NewsletterSignup from './NewsletterSignup';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Lock, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] border-t border-[var(--border-subtle)] pt-12 sm:pt-14 pb-28 lg:pb-12 text-[var(--text-primary)] transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-7xl">
        
        {/* Ambika Privé Newsletter Subscription */}
        <NewsletterSignup />

        {/* Clean 4-Column Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 pt-2">
          
          {/* Column 1: Brand & Atelier */}
          <div className="space-y-3.5">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl text-[var(--text-primary)] tracking-[0.16em] font-normal block">
                {siteConfig.name}
              </span>
              <span className="font-sans text-[8px] text-[var(--accent-gold)] tracking-[0.3em] block uppercase font-semibold mt-0.5">
                JAMMU &bull; ESTD. 1998 &bull; FINE JEWELLERY
              </span>
            </Link>
            
            <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed font-light">
              Lower Roop Nagar, Sector 1, Jammu, J&amp;K 180013, India
            </p>

            <div className="space-y-1.5 text-xs text-[var(--text-secondary)] font-light">
              <a 
                href={`tel:${siteConfig.contact.phone}`} 
                className="flex items-center gap-2 hover:text-[var(--accent-gold)] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                <span className="font-mono text-xs">{siteConfig.contact.phone}</span>
              </a>
              <a 
                href={`mailto:${siteConfig.contact.email}`} 
                className="flex items-center gap-2 hover:text-[var(--accent-gold)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                <span className="text-xs truncate">{siteConfig.contact.email}</span>
              </a>
            </div>

            <div className="pt-2">
              <Link
                href="/showroom"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[var(--accent-gold)] hover:underline group"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Visit Showroom &amp; Map</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Column 2: Collections */}
          <div>
            <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-3.5 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-1.5">
              COLLECTIONS
            </h3>
            <ul className="flex flex-col gap-2.5 font-sans text-xs text-[var(--text-secondary)]">
              <li>
                <Link className="hover:text-[var(--accent-gold)] transition-colors font-medium text-[var(--text-primary)]" href="/collections?category=Dogra%20Heritage%20Collection">
                  Dogra Heritage Collection
                </Link>
              </li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections?category=Bridal%20Couture">Bridal Couture</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections?category=Gold%20Jewellery">22K Gold Jewellery</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections?category=Diamond%20Jewellery">Certified Diamonds</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections?category=Silver%20Jewellery%20(925)">925 Sterling Silver</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections">View All Pieces</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Customer Care & Services */}
          <div>
            <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-3.5 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-1.5">
              CUSTOMER CARE
            </h3>
            <ul className="flex flex-col gap-2.5 font-sans text-xs text-[var(--text-secondary)]">
              <li>
                <Link className="hover:text-[var(--accent-gold)] transition-colors font-medium text-[var(--accent-gold)]" href="/track">
                  Track Order (BVC Armored)
                </Link>
              </li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/contact">Contact Showroom</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/services">Bespoke Concierge</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/services">Gold Exchange Program</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/cart">Shopping Bag</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/wishlist">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div>
            <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-3.5 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-1.5">
              POLICIES &amp; LEGAL
            </h3>
            <ul className="flex flex-col gap-2.5 font-sans text-xs text-[var(--text-secondary)]">
              <li>
                <Link className="hover:text-[var(--accent-gold)] transition-colors font-medium text-[var(--text-primary)]" href="/showroom">
                  Showroom &amp; Disclosures
                </Link>
              </li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/seller-info">Legal &amp; Seller Information</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/authenticity">Hallmark &amp; Authenticity</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/shipping-policy">Shipping &amp; Delivery</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/refund-policy">Cancellation &amp; Refund</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/privacy-policy">Privacy Policy (DPDP)</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/terms">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust & Secure Payment Bar */}
        <div className="border-t border-[var(--border-subtle)] pt-4 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[9px] text-[var(--text-secondary)] tracking-wider uppercase font-semibold">
              PAYMENTS SECURED BY RAZORPAY:
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] px-2.5 py-0.5 rounded-[2px] border border-[var(--border-card)]">
              <span>UPI &bull; Cards &bull; NetBanking</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-sans text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider">
                SSL ENCRYPTED
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span className="font-sans text-[9.5px] font-semibold text-[var(--accent-gold)] tracking-wider">
                ARMORED TRANSIT
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span className="font-sans text-[9.5px] font-semibold text-[var(--accent-gold)] tracking-wider">
                BIS VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Statutory Bar */}
        <div className="border-t border-[var(--border-subtle)] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed font-light">
            &copy; {new Date().getFullYear()} {siteConfig.legalBusinessName}. ALL RIGHTS RESERVED. <br className="sm:hidden" />
            <span className="text-[10px] text-[var(--text-secondary)]/70 sm:ml-1">
              Fine jewellery showroom, Jammu, J&amp;K.
            </span>
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-[10px] font-sans text-[var(--text-secondary)]">
            <span>HSN: 7113</span>
            <span>&bull;</span>
            <span>BIS: {siteConfig.bisHallmarkLicense}</span>
            <span>&bull;</span>
            <span>GSTIN: {siteConfig.gstin}</span>
            <span>&bull;</span>
            <Link href="/admin" className="hover:text-[var(--accent-gold)] transition-colors underline font-medium">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
