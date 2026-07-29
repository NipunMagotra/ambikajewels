import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';
import Link from 'next/link';

export const metadata = {
  title: 'Bespoke Services & Gold Exchange | Ambika Jewels Jammu',
  description: 'Explore custom jewelry design, 3D CAD previews, old gold exchange, gold melting & redesigning, and private concierge services at Ambika Jewels in Jammu.',
};

export default function ServicesPage() {
  const services = [
    {
      id: 'gold-exchange',
      title: 'Gold Exchange Program',
      subtitle: 'Exchange Old Gold for Brand New Designs',
      icon: 'currency_exchange',
      description: 'Upgrade your jewelry wardrobe easily. Bring in any old gold jewelry and exchange it at 100% of current gold value for our new designer collections.',
      highlights: [
        '100% value valuation based on daily gold rate',
        'Transparent testing and weight verification',
        'Zero deduction on pure gold weight'
      ]
    },
    {
      id: 'custom-jewelry',
      title: 'Jewelry Customization & 3D CAD',
      subtitle: 'Turn Any Sketch or Idea into Reality',
      icon: 'palette',
      description: 'Have a dream design or an Instagram photo? Send it to us on WhatsApp (+91 9086098457). Our master karigars will create a 3D CAD design preview for you within 2 days.',
      highlights: [
        '3D CAD digital preview before crafting',
        'Available in 22K, 18K, 14K, or 9K Gold',
        'Choice of certified diamonds & natural gemstones'
      ]
    },
    {
      id: 'old-gold-melting',
      title: 'Old Gold Melting & Redesigning',
      subtitle: 'Transform Heirloom Gold into Modern Heritage',
      icon: 'local_fire_department',
      description: 'Preserve the emotional sentiment of family heirloom gold while giving it a modern heritage design. We melt your old gold in front of you and craft brand-new pieces.',
      highlights: [
        'Live in-store melting process',
        'Transform traditional pieces into modern sets',
        'Signature Dogra collection redesigns'
      ]
    },
    {
      id: 'personalized-assistance',
      title: 'Personalized Concierge Assistance',
      subtitle: 'Showroom & Live Video Consultations',
      icon: 'support_agent',
      description: 'Experience 1-on-1 personalized service with store owner Shivani Anand and representative Lakesh Kumar in our Jammu showroom & boutique, or book a live video call from anywhere in the world.',
      highlights: [
        'Private bridal trousseau consultations',
        'Live WhatsApp video shopping appointments',
        'Free lifetime cleaning & polishing'
      ]
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap bg-background text-on-background">
        {/* Page Banner */}
        <section className="relative py-16 sm:py-20 bg-surface-container border-b border-outline-variant/30 text-center">
          <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-3xl">
            <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.35em] block mb-2 font-semibold">
              EXPERT CRAFTSMANSHIP & SERVICES
            </span>
            <h1 className="font-headline-md text-3xl sm:text-5xl text-primary mb-4">
              Gold Exchange & <span className="italic font-normal gold-text-gradient">Customization</span>
            </h1>
            <p className="font-body-md text-xs sm:text-base text-on-surface-variant font-light leading-relaxed">
              At Ambika Jewels, we offer personalized services including 100% Gold Exchange, old gold melting & redesign, bespoke 3D CAD customization, and private consultations.
            </p>
          </div>
        </section>

        <MandalaDivider />

        {/* Services List */}
        <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {services.map((s) => (
              <div key={s.id} className="bg-surface-container border border-outline-variant/30 p-6 sm:p-8 rounded-xs flex flex-col justify-between hover:border-primary/50 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-container/40 border border-primary/30 rounded-full flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                    </div>
                    <div>
                      <span className="font-label-caps text-[9px] text-primary tracking-widest block font-semibold">{s.subtitle}</span>
                      <h3 className="font-headline-sm text-lg sm:text-xl text-on-surface font-semibold">{s.title}</h3>
                    </div>
                  </div>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/90 mb-4 leading-relaxed font-light">
                    {s.description}
                  </p>
                  <ul className="flex flex-col gap-2 mb-6 border-t border-outline-variant/20 pt-4">
                    {s.highlights.map((h, i) => (
                      <li key={i} className="font-body-md text-xs text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={`https://wa.me/919086098457?text=Namaste!%20I%20am%20interested%20in%20${encodeURIComponent(s.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-bg-gradient font-label-caps text-[10px] sm:text-[11px] py-3 px-6 font-bold tracking-widest text-center shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">chat_bubble</span> ENQUIRE ON WHATSAPP
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Banner */}
        <section className="py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 rounded-xs flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <h3 className="font-headline-md text-2xl text-on-surface mb-2">Visit Our Showroom & Boutique</h3>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 font-light">
                Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013 <br />
                Hours: Mon–Sat 10:00 AM – 8:00 PM | Sunday: Open
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <WhatsAppButton />
              <CallButton />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
