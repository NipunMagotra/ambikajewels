import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Ambika Jewels Jammu',
  description: 'Terms and conditions governing the purchase of fine gold, diamond, and 925 sterling silver jewelry at Ambika Jewels online showroom.',
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
            <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-3">Terms & Conditions</h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-8 pb-4 border-b border-outline-variant/20">
              Last Updated: August 2026 | Ambika Jewels (Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013)
            </p>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">1. Introduction & Acceptance</h2>
                <p>
                  Welcome to <strong>Ambika Jewels</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By accessing or making a purchase on our website or at our flagship boutique located at Lower Roop Nagar, Jammu, J&K 180013, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order or using our services.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">2. Product Standards & Hallmark Certification</h2>
                <p className="mb-3">
                  Ambika Jewels guarantees authenticity across all our collections:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Gold Jewelry</strong>: Available in 22K (916), 18K (750), 14K (585), and 9K (375) solid gold, accompanied by official Bureau of Indian Standards (BIS) Hallmarking.</li>
                  <li><strong>Diamond Jewelry</strong>: Crafted in 18K and 14K gold settings with natural certified diamonds accompanied by official GIA / IGI certificates.</li>
                  <li><strong>925 Silver Collection</strong>: Guaranteed 925 sterling silver with authentic traditional hallmark stampings.</li>
                  <li><strong>Dogra Heritage Line</strong>: Handcrafted traditional designs representing Jammu cultural heritage crafted by master karigars.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">3. Pricing & Currency</h2>
                <p>
                  All prices listed on our website are in <strong>Indian Rupees (INR - ₹)</strong> and are inclusive of applicable Goods and Services Tax (GST - 3% on fine gold/silver jewelry) unless specified otherwise. Daily gold and silver rate fluctuations may cause online price updates. Orders once placed and confirmed with payment lock the rate at the time of purchase.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">4. Payments & Razorpay Integration</h2>
                <p>
                  We accept online payments via <strong>Razorpay</strong> payment gateway (UPI, Credit/Debit Cards, Net Banking, EMI, and Wallets), as well as direct showroom payments (Cash, UPI, NEFT/RTGS). Online transactions are encrypted using SSL technology. We do not store raw card numbers or banking passwords on our servers.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">5. 3D CAD Customization & Bespoke Orders</h2>
                <p>
                  Custom jewelry designs ordered via sketch or WhatsApp picture submission (+91 9086098457) receive a 3D CAD digital rendering within 2 business days. Bespoke custom-crafted orders require an advance deposit and are non-refundable once casting begins.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">6. Ambika P-Gold Accumulation Program</h2>
                <p>
                  Digital gold accumulated through our P-Gold portal represents 24K (999 Pure) physical gold held in secured custody. P-Gold can be redeemed at 100% valuation for physical jewelry or coins at our Jammu showroom.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">7. Governing Law & Jurisdiction</h2>
                <p>
                  These terms are governed by the laws of India. Any disputes arising in connection with website orders or boutique services shall be subject to the exclusive jurisdiction of the competent courts in <strong>Jammu, Jammu & Kashmir</strong>.
                </p>
              </section>

              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">8. Contact Information</h2>
                <p>For questions regarding these Terms & Conditions, please contact us at:</p>
                <div className="mt-2 p-4 bg-background border border-outline-variant/30 rounded-xs">
                  <p className="font-semibold text-on-surface">Ambika Jewels</p>
                  <p>Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013</p>
                  <p>Email: <a href="mailto:contact@ambikajewels.com" className="text-primary underline">contact@ambikajewels.com</a></p>
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
