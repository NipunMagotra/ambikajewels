import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Ambika Jewels Jammu',
  description: 'Learn about Ambika Jewels in Jammu, founded by Shivani Anand and representative Lakesh Kumar. Specializing in authentic Dogra heritage jewellery, Gold Exchange, 22K to 9K gold, 925 silver, and custom jewellery.',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: 'verified',
      title: 'Hallmarked Gold & Certified Diamonds',
      description: 'Available in 22K (916), 18K (750), 14K (585), and 9K (375) Gold, with official GIA/IGI certified real diamonds and 925 hallmarked silver.'
    },
    {
      icon: 'auto_awesome',
      title: 'Signature Dogra Heritage Collection',
      description: 'Specialists in authentic Dogra traditional jewellery, including Dogri Jhumkis, Dogri Naman Sets, and Dogri Long Sets reflecting Jammu cultural heritage.'
    },
    {
      icon: 'currency_exchange',
      title: 'Gold Exchange & Custom Melting',
      description: 'Transparent gold exchange as per stated store terms. Bring old gold to be melted and redesigned into modern bespoke heirloom jewellery.'
    },
    {
      icon: 'storefront',
      title: 'Showroom & Private Boutique',
      description: 'Operated under the leadership of owner Shivani Anand and representative Lakesh Kumar for personal, attentive customer service.'
    }
  ];

  const milestones = [
    { year: '01', title: 'Establishment in Jammu', detail: 'Our jewellery showroom and boutique were founded in Lower Roop Nagar, Jammu, by Shivani Anand.' },
    { year: '02', title: 'Signature Dogra Collection', detail: 'Introduced authentic Dogri Jhumki, Dogri Naman, and Long Sets crafted by master Jammu karigars.' },
    { year: '03', title: 'Gold Exchange & 3D CAD', detail: 'Pioneered full gold exchange and 3D CAD custom design services for custom jewellery orders.' },
    { year: '04', title: 'Expanded Multi-Purity Collections', detail: 'Offering 22K, 18K, 14K, 9K gold, 18K/14K diamond, 925 silver, and nationwide express delivery.' }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        
        {/* About Hero */}
        <section className="relative py-12 sm:py-16 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] overflow-hidden">
          <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop text-center relative z-10 max-w-3xl">
            <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.35em] uppercase block mb-2 font-semibold">
              JAMMU &bull; FINE JEWELLERY
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] font-normal mb-4 leading-tight">
              Authentic Dogra Heritage &amp; <br />
              <span className="italic font-normal gold-text-gradient">Modern Fine Jewellery</span>
            </h1>
            <p className="font-sans text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl mx-auto">
              Based in Jammu, Ambika Jewels is owned by Shivani Anand and managed alongside business representative Lakesh Kumar, offering premium-quality jewellery, traditional Dogra collections, and customized gold services.
            </p>
          </div>
        </section>

        <MandalaDivider />

        {/* Story Section */}
        <section className="py-8 sm:py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-square bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-[var(--card-shadow)] overflow-hidden rounded-[2px]">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105" 
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80')" }}
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[var(--bg-card)] border border-[var(--border-card)] p-4 sm:p-5 hidden sm:block max-w-xs shadow-xl rounded-[2px]">
                <p className="font-serif text-lg text-[var(--accent-gold)] font-medium mb-1">JAMMU SHOWROOM</p>
                <p className="font-sans text-[9px] text-[var(--text-secondary)] tracking-wider uppercase">PREMIUM QUALITY &amp; TRUSTED CRAFTSMANSHIP</p>
              </div>
            </div>

            <div className="lg:pl-6">
              <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.25em] uppercase block mb-1 font-semibold">OUR STORY</span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[var(--text-primary)] font-normal mb-3 leading-tight">
                Preserving Heritage, <span className="italic font-normal gold-text-gradient">Crafting Perfection</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mb-3 leading-relaxed font-light">
                Ambika Jewels was established with a clear mission: to offer unique, exclusive jewellery designs with uncompromised quality and personal customer service. Alongside our flagship showroom in Jammu, we operate a personalized boutique managed directly by owner Shivani Anand.
              </p>
              <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed font-light">
                We take immense pride in preserving Jammu&apos;s cultural legacy through our Signature Dogra Collection, including authentic Dogri Jhumkis, Dogri Naman Sets, and Dogri Long Sets. In addition, our Gold Exchange program allows customers to melt old gold and transform it into brand-new modern heritage pieces.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link 
                  href="/collections"
                  className="btn-gold-primary text-center"
                >
                  EXPLORE COLLECTIONS
                </Link>
                <Link 
                  href="/services"
                  className="btn-gold-secondary text-center"
                >
                  OUR SERVICES
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Values Grid */}
        <section className="py-10 sm:py-14 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)] px-4 sm:px-margin-mobile lg:px-margin-desktop">
          <div className="container mx-auto">
            <div className="text-center max-w-lg mx-auto mb-8 sm:mb-10">
              <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] uppercase font-semibold block mb-1">
                WHY CUSTOMERS CHOOSE US
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[var(--text-primary)] font-normal">
                Our Quality &amp; Service Promise
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {pillars.map((p, idx) => (
                <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-5 sm:p-6 rounded-[2px] flex flex-col justify-between hover:border-[var(--accent-gold)]/50 transition-colors">
                  <div>
                    <div className="w-10 h-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center text-[var(--accent-gold)] mb-3.5">
                      <span className="material-symbols-outlined text-xl">{p.icon}</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg text-[var(--text-primary)] mb-2 font-normal">{p.title}</h3>
                    <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed font-light">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="py-10 sm:py-14 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="text-center max-w-lg mx-auto mb-8 sm:mb-10">
            <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] uppercase font-semibold block mb-1">
              OUR JOURNEY
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[var(--text-primary)] font-normal">
              Milestones &amp; Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {milestones.map((item, idx) => (
              <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-5 rounded-[2px] relative hover:border-[var(--accent-gold)]/40 transition-colors">
                <span className="font-serif text-2xl text-[var(--accent-gold)] font-normal block mb-1.5">{item.year}</span>
                <h4 className="font-serif text-base text-[var(--text-primary)] font-normal mb-1">{item.title}</h4>
                <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visit Showroom & Concierge */}
        <section className="py-8 sm:py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-6 sm:p-8 lg:p-10 rounded-[2px] flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center lg:text-left">
              <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] uppercase font-semibold block mb-1.5">
                BOUTIQUE &amp; SHOWROOM VISITS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal mb-2">
                Visit Ambika Jewels Showroom
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light mb-3">
                Visit our showroom in Roop Nagar, Jammu, managed by Shivani Anand &amp; Lakesh Kumar. We offer private consultations for bridal trousseaus, custom gold melting, and traditional Dogra collections.
              </p>
              <div className="font-sans text-xs text-[var(--accent-gold)] font-medium leading-relaxed">
                📍 Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&amp;K 180013 <br />
                🕒 Mon–Sat: 10:00 AM – 8:00 PM | Sunday: Open
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto shrink-0">
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
