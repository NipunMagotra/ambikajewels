import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Terms & Conditions | Ambika Jewels Jammu',
  description: 'Terms and conditions governing online jewelry orders, BIS hallmarking standards, daily gold rate pricing policy, payments, and legal jurisdiction in Jammu, J&K.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">TERMS & CONDITIONS</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            {/* DRAFT FOR LAWYER REVIEW BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-8 rounded-xs text-amber-300 text-xs font-semibold flex items-center gap-3">
              <span className="material-symbols-outlined text-lg shrink-0">gavel</span>
              <div>
                <p className="font-bold uppercase tracking-wider text-[11px]">DRAFT FOR LAWYER REVIEW — Pending Legal Counsel Sign-Off</p>
                <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">These standard e-commerce terms of sale and bullion rate contract are drafts pending commercial legal review. Verify arbitration, force majeure, and liability clauses with lawyer.</p>
              </div>
            </div>

            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                TERMS OF SERVICE & SALE CONTRACT
              </span>
              <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
                Terms & Conditions
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Last Updated: September 2026 | Operating under the Laws of India & Courts of Jammu, J&K
              </p>
            </div>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  1. Agreement to Terms
                </h2>
                <p className="mb-3">
                  Welcome to <strong>{siteConfig.legalBusinessName}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), registered and operating from our physical showroom located at {siteConfig.fullAddress}.
                </p>
                <p>
                  By accessing our website (<Link href="/" className="text-primary underline">{siteConfig.domain}</Link>), placing an order, or utilizing our boutique services, you enter into a binding legal contract and agree to be governed by these Terms and Conditions, our <Link href="/privacy-policy" className="text-primary underline">Privacy Policy</Link>, <Link href="/shipping-policy" className="text-primary underline">Shipping Policy</Link>, and <Link href="/refund-policy" className="text-primary underline">Cancellation & Refund Policy</Link>.
                </p>
              </section>

              {/* Product Standards & BIS Hallmarking */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Product Authenticity & BIS Hallmarking Standards
                </h2>
                <p className="mb-3">
                  All jewelry offered by {siteConfig.legalBusinessName} complies with the mandatory hallmarking regulations established by the <strong>Bureau of Indian Standards (BIS)</strong> under the BIS Act, 2016:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>22K Gold (916 Purity):</strong> Solid gold crafted at 91.6% fineness, stamped with the official triangular BIS logo, purity fineness mark (22K916), and a laser-inscribed unique 6-character alphanumeric <strong>Hallmark Unique Identification (HUID)</strong>.
                  </li>
                  <li>
                    <strong>18K Gold (750 Purity) & 14K Gold (585 Purity):</strong> Hallmarked with official BIS stamps (18K750 / 14K585) and laser HUID.
                  </li>
                  <li>
                    <strong>Natural Certified Diamonds:</strong> Diamond jewelry is accompanied by third-party gemological certificates from internationally recognized laboratories (GIA / IGI) declaring color, clarity, cut, and carat weight.
                  </li>
                  <li>
                    <strong>925 Sterling Silver:</strong> Traditional Dogra and contemporary silver jewelry stamped with the official 925 fineness hallmark stamp.
                  </li>
                  <li>
                    <strong>Dogra Heritage Craftsmanship:</strong> Authentic Dogri Jhumkis, Dogri Naman, and Long Haars handcrafted by master karigars of the Jammu region.
                  </li>
                </ul>
              </section>

              {/* Pricing, Currency & Bullion Rate Fluctuation */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. Pricing, Currency & Bullion Rate Disclaimers
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs space-y-2">
                  <p>
                    All prices displayed on the website are denominated in <strong>Indian Rupees (INR - ₹)</strong>.
                  </p>
                  <p>
                    <strong>Bullion Rate Fluctuations:</strong> Due to continuous international and domestic market fluctuations in precious metal rates (gold and silver), catalog prices are subject to periodic recalculation. Once an order is paid and confirmed via Razorpay, the transaction price is locked and will not be adjusted for subsequent market increases or decreases.
                  </p>
                  <p>
                    <strong>Statutory Goods and Services Tax (GST):</strong> In accordance with Indian tax laws, fine precious metal jewelry (HSN Code 7113) attracts a mandatory statutory GST of <strong>3%</strong>, which is transparently itemized on your checkout review screen and tax invoice.
                  </p>
                </div>
              </section>

              {/* Payment Processing */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Payment Processing via Razorpay
                </h2>
                <p className="mb-3">
                  Online payments are processed through <strong>Razorpay</strong>, supporting:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Unified Payments Interface (UPI): Google Pay, PhonePe, Paytm, BHIM, and bank UPI apps.</li>
                  <li>Credit & Debit Cards: Visa, MasterCard, RuPay, and American Express issued by Indian and international banks.</li>
                  <li>Net Banking across 50+ major Indian banking institutions.</li>
                </ul>
                <p className="mt-3">
                  We reserve the right to cancel any order if the payment verification fails, or if payment gateway fraud prevention filters flag unauthorized or suspicious activity.
                </p>
              </section>

              {/* PAN Card Mandatory Disclosure */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  5. Mandatory PAN Card Requirement (&gt; ₹2,00,000)
                </h2>
                <p>
                  Pursuant to <strong>Section 139A and Rule 114B of the Indian Income Tax Rules, 1962</strong>, every customer purchasing jewelry worth more than <strong>₹2,00,000 (Two Lakh Rupees)</strong> in a single transaction must provide their valid Permanent Account Number (PAN). Checkout will not proceed without this mandatory statutory disclosure.
                </p>
              </section>

              {/* Bespoke 3D CAD Orders */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  6. Bespoke 3D CAD Design & Customization
                </h2>
                <p className="mb-2">
                  When requesting custom jewelry through WhatsApp (+91 9086098457) or sketch submission:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>A 3D CAD digital rendering is provided for customer review within 48 hours.</li>
                  <li>Physical casting and stone setting begin only after formal customer approval of the CAD preview and receipt of an agreed advance deposit.</li>
                  <li>Custom-crafted bespoke pieces are non-refundable once metal casting has commenced.</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  7. Intellectual Property Rights
                </h2>
                <p>
                  All proprietary designs, photographs, traditional Dogra jewelry motifs, brand logos, website content, and text appearing on this site are the exclusive intellectual property of <strong>{siteConfig.legalBusinessName}</strong> and are protected under Indian Copyright and Trademark laws. Unauthorized reproduction or commercial use is strictly prohibited.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  8. Limitation of Liability & Force Majeure
                </h2>
                <p>
                  {siteConfig.legalBusinessName} shall not be liable for delayed shipments caused by acts of God, extreme weather events, civil disturbances, strikes, courier network disruptions, or regulatory border checks beyond our reasonable control. In all cases, our maximum aggregate liability shall be strictly limited to the actual purchase price paid by the customer for the specific product in dispute.
                </p>
              </section>

              {/* Governing Law & Dispute Resolution */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  9. Governing Law & Legal Jurisdiction
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs">
                  <p className="leading-relaxed">
                    These Terms and Conditions and all contracts of sale entered into through this website shall be governed by, interpreted, and construed in accordance with the <strong>laws of the Republic of India</strong>.
                  </p>
                  <p className="text-amber-400 font-semibold mt-2">
                    Any legal claims, suits, or proceedings arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Jammu, Jammu & Kashmir, India</strong>.
                  </p>
                </div>
              </section>

              {/* Contact & Legal Notices */}
              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">
                  10. Contact for Legal Notices
                </h2>
                <p className="mb-2">For formal notices or inquiries regarding these Terms & Conditions:</p>
                <div className="p-4 bg-background border border-outline-variant/30 rounded-xs space-y-1">
                  <p className="font-semibold text-on-surface">{siteConfig.legalBusinessName} — Legal & Compliance Desk</p>
                  <p className="text-xs">Address: {siteConfig.fullAddress}</p>
                  <p className="text-xs">GSTIN: {siteConfig.gstin} | PAN: {siteConfig.pan}</p>
                  <p className="text-xs">Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">{siteConfig.contact.email}</a></p>
                  <p className="text-xs">Phone: {siteConfig.contact.phone}</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
