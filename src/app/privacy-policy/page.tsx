import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Privacy Policy | Ambika Jewels Jammu',
  description: 'DPDP Act 2023 compliant privacy policy detailing data processors (Supabase, Razorpay, BVC Logistics, Groq, hosting), cross-border transfers, and retention policies.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">PRIVACY POLICY</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            {/* DRAFT FOR LAWYER REVIEW BANNER */}
            {siteConfig.features.showDraftLegalBanners && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-8 rounded-xs text-amber-300 text-xs font-semibold flex items-center gap-3">
                <span className="material-symbols-outlined text-lg shrink-0">gavel</span>
                <div>
                  <p className="font-bold uppercase tracking-wider text-[11px]">DRAFT FOR LAWYER REVIEW — Pending Legal & Compliance Sign-Off</p>
                  <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">This privacy policy drafts DPDP Act 2023 compliance terms. Verify all third-party data processing agreements and cross-border transfer mechanisms with legal counsel.</p>
                </div>
              </div>
            )}

            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                DATA PROTECTION & PRIVACY COMPLIANCE
              </span>
              <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
                Privacy Policy
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Last Updated: September 2026 | Compliant with IT Act 2000 & DPDP Act 2023 | {siteConfig.legalBusinessName}
              </p>
            </div>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  1. Introduction & Scope
                </h2>
                <p className="mb-3">
                  <strong>{siteConfig.legalBusinessName}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to honoring and protecting the privacy of our customers and visitors. We operate our flagship fine jewellery showroom and online store from {siteConfig.fullAddress}.
                </p>
                <p>
                  This Privacy Policy describes our practices regarding the collection, storage, processing, and disclosure of personal data collected through our website (<Link href="/" className="text-primary underline font-medium">{siteConfig.domain}</Link>) in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, and applicable Indian data protection frameworks.
                </p>
              </section>

              {/* Information Collected */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Personal Information We Collect
                </h2>
                <p className="mb-3">
                  We collect information necessary to fulfill luxury fine jewellery purchases, provide concierge support, and comply with Indian statutory requirements:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Identity & Contact Information:</strong> Full name, verified mobile phone number, email address, and delivery destination.</li>
                  <li><strong>Statutory Tax Identifiers (CBDT Rule 114B):</strong> Permanent Account Number (PAN) or Form 60 declaration where mandated by Indian tax law for transactions meeting statutory thresholds. PAN data is encrypted using AES-256-GCM.</li>
                  <li><strong>Transactional Records:</strong> Purchased jewellery items, purity specifications (e.g. 22K 916 BIS Hallmarked), gross/net weight in grams, GST tax invoice numbers, and payment transaction IDs.</li>
                  <li><strong>Technical & Session Data:</strong> Masked IP address, device telemetry, and essential browser storage required for cart persistence and rate-limiting defenses.</li>
                </ul>
              </section>

              {/* Authorized Third-Party Data Processors */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. Authorized Third-Party Data Processors
                </h2>
                <p className="mb-3">
                  We do not sell, rent, lease, or monetize your personal information. Data is shared exclusively with verified data processors strictly necessary for executing our e-commerce operations:
                </p>
                <div className="space-y-3">
                  <div className="bg-background/80 p-3.5 border border-outline-variant/30 rounded-xs">
                    <p className="font-semibold text-on-surface">1. Supabase Inc. (Database & Cloud Infrastructure)</p>
                    <p className="text-xs mt-1">Role: Secure storage of customer orders, product catalogs, and encrypted records. Hosted in AWS Asia-Pacific (Mumbai, ap-south-1) region with strict Row Level Security (RLS) policies.</p>
                  </div>
                  <div className="bg-background/80 p-3.5 border border-outline-variant/30 rounded-xs">
                    <p className="font-semibold text-on-surface">2. Razorpay Software Private Limited (Payment Gateway)</p>
                    <p className="text-xs mt-1">Role: PCI-DSS Level 1 certified payment processing for UPI, NetBanking, debit/credit cards. Ambika Jewels never captures, receives, or stores raw card or banking credentials.</p>
                  </div>
                  <div className="bg-background/80 p-3.5 border border-outline-variant/30 rounded-xs">
                    <p className="font-semibold text-on-surface">3. BVC Logistics Private Limited (High-Value Armored Courier)</p>
                    <p className="text-xs mt-1">Role: Secure armored transit, tamper-evident security pouch tracking, and OTP verification for delivery of high-value precious gold cargo across India.</p>
                  </div>
                  <div className="bg-background/80 p-3.5 border border-outline-variant/30 rounded-xs">
                    <p className="font-semibold text-on-surface">4. Groq Inc. (AI Concierge Cloud Inference)</p>
                    <p className="text-xs mt-1">Role: Real-time language processing for our virtual jewellery concierge (Aanya). Strictly subject to automated client-side PII redaction prior to transmission.</p>
                  </div>
                  <div className="bg-background/80 p-3.5 border border-outline-variant/30 rounded-xs">
                    <p className="font-semibold text-on-surface">5. Cloud Hosting & Edge Delivery (Netlify / Vercel)</p>
                    <p className="text-xs mt-1">Role: Content delivery network (CDN), serverless edge functions, SSL/TLS certificate termination, and DDoS protection.</p>
                  </div>
                </div>
              </section>

              {/* Cross-Border Data Transfer Disclosures */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Cross-Border Data Transfers & Redaction Safeguards
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs space-y-2">
                  <p>
                    <strong>Automated Redaction Protocol:</strong> Before any customer query is processed by our AI concierge powered by Groq Inc., our server automatically detects and redacts phone numbers, email addresses, PAN numbers, Aadhaar identifiers, and street addresses.
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    All core financial, order, and customer database records remain stored securely within India (AWS ap-south-1 Mumbai via Supabase). Any ephemeral cross-border transit for LLM inference is conducted under contractual confidentiality safeguards consistent with the DPDP Act, 2023.
                  </p>
                </div>
              </section>

              {/* Data Retention Schedule */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  5. Data Retention & Purge Schedule
                </h2>
                <div className="space-y-2 text-xs">
                  <p>We retain personal information strictly for as long as required to fulfill transactional purposes and statutory obligations:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li><strong>Tax & GST Invoices (HSN 7113):</strong> Retained for <strong>8 financial years</strong> in accordance with Section 36 of the CGST Act, 2017 and Section 44AB of the Income Tax Act, 1961 (verify with CA/lawyer).</li>
                    <li><strong>Encrypted PAN & Form 60 Records:</strong> Retained for statutory audit periods mandated by CBDT Rule 114B and Prevention of Money Laundering Act (PMLA) regulations.</li>
                    <li><strong>AI Concierge Chat Histories:</strong> Chat conversation histories and rate-limiting counters are purged after <strong>30 calendar days</strong>.</li>
                    <li><strong>Ephemeral Session Cookies:</strong> Expire automatically upon closing your browser or completing checkout.</li>
                  </ul>
                </div>
              </section>

              {/* Customer Rights Under DPDP Act */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  6. Data Principal Rights (DPDP Act, 2023)
                </h2>
                <p className="mb-2">Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Right to Access:</strong> Request a summary of personal data held about you and processing activities undertaken.</li>
                  <li><strong>Right to Correction & Updating:</strong> Request correction of inaccurate, misleading, or outdated personal contact information.</li>
                  <li><strong>Right to Erasure / Deletion:</strong> Request deletion of your personal data, subject to mandatory statutory tax and accounting retention requirements under Indian law.</li>
                  <li><strong>Right to Nominate:</strong> Nominate an individual to exercise your data rights in the event of incapacity.</li>
                  <li><strong>Right to Grievance Redressal:</strong> Register any concerns or complaints regarding your personal data with our Grievance Officer.</li>
                </ul>
              </section>

              {/* Grievance Redressal Officer */}
              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">
                  7. Grievance Redressal & Compliance Officer
                </h2>
                <p className="mb-3 text-xs">
                  In compliance with Rule 5(6) of the Consumer Protection (E-Commerce) Rules, 2020 and Section 13(1) of the DPDP Act, 2023:
                </p>
                <div className="p-4 bg-background border border-outline-variant/30 rounded-xs space-y-1 text-xs">
                  <p className="font-semibold text-on-surface">Officer: {siteConfig.grievanceOfficer.name}</p>
                  <p>Designation: {siteConfig.grievanceOfficer.designation}</p>
                  <p>Organization: {siteConfig.legalBusinessName}</p>
                  <p>Physical Address: {siteConfig.grievanceOfficer.address}</p>
                  <p>Direct Email: <a href={`mailto:${siteConfig.grievanceOfficer.email}`} className="text-primary underline">{siteConfig.grievanceOfficer.email}</a></p>
                  <p>Phone: {siteConfig.grievanceOfficer.phone}</p>
                  <p className="text-amber-400 font-semibold mt-2">
                    Statutory Response: {siteConfig.grievanceOfficer.responseTime}
                  </p>
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
