import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Ambika Jewels Jammu',
  description: 'Privacy Policy detailing how personal data, payment information, and shipping address are collected, secured, and processed at Ambika Jewels.',
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
            <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-3">Privacy Policy</h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-8 pb-4 border-b border-outline-variant/20">
              Last Updated: August 2026 | Ambika Jewels (Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013)
            </p>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">1. Information We Collect</h2>
                <p className="mb-3">
                  At <strong>Ambika Jewels</strong>, we respect your privacy and are committed to protecting the personal data you share with us. We collect information when you place an order, register for P-Gold, interact with our AI Jewelry Assistant (Aanya), or request a 3D CAD design preview:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Personal Identifiers</strong>: Name, Email Address, Phone Number, Shipping Address, Pincode.</li>
                  <li><strong>Transaction Records</strong>: Order items, payment confirmation IDs, invoice references, and shipping dispatches.</li>
                  <li><strong>Technical & AI Logs</strong>: Chat assistant prompts, IP addresses, browser types, and website usage statistics.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">2. How We Use Your Information</h2>
                <p className="mb-3">Your data is processed strictly for legitimate business and fulfillment purposes:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>To process and fulfill jewelry orders and dispatch shipments via <strong>Shiprocket</strong> logistics partners.</li>
                  <li>To process secure payments via <strong>Razorpay</strong> payment gateway.</li>
                  <li>To provide live order updates, WhatsApp video shopping consultations, and 3D CAD previews.</li>
                  <li>To comply with statutory tax laws, GST invoices, and Prevention of Money Laundering Act (PMLA) guidelines for precious metal transactions.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">3. Payment Security & Data Non-Storage</h2>
                <p>
                  All online payments are securely processed directly by PCI-DSS compliant payment gateways (Razorpay). <strong>Ambika Jewels never captures, receives, or stores raw credit card details, debit card CVVs, net banking credentials, or UPI PINs</strong> on our servers.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">4. Data Sharing & Third-Party Services</h2>
                <p className="mb-3">
                  We do not sell, rent, or trade your personal information to third parties. Data is shared exclusively with verified operational partners:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Shiprocket & Courier Partners</strong>: Name, phone number, and delivery address to facilitate insured shipping dispatches across India.</li>
                  <li><strong>Razorpay Gateway</strong>: Order details and total payable amount for payment verification.</li>
                  <li><strong>Supabase Database</strong>: Encrypted database hosting for order persistence and P-Gold ledger accounts.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">5. Cookies & Tracking Technologies</h2>
                <p>
                  Our website uses functional cookies and HTTP-only session tokens to manage your shopping cart state, maintain administrator login sessions, and optimize website loading speeds. You can configure your browser to reject cookies, though certain cart features may be affected.
                </p>
              </section>

              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">6. Data Protection Officer & Privacy Inquiries</h2>
                <p>If you have any questions or wish to request data deletion, please contact our Privacy Team:</p>
                <div className="mt-2 p-4 bg-background border border-outline-variant/30 rounded-xs">
                  <p className="font-semibold text-on-surface">Ambika Jewels — Customer Privacy Cell</p>
                  <p>Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013</p>
                  <p>Official Email: <a href="mailto:contact@ambikajewels.com" className="text-primary underline">contact@ambikajewels.com</a></p>
                  <p>Phone: +91 9682589725 | WhatsApp: +91 9086098457</p>
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
