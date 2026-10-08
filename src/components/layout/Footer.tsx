import Link from 'next/link';
import { siteConfig } from "@/config/siteConfig";
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] border-t border-[var(--border-subtle)] pt-12 sm:pt-14 pb-28 lg:pb-14 text-[var(--text-primary)] transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop">
        
        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Column 1: Brand & Showroom */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="font-serif text-2xl text-[var(--text-primary)] tracking-[0.16em] font-normal block">
                {siteConfig.name}
              </span>
              <span className="font-sans text-[7.5px] text-[var(--accent-gold)] tracking-[0.35em] block uppercase font-semibold mt-0.5">
                JAMMU &bull; ESTD. 1998 &bull; FINE JEWELLERY
              </span>
            </Link>
            <p className="font-sans text-xs text-[var(--text-secondary)] mb-3 whitespace-pre-line leading-relaxed font-light">
              {siteConfig.address.replace(', ', ',\n')}
            </p>
            <p className="font-sans text-xs text-[var(--text-primary)] font-medium mb-1">
              📞 {siteConfig.contact.phone}
            </p>
            <p className="font-sans text-xs text-[var(--text-primary)] font-medium mb-3">
              ✉️ {siteConfig.contact.email}
            </p>
            <div className="text-[11px] text-[var(--text-secondary)] font-light leading-snug">
              <span className="font-semibold text-[var(--accent-gold)] block text-[9.5px] uppercase tracking-wider mb-0.5">Showroom Timings:</span>
              {siteConfig.timings}
            </div>
          </div>
          
          {/* Column 2: Navigation & Collections */}
          <div className="col-span-1">
            <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-3 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-1.5">
              EXPLORE
            </h3>
            <ul className="flex flex-col gap-2 font-sans text-xs text-[var(--text-secondary)]">
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/">Home</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/about">About Us</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors text-[var(--text-primary)] font-medium" href="/collections?category=Dogra Heritage Collection">Dogra Heritage Collection</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections?category=Bridal Couture">Bridal Couture</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections?category=Gold Jewellery">22K Gold Jewellery</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections?category=Diamond Jewellery">Certified Diamond Jewellery</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections?category=Silver Jewellery (925)">925 Sterling Silver</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/collections">All Collections</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Customer Care & Services */}
          <div className="col-span-1">
            <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-3 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-1.5">
              CUSTOMER CARE
            </h3>
            <ul className="flex flex-col gap-2 font-sans text-xs text-[var(--text-secondary)]">
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors font-medium text-[var(--accent-gold)]" href="/track">Track Order (BVC Armored Express)</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/contact">Contact Showroom</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/cart">Shopping Bag</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/services">3D CAD Customization</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/services">Gold Exchange Program</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/services">Old Gold Melting Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Policies & Legal */}
          <div className="col-span-1">
            <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-3 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-1.5">
              POLICIES &amp; LEGAL
            </h3>
            <ul className="flex flex-col gap-2 font-sans text-xs text-[var(--text-secondary)]">
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors font-medium text-[var(--text-primary)]" href="/seller-info">Legal &amp; Seller Information</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/authenticity">Hallmark &amp; Authenticity</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/privacy-policy">Privacy Policy (DPDP)</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/refund-policy">Cancellation &amp; Refund</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/shipping-policy">Shipping &amp; Armored Delivery</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/exchange-policy">Exchange &amp; Buyback</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/custom-orders-policy">Custom Orders &amp; 3D CAD</Link></li>
              <li><Link className="hover:text-[var(--accent-gold)] transition-colors" href="/grievance-policy">Grievance Redressal</Link></li>
            </ul>
          </div>
          
          {/* Column 5: Concierge Assistance */}
          <div className="col-span-1">
            <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-3 font-semibold tracking-[0.2em] uppercase border-b border-[var(--border-subtle)] pb-1.5">
              JAMMU CONCIERGE
            </h3>
            <p className="font-sans text-xs text-[var(--text-secondary)] mb-3.5 leading-relaxed font-light">
              Connect directly with our showroom team for custom 3D CAD designs, hallmarking verification, or order inquiries.
            </p>
            <div className="flex flex-col gap-2">
              <WhatsAppButton />
              <CallButton />
            </div>
          </div>
        </div>

        {/* Statutory E-Commerce Compliance & Grievance Officer Bar */}
        <div className="border border-[var(--border-card)] pt-5 pb-5 bg-[var(--bg-surface)] p-4 sm:p-5 rounded-[2px] mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div>
              <span className="font-sans text-[8.5px] text-[var(--accent-gold)] uppercase font-bold tracking-[0.2em] block mb-1">
                LEGAL ENTITY &amp; REGISTRATION
              </span>
              <p className="font-medium text-[var(--text-primary)]">{siteConfig.legalBusinessName}</p>
              <p className="text-[var(--text-secondary)] text-[11px] truncate">{siteConfig.legalEntityType}</p>
              <p className="text-[var(--text-secondary)] text-[11px] font-mono">GSTIN: {siteConfig.gstin}</p>
              <p className="text-[var(--text-secondary)] text-[11px] font-mono">PAN: {siteConfig.pan}</p>
              <p className="text-[var(--text-secondary)] text-[11px]">BIS License: {siteConfig.bisHallmarkLicense}</p>
            </div>

            <div>
              <span className="font-sans text-[8.5px] text-[var(--accent-gold)] uppercase font-bold tracking-[0.2em] block mb-1">
                GRIEVANCE REDRESSAL OFFICER
              </span>
              <p className="font-medium text-[var(--text-primary)]">{siteConfig.grievanceOfficer.name}</p>
              <p className="text-[var(--text-secondary)] text-[11px]">{siteConfig.grievanceOfficer.designation}</p>
              <p className="text-[var(--text-secondary)] text-[11px]">Email: <a href={`mailto:${siteConfig.grievanceOfficer.email}`} className="text-[var(--accent-gold)] underline">{siteConfig.grievanceOfficer.email}</a></p>
              <p className="text-[var(--text-secondary)] text-[11px]">Phone: {siteConfig.grievanceOfficer.phone}</p>
              <p className="text-[var(--accent-gold)] text-[10px] mt-1">{siteConfig.grievanceOfficer.responseTime}</p>
            </div>

            <div>
              <span className="font-sans text-[8.5px] text-[var(--accent-gold)] uppercase font-bold tracking-[0.2em] block mb-1">
                REGISTERED SHOWROOM ADDRESS
              </span>
              <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                {siteConfig.fullAddress}
              </p>
              <p className="text-[var(--text-secondary)] text-[11px] mt-1 font-medium">
                HSN Code: 7113 (Articles of Precious Metal Jewellery)
              </p>
            </div>

            <div>
              <span className="font-sans text-[8.5px] text-[var(--accent-gold)] uppercase font-bold tracking-[0.2em] block mb-1">
                STATUTORY DISCLOSURE
              </span>
              <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                Complies with Consumer Protection (E-Commerce) Rules, 2020.
              </p>
              <p className="text-[10px] text-[var(--accent-gold)] mt-1 font-medium">
                Jurisdiction: Courts of Jammu, J&amp;K, India.
              </p>
              <Link href="/seller-info" className="inline-block mt-2 text-[11px] text-[var(--accent-gold)] font-semibold hover:underline">
                View Complete Seller Disclosures →
              </Link>
            </div>
          </div>
        </div>

        {/* Trust & Payment Logos */}
        <div className="border-t border-[var(--border-subtle)] pt-4 pb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[9px] text-[var(--text-secondary)] tracking-wider uppercase font-semibold">PAYMENTS SECURED BY RAZORPAY:</span>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] px-2.5 py-0.5 rounded-[2px] border border-[var(--border-card)]">
              <span>UPI &bull; Cards &bull; NetBanking</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-sm">lock</span>
              <span className="font-sans text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400">SSL ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[var(--accent-gold)] text-sm">local_shipping</span>
              <span className="font-sans text-[9.5px] font-semibold text-[var(--accent-gold)]">ARMORED DELIVERY</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[var(--accent-gold)] text-sm">verified</span>
              <span className="font-sans text-[9.5px] font-semibold text-[var(--accent-gold)]">BIS VERIFIED</span>
            </div>
          </div>
        </div>
        
        {/* Jammu Showroom Location & Map */}
        <div className="border-t border-[var(--border-subtle)] pt-6 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Showroom Details Card */}
            <div className="col-span-12 lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-card)] p-4 sm:p-5 rounded-[2px] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]"></span>
                  <span className="font-sans text-[10px] text-[var(--accent-gold)] tracking-[0.25em] uppercase font-semibold">
                    VISIT OUR JAMMU SHOWROOM
                  </span>
                </div>
                <h4 className="font-serif text-base sm:text-lg text-[var(--text-primary)] font-normal mb-1.5">
                  Ambika Jewels Showroom &amp; Atelier
                </h4>
                <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu &amp; Kashmir 180013, India
                </p>
                <div className="font-sans text-[11px] text-[var(--text-secondary)] space-y-1 pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[var(--accent-gold)]">schedule</span>
                    <span>Monday &ndash; Saturday: 10:00 AM &ndash; 8:00 PM | Sunday: Open</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[var(--accent-gold)]">call</span>
                    <span>+91 9682589725 &bull; +91 9086098457</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-2.5 items-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Shop+no.3,+E.W.S+colony,+Sector+1,+Lower+Roop+Nagar,+Jammu,+Jammu+%26+Kashmir+180013"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent-gold)] text-white text-[11px] font-sans font-semibold tracking-wider uppercase rounded-[2px] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  <span>GET DIRECTIONS</span>
                </a>
                <a
                  href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20visit%20the%20Ambika%20Jewels%20showroom%20in%20Jammu."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-primary)] text-[11px] font-sans font-medium tracking-wider uppercase rounded-[2px] hover:border-[var(--accent-gold)] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                  <span>BOOK APPOINTMENT</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="col-span-12 lg:col-span-7 min-h-[220px] bg-[var(--bg-surface)] border border-[var(--border-card)] overflow-hidden relative rounded-[2px] shadow-xs flex flex-col">
              <div className="bg-[var(--bg-card)]/90 backdrop-blur-xs px-3 py-1.5 border-b border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-sans text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-xs text-[var(--accent-gold)]">location_on</span>
                  Lower Roop Nagar, Jammu (180013)
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[var(--accent-gold)]">Interactive Map</span>
              </div>
              <div className="flex-1 w-full relative min-h-[180px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13414.288277259163!2d74.8304221!3d32.7715891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e84e5a95f9227%3A0xb7cf9f3238914619!2sRoop%20Nagar%2C%20Jammu%2C%20Jammu%20and%20Kashmir%20180013!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  className="border-0 opacity-90 contrast-[1.05] dark:invert dark:hue-rotate-180 dark:contrast-125 dark:opacity-85 absolute inset-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ambika Jewels Showroom Location - Lower Roop Nagar, Jammu"
                />
              </div>
            </div>
          </div>

          {/* Copyright & Statutory */}
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed font-light">
              &copy; {new Date().getFullYear()} {siteConfig.legalBusinessName}. ALL RIGHTS RESERVED. <br />
              <span className="text-[10px] text-[var(--text-secondary)]/70">
                Fine jewellery showroom operating under the jurisdiction of Jammu, Jammu &amp; Kashmir.
              </span>
            </p>
            <div className="flex items-center gap-3 text-[10px] font-sans text-[var(--text-secondary)]">
              <span>HSN: 7113</span>
              <span>&bull;</span>
              <span>BIS: HM/C-9990041009</span>
              <span>&bull;</span>
              <span>GSTIN: 01AHWPH9511N1ZX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
