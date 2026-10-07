import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'BIS Hallmark & Authenticity Guarantee | Ambika Jewels Jammu',
  description: 'Complete guide to BIS hallmarking, 6-character alphanumeric HUID verification via BIS Care App, and certified natural diamonds at Ambika Jewels.',
};

export default function AuthenticityPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">HALLMARK & AUTHENTICITY</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            {/* DRAFT FOR LAWYER REVIEW BANNER */}
            {siteConfig.features.showDraftLegalBanners && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-8 rounded-xs text-amber-300 text-xs font-semibold flex items-center gap-3">
                <span className="material-symbols-outlined text-lg shrink-0">gavel</span>
                <div>
                  <p className="font-bold uppercase tracking-wider text-[11px]">DRAFT FOR LAWYER REVIEW — Pending Technical & Regulatory Sign-Off</p>
                  <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">Hallmarking standards outlined herein are based on the Bureau of Indian Standards (BIS) Act, 2016. Verify all legal claims and BIS license numbers with legal counsel.</p>
                </div>
              </div>
            )}

            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                GOVERNMENT-CERTIFIED PRECIOUS METAL PURITY
              </span>
              <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
                Hallmark & Authenticity Guarantee
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Last Updated: September 2026 | Bureau of Indian Standards (BIS) Assayed & Certified
              </p>
            </div>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  1. Our Purity Commitment
                </h2>
                <p className="mb-3">
                  At <strong>{siteConfig.legalBusinessName}</strong>, purity is our sacred covenant. Founded in Jammu, we craft solid gold, authentic Dogra heritage jewellery, natural diamonds, and 925 sterling silver jewellery that strictly adhere to Indian statutory quality benchmarks.
                </p>
              </section>

              {/* 3 Marks of BIS Hallmarking */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Mandatory 3 Marks of BIS Hallmarked Gold
                </h2>
                <p className="mb-3">
                  In compliance with Ministry of Consumer Affairs, Food & Public Distribution orders, every piece of gold jewellery sold by Ambika Jewels bears the official 3 mandatory laser inscriptions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs my-4">
                  <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-primary text-[10px] block font-bold mb-1">MARK 1</span>
                    <p className="font-semibold text-on-surface text-sm">BIS Triangle Logo</p>
                    <p className="text-on-surface-variant mt-1">Official crest of the Bureau of Indian Standards certifying government compliance.</p>
                  </div>
                  <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-primary text-[10px] block font-bold mb-1">MARK 2</span>
                    <p className="font-semibold text-on-surface text-sm">Purity & Karat Grade</p>
                    <p className="text-on-surface-variant mt-1">Exact fineness: <strong>22K916</strong> (91.6% pure), <strong>18K750</strong> (75.0% pure), or <strong>14K585</strong> (58.5% pure).</p>
                  </div>
                  <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-primary text-[10px] block font-bold mb-1">MARK 3</span>
                    <p className="font-semibold text-on-surface text-sm">6-Character Alphanumeric HUID</p>
                    <p className="text-on-surface-variant mt-1">A unique serialized laser inscription giving individual traceability to every single ornament.</p>
                  </div>
                </div>
              </section>

              {/* How to Verify on BIS Care App */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. How to Verify Your Jewellery on the BIS Care App
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs space-y-2 text-xs">
                  <p>Every customer can independently verify the authenticity of their purchase using the official Government of India app:</p>
                  <ol className="list-decimal pl-5 space-y-1.5">
                    <li>Download the official <strong>&quot;BIS Care&quot;</strong> mobile application from Google Play Store or Apple App Store.</li>
                    <li>Open the app and select <strong>&quot;Verify HUID&quot;</strong> on the home dashboard.</li>
                    <li>Type the 6-character alphanumeric code laser-inscribed on your jewellery and printed on your official tax invoice.</li>
                    <li>The app will display the Jeweller Registration Number, Assaying & Hallmarking Centre (AHC), Date of Hallmarking, and certified Karat Purity.</li>
                  </ol>
                </div>
              </section>

              {/* Natural Diamond Certification */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Natural Diamond Certification & Zero Synthetics
                </h2>
                <p className="mb-2 text-xs">
                  We maintain strict zero-tolerance policies regarding undisclosed lab-grown or synthetic diamonds. Every diamond piece is crafted exclusively with <strong>100% natural earth-mined diamonds</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>Individual diamond certificates issued by recognized independent gemological laboratories (SGL / IGI / GIA).</li>
                  <li>Certificate specifies the 4Cs: Color Grade (e.g. F-G / H-I), Clarity (e.g. VVS-VS), Cut Grade, and Total Carat Weight (tcw).</li>
                </ul>
              </section>

              {/* 925 Sterling Silver Guarantee */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  5. 925 Sterling Silver Standards
                </h2>
                <p className="text-xs">
                  All silver ornaments, payals, temple coins, and jewellery crafted by Ambika Jewels contain a minimum of <strong>92.5% pure silver</strong>, alloyed with fine copper for optimal structural integrity. Each piece is stamped with the standardized <code>925</code> purity mark.
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
