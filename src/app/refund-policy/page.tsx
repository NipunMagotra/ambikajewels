import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';

export const metadata = {
  title: 'Cancellation & Refund Policy | Ambika Jewels Jammu',
  description: 'Cancellation and refund policy detailing our 7-day return policy, 100% gold exchange program, return conditions, and 5-7 business day refund timeline.',
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
            <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-3">Cancellation & Refund Policy</h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-8 pb-4 border-b border-outline-variant/20">
              Last Updated: August 2026 | Ambika Jewels Guarantee & Returns Guidelines
            </p>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">1. 7-Day Return & Exchange Guarantee</h2>
                <p className="mb-3">
                  At <strong>Ambika Jewels</strong>, customer satisfaction and trust are paramount. We offer a hassle-free <strong>7-Day Return & Exchange Policy</strong> for eligible jewelry items purchased through our online showroom or store.
                </p>
                <div className="bg-background p-4 border border-outline-variant/30 rounded-xs mb-3">
                  <p className="font-semibold text-on-surface mb-1">Return Request Window:</p>
                  <p className="text-xs text-on-surface-variant">
                    Return requests must be initiated within <strong>7 calendar days</strong> from the date of package delivery confirmed by our shipping logistics partner (Shiprocket).
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">2. Eligibility Conditions for Jewelry Returns</h2>
                <p className="mb-3">
                  To qualify for a full refund or exchange, returned jewelry must satisfy the following strict authenticity conditions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Unworn & Original Condition</strong>: The jewelry item must be in unused, unworn condition with zero scratches, alterations, or sign of wear.</li>
                  <li><strong>Intact Security Tag</strong>: The official security tag attached to the jewelry piece must remain completely intact and untampered.</li>
                  <li><strong>Original Certificates & Packaging</strong>: Must include all original Bureau of Indian Standards (BIS) Hallmark tags, GIA/IGI diamond certificates, warranty cards, invoice copy, and original box.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">3. Non-Returnable & Excluded Items</h2>
                <p className="mb-3">The following items are excluded from 7-day returns:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Bespoke 3D CAD Custom Orders</strong>: Custom jewelry crafted specifically from user sketches or personalized photo submissions.</li>
                  <li><strong>Engraved & Resized Items</strong>: Rings or bangles that have undergone personalized size modification or custom text engraving.</li>
                  <li><strong>Digital Gold (Ambika P-Gold)</strong>: P-Gold purchases are backed by 24K vault gold and can be redeemed for physical gold jewelry at 100% valuation at our showroom, but cannot be cancelled for cash once bullion is allocated.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">4. 100% Gold Exchange Program (Lifetime Buyback)</h2>
                <p>
                  In addition to 7-day returns, Ambika Jewels provides a <strong>100% Lifetime Gold Exchange Program</strong>. You can bring or ship your 22K, 18K, 14K gold or 925 silver jewelry back to our Jammu showroom at any time to exchange for brand-new designs based on prevalent market gold rates with transparent purity testing.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">5. Cancellation & Order Modification</h2>
                <p>
                  Orders can be cancelled free of charge prior to shipping dispatch by contacting our team at <a href="mailto:contact@ambikajewels.com" className="text-primary underline">contact@ambikajewels.com</a> or +91 9682589725. If an order has already been dispatched, standard 7-day return procedures apply.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">6. Refund Processing Timeline</h2>
                <p className="mb-3">
                  Once your returned item is received at our Jammu showroom, our quality control karigars verify the hallmark and condition within 48 hours:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Online Payment Refunds</strong>: Refunds approved after inspection are credited back to your original payment method (Razorpay UPI, Bank Account, Credit/Debit card) within <strong>5 to 7 business days</strong>.</li>
                  <li><strong>Store Credits / Exchanges</strong>: Instant store credit or exchange voucher is issued immediately upon inspection.</li>
                </ul>
              </section>

              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">7. Initiating a Return</h2>
                <p>To initiate a return, contact our customer concierge with your Order Reference Number:</p>
                <div className="mt-2 p-4 bg-background border border-outline-variant/30 rounded-xs">
                  <p className="font-semibold text-on-surface">Ambika Jewels Concierge Desk</p>
                  <p>Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013</p>
                  <p>Contact Email: <a href="mailto:contact@ambikajewels.com" className="text-primary underline">contact@ambikajewels.com</a></p>
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
