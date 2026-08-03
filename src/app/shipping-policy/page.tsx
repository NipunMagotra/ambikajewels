import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping & Delivery Policy | Ambika Jewels Jammu',
  description: 'Shipping policy detailing estimated 3-5 business day delivery timelines across India, 100% transit insurance, packaging standards, and tracking via Shiprocket.',
};

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">SHIPPING & DELIVERY POLICY</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 lg:p-12 rounded-xs">
            <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-3">Shipping & Delivery Policy</h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-8 pb-4 border-b border-outline-variant/20">
              Last Updated: August 2026 | Pan-India Insured Logistics Powered by Shiprocket
            </p>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">1. Delivery Timelines</h2>
                <p className="mb-3">
                  <strong>Ambika Jewels</strong> partners with leading premium courier networks via <strong>Shiprocket</strong> (BlueDart, Delhivery, Expressbees) to ensure your precious jewelry reaches you safely and promptly:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="bg-background p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-[10px] text-primary block font-bold mb-1">JAMMU & KASHMIR / REGIONAL</span>
                    <p className="font-headline-sm text-xl font-bold text-on-surface">2 to 3 Business Days</p>
                    <p className="text-xs text-on-surface-variant mt-1">Direct dispatch from our Lower Roop Nagar, Jammu showroom.</p>
                  </div>
                  <div className="bg-background p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-[10px] text-primary block font-bold mb-1">METROS & REST OF INDIA</span>
                    <p className="font-headline-sm text-xl font-bold text-on-surface">3 to 5 Business Days</p>
                    <p className="text-xs text-on-surface-variant mt-1">Insured express air freight to major cities & towns across India.</p>
                  </div>
                </div>
                <p className="text-xs italic text-on-surface-variant/80">
                  * Note: Custom 3D CAD bespoke orders or customized gold sizing may require an additional 2-4 crafting days prior to dispatch.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">2. Shipping Charges & Free Delivery Threshold</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Free Insured Shipping</strong>: Offered on all orders exceeding <strong>₹5,000</strong>.</li>
                  <li><strong>Standard Shipping Fee</strong>: A nominal flat rate of <strong>₹150</strong> is applied for orders below ₹5,000.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">3. 100% Transit Insurance & Tamper-Proof Packaging</h2>
                <p className="mb-3">
                  Every order shipped from Ambika Jewels is fully insured against theft, loss, or damage in transit until it is delivered to your doorstep:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Tamper-Proof Box</strong>: Shipped in non-descript, heavy-grade tamper-evident luxury wooden/velvet jewelry boxes with security seals.</li>
                  <li><strong>Unboxing Inspection</strong>: Customers are strongly advised to inspect the outer tamper-evident package before signing for receipt. If the outer seal is broken or tampered with, please reject delivery immediately and report to us.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">4. Shipment Dispatch & Live Tracking</h2>
                <p>
                  Once your order is handed over to the courier partner, an automated SMS and Email notification is dispatched containing your <strong>Shiprocket Tracking AWB Number</strong>. You can track your shipment live on our website or directly on the Shiprocket tracking portal.
                </p>
              </section>

              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">5. Pickup Location & Direct Store Collection</h2>
                <p>
                  Customers in Jammu & Kashmir have the option to select direct showroom pick-up at our Lower Roop Nagar flagship showroom at zero shipping cost. Showroom pick-up requires presentation of valid government photo ID matching the order name.
                </p>
              </section>

              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">6. Shipping Support & Dispatch Queries</h2>
                <p>For urgent shipping updates or address change requests prior to dispatch, contact our logistics team:</p>
                <div className="mt-2 p-4 bg-background border border-outline-variant/30 rounded-xs">
                  <p className="font-semibold text-on-surface">Ambika Jewels Logistics Desk</p>
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
