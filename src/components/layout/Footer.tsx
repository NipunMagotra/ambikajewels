import Link from 'next/link';
import { siteConfig } from "@/config/siteConfig";
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] border-t border-[var(--border-subtle)] pt-16 sm:pt-20 pb-24 lg:pb-16 text-[var(--text-primary)] transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Main 5-Column Editorial Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          
          {/* Column 1: Brand & Showroom Heritage */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] tracking-[0.16em] font-medium block">
                {siteConfig.name}
              </span>
              <span className="font-sans text-[7.5px] text-[var(--accent-gold)] tracking-[0.32em] block uppercase font-medium mt-1">
                JAMMU &bull; ESTD. 1998 &bull; PRIVATE SALON
              </span>
            </Link>
            <p className="font-sans text-xs text-[var(--text-secondary)] mb-4 leading-relaxed font-light">
              Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&amp;K 180013
            </p>
            <p className="font-sans text-xs text-[var(--text-primary)] font-medium mb-1">
              📞 {siteConfig.contact.phone}
            </p>
            <p className="font-sans text-xs text-[var(--text-primary)] font-medium mb-4">
              ✉️ {siteConfig.contact.email}
            </p>
            <div className="text-[11px] text-[var(--text-secondary)] font-light leading-snug">
              <span className="font-medium text-[var(--text-primary)] block text-[9.5px] uppercase tracking-wider mb-0.5">
                SHOWROOM HOURS:
              </span>
              {siteConfig.timings}
            </div>
            
            {siteConfig.social && (
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-3">
                <span className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider font-medium">FOLLOW:</span>
                {siteConfig.social.instagram && (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs font-sans font-medium"
                  >
                    Instagram
                  </a>
                )}
                {siteConfig.social.facebook && (
                  <>
                    <span className="text-[var(--border-subtle)]">&bull;</span>
                    <a
                      href={siteConfig.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs font-sans font-medium"
                    >
                      Facebook
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Column 2: Collections */}
          <div className="col-span-1">
            <h3 className="font-sans text-xs text-[var(--text-primary)] mb-4 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-2">
              COLLECTIONS
            </h3>
            <ul className="flex flex-col gap-2.5 font-sans text-xs text-[var(--text-secondary)] font-light">
              <li><Link className="hover:text-[var(--text-primary)] transition-colors font-medium text-[var(--accent-gold)]" href="/collections?category=Dogra Heritage Collection">Dogra Heritage Collection</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/collections?category=Bridal Couture">Bridal Couture Trousseaus</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/collections?category=Diamond Jewellery">Certified Diamond Solitaires</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/collections?category=Gold Jewellery">22K &amp; 18K Solid Gold</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/collections?category=Silver Jewellery (925)">925 Sterling Silver</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/collections?category=Men's Accessories">Men&apos;s Royal Ornaments</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/collections">All Showroom Pieces</Link></li>
            </ul>
          </div>
          
          {/* Column 3: The Maison & Journal */}
          <div className="col-span-1">
            <h3 className="font-sans text-xs text-[var(--text-primary)] mb-4 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-2">
              THE MAISON
            </h3>
            <ul className="flex flex-col gap-2.5 font-sans text-xs text-[var(--text-secondary)] font-light">
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/about">About Ambika Jewels</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/showroom">Jammu Flagship Showroom</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/journal">Journal &amp; Atelier Essays</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/authenticity">100% BIS Hallmark &amp; HUID</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/services">3D CAD Customization</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/services">Gold Exchange &amp; Melting</Link></li>
            </ul>
          </div>

          {/* Column 4: Client Care & Policies */}
          <div className="col-span-1">
            <h3 className="font-sans text-xs text-[var(--text-primary)] mb-4 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-2">
              CLIENT SERVICES
            </h3>
            <ul className="flex flex-col gap-2.5 font-sans text-xs text-[var(--text-secondary)] font-light">
              <li><Link className="hover:text-[var(--text-primary)] transition-colors font-medium text-[var(--text-primary)]" href="/track">Track Armored Delivery (BVC)</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/contact">Contact Salon</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/shipping-policy">Shipping &amp; Armored Transit</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/refund-policy">Inspection &amp; Refund Policy</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/exchange-policy">Exchange &amp; Buyback Terms</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/terms">Terms of Service</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/privacy-policy">Privacy Policy (DPDP)</Link></li>
              <li><Link className="hover:text-[var(--text-primary)] transition-colors" href="/seller-info">Statutory Seller KYC</Link></li>
            </ul>
          </div>
          
          {/* Column 5: Private Showroom Concierge */}
          <div className="col-span-1">
            <h3 className="font-sans text-xs text-[var(--text-primary)] mb-4 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-2">
              PRIVATE CONCIERGE
            </h3>
            <p className="font-sans text-xs text-[var(--text-secondary)] mb-4 leading-relaxed font-light">
              Connect directly with our master stylists for bespoke trousseau planning, hallmark verification, or private viewing appointments.
            </p>
            <div className="flex flex-col gap-2.5">
              <WhatsAppButton />
              <CallButton />
            </div>
          </div>
        </div>

        {/* Statutory E-Commerce Compliance & Grievance Officer Box */}
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 rounded-[1px] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-sans">
            <div>
              <span className="font-sans text-[8.5px] text-[var(--accent-gold)] uppercase font-semibold tracking-[0.2em] block mb-1.5">
                LEGAL ENTITY &amp; REGISTRATION
              </span>
              <p className="font-medium text-[var(--text-primary)]">{siteConfig.legalBusinessName}</p>
              <p className="text-[var(--text-secondary)] text-[11px] font-light">{siteConfig.legalEntityType}</p>
              <p className="text-[var(--text-secondary)] text-[11px] font-mono mt-0.5">GSTIN: {siteConfig.gstin}</p>
              <p className="text-[var(--text-secondary)] text-[11px] font-mono">PAN: {siteConfig.pan}</p>
              <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">BIS License: {siteConfig.bisHallmarkLicense}</p>
            </div>

            <div>
              <span className="font-sans text-[8.5px] text-[var(--accent-gold)] uppercase font-semibold tracking-[0.2em] block mb-1.5">
                GRIEVANCE REDRESSAL OFFICER
              </span>
              <p className="font-medium text-[var(--text-primary)]">{siteConfig.grievanceOfficer.name}</p>
              <p className="text-[var(--text-secondary)] text-[11px] font-light">{siteConfig.grievanceOfficer.designation}</p>
              <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">
                Email: <a href={`mailto:${siteConfig.grievanceOfficer.email}`} className="text-[var(--text-primary)] underline underline-offset-2">{siteConfig.grievanceOfficer.email}</a>
              </p>
              <p className="text-[var(--text-secondary)] text-[11px]">Phone: {siteConfig.grievanceOfficer.phone}</p>
              <p className="text-[var(--accent-gold)] text-[10px] mt-1 font-medium">{siteConfig.grievanceOfficer.responseTime}</p>
            </div>

            <div>
              <span className="font-sans text-[8.5px] text-[var(--accent-gold)] uppercase font-semibold tracking-[0.2em] block mb-1.5">
                REGISTERED SHOWROOM ADDRESS
              </span>
              <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed font-light">
                {siteConfig.fullAddress}
              </p>
              <p className="text-[var(--text-secondary)] text-[11px] mt-1.5 font-medium">
                HSN Code: 7113 (Articles of Precious Metal Jewellery)
              </p>
            </div>

            <div>
              <span className="font-sans text-[8.5px] text-[var(--accent-gold)] uppercase font-semibold tracking-[0.2em] block mb-1.5">
                STATUTORY DISCLOSURES
              </span>
              <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed font-light">
                Complies with Consumer Protection (E-Commerce) Rules, 2020 and Legal Metrology Regulations.
              </p>
              <p className="text-[10.5px] text-[var(--accent-gold)] mt-1.5 font-medium">
                Jurisdiction: Courts of Jammu, J&amp;K, India.
              </p>
              <Link href="/seller-info" className="inline-block mt-2 text-[11px] text-[var(--text-primary)] font-medium hover:underline underline-offset-4">
                View Full Seller KYC Portfolio &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Security Bar */}
        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <div className="flex flex-wrap items-center gap-4 text-[10.5px] font-sans">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">verified</span>
              100% BIS Hallmarked (6-Digit HUID)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">local_shipping</span>
              BVC Armored Pan-India Express
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">lock</span>
              Razorpay 256-Bit Encrypted Payments
            </span>
          </div>

          <div className="text-[10px] font-sans text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} Ambika Jewels. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
