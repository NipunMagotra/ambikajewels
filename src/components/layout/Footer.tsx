import Link from 'next/link';
import { siteConfig } from "@/config/siteConfig";
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 pt-12 sm:pt-16 pb-28 lg:pb-16 text-on-surface">
      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop">
        
        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Column 1: Brand & Physical Showroom */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="font-headline-sm text-2xl gold-text-gradient font-bold tracking-wider block">
                {siteConfig.name}
              </span>
              <span className="font-label-caps text-[8px] text-primary tracking-[0.3em] block">
                JAMMU &bull; FINE JEWELRY
              </span>
            </Link>
            <p className="font-body-md text-xs text-on-surface-variant mb-3 whitespace-pre-line leading-relaxed">
              {siteConfig.address.replace(', ', ',\n')}
            </p>
            <p className="font-body-md text-xs text-on-surface font-semibold mb-1">
              📞 {siteConfig.contact.phone}
            </p>
            <p className="font-body-md text-xs text-on-surface font-semibold mb-4">
              ✉️ {siteConfig.contact.email}
            </p>
            <div className="text-[11px] text-on-surface-variant font-light leading-snug">
              <span className="font-semibold text-primary block text-[10px] uppercase tracking-wider mb-0.5">Showroom Timings:</span>
              {siteConfig.timings}
            </div>
          </div>
          
          {/* Column 2: Navigation & Collections */}
          <div className="col-span-1">
            <h3 className="font-label-caps text-xs text-primary mb-3.5 font-bold tracking-wider border-b border-outline-variant/20 pb-1.5">
              EXPLORE
            </h3>
            <ul className="flex flex-col gap-2.5 font-body-md text-xs text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="/">Home</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/about">About Us</Link></li>
              <li><Link className="hover:text-primary transition-colors font-medium text-amber-200" href="/collections?category=Dogra Heritage Collection">Dogra Heritage Collection</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/collections?category=Bridal Couture">Bridal Couture</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/collections?category=Gold Jewelry">22K Gold Jewelry</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/collections?category=Diamond Jewelry">Certified Diamond Jewelry</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/collections?category=Silver Jewelry (925)">925 Sterling Silver</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/collections">All Collections</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Customer Care & Tracking */}
          <div className="col-span-1">
            <h3 className="font-label-caps text-xs text-primary mb-3.5 font-bold tracking-wider border-b border-outline-variant/20 pb-1.5">
              CUSTOMER CARE
            </h3>
            <ul className="flex flex-col gap-2.5 font-body-md text-xs text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors font-semibold text-primary" href="/track">Track Order (Shiprocket)</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/contact">Contact Showroom</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/cart">Shopping Bag</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/services">3D CAD Customization</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/services">Gold Exchange Program</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/services">Old Gold Melting Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="col-span-1">
            <h3 className="font-label-caps text-xs text-primary mb-3.5 font-bold tracking-wider border-b border-outline-variant/20 pb-1.5">
              POLICIES & LEGAL
            </h3>
            <ul className="flex flex-col gap-2.5 font-body-md text-xs text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/terms">Terms & Conditions</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/refund-policy">Cancellation & Refund Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/shipping-policy">Shipping & Delivery Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/contact">Grievance Redressal</Link></li>
            </ul>
          </div>
          
          {/* Column 5: Concierge Assistance */}
          <div className="col-span-1">
            <h3 className="font-label-caps text-xs text-primary mb-3.5 font-bold tracking-wider border-b border-outline-variant/20 pb-1.5">
              JAMMU CONCIERGE
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mb-4 leading-relaxed">
              Connect directly with our showroom team for custom 3D CAD designs, hallmarking verification, or order inquiries.
            </p>
            <div className="flex flex-col gap-2.5">
              <WhatsAppButton />
              <CallButton />
            </div>
          </div>
        </div>

        {/* Statutory E-Commerce Compliance & Grievance Officer Bar */}
        <div className="border-t border-outline-variant/30 pt-6 pb-6 bg-surface-container/40 p-4 sm:p-6 rounded-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-body-md">
            <div>
              <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-wider block mb-1">
                LEGAL ENTITY & REGISTRATION
              </span>
              <p className="font-semibold text-on-surface">{siteConfig.legalBusinessName}</p>
              {siteConfig.gstin ? (
                <p className="text-on-surface-variant text-[11px]">GSTIN: {siteConfig.gstin}</p>
              ) : (
                <p className="text-on-surface-variant text-[11px]">GST: Details available on invoice</p>
              )}
              {siteConfig.pan ? (
                <p className="text-on-surface-variant text-[11px]">PAN: {siteConfig.pan}</p>
              ) : null}
              {siteConfig.bisHallmarkLicense ? (
                <p className="text-on-surface-variant text-[11px]">BIS License: {siteConfig.bisHallmarkLicense}</p>
              ) : (
                <p className="text-on-surface-variant text-[11px]">Purity: Tested & Certified Standards</p>
              )}
            </div>

            <div>
              <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-wider block mb-1">
                GRIEVANCE REDRESSAL OFFICER
              </span>
              <p className="font-semibold text-on-surface">{siteConfig.grievanceOfficer.name}</p>
              <p className="text-on-surface-variant text-[11px]">{siteConfig.grievanceOfficer.designation}</p>
              <p className="text-on-surface-variant text-[11px]">Email: <a href={`mailto:${siteConfig.grievanceOfficer.email}`} className="text-primary underline">{siteConfig.grievanceOfficer.email}</a></p>
              <p className="text-on-surface-variant text-[11px]">Phone: {siteConfig.grievanceOfficer.phone}</p>
            </div>

            <div>
              <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-wider block mb-1">
                REGISTERED SHOWROOM ADDRESS
              </span>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                {siteConfig.fullAddress}
              </p>
              <p className="text-on-surface-variant text-[11px] mt-1 font-semibold">
                HSN Code: 7113 (Articles of Precious Metal Jewelry)
              </p>
            </div>

            <div>
              <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-wider block mb-1">
                STATUTORY DISCLOSURE
              </span>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                Complies with Consumer Protection (E-Commerce) Rules, 2020.
              </p>
              <p className="text-[10px] text-amber-400 mt-1 font-medium">
                Jurisdiction: Courts of Jammu, J&K, India.
              </p>
            </div>
          </div>
        </div>

        {/* Trust, Payment, and Courier Logos */}
        <div className="border-t border-outline-variant/20 pt-6 pb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider font-semibold">PAYMENTS PROCESSED SECURELY BY RAZORPAY:</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-xs border border-outline-variant/30">
              <span>UPI (GPay / PhonePe / Paytm / BHIM)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-xs border border-outline-variant/30">
              <span>Visa &bull; Mastercard &bull; RuPay</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-xs border border-outline-variant/30">
              <span>NetBanking &bull; Wallets</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-400 text-base">lock</span>
              <span className="font-label-caps text-[10px] font-semibold text-green-400">SSL ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
              <span className="font-label-caps text-[10px] font-semibold text-primary">SHIPROCKET DELIVERY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-400 text-base">verified</span>
              <span className="font-label-caps text-[10px] font-semibold text-amber-400">VERIFIED PURITY</span>
            </div>
          </div>
        </div>
        
        {/* Map and Copyright Section */}
        <div className="grid grid-cols-12 gap-6 items-center border-t border-outline-variant/20 pt-6">
          <div className="col-span-12 lg:col-span-7 h-44 sm:h-52 bg-surface-container border border-outline-variant/30 overflow-hidden relative rounded-xs">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13414.288277259163!2d74.8304221!3d32.7715891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e84e5a95f9227%3A0xb7cf9f3238914619!2sRoop%20Nagar%2C%20Jammu%2C%20Jammu%20and%20Kashmir%20180013!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2) opacity(0.85)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ambika Jewels Showroom Location - Lower Roop Nagar, Jammu"
            />
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-2">
            <p className="font-body-md text-xs text-on-surface-variant/80 text-left lg:text-right leading-relaxed">
              © {new Date().getFullYear()} {siteConfig.legalBusinessName}. ALL RIGHTS RESERVED. <br />
              Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013.<br />
              <span className="text-[10px] text-on-surface-variant/60">
                Fine jewelry showroom operating under the jurisdiction of Jammu, Jammu & Kashmir.
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
