import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Grievance Redressal Policy | Ambika Jewels Jammu',
  description: 'Statutory Grievance Redressal Mechanism under Consumer Protection (E-Commerce) Rules, 2020 for Ambika Jewels customers.',
};

export default function GrievancePolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">GRIEVANCE REDRESSAL POLICY</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            {/* DRAFT FOR LAWYER REVIEW BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-8 rounded-xs text-amber-300 text-xs font-semibold flex items-center gap-3">
              <span className="material-symbols-outlined text-lg shrink-0">gavel</span>
              <div>
                <p className="font-bold uppercase tracking-wider text-[11px]">DRAFT FOR LAWYER REVIEW — Pending Legal & Compliance Sign-Off</p>
                <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">Statutory grievance mechanism pursuant to Consumer Protection (E-Commerce) Rules, 2020. Confirm exact escalation pathways with legal counsel.</p>
              </div>
            </div>

            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                STATUTORY CONSUMER PROTECTION COMPLIANCE
              </span>
              <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
                Grievance Redressal Policy
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Last Updated: September 2026 | Operating under Consumer Protection (E-Commerce) Rules, 2020
              </p>
            </div>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  1. Statutory Framework
                </h2>
                <p className="mb-3">
                  <strong>{siteConfig.legalBusinessName}</strong> is committed to upholding consumer trust and providing prompt, transparent resolution for any disputes or grievances arising from online orders, product quality, hallmarking verification, or delivery services.
                </p>
                <p>
                  This policy is formulated in accordance with Rule 4(4) and Rule 5(3)(e) of the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
                </p>
              </section>

              {/* Designated Grievance Officer */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Designated Grievance Redressal Officer
                </h2>
                <p className="mb-3">
                  For escalations that cannot be resolved through our standard customer care, customers may lodge a formal complaint directly with our designated officer:
                </p>
                <div className="bg-background/80 p-5 border border-outline-variant/30 rounded-xs space-y-2 text-xs">
                  <p><strong>Name of Officer:</strong> {siteConfig.grievanceOfficer.name}</p>
                  <p><strong>Designation:</strong> {siteConfig.grievanceOfficer.designation}</p>
                  <p><strong>Entity Name:</strong> {siteConfig.legalBusinessName}</p>
                  <p><strong>Physical Office:</strong> {siteConfig.grievanceOfficer.address}</p>
                  <p><strong>Official Grievance Email:</strong> <a href={`mailto:${siteConfig.grievanceOfficer.email}`} className="text-primary underline">{siteConfig.grievanceOfficer.email}</a></p>
                  <p><strong>Direct Helpline:</strong> {siteConfig.grievanceOfficer.phone}</p>
                </div>
              </section>

              {/* Timeframes */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. Statutory Timeframes for Redressal
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-background p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-primary text-[10px] block font-bold mb-1">STAGE 1: ACKNOWLEDGEMENT</span>
                    <p className="font-headline-sm text-xl font-bold text-on-surface">Within 48 Hours</p>
                    <p className="text-on-surface-variant mt-1">Every grievance receives a unique ticket reference number via email/SMS within 48 hours of receipt.</p>
                  </div>
                  <div className="bg-background p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-primary text-[10px] block font-bold mb-1">STAGE 2: FINAL RESOLUTION</span>
                    <p className="font-headline-sm text-xl font-bold text-on-surface">Within 30 Calendar Days</p>
                    <p className="text-on-surface-variant mt-1">Full investigation, physical inspection (if required), and formal resolution provided within 30 days.</p>
                  </div>
                </div>
              </section>

              {/* Escalation Pathways */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Escalation Pathways
                </h2>
                <ol className="list-decimal pl-5 space-y-2 text-xs">
                  <li><strong>Level 1 (Showroom Support):</strong> WhatsApp (+91 9086098457) or Email ({siteConfig.contact.email}) for real-time tracking, sizing, or general inquiries.</li>
                  <li><strong>Level 2 (Grievance Officer):</strong> Email to {siteConfig.grievanceOfficer.email} with order reference number if Level 1 resolution is unsatisfactory after 48 hours.</li>
                  <li><strong>Level 3 (Regulatory Recourse):</strong> If unresolved within 30 days, customers may seek assistance via the National Consumer Helpline (NCH Portal) or the competent Consumer Disputes Redressal Commission in Jammu, J&K.</li>
                </ol>
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
