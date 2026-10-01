import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { siteConfig } from '@/config/siteConfig';
import Link from 'next/link';

export const metadata = {
  title: 'Legal & Seller Information | Ambika Jewels',
  description: 'Statutory seller details, entity registration, GSTIN, PAN, BIS hallmark license, and Grievance Officer disclosures for Ambika Jewels.',
};

export default function SellerInfoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-on-background pt-24 sm:pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-primary font-semibold">LEGAL & SELLER INFORMATION</span>
          </div>

          {/* Page Header */}
          <div className="border-b border-outline-variant/30 pb-6 mb-8">
            <span className="font-label-caps text-xs text-primary tracking-widest uppercase block mb-1">
              STATUTORY E-COMMERCE DISCLOSURES
            </span>
            <h1 className="font-headline-lg text-3xl sm:text-4xl text-primary font-bold">
              Legal & Seller Information
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant mt-2 leading-relaxed">
              Mandatory statutory disclosures under the Consumer Protection (E-Commerce) Rules, 2020, 
              Legal Metrology (Packaged Commodities) Rules, and applicable Indian e-commerce regulations.
            </p>
          </div>

          <div className="space-y-6">
            {/* Section 1: Business Identity & Registration */}
            <div className="bg-surface-container border border-outline-variant/40 p-6 rounded-xs">
              <h2 className="font-headline-sm text-lg text-primary font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">store</span>
                1. Business Identity & Legal Entity
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body-md">
                <div className="bg-surface-container-high p-3 rounded-xs border border-outline-variant/20">
                  <dt className="text-on-surface-variant font-label-caps text-[10px] uppercase">Trade Name</dt>
                  <dd className="font-semibold text-on-surface text-sm mt-0.5">{siteConfig.name}</dd>
                </div>
                <div className="bg-surface-container-high p-3 rounded-xs border border-outline-variant/20">
                  <dt className="text-on-surface-variant font-label-caps text-[10px] uppercase">Legal Business Entity</dt>
                  <dd className="font-semibold text-on-surface text-sm mt-0.5">{siteConfig.legalBusinessName}</dd>
                </div>
                <div className="bg-surface-container-high p-3 rounded-xs border border-outline-variant/20">
                  <dt className="text-on-surface-variant font-label-caps text-[10px] uppercase">Entity Type / Structure</dt>
                  <dd className="font-semibold text-on-surface text-sm mt-0.5">{siteConfig.legalEntityType}</dd>
                </div>
                <div className="bg-surface-container-high p-3 rounded-xs border border-outline-variant/20">
                  <dt className="text-on-surface-variant font-label-caps text-[10px] uppercase">Principal Showroom Location</dt>
                  <dd className="font-semibold text-on-surface text-sm mt-0.5">Lower Roop Nagar, Jammu, J&K</dd>
                </div>
              </dl>
            </div>

            {/* Section 2: Statutory Tax & Hallmarking Licenses */}
            <div className="bg-surface-container border border-outline-variant/40 p-6 rounded-xs">
              <h2 className="font-headline-sm text-lg text-primary font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                2. Tax Identifiers & BIS Hallmarking
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-body-md">
                <div className="bg-surface-container-high p-3 rounded-xs border border-outline-variant/20">
                  <dt className="text-on-surface-variant font-label-caps text-[10px] uppercase">GSTIN (15-Digit)</dt>
                  <dd className="font-semibold text-on-surface font-mono text-sm mt-0.5">{siteConfig.gstin}</dd>
                  <span className="text-[10px] text-on-surface-variant/80 mt-1 block">HSN Code: {siteConfig.hsnCode} (Precious Metal Jewelry)</span>
                </div>
                <div className="bg-surface-container-high p-3 rounded-xs border border-outline-variant/20">
                  <dt className="text-on-surface-variant font-label-caps text-[10px] uppercase">PAN (10-Character)</dt>
                  <dd className="font-semibold text-on-surface font-mono text-sm mt-0.5">{siteConfig.pan}</dd>
                  <span className="text-[10px] text-on-surface-variant/80 mt-1 block">Income Tax Dept, Govt of India</span>
                </div>
                <div className="bg-surface-container-high p-3 rounded-xs border border-outline-variant/20">
                  <dt className="text-on-surface-variant font-label-caps text-[10px] uppercase">BIS Hallmark License</dt>
                  <dd className="font-semibold text-on-surface font-mono text-sm mt-0.5">{siteConfig.bisHallmarkLicense}</dd>
                  <span className="text-[10px] text-on-surface-variant/80 mt-1 block">Bureau of Indian Standards</span>
                </div>
              </dl>
            </div>

            {/* Section 3: Registered Office & Physical Showroom */}
            <div className="bg-surface-container border border-outline-variant/40 p-6 rounded-xs">
              <h2 className="font-headline-sm text-lg text-primary font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                3. Registered Showroom Address & Operational Contact
              </h2>
              <div className="space-y-3 text-xs font-body-md">
                <p className="text-on-surface leading-relaxed">
                  <strong>Physical & Mailing Address:</strong><br />
                  {siteConfig.fullAddress}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <span className="text-on-surface-variant block text-[10px] font-label-caps uppercase">Customer Care Phone:</span>
                    <a href={`tel:${siteConfig.contact.phone}`} className="text-primary font-semibold hover:underline">{siteConfig.contact.phone}</a>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px] font-label-caps uppercase">WhatsApp Concierge:</span>
                    <a href={`https://wa.me/${siteConfig.contact.whatsapp.replace('+', '')}`} className="text-primary font-semibold hover:underline">{siteConfig.contact.whatsapp}</a>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px] font-label-caps uppercase">Official Email:</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-primary font-semibold hover:underline">{siteConfig.contact.email}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Grievance Redressal Mechanism */}
            <div className="bg-surface-container border border-outline-variant/40 p-6 rounded-xs">
              <h2 className="font-headline-sm text-lg text-primary font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">gavel</span>
                4. Grievance Redressal Officer
              </h2>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                In compliance with Rule 4(4) and Rule 5(3)(e) of the Consumer Protection (E-Commerce) Rules, 2020, 
                any consumer complaints regarding order delivery, product quality, or customer support may be escalated to our designated Grievance Officer:
              </p>
              <div className="bg-surface-container-high p-4 rounded-xs border border-outline-variant/20 space-y-2 text-xs font-body-md">
                <p><strong>Name:</strong> {siteConfig.grievanceOfficer.name}</p>
                <p><strong>Designation:</strong> {siteConfig.grievanceOfficer.designation}</p>
                <p><strong>Official Email:</strong> <a href={`mailto:${siteConfig.grievanceOfficer.email}`} className="text-primary underline">{siteConfig.grievanceOfficer.email}</a></p>
                <p><strong>Contact Phone:</strong> {siteConfig.grievanceOfficer.phone}</p>
                <p><strong>Postal Address:</strong> {siteConfig.grievanceOfficer.address}</p>
                <div className="mt-3 pt-3 border-t border-outline-variant/30 text-primary font-medium">
                  <strong>Statutory Response Timeframe:</strong> {siteConfig.grievanceOfficer.responseTime}
                </div>
              </div>
            </div>

            {/* Section 5: Nodal Officer for Law Enforcement */}
            <div className="bg-surface-container border border-outline-variant/40 p-6 rounded-xs">
              <h2 className="font-headline-sm text-lg text-primary font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">shield</span>
                5. Nodal Contact for Law Enforcement Agencies
              </h2>
              <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                For 24x7 coordination with government authorities, cybercrime officials, and law enforcement agencies:
              </p>
              <div className="bg-surface-container-high p-4 rounded-xs border border-outline-variant/20 space-y-1 text-xs font-body-md">
                <p><strong>Nodal Officer:</strong> {siteConfig.nodalOfficer.name}</p>
                <p><strong>Designation:</strong> {siteConfig.nodalOfficer.designation}</p>
                <p><strong>Email:</strong> <a href={`mailto:${siteConfig.nodalOfficer.email}`} className="text-primary underline">{siteConfig.nodalOfficer.email}</a></p>
                <p><strong>Direct Line:</strong> {siteConfig.nodalOfficer.phone}</p>
              </div>
            </div>

            {/* Section 6: Legal Jurisdiction & Terms */}
            <div className="bg-surface-container border border-outline-variant/40 p-6 rounded-xs">
              <h2 className="font-headline-sm text-lg text-primary font-semibold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">balance</span>
                6. Governing Law & Jurisdiction
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                All transactions, sales, custom manufacturing orders, and agreements on ambikajewelsshop.com 
                shall be governed by and construed in accordance with the laws of India. Any legal dispute, 
                claim, or proceedings arising out of or in connection with this platform shall be subject to the 
                exclusive jurisdiction of the competent courts in <strong>Jammu, Jammu & Kashmir, India</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
