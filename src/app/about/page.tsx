import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Ambika Jewels Jammu Since 1984',
  description: 'Discover the 40-year legacy of Ambika Jewels in Jammu. Certified 22K Hallmarked Gold, Polki, Kundan & Heritage Jewelry handcrafted by master karigars.',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: 'verified',
      title: '22K BIS Hallmarked Purity',
      description: 'Every single gold creation is stamped with official government BIS hallmarking, ensuring guaranteed purity and transparency.'
    },
    {
      icon: 'auto_awesome',
      title: 'Master Karigar Craftsmanship',
      description: 'Our heritage Polki and Kundan sets are individually handcrafted using age-old royal jeweler techniques passed down through generations.'
    },
    {
      icon: 'local_shipping',
      title: 'Fully Insured Global Delivery',
      description: 'Dispatched in tamper-proof security packages with 100% transit insurance directly to your doorstep in India and worldwide.'
    },
    {
      icon: 'videocam',
      title: 'Live Video Concierge',
      description: 'Examine craftsmanship up close and try on bridal sets from anywhere in the world with live 1-on-1 video call appointments.'
    }
  ];

  const milestones = [
    { year: '1984', title: 'Founding in Jammu', detail: 'Established our first artisanal gold showroom in Jammu, serving royal patrons and local families.' },
    { year: '1998', title: 'Bridal Couture Specialty', detail: 'Pioneered signature Kundan & Polki wedding sets crafted for northern Indian bride traditions.' },
    { year: '2012', title: 'BIS Certification Hallmark', detail: 'Standardized 100% BIS hallmarked gold purity across all collections with lifetime buyback guarantees.' },
    { year: '2024+', title: 'Digital & Global Concierge', detail: 'Expanded nationwide with direct WhatsApp video shopping and fully insured shipping worldwide.' }
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
              JAMMU &bull; SINCE 1984
            </span>
            <h1 className="font-headline-md text-3xl sm:text-5xl lg:text-6xl text-primary mb-6 leading-tight">
              Four Decades of <span className="italic font-normal gold-text-gradient">Heritage & Perfection</span>
            </h1>
            <p className="font-body-md text-sm sm:text-lg text-on-surface-variant/90 leading-relaxed font-light">
              Since 1984, Ambika Jewels has stood as Jammu's premier destination for authentic 22K hallmarked gold, Polki, and Kundan jewelry — celebrating life's most precious occasions.
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
                <p className="font-headline-sm text-2xl gold-text-gradient font-bold mb-1">40+ Years</p>
                <p className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">OF UNCOMPROMISED PURITY & TRUST</p>
              </div>
            </div>

            <div className="lg:pl-6">
              <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.25em] block mb-2 font-semibold">OUR PHILOSOPHY</span>
              <h2 className="font-headline-md text-2xl sm:text-4xl text-on-surface mb-4">
                Carving Memories in <span className="italic font-normal gold-text-gradient">Pure Gold</span>
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/90 mb-4 leading-relaxed font-light">
                Jewelry is not merely an ornament; it is a treasured heirloom passed down through generations. Founded in Jammu over 40 years ago, Ambika Jewels was built on an unyielding dedication to purity, ethical sourcing, and master artistry.
              </p>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/90 mb-6 leading-relaxed font-light">
                Every piece in our couture showroom — from intricate temple gold necklaces to royal Polki bridal sets — is handcrafted by expert Karigars who carry forward centuries of traditional Indian jewelry techniques.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link 
                  href="/collections"
                  className="gold-bg-gradient px-6 py-3.5 font-label-caps text-xs text-background font-bold tracking-widest text-center shadow-md hover:brightness-110 transition-all"
                >
                  EXPLORE COLLECTIONS
                </Link>
                <a 
                  href="https://wa.me/919419100000?text=Namaste!%20I%20would%20like%20to%20know%20more%20about%20Ambika%20Jewels."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary px-6 py-3.5 font-label-caps text-xs text-primary font-bold tracking-widest text-center hover:bg-primary/10 transition-all"
                >
                  CHAT ON WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Values Grid */}
        <section className="py-12 sm:py-16 bg-surface-container/50 border-y border-outline-variant/20 px-4 sm:px-margin-mobile lg:px-margin-desktop">
          <div className="container mx-auto">
            <div className="text-center max-w-lg mx-auto mb-10">
              <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.3em] font-semibold block mb-1">
                OUR PROMISE
              </span>
              <h2 className="font-headline-md text-2xl sm:text-4xl text-on-surface">
                Why Families Trust Us
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

        {/* Heritage Timeline */}
        <section className="py-12 sm:py-16 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="text-center max-w-lg mx-auto mb-10 sm:mb-12">
            <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.3em] font-semibold block mb-1">
              OUR JOURNEY
            </span>
            <h2 className="font-headline-md text-2xl sm:text-4xl text-on-surface">
              Milestones of Excellence
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

        {/* Visit Our Boutique & Contact */}
        <section className="py-12 sm:py-16 px-4 sm:px-margin-mobile lg:px-margin-desktop container mx-auto">
          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 rounded-xs flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.3em] font-semibold block mb-2">
                BOUTIQUE VISITS & APPOINTMENTS
              </span>
              <h3 className="font-headline-md text-2xl sm:text-3xl text-on-surface mb-3">
                Experience Ambika Jewels In Person
              </h3>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed font-light mb-4">
                Visit our flagship couture showroom in Roop Nagar, Jammu, or request a private virtual tour with our Senior Jewelry Specialists.
              </p>
              <div className="font-body-md text-xs text-primary font-semibold">
                📍 Roop Nagar, Jammu, Jammu & Kashmir 180013
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
