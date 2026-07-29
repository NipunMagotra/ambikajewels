import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Ambika Jewels Jammu (Estd 2021)',
  description: 'Learn about Ambika Jewels in Jammu, founded in 2021 by Shivani Anand and representative Lakesh Kumar. Specializing in authentic Dogra heritage jewelry, Gold Exchange, 22K-9K gold, 925 silver, and custom jewelry.',
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
      description: 'Specialists in authentic Dogra traditional jewelry including Dogri Jhumki, Dogri Naman Sets, and Dogri Long Sets reflecting Jammu cultural heritage.'
    },
    {
      icon: 'currency_exchange',
      title: 'Gold Exchange & Custom Melting',
      description: '100% transparent gold exchange. Bring old gold to be melted and redesigned into modern bespoke heirloom jewelry.'
    },
    {
      icon: 'storefront',
      title: 'Showroom & Private Boutique',
      description: 'Operated under the leadership of owner Shivani Anand and representative Lakesh Kumar for personal, attentive customer service.'
    }
  ];

  const milestones = [
    { year: '2021', title: 'Establishment in Jammu', detail: 'Founded our jewelry showroom and boutique in Lower Roop Nagar, Jammu by Shivani Anand.' },
    { year: '2022', title: 'Signature Dogra Collection', detail: 'Introduced authentic Dogri Jhumki, Dogri Naman, and Long Sets crafted by master Jammu karigars.' },
    { year: '2023', title: 'Gold Exchange & 3D CAD', detail: 'Pioneered full gold exchange and 3D CAD custom design services for custom jewelry orders.' },
    { year: 'Present', title: 'Expanded Multi-Purity Collections', detail: 'Offering 22K, 18K, 14K, 9K gold, 18K/14K diamond, 925 silver, and nationwide insured delivery.' }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap bg-background text-on-background">
        
        {/* About Hero */}
        <section className="relative py-16 sm:py-24 bg-surface-container border-b border-outline-variant/30 overflow-hidden">
          <div className="absolute inset-0 mandala-overlay opacity-5"></div>
          <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop text-center relative z-10 max-w-3xl">
            <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.35em] block mb-3 font-semibold">
              JAMMU &bull; ESTD 2021
            </span>
            <h1 className="font-headline-md text-3xl sm:text-5xl lg:text-6xl text-primary mb-6 leading-tight">
              Authentic Dogra Heritage & <span className="italic font-normal gold-text-gradient">Modern Fine Jewelry</span>
            </h1>
            <p className="font-body-md text-sm sm:text-lg text-on-surface-variant/90 leading-relaxed font-light">
              Established in 2021 in Jammu, Ambika Jewels is owned by Shivani Anand and managed alongside business representative Lakesh Kumar, offering premium quality jewelry, traditional Dogra collections, and customized gold services.
            </p>
          </div>
        </section>

        <MandalaDivider />

        {/* Story Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-margin-desktop items-center">
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-square bg-surface-container-high border gold-border overflow-hidden rounded-xs">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80')" }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-surface-container border border-primary/40 p-4 sm:p-6 hidden sm:block max-w-xs shadow-xl">
                <p className="font-headline-sm text-2xl gold-text-gradient font-bold mb-1">ESTD 2021</p>
                <p className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">PREMIUM QUALITY & TRUSTED CRAFTSMANSHIP</p>
              </div>
            </div>

            <div className="lg:pl-6">
              <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.25em] block mb-2 font-semibold">OUR STORY</span>
              <h2 className="font-headline-md text-2xl sm:text-4xl text-on-surface mb-4">
                Preserving Heritage, <span className="italic font-normal gold-text-gradient">Crafting Perfection</span>
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/90 mb-4 leading-relaxed font-light">
                Founded in 2021, Ambika Jewels was established with a clear mission: to offer unique, exclusive jewelry designs with uncompromised quality and personal customer service. Alongside our flagship showroom in Jammu, we operate a personalized boutique managed directly by owner Shivani Anand.
              </p>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/90 mb-6 leading-relaxed font-light">
                We take immense pride in preserving Jammu's cultural legacy through our Signature Dogra Collection — including authentic Dogri Jhumkis, Dogri Naman Sets, and Dogri Long Sets. In addition, our Gold Exchange program allows customers to melt old gold and transform it into brand-new modern heritage pieces.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link 
                  href="/collections"
                  className="gold-bg-gradient px-6 py-3.5 font-label-caps text-xs text-background font-bold tracking-widest text-center shadow-md hover:brightness-110 transition-all"
                >
                  EXPLORE COLLECTIONS
                </Link>
                <Link 
                  href="/services"
                  className="border border-primary px-6 py-3.5 font-label-caps text-xs text-primary font-bold tracking-widest text-center hover:bg-primary/10 transition-all"
                >
                  OUR SERVICES
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Values Grid */}
        <section className="py-12 sm:py-16 bg-surface-container/50 border-y border-outline-variant/20 px-4 sm:px-margin-mobile lg:px-margin-desktop">
          <div className="container mx-auto">
            <div className="text-center max-w-lg mx-auto mb-10">
              <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.3em] font-semibold block mb-1">
                WHY CUSTOMERS CHOOSE US
              </span>
              <h2 className="font-headline-md text-2xl sm:text-4xl text-on-surface">
                Our Quality & Service Promise
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {pillars.map((p, idx) => (
                <div key={idx} className="bg-surface-container border border-outline-variant/30 p-6 rounded-xs flex flex-col justify-between hover:border-primary/50 transition-colors">
                  <div>
                    <div className="w-12 h-12 bg-primary-container/40 border border-primary/30 rounded-full flex items-center justify-center text-primary mb-4">
                      <span className="material-symbols-outlined text-2xl">{p.icon}</span>
                    </div>
                    <h3 className="font-headline-sm text-base text-on-surface mb-2 font-semibold">{p.title}</h3>
                    <p className="font-body-md text-xs text-on-surface-variant/80 leading-relaxed font-light">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="py-12 sm:py-16 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="text-center max-w-lg mx-auto mb-10 sm:mb-12">
            <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.3em] font-semibold block mb-1">
              OUR JOURNEY
            </span>
            <h2 className="font-headline-md text-2xl sm:text-4xl text-on-surface">
              Milestones Since 2021
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((item, idx) => (
              <div key={idx} className="bg-surface-container border border-outline-variant/20 p-5 rounded-xs relative">
                <span className="font-headline-md text-3xl gold-text-gradient font-bold block mb-2">{item.year}</span>
                <h4 className="font-headline-sm text-sm text-on-surface font-semibold mb-1">{item.title}</h4>
                <p className="font-body-md text-xs text-on-surface-variant/80 font-light leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visit Showroom & Contact */}
        <section className="py-12 sm:py-16 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 rounded-xs flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.3em] font-semibold block mb-2">
                BOUTIQUE & SHOWROOM VISITS
              </span>
              <h3 className="font-headline-md text-2xl sm:text-3xl text-on-surface mb-3">
                Visit Ambika Jewels Showroom
              </h3>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed font-light mb-4">
                Visit our showroom in Roop Nagar, Jammu, managed by Shivani Anand & Lakesh Kumar. We offer private consultations for bridal trousseaus, custom gold melting, and traditional Dogra collections.
              </p>
              <div className="font-body-md text-xs text-primary font-semibold">
                📍 Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013 <br />
                🕒 Mon–Sat: 10:00 AM – 8:00 PM | Sunday: Open
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
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
