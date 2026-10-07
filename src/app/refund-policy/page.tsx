import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Cancellation, Return & Refund Policy | Ambika Jewels Jammu',
  description: 'Detailed Cancellation, Return and Refund Policy for fine jewellery orders at Ambika Jewels. 7-Day return policy, original payment refund timeline of 5-7 business days, and Gold Exchange terms.',
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">CANCELLATION & REFUND POLICY</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            {/* DRAFT FOR LAWYER REVIEW BANNER */}
            {siteConfig.features.showDraftLegalBanners && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-8 rounded-xs text-amber-300 text-xs font-semibold flex items-center gap-3">
                <span className="material-symbols-outlined text-lg shrink-0">gavel</span>
                <div>
                  <p className="font-bold uppercase tracking-wider text-[11px]">DRAFT FOR LAWYER REVIEW — Pending Legal & Compliance Sign-Off</p>
                  <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">This return and refund policy is a draft subject to review by commercial legal counsel under the Consumer Protection (E-Commerce) Rules, 2020. Confirm all return windows with lawyer.</p>
                </div>
              </div>
            )}

            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                LEGAL COMPLIANCE & CUSTOMER ASSURANCE
              </span>
              <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
                Cancellation, Return & Refund Policy
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Last Updated: September 2026 | {siteConfig.legalBusinessName} &bull; Jammu, J&K
              </p>
            </div>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              
              {/* Overview */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  1. Policy Overview
                </h2>
                <p className="mb-3">
                  At <strong>{siteConfig.legalBusinessName}</strong>, we take extreme pride in crafting authentic BIS hallmarked Dogra heritage jewellery, solid 22K/18K/14K gold, certified natural diamonds, and 925 sterling silver jewellery. We want every customer to be completely satisfied with their purchase.
                </p>
                <p>
                  This policy outlines our fair and transparent rules regarding order cancellations, return eligibility, inspection processes, and refund timelines in compliance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> and applicable Indian trade laws.
                </p>
              </section>

              {/* Order Cancellation */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Order Cancellation Policy
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs mb-3 space-y-2">
                  <p>
                    <strong>Pre-Dispatch Cancellation:</strong> Customers may cancel their online order free of charge at any time <em>before the package is picked up by our logistics courier partner ({siteConfig.shipping.courierPartner})</em>.
                  </p>
                  <p>
                    To cancel before dispatch, email us at <a href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">{siteConfig.contact.email}</a> or call our showroom concierge at <strong>{siteConfig.contact.phone}</strong> with your Order Reference Number (e.g. <code>AMB-XXXXXX</code>).
                  </p>
                  <p>
                    Upon pre-dispatch cancellation, a 100% refund of the total paid amount (including taxes and shipping fees) will be initiated to your original payment method within 24 business hours.
                  </p>
                </div>
                <p className="text-xs italic text-on-surface-variant/80">
                  * Note: Once a consignment has been handed over to the courier and a Shiprocket Air Waybill (AWB) tracking number is generated, the order cannot be cancelled in transit. You may proceed with our 7-Day Return Policy upon delivery.
                </p>
              </section>

              {/* 7-Day Return Window */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. 7-Day Return & Inspection Window
                </h2>
                <p className="mb-3">
                  We provide a <strong>7-Day Return & Exchange Window</strong> for all eligible ready-stock jewellery items purchased through our website.
                </p>
                <div className="bg-background p-4 border border-outline-variant/30 rounded-xs mb-3">
                  <p className="font-semibold text-on-surface mb-1">Return Eligibility Window:</p>
                  <p className="text-xs text-on-surface-variant">
                    Return requests must be initiated within <strong>7 calendar days</strong> from the official delivery date confirmed by our logistics partner (Shiprocket / Blue Dart / Delhivery). Requests initiated after 7 calendar days cannot be accepted for refund.
                  </p>
                </div>
              </section>

              {/* Return Conditions */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Conditions for Accepting Returns
                </h2>
                <p className="mb-3">
                  To protect the integrity of precious metals and high-value jewellery, returns are strictly subject to physical verification and must meet all of the following conditions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Unworn & Unused Condition:</strong> The jewellery item must show zero signs of wear, usage, scratches, resizing, or alteration.
                  </li>
                  <li>
                    <strong>Intact Security Tag:</strong> The official tamper-evident security barcode tag attached to the jewellery piece must remain completely intact, unbroken, and attached. Removing or tampering with the tag voids the return.
                  </li>
                  <li>
                    <strong>Original Packaging & Inclusions:</strong> The return must include the original Ambika Jewels presentation box, velvet pouch, protective padding, and security bubble wrap.
                  </li>
                  <li>
                    <strong>Mandatory Documents:</strong> The original retail tax invoice (with GSTIN), official Bureau of Indian Standards (BIS) hallmark tag, and any accompanying gemstone/diamond certificate (GIA/IGI certificate card) must be returned in original condition.
                  </li>
                </ul>
              </section>

              {/* Non-Returnable Items */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  5. Non-Returnable & Excluded Items
                </h2>
                <p className="mb-3">
                  The following items cannot be returned for monetary refund:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Bespoke 3D CAD Custom Orders:</strong> Jewellery made to individual customer specifications, sketches, CAD renders, or personal photographs.
                  </li>
                  <li>
                    <strong>Personalized & Engraved Items:</strong> Rings, pendants, or kadas that have undergone custom name/date engraving or customized size changes.
                  </li>
                  <li>
                    <strong>Items Damaged by Misuse:</strong> Products damaged due to improper customer handling, chemical exposure, or unauthorized repair attempts.
                  </li>
                </ul>
                <p className="mt-2 text-xs italic text-on-surface-variant/80">
                  * Note: Ambika Jewels does not sell raw bullion or loose gold coins online. All catalog pieces are finished, wearable, hallmarked articles of fine jewellery.
                </p>
              </section>

              {/* Return Shipping & Reverse Pickup */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  6. Return Shipping & Reverse Logistics
                </h2>
                <p className="mb-3">
                  To ensure safe transit of precious cargo, return shipments are coordinated directly via <strong>Shiprocket Insured Reverse Logistics</strong>:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Contact our concierge team at <a href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">{siteConfig.contact.email}</a> with photos of the item and intact tag.</li>
                  <li>Once return eligibility is approved, an insured reverse pickup will be scheduled by our courier partner.</li>
                  <li>Package the jewellery securely in the original box with tamper-evident seals provided by the courier executive.</li>
                  <li>Retain the signed courier pickup receipt with tracking AWB until inspection is complete.</li>
                </ol>
              </section>

              {/* Refund Process & Timelines */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  7. Refund Method & Processing Timeline
                </h2>
                <p className="mb-3">
                  Once your return arrives at our physical Jammu showroom:
                </p>
                <div className="bg-background p-4 border border-outline-variant/30 rounded-xs space-y-2.5">
                  <p>
                    <strong>Quality Inspection:</strong> Our certified karigars and quality control team verify the purity, BIS hallmark, diamond authenticity, and physical condition within <strong>2 business days</strong> of receipt.
                  </p>
                  <p>
                    <strong>Payment Credit Timeline:</strong> Upon successful inspection approval, your refund is processed directly back to your <strong>original payment method via Razorpay</strong> (UPI, debit card, credit card, or net banking account).
                  </p>
                  <p>
                    <strong>Bank Settlement Window:</strong> Funds reflect in your bank account within <strong>5 to 7 working days</strong>, depending on your card issuer or banking institution's settlement cycle.
                  </p>
                  <p>
                    <strong>Exchange / Store Credit Alternative:</strong> If you prefer an immediate exchange or store credit for another design, this is credited instantly with no banking turnaround delay.
                  </p>
                </div>
              </section>

              {/* Showroom Gold Exchange Program */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  8. Showroom Gold Exchange Policy
                </h2>
                <p>
                  Apart from the 7-day return policy, Ambika Jewels provides an ongoing <strong>Gold Exchange Program</strong> at our Jammu showroom. You may bring old gold jewellery to exchange for brand-new designer pieces. Valuation is calculated strictly on the prevailing local bullion market rate on the date of exchange, based on transparent digital karigar purity testing and standard alloy melting assessments.
                </p>
              </section>

              {/* Contact & Returns Desk */}
              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">
                  9. Physical Return Address & Support Desk
                </h2>
                <p className="mb-2">All authorized physical returns must be shipped to our registered showroom:</p>
                <div className="p-4 bg-background border border-outline-variant/30 rounded-xs space-y-1">
                  <p className="font-semibold text-on-surface">{siteConfig.legalBusinessName} — Returns & Logistics Dept</p>
                  <p className="text-xs">{siteConfig.fullAddress}</p>
                  <p className="text-xs">GSTIN: {siteConfig.gstin} | PAN: {siteConfig.pan}</p>
                  <p className="text-xs">Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">{siteConfig.contact.email}</a></p>
                  <p className="text-xs">Phone: {siteConfig.contact.phone} | WhatsApp: {siteConfig.contact.whatsapp}</p>
                  <p className="text-xs">Operating Hours: {siteConfig.timings}</p>
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
