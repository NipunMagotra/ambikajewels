import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Privacy Policy | Ambika Jewels Jammu',
  description: 'Privacy Policy detailing data collection, DPDP Act 2023 compliance, Razorpay payment security, Shiprocket logistics data sharing, and Grievance Officer details.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">PRIVACY POLICY</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                DATA PROTECTION & STATUTORY PRIVACY COMPLIANCE
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
                  <strong>{siteConfig.legalBusinessName}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to honoring and protecting the privacy of our customers and visitors. We operate our flagship fine jewelry showroom and online store from {siteConfig.fullAddress}.
                </p>
                <p>
                  This Privacy Policy describes our practices regarding the collection, storage, processing, and disclosure of personal data collected through our website (<Link href="/" className="text-primary underline font-medium">{siteConfig.domain}</Link>) in compliance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
                </p>
              </section>

              {/* Information Collected */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Personal Information We Collect
                </h2>
                <p className="mb-3">
                  We collect information necessary to fulfill luxury fine jewelry purchases, provide concierge support, and comply with Indian statutory requirements:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Customer Contact & Identification:</strong> Full Name, Email Address, 10-digit Indian Mobile Number (for OTP and dispatch tracking).
                  </li>
                  <li>
                    <strong>Shipping & Billing Coordinates:</strong> Physical Street Address, House/Flat Number, City, State, and 6-digit PIN Code.
                  </li>
                  <li>
                    <strong>Statutory Tax Identifiers (PAN Card):</strong> In strict compliance with <strong>Section 139A and Rule 114B of the Indian Income Tax Rules, 1962</strong>, customer Permanent Account Number (PAN) is collected for precious jewelry transactions exceeding <strong>₹2,00,000 (Rupees Two Lakh)</strong>. Any collected PAN is stored with AES-256-GCM encryption, is never logged in server telemetry, and is never displayed on unauthenticated tracking screens.
                  </li>
                  <li>
                    <strong>Order & Transaction Records:</strong> Purchased jewelry items, caratage/purity, invoice number, Razorpay payment reference ID, Shiprocket consignment AWB, and delivery confirmation timestamps.
                  </li>
                  <li>
                    <strong>Technical & Browsing Data:</strong> IP address, device type, browser metadata, and functional session cookies.
                  </li>
                </ul>
              </section>

              {/* Purpose of Data Use */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. Purpose of Processing Your Data
                </h2>
                <p className="mb-3">Your personal data is processed strictly for lawful, necessary business functions:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>To process jewelry orders and manage delivery via our logistics partner <strong>Shiprocket</strong>.</li>
                  <li>To verify payments and issue official GST Tax Invoices under HSN Code 7113.</li>
                  <li>To send live order tracking updates, dispatch notices, and delivery OTP confirmations via SMS and Email.</li>
                  <li>To deliver personalized 3D CAD design previews, custom gold exchange consultations, and concierge assistance.</li>
                  <li>To comply with statutory legal obligations under the Prevention of Money Laundering Act (PMLA) and Indian Goods & Services Tax (GST) laws.</li>
                </ul>
              </section>

              {/* Payment Security */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Payment Security & Zero Card Storage
                </h2>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs space-y-2">
                  <p>
                    All online payments made on our website are processed securely by <strong>Razorpay (Razorpay Software Private Limited)</strong>.
                  </p>
                  <p className="font-semibold text-primary">
                    Ambika Jewels NEVER captures, receives, processes, or stores raw credit card numbers, debit card PINs, CVV codes, net banking passwords, or UPI security credentials on our servers.
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    All payment transmissions are encrypted via industry-standard 256-Bit Transport Layer Security (TLS/SSL) encryption.
                  </p>
                </div>
              </section>

              {/* Data Sharing with Third Parties */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  5. Third-Party Data Disclosures
                </h2>
                <p className="mb-3">
                  We do not sell, rent, lease, or monetize your personal information to any marketing agencies or third parties. Personal data is shared exclusively with verified operational infrastructure providers:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Shiprocket (BigFoot Retail Solutions Pvt. Ltd.):</strong> Customer name, shipping address, PIN code, and phone number are shared to generate courier waybills and coordinate secure express transit via Blue Dart, Delhivery, or Expressbees.
                  </li>
                  <li>
                    <strong>Razorpay:</strong> Order identification, billing details, and total payable amount are transmitted securely to authenticate payment transactions.
                  </li>
                  <li>
                    <strong>Statutory Authorities:</strong> Disclosed only if mandated by a formal, written request from Indian tax authorities, law enforcement agencies, or court orders under Indian jurisdiction.
                  </li>
                </ul>
              </section>

              {/* Cookies & Storage */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  6. Cookies & Local Storage
                </h2>
                <p>
                  Our website uses functional browser storage and essential cookies strictly to maintain shopping bag contents, track anonymous user session states, and improve website loading speed. No third-party behavioral advertising trackers or cross-site tracking pixels are deployed.
                </p>
              </section>

              {/* User Rights */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  7. Customer Rights Under DPDP Act 2023
                </h2>
                <p className="mb-2">Under Indian data protection laws, you possess the right to:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Request a summary of personal data held about you.</li>
                  <li>Request correction of inaccurate or incomplete contact or billing data.</li>
                  <li>Request erasure of your personal data, subject to statutory tax retention periods (GST and PMLA regulations require preserving invoices for 6 to 8 financial years).</li>
                  <li>Withdraw consent for marketing communications.</li>
                </ul>
              </section>

              {/* Grievance Redressal Officer */}
              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">
                  8. Grievance Redressal Officer (IT Rules & E-Commerce Regulations)
                </h2>
                <p className="mb-3">
                  In compliance with Rule 5(6) of the Consumer Protection (E-Commerce) Rules, 2020 and Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, our designated Grievance Officer details are published below:
                </p>
                <div className="p-4 bg-background border border-outline-variant/30 rounded-xs space-y-1">
                  <p className="font-semibold text-on-surface">Grievance Redressal & Compliance Officer: {siteConfig.grievanceOfficer.name}</p>
                  <p className="text-xs">Designation: {siteConfig.grievanceOfficer.designation}</p>
                  <p className="text-xs">Organization: {siteConfig.legalBusinessName}</p>
                  <p className="text-xs">Physical Address: {siteConfig.grievanceOfficer.address}</p>
                  <p className="text-xs">Direct Email: <a href={`mailto:${siteConfig.grievanceOfficer.email}`} className="text-primary underline">{siteConfig.grievanceOfficer.email}</a></p>
                  <p className="text-xs">Phone: {siteConfig.grievanceOfficer.phone}</p>
                  <p className="text-xs text-amber-400 font-semibold mt-2">
                    Grievance Acknowledgment: Within 48 hours | Resolution Window: Within 30 calendar days
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
