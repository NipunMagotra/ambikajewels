import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Custom Orders & 3D CAD Policy | Ambika Jewels Jammu',
  description: 'Terms and design milestones for bespoke bridal jewellery, 3D CAD rendering approvals, advance deposits, and casting tolerances at Ambika Jewels.',
};

export default function CustomOrdersPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">CUSTOM ORDERS POLICY</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            {/* DRAFT FOR LAWYER REVIEW BANNER */}
            {siteConfig.features.showDraftLegalBanners && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-8 rounded-xs text-amber-300 text-xs font-semibold flex items-center gap-3">
                <span className="material-symbols-outlined text-lg shrink-0">gavel</span>
                <div>
                  <p className="font-bold uppercase tracking-wider text-[11px]">DRAFT FOR LAWYER REVIEW — Pending Legal & Compliance Sign-Off</p>
                  <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">This bespoke crafting policy outlines custom manufacturing milestones. Verify all advance-deposit forfeiture clauses with legal counsel under Indian Contract Act.</p>
                </div>
              </div>
            )}

            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                BESPOKE ATELIER & 3D CAD CRAFTSMANSHIP
              </span>
              <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
                Custom Orders & 3D CAD Policy
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Last Updated: September 2026 | {siteConfig.legalBusinessName} &bull; Jammu, J&K
              </p>
            </div>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  1. Bespoke Customisation Process
                </h2>
                <p className="mb-3">
                  At <strong>{siteConfig.legalBusinessName}</strong>, we offer personalized 3D Computer-Aided Design (CAD) modeling for bridal chokers, Dogra heritage heirlooms, solitaire engagement rings, and bespoke ornaments. Every custom piece undergoes rigorous craftsmanship and BIS hallmarking.
                </p>
              </section>

              {/* Design Approval & Milestones */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Design Milestones & Approval Protocol
                </h2>
                <ol className="list-decimal pl-5 space-y-2 text-xs">
                  <li><strong>Concept Consultation:</strong> Customer provides reference sketches, dimensions, or selects heritage motifs with our jewellery designers.</li>
                  <li><strong>3D CAD Renders:</strong> A detailed photorealistic 3D render is shared via WhatsApp or email displaying precise millimeter dimensions and stone settings.</li>
                  <li><strong>Formal Customer Sign-Off:</strong> Production commences only after explicit written approval of the 3D CAD render by the customer.</li>
                  <li><strong>Lost-Wax Casting & Hallmarking:</strong> The wax model is cast into solid gold, hand-set with certified stones, hand-polished, and submitted to the BIS assaying center for HUID laser engraving.</li>
                </ol>
              </section>

              {/* Advance Booking & Non-Refundability */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. Advance Booking Deposit & Cancellation Terms
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs space-y-2 text-xs">
                  <p>
                    <strong>Advance Deposit:</strong> A minimum advance booking deposit of <strong>25% to 50%</strong> of the estimated piece value is required prior to commencing 3D CAD design and wax mold fabrication.
                  </p>
                  <p>
                    <strong>Non-Refundable Clause:</strong> Once the 3D CAD render has received customer sign-off and precious metal casting has begun, the advance deposit is strictly non-refundable to cover precious metal allocation, specialized CAD design labor, and assaying costs.
                  </p>
                  <p className="text-amber-300">
                    *Custom pieces tailored to specific ring sizes, engraved initials, or unique measurements are exempt from standard 7-day e-commerce return windows under Consumer Protection Rules (verify with lawyer).
                  </p>
                </div>
              </section>

              {/* Weight Tolerances */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Handcrafted Weight Tolerances & Final Reconciliation
                </h2>
                <p className="text-xs mb-2">
                  Due to the handcrafted nature of lost-wax casting and hand-finishing, the final finished weight of a custom gold piece may vary by <strong>±5% to 8%</strong> from the initial CAD estimate:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>If final piece weight is <strong>less</strong> than estimated: The difference is credited back to the customer on the final tax invoice.</li>
                  <li>If final piece weight is <strong>more</strong> than estimated: The customer pays the additional net metal weight at the locked bullion rate established upon order placement.</li>
                </ul>
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
