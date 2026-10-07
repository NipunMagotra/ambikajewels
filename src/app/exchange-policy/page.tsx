import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Gold Exchange & Buyback Policy | Ambika Jewels Jammu',
  description: 'Transparent Gold Exchange and Buyback Policy for 22K/18K gold and certified diamond jewellery at Ambika Jewels Jammu showroom.',
};

export default function ExchangePolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">EXCHANGE & BUYBACK POLICY</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            {/* DRAFT FOR LAWYER REVIEW BANNER */}
            {siteConfig.features.showDraftLegalBanners && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-8 rounded-xs text-amber-300 text-xs font-semibold flex items-center gap-3">
                <span className="material-symbols-outlined text-lg shrink-0">gavel</span>
                <div>
                  <p className="font-bold uppercase tracking-wider text-[11px]">DRAFT FOR LAWYER REVIEW — Pending Legal & Tax Sign-Off</p>
                  <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">This exchange and buyback terms document is subject to CA/lawyer verification regarding GST margin scheme application (Rule 32(5)) and second-hand precious metal handling.</p>
                </div>
              </div>
            )}

            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                VALUE PRESERVATION & LIFETIME INTEGRITY
              </span>
              <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
                Exchange & Buyback Policy
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Last Updated: September 2026 | In-Store Valuation at Lower Roop Nagar, Jammu | {siteConfig.legalBusinessName}
              </p>
            </div>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  1. Principles of Precious Metal Value Preservation
                </h2>
                <p className="mb-3">
                  At <strong>{siteConfig.legalBusinessName}</strong>, we believe fine gold and natural diamonds are enduring assets passed across generations. We offer fair, transparent lifetime exchange and buyback terms for all fine jewellery purchased from our showroom or website.
                </p>
              </section>

              {/* Gold Exchange Terms */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Gold Jewellery Exchange (22K, 18K & 14K)
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs space-y-2 mb-3">
                  <p>
                    <strong>Exchange Value Calculation:</strong> Net gold weight (excluding stones, enamel, and foreign material) calculated at <strong>100% of the prevailing showroom bullion rate</strong> on the day of exchange.
                  </p>
                  <p className="text-xs">
                    Standard melting/refining deduction: 2% to 3% on Ambika Jewels hallmarked gold (5% on third-party old gold). Making charges, stone charges, and previously paid GST cannot be refunded or credited towards exchange value.
                  </p>
                  <p className="text-[11px] text-amber-300">
                    *GST Treatment Note: Confirm with CA whether second-hand gold exchange is taxable on full turnover or under the margin scheme.
                  </p>
                </div>
              </section>

              {/* Diamond Jewellery Terms */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. Diamond & Solitaire Exchange Terms
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs space-y-2">
                  <p>
                    <strong>Natural Diamond Exchange:</strong> 90% credit value of the prevailing diamond market rate against exchange for another diamond piece.
                  </p>
                  <p>
                    <strong>Cash Buyback:</strong> 80% valuation of prevailing market rate for certified natural diamonds, subject to original certification handover (SGL/IGI/GIA) and physical inspection.
                  </p>
                </div>
              </section>

              {/* In-Person Verification & Testing */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Testing & Verification Protocol
                </h2>
                <p className="mb-3">
                  All buyback and exchange transactions must be conducted in person at our physical showroom in Lower Roop Nagar, Jammu:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Non-Destructive XRF Purity Testing:</strong> Every piece is analyzed in front of the customer using calibrated laboratory XRF spectrometry to verify exact karat purity.</li>
                  <li><strong>Mandatory KYC Documents:</strong> The customer must present original government photo identification (Aadhaar / Voter ID / Passport) and PAN card for buybacks exceeding statutory thresholds.</li>
                  <li><strong>Proof of Purchase:</strong> Original tax invoice and hallmark certificate issued by Ambika Jewels must be provided.</li>
                </ul>
              </section>

              {/* Statutory Settlement Regulations */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  5. Payment Settlement & Anti-Money Laundering
                </h2>
                <p className="text-xs">
                  In strict compliance with Income Tax Act Section 269ST and PMLA guidelines, buyback disbursements above ₹10,000 are settled exclusively via account-payee NEFT/RTGS bank transfer to the registered customer&apos;s verified bank account. No cash disbursements exceeding statutory limits are permitted under any circumstances (verify with CA).
                </p>
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
