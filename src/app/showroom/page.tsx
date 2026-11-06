import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'Flagship Showroom & Atelier | Ambika Jewels Jammu',
  description: 'Visit the Ambika Jewels flagship jewellery showroom in Lower Roop Nagar, Jammu. Private salon appointments, live gold melting, and custom 3D CAD design.',
};

export default function ShowroomPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="font-sans text-[9.5px] text-[var(--accent-gold)] tracking-[0.32em] uppercase block mb-2 font-medium">
              PHYSICAL SHOWROOM &bull; LOWER ROOP NAGAR
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight mb-3">
              The Jammu Flagship Salon
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              Step inside our private jewellery boutique in Jammu. Experience our full heirloom archive, daily live bullion rates, and private bespoke consultations.
            </p>
          </div>

          {/* Showroom Imagery Spread */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
            <div className="md:col-span-8 relative aspect-[16/10] overflow-hidden bg-[var(--bg-surface)] rounded-[1px]">
              <img
                src="/hero-clean.png"
                alt="Ambika Jewels Flagship Showroom Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-sans px-3 py-1 uppercase tracking-wider">
                MAIN SHOWROOM &bull; BESPOKE BRIDAL SALON
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-surface)] rounded-[1px]">
                <img
                  src="/products/royal-kundan-bridal-suite-hd.jpg"
                  alt="Jewellery Display Case"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[1px] flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-sans tracking-widest uppercase text-[var(--accent-gold)] block mb-1">
                    ATELIER SERVICES
                  </span>
                  <h3 className="font-serif text-lg text-[var(--text-primary)] mb-2 font-normal">
                    Old Gold Exchange &amp; Melting
                  </h3>
                  <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    Bring heirloom gold for on-the-spot ultrasonic karat purity assaying and transparent market melting valuation.
                  </p>
                </div>
                <span className="text-[10px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider mt-4">
                  CERTIFIED BIS WEIGHING SCALES
                </span>
              </div>
            </div>
          </div>

          {/* Showroom Address & Hours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Showroom Coordinates Card */}
            <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[1px]">
              <span className="text-[9.5px] font-sans tracking-widest uppercase text-[var(--accent-gold)] block mb-2 font-medium">
                SHOWROOM LOCATION
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] mb-3 font-normal">
                Ambika Jewels Showroom &amp; Atelier
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light mb-6">
                Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu &amp; Kashmir 180013, India
              </p>

              <div className="space-y-2 text-xs font-sans text-[var(--text-secondary)] mb-8 pb-6 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">call</span>
                  <span>Direct: +91 9682589725</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">chat</span>
                  <span>WhatsApp Concierge: +91 9086098457</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">mail</span>
                  <span>Email: {siteConfig.contact.email}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Shop+no.3,+E.W.S+colony,+Sector+1,+Lower+Roop+Nagar,+Jammu,+Jammu+%26+Kashmir+180013"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-primary py-3 px-6 text-xs text-center tracking-wider"
                >
                  GET GOOGLE MAPS DIRECTIONS
                </a>
              </div>
            </div>

            {/* Timings & Appointment Booking Card */}
            <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[1px] flex flex-col justify-between">
              <div>
                <span className="text-[9.5px] font-sans tracking-widest uppercase text-[var(--accent-gold)] block mb-2 font-medium">
                  OPERATING SCHEDULE
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] mb-3 font-normal">
                  Showroom &amp; Counter Hours
                </h3>

                <div className="space-y-3 text-xs font-sans mb-8">
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Monday &ndash; Saturday</span>
                    <span className="font-medium text-[var(--text-primary)]">10:00 AM &ndash; 8:00 PM</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Sunday</span>
                    <span className="font-medium text-[var(--text-primary)]">Open (Wedding / Festive Hours)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Bullion Counter Daily Rate Update</span>
                    <span className="font-medium text-[var(--accent-gold)]">11:00 AM Daily</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                  Planning a bridal ensemble or custom 3D CAD design? Book a private consultation with creative director Shivani Anand and representative Lakesh Kumar.
                </p>
                <a
                  href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20schedule%20a%20private%20bridal%20appointment%20at%20the%20Jammu%20showroom."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-secondary w-full py-3.5 text-xs text-center tracking-wider block"
                >
                  SCHEDULE PRIVATE APPOINTMENT VIA WHATSAPP
                </a>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

