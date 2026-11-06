import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: 'About the Maison | Ambika Jewels Jammu',
  description: 'The story of Ambika Jewels in Jammu, founded by Shivani Anand and representative Lakesh Kumar. Discover our Dogra heritage craftsmanship, 22K hallmarked gold, certified diamonds, and bespoke atelier.',
};

export default function AboutPage() {
  const pillars = [
    {
      num: '01',
      title: '100% BIS Hallmarked Purity',
      description: 'Every creation in 22K (916), 18K (750), 14K (585), and 9K gold carries a unique 6-character laser HUID code verified under Bureau of Indian Standards statutory regulations.',
    },
    {
      num: '02',
      title: 'The Dogra Dynasty Heritage',
      description: 'Preserving traditional northern Indian jewellery forms including authentic Dogri Jhumkis, Dogri Naman sets, and regional bridal haars crafted by master Jammu karigars.',
    },
    {
      num: '03',
      title: 'Certified Natural Solitaires',
      description: 'Ethically sourced natural diamonds accompanied by authentic IGI and GIA certificates, precision-set into solid 18K and 14K gold.',
    },
    {
      num: '04',
      title: 'Heirloom Melting & 3D CAD',
      description: 'Transparent gold exchange as per stated store terms. Bring old gold to our Jammu showroom for transparent melting valuation, ultrasonic karat assaying, and custom 3D CAD preview fabrication within 48 hours.',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        
        {/* Editorial Hero */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl mb-16 lg:mb-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-sans text-[9.5px] text-[var(--accent-gold)] tracking-[0.32em] uppercase block mb-3 font-medium">
              THE HOUSE OF AMBIKA JEWELS &bull; ESTD. 1998
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] font-normal tracking-tight mb-6 leading-[1.12]">
              The Soul of Jammu Goldsmithing
            </h1>
            <p className="font-sans text-xs sm:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl mx-auto">
              Ambika Jewels was founded with a singular conviction: that regional royal heritage and contemporary fine jewellery belong in harmony.
            </p>
          </div>
        </section>

        {/* Large Editorial Visual Feature */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl mb-20 lg:mb-28">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-[var(--bg-surface)] rounded-[1px]">
            <img
              src="/hero-clean.png"
              alt="Ambika Jewels Atelier and Showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white max-w-md">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#E8DCCF] block mb-1">
                LOWER ROOP NAGAR &bull; JAMMU
              </span>
              <p className="font-serif text-lg sm:text-xl font-normal">
                Where ancestral Dogra techniques meet contemporary fine gold craftsmanship.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 1: The Founders & Atelier */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl mb-20 lg:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-4 font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              <span className="text-[9.5px] uppercase tracking-[0.28em] text-[var(--accent-gold)] font-medium block mb-2">
                FOUNDER VISION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
                Shivani Anand &amp; Lakesh Kumar
              </h2>
              <p>
                Under the creative leadership of owner Shivani Anand, our boutique operates as a personal sanctuary for bridal trousseau planning, bespoke styling, and fine jewellery consultation.
              </p>
              <p>
                Counter operations and precious metals procurement are managed by business representative Lakesh Kumar, overseeing daily bullion rate alignment, strict Bureau of Indian Standards (BIS) hallmarking compliance, and insured armored logistics with BVC Logistics.
              </p>
              <p>
                Together, they have created a private jewellery salon where patrons know the exact karatage, net precious weight, and provenance of every single gram.
              </p>

              <div className="pt-4">
                <Link
                  href="/showroom"
                  className="btn-gold-primary py-3 px-6 text-xs tracking-wider"
                >
                  VISIT THE JAMMU SALON &rarr;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
                <img
                  src="/products/kundan-chandbali.png"
                  alt="Dogra Royal Jhumki Craft"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)] pt-8">
                <img
                  src="/products/heritage-ruby-haar.png"
                  alt="Fine Ruby and Gold Haar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Chapter 2: Four Core Pillars */}
        <section className="py-20 lg:py-28 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-[9.5px] font-sans tracking-[0.28em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
                OUR CODE OF PERMANENCE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
                The Four Pillars of Ambika
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((item) => (
                <div key={item.num} className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[1px] flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-[var(--accent-gold)] font-semibold block mb-3">
                      {item.num}
                    </span>
                    <h3 className="font-serif text-lg text-[var(--text-primary)] mb-2 font-normal">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Showroom Invitation */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl text-center py-20 lg:py-28">
          <span className="text-[9.5px] font-sans tracking-[0.28em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
            PRIVATE CONSULTATIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal tracking-tight mb-4">
            Experience the Salon in Person
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-xl mx-auto mb-8">
            Our flagship showroom in Lower Roop Nagar, Jammu, is open Monday through Saturday from 10:00 AM to 8:00 PM. We invite you to schedule a private viewing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/showroom"
              className="btn-gold-primary py-3.5 px-8 text-xs tracking-wider"
            >
              SHOWROOM DIRECTIONS &amp; HOURS
            </Link>
            <a
              href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20schedule%20a%20private%20styling%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-secondary py-3.5 px-8 text-xs tracking-wider"
            >
              WHATSAPP CONCIERGE
            </a>
          </div>
        </section>

      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
