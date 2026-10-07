import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

export const metadata = {
  title: 'Bespoke Services & Gold Exchange | Ambika Jewels Jammu',
  description: 'Explore bespoke jewellery design, 3D CAD previews, old gold exchange, gold melting & redesigning, and private concierge services at Ambika Jewels in Jammu.',
};

export default function ServicesPage() {
  const services = [
    {
      id: 'gold-exchange',
      title: 'Gold Exchange Program',
      subtitle: 'Exchange Old Gold for Brand New Designs',
      icon: 'currency_exchange',
      description: 'Upgrade your jewellery collection effortlessly. Bring in any old gold jewellery and exchange it at prevailing daily market gold rates for our new designer collections.',
      highlights: [
        'Transparent valuation based on daily market bullion rate',
        'Digital purity testing and weight verification',
        'Full credit applied directly to your new design'
      ]
    },
    {
      id: 'custom-jewellery',
      title: 'Jewellery Customisation & 3D CAD',
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
        'Complimentary showroom cleaning & inspection'
      ]
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        {/* Page Banner */}
        <section className="relative py-12 sm:py-16 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] text-center">
          <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-3xl">
            <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.35em] uppercase block mb-2 font-semibold">
              EXPERT CRAFTSMANSHIP &amp; SERVICES
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[var(--text-primary)] font-normal mb-3">
              Gold Exchange &amp; <span className="italic font-normal gold-text-gradient">Customisation</span>
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl mx-auto">
              At Ambika Jewels, we offer personalized services including transparent Gold Exchange (as per stated terms), old gold melting &amp; redesign, bespoke 3D CAD customisation, and private consultations.
            </p>
          </div>
        </section>

        <MandalaDivider />

        {/* Services List */}
        <section className="py-8 sm:py-12 container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {services.map((s) => (
              <div key={s.id} className="bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-6 sm:p-7 rounded-[2px] flex flex-col justify-between hover:border-[var(--accent-gold)]/50 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-10 h-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center text-[var(--accent-gold)] shrink-0">
                      <span className="material-symbols-outlined text-xl">{s.icon}</span>
                    </div>
                    <div>
                      <span className="font-sans text-[9px] text-[var(--accent-gold)] tracking-widest uppercase block font-semibold">{s.subtitle}</span>
                      <h2 className="font-serif text-lg sm:text-xl text-[var(--text-primary)] font-normal">{s.title}</h2>
                    </div>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mb-4 leading-relaxed font-light">
                    {s.description}
                  </p>
                  <ul className="flex flex-col gap-2 mb-5 border-t border-[var(--border-subtle)] pt-3.5">
                    {s.highlights.map((h, i) => (
                      <li key={i} className="font-sans text-xs text-[var(--text-secondary)] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--accent-gold)] text-sm">check_circle</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/919086098457?text=Namaste!%20I%20am%20interested%20in%20${encodeURIComponent(s.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold-primary w-full sm:w-auto inline-block"
                  >
                    <span className="material-symbols-outlined text-sm">chat_bubble</span> ENQUIRE ON WHATSAPP
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Banner */}
        <section className="py-8 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-6 sm:p-8 rounded-[2px] flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal mb-1.5">Visit Our Showroom &amp; Boutique</h2>
              <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&amp;K 180013 <br />
                Hours: Mon–Sat 10:00 AM – 8:00 PM | Sunday: Open
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
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
