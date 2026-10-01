import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Shipping & Delivery Policy | Ambika Jewels Jammu',
  description: 'Pan-India shipping policy for fine jewelry orders. Delivery timelines (2-5 business days), tamper-evident packaging, and Shiprocket live tracking.',
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
            {/* DRAFT FOR LAWYER REVIEW BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-8 rounded-xs text-amber-300 text-xs font-semibold flex items-center gap-3">
              <span className="material-symbols-outlined text-lg shrink-0">gavel</span>
              <div>
                <p className="font-bold uppercase tracking-wider text-[11px]">DRAFT FOR LAWYER REVIEW — Pending Legal, Logistics & Compliance Sign-Off</p>
                <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">This document outlines operational logistics terms for review by our legal counsel. Verify all carrier SLAs and liability caps with lawyer/CA.</p>
              </div>
            </div>

            <div className="border-b border-outline-variant/20 pb-4 mb-8">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                SECURE ARMORED LOGISTICS & TRANSIT INSURANCE
              </span>
              <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
                Shipping & Delivery Policy
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                Last Updated: September 2026 | High-Value Precious Transit via {siteConfig.shipping.courierPartner}
              </p>
            </div>

            <div className="space-y-8 font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              
              {/* Serviceable Areas */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  1. Serviceable Delivery Areas (India Only)
                </h2>
                <p className="mb-3">
                  <strong>{siteConfig.legalBusinessName}</strong> delivers to serviceable PIN codes across India through specialized armored precious-cargo logistics partner <strong>BVC Logistics</strong>. All dispatches originate under secure vault protocol directly from our registered showroom in Jammu.
                </p>
                <div className="bg-background/80 p-4 border border-outline-variant/30 rounded-xs">
                  <p className="font-semibold text-on-surface text-xs mb-1">Geographic Coverage:</p>
                  <p className="text-xs text-on-surface-variant">
                    We currently deliver exclusively within the territory of <strong>India</strong>. We do not support cross-border or international shipping at this time.
                  </p>
                </div>
              </section>

              {/* Dispatch & Delivery Timelines */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  2. Dispatch & Delivery Timelines
                </h2>
                <p className="mb-3">
                  Every jewelry order is processed with extreme care, ultrasonic cleaning, hallmark inspection, and security packaging:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="bg-background p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-[10px] text-primary block font-bold mb-1">JAMMU & KASHMIR / NORTH REGION</span>
                    <p className="font-headline-sm text-xl font-bold text-on-surface">2 to 3 Business Days</p>
                    <p className="text-xs text-on-surface-variant mt-1">Direct expedited courier dispatch from Lower Roop Nagar showroom.</p>
                  </div>
                  <div className="bg-background p-4 border border-outline-variant/30 rounded-xs">
                    <span className="font-label-caps text-[10px] text-primary block font-bold mb-1">METROS & REST OF INDIA</span>
                    <p className="font-headline-sm text-xl font-bold text-on-surface">3 to 5 Business Days</p>
                    <p className="text-xs text-on-surface-variant mt-1">Express air courier (Blue Dart / Delhivery / Expressbees).</p>
                  </div>
                </div>
                <div className="bg-surface-container-high p-3.5 border border-outline-variant/20 rounded-xs text-xs space-y-1">
                  <p><strong>Dispatch Window:</strong> In-stock catalog jewelry is dispatched within <strong>24 to 48 business hours</strong> of payment confirmation.</p>
                  <p><strong>Custom & Bespoke Orders:</strong> Customized ring resizing or 3D CAD bespoke creations require an additional <strong>3 to 5 crafting days</strong> before courier handover.</p>
                </div>
              </section>

              {/* Shipping Charges & Free Delivery */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  3. Shipping Charges & Free Delivery Threshold
                </h2>
                <p className="mb-3">Our shipping pricing is transparent and itemized prior to payment:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Free Express Delivery:</strong> Complimentary express delivery is provided on all orders of <strong>₹50,000 and above</strong> across India.
                  </li>
                  <li>
                    <strong>Standard Delivery Fee:</strong> For orders below ₹50,000, a flat rate of <strong>₹500</strong> is charged at checkout to cover specialized tamper-evident security packaging and express logistics.
                  </li>
                </ul>
              </section>

              {/* Transit Insurance & Security Packaging */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  4. Tamper-Evident Packaging & Safe Transit
                </h2>
                <p className="mb-3">
                  Given the high value of fine gold, diamond, and silver jewelry, your consignment is protected at every step:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Secure Delivery Protocol:</strong> All shipments are dispatched in secure sealed boxes via authorized courier partners from our showroom doors until your verified delivery signature.
                  </li>
                  <li>
                    <strong>Discreet & Tamper-Evident Packaging:</strong> Packages are shipped in durable, non-descript outer security boxes with unique serialized tamper-proof security tape. The outer carton bears no reference to "gold", "diamonds", or "jewelry" to deter pilferage.
                  </li>
                  <li>
                    <strong>OTP / Signature Verification:</strong> High-value shipments require physical receipt and digital OTP / signature by the named recipient matching the checkout details.
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-red-950/20 border border-red-500/40 rounded-xs text-xs text-red-200">
                  <strong className="block text-red-300 mb-1">CRITICAL DELIVERY INSTRUCTION:</strong>
                  Please inspect the outer package thoroughly before accepting from the courier delivery agent. If the serialized security seal is cut, broken, or tampered with, <strong>DO NOT ACCEPT DELIVERY</strong>. Take immediate photographs, reject the parcel, and notify us at {siteConfig.contact.phone}.
                </div>
              </section>

              {/* Order Tracking & Courier Partner */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  5. Live Order Tracking via Shiprocket
                </h2>
                <p className="mb-3">
                  We integrate directly with <strong>Shiprocket</strong> logistics API v2. Once your order is packed and dispatched:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li>You will receive an instant SMS and Email confirmation containing your live <strong>Shiprocket Air Waybill (AWB) Tracking Number</strong>.</li>
                  <li>You can track the live real-time location of your consignment directly on our website at <Link href="/track" className="text-primary underline font-bold">{siteConfig.domain}/track</Link> or on the Shiprocket tracking portal.</li>
                </ol>
              </section>

              {/* Showroom Pickup Option */}
              <section>
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-3 font-semibold">
                  6. Direct Showroom Pickup (Jammu)
                </h2>
                <p>
                  Customers in Jammu & Kashmir have the option to pick up their order in person from our flagship showroom in Lower Roop Nagar at zero shipping cost. Showroom pickup requires presenting the order confirmation receipt and a valid government photo ID matching the billing name.
                </p>
              </section>

              {/* Logistics Support & Pickup Location */}
              <section className="pt-4 border-t border-outline-variant/20">
                <h2 className="font-headline-sm text-lg sm:text-xl text-primary mb-2 font-semibold">
                  7. Warehouse & Logistics Support Desk
                </h2>
                <p className="mb-2">For dispatch updates, delivery rescheduling, or address corrections:</p>
                <div className="p-4 bg-background border border-outline-variant/30 rounded-xs space-y-1">
                  <p className="font-semibold text-on-surface">{siteConfig.legalBusinessName} — Dispatch & Logistics Cell</p>
                  <p className="text-xs">Pickup & Shipping Hub: {siteConfig.fullAddress}</p>
                  <p className="text-xs">GSTIN: {siteConfig.gstin} | Registered Pickup Location: Primary</p>
                  <p className="text-xs">Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">{siteConfig.contact.email}</a></p>
                  <p className="text-xs">Phone: {siteConfig.contact.phone} | WhatsApp: {siteConfig.contact.whatsapp}</p>
                  <p className="text-xs">Live Tracking Portal: <Link href="/track" className="text-primary underline font-bold">Track Shipment Here</Link></p>
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
